@props(['computedCellClasses'])

<td {{ $attributes->merge(['class' => $computedCellClasses]) }}>
    {{ $slot }}
</td>