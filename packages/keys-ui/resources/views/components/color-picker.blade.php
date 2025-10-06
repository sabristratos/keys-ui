@php
    $wrapperClasses = 'input-wrapper-base';

    $wrapperSizeClasses = match ($size) {
        'xs' => 'min-h-[28px] rounded-sm',
        'sm' => 'min-h-[32px] rounded-md',
        'md' => 'min-h-[38px] rounded-md',
        'lg' => 'min-h-[42px] rounded-lg',
        default => 'min-h-[38px] rounded-md'
    };

    if ($disabled) {
        $wrapperStateClasses = 'input-disabled';
    } elseif ($hasError) {
        $wrapperStateClasses = 'input-wrapper-error';
    } else {
        $wrapperStateClasses = 'input-wrapper-default';
    }

    $wrapperAttributes = $attributes
        ->except(['type', 'name', 'id', 'value', 'placeholder', 'disabled', 'readonly', 'required'])
        ->filter(fn($value, $key) => !str_starts_with($key, 'wire:'))
        ->merge(array_merge([
            'class' => trim("$wrapperClasses $wrapperSizeClasses $wrapperStateClasses"),
        ], $dataAttributes));

    $colorInputClasses = 'cursor-pointer border-0 bg-transparent';

    $colorInputSize = match ($size) {
        'xs' => 'w-6 h-6',
        'sm' => 'w-7 h-7',
        'md' => 'w-8 h-8',
        'lg' => 'w-9 h-9',
        default => 'w-8 h-8'
    };

    $textInputClasses = 'flex-1 bg-transparent border-0 outline-none focus:outline-none placeholder:text-muted font-mono';

    $textInputSize = match ($size) {
        'xs' => 'text-xs py-1',
        'sm' => 'text-sm py-1.5',
        'md' => 'text-sm py-2',
        'lg' => 'text-base py-2.5',
        default => 'text-sm py-2'
    };

    $textInputPadding = match ($size) {
        'xs' => 'px-2',
        'sm' => 'px-2.5',
        'md' => 'px-3',
        'lg' => 'px-3',
        default => 'px-3'
    };

    $textInputColorClasses = $disabled ? 'text-muted' : 'text-primary';

    $leftPadding = match ($size) {
        'xs' => 'pl-2',
        'sm' => 'pl-2.5',
        'md' => 'pl-3',
        'lg' => 'pl-3',
        default => 'pl-3'
    };

    $rightPadding = match ($size) {
        'xs' => 'pr-2',
        'sm' => 'pr-2.5',
        'md' => 'pr-3',
        'lg' => 'pr-3',
        default => 'pr-3'
    };

    $wireAndAlpineAttributes = $attributes->filter(fn($value, $key) => str_starts_with($key, 'wire:') || str_starts_with($key, 'x-'))->getAttributes();
    $dataOnlyAttributes = $attributes->filter(fn($value, $key) => str_starts_with($key, 'data-'))->getAttributes();

    $outerWrapperAttributes = $attributes->filter(fn($value, $key) => !in_array($key, ['type', 'name', 'id', 'value', 'placeholder', 'disabled', 'readonly', 'required', 'class']) && !str_starts_with($key, 'wire:') && !str_starts_with($key, 'x-') && !str_starts_with($key, 'data-'));
@endphp

@if($isShorthand)
    <div {{ $outerWrapperAttributes->only('class') }}>
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="mt-1">
            {{-- Color Picker Inputs --}}
            <div {{ $wrapperAttributes }}>
                <div class="flex items-center gap-2 {{ $leftPadding }} {{ $rightPadding }}">
                    {{-- Native color picker input --}}
                    <input
                        type="color"
                        name="{{ $name }}"
                        id="{{ $id }}"
                        value="{{ $value }}"
                        @if($disabled) disabled @endif
                        @if($readonly) readonly @endif
                        @if($required) required @endif
                        {!! html_entity_decode(implode(' ', array_map(fn($k, $v) => sprintf('%s="%s"', $k, htmlspecialchars($v)), array_keys($wireAndAlpineAttributes), $wireAndAlpineAttributes))) !!}
                        {!! html_entity_decode(implode(' ', array_map(fn($k, $v) => sprintf('%s="%s"', $k, htmlspecialchars($v)), array_keys($dataOnlyAttributes), $dataOnlyAttributes))) !!}
                        class="{{ $colorInputClasses }} {{ $colorInputSize }} rounded-md"
                        data-color-input="true"
                        aria-label="Color picker"
                    />

                    {{-- Text input for hex value --}}
                    <input
                        type="text"
                        value="{{ $value }}"
                        placeholder="{{ $placeholder }}"
                        @if($disabled) disabled @endif
                        @if($readonly) readonly @endif
                        class="{{ $textInputClasses }} {{ $textInputSize }} {{ $textInputPadding }} {{ $textInputColorClasses }}"
                        data-text-input="true"
                        aria-label="Hex color value"
                        maxlength="7"
                    />
                </div>
            </div>
        </div>

        @if($hint)
            <p class="mt-1 text-xs text-muted">{{ $hint }}</p>
        @endif

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    {{-- Color Picker Inputs --}}
    <div {{ $wrapperAttributes }}>
        <div class="flex items-center gap-2 {{ $leftPadding }} {{ $rightPadding }}">
            {{-- Native color picker input --}}
            <input
                type="color"
                name="{{ $name }}"
                id="{{ $id }}"
                value="{{ $value }}"
                @if($disabled) disabled @endif
                @if($readonly) readonly @endif
                @if($required) required @endif
                {!! html_entity_decode(implode(' ', array_map(fn($k, $v) => sprintf('%s="%s"', $k, htmlspecialchars($v)), array_keys($wireAndAlpineAttributes), $wireAndAlpineAttributes))) !!}
                {!! html_entity_decode(implode(' ', array_map(fn($k, $v) => sprintf('%s="%s"', $k, htmlspecialchars($v)), array_keys($dataOnlyAttributes), $dataOnlyAttributes))) !!}
                class="{{ $colorInputClasses }} {{ $colorInputSize }} rounded-md"
                data-color-input="true"
                aria-label="Color picker"
            />

            {{-- Text input for hex value --}}
            <input
                type="text"
                value="{{ $value }}"
                placeholder="{{ $placeholder }}"
                @if($disabled) disabled @endif
                @if($readonly) readonly @endif
                class="{{ $textInputClasses }} {{ $textInputSize }} {{ $textInputPadding }} {{ $textInputColorClasses }}"
                data-text-input="true"
                aria-label="Hex color value"
                maxlength="7"
            />
        </div>
    </div>
@endif
