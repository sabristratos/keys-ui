
<x-keys::popover
    :id="$id"
    :placement="$computedPlacement"
    {{ $attributes->merge($computedDataAttributes) }}
>
    <x-slot:trigger>
        {{ $trigger }}
    </x-slot:trigger>

    {{-- Dropdown content goes directly in the Popover slot --}}
    {{ $slot }}
</x-keys::popover>