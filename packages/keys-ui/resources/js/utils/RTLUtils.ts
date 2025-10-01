/**
 * RTLUtils - Right-to-Left language support utilities
 *
 * Provides functionality for:
 * - RTL detection based on document direction, language, or explicit settings
 * - Dynamic class name transformation for RTL layouts
 * - Component positioning adjustments for RTL languages
 */

export class RTLUtils {
    private static cachedDirection: string | null = null;

    /**
     * Detect if the current document is in RTL mode
     */
    static isRTL(): boolean {
        if (this.cachedDirection !== null) {
            return this.cachedDirection === 'rtl';
        }

        const sources = [
            document.documentElement.getAttribute('dir'),
            this.getDirectionFromLanguage(document.documentElement.getAttribute('lang')),
            document.body?.getAttribute('dir'),
            window.getComputedStyle(document.documentElement).direction
        ];

        for (const source of sources) {
            if (source === 'rtl') {
                this.cachedDirection = 'rtl';
                return true;
            }
            if (source === 'ltr') {
                this.cachedDirection = 'ltr';
                return false;
            }
        }

        this.cachedDirection = 'ltr';
        return false;
    }

    /**
     * Get direction based on language code
     */
    private static getDirectionFromLanguage(lang: string | null): string | null {
        if (!lang) return null;

        const rtlLanguages = [
            'ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ug', 'yi',
            'arc', 'ckb', 'dv', 'ha', 'ji', 'ku', 'ks', 'ms',
            'nqo', 'pnb', 'prs', 'ug', 'uz'
        ];

        const languageCode = lang.toLowerCase().split('-')[0];
        return rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
    }

    /**
     * Clear cached direction (useful for dynamic changes)
     */
    static clearCache(): void {
        this.cachedDirection = null;
    }

    /**
     * Transform directional class names for RTL
     */
    static transformDirectionalClasses(classes: string): string {
        if (!this.isRTL()) {
            return classes;
        }

        const classMap = new Map([
            ['ml-', 'mr-'],
            ['mr-', 'ml-'],
            ['ms-', 'me-'],
            ['me-', 'ms-'],

            ['pl-', 'pr-'],
            ['pr-', 'pl-'],
            ['ps-', 'pe-'],
            ['pe-', 'ps-'],

            ['border-l-', 'border-r-'],
            ['border-r-', 'border-l-'],
            ['border-s-', 'border-e-'],
            ['border-e-', 'border-s-'],

            ['rounded-l-', 'rounded-r-'],
            ['rounded-r-', 'rounded-l-'],
            ['rounded-s-', 'rounded-e-'],
            ['rounded-e-', 'rounded-s-'],
            ['rounded-tl-', 'rounded-tr-'],
            ['rounded-tr-', 'rounded-tl-'],
            ['rounded-bl-', 'rounded-br-'],
            ['rounded-br-', 'rounded-bl-'],
            ['rounded-ss-', 'rounded-se-'],
            ['rounded-se-', 'rounded-ss-'],
            ['rounded-es-', 'rounded-ee-'],
            ['rounded-ee-', 'rounded-es-'],

            ['left-', 'right-'],
            ['right-', 'left-'],
            ['start-', 'end-'],
            ['end-', 'start-'],

            ['text-left', 'text-right'],
            ['text-right', 'text-left'],

            ['justify-start', 'justify-end'],
            ['justify-end', 'justify-start'],
            ['items-start', 'items-end'],
            ['items-end', 'items-start'],
            ['self-start', 'self-end'],
            ['self-end', 'self-start'],

            ['float-left', 'float-right'],
            ['float-right', 'float-left'],

            ['clear-left', 'clear-right'],
            ['clear-right', 'clear-left'],
        ]);

        let transformedClasses = classes;

        for (const [ltr, rtl] of classMap) {
            const ltrPattern = new RegExp(`\\b${ltr.replace('-', '\\-')}([\\w\\-\\.\\[\\]%\\/]+)?\\b`, 'g');
            const rtlPattern = new RegExp(`\\b${rtl.replace('-', '\\-')}([\\w\\-\\.\\[\\]%\\/]+)?\\b`, 'g');

            transformedClasses = transformedClasses.replace(ltrPattern, (match, suffix) => {
                return rtl + (suffix || '');
            });
        }

        return transformedClasses;
    }

    /**
     * Get the opposite direction for icon positioning
     */
    static getOppositePosition(position: 'left' | 'right'): 'left' | 'right' {
        if (!this.isRTL()) {
            return position;
        }
        return position === 'left' ? 'right' : 'left';
    }

    /**
     * Get logical position (start/end) based on physical position (left/right)
     */
    static getLogicalPosition(position: 'left' | 'right'): 'start' | 'end' {
        if (this.isRTL()) {
            return position === 'left' ? 'end' : 'start';
        }
        return position === 'left' ? 'start' : 'end';
    }

    /**
     * Get physical position from logical position
     */
    static getPhysicalPosition(position: 'start' | 'end'): 'left' | 'right' {
        if (this.isRTL()) {
            return position === 'start' ? 'right' : 'left';
        }
        return position === 'start' ? 'left' : 'right';
    }

    /**
     * Add RTL-aware classes to an element
     */
    static addRTLClasses(element: Element, classes: string): void {
        const transformedClasses = this.transformDirectionalClasses(classes);
        element.classList.add(...transformedClasses.split(' ').filter(cls => cls.trim()));
    }

    /**
     * Remove RTL-aware classes from an element
     */
    static removeRTLClasses(element: Element, classes: string): void {
        const transformedClasses = this.transformDirectionalClasses(classes);
        element.classList.remove(...transformedClasses.split(' ').filter(cls => cls.trim()));
    }

    /**
     * Listen for direction changes and clear cache
     */
    static observeDirectionChanges(): void {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'dir' || mutation.attributeName === 'lang')) {
                    this.clearCache();
                    document.dispatchEvent(new CustomEvent('keys:direction-change', {
                        detail: { isRTL: this.isRTL() }
                    }));
                    break;
                }
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['dir', 'lang']
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['dir', 'lang']
        });
    }

    /**
     * Get dropdown positioning for RTL
     */
    static getDropdownPosition(
        preferredPosition: 'left' | 'right' | 'top' | 'bottom',
        align: 'start' | 'center' | 'end'
    ): { position: string; align: string } {
        let position = preferredPosition;
        let alignment = align;

        if (this.isRTL()) {
            if (position === 'left') position = 'right';
            else if (position === 'right') position = 'left';

            if ((preferredPosition === 'top' || preferredPosition === 'bottom')) {
                if (align === 'start') alignment = 'end';
                else if (align === 'end') alignment = 'start';
            }
        }

        return { position, align: alignment };
    }

    /**
     * Initialize RTL support globally
     */
    static initialize(): void {
        if (this.isRTL()) {
            document.documentElement.classList.add('rtl');
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.classList.add('ltr');
            document.documentElement.setAttribute('dir', 'ltr');
        }

        this.observeDirectionChanges();

        const style = document.createElement('style');
        style.textContent = `
            :root {
                --direction-factor: ${this.isRTL() ? '-1' : '1'};
                --text-align-start: ${this.isRTL() ? 'right' : 'left'};
                --text-align-end: ${this.isRTL() ? 'left' : 'right'};
            }
        `;
        document.head.appendChild(style);
    }
}