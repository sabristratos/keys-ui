/**
 * FormActions - Handles interactive actions for form components
 *
 * Provides functionality for:
 * - Clear input/textarea values
 * - Copy to clipboard
 * - Toggle password visibility
 * - Open external URLs
 * - Custom action callbacks
 */

interface FormAction {
    type: string;
    icon: string;
    label: string;
    action: string;
    url?: string;
}

interface FormActionEvent {
    element: HTMLInputElement | HTMLTextAreaElement;
    action: string;
    value: string;
}

// Translation helper function
function t(key: string, fallback: string = ''): string {
    const translations = (window as any).KeysUITranslations;
    if (!translations) {
        return fallback;
    }

    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
            return fallback;
        }
    }

    return value || fallback;
}

export class FormActions {
    private static instance: FormActions | null = null;
    private initialized = false;

    /**
     * Get singleton instance
     */
    public static getInstance(): FormActions {
        if (!FormActions.instance) {
            FormActions.instance = new FormActions();
        }
        return FormActions.instance;
    }

    /**
     * Initialize FormActions for all form elements with actions
     */
    public init(): void {
        if (this.initialized) {
            return;
        }

        this.bindEventListeners();
        this.initialized = true;
        console.log('FormActions initialized');
    }

    /**
     * Bind event listeners using event delegation
     */
    private bindEventListeners(): void {
        // Handle action button clicks
        document.addEventListener('click', (event) => {
            const button = (event.target as Element)?.closest('.input-action') as HTMLButtonElement;
            if (!button) return;

            event.preventDefault();
            this.handleActionClick(button);
        });

        // Handle keyboard events for accessibility
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                const button = event.target as HTMLButtonElement;
                if (button?.classList.contains('input-action')) {
                    event.preventDefault();
                    this.handleActionClick(button);
                }
            }
        });
    }

    /**
     * Handle action button click
     */
    private async handleActionClick(button: HTMLButtonElement): Promise<void> {
        // Get the wrapper div that contains the data attributes
        const wrapper = button.closest('.input-action') as HTMLElement;
        const action = wrapper?.dataset.action;
        if (!action) return;

        const element = this.findFormElementForAction(button);
        if (!element) return;

        switch (action) {
            case 'clear':
                this.clearValue(element);
                break;
            case 'copy':
                await this.copyToClipboard(element, wrapper);
                break;
            case 'toggle-password':
                await this.togglePasswordVisibility(element as HTMLInputElement, button, wrapper);
                break;
            case 'external':
                this.openExternalUrl(button.dataset.url);
                break;
            default:
                this.handleCustomAction(element, action);
                break;
        }

        // Dispatch custom event for user callbacks
        this.dispatchActionEvent(element, action);
    }

    /**
     * Find the form element (input or textarea) associated with an action button
     */
    private findFormElementForAction(button: HTMLButtonElement): HTMLInputElement | HTMLTextAreaElement | null {
        const container = button.closest('.relative');
        return container?.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement || null;
    }

    /**
     * Swap the icon using CSS classes and data attributes
     */
    private async swapButtonIcon(button: HTMLButtonElement, iconName: string): Promise<void> {
        // Store the current icon name in a data attribute
        button.setAttribute('data-current-icon', iconName);

        // Add a CSS class to indicate the icon state
        this.updateButtonIconState(button, iconName);
    }

    /**
     * Update button icon state using Tailwind classes
     */
    private updateButtonIconState(button: HTMLButtonElement, iconName: string): void {
        // Get icon elements within the button (new structure)
        const defaultIcon = button.querySelector('.button-icon-default') as HTMLElement;
        const toggleIcon = button.querySelector('.button-icon-toggle') as HTMLElement;
        const successIcon = button.querySelector('.button-icon-success') as HTMLElement;

        // Get icon names for comparison from button data attributes
        const defaultIconName = button.dataset.iconDefault;
        const toggleIconName = button.dataset.iconToggle;
        const successIconName = button.dataset.iconSuccess;

        // Reset all icons to hidden state first
        if (defaultIcon) {
            defaultIcon.classList.remove('opacity-100');
            defaultIcon.classList.add('opacity-0');
        }
        if (toggleIcon) {
            toggleIcon.classList.remove('opacity-100', 'scale-110', 'scale-90');
            toggleIcon.classList.add('opacity-0');
        }
        if (successIcon) {
            successIcon.classList.remove('opacity-100', 'scale-110', 'scale-90');
            successIcon.classList.add('opacity-0');
        }

        // Show the appropriate icon based on iconName
        if (iconName === defaultIconName && defaultIcon) {
            defaultIcon.classList.remove('opacity-0');
            defaultIcon.classList.add('opacity-100');
        } else if (iconName === toggleIconName && toggleIcon) {
            toggleIcon.classList.remove('opacity-0');
            toggleIcon.classList.add('opacity-100');
        } else if (iconName === successIconName && successIcon) {
            successIcon.classList.remove('opacity-0');
            successIcon.classList.add('opacity-100', 'scale-110');
        }
    }

    /**
     * Animate icon success feedback using Tailwind classes
     */
    private animateIconSuccess(button: HTMLButtonElement): void {
        // Scale animation for success feedback
        button.classList.add('scale-110');

        setTimeout(() => {
            button.classList.remove('scale-110');
            button.classList.add('scale-90');

            setTimeout(() => {
                button.classList.remove('scale-90');
            }, 150);
        }, 150);
    }

    /**
     * Clear form element value
     */
    private clearValue(element: HTMLInputElement | HTMLTextAreaElement): void {
        element.value = '';
        element.focus();

        // Trigger input event for reactive frameworks
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /**
     * Copy form element value to clipboard
     */
    private async copyToClipboard(element: HTMLInputElement | HTMLTextAreaElement, wrapper: HTMLElement): Promise<void> {
        const copyButton = wrapper.querySelector('button') as HTMLButtonElement;

        try {
            await navigator.clipboard.writeText(element.value);
            this.showFeedback(element, t('feedback.copied_clipboard', 'Copied to clipboard'), 'success');

            // Show visual feedback with icon change
            if (copyButton) {
                await this.showCopySuccess(copyButton, wrapper);
            }
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(element, wrapper);
        }
    }

    /**
     * Fallback copy method for older browsers
     */
    private fallbackCopyToClipboard(element: HTMLInputElement | HTMLTextAreaElement, wrapper: HTMLElement): void {
        const copyButton = wrapper.querySelector('button') as HTMLButtonElement;

        element.select();
        if (element instanceof HTMLInputElement) {
            element.setSelectionRange(0, 99999); // For mobile devices
        }

        try {
            document.execCommand('copy');
            this.showFeedback(element, t('feedback.copied_clipboard', 'Copied to clipboard'), 'success');

            // Show visual feedback with icon change
            if (copyButton) {
                this.showCopySuccess(copyButton, wrapper);
            }
        } catch (error) {
            this.showFeedback(element, 'Copy failed', 'error');
        }
    }

    /**
     * Show copy success visual feedback
     */
    private async showCopySuccess(button: HTMLButtonElement, wrapper: HTMLElement): Promise<void> {
        const successIcon = button.dataset.iconSuccess;
        const successLabel = button.dataset.labelSuccess;
        const defaultIcon = button.dataset.iconDefault;
        const labelElement = button.querySelector('.sr-only');

        if (successIcon && defaultIcon) {
            // Change to success icon
            await this.swapButtonIcon(button, successIcon);

            // Update label if available
            if (successLabel && labelElement) {
                const originalLabel = labelElement.textContent;
                labelElement.textContent = successLabel;

                // Revert to original icon and label after 2 seconds
                setTimeout(async () => {
                    await this.swapButtonIcon(button, defaultIcon);
                    if (originalLabel && labelElement) {
                        labelElement.textContent = originalLabel;
                    }
                }, 2000);
            } else {
                // Just revert icon after 2 seconds
                setTimeout(async () => {
                    await this.swapButtonIcon(button, defaultIcon);
                }, 2000);
            }
        }
    }

    /**
     * Toggle password visibility
     */
    private async togglePasswordVisibility(input: HTMLInputElement, button: HTMLButtonElement, wrapper: HTMLElement): Promise<void> {
        const isPassword = input.type === 'password';
        const newType = isPassword ? 'text' : 'password';

        // Get the icon names from button data attributes
        const defaultIcon = button.dataset.iconDefault;
        const toggleIcon = button.dataset.iconToggle;
        const defaultLabel = button.querySelector('.sr-only')?.textContent;
        const toggleLabel = button.dataset.labelToggle;

        // Toggle input type
        input.type = newType;

        // Update button icon and label based on current state
        const labelElement = button.querySelector('.sr-only');

        if (isPassword) {
            // Showing password (was hidden)
            if (toggleIcon) {
                await this.swapButtonIcon(button, toggleIcon);
            }
            if (toggleLabel && labelElement) {
                labelElement.textContent = toggleLabel;
            }
            button.setAttribute('aria-label', toggleLabel || 'Hide password');
        } else {
            // Hiding password (was visible)
            if (defaultIcon) {
                await this.swapButtonIcon(button, defaultIcon);
            }
            if (defaultLabel && labelElement) {
                labelElement.textContent = defaultLabel;
            }
            button.setAttribute('aria-label', defaultLabel || 'Show password');
        }
    }

    /**
     * Open external URL in new tab
     */
    private openExternalUrl(url?: string): void {
        if (!url) return;

        try {
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Failed to open external URL:', error);
        }
    }

    /**
     * Handle custom actions
     */
    private handleCustomAction(element: HTMLInputElement | HTMLTextAreaElement, action: string): void {
        // Custom actions can be handled by listening to the dispatched event
        console.log(`Custom action "${action}" triggered for element:`, element);
    }

    /**
     * Dispatch custom event for action
     */
    private dispatchActionEvent(element: HTMLInputElement | HTMLTextAreaElement, action: string): void {
        const event = new CustomEvent('form-action', {
            detail: {
                element,
                action,
                value: element.value
            } as FormActionEvent,
            bubbles: true
        });

        // Dispatch on both element and document for flexibility
        element.dispatchEvent(event);
    }

    /**
     * Show temporary feedback message
     */
    private showFeedback(element: HTMLInputElement | HTMLTextAreaElement, message: string, type: 'success' | 'error' = 'success'): void {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = `absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg z-10 pointer-events-none ${
            type === 'success'
                ? 'bg-success text-foreground-success'
                : 'bg-danger text-foreground-danger'
        }`;
        feedback.textContent = message;

        // Add to element container
        const container = element.closest('.relative');
        if (container) {
            container.appendChild(feedback);

            // Remove after 2 seconds
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 2000);
        }
    }

    /**
     * Add a custom action handler
     */
    public addActionHandler(action: string, handler: (element: HTMLInputElement | HTMLTextAreaElement) => void): void {
        document.addEventListener('form-action', (event) => {
            const customEvent = event as CustomEvent<FormActionEvent>;
            if (customEvent.detail.action === action) {
                handler(customEvent.detail.element);
            }
        });
    }

    /**
     * Destroy FormActions and clean up
     */
    public destroy(): void {
        this.initialized = false;
        // Event delegation handles cleanup automatically
        console.log('FormActions destroyed');
    }
}

// Export default instance
export default FormActions.getInstance();