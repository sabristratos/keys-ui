@php
    $headBaseClasses = 'bg-elevation-2';
    $headVariantClasses = match ($variant) {
        'bordered' => 'border-b border-line',
        'elevated' => 'shadow-sm',
        default => ''
    };
    $headClasses = trim("$headBaseClasses $headVariantClasses");
@endphp

<thead {{ $attributes->merge(['class' => $headClasses])->merge($dataAttributes) }}>
    {{ $slot }}
</thead>
