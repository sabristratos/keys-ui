/**
 * CalendarActions - Handles interactive functionality for Calendar components
 *
 * Provides functionality for:
 * - Date selection with visual feedback
 * - Month/year navigation with keyboard support
 * - Keyboard navigation (arrow keys, Enter, Escape)
 * - Form integration with hidden input updates
 * - Custom events for framework integration
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import { AnimationUtils } from './utils/AnimationUtils';
import { DateUtils } from './utils/DateUtils';

type ViewMode = 'calendar' | 'month' | 'year';

interface CalendarState {
    currentMonth: string; // YYYY-MM format
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
    viewMode: ViewMode;
    rangeSelectionState: 'none' | 'selecting-start' | 'selecting-end';
}

export class CalendarActions extends BaseActionClass<CalendarState> {

    /**
     * Initialize calendar elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.findByDataAttribute('calendar', 'true').forEach(calendar => {
            this.initializeCalendar(calendar);
        });
    }

    /**
     * Initialize a single calendar element
     */
    private initializeCalendar(calendarElement: HTMLElement): void {
        if (this.hasState(calendarElement)) {
            return;
        }

        const calendarDataAttr = calendarElement.dataset.calendarData;
        const isDisabled = calendarElement.dataset.disabled === 'true';

        let calendarData;
        try {
            calendarData = calendarDataAttr ? JSON.parse(calendarDataAttr) : {};
        } catch (e) {
            console.error('Failed to parse calendar data:', e);
            calendarData = {};
        }


        const state: CalendarState = {
            currentMonth: calendarData.currentMonth || this.getCurrentYearMonth(),
            selectedDate: calendarData.selectedDate || null,
            startDate: calendarData.startDate || null,
            endDate: calendarData.endDate || null,
            focusedDate: calendarData.selectedDate || calendarData.startDate || this.getTodayDate(),
            isRange: calendarData.isRange || false,
            monthsToShow: calendarData.monthsToShow || 1,
            rangeSelectionState: 'none',
            isDisabled: isDisabled,
            minDate: calendarData.minDate || null,
            maxDate: calendarData.maxDate || null,
            disabledDates: calendarData.disabledDates || [],
            weekdays: calendarData.weekdays || ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            monthNames: calendarData.monthNames || [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ],
            viewMode: 'calendar'
        };


        this.setState(calendarElement, state);
        this.renderCalendarGrid(calendarElement);
        this.updateMonthYearDisplay(calendarElement);
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Date selection
        EventUtils.handleDelegatedClick('[data-calendar-date]', (dateButton, event) => {
            if (!(dateButton as HTMLButtonElement).disabled) {
                event.preventDefault();
                event.stopPropagation(); // Prevent bubbling to document click handlers
                const calendar = DOMUtils.findClosest(dateButton, '[data-calendar="true"]');
                if (calendar && !this.isCalendarDisabled(calendar)) {
                    this.selectDate(calendar, dateButton.dataset.calendarDate!);
                }
            }
        });

        // Month navigation
        EventUtils.handleDelegatedClick('[data-calendar-nav]', (navButton, event) => {
            if (!(navButton as HTMLButtonElement).disabled) {
                event.preventDefault();
                const calendar = DOMUtils.findClosest(navButton, '[data-calendar="true"]');
                const direction = navButton.dataset.calendarNav as 'prev' | 'next';
                if (calendar && !this.isCalendarDisabled(calendar)) {
                    this.navigateMonth(calendar, direction);
                }
            }
        });

        // Footer action buttons
        EventUtils.handleDelegatedClick('[data-calendar-action]', (actionButton, event) => {
            if (!(actionButton as HTMLButtonElement).disabled) {
                event.preventDefault();
                const calendar = DOMUtils.findClosest(actionButton, '[data-calendar="true"]');
                const action = actionButton.dataset.calendarAction!;
                if (calendar && !this.isCalendarDisabled(calendar)) {
                    this.handleFooterAction(calendar, action);
                }
            }
        });

        // Month/Year button click
        EventUtils.handleDelegatedClick('[data-calendar-month-year-btn]', (monthYearBtn, event) => {
            if (!(monthYearBtn as HTMLButtonElement).disabled) {
                event.preventDefault();
                const calendar = DOMUtils.findClosest(monthYearBtn, '[data-calendar="true"]');
                if (calendar && !this.isCalendarDisabled(calendar)) {
                    this.toggleMonthYearDropdown(calendar);
                }
            }
        });

        // Month selection
        EventUtils.handleDelegatedClick('[data-calendar-month]', (monthOption, event) => {
            event.preventDefault();
            const calendar = DOMUtils.findClosest(monthOption, '[data-calendar="true"]');
            const monthIndex = parseInt(monthOption.dataset.calendarMonth!);
            if (calendar && !this.isCalendarDisabled(calendar)) {
                this.selectMonth(calendar, monthIndex);
            }
        });

        // Year selection
        EventUtils.handleDelegatedClick('[data-calendar-year]', (yearOption, event) => {
            event.preventDefault();
            const calendar = DOMUtils.findClosest(yearOption, '[data-calendar="true"]');
            const year = parseInt(yearOption.dataset.calendarYear!);
            if (calendar && !this.isCalendarDisabled(calendar)) {
                this.selectYear(calendar, year);
            }
        });

        // Keyboard navigation
        EventUtils.handleDelegatedKeydown('[data-calendar="true"]', (calendar, event) => {
            // Handle Escape key to return to calendar view
            if (event.key === 'Escape') {
                const state = this.getState(calendar);
                if (state && state.viewMode !== 'calendar') {
                    event.preventDefault();
                    state.viewMode = 'calendar';
                    this.setState(calendar, state);
                    this.renderCalendarGrid(calendar);
                    // Focus back on the month/year button
                    const button = DOMUtils.querySelector('[data-calendar-month-year-btn]', calendar) as HTMLElement;
                    if (button) button.focus();
                    return;
                }
            }

            this.handleKeydown(calendar, event);
        });

        // Focus management for accessibility
        EventUtils.handleDelegatedFocus('[data-calendar-date]', (dateButton) => {
            const calendar = DOMUtils.findClosest(dateButton, '[data-calendar="true"]');
            if (calendar) {
                const state = this.getState(calendar);
                if (state) {
                    state.focusedDate = dateButton.dataset.calendarDate!;
                    this.setState(calendar, state);
                }
            }
        });
    }

    /**
     * Setup dynamic observer for new calendars - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Check if the added node is a calendar
                    if (DOMUtils.hasDataAttribute(element, 'calendar', 'true')) {
                        this.initializeCalendar(element);
                    }

                    // Check for calendars within the added node
                    DOMUtils.findByDataAttribute('calendar', 'true', element).forEach(calendar => {
                        this.initializeCalendar(calendar);
                    });
                }
            });
        });
    }

    /**
     * Select a date (handles both single date and range selection)
     */
    private selectDate(calendar: HTMLElement, dateString: string): void {
        const state = this.getState(calendar);
        if (!state || state.isDisabled) return;


        if (state.isRange) {
            this.handleRangeSelection(calendar, dateString);
        } else {
            // Single date selection
            state.selectedDate = dateString;
            state.focusedDate = dateString;
            this.setState(calendar, state);

            // Update display without animation (for immediate button feedback)
            this.renderCalendarGrid(calendar);
            this.updateHiddenInput(calendar);

            // Dispatch custom event
            this.dispatchCalendarEvent(calendar, 'calendar:dateSelected', {
                selectedDate: dateString,
                formattedDate: this.formatDateForDisplay(dateString)
            });
        }
    }

    /**
     * Handle range selection logic
     */
    private handleRangeSelection(calendar: HTMLElement, dateString: string): void {
        const state = this.getState(calendar);
        if (!state) return;


        const clickedDate = new Date(dateString);

        if (state.rangeSelectionState === 'none' || state.rangeSelectionState === 'selecting-start') {
            // Start new range or select start date
            state.startDate = dateString;
            state.endDate = null;
            state.rangeSelectionState = 'selecting-end';
            state.focusedDate = dateString;
        } else if (state.rangeSelectionState === 'selecting-end') {
            // Select end date
            const startDate = new Date(state.startDate!);

            if (clickedDate < startDate) {
                // Clicked date is before start, make it the new start
                state.endDate = state.startDate;
                state.startDate = dateString;
            } else {
                // Normal end date selection
                state.endDate = dateString;
            }

            state.rangeSelectionState = 'none';
            state.focusedDate = dateString;
        }

        this.setState(calendar, state);
        this.renderCalendarGrid(calendar);
        this.updateHiddenInput(calendar);


        // Dispatch custom event
        this.dispatchCalendarEvent(calendar, 'calendar:rangeSelected', {
            startDate: state.startDate,
            endDate: state.endDate,
            formattedRange: this.formatRangeForDisplay(state.startDate, state.endDate)
        });
    }

    /**
     * Format range for display
     */
    private formatRangeForDisplay(startDate: string | null, endDate: string | null): string {
        if (!startDate && !endDate) return '';
        if (startDate && !endDate) return this.formatDateForDisplay(startDate);
        if (!startDate && endDate) return this.formatDateForDisplay(endDate);
        return `${this.formatDateForDisplay(startDate!)} - ${this.formatDateForDisplay(endDate!)}`;
    }

    /**
     * Check if a date is in range
     */
    private isDateInRange(dateString: string, startDate: string | null, endDate: string | null): boolean {
        if (!startDate || !endDate) return false;
        const date = new Date(dateString);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return date >= start && date <= end;
    }

    /**
     * Check if a date is range start
     */
    private isDateRangeStart(dateString: string, startDate: string | null): boolean {
        return startDate === dateString;
    }

    /**
     * Check if a date is range end
     */
    private isDateRangeEnd(dateString: string, endDate: string | null): boolean {
        return endDate === dateString;
    }

    /**
     * Navigate to previous or next month
     */
    private navigateMonth(calendar: HTMLElement, direction: 'prev' | 'next'): void {
        const state = this.getState(calendar);
        if (!state || state.isDisabled) return;

        // Parse current month and navigate
        const [year, month] = state.currentMonth.split('-').map(Number);
        const currentDate = new Date(year, month - 1, 1);

        if (direction === 'prev') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        const newMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

        // Update state
        state.currentMonth = newMonth;
        this.setState(calendar, state);

        // Re-render calendar grid with new month
        this.renderCalendarGrid(calendar);
        this.updateMonthYearDisplay(calendar);

        // Dispatch custom event
        this.dispatchCalendarEvent(calendar, 'calendar:monthChanged', {
            currentMonth: newMonth,
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1
        });
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeydown(calendar: HTMLElement, event: KeyboardEvent): void {
        const state = this.getState(calendar);
        if (!state || state.isDisabled) return;

        const focusedDate = state.focusedDate;
        if (!focusedDate) return;

        let newFocusedDate: string | null = null;

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                newFocusedDate = this.addDaysToDate(focusedDate, -1);
                break;

            case 'ArrowRight':
                event.preventDefault();
                newFocusedDate = this.addDaysToDate(focusedDate, 1);
                break;

            case 'ArrowUp':
                event.preventDefault();
                newFocusedDate = this.addDaysToDate(focusedDate, -7);
                break;

            case 'ArrowDown':
                event.preventDefault();
                newFocusedDate = this.addDaysToDate(focusedDate, 7);
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                this.selectDate(calendar, focusedDate);
                return;

            case 'Home':
                event.preventDefault();
                newFocusedDate = this.getFirstDayOfMonth(focusedDate);
                break;

            case 'End':
                event.preventDefault();
                newFocusedDate = this.getLastDayOfMonth(focusedDate);
                break;

            case 'PageUp':
                event.preventDefault();
                newFocusedDate = this.addMonthsToDate(focusedDate, event.shiftKey ? -12 : -1);
                break;

            case 'PageDown':
                event.preventDefault();
                newFocusedDate = this.addMonthsToDate(focusedDate, event.shiftKey ? 12 : 1);
                break;
        }

        if (newFocusedDate) {
            this.focusDate(calendar, newFocusedDate);
        }
    }

    /**
     * Generate calendar grid for a given month
     */
    private generateCalendarGrid(calendar: HTMLElement): Array<Array<{
        date: string;
        day: number;
        isCurrentMonth: boolean;
        isToday: boolean;
        isSelected: boolean;
        isDisabled: boolean;
        isInRange?: boolean;
        isRangeStart?: boolean;
        isRangeEnd?: boolean;
    }>> {
        const state = this.getState(calendar);
        if (!state) return [];

        const [year, month] = state.currentMonth.split('-').map(Number);
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);

        // Get first Sunday of the calendar grid
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());

        // Get last Saturday of the calendar grid
        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

        const days = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            const dateString = this.formatDateString(current);
            const isCurrentMonth = current.getMonth() === month - 1 && current.getFullYear() === year;

            const dayData: any = {
                date: dateString,
                day: current.getDate(),
                isCurrentMonth,
                isToday: this.isToday(dateString),
                isSelected: dateString === state.selectedDate,
                isDisabled: this.isDateDisabled(calendar, current)
            };

            // Add range information for range mode
            if (state.isRange) {
                dayData.isInRange = this.isDateInRange(dateString, state.startDate, state.endDate);
                dayData.isRangeStart = this.isDateRangeStart(dateString, state.startDate);
                dayData.isRangeEnd = this.isDateRangeEnd(dateString, state.endDate);
                // Override isSelected for range mode
                dayData.isSelected = dayData.isRangeStart || dayData.isRangeEnd;
            }

            days.push(dayData);

            current.setDate(current.getDate() + 1);
        }

        // Group into weeks
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return weeks;
    }

    /**
     * Check if a date is disabled
     */
    private isDateDisabled(calendar: HTMLElement, date: Date): boolean {
        const state = this.getState(calendar);
        if (!state || state.isDisabled) return true;

        const dateString = this.formatDateString(date);

        // Check min date
        if (state.minDate && dateString < state.minDate) {
            return true;
        }

        // Check max date
        if (state.maxDate && dateString > state.maxDate) {
            return true;
        }

        // Check disabled dates
        return state.disabledDates.includes(dateString);
    }

    /**
     * Render calendar grid to DOM (supports multiple months)
     */
    private renderCalendarGrid(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        if (state.monthsToShow > 1) {
            this.renderMultipleMonths(calendar);
        } else {
            this.renderSingleMonth(calendar);
        }
    }

    /**
     * Render single month view
     */
    private renderSingleMonth(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        const container = DOMUtils.querySelector('[data-calendar-grid-container]', calendar) as HTMLElement;
        if (!container) return;

        const weeks = this.generateCalendarGrid(calendar);

        let html = '<table class="w-full" role="grid" aria-label="Calendar">';

        // Weekday headers
        html += '<thead><tr role="row">';
        state.weekdays.forEach(weekday => {
            const fullNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const fullName = fullNames[state.weekdays.indexOf(weekday)];
            html += `<th class="calendar-weekday text-center text-muted font-medium p-1" role="columnheader" aria-label="${fullName}">${weekday}</th>`;
        });
        html += '</tr></thead>';

        // Calendar days
        html += '<tbody>';
        weeks.forEach(week => {
            html += '<tr role="row">';
            week.forEach(day => {
                const buttonClasses = this.getDayButtonClasses(day);
                const ariaLabel = DateUtils.createDateAriaLabel(day.date, day.isToday, day.isSelected, day.isRangeStart, day.isRangeEnd, day.isInRange);
                const rangeAttributes = this.getRangeAttributes(day, state);

                html += `
                    <td class="calendar-day text-center relative" role="gridcell">
                        <button type="button"
                                class="${buttonClasses}"
                                data-calendar-date="${day.date}"
                                data-is-current-month="${day.isCurrentMonth}"
                                ${day.isDisabled ? 'disabled' : ''}
                                aria-selected="${day.isSelected}"
                                aria-label="${ariaLabel}"
                                data-is-today="${day.isToday}"
                                ${rangeAttributes}>
                            ${day.day}
                        </button>
                    </td>
                `;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';

        container.innerHTML = html;
    }

    /**
     * Get cell classes based on calendar size
     */
    private getCellClasses(calendar: HTMLElement): string {
        // Size is now controlled by CSS, just return base classes
        return '';
    }

    /**
     * Get button classes for a day
     */
    private getDayButtonClasses(day: any): string {
        let classes = 'flex items-center justify-center rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1';

        if (!day.isCurrentMonth) {
            classes += ' text-neutral-400 dark:text-neutral-600';
        } else if (day.isDisabled) {
            classes += ' text-neutral-400 dark:text-neutral-600 cursor-not-allowed opacity-50';
        } else if (day.isSelected) {
            // Don't add background/color classes for range mode - let CSS handle it
            if (day.isInRange || day.isRangeStart || day.isRangeEnd) {
                classes += ' font-semibold';
            } else {
                classes += ' bg-brand text-foreground-brand font-semibold';
            }
        } else if (day.isToday) {
            classes += ' bg-brand/10 text-brand font-semibold border border-brand/20';
        } else {
            // Don't add hover classes for range mode - let CSS handle it
            if (!day.isInRange) {
                classes += ' text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800';
            } else {
                classes += ' text-foreground';
            }
        }

        return classes;
    }


    /**
     * Update month/year display
     */
    private updateMonthYearDisplay(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        const [year, month] = state.currentMonth.split('-').map(Number);
        const monthName = state.monthNames[month - 1];
        const display = `${monthName} ${year}`;

        const displayElement = DOMUtils.querySelector('.calendar-month-year-display', calendar) as HTMLElement;
        if (displayElement) {
            displayElement.textContent = display;
        }
    }

    /**
     * Toggle between calendar, month, and year views
     */
    private toggleMonthYearDropdown(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        switch (state.viewMode) {
            case 'calendar':
                // First click: Show month view
                state.viewMode = 'month';
                this.renderMonthGrid(calendar);
                break;
            case 'month':
                // Second click: Show year view
                state.viewMode = 'year';
                this.renderYearGrid(calendar);
                break;
            case 'year':
                // Third click: Back to calendar view
                state.viewMode = 'calendar';
                this.renderCalendarGrid(calendar);
                break;
        }

        this.setState(calendar, state);
    }

    /**
     * Render month selection grid
     */
    private renderMonthGrid(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        const container = DOMUtils.querySelector('[data-calendar-grid-container]', calendar) as HTMLElement;
        if (!container) return;

        const [currentYear, currentMonth] = state.currentMonth.split('-').map(Number);

        let html = '<div class="month-grid grid grid-cols-3 gap-1 p-2">';

        state.monthNames.forEach((monthName, index) => {
            const monthIndex = index + 1;
            const isSelected = monthIndex === currentMonth;
            const isDisabled = this.isMonthDisabled(calendar, currentYear, monthIndex);

            html += `
                <button type="button"
                        class="month-option px-2 py-1.5 text-sm font-medium rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-brand ${
                            isSelected
                                ? 'bg-brand text-foreground-brand border-brand'
                                : 'bg-surface text-foreground border-border'
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                        data-calendar-month="${monthIndex}"
                        ${isDisabled ? 'disabled' : ''}>
                    ${monthName}
                </button>
            `;
        });

        html += '</div>';
        this.animateViewTransition(container, html);
    }

    /**
     * Render year selection grid
     */
    private renderYearGrid(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        const container = DOMUtils.querySelector('[data-calendar-grid-container]', calendar) as HTMLElement;
        if (!container) return;

        const [currentYear] = state.currentMonth.split('-').map(Number);
        const startYear = currentYear - 10;
        const endYear = currentYear + 10;

        let html = '<div class="year-grid grid grid-cols-4 gap-1 p-2 max-h-64 overflow-y-auto">';

        for (let year = startYear; year <= endYear; year++) {
            const isSelected = year === currentYear;
            const isDisabled = this.isYearDisabled(calendar, year);

            html += `
                <button type="button"
                        class="year-option px-2 py-1.5 text-sm font-medium rounded-lg transition-colors border focus:outline-none focus:ring-2 focus:ring-brand ${
                            isSelected
                                ? 'bg-brand text-foreground-brand border-brand'
                                : 'bg-surface text-foreground border-border'
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                        data-calendar-year="${year}"
                        ${isDisabled ? 'disabled' : ''}>
                    ${year}
                </button>
            `;
        }

        html += '</div>';
        container.innerHTML = html;
    }



    /**
     * Select a month
     */
    private selectMonth(calendar: HTMLElement, monthIndex: number): void {
        const state = this.getState(calendar);
        if (!state) return;

        const [currentYear] = state.currentMonth.split('-').map(Number);
        const newMonth = `${currentYear}-${String(monthIndex).padStart(2, '0')}`;

        state.currentMonth = newMonth;
        state.viewMode = 'calendar'; // Return to calendar view
        this.setState(calendar, state);

        this.renderCalendarGrid(calendar);
        this.updateMonthYearDisplay(calendar);

        this.dispatchCalendarEvent(calendar, 'calendar:monthChanged', {
            currentMonth: newMonth,
            year: currentYear,
            month: monthIndex
        });
    }

    /**
     * Select a year
     */
    private selectYear(calendar: HTMLElement, year: number): void {
        const state = this.getState(calendar);
        if (!state) return;

        const [, currentMonth] = state.currentMonth.split('-').map(Number);
        const newMonth = `${year}-${String(currentMonth).padStart(2, '0')}`;

        state.currentMonth = newMonth;
        state.viewMode = 'calendar'; // Return to calendar view
        this.setState(calendar, state);

        this.renderCalendarGrid(calendar);
        this.updateMonthYearDisplay(calendar);

        this.dispatchCalendarEvent(calendar, 'calendar:monthChanged', {
            currentMonth: newMonth,
            year: year,
            month: currentMonth
        });
    }

    /**
     * Check if a month is disabled
     */
    private isMonthDisabled(calendar: HTMLElement, year: number, month: number): boolean {
        const state = this.getState(calendar);
        if (!state) return false;

        // Check against min/max dates
        const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const lastDayString = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

        if (state.minDate && lastDayString < state.minDate) return true;
        if (state.maxDate && firstDay > state.maxDate) return true;

        return false;
    }

    /**
     * Check if a year is disabled
     */
    private isYearDisabled(calendar: HTMLElement, year: number): boolean {
        const state = this.getState(calendar);
        if (!state) return false;

        // Check against min/max dates
        const firstDay = `${year}-01-01`;
        const lastDay = `${year}-12-31`;

        if (state.minDate && lastDay < state.minDate) return true;
        if (state.maxDate && firstDay > state.maxDate) return true;

        return false;
    }


    /**
     * Focus a specific date
     */
    private focusDate(calendar: HTMLElement, dateString: string): void {
        const state = this.getState(calendar);
        if (!state) return;

        // Check if we need to navigate to a different month
        const [year, month] = dateString.split('-').map(Number);
        const [currentYear, currentMonth] = state.currentMonth.split('-').map(Number);

        if (year !== currentYear || month !== currentMonth) {
            // Navigate to the new month
            const newMonthString = `${year}-${String(month).padStart(2, '0')}`;
            state.currentMonth = newMonthString;
            this.setState(calendar, state);

            // Re-render calendar with new month
            this.renderCalendarGrid(calendar);
            this.updateMonthYearDisplay(calendar);

            this.dispatchCalendarEvent(calendar, 'calendar:monthChanged', {
                currentMonth: newMonthString,
                year: year,
                month: month
            });
        }

        // Update focused date
        state.focusedDate = dateString;
        this.setState(calendar, state);

        // Focus the date button if it exists in current view
        AnimationUtils.createTimer(() => {
            const dateButton = calendar.querySelector(`[data-calendar-date="${dateString}"]`) as HTMLElement;
            if (dateButton) {
                dateButton.focus();
            }
        }, 10);
    }

    /**
     * Update calendar visual display
     */
    private updateCalendarDisplay(calendar: HTMLElement): void {
        // Re-render the entire grid to ensure correct styling
        this.renderCalendarGrid(calendar);
    }


    /**
     * Utility: Add days to a date string
     */
    private addDaysToDate(dateString: string, days: number): string {
        const date = new Date(dateString);
        date.setDate(date.getDate() + days);
        return this.formatDateString(date);
    }

    /**
     * Utility: Add months to a date string
     */
    private addMonthsToDate(dateString: string, months: number): string {
        const date = new Date(dateString);
        date.setMonth(date.getMonth() + months);
        return this.formatDateString(date);
    }

    /**
     * Utility: Get first day of month for a date string
     */
    private getFirstDayOfMonth(dateString: string): string {
        const date = new Date(dateString);
        date.setDate(1);
        return this.formatDateString(date);
    }

    /**
     * Utility: Get last day of month for a date string
     */
    private getLastDayOfMonth(dateString: string): string {
        const date = new Date(dateString);
        date.setMonth(date.getMonth() + 1, 0);
        return this.formatDateString(date);
    }

    /**
     * Utility: Format Date object to YYYY-MM-DD string
     */
    private formatDateString(date: Date): string {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    /**
     * Utility: Get current year-month string
     */
    private getCurrentYearMonth(): string {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    /**
     * Utility: Get today's date string
     */
    private getTodayDate(): string {
        return this.formatDateString(new Date());
    }

    /**
     * Utility: Check if date string is today
     */
    private isToday(dateString: string): boolean {
        return dateString === this.getTodayDate();
    }

    /**
     * Animate view transitions for smooth UX
     */
    private animateViewTransition(container: HTMLElement, newHTML: string): void {
        // Add fade-out effect
        container.style.opacity = '0.7';
        container.style.transform = 'scale(0.98)';

        // Update content after brief delay
        AnimationUtils.createTimer(() => {
            container.innerHTML = newHTML;

            // Add fade-in effect
            container.style.opacity = '1';
            container.style.transform = 'scale(1)';
        }, 100);
    }

    /**
     * Utility: Format date for display
     */
    private formatDateForDisplay(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Check if calendar is disabled
     */
    private isCalendarDisabled(calendar: HTMLElement): boolean {
        const state = this.getState(calendar);
        return state ? state.isDisabled : false;
    }

    /**
     * Dispatch custom calendar event
     */
    private dispatchCalendarEvent(calendar: HTMLElement, eventName: string, detail: any = null): void {
        EventUtils.dispatchCustomEvent(calendar, eventName, {
            calendar,
            ...detail
        }, {
            bubbles: true,
            cancelable: true
        });
    }

    /**
     * Get calendar state (for external access)
     */
    public getCalendarState(calendar: HTMLElement): CalendarState | null {
        return this.getState(calendar) || null;
    }

    /**
     * Set selected date programmatically
     */
    public setSelectedDate(calendar: HTMLElement, dateString: string | null): void {
        const state = this.getState(calendar);
        if (!state) return;

        state.selectedDate = dateString;
        if (dateString) {
            state.focusedDate = dateString;
        }

        this.setState(calendar, state);
        this.updateCalendarDisplay(calendar);
        this.updateHiddenInput(calendar);

        this.dispatchCalendarEvent(calendar, 'calendar:dateSelected', {
            selectedDate: dateString,
            formattedDate: dateString ? this.formatDateForDisplay(dateString) : null
        });
    }

    /**
     * Render multiple months view
     */
    private renderMultipleMonths(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        const containers = DOMUtils.querySelectorAll('[data-calendar-grid-container]', calendar) as HTMLElement[];
        if (containers.length === 0) return;

        const currentDate = new Date(state.currentMonth + '-01');

        containers.forEach((container, index) => {
            const monthDate = new Date(currentDate);
            monthDate.setMonth(currentDate.getMonth() + index);

            const monthState = {
                ...state,
                currentMonth: `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
            };

            const weeks = this.generateCalendarGridForMonth(calendar, monthState, index, containers.length);

            let html = `<div class="calendar-month-header">${state.monthNames[monthDate.getMonth()]} ${monthDate.getFullYear()}</div>`;
            html += '<table class="w-full" role="grid" aria-label="Calendar">';

            // Weekday headers
            html += '<thead><tr role="row">';
            state.weekdays.forEach(weekday => {
                const fullNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const fullName = fullNames[state.weekdays.indexOf(weekday)];
                html += `<th class="calendar-weekday text-center text-muted font-medium p-1" role="columnheader" aria-label="${fullName}">${weekday}</th>`;
            });
            html += '</tr></thead>';

            // Calendar days
            html += '<tbody>';
            weeks.forEach(week => {
                html += '<tr role="row">';
                week.forEach(day => {
                    const buttonClasses = this.getDayButtonClasses(day);
                    const ariaLabel = DateUtils.createDateAriaLabel(day.date, day.isToday, day.isSelected, day.isRangeStart, day.isRangeEnd, day.isInRange);
                    const rangeAttributes = this.getRangeAttributes(day, state);

                    html += `
                        <td class="calendar-day text-center relative" role="gridcell">
                            <button type="button"
                                    class="${buttonClasses}"
                                    data-calendar-date="${day.date}"
                                    data-is-current-month="${day.isCurrentMonth}"
                                    ${day.isDisabled ? 'disabled' : ''}
                                    aria-selected="${day.isSelected}"
                                    aria-label="${ariaLabel}"
                                    data-is-today="${day.isToday}"
                                    ${rangeAttributes}>
                                ${day.day}
                            </button>
                        </td>
                    `;
                });
                html += '</tr>';
            });
            html += '</tbody></table>';

            container.innerHTML = html;
        });
    }

    /**
     * Generate calendar grid for a specific month
     */
    private generateCalendarGridForMonth(
        calendar: HTMLElement,
        monthState: any,
        monthIndex: number = 0,
        totalMonths: number = 1
    ): any[] {
        const tempState = this.getState(calendar);
        if (!tempState) return [];

        // Temporarily set state for this month
        this.setState(calendar, { ...tempState, currentMonth: monthState.currentMonth });
        let weeks = this.generateCalendarGrid(calendar);

        // For multi-month view, remove last week duplication (except for final month)
        if (totalMonths > 1 && monthIndex < totalMonths - 1) {
            // Check if last week contains dates from next month
            const lastWeek = weeks[weeks.length - 1];
            const hasNextMonthDates = lastWeek.some(day => !day.isCurrentMonth && day.day <= 15);

            if (hasNextMonthDates) {
                // Remove the last week to prevent duplication with next month
                weeks = weeks.slice(0, -1);
            }
        }

        // Restore original state
        this.setState(calendar, tempState);

        return weeks;
    }

    /**
     * Get range attributes for a day button
     */
    private getRangeAttributes(day: any, state: CalendarState): string {
        if (!state.isRange) return '';

        const attributes = [];

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
     * Update hidden input for range selection
     */
    private updateHiddenInput(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        if (state.isRange) {
            // Update range inputs
            const startInput = DOMUtils.querySelector('.calendar-start-input', calendar) as HTMLInputElement;
            const endInput = DOMUtils.querySelector('.calendar-end-input', calendar) as HTMLInputElement;
            const rangeInput = DOMUtils.querySelector('.calendar-range-input', calendar) as HTMLInputElement;

            if (startInput) {
                startInput.value = state.startDate || '';
            }
            if (endInput) {
                endInput.value = state.endDate || '';
            }
            if (rangeInput) {
                const rangeValue = state.startDate && state.endDate
                    ? `${state.startDate},${state.endDate}`
                    : state.startDate || '';
                rangeInput.value = rangeValue;
            }
        } else {
            // Update single date input
            const hiddenInput = DOMUtils.querySelector('.calendar-hidden-input', calendar) as HTMLInputElement;
            if (hiddenInput) {
                hiddenInput.value = state.selectedDate || '';
            }
        }
    }

    /**
     * Clear all selected dates (both single and range modes)
     */
    private clearSelection(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state || state.isDisabled) return;

        // Reset all date selections
        state.selectedDate = null;
        state.startDate = null;
        state.endDate = null;
        state.focusedDate = null;

        this.setState(calendar, state);
        this.updateHiddenInput(calendar);
        this.renderCalendarGrid(calendar);

        // Dispatch custom event for framework integration
        this.dispatchCalendarEvent(calendar, 'calendar:cleared', {
            isRange: state.isRange
        });
    }

    /**
     * Navigate to today's date and select it
     */
    private selectToday(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state || state.isDisabled) return;

        const today = new Date().toISOString().split('T')[0];

        // Check if today is disabled
        if (this.isDateDisabled(calendar, new Date())) {
            return;
        }

        // Navigate to current month if needed
        this.navigateToToday(calendar);

        // Select today's date
        this.selectDate(calendar, today);
    }

    /**
     * Navigate calendar to show today's month
     */
    private navigateToToday(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        const today = new Date();
        const todayMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

        // Only navigate if current month is different from today's month
        if (state.currentMonth !== todayMonth) {
            state.currentMonth = todayMonth;
            this.setState(calendar, state);
            this.renderCalendarDisplay(calendar);
        }
    }

    /**
     * Handle calendar footer action buttons
     */
    private handleFooterAction(calendar: HTMLElement, action: string): void {
        switch (action) {
            case 'clear':
                this.clearSelection(calendar);
                break;
            case 'today':
                this.selectToday(calendar);
                break;
        }
    }

    /**
     * Clean up CalendarActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // CalendarActions doesn't have additional cleanup beyond base class
        // Event listeners and observers are automatically cleaned up
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        CalendarActions.getInstance().init();
    });
} else {
    CalendarActions.getInstance().init();
}

// Export for global access
(window as any).CalendarActions = CalendarActions;

declare global {
    interface Window {
        CalendarActions: typeof CalendarActions;
    }
}

export default CalendarActions.getInstance();