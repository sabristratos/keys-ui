@php
    $bodyClasses = match ($variant) {
        'divided' => 'divide-y divide-border bg-surface',
        'bordered' => 'divide-y divide-border bg-surface border-t border-border',
        default => 'divide-y divide-border bg-surface'
    };
@endphp

<tbody {{ $attributes->merge(['class' => $bodyClasses])->merge($dataAttributes) }}>
    {{ $slot }}
</tbody>