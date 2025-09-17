@props(['computedBodyClasses'])

<tbody {{ $attributes->merge(['class' => $computedBodyClasses]) }}>
    {{ $slot }}
</tbody>