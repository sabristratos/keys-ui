@php

    $baseClasses = 'flex items-center w-full px-3 py-2 mx-0.5 my-0.5 text-sm text-left cursor-pointer transition-colors duration-150 rounded-md';

    $stateClasses = match (true) {
        $disabled => 'text-muted cursor-not-allowed bg-elevation-1 opacity-50',
        default => 'text-primary hover:bg-hover focus-visible:bg-hover aria-[selected=true]:bg-accent/10 dark:aria-[selected=true]:bg-accent/20'
    };

    $optionAttributes = $attributes
        ->except(['class'])
        ->merge([
            'role' => 'option',
            'aria-selected' => $selected ? 'true' : 'false',
            'tabindex' => $disabled ? null : '0',
            'class' => trim("$baseClasses $stateClasses"),
        ])
        ->merge($dataAttributes);

    if ($disabled) {
        $optionAttributes = $optionAttributes->merge(['aria-disabled' => 'true']);
    }
@endphp

<div {{ $optionAttributes }}>
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

    <div class="flex-shrink-0 ml-2 text-accent transition-opacity duration-150 opacity-0 aria-[selected=true]:opacity-100">
        <x-keys::icon name="heroicon-o-check" size="sm" />
    </div>
</div>
