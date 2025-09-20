
@if($isLabeled() && $hasLabel())
    <div class="{{ $computedSeparatorClasses }}" {{ $attributes->merge($computedDataAttributes) }}>
        <div class="{{ $computedLineClasses }}"></div>
        <span class="{{ $computedLabelClasses }}">{{ $label }}</span>
        <div class="{{ $computedLineClasses }}"></div>
    </div>
@else
    <div class="{{ $computedSeparatorClasses }}" {{ $attributes->merge($computedDataAttributes) }}></div>
@endif