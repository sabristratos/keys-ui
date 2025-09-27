/**
 * DatePickerActions - Handles interactive functionality for DatePicker components
 *
 * Provides functionality for:
 * - Dropdown toggle and positioning
 * - Date formatting and validation
 * - Calendar integration
 * - Quick date selectors
 * - Keyboard navigation
 * - Click outside handling
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import { DateUtils } from './utils/DateUtils';

interface DatePickerState {
    selectedDate: string | null;
    startDate: string | null;
    endDate: string | null;
    format: string;
    displayFormat: string;
    isRange: boolean;
    closeOnSelect: boolean;
    isInline: boolean;
    isDisabled: boolean;
}

export class DatePickerActions extends BaseActionClass<DatePickerState> {

    /**
     * Initialize date picker elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.querySelectorAll('[data-keys-date-picker]').forEach(datePicker => {
            this.initializeDatePicker(datePicker as HTMLElement);
        });
    }

    /**
     * Initialize a single date picker element
     */
    private initializeDatePicker(datePickerElement: HTMLElement): void {
        if (this.hasState(datePickerElement)) {
            return;
        }

        const configAttr = datePickerElement.dataset.datePickerConfig;
        const isInline = datePickerElement.dataset.inline === 'true';
        const isDisabled = datePickerElement.dataset.disabled === 'true';

        let config;
        try {
            config = configAttr ? JSON.parse(configAttr) : {};
        } catch (e) {
            console.error('Failed to parse date picker config:', e);
            config = {};
        }

        const state: DatePickerState = {
            selectedDate: config.selectedDate || null,
            startDate: config.startDate || null,
            endDate: config.endDate || null,
            format: config.format || 'Y-m-d',
            displayFormat: config.displayFormat || config.format || 'Y-m-d',
            isRange: config.isRange || false,
            closeOnSelect: config.closeOnSelect !== false,
            isInline: isInline,
            isDisabled: isDisabled
        };

        this.setState(datePickerElement, state);

        // Initialize calendar events listener
        this.setupCalendarEventListeners(datePickerElement);
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Input click - removed dropdown toggle, let popover handle it
        // Input functionality is handled by the trigger button

        // Trigger button click - let native popover API handle dropdown toggle
        EventUtils.handleDelegatedClick('[data-date-picker-trigger]', (trigger, event) => {
            console.log('🗓️ DatePicker trigger clicked:', trigger);
            // Don't prevent default - let native popover API handle the toggle
            const datePicker = DOMUtils.findClosest(trigger, '[data-keys-date-picker]');
            if (datePicker && !this.isDisabled(datePicker)) {
                console.log('🗓️ Native popover will handle toggle for:', datePicker);
                // Update our internal state but let popover handle the UI
                const state = this.getState(datePicker);
                if (state) {
                    console.log('🗓️ Current DatePicker state:', state);
                }
            } else {
                console.log('🗓️ DatePicker trigger ignored - disabled or not found');
                event.preventDefault(); // Only prevent default if disabled
            }
        });

        // Clear button click
        EventUtils.handleDelegatedClick('[data-date-picker-clear]', (clearBtn, event) => {
            event.preventDefault();
            event.stopPropagation();
            const datePicker = DOMUtils.findClosest(clearBtn, '[data-date-picker="true"]');
            if (datePicker && !this.isDisabled(datePicker)) {
                this.clearDate(datePicker);
            }
        });

        // Quick selector buttons - removed, Calendar handles these directly

        // Keyboard navigation - simplified, let popover handle open/close
        EventUtils.handleDelegatedKeydown('[data-date-picker-input]', (input, event) => {
            const datePicker = DOMUtils.findClosest(input, '[data-keys-date-picker]');
            if (!datePicker) return;

            switch (event.key) {
                case 'Tab':
                    // Let tab key move focus into calendar if popover is open
                    const calendar = DOMUtils.querySelector('[data-keys-calendar="true"]', datePicker);
                    if (calendar) {
                        const popover = DOMUtils.findClosest(calendar, '[data-keys-popover]');
                        if (popover && popover.matches(':popover-open')) {
                            setTimeout(() => {
                                const firstButton = calendar.querySelector('button:not(:disabled)') as HTMLElement;
                                if (firstButton) {
                                    firstButton.focus();
                                }
                            }, 10);
                        }
                    }
                    break;
            }
        });

        EventUtils.handleDelegatedInput('[data-date-picker-input]', (input) => {
            if (!(input as HTMLInputElement).readOnly) {
                const datePicker = DOMUtils.findClosest(input, '[data-keys-date-picker]');
                if (datePicker && !this.isDisabled(datePicker)) {
                    this.handleManualInput(datePicker, (input as HTMLInputElement).value);
                }
            }
        });
    }

    /**
     * Setup calendar event listeners for a date picker
     */
    private setupCalendarEventListeners(datePicker: HTMLElement): void {
        const calendar = DOMUtils.querySelector('[data-keys-calendar="true"]', datePicker);
        if (!calendar) return;

        // Listen for date selection events from calendar
        calendar.addEventListener('calendar:dateSelected', (event: any) => {
            event.stopPropagation(); // Prevent bubbling to input handlers that could retoggle dropdown
            const detail = event.detail;
            this.handleDateSelected(datePicker, detail.selectedDate, detail.formattedDate);
        });

        // Listen for range selection events from calendar
        calendar.addEventListener('calendar:rangeSelected', (event: any) => {
            event.stopPropagation(); // Prevent bubbling to input handlers that could retoggle dropdown
            const detail = event.detail;
            this.handleRangeSelected(datePicker, detail.startDate, detail.endDate, detail.formattedRange);
        });

        // Listen for calendar cleared event
        calendar.addEventListener('calendar:cleared', (event: any) => {
            event.stopPropagation(); // Prevent bubbling to input handlers that could retoggle dropdown
            this.handleCalendarCleared(datePicker);
        });
    }

    // Dropdown management methods removed - now handled by native popover API

    // Positioning methods removed - now handled by native popover API

    /**
     * Handle date selection from calendar
     */
    private handleDateSelected(datePicker: HTMLElement, selectedDate: string | null, formattedDate: string | null): void {
        const state = this.getState(datePicker);
        if (!state) return;


        state.selectedDate = selectedDate;
        this.setState(datePicker, state);

        // Update display element (DatePicker uses a span, not an input)
        const displayElement = DOMUtils.querySelector('[data-date-picker-display]', datePicker) as HTMLElement;
        if (displayElement) {
            if (selectedDate) {
                // Use improved date formatting that handles custom formats correctly
                displayElement.innerHTML = this.formatDateForDisplay(selectedDate, state.displayFormat);
            } else {
                // Show placeholder when no date selected
                const placeholder = datePicker.dataset.placeholder || 'Select date...';
                displayElement.innerHTML = `<span class="text-muted date-picker-placeholder">${placeholder}</span>`;
            }
        }

        // Update hidden input
        const hiddenInput = DOMUtils.querySelector('[data-date-picker-value]', datePicker) as HTMLInputElement;
        if (hiddenInput) {
            hiddenInput.value = selectedDate ? DateUtils.formatDateForSubmission(selectedDate, state.format) : '';
        }

        // Close popover if configured (only for single date mode)
        if (state.closeOnSelect && !state.isInline && !state.isRange) {
            setTimeout(() => {
                const popover = DOMUtils.findClosest(datePicker, '[data-keys-popover]') ||
                               DOMUtils.querySelector('[data-keys-popover]', datePicker);
                if (popover && 'hidePopover' in popover) {
                    try {
                        (popover as any).hidePopover();
                    } catch (e) {
                        console.log('Popover already closed or not open');
                    }
                }
            }, 150);
        }

        // Clear button visibility is handled by template conditional rendering

        // Dispatch change event
        this.dispatchDatePickerEvent(datePicker, 'datepicker:change', {
            value: selectedDate,
            formatted: formattedDate
        });
    }

    /**
     * Handle range selection from calendar
     */
    private handleRangeSelected(datePicker: HTMLElement, startDate: string | null, endDate: string | null, formattedRange: string | null): void {
        const state = this.getState(datePicker);
        if (!state) return;


        state.startDate = startDate;
        state.endDate = endDate;
        this.setState(datePicker, state);

        const displayElement = DOMUtils.querySelector('[data-date-picker-display]', datePicker) as HTMLElement;
        if (displayElement) {
            const formattedRange = DateUtils.formatRangeForDisplay(startDate, endDate, state.displayFormat);
            if (formattedRange) {
                displayElement.innerHTML = formattedRange;
            } else {
                const placeholder = datePicker.dataset.placeholder || 'Select date range';
                displayElement.innerHTML = `<span class="text-muted date-picker-placeholder">${placeholder}</span>`;
            }
        }

        const hiddenInput = DOMUtils.querySelector('[data-date-picker-value]', datePicker) as HTMLInputElement;
        if (hiddenInput) {
            const rangeValue = DateUtils.formatRangeForSubmission(startDate, endDate, state.format);
            hiddenInput.value = rangeValue || '';
        }

        if (state.closeOnSelect && startDate && endDate && !state.isInline) {
            setTimeout(() => {
                const popover = DOMUtils.findClosest(datePicker, '[data-keys-popover]') ||
                               DOMUtils.querySelector('[data-keys-popover]', datePicker);
                if (popover && 'hidePopover' in popover) {
                    try {
                        (popover as any).hidePopover();
                    } catch (e) {
                        // Popover already closed
                    }
                }
            }, 150);
        }
        this.dispatchDatePickerEvent(datePicker, 'datepicker:change', {
            startDate: startDate,
            endDate: endDate,
            formatted: formattedRange
        });
    }

    /**
     * Handle calendar cleared event
     *
     * @private
     * @param {HTMLElement} datePicker - The date picker element
     */
    private handleCalendarCleared(datePicker: HTMLElement): void {
        this.clearDate(datePicker);
    }

    /**
     * Clear selected date(s)
     *
     * @private
     * @param {HTMLElement} datePicker - The date picker element
     */
    private clearDate(datePicker: HTMLElement): void {
        const state = this.getState(datePicker);
        if (!state) return;

        state.selectedDate = null;
        state.startDate = null;
        state.endDate = null;
        this.setState(datePicker, state);

        const displayElement = DOMUtils.querySelector('[data-date-picker-display]', datePicker) as HTMLElement;
        if (displayElement) {
            const placeholder = datePicker.dataset.placeholder || 'Select date...';
            displayElement.innerHTML = `<span class="text-muted date-picker-placeholder">${placeholder}</span>`;
        }

        const hiddenInput = DOMUtils.querySelector('[data-date-picker-value]', datePicker) as HTMLInputElement;
        if (hiddenInput) {
            hiddenInput.value = '';
        }

        const calendar = DOMUtils.querySelector('[data-keys-calendar="true"]', datePicker);
        if (calendar && (window as any).CalendarCore) {
            try {
                const calendarCore = (window as any).CalendarCore.getInstance();
                if (state.isRange) {
                    calendarCore.setSelectedRange(calendar, null, null);
                } else {
                    calendarCore.setSelectedDate(calendar, null);
                }
            } catch (error) {
                // Calendar core not available
            }
        }

        if (!state.isInline) {
            const popover = DOMUtils.findClosest(datePicker, '[data-keys-popover]') ||
                           DOMUtils.querySelector('[data-keys-popover]', datePicker);
            if (popover && 'hidePopover' in popover) {
                try {
                    (popover as any).hidePopover();
                } catch (e) {
                    // Popover already closed
                }
            }
        }
        this.dispatchDatePickerEvent(datePicker, 'datepicker:cleared');
    }


    /**
     * Handle manual input
     */
    private handleManualInput(datePicker: HTMLElement, inputValue: string): void {
        const state = this.getState(datePicker);
        if (!state) return;

        // Parse the input value
        const parsedDate = DateUtils.parseInputDate(inputValue, state.displayFormat);

        if (parsedDate) {
            // Valid date entered
            const dateString = DateUtils.formatDateString(parsedDate);

            // Update display element
            const displayElement = DOMUtils.querySelector('[data-date-picker-display]', datePicker) as HTMLElement;
            if (displayElement) {
                displayElement.innerHTML = this.formatDateForDisplay(dateString, state.displayFormat);
            }

            // Update calendar
            const calendar = DOMUtils.querySelector('[data-keys-calendar="true"]', datePicker);
            if (calendar && (window as any).CalendarCore) {
                try {
                    const calendarCore = (window as any).CalendarCore.getInstance();
                    calendarCore.setSelectedDate(calendar, dateString);
                } catch (error) {
                    console.warn('Calendar core not available or failed:', error);
                }
            }
        }
    }

    /**
     * Check if date picker is disabled
     *
     * @private
     * @param {HTMLElement} datePicker - The date picker element
     * @returns {boolean} Whether the date picker is disabled
     */
    private isDisabled(datePicker: HTMLElement): boolean {
        const state = this.getState(datePicker);
        return state ? state.isDisabled : false;
    }

    /**
     * Dispatch custom date picker event
     *
     * @private
     * @param {HTMLElement} datePicker - The date picker element
     * @param {string} eventName - The event name
     * @param {any} detail - The event detail
     */
    private dispatchDatePickerEvent(datePicker: HTMLElement, eventName: string, detail: any = null): void {
        EventUtils.dispatchCustomEvent(datePicker, eventName, {
            datePicker,
            ...detail
        }, {
            bubbles: true,
            cancelable: true
        });
    }

    /**
     * Setup dynamic observer for new date pickers - uses BaseActionClass utility
     *
     * @protected
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    if (DOMUtils.hasDataAttribute(element, 'keys-date-picker', 'true')) {
                        this.initializeDatePicker(element);
                    }

                    DOMUtils.findByDataAttribute('keys-date-picker', 'true', element).forEach(datePicker => {
                        this.initializeDatePicker(datePicker);
                    });
                }
            });
        });
    }

    /**
     * Format a date for display using improved JavaScript date formatting
     *
     * This method provides consistent date formatting that properly handles custom formats
     * like 'F j, Y' without the corruption issues seen in DateUtils.
     *
     * @param dateString - The date string to format (Y-m-d format)
     * @param displayFormat - The display format string
     * @returns The formatted date string
     * @private
     */
    private formatDateForDisplay(dateString: string, displayFormat: string): string {
        try {
            const date = new Date(dateString + 'T00:00:00');

            // Handle specific PHP date format patterns that commonly cause issues
            if (displayFormat === 'F j, Y') {
                // Full month name, day without leading zeros, 4-digit year
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                const month = monthNames[date.getMonth()];
                const day = date.getDate();
                const year = date.getFullYear();
                return `${month} ${day}, ${year}`;
            }

            // For other formats, use the existing DateUtils but with improved error handling
            return DateUtils.formatDateForDisplay(dateString, displayFormat);
        } catch (error) {
            console.warn('Date formatting error:', error);
            return dateString;
        }
    }

    /**
     * Clean up DatePickerActions - extends BaseActionClass destroy
     *
     * @protected
     */
    protected onDestroy(): void {
        // Native popover API handles cleanup
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DatePickerActions.getInstance().init();
    });
} else {
    DatePickerActions.getInstance().init();
}

// Export for global access
(window as any).DatePickerActions = DatePickerActions;

declare global {
    interface Window {
        DatePickerActions: typeof DatePickerActions;
    }
}

export default DatePickerActions.getInstance();