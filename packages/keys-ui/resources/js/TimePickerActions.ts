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
        EventUtils.handleDelegatedClick('[data-timepicker-trigger]', (trigger, event) => {
            console.log('🕒 TimePicker trigger clicked:', trigger);
            const timepicker = DOMUtils.findClosest(trigger, '[data-keys-timepicker]') as HTMLElement;
            if (timepicker && !this.isDisabled(timepicker)) {
                console.log('🕒 Native popover will handle toggle for:', timepicker);
                const state = this.getState(timepicker);
                if (state) {
                    console.log('🕒 Current TimePicker state:', state);
                }
            } else {
                console.log('🕒 TimePicker trigger ignored - disabled or not found');
                event.preventDefault();
            }
        });

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

        EventUtils.handleDelegatedClick('[data-timepicker-hour]', (hourButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(hourButton, '[data-keys-timepicker]') as HTMLElement;
            const hour = parseInt(hourButton.dataset.timepickerHour || '0');
            if (timepicker) {
                this.setHour(timepicker, hour);
            }
        });

        EventUtils.handleDelegatedClick('[data-timepicker-minute]', (minuteButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(minuteButton, '[data-keys-timepicker]') as HTMLElement;
            const minute = parseInt(minuteButton.dataset.timepickerMinute || '0');
            if (timepicker) {
                this.setMinute(timepicker, minute);
            }
        });

        EventUtils.handleDelegatedClick('[data-timepicker-second]', (secondButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(secondButton, '[data-keys-timepicker]') as HTMLElement;
            const second = parseInt(secondButton.dataset.timepickerSecond || '0');
            if (timepicker) {
                this.setSecond(timepicker, second);
            }
        });

        EventUtils.handleDelegatedClick('[data-timepicker-period]', (periodButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(periodButton, '[data-keys-timepicker]') as HTMLElement;
            const period = periodButton.dataset.timepickerPeriod as 'AM' | 'PM';
            if (timepicker) {
                this.setPeriod(timepicker, period);
            }
        });

        EventUtils.handleDelegatedClick('[data-timepicker-format]', (formatButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(formatButton, '[data-keys-timepicker]') as HTMLElement;
            const format = formatButton.dataset.timepickerFormat as '12' | '24';
            if (timepicker) {
                this.setFormat(timepicker, format);
            }
        });

        EventUtils.handleDelegatedClick('[data-timepicker-now]', (nowButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(nowButton, '[data-keys-timepicker]') as HTMLElement;
            if (timepicker) {
                this.setToCurrentTime(timepicker);
            }
        });

        EventUtils.handleDelegatedClick('[data-timepicker-apply]', (applyButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(applyButton, '[data-keys-timepicker]') as HTMLElement;
            if (timepicker) {
                this.applyTime(timepicker);
            }
        });

        EventUtils.handleDelegatedClick('[data-timepicker-cancel]', (cancelButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(cancelButton, '[data-keys-timepicker]') as HTMLElement;
            if (timepicker) {
                this.closeDropdown(timepicker);
            }
        });

        EventUtils.handleDelegatedClick('[data-timepicker-preset]', (presetButton, event) => {
            event.preventDefault();
            const timepicker = DOMUtils.findClosest(presetButton, '[data-keys-timepicker]') as HTMLElement;
            const presetTime = presetButton.dataset.timepickerPreset;
            if (timepicker && presetTime) {
                this.setPresetTime(timepicker, presetTime);
            }
        });

        EventUtils.addEventListener(document, 'click', (event) => {
            const target = event.target as Node;

            if (target && target instanceof Element) {
                const closestTimePicker = target.closest('[data-keys-timepicker]');

                if (!closestTimePicker) {
                    this.closeAllDropdowns();
                }
            }
        });

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

                    if (element.matches && element.matches('[data-keys-timepicker]')) {
                        this.initializeTimePicker(element);
                    }

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

        state.isOpen = false;
        this.setState(timepicker, state);

        const trigger = DOMUtils.querySelector('[data-timepicker-trigger]', timepicker) as HTMLElement;
        const popover = DOMUtils.querySelector('[data-popover]', timepicker) as HTMLElement;

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
        }

        if (popover && 'hidePopover' in popover) {
            try {
                (popover as any).hidePopover();
            } catch (e) {
                console.log('Fallback: triggering click to close popover');
                if (trigger) {
                    trigger.click();
                }
            }
        } else if (trigger) {
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
            if (hour === 0) {
                return { hour: 12, period: 'AM' };
            } else if (hour >= 1 && hour <= 11) {
                return { hour, period: 'AM' };
            } else if (hour === 12) {
                return { hour: 12, period: 'PM' };
            } else {
                return { hour: hour - 12, period: 'PM' };
            }
        } else if (fromFormat === '12' && toFormat === '24') {
            if (!period) {
                throw new Error('Period (AM/PM) required for 12h to 24h conversion');
            }

            if (period === 'AM') {
                if (hour === 12) {
                    return { hour: 0 };
                } else {
                    return { hour };
                }
            } else {
                if (hour === 12) {
                    return { hour: 12 };
                } else {
                    return { hour: hour + 12 };
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

        const formatMode = timepicker.dataset.formatMode;
        if (formatMode === '12' || formatMode === '24') {
            console.warn(`TimePicker format is locked to ${formatMode}h mode. Cannot switch to ${format}h.`);
            return;
        }

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
     * Set preset time
     */
    private setPresetTime(timepicker: HTMLElement, presetTime: string): void {
        const state = this.getState(timepicker);
        if (!state) return;

        const parsedTime = this.parseTime(presetTime);
        if (!parsedTime) return;

        if (state.format === '12') {
            if (parsedTime.period) {
                state.hour = parsedTime.hour;
                state.period = parsedTime.period;
            } else {
                // Convert 24h to 12h if preset is in 24h format
                const conversion = this.convertHourBetweenFormats(parsedTime.hour, '24', '12');
                state.hour = conversion.hour;
                state.period = conversion.period!;
            }
        } else {
            if (parsedTime.period) {
                // Convert 12h to 24h if preset is in 12h format
                const conversion = this.convertHourBetweenFormats(parsedTime.hour, '12', '24', parsedTime.period);
                state.hour = conversion.hour;
            } else {
                state.hour = parsedTime.hour;
            }
        }

        state.minute = parsedTime.minute;
        state.second = parsedTime.second;

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
                } else {
                    event.preventDefault();
                    this.incrementTime(timepicker, 'minute', 1);
                }
                break;

            case 'ArrowDown':
                if (state.isOpen) {
                    event.preventDefault();
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
                    state.hour = state.hour + direction;
                    if (state.hour > 12) state.hour = 1;
                    if (state.hour < 1) state.hour = 12;
                } else {
                    state.hour = state.hour + direction;
                    if (state.hour > 23) state.hour = 0;
                    if (state.hour < 0) state.hour = 23;
                }
                break;

            case 'minute':
                state.minute = state.minute + (direction * state.step);
                if (state.minute >= 60) {
                    state.minute = state.minute % 60;
                } else if (state.minute < 0) {
                    state.minute = 60 + (state.minute % 60);
                    if (state.minute === 60) state.minute = 0;
                }
                break;

            case 'second':
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

        if (display) {
            if (formattedTime) {
                display.innerHTML = formattedTime;
            } else {
                const placeholder = timepicker.dataset.placeholder || 'Select time...';
                display.innerHTML = `<span class="text-muted timepicker-placeholder">${placeholder}</span>`;
            }
        }

        if (formattedTime) {
            timepicker.dataset.hasValue = 'true';
        } else {
            delete timepicker.dataset.hasValue;
        }

        this.updateClearButtonVisibility(timepicker, formattedTime);
    }

    /**
     * Update preview in dropdown
     */
    private updatePreview(timepicker: HTMLElement): void {
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

            // Dispatch events for Livewire and native form integration
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });

            hiddenInput.dispatchEvent(inputEvent);
            hiddenInput.dispatchEvent(changeEvent);

            // Livewire integration
            if ((window as any).Livewire && hiddenInput.hasAttribute('wire:model')) {
                (window as any).Livewire.hook('message.processed', () => {});
            }
        }

        if (display) {
            if (value) {
                display.innerHTML = value;
            } else {
                const placeholder = timepicker.dataset.placeholder || 'Select time...';
                display.innerHTML = `<span class="text-muted timepicker-placeholder">${placeholder}</span>`;
            }
        }

        if (value) {
            timepicker.dataset.hasValue = 'true';
        } else {
            delete timepicker.dataset.hasValue;
        }

        this.updateClearButtonVisibility(timepicker, value);

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
                clearButton.classList.remove('invisible');
                console.log('🕒 Clear button shown');
            } else {
                clearButton.classList.add('invisible');
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

        // Remove all selected states and ARIA attributes
        DOMUtils.querySelectorAll('.selected', timepicker).forEach(el => {
            el.classList.remove('selected');
            if (el.hasAttribute('aria-selected')) {
                el.setAttribute('aria-selected', 'false');
            }
            if (el.hasAttribute('aria-checked')) {
                el.setAttribute('aria-checked', 'false');
            }
        });

        // Update hour selection
        const hourButton = DOMUtils.querySelector(`[data-timepicker-hour="${state.hour}"]`, timepicker);
        if (hourButton) {
            hourButton.classList.add('selected');
            hourButton.setAttribute('aria-selected', 'true');
        }

        // Update minute selection
        const minuteButton = DOMUtils.querySelector(`[data-timepicker-minute="${state.minute}"]`, timepicker);
        if (minuteButton) {
            minuteButton.classList.add('selected');
            minuteButton.setAttribute('aria-selected', 'true');
        }

        // Update second selection
        if (state.showSeconds) {
            const secondButton = timepicker.querySelector(`[data-timepicker-second="${state.second}"]`);
            if (secondButton) {
                secondButton.classList.add('selected');
                secondButton.setAttribute('aria-selected', 'true');
            }
        }

        // Update period selection
        if (state.format === '12') {
            const periodButton = timepicker.querySelector(`[data-timepicker-period="${state.period}"]`);
            if (periodButton) {
                periodButton.classList.add('selected');
                periodButton.setAttribute('aria-checked', 'true');
            }
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
            const isSelected = buttonFormat === state.format;

            if (isSelected) {
                (button as HTMLElement).dataset.selected = 'true';
                (button as HTMLElement).setAttribute('aria-pressed', 'true');
            } else {
                delete (button as HTMLElement).dataset.selected;
                (button as HTMLElement).setAttribute('aria-pressed', 'false');
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

        const hourOptions = state.format === '12' ?
            Array.from({length: 12}, (_, i) => i + 1) :
            Array.from({length: 24}, (_, i) => i);

        hourContainer.innerHTML = '';

        hourOptions.forEach(hour => {
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.timepickerHour = hour.toString();
            button.className = 'w-full px-3 py-2 text-sm text-primary text-left hover:bg-hover focus-visible:bg-accent focus-visible:text-accent-foreground [&.selected]:bg-accent [&.selected]:text-accent-foreground transition-colors';
            button.textContent = hour.toString().padStart(2, '0');
            hourContainer.appendChild(button);
        });

        if (state.format === '12' && (state.hour < 1 || state.hour > 12)) {
            state.hour = Math.max(1, Math.min(12, state.hour));
            this.setState(timepicker, state);
            this.updateDisplay(timepicker);
            this.updatePreview(timepicker);
        } else if (state.format === '24' && (state.hour < 0 || state.hour > 23)) {
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
            // Use Tailwind classes instead of inline styles
            if (state.format === '12') {
                periodSection.classList.remove('hidden');
                periodSection.classList.add('flex', 'flex-col');
            } else {
                periodSection.classList.add('hidden');
                periodSection.classList.remove('flex', 'flex-col');
            }
        }
    }

    /**
     * Update grid layout based on current format and settings
     * Note: Grid columns are now calculated in Blade, this method updates the classes dynamically
     */
    private updateGridLayout(timepicker: HTMLElement): void {
        const state = this.getState(timepicker);
        if (!state) return;

        const gridContainer = DOMUtils.querySelector('[data-timepicker-grid]', timepicker) as HTMLElement;
        if (!gridContainer) return;

        // Remove old grid column classes
        gridContainer.classList.remove('grid-cols-2', 'grid-cols-3', 'grid-cols-4');

        // Calculate new columns
        let columns = 2; // Default: hours + minutes
        if (state.showSeconds) columns++;
        if (state.format === '12') columns++;

        // Add new grid column class
        gridContainer.classList.add(`grid-cols-${columns}`);
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
     * Parse time string into components
     */
    private parseTime(timeString: string | null): ParsedTime | null {
        if (!timeString) return null;

        try {
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
        // Cleanup if needed in the future
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        TimePickerActions.getInstance().init();
    });
} else {
    TimePickerActions.getInstance().init();
}

(window as any).TimePickerActions = TimePickerActions;

declare global {
    interface Window {
        TimePickerActions: typeof TimePickerActions;
    }
}

export default TimePickerActions.getInstance();