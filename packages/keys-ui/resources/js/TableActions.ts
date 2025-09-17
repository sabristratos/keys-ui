/**
 * TableActions - Handles interactive functionality for Table components
 *
 * Provides functionality for:
 * - Sortable header click handling
 * - Row selection management
 * - Sort direction toggling
 * - Keyboard navigation
 * - Event dispatching for Livewire integration
 */

interface TableState {
    selectedRows: Set<string>;
    sortColumn: string | null;
    sortDirection: 'asc' | 'desc' | null;
    selectAllState: 'none' | 'some' | 'all';
}

interface SortConfig {
    column: string;
    direction: 'asc' | 'desc';
    url?: string;
    livewireMethod?: string;
    livewireParams?: any[];
}

export class TableActions {
    private static instance: TableActions | null = null;
    private initialized = false;
    private tableStates = new Map<HTMLElement, TableState>();

    /**
     * Get singleton instance
     */
    public static getInstance(): TableActions {
        if (!TableActions.instance) {
            TableActions.instance = new TableActions();
        }
        return TableActions.instance;
    }

    /**
     * Initialize TableActions for all table elements
     */
    public init(): void {
        if (this.initialized) {
            return;
        }

        this.initTables();
        this.bindEvents();
        this.initialized = true;
    }

    /**
     * Initialize all tables on the page
     */
    private initTables(): void {
        const tables = document.querySelectorAll('[data-table="true"]');
        tables.forEach((table) => {
            this.initTable(table as HTMLElement);
        });
    }

    /**
     * Initialize a single table
     */
    private initTable(table: HTMLElement): void {
        const state: TableState = {
            selectedRows: new Set(),
            sortColumn: null,
            sortDirection: null,
            selectAllState: 'none'
        };

        this.tableStates.set(table, state);

        // Initialize sort state from current DOM
        const sortedHeader = table.querySelector('[data-sorted="true"]');
        if (sortedHeader) {
            const column = sortedHeader.getAttribute('data-sort-key') ||
                         sortedHeader.textContent?.trim() || '';
            const direction = sortedHeader.getAttribute('data-direction') as 'asc' | 'desc';

            state.sortColumn = column;
            state.sortDirection = direction;
        }

        // Initialize selection state
        this.updateSelectionState(table);
    }

    /**
     * Bind event listeners
     */
    private bindEvents(): void {
        // Sort header clicks
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const sortHeader = target.closest('[data-sortable="true"]');

            if (sortHeader) {
                e.preventDefault();
                this.handleSort(sortHeader as HTMLElement);
            }
        });

        // Row selection checkboxes
        document.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;

            // Individual row selection
            if (target.matches('[data-table-row-select]')) {
                this.handleRowSelection(target);
            }

            // Select all checkbox
            if (target.matches('[data-table-select-all]')) {
                this.handleSelectAll(target);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target && (e.target as HTMLElement).closest('[data-table="true"]')) {
                this.handleKeyboard(e);
            }
        });

        // Livewire hooks
        document.addEventListener('livewire:navigated', () => {
            this.reinit();
        });
    }

    /**
     * Handle sortable header clicks
     */
    private handleSort(header: HTMLElement): void {
        const table = header.closest('[data-table="true"]') as HTMLElement;
        if (!table) return;

        const state = this.tableStates.get(table);
        if (!state) return;

        const column = header.getAttribute('data-sort-key') ||
                      header.textContent?.trim() || '';

        let newDirection: 'asc' | 'desc' | null = 'asc';

        if (state.sortColumn === column) {
            // Toggle existing sort
            if (state.sortDirection === 'asc') {
                newDirection = 'desc';
            } else if (state.sortDirection === 'desc') {
                newDirection = null; // Remove sort
            }
        }

        // Update state
        state.sortColumn = newDirection ? column : null;
        state.sortDirection = newDirection;

        // Update UI
        this.updateSortUI(table, column, newDirection);

        // Dispatch events
        this.dispatchSortEvent(table, {
            column,
            direction: newDirection || 'asc',
            url: header.getAttribute('data-sort-url') || undefined,
            livewireMethod: header.getAttribute('data-sort-method') || undefined
        });
    }

    /**
     * Update sort UI indicators
     */
    private updateSortUI(table: HTMLElement, column: string, direction: 'asc' | 'desc' | null): void {
        // Clear all sort indicators
        const headers = table.querySelectorAll('[data-sortable="true"]');
        headers.forEach((header) => {
            header.setAttribute('data-sorted', 'false');
            header.removeAttribute('data-direction');

            // Update icons
            const icons = header.querySelectorAll('.table-sort-icon');
            icons.forEach(icon => {
                icon.setAttribute('data-icon', 'heroicon-o-chevron-up-down');
                icon.classList.remove('opacity-100');
                icon.classList.add('opacity-0', 'group-hover:opacity-100');
            });
        });

        if (direction) {
            // Set active sort indicator
            const activeHeader = table.querySelector(`[data-sort-key="${column}"]`) as HTMLElement;
            if (activeHeader) {
                activeHeader.setAttribute('data-sorted', 'true');
                activeHeader.setAttribute('data-direction', direction);

                const icon = activeHeader.querySelector('.table-sort-icon');
                if (icon) {
                    const iconName = direction === 'asc'
                        ? 'heroicon-o-chevron-up'
                        : 'heroicon-o-chevron-down';

                    icon.setAttribute('data-icon', iconName);
                    icon.classList.remove('opacity-0', 'group-hover:opacity-100');
                    icon.classList.add('opacity-100');
                }
            }
        }
    }

    /**
     * Handle individual row selection
     */
    private handleRowSelection(checkbox: HTMLInputElement): void {
        const table = checkbox.closest('[data-table="true"]') as HTMLElement;
        if (!table) return;

        const state = this.tableStates.get(table);
        if (!state) return;

        const rowId = checkbox.getAttribute('data-row-id');
        if (!rowId) return;

        if (checkbox.checked) {
            state.selectedRows.add(rowId);
        } else {
            state.selectedRows.delete(rowId);
        }

        this.updateSelectionState(table);
        this.dispatchSelectionEvent(table, Array.from(state.selectedRows));
    }

    /**
     * Handle select all checkbox
     */
    private handleSelectAll(checkbox: HTMLInputElement): void {
        const table = checkbox.closest('[data-table="true"]') as HTMLElement;
        if (!table) return;

        const state = this.tableStates.get(table);
        if (!state) return;

        const rowCheckboxes = table.querySelectorAll('[data-table-row-select]') as NodeListOf<HTMLInputElement>;

        if (checkbox.checked) {
            // Select all
            rowCheckboxes.forEach(cb => {
                cb.checked = true;
                const rowId = cb.getAttribute('data-row-id');
                if (rowId) state.selectedRows.add(rowId);
            });
        } else {
            // Deselect all
            rowCheckboxes.forEach(cb => {
                cb.checked = false;
                const rowId = cb.getAttribute('data-row-id');
                if (rowId) state.selectedRows.delete(rowId);
            });
        }

        this.updateSelectionState(table);
        this.dispatchSelectionEvent(table, Array.from(state.selectedRows));
    }

    /**
     * Update selection state and UI
     */
    private updateSelectionState(table: HTMLElement): void {
        const state = this.tableStates.get(table);
        if (!state) return;

        const rowCheckboxes = table.querySelectorAll('[data-table-row-select]') as NodeListOf<HTMLInputElement>;
        const selectAllCheckbox = table.querySelector('[data-table-select-all]') as HTMLInputElement;

        const totalRows = rowCheckboxes.length;
        const selectedCount = state.selectedRows.size;

        // Update select all state
        if (selectedCount === 0) {
            state.selectAllState = 'none';
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            }
        } else if (selectedCount === totalRows) {
            state.selectAllState = 'all';
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            }
        } else {
            state.selectAllState = 'some';
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            }
        }

        // Update row states
        const rows = table.querySelectorAll('[data-table-row]');
        rows.forEach(row => {
            const rowId = row.getAttribute('data-row-id');
            const isSelected = rowId && state.selectedRows.has(rowId);

            if (isSelected) {
                row.setAttribute('data-selected', 'true');
                row.classList.add('table-row-selected');
            } else {
                row.setAttribute('data-selected', 'false');
                row.classList.remove('table-row-selected');
            }
        });
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeyboard(e: KeyboardEvent): void {
        const target = e.target as HTMLElement;

        // Space to toggle checkboxes
        if (e.key === ' ' && target.matches('[data-sortable="true"]')) {
            e.preventDefault();
            this.handleSort(target);
        }

        // Enter to trigger sort
        if (e.key === 'Enter' && target.matches('[data-sortable="true"]')) {
            e.preventDefault();
            this.handleSort(target);
        }
    }

    /**
     * Dispatch sort event
     */
    private dispatchSortEvent(table: HTMLElement, config: SortConfig): void {
        const event = new CustomEvent('table:sort', {
            detail: config,
            bubbles: true
        });
        table.dispatchEvent(event);

        // Livewire integration
        if (config.livewireMethod && window.Livewire) {
            const component = window.Livewire.find(table.getAttribute('wire:id'));
            if (component) {
                component.call(config.livewireMethod, config.column, config.direction);
            }
        }
    }

    /**
     * Dispatch selection event
     */
    private dispatchSelectionEvent(table: HTMLElement, selectedIds: string[]): void {
        const event = new CustomEvent('table:selection', {
            detail: { selectedIds },
            bubbles: true
        });
        table.dispatchEvent(event);

        // Livewire integration
        const livewireMethod = table.getAttribute('data-selection-method');
        if (livewireMethod && window.Livewire) {
            const component = window.Livewire.find(table.getAttribute('wire:id'));
            if (component) {
                component.call(livewireMethod, selectedIds);
            }
        }
    }

    /**
     * Reinitialize after page changes
     */
    private reinit(): void {
        this.tableStates.clear();
        this.initTables();
    }

    /**
     * Get selected rows for a table
     */
    public getSelectedRows(table: HTMLElement): string[] {
        const state = this.tableStates.get(table);
        return state ? Array.from(state.selectedRows) : [];
    }

    /**
     * Clear selection for a table
     */
    public clearSelection(table: HTMLElement): void {
        const state = this.tableStates.get(table);
        if (state) {
            state.selectedRows.clear();
            this.updateSelectionState(table);
            this.dispatchSelectionEvent(table, []);
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        TableActions.getInstance().init();
    });
} else {
    TableActions.getInstance().init();
}

// Export for global access
(window as any).TableActions = TableActions;