
<div
    class="{{ $computedMenuClasses }}"
    id="{{ $id }}"
    {{ $attributes->merge($computedAriaAttributes)->merge($computedDataAttributes) }}
>
    {{ $slot }}
</div>