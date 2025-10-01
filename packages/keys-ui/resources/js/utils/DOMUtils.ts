/**
 * DOMUtils - Shared DOM manipulation utilities for Keys UI action classes
 *
 * Eliminates code duplication across all action classes by providing:
 * - Safe element finding and querying
 * - Common element attribute checks
 * - Element relationship traversal
 * - Null-safe DOM operations
 */

export class DOMUtils {
    /**
     * Safely find the closest ancestor element matching selector
     */
    static findClosest(target: Node | Element | null, selector: string): HTMLElement | null {
        if (!target || !(target instanceof Element)) {
            return null;
        }
        return target.closest(selector) as HTMLElement || null;
    }

    /**
     * Find closest element with data attribute
     */
    static findClosestWithData(target: Element | null, dataAttribute: string): HTMLElement | null {
        return target?.closest(`[data-${dataAttribute}]`) as HTMLElement || null;
    }

    /**
     * Safely query selector within element or document
     */
    static querySelector(selector: string, container?: Element | Document): HTMLElement | null {
        const root = container || document;
        return root.querySelector(selector) as HTMLElement || null;
    }

    /**
     * Safely query all elements matching selector
     */
    static querySelectorAll(selector: string, container?: Element | Document): HTMLElement[] {
        const root = container || document;
        return Array.from(root.querySelectorAll(selector)) as HTMLElement[];
    }

    /**
     * Find elements with specific data attribute
     */
    static findByDataAttribute(dataAttribute: string, value?: string, container?: Element | Document): HTMLElement[] {
        const selector = value
            ? `[data-${dataAttribute}="${value}"]`
            : `[data-${dataAttribute}]`;
        return this.querySelectorAll(selector, container);
    }

    /**
     * Find single element with data attribute
     */
    static findFirstByDataAttribute(dataAttribute: string, value?: string, container?: Element | Document): HTMLElement | null {
        const selector = value
            ? `[data-${dataAttribute}="${value}"]`
            : `[data-${dataAttribute}]`;
        return this.querySelector(selector, container);
    }

    /**
     * Check if element has data attribute with optional value
     */
    static hasDataAttribute(element: HTMLElement, dataAttribute: string, value?: string): boolean {
        if (!element) return false;

        const attrValue = element.dataset[dataAttribute];
        if (value !== undefined) {
            return attrValue === value;
        }
        return attrValue !== undefined;
    }

    /**
     * Get data attribute value safely
     */
    static getDataAttribute(element: HTMLElement | null, dataAttribute: string): string | undefined {
        return element?.dataset[dataAttribute];
    }

    /**
     * Set data attribute safely
     */
    static setDataAttribute(element: HTMLElement | null, dataAttribute: string, value: string): void {
        if (element) {
            element.dataset[dataAttribute] = value;
        }
    }

    /**
     * Remove data attribute safely
     */
    static removeDataAttribute(element: HTMLElement | null, dataAttribute: string): void {
        if (element) {
            delete element.dataset[dataAttribute];
        }
    }

    /**
     * Check if element is disabled (multiple ways)
     */
    static isDisabled(element: HTMLElement | null): boolean {
        if (!element) return true;

        return element.hasAttribute('disabled') ||
               element.dataset.disabled === 'true' ||
               element.getAttribute('aria-disabled') === 'true';
    }

    /**
     * Check if element is hidden
     */
    static isHidden(element: HTMLElement | null): boolean {
        if (!element) return true;

        return element.hidden ||
               element.style.display === 'none' ||
               element.getAttribute('aria-hidden') === 'true' ||
               !element.offsetParent;
    }

    /**
     * Find form element (input/textarea) within container
     */
    static findFormElement(container: HTMLElement | null): HTMLInputElement | HTMLTextAreaElement | null {
        return container?.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement || null;
    }

    /**
     * Find form element associated with action button
     */
    static findFormElementForAction(button: HTMLElement): HTMLInputElement | HTMLTextAreaElement | null {
        let container = this.findClosest(button, '[data-input-actions="true"]');
        if (container && (container.tagName.toLowerCase() === 'input' || container.tagName.toLowerCase() === 'textarea')) {
            return container as HTMLInputElement | HTMLTextAreaElement;
        }

        container = this.findClosest(button, '*:has(input[data-input-actions="true"]), *:has(textarea[data-input-actions="true"])');
        if (container) {
            const formElement = this.findFormElement(container);
            if (formElement) {
                return formElement;
            }
        }

        let currentElement = button.parentElement;
        while (currentElement) {
            const formElement = this.findFormElement(currentElement);
            if (formElement) {
                return formElement;
            }
            currentElement = currentElement.parentElement;
        }

        return null;
    }

    /**
     * Get element by ID safely
     */
    static getElementById(id: string): HTMLElement | null {
        return document.getElementById(id) as HTMLElement || null;
    }

    /**
     * Check if element matches selector
     */
    static matches(element: HTMLElement | null, selector: string): boolean {
        return element?.matches?.(selector) ?? false;
    }

    /**
     * Find all child elements matching selector
     */
    static findChildren(parent: HTMLElement | null, selector: string): HTMLElement[] {
        if (!parent) return [];
        return Array.from(parent.children).filter(child =>
            this.matches(child as HTMLElement, selector)
        ) as HTMLElement[];
    }

    /**
     * Get next sibling element matching selector
     */
    static getNextSibling(element: HTMLElement | null, selector?: string): HTMLElement | null {
        let sibling = element?.nextElementSibling as HTMLElement;

        while (sibling) {
            if (!selector || this.matches(sibling, selector)) {
                return sibling;
            }
            sibling = sibling.nextElementSibling as HTMLElement;
        }

        return null;
    }

    /**
     * Get previous sibling element matching selector
     */
    static getPreviousSibling(element: HTMLElement | null, selector?: string): HTMLElement | null {
        let sibling = element?.previousElementSibling as HTMLElement;

        while (sibling) {
            if (!selector || this.matches(sibling, selector)) {
                return sibling;
            }
            sibling = sibling.previousElementSibling as HTMLElement;
        }

        return null;
    }

    /**
     * Add class safely
     */
    static addClass(element: HTMLElement | null, className: string): void {
        element?.classList.add(className);
    }

    /**
     * Remove class safely
     */
    static removeClass(element: HTMLElement | null, className: string): void {
        element?.classList.remove(className);
    }

    /**
     * Toggle class safely
     */
    static toggleClass(element: HTMLElement | null, className: string, force?: boolean): boolean {
        return element?.classList.toggle(className, force) ?? false;
    }

    /**
     * Check if element has class
     */
    static hasClass(element: HTMLElement | null, className: string): boolean {
        return element?.classList.contains(className) ?? false;
    }

    /**
     * Remove multiple classes safely
     */
    static removeClasses(element: HTMLElement | null, classNames: string[]): void {
        if (element) {
            element.classList.remove(...classNames);
        }
    }

    /**
     * Add multiple classes safely
     */
    static addClasses(element: HTMLElement | null, classNames: string[]): void {
        if (element) {
            element.classList.add(...classNames);
        }
    }

    /**
     * Set or remove attribute based on condition
     */
    static toggleAttribute(element: HTMLElement | null, attributeName: string, value?: string): void {
        if (!element) return;

        if (value !== undefined) {
            element.setAttribute(attributeName, value);
        } else {
            element.removeAttribute(attributeName);
        }
    }

    /**
     * Get element's computed style property
     */
    static getComputedStyle(element: HTMLElement | null, property: string): string {
        if (!element) return '';
        return window.getComputedStyle(element).getPropertyValue(property);
    }

    /**
     * Check if element is visible in viewport
     */
    static isInViewport(element: HTMLElement | null): boolean {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Get element's offset relative to document
     */
    static getElementOffset(element: HTMLElement | null): { top: number; left: number } {
        if (!element) return { top: 0, left: 0 };

        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    }

    /**
     * Focus element safely with optional delay
     */
    static focus(element: HTMLElement | null, delay?: number): void {
        if (!element) return;

        if (delay) {
            setTimeout(() => element.focus(), delay);
        } else {
            element.focus();
        }
    }

    /**
     * Scroll element into view safely
     */
    static scrollIntoView(element: HTMLElement | null, options?: ScrollIntoViewOptions): void {
        if (element) {
            element.scrollIntoView(options || { block: 'nearest' });
        }
    }

    /**
     * Remove element from DOM safely
     */
    static removeElement(element: HTMLElement | null): void {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    /**
     * Create element with optional classes and attributes
     */
    static createElement(tagName: string, options?: {
        classes?: string[];
        attributes?: Record<string, string>;
        textContent?: string;
        innerHTML?: string;
    }): HTMLElement {
        const element = document.createElement(tagName);

        if (options?.classes) {
            element.classList.add(...options.classes);
        }

        if (options?.attributes) {
            Object.entries(options.attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }

        if (options?.textContent) {
            element.textContent = options.textContent;
        }

        if (options?.innerHTML) {
            element.innerHTML = options.innerHTML;
        }

        return element;
    }
}

export default DOMUtils;