/**
 * TooltipActions - Handles interactive functionality for Tooltip components
 *
 * Provides functionality for:
 * - Smart tooltip positioning with collision detection
 * - Multiple trigger types (hover, click, focus)
 * - Configurable delays and animations
 * - Keyboard accessibility (ESC to close)
 * - Livewire compatibility
 */

interface TooltipState {
    isVisible: boolean;
    trigger: HTMLElement | null;
    tooltip: HTMLElement;
    triggerType: 'hover' | 'click' | 'focus';
    delay: number;
    showTimeout?: number;
    hideTimeout?: number;
}

interface TooltipPosition {
    top: number;
    left: number;
    placement: 'top' | 'bottom' | 'left' | 'right';
}

export class TooltipActions {
    private static instance: TooltipActions | null = null;
    private initialized = false;
    private tooltipStates = new Map<HTMLElement, TooltipState>();

    /**
     * Get singleton instance
     */
    public static getInstance(): TooltipActions {
        if (!TooltipActions.instance) {
            TooltipActions.instance = new TooltipActions();
        }
        return TooltipActions.instance;
    }

    /**
     * Initialize TooltipActions for all tooltip elements
     */
    public init(): void {
        if (this.initialized) {
            return;
        }

        this.initializeTooltips();
        this.bindGlobalEvents();
        this.setupLivewireIntegration();
        this.initialized = true;
    }

    /**
     * Initialize all tooltips on the page
     */
    private initializeTooltips(): void {
        // Initialize tooltips with explicit targets
        document.querySelectorAll('[data-tooltip-target]').forEach(trigger => {
            const tooltipId = trigger.getAttribute('data-tooltip-target');
            if (tooltipId) {
                const tooltip = document.getElementById(tooltipId);
                if (tooltip) {
                    this.initializeTooltip(trigger as HTMLElement, tooltip as HTMLElement);
                }
            }
        });

        // Initialize standalone tooltips
        document.querySelectorAll('[data-tooltip="true"]').forEach(tooltip => {
            const target = tooltip.getAttribute('data-target');
            if (target) {
                const trigger = document.querySelector(target);
                if (trigger) {
                    this.initializeTooltip(trigger as HTMLElement, tooltip as HTMLElement);
                }
            }
        });
    }

    /**
     * Initialize a single tooltip
     */
    private initializeTooltip(trigger: HTMLElement, tooltip: HTMLElement): void {
        if (this.tooltipStates.has(tooltip)) {
            return;
        }

        const triggerType = (trigger.getAttribute('data-tooltip-trigger') ||
                           tooltip.getAttribute('data-trigger') || 'hover') as 'hover' | 'click' | 'focus';

        const delay = parseInt(trigger.getAttribute('data-tooltip-delay') ||
                              tooltip.getAttribute('data-delay') || '100');

        const state: TooltipState = {
            isVisible: false,
            trigger,
            tooltip,
            triggerType,
            delay
        };

        this.tooltipStates.set(tooltip, state);
        this.bindTooltipEvents(trigger, tooltip, state);

        // Set initial state
        this.hideTooltip(tooltip);
    }

    /**
     * Bind events for a specific tooltip
     */
    private bindTooltipEvents(trigger: HTMLElement, tooltip: HTMLElement, state: TooltipState): void {
        switch (state.triggerType) {
            case 'hover':
                trigger.addEventListener('mouseenter', () => this.scheduleShow(tooltip));
                trigger.addEventListener('mouseleave', () => this.scheduleHide(tooltip));
                tooltip.addEventListener('mouseenter', () => this.cancelHide(tooltip));
                tooltip.addEventListener('mouseleave', () => this.scheduleHide(tooltip));
                break;

            case 'click':
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleTooltip(tooltip);
                });
                break;

            case 'focus':
                trigger.addEventListener('focus', () => this.scheduleShow(tooltip));
                trigger.addEventListener('blur', () => this.scheduleHide(tooltip));
                break;
        }

        // Keyboard accessibility
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isVisible) {
                this.hideTooltip(tooltip);
            }
        });
    }

    /**
     * Bind global events
     */
    private bindGlobalEvents(): void {
        // Close tooltips on outside click
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            this.tooltipStates.forEach((state, tooltip) => {
                if (state.triggerType === 'click' && state.isVisible) {
                    if (!state.trigger?.contains(target) && !tooltip.contains(target)) {
                        this.hideTooltip(tooltip);
                    }
                }
            });
        });

        // Close tooltips on scroll
        document.addEventListener('scroll', () => {
            this.tooltipStates.forEach((state, tooltip) => {
                if (state.isVisible) {
                    this.hideTooltip(tooltip);
                }
            });
        }, { passive: true });

        // Reposition on window resize
        window.addEventListener('resize', () => {
            this.tooltipStates.forEach((state, tooltip) => {
                if (state.isVisible) {
                    this.positionTooltip(state.trigger!, tooltip);
                }
            });
        });

        // Dynamic tooltip initialization observer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;

                        // Initialize new tooltips
                        element.querySelectorAll('[data-tooltip="true"], [data-tooltip-target]').forEach(el => {
                            if (el.hasAttribute('data-tooltip-target')) {
                                const tooltipId = el.getAttribute('data-tooltip-target');
                                if (tooltipId) {
                                    const tooltip = document.getElementById(tooltipId);
                                    if (tooltip) {
                                        this.initializeTooltip(el as HTMLElement, tooltip as HTMLElement);
                                    }
                                }
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * Schedule tooltip to show with delay
     */
    private scheduleShow(tooltip: HTMLElement): void {
        const state = this.tooltipStates.get(tooltip);
        if (!state || tooltip.getAttribute('data-disabled') === 'true') return;

        this.cancelHide(tooltip);

        state.showTimeout = window.setTimeout(() => {
            this.showTooltip(tooltip);
        }, state.delay);
    }

    /**
     * Schedule tooltip to hide with delay
     */
    private scheduleHide(tooltip: HTMLElement): void {
        const state = this.tooltipStates.get(tooltip);
        if (!state) return;

        this.cancelShow(tooltip);

        state.hideTimeout = window.setTimeout(() => {
            this.hideTooltip(tooltip);
        }, 100); // Short delay for better UX
    }

    /**
     * Cancel scheduled show
     */
    private cancelShow(tooltip: HTMLElement): void {
        const state = this.tooltipStates.get(tooltip);
        if (state?.showTimeout) {
            clearTimeout(state.showTimeout);
            delete state.showTimeout;
        }
    }

    /**
     * Cancel scheduled hide
     */
    private cancelHide(tooltip: HTMLElement): void {
        const state = this.tooltipStates.get(tooltip);
        if (state?.hideTimeout) {
            clearTimeout(state.hideTimeout);
            delete state.hideTimeout;
        }
    }

    /**
     * Show tooltip
     */
    private showTooltip(tooltip: HTMLElement): void {
        const state = this.tooltipStates.get(tooltip);
        if (!state || state.isVisible) return;

        if (state.trigger) {
            this.positionTooltip(state.trigger, tooltip);
        }

        tooltip.setAttribute('data-show', 'true');
        state.isVisible = true;

        this.dispatchTooltipEvent(tooltip, 'tooltip:show', { trigger: state.trigger });
    }

    /**
     * Hide tooltip
     */
    private hideTooltip(tooltip: HTMLElement): void {
        const state = this.tooltipStates.get(tooltip);
        if (!state || !state.isVisible) return;

        tooltip.setAttribute('data-show', 'false');
        state.isVisible = false;

        this.dispatchTooltipEvent(tooltip, 'tooltip:hide', { trigger: state.trigger });
    }

    /**
     * Toggle tooltip visibility
     */
    private toggleTooltip(tooltip: HTMLElement): void {
        const state = this.tooltipStates.get(tooltip);
        if (!state) return;

        if (state.isVisible) {
            this.hideTooltip(tooltip);
        } else {
            this.showTooltip(tooltip);
        }
    }

    /**
     * Position tooltip relative to trigger
     */
    private positionTooltip(trigger: HTMLElement, tooltip: HTMLElement): void {
        const triggerRect = trigger.getBoundingClientRect();

        // Temporarily show tooltip to get accurate dimensions
        const originalVisibility = tooltip.style.visibility;
        const originalOpacity = tooltip.style.opacity;
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '1';
        tooltip.style.position = 'fixed';
        tooltip.style.top = '-9999px';
        tooltip.style.left = '-9999px';

        const tooltipRect = tooltip.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Restore original state
        tooltip.style.visibility = originalVisibility;
        tooltip.style.opacity = originalOpacity;

        const preferredPlacement = tooltip.getAttribute('data-placement') as 'top' | 'bottom' | 'left' | 'right' || 'top';
        const position = this.calculateOptimalPosition(triggerRect, tooltipRect, viewport, preferredPlacement);

        tooltip.style.position = 'fixed';
        tooltip.style.top = `${position.top}px`;
        tooltip.style.left = `${position.left}px`;
        tooltip.setAttribute('data-placement', position.placement);
    }

    /**
     * Calculate optimal tooltip position with collision detection
     */
    private calculateOptimalPosition(
        triggerRect: DOMRect,
        tooltipRect: DOMRect,
        viewport: { width: number; height: number },
        preferredPlacement: 'top' | 'bottom' | 'left' | 'right'
    ): TooltipPosition {
        const gap = 8; // Distance between trigger and tooltip

        const positions = {
            top: {
                top: triggerRect.top - tooltipRect.height - gap,
                left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
                placement: 'top' as const
            },
            bottom: {
                top: triggerRect.bottom + gap,
                left: triggerRect.left + (triggerRect.width - tooltipRect.width) / 2,
                placement: 'bottom' as const
            },
            left: {
                top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
                left: triggerRect.left - tooltipRect.width - gap,
                placement: 'left' as const
            },
            right: {
                top: triggerRect.top + (triggerRect.height - tooltipRect.height) / 2,
                left: triggerRect.right + gap,
                placement: 'right' as const
            }
        };

        // Check if preferred position fits
        const preferred = positions[preferredPlacement];
        if (this.positionFitsInViewport(preferred, tooltipRect, viewport)) {
            return preferred;
        }

        // Try alternative positions
        const alternatives = Object.values(positions).filter(pos => pos.placement !== preferredPlacement);
        for (const position of alternatives) {
            if (this.positionFitsInViewport(position, tooltipRect, viewport)) {
                return position;
            }
        }

        // Fallback: use preferred position with constraints
        return {
            top: Math.max(gap, Math.min(preferred.top, viewport.height - tooltipRect.height - gap)),
            left: Math.max(gap, Math.min(preferred.left, viewport.width - tooltipRect.width - gap)),
            placement: preferred.placement
        };
    }

    /**
     * Check if position fits in viewport
     */
    private positionFitsInViewport(
        position: { top: number; left: number },
        tooltipRect: DOMRect,
        viewport: { width: number; height: number }
    ): boolean {
        return position.top >= 0 &&
               position.left >= 0 &&
               position.top + tooltipRect.height <= viewport.height &&
               position.left + tooltipRect.width <= viewport.width;
    }

    /**
     * Dispatch tooltip events
     */
    private dispatchTooltipEvent(tooltip: HTMLElement, eventName: string, detail: any = {}): void {
        const event = new CustomEvent(eventName, {
            detail: { tooltip, ...detail },
            bubbles: true,
            cancelable: true
        });
        tooltip.dispatchEvent(event);
    }

    /**
     * Setup Livewire integration
     */
    private setupLivewireIntegration(): void {
        if (typeof window.Livewire === 'undefined') return;

        // Reinitialize tooltips after Livewire navigation
        document.addEventListener('livewire:navigated', () => {
            this.reinitialize();
        });
    }

    /**
     * Reinitialize tooltips (useful after dynamic content changes)
     */
    private reinitialize(): void {
        this.tooltipStates.clear();
        this.initializeTooltips();
    }

    /**
     * Public API: Show tooltip programmatically
     */
    public show(tooltipId: string): boolean {
        const tooltip = document.getElementById(tooltipId);
        if (tooltip && this.tooltipStates.has(tooltip)) {
            this.showTooltip(tooltip);
            return true;
        }
        return false;
    }

    /**
     * Public API: Hide tooltip programmatically
     */
    public hide(tooltipId: string): boolean {
        const tooltip = document.getElementById(tooltipId);
        if (tooltip && this.tooltipStates.has(tooltip)) {
            this.hideTooltip(tooltip);
            return true;
        }
        return false;
    }

    /**
     * Public API: Toggle tooltip programmatically
     */
    public toggle(tooltipId: string): boolean {
        const tooltip = document.getElementById(tooltipId);
        if (tooltip && this.tooltipStates.has(tooltip)) {
            this.toggleTooltip(tooltip);
            return true;
        }
        return false;
    }

    /**
     * Public API: Destroy tooltip instance
     */
    public destroy(tooltipId: string): boolean {
        const tooltip = document.getElementById(tooltipId);
        if (tooltip && this.tooltipStates.has(tooltip)) {
            this.hideTooltip(tooltip);
            this.tooltipStates.delete(tooltip);
            return true;
        }
        return false;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        TooltipActions.getInstance().init();
    });
} else {
    TooltipActions.getInstance().init();
}

// Export for global access
(window as any).TooltipActions = TooltipActions;

declare global {
    interface Window {
        TooltipActions: typeof TooltipActions;
    }
}

export default TooltipActions.getInstance();