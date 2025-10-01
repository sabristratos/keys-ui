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

@if($iconExists)
    <x-dynamic-component
        :component="$iconName"
        {{ $attributes->merge(['class' => $sizeClasses])->merge($dataAttributes) }}
    />
@else
    <x-dynamic-component
        :component="$fallback"
        {{ $attributes->merge(['class' => $sizeClasses])->merge($dataAttributes) }}
    />
@endif