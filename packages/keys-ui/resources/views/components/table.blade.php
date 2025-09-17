@props(['computedTableClasses', 'computedContainerClasses', 'selectionDataAttributes'])

<div {{ collect($selectionDataAttributes)->mapWithKeys(fn($value, $key) => [$key => $value])->merge(['class' => $computedContainerClasses]) }}>
    <table {{ $attributes->merge(['class' => $computedTableClasses]) }}>
        {{ $slot }}
    </table>

    @if($hasPagination())
        <div class="px-6 py-3 bg-neutral-50 dark:bg-neutral-900/50 border-t border-border">
            <div class="flex items-center justify-between">
                <div class="text-sm text-neutral-600 dark:text-neutral-400">
                    {{ $getPaginationInfo() }}
                </div>
                <div>
                    {{ $paginate->links() }}
                </div>
            </div>
        </div>
    @endif

    {{-- Inline styles for table enhancements --}}
    <style>
        [data-table="true"] .table-row-selected {
            @apply bg-brand-50 dark:bg-brand-900/20;
        }

        [data-table="true"] [data-sortable="true"] {
            @apply transition-colors duration-150;
        }

        [data-table="true"] [data-sortable="true"]:hover {
            @apply bg-neutral-100 dark:bg-neutral-700/50;
        }

        [data-table="true"] [data-sortable="true"]:focus {
            @apply outline-none ring-2 ring-brand ring-offset-2;
        }

        [data-table="true"] .table-sort-icon {
            @apply transition-opacity duration-150;
        }

        [data-table="true"] [data-selected="true"] {
            @apply bg-brand-50 dark:bg-brand-900/20 border-l-2 border-l-brand;
        }

        [data-table="true"] tbody tr:hover:not(.table-row-selected) {
            @apply bg-neutral-50 dark:bg-neutral-900/50;
        }
    </style>
</div>