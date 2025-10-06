/**
 * CalendarRenderer - Handles rendering and grid generation for Calendar components
 *
 * Provides functionality for:
 * - Calendar grid generation with proper date calculations
 * - Single and multi-month rendering
 * - Day button styling and state management
 * - Month/year selection grids
 * - Responsive cell sizing and animations
 */

import { CalendarDay, CalendarState } from './CalendarDateSelection';
import { CalendarDateSelection } from './CalendarDateSelection';

export class CalendarRenderer {

    /**
     * Generate calendar grid data for a specific month
     */
    public static generateCalendarGrid(calendar: HTMLElement, state: CalendarState, monthOffset: number = 0): Array<Array<CalendarDay>> {
        const currentMonth = this.addMonthsToDate(state.currentMonth + '-01', monthOffset);
        const year = parseInt(currentMonth.substring(0, 4));
        const month = parseInt(currentMonth.substring(5, 7)) - 1;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const weeks: Array<Array<CalendarDay>> = [];
        let currentWeek: Array<CalendarDay> = [];

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dateString = this.formatDateString(date);
            const isCurrentMonth = date.getMonth() === month;
            const isToday = CalendarDateSelection.isToday(dateString);
            const isSelected = state.selectedDate === dateString;
            const isDisabled = this.isDateDisabled(calendar, date, state);

            const isInRange = state.isRange ? CalendarDateSelection.isDateInRange(dateString, state.startDate, state.endDate) : false;
            const isRangeStart = state.isRange ? CalendarDateSelection.isDateRangeStart(dateString, state.startDate) : false;
            const isRangeEnd = state.isRange ? CalendarDateSelection.isDateRangeEnd(dateString, state.endDate) : false;

            const day: CalendarDay = {
                date: dateString,
                day: date.getDate(),
                isCurrentMonth,
                isToday,
                isSelected,
                isDisabled,
                isInRange,
                isRangeStart,
                isRangeEnd
            };

            currentWeek.push(day);

            if (currentWeek.length === 7) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
        }

        return weeks;
    }

    /**
     * Render the complete calendar grid
     */
    public static renderCalendarGrid(calendar: HTMLElement, state: CalendarState): void {
        if (state.monthsToShow > 1) {
            this.renderMultipleMonths(calendar, state);
        } else {
            this.renderSingleMonth(calendar, state);
        }
    }

    /**
     * Render a single month calendar
     */
    private static renderSingleMonth(calendar: HTMLElement, state: CalendarState): void {
        const gridContainer = calendar.querySelector('[data-calendar-grid-container]') as HTMLElement;
        if (!gridContainer) return;

        const weeks = this.generateCalendarGrid(calendar, state);
        const cellClasses = this.getCellClasses(calendar);

        const weekdaysHTML = state.weekdays.map(day =>
            `<div class="${cellClasses} font-semibold text-muted text-center">${day}</div>`
        ).join('');

        const daysHTML = weeks.map(week =>
            week.map(day => {
                const buttonClasses = this.getDayButtonClasses(day, calendar, state);
                const rangeAttributes = CalendarDateSelection.getRangeAttributes(day, state);
                const ariaLabel = this.getDateAriaLabel(day, state);

                return `
                    <div class="calendar-day ${cellClasses}">
                        <button
                            type="button"
                            class="${buttonClasses}"
                            data-date="${day.date}"
                            data-calendar-day-btn
                            ${day.isDisabled ? 'disabled' : ''}
                            ${rangeAttributes}
                            aria-label="${ariaLabel}"
                            tabindex="${day.date === state.focusedDate ? '0' : '-1'}"
                        >
                            ${day.day}
                        </button>
                    </div>
                `;
            }).join('')
        ).join('');

        const html = `
            <div class="calendar-weekdays-grid grid grid-cols-7 gap-0">
                ${weekdaysHTML}
            </div>
            <div class="calendar-days-grid grid grid-cols-7 gap-0">
                ${daysHTML}
            </div>
        `;

        gridContainer.innerHTML = html;
    }

    /**
     * Render multiple months calendar
     */
    private static renderMultipleMonths(calendar: HTMLElement, state: CalendarState): void {
        const gridContainers = calendar.querySelectorAll('[data-calendar-grid-container]');

        gridContainers.forEach((container, index) => {
            if (index >= state.monthsToShow) return;

            const weeks = this.generateCalendarGrid(calendar, state, index);
            const cellClasses = this.getCellClasses(calendar);
            const monthDate = this.addMonthsToDate(state.currentMonth + '-01', index);
            const monthName = state.monthNames[parseInt(monthDate.substring(5, 7)) - 1];
            const year = monthDate.substring(0, 4);

            const monthHeaderHTML = `
                <div class="calendar-month-header text-center font-semibold text-sm mb-2 text-muted">
                    ${monthName} ${year}
                </div>
            `;

            const weekdaysHTML = state.weekdays.map(day =>
                `<div class="${cellClasses} font-semibold text-muted text-center text-xs">${day}</div>`
            ).join('');

            const daysHTML = weeks.map(week =>
                week.map(day => {
                    const buttonClasses = this.getDayButtonClasses(day, calendar, state);
                    const rangeAttributes = CalendarDateSelection.getRangeAttributes(day, state);
                    const ariaLabel = this.getDateAriaLabel(day, state);

                    return `
                        <div class="calendar-day ${cellClasses}">
                            <button
                                type="button"
                                class="${buttonClasses}"
                                data-date="${day.date}"
                                data-calendar-day-btn
                                data-month-index="${index}"
                                ${day.isDisabled ? 'disabled' : ''}
                                ${rangeAttributes}
                                aria-label="${ariaLabel}"
                                tabindex="${day.date === state.focusedDate ? '0' : '-1'}"
                            >
                                ${day.day}
                            </button>
                        </div>
                    `;
                }).join('')
            ).join('');

            const html = `
                ${monthHeaderHTML}
                <div class="calendar-weekdays-grid grid grid-cols-7 gap-0 mb-1">
                    ${weekdaysHTML}
                </div>
                <div class="calendar-days-grid grid grid-cols-7 gap-0">
                    ${daysHTML}
                </div>
            `;

            container.innerHTML = html;
        });
    }

    /**
     * Get responsive cell classes based on calendar size
     */
    private static getCellClasses(calendar: HTMLElement): string {
        const size = calendar.dataset.size || 'sm';

        return {
            'sm': 'w-8 h-8 text-xs',
            'md': 'w-10 h-10 text-sm',
            'lg': 'w-12 h-12 text-base'
        }[size] || 'w-8 h-8 text-xs';
    }

    /**
     * Get day button classes with proper state styling
     */
    private static getDayButtonClasses(day: CalendarDay, calendar: HTMLElement, state: CalendarState): string {
        const size = calendar.dataset.size || 'sm';

        const baseClasses = 'w-full h-full rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1';

        const sizeClasses = {
            'sm': 'text-xs',
            'md': 'text-sm font-medium',
            'lg': 'text-base font-medium'
        }[size] || 'text-sm font-medium';

        let stateClasses = '';

        if (day.isDisabled) {
            stateClasses = 'bg-elevation-1 text-muted border-transparent cursor-not-allowed opacity-40 hover:bg-elevation-1 hover:border-transparent';
        } else if (day.isSelected && !state.isRange) {
            stateClasses = 'bg-accent text-white border-accent-600 font-bold shadow-sm';
        } else if (day.isToday) {
            stateClasses = 'bg-neutral-50 text-accent border-accent font-semibold';
        } else if (!day.isCurrentMonth) {
            stateClasses = 'text-muted border-transparent hover:bg-neutral-hover hover:border-line';
        } else {
            stateClasses = 'text-primary border-transparent hover:bg-neutral-hover hover:border-line';
        }

        return `${baseClasses} ${sizeClasses} ${stateClasses}`.trim();
    }

    /**
     * Generate accessible aria-label for date buttons
     */
    private static getDateAriaLabel(day: CalendarDay, state: CalendarState): string {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const monthName = date.toLocaleDateString('en-US', { month: 'long' });

        let label = `${dayName}, ${monthName} ${day.day}, ${date.getFullYear()}`;

        if (day.isToday) label += ', today';
        if (day.isSelected) label += ', selected';
        if (day.isRangeStart) label += ', range start';
        if (day.isRangeEnd) label += ', range end';
        if (day.isInRange) label += ', in range';
        if (day.isDisabled) label += ', disabled';

        return label;
    }

    /**
     * Check if a date should be disabled
     */
    private static isDateDisabled(calendar: HTMLElement, date: Date, state: CalendarState): boolean {
        if (state.isDisabled) return true;

        const dateString = this.formatDateString(date);

        if (state.minDate && dateString < state.minDate) return true;
        if (state.maxDate && dateString > state.maxDate) return true;

        if (state.disabledDates && Array.isArray(state.disabledDates)) {
            return state.disabledDates.includes(dateString);
        }

        return false;
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
     * Add months to a date string
     */
    private static addMonthsToDate(dateString: string, months: number): string {
        const date = new Date(dateString);
        date.setMonth(date.getMonth() + months);
        return this.formatDateString(date);
    }
}
