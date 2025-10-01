/**
 * RadioActions - Handles radio button focus management
 *
 * Provides functionality for:
 * - Focus radio input when radio card/label is clicked
 * - Accessibility enhancements for radio interactions
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';

export class RadioActions extends BaseActionClass {
    /**
     * Initialize radio elements - required by BaseActionClass
     */
    protected initializeElements(): void {
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        EventUtils.handleDelegatedClick('label[for]', (label) => {
            const radioId = label.getAttribute('for');
            if (!radioId) return;

            const radioInput = DOMUtils.getElementById(radioId) as HTMLInputElement;
            if (!radioInput || radioInput.type !== 'radio') return;

            this.focusRadioInput(radioInput);
        });

        EventUtils.handleDelegatedKeydown('input[type="radio"]', (target, event) => {
            const navigationHandler = EventUtils.createNavigationHandler({
                onArrowDown: () => this.focusNextRadio(target as HTMLInputElement),
                onArrowRight: () => this.focusNextRadio(target as HTMLInputElement),
                onArrowUp: () => this.focusPreviousRadio(target as HTMLInputElement),
                onArrowLeft: () => this.focusPreviousRadio(target as HTMLInputElement),
                preventDefault: ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft']
            });

            navigationHandler(event);
        });
    }

    /**
     * Focus a radio input with proper timing
     */
    private focusRadioInput(radioInput: HTMLInputElement): void {
        DOMUtils.focus(radioInput, 0);
        this.dispatchFocusEvent(radioInput);
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

        const radios = Array.from(DOMUtils.querySelectorAll(`input[type="radio"][name="${name}"]`)) as HTMLInputElement[];

        return radios.filter(r => !r.disabled);
    }

    /**
     * Dispatch custom event for radio focus
     */
    private dispatchFocusEvent(radioInput: HTMLInputElement): void {
        EventUtils.dispatchCustomEvent(radioInput, 'radio-focus', {
            radio: radioInput,
            name: radioInput.name,
            value: radioInput.value,
            checked: radioInput.checked
        });
    }

    /**
     * Add a custom radio focus handler with automatic cleanup
     */
    public addFocusHandler(handler: (radio: HTMLInputElement) => void): () => void {
        return EventUtils.addEventListener(document, 'radio-focus', (event) => {
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
     * Clean up RadioActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
    }
}

export default RadioActions.getInstance();
