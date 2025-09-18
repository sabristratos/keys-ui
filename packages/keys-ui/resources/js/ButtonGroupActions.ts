/**
 * ButtonGroupActions - Handles button group styling and positioning
 *
 * Provides functionality for:
 * - Dynamic Tailwind class injection for seamless button connections
 * - Support for both horizontal and vertical orientations
 * - Border radius management for grouped buttons
 */

export class ButtonGroupActions {
    private static instance: ButtonGroupActions | null = null;
    private initialized = false;

    /**
     * Get singleton instance
     */
    public static getInstance(): ButtonGroupActions {
        if (!ButtonGroupActions.instance) {
            ButtonGroupActions.instance = new ButtonGroupActions();
        }
        return ButtonGroupActions.instance;
    }

    /**
     * Initialize ButtonGroupActions for all button group elements
     */
    public init(): void {
        if (this.initialized) {
            return;
        }

        this.processButtonGroups();
        this.bindEventListeners();
        this.initialized = true;
    }

    /**
     * Process all existing button groups on the page
     */
    private processButtonGroups(): void {
        const buttonGroups = document.querySelectorAll('[data-button-group="true"][data-attached="true"]');
        buttonGroups.forEach(group => this.processButtonGroup(group as HTMLElement));
    }

    /**
     * Bind event listeners using event delegation
     */
    private bindEventListeners(): void {
        // Listen for dynamically added button groups
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as HTMLElement;

                        // Check if the added node is a button group
                        if (element.matches && element.matches('[data-button-group="true"][data-attached="true"]')) {
                            this.processButtonGroup(element);
                        }

                        // Check for button groups within the added node
                        const buttonGroups = element.querySelectorAll && element.querySelectorAll('[data-button-group="true"][data-attached="true"]');
                        if (buttonGroups) {
                            buttonGroups.forEach(group => this.processButtonGroup(group as HTMLElement));
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
     * Process a single button group element
     */
    private processButtonGroup(group: HTMLElement): void {
        const orientation = group.getAttribute('data-orientation') || 'horizontal';
        const buttons = Array.from(group.children).filter(child =>
            child.tagName === 'BUTTON' || child.tagName === 'A'
        ) as HTMLElement[];

        if (buttons.length <= 1) return; // No need to process single buttons

        buttons.forEach((button, index) => {
            const isFirst = index === 0;
            const isLast = index === buttons.length - 1;
            const isMiddle = !isFirst && !isLast;

            // Clear any existing border radius classes
            this.clearBorderRadiusClasses(button);

            if (orientation === 'horizontal') {
                if (isFirst) {
                    // First button: remove right border radius
                    button.classList.add('rounded-r-none');
                } else if (isLast) {
                    // Last button: remove left border radius
                    button.classList.add('rounded-l-none');
                } else if (isMiddle) {
                    // Middle buttons: remove all border radius
                    button.classList.add('rounded-none');
                }
            } else if (orientation === 'vertical') {
                if (isFirst) {
                    // First button: remove bottom border radius
                    button.classList.add('rounded-b-none');
                } else if (isLast) {
                    // Last button: remove top border radius
                    button.classList.add('rounded-t-none');
                } else if (isMiddle) {
                    // Middle buttons: remove all border radius
                    button.classList.add('rounded-none');
                }
            }
        });
    }

    /**
     * Clear existing border radius classes from a button
     */
    private clearBorderRadiusClasses(button: HTMLElement): void {
        const radiusClasses = [
            'rounded-none',
            'rounded-r-none',
            'rounded-l-none',
            'rounded-t-none',
            'rounded-b-none'
        ];

        radiusClasses.forEach(className => {
            button.classList.remove(className);
        });
    }

    /**
     * Re-process all button groups (useful after dynamic content changes)
     */
    public refresh(): void {
        this.processButtonGroups();
    }

    /**
     * Process a specific button group by element reference
     */
    public processGroup(group: HTMLElement): void {
        if (group.matches('[data-button-group="true"][data-attached="true"]')) {
            this.processButtonGroup(group);
        }
    }

    /**
     * Destroy ButtonGroupActions and clean up
     */
    public destroy(): void {
        this.initialized = false;
    }
}

export default ButtonGroupActions.getInstance();