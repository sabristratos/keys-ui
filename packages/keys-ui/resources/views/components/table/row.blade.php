@php
    $rowBaseClasses = 'transition-colors duration-150';

    $rowVariantClasses = '';
    if ($selected) {
        $rowVariantClasses = 'bg-brand/10 border-brand';
    } else {
        $rowVariantClasses = match ($variant) {
            'danger' => 'bg-danger/10',
            'warning' => 'bg-warning/10',
            'success' => 'bg-success/10',
            default => ''
        };
    }

    $rowInteractionClasses = '';
    if ($clickable || $href) {
        $rowInteractionClasses = 'cursor-pointer hover:bg-body';
    }

    $rowClasses = trim("$rowBaseClasses $rowVariantClasses $rowInteractionClasses");
@endphp

@if($href)
    <tr {{ $attributes->merge(['class' => $rowClasses, 'onclick' => "window.location.href='{$href}'"])->merge($dataAttributes) }}>
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
    <tr {{ $attributes->merge(['class' => $rowClasses])->merge($dataAttributes) }}>
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