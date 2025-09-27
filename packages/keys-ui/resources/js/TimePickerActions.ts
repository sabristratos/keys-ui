/**
 * TimePickerActions - Handles interactive functionality for TimePicker components
 *
 * Provides functionality for:
 * - Time input validation and formatting
 * - Dropdown open/close with keyboard navigation
 * - Time selection via dropdown lists
 * - Format switching (12/24 hour)
 * - Keyboard shortcuts and arrow key increments
 * - Time constraints validation
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import { FloatingManager, FloatingInstance } from './utils/FloatingManager';

interface TimePickerState {
    isOpen: boolean;
    format: '12' | '24';
    showSeconds: boolean;
    hour: number;
    minute: number;
    second: number;
    period: 'AM' | 'PM';
    step: number;
    minTime: string | null;
    maxTime: string | null;
    value: string | null;
    floating?: FloatingInstance;
}

interface ParsedTime {
    hour: number;
    minute: number;
    second: number;
    period?: 'AM' | 'PM';
}

export class TimePickerActions extends BaseActionClass<TimePickerState> {

    /**
     * Initialize timepicker elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.querySelectorAll('[data-keys-timepicker]').forEach(timepicker => {
            this.initializeTimePicker(timepicker as HTMLElement);
        });
    }

    /**
     * Initialize a single timepicker element
     */
    private initializeTimePicker(timePickerElement: HTMLElement): void {
        console.log('🕒 Initializing TimePicker:', timePickerElement);

        if (this.hasState(timePickerElement)) {
            console.log('🕒 TimePicker already initialized, skipping');
            return;
        }

        const format = (timePickerElement.dataset.format as '12' | '24') || '24';
        const showSeconds = timePickerElement.dataset.showSeconds === 'true';
        const step = parseInt(timePickerElement.dataset.step || '1');
        const minTime = timePickerElement.dataset.minTime || null;
        const maxTime = timePickerElement.dataset.maxTime || null;
        const initialValue = timePickerElement.dataset.value || null;

        console.log('🕒 TimePicker config:', { format, showSeconds, step, minTime, maxTime, initialValue });

        const currentTime = this.parseTime(initialValue) || this.getCurrentTime();

        const state: TimePickerState = {
            isOpen: false,
            format,
            showSeconds,
            hour: currentTime.hour,
            minute: currentTime.minute,
            second: currentTime.second,
            period: currentTime.period || 'AM',
            step,
            minTime,
            maxTime,
            value: initialValue
        };

        this.setState(timePickerElement, state);
        this.updateDisplay(timePickerElement);
        this.updateSelectedStates(timePickerElement);
        this.updateClearButtonVisibility(timePickerElement, initialValue || '');

        console.log('🕒 TimePicker initialized successfully with state:', state);
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Trigger click - let native popover handle the opening/closing
        EventUtils.handleDelegatedClick('[data-timepicker-trigger]', (trigger, event) => {
            console.log('🕒 TimePicker trigger clicked:', trigger);
            // Don't prevent default - let native popover API handle the toggle
            const timepicker = DOMUtils.findClosest(trigger, '[data-keys-timepicker]') as HTMLElement;
            if (timepicker && !this.isDisabled(timepicker)) {
                console.log('🕒 Native popover will handle toggle for:', timepicker);
                // Update our internal state but let popover handle the UI
                const state = this.getState(timepicker);
                if (state) {
                    // The popover will handle opening/closing, we just track state
                    console.log('🕒 Current TimePicker state:', state);
                }
            } else {
                console.log('🕒 TimePicker trigger ignored - disabled or not found');
                event.preventDefault(); // Only prevent default if disabled
            }
        });

        // Clear button
        EventUtils.handleDelegatedClick('[data-timepicker-clear]', (clearButton, event) => {
            console.log('🕒 TimePicker clear button clicked:', clearButton);
            event.preventDefault();
            event.stopPropagation();
            const timepicker = DOMUtils.findClosest(clearButton, '[data-keys-timepicker]') as HTMLElement;
            if (timepicker) {
                console.log('🕒 Clearing TimePicker value for:', timepicker);
                this.clearTime(timepicker);
            }
        });

        // Hour selection
        EventUtils.handleDelegatedClick('[data-timepicker-hour]', (hourButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(hourButton, '[data-keys-timepicker]') as HTMLElement;
            const hour = parseInt(hourButton.dataset.timepickerHour || '0');
            if (timepicker) {
                this.setHour(timepicker, hour);
            }
        });

        // Minute selection
        EventUtils.handleDelegatedClick('[data-timepicker-minute]', (minuteButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(minuteButton, '[data-keys-timepicker]') as HTMLElement;
            const minute = parseInt(minuteButton.dataset.timepickerMinute || '0');
            if (timepicker) {
                this.setMinute(timepicker, minute);
            }
        });

        // Second selection
        EventUtils.handleDelegatedClick('[data-timepicker-second]', (secondButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(secondButton, '[data-keys-timepicker]') as HTMLElement;
            const second = parseInt(secondButton.dataset.timepickerSecond || '0');
            if (timepicker) {
                this.setSecond(timepicker, second);
            }
        });

        // Period selection
        EventUtils.handleDelegatedClick('[data-timepicker-period]', (periodButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(periodButton, '[data-keys-timepicker]') as HTMLElement;
            const period = periodButton.dataset.timepickerPeriod as 'AM' | 'PM';
            if (timepicker) {
                this.setPeriod(timepicker, period);
            }
        });

        // Format toggle
        EventUtils.handleDelegatedClick('[data-timepicker-format]', (formatButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(formatButton, '[data-keys-timepicker]') as HTMLElement;
            const format = formatButton.dataset.timepickerFormat as '12' | '24';
            if (timepicker) {
                this.setFormat(timepicker, format);
            }
        });

        // Now button
        EventUtils.handleDelegatedClick('[data-timepicker-now]', (nowButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(nowButton, '[data-keys-timepicker]') as HTMLElement;
            if (timepicker) {
                this.setToCurrentTime(timepicker);
            }
        });

        // Apply button
        EventUtils.handleDelegatedClick('[data-timepicker-apply]', (applyButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(applyButton, '[data-keys-timepicker]') as HTMLElement;
            if (timepicker) {
                this.applyTime(timepicker);
            }
        });

        // Cancel button
        EventUtils.handleDelegatedClick('[data-timepicker-cancel]', (cancelButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(cancelButton, '[data-keys-timepicker]') as HTMLElement;
            if (timepicker) {
                this.closeDropdown(timepicker);
            }
        });

        // Click outside to close
        EventUtils.addEventListener(document, 'click', (event) => {
            const target = event.target as Node;

            // Check if the click was inside any timepicker element
            if (target && target instanceof Element) {
                const closestTimePicker = target.closest('[data-keys-timepicker]');

                // If click is not inside any timepicker, close all dropdowns
                if (!closestTimePicker) {
                    this.closeAllDropdowns();
                }
            }
        });

        // Keyboard navigation
        EventUtils.handleDelegatedKeydown('[data-keys-timepicker]', (timepicker, event) => {
            this.handleKeydown(timepicker as HTMLElement, event);
        });
    }

    /**
     * Setup dynamic observer for new timepickers - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Check if the added node is a timepicker
                    if (element.matches && element.matches('[data-keys-timepicker]')) {
                        this.initializeTimePicker(element);
                    }

                    // Check for timepickers within the added node
                    DOMUtils.querySelectorAll('[data-keys-timepicker]', element).forEach(timepicker => {
                        this.initializeTimePicker(timepicker as HTMLElement);
                    });
                }
            });
        });
    }

    /**
     * Toggle dropdown open/closed state
     */
    private toggleDropdown(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        if (state.isOpen) {
            this.closeDropdown(timepicker);
        } else {
            this.openDropdown(timepicker);
        }
    }

    /**
     * Open dropdown
     */
    private openDropdown(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state || this.isDisabled(timepicker)) return;

        this.closeAllDropdowns();

        state.isOpen = true;
        this.setState(timepicker, state);

        // For popover-based approach, we don't manually show/hide
        // The popover component handles this through its own mechanisms
        const trigger = DOMUtils.querySelector('[data-timepicker-trigger]', timepicker) as HTMLElement;

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'true');
        }

        this.updateSelectedStates(timepicker);
        this.scrollToSelectedOptions(timepicker);

        this.dispatchTimePickerEvent(timepicker, 'timepicker:open');
    }

    /**
     * Close dropdown
     */
    private closeDropdown(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        // Clean up floating instance
        if (state.floating) {
            state.floating.cleanup();
            state.floating = undefined;
        }

        state.isOpen = false;
        this.setState(timepicker, state);

        // Actually close the popover by finding and clicking the trigger or using popover API
        const trigger = DOMUtils.querySelector('[data-timepicker-trigger]', timepicker) as HTMLElement;
        const popover = DOMUtils.querySelector('[data-popover]', timepicker) as HTMLElement;

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
        }

        // Try to close using popover API if available
        if (popover && 'hidePopover' in popover) {
            try {
                (popover as any).hidePopover();
            } catch (e) {
                // Fallback: trigger click to close popover
                console.log('Fallback: triggering click to close popover');
                if (trigger) {
                    trigger.click();
                }
            }
        } else if (trigger) {
            // Fallback: trigger click to close popover
            trigger.click();
        }

        this.dispatchTimePickerEvent(timepicker, 'timepicker:close');
    }

    /**
     * Close all open dropdowns
     */
    private closeAllDropdowns(): void {
        this.getAllStates().forEach((state, timepicker) => {
            if (state.isOpen) {
                this.closeDropdown(timepicker);
            }
        });
    }

    /**
     * Set hour value
     */
    private setHour(timepicker: HTMLElement, hour: number): void {
        const state = this.getState(timepicker);
        if (!state) return;

        state.hour = hour;
        this.setState(timepicker, state);
        this.updateSelectedStates(timepicker);
        this.updatePreview(timepicker);
    }

    /**
     * Set minute value
     */
    private setMinute(timepicker: HTMLElement, minute: number): void {
        const state = this.getState(timepicker);
        if (!state) return;

        state.minute = minute;
        this.setState(timepicker, state);
        this.updateSelectedStates(timepicker);
        this.updatePreview(timepicker);
    }

    /**
     * Set second value
     */
    private setSecond(timepicker: HTMLElement, second: number): void {
        const state = this.getState(timepicker);
        if (!state) return;

        state.second = second;
        this.setState(timepicker, state);
        this.updateSelectedStates(timepicker);
        this.updatePreview(timepicker);
    }

    /**
     * Set period (AM/PM)
     */
    private setPeriod(timepicker: HTMLElement, period: 'AM' | 'PM'): void {
        const state = this.getState(timepicker);
        if (!state) return;

        state.period = period;
        this.setState(timepicker, state);
        this.updateSelectedStates(timepicker);
        this.updatePreview(timepicker);
    }

    /**
     * Convert hour between 12h and 24h formats
     */
    private convertHourBetweenFormats(hour: number, fromFormat: '12' | '24', toFormat: '12' | '24', period?: 'AM' | 'PM'): { hour: number; period?: 'AM' | 'PM' } {
        if (fromFormat === toFormat) {
            return { hour, period };
        }

        if (fromFormat === '24' && toFormat === '12') {
            // Convert 24h to 12h
            if (hour === 0) {
                return { hour: 12, period: 'AM' }; // 00:XX → 12:XX AM (midnight)
            } else if (hour >= 1 && hour <= 11) {
                return { hour, period: 'AM' }; // 01:XX-11:XX → 1:XX-11:XX AM
            } else if (hour === 12) {
                return { hour: 12, period: 'PM' }; // 12:XX → 12:XX PM (noon)
            } else {
                return { hour: hour - 12, period: 'PM' }; // 13:XX-23:XX → 1:XX-11:XX PM
            }
        } else if (fromFormat === '12' && toFormat === '24') {
            // Convert 12h to 24h
            if (!period) {
                throw new Error('Period (AM/PM) required for 12h to 24h conversion');
            }

            if (period === 'AM') {
                if (hour === 12) {
                    return { hour: 0 }; // 12:XX AM → 00:XX (midnight)
                } else {
                    return { hour }; // 1:XX-11:XX AM → 01:XX-11:XX
                }
            } else { // PM
                if (hour === 12) {
                    return { hour: 12 }; // 12:XX PM → 12:XX (noon)
                } else {
                    return { hour: hour + 12 }; // 1:XX-11:XX PM → 13:XX-23:XX
                }
            }
        }

        return { hour, period };
    }

    /**
     * Set format (12/24 hour)
     */
    private setFormat(timepicker: HTMLElement, format: '12' | '24'): void {
        const state = this.getState(timepicker);
        if (!state) return;

        // Check if format switching is allowed
        const formatMode = timepicker.dataset.formatMode;
        if (formatMode === '12' || formatMode === '24') {
            // Format is locked, don't allow switching
            console.warn(`TimePicker format is locked to ${formatMode}h mode. Cannot switch to ${format}h.`);
            return;
        }

        // Convert hour if switching formats
        if (state.format !== format) {
            const conversion = this.convertHourBetweenFormats(state.hour, state.format, format, state.period);
            state.hour = conversion.hour;
            if (conversion.period) {
                state.period = conversion.period;
            }

            state.format = format;
            this.setState(timepicker, state);
            this.updateFormatButtons(timepicker);
            this.updatePeriodSectionVisibility(timepicker);
            this.updateGridLayout(timepicker);
            this.updateHourOptions(timepicker);
            this.updateSelectedStates(timepicker);
            this.updateDisplay(timepicker);
            this.updatePreview(timepicker);
        }
    }

    /**
     * Set to current time
     */
    private setToCurrentTime(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        const currentTime = this.getCurrentTime();

        // Use standardized conversion method for consistency
        if (state.format === '12') {
            const conversion = this.convertHourBetweenFormats(currentTime.hour, '24', '12');
            state.hour = conversion.hour;
            state.period = conversion.period!;
        } else {
            state.hour = currentTime.hour;
        }

        state.minute = currentTime.minute;
        state.second = currentTime.second;

        this.setState(timepicker, state);
        this.updateSelectedStates(timepicker);
        this.scrollToSelectedOptions(timepicker);
        this.updatePreview(timepicker);
    }

    /**
     * Apply time selection
     */
    private applyTime(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        const formattedTime = this.formatTimeValue(state);
        this.setValue(timepicker, formattedTime);
        this.closeDropdown(timepicker);

        this.dispatchTimePickerEvent(timepicker, 'timepicker:change', {
            value: formattedTime,
            state: { ...state }
        });
    }

    /**
     * Clear time value
     */
    private clearTime(timepicker: HTMLElement): void {
        this.setValue(timepicker, '');

        this.dispatchTimePickerEvent(timepicker, 'timepicker:change', {
            value: '',
            state: null
        });
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeydown(timepicker: HTMLElement, event: KeyboardEvent): void {
        const state = this.getState(timepicker);
        if (!state) return;

        switch (event.key) {
            case 'Enter':
            case ' ':
                if (!state.isOpen) {
                    event.preventDefault();
                    this.openDropdown(timepicker);
                } else {
                    event.preventDefault();
                    this.applyTime(timepicker);
                }
                break;

            case 'Escape':
                if (state.isOpen) {
                    event.preventDefault();
                    this.closeDropdown(timepicker);
                }
                break;

            case 'ArrowUp':
                if (state.isOpen) {
                    event.preventDefault();
                    // Navigate focus in dropdown
                } else {
                    event.preventDefault();
                    this.incrementTime(timepicker, 'minute', 1);
                }
                break;

            case 'ArrowDown':
                if (state.isOpen) {
                    event.preventDefault();
                    // Navigate focus in dropdown
                } else {
                    event.preventDefault();
                    this.incrementTime(timepicker, 'minute', -1);
                }
                break;

            case 'ArrowLeft':
                if (!state.isOpen) {
                    event.preventDefault();
                    this.incrementTime(timepicker, 'hour', -1);
                }
                break;

            case 'ArrowRight':
                if (!state.isOpen) {
                    event.preventDefault();
                    this.incrementTime(timepicker, 'hour', 1);
                }
                break;
        }
    }

    /**
     * Increment/decrement time values
     */
    private incrementTime(timepicker: HTMLElement, unit: 'hour' | 'minute' | 'second', direction: number): void {
        const state = this.getState(timepicker);
        if (!state) return;

        switch (unit) {
            case 'hour':
                if (state.format === '12') {
                    // 12-hour format: 1-12
                    state.hour = state.hour + direction;
                    if (state.hour > 12) state.hour = 1;
                    if (state.hour < 1) state.hour = 12;
                } else {
                    // 24-hour format: 0-23
                    state.hour = state.hour + direction;
                    if (state.hour > 23) state.hour = 0;
                    if (state.hour < 0) state.hour = 23;
                }
                break;

            case 'minute':
                // Handle minute wrap-around with step intervals
                state.minute = state.minute + (direction * state.step);
                if (state.minute >= 60) {
                    state.minute = state.minute % 60;
                } else if (state.minute < 0) {
                    state.minute = 60 + (state.minute % 60);
                    if (state.minute === 60) state.minute = 0;
                }
                break;

            case 'second':
                // Handle second wrap-around
                state.second = state.second + direction;
                if (state.second >= 60) {
                    state.second = 0;
                } else if (state.second < 0) {
                    state.second = 59;
                }
                break;
        }

        this.setState(timepicker, state);
        this.updateDisplay(timepicker);

        this.dispatchTimePickerEvent(timepicker, 'timepicker:increment', {
            unit,
            direction,
            value: this.formatTimeValue(state)
        });
    }

    /**
     * Update display value
     */
    private updateDisplay(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        const formattedTime = this.formatTimeValue(state);
        const display = DOMUtils.querySelector('[data-timepicker-display]', timepicker) as HTMLElement;

        // Update display content with proper placeholder handling
        if (display) {
            if (formattedTime) {
                display.innerHTML = formattedTime;
            } else {
                const placeholder = timepicker.dataset.placeholder || 'Select time...';
                display.innerHTML = `<span class="text-muted timepicker-placeholder">${placeholder}</span>`;
            }
        }

        // Update data attributes for styling
        if (formattedTime) {
            timepicker.dataset.hasValue = 'true';
        } else {
            delete timepicker.dataset.hasValue;
        }

        // Update clear button visibility
        this.updateClearButtonVisibility(timepicker, formattedTime);
    }

    /**
     * Update preview in dropdown
     */
    private updatePreview(timepicker: HTMLElement): void {
        // Could add a preview display in the dropdown header
        this.updateDisplay(timepicker);
    }

    /**
     * Set value and update hidden input
     */
    private setValue(timepicker: HTMLElement, value: string): void {
        const hiddenInput = DOMUtils.querySelector('[data-timepicker-hidden-input]', timepicker) as HTMLInputElement;
        const display = DOMUtils.querySelector('[data-timepicker-display]', timepicker) as HTMLElement;

        if (hiddenInput) {
            hiddenInput.value = value;
        }

        // Update display content with proper placeholder handling
        if (display) {
            if (value) {
                display.innerHTML = value;
            } else {
                const placeholder = timepicker.dataset.placeholder || 'Select time...';
                display.innerHTML = `<span class="text-muted timepicker-placeholder">${placeholder}</span>`;
            }
        }

        // Update data attributes for styling
        if (value) {
            timepicker.dataset.hasValue = 'true';
        } else {
            delete timepicker.dataset.hasValue;
        }

        // Update clear button visibility
        this.updateClearButtonVisibility(timepicker, value);

        // Update state
        const state = this.getState(timepicker);
        if (state) {
            state.value = value;
            this.setState(timepicker, state);
        }
    }

    /**
     * Update clear button visibility based on value
     */
    private updateClearButtonVisibility(timepicker: HTMLElement, value: string): void {
        const clearButton = DOMUtils.querySelector('[data-timepicker-clear]', timepicker) as HTMLElement;

        console.log('🕒 Updating clear button visibility:', { value, clearButton: !!clearButton, disabled: timepicker.dataset.disabled });

        if (clearButton) {
            if (value && !timepicker.dataset.disabled) {
                // Show clear button
                clearButton.classList.remove('opacity-0', 'pointer-events-none');
                clearButton.classList.add('pointer-events-auto');
                console.log('🕒 Clear button shown');
            } else {
                // Hide clear button
                clearButton.classList.add('opacity-0', 'pointer-events-none');
                clearButton.classList.remove('pointer-events-auto');
                console.log('🕒 Clear button hidden');
            }
        }
    }

    /**
     * Update selected states in dropdown
     */
    private updateSelectedStates(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        // Clear all selected states
        DOMUtils.querySelectorAll('.selected', timepicker).forEach(el => el.classList.remove('selected'));

        // Set selected hour
        const hourButton = DOMUtils.querySelector(`[data-timepicker-hour="${state.hour}"]`, timepicker);
        if (hourButton) hourButton.classList.add('selected');

        // Set selected minute
        const minuteButton = DOMUtils.querySelector(`[data-timepicker-minute="${state.minute}"]`, timepicker);
        if (minuteButton) minuteButton.classList.add('selected');

        // Set selected second
        if (state.showSeconds) {
            const secondButton = timepicker.querySelector(`[data-timepicker-second="${state.second}"]`);
            if (secondButton) secondButton.classList.add('selected');
        }

        // Set selected period
        if (state.format === '12') {
            const periodButton = timepicker.querySelector(`[data-timepicker-period="${state.period}"]`);
            if (periodButton) periodButton.classList.add('selected');
        }
    }

    /**
     * Update format toggle buttons
     */
    private updateFormatButtons(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        const formatButtons = DOMUtils.querySelectorAll('[data-timepicker-format]', timepicker);
        formatButtons.forEach(button => {
            const buttonFormat = (button as HTMLElement).dataset.timepickerFormat;
            if (buttonFormat === state.format) {
                button.classList.add('bg-brand', 'text-foreground-brand');
                button.classList.remove('bg-surface', 'text-muted');
            } else {
                button.classList.remove('bg-brand', 'text-foreground-brand');
                button.classList.add('bg-surface', 'text-muted');
            }
        });
    }

    /**
     * Update hour options based on current format
     */
    private updateHourOptions(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        const hourContainer = DOMUtils.querySelector('[data-timepicker-hours]', timepicker);
        if (!hourContainer) return;

        // Generate hour options based on format
        const hourOptions = state.format === '12' ?
            Array.from({length: 12}, (_, i) => i + 1) : // 1-12 for 12h
            Array.from({length: 24}, (_, i) => i);      // 0-23 for 24h

        // Clear existing hour buttons
        hourContainer.innerHTML = '';

        // Create new hour buttons
        hourOptions.forEach(hour => {
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.timepickerHour = hour.toString();
            button.className = 'w-full px-3 py-2 text-sm text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-brand focus:text-foreground-brand [&.selected]:bg-brand [&.selected]:text-foreground-brand transition-colors';
            button.textContent = hour.toString().padStart(2, '0');
            hourContainer.appendChild(button);
        });

        // Validate current hour is valid for the format (no conversion needed here)
        // Any format conversion should have already happened in setFormat()
        if (state.format === '12' && (state.hour < 1 || state.hour > 12)) {
            // Fallback validation - should not normally happen
            state.hour = Math.max(1, Math.min(12, state.hour));
            this.setState(timepicker, state);
            this.updateDisplay(timepicker);
            this.updatePreview(timepicker);
        } else if (state.format === '24' && (state.hour < 0 || state.hour > 23)) {
            // Fallback validation - should not normally happen
            state.hour = Math.max(0, Math.min(23, state.hour));
            this.setState(timepicker, state);
            this.updateDisplay(timepicker);
            this.updatePreview(timepicker);
        }
    }

    /**
     * Update visibility of the period (AM/PM) section based on current format
     */
    private updatePeriodSectionVisibility(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        const periodSection = DOMUtils.querySelector('[data-timepicker-period-section]', timepicker) as HTMLElement;
        if (periodSection) {
            periodSection.style.display = state.format === '12' ? 'block' : 'none';
        }
    }

    /**
     * Update grid layout based on current format and settings
     */
    private updateGridLayout(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        const gridContainer = DOMUtils.querySelector('[data-timepicker-grid]', timepicker) as HTMLElement;
        if (!gridContainer) return;

        // Calculate columns: hours + minutes + (seconds if enabled) + (period if 12h format)
        let columns = 2; // hours + minutes
        if (state.showSeconds) columns++;
        if (state.format === '12') columns++; // AM/PM period

        gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    }

    /**
     * Scroll to selected options in dropdown lists
     */
    private scrollToSelectedOptions(timepicker: HTMLElement): void {
        const selectedElements = DOMUtils.querySelectorAll('.selected', timepicker);
        selectedElements.forEach(element => {
            element.scrollIntoView({ block: 'center', behavior: 'smooth' });
        });
    }

    /**
     * Position dropdown using Floating UI
     */
    private positionDropdown(timepicker: HTMLElement): void {
        const dropdown = DOMUtils.querySelector('[data-timepicker-dropdown]', timepicker) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-timepicker-trigger]', timepicker) as HTMLElement;

        if (!dropdown || !trigger) return;

        // Setup floating for time picker dropdown
        this.setupFloating(timepicker, trigger, dropdown);
    }

    /**
     * Setup floating for time picker using Floating UI
     */
    private setupFloating(timepicker: HTMLElement, trigger: HTMLElement, dropdown: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        // Clean up existing floating instance
        if (state.floating) {
            state.floating.cleanup();
        }

        // Get configuration
        const position = timepicker.dataset.position || 'bottom';
        const align = timepicker.dataset.align || 'start';
        const offset = parseInt(timepicker.dataset.offset || '8');

        // Convert position and align to Floating UI placement
        let placement: any = position;
        if (position === 'bottom' || position === 'top') {
            if (align === 'start') placement = `${position}-start`;
            else if (align === 'end') placement = `${position}-end`;
        }

        // Create floating element with enhanced Floating UI features
        const floating = FloatingManager.getInstance().createFloating(trigger, dropdown, {
            placement,
            offset,
            flip: {
                fallbackStrategy: 'bestFit',
                padding: 8
            },
            shift: {
                padding: 8,
                crossAxis: true
            },
            size: {
                apply: ({ availableHeight }) => {
                    // Apply adaptive height for time picker dropdowns
                    const minHeight = 200;
                    const maxHeight = Math.max(availableHeight - 16, minHeight);
                    dropdown.style.maxHeight = `${maxHeight}px`;
                    dropdown.style.overflowY = 'auto';
                }
            },
            hide: {
                strategy: 'escaped'
            },
            autoUpdate: {
                ancestorScroll: true,
                ancestorResize: true,
                elementResize: true,
                layoutShift: true
            }
        });

        state.floating = floating;
        this.setState(timepicker, state);
    }

    /**
     * Parse time string into components
     */
    private parseTime(timeString: string | null): ParsedTime | null {
        if (!timeString) return null;

        try {
            // Try different formats
            const formats = [
                /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i,
                /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
            ];

            for (const format of formats) {
                const match = timeString.match(format);
                if (match) {
                    const hour = parseInt(match[1]);
                    const minute = parseInt(match[2]);
                    const second = parseInt(match[3] || '0');
                    const period = match[4]?.toUpperCase() as 'AM' | 'PM' | undefined;

                    return { hour, minute, second, period };
                }
            }
        } catch (e) {
            // Return null if parsing fails
        }

        return null;
    }

    /**
     * Get current time
     */
    private getCurrentTime(): ParsedTime {
        const now = new Date();
        return {
            hour: now.getHours(),
            minute: now.getMinutes(),
            second: now.getSeconds()
        };
    }

    /**
     * Format time value from state
     */
    private formatTimeValue(state: TimePickerState): string {
        const { hour, minute, second, period, format, showSeconds } = state;

        if (format === '12') {
            const hourStr = hour.toString();
            const minuteStr = minute.toString().padStart(2, '0');
            const secondStr = second.toString().padStart(2, '0');

            if (showSeconds) {
                return `${hourStr}:${minuteStr}:${secondStr} ${period}`;
            } else {
                return `${hourStr}:${minuteStr} ${period}`;
            }
        } else {
            const hourStr = hour.toString().padStart(2, '0');
            const minuteStr = minute.toString().padStart(2, '0');
            const secondStr = second.toString().padStart(2, '0');

            if (showSeconds) {
                return `${hourStr}:${minuteStr}:${secondStr}`;
            } else {
                return `${hourStr}:${minuteStr}`;
            }
        }
    }

    /**
     * Check if timepicker is disabled
     */
    private isDisabled(timepicker: HTMLElement): boolean {
        return timepicker.dataset.disabled === 'true';
    }

    /**
     * Dispatch custom timepicker event
     */
    private dispatchTimePickerEvent(timepicker: HTMLElement, eventName: string, detail: any = null): void {
        EventUtils.dispatchCustomEvent(timepicker, eventName, {
            timepicker,
            ...detail
        }, {
            bubbles: true,
            cancelable: true
        });
    }

    /**
     * Get timepicker state (for external access)
     */
    public getTimePickerState(timepicker: HTMLElement): TimePickerState | null {
        return this.getState(timepicker) || null;
    }

    /**
     * Set time programmatically
     */
    public setTime(timepicker: HTMLElement, timeString: string): void {
        const parsedTime = this.parseTime(timeString);
        const state = this.getState(timepicker);

        if (!parsedTime || !state) return;

        state.hour = parsedTime.hour;
        state.minute = parsedTime.minute;
        state.second = parsedTime.second;

        if (parsedTime.period) {
            state.period = parsedTime.period;
        }

        this.setState(timepicker, state);
        this.updateDisplay(timepicker);
        this.updateSelectedStates(timepicker);

        this.dispatchTimePickerEvent(timepicker, 'timepicker:change', {
            value: this.formatTimeValue(state),
            state: { ...state }
        });
    }

    /**
     * Clean up TimePickerActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // Clean up all floating instances
        this.getAllStates().forEach((state, timepicker) => {
            if (state.floating) {
                state.floating.cleanup();
            }
        });
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        TimePickerActions.getInstance().init();
    });
} else {
    TimePickerActions.getInstance().init();
}

// Export for global access
(window as any).TimePickerActions = TimePickerActions;

declare global {
    interface Window {
        TimePickerActions: typeof TimePickerActions;
    }
}

export default TimePickerActions.getInstance();