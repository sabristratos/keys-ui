/**
 * SelectActions - Simplified select functionality using HTML Popover API
 *
 * Provides functionality for:
 * - Search/filter options
 * - Single and multiple selection
 * - Chip creation and removal for multiselect
 * - Form integration and Livewire support
 *
 * Uses native HTML Popover API for positioning and focus management
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';

interface SelectOption {
    element: HTMLElement;
    value: string;
    label: string;
    displayLabel: string;
    searchableText: string;
    disabled: boolean;
    htmlContent: string;
}

interface SelectState {
    selectedValues: string[];
    searchTerm: string;
    filteredOptions: SelectOption[];
}


/**
 * LivewireIntegration - Handles Livewire-specific functionality for Select components
 */
class LivewireIntegration {
    static isLivewireAvailable(): boolean {
        return typeof window !== 'undefined' && 'Livewire' in window;
    }

    static isLivewireEnabled(select: HTMLElement): boolean {
        return select.dataset.livewireEnabled === 'true' ||
               select.dataset.livewireMode === 'true' ||
               !!select.dataset.wireModel;
    }

    static getLivewireComponent(select: HTMLElement): any {
        if (!this.isLivewireAvailable()) return null;

        const livewireElement = select.closest('[wire\\:id]');
        if (!livewireElement) return null;

        return (window as any).Livewire.find(livewireElement.getAttribute('wire:id'));
    }

    static getWireModelProperty(select: HTMLElement): string | null {
        return select.dataset.wireModel || select.dataset.livewireProperty || null;
    }

    static updateLivewireProperty(select: HTMLElement, value: any): void {
        const component = this.getLivewireComponent(select);
        const property = this.getWireModelProperty(select);

        if (!component || !property) return;

        try {
            component.set(property, value);
        } catch (error) {
            console.warn('Failed to update Livewire property:', property, error);
        }
    }

    static formatValueForLivewire(value: string[], isMultiple: boolean): any {
        if (isMultiple) {
            return Array.isArray(value) ? value : [];
        } else {
            return Array.isArray(value) ? (value[0] || '') : (value || '');
        }
    }
}

export class SelectActions extends BaseActionClass<SelectState> {

    protected initializeElements(): void {
        const selectElements = DOMUtils.findByDataAttribute('select', 'true');

        selectElements.forEach((select, index) => {
            this.initializeSelect(select);
        });
    }

    private initializeSelect(selectElement: HTMLElement): void {
        const isMultiple = selectElement.dataset.multiple === 'true';
        const selectedValues = this.readInitialValues(selectElement, isMultiple);

        const state: SelectState = {
            selectedValues,
            searchTerm: '',
            filteredOptions: []
        };

        this.setState(selectElement, state);
        this.updateOptions(selectElement);
        this.updateOptionsSelectedState(selectElement);
        this.updateDisplay(selectElement);
        this.updateStableInputs(selectElement);
    }

    private readInitialValues(selectElement: HTMLElement, isMultiple: boolean): string[] {
        if (LivewireIntegration.isLivewireEnabled(selectElement)) {
            return [];
        }

        // First, try to read from selected option elements (server-side rendering)
        const allOptions = this.getAllOptions(selectElement);
        const selectedOptions = allOptions.filter(opt =>
            opt.element.hasAttribute('selected') ||
            opt.element.dataset.selected === 'true'
        );

        if (selectedOptions.length > 0) {
            return selectedOptions.map(opt => opt.value);
        }

        // Fall back to reading from hidden inputs (client-side state)
        if (isMultiple) {
            const poolInputs = DOMUtils.querySelectorAll('.select-pool-input', selectElement) as unknown as NodeListOf<HTMLInputElement>;
            const values: string[] = [];

            poolInputs.forEach(input => {
                if (input.dataset.poolActive === 'true' && input.value) {
                    values.push(input.value);
                }
            });

            return values;
        } else {
            const singleInput = DOMUtils.querySelector('.select-single-input', selectElement) as HTMLInputElement;
            return singleInput && singleInput.value ? [singleInput.value] : [];
        }
    }

    protected bindEventListeners(): void {
        EventUtils.handleDelegatedEvent('click', '[data-chip-remove]', (element, event) => {
            event.preventDefault();
            event.stopPropagation();
            const chipValue = element.dataset.chipValue;
            const select = DOMUtils.findClosest(element, '[data-select="true"]');
            if (select && chipValue) {
                this.removeChip(select, chipValue);
            }
        });

        EventUtils.handleDelegatedEvent('click', '[data-select-clear]', (element, event) => {
            event.preventDefault();
            event.stopPropagation();
            const select = DOMUtils.findClosest(element, '[data-select="true"]');
            if (select) {
                this.clearSelection(select);
            }
        });

        EventUtils.handleDelegatedEvent('click', '[data-select-option]', (element, event) => {
            event.preventDefault();
            const select = DOMUtils.findClosest(element, '[data-select="true"]');
            if (select) {
                this.selectOption(select, element);
            }
        });

        EventUtils.handleDelegatedEvent('input', 'input[data-select-search]', (searchInput, event) => {
            const select = DOMUtils.findClosest(searchInput, '[data-select="true"]');
            if (select && select.dataset.searchable === 'true') {
                this.handleSearch(select, (searchInput as HTMLInputElement).value);
            }
        });

        EventUtils.addEventListener(document, 'toggle', (event) => {
            const popover = event.target as HTMLElement;
            if (popover.dataset.keysPopover === 'true' && popover.id.startsWith('select-dropdown-')) {
                const popoverEvent = event as any;
                const selectId = popover.id.replace('select-dropdown-', '');
                const select = DOMUtils.querySelector(`[data-select="true"] button[id="${selectId}"]`)?.closest('[data-select="true"]') as HTMLElement;

                if (popoverEvent.newState === 'open') {
                    this.handlePopoverOpened(popover, select);
                } else if (popoverEvent.newState === 'closed') {
                    this.handlePopoverClosed(popover, select);
                }
            }
        });
    }

    private handlePopoverOpened(popover: HTMLElement, select: HTMLElement | null): void {
        if (!select) return;

        if (select.dataset.searchable === 'true') {
            const searchInput = DOMUtils.querySelector('input[data-select-search]', popover) as HTMLInputElement;
            if (searchInput) {
                setTimeout(() => {
                    searchInput.focus();
                }, 0);
            }
        }

    }

    private handlePopoverClosed(popover: HTMLElement, select: HTMLElement | null): void {
        if (select) {
            const searchInput = DOMUtils.querySelector('input[data-select-search]', popover) as HTMLInputElement;
            if (searchInput) {
                searchInput.value = '';
                this.handleSearch(select, '');
            }
        }

    }

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
            const popover = DOMUtils.querySelector(`#select-dropdown-${select.querySelector('button')?.id}`) as HTMLElement;
            if (popover && popover.hidePopover) {
                popover.hidePopover();
            }
        }

        this.setState(select, state);
        this.updateDisplay(select);
        this.updateStableInputs(select);
        this.updateOptionsSelectedState(select);

        if (LivewireIntegration.isLivewireEnabled(select)) {
            this.syncToLivewire(select);
        }
    }

    private removeChip(select: HTMLElement, value: string): void {
        const state = this.getState(select);
        if (!state) return;

        const index = state.selectedValues.indexOf(value);
        if (index > -1) {
            state.selectedValues.splice(index, 1);
            this.setState(select, state);

            this.updateDisplay(select);
            this.updateStableInputs(select);
            this.updateOptionsSelectedState(select);

            if (LivewireIntegration.isLivewireEnabled(select)) {
                this.syncToLivewire(select);
            }
        }
    }

    private clearSelection(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        state.selectedValues = [];
        this.setState(select, state);
        this.updateDisplay(select);
        this.updateStableInputs(select);
        this.updateOptionsSelectedState(select);

        if (LivewireIntegration.isLivewireEnabled(select)) {
            this.syncToLivewire(select);
        }
    }

    private handleSearch(select: HTMLElement, searchTerm: string): void {
        const state = this.getState(select);
        if (!state) {
            return;
        }

        state.searchTerm = searchTerm.trim().toLowerCase();
        this.setState(select, state);

        this.updateFilteredOptions(select);
        this.updateOptionsVisibility(select);
    }

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

    private updateDisplay(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const isMultiple = select.dataset.multiple === 'true';

        if (isMultiple) {
            this.updateChipsDisplay(select);
        } else {
            this.updateSingleValueDisplay(select);
        }

        this.updateClearButtonVisibility(select);
    }

    private updateClearButtonVisibility(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const clearButtonWrapper = DOMUtils.querySelector('[data-select-clear]', select) as HTMLElement;
        if (!clearButtonWrapper) return;

        const hasSelections = state.selectedValues.length > 0;
        const isDisabled = select.dataset.disabled === 'true';
        const isClearable = select.dataset.clearable === 'true';

        if (hasSelections && !isDisabled && isClearable) {
            clearButtonWrapper.classList.remove('opacity-0', 'pointer-events-none');
            clearButtonWrapper.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            clearButtonWrapper.classList.remove('opacity-100', 'pointer-events-auto');
            clearButtonWrapper.classList.add('opacity-0', 'pointer-events-none');
        }
    }

    private updateChipsDisplay(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const chipsContainer = DOMUtils.querySelector('[data-select-chips]', select) as HTMLElement;
        if (!chipsContainer) return;

        const existingChips = DOMUtils.querySelectorAll('[data-select-chip="true"]', chipsContainer);
        const placeholder = DOMUtils.querySelector('[data-select-placeholder]', select);
        const spacer = DOMUtils.querySelector('[data-select-spacer]', select);

        if (state.selectedValues.length === 0) {
            existingChips.forEach(chip => chip.remove());

            if (placeholder) {
                (placeholder as HTMLElement).classList.remove('hidden');
            }
            if (spacer) {
                (spacer as HTMLElement).classList.add('hidden');
            }
        } else {
            if (placeholder) {
                (placeholder as HTMLElement).classList.add('hidden');
            }
            if (spacer) {
                (spacer as HTMLElement).classList.remove('hidden');
            }

            const currentChipValues = Array.from(existingChips).map(chip =>
                (chip as HTMLElement).dataset.chipValue
            ).filter(value => value);

            existingChips.forEach(chip => {
                const chipValue = (chip as HTMLElement).dataset.chipValue;
                if (chipValue && !state.selectedValues.includes(chipValue)) {
                    chip.remove();
                }
            });

            state.selectedValues.forEach(value => {
                if (!currentChipValues.includes(value)) {
                    this.createChipElement(select, chipsContainer, value);
                }
            });
        }
    }

    private createChipElement(select: HTMLElement, container: HTMLElement, value: string): void {
        this.createChipElementFallback(select, container, value);
    }

    private createChipElementFallback(select: HTMLElement, container: HTMLElement, value: string): void {
        const option = this.findOptionByValue(select, value);
        const displayLabel = option ? option.displayLabel : value;
        const richContent = option ? option.htmlContent : displayLabel;

        const chip = document.createElement('span');
        chip.className = 'inline-flex items-center font-medium px-2 py-0.5 text-xs rounded-full bg-elevation-1 text-primary border border-line gap-1.5';
        chip.setAttribute('data-select-chip', 'true');
        chip.setAttribute('data-chip-value', value);

        chip.innerHTML = `
            <span class="chip-content inline-flex items-center gap-1.5">${richContent}</span>
            <button type="button" class="w-4 h-4 flex items-center justify-center rounded-full hover:bg-hover transition-colors focus:outline-none focus:ring-1 focus:ring-line ml-0.5" data-chip-remove data-chip-value="${value}">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="sr-only">Remove ${displayLabel}</span>
            </button>
        `;

        container.appendChild(chip);
    }

    private updateSingleValueDisplay(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const valueDisplay = DOMUtils.querySelector('.select-value', select) as HTMLElement;
        if (!valueDisplay) return;

        if (state.selectedValues.length === 0) {
            const placeholderText = select.dataset.placeholder || 'Select option...';
            valueDisplay.innerHTML = `<span class="text-muted select-placeholder">${placeholderText}</span>`;
        } else {
            const selectedValue = state.selectedValues[0];
            const option = this.findOptionByValue(select, selectedValue);
            const richContent = option ? option.htmlContent : selectedValue;
            valueDisplay.innerHTML = richContent;
        }
    }

    private updateStableInputs(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const isMultiple = select.dataset.multiple === 'true';
        const isLivewireEnabled = LivewireIntegration.isLivewireEnabled(select);

        if (isLivewireEnabled) {
            this.syncToLivewire(select);
        } else {
            if (isMultiple) {
                this.updateMultipleInputPool(select, state.selectedValues);
            } else {
                this.updateSingleInput(select, state.selectedValues[0] || '');
            }
        }
    }

    private updateSingleInput(select: HTMLElement, value: string): void {
        const singleInput = DOMUtils.querySelector('.select-single-input', select) as HTMLInputElement;
        if (!singleInput) return;

        if (singleInput.value !== value) {
            singleInput.value = value;
            singleInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    private updateMultipleInputPool(select: HTMLElement, selectedValues: string[]): void {
        const poolInputs = DOMUtils.querySelectorAll('.select-pool-input', select) as unknown as NodeListOf<HTMLInputElement>;

        poolInputs.forEach((input, index) => {
            const isActive = index < selectedValues.length;
            const newValue = isActive ? selectedValues[index] : '';

            if (input.value !== newValue) {
                input.value = newValue;
            }

            input.dataset.poolActive = isActive ? 'true' : 'false';
            input.style.display = isActive ? '' : 'none';
        });

        const firstActiveInput = poolInputs[0];
        if (firstActiveInput) {
            firstActiveInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    private updateOptionsSelectedState(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const allOptions = DOMUtils.querySelectorAll('[data-select-option]', select);
        allOptions.forEach(optionElement => {
            const option = optionElement as HTMLElement;
            const value = option.dataset.value || '';
            const isSelected = state.selectedValues.includes(value);

            option.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
    }

    private updateOptions(select: HTMLElement): void {
        const allOptions = this.getAllOptions(select);
        const state = this.getState(select);
        if (state) {
            state.filteredOptions = allOptions;
            this.setState(select, state);
        }
    }

    private getAllOptions(select: HTMLElement): SelectOption[] {
        const optionElements = DOMUtils.querySelectorAll('[data-select-option]', select);
        return Array.from(optionElements).map(element => {
            const optionEl = element as HTMLElement;
            const displayLabel = optionEl.dataset.displayLabel || optionEl.textContent?.trim() || '';

            const contentClone = optionEl.cloneNode(true) as HTMLElement;
            const checkmark = contentClone.querySelector('.flex-shrink-0.ml-2');
            if (checkmark) {
                checkmark.remove();
            }
            const htmlContent = contentClone.innerHTML.trim();

            return {
                element: optionEl,
                value: optionEl.dataset.value || '',
                label: optionEl.textContent?.trim() || '',
                displayLabel: displayLabel,
                searchableText: optionEl.dataset.searchableText || displayLabel.toLowerCase(),
                disabled: optionEl.getAttribute('aria-disabled') === 'true',
                htmlContent: htmlContent
            };
        });
    }

    private findOptionByValue(select: HTMLElement, value: string): SelectOption | null {
        const allOptions = this.getAllOptions(select);
        return allOptions.find(option => option.value === value) || null;
    }

    private syncToLivewire(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state || !LivewireIntegration.isLivewireEnabled(select)) return;

        const isMultiple = select.dataset.multiple === 'true';
        const formattedValue = LivewireIntegration.formatValueForLivewire(state.selectedValues, isMultiple);

        LivewireIntegration.updateLivewireProperty(select, formattedValue);
    }

    public setSelectedValues(select: HTMLElement, values: string[]): void {
        const state = this.getState(select);
        if (!state) return;

        const isMultiple = select.dataset.multiple === 'true';
        state.selectedValues = isMultiple ? values : values.slice(0, 1);

        this.setState(select, state);
        this.updateDisplay(select);
        this.updateStableInputs(select);
        this.updateOptionsSelectedState(select);
    }

    public getSelectValue(select: HTMLElement): string | string[] | null {
        const state = this.getState(select);
        if (!state) return null;

        const isMultiple = select.dataset.multiple === 'true';
        return isMultiple ? state.selectedValues : (state.selectedValues[0] || null);
    }
}

export default SelectActions.getInstance();