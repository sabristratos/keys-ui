/**
 * ButtonActions - Handles interactive multi-state button functionality
 *
 * Provides functionality for:
 * - Multi-state button interactions (default → toggle → success)
 * - Icon state transitions with smooth animations
 * - Label and accessibility updates
 * - Event handling for standalone buttons
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

interface ButtonState {
    current: 'default' | 'toggle' | 'success';
    cycling: boolean;
    element: HTMLButtonElement;
}

export class ButtonActions extends BaseActionClass {
    private buttonStates = new Map<HTMLButtonElement, ButtonState>();

    /**
     * Initialize multi-state button elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        const multiStateButtons = DOMUtils.querySelectorAll('[data-multi-state="true"]') as HTMLButtonElement[];

        multiStateButtons.forEach(button => {
            this.initializeButton(button);
        });
    }

    /**
     * Initialize a single multi-state button
     */
    private initializeButton(button: HTMLButtonElement): void {
        this.buttonStates.set(button, {
            current: 'default',
            cycling: false,
            element: button
        });

        this.updateIconState(button, 'default');
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        EventUtils.handleDelegatedClick('[data-multi-state="true"]', (button, event) => {
            event.preventDefault();
            this.handleButtonClick(button as HTMLButtonElement);
        });

        EventUtils.handleDelegatedKeydown('[data-multi-state="true"]', (button, event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.handleButtonClick(button as HTMLButtonElement);
            }
        });
    }

    /**
     * Handle multi-state button click
     */
    private async handleButtonClick(button: HTMLButtonElement): Promise<void> {
        const state = this.buttonStates.get(button);
        if (!state || state.cycling) return;

        const nextState = this.getNextState(state.current, button);

        state.cycling = true;
        await this.transitionToState(button, nextState);
        state.current = nextState;
        state.cycling = false;

        if (nextState === 'success') {
            setTimeout(async () => {
                if (state.current === 'success') {
                    state.cycling = true;
                    await this.transitionToState(button, 'default');
                    state.current = 'default';
                    state.cycling = false;
                }
            }, 2000);
        }

        this.dispatchButtonEvent(button, nextState);
    }

    /**
     * Determine the next state for a button
     */
    private getNextState(currentState: string, button: HTMLButtonElement): 'default' | 'toggle' | 'success' {
        const hasToggle = button.dataset.iconToggle;
        const hasSuccess = button.dataset.iconSuccess;

        switch (currentState) {
            case 'default':
                if (hasToggle) return 'toggle';
                if (hasSuccess) return 'success';
                return 'default';

            case 'toggle':
                if (hasSuccess) return 'success';
                return 'default';

            case 'success':
            default:
                return 'default';
        }
    }

    /**
     * Transition button to a specific state
     */
    private async transitionToState(button: HTMLButtonElement, state: 'default' | 'toggle' | 'success'): Promise<void> {
        this.updateIconState(button, state);

        this.updateButtonLabel(button, state);

        if (state === 'success') {
            this.animateSuccessFeedback(button);
        }
    }

    /**
     * Update button icon state using CSS classes
     */
    private updateIconState(button: HTMLButtonElement, state: 'default' | 'toggle' | 'success'): void {
        const defaultIcon = DOMUtils.querySelector('.button-icon-default', button) as HTMLElement;
        const toggleIcon = DOMUtils.querySelector('.button-icon-toggle', button) as HTMLElement;
        const successIcon = DOMUtils.querySelector('.button-icon-success', button) as HTMLElement;

        [defaultIcon, toggleIcon, successIcon].forEach(icon => {
            if (icon) {
                icon.classList.remove('opacity-100', 'scale-110');
                icon.classList.add('opacity-0');
            }
        });

        let targetIcon: HTMLElement | null = null;
        switch (state) {
            case 'default':
                targetIcon = defaultIcon;
                break;
            case 'toggle':
                targetIcon = toggleIcon;
                break;
            case 'success':
                targetIcon = successIcon;
                if (targetIcon) {
                    targetIcon.classList.add('scale-110');
                }
                break;
        }

        if (targetIcon) {
            targetIcon.classList.remove('opacity-0');
            targetIcon.classList.add('opacity-100');
        }
    }

    /**
     * Update button label and accessibility attributes
     */
    private updateButtonLabel(button: HTMLButtonElement, state: 'default' | 'toggle' | 'success'): void {
        const labelElement = DOMUtils.querySelector('.sr-only', button) as HTMLElement;

        let newLabel: string | null = null;
        let ariaLabel: string | null = null;

        switch (state) {
            case 'default':
                const originalLabel = this.getOriginalLabel(button);
                newLabel = originalLabel;
                ariaLabel = originalLabel;
                break;

            case 'toggle':
                newLabel = button.dataset.labelToggle || null;
                ariaLabel = button.dataset.labelToggle || null;
                break;

            case 'success':
                newLabel = button.dataset.labelSuccess || null;
                ariaLabel = button.dataset.labelSuccess || null;
                break;
        }

        if (newLabel && labelElement) {
            labelElement.textContent = newLabel;
        }

        if (ariaLabel) {
            button.setAttribute('aria-label', ariaLabel);
        }

        if (state === 'toggle') {
            button.setAttribute('aria-pressed', 'true');
        } else {
            button.removeAttribute('aria-pressed');
        }
    }

    /**
     * Get the original label for a button
     */
    private getOriginalLabel(button: HTMLButtonElement): string {
        if (button.dataset.originalLabel) {
            return button.dataset.originalLabel;
        }

        const textContent = button.textContent?.trim();
        if (textContent) {
            button.dataset.originalLabel = textContent;
            return textContent;
        }

        return button.getAttribute('aria-label') || 'Button';
    }

    /**
     * Animate success feedback with scale and timing
     */
    private animateSuccessFeedback(button: HTMLButtonElement): void {
        button.classList.add('scale-105');

        setTimeout(() => {
            button.classList.remove('scale-105');
        }, 200);
    }

    /**
     * Dispatch custom event for button state change
     */
    private dispatchButtonEvent(button: HTMLButtonElement, state: string): void {
        EventUtils.dispatchCustomEvent(button, 'button-state-change', {
            element: button,
            state: state,
            timestamp: Date.now()
        });
    }

    /**
     * Public method to manually set button state
     */
    public setButtonState(button: HTMLButtonElement, state: 'default' | 'toggle' | 'success'): void {
        const buttonState = this.buttonStates.get(button);
        if (!buttonState) {
            this.initializeButton(button);
        }

        this.transitionToState(button, state);
        if (buttonState) {
            buttonState.current = state;
        }
    }

    /**
     * Public method to get current button state
     */
    public getButtonState(button: HTMLButtonElement): string {
        const state = this.buttonStates.get(button);
        return state ? state.current : 'default';
    }

    /**
     * Add a custom state change handler with automatic cleanup
     */
    public addStateChangeHandler(handler: (button: HTMLButtonElement, state: string) => void): () => void {
        return EventUtils.addEventListener(document, 'button-state-change', (event) => {
            const customEvent = event as CustomEvent<{element: HTMLButtonElement, state: string}>;
            handler(customEvent.detail.element, customEvent.detail.state);
        });
    }

    /**
     * Clean up ButtonActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        this.buttonStates.clear();
    }
}

export default ButtonActions.getInstance();