/**
 * EventUtils - Shared event management utilities for Keys UI action classes
 *
 * Eliminates code duplication across all action classes by providing:
 * - Event delegation setup and management
 * - Custom event creation and dispatching
 * - Event cleanup and unbinding
 * - Keyboard event handling utilities
 */

export interface CustomEventDetail {
    [key: string]: any;
}

export class EventUtils {
    /**
     * Create and dispatch custom event
     */
    static dispatchCustomEvent(
        element: HTMLElement,
        eventName: string,
        detail?: CustomEventDetail,
        options?: {
            bubbles?: boolean;
            cancelable?: boolean;
        }
    ): boolean {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: options?.bubbles ?? true,
            cancelable: options?.cancelable ?? true
        });

        return element.dispatchEvent(event);
    }

    /**
     * Add event listener with automatic cleanup tracking
     */
    static addEventListener(
        target: Element | Document | Window,
        eventType: string,
        handler: EventListener,
        options?: AddEventListenerOptions
    ): () => void {
        target.addEventListener(eventType, handler, options);

        // Return cleanup function
        return () => {
            target.removeEventListener(eventType, handler, options);
        };
    }

    /**
     * Handle generic events with delegation
     */
    static handleDelegatedEvent(
        eventType: string,
        selector: string,
        handler: (element: HTMLElement, event: Event) => void,
        container?: Element
    ): () => void {
        const target = container || document;

        const eventHandler = (event: Event) => {
            // Safely handle event.target which might be a text node
            const eventTarget = event.target as Node;
            let element: HTMLElement | null = null;

            if (eventTarget instanceof Element) {
                element = eventTarget.closest(selector) as HTMLElement;
            }

            if (element) {
                handler(element, event);
            }
        };

        return this.addEventListener(target, eventType, eventHandler);
    }

    /**
     * Handle click events with delegation
     */
    static handleDelegatedClick(
        selector: string,
        handler: (element: HTMLElement, event: MouseEvent) => void,
        container?: Element
    ): () => void {
        const target = container || document;

        const clickHandler = (event: Event) => {
            const mouseEvent = event as MouseEvent;
            const eventTarget = mouseEvent.target as Node;
            let element: HTMLElement | null = null;

            if (eventTarget instanceof Element) {
                element = eventTarget.closest(selector) as HTMLElement;
            }

            if (element) {
                handler(element, mouseEvent);
            }
        };

        return this.addEventListener(target, 'click', clickHandler);
    }

    /**
     * Handle keydown events with delegation
     */
    static handleDelegatedKeydown(
        selector: string,
        handler: (element: HTMLElement, event: KeyboardEvent) => void,
        container?: Element
    ): () => void {
        const target = container || document;

        const keydownHandler = (event: Event) => {
            const keyboardEvent = event as KeyboardEvent;
            const eventTarget = keyboardEvent.target as Node;
            let element: HTMLElement | null = null;

            if (eventTarget instanceof Element) {
                element = eventTarget.closest(selector) as HTMLElement;
            }

            if (element) {
                handler(element, keyboardEvent);
            }
        };

        return this.addEventListener(target, 'keydown', keydownHandler);
    }

    /**
     * Handle specific key presses
     */
    static handleKeyPress(
        keys: string[],
        handler: (key: string, event: KeyboardEvent) => void,
        options?: {
            preventDefault?: boolean;
            stopPropagation?: boolean;
        }
    ): (event: KeyboardEvent) => void {
        return (event: KeyboardEvent) => {
            if (keys.includes(event.key)) {
                if (options?.preventDefault) {
                    event.preventDefault();
                }
                if (options?.stopPropagation) {
                    event.stopPropagation();
                }
                handler(event.key, event);
            }
        };
    }

    /**
     * Handle input events with delegation
     */
    static handleDelegatedInput(
        selector: string,
        handler: (element: HTMLInputElement | HTMLTextAreaElement, event: InputEvent) => void,
        container?: Element
    ): () => void {
        const target = container || document;

        const inputHandler = (event: Event) => {
            const inputEvent = event as InputEvent;
            const eventTarget = inputEvent.target as Node;
            let element: HTMLInputElement | HTMLTextAreaElement | null = null;

            if (eventTarget instanceof Element) {
                element = eventTarget.closest(selector) as HTMLInputElement | HTMLTextAreaElement;
            }

            if (element) {
                handler(element, inputEvent);
            }
        };

        return this.addEventListener(target, 'input', inputHandler);
    }

    /**
     * Handle change events with delegation
     */
    static handleDelegatedChange(
        selector: string,
        handler: (element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, event: Event) => void,
        container?: Element
    ): () => void {
        const target = container || document;

        const changeHandler = (event: Event) => {
            const eventTarget = event.target as Node;
            let element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null = null;

            if (eventTarget instanceof Element) {
                element = eventTarget.closest(selector) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            }

            if (element) {
                handler(element, event);
            }
        };

        return this.addEventListener(target, 'change', changeHandler);
    }

    /**
     * Handle focus events with delegation
     */
    static handleDelegatedFocus(
        selector: string,
        handler: (element: HTMLElement, event: FocusEvent) => void,
        container?: Element
    ): () => void {
        const target = container || document;

        const focusHandler = (event: Event) => {
            const focusEvent = event as FocusEvent;
            const eventTarget = focusEvent.target as Node;
            let element: HTMLElement | null = null;

            if (eventTarget instanceof Element) {
                element = eventTarget.closest(selector) as HTMLElement;
            }

            if (element) {
                handler(element, focusEvent);
            }
        };

        return this.addEventListener(target, 'focusin', focusHandler);
    }

    /**
     * Create debounced event handler
     */
    static debounce<T extends (...args: any[]) => any>(
        func: T,
        delay: number
    ): (...args: Parameters<T>) => void {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        return (...args: Parameters<T>) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    }

    /**
     * Create throttled event handler
     */
    static throttle<T extends (...args: any[]) => any>(
        func: T,
        delay: number
    ): (...args: Parameters<T>) => void {
        let isThrottled = false;

        return (...args: Parameters<T>) => {
            if (!isThrottled) {
                func(...args);
                isThrottled = true;

                setTimeout(() => {
                    isThrottled = false;
                }, delay);
            }
        };
    }

    /**
     * Handle window resize with debouncing
     */
    static handleResize(
        handler: () => void,
        delay: number = 100
    ): () => void {
        const debouncedHandler = this.debounce(handler, delay);
        return this.addEventListener(window, 'resize', debouncedHandler);
    }

    /**
     * Handle click outside element
     */
    static handleClickOutside(
        element: HTMLElement,
        handler: (event: MouseEvent) => void
    ): () => void {
        const clickHandler = (event: Event) => {
            const mouseEvent = event as MouseEvent;
            const target = mouseEvent.target as Element;

            if (!element.contains(target)) {
                handler(mouseEvent);
            }
        };

        return this.addEventListener(document, 'click', clickHandler);
    }

    /**
     * Handle escape key globally
     */
    static handleEscape(handler: (event: KeyboardEvent) => void): () => void {
        const keyHandler = this.handleKeyPress(['Escape'], handler);
        return this.addEventListener(document, 'keydown', keyHandler);
    }

    /**
     * Prevent default and stop propagation helper
     */
    static preventAndStop(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }

    /**
     * Check if event should be handled (not disabled/hidden)
     */
    static shouldHandleEvent(element: HTMLElement): boolean {
        return !element.hasAttribute('disabled') &&
               element.dataset.disabled !== 'true' &&
               element.getAttribute('aria-disabled') !== 'true' &&
               element.offsetParent !== null;
    }

    /**
     * Handle form submission with validation
     */
    static handleFormSubmission(
        form: HTMLFormElement,
        handler: (formData: FormData, event: SubmitEvent) => void,
        validate?: (form: HTMLFormElement) => boolean
    ): () => void {
        const submitHandler = (event: Event) => {
            const submitEvent = event as SubmitEvent;

            if (validate && !validate(form)) {
                event.preventDefault();
                return;
            }

            const formData = new FormData(form);
            handler(formData, submitEvent);
        };

        return this.addEventListener(form, 'submit', submitHandler);
    }

    /**
     * Create event cleanup manager
     */
    static createCleanupManager(): {
        add: (cleanup: () => void) => void;
        cleanup: () => void;
    } {
        const cleanupFunctions: (() => void)[] = [];

        return {
            add: (cleanup: () => void) => {
                cleanupFunctions.push(cleanup);
            },
            cleanup: () => {
                cleanupFunctions.forEach(fn => fn());
                cleanupFunctions.length = 0;
            }
        };
    }

    /**
     * Common keyboard navigation handler
     */
    static createNavigationHandler(options: {
        onArrowUp?: () => void;
        onArrowDown?: () => void;
        onArrowLeft?: () => void;
        onArrowRight?: () => void;
        onEnter?: () => void;
        onSpace?: () => void;
        onEscape?: () => void;
        onHome?: () => void;
        onEnd?: () => void;
        onTab?: () => void;
        preventDefault?: string[];
    }): (event: KeyboardEvent) => void {
        return (event: KeyboardEvent) => {
            const { key } = event;
            const shouldPrevent = options.preventDefault?.includes(key) ?? true;

            switch (key) {
                case 'ArrowUp':
                    if (shouldPrevent) event.preventDefault();
                    options.onArrowUp?.();
                    break;
                case 'ArrowDown':
                    if (shouldPrevent) event.preventDefault();
                    options.onArrowDown?.();
                    break;
                case 'ArrowLeft':
                    if (shouldPrevent) event.preventDefault();
                    options.onArrowLeft?.();
                    break;
                case 'ArrowRight':
                    if (shouldPrevent) event.preventDefault();
                    options.onArrowRight?.();
                    break;
                case 'Enter':
                    if (shouldPrevent) event.preventDefault();
                    options.onEnter?.();
                    break;
                case ' ':
                    if (shouldPrevent) event.preventDefault();
                    options.onSpace?.();
                    break;
                case 'Escape':
                    if (shouldPrevent) event.preventDefault();
                    options.onEscape?.();
                    break;
                case 'Home':
                    if (shouldPrevent) event.preventDefault();
                    options.onHome?.();
                    break;
                case 'End':
                    if (shouldPrevent) event.preventDefault();
                    options.onEnd?.();
                    break;
                case 'Tab':
                    options.onTab?.();
                    break;
            }
        };
    }
}

export default EventUtils;