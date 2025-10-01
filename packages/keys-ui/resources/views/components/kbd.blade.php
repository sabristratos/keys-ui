
@php
    $baseClasses = 'inline-flex items-center gap-0.5 font-mono font-medium leading-none select-none';

    $sizeClasses = match ($size) {
        'xs' => 'text-[10px]',
        'sm' => 'text-[11px]',
        'md' => 'text-xs',
        default => 'text-[11px]'
    };

    $variantClasses = match ($variant) {
        'muted' => 'text-muted/60',
        default => 'text-muted'
    };
@endphp

<kbd {{ $attributes->merge(['class' => "$baseClasses $sizeClasses $variantClasses"])->merge($dataAttributes) }}>
    {{ $keys }}
</kbd>
