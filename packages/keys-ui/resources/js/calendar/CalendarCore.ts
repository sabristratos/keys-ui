/**
 * CalendarCore - Main coordinator for Calendar component modules
 *
 * This class orchestrates all calendar functionality by delegating to focused modules:
 * - CalendarDateSelection: Date selection and range logic
 * - CalendarRenderer: Grid generation and rendering
 * - CalendarNavigation: Month/year navigation
 * - CalendarKeyboard: Keyboard navigation
 * - CalendarFormIntegration: Form inputs and events
 *
 * Replaces the monolithic CalendarActions class with a modular architecture.
 */

import { BaseActionClass } from '../utils/BaseActionClass';
import { DOMUtils } from '../utils/DOMUtils';
import { CalendarDateSelection, CalendarState } from './CalendarDateSelection';
import { CalendarRenderer } from './CalendarRenderer';
import { CalendarNavigation } from './CalendarNavigation';
import { CalendarKeyboard } from './CalendarKeyboard';
import { CalendarFormIntegration } from './CalendarFormIntegration';

export class CalendarCore extends BaseActionClass<CalendarState> {

    /**
     * Initialize calendar elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.findByDataAttribute('keys-calendar', 'true').forEach(calendar => {
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
        this.renderCalendar(calendarElement);
        this.bindAllEventListeners(calendarElement);

        // Initialize form integration
        CalendarFormIntegration.updateHiddenInput(calendarElement, state);
        CalendarFormIntegration.dispatchCalendarEvent(calendarElement, 'initialized', { state });
    }

    /**
     * Bind all event listeners for a calendar
     */
    protected bindEventListeners(): void {
        // Main event binding is handled per-calendar in bindAllEventListeners
    }

    /**
     * Bind all event listeners for a specific calendar
     */
    private bindAllEventListeners(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        // Date selection events
        this.bindDateSelectionEvents(calendar);

        // Navigation events
        this.bindNavigationEvents(calendar);

        // Form integration events
        CalendarFormIntegration.bindFormEvents(calendar, state,
            (newState) => this.updateState(calendar, newState),
            () => this.renderCalendar(calendar)
        );

        // Keyboard events
        CalendarKeyboard.bindKeyboardEvents(calendar, state,
            (newState) => this.updateState(calendar, newState),
            (dateString) => this.selectDate(calendar, dateString),
            () => this.renderCalendar(calendar)
        );
    }

    /**
     * Bind date selection event listeners
     */
    private bindDateSelectionEvents(calendar: HTMLElement): void {
        calendar.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            // Handle date button clicks
            if (target.dataset.calendarDayBtn !== undefined) {
                const dateString = target.dataset.date;
                if (dateString && !target.disabled) {
                    this.selectDate(calendar, dateString);
                }
            }
        });
    }

    /**
     * Bind navigation event listeners
     */
    private bindNavigationEvents(calendar: HTMLElement): void {
        calendar.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const state = this.getState(calendar);
            if (!state) return;

            // Handle navigation buttons - traverse up to find button with data attribute
            const navButton = target.closest('[data-calendar-nav]') as HTMLElement;
            if (navButton) {
                const direction = navButton.dataset.calendarNav as 'prev' | 'next';
                CalendarNavigation.navigateMonth(calendar, direction, state,
                    (newState) => this.updateState(calendar, newState),
                    () => this.renderCalendar(calendar)
                );
                return;
            }

            // Handle month/year button - traverse up to find button with data attribute
            const monthYearButton = target.closest('[data-calendar-month-year-btn]') as HTMLElement;
            if (monthYearButton) {
                CalendarNavigation.toggleMonthYearDropdown(calendar, state,
                    (newState) => this.updateState(calendar, newState),
                    () => this.renderCalendar(calendar)
                );
                return;
            }

            // Handle month selection in month grid - traverse up to find button with data attribute
            const monthButton = target.closest('[data-calendar-month-btn]') as HTMLElement;
            if (monthButton) {
                const monthIndex = parseInt(monthButton.dataset.month || '0');
                CalendarNavigation.selectMonth(calendar, monthIndex, state,
                    (newState) => this.updateState(calendar, newState),
                    () => this.renderCalendar(calendar)
                );
                return;
            }

            // Handle year selection in year grid - traverse up to find button with data attribute
            const yearButton = target.closest('[data-calendar-year-option]') as HTMLElement;
            if (yearButton) {
                const year = parseInt(yearButton.dataset.year || '0');
                CalendarNavigation.selectYear(calendar, year, state,
                    (newState) => this.updateState(calendar, newState),
                    () => this.renderCalendar(calendar)
                );
                return;
            }

            // Handle year navigation arrows in month/year picker
            const yearNavButton = target.closest('[data-calendar-year-nav]') as HTMLElement;
            if (yearNavButton) {
                const direction = yearNavButton.dataset.calendarYearNav as 'prev' | 'next';
                CalendarNavigation.navigateYear(calendar, direction, state,
                    (newState) => this.updateState(calendar, newState),
                    () => this.renderCalendar(calendar)
                );
                return;
            }
        });
    }

    /**
     * Handle date selection
     */
    private selectDate(calendar: HTMLElement, dateString: string): void {
        const state = this.getState(calendar);
        if (!state) return;

        CalendarDateSelection.selectDate(calendar, dateString, state,
            (newState) => this.updateState(calendar, newState)
        );

        this.renderCalendar(calendar);
        CalendarFormIntegration.updateHiddenInput(calendar, this.getState(calendar)!);
        CalendarFormIntegration.dispatchCalendarEvent(calendar, 'dateSelected', {
            selectedDate: state.isRange ? null : dateString,
            startDate: state.isRange ? this.getState(calendar)?.startDate : null,
            endDate: state.isRange ? this.getState(calendar)?.endDate : null,
            source: 'userClick'
        });
    }

    /**
     * Render the calendar
     */
    private renderCalendar(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        // Toggle quick selectors visibility based on view mode
        this.toggleQuickSelectors(calendar, state.viewMode);

        if (state.viewMode === 'calendar') {
            CalendarRenderer.renderCalendarGrid(calendar, state);
            CalendarKeyboard.initializeFocus(calendar, state);
        } else if (state.viewMode === 'month') {
            // Month grid is rendered by CalendarNavigation
        } else if (state.viewMode === 'year') {
            CalendarNavigation.renderYearGrid(calendar, state,
                (newState) => this.updateState(calendar, newState),
                () => this.renderCalendar(calendar)
            );
        }
    }

    /**
     * Toggle quick selectors visibility based on view mode and isRange
     */
    private toggleQuickSelectors(calendar: HTMLElement, viewMode: string): void {
        const state = this.getState(calendar);
        const quickSelectors = calendar.querySelector('[data-view-mode-show="calendar"]') as HTMLElement;
        if (quickSelectors) {
            // Only show quick selectors for range pickers in calendar view
            if (viewMode === 'calendar' && state?.isRange) {
                quickSelectors.style.display = '';
            } else {
                quickSelectors.style.display = 'none';
            }
        }
    }

    /**
     * Update state and trigger re-render
     */
    private updateState(calendar: HTMLElement, newState: Partial<CalendarState>): void {
        const currentState = this.getState(calendar);
        if (!currentState) return;

        const updatedState = { ...currentState, ...newState };
        this.setState(calendar, updatedState);
    }

    /**
     * Setup dynamic observer for dynamically added calendars
     */
    protected setupDynamicObserver(): void {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as HTMLElement;

                        // Check if the added element is a calendar
                        if (element.dataset.keysCalendar === 'true') {
                            this.initializeCalendar(element);
                        }

                        // Check for calendars within the added element
                        const nestedCalendars = element.querySelectorAll('[data-keys-calendar="true"]');
                        nestedCalendars.forEach(calendar => {
                            this.initializeCalendar(calendar as HTMLElement);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Public API: Get calendar state
     */
    public getCalendarState(calendar: HTMLElement): any {
        const state = this.getState(calendar);
        return state ? CalendarFormIntegration.getCalendarState(calendar, state) : null;
    }

    /**
     * Public API: Set selected date
     */
    public setSelectedDate(calendar: HTMLElement, dateString: string | null): void {
        const state = this.getState(calendar);
        if (!state) return;

        CalendarFormIntegration.setSelectedDate(calendar, dateString, state,
            (newState) => this.updateState(calendar, newState),
            () => this.renderCalendar(calendar)
        );
    }

    /**
     * Public API: Set selected range
     */
    public setSelectedRange(calendar: HTMLElement, startDate: string | null, endDate: string | null): void {
        const state = this.getState(calendar);
        if (!state) return;

        CalendarFormIntegration.setSelectedRange(calendar, startDate, endDate, state,
            (newState) => this.updateState(calendar, newState),
            () => this.renderCalendar(calendar)
        );
    }

    /**
     * Cleanup when component is destroyed
     */
    protected onDestroy(): void {
        // Cleanup keyboard event listeners for all calendars
        DOMUtils.findByDataAttribute('keys-calendar', 'true').forEach(calendar => {
            CalendarKeyboard.unbindKeyboardEvents(calendar);
        });
    }

    /**
     * Get current year-month string
     */
    private getCurrentYearMonth(): string {
        const now = new Date();
        return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    }

    /**
     * Get today's date string
     */
    private getTodayDate(): string {
        const today = new Date();
        return today.getFullYear() + '-' +
               String(today.getMonth() + 1).padStart(2, '0') + '-' +
               String(today.getDate()).padStart(2, '0');
    }
}