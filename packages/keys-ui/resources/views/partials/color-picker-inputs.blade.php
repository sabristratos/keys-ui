{{-- Color Picker Inputs Partial --}}
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
