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

interface AccordionState {
    isAnimating: boolean;
    animation: Animation | null;
    isExpanding: boolean;
}

interface AccordionEventDetail {
    accordion: HTMLDetailsElement;
    isExpanded: boolean;
}

export class AccordionActions {
    private static instance: AccordionActions | null = null;
    private initialized = false;
    private accordionStates = new Map<HTMLDetailsElement, AccordionState>();

    /**
     * Get singleton instance
     */
    public static getInstance(): AccordionActions {
        if (!AccordionActions.instance) {
            AccordionActions.instance = new AccordionActions();
        }
        return AccordionActions.instance;
    }

    /**
     * Initialize AccordionActions for enhanced animations
     */
    public init(): void {
        if (this.initialized) {
            return;
        }

        this.bindEventListeners();
        this.initializeAccordions();
        this.initialized = true;
    }

    /**
     * Initialize all existing accordion elements
     */
    private initializeAccordions(): void {
        document.querySelectorAll('details[data-accordion]').forEach(accordion => {
            this.initializeAccordion(accordion as HTMLDetailsElement);
        });
    }

    /**
     * Initialize a single accordion element
     */
    private initializeAccordion(accordion: HTMLDetailsElement): void {
        if (this.accordionStates.has(accordion)) {
            return;
        }

        const state: AccordionState = {
            isAnimating: false,
            animation: null,
            isExpanding: false
        };

        this.accordionStates.set(accordion, state);

        // Listen for summary clicks to handle animations
        const summary = accordion.querySelector('summary');
        if (summary) {
            summary.addEventListener('click', (event) => {
                this.handleSummaryClick(accordion, event);
            });
        }

        // Listen for toggle events (keyboard navigation)
        accordion.addEventListener('toggle', () => {
            this.handleToggle(accordion);
        });
    }

    /**
     * Bind event listeners and mutation observer
     */
    private bindEventListeners(): void {
        // Observer for dynamically added accordions
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        const accordions = element.querySelectorAll('details[data-accordion]');
                        accordions.forEach(accordion => {
                            this.initializeAccordion(accordion as HTMLDetailsElement);
                        });

                        // Check if the added node itself is an accordion
                        if (element.matches('details[data-accordion]')) {
                            this.initializeAccordion(element as HTMLDetailsElement);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Handle summary click with animation
     */
    private handleSummaryClick(accordion: HTMLDetailsElement, event: Event): void {
        const state = this.accordionStates.get(accordion);
        if (!state) return;

        // If we're already animating, prevent default and return
        if (state.isAnimating) {
            event.preventDefault();
            return;
        }

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
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
        const state = this.accordionStates.get(accordion);
        if (!state) return;

        state.isAnimating = true;
        accordion.setAttribute('animating', '');

        // Open the details element to measure content height
        accordion.open = true;

        // Get the summary height (what's always visible)
        const summary = accordion.querySelector('summary');
        const summaryHeight = summary ? summary.offsetHeight : 0;

        // Get full height (summary + content)
        const fullHeight = accordion.offsetHeight;
        const contentHeight = fullHeight - summaryHeight;

        // Set initial state (just summary height)
        accordion.style.height = `${summaryHeight}px`;
        accordion.style.overflow = 'hidden';

        // Animate to full height
        state.animation = accordion.animate([
            { height: `${summaryHeight}px` },
            { height: `${fullHeight}px` }
        ], {
            duration: 300,
            easing: 'ease-out'
        });

        state.animation.addEventListener('finish', () => {
            this.onAnimationFinish(accordion);
        });

        this.dispatchAccordionEvent(accordion, 'accordion:expanding');
    }

    /**
     * Shrink accordion with animation
     */
    private shrink(accordion: HTMLDetailsElement): void {
        const state = this.accordionStates.get(accordion);
        if (!state) return;

        state.isAnimating = true;
        accordion.setAttribute('animating', '');

        // Get current height
        const startHeight = accordion.offsetHeight;

        // Get summary height (target height)
        const summary = accordion.querySelector('summary');
        const summaryHeight = summary ? summary.offsetHeight : 0;

        // Set explicit height and overflow
        accordion.style.height = `${startHeight}px`;
        accordion.style.overflow = 'hidden';

        // Animate to summary height
        state.animation = accordion.animate([
            { height: `${startHeight}px` },
            { height: `${summaryHeight}px` }
        ], {
            duration: 300,
            easing: 'ease-out'
        });

        state.animation.addEventListener('finish', () => {
            // Close the details element after animation
            accordion.open = false;
            this.onAnimationFinish(accordion);
        });

        this.dispatchAccordionEvent(accordion, 'accordion:collapsing');
    }

    /**
     * Clean up after animation finishes
     */
    private onAnimationFinish(accordion: HTMLDetailsElement): void {
        const state = this.accordionStates.get(accordion);
        if (!state) return;

        // Remove animation attributes and styles
        accordion.removeAttribute('animating');
        accordion.style.height = '';
        accordion.style.overflow = '';

        // Clear animation reference
        state.animation = null;
        state.isAnimating = false;

        this.accordionStates.set(accordion, state);

        this.dispatchAccordionEvent(accordion, 'accordion:animated', {
            isExpanded: accordion.open
        });
    }

    /**
     * Programmatically open an accordion
     */
    public openAccordion(accordionId: string): boolean {
        const accordion = document.getElementById(accordionId) as HTMLDetailsElement;
        if (!accordion || !accordion.matches('details[data-accordion]')) {
            console.warn(`Accordion with id "${accordionId}" not found`);
            return false;
        }

        if (accordion.open) {
            return true; // Already open
        }

        const state = this.accordionStates.get(accordion);
        if (state && state.isAnimating) {
            return false; // Currently animating
        }

        // Check for reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
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
        const accordion = document.getElementById(accordionId) as HTMLDetailsElement;
        if (!accordion || !accordion.matches('details[data-accordion]')) {
            console.warn(`Accordion with id "${accordionId}" not found`);
            return false;
        }

        if (!accordion.open) {
            return true; // Already closed
        }

        const state = this.accordionStates.get(accordion);
        if (state && state.isAnimating) {
            return false; // Currently animating
        }

        // Check for reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
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
        const accordion = document.getElementById(accordionId) as HTMLDetailsElement;
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
        const accordion = document.getElementById(accordionId) as HTMLDetailsElement;
        return accordion ? accordion.open : false;
    }

    /**
     * Check if accordion is animating
     */
    public isAccordionAnimating(accordionId: string): boolean {
        const accordion = document.getElementById(accordionId) as HTMLDetailsElement;
        if (!accordion) return false;

        const state = this.accordionStates.get(accordion);
        return state ? state.isAnimating : false;
    }

    /**
     * Get accordion state
     */
    public getAccordionState(accordionId: string): AccordionState | null {
        const accordion = document.getElementById(accordionId) as HTMLDetailsElement;
        return accordion ? this.accordionStates.get(accordion) || null : null;
    }

    /**
     * Dispatch custom accordion events
     */
    private dispatchAccordionEvent(accordion: HTMLDetailsElement, eventName: string, detail: any = {}): void {
        const event = new CustomEvent(eventName, {
            detail: {
                accordion,
                ...detail
            },
            bubbles: true,
            cancelable: true
        });
        accordion.dispatchEvent(event);
    }

    /**
     * Destroy AccordionActions and clean up
     */
    public destroy(): void {
        // Cancel any running animations
        this.accordionStates.forEach((state, accordion) => {
            if (state.animation) {
                state.animation.cancel();
            }
            accordion.removeAttribute('animating');
            accordion.style.height = '';
            accordion.style.overflow = '';
        });

        this.accordionStates.clear();
        this.initialized = false;
    }
}

// Export singleton instance
export default AccordionActions.getInstance();