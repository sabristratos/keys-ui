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

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import { FloatingManager, FloatingInstance } from './utils/FloatingManager';

interface TooltipState {
    isVisible: boolean;
    trigger: HTMLElement | null;
    tooltip: HTMLElement;
    triggerType: 'hover' | 'click' | 'focus';
    delay: number;
    showTimer?: number;
    hideTimer?: number;
    floating?: FloatingInstance;
}


export class TooltipActions extends BaseActionClass<TooltipState> {


    /**
     * Initialize tooltip elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        // Initialize tooltips with explicit targets
        DOMUtils.querySelectorAll('[data-tooltip-target]').forEach(trigger => {
            const tooltipId = trigger.getAttribute('data-tooltip-target');
            if (tooltipId) {
                const tooltip = DOMUtils.getElementById(tooltipId);
                if (tooltip) {
                    this.initializeTooltip(trigger, tooltip);
                }
            }
        });

        // Initialize standalone tooltips
        DOMUtils.findByDataAttribute('tooltip', 'true').forEach(tooltip => {
            const target = tooltip.getAttribute('data-target');
            if (target) {
                const trigger = DOMUtils.querySelector(target);
                if (trigger) {
                    this.initializeTooltip(trigger, tooltip);
                }
            }
        });

        this.setupLivewireIntegration();
    }

    /**
     * Initialize a single tooltip
     */
    private initializeTooltip(trigger: HTMLElement, tooltip: HTMLElement): void {
        if (this.hasState(tooltip)) {
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

        this.setState(tooltip, state);
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
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Close tooltips on outside click
        EventUtils.addEventListener(document, 'click', (e) => {
            const target = e.target as Node;

            // Only process if target is an Element
            if (target && target instanceof Element) {
                this.getAllStates().forEach((state, tooltip) => {
                    if (state.triggerType === 'click' && state.isVisible) {
                        const targetElement = target as HTMLElement;
                        if (!state.trigger?.contains(targetElement) && !tooltip.contains(targetElement)) {
                            this.hideTooltip(tooltip);
                        }
                    }
                });
            }
        });

        // Close tooltips on scroll
        EventUtils.addEventListener(document, 'scroll', () => {
            this.getAllStates().forEach((state, tooltip) => {
                if (state.isVisible) {
                    this.hideTooltip(tooltip);
                }
            });
        }, { passive: true });

        // Reposition on window resize - using EventUtils
        EventUtils.handleResize(() => {
            this.getAllStates().forEach((state, tooltip) => {
                if (state.isVisible) {
                    this.positionTooltip(state.trigger!, tooltip);
                }
            });
        }, 100);
    }

    /**
     * Setup dynamic observer for new tooltips - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Initialize new tooltips with explicit targets
                    DOMUtils.querySelectorAll('[data-tooltip-target]', element).forEach(trigger => {
                        const tooltipId = trigger.getAttribute('data-tooltip-target');
                        if (tooltipId) {
                            const tooltip = DOMUtils.getElementById(tooltipId);
                            if (tooltip && !this.hasState(tooltip)) {
                                this.initializeTooltip(trigger, tooltip);
                            }
                        }
                    });

                    // Initialize standalone tooltips
                    DOMUtils.findByDataAttribute('tooltip', 'true', element).forEach(tooltip => {
                        const target = tooltip.getAttribute('data-target');
                        if (target) {
                            const trigger = DOMUtils.querySelector(target);
                            if (trigger && !this.hasState(tooltip)) {
                                this.initializeTooltip(trigger, tooltip);
                            }
                        }
                    });
                }
            });
        });
    }

    /**
     * Schedule tooltip to show with delay
     */
    private scheduleShow(tooltip: HTMLElement): void {
        const state = this.getState(tooltip);
        if (!state || tooltip.getAttribute('data-disabled') === 'true') return;

        this.cancelHide(tooltip);

        state.showTimer = window.setTimeout(() => {
            this.showTooltip(tooltip);
        }, state.delay);
    }

    /**
     * Schedule tooltip to hide with delay
     */
    private scheduleHide(tooltip: HTMLElement): void {
        const state = this.getState(tooltip);
        if (!state) return;

        this.cancelShow(tooltip);

        state.hideTimer = window.setTimeout(() => {
            this.hideTooltip(tooltip);
        }, 100); // Short delay for better UX
    }

    /**
     * Cancel scheduled show
     */
    private cancelShow(tooltip: HTMLElement): void {
        const state = this.getState(tooltip);
        if (state?.showTimer) {
            clearTimeout(state.showTimer);
            delete state.showTimer;
        }
    }

    /**
     * Cancel scheduled hide
     */
    private cancelHide(tooltip: HTMLElement): void {
        const state = this.getState(tooltip);
        if (state?.hideTimer) {
            clearTimeout(state.hideTimer);
            delete state.hideTimer;
        }
    }

    /**
     * Show tooltip
     */
    private showTooltip(tooltip: HTMLElement): void {
        const state = this.getState(tooltip);
        if (!state || state.isVisible) return;

        if (state.trigger) {
            this.positionTooltip(state.trigger, tooltip);
        }

        // Show tooltip with CSS animation
        tooltip.setAttribute('data-show', 'true');
        state.isVisible = true;
        this.dispatchTooltipEvent(tooltip, 'tooltip:show', { trigger: state.trigger });
    }

    /**
     * Hide tooltip
     */
    private hideTooltip(tooltip: HTMLElement): void {
        const state = this.getState(tooltip);
        if (!state || !state.isVisible) return;

        // Clean up floating instance
        if (state.floating) {
            state.floating.cleanup();
            state.floating = undefined;
        }

        // Hide tooltip with CSS animation
        tooltip.setAttribute('data-show', 'false');
        state.isVisible = false;
        this.dispatchTooltipEvent(tooltip, 'tooltip:hide', { trigger: state.trigger });
    }

    /**
     * Toggle tooltip visibility
     */
    private toggleTooltip(tooltip: HTMLElement): void {
        const state = this.getState(tooltip);
        if (!state) return;

        if (state.isVisible) {
            this.hideTooltip(tooltip);
        } else {
            this.showTooltip(tooltip);
        }
    }

    /**
     * Position tooltip relative to trigger using Floating UI
     */
    private positionTooltip(trigger: HTMLElement, tooltip: HTMLElement): void {
        const state = this.getState(tooltip);
        if (!state) return;

        // Always use Floating UI
        this.setupFloating(trigger, tooltip);
    }

    /**
     * Setup floating for tooltip using Floating UI
     */
    private setupFloating(trigger: HTMLElement, tooltip: HTMLElement): void {
        const state = this.getState(tooltip);
        if (!state) return;

        // Clean up existing floating instance
        if (state.floating) {
            state.floating.cleanup();
        }

        const placement = tooltip.getAttribute('data-placement') || 'top';
        const arrow = DOMUtils.querySelector('[data-tooltip-arrow]', tooltip);

        // Create floating element with enhanced Floating UI features
        const floating = FloatingManager.getInstance().createFloating(trigger, tooltip, {
            placement: placement as any,
            offset: 8,
            flip: {
                fallbackStrategy: 'bestFit',
                padding: 8
            },
            shift: {
                padding: 8,
                crossAxis: true
            },
            arrow: arrow || undefined,
            hide: {
                strategy: 'referenceHidden'
            },
            autoUpdate: {
                ancestorScroll: true,
                ancestorResize: true,
                elementResize: true,
                layoutShift: true
            }
        });

        state.floating = floating;
    }


    /**
     * Dispatch tooltip events
     */
    private dispatchTooltipEvent(tooltip: HTMLElement, eventName: string, detail: any = {}): void {
        EventUtils.dispatchCustomEvent(tooltip, eventName, {
            tooltip,
            ...detail
        }, {
            bubbles: true,
            cancelable: true
        });
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
        this.clearAllStates();
        this.initializeElements();
    }

    /**
     * Public API: Show tooltip programmatically
     */
    public show(tooltipId: string): boolean {
        const tooltip = DOMUtils.getElementById(tooltipId);
        if (tooltip && this.hasState(tooltip)) {
            this.showTooltip(tooltip);
            return true;
        }
        return false;
    }

    /**
     * Public API: Hide tooltip programmatically
     */
    public hide(tooltipId: string): boolean {
        const tooltip = DOMUtils.getElementById(tooltipId);
        if (tooltip && this.hasState(tooltip)) {
            this.hideTooltip(tooltip);
            return true;
        }
        return false;
    }

    /**
     * Public API: Toggle tooltip programmatically
     */
    public toggle(tooltipId: string): boolean {
        const tooltip = DOMUtils.getElementById(tooltipId);
        if (tooltip && this.hasState(tooltip)) {
            this.toggleTooltip(tooltip);
            return true;
        }
        return false;
    }

    /**
     * Public API: Destroy tooltip instance
     */
    public destroyTooltip(tooltipId: string): boolean {
        const tooltip = DOMUtils.getElementById(tooltipId);
        if (tooltip && this.hasState(tooltip)) {
            this.hideTooltip(tooltip);
            this.removeState(tooltip);
            return true;
        }
        return false;
    }

    /**
     * Clean up TooltipActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // Clean up all floating instances
        this.getAllStates().forEach((state, tooltip) => {
            if (state.floating) {
                state.floating.cleanup();
            }
        });
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