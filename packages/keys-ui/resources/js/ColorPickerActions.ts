import BaseActionClass from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';

/**
 * ColorPicker state interface
 */
interface ColorPickerState {
    colorInput: HTMLInputElement | null;
    textInput: HTMLInputElement | null;
    isUpdating: boolean;
}

/**
 * ColorPickerActions
 *
 * Handles synchronization between native HTML5 color picker and text input.
 * Provides real-time updates and hex color validation.
 */
export default class ColorPickerActions extends BaseActionClass<ColorPickerState> {
    private colorInput: HTMLInputElement | null = null;
    private textInput: HTMLInputElement | null = null;
    private isUpdating = false;

    // Store bound function references for proper cleanup
    private boundHandleColorInput: ((e: Event) => void) | null = null;
    private boundHandleTextInput: ((e: Event) => void) | null = null;
    private boundHandleTextBlur: ((e: Event) => void) | null = null;
    private boundHandleKeydown: ((e: KeyboardEvent) => void) | null = null;

    constructor(element: HTMLElement) {
        super(element);
        this.initializeInputs();
        this.setupEventListeners();
    }

    /**
     * Initialize color and text input elements
     */
    private initializeInputs(): void {
        this.colorInput = DOMUtils.querySelector('[data-color-input]', this.element) as HTMLInputElement;
        this.textInput = DOMUtils.querySelector('[data-text-input]', this.element) as HTMLInputElement;

        if (!this.colorInput || !this.textInput) {
            console.warn('ColorPicker: Required input elements not found');
            return;
        }
    }

    /**
     * Setup event listeners for both inputs
     */
    private setupEventListeners(): void {
        if (!this.colorInput || !this.textInput) return;

        // Create and store bound function references
        this.boundHandleColorInput = this.handleColorInput.bind(this);
        this.boundHandleTextInput = this.handleTextInput.bind(this);
        this.boundHandleTextBlur = this.handleTextBlur.bind(this);
        this.boundHandleKeydown = this.handleKeydown.bind(this);

        // Attach event listeners using stored references
        this.colorInput.addEventListener('input', this.boundHandleColorInput);
        this.textInput.addEventListener('input', this.boundHandleTextInput);
        this.textInput.addEventListener('blur', this.boundHandleTextBlur);
        this.textInput.addEventListener('keydown', this.boundHandleKeydown);
    }

    /**
     * Handle color picker input changes
     */
    private handleColorInput(event: Event): void {
        if (this.isUpdating || !this.colorInput || !this.textInput) return;

        const target = event.target as HTMLInputElement;
        const hexColor = target.value.toUpperCase();

        this.isUpdating = true;
        this.textInput.value = hexColor;

        // Dispatch change event for Livewire/Alpine integration
        this.dispatchChangeEvent(this.colorInput);

        this.isUpdating = false; // Reset AFTER dispatch
    }

    /**
     * Handle text input changes
     */
    private handleTextInput(event: Event): void {
        if (this.isUpdating || !this.colorInput || !this.textInput) return;

        const target = event.target as HTMLInputElement;
        const value = target.value;

        // Only update if it's a valid hex color
        if (this.isValidHexColor(value)) {
            this.isUpdating = true;
            this.colorInput.value = value.toUpperCase();
            this.isUpdating = false;
        }
    }

    /**
     * Handle text input blur - validate and correct format
     */
    private handleTextBlur(event: Event): void {
        if (!this.colorInput || !this.textInput) return;

        const target = event.target as HTMLInputElement;
        let value = target.value.trim();

        // Add # if missing
        if (value.length > 0 && !value.startsWith('#')) {
            value = '#' + value;
        }

        // Validate and correct format
        if (this.isValidHexColor(value)) {
            value = value.toUpperCase();

            this.isUpdating = true; // Protect from recursion
            this.textInput.value = value;
            this.colorInput.value = value;

            // Dispatch change event
            this.dispatchChangeEvent(this.colorInput);
            this.isUpdating = false;
        } else if (value !== '') {
            // Reset to color input value if invalid
            this.isUpdating = true;
            this.textInput.value = this.colorInput.value;
            this.isUpdating = false;
        }
    }

    /**
     * Handle keyboard events
     */
    private handleKeydown(event: KeyboardEvent): void {
        if (!this.colorInput) return;

        // Enter key opens color picker
        if (event.key === 'Enter') {
            event.preventDefault();
            this.colorInput.focus();
            this.colorInput.click();
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
     * Cleanup method - properly removes event listeners using stored references
     */
    public destroy(): void {
        // Remove event listeners using the same bound references
        if (this.colorInput && this.boundHandleColorInput) {
            this.colorInput.removeEventListener('input', this.boundHandleColorInput);
        }

        if (this.textInput) {
            if (this.boundHandleTextInput) {
                this.textInput.removeEventListener('input', this.boundHandleTextInput);
            }
            if (this.boundHandleTextBlur) {
                this.textInput.removeEventListener('blur', this.boundHandleTextBlur);
            }
            if (this.boundHandleKeydown) {
                this.textInput.removeEventListener('keydown', this.boundHandleKeydown);
            }
        }

        // Clean up all references to prevent memory leaks
        this.boundHandleColorInput = null;
        this.boundHandleTextInput = null;
        this.boundHandleTextBlur = null;
        this.boundHandleKeydown = null;
        this.colorInput = null;
        this.textInput = null;
    }
}
