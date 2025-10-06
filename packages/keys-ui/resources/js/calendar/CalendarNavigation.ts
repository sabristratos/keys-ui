/**
 * CalendarNavigation - Handles navigation functionality for Calendar components
 *
 * Provides functionality for:
 * - Month navigation (previous/next)
 * - Year navigation and selection
 * - Month/year dropdown interfaces
 * - Loading states and transitions
 * - Navigation constraints (min/max dates)
 */

import { CalendarState } from './CalendarDateSelection';

export class CalendarNavigation {

    /**
     * Navigate to previous or next month
     */
    public static navigateMonth(calendar: HTMLElement, direction: 'prev' | 'next', state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        if (state.isDisabled) return;

        const currentDate = new Date(state.currentMonth + '-01');
        const newDate = new Date(currentDate);

        if (direction === 'prev') {
            newDate.setMonth(currentDate.getMonth() - 1);
        } else {
            newDate.setMonth(currentDate.getMonth() + 1);
        }

        const newMonth = this.formatYearMonth(newDate);

        if (!this.canNavigateToMonth(newDate, state)) {
            return;
        }

        setState({
            currentMonth: newMonth,
            viewMode: 'calendar'
        });

        onRender();
        this.updateMonthYearDisplay(calendar, state.monthNames, newMonth);
    }

    /**
     * Navigate to today's month
     */
    public static navigateToToday(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        const today = new Date();
        const todayMonth = this.formatYearMonth(today);

        if (todayMonth !== state.currentMonth) {
            setState({
                currentMonth: todayMonth,
                viewMode: 'calendar'
            });

            onRender();
            this.updateMonthYearDisplay(calendar, state.monthNames, todayMonth);
        }
    }

    /**
     * Toggle month/year dropdown
     */
    public static toggleMonthYearDropdown(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        if (state.isDisabled) return;

        if (state.viewMode === 'calendar') {
            setState({ viewMode: 'month' });
            this.renderMonthGrid(calendar, state, setState, onRender);
        } else if (state.viewMode === 'month') {
            setState({ viewMode: 'year' });
            this.renderYearGrid(calendar, state, setState, onRender);
        } else {
            setState({ viewMode: 'calendar' });
            onRender();
        }
    }

    /**
     * Render month selection grid
     */
    private static renderMonthGrid(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        const gridContainer = calendar.querySelector('[data-calendar-grid-container]') as HTMLElement;
        if (!gridContainer) return;

        const currentYear = parseInt(state.currentMonth.substring(0, 4));
        const currentMonthIndex = parseInt(state.currentMonth.substring(5, 7)) - 1;

        const monthsHTML = state.monthNames.map((monthName, index) => {
            const isSelected = index === currentMonthIndex;
            const isDisabled = this.isMonthDisabled(calendar, currentYear, index, state);

            const buttonClasses = this.getMonthButtonClasses(isSelected, isDisabled);

            return `
                <button
                    type="button"
                    class="${buttonClasses} month-option"
                    data-month="${index}"
                    data-calendar-month-btn
                    ${isDisabled ? 'disabled' : ''}
                    aria-label="Select ${monthName} ${currentYear}"
                >
                    ${monthName}
                </button>
            `;
        }).join('');

        const yearNavHTML = `
            <div class="flex items-center justify-between mb-4">
                <button
                    type="button"
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-accent"
                    data-calendar-year-nav="prev"
                    aria-label="Previous year"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    type="button"
                    class="text-lg font-semibold px-4 py-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-accent"
                    data-calendar-year-btn
                    aria-label="Select year ${currentYear}"
                >
                    ${currentYear}
                </button>

                <button
                    type="button"
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-accent"
                    data-calendar-year-nav="next"
                    aria-label="Next year"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        `;

        const html = `
            ${yearNavHTML}
            <div class="month-grid grid grid-cols-3 gap-2">
                ${monthsHTML}
            </div>
        `;

        gridContainer.innerHTML = html;

        this.bindMonthGridEvents(calendar, state, setState, onRender);
    }

    /**
     * Render year selection grid
     */
    public static renderYearGrid(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        const gridContainer = calendar.querySelector('[data-calendar-grid-container]') as HTMLElement;
        if (!gridContainer) return;

        const currentYear = parseInt(state.currentMonth.substring(0, 4));
        const startYear = Math.floor(currentYear / 10) * 10;
        const years = Array.from({ length: 12 }, (_, i) => startYear - 1 + i);

        const yearsHTML = years.map(year => {
            const isSelected = year === currentYear;
            const isDisabled = this.isYearDisabled(calendar, year, state);
            const isOutOfDecade = year < startYear || year >= startYear + 10;

            const buttonClasses = this.getYearButtonClasses(isSelected, isDisabled, isOutOfDecade);

            return `
                <button
                    type="button"
                    class="${buttonClasses} year-option"
                    data-year="${year}"
                    data-calendar-year-option
                    ${isDisabled ? 'disabled' : ''}
                    aria-label="Select year ${year}"
                >
                    ${year}
                </button>
            `;
        }).join('');

        const decadeNavHTML = `
            <div class="flex items-center justify-between mb-4">
                <button
                    type="button"
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-accent"
                    data-calendar-decade-nav="prev"
                    aria-label="Previous decade"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <span class="text-lg font-semibold">
                    ${startYear} - ${startYear + 9}
                </span>

                <button
                    type="button"
                    class="p-2 rounded-md hover:bg-neutral-hover focus:outline-none focus:ring-2 focus:ring-accent"
                    data-calendar-decade-nav="next"
                    aria-label="Next decade"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        `;

        const html = `
            ${decadeNavHTML}
            <div class="year-grid grid grid-cols-4 gap-2">
                ${yearsHTML}
            </div>
        `;

        gridContainer.innerHTML = html;

        this.bindYearGridEvents(calendar, state, setState, onRender);
    }

    /**
     * Select a specific month
     */
    public static selectMonth(calendar: HTMLElement, monthIndex: number, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        const year = state.currentMonth.substring(0, 4);
        const newMonth = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

        setState({
            currentMonth: newMonth,
            viewMode: 'calendar'
        });

        onRender();
        this.updateMonthYearDisplay(calendar, state.monthNames, newMonth);
    }

    /**
     * Select a specific year
     */
    public static selectYear(calendar: HTMLElement, year: number, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        const month = state.currentMonth.substring(5, 7);
        const newMonth = `${year}-${month}`;

        setState({
            currentMonth: newMonth,
            viewMode: 'month'
        });

        this.renderMonthGrid(calendar, state, setState, onRender);
    }

    /**
     * Navigate year in month/year picker
     */
    public static navigateYear(calendar: HTMLElement, direction: 'prev' | 'next', state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        if (state.isDisabled) return;

        const currentYear = parseInt(state.currentMonth.substring(0, 4));
        const newYear = direction === 'prev' ? currentYear - 1 : currentYear + 1;
        const month = state.currentMonth.substring(5, 7);
        const newMonth = `${newYear}-${month}`;

        setState({
            currentMonth: newMonth
        });

        if (state.viewMode === 'year') {
            this.renderYearGrid(calendar, state, setState, onRender);
        } else if (state.viewMode === 'month') {
            this.renderMonthGrid(calendar, state, setState, onRender);
        }
    }

    /**
     * Check if navigation to a specific month is allowed
     */
    private static canNavigateToMonth(targetDate: Date, state: CalendarState): boolean {
        if (state.minDate) {
            const minDate = new Date(state.minDate);
            const minMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
            if (targetDate < minMonth) return false;
        }

        if (state.maxDate) {
            const maxDate = new Date(state.maxDate);
            const maxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
            if (targetDate > maxMonth) return false;
        }

        return true;
    }

    /**
     * Check if a specific month is disabled
     */
    private static isMonthDisabled(calendar: HTMLElement, year: number, month: number, state: CalendarState): boolean {
        if (state.minDate) {
            const minDate = new Date(state.minDate);
            if (year < minDate.getFullYear() || (year === minDate.getFullYear() && month < minDate.getMonth())) {
                return true;
            }
        }

        if (state.maxDate) {
            const maxDate = new Date(state.maxDate);
            if (year > maxDate.getFullYear() || (year === maxDate.getFullYear() && month > maxDate.getMonth())) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if a specific year is disabled
     */
    private static isYearDisabled(calendar: HTMLElement, year: number, state: CalendarState): boolean {
        if (state.minDate && year < new Date(state.minDate).getFullYear()) return true;
        if (state.maxDate && year > new Date(state.maxDate).getFullYear()) return true;
        return false;
    }

    /**
     * Update month/year display in header
     */
    public static updateMonthYearDisplay(calendar: HTMLElement, monthNames: string[], monthString: string): void {
        const display = calendar.querySelector('.calendar-month-year-display');
        if (!display) return;

        const year = monthString.substring(0, 4);
        const monthIndex = parseInt(monthString.substring(5, 7)) - 1;
        const monthName = monthNames[monthIndex];

        display.textContent = `${monthName} ${year}`;
    }


    /**
     * Get month button classes
     */
    private static getMonthButtonClasses(isSelected: boolean, isDisabled: boolean): string {
        const baseClasses = 'w-full p-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent';

        if (isDisabled) {
            return `${baseClasses} bg-elevation-1 text-muted cursor-not-allowed opacity-50`;
        }

        if (isSelected) {
            return `${baseClasses} bg-accent text-white font-semibold shadow-sm`;
        }

        return `${baseClasses} text-primary hover:bg-neutral-hover hover:scale-105`;
    }

    /**
     * Get year button classes
     */
    private static getYearButtonClasses(isSelected: boolean, isDisabled: boolean, isOutOfDecade: boolean): string {
        const baseClasses = 'w-full p-3 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent';

        if (isDisabled) {
            return `${baseClasses} bg-elevation-1 text-muted cursor-not-allowed opacity-50`;
        }

        if (isSelected) {
            return `${baseClasses} bg-accent text-white font-semibold shadow-sm`;
        }

        if (isOutOfDecade) {
            return `${baseClasses} text-muted hover:bg-neutral-hover opacity-75`;
        }

        return `${baseClasses} text-primary hover:bg-neutral-hover hover:scale-105`;
    }

    /**
     * Format date as YYYY-MM string
     */
    private static formatYearMonth(date: Date): string {
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
    }

    /**
     * Bind month grid event listeners
     */
    private static bindMonthGridEvents(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        calendar.querySelectorAll('[data-calendar-month-btn]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const monthIndex = parseInt((e.target as HTMLElement).dataset.month || '0');
                this.selectMonth(calendar, monthIndex, state, setState, onRender);
            });
        });


        calendar.querySelector('[data-calendar-year-btn]')?.addEventListener('click', () => {
            setState({ viewMode: 'year' });
            this.renderYearGrid(calendar, state, setState, onRender);
        });
    }

    /**
     * Bind year grid event listeners
     */
    private static bindYearGridEvents(calendar: HTMLElement, state: CalendarState, setState: (newState: Partial<CalendarState>) => void, onRender: () => void): void {
        calendar.querySelectorAll('[data-calendar-year-option]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const year = parseInt((e.target as HTMLElement).dataset.year || '0');
                this.selectYear(calendar, year, state, setState, onRender);
            });
        });

        calendar.querySelectorAll('[data-calendar-decade-nav]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const direction = (e.target as HTMLElement).dataset.calendarDecadeNav as 'prev' | 'next';
                const currentYear = parseInt(state.currentMonth.substring(0, 4));
                const currentDecadeStart = Math.floor(currentYear / 10) * 10;
                const newDecadeStart = direction === 'prev' ? currentDecadeStart - 10 : currentDecadeStart + 10;
                const newYear = newDecadeStart + (currentYear % 10);

                const newMonth = `${newYear}-${state.currentMonth.substring(5, 7)}`;
                setState({ currentMonth: newMonth });

                this.renderYearGrid(calendar, state, setState, onRender);
            });
        });
    }
}
