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

import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

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

export class FormActions extends BaseActionClass {
    /**
     * Initialize form elements - required by BaseActionClass
     */
    protected initializeElements(): void {
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        EventUtils.handleDelegatedClick('[data-action] button', (button, event) => {
            event.preventDefault();
            this.handleActionClick(button as HTMLButtonElement);
        });

        EventUtils.handleDelegatedKeydown('[data-action] button', (button, event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.handleActionClick(button as HTMLButtonElement);
            }
        });
    }

    /**
     * Handle action button click
     */
    private async handleActionClick(button: HTMLButtonElement): Promise<void> {
        const wrapper = DOMUtils.findClosest(button, '[data-action]');
        const action = wrapper?.dataset.action;
        if (!action) return;

        const element = DOMUtils.findFormElementForAction(button);
        if (!element) return;

        const normalizedAction = action === 'password_toggle' ? 'toggle-password' : action;

        switch (normalizedAction) {
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
                this.openExternalUrl(wrapper.dataset.url);
                break;
            default:
                this.handleCustomAction(element, normalizedAction);
                break;
        }

        this.dispatchActionEvent(element, normalizedAction);
    }


    /**
     * Swap the icon using CSS classes and data attributes
     */
    private async swapButtonIcon(button: HTMLButtonElement, iconName: string): Promise<void> {
        button.setAttribute('data-current-icon', iconName);

        this.updateButtonIconState(button, iconName);
    }

    /**
     * Update button icon state using Tailwind classes
     */
    private updateButtonIconState(button: HTMLButtonElement, iconName: string): void {
        const defaultIcon = DOMUtils.querySelector('.button-icon-default', button) as HTMLElement;
        const toggleIcon = DOMUtils.querySelector('.button-icon-toggle', button) as HTMLElement;
        const successIcon = DOMUtils.querySelector('.button-icon-success', button) as HTMLElement;

        const defaultIconName = button.dataset.iconDefault;
        const toggleIconName = button.dataset.iconToggle;
        const successIconName = button.dataset.iconSuccess;

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
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    /**
     * Copy form element value to clipboard
     */
    private async copyToClipboard(element: HTMLInputElement | HTMLTextAreaElement, wrapper: HTMLElement): Promise<void> {
        const copyButton = DOMUtils.querySelector('button', wrapper) as HTMLButtonElement;

        try {
            await navigator.clipboard.writeText(element.value);
            this.showFeedback(element, t('feedback.copied_clipboard', 'Copied to clipboard'), 'success');

            if (copyButton) {
                await this.showCopySuccess(copyButton, wrapper);
            }
        } catch (error) {
            this.fallbackCopyToClipboard(element, wrapper);
        }
    }

    /**
     * Fallback copy method for older browsers
     */
    private fallbackCopyToClipboard(element: HTMLInputElement | HTMLTextAreaElement, wrapper: HTMLElement): void {
        const copyButton = DOMUtils.querySelector('button', wrapper) as HTMLButtonElement;

        element.select();
        if (element instanceof HTMLInputElement) {
            element.setSelectionRange(0, 99999);
        }

        try {
            document.execCommand('copy');
            this.showFeedback(element, t('feedback.copied_clipboard', 'Copied to clipboard'), 'success');

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
        const labelElement = DOMUtils.querySelector('.sr-only', button);

        if (successIcon && defaultIcon) {
            await this.swapButtonIcon(button, successIcon);

            if (successLabel && labelElement) {
                const originalLabel = labelElement.textContent;
                labelElement.textContent = successLabel;

                setTimeout(async () => {
                    await this.swapButtonIcon(button, defaultIcon);
                    if (originalLabel && labelElement) {
                        labelElement.textContent = originalLabel;
                    }
                }, 2000);
            } else {
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

        const defaultIcon = button.dataset.iconDefault;
        const toggleIcon = button.dataset.iconToggle;
        const defaultLabel = DOMUtils.querySelector('.sr-only', button)?.textContent;
        const toggleLabel = button.dataset.labelToggle;

        input.type = newType;

        const labelElement = DOMUtils.querySelector('.sr-only', button);

        if (isPassword) {
            if (toggleIcon) {
                await this.swapButtonIcon(button, toggleIcon);
            }
            if (toggleLabel && labelElement) {
                labelElement.textContent = toggleLabel;
            }
            button.setAttribute('aria-label', toggleLabel || 'Hide password');
        } else {
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

    }

    /**
     * Dispatch custom event for action
     */
    private dispatchActionEvent(element: HTMLInputElement | HTMLTextAreaElement, action: string): void {
        EventUtils.dispatchCustomEvent(element, 'form-action', {
            element,
            action,
            value: element.value
        } as FormActionEvent);
    }

    /**
     * Show temporary feedback message
     */
    private showFeedback(element: HTMLInputElement | HTMLTextAreaElement, message: string, type: 'success' | 'error' = 'success'): void {
        const feedback = document.createElement('div');
        feedback.className = `absolute top-full left-0 mt-1 px-2 py-1 text-xs rounded shadow-lg z-10 pointer-events-none ${
            type === 'success'
                ? 'bg-success text-white'
                : 'bg-danger text-white'
        }`;
        feedback.textContent = message;

        const container = DOMUtils.findClosest(element, '.relative');
        if (container) {
            container.appendChild(feedback);

            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 2000);
        }
    }

    /**
     * Add a custom action handler with automatic cleanup
     */
    public addActionHandler(action: string, handler: (element: HTMLInputElement | HTMLTextAreaElement) => void): () => void {
        return EventUtils.addEventListener(document, 'form-action', (event) => {
            const customEvent = event as CustomEvent<FormActionEvent>;
            if (customEvent.detail.action === action) {
                handler(customEvent.detail.element);
            }
        });
    }

    /**
     * Clean up FormActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
    }
}

export default FormActions.getInstance();
