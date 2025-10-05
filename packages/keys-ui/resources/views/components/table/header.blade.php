@php
    $headerBaseClasses = 'font-medium text-muted tracking-wider uppercase text-xs';

    $headerPaddingClasses = match ($size) {
        'sm' => 'px-3 py-2',
        'md' => 'px-6 py-3',
        'lg' => 'px-8 py-4',
        default => 'px-6 py-3'
    };

    $headerAlignClasses = match ($align) {
        'start' => 'text-left',
        'center' => 'text-center',
        'end' => 'text-right',
        default => 'text-left'
    };

    $headerInteractionClasses = '';
    if ($sortable) {
        $headerInteractionClasses = 'cursor-pointer hover:text-heading select-none group transition-colors duration-150';
    } elseif ($selectAll) {
        $headerInteractionClasses = 'w-12';
    }

    $headerTextClasses = $wrap ? 'whitespace-normal' : 'whitespace-nowrap';

    $headerClasses = trim("$headerBaseClasses $headerPaddingClasses $headerAlignClasses $headerInteractionClasses $headerTextClasses");

    $sortIconClasses = 'inline-flex ml-1 transition-opacity duration-150';
    if (!$sorted) {
        $sortIconClasses .= ' opacity-0 group-hover:opacity-100';
    } else {
        $sortIconClasses .= ' opacity-100';
    }
@endphp

<th {{ $attributes->merge(['class' => $headerClasses])->merge($dataAttributes) }}>
    @if($selectAll)
        <x-keys::checkbox
            :name="'select-all'"
            :id="'table-select-all-' . uniqid()"
            data-table-select-all="true"
            size="md"
            color="accent"
        />
    @else
        <div class="flex items-center">
            {{ $slot }}

            @if($sortable && $sortIcon)
                <x-keys::icon
                    :name="$sortIcon"
                    size="xs"
                    :class="$sortIconClasses . ' table-sort-icon'"
                />
            @endif
        </div>
    @endif
</th>