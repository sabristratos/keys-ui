
@php

    $baseClasses = 'flex items-center';

    $directionClasses = $direction === 'rtl' ? 'flex-row-reverse' : 'flex-row';

    $spacingClasses = match ($spacing) {
        'tight' => match ($size) {
            'xs' => '-space-x-1',
            'sm' => '-space-x-1.5',
            'md' => '-space-x-2',
            'lg' => '-space-x-2.5',
            'xl' => '-space-x-3',
            default => '-space-x-2'
        },
        'default' => match ($size) {
            'xs' => '-space-x-1.5',
            'sm' => '-space-x-2',
            'md' => '-space-x-2.5',
            'lg' => '-space-x-3',
            'xl' => '-space-x-4',
            default => '-space-x-2.5'
        },
        'loose' => match ($size) {
            'xs' => '-space-x-0.5',
            'sm' => '-space-x-1',
            'md' => '-space-x-1.5',
            'lg' => '-space-x-2',
            'xl' => '-space-x-2.5',
            default => '-space-x-1.5'
        },
        default => '-space-x-2.5'
    };

    if ($direction === 'rtl') {
        $spacingClasses = str_replace('-space-x-', '-space-x-reverse ', $spacingClasses);
    }

    $stackClasses = trim("$baseClasses $directionClasses $spacingClasses");
@endphp

<div {{ $attributes->merge(['class' => $stackClasses])->merge($dataAttributes) }}>
    
    {{ $slot }}
</div>