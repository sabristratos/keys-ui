@php

    $baseClasses = 'block font-medium text-foreground mb-1.5';
    $sizeClasses = match ($size) {
        'sm' => 'text-xs',
        'md' => 'text-sm',
        'lg' => 'text-base',
        default => 'text-sm'
    };

    $labelAttributes = $attributes->merge([
        'class' => trim("$baseClasses $sizeClasses")
    ])->merge($dataAttributes);

    if ($for) {
        $labelAttributes = $labelAttributes->merge(['for' => $for]);
    }

    if ($id) {
        $labelAttributes = $labelAttributes->merge(['id' => $id]);
    }
@endphp

<label {{ $labelAttributes }}>
    <span class="flex items-center gap-1.5">

        @if($hasIcon())
            <x-keys::icon
                name="{{ $icon }}"
                size="{{ $iconSize }}"
                class="text-foreground"
                data-icon
            />
        @endif


        <span>{{ $slot }}</span>

        @if($slot->isNotEmpty())

            @if($hasTooltip())
                <x-keys::tooltip
                    content="{{ $tooltip }}"
                    placement="{{ $tooltipPlacement }}"
                    color="{{ $tooltipColor }}"
                    trigger="hover"
                    delay="100"
                >
                    <x-keys::icon
                        name="heroicon-o-information-circle"
                        size="xs"
                        class="text-neutral-500 hover:text-neutral-700 transition-colors cursor-help"
                    />
                </x-keys::tooltip>
            @endif


            @if($required)
                <span class="text-danger ml-0.5" aria-label="{{ __('keys-ui::keys-ui.aria.required_field') }}">*</span>
            @endif


            @if($optional && !$required)
                <span class="text-neutral ml-0.5 text-xs">{{ __('keys-ui::keys-ui.labels.optional') }}</span>
            @endif
        @endif
    </span>
</label>
