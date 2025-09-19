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
import { AnimationUtils } from './utils/AnimationUtils';
import { DateUtils } from './utils/DateUtils';

interface DatePickerState {
    isOpen: boolean;
    selectedDate: string | null;
    startDate: string | null;
    endDate: string | null;
    format: string;
    displayFormat: string;
    isRange: boolean;
    closeOnSelect: boolean;
    isInline: boolean;
    isDisabled: boolean;
    position: 'bottom' | 'top';
}

export class DatePickerActions extends BaseActionClass<DatePickerState> {

    /**
     * Initialize date picker elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.findByDataAttribute('date-picker', 'true').forEach(datePicker => {
            this.initializeDatePicker(datePicker);
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
            isOpen: isInline,
            selectedDate: config.selectedDate || null,
            startDate: config.startDate || null,
            endDate: config.endDate || null,
            format: config.format || 'Y-m-d',
            displayFormat: config.displayFormat || config.format || 'Y-m-d',
            isRange: config.isRange || false,
            closeOnSelect: config.closeOnSelect !== false,
            isInline: isInline,
            isDisabled: isDisabled,
            position: 'bottom'
        };

        this.setState(datePickerElement, state);

        // Initialize calendar events listener
        this.setupCalendarEventListeners(datePickerElement);

        // Auto-open if inline mode
        if (isInline) {
            this.openDropdown(datePickerElement);
        }
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Input click to toggle dropdown
        EventUtils.handleDelegatedClick('[data-date-picker-input]', (input, event) => {
            event.preventDefault();
            const datePicker = DOMUtils.findClosest(input, '[data-date-picker="true"]');
            if (datePicker && !this.isDisabled(datePicker)) {
                this.toggleDropdown(datePicker);
            }
        });

        // Trigger button click
        EventUtils.handleDelegatedClick('[data-date-picker-trigger]', (trigger, event) => {
            event.preventDefault();
            event.stopPropagation();
            const datePicker = DOMUtils.findClosest(trigger, '[data-date-picker="true"]');
            if (datePicker && !this.isDisabled(datePicker)) {
                this.toggleDropdown(datePicker);
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

        // Quick selector buttons
        EventUtils.handleDelegatedClick('[data-quick-selector]', (selectorBtn, event) => {
            event.preventDefault();
            const datePicker = DOMUtils.findClosest(selectorBtn, '[data-date-picker="true"]');
            const selector = selectorBtn.dataset.quickSelector;
            if (datePicker && selector && !this.isDisabled(datePicker)) {
                this.applyQuickSelector(datePicker, selector);
            }
        });

        // Keyboard navigation
        EventUtils.handleDelegatedKeydown('[data-date-picker-input]', (input, event) => {
            const datePicker = DOMUtils.findClosest(input, '[data-date-picker="true"]');
            if (!datePicker) return;

            const state = this.getState(datePicker);
            if (!state) return;

            switch (event.key) {
                case 'Escape':
                    if (state.isOpen) {
                        event.preventDefault();
                        this.closeDropdown(datePicker);
                    }
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (!state.isOpen) {
                        this.openDropdown(datePicker);
                    }
                    break;
                case 'ArrowDown':
                    if (!state.isOpen) {
                        event.preventDefault();
                        this.openDropdown(datePicker);
                    }
                    break;
                case 'Tab':
                    if (state.isOpen && !event.shiftKey) {
                        // Let tab key move focus into calendar
                        const calendar = DOMUtils.querySelector('[data-calendar="true"]', datePicker);
                        if (calendar) {
                            AnimationUtils.createTimer(() => {
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

        // Manual input handling
        EventUtils.handleDelegatedInput('[data-date-picker-input]', (input) => {
            if (!(input as HTMLInputElement).readOnly) {
                const datePicker = DOMUtils.findClosest(input, '[data-date-picker="true"]');
                if (datePicker && !this.isDisabled(datePicker)) {
                    this.handleManualInput(datePicker, (input as HTMLInputElement).value);
                }
            }
        });

        // Click outside to close
        EventUtils.addEventListener(document, 'click', (event) => {
            const target = event.target as HTMLElement;

            DOMUtils.findByDataAttribute('date-picker', 'true').forEach(datePicker => {
                const state = this.getState(datePicker);
                if (state && state.isOpen && !state.isInline) {
                    const isOutside = !datePicker.contains(target);

                    // Don't close if clicking on calendar elements (date buttons, navigation, etc.)
                    const isCalendarElement = target.closest('[data-calendar="true"]') ||
                                            target.hasAttribute('data-calendar-date') ||
                                            target.hasAttribute('data-calendar-nav') ||
                                            target.hasAttribute('data-calendar-action') ||
                                            target.hasAttribute('data-quick-selector');

                    if (isOutside && !isCalendarElement) {
                        this.closeDropdown(datePicker);
                    }
                }
            });
        });

        // Window resize to reposition dropdowns
        EventUtils.handleResize(() => {
            DOMUtils.findByDataAttribute('date-picker', 'true').forEach(datePicker => {
                const state = this.getState(datePicker);
                if (state && state.isOpen && !state.isInline) {
                    this.updateDropdownPosition(datePicker);
                }
            });
        });
    }

    /**
     * Setup calendar event listeners for a date picker
     */
    private setupCalendarEventListeners(datePicker: HTMLElement): void {
        const calendar = DOMUtils.querySelector('[data-calendar="true"]', datePicker);
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

    /**
     * Toggle dropdown open/closed
     */
    private toggleDropdown(datePicker: HTMLElement): void {
        const state = this.getState(datePicker);
        if (!state || state.isInline) return;

        if (state.isOpen) {
            this.closeDropdown(datePicker);
        } else {
            this.openDropdown(datePicker);
        }
    }

    /**
     * Open dropdown
     */
    private openDropdown(datePicker: HTMLElement): void {
        const state = this.getState(datePicker);
        if (!state || state.isOpen || state.isDisabled) return;

        state.isOpen = true;
        this.setState(datePicker, state);

        const dropdown = DOMUtils.querySelector('[data-date-picker-dropdown]', datePicker) as HTMLElement;
        if (!dropdown) return;

        // Update position before showing
        this.updateDropdownPosition(datePicker);

        // Add animation classes
        dropdown.classList.add('animating-in');
        dropdown.classList.add('open');

        // Focus on calendar after opening
        AnimationUtils.createTimer(() => {
            dropdown.classList.remove('animating-in');

            // Focus first focusable element in calendar
            const calendar = DOMUtils.querySelector('[data-calendar="true"]', datePicker);
            if (calendar) {
                const focusable = calendar.querySelector('button:not(:disabled), [tabindex="0"]') as HTMLElement;
                if (focusable) {
                    focusable.focus();
                }
            }
        }, 200);

        // Dispatch open event
        this.dispatchDatePickerEvent(datePicker, 'datepicker:opened');
    }

    /**
     * Close dropdown
     */
    private closeDropdown(datePicker: HTMLElement): void {
        const state = this.getState(datePicker);
        if (!state || !state.isOpen || state.isInline) return;


        state.isOpen = false;
        this.setState(datePicker, state);

        const dropdown = DOMUtils.querySelector('[data-date-picker-dropdown]', datePicker) as HTMLElement;
        if (!dropdown) return;

        dropdown.classList.remove('open');

        // Return focus to input
        const input = DOMUtils.querySelector('[data-date-picker-input]', datePicker) as HTMLElement;
        if (input) {
            input.focus();
        }

        // Dispatch close event
        this.dispatchDatePickerEvent(datePicker, 'datepicker:closed');
    }

    /**
     * Update dropdown position based on viewport
     */
    private updateDropdownPosition(datePicker: HTMLElement): void {
        const dropdown = DOMUtils.querySelector('[data-date-picker-dropdown]', datePicker) as HTMLElement;
        if (!dropdown) return;

        const state = this.getState(datePicker);
        if (!state) return;

        // Get viewport dimensions
        const viewportHeight = window.innerHeight;
        const rect = datePicker.getBoundingClientRect();
        const dropdownHeight = dropdown.offsetHeight || 400; // Estimate if not visible

        // Calculate space above and below
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Determine position
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
            dropdown.classList.add('top');
            state.position = 'top';
        } else {
            dropdown.classList.remove('top');
            state.position = 'bottom';
        }

        this.setState(datePicker, state);
    }

    /**
     * Handle date selection from calendar
     */
    private handleDateSelected(datePicker: HTMLElement, selectedDate: string | null, formattedDate: string | null): void {
        const state = this.getState(datePicker);
        if (!state) return;


        state.selectedDate = selectedDate;
        this.setState(datePicker, state);

        // Update input display
        const input = DOMUtils.querySelector('[data-date-picker-input]', datePicker) as HTMLInputElement;
        if (input && formattedDate) {
            input.value = DateUtils.formatDateForDisplay(selectedDate, state.displayFormat);
        }

        // Update hidden input
        const hiddenInput = DOMUtils.querySelector('[data-date-picker-value]', datePicker) as HTMLInputElement;
        if (hiddenInput) {
            hiddenInput.value = selectedDate ? DateUtils.formatDateForSubmission(selectedDate, state.format) : '';
        }

        // Close dropdown if configured (only for single date mode, range mode handles closing in handleRangeSelected)
        if (state.closeOnSelect && !state.isInline && !state.isRange) {
            AnimationUtils.createTimer(() => {
                this.closeDropdown(datePicker);
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

        // Update input display
        const input = DOMUtils.querySelector('[data-date-picker-input]', datePicker) as HTMLInputElement;
        if (input) {
            input.value = DateUtils.formatRangeForDisplay(startDate, endDate, state.displayFormat);
        }

        // Update hidden input
        const hiddenInput = DOMUtils.querySelector('[data-date-picker-value]', datePicker) as HTMLInputElement;
        if (hiddenInput) {
            const rangeValue = DateUtils.formatRangeForSubmission(startDate, endDate, state.format);
            hiddenInput.value = rangeValue || '';
        }

        // Close dropdown if configured and range is complete
        if (state.closeOnSelect && startDate && endDate && !state.isInline) {
            AnimationUtils.createTimer(() => {
                this.closeDropdown(datePicker);
            }, 150);
        }

        // Clear button visibility is handled by template conditional rendering

        // Dispatch change event
        this.dispatchDatePickerEvent(datePicker, 'datepicker:change', {
            startDate: startDate,
            endDate: endDate,
            formatted: formattedRange
        });
    }

    /**
     * Handle calendar cleared event
     */
    private handleCalendarCleared(datePicker: HTMLElement): void {
        this.clearDate(datePicker);
    }

    /**
     * Clear selected date(s)
     */
    private clearDate(datePicker: HTMLElement): void {
        const state = this.getState(datePicker);
        if (!state) return;

        // Clear state
        state.selectedDate = null;
        state.startDate = null;
        state.endDate = null;
        this.setState(datePicker, state);

        // Clear input display
        const input = DOMUtils.querySelector('[data-date-picker-input]', datePicker) as HTMLInputElement;
        if (input) {
            input.value = '';
        }

        // Clear hidden input
        const hiddenInput = DOMUtils.querySelector('[data-date-picker-value]', datePicker) as HTMLInputElement;
        if (hiddenInput) {
            hiddenInput.value = '';
        }

        // Clear calendar selection
        const calendar = DOMUtils.querySelector('[data-calendar="true"]', datePicker);
        if (calendar && (window as any).CalendarActions) {
            try {
                const calendarActions = (window as any).CalendarActions.getInstance();
                if (state.isRange) {
                    // Clear range selection
                    const calendarState = calendarActions.getCalendarState(calendar);
                    if (calendarState) {
                        calendarState.startDate = null;
                        calendarState.endDate = null;
                        calendarState.rangeSelectionState = 'none';
                        calendarActions.setState(calendar, calendarState);
                        // Trigger re-render
                        calendar.dispatchEvent(new CustomEvent('calendar:cleared'));
                    }
                } else {
                    calendarActions.setSelectedDate(calendar, null);
                }
            } catch (error) {
                console.warn('Calendar actions not available or failed:', error);
            }
        }

        // Clear button visibility is handled by template conditional rendering

        // Close dropdown
        if (!state.isInline) {
            this.closeDropdown(datePicker);
        }

        // Dispatch clear event
        this.dispatchDatePickerEvent(datePicker, 'datepicker:cleared');
    }

    /**
     * Apply quick selector
     */
    private applyQuickSelector(datePicker: HTMLElement, selector: string): void {
        const state = this.getState(datePicker);
        if (!state) return;

        const { start, end } = DateUtils.getQuickSelectorDate(selector);
        let selectedDate = start;
        let startDate = start;
        let endDate = end;

        // Update calendar
        const calendar = DOMUtils.querySelector('[data-calendar="true"]', datePicker);
        if (calendar && (window as any).CalendarActions) {
            try {
                const calendarActions = (window as any).CalendarActions.getInstance();

                if (state.isRange && startDate && endDate) {
                    // Set range dates
                    const calendarState = calendarActions.getCalendarState(calendar);
                    if (calendarState) {
                        calendarState.startDate = DateUtils.formatDateString(startDate);
                        calendarState.endDate = DateUtils.formatDateString(endDate);
                        calendarState.rangeSelectionState = 'none';
                        calendarActions.setState(calendar, calendarState);

                        // Trigger calendar update
                        calendar.dispatchEvent(new CustomEvent('calendar:rangeSelected', {
                            detail: {
                                startDate: calendarState.startDate,
                                endDate: calendarState.endDate,
                                formattedRange: DateUtils.formatRangeForDisplay(calendarState.startDate, calendarState.endDate, state.displayFormat)
                            }
                        }));
                    }
                } else if (selectedDate) {
                    // Set single date
                    const dateString = DateUtils.formatDateString(selectedDate);
                    calendarActions.setSelectedDate(calendar, dateString);
                }
            } catch (error) {
                console.warn('Calendar actions not available or failed:', error);
            }
        }
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

            // Update calendar
            const calendar = DOMUtils.querySelector('[data-calendar="true"]', datePicker);
            if (calendar && (window as any).CalendarActions) {
                try {
                    const calendarActions = (window as any).CalendarActions.getInstance();
                    calendarActions.setSelectedDate(calendar, dateString);
                } catch (error) {
                    console.warn('Calendar actions not available or failed:', error);
                }
            }
        }
    }

    // updateClearButtonVisibility method removed - visibility handled by template conditional rendering








    /**
     * Check if date picker is disabled
     */
    private isDisabled(datePicker: HTMLElement): boolean {
        const state = this.getState(datePicker);
        return state ? state.isDisabled : false;
    }

    /**
     * Dispatch custom date picker event
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
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Check if the added node is a date picker
                    if (DOMUtils.hasDataAttribute(element, 'date-picker', 'true')) {
                        this.initializeDatePicker(element);
                    }

                    // Check for date pickers within the added node
                    DOMUtils.findByDataAttribute('date-picker', 'true', element).forEach(datePicker => {
                        this.initializeDatePicker(datePicker);
                    });
                }
            });
        });
    }

    /**
     * Clean up DatePickerActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // DatePickerActions doesn't have additional cleanup beyond base class
        // Event listeners and observers are automatically cleaned up
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