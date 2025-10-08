@php
    $rowBaseClasses = 'transition-colors duration-150';

    $rowVariantClasses = '';
    if ($selected) {
        // These classes are now applied directly based on the $selected prop
        $rowVariantClasses = 'bg-accent/10 border-l-2 border-accent';
    } else {
        $rowVariantClasses = match ($variant) {
            'danger' => 'bg-danger-subtle',
            'warning' => 'bg-warning-subtle',
            'success' => 'bg-success-subtle',
            default => ''
        };
    }

    $rowInteractionClasses = '';
    if ($clickable || $href) {
        // The hover state is now handled by the parent table component's classes
        $rowInteractionClasses = 'cursor-pointer';
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
                    color="accent"
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
                    color="accent"
                />
            </td>
        @endif
        {{ $slot }}
    </tr>
@endif
