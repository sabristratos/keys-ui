
<x-keys::popover
    :id="$id"
    :placement="$computedPlacement"
    {{ $attributes->merge($computedDataAttributes) }}
>
    <x-slot:trigger>
        {{ $trigger }}
    </x-slot:trigger>

    
    {{ $slot }}
</x-keys::popover>