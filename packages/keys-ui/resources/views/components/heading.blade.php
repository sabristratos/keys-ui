@php
    // Size classes (decoupled from semantic level)
    $sizeClasses = match ($size) {
        'xs' => 'text-xs',
        'sm' => 'text-sm',
        'md' => 'text-base',
        'lg' => 'text-lg',
        'xl' => 'text-xl',
        '2xl' => 'text-2xl',
        '3xl' => 'text-3xl',
        '4xl' => 'text-4xl',
        default => 'text-lg'
    };

    // Color classes using design tokens
    $colorClasses = match ($color) {
        'heading' => 'text-heading',
        'text' => 'text-primary',
        'muted' => 'text-muted',
        'brand' => $gradient ? 'bg-gradient-to-r from-accent to-accent-600 bg-clip-text text-transparent' : 'text-accent',
        'success' => 'text-success',
        'warning' => 'text-warning',
        'danger' => 'text-danger',
        'info' => 'text-info',
        default => 'text-heading'
    };

    // Weight classes
    $weightClasses = match ($weight) {
        'normal' => 'font-normal',
        'medium' => 'font-medium',
        'semibold' => 'font-semibold',
        'bold' => 'font-bold',
        'extrabold' => 'font-extrabold',
        default => 'font-semibold'
    };

    // Tracking (letter spacing) classes
    $trackingClasses = match ($tracking) {
        'tighter' => 'tracking-tighter',
        'tight' => 'tracking-tight',
        'normal' => 'tracking-normal',
        'wide' => 'tracking-wide',
        'wider' => 'tracking-wider',
        default => 'tracking-normal'
    };

    // Modifier classes
    $modifierClasses = '';
    if ($underline) {
        $modifierClasses .= ' underline decoration-2 underline-offset-4';
    }

    // Combine all classes
    $headingClasses = trim("$sizeClasses $colorClasses $weightClasses $trackingClasses $modifierClasses");
@endphp

<{{ $level }} {{ $attributes->merge(['class' => $headingClasses])->merge($dataAttributes) }}>
    {{ $slot }}
</{{ $level }}>
