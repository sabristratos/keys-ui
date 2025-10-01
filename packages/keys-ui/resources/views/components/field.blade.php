@php

    $spacingClasses = match ($spacing) {
        'none' => 'space-y-0',
        'sm' => 'space-y-1',
        'md' => 'space-y-1',
        'lg' => 'space-y-2',
        default => 'space-y-1'
    };

    $fieldAttributes = $attributes->merge([
        'class' => $spacingClasses
    ])->merge($dataAttributes);

    if ($id) {
        $fieldAttributes = $fieldAttributes->merge(['id' => $id]);
    }
@endphp

<div {{ $fieldAttributes }}>
    {{ $slot }}
</div>