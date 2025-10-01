/**
 * CalendarKeyboard - Handles keyboard navigation for Calendar components
 *
 * Provides functionality for:
 * - Arrow key navigation between dates
 * - Page Up/Down for month navigation
 * - Home/End for week navigation
 * - Enter/Space for date selection
 * - Escape for closing dropdowns
 * - Accessible focus management
 */

import { CalendarState } from './CalendarDateSelection';

export class CalendarKeyboard {

    /**
     * Handle keyboard navigation
     */
    public static handleKeydown(calendar: HTMLElement, event: KeyboardEvent, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onSelect: (dateString: string) => void, onRender: () => void): void {
        if (state.isDisabled || !state.focusedDate) return;

        const { key, ctrlKey, shiftKey } = event;

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', 'Enter', ' ', 'Escape'].includes(key)) {
            event.preventDefault();
        }

        switch (key) {
            case 'ArrowLeft':
                this.navigateByDays(calendar, -1, state, setState, onRender);
                break;

            case 'ArrowRight':
                this.navigateByDays(calendar, 1, state, setState, onRender);
                break;

            case 'ArrowUp':
                this.navigateByDays(calendar, -7, state, setState, onRender);
                break;

            case 'ArrowDown':
                this.navigateByDays(calendar, 7, state, setState, onRender);
                break;

            case 'PageUp':
                if (shiftKey) {
                    this.navigateByYears(calendar, -1, state, setState, onRender);
                } else {
                    this.navigateByMonths(calendar, -1, state, setState, onRender);
                }
                break;

            case 'PageDown':
                if (shiftKey) {
                    this.navigateByYears(calendar, 1, state, setState, onRender);
                } else {
                    this.navigateByMonths(calendar, 1, state, setState, onRender);
                }
                break;

            case 'Home':
                if (ctrlKey) {
                    this.navigateToToday(calendar, state, setState, onRender);
                } else {
                    this.navigateToWeekStart(calendar, state, setState, onRender);
                }
                break;

            case 'End':
                this.navigateToWeekEnd(calendar, state, setState, onRender);
                break;

            case 'Enter':
            case ' ':
                if (state.focusedDate) {
                    onSelect(state.focusedDate);
                }
                break;

            case 'Escape':
                this.handleEscape(calendar, state, setState, onRender);
                break;

            case 't':
            case 'T':
                if (!ctrlKey && !shiftKey) {
                    this.navigateToToday(calendar, state, setState, onRender);
                }
                break;
        }
    }

    /**
     * Navigate by a specific number of days
     */
    private static navigateByDays(calendar: HTMLElement, days: number, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        if (!state.focusedDate) return;

        const newDate = this.addDaysToDate(state.focusedDate, days);

        if (this.isDateNavigable(newDate, state)) {
            this.focusDate(calendar, newDate, state, setState, onRender);
        }
    }

    /**
     * Navigate by a specific number of months
     */
    private static navigateByMonths(calendar: HTMLElement, months: number, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        if (!state.focusedDate) return;

        const currentDate = new Date(state.focusedDate);
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + months);

        if (newDate.getDate() !== currentDate.getDate()) {
            newDate.setDate(0);
        }

        const newDateString = this.formatDateString(newDate);

        if (this.isDateNavigable(newDateString, state)) {
            const newMonth = this.formatYearMonth(newDate);
            if (newMonth !== state.currentMonth) {
                setState({
                    currentMonth: newMonth,
                    focusedDate: newDateString
                });
                onRender();
            } else {
                this.focusDate(calendar, newDateString, state, setState, onRender);
            }
        }
    }

    /**
     * Navigate by a specific number of years
     */
    private static navigateByYears(calendar: HTMLElement, years: number, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        if (!state.focusedDate) return;

        const currentDate = new Date(state.focusedDate);
        const newDate = new Date(currentDate);
        newDate.setFullYear(currentDate.getFullYear() + years);

        if (newDate.getMonth() !== currentDate.getMonth()) {
            newDate.setDate(0);
        }

        const newDateString = this.formatDateString(newDate);

        if (this.isDateNavigable(newDateString, state)) {
            const newMonth = this.formatYearMonth(newDate);
            setState({
                currentMonth: newMonth,
                focusedDate: newDateString
            });
            setTimeout(() => onRender(), 100);
        }
    }

    /**
     * Navigate to the start of the current week (Sunday)
     */
    private static navigateToWeekStart(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        if (!state.focusedDate) return;

        const currentDate = new Date(state.focusedDate);
        const daysToSubtract = currentDate.getDay();
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - daysToSubtract);

        const newDateString = this.formatDateString(weekStart);

        if (this.isDateNavigable(newDateString, state)) {
            this.focusDate(calendar, newDateString, state, setState, onRender);
        }
    }

    /**
     * Navigate to the end of the current week (Saturday)
     */
    private static navigateToWeekEnd(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        if (!state.focusedDate) return;

        const currentDate = new Date(state.focusedDate);
        const daysToAdd = 6 - currentDate.getDay();
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(currentDate.getDate() + daysToAdd);

        const newDateString = this.formatDateString(weekEnd);

        if (this.isDateNavigable(newDateString, state)) {
            this.focusDate(calendar, newDateString, state, setState, onRender);
        }
    }

    /**
     * Navigate to today's date
     */
    private static navigateToToday(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        const today = this.getTodayDate();

        if (this.isDateNavigable(today, state)) {
            const todayMonth = this.formatYearMonth(new Date(today));

            if (todayMonth !== state.currentMonth) {
                setState({
                    currentMonth: todayMonth,
                    focusedDate: today
                });
                onRender();
            } else {
                this.focusDate(calendar, today, state, setState, onRender);
            }
        }
    }

    /**
     * Handle Escape key - close dropdowns or cancel operations
     */
    private static handleEscape(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        if (state.viewMode !== 'calendar') {
            setState({ viewMode: 'calendar' });
            setTimeout(() => onRender(), 100);
        } else if (state.isRange && state.rangeSelectionState === 'selecting-end') {
            setState({
                rangeSelectionState: 'none',
                startDate: null,
                endDate: null
            });
            setTimeout(() => onRender(), 100);
        }
    }

    /**
     * Focus a specific date and update visual state
     */
    private static focusDate(calendar: HTMLElement, dateString: string, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        setState({ focusedDate: dateString });

        calendar.querySelectorAll('[data-calendar-day-btn]').forEach(btn => {
            btn.setAttribute('tabindex', '-1');
        });

        const targetButton = calendar.querySelector(`[data-calendar-day-btn][data-date="${dateString}"]`) as HTMLButtonElement;
        if (targetButton) {
            targetButton.setAttribute('tabindex', '0');
            targetButton.focus();
        }
    }

    /**
     * Check if a date can be navigated to (not disabled)
     */
    private static isDateNavigable(dateString: string, state: CalendarState): boolean {
        if (state.minDate && dateString < state.minDate) return false;
        if (state.maxDate && dateString > state.maxDate) return false;
        if (state.disabledDates.includes(dateString)) return false;
        return true;
    }

    /**
     * Add days to a date string
     */
    private static addDaysToDate(dateString: string, days: number): string {
        const date = new Date(dateString);
        date.setDate(date.getDate() + days);
        return this.formatDateString(date);
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

    /**
     * Get today's date in YYYY-MM-DD format
     */
    private static getTodayDate(): string {
        const today = new Date();
        return this.formatDateString(today);
    }

    /**
     * Set up keyboard event listeners for a calendar
     */
    public static bindKeyboardEvents(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onSelect: (dateString: string) => void, onRender: () => void): void {
        calendar.removeEventListener('keydown', calendar.dataset.keydownHandler as any);

        const keydownHandler = (event: KeyboardEvent) => {
            this.handleKeydown(calendar, event, state, setState, onSelect, onRender);
        };

        calendar.dataset.keydownHandler = keydownHandler.toString();
        calendar.addEventListener('keydown', keydownHandler);

        if (!calendar.hasAttribute('tabindex')) {
            calendar.setAttribute('tabindex', '0');
        }
    }

    /**
     * Initialize focus for a calendar
     */
    public static initializeFocus(calendar: HTMLElement, state: CalendarState): void {
        const focusDate = state.focusedDate || this.getTodayDate();

        const targetButton = calendar.querySelector(`[data-calendar-day-btn][data-date="${focusDate}"]`) as HTMLButtonElement;
        if (targetButton) {
            targetButton.setAttribute('tabindex', '0');

            if (document.activeElement === calendar) {
                targetButton.focus();
            }
        }
    }

    /**
     * Cleanup keyboard event listeners
     */
    public static unbindKeyboardEvents(calendar: HTMLElement): void {
        const keydownHandler = calendar.dataset.keydownHandler;
        if (keydownHandler) {
            calendar.removeEventListener('keydown', keydownHandler as any);
            delete calendar.dataset.keydownHandler;
        }
    }
}