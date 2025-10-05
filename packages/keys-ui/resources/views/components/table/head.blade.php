@php
    $headBaseClasses = 'bg-foreground';
    $headVariantClasses = match ($variant) {
        'bordered' => 'border-b border-border',
        'elevated' => 'shadow-sm',
        default => ''
    };
    $headClasses = trim("$headBaseClasses $headVariantClasses");
@endphp

<thead {{ $attributes->merge(['class' => $headClasses])->merge($dataAttributes) }}>
    {{ $slot }}
</thead>
