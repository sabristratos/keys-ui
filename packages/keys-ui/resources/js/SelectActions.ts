/**
 * SelectActions - Handles interactive functionality for Select components
 *
 * Provides functionality for:
 * - Dropdown open/close with keyboard navigation
 * - Search/filter options
 * - Single and multiple selection
 * - Chip creation and removal
 * - Click outside to close
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import { AnimationUtils } from './utils/AnimationUtils';

interface SelectOption {
    element: HTMLElement;
    value: string;
    label: string;
    displayLabel: string;
    searchableText: string;
    disabled: boolean;
}

interface SelectState {
    isOpen: boolean;
    selectedValues: string[];
    searchTerm: string;
    focusedIndex: number;
    filteredOptions: SelectOption[];
}

export class SelectActions extends BaseActionClass<SelectState> {


    /**
     * Initialize select elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.findByDataAttribute('select', 'true').forEach(select => {
            this.initializeSelect(select);
        });
    }

    /**
     * Initialize a single select element
     */
    private initializeSelect(selectElement: HTMLElement): void {
        const isMultiple = selectElement.dataset.multiple === 'true';
        const initialValue = selectElement.dataset.value;

        let selectedValues: string[] = [];

        if (initialValue) {
            try {
                selectedValues = isMultiple ? JSON.parse(initialValue) : [initialValue];
            } catch {
                selectedValues = isMultiple ? [] : [initialValue];
            }
        }

        const state: SelectState = {
            isOpen: false,
            selectedValues,
            searchTerm: '',
            focusedIndex: -1,
            filteredOptions: []
        };

        this.setState(selectElement, state);
        this.updateOptions(selectElement);
        this.updateOptionsSelectedState(selectElement);
        this.updateDisplay(selectElement);
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Handle all click events with a single delegated listener
        EventUtils.handleDelegatedClick('[data-remove-chip], [data-select-clear], [data-select-option], [data-select-trigger], [data-select-search]', (element, event) => {
            if (element.matches('[data-remove-chip]')) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                const chipValue = element.dataset.removeChip;
                const select = DOMUtils.findClosest(element, '[data-select="true"]');
                if (select && chipValue) {
                    this.removeChip(select, chipValue);
                }
                return;
            }

            if (element.matches('[data-select-clear]')) {
                event.preventDefault();
                event.stopPropagation();
                const select = DOMUtils.findClosest(element, '[data-select="true"]');
                if (select) {
                    this.clearSelection(select);
                }
                return;
            }

            if (element.matches('[data-select-option]')) {
                event.preventDefault();
                event.stopPropagation();
                const select = DOMUtils.findClosest(element, '[data-select="true"]');
                if (select) {
                    this.selectOption(select, element);
                }
                return;
            }

            if (element.matches('[data-select-trigger]')) {
                event.preventDefault();
                event.stopPropagation();
                const select = DOMUtils.findClosest(element, '[data-select="true"]');
                if (select && !this.isDisabled(select)) {
                    this.toggleDropdown(select);
                }
                return;
            }

            if (element.matches('[data-select-search]')) {
                event.stopPropagation();
                return; // Don't close dropdown when clicking search input
            }
        });

        // Handle click outside to close dropdowns
        EventUtils.addEventListener(document, 'click', (event) => {
            const target = event.target as Node;

            // Check if the click was inside any select element
            if (target && target instanceof Element) {
                const searchContainer = target.closest('[data-select-search]')?.parentElement;
                if (searchContainer && DOMUtils.querySelector('[data-select-search]', searchContainer)) {
                    event.stopPropagation();
                    return; // Don't close dropdown when clicking search container
                }

                const closestSelectElement = target.closest('[data-remove-chip], [data-select-clear], [data-select-option], [data-select-trigger], [data-select-search]');

                // If click is not inside any select element, close all dropdowns
                if (!closestSelectElement) {
                    this.closeAllDropdowns();
                }
            }
        });

        // Handle search input
        EventUtils.handleDelegatedInput('[data-select-search]', (searchInput, event) => {
            const select = DOMUtils.findClosest(searchInput, '[data-select="true"]');
            if (select) {
                this.handleSearch(select, searchInput.value);
            }
        });

        // Handle keyboard navigation
        EventUtils.handleDelegatedKeydown('[data-select="true"]', (select, event) => {
            this.handleKeydown(select, event);
        });

        // Handle focus events
        EventUtils.handleDelegatedFocus('[data-select="true"]', (select, event) => {
            if (!this.isOpen(select)) {
                // Handle focus logic if needed
            }
        });
    }

    /**
     * Setup dynamic observer for new selects - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Check if the added node is a select
                    if (DOMUtils.hasDataAttribute(element, 'select', 'true')) {
                        if (!this.hasState(element)) {
                            this.initializeSelect(element);
                        }
                    }

                    // Check for selects within the added node
                    const selects = DOMUtils.findByDataAttribute('select', 'true', element);
                    selects.forEach(select => {
                        if (!this.hasState(select)) {
                            this.initializeSelect(select);
                        }
                    });
                }
            });
        });
    }

    /**
     * Toggle dropdown open/closed state
     */
    private toggleDropdown(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        if (state.isOpen) {
            this.closeDropdown(select);
        } else {
            this.openDropdown(select);
        }
    }

    /**
     * Open dropdown
     */
    private openDropdown(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state || this.isDisabled(select)) return;

        this.closeAllDropdowns();

        state.isOpen = true;
        this.setState(select, state);

        const dropdown = DOMUtils.querySelector('[data-select-dropdown]', select) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-select-trigger]', select) as HTMLElement;
        const searchInput = DOMUtils.querySelector('[data-select-search]', select) as HTMLInputElement;

        if (dropdown) {
            dropdown.classList.remove('hidden');
            this.positionDropdown(select);
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'true');
            const arrow = DOMUtils.querySelector('.select-arrow', trigger);
            if (arrow) {
                arrow.classList.add('rotate-180');
            }
        }

        if (searchInput && select.dataset.searchable === 'true') {
            AnimationUtils.createTimer(() => searchInput.focus(), 10);
        }

        this.updateFilteredOptions(select);

        this.dispatchSelectEvent(select, 'select:open');
    }

    /**
     * Close dropdown
     */
    private closeDropdown(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state || !state.isOpen) return;

        state.isOpen = false;
        state.searchTerm = '';
        state.focusedIndex = -1;
        this.setState(select, state);

        const dropdown = DOMUtils.querySelector('[data-select-dropdown]', select) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-select-trigger]', select) as HTMLElement;
        const searchInput = DOMUtils.querySelector('[data-select-search]', select) as HTMLInputElement;

        if (dropdown) {
            dropdown.classList.add('hidden');
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            const arrow = DOMUtils.querySelector('.select-arrow', trigger);
            if (arrow) {
                arrow.classList.remove('rotate-180');
            }
        }

        if (searchInput) {
            searchInput.value = '';
        }

        this.handleSearch(select, '');

        this.dispatchSelectEvent(select, 'select:close');
    }

    /**
     * Close all open dropdowns
     */
    private closeAllDropdowns(): void {
        this.getAllStates().forEach((state, select) => {
            if (state.isOpen) {
                this.closeDropdown(select);
            }
        });
    }

    /**
     * Handle option selection
     */
    private selectOption(select: HTMLElement, option: HTMLElement): void {
        const state = this.getState(select);
        const optionValue = option.dataset.value;

        if (!state || !optionValue || option.getAttribute('aria-disabled') === 'true') {
            return;
        }

        const isMultiple = select.dataset.multiple === 'true';

        if (isMultiple) {
            const index = state.selectedValues.indexOf(optionValue);
            if (index > -1) {
                state.selectedValues.splice(index, 1);
            } else {
                state.selectedValues.push(optionValue);
            }
        } else {
            state.selectedValues = [optionValue];
            this.closeDropdown(select);
        }

        this.setState(select, state);
        this.updateDisplay(select);
        this.updateHiddenInputs(select);
        this.updateOptionsSelectedState(select);

        this.dispatchSelectEvent(select, 'select:change', {
            value: isMultiple ? state.selectedValues : optionValue,
            selectedValues: state.selectedValues
        });
    }

    /**
     * Remove chip (for multiple selection)
     */
    private removeChip(select: HTMLElement, value: string): void {
        const state = this.getState(select);
        if (!state) return;

        const index = state.selectedValues.indexOf(value);
        if (index > -1) {
            state.selectedValues.splice(index, 1);
            this.setState(select, state);
            this.updateDisplay(select);
            this.updateHiddenInputs(select);
            this.updateOptionsSelectedState(select);

            this.dispatchSelectEvent(select, 'select:change', {
                value: state.selectedValues,
                selectedValues: state.selectedValues
            });
        }
    }


    /**
     * Clear all selections
     */
    private clearSelection(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        state.selectedValues = [];
        this.setState(select, state);
        this.updateDisplay(select);
        this.updateHiddenInputs(select);
        this.updateOptionsSelectedState(select);

        this.dispatchSelectEvent(select, 'select:change', {
            value: select.dataset.multiple === 'true' ? [] : '',
            selectedValues: []
        });
    }

    /**
     * Handle search functionality
     */
    private handleSearch(select: HTMLElement, searchTerm: string): void {
        const state = this.getState(select);
        if (!state) return;

        state.searchTerm = searchTerm.toLowerCase();
        this.setState(select, state);

        this.updateFilteredOptions(select);
        this.updateOptionsVisibility(select);
    }

    /**
     * Update filtered options based on search term
     */
    private updateFilteredOptions(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const allOptions = this.getAllOptions(select);

        if (!state.searchTerm) {
            state.filteredOptions = allOptions;
        } else {
            state.filteredOptions = allOptions.filter(option =>
                option.searchableText.includes(state.searchTerm)
            );
        }

        this.setState(select, state);
    }

    /**
     * Update options visibility based on filter
     */
    private updateOptionsVisibility(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const allOptionElements = DOMUtils.querySelectorAll('[data-select-option]', select);
        const noResultsElement = DOMUtils.querySelector('[data-select-no-results]', select) as HTMLElement;

        let visibleCount = 0;

        allOptionElements.forEach(optionElement => {
            const option = optionElement as HTMLElement;
            const value = option.dataset.value || '';
            const isVisible = state.filteredOptions.some(fo => fo.value === value);

            if (isVisible) {
                option.style.display = '';
                visibleCount++;
            } else {
                option.style.display = 'none';
            }
        });

        if (noResultsElement) {
            if (visibleCount === 0 && state.searchTerm) {
                noResultsElement.classList.remove('hidden');
            } else {
                noResultsElement.classList.add('hidden');
            }
        }
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeydown(select: HTMLElement, event: KeyboardEvent): void {
        const state = this.getState(select);
        if (!state) return;

        switch (event.key) {
            case 'Enter':
            case ' ':
                if (!state.isOpen) {
                    event.preventDefault();
                    this.openDropdown(select);
                } else if (state.focusedIndex >= 0) {
                    event.preventDefault();
                    const focusedOption = state.filteredOptions[state.focusedIndex];
                    if (focusedOption) {
                        this.selectOption(select, focusedOption.element);
                    }
                }
                break;

            case 'Escape':
                if (state.isOpen) {
                    event.preventDefault();
                    this.closeDropdown(select);
                    const trigger = DOMUtils.querySelector('[data-select-trigger]', select) as HTMLElement;
                    if (trigger) trigger.focus();
                }
                break;

            case 'ArrowDown':
                if (!state.isOpen) {
                    event.preventDefault();
                    this.openDropdown(select);
                } else {
                    event.preventDefault();
                    this.navigateOptions(select, 1);
                }
                break;

            case 'ArrowUp':
                if (state.isOpen) {
                    event.preventDefault();
                    this.navigateOptions(select, -1);
                }
                break;

            case 'Tab':
                if (state.isOpen) {
                    this.closeDropdown(select);
                }
                break;
        }
    }

    /**
     * Navigate through options with arrow keys
     */
    private navigateOptions(select: HTMLElement, direction: number): void {
        const state = this.getState(select);
        if (!state || !state.isOpen) return;

        const optionCount = state.filteredOptions.length;
        if (optionCount === 0) return;

        if (state.focusedIndex === -1) {
            state.focusedIndex = direction > 0 ? 0 : optionCount - 1;
        } else {
            state.focusedIndex += direction;
            if (state.focusedIndex >= optionCount) {
                state.focusedIndex = 0;
            } else if (state.focusedIndex < 0) {
                state.focusedIndex = optionCount - 1;
            }
        }

        this.setState(select, state);
        this.updateOptionFocus(select);
    }

    /**
     * Update visual focus state of options
     */
    private updateOptionFocus(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const allOptions = DOMUtils.querySelectorAll('[data-select-option]', select);
        allOptions.forEach((option, index) => {
            const element = option as HTMLElement;
            if (index === state.focusedIndex) {
                element.classList.add('bg-neutral-100', 'dark:bg-neutral-800');
                element.scrollIntoView({ block: 'nearest' });
            } else {
                element.classList.remove('bg-neutral-100', 'dark:bg-neutral-800');
            }
        });
    }

    /**
     * Update display of selected values
     */
    private updateDisplay(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const isMultiple = select.dataset.multiple === 'true';

        if (isMultiple) {
            this.updateChipsDisplay(select);
        } else {
            this.updateSingleValueDisplay(select);
        }
    }

    /**
     * Update chips display for multiple selection using Badge components
     */
    private updateChipsDisplay(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const chipsContainer = DOMUtils.querySelector('[data-select-chips]', select) as HTMLElement;
        if (!chipsContainer) return;

        chipsContainer.innerHTML = '';

        if (state.selectedValues.length === 0) {
            const placeholderText = select.dataset.placeholder || 'Select options...';
            chipsContainer.innerHTML = `<span class="text-neutral-500 select-placeholder">${placeholderText}</span>`;
        } else {
            state.selectedValues.forEach(value => {
                const option = this.findOptionByValue(select, value);
                const label = option ? option.displayLabel : value;
                const isClearable = select.dataset.clearable === 'true' && !this.isDisabled(select);
                const chipId = `select-chip-${this.generateChipId(value)}`;

                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'inline-flex items-center gap-1 font-medium cursor-pointer transition-colors px-1.5 py-0.5 text-xs rounded-sm';
                chip.style.cssText = `
                    background-color: var(--color-brand-50);
                    color: var(--color-brand-700);
                    border: 1px solid var(--color-brand-200);
                `;
                chip.setAttribute('data-chip-value', value);
                chip.setAttribute('data-remove-chip', value);
                chip.setAttribute('data-dismiss-target', `#${chipId}`);
                chip.setAttribute('aria-label', 'Remove badge');
                chip.id = chipId;

                chip.addEventListener('mouseenter', () => {
                    chip.style.backgroundColor = 'var(--color-brand-100)';
                });
                chip.addEventListener('mouseleave', () => {
                    chip.style.backgroundColor = 'var(--color-brand-50)';
                });

                const chipContent = document.createElement('span');
                chipContent.textContent = label;
                chip.appendChild(chipContent);

                if (isClearable) {
                    const dismissText = document.createElement('span');
                    dismissText.className = 'text-brand-600 hover:text-brand-700 ml-1 flex-shrink-0 font-bold leading-none';
                    dismissText.textContent = '×';
                    dismissText.setAttribute('aria-hidden', 'true');

                    chip.appendChild(dismissText);

                    const srText = document.createElement('span');
                    srText.className = 'sr-only';
                    srText.textContent = 'Remove badge';
                    chip.appendChild(srText);
                }

                chipsContainer.appendChild(chip);
            });
        }
    }


    /**
     * Update single value display
     */
    private updateSingleValueDisplay(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const valueDisplay = DOMUtils.querySelector('.select-value', select) as HTMLElement;
        if (!valueDisplay) return;

        if (state.selectedValues.length === 0) {
            const placeholderText = select.dataset.placeholder || 'Select option...';
            valueDisplay.innerHTML = `<span class="text-neutral-500 select-placeholder">${placeholderText}</span>`;
        } else {
            const selectedValue = state.selectedValues[0];
            const option = this.findOptionByValue(select, selectedValue);
            const label = option ? option.displayLabel : selectedValue;
            valueDisplay.textContent = label;
        }
    }

    /**
     * Update hidden form inputs
     */
    private updateHiddenInputs(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const isMultiple = select.dataset.multiple === 'true';
        const name = select.dataset.name;
        if (!name) return;

        const existingInputs = DOMUtils.querySelectorAll('.select-hidden-input', select);
        existingInputs.forEach(input => input.remove());

        if (isMultiple) {
            state.selectedValues.forEach(value => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = `${name}[]`;
                input.value = value;
                input.className = 'select-hidden-input';
                select.appendChild(input);
            });
        } else {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = state.selectedValues[0] || '';
            input.className = 'select-hidden-input';
            select.appendChild(input);
        }
    }

    /**
     * Update options selected state attributes
     */
    private updateOptionsSelectedState(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const allOptions = DOMUtils.querySelectorAll('[data-select-option]', select);
        allOptions.forEach(optionElement => {
            const option = optionElement as HTMLElement;
            const value = option.dataset.value || '';
            const isSelected = state.selectedValues.includes(value);

            option.setAttribute('aria-selected', isSelected ? 'true' : 'false');

            if (isSelected) {
                option.classList.add('bg-brand-50', 'text-brand-700', 'dark:bg-brand-900/20', 'dark:text-brand-300');
                const checkmark = DOMUtils.querySelector('.text-brand-600', option);
                if (checkmark) {
                    checkmark.parentElement?.classList.remove('opacity-0');
                    checkmark.parentElement?.classList.add('opacity-100');
                }
            } else {
                option.classList.remove('bg-brand-50', 'text-brand-700', 'dark:bg-brand-900/20', 'dark:text-brand-300');
                const checkmark = DOMUtils.querySelector('.text-brand-600', option);
                if (checkmark) {
                    checkmark.parentElement?.classList.add('opacity-0');
                    checkmark.parentElement?.classList.remove('opacity-100');
                }
            }
        });
    }

    /**
     * Update options list
     */
    private updateOptions(select: HTMLElement): void {
        const allOptions = this.getAllOptions(select);
        const state = this.getState(select);
        if (state) {
            state.filteredOptions = allOptions;
            this.setState(select, state);
        }
    }

    /**
     * Get all options from select element
     */
    private getAllOptions(select: HTMLElement): SelectOption[] {
        const optionElements = DOMUtils.querySelectorAll('[data-select-option]', select);
        return Array.from(optionElements).map(element => {
            const optionEl = element as HTMLElement;

            const displayLabel = optionEl.dataset.displayLabel || optionEl.textContent?.trim() || '';

            return {
                element: optionEl,
                value: optionEl.dataset.value || '',
                label: optionEl.textContent?.trim() || '',
                displayLabel: displayLabel,
                searchableText: optionEl.dataset.searchableText || '',
                disabled: optionEl.getAttribute('aria-disabled') === 'true'
            };
        });
    }

    /**
     * Find option by value
     */
    private findOptionByValue(select: HTMLElement, value: string): SelectOption | null {
        const allOptions = this.getAllOptions(select);
        return allOptions.find(option => option.value === value) || null;
    }

    /**
     * Position dropdown relative to trigger
     */
    private positionDropdown(select: HTMLElement): void {
        const dropdown = DOMUtils.querySelector('[data-select-dropdown]', select) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-select-trigger]', select) as HTMLElement;

        if (!dropdown || !trigger) return;

        const rect = trigger.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = dropdownRect.height || 240;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
            dropdown.style.bottom = '100%';
            dropdown.style.top = 'auto';
            dropdown.style.marginBottom = '4px';
            dropdown.style.marginTop = '0';
        } else {
            dropdown.style.top = '100%';
            dropdown.style.bottom = 'auto';
            dropdown.style.marginTop = '4px';
            dropdown.style.marginBottom = '0';
        }
    }

    /**
     * Reposition all open dropdowns
     */
    private repositionDropdowns(): void {
        this.getAllStates().forEach((state, select) => {
            if (state.isOpen) {
                this.positionDropdown(select);
            }
        });
    }

    /**
     * Check if select is disabled
     */
    private isDisabled(select: HTMLElement): boolean {
        return select.dataset.disabled === 'true';
    }

    /**
     * Check if dropdown is open
     */
    private isOpen(select: HTMLElement): boolean {
        const state = this.getState(select);
        return state ? state.isOpen : false;
    }

    /**
     * Generate unique chip ID for a value
     */
    private generateChipId(value: string): string {
        return btoa(value).replace(/[^a-zA-Z0-9]/g, '').substring(0, 8) + Date.now().toString(36);
    }


    /**
     * Dispatch custom select event
     */
    private dispatchSelectEvent(select: HTMLElement, eventName: string, detail: any = null): void {
        EventUtils.dispatchCustomEvent(select, eventName, {
            select,
            ...detail
        }, {
            bubbles: true
        });
    }

    /**
     * Get select state (for external access)
     */
    public getSelectState(select: HTMLElement): SelectState | null {
        return this.getState(select) || null;
    }

    /**
     * Set selected values programmatically
     */
    public setSelectedValues(select: HTMLElement, values: string[]): void {
        const state = this.getState(select);
        if (!state) return;

        const isMultiple = select.dataset.multiple === 'true';
        state.selectedValues = isMultiple ? values : values.slice(0, 1);

        this.setState(select, state);
        this.updateDisplay(select);
        this.updateHiddenInputs(select);
        this.updateOptionsSelectedState(select);

        this.dispatchSelectEvent(select, 'select:change', {
            value: isMultiple ? state.selectedValues : state.selectedValues[0] || '',
            selectedValues: state.selectedValues
        });
    }

    /**
     * Clean up SelectActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // SelectActions doesn't have additional cleanup beyond base class
        // Event listeners and observers are automatically cleaned up
    }
}

export default SelectActions.getInstance();
