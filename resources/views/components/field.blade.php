@php
    $fieldAttributes = $attributes->merge([
        'class' => trim($baseClasses() . ' ' . $spacingClasses())
    ]);
@endphp

<div {{ $fieldAttributes }}>
    {{ $slot }}
</div>