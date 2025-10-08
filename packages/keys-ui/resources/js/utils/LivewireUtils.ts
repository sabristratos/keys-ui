/**
 * @file LivewireUtils.ts
 * @description Provides a centralized set of utilities for interacting with the Livewire framework.
 * This class abstracts common tasks such as detecting Livewire, finding components,
 * and updating properties, ensuring a consistent integration pattern across all UI components.
 */

import { DOMUtils } from './DOMUtils';

export class LivewireUtils {
    /**
     * @description Checks if the global Livewire object is available on the window.
     * @returns {boolean} True if Livewire is available, false otherwise.
     */
    public static isLivewireAvailable(): boolean {
        return typeof window !== 'undefined' && 'Livewire' in window && window.Livewire !== undefined;
    }

    /**
     * @description Determines if a component is configured to interact with Livewire.
     * It checks for various data attributes commonly used for Livewire integration.
     * @param {HTMLElement} element The component's main HTML element.
     * @returns {boolean} True if the element is Livewire-enabled.
     */
    public static isLivewireEnabled(element: HTMLElement): boolean {
        return element.dataset.livewire === 'true' ||
            element.dataset.livewireEnabled === 'true' ||
            !!element.dataset.wireModel;
    }

    /**
     * @description Finds the associated Livewire component instance for a given HTML element.
     * It traverses up the DOM tree to find the closest element with a `wire:id`.
     * @param {HTMLElement} element The HTML element inside a Livewire component.
     * @returns {any | null} The Livewire component instance, or null if not found.
     */
    public static getLivewireComponent(element: HTMLElement): any | null {
        if (!this.isLivewireAvailable()) {
            return null;
        }

        const livewireElement = DOMUtils.findClosest(element, '[wire\\:id]');
        if (!livewireElement) {
            return null;
        }

        const componentId = livewireElement.getAttribute('wire:id');
        if (componentId && (window as any).Livewire.find) {
            return (window as any).Livewire.find(componentId);
        }

        return null;
    }

    /**
     * @description Extracts the `wire:model` property name from a component's element.
     * It checks for `data-wire-model` and other related attributes.
     * @param {HTMLElement} element The component's HTML element.
     * @returns {string | null} The name of the `wire:model` property, or null if not found.
     */
    public static getWireModelProperty(element: HTMLElement): string | null {
        return element.dataset.wireModel || element.dataset.livewireProperty || null;
    }

    /**
     * @description Updates a property on a Livewire component with a new value.
     * This is the primary method for syncing state from the frontend to Livewire.
     * @param {HTMLElement} element The element associated with the Livewire component.
     * @param {any} value The new value to set on the component's property.
     * @returns {void}
     */
    public static updateLivewireProperty(element: HTMLElement, value: any): void {
        const component = this.getLivewireComponent(element);
        const property = this.getWireModelProperty(element);

        if (component && property) {
            try {
                component.set(property, value);
            } catch (error) {
                console.warn(`[LivewireUtils] Failed to update Livewire property '${property}'.`, error);
            }
        }
    }

    /**
     * @description Dispatches the necessary DOM events on an input element to trigger
     * a `wire:model` update in Livewire.
     * @param {HTMLInputElement} input The input element tied to a `wire:model`.
     * @returns {void}
     */
    public static dispatchInputEvent(input: HTMLInputElement): void {
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        input.dispatchEvent(inputEvent);

        const changeEvent = new Event('change', { bubbles: true, cancelable: true });
        input.dispatchEvent(changeEvent);
    }
}

export default LivewireUtils;
