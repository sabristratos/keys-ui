@props(['computedRowClasses', 'rowDataAttributes'])

@if($href)
    <tr {{ $attributes->merge($rowDataAttributes)->merge(['class' => $computedRowClasses, 'onclick' => "window.location.href='{$href}'"]) }}>
        @if($selectable && $rowId)
            <td class="px-6 py-4 w-12">
                <x-keys::checkbox
                    :name="$selectionName"
                    :value="$rowId"
                    :id="'row-select-' . $rowId"
                    :checked="$selected"
                    data-table-row-select="true"
                    :data-row-id="$rowId"
                    size="md"
                    color="brand"
                />
            </td>
        @endif
        {{ $slot }}
    </tr>
@else
    <tr {{ $attributes->merge($rowDataAttributes)->merge(['class' => $computedRowClasses]) }}>
        @if($selectable && $rowId)
            <td class="px-6 py-4 w-12">
                <x-keys::checkbox
                    :name="$selectionName"
                    :value="$rowId"
                    :id="'row-select-' . $rowId"
                    :checked="$selected"
                    data-table-row-select="true"
                    :data-row-id="$rowId"
                    size="md"
                    color="brand"
                />
            </td>
        @endif
        {{ $slot }}
    </tr>
@endif