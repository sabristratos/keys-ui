
@php
    $spacingClasses = match ($spacing) {
        'sm' => 'my-2',
        'md' => 'my-4',
        'lg' => 'my-6',
        default => 'my-4'
    };

    $labelClasses = 'px-4 text-xs font-semibold text-muted uppercase tracking-wider mb-2';
@endphp

<div class="{{ $spacingClasses }}" {{ $attributes->merge($dataAttributes) }}>
    @if($label)
        <div class="{{ $labelClasses }} lg:[.sidebar-collapsed_&]:hidden">
            {{ $label }}
        </div>
        <div class="border-t border-line mx-4 hidden lg:[.sidebar-collapsed_&]:block"></div>
    @else
        <div class="border-t border-line mx-4"></div>
    @endif
</div>
