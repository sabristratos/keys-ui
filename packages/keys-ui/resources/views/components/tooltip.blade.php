{{-- Simplified Tooltip Component using consistent Popover API --}}
<x-keys::popover
    :id="$id"
    :placement="$placement"
    :arrow="$arrow"
    variant="tooltip"
    :manual="$trigger !== 'hover'"
    {{ $attributes->merge($computedDataAttributes) }}
>
    <x-slot:trigger>
        {{ $trigger }}
    </x-slot:trigger>

    <div class="{{ $computedContentClasses }}">
        {{ $slot }}
    </div>
</x-keys::popover>

