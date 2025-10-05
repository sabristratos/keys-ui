import BaseActionClass from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';

/**
 * ColorPicker state interface
 */
interface ColorPickerState {
    colorInput: HTMLInputElement;
    textInput: HTMLInputElement;
    isUpdating: boolean;
}

/**
 * ColorPickerActions
 *
 * Handles synchronization between native HTML5 color picker and text input.
 * Provides real-time updates and hex color validation.
 */
export default class ColorPickerActions extends BaseActionClass<ColorPickerState> {
    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Use event delegation for all color picker interactions
        document.addEventListener('input', (e) => {
            const target = e.target as HTMLElement;

            // Handle color input changes
            if (target.matches('[data-color-input]')) {
                this.handleColorInput(e);
            }

            // Handle text input changes
            if (target.matches('[data-text-input]')) {
                this.handleTextInput(e);
            }
        });

        document.addEventListener('blur', (e) => {
            const target = e.target as HTMLElement;

            if (target.matches('[data-text-input]')) {
                this.handleTextBlur(e);
            }
        }, true); // Use capture phase for blur events

        document.addEventListener('keydown', (e) => {
            const target = e.target as HTMLElement;

            if (target.matches('[data-text-input]')) {
                this.handleKeydown(e as KeyboardEvent);
            }
        });
    }

    /**
     * Initialize color picker elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        const colorPickers = DOMUtils.querySelectorAll('[data-keys-color-picker="true"]') as HTMLElement[];

        colorPickers.forEach(picker => {
            this.initializeColorPicker(picker);
        });
    }

    /**
     * Initialize a single color picker element
     */
    private initializeColorPicker(picker: HTMLElement): void {
        const colorInput = DOMUtils.querySelector('[data-color-input]', picker) as HTMLInputElement;
        const textInput = DOMUtils.querySelector('[data-text-input]', picker) as HTMLInputElement;

        if (!colorInput || !textInput) {
            console.warn('ColorPicker: Required input elements not found');
            return;
        }

        const state: ColorPickerState = {
            colorInput,
            textInput,
            isUpdating: false
        };

        this.setState(picker, state);
    }

    /**
     * Handle color picker input changes
     */
    private handleColorInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        const picker = target.closest('[data-keys-color-picker="true"]') as HTMLElement;
        if (!picker) return;

        const state = this.getState(picker);
        if (!state || state.isUpdating) return;

        const hexColor = target.value.toUpperCase();

        state.isUpdating = true;
        state.textInput.value = hexColor;

        // Dispatch change event for Livewire/Alpine integration
        this.dispatchChangeEvent(state.colorInput);

        state.isUpdating = false; // Reset AFTER dispatch
    }

    /**
     * Handle text input changes
     */
    private handleTextInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        const picker = target.closest('[data-keys-color-picker="true"]') as HTMLElement;
        if (!picker) return;

        const state = this.getState(picker);
        if (!state || state.isUpdating) return;

        const value = target.value;

        // Only update if it's a valid hex color
        if (this.isValidHexColor(value)) {
            state.isUpdating = true;
            state.colorInput.value = value.toUpperCase();
            state.isUpdating = false;
        }
    }

    /**
     * Handle text input blur - validate and correct format
     */
    private handleTextBlur(event: Event): void {
        const target = event.target as HTMLInputElement;
        const picker = target.closest('[data-keys-color-picker="true"]') as HTMLElement;
        if (!picker) return;

        const state = this.getState(picker);
        if (!state) return;

        let value = target.value.trim();

        // Add # if missing
        if (value.length > 0 && !value.startsWith('#')) {
            value = '#' + value;
        }

        // Validate and correct format
        if (this.isValidHexColor(value)) {
            value = value.toUpperCase();

            state.isUpdating = true; // Protect from recursion
            state.textInput.value = value;
            state.colorInput.value = value;

            // Dispatch change event
            this.dispatchChangeEvent(state.colorInput);
            state.isUpdating = false;
        } else if (value !== '') {
            // Reset to color input value if invalid
            state.isUpdating = true;
            state.textInput.value = state.colorInput.value;
            state.isUpdating = false;
        }
    }

    /**
     * Handle keyboard events
     */
    private handleKeydown(event: KeyboardEvent): void {
        const target = event.target as HTMLElement;
        const picker = target.closest('[data-keys-color-picker="true"]') as HTMLElement;
        if (!picker) return;

        const state = this.getState(picker);
        if (!state) return;

        // Enter key opens color picker
        if (event.key === 'Enter') {
            event.preventDefault();
            state.colorInput.focus();
            state.colorInput.click();
        }
    }

    /**
     * Validate hex color format
     */
    private isValidHexColor(value: string): boolean {
        // Match #RGB or #RRGGBB format
        const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexPattern.test(value);
    }

    /**
     * Dispatch change event for form integration
     */
    private dispatchChangeEvent(element: HTMLInputElement): void {
        // Only dispatch 'change' event for form integration
        // DO NOT dispatch 'input' - it causes infinite recursion
        const event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
    }

    /**
     * Clean up ColorPickerActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // State cleanup is handled by BaseActionClass
        // Event listeners use delegation so no cleanup needed
    }
}
