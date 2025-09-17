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

export class SelectActions {
    private static instance: SelectActions | null = null;
    private initialized = false;
    private selectStates = new Map<HTMLElement, SelectState>();

    /**
     * Get singleton instance
     */
    public static getInstance(): SelectActions {
        if (!SelectActions.instance) {
            SelectActions.instance = new SelectActions();
        }
        return SelectActions.instance;
    }

    /**
     * Initialize SelectActions for all select elements
     */
    public init(): void {
        if (this.initialized) {
            return;
        }

        this.bindEventListeners();
        this.initializeSelects();
        this.initialized = true;
        console.log('SelectActions initialized');
    }

    /**
     * Initialize all existing select elements
     */
    private initializeSelects(): void {
        document.querySelectorAll('[data-select="true"]').forEach(select => {
            this.initializeSelect(select as HTMLElement);
        });
    }

    /**
     * Initialize a single select element
     */
    private initializeSelect(selectElement: HTMLElement): void {
        const isMultiple = selectElement.dataset.multiple === 'true';
        const initialValue = selectElement.dataset.value;

        let selectedValues: string[] = [];

        // Parse initial value from data-value attribute
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

        this.selectStates.set(selectElement, state);
        this.updateOptions(selectElement);
        this.updateOptionsSelectedState(selectElement);
        this.updateDisplay(selectElement);
    }

    /**
     * Bind global event listeners using event delegation
     */
    private bindEventListeners(): void {
        // Handle clicks with proper event order
        document.addEventListener('click', (event) => {
            // Handle chip removal FIRST (highest priority)
            const chipRemove = (event.target as Element)?.closest('[data-remove-chip]') as HTMLElement;
            if (chipRemove) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                const chipValue = chipRemove.dataset.removeChip;
                const select = chipRemove.closest('[data-select="true"]') as HTMLElement;
                if (select && chipValue) {
                    console.log('Chip remove clicked:', chipValue);
                    this.removeChip(select, chipValue);
                }
                return;
            }

            // Handle clear button SECOND
            const clearButton = (event.target as Element)?.closest('[data-select-clear]') as HTMLElement;
            if (clearButton) {
                event.preventDefault();
                event.stopPropagation();
                const select = clearButton.closest('[data-select="true"]') as HTMLElement;
                if (select) {
                    this.clearSelection(select);
                }
                return;
            }

            // Handle option clicks THIRD
            const option = (event.target as Element)?.closest('[data-select-option]') as HTMLElement;
            if (option) {
                event.preventDefault();
                event.stopPropagation();
                const select = option.closest('[data-select="true"]') as HTMLElement;
                if (select) {
                    this.selectOption(select, option);
                }
                return;
            }

            // Handle trigger clicks FOURTH (lowest priority)
            const trigger = (event.target as Element)?.closest('[data-select-trigger]') as HTMLElement;
            if (trigger) {
                event.preventDefault();
                event.stopPropagation();
                const select = trigger.closest('[data-select="true"]') as HTMLElement;
                if (select && !this.isDisabled(select)) {
                    this.toggleDropdown(select);
                }
                return;
            }

            // Handle search input clicks - prevent dropdown close
            const searchInput = (event.target as Element)?.closest('[data-select-search]') as HTMLElement;
            if (searchInput) {
                event.stopPropagation();
                return; // Don't close dropdown when clicking search input
            }

            // Handle clicks within search input container
            const searchContainer = (event.target as Element)?.closest('[data-select-search]')?.parentElement;
            if (searchContainer && searchContainer.querySelector('[data-select-search]')) {
                event.stopPropagation();
                return; // Don't close dropdown when clicking search container
            }

            // Click outside to close dropdowns
            this.closeAllDropdowns();
        });

        // Handle search input
        document.addEventListener('input', (event) => {
            const searchInput = event.target as HTMLInputElement;
            if (searchInput?.matches('[data-select-search]')) {
                const select = searchInput.closest('[data-select="true"]') as HTMLElement;
                if (select) {
                    this.handleSearch(select, searchInput.value);
                }
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (event) => {
            const select = (event.target as Element)?.closest('[data-select="true"]') as HTMLElement;
            if (select) {
                this.handleKeydown(select, event);
            }
        });

        // Handle focus events
        document.addEventListener('focusin', (event) => {
            const select = (event.target as Element)?.closest('[data-select="true"]') as HTMLElement;
            if (select && !this.isOpen(select)) {
                // Focus moved into select, but dropdown is closed - do nothing special
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.repositionDropdowns();
        });


        // Initialize selects when DOM changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        const selects = element.querySelectorAll('[data-select="true"]');
                        selects.forEach(select => {
                            if (!this.selectStates.has(select as HTMLElement)) {
                                this.initializeSelect(select as HTMLElement);
                            }
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
     * Toggle dropdown open/closed state
     */
    private toggleDropdown(select: HTMLElement): void {
        const state = this.selectStates.get(select);
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
        const state = this.selectStates.get(select);
        if (!state || this.isDisabled(select)) return;

        // Close other dropdowns first
        this.closeAllDropdowns();

        state.isOpen = true;
        this.selectStates.set(select, state);

        const dropdown = select.querySelector('[data-select-dropdown]') as HTMLElement;
        const trigger = select.querySelector('[data-select-trigger]') as HTMLElement;
        const searchInput = select.querySelector('[data-select-search]') as HTMLInputElement;

        if (dropdown) {
            dropdown.classList.remove('hidden');
            this.positionDropdown(select);
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'true');
            const arrow = trigger.querySelector('.select-arrow');
            if (arrow) {
                arrow.classList.add('rotate-180');
            }
        }

        // Focus search input if available
        if (searchInput && select.dataset.searchable === 'true') {
            setTimeout(() => searchInput.focus(), 10);
        }

        // Update filtered options
        this.updateFilteredOptions(select);

        // Dispatch custom event
        this.dispatchSelectEvent(select, 'select:open');
    }

    /**
     * Close dropdown
     */
    private closeDropdown(select: HTMLElement): void {
        const state = this.selectStates.get(select);
        if (!state || !state.isOpen) return;

        state.isOpen = false;
        state.searchTerm = '';
        state.focusedIndex = -1;
        this.selectStates.set(select, state);

        const dropdown = select.querySelector('[data-select-dropdown]') as HTMLElement;
        const trigger = select.querySelector('[data-select-trigger]') as HTMLElement;
        const searchInput = select.querySelector('[data-select-search]') as HTMLInputElement;

        if (dropdown) {
            dropdown.classList.add('hidden');
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            const arrow = trigger.querySelector('.select-arrow');
            if (arrow) {
                arrow.classList.remove('rotate-180');
            }
        }

        if (searchInput) {
            searchInput.value = '';
        }

        // Clear search and show all options
        this.handleSearch(select, '');

        // Dispatch custom event
        this.dispatchSelectEvent(select, 'select:close');
    }

    /**
     * Close all open dropdowns
     */
    private closeAllDropdowns(): void {
        this.selectStates.forEach((state, select) => {
            if (state.isOpen) {
                this.closeDropdown(select);
            }
        });
    }

    /**
     * Handle option selection
     */
    private selectOption(select: HTMLElement, option: HTMLElement): void {
        const state = this.selectStates.get(select);
        const optionValue = option.dataset.value;

        if (!state || !optionValue || option.getAttribute('aria-disabled') === 'true') {
            return;
        }

        const isMultiple = select.dataset.multiple === 'true';

        if (isMultiple) {
            // Toggle selection in multiple mode
            const index = state.selectedValues.indexOf(optionValue);
            if (index > -1) {
                state.selectedValues.splice(index, 1);
            } else {
                state.selectedValues.push(optionValue);
            }
        } else {
            // Replace selection in single mode
            state.selectedValues = [optionValue];
            this.closeDropdown(select);
        }

        this.selectStates.set(select, state);
        this.updateDisplay(select);
        this.updateHiddenInputs(select);
        this.updateOptionsSelectedState(select);

        // Dispatch custom event
        this.dispatchSelectEvent(select, 'select:change', {
            value: isMultiple ? state.selectedValues : optionValue,
            selectedValues: state.selectedValues
        });
    }

    /**
     * Remove chip (for multiple selection)
     */
    private removeChip(select: HTMLElement, value: string): void {
        const state = this.selectStates.get(select);
        if (!state) return;

        const index = state.selectedValues.indexOf(value);
        if (index > -1) {
            state.selectedValues.splice(index, 1);
            this.selectStates.set(select, state);
            this.updateDisplay(select);
            this.updateHiddenInputs(select);
            this.updateOptionsSelectedState(select);

            // Dispatch custom event
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
        const state = this.selectStates.get(select);
        if (!state) return;

        state.selectedValues = [];
        this.selectStates.set(select, state);
        this.updateDisplay(select);
        this.updateHiddenInputs(select);
        this.updateOptionsSelectedState(select);

        // Dispatch custom event
        this.dispatchSelectEvent(select, 'select:change', {
            value: select.dataset.multiple === 'true' ? [] : '',
            selectedValues: []
        });
    }

    /**
     * Handle search functionality
     */
    private handleSearch(select: HTMLElement, searchTerm: string): void {
        const state = this.selectStates.get(select);
        if (!state) return;

        state.searchTerm = searchTerm.toLowerCase();
        this.selectStates.set(select, state);

        this.updateFilteredOptions(select);
        this.updateOptionsVisibility(select);
    }

    /**
     * Update filtered options based on search term
     */
    private updateFilteredOptions(select: HTMLElement): void {
        const state = this.selectStates.get(select);
        if (!state) return;

        const allOptions = this.getAllOptions(select);

        if (!state.searchTerm) {
            state.filteredOptions = allOptions;
        } else {
            state.filteredOptions = allOptions.filter(option =>
                option.searchableText.includes(state.searchTerm)
            );
        }

        this.selectStates.set(select, state);
    }

    /**
     * Update options visibility based on filter
     */
    private updateOptionsVisibility(select: HTMLElement): void {
        const state = this.selectStates.get(select);
        if (!state) return;

        const allOptionElements = select.querySelectorAll('[data-select-option]');
        const noResultsElement = select.querySelector('[data-select-no-results]') as HTMLElement;

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

        // Show/hide no results message
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
        const state = this.selectStates.get(select);
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
                    const trigger = select.querySelector('[data-select-trigger]') as HTMLElement;
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
        const state = this.selectStates.get(select);
        if (!state || !state.isOpen) return;

        const optionCount = state.filteredOptions.length;
        if (optionCount === 0) return;

        // Update focused index
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

        this.selectStates.set(select, state);
        this.updateOptionFocus(select);
    }

    /**
     * Update visual focus state of options
     */
    private updateOptionFocus(select: HTMLElement): void {
        const state = this.selectStates.get(select);
        if (!state) return;

        const allOptions = select.querySelectorAll('[data-select-option]');
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
        const state = this.selectStates.get(select);
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
        const state = this.selectStates.get(select);
        if (!state) return;

        const chipsContainer = select.querySelector('[data-select-chips]') as HTMLElement;
        if (!chipsContainer) return;

        // Clear existing chips
        chipsContainer.innerHTML = '';

        if (state.selectedValues.length === 0) {
            // Show placeholder
            const placeholderText = select.dataset.placeholder || 'Select options...';
            chipsContainer.innerHTML = `<span class="text-neutral-500 select-placeholder">${placeholderText}</span>`;
        } else {
            // Create Badge button chips for selected values
            state.selectedValues.forEach(value => {
                const option = this.findOptionByValue(select, value);
                const label = option ? option.displayLabel : value;
                const isClearable = select.dataset.clearable === 'true' && !this.isDisabled(select);
                const chipId = `select-chip-${this.generateChipId(value)}`;

                // Create chip button element with semantic styling
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

                // Add hover styles
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
                    // Add simple text-based dismiss symbol
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
        const state = this.selectStates.get(select);
        if (!state) return;

        const valueDisplay = select.querySelector('.select-value') as HTMLElement;
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
        const state = this.selectStates.get(select);
        if (!state) return;

        const isMultiple = select.dataset.multiple === 'true';
        const name = select.dataset.name;
        if (!name) return;

        // Remove existing hidden inputs
        const existingInputs = select.querySelectorAll('.select-hidden-input');
        existingInputs.forEach(input => input.remove());

        // Create new hidden inputs
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
        const state = this.selectStates.get(select);
        if (!state) return;

        const allOptions = select.querySelectorAll('[data-select-option]');
        allOptions.forEach(optionElement => {
            const option = optionElement as HTMLElement;
            const value = option.dataset.value || '';
            const isSelected = state.selectedValues.includes(value);

            option.setAttribute('aria-selected', isSelected ? 'true' : 'false');

            // Update visual state
            if (isSelected) {
                option.classList.add('bg-brand-50', 'text-brand-700', 'dark:bg-brand-900/20', 'dark:text-brand-300');
                const checkmark = option.querySelector('.text-brand-600');
                if (checkmark) {
                    checkmark.parentElement?.classList.remove('opacity-0');
                    checkmark.parentElement?.classList.add('opacity-100');
                }
            } else {
                option.classList.remove('bg-brand-50', 'text-brand-700', 'dark:bg-brand-900/20', 'dark:text-brand-300');
                const checkmark = option.querySelector('.text-brand-600');
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
        const state = this.selectStates.get(select);
        if (state) {
            state.filteredOptions = allOptions;
            this.selectStates.set(select, state);
        }
    }

    /**
     * Get all options from select element
     */
    private getAllOptions(select: HTMLElement): SelectOption[] {
        const optionElements = select.querySelectorAll('[data-select-option]');
        return Array.from(optionElements).map(element => {
            const optionEl = element as HTMLElement;

            // Get display label - use explicit display-label or fall back to full text content
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
        const dropdown = select.querySelector('[data-select-dropdown]') as HTMLElement;
        const trigger = select.querySelector('[data-select-trigger]') as HTMLElement;

        if (!dropdown || !trigger) return;

        const rect = trigger.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Use relative positioning
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = dropdownRect.height || 240;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
            // Open upward
            dropdown.style.bottom = '100%';
            dropdown.style.top = 'auto';
            dropdown.style.marginBottom = '4px';
            dropdown.style.marginTop = '0';
        } else {
            // Open downward (default)
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
        this.selectStates.forEach((state, select) => {
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
        const state = this.selectStates.get(select);
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
        const event = new CustomEvent(eventName, {
            detail: {
                select,
                ...detail
            },
            bubbles: true
        });
        select.dispatchEvent(event);
    }

    /**
     * Get select state (for external access)
     */
    public getSelectState(select: HTMLElement): SelectState | null {
        return this.selectStates.get(select) || null;
    }

    /**
     * Set selected values programmatically
     */
    public setSelectedValues(select: HTMLElement, values: string[]): void {
        const state = this.selectStates.get(select);
        if (!state) return;

        const isMultiple = select.dataset.multiple === 'true';
        state.selectedValues = isMultiple ? values : values.slice(0, 1);

        this.selectStates.set(select, state);
        this.updateDisplay(select);
        this.updateHiddenInputs(select);
        this.updateOptionsSelectedState(select);

        this.dispatchSelectEvent(select, 'select:change', {
            value: isMultiple ? state.selectedValues : state.selectedValues[0] || '',
            selectedValues: state.selectedValues
        });
    }

    /**
     * Destroy SelectActions and clean up
     */
    public destroy(): void {
        this.selectStates.clear();
        this.initialized = false;
        console.log('SelectActions destroyed');
    }
}

// Export default instance
export default SelectActions.getInstance();