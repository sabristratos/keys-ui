/**
 * PopoverActions - Handles interactive functionality for Popover components
 *
 * Provides functionality for:
 * - Popover open/close with keyboard navigation
 * - Multiple trigger types (click, hover, focus, manual)
 * - Smart positioning with FloatingManager
 * - Click outside to close and accessibility
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import { FloatingManager, FloatingInstance } from './utils/FloatingManager';

interface PopoverState {
    isOpen: boolean;
    trigger: string;
    showTimeout?: number;
    hideTimeout?: number;
    floating?: FloatingInstance;
}

export class PopoverActions extends BaseActionClass<PopoverState> {

    /**
     * Initialize popover elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.findByDataAttribute('popover', 'true').forEach(popover => {
            this.initializePopover(popover);
        });
    }

    /**
     * Initialize a single popover element
     */
    private initializePopover(popoverElement: HTMLElement): void {
        const trigger = popoverElement.dataset.trigger || 'click';

        const state: PopoverState = {
            isOpen: false,
            trigger
        };

        this.setState(popoverElement, state);
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Handle trigger clicks
        EventUtils.handleDelegatedClick('[data-popover-trigger]', (element, event) => {
            event.preventDefault();
            event.stopPropagation();
            const popover = DOMUtils.findClosest(element, '[data-popover="true"]');
            if (popover && !this.isDisabled(popover)) {
                const state = this.getState(popover);
                if (state?.trigger === 'click') {
                    this.togglePopover(popover);
                }
            }
        });

        // Handle hover events
        EventUtils.addEventListener(document, 'mouseenter', (event) => {
            const trigger = DOMUtils.findClosest(event.target as Element, '[data-popover-trigger]') as HTMLElement;
            if (trigger) {
                const popover = DOMUtils.findClosest(trigger, '[data-popover="true"]');
                if (popover && !this.isDisabled(popover)) {
                    const state = this.getState(popover);
                    if (state?.trigger === 'hover') {
                        this.showPopover(popover);
                    }
                }
            }
        }, { capture: true });

        EventUtils.addEventListener(document, 'mouseleave', (event) => {
            const trigger = DOMUtils.findClosest(event.target as Element, '[data-popover-trigger]') as HTMLElement;
            if (trigger) {
                const popover = DOMUtils.findClosest(trigger, '[data-popover="true"]');
                if (popover && !this.isDisabled(popover)) {
                    const state = this.getState(popover);
                    if (state?.trigger === 'hover') {
                        this.hidePopover(popover);
                    }
                }
            }
        }, { capture: true });

        // Handle focus events
        EventUtils.addEventListener(document, 'focus', (event) => {
            const trigger = DOMUtils.findClosest(event.target as Element, '[data-popover-trigger]') as HTMLElement;
            if (trigger) {
                const popover = DOMUtils.findClosest(trigger, '[data-popover="true"]');
                if (popover && !this.isDisabled(popover)) {
                    const state = this.getState(popover);
                    if (state?.trigger === 'focus') {
                        this.showPopover(popover);
                    }
                }
            }
        }, { capture: true });

        EventUtils.addEventListener(document, 'blur', (event) => {
            const trigger = DOMUtils.findClosest(event.target as Element, '[data-popover-trigger]') as HTMLElement;
            if (trigger) {
                const popover = DOMUtils.findClosest(trigger, '[data-popover="true"]');
                if (popover && !this.isDisabled(popover)) {
                    const state = this.getState(popover);
                    if (state?.trigger === 'focus') {
                        this.hidePopover(popover);
                    }
                }
            }
        }, { capture: true });

        // Handle click outside to close
        EventUtils.addEventListener(document, 'click', (event) => {
            const target = event.target as Node;

            if (target && target instanceof Element) {
                const closestPopoverElement = target.closest('[data-popover-trigger], [data-popover-panel]');

                if (!closestPopoverElement) {
                    this.closeAllPopovers();
                }
            }
        });

        // Handle escape key
        EventUtils.addEventListener(document, 'keydown', (event) => {
            if ((event as KeyboardEvent).key === 'Escape') {
                this.closeAllPopovers();
            }
        });
    }

    /**
     * Setup dynamic observer for new popovers - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    if (DOMUtils.hasDataAttribute(element, 'popover', 'true')) {
                        if (!this.hasState(element)) {
                            this.initializePopover(element);
                        }
                    }

                    const popovers = DOMUtils.findByDataAttribute('popover', 'true', element);
                    popovers.forEach(popover => {
                        if (!this.hasState(popover)) {
                            this.initializePopover(popover);
                        }
                    });
                }
            });
        });
    }

    /**
     * Toggle popover open/closed state
     */
    private togglePopover(popover: HTMLElement): void {
        const state = this.getState(popover);
        if (!state) return;

        if (state.isOpen) {
            this.hidePopover(popover);
        } else {
            this.showPopover(popover);
        }
    }

    /**
     * Show popover
     */
    private showPopover(popover: HTMLElement): void {
        const state = this.getState(popover);
        if (!state || this.isDisabled(popover) || state.isOpen) return;

        this.clearTimeouts(state);

        const delay = parseInt(popover.dataset.delay || '0');

        const showAction = () => {
            this.closeSiblingPopovers(popover);

            state.isOpen = true;
            this.setState(popover, state);

            const panel = DOMUtils.querySelector('[data-popover-panel]', popover) as HTMLElement;
            const trigger = DOMUtils.querySelector('[data-popover-trigger]', popover) as HTMLElement;

            if (panel) {
                panel.classList.remove('hidden');
                this.positionPopover(popover);
            }

            if (trigger) {
                trigger.setAttribute('aria-expanded', 'true');
            }

            this.dispatchPopoverEvent(popover, 'popover:show');
        };

        if (delay > 0) {
            state.showTimeout = window.setTimeout(showAction, delay);
            this.setState(popover, state);
        } else {
            showAction();
        }
    }

    /**
     * Hide popover
     */
    private hidePopover(popover: HTMLElement): void {
        const state = this.getState(popover);
        if (!state || !state.isOpen) return;

        this.clearTimeouts(state);

        const hideDelay = parseInt(popover.dataset.hideDelay || '0');

        const hideAction = () => {
            if (state.floating) {
                state.floating.cleanup();
                state.floating = undefined;
            }

            state.isOpen = false;
            this.setState(popover, state);

            const panel = DOMUtils.querySelector('[data-popover-panel]', popover) as HTMLElement;
            const trigger = DOMUtils.querySelector('[data-popover-trigger]', popover) as HTMLElement;

            if (panel) {
                panel.classList.add('hidden');
            }

            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }

            this.dispatchPopoverEvent(popover, 'popover:hide');
        };

        if (hideDelay > 0) {
            state.hideTimeout = window.setTimeout(hideAction, hideDelay);
            this.setState(popover, state);
        } else {
            hideAction();
        }
    }

    /**
     * Close all open popovers
     */
    private closeAllPopovers(): void {
        this.getAllStates().forEach((state, popover) => {
            if (state.isOpen) {
                const closeOnOutsideClick = popover.dataset.closeOnOutsideClick !== 'false';
                const closeOnEscape = popover.dataset.closeOnEscape !== 'false';

                if (closeOnOutsideClick || closeOnEscape) {
                    this.hidePopover(popover);
                }
            }
        });
    }

    /**
     * Close sibling popovers
     */
    private closeSiblingPopovers(popover: HTMLElement): void {
        this.getAllStates().forEach((state, otherPopover) => {
            if (otherPopover !== popover && state.isOpen) {
                this.hidePopover(otherPopover);
            }
        });
    }

    /**
     * Position popover using FloatingManager
     */
    private positionPopover(popover: HTMLElement): void {
        const panel = DOMUtils.querySelector('[data-popover-panel]', popover) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-popover-trigger]', popover) as HTMLElement;

        if (!panel || !trigger) return;

        const state = this.getState(popover);
        if (!state) return;

        if (state.floating) {
            state.floating.cleanup();
        }

        const placement = popover.dataset.placement || 'bottom';
        const align = popover.dataset.align || 'center';
        const offset = parseInt(popover.dataset.offset || '8');

        let floatingPlacement: any = placement;
        if (placement === 'bottom' || placement === 'top') {
            if (align === 'start') floatingPlacement = `${placement}-start`;
            else if (align === 'end') floatingPlacement = `${placement}-end`;
        } else if (placement === 'left' || placement === 'right') {
            if (align === 'start') floatingPlacement = `${placement}-start`;
            else if (align === 'end') floatingPlacement = `${placement}-end`;
        }

        const floating = FloatingManager.getInstance().createFloating(trigger, panel, {
            placement: floatingPlacement,
            offset,
            flip: {
                fallbackStrategy: 'bestFit',
                padding: 8
            },
            shift: {
                padding: 8,
                crossAxis: true
            },
            hide: {
                strategy: 'escaped'
            },
            autoUpdate: {
                ancestorScroll: true,
                ancestorResize: true,
                elementResize: true,
                layoutShift: true
            }
        });

        state.floating = floating;
        this.setState(popover, state);
    }

    /**
     * Clear timeouts for a state
     */
    private clearTimeouts(state: PopoverState): void {
        if (state.showTimeout) {
            clearTimeout(state.showTimeout);
            state.showTimeout = undefined;
        }
        if (state.hideTimeout) {
            clearTimeout(state.hideTimeout);
            state.hideTimeout = undefined;
        }
    }

    /**
     * Check if popover is disabled
     */
    private isDisabled(popover: HTMLElement): boolean {
        return popover.dataset.disabled === 'true';
    }

    /**
     * Dispatch custom popover event
     */
    private dispatchPopoverEvent(popover: HTMLElement, eventName: string, detail: any = null): void {
        EventUtils.dispatchCustomEvent(popover, eventName, {
            popover,
            ...detail
        }, {
            bubbles: true
        });
    }

    /**
     * Clean up PopoverActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        this.getAllStates().forEach((state, popover) => {
            this.clearTimeouts(state);
            if (state.floating) {
                state.floating.cleanup();
            }
        });
    }

    /**
     * Public API for manual control
     */
    public showById(id: string): void {
        const popover = document.getElementById(id);
        if (popover && DOMUtils.hasDataAttribute(popover, 'popover', 'true')) {
            this.showPopover(popover);
        }
    }

    public hideById(id: string): void {
        const popover = document.getElementById(id);
        if (popover && DOMUtils.hasDataAttribute(popover, 'popover', 'true')) {
            this.hidePopover(popover);
        }
    }

    public toggleById(id: string): void {
        const popover = document.getElementById(id);
        if (popover && DOMUtils.hasDataAttribute(popover, 'popover', 'true')) {
            this.togglePopover(popover);
        }
    }

    public hideAll(): void {
        this.closeAllPopovers();
    }
}

export default PopoverActions.getInstance();