
@php
    // Base stack classes
    $baseClasses = 'flex items-center';

    // Direction classes
    $directionClasses = $direction === 'rtl' ? 'flex-row-reverse' : 'flex-row';

    // Spacing classes based on size and spacing preference
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

    // Handle RTL direction for spacing
    if ($direction === 'rtl') {
        $spacingClasses = str_replace('-space-x-', '-space-x-reverse ', $spacingClasses);
    }

    $stackClasses = trim("$baseClasses $directionClasses $spacingClasses");
@endphp

<div {{ $attributes->merge(['class' => $stackClasses])->merge($dataAttributes) }}>
    {{--
        The slot content will contain individual Avatar components.
        Note: To limit the number of avatars shown, users should pass only
        the desired avatars in the slot. The "+N more" functionality can be
        implemented by the developer by counting their data and passing a
        subset to the stack component.
    --}}
    {{ $slot }}
</div>