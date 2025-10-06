@php
    // Size classes
    $sizeClasses = match ($size) {
        'xs' => 'text-xs',
        'sm' => 'text-sm',
        'md' => 'text-base',
        'lg' => 'text-lg',
        'xl' => 'text-xl',
        '2xl' => 'text-2xl',
        default => 'text-base'
    };

    // Color classes using design tokens
    $colorClasses = match ($color) {
        'heading' => 'text-heading',
        'text' => 'text-primary',
        'muted' => 'text-muted',
        'brand' => 'text-accent',
        'success' => 'text-success',
        'warning' => 'text-warning',
        'danger' => 'text-danger',
        'info' => 'text-info',
        default => 'text-primary'
    };

    // Weight classes
    $weightClasses = match ($weight) {
        'light' => 'font-light',
        'normal' => 'font-normal',
        'medium' => 'font-medium',
        'semibold' => 'font-semibold',
        'bold' => 'font-bold',
        default => 'font-normal'
    };

    // Alignment classes
    $alignClasses = match ($align) {
        'left' => 'text-left',
        'center' => 'text-center',
        'right' => 'text-right',
        'justify' => 'text-justify',
        default => ''
    };

    // Leading (line height) classes
    $leadingClasses = match ($leading) {
        'tight' => 'leading-tight',
        'normal' => 'leading-normal',
        'relaxed' => 'leading-relaxed',
        'loose' => 'leading-loose',
        default => 'leading-normal'
    };

    // Line clamp classes
    $lineClampClasses = match ($lineClamp) {
        '1' => 'line-clamp-1',
        '2' => 'line-clamp-2',
        '3' => 'line-clamp-3',
        '4' => 'line-clamp-4',
        '5' => 'line-clamp-5',
        '6' => 'line-clamp-6',
        'none' => '',
        default => ''
    };

    // Modifier classes
    $modifierClasses = '';
    if ($italic) {
        $modifierClasses .= ' italic';
    }
    if ($underline) {
        $modifierClasses .= ' underline';
    }
    if ($uppercase) {
        $modifierClasses .= ' uppercase';
    }
    if ($lowercase) {
        $modifierClasses .= ' lowercase';
    }
    if ($capitalize) {
        $modifierClasses .= ' capitalize';
    }

    // Combine all classes
    $textClasses = trim("$sizeClasses $colorClasses $weightClasses $alignClasses $leadingClasses $lineClampClasses $modifierClasses");
@endphp

<{{ $element }} {{ $attributes->merge(['class' => $textClasses])->merge($dataAttributes) }}>
    {{ $slot }}
</{{ $element }}>
