/**
 * RadioActions - Handles radio button focus management
 *
 * Provides functionality for:
 * - Focus radio input when radio card/label is clicked
 * - Accessibility enhancements for radio interactions
 */

export class RadioActions {
    private static instance: RadioActions | null = null;
    private initialized = false;

    /**
     * Get singleton instance
     */
    public static getInstance(): RadioActions {
        if (!RadioActions.instance) {
            RadioActions.instance = new RadioActions();
        }
        return RadioActions.instance;
    }

    /**
     * Initialize RadioActions for all radio elements
     */
    public init(): void {
        if (this.initialized) {
            return;
        }

        this.bindEventListeners();
        this.initialized = true;

    }

    /**
     * Bind event listeners using event delegation
     */
    private bindEventListeners(): void {
        document.addEventListener('click', (event) => {
            const target = event.target as Element;

            const radioLabel = target.closest('label[for]') as HTMLLabelElement;
            if (!radioLabel) return;

            const radioId = radioLabel.getAttribute('for');
            if (!radioId) return;

            const radioInput = document.getElementById(radioId) as HTMLInputElement;
            if (!radioInput || radioInput.type !== 'radio') return;

            this.focusRadioInput(radioInput);
        });

        document.addEventListener('keydown', (event) => {
            const target = event.target as HTMLInputElement;

            if (!target || target.type !== 'radio') return;

            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                event.preventDefault();
                this.focusNextRadio(target);
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                event.preventDefault();
                this.focusPreviousRadio(target);
            }
        });
    }

    /**
     * Focus a radio input with proper timing
     */
    private focusRadioInput(radioInput: HTMLInputElement): void {
        setTimeout(() => {
            radioInput.focus();

            this.dispatchFocusEvent(radioInput);
        }, 0);
    }

    /**
     * Focus the next radio in the same group
     */
    private focusNextRadio(currentRadio: HTMLInputElement): void {
        const radioGroup = this.getRadioGroup(currentRadio);
        const currentIndex = radioGroup.indexOf(currentRadio);
        const nextIndex = (currentIndex + 1) % radioGroup.length;

        const nextRadio = radioGroup[nextIndex];
        if (nextRadio) {
            nextRadio.focus();
            nextRadio.checked = true;

            nextRadio.dispatchEvent(new Event('change', { bubbles: true }));
            this.dispatchFocusEvent(nextRadio);
        }
    }

    /**
     * Focus the previous radio in the same group
     */
    private focusPreviousRadio(currentRadio: HTMLInputElement): void {
        const radioGroup = this.getRadioGroup(currentRadio);
        const currentIndex = radioGroup.indexOf(currentRadio);
        const previousIndex = currentIndex === 0 ? radioGroup.length - 1 : currentIndex - 1;

        const previousRadio = radioGroup[previousIndex];
        if (previousRadio) {
            previousRadio.focus();
            previousRadio.checked = true;

            previousRadio.dispatchEvent(new Event('change', { bubbles: true }));
            this.dispatchFocusEvent(previousRadio);
        }
    }

    /**
     * Get all radio inputs in the same group
     */
    private getRadioGroup(radio: HTMLInputElement): HTMLInputElement[] {
        const name = radio.name;
        if (!name) return [radio];

        const radios = Array.from(document.querySelectorAll(`input[type="radio"][name="${name}"]`)) as HTMLInputElement[];

        return radios.filter(r => !r.disabled);
    }

    /**
     * Dispatch custom event for radio focus
     */
    private dispatchFocusEvent(radioInput: HTMLInputElement): void {
        const event = new CustomEvent('radio-focus', {
            detail: {
                radio: radioInput,
                name: radioInput.name,
                value: radioInput.value,
                checked: radioInput.checked
            },
            bubbles: true
        });

        radioInput.dispatchEvent(event);
    }

    /**
     * Add a custom radio focus handler
     */
    public addFocusHandler(handler: (radio: HTMLInputElement) => void): void {
        document.addEventListener('radio-focus', (event) => {
            const customEvent = event as CustomEvent<{
                radio: HTMLInputElement;
                name: string;
                value: string;
                checked: boolean;
            }>;
            handler(customEvent.detail.radio);
        });
    }

    /**
     * Destroy RadioActions and clean up
     */
    public destroy(): void {
        this.initialized = false;

    }
}

export default RadioActions.getInstance();
