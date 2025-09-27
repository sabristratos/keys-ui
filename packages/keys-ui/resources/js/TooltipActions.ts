/**
 * TooltipActions - Pure JavaScript Tooltip System
 *
 * A flexible, performant tooltip system that works with any HTML element
 * using data attributes. No wrapper elements, no styling interference.
 *
 * Features:
 * - Data attribute driven (data-tooltip="content")
 * - All trigger types: hover, click, focus, manual
 * - Smart positioning with Floating UI
 * - Rich content support via templates
 * - Progressive enhancement (title fallback)
 * - Livewire compatible
 * - Touch/mobile friendly
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import { FloatingManager, FloatingInstance } from './utils/FloatingManager';

interface TooltipState {
    element: HTMLElement;
    tooltip: HTMLElement;
    content: string | HTMLElement;
    trigger: 'hover' | 'click' | 'focus' | 'manual';
    placement: string;
    color: string;
    size: string;
    delay: number;
    isVisible: boolean;
    showTimer?: number;
    hideTimer?: number;
    floating?: FloatingInstance;
    hasArrow: boolean;
    isDisabled: boolean;
}

export class TooltipActions extends BaseActionClass<TooltipState> {

    private tooltipContainer: HTMLElement | null = null;
    private templateRetryTimeouts: Map<HTMLElement, number[]> = new Map();

    /**
     * Initialize tooltip system
     */
    protected initializeElements(): void {
        this.createTooltipContainer();
        this.scanForTooltips();
        this.setupLivewireIntegration();
    }

    /**
     * Create container for tooltip elements
     */
    private createTooltipContainer(): void {
        if (!this.tooltipContainer) {
            this.tooltipContainer = document.createElement('div');
            this.tooltipContainer.id = 'keys-tooltip-container';
            this.tooltipContainer.className = 'keys-tooltip-container fixed inset-0 pointer-events-none z-[9999]';
            document.body.appendChild(this.tooltipContainer);
        }
    }

    /**
     * Scan DOM for tooltip elements
     */
    private scanForTooltips(): void {
        // Find all elements with data-tooltip attribute
        const elements = DOMUtils.querySelectorAll('[data-tooltip]');

        elements.forEach(element => {
            if (!this.hasState(element)) {
                this.initializeTooltip(element);
            }
        });
    }

    /**
     * Initialize a single tooltip element
     */
    private initializeTooltip(element: HTMLElement): void {
        const tooltipContent = element.getAttribute('data-tooltip');
        if (!tooltipContent || element.getAttribute('data-tooltip-disabled') === 'true') {
            return;
        }

        // Parse configuration from data attributes
        const trigger = (element.getAttribute('data-tooltip-trigger') || 'hover') as 'hover' | 'click' | 'focus' | 'manual';
        const placement = element.getAttribute('data-tooltip-placement') || 'top';
        const color = element.getAttribute('data-tooltip-color') || 'dark';
        const size = element.getAttribute('data-tooltip-size') || 'md';
        const delay = parseInt(element.getAttribute('data-tooltip-delay') || '100');
        const hasArrow = element.getAttribute('data-tooltip-arrow') === 'true';

        // Get processed content first
        const processedContent = this.getTooltipContent(element, tooltipContent);

        // Create tooltip element with processed content
        const tooltip = this.createTooltipElement(element, processedContent, color, size, hasArrow);

        // Create state
        const state: TooltipState = {
            element,
            tooltip,
            content: processedContent,
            trigger,
            placement,
            color,
            size,
            delay,
            isVisible: false,
            hasArrow,
            isDisabled: false
        };

        this.setState(element, state);
        this.bindTooltipEvents(element, state);

        // Add accessibility attributes
        element.setAttribute('aria-describedby', tooltip.id);
    }

    /**
     * Get tooltip content (text or from template)
     */
    private getTooltipContent(element: HTMLElement, tooltipAttr: string): string | HTMLElement {
        if (tooltipAttr === 'template') {
            const templateId = element.getAttribute('data-tooltip-template-id');
            if (templateId) {
                // Try multiple approaches to find the template
                const template = this.findTemplate(templateId);
                if (template && template.content && template.content.childNodes.length > 0) {
                    return template.content.cloneNode(true) as HTMLElement;
                } else {
                    // Template not found, schedule a retry and return placeholder
                    this.scheduleTemplateRetry(element, templateId);
                    return 'Loading rich content...';
                }
            } else {
                // No template ID specified
                return 'Template ID missing';
            }
        }
        return tooltipAttr;
    }

    /**
     * Try multiple methods to find a template element
     */
    private findTemplate(templateId: string): HTMLTemplateElement | null {
        // Method 1: Direct getElementById
        let template = DOMUtils.getElementById(templateId) as HTMLTemplateElement;
        if (template && template.tagName === 'TEMPLATE') {
            return template;
        }

        // Method 2: Query selector as fallback
        try {
            template = document.querySelector(`template[id="${templateId}"]`) as HTMLTemplateElement;
            if (template && template.tagName === 'TEMPLATE') {
                return template;
            }
        } catch (e) {
            // Silently handle template query errors
        }

        // Method 3: Search in all templates
        const allTemplates = document.querySelectorAll('template[data-tooltip-template="true"]');
        for (const tmpl of allTemplates) {
            if (tmpl.id === templateId) {
                return tmpl as HTMLTemplateElement;
            }
        }

        return null;
    }

    /**
     * Schedule a retry to find template content
     */
    private scheduleTemplateRetry(element: HTMLElement, templateId: string): void {
        // Initialize timeout array for this element if not exists
        if (!this.templateRetryTimeouts.has(element)) {
            this.templateRetryTimeouts.set(element, []);
        }

        const timeouts = this.templateRetryTimeouts.get(element)!;

        // Try again after a short delay
        const firstTimeout = window.setTimeout(() => {
            const template = this.findTemplate(templateId);
            if (template && template.content && template.content.childNodes.length > 0) {
                const content = template.content.cloneNode(true) as HTMLElement;
                this.updateTooltipContent(element, content);
                this.clearTemplateRetryTimeouts(element);
            } else {
                // Try one more time with a longer delay
                const secondTimeout = window.setTimeout(() => {
                    const finalTemplate = this.findTemplate(templateId);
                    if (finalTemplate && finalTemplate.content && finalTemplate.content.childNodes.length > 0) {
                        const content = finalTemplate.content.cloneNode(true) as HTMLElement;
                        this.updateTooltipContent(element, content);
                    } else {
                        this.updateTooltipContent(element, 'Rich content unavailable');
                    }
                    this.clearTemplateRetryTimeouts(element);
                }, 200);

                timeouts.push(secondTimeout);
            }
        }, 100);

        timeouts.push(firstTimeout);
    }

    /**
     * Clear template retry timeouts for an element
     */
    private clearTemplateRetryTimeouts(element: HTMLElement): void {
        const timeouts = this.templateRetryTimeouts.get(element);
        if (timeouts) {
            timeouts.forEach(timeout => clearTimeout(timeout));
            this.templateRetryTimeouts.delete(element);
        }
    }

    /**
     * Update the content of an existing tooltip
     */
    private updateTooltipContent(element: HTMLElement, newContent: string | HTMLElement): void {
        const state = this.getState(element);
        if (state) {
            // Update the state
            state.content = newContent;

            // Update the tooltip DOM
            const contentWrapper = DOMUtils.querySelector('.tooltip-content-wrapper', state.tooltip);
            if (contentWrapper) {
                contentWrapper.innerHTML = '';
                if (typeof newContent === 'string') {
                    contentWrapper.textContent = newContent;
                } else {
                    contentWrapper.appendChild(newContent);
                }
            }
        }
    }


    /**
     * Create tooltip DOM element
     */
    private createTooltipElement(trigger: HTMLElement, content: string | HTMLElement, color: string, size: string, hasArrow: boolean): HTMLElement {
        const tooltipId = `tooltip-${trigger.getAttribute('data-tooltip-id') || Date.now()}`;

        const tooltip = document.createElement('div');
        tooltip.id = tooltipId;
        tooltip.className = this.getTooltipClasses(color, size);
        tooltip.setAttribute('role', 'tooltip');
        tooltip.setAttribute('data-keys-tooltip-element', 'true');
        tooltip.setAttribute('data-tooltip-placement', trigger.getAttribute('data-tooltip-placement') || 'top');
        tooltip.setAttribute('data-tooltip-color', color);

        // Add arrow if requested
        if (hasArrow) {
            const arrow = document.createElement('div');
            arrow.className = this.getArrowClasses(color);
            arrow.setAttribute('data-tooltip-arrow', 'true');
            tooltip.appendChild(arrow);
        }

        // Add content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'tooltip-content-wrapper';

        if (typeof content === 'string') {
            contentWrapper.textContent = content;
        } else {
            contentWrapper.appendChild(content);
        }

        tooltip.appendChild(contentWrapper);

        // Initially hidden but positioned for smooth appearance
        tooltip.style.display = 'none';
        tooltip.style.position = 'absolute';
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'scale(0.95)';

        this.tooltipContainer?.appendChild(tooltip);
        return tooltip;
    }

    /**
     * Get tooltip CSS classes using existing CSS infrastructure
     */
    private getTooltipClasses(color: string, size: string): string {
        // Use existing .tooltip-content class from components.css
        const baseClasses = 'tooltip-content transition-all duration-200 pointer-events-none';

        const sizeClasses = {
            'sm': 'px-2 py-1 text-xs',
            'md': 'px-3 py-2 text-sm',
            'lg': 'px-4 py-3 text-base'
        }[size] || 'px-3 py-2 text-sm';

        const colorClasses = {
            'dark': 'bg-neutral-900 text-white border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600',
            'light': 'bg-surface text-foreground border border-border'
        }[color] || 'bg-neutral-900 text-white border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600';

        return `${baseClasses} ${sizeClasses} ${colorClasses}`;
    }

    /**
     * Get arrow CSS classes with placement-aware borders
     */
    private getArrowClasses(color: string): string {
        const baseClasses = 'tooltip-arrow absolute w-2 h-2 rotate-45 -z-10';

        const colorClasses = {
            'dark': 'bg-neutral-900 dark:bg-neutral-800',
            'light': 'bg-surface'
        }[color] || 'bg-neutral-900 dark:bg-neutral-800';

        // Border classes will be applied dynamically based on placement
        return `${baseClasses} ${colorClasses}`;
    }

    /**
     * Bind events for tooltip
     */
    private bindTooltipEvents(element: HTMLElement, state: TooltipState): void {
        switch (state.trigger) {
            case 'hover':
                element.addEventListener('mouseenter', () => this.scheduleShow(element));
                element.addEventListener('mouseleave', () => this.scheduleHide(element));
                // Allow hovering over tooltip itself
                state.tooltip.addEventListener('mouseenter', () => this.cancelHide(element));
                state.tooltip.addEventListener('mouseleave', () => this.scheduleHide(element));
                break;

            case 'click':
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleTooltip(element);
                });
                break;

            case 'focus':
                element.addEventListener('focus', () => this.scheduleShow(element));
                element.addEventListener('blur', () => this.scheduleHide(element));
                break;
        }

        // Keyboard accessibility
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isVisible) {
                this.hideTooltip(element);
            }
        });
    }

    /**
     * Bind global event listeners
     */
    protected bindEventListeners(): void {
        // Close click-triggered tooltips on outside click
        EventUtils.addEventListener(document, 'click', (e) => {
            const target = e.target as Element;
            if (target) {
                this.getAllStates().forEach((state, element) => {
                    if (state.trigger === 'click' && state.isVisible) {
                        if (!element.contains(target) && !state.tooltip.contains(target)) {
                            this.hideTooltip(element);
                        }
                    }
                });
            }
        });

        // Hide tooltips on scroll
        EventUtils.addEventListener(document, 'scroll', () => {
            this.getAllStates().forEach((state, element) => {
                if (state.isVisible) {
                    this.hideTooltip(element);
                }
            });
        }, { passive: true });

        // Reposition on window resize
        EventUtils.handleResize(() => {
            this.getAllStates().forEach((state, element) => {
                if (state.isVisible) {
                    this.positionTooltip(element);
                }
            });
        }, 100);
    }

    /**
     * Setup dynamic observer for new elements
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Check if the added element has tooltip
                    if (element.hasAttribute('data-tooltip')) {
                        this.initializeTooltip(element);
                    }

                    // Check children for tooltips
                    DOMUtils.querySelectorAll('[data-tooltip]', element).forEach(tooltipElement => {
                        if (!this.hasState(tooltipElement)) {
                            this.initializeTooltip(tooltipElement);
                        }
                    });
                }
            });
        });
    }

    /**
     * Schedule tooltip show with delay
     */
    private scheduleShow(element: HTMLElement): void {
        const state = this.getState(element);
        if (!state || state.isDisabled) return;

        this.cancelHide(element);

        state.showTimer = window.setTimeout(() => {
            this.showTooltip(element);
        }, state.delay);
    }

    /**
     * Schedule tooltip hide with delay
     */
    private scheduleHide(element: HTMLElement): void {
        const state = this.getState(element);
        if (!state) return;

        this.cancelShow(element);

        state.hideTimer = window.setTimeout(() => {
            this.hideTooltip(element);
        }, 100); // Short delay for better UX
    }

    /**
     * Cancel scheduled show
     */
    private cancelShow(element: HTMLElement): void {
        const state = this.getState(element);
        if (state?.showTimer) {
            clearTimeout(state.showTimer);
            delete state.showTimer;
        }
    }

    /**
     * Cancel scheduled hide
     */
    private cancelHide(element: HTMLElement): void {
        const state = this.getState(element);
        if (state?.hideTimer) {
            clearTimeout(state.hideTimer);
            delete state.hideTimer;
        }
    }

    /**
     * Show tooltip
     */
    private showTooltip(element: HTMLElement): void {
        const state = this.getState(element);
        if (!state || state.isVisible) return;

        // Hide other visible tooltips
        this.hideAllTooltips();

        // Position tooltip first, then make it visible
        state.tooltip.style.display = 'block';
        this.positionTooltip(element);
        state.isVisible = true;

        // Trigger show animation from positioned location
        requestAnimationFrame(() => {
            state.tooltip.style.opacity = '1';
            state.tooltip.style.transform = 'scale(1)';
        });

        this.dispatchTooltipEvent(element, 'tooltip:show');
    }

    /**
     * Hide tooltip
     */
    private hideTooltip(element: HTMLElement): void {
        const state = this.getState(element);
        if (!state || !state.isVisible) return;

        // Clean up floating instance
        if (state.floating) {
            state.floating.cleanup();
            state.floating = undefined;
        }

        state.tooltip.style.opacity = '0';
        state.tooltip.style.transform = 'scale(0.95)';

        setTimeout(() => {
            state.tooltip.style.display = 'none';
        }, 200);

        state.isVisible = false;
        this.dispatchTooltipEvent(element, 'tooltip:hide');
    }

    /**
     * Toggle tooltip visibility
     */
    private toggleTooltip(element: HTMLElement): void {
        const state = this.getState(element);
        if (!state) return;

        if (state.isVisible) {
            this.hideTooltip(element);
        } else {
            this.showTooltip(element);
        }
    }

    /**
     * Hide all visible tooltips
     */
    private hideAllTooltips(): void {
        this.getAllStates().forEach((state, element) => {
            if (state.isVisible) {
                this.hideTooltip(element);
            }
        });
    }

    /**
     * Position tooltip using Floating UI
     */
    private positionTooltip(element: HTMLElement): void {
        const state = this.getState(element);
        if (!state) return;

        // Clean up existing floating instance
        if (state.floating) {
            state.floating.cleanup();
        }

        const arrow = state.hasArrow ? DOMUtils.querySelector('[data-tooltip-arrow]', state.tooltip) : undefined;

        // Create floating element with Floating UI
        const floating = FloatingManager.getInstance().createFloating(element, state.tooltip, {
            placement: state.placement as any,
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
    private dispatchTooltipEvent(element: HTMLElement, eventName: string, detail: any = {}): void {
        EventUtils.dispatchCustomEvent(element, eventName, {
            element,
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

        // Reinitialize after Livewire navigation
        document.addEventListener('livewire:navigated', () => {
            this.reinitialize();
        });

        // Handle dynamic content updates
        document.addEventListener('livewire:updated', () => {
            this.scanForTooltips();
        });
    }

    /**
     * Reinitialize tooltip system
     */
    private reinitialize(): void {
        this.hideAllTooltips();
        this.clearAllStates();
        this.scanForTooltips();
    }

    /**
     * Public API: Show tooltip programmatically
     */
    public show(elementOrSelector: HTMLElement | string): boolean {
        const element = typeof elementOrSelector === 'string'
            ? DOMUtils.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element && this.hasState(element)) {
            this.showTooltip(element);
            return true;
        }
        return false;
    }

    /**
     * Public API: Hide tooltip programmatically
     */
    public hide(elementOrSelector: HTMLElement | string): boolean {
        const element = typeof elementOrSelector === 'string'
            ? DOMUtils.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element && this.hasState(element)) {
            this.hideTooltip(element);
            return true;
        }
        return false;
    }

    /**
     * Public API: Toggle tooltip programmatically
     */
    public toggle(elementOrSelector: HTMLElement | string): boolean {
        const element = typeof elementOrSelector === 'string'
            ? DOMUtils.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element && this.hasState(element)) {
            this.toggleTooltip(element);
            return true;
        }
        return false;
    }

    /**
     * Public API: Update tooltip content
     */
    public updateContent(elementOrSelector: HTMLElement | string, newContent: string | HTMLElement): boolean {
        const element = typeof elementOrSelector === 'string'
            ? DOMUtils.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element && this.hasState(element)) {
            const state = this.getState(element);
            if (state) {
                // Use the existing updateTooltipContent method for consistency
                this.updateTooltipContent(element, newContent);

                // Update element attributes only for string content
                if (typeof newContent === 'string') {
                    element.setAttribute('data-tooltip', newContent);
                    element.setAttribute('title', newContent);
                } else {
                    // For HTMLElement content, set template mode
                    element.setAttribute('data-tooltip', 'template');
                    element.removeAttribute('title');
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Public API: Enable/disable tooltip
     */
    public setEnabled(elementOrSelector: HTMLElement | string, enabled: boolean): boolean {
        const element = typeof elementOrSelector === 'string'
            ? DOMUtils.querySelector(elementOrSelector)
            : elementOrSelector;

        if (element && this.hasState(element)) {
            const state = this.getState(element);
            if (state) {
                state.isDisabled = !enabled;
                element.setAttribute('data-tooltip-disabled', enabled ? 'false' : 'true');
                if (!enabled && state.isVisible) {
                    this.hideTooltip(element);
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Clean up tooltip system
     */
    protected onDestroy(): void {
        // Clean up all floating instances
        this.getAllStates().forEach((state) => {
            if (state.floating) {
                state.floating.cleanup();
            }
        });

        // Clean up all template retry timeouts
        this.templateRetryTimeouts.forEach((timeouts, element) => {
            timeouts.forEach(timeout => clearTimeout(timeout));
        });
        this.templateRetryTimeouts.clear();

        // Remove tooltip container
        if (this.tooltipContainer) {
            this.tooltipContainer.remove();
            this.tooltipContainer = null;
        }
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