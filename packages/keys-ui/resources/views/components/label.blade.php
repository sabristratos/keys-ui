@php

    $textSize = match ($size) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };

    $labelAttributes = $attributes->merge(['class' => 'block mb-1.5'])->merge($dataAttributes);

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
                class="text-primary"
                data-icon
            />
        @endif

        <x-keys::text element="span" :size="$textSize" weight="medium">{{ $slot }}</x-keys::text>

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
                <span class="text-{{ $textSize }} text-danger ml-0.5" aria-label="{{ __('keys-ui::keys-ui.aria.required_field') }}">*</span>
            @endif

            @if($optional && !$required)
                <span class="text-neutral ml-0.5 text-xs">{{ __('keys-ui::keys-ui.labels.optional') }}</span>
            @endif
        @endif
    </span>
</label>
