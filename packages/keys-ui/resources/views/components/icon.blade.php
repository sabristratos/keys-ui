@php
    $sizeClasses = match ($size) {
        'xs' => 'w-3 h-3',
        'sm' => 'w-4 h-4',
        'md' => 'w-5 h-5',
        'lg' => 'w-6 h-6',
        'xl' => 'w-8 h-8',
        default => 'w-5 h-5'
    };
@endphp

<x-dynamic-component
    :component="$iconExists ? $resolvedIcon : $fallback"
    {{ $attributes->class($sizeClasses)->merge($dataAttributes) }}
/>
