<x-keys::popover
    :id="$id"
    :size="$size"
    :placement="$computedPlacement"
    {{ $attributes->merge($computedDataAttributes) }}
>
    <x-slot:trigger>
        {{ $trigger }}
    </x-slot:trigger>

    {{ $panel }}
</x-keys::popover>