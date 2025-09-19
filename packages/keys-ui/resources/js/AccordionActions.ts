/**
 * AccordionActions - Enhanced animations for Accordion components using WAAPI
 *
 * Provides functionality for:
 * - Smooth height animations using Web Animations API
 * - Progressive enhancement (works without JavaScript)
 * - Multiple accordion instance management
 * - Accessibility support with prefers-reduced-motion
 * - Custom event dispatching for framework integration
 *
 * Based on: https://css-tricks.com/how-to-animate-the-details-element-using-waapi/
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import { AnimationUtils } from './utils/AnimationUtils';

interface AccordionState {
    isAnimating: boolean;
    animation: Animation | null;
    isExpanding: boolean;
}

interface AccordionEventDetail {
    accordion: HTMLDetailsElement;
    isExpanded: boolean;
}

export class AccordionActions extends BaseActionClass<AccordionState> {

    /**
     * Initialize accordion elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.querySelectorAll('details[data-accordion]').forEach(accordion => {
            this.initializeAccordion(accordion as HTMLDetailsElement);
        });
    }

    /**
     * Initialize a single accordion element
     */
    private initializeAccordion(accordion: HTMLDetailsElement): void {
        if (this.hasState(accordion)) {
            return;
        }

        const state: AccordionState = {
            isAnimating: false,
            animation: null,
            isExpanding: false
        };

        this.setState(accordion, state);

        // Event listeners are now handled via event delegation in bindEventListeners
        // Individual accordion setup is no longer needed
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Summary click events
        EventUtils.handleDelegatedClick('details[data-accordion] summary', (summary, event) => {
            const accordion = DOMUtils.findClosest(summary, 'details[data-accordion]') as HTMLDetailsElement;
            if (accordion) {
                this.handleSummaryClick(accordion, event);
            }
        });

        // Toggle events for keyboard navigation
        EventUtils.handleDelegatedEvent('toggle', 'details[data-accordion]', (accordion) => {
            this.handleToggle(accordion as HTMLDetailsElement);
        });
    }

    /**
     * Setup dynamic observer for new accordions - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Check if the added node is an accordion
                    if (element.matches && element.matches('details[data-accordion]')) {
                        this.initializeAccordion(element as HTMLDetailsElement);
                    }

                    // Check for accordions within the added node
                    DOMUtils.querySelectorAll('details[data-accordion]', element).forEach(accordion => {
                        this.initializeAccordion(accordion as HTMLDetailsElement);
                    });
                }
            });
        });
    }

    /**
     * Handle summary click with animation
     */
    private handleSummaryClick(accordion: HTMLDetailsElement, event: Event): void {
        const state = this.getState(accordion);
        if (!state) return;

        // If we're already animating, prevent default and return
        if (state.isAnimating) {
            event.preventDefault();
            return;
        }

        // Check for reduced motion preference
        if (AnimationUtils.prefersReducedMotion()) {
            return; // Let default behavior handle it
        }

        event.preventDefault();

        // Determine if we're opening or closing
        const isExpanding = !accordion.open;
        state.isExpanding = isExpanding;

        if (isExpanding) {
            this.expand(accordion);
        } else {
            this.shrink(accordion);
        }
    }

    /**
     * Handle toggle events (for keyboard navigation)
     */
    private handleToggle(accordion: HTMLDetailsElement): void {
        this.dispatchAccordionEvent(accordion, 'accordion:toggle', {
            isExpanded: accordion.open
        });
    }

    /**
     * Expand accordion with animation
     */
    private expand(accordion: HTMLDetailsElement): void {
        const state = this.getState(accordion);
        if (!state) return;

        state.isAnimating = true;
        accordion.setAttribute('animating', '');

        // Open the details element to measure content height
        accordion.open = true;

        // Get the summary height (what's always visible)
        const summary = DOMUtils.querySelector('summary', accordion);
        const summaryHeight = summary ? summary.offsetHeight : 0;

        // Get full height (summary + content)
        const fullHeight = accordion.offsetHeight;

        // Use AnimationUtils for the expand animation
        state.animation = AnimationUtils.expandHeight(accordion, {
            fromHeight: summaryHeight,
            toHeight: fullHeight,
            duration: 300,
            easing: 'ease-out',
            onComplete: () => {
                this.onAnimationFinish(accordion);
            }
        });

        this.dispatchAccordionEvent(accordion, 'accordion:expanding');
    }

    /**
     * Shrink accordion with animation
     */
    private shrink(accordion: HTMLDetailsElement): void {
        const state = this.getState(accordion);
        if (!state) return;

        state.isAnimating = true;
        accordion.setAttribute('animating', '');

        // Get summary height (target height)
        const summary = DOMUtils.querySelector('summary', accordion);
        const summaryHeight = summary ? summary.offsetHeight : 0;

        // Use AnimationUtils for the collapse animation
        state.animation = AnimationUtils.collapseHeight(accordion, {
            toHeight: summaryHeight,
            duration: 300,
            easing: 'ease-out',
            onComplete: () => {
                // Close the details element after animation
                accordion.open = false;
                this.onAnimationFinish(accordion);
            }
        });

        this.dispatchAccordionEvent(accordion, 'accordion:collapsing');
    }

    /**
     * Clean up after animation finishes
     */
    private onAnimationFinish(accordion: HTMLDetailsElement): void {
        const state = this.getState(accordion);
        if (!state) return;

        // Remove animation attributes and styles
        accordion.removeAttribute('animating');
        accordion.style.height = '';
        accordion.style.overflow = '';

        // Clear animation reference
        state.animation = null;
        state.isAnimating = false;

        this.setState(accordion, state);

        this.dispatchAccordionEvent(accordion, 'accordion:animated', {
            isExpanded: accordion.open
        });
    }

    /**
     * Programmatically open an accordion
     */
    public openAccordion(accordionId: string): boolean {
        const accordion = DOMUtils.getElementById(accordionId) as HTMLDetailsElement;
        if (!accordion || !accordion.matches('details[data-accordion]')) {
            console.warn(`Accordion with id "${accordionId}" not found`);
            return false;
        }

        if (accordion.open) {
            return true; // Already open
        }

        const state = this.getState(accordion);
        if (state && state.isAnimating) {
            return false; // Currently animating
        }

        // Check for reduced motion
        if (AnimationUtils.prefersReducedMotion()) {
            accordion.open = true;
            return true;
        }

        this.expand(accordion);
        return true;
    }

    /**
     * Programmatically close an accordion
     */
    public closeAccordion(accordionId: string): boolean {
        const accordion = DOMUtils.getElementById(accordionId) as HTMLDetailsElement;
        if (!accordion || !accordion.matches('details[data-accordion]')) {
            console.warn(`Accordion with id "${accordionId}" not found`);
            return false;
        }

        if (!accordion.open) {
            return true; // Already closed
        }

        const state = this.getState(accordion);
        if (state && state.isAnimating) {
            return false; // Currently animating
        }

        // Check for reduced motion
        if (AnimationUtils.prefersReducedMotion()) {
            accordion.open = false;
            return true;
        }

        this.shrink(accordion);
        return true;
    }

    /**
     * Toggle an accordion's state
     */
    public toggleAccordion(accordionId: string): boolean {
        const accordion = DOMUtils.getElementById(accordionId) as HTMLDetailsElement;
        if (!accordion || !accordion.matches('details[data-accordion]')) {
            console.warn(`Accordion with id "${accordionId}" not found`);
            return false;
        }

        if (accordion.open) {
            return this.closeAccordion(accordionId);
        } else {
            return this.openAccordion(accordionId);
        }
    }

    /**
     * Check if accordion is open
     */
    public isAccordionOpen(accordionId: string): boolean {
        const accordion = DOMUtils.getElementById(accordionId) as HTMLDetailsElement;
        return accordion ? accordion.open : false;
    }

    /**
     * Check if accordion is animating
     */
    public isAccordionAnimating(accordionId: string): boolean {
        const accordion = DOMUtils.getElementById(accordionId) as HTMLDetailsElement;
        if (!accordion) return false;

        const state = this.getState(accordion);
        return state ? state.isAnimating : false;
    }

    /**
     * Get accordion state
     */
    public getAccordionState(accordionId: string): AccordionState | null {
        const accordion = DOMUtils.getElementById(accordionId) as HTMLDetailsElement;
        return accordion ? this.getState(accordion) || null : null;
    }

    /**
     * Dispatch custom accordion events
     */
    private dispatchAccordionEvent(accordion: HTMLDetailsElement, eventName: string, detail: any = {}): void {
        EventUtils.dispatchCustomEvent(accordion, eventName, {
            accordion,
            ...detail
        }, {
            bubbles: true,
            cancelable: true
        });
    }

    /**
     * Clean up AccordionActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // Cancel any running animations
        this.getAllStates().forEach((state, accordion) => {
            AnimationUtils.cancelAnimation(state.animation);
            accordion.removeAttribute('animating');
            accordion.style.height = '';
            accordion.style.overflow = '';
        });
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AccordionActions.getInstance().init();
    });
} else {
    AccordionActions.getInstance().init();
}

// Export for global access
(window as any).AccordionActions = AccordionActions;

declare global {
    interface Window {
        AccordionActions: typeof AccordionActions;
    }
}

export default AccordionActions.getInstance();