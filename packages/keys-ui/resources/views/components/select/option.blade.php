@php
    $optionAttributes = $attributes
        ->except(['class'])
        ->merge([
            'role' => 'option',
            'data-value' => $value,
            'data-display-label' => $displayLabel,
            'data-searchable-text' => $searchableText,
            'aria-selected' => $selected ? 'true' : 'false',
            'tabindex' => $disabled ? null : '0',
        ]);

    if ($disabled) {
        $optionAttributes = $optionAttributes->merge(['aria-disabled' => 'true']);
    }
@endphp

<div
    class="{{ $computedOptionClasses }}"
    data-select-option
    {{ $optionAttributes }}
>
    @if($hasIcon())
        <div class="flex-shrink-0 mr-2">
            <x-keys::icon name="{{ $icon }}" size="sm" />
        </div>
    @endif

    <div class="flex-1 min-w-0">
        @if($slot->isNotEmpty())
            {{ $slot }}
        @else
            @if($hasContent())
                <div class="block font-medium truncate">
                    {{ $label }}
                </div>
            @endif
            @if($hasDescription())
                <div class="block text-xs text-muted mt-0.5 truncate">
                    {{ $description }}
                </div>
            @endif
        @endif
    </div>

    <div class="flex-shrink-0 ml-2 transition-opacity duration-150 {{ $selected ? 'opacity-100' : 'opacity-0' }}">
        <x-keys::icon name="heroicon-o-check" size="sm" class="text-brand" />
    </div>
</div>