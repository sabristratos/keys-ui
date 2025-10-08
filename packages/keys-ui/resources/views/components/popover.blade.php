@php
    // Trigger styles for CSS anchor positioning
    $triggerStyles = "anchor-name: --trigger-{$id};";

    // Base popover classes
    $baseClasses = 'keys-popover z-[2000] px-3 pb-3 pt-1 -mx-3 border-0 bg-transparent text-inherit';

    // Content base classes
    $contentBase = 'bg-overlay space-y-1 rounded-lg shadow-lg text-primary max-w-[90vw] w-max';

    // Size-based classes
    $sizeClasses = match ($size) {
        'sm' => 'p-1 text-xs min-w-40 sm:min-w-46 leading-5',
        'md' => 'p-2 text-sm min-w-48 sm:min-w-60 leading-6',
        'lg' => 'p-3 text-base min-w-56 sm:min-w-80 leading-7',
        default => 'p-2 text-sm min-w-48 sm:min-w-60 leading-6'
    };

    // Variant-based classes
    $variantClasses = match ($variant) {
        'tooltip' => 'bg-neutral-900 dark:bg-neutral-800 text-white border-0 text-xs px-2.5 py-1.5',
        'menu' => 'p-2 min-w-40',
        default => ''
    };

    // Combine content classes
    $contentClasses = trim("$contentBase $sizeClasses $variantClasses");

    // Arrow classes (only if arrow is enabled)
    $arrowBase = 'keys-popover__arrow absolute w-2 h-2 rotate-45 -z-10';
    $arrowVariant = match ($variant) {
        'tooltip' => 'bg-neutral-900 dark:bg-neutral-800 border-0',
        default => 'bg-overlay border border-line'
    };
    $arrowClasses = trim("$arrowBase $arrowVariant");
@endphp

{{-- Trigger wrapper with anchor-name for CSS positioning --}}
<div style="{{ $triggerStyles }}" data-popover-trigger="{{ $id }}">
    {{ $trigger }}
</div>

{{-- Popover element - uses native Popover API for top layer rendering --}}
<div
    id="{{ $id }}"
    popover="{{ $manual ? 'manual' : 'auto' }}"
    style="--popover-anchor: --trigger-{{ $id }};"
    {{ $attributes->merge($dataAttributes)->class($baseClasses) }}
>
    @if($arrow)
        <div class="{{ $arrowClasses }}"></div>
    @endif

    <div class="{{ $contentClasses }}">
        {{ $slot }}
    </div>
</div>
