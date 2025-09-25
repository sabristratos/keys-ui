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
import { FloatingManager, FloatingInstance } from './utils/FloatingManager';

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
    floating?: FloatingInstance;
    searchTimeout?: number;
    livewireComponent?: any;
    livewireProperty?: string;
    entangledProperty?: any;
}

/**
 * LivewireIntegration - Handles Livewire-specific functionality for Select components
 */
class LivewireIntegration {

    /**
     * Check if Livewire is available globally
     */
    static isLivewireAvailable(): boolean {
        return typeof window !== 'undefined' && 'Livewire' in window;
    }

    /**
     * Detect if a select element is Livewire-enabled
     */
    static isLivewireEnabled(select: HTMLElement): boolean {
        return select.dataset.livewireEnabled === 'true' ||
               select.dataset.livewireMode === 'true' ||
               !!select.dataset.wireModel;
    }

    /**
     * Get the Livewire component for a select element
     */
    static getLivewireComponent(select: HTMLElement): any {
        if (!this.isLivewireAvailable()) return null;

        const livewireElement = select.closest('[wire\\:id]');
        if (!livewireElement) return null;

        return (window as any).Livewire.find(livewireElement.getAttribute('wire:id'));
    }

    /**
     * Get the wire:model property name
     */
    static getWireModelProperty(select: HTMLElement): string | null {
        return select.dataset.wireModel || select.dataset.livewireProperty || null;
    }


    /**
     * Update Livewire property value
     */
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

    /**
     * Get current value from Livewire property
     */
    static getLivewirePropertyValue(select: HTMLElement): any {
        const component = this.getLivewireComponent(select);
        const property = this.getWireModelProperty(select);

        if (!component || !property) return null;

        try {
            return component.get(property);
        } catch (error) {
            console.warn('Failed to get Livewire property value:', property, error);
            return null;
        }
    }

    /**
     * Setup Livewire event listeners
     */
    static setupEventListeners(select: HTMLElement, callback: (data: any) => void): void {
        if (!this.isLivewireAvailable()) return;

        const livewireElement = select.closest('[wire\\:id]');
        if (!livewireElement) return;

        document.addEventListener('livewire:update', (event: any) => {
            if (event.detail.component.id === livewireElement.getAttribute('wire:id')) {
                callback({
                    type: 'livewire:update',
                    component: event.detail.component,
                    element: select
                });
            }
        });

        document.addEventListener('livewire:morph.updated', () => {
            callback({
                type: 'livewire:morph.updated',
                element: select
            });
        });
    }

    /**
     * Format value for Livewire (arrays vs strings)
     */
    static formatValueForLivewire(value: string[], isMultiple: boolean): any {
        if (isMultiple) {
            return Array.isArray(value) ? value : [];
        } else {
            return Array.isArray(value) ? (value[0] || '') : (value || '');
        }
    }

    /**
     * Parse value from Livewire property
     */
    static parseValueFromLivewire(value: any, isMultiple: boolean): string[] {
        if (isMultiple) {
            if (Array.isArray(value)) return value.map(v => String(v));
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    return Array.isArray(parsed) ? parsed.map(v => String(v)) : [];
                } catch {
                    return [];
                }
            }
            return [];
        } else {
            return value ? [String(value)] : [];
        }
    }
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
        const isLivewireEnabled = LivewireIntegration.isLivewireEnabled(selectElement);

        let selectedValues: string[] = [];

        if (isLivewireEnabled) {
            selectedValues = this.readLivewireInitialValues(selectElement, isMultiple);
        } else {
            selectedValues = this.readInitialValues(selectElement, isMultiple);
        }

        const state: SelectState = {
            isOpen: false,
            selectedValues,
            searchTerm: '',
            focusedIndex: -1,
            filteredOptions: []
        };

        if (isLivewireEnabled) {
            this.setupLivewireIntegration(selectElement, state);
        }

        this.setState(selectElement, state);
        this.updateOptions(selectElement);
        this.updateOptionsSelectedState(selectElement);
        this.updateDisplay(selectElement);
        this.updateStableInputs(selectElement);
    }

    /**
     * Read initial values from stable inputs
     */
    private readInitialValues(selectElement: HTMLElement, isMultiple: boolean): string[] {
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

    /**
     * Read initial values from Livewire property
     */
    private readLivewireInitialValues(selectElement: HTMLElement, isMultiple: boolean): string[] {
        const livewireValue = LivewireIntegration.getLivewirePropertyValue(selectElement);
        return LivewireIntegration.parseValueFromLivewire(livewireValue, isMultiple);
    }

    /**
     * Setup Livewire integration for a select element
     */
    private setupLivewireIntegration(selectElement: HTMLElement, state: SelectState): void {
        const propertyName = LivewireIntegration.getWireModelProperty(selectElement);
        if (!propertyName) return;

        state.livewireComponent = LivewireIntegration.getLivewireComponent(selectElement);
        state.livewireProperty = propertyName;

        LivewireIntegration.setupEventListeners(selectElement, (data) => {
            this.handleLivewireEvent(selectElement, data);
        });

        // Skip entanglement - wire:model handles data binding directly
    }

    /**
     * Handle Livewire events (update, morph, etc.)
     */
    private handleLivewireEvent(selectElement: HTMLElement, data: any): void {
        const state = this.getState(selectElement);
        if (!state) return;

        switch (data.type) {
            case 'livewire:update':
                this.syncFromLivewire(selectElement);
                break;
            case 'livewire:morph.updated':
                this.reinitializeAfterMorph(selectElement);
                break;
        }
    }

    /**
     * Synchronize state from Livewire to JavaScript
     */
    private syncFromLivewire(selectElement: HTMLElement): void {
        const state = this.getState(selectElement);
        if (!state || !state.livewireProperty) return;

        const isMultiple = selectElement.dataset.multiple === 'true';
        const livewireValue = LivewireIntegration.getLivewirePropertyValue(selectElement);
        const newSelectedValues = LivewireIntegration.parseValueFromLivewire(livewireValue, isMultiple);

        if (JSON.stringify(state.selectedValues) !== JSON.stringify(newSelectedValues)) {
            state.selectedValues = newSelectedValues;
            this.setState(selectElement, state);
            this.updateDisplay(selectElement);
            this.updateOptionsSelectedState(selectElement);
            this.updateStableInputs(selectElement);
        }
    }

    /**
     * Synchronize state from JavaScript to Livewire
     */
    private syncToLivewire(selectElement: HTMLElement): void {
        const state = this.getState(selectElement);
        if (!state || !LivewireIntegration.isLivewireEnabled(selectElement)) return;

        const isMultiple = selectElement.dataset.multiple === 'true';
        const formattedValue = LivewireIntegration.formatValueForLivewire(state.selectedValues, isMultiple);

        LivewireIntegration.updateLivewireProperty(selectElement, formattedValue);
    }

    /**
     * Reinitialize select after DOM morphing
     */
    private reinitializeAfterMorph(selectElement: HTMLElement): void {
        if (DOMUtils.findByDataAttribute('select', 'true').includes(selectElement)) {
            if (!this.hasState(selectElement)) {
                this.initializeSelect(selectElement);
            }
        }
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        EventUtils.handleDelegatedClick('[data-chip-remove]', (element, event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            const chipValue = element.dataset.chipValue;
            const select = DOMUtils.findClosest(element, '[data-select="true"]');
            if (select && chipValue) {
                this.removeChip(select, chipValue);
            }
        });

        EventUtils.handleDelegatedClick('[data-select-clear] button', (element, event) => {
            event.preventDefault();
            event.stopPropagation();
            const select = DOMUtils.findClosest(element, '[data-select="true"]');
            if (select) {
                this.clearSelection(select);
            }
        });

        EventUtils.handleDelegatedClick('[data-select-option]', (element, event) => {
            event.preventDefault();
            event.stopPropagation();
            const select = DOMUtils.findClosest(element, '[data-select="true"]');
            if (select) {
                this.selectOption(select, element);
            }
        });

        EventUtils.handleDelegatedClick('[data-select-trigger]', (element, event) => {
            // Check if the click originated from the clear button area
            const target = event.target as Element;
            const isClearButtonClick = target.closest('[data-select-clear]');

            if (isClearButtonClick) {
                return; // Don't toggle dropdown if clicking clear button
            }

            event.preventDefault();
            event.stopPropagation();
            const select = DOMUtils.findClosest(element, '[data-select="true"]');
            if (select && !this.isDisabled(select)) {
                this.toggleDropdown(select);
            }
        });

        EventUtils.addEventListener(document, 'click', (event) => {
            const target = event.target as Node;

            if (target && target instanceof Element) {
                const withinSelectElement = target.closest('[data-select="true"], [data-select-dropdown], [data-select-search], [data-chip-remove], [data-select-clear], [data-select-option], [data-select-trigger]');
                const isInputElement = target.matches('input, button') && target.closest('[data-select="true"]');

                if (withinSelectElement || isInputElement) {
                    return;
                }

                this.closeAllDropdowns();
            }
        });

        EventUtils.handleDelegatedInput('input[type="text"]', (searchInput, event) => {
            const select = DOMUtils.findClosest(searchInput, '[data-select="true"]');
            const isSearchable = select && select.dataset.searchable === 'true';
            const isInDropdown = searchInput.closest('[data-select-dropdown]');

            if (select && isSearchable && isInDropdown) {
                this.handleDebouncedSearch(select, searchInput.value);
            }
        });

        EventUtils.handleDelegatedKeydown('[data-select="true"]', (select, event) => {
            this.handleKeydown(select, event);
        });

        EventUtils.handleDelegatedFocus('[data-select="true"]', (select, event) => {
            if (!this.isOpen(select)) {
                //
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

                    if (DOMUtils.hasDataAttribute(element, 'select', 'true')) {
                        if (!this.hasState(element)) {
                            this.initializeSelect(element);
                        }
                    }

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

        select.setAttribute('data-dropdown-state', 'open');

        const dropdown = DOMUtils.querySelector('[data-select-dropdown]', select) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-select-trigger]', select) as HTMLElement;
        const searchInput = DOMUtils.querySelector('[data-select-search]', select) as HTMLInputElement;

        if (dropdown) {
            dropdown.classList.remove('hidden');
            this.setupFloating(select, dropdown);
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'true');
            const arrow = DOMUtils.querySelector('.select-arrow', trigger);
            if (arrow) {
                arrow.classList.add('rotate-180');
            }
        }

        if (searchInput && select.dataset.searchable === 'true') {
            setTimeout(() => searchInput.focus(), 10);
        }

        this.updateFilteredOptions(select);
        this.dispatchSelectEvent(select, 'select:open');
    }

    /**
     * Close dropdown
     */
    private closeDropdown(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state || !state.isOpen) {
            return;
        }

        this.cleanupFloating(select);

        state.isOpen = false;
        state.searchTerm = '';
        state.focusedIndex = -1;
        this.setState(select, state);

        select.setAttribute('data-dropdown-state', 'closed');

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
        this.updateStableInputs(select);
        this.updateOptionsSelectedState(select);

        if (LivewireIntegration.isLivewireEnabled(select)) {
            this.syncToLivewire(select);
        }

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

            const chipElement = DOMUtils.querySelector(`[data-chip-value="${value}"]`, select);
            if (chipElement) {
                (chipElement as HTMLElement).style.transition = 'all 200ms ease-out';
                (chipElement as HTMLElement).style.opacity = '0';
                (chipElement as HTMLElement).style.transform = 'scale(0.8)';

                setTimeout(() => {
                    if (chipElement.parentNode) {
                        chipElement.remove();
                    }
                }, 200);
            }

            this.updateDisplay(select);
            this.updateStableInputs(select);
            this.updateOptionsSelectedState(select);

            if (LivewireIntegration.isLivewireEnabled(select)) {
                this.syncToLivewire(select);
            }

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
        this.updateStableInputs(select);
        this.updateOptionsSelectedState(select);

        if (LivewireIntegration.isLivewireEnabled(select)) {
            this.syncToLivewire(select);
        }

        this.dispatchSelectEvent(select, 'select:change', {
            value: select.dataset.multiple === 'true' ? [] : '',
            selectedValues: []
        });
    }

    /**
     * Handle debounced search functionality
     */
    private handleDebouncedSearch(select: HTMLElement, searchTerm: string): void {
        const state = this.getState(select);
        if (!state) return;

        if (state.searchTimeout) {
            clearTimeout(state.searchTimeout);
        }

        state.searchTimeout = window.setTimeout(() => {
            this.handleSearch(select, searchTerm);
        }, 150) as number;

        this.setState(select, state);
    }

    /**
     * Handle search functionality
     */
    private handleSearch(select: HTMLElement, searchTerm: string): void {
        const state = this.getState(select);
        if (!state) return;

        state.searchTerm = searchTerm.toLowerCase();
        this.setState(select, state);

        select.setAttribute('data-search-active', state.searchTerm ? 'true' : 'false');
        select.setAttribute('data-search-term', state.searchTerm);

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

        select.setAttribute('data-visible-options', visibleCount.toString());
        select.setAttribute('data-has-results', visibleCount > 0 ? 'true' : 'false');
        select.setAttribute('data-show-no-results', (visibleCount === 0 && state.searchTerm) ? 'true' : 'false');
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

        this.updateClearButtonVisibility(select);
    }

    /**
     * Update clear button visibility based on selection state
     */
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

    /**
     * Update chips display for multiple selection - creates/removes chips dynamically
     */
    private updateChipsDisplay(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        const chipsContainer = DOMUtils.querySelector('[data-select-chips]', select) as HTMLElement;
        if (!chipsContainer) return;

        const existingChips = DOMUtils.querySelectorAll('[data-select-chip="true"]', chipsContainer);
        const placeholder = DOMUtils.querySelector('[data-select-placeholder]', chipsContainer);

        if (state.selectedValues.length === 0) {
            existingChips.forEach(chip => chip.remove());

            if (placeholder) {
                (placeholder as HTMLElement).style.display = 'inline';
            } else {
                const placeholderText = select.dataset.placeholder || 'Select options...';
                const placeholderElement = document.createElement('span');
                placeholderElement.className = 'text-neutral-500 select-placeholder';
                placeholderElement.setAttribute('data-select-placeholder', 'true');
                placeholderElement.textContent = placeholderText;
                chipsContainer.appendChild(placeholderElement);
            }
        } else {
            if (placeholder) {
                (placeholder as HTMLElement).style.display = 'none';
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

    /**
     * Create a new chip element for a selected value
     */
    private createChipElement(select: HTMLElement, container: HTMLElement, value: string): void {
        const selectId = select.dataset.name || select.id || 'select';
        const option = this.findOptionByValue(select, value);
        const displayLabel = option ? option.displayLabel : value;
        const clearable = select.dataset.clearable === 'true';
        const disabled = select.dataset.disabled === 'true';
        const dismissible = clearable && !disabled;

        // Create non-clickable chip container
        const chip = document.createElement('span');
        chip.className = 'inline-flex items-center font-medium px-2 py-0.5 text-xs rounded-sm bg-brand text-white';

        chip.setAttribute('data-select-chip', 'true');
        chip.setAttribute('data-chip-value', value);
        chip.setAttribute('data-variant', 'chip');
        chip.setAttribute('data-color', 'brand');
        chip.setAttribute('data-size', 'xs');
        chip.setAttribute('data-badge-id', `chip-${selectId}-${value}`);
        chip.id = `chip-${selectId}-${value}`;

        if (dismissible) {
            chip.innerHTML = `
                <span class="chip-label">${displayLabel}</span>
                <button type="button" class="ml-1.5 p-0.5 rounded hover:bg-white/20 transition-colors focus:outline-none focus:ring-1 focus:ring-white/30" data-chip-remove data-chip-value="${value}">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span class="sr-only">Remove ${displayLabel}</span>
                </button>
            `;
        } else {
            chip.innerHTML = `<span class="chip-label">${displayLabel}</span>`;
        }

        container.appendChild(chip);
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
     * Update stable inputs - with Livewire integration support
     */
    private updateStableInputs(select: HTMLElement, state?: SelectState, isMultiple?: boolean): void {
        const currentState = state || this.getState(select);
        if (!currentState) return;

        const multiple = isMultiple ?? (select.dataset.multiple === 'true');
        const isLivewireEnabled = LivewireIntegration.isLivewireEnabled(select);

        if (isLivewireEnabled) {
            // For Livewire: Let wire:model handle the data binding
            // Only sync to Livewire component for bidirectional updates
            this.syncToLivewire(select);
        } else {
            if (multiple) {
                this.updateMultipleInputPool(select, currentState.selectedValues);
            } else {
                this.updateSingleInput(select, currentState.selectedValues[0] || '');
            }
        }
    }


    /**
     * Update single input value (for single select)
     */
    private updateSingleInput(select: HTMLElement, value: string): void {
        const singleInput = DOMUtils.querySelector('.select-single-input', select) as HTMLInputElement;
        if (!singleInput) return;

        if (singleInput.value !== value) {
            singleInput.value = value;
            singleInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    /**
     * Update multiple input pool (for multiple select)
     */
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
        this.updateStableInputs(select);
        this.updateOptionsSelectedState(select);

        this.dispatchSelectEvent(select, 'select:change', {
            value: isMultiple ? state.selectedValues : state.selectedValues[0] || '',
            selectedValues: state.selectedValues
        });
    }

    /**
     * Set select value programmatically (external API)
     */
    public setSelectValue(select: HTMLElement, value: string | string[]): void {
        const values = Array.isArray(value) ? value : [value];
        this.setSelectedValues(select, values);
    }

    /**
     * Get current select value (external API)
     */
    public getSelectValue(select: HTMLElement): string | string[] | null {
        const state = this.getState(select);
        if (!state) return null;

        const isMultiple = select.dataset.multiple === 'true';
        return isMultiple ? state.selectedValues : (state.selectedValues[0] || null);
    }

    /**
     * Setup floating for dropdown using Floating UI
     */
    private setupFloating(select: HTMLElement, dropdown: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        this.cleanupFloating(select);

        const trigger = DOMUtils.querySelector('[data-select-trigger]', select) as HTMLElement;
        if (!trigger) return;

        const placement = select.dataset.floatingPlacement || 'bottom-start';
        const offset = parseInt(select.dataset.floatingOffset || '4', 10);

        const floating = FloatingManager.getInstance().createFloating(trigger, dropdown, {
            placement: placement as any,
            offset,
            flip: {
                fallbackStrategy: 'bestFit',
                padding: 8
            },
            shift: {
                padding: 8,
                crossAxis: true
            },
            size: {
                apply: ({ availableHeight }) => {
                    const optionsContainer = DOMUtils.querySelector('[data-select-options]', dropdown);
                    if (optionsContainer) {
                        Object.assign(optionsContainer.style, {
                            maxHeight: `${Math.min(availableHeight - 20, 320)}px`,
                            overflowY: 'auto'
                        });
                    }
                }
            },
            hide: {
                strategy: 'escaped'
            },
            autoUpdate: {
                ancestorScroll: true,
                ancestorResize: true,
                elementResize: true,
                layoutShift: true
            }
        });

        state.floating = floating;
        this.setState(select, state);
    }

    /**
     * Clean up floating for select
     */
    private cleanupFloating(select: HTMLElement): void {
        const state = this.getState(select);
        if (!state) return;

        if (state.floating) {
            state.floating.cleanup();
            state.floating = undefined;
        }

        this.setState(select, state);
    }

    /**
     * Clean up SelectActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        this.getAllStates().forEach((state, select) => {
            this.cleanupFloating(select);

            if (state.searchTimeout) {
                clearTimeout(state.searchTimeout);
            }
        });
    }
}

export default SelectActions.getInstance();