/**
 * DatePickerActions - Simplified date picker functionality
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

    protected initializeElements(): void {
        DOMUtils.querySelectorAll('[data-keys-date-picker]').forEach(datePicker => {
            this.initializeDatePicker(datePicker as HTMLElement);
        });
    }

    private initializeDatePicker(element: HTMLElement): void {
        if (this.hasState(element)) return;

        const configAttr = element.dataset.keysDatePickerConfig;
        let config: any = {};
        try {
            config = configAttr ? JSON.parse(configAttr) : {};
        } catch (e) {
            console.error('Failed to parse date picker config:', e);
        }

        const state: DatePickerState = {
            selectedDate: config.selectedDate || null,
            startDate: config.startDate || null,
            endDate: config.endDate || null,
            format: config.format || 'Y-m-d',
            displayFormat: config.displayFormat || config.format || 'Y-m-d',
            isRange: config.isRange || false,
            closeOnSelect: config.closeOnSelect !== false,
            isInline: element.dataset.inline === 'true',
            isDisabled: element.dataset.disabled === 'true'
        };

        this.setState(element, state);
        this.setupCalendarEventListeners(element);
    }

    protected bindEventListeners(): void {
        EventUtils.handleDelegatedClick('[data-date-picker-clear]', (clearBtn, event) => {
            event.preventDefault();
            event.stopPropagation();
            const datePicker = DOMUtils.findClosest(clearBtn, '[data-keys-date-picker]');
            if (datePicker && !this.isDisabled(datePicker)) {
                this.clearDate(datePicker);
            }
        });

        EventUtils.handleDelegatedClick('[data-quick-selector]', (button, event) => {
            event.preventDefault();
            const datePicker = DOMUtils.findClosest(button, '[data-keys-date-picker]');
            const calendar = datePicker ? DOMUtils.querySelector('[data-keys-calendar="true"]', datePicker) : null;

            if (calendar && (window as any).KeysUI?.CalendarCore) {
                const selectorValue = button.dataset.quickSelector;
                if (selectorValue) {
                    calendar.dispatchEvent(new CustomEvent('quickSelector:clicked', {
                        detail: { value: selectorValue },
                        bubbles: true
                    }));
                }
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

    private setupCalendarEventListeners(datePicker: HTMLElement): void {
        const calendar = DOMUtils.querySelector('[data-keys-calendar="true"]', datePicker);
        if (!calendar) return;

        calendar.addEventListener('calendar:dateSelected', (event: any) => {
            event.stopPropagation();
            const { selectedDate, formattedDate } = event.detail;
            this.handleDateSelected(datePicker, selectedDate, formattedDate);
        });

        calendar.addEventListener('calendar:rangeSelected', (event: any) => {
            event.stopPropagation();
            const { startDate, endDate, formattedRange } = event.detail;
            this.handleRangeSelected(datePicker, startDate, endDate, formattedRange);
        });

        calendar.addEventListener('calendar:cleared', (event: any) => {
            event.stopPropagation();
            this.handleCalendarCleared(datePicker);
        });
    }

    private handleDateSelected(datePicker: HTMLElement, selectedDate: string | null, formattedDate: string | null): void {
        const state = this.getState(datePicker);
        if (!state) return;

        state.selectedDate = selectedDate;
        this.setState(datePicker, state);

        this.updateDisplay(datePicker, selectedDate ? this.formatDateForDisplay(selectedDate, state.displayFormat) : null);
        this.updateHiddenInput(datePicker, selectedDate ? DateUtils.formatDateForSubmission(selectedDate, state.format) : '');

        if (state.closeOnSelect && !state.isInline && !state.isRange) {
            this.closePopover(datePicker);
        }

        this.dispatchDatePickerEvent(datePicker, 'datepicker:change', {
            value: selectedDate,
            formatted: formattedDate
        });
    }

    private handleRangeSelected(datePicker: HTMLElement, startDate: string | null, endDate: string | null, formattedRange: string | null): void {
        const state = this.getState(datePicker);
        if (!state) return;

        state.startDate = startDate;
        state.endDate = endDate;
        this.setState(datePicker, state);

        const displayValue = DateUtils.formatRangeForDisplay(startDate, endDate, state.displayFormat);
        this.updateDisplay(datePicker, displayValue);

        const rangeValue = DateUtils.formatRangeForSubmission(startDate, endDate, state.format);
        this.updateHiddenInput(datePicker, rangeValue || '');

        if (state.closeOnSelect && startDate && endDate && !state.isInline) {
            this.closePopover(datePicker);
        }

        this.dispatchDatePickerEvent(datePicker, 'datepicker:change', {
            startDate: startDate,
            endDate: endDate,
            formatted: formattedRange
        });
    }

    private handleCalendarCleared(datePicker: HTMLElement): void {
        this.clearDate(datePicker);
    }

    private clearDate(datePicker: HTMLElement): void {
        const state = this.getState(datePicker);
        if (!state) return;

        state.selectedDate = null;
        state.startDate = null;
        state.endDate = null;
        this.setState(datePicker, state);

        this.updateDisplay(datePicker, null);
        this.updateHiddenInput(datePicker, '');

        const calendar = DOMUtils.querySelector('[data-keys-calendar="true"]', datePicker);
        if (calendar && (window as any).KeysUI?.CalendarCore) {
            try {
                const calendarCore = (window as any).KeysUI.CalendarCore;
                if (state.isRange) {
                    calendarCore.setSelectedRange(calendar, null, null);
                } else {
                    calendarCore.setSelectedDate(calendar, null);
                }
            } catch (error) {
            }
        }

        if (!state.isInline) {
            this.closePopover(datePicker);
        }

        this.dispatchDatePickerEvent(datePicker, 'datepicker:cleared');
    }


    private updateDisplay(datePicker: HTMLElement, value: string | null): void {
        const displayElement = DOMUtils.querySelector('[data-date-picker-display]', datePicker) as HTMLElement;
        if (displayElement) {
            if (value) {
                displayElement.innerHTML = value;
            } else {
                const placeholder = datePicker.dataset.placeholder || 'Select date...';
                displayElement.innerHTML = `<span class="text-muted date-picker-placeholder">${placeholder}</span>`;
            }
        }
    }

    private updateHiddenInput(datePicker: HTMLElement, value: string): void {
        const hiddenInput = DOMUtils.querySelector('[data-date-picker-value]', datePicker) as HTMLInputElement;
        if (hiddenInput) {
            hiddenInput.value = value;

            // Dispatch events for Livewire and native form integration
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });

            hiddenInput.dispatchEvent(inputEvent);
            hiddenInput.dispatchEvent(changeEvent);

            // Livewire integration
            if ((window as any).Livewire && hiddenInput.hasAttribute('wire:model')) {
                (window as any).Livewire.hook('message.processed', () => {});
            }
        }
    }

    private closePopover(datePicker: HTMLElement): void {
        setTimeout(() => {
            const popover = DOMUtils.findClosest(datePicker, '[data-keys-popover]') ||
                           DOMUtils.querySelector('[data-keys-popover]', datePicker);
            if (popover && 'hidePopover' in popover) {
                try {
                    (popover as any).hidePopover();
                } catch (e) {
                }
            }
        }, 150);
    }

    private handleManualInput(datePicker: HTMLElement, inputValue: string): void {
        const state = this.getState(datePicker);
        if (!state) return;

        const parsedDate = DateUtils.parseInputDate(inputValue, state.displayFormat);
        if (parsedDate) {
            const dateString = DateUtils.formatDateString(parsedDate);
            this.updateDisplay(datePicker, this.formatDateForDisplay(dateString, state.displayFormat));

            const calendar = DOMUtils.querySelector('[data-keys-calendar="true"]', datePicker);
            if (calendar && (window as any).KeysUI?.CalendarCore) {
                try {
                    const calendarCore = (window as any).KeysUI.CalendarCore;
                    calendarCore.setSelectedDate(calendar, dateString);
                } catch (error) {
                    console.warn('Calendar core not available or failed:', error);
                }
            }
        }
    }

    private isDisabled(datePicker: HTMLElement): boolean {
        const state = this.getState(datePicker);
        return state ? state.isDisabled : false;
    }

    private dispatchDatePickerEvent(datePicker: HTMLElement, eventName: string, detail: any = null): void {
        EventUtils.dispatchCustomEvent(datePicker, eventName, {
            datePicker,
            ...detail
        }, {
            bubbles: true,
            cancelable: true
        });
    }

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

    private formatDateForDisplay(dateString: string, displayFormat: string): string {
        try {
            const date = new Date(dateString + 'T00:00:00');
            if (isNaN(date.getTime())) return dateString;

            return DateUtils.formatDateForDisplay(dateString, displayFormat) || dateString;
        } catch (error) {
            console.warn('Date formatting error:', error);
            return dateString;
        }
    }

    protected onDestroy(): void {
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DatePickerActions.getInstance().init();
    });
} else {
    DatePickerActions.getInstance().init();
}

(window as any).DatePickerActions = DatePickerActions;

declare global {
    interface Window {
        DatePickerActions: typeof DatePickerActions;
    }
}

export default DatePickerActions.getInstance();