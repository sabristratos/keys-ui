/**
 * CalendarDateSelection - Handles date selection logic for Calendar components
 *
 * Provides functionality for:
 * - Single date selection
 * - Range date selection with start/end logic
 * - Date validation and range state management
 * - Visual feedback for date selection states
 */

export interface CalendarDay {
    date: string;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDisabled: boolean;
    isInRange?: boolean;
    isRangeStart?: boolean;
    isRangeEnd?: boolean;
}

export interface CalendarState {
    currentMonth: string;
    selectedDate: string | null;
    startDate: string | null;
    endDate: string | null;
    focusedDate: string | null;
    isDisabled: boolean;
    isRange: boolean;
    monthsToShow: number;
    minDate: string | null;
    maxDate: string | null;
    disabledDates: string[];
    weekdays: string[];
    monthNames: string[];
    viewMode: 'calendar' | 'month' | 'year';
    rangeSelectionState: 'none' | 'selecting-start' | 'selecting-end';
    format: string;
    displayFormat: string;
}

export class CalendarDateSelection {

    /**
     * Handle date selection for both single and range modes
     */
    public static selectDate(calendar: HTMLElement, dateString: string, state: CalendarState, setState: (newState: Partial<CalendarState>) => void): void {
        if (state.isDisabled) return;

        if (state.isRange) {
            this.handleRangeSelection(calendar, dateString, state, setState);
        } else {
            setState({
                selectedDate: dateString,
                focusedDate: dateString
            });
        }
    }

    /**
     * Handle range selection logic with proper start/end management
     */
    private static handleRangeSelection(calendar: HTMLElement, dateString: string, state: CalendarState, setState: (newState: Partial<CalendarState>) => void): void {
        const clickedDate = new Date(dateString);

        if (!state.startDate || state.rangeSelectionState === 'none') {
            setState({
                startDate: dateString,
                endDate: null,
                focusedDate: dateString,
                rangeSelectionState: 'selecting-end'
            });
            return;
        }

        if (state.startDate && !state.endDate) {
            const startDate = new Date(state.startDate);

            if (clickedDate < startDate) {
                setState({
                    startDate: dateString,
                    endDate: null,
                    focusedDate: dateString,
                    rangeSelectionState: 'selecting-end'
                });
            } else if (clickedDate.getTime() === startDate.getTime()) {
                setState({
                    startDate: null,
                    endDate: null,
                    focusedDate: dateString,
                    rangeSelectionState: 'none'
                });
            } else {
                setState({
                    endDate: dateString,
                    focusedDate: dateString,
                    rangeSelectionState: 'none'
                });
            }
            return;
        }

        setState({
            startDate: dateString,
            endDate: null,
            focusedDate: dateString,
            rangeSelectionState: 'selecting-end'
        });
    }

    /**
     * Clear selected dates (single or range)
     */
    public static clearSelection(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void): void {
        if (state.isRange) {
            setState({
                startDate: null,
                endDate: null,
                rangeSelectionState: 'none'
            });
        } else {
            setState({
                selectedDate: null
            });
        }
    }

    /**
     * Select today's date
     */
    public static selectToday(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void): void {
        const today = this.getTodayDate();

        if (state.isRange) {
            setState({
                startDate: today,
                endDate: today,
                focusedDate: today,
                rangeSelectionState: 'none'
            });
        } else {
            setState({
                selectedDate: today,
                focusedDate: today
            });
        }
    }

    /**
     * Format range dates for display
     */
    public static formatRangeForDisplay(startDate: string | null, endDate: string | null): string {
        if (!startDate && !endDate) return '';
        if (startDate && endDate) return `${startDate},${endDate}`;
        if (startDate) return `${startDate},`;
        return '';
    }

    /**
     * Check if a date is within the selected range
     */
    public static isDateInRange(dateString: string, startDate: string | null, endDate: string | null): boolean {
        if (!startDate || !endDate) return false;
        const date = new Date(dateString);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return date >= start && date <= end;
    }

    /**
     * Check if a date is the range start
     */
    public static isDateRangeStart(dateString: string, startDate: string | null): boolean {
        return startDate === dateString;
    }

    /**
     * Check if a date is the range end
     */
    public static isDateRangeEnd(dateString: string, endDate: string | null): boolean {
        return endDate === dateString;
    }

    /**
     * Get range attributes for styling
     */
    public static getRangeAttributes(day: CalendarDay, state: CalendarState): string {
        if (!state.isRange) return '';

        const attributes: string[] = [];

        if (day.isInRange) {
            attributes.push('data-is-in-range="true"');
        }

        if (day.isRangeStart) {
            attributes.push('data-is-range-start="true"');
        }

        if (day.isRangeEnd) {
            attributes.push('data-is-range-end="true"');
        }

        return attributes.join(' ');
    }

    /**
     * Get today's date in YYYY-MM-DD format
     */
    private static getTodayDate(): string {
        const today = new Date();
        return today.getFullYear() + '-' +
               String(today.getMonth() + 1).padStart(2, '0') + '-' +
               String(today.getDate()).padStart(2, '0');
    }

    /**
     * Check if a date string represents today
     */
    public static isToday(dateString: string): boolean {
        return dateString === this.getTodayDate();
    }
}