
@php
    $separatorClasses = $isLabeled() ? 'flex items-center my-2' : 'my-2 border-t border-line';
    $lineClasses = 'flex-1 border-t border-line';
    $labelClasses = 'px-3 text-xs font-medium text-muted uppercase tracking-wider';
@endphp

@if($isLabeled() && $hasLabel())
    <div {{ $attributes->merge(['class' => $separatorClasses])->merge($dataAttributes) }}>
        <div class="{{ $lineClasses }}"></div>
        <span class="{{ $labelClasses }}">{{ $label }}</span>
        <div class="{{ $lineClasses }}"></div>
    </div>
@else
    <div {{ $attributes->merge(['class' => $separatorClasses])->merge($dataAttributes) }}></div>
@endif
