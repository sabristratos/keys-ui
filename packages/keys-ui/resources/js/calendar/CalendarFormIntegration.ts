/**
 * CalendarFormIntegration - Handles form integration and events for Calendar components
 *
 * Provides functionality for:
 * - Hidden input updates for form submission
 * - Custom event dispatching for framework integration
 * - Quick selector handling
 * - Footer action management
 * - Livewire/Alpine.js integration
 */

import { CalendarState } from './CalendarDateSelection';
import { CalendarDateSelection } from './CalendarDateSelection';
import { CalendarNavigation } from './CalendarNavigation';
import { DateUtils } from '../utils/DateUtils';

export class CalendarFormIntegration {

    /**
     * Update hidden form inputs based on current selection
     */
    public static updateHiddenInput(calendar: HTMLElement, state: CalendarState): void {
        if (state.isRange) {
            this.updateRangeInputs(calendar, state);
        } else {
            this.updateSingleInput(calendar, state);
        }
    }

    /**
     * Update hidden inputs for range mode
     */
    private static updateRangeInputs(calendar: HTMLElement, state: CalendarState): void {
        const startInput = calendar.querySelector('.calendar-start-input') as HTMLInputElement;
        const endInput = calendar.querySelector('.calendar-end-input') as HTMLInputElement;
        const rangeInput = calendar.querySelector('.calendar-range-input') as HTMLInputElement;

        if (startInput) {
            startInput.value = state.startDate || '';
        }

        if (endInput) {
            endInput.value = state.endDate || '';
        }

        if (rangeInput) {
            rangeInput.value = CalendarDateSelection.formatRangeForDisplay(state.startDate, state.endDate);
        }

        [startInput, endInput, rangeInput].forEach(input => {
            if (input) {
                this.dispatchInputChangeEvent(input);
            }
        });
    }

    /**
     * Update hidden input for single date mode
     */
    private static updateSingleInput(calendar: HTMLElement, state: CalendarState): void {
        const input = calendar.querySelector('.calendar-hidden-input') as HTMLInputElement;

        if (input) {
            input.value = state.selectedDate || '';
            this.dispatchInputChangeEvent(input);
        }
    }

    /**
     * Dispatch change event on input for framework integration
     */
    private static dispatchInputChangeEvent(input: HTMLInputElement): void {
        const inputEvent = new Event('input', { bubbles: true });
        const changeEvent = new Event('change', { bubbles: true });

        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);

        if ((window as any).Livewire && input.hasAttribute('wire:model')) {
            (window as any).Livewire.hook('message.processed', () => {
            });
        }
    }

    /**
     * Handle quick selector actions
     */
    public static handleQuickSelector(calendar: HTMLElement, selectorValue: string, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        const today = new Date();
        let startDate: string | null = null;
        let endDate: string | null = null;
        let selectedDate: string | null = null;

        switch (selectorValue) {
            case 'today':
                selectedDate = this.formatDateString(today);
                if (this.isDateDisabled(selectedDate, state)) {
                    console.warn('Today is disabled and cannot be selected');
                    return;
                }
                if (state.isRange) {
                    startDate = selectedDate;
                    endDate = selectedDate;
                }
                break;

            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                selectedDate = this.formatDateString(yesterday);
                if (this.isDateDisabled(selectedDate, state)) {
                    console.warn('Yesterday is disabled and cannot be selected');
                    return;
                }
                if (state.isRange) {
                    startDate = selectedDate;
                    endDate = selectedDate;
                }
                break;

            case 'last7days':
                if (state.isRange) {
                    endDate = this.formatDateString(today);
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 6);
                    startDate = this.formatDateString(sevenDaysAgo);
                }
                break;

            case 'last30days':
                if (state.isRange) {
                    endDate = this.formatDateString(today);
                    const thirtyDaysAgo = new Date(today);
                    thirtyDaysAgo.setDate(today.getDate() - 29);
                    startDate = this.formatDateString(thirtyDaysAgo);
                }
                break;

            case 'thismonth':
                if (state.isRange) {
                    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                    startDate = this.formatDateString(firstDay);
                    endDate = this.formatDateString(lastDay);
                }
                break;

            case 'lastmonth':
                if (state.isRange) {
                    const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
                    startDate = this.formatDateString(firstDay);
                    endDate = this.formatDateString(lastDay);
                }
                break;

            case 'thisyear':
                if (state.isRange) {
                    const firstDay = new Date(today.getFullYear(), 0, 1);
                    const lastDay = new Date(today.getFullYear(), 11, 31);
                    startDate = this.formatDateString(firstDay);
                    endDate = this.formatDateString(lastDay);
                }
                break;

            default:
                console.warn(`Unknown quick selector value: ${selectorValue}`);
                return;
        }

        const targetDate = endDate || selectedDate;
        let targetMonth = state.currentMonth;
        if (targetDate) {
            targetMonth = this.formatYearMonth(new Date(targetDate));
        }

        if (state.isRange && startDate && endDate) {
            setState({
                startDate,
                endDate,
                rangeSelectionState: 'none',
                focusedDate: endDate,
                viewMode: 'calendar',
                currentMonth: targetMonth
            });
        } else if (!state.isRange && selectedDate) {
            setState({
                selectedDate,
                focusedDate: selectedDate,
                viewMode: 'calendar',
                currentMonth: targetMonth
            });
        }

        onRender();
        CalendarNavigation.updateMonthYearDisplay(calendar, state.monthNames, targetMonth);
        this.updateHiddenInput(calendar, state);

        const formattedSelectedDate = selectedDate ? DateUtils.formatDateForDisplay(selectedDate, state.displayFormat) : null;
        const formattedStartDate = startDate ? DateUtils.formatDateForDisplay(startDate, state.displayFormat) : null;
        const formattedEndDate = endDate ? DateUtils.formatDateForDisplay(endDate, state.displayFormat) : null;

        if (state.isRange && startDate && endDate) {
            this.dispatchCalendarEvent(calendar, 'rangeSelected', {
                startDate,
                endDate,
                formattedRange: DateUtils.formatRangeForDisplay(startDate, endDate, state.displayFormat),
                source: 'quickSelector'
            });
        } else if (!state.isRange && selectedDate) {
            this.dispatchCalendarEvent(calendar, 'dateSelected', {
                selectedDate,
                formattedDate: formattedSelectedDate,
                source: 'quickSelector'
            });
        }
    }

    /**
     * Check if a date is disabled based on calendar constraints
     */
    private static isDateDisabled(dateString: string, state: CalendarState): boolean {
        const dateObj = DateUtils.parseDate(dateString);
        if (!dateObj) return true;

        if (state.minDate) {
            const minDateObj = DateUtils.parseDate(state.minDate);
            if (minDateObj && dateObj < minDateObj) {
                return true;
            }
        }

        if (state.maxDate) {
            const maxDateObj = DateUtils.parseDate(state.maxDate);
            if (maxDateObj && dateObj > maxDateObj) {
                return true;
            }
        }

        if (state.disabledDates && state.disabledDates.includes(dateString)) {
            return true;
        }

        return false;
    }

    /**
     * Handle footer actions (clear, today)
     */
    public static handleFooterAction(calendar: HTMLElement, action: string, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        switch (action) {
            case 'clear':
                CalendarDateSelection.clearSelection(calendar, state, setState);
                onRender();
                this.updateHiddenInput(calendar, state);
                this.dispatchCalendarEvent(calendar, 'cleared', {
                    source: 'footerAction'
                });
                break;

            case 'today':
                const today = this.formatDateString(new Date());
                const todayMonth = this.formatYearMonth(new Date());

                if (this.isDateDisabled(today, state)) {
                    console.warn('Today is disabled and cannot be selected');
                    return;
                }

                if (state.isRange) {
                    setState({
                        startDate: today,
                        endDate: today,
                        focusedDate: today,
                        rangeSelectionState: 'none',
                        currentMonth: todayMonth
                    });
                } else {
                    setState({
                        selectedDate: today,
                        focusedDate: today,
                        currentMonth: todayMonth
                    });
                }

                onRender();
                CalendarNavigation.updateMonthYearDisplay(calendar, state.monthNames, todayMonth);
                this.updateHiddenInput(calendar, state);

                const formattedToday = DateUtils.formatDateForDisplay(today, state.displayFormat);

                this.dispatchCalendarEvent(calendar, 'dateSelected', {
                    selectedDate: state.isRange ? null : today,
                    startDate: state.isRange ? today : null,
                    endDate: state.isRange ? today : null,
                    formattedDate: state.isRange ? null : formattedToday,
                    formattedRange: state.isRange ? `${formattedToday} - ${formattedToday}` : null,
                    source: 'footerAction'
                });
                break;

            default:
                console.warn(`Unknown footer action: ${action}`);
        }
    }

    /**
     * Dispatch custom calendar events for framework integration
     */
    public static dispatchCalendarEvent(calendar: HTMLElement, eventName: string, detail: any = null): void {
        const event = new CustomEvent(`calendar:${eventName}`, {
            bubbles: true,
            cancelable: true,
            detail: {
                calendar,
                ...detail
            }
        });

        calendar.dispatchEvent(event);

        document.dispatchEvent(new CustomEvent(`keys:calendar:${eventName}`, {
            bubbles: true,
            cancelable: true,
            detail: {
                calendar,
                ...detail
            }
        }));
    }

    /**
     * Bind form integration event listeners
     */
    public static bindFormEvents(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        calendar.addEventListener('quickSelector:clicked', (event: any) => {
            const selectorValue = event.detail?.value;
            if (selectorValue) {
                this.handleQuickSelector(calendar, selectorValue, state, setState, onRender);
            }
        });

        calendar.addEventListener('click', (e) => {
            const selectorButton = (e.target as HTMLElement).closest('[data-quick-selector]') as HTMLElement;
            if (selectorButton) {
                const parentDatePicker = calendar.closest('[data-keys-date-picker]');
                if (!parentDatePicker) {
                    const selectorValue = selectorButton.dataset.quickSelector;
                    if (selectorValue) {
                        this.handleQuickSelector(calendar, selectorValue, state, setState, onRender);
                    }
                }
            }
        });

        calendar.addEventListener('click', (e) => {
            const actionButton = (e.target as HTMLElement).closest('[data-calendar-action]') as HTMLElement;
            if (actionButton) {
                const action = actionButton.dataset.calendarAction;
                if (action) {
                    this.handleFooterAction(calendar, action, state, setState, onRender);
                }
            }
        });
    }

    /**
     * Get current calendar state for external access
     */
    public static getCalendarState(calendar: HTMLElement, state: CalendarState): any {
        return {
            currentMonth: state.currentMonth,
            selectedDate: state.selectedDate,
            startDate: state.startDate,
            endDate: state.endDate,
            focusedDate: state.focusedDate,
            isRange: state.isRange,
            isDisabled: state.isDisabled,
            viewMode: state.viewMode,
            rangeSelectionState: state.rangeSelectionState,
            formattedValue: state.isRange
                ? CalendarDateSelection.formatRangeForDisplay(state.startDate, state.endDate)
                : state.selectedDate
        };
    }

    /**
     * Set selected date programmatically (external API)
     */
    public static setSelectedDate(calendar: HTMLElement, dateString: string | null, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        if (state.isRange) {
            console.warn('Use setSelectedRange for range calendars');
            return;
        }

        setState({
            selectedDate: dateString,
            focusedDate: dateString
        });

        if (dateString) {
            const targetMonth = this.formatYearMonth(new Date(dateString));
            if (targetMonth !== state.currentMonth) {
                setState({ currentMonth: targetMonth });
            }
        }

        onRender();
        this.updateHiddenInput(calendar, state);
        this.dispatchCalendarEvent(calendar, 'dateChanged', {
            selectedDate: dateString,
            source: 'programmatic'
        });
    }

    /**
     * Set selected range programmatically (external API)
     */
    public static setSelectedRange(calendar: HTMLElement, startDate: string | null, endDate: string | null, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        if (!state.isRange) {
            console.warn('Use setSelectedDate for single date calendars');
            return;
        }

        setState({
            startDate,
            endDate,
            rangeSelectionState: 'none',
            focusedDate: endDate || startDate
        });

        if (endDate || startDate) {
            const targetDate = endDate || startDate;
            const targetMonth = this.formatYearMonth(new Date(targetDate!));
            if (targetMonth !== state.currentMonth) {
                setState({ currentMonth: targetMonth });
            }
        }

        onRender();
        this.updateHiddenInput(calendar, state);
        this.dispatchCalendarEvent(calendar, 'rangeChanged', {
            startDate,
            endDate,
            source: 'programmatic'
        });
    }

    /**
     * Format date as YYYY-MM-DD string
     */
    private static formatDateString(date: Date): string {
        return date.getFullYear() + '-' +
               String(date.getMonth() + 1).padStart(2, '0') + '-' +
               String(date.getDate()).padStart(2, '0');
    }

    /**
     * Format date as YYYY-MM string
     */
    private static formatYearMonth(date: Date): string {
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    }
}