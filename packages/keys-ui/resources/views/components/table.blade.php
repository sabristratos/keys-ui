@props(['computedTableClasses', 'computedContainerClasses', 'selectionDataAttributes'])

<div {{ collect($selectionDataAttributes)->mapWithKeys(fn($value, $key) => [$key => $value])->merge(['class' => $computedContainerClasses]) }}>
    <table {{ $attributes->merge(['class' => $computedTableClasses]) }}>
        {{ $slot }}
    </table>

    @if($hasPagination())
        <div class="px-6 py-3 bg-body border-t border-border">
            <div class="flex items-center justify-between">
                <div class="text-sm text-muted">
                    {{ $getPaginationInfo() }}
                </div>
                <div>
                    {{ $paginate->links() }}
                </div>
            </div>
        </div>
    @endif

</div>