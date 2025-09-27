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
        // Initialize auto-resize textareas
        this.initializeAutoResize();

        // Initialize character count displays
        this.initializeCharacterCounts();
    }

    /**
     * Bind event listeners - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Handle textarea input events for auto-resize and character counting
        EventUtils.handleDelegatedEvent('input', 'textarea[data-auto-resize="true"]', (textarea) => {
            this.handleAutoResize(textarea as HTMLTextAreaElement);
        });

        // Handle character counting for textareas with character count displays
        EventUtils.handleDelegatedEvent('input', 'textarea[data-show-character-count="true"]', (textarea) => {
            this.updateCharacterCount(textarea as HTMLTextAreaElement);
        });

        // Handle paste events for character counting
        EventUtils.handleDelegatedEvent('paste', 'textarea[data-show-character-count="true"]', (textarea) => {
            // Use setTimeout to ensure paste content is processed
            setTimeout(() => {
                this.updateCharacterCount(textarea as HTMLTextAreaElement);
            }, 0);
        });

        // Handle cut events for character counting
        EventUtils.handleDelegatedEvent('cut', 'textarea[data-show-character-count="true"]', (textarea) => {
            // Use setTimeout to ensure cut content is processed
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
        // Store original min-height from rows attribute
        const rows = parseInt(textarea.getAttribute('rows') || '3');
        const lineHeight = this.getLineHeight(textarea);
        const padding = this.getVerticalPadding(textarea);
        const minHeight = (rows * lineHeight) + padding;

        textarea.style.minHeight = `${minHeight}px`;

        // Ensure textarea has the right styles for auto-resize
        textarea.style.resize = 'none';
        textarea.style.overflow = 'hidden';

        // Set initial height
        this.handleAutoResize(textarea);
    }

    /**
     * Handle auto-resize for textarea
     */
    private handleAutoResize(textarea: HTMLTextAreaElement): void {
        // Reset height to auto to measure actual content height
        textarea.style.height = 'auto';

        // Get the scroll height (actual content height)
        const scrollHeight = textarea.scrollHeight;
        const minHeight = parseInt(textarea.style.minHeight || '0');

        // Set new height (at least min-height)
        const newHeight = Math.max(scrollHeight, minHeight);
        textarea.style.height = `${newHeight}px`;

        // Dispatch custom event for other components that might need to react
        this.dispatchResizeEvent(textarea, newHeight);
    }

    /**
     * Update character count display
     */
    private updateCharacterCount(textarea: HTMLTextAreaElement): void {
        const id = textarea.id || textarea.name;
        if (!id) return;

        // Find the character count display element
        const countDisplay = DOMUtils.querySelector(`[data-character-count][data-target-id="${id}"]`);
        if (!countDisplay) return;

        const currentLength = textarea.value.length;
        const maxLength = parseInt(countDisplay.dataset.maxLength || '0') || null;

        // Update current count
        const currentCountSpan = DOMUtils.querySelector('[data-current-count]', countDisplay);
        if (currentCountSpan) {
            currentCountSpan.textContent = currentLength.toString();
        }

        // Apply visual feedback based on character count
        this.applyCharacterCountFeedback(countDisplay, textarea, currentLength, maxLength);

        // Dispatch event for other components
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

        // Remove existing color classes
        countDisplay.classList.remove('text-muted', 'text-warning', 'text-danger');
        textarea.classList.remove('border-warning', 'border-danger', 'focus:border-warning', 'focus:border-danger', 'focus:ring-warning', 'focus:ring-danger');

        const percentage = (currentLength / maxLength) * 100;

        if (currentLength > maxLength) {
            // Over limit - error state
            countDisplay.classList.add('text-danger');
            textarea.classList.add('border-danger', 'focus:border-danger', 'focus:ring-danger');
        } else if (percentage >= 90) {
            // Near limit - warning state
            countDisplay.classList.add('text-warning');
            textarea.classList.add('border-warning', 'focus:border-warning', 'focus:ring-warning');
        } else {
            // Normal state
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
            // Estimate normal line height (usually 1.2 * font-size)
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