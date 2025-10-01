
{{-- Trigger wrapper with anchor-name for CSS positioning and data attribute for JavaScript --}}
@php
    $triggerStyles = "anchor-name: --trigger-{$id};";
@endphp

<div style="{{ $triggerStyles }}" data-popover-trigger="{{ $id }}">
    {{ $trigger }}
</div>

{{-- Popover element - uses native Popover API for top layer rendering --}}
<div
    id="{{ $id }}"
    popover="{{ $manual ? 'manual' : 'auto' }}"
    data-keys-popover="true"
    data-variant="{{ $variant }}"
    data-size="{{ $size }}"
    data-placement="{{ $placement }}"
    class="{{ $baseClasses }}"
    style="--popover-anchor: --trigger-{{ $id }};"
>

    @if($arrow)
        <div class="{{ $arrowClasses }}"></div>
    @endif


    <div class="{{ $contentClasses }}">
        {{ $slot }}
    </div>
</div>