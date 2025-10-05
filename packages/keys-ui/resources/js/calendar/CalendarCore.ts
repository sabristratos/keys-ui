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
import { DateUtils } from '../utils/DateUtils';
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

        const calendarDataAttr = calendarElement.dataset.keysCalendarConfig;
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
            viewMode: 'calendar',
            format: calendarData.format || 'Y-m-d',
            displayFormat: calendarData.displayFormat || calendarData.format || 'Y-m-d'
        };

        this.setState(calendarElement, state);
        this.renderCalendar(calendarElement);
        this.bindAllEventListeners(calendarElement);

        CalendarFormIntegration.updateHiddenInput(calendarElement, state);
        CalendarFormIntegration.dispatchCalendarEvent(calendarElement, 'initialized', { state });
    }

    /**
     * Bind all event listeners for a calendar
     */
    protected bindEventListeners(): void {
    }

    /**
     * Bind all event listeners for a specific calendar
     */
    private bindAllEventListeners(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        this.bindDateSelectionEvents(calendar);

        this.bindNavigationEvents(calendar);

        CalendarFormIntegration.bindFormEvents(calendar, state,
            (newState) => this.updateState(calendar, newState),
            () => this.renderCalendar(calendar)
        );

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

            if (target.dataset.calendarDayBtn !== undefined) {
                const dateString = target.dataset.date;
                const isDisabled = target.hasAttribute('disabled') || target.getAttribute('aria-disabled') === 'true';
                if (dateString && !isDisabled) {
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

            const navButton = target.closest('[data-calendar-nav]') as HTMLElement;
            if (navButton) {
                const direction = navButton.dataset.calendarNav as 'prev' | 'next';
                CalendarNavigation.navigateMonth(calendar, direction, state,
                    (newState) => this.updateState(calendar, newState),
                    () => this.renderCalendar(calendar)
                );
                return;
            }

            const monthYearButton = target.closest('[data-calendar-month-year-btn]') as HTMLElement;
            if (monthYearButton) {
                CalendarNavigation.toggleMonthYearDropdown(calendar, state,
                    (newState) => this.updateState(calendar, newState),
                    () => this.renderCalendar(calendar)
                );
                return;
            }

            const monthButton = target.closest('[data-calendar-month-btn]') as HTMLElement;
            if (monthButton) {
                const monthIndex = parseInt(monthButton.dataset.month || '0');
                CalendarNavigation.selectMonth(calendar, monthIndex, state,
                    (newState) => this.updateState(calendar, newState),
                    () => this.renderCalendar(calendar)
                );
                return;
            }

            const yearButton = target.closest('[data-calendar-year-option]') as HTMLElement;
            if (yearButton) {
                const year = parseInt(yearButton.dataset.year || '0');
                CalendarNavigation.selectYear(calendar, year, state,
                    (newState) => this.updateState(calendar, newState),
                    () => this.renderCalendar(calendar)
                );
                return;
            }

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

        const updatedState = this.getState(calendar)!;
        if (state.isRange) {
            const formattedRange = updatedState.startDate && updatedState.endDate ?
                DateUtils.formatRangeForDisplay(updatedState.startDate, updatedState.endDate, updatedState.displayFormat) :
                (updatedState.startDate ? DateUtils.formatDateForDisplay(updatedState.startDate, updatedState.displayFormat) : '');

            CalendarFormIntegration.dispatchCalendarEvent(calendar, 'rangeSelected', {
                startDate: updatedState.startDate,
                endDate: updatedState.endDate,
                formattedRange: formattedRange,
                source: 'userClick'
            });
        } else {
            const formattedDate = DateUtils.formatDateForDisplay(dateString, updatedState.displayFormat);

            CalendarFormIntegration.dispatchCalendarEvent(calendar, 'dateSelected', {
                selectedDate: dateString,
                formattedDate: formattedDate,
                source: 'userClick'
            });
        }
    }

    /**
     * Render the calendar
     */
    private renderCalendar(calendar: HTMLElement): void {
        const state = this.getState(calendar);
        if (!state) return;

        this.toggleQuickSelectors(calendar, state.viewMode);

        if (state.viewMode === 'calendar') {
            CalendarRenderer.renderCalendarGrid(calendar, state);
            CalendarKeyboard.initializeFocus(calendar, state);
        } else if (state.viewMode === 'month') {
        } else if (state.viewMode === 'year') {
            CalendarNavigation.renderYearGrid(calendar, state,
                (newState) => this.updateState(calendar, newState),
                () => this.renderCalendar(calendar)
            );
        }
    }

    /**
     * Toggle quick selectors visibility based on view mode, isRange, and selector configuration
     */
    private toggleQuickSelectors(calendar: HTMLElement, viewMode: string): void {
        const state = this.getState(calendar);
        const quickSelectors = calendar.querySelector('[data-view-mode-show="calendar"]') as HTMLElement;
        if (quickSelectors) {
            const selectorButtons = quickSelectors.querySelectorAll('[data-quick-selector]');
            const hasConfiguredSelectors = selectorButtons.length > 0;

            if (viewMode === 'calendar' && state?.isRange && hasConfiguredSelectors) {
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

                        if (element.dataset.keysCalendar === 'true') {
                            this.initializeCalendar(element);
                        }

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