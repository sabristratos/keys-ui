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

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';

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

export class TableActions extends BaseActionClass<TableState> {

    /**
     * Initialize table elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.findByDataAttribute('table', 'true').forEach(table => {
            this.initializeTable(table);
        });
        this.setupLivewireIntegration();
    }

    /**
     * Initialize a single table
     */
    private initializeTable(table: HTMLElement): void {
        if (this.hasState(table)) {
            return;
        }

        const state: TableState = {
            selectedRows: new Set(),
            sortColumn: null,
            sortDirection: null,
            selectAllState: 'none'
        };

        this.setState(table, state);

        // Initialize sort state from current DOM
        const sortedHeader = DOMUtils.querySelector('[data-sorted="true"]', table);
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
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Sort header clicks
        EventUtils.handleDelegatedClick('[data-sortable="true"]', (sortHeader, event) => {
            event.preventDefault();
            this.handleSort(sortHeader);
        });

        // Row selection checkboxes
        EventUtils.handleDelegatedChange('[data-table-row-select]', (target) => {
            this.handleRowSelection(target as HTMLInputElement);
        });

        // Select all checkbox
        EventUtils.handleDelegatedChange('[data-table-select-all]', (target) => {
            this.handleSelectAll(target as HTMLInputElement);
        });

        // Keyboard navigation
        EventUtils.handleDelegatedKeydown('[data-table="true"]', (target, event) => {
            this.handleKeyboard(event);
        });
    }

    /**
     * Setup dynamic observer for new tables - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Check if the added node is a table
                    if (DOMUtils.hasDataAttribute(element, 'table', 'true')) {
                        this.initializeTable(element);
                    }

                    // Check for tables within the added node
                    DOMUtils.findByDataAttribute('table', 'true', element).forEach(table => {
                        this.initializeTable(table);
                    });
                }
            });
        });
    }

    /**
     * Setup Livewire integration
     */
    private setupLivewireIntegration(): void {
        if (typeof window.Livewire === 'undefined') return;

        EventUtils.addEventListener(document, 'livewire:navigated', () => {
            this.reinitialize();
        });
    }

    /**
     * Handle sortable header clicks
     */
    private handleSort(header: HTMLElement): void {
        const table = DOMUtils.findClosest(header, '[data-table="true"]');
        if (!table) return;

        const state = this.getState(table);
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
        const headers = DOMUtils.querySelectorAll('[data-sortable="true"]', table);
        headers.forEach((header) => {
            header.setAttribute('data-sorted', 'false');
            header.removeAttribute('data-direction');

            // Update icons
            const icons = DOMUtils.querySelectorAll('.table-sort-icon', header);
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

                const icon = DOMUtils.querySelector('.table-sort-icon', activeHeader);
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
        const table = DOMUtils.findClosest(checkbox, '[data-table="true"]');
        if (!table) return;

        const state = this.getState(table);
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
        const table = DOMUtils.findClosest(checkbox, '[data-table="true"]');
        if (!table) return;

        const state = this.getState(table);
        if (!state) return;

        const rowCheckboxes = DOMUtils.querySelectorAll('[data-table-row-select]', table) as NodeListOf<HTMLInputElement>;

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
        const state = this.getState(table);
        if (!state) return;

        const rowCheckboxes = DOMUtils.querySelectorAll('[data-table-row-select]', table) as NodeListOf<HTMLInputElement>;
        const selectAllCheckbox = DOMUtils.querySelector('[data-table-select-all]', table) as HTMLInputElement;

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
        const rows = DOMUtils.querySelectorAll('[data-table-row]', table);
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
        EventUtils.dispatchCustomEvent(table, 'table:sort', config, {
            bubbles: true,
            cancelable: true
        });

        // Livewire integration
        if (config.livewireMethod && window.Livewire) {
            const wireId = table.getAttribute('wire:id');
            if (wireId) {
                const component = window.Livewire.find(wireId);
                if (component) {
                    component.call(config.livewireMethod, config.column, config.direction);
                }
            }
        }
    }

    /**
     * Dispatch selection event
     */
    private dispatchSelectionEvent(table: HTMLElement, selectedIds: string[]): void {
        EventUtils.dispatchCustomEvent(table, 'table:selection', { selectedIds }, {
            bubbles: true,
            cancelable: true
        });

        // Livewire integration
        const livewireMethod = table.getAttribute('data-selection-method');
        if (livewireMethod && window.Livewire) {
            const wireId = table.getAttribute('wire:id');
            if (wireId) {
                const component = window.Livewire.find(wireId);
                if (component) {
                    component.call(livewireMethod, selectedIds);
                }
            }
        }
    }

    /**
     * Reinitialize after page changes
     */
    private reinitialize(): void {
        this.clearAllStates();
        this.initializeElements();
    }

    /**
     * Get selected rows for a table
     */
    public getSelectedRows(table: HTMLElement): string[] {
        const state = this.getState(table);
        return state ? Array.from(state.selectedRows) : [];
    }

    /**
     * Clear selection for a table
     */
    public clearSelection(table: HTMLElement): void {
        const state = this.getState(table);
        if (state) {
            state.selectedRows.clear();
            this.updateSelectionState(table);
            this.dispatchSelectionEvent(table, []);
        }
    }

    /**
     * Clean up TableActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // TableActions doesn't have additional cleanup beyond base class
        // Event listeners and observers are automatically cleaned up
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

declare global {
    interface Window {
        TableActions: typeof TableActions;
        Livewire?: {
            find: (id: string) => any;
        };
    }
}

export default TableActions.getInstance();