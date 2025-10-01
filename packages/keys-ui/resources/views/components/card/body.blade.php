@php
    $spacingClasses = match ($spacing) {
        'compact' => 'space-y-1',
        'default' => 'space-y-3',
        'relaxed' => 'space-y-4',
        'loose' => 'space-y-6',
        default => 'space-y-3'
    };
@endphp

<div class="{{ $spacingClasses }}" data-keys-card-slot="body">
    {{ $slot }}
</div>