@props(['computedHeadClasses'])

<thead {{ $attributes->merge(['class' => $computedHeadClasses]) }}>
    {{ $slot }}
</thead>