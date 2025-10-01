/**
 * TextareaActions - Handles interactive features for textarea components
 *
 * Provides functionality for:
 * - Auto-resize based on content height
 * - Real-time character counting with visual feedback
 * - Max-length validation with warning states
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

interface TextareaEvent {
    element: HTMLTextAreaElement;
    currentLength: number;
    maxLength?: number;
}

export class TextareaActions extends BaseActionClass {
    private resizeObserver?: ResizeObserver;

    /**
     * Initialize textarea elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        this.initializeAutoResize();

        this.initializeCharacterCounts();
    }

    /**
     * Bind event listeners - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        EventUtils.handleDelegatedEvent('input', 'textarea[data-auto-resize="true"]', (textarea) => {
            this.handleAutoResize(textarea as HTMLTextAreaElement);
        });

        EventUtils.handleDelegatedEvent('input', 'textarea[data-show-character-count="true"]', (textarea) => {
            this.updateCharacterCount(textarea as HTMLTextAreaElement);
        });

        EventUtils.handleDelegatedEvent('paste', 'textarea[data-show-character-count="true"]', (textarea) => {
            setTimeout(() => {
                this.updateCharacterCount(textarea as HTMLTextAreaElement);
            }, 0);
        });

        EventUtils.handleDelegatedEvent('cut', 'textarea[data-show-character-count="true"]', (textarea) => {
            setTimeout(() => {
                this.updateCharacterCount(textarea as HTMLTextAreaElement);
            }, 0);
        });
    }

    /**
     * Initialize auto-resize functionality for existing textareas
     */
    private initializeAutoResize(): void {
        const autoResizeTextareas = DOMUtils.querySelectorAll('textarea[data-auto-resize="true"]');

        autoResizeTextareas.forEach((textarea) => {
            this.setupAutoResize(textarea as HTMLTextAreaElement);
        });
    }

    /**
     * Initialize character count displays for existing textareas
     */
    private initializeCharacterCounts(): void {
        const characterCountTextareas = DOMUtils.querySelectorAll('textarea[data-show-character-count="true"]');

        characterCountTextareas.forEach((textarea) => {
            this.updateCharacterCount(textarea as HTMLTextAreaElement);
        });
    }

    /**
     * Setup auto-resize for a textarea element
     */
    private setupAutoResize(textarea: HTMLTextAreaElement): void {
        const rows = parseInt(textarea.getAttribute('rows') || '3');
        const lineHeight = this.getLineHeight(textarea);
        const padding = this.getVerticalPadding(textarea);
        const minHeight = (rows * lineHeight) + padding;

        textarea.style.minHeight = `${minHeight}px`;

        textarea.style.resize = 'none';
        textarea.style.overflow = 'hidden';

        this.handleAutoResize(textarea);
    }

    /**
     * Handle auto-resize for textarea
     */
    private handleAutoResize(textarea: HTMLTextAreaElement): void {
        textarea.style.height = 'auto';

        const scrollHeight = textarea.scrollHeight;
        const minHeight = parseInt(textarea.style.minHeight || '0');

        const newHeight = Math.max(scrollHeight, minHeight);
        textarea.style.height = `${newHeight}px`;

        this.dispatchResizeEvent(textarea, newHeight);
    }

    /**
     * Update character count display
     */
    private updateCharacterCount(textarea: HTMLTextAreaElement): void {
        const id = textarea.id || textarea.name;
        if (!id) return;

        const countDisplay = DOMUtils.querySelector(`[data-character-count][data-target-id="${id}"]`);
        if (!countDisplay) return;

        const currentLength = textarea.value.length;
        const maxLength = parseInt(countDisplay.dataset.maxLength || '0') || null;

        const currentCountSpan = DOMUtils.querySelector('[data-current-count]', countDisplay);
        if (currentCountSpan) {
            currentCountSpan.textContent = currentLength.toString();
        }

        this.applyCharacterCountFeedback(countDisplay, textarea, currentLength, maxLength);

        this.dispatchCharacterCountEvent(textarea, currentLength, maxLength);
    }

    /**
     * Apply visual feedback for character count
     */
    private applyCharacterCountFeedback(
        countDisplay: HTMLElement,
        textarea: HTMLTextAreaElement,
        currentLength: number,
        maxLength: number | null
    ): void {
        if (!maxLength) return;

        countDisplay.classList.remove('text-muted', 'text-warning', 'text-danger');
        textarea.classList.remove('border-warning', 'border-danger', 'focus:border-warning', 'focus:border-danger', 'focus:ring-warning', 'focus:ring-danger');

        const percentage = (currentLength / maxLength) * 100;

        if (currentLength > maxLength) {
            countDisplay.classList.add('text-danger');
            textarea.classList.add('border-danger', 'focus:border-danger', 'focus:ring-danger');
        } else if (percentage >= 90) {
            countDisplay.classList.add('text-warning');
            textarea.classList.add('border-warning', 'focus:border-warning', 'focus:ring-warning');
        } else {
            countDisplay.classList.add('text-muted');
        }
    }

    /**
     * Get line height for textarea
     */
    private getLineHeight(textarea: HTMLTextAreaElement): number {
        const computedStyle = window.getComputedStyle(textarea);
        const lineHeight = computedStyle.lineHeight;

        if (lineHeight === 'normal') {
            const fontSize = parseFloat(computedStyle.fontSize);
            return fontSize * 1.2;
        }

        return parseFloat(lineHeight);
    }

    /**
     * Get vertical padding for textarea
     */
    private getVerticalPadding(textarea: HTMLTextAreaElement): number {
        const computedStyle = window.getComputedStyle(textarea);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const borderTop = parseFloat(computedStyle.borderTopWidth);
        const borderBottom = parseFloat(computedStyle.borderBottomWidth);

        return paddingTop + paddingBottom + borderTop + borderBottom;
    }

    /**
     * Dispatch resize event
     */
    private dispatchResizeEvent(textarea: HTMLTextAreaElement, newHeight: number): void {
        EventUtils.dispatchCustomEvent(textarea, 'textarea-resize', {
            element: textarea,
            height: newHeight
        });
    }

    /**
     * Dispatch character count event
     */
    private dispatchCharacterCountEvent(textarea: HTMLTextAreaElement, currentLength: number, maxLength?: number | null): void {
        EventUtils.dispatchCustomEvent(textarea, 'textarea-character-count', {
            element: textarea,
            currentLength,
            maxLength: maxLength || undefined
        } as TextareaEvent);
    }

    /**
     * Add a custom resize handler with automatic cleanup
     */
    public addResizeHandler(handler: (element: HTMLTextAreaElement, height: number) => void): () => void {
        return EventUtils.addEventListener(document, 'textarea-resize', (event) => {
            const customEvent = event as CustomEvent<{ element: HTMLTextAreaElement, height: number }>;
            handler(customEvent.detail.element, customEvent.detail.height);
        });
    }

    /**
     * Add a custom character count handler with automatic cleanup
     */
    public addCharacterCountHandler(handler: (data: TextareaEvent) => void): () => void {
        return EventUtils.addEventListener(document, 'textarea-character-count', (event) => {
            const customEvent = event as CustomEvent<TextareaEvent>;
            handler(customEvent.detail);
        });
    }

    /**
     * Clean up TextareaActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = undefined;
        }
    }

    /**
     * Manually trigger auto-resize for a specific textarea
     */
    public triggerAutoResize(textarea: HTMLTextAreaElement): void {
        if (textarea.dataset.autoResize === 'true') {
            this.handleAutoResize(textarea);
        }
    }

    /**
     * Manually trigger character count update for a specific textarea
     */
    public triggerCharacterCountUpdate(textarea: HTMLTextAreaElement): void {
        if (textarea.dataset.showCharacterCount === 'true') {
            this.updateCharacterCount(textarea);
        }
    }
}

export default TextareaActions.getInstance();