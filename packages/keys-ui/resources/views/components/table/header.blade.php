@props(['computedHeaderClasses', 'computedSortIconClasses', 'sortDataAttributes'])

<th {{ $attributes->merge($sortDataAttributes)->merge(['class' => $computedHeaderClasses]) }}>
    @if($selectAll)
        <x-keys::checkbox
            :name="'select-all'"
            :id="'table-select-all-' . uniqid()"
            data-table-select-all="true"
            size="md"
            color="brand"
        />
    @else
        <div class="flex items-center">
            {{ $slot }}

            @if($sortable && $getSortIcon())
                <x-keys::icon
                    :name="$getSortIcon()"
                    size="xs"
                    :class="$computedSortIconClasses . ' table-sort-icon'"
                />
            @endif
        </div>
    @endif
</th>