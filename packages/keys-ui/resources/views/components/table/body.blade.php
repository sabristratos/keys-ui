@php
    $bodyClasses = match ($variant) {
        'divided' => 'divide-y divide-line bg-elevation-1',
        'bordered' => 'divide-y divide-line bg-elevation-1 border-t border-line',
        default => 'divide-y divide-line bg-elevation-1'
    };
@endphp

<tbody {{ $attributes->merge(['class' => $bodyClasses])->merge($dataAttributes) }}>
    {{ $slot }}
</tbody>