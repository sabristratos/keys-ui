/**
 * DateUtils - Shared date utilities for Keys UI components
 *
 * Provides common date operations used by Calendar and DatePicker components:
 * - Date formatting with multiple format support
 * - Date parsing and validation
 * - Date arithmetic (add/subtract days/months)
 * - Date comparison utilities
 * - Range formatting and validation
 */

export interface DateFormatOptions {
    format: string;
    locale?: string;
}

export interface DateRange {
    start: Date | null;
    end: Date | null;
}

export class DateUtils {
    /**
     * Month names for formatting
     */
    private static readonly MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    private static readonly MONTH_NAMES_SHORT = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    /**
     * Format Date object to string using custom format
     */
    static formatDate(date: Date, format: string): string {
        if (!date || isNaN(date.getTime())) {
            return '';
        }

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const replacements: Record<string, string> = {
            'Y': String(year),
            'y': String(year).slice(-2),
            'F': this.MONTH_NAMES[month - 1],
            'M': this.MONTH_NAMES_SHORT[month - 1],
            'm': String(month).padStart(2, '0'),
            'n': String(month),
            'd': String(day).padStart(2, '0'),
            'j': String(day),
        };

        let result = format;
        for (const [key, value] of Object.entries(replacements)) {
            result = result.replace(new RegExp(key, 'g'), value);
        }

        return result;
    }

    /**
     * Format Date object to YYYY-MM-DD string
     */
    static formatDateString(date: Date): string {
        if (!date || isNaN(date.getTime())) {
            return '';
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * Parse date string to Date object
     */
    static parseDate(dateString: string | null | undefined): Date | null {
        if (!dateString || typeof dateString !== 'string' || !dateString.trim()) {
            return null;
        }

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return null;
            }
            return date;
        } catch (e) {
            return null;
        }
    }

    /**
     * Format date for display using specified format
     */
    static formatDateForDisplay(dateString: string | null, format: string): string {
        if (!dateString) return '';

        const date = this.parseDate(dateString);
        if (!date) return '';

        return this.formatDate(date, format);
    }

    /**
     * Format date range for display
     */
    static formatRangeForDisplay(
        startDate: string | null,
        endDate: string | null,
        format: string,
        separator: string = ' - '
    ): string {
        if (!startDate) return '';

        const start = this.formatDateForDisplay(startDate, format);
        const end = endDate ? this.formatDateForDisplay(endDate, format) : '';

        return end ? `${start}${separator}${end}` : start;
    }

    /**
     * Format date range for form submission
     */
    static formatRangeForSubmission(
        startDate: string | null,
        endDate: string | null,
        format: string = 'Y-m-d'
    ): string | null {
        if (!startDate) return null;

        const start = this.formatDateForSubmission(startDate, format);
        const end = endDate ? this.formatDateForSubmission(endDate, format) : '';

        return end ? `${start},${end}` : start;
    }

    /**
     * Format single date for form submission
     */
    static formatDateForSubmission(dateString: string | null, format: string = 'Y-m-d'): string {
        if (!dateString) return '';

        const date = this.parseDate(dateString);
        if (!date) return '';

        return this.formatDate(date, format);
    }

    /**
     * Add days to a date string
     */
    static addDaysToDate(dateString: string, days: number): string {
        const date = this.parseDate(dateString);
        if (!date) return dateString;

        date.setDate(date.getDate() + days);
        return this.formatDateString(date);
    }

    /**
     * Add months to a date string
     */
    static addMonthsToDate(dateString: string, months: number): string {
        const date = this.parseDate(dateString);
        if (!date) return dateString;

        date.setMonth(date.getMonth() + months);
        return this.formatDateString(date);
    }

    /**
     * Get first day of month for a date string
     */
    static getFirstDayOfMonth(dateString: string): string {
        const date = this.parseDate(dateString);
        if (!date) return dateString;

        date.setDate(1);
        return this.formatDateString(date);
    }

    /**
     * Get last day of month for a date string
     */
    static getLastDayOfMonth(dateString: string): string {
        const date = this.parseDate(dateString);
        if (!date) return dateString;

        date.setMonth(date.getMonth() + 1, 0);
        return this.formatDateString(date);
    }

    /**
     * Get current year-month string (YYYY-MM)
     */
    static getCurrentYearMonth(): string {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    /**
     * Get today's date string (YYYY-MM-DD)
     */
    static getTodayDate(): string {
        return this.formatDateString(new Date());
    }

    /**
     * Check if date string is today
     */
    static isToday(dateString: string): boolean {
        return dateString === this.getTodayDate();
    }

    /**
     * Check if a date is within a range
     */
    static isDateInRange(dateString: string, startDate: string | null, endDate: string | null): boolean {
        if (!startDate || !endDate) return false;

        const date = this.parseDate(dateString);
        const start = this.parseDate(startDate);
        const end = this.parseDate(endDate);

        if (!date || !start || !end) return false;

        return date >= start && date <= end;
    }

    /**
     * Check if a date matches start of range
     */
    static isDateRangeStart(dateString: string, startDate: string | null): boolean {
        return startDate === dateString;
    }

    /**
     * Check if a date matches end of range
     */
    static isDateRangeEnd(dateString: string, endDate: string | null): boolean {
        return endDate === dateString;
    }

    /**
     * Get placeholder text for date format
     */
    static getFormatPlaceholder(format: string): string {
        const placeholders: Record<string, string> = {
            'Y-m-d': 'YYYY-MM-DD',
            'Y/m/d': 'YYYY/MM/DD',
            'd-m-Y': 'DD-MM-YYYY',
            'd/m/Y': 'DD/MM/YYYY',
            'm/d/Y': 'MM/DD/YYYY',
            'm-d-Y': 'MM-DD-YYYY',
            'F j, Y': 'Month DD, YYYY',
            'M j, Y': 'Mon DD, YYYY',
            'j F Y': 'DD Month YYYY',
        };

        return placeholders[format] || 'YYYY-MM-DD';
    }

    /**
     * Parse input date string with multiple format support
     */
    static parseInputDate(input: string, expectedFormat?: string): Date | null {
        if (!input || !input.trim()) return null;

        // Try standard Date parsing first
        try {
            const date = new Date(input);
            if (!isNaN(date.getTime())) {
                return date;
            }
        } catch (e) {
            // Continue to format-specific parsing
        }

        // If we have an expected format, try to parse accordingly
        if (expectedFormat) {
            // This could be enhanced with more sophisticated format parsing
            // For now, rely on standard Date parsing
        }

        return null;
    }

    /**
     * Create ARIA label for date with contextual information
     */
    static createDateAriaLabel(
        dateString: string,
        isToday: boolean = false,
        isSelected: boolean = false,
        isRangeStart: boolean = false,
        isRangeEnd: boolean = false,
        isInRange: boolean = false
    ): string {
        const date = this.parseDate(dateString);
        if (!date) return dateString;

        const formatted = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        let label = formatted;

        if (isToday) {
            label += ', Today';
        }

        if (isSelected) {
            label += ', Selected';
        } else if (isRangeStart) {
            label += ', Range start';
        } else if (isRangeEnd) {
            label += ', Range end';
        } else if (isInRange) {
            label += ', In selected range';
        }

        return label;
    }

    /**
     * Validate date string format
     */
    static isValidDateString(dateString: string): boolean {
        const date = this.parseDate(dateString);
        return date !== null && !isNaN(date.getTime());
    }

    /**
     * Compare two date strings
     */
    static compareDates(date1: string, date2: string): number {
        const d1 = this.parseDate(date1);
        const d2 = this.parseDate(date2);

        if (!d1 || !d2) return 0;

        return d1.getTime() - d2.getTime();
    }

    /**
     * Get quick selector date ranges
     */
    static getQuickSelectorDate(selector: string): DateRange {
        const today = new Date();
        let start: Date | null = null;
        let end: Date | null = null;

        switch (selector) {
            case 'today':
                start = today;
                end = today;
                break;
            case 'yesterday':
                start = new Date(today);
                start.setDate(today.getDate() - 1);
                end = start;
                break;
            case 'last7days':
                end = today;
                start = new Date(today);
                start.setDate(today.getDate() - 6);
                break;
            case 'last30days':
                end = today;
                start = new Date(today);
                start.setDate(today.getDate() - 29);
                break;
            case 'thismonth':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            case 'lastmonth':
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                end = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'thisyear':
                start = new Date(today.getFullYear(), 0, 1);
                end = new Date(today.getFullYear(), 11, 31);
                break;
        }

        return { start, end };
    }
}