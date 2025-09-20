@php
    $optionAttributes = $attributes
        ->except(['class'])
        ->merge([
            'role' => 'option',
            'data-value' => $value,
            'data-display-label' => $displayLabel,
            'data-searchable-text' => $getSearchableText(),
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
        <div class="{{ $computedIconClasses }}">
            <x-keys::icon name="{{ $icon }}" size="sm" />
        </div>
    @endif

    
    <div class="{{ $computedContentClasses }}">
        @if($slot->isNotEmpty())
            
            {{ $slot }}
        @else
            
            @if($hasContent())
                <div class="{{ $computedLabelClasses }}">
                    {{ $label }}
                </div>
            @endif
            @if($hasDescription())
                <div class="{{ $computedDescriptionClasses }}">
                    {{ $description }}
                </div>
            @endif
        @endif
    </div>

    
    <div class="{{ $computedCheckmarkClasses }}">
        <x-keys::icon name="heroicon-o-check" size="sm" class="text-brand" />
    </div>
</div>
