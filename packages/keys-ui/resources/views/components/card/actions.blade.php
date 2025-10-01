@php
    $positionClasses = match ($position) {
        'start' => 'justify-start',
        'center' => 'justify-center',
        'end' => 'justify-end',
        'between' => 'justify-between',
        default => 'justify-end'
    };

    $spacingClasses = match ($spacing) {
        'tight' => 'space-x-1',
        'default' => 'space-x-2',
        'relaxed' => 'space-x-3',
        'loose' => 'space-x-4',
        default => 'space-x-2'
    };

    $variantClasses = match ($variant) {
        'buttons' => 'flex items-center',
        'menu' => 'flex flex-col space-y-1 space-x-0',
        'inline' => 'inline-flex items-center',
        default => 'flex items-center'
    };

    $actionClasses = trim("$variantClasses $positionClasses $spacingClasses");
@endphp

<div class="{{ $actionClasses }}" data-keys-card-slot="actions">
    {{ $slot }}
</div>