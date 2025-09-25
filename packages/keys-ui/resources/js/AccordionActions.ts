/**
 * AccordionActions - Enhanced functionality for Accordion components
 *
 * Provides functionality for:
 * - State management and event handling
 * - Progressive enhancement (works without JavaScript)
 * - Multiple accordion instance management
 * - Accessibility support
 * - Custom event dispatching for framework integration
 *
 * Note: Animations are now handled by pure CSS transitions
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';

interface AccordionState {
    isOpen: boolean;
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
            isOpen: accordion.open
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
     * Handle summary click - now just updates state and dispatches events
     */
    private handleSummaryClick(accordion: HTMLDetailsElement, event: Event): void {
        const state = this.getState(accordion);
        if (!state) return;

        // Update state to track open/close
        state.isOpen = !accordion.open;
        this.setState(accordion, state);

        // Dispatch events for framework integration
        this.dispatchAccordionEvent(accordion, state.isOpen ? 'accordion:expanding' : 'accordion:collapsing');
    }

    /**
     * Handle toggle events (for keyboard navigation)
     */
    private handleToggle(accordion: HTMLDetailsElement): void {
        const state = this.getState(accordion);
        if (state) {
            state.isOpen = accordion.open;
            this.setState(accordion, state);
        }

        this.dispatchAccordionEvent(accordion, 'accordion:toggle', {
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

        accordion.open = true;

        const state = this.getState(accordion);
        if (state) {
            state.isOpen = true;
            this.setState(accordion, state);
        }

        this.dispatchAccordionEvent(accordion, 'accordion:opened', {
            isExpanded: true
        });

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

        accordion.open = false;

        const state = this.getState(accordion);
        if (state) {
            state.isOpen = false;
            this.setState(accordion, state);
        }

        this.dispatchAccordionEvent(accordion, 'accordion:closed', {
            isExpanded: false
        });

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
     * Check if accordion is animating (deprecated - CSS animations don't need tracking)
     */
    public isAccordionAnimating(accordionId: string): boolean {
        // Always return false since CSS animations don't need JavaScript tracking
        return false;
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
        // No cleanup needed since animations are handled by CSS
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