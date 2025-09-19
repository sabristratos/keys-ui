/**
 * RangeActions - Handles interactive functionality for Range components
 *
 * Provides functionality for:
 * - Single and dual handle dragging
 * - Tick snapping when enabled
 * - Value updates and visual feedback
 * - Keyboard navigation
 * - Livewire integration
 * - Touch support for mobile devices
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';

interface RangeConfig {
    min: number;
    max: number;
    step: number;
    dual: boolean;
    ticks: number[];
    disabled: boolean;
}

interface RangeState {
    minValue: number;
    maxValue: number;
    singleValue: number;
    isDragging: boolean;
    activeHandle: 'min' | 'max' | 'single' | null;
}

interface RangeElements {
    container: HTMLElement;
    track: HTMLElement;
    fill: HTMLElement;
    handles: {
        min?: HTMLElement;
        max?: HTMLElement;
        single?: HTMLElement;
    };
    inputs: {
        min?: HTMLInputElement;
        max?: HTMLInputElement;
        single?: HTMLInputElement;
    };
    hiddenInputs: {
        min?: HTMLInputElement;
        max?: HTMLInputElement;
        single?: HTMLInputElement;
    };
    valueDisplays: {
        min?: HTMLElement;
        max?: HTMLElement;
        single?: HTMLElement;
    };
}

interface RangeData {
    config: RangeConfig;
    state: RangeState;
    elements: RangeElements;
}

export class RangeActions extends BaseActionClass<RangeData> {

    /**
     * Initialize range elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.findByDataAttribute('range', 'true').forEach(container => {
            this.initializeRange(container);
        });
    }

    /**
     * Initialize a single range component
     */
    private initializeRange(container: HTMLElement): void {
        if (this.hasState(container)) {
            return; // Already initialized
        }

        const track = DOMUtils.querySelector('.range-track', container) as HTMLElement;
        if (!track) return;

        // Parse configuration
        const config: RangeConfig = {
            min: parseFloat(track.dataset.min || '0'),
            max: parseFloat(track.dataset.max || '100'),
            step: parseFloat(track.dataset.step || '1'),
            dual: track.dataset.dual === 'true',
            ticks: track.dataset.ticks ? JSON.parse(track.dataset.ticks) : [],
            disabled: track.dataset.disabled === 'true'
        };

        // Get elements
        const elements = this.getElements(container, config);
        if (!elements.track) return;

        // Initialize state
        const state: RangeState = {
            minValue: config.dual ? parseFloat(elements.inputs.min?.value || config.min.toString()) : config.min,
            maxValue: config.dual ? parseFloat(elements.inputs.max?.value || config.max.toString()) : config.max,
            singleValue: !config.dual ? parseFloat(elements.inputs.single?.value || config.min.toString()) : config.min,
            isDragging: false,
            activeHandle: null
        };

        this.setState(container, { config, state, elements });

        // Set up handle interactions if not disabled
        if (!config.disabled) {
            this.setupHandleInteractions(container, elements);
        }
    }

    /**
     * Get all relevant elements for a range component
     */
    private getElements(container: HTMLElement, config: RangeConfig): RangeElements {
        const track = DOMUtils.querySelector('.range-track', container) as HTMLElement;
        const fill = DOMUtils.querySelector('.range-fill', container) as HTMLElement;

        const handles: RangeElements['handles'] = {};
        const inputs: RangeElements['inputs'] = {};
        const hiddenInputs: RangeElements['hiddenInputs'] = {};
        const valueDisplays: RangeElements['valueDisplays'] = {};

        if (config.dual) {
            handles.min = DOMUtils.querySelector('[data-handle="min"]', container) as HTMLElement;
            handles.max = DOMUtils.querySelector('[data-handle="max"]', container) as HTMLElement;
            inputs.min = DOMUtils.querySelector('[data-native-input="min"]', container) as HTMLInputElement;
            inputs.max = DOMUtils.querySelector('[data-native-input="max"]', container) as HTMLInputElement;
            hiddenInputs.min = DOMUtils.querySelector('[data-range-input="min"]', container) as HTMLInputElement;
            hiddenInputs.max = DOMUtils.querySelector('[data-range-input="max"]', container) as HTMLInputElement;
            valueDisplays.min = DOMUtils.querySelector('[data-value-display="min"]', container) as HTMLElement;
            valueDisplays.max = DOMUtils.querySelector('[data-value-display="max"]', container) as HTMLElement;
        } else {
            handles.single = DOMUtils.querySelector('[data-handle="single"]', container) as HTMLElement;
            inputs.single = DOMUtils.querySelector('[data-native-input="single"]', container) as HTMLInputElement;
            hiddenInputs.single = DOMUtils.querySelector('[data-range-input="single"]', container) as HTMLInputElement;
            valueDisplays.single = DOMUtils.querySelector('[data-value-display="single"]', container) as HTMLElement;
        }

        return {
            container,
            track,
            fill,
            handles,
            inputs,
            hiddenInputs,
            valueDisplays
        };
    }

    /**
     * Set up handle interactions (mouse, touch, keyboard)
     */
    private setupHandleInteractions(container: HTMLElement, elements: RangeElements): void {
        const { handles } = elements;

        // Set up each handle
        Object.entries(handles).forEach(([handleType, handle]) => {
            if (!handle) return;

            // Mouse events
            handle.addEventListener('mousedown', (e) => this.handleStart(e, container, handleType as any));

            // Touch events
            handle.addEventListener('touchstart', (e) => this.handleStart(e, container, handleType as any), { passive: false });

            // Keyboard events
            handle.addEventListener('keydown', (e) => this.handleKeydown(e, container, handleType as any));

            // Focus events for accessibility
            handle.addEventListener('focus', () => this.handleFocus(container, handleType as any));
            handle.addEventListener('blur', () => this.handleBlur(container, handleType as any));
        });

        // Track click for jumping to position
        elements.track.addEventListener('click', (e) => this.handleTrackClick(e, container));
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Global mouse events for dragging
        EventUtils.addEventListener(document, 'mousemove', (e) => this.handleMove(e));
        EventUtils.addEventListener(document, 'mouseup', (e) => this.handleEnd(e));

        // Global touch events for dragging
        EventUtils.addEventListener(document, 'touchmove', (e) => this.handleMove(e), { passive: false });
        EventUtils.addEventListener(document, 'touchend', (e) => this.handleEnd(e));
        EventUtils.addEventListener(document, 'touchcancel', (e) => this.handleEnd(e));
    }

    /**
     * Setup dynamic observer for new ranges - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Check if the added node is a range
                    if (DOMUtils.hasDataAttribute(element, 'range', 'true')) {
                        this.initializeRange(element);
                    }

                    // Check for ranges within the added node
                    DOMUtils.findByDataAttribute('range', 'true', element).forEach(range => {
                        this.initializeRange(range);
                    });
                }
            });
        });
    }

    /**
     * Handle drag start
     */
    private handleStart(event: MouseEvent | TouchEvent, container: HTMLElement, handleType: 'min' | 'max' | 'single'): void {
        event.preventDefault();

        const rangeData = this.getState(container);
        if (!rangeData || rangeData.config.disabled) return;

        rangeData.state.isDragging = true;
        rangeData.state.activeHandle = handleType;

        const handle = rangeData.elements.handles[handleType];
        if (handle) {
            handle.classList.add('dragging');
            handle.focus();
        }

        // Add dragging class to container for smooth fill tracking
        container.classList.add('dragging');

        document.body.style.userSelect = 'none';
    }

    /**
     * Handle drag move
     */
    private handleMove(event: MouseEvent | TouchEvent): void {
        const draggingRange = Array.from(this.getAllStates().entries()).find(([_, data]) => data.state.isDragging);
        if (!draggingRange) return;

        event.preventDefault();

        const [container, rangeData] = draggingRange;
        const { config, state, elements } = rangeData;

        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const rect = elements.track.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

        let newValue = this.percentageToValue(percentage, config);
        newValue = this.snapToTickIfNeeded(newValue, config);

        this.updateValue(container, state.activeHandle!, newValue);
    }

    /**
     * Handle drag end
     */
    private handleEnd(event: MouseEvent | TouchEvent): void {
        const draggingRange = Array.from(this.getAllStates().entries()).find(([_, data]) => data.state.isDragging);
        if (!draggingRange) return;

        const [container, rangeData] = draggingRange;
        rangeData.state.isDragging = false;

        const handle = rangeData.elements.handles[rangeData.state.activeHandle!];
        if (handle) {
            handle.classList.remove('dragging');
        }

        // Remove dragging class from container to re-enable smooth transitions
        container.classList.remove('dragging');

        rangeData.state.activeHandle = null;
        document.body.style.userSelect = '';

        // Dispatch change event
        this.dispatchChangeEvent(container);
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeydown(event: KeyboardEvent, container: HTMLElement, handleType: 'min' | 'max' | 'single'): void {
        const rangeData = this.getState(container);
        if (!rangeData || rangeData.config.disabled) return;

        const { config, state } = rangeData;
        let handled = false;
        let newValue: number;

        const currentValue = handleType === 'min' ? state.minValue :
                            handleType === 'max' ? state.maxValue :
                            state.singleValue;

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                newValue = Math.max(config.min, currentValue - config.step);
                handled = true;
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                newValue = Math.min(config.max, currentValue + config.step);
                handled = true;
                break;
            case 'PageDown':
                newValue = Math.max(config.min, currentValue - config.step * 10);
                handled = true;
                break;
            case 'PageUp':
                newValue = Math.min(config.max, currentValue + config.step * 10);
                handled = true;
                break;
            case 'Home':
                newValue = config.min;
                handled = true;
                break;
            case 'End':
                newValue = config.max;
                handled = true;
                break;
        }

        if (handled) {
            event.preventDefault();
            newValue = this.snapToTickIfNeeded(newValue!, config);
            this.updateValue(container, handleType, newValue!);
            this.dispatchChangeEvent(container);
        }
    }

    /**
     * Handle track click to jump to position
     */
    private handleTrackClick(event: MouseEvent, container: HTMLElement): void {
        const rangeData = this.getState(container);
        if (!rangeData || rangeData.config.disabled) return;

        const { config, state } = rangeData;
        const rect = rangeData.elements.track.getBoundingClientRect();
        const percentage = (event.clientX - rect.left) / rect.width;
        let newValue = this.percentageToValue(percentage, config);
        newValue = this.snapToTickIfNeeded(newValue, config);

        if (config.dual) {
            // Determine which handle to move based on proximity
            const distToMin = Math.abs(newValue - state.minValue);
            const distToMax = Math.abs(newValue - state.maxValue);
            const handleType = distToMin <= distToMax ? 'min' : 'max';
            this.updateValue(container, handleType, newValue);
        } else {
            this.updateValue(container, 'single', newValue);
        }

        this.dispatchChangeEvent(container);
    }

    /**
     * Update a handle's value and visual position
     */
    private updateValue(container: HTMLElement, handleType: 'min' | 'max' | 'single', newValue: number): void {
        const rangeData = this.getState(container);
        if (!rangeData) return;

        const { config, state, elements } = rangeData;

        // Constrain dual range values
        if (config.dual) {
            if (handleType === 'min') {
                newValue = Math.min(newValue, state.maxValue);
                state.minValue = newValue;
            } else if (handleType === 'max') {
                newValue = Math.max(newValue, state.minValue);
                state.maxValue = newValue;
            }
        } else {
            state.singleValue = newValue;
        }

        // Update visual elements
        this.updateVisualElements(container);

        // Update form inputs
        this.updateFormInputs(container);

        // Dispatch input events for real-time updates
        this.dispatchInputEvent(container);
    }

    /**
     * Update visual elements (handles, fill, value displays)
     */
    private updateVisualElements(container: HTMLElement): void {
        const rangeData = this.getState(container);
        if (!rangeData) return;

        const { config, state, elements } = rangeData;

        if (config.dual) {
            const minPercent = this.valueToPercentage(state.minValue, config);
            const maxPercent = this.valueToPercentage(state.maxValue, config);

            // Update handles
            if (elements.handles.min) {
                elements.handles.min.style.left = `${minPercent}%`;
                elements.handles.min.setAttribute('aria-valuenow', state.minValue.toString());
                elements.handles.min.setAttribute('aria-valuetext', state.minValue.toString());
            }
            if (elements.handles.max) {
                elements.handles.max.style.left = `${maxPercent}%`;
                elements.handles.max.setAttribute('aria-valuenow', state.maxValue.toString());
                elements.handles.max.setAttribute('aria-valuetext', state.maxValue.toString());
            }

            // Update fill
            elements.fill.style.left = `${minPercent}%`;
            elements.fill.style.width = `${maxPercent - minPercent}%`;

            // Update value displays
            if (elements.valueDisplays.min) {
                elements.valueDisplays.min.textContent = state.minValue.toString();
            }
            if (elements.valueDisplays.max) {
                elements.valueDisplays.max.textContent = state.maxValue.toString();
            }
        } else {
            const percent = this.valueToPercentage(state.singleValue, config);

            // Update handle
            if (elements.handles.single) {
                elements.handles.single.style.left = `${percent}%`;
                elements.handles.single.setAttribute('aria-valuenow', state.singleValue.toString());
                elements.handles.single.setAttribute('aria-valuetext', state.singleValue.toString());
            }

            // Update fill
            elements.fill.style.width = `${percent}%`;

            // Update value display
            if (elements.valueDisplays.single) {
                elements.valueDisplays.single.textContent = state.singleValue.toString();
            }
        }
    }

    /**
     * Update form inputs for submission
     */
    private updateFormInputs(container: HTMLElement): void {
        const rangeData = this.getState(container);
        if (!rangeData) return;

        const { config, state, elements } = rangeData;

        if (config.dual) {
            if (elements.inputs.min) elements.inputs.min.value = state.minValue.toString();
            if (elements.inputs.max) elements.inputs.max.value = state.maxValue.toString();
            if (elements.hiddenInputs.min) elements.hiddenInputs.min.value = state.minValue.toString();
            if (elements.hiddenInputs.max) elements.hiddenInputs.max.value = state.maxValue.toString();
        } else {
            if (elements.inputs.single) elements.inputs.single.value = state.singleValue.toString();
            if (elements.hiddenInputs.single) elements.hiddenInputs.single.value = state.singleValue.toString();
        }
    }

    /**
     * Convert percentage to value
     */
    private percentageToValue(percentage: number, config: RangeConfig): number {
        const range = config.max - config.min;
        let value = config.min + (percentage * range);

        // Round to step
        value = Math.round(value / config.step) * config.step;

        // Clamp to bounds
        return Math.max(config.min, Math.min(config.max, value));
    }

    /**
     * Convert value to percentage
     */
    private valueToPercentage(value: number, config: RangeConfig): number {
        return ((value - config.min) / (config.max - config.min)) * 100;
    }

    /**
     * Snap value to nearest tick if ticks are enabled
     */
    private snapToTickIfNeeded(value: number, config: RangeConfig): number {
        if (config.ticks.length === 0) {
            return value;
        }

        let closest = config.ticks[0];
        let closestDistance = Math.abs(value - closest);

        for (const tick of config.ticks) {
            const distance = Math.abs(value - tick);
            if (distance < closestDistance) {
                closest = tick;
                closestDistance = distance;
            }
        }

        return closest;
    }

    /**
     * Handle focus events
     */
    private handleFocus(container: HTMLElement, handleType: 'min' | 'max' | 'single'): void {
        // Could add visual focus feedback here if needed
    }

    /**
     * Handle blur events
     */
    private handleBlur(container: HTMLElement, handleType: 'min' | 'max' | 'single'): void {
        // Could remove visual focus feedback here if needed
    }

    /**
     * Dispatch input event for real-time updates (e.g., Livewire)
     */
    private dispatchInputEvent(container: HTMLElement): void {
        const rangeData = this.getState(container);
        if (!rangeData) return;

        const { config, state } = rangeData;
        const value = config.dual ? [state.minValue, state.maxValue] : state.singleValue;

        EventUtils.dispatchCustomEvent(container, 'range-input', {
            value,
            dual: config.dual
        }, {
            bubbles: true,
            cancelable: true
        });

        // Also dispatch on hidden inputs for form frameworks
        if (config.dual) {
            rangeData.elements.hiddenInputs.min?.dispatchEvent(new Event('input', { bubbles: true }));
            rangeData.elements.hiddenInputs.max?.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            rangeData.elements.hiddenInputs.single?.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    /**
     * Dispatch change event when interaction is complete
     */
    private dispatchChangeEvent(container: HTMLElement): void {
        const rangeData = this.getState(container);
        if (!rangeData) return;

        const { config, state } = rangeData;
        const value = config.dual ? [state.minValue, state.maxValue] : state.singleValue;

        EventUtils.dispatchCustomEvent(container, 'range-change', {
            value,
            dual: config.dual
        }, {
            bubbles: true,
            cancelable: true
        });

        // Also dispatch on hidden inputs for form frameworks
        if (config.dual) {
            rangeData.elements.hiddenInputs.min?.dispatchEvent(new Event('change', { bubbles: true }));
            rangeData.elements.hiddenInputs.max?.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            rangeData.elements.hiddenInputs.single?.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    /**
     * Get current value for a range component
     */
    public getValue(container: HTMLElement): number | [number, number] | null {
        const rangeData = this.getState(container);
        if (!rangeData) return null;

        const { config, state } = rangeData;
        return config.dual ? [state.minValue, state.maxValue] : state.singleValue;
    }

    /**
     * Set value for a range component
     */
    public setValue(container: HTMLElement, value: number | [number, number]): void {
        const rangeData = this.getState(container);
        if (!rangeData) return;

        const { config } = rangeData;

        if (config.dual && Array.isArray(value)) {
            this.updateValue(container, 'min', value[0]);
            this.updateValue(container, 'max', value[1]);
        } else if (!config.dual && typeof value === 'number') {
            this.updateValue(container, 'single', value);
        }

        this.dispatchChangeEvent(container);
    }

    /**
     * Destroy range component
     */
    public destroy(container: HTMLElement): void {
        this.removeState(container);
    }

    /**
     * Destroy all range components and clean up
     */
    public destroyAll(): void {
        this.clearAllStates();
    }

    /**
     * Clean up RangeActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // RangeActions doesn't have additional cleanup beyond base class
        // Event listeners and observers are automatically cleaned up
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        RangeActions.getInstance().init();
    });
} else {
    RangeActions.getInstance().init();
}

// Export for global access
(window as any).RangeActions = RangeActions;

declare global {
    interface Window {
        RangeActions: typeof RangeActions;
    }
}

export default RangeActions.getInstance();