@props(['computedPopoverClasses', 'computedPanelClasses', 'computedTriggerClasses', 'computedTitleClasses', 'computedDataAttributes', 'title'])

{{-- Wrapper container containing trigger and panel --}}
<div class="{{ $computedPopoverClasses }}" {{ $attributes->merge($computedDataAttributes) }}>

    {{-- Trigger element --}}
    <div class="{{ $computedTriggerClasses }}" data-popover-trigger>
        {{ $trigger }}
    </div>

    {{-- Popover panel --}}
    <div class="{{ $computedPanelClasses }}" data-popover-panel>
        @if($title)
            <div id="{{ $id }}-title" class="{{ $computedTitleClasses }}">
                {{ $title }}
            </div>
        @endif

        {{ $slot }}

        @if($arrow)
            <div class="absolute w-0 h-0" data-popper-arrow></div>
        @endif
    </div>
</div>