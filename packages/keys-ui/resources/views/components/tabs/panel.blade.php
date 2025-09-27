@php
    // Panel classes
    $baseClasses = 'tabs-panel focus-visible:outline-none';
    $customClasses = $className ?? '';
    $panelClasses = trim("$baseClasses $customClasses");
@endphp

<div {{ $attributes->merge(['class' => $panelClasses])->merge($dataAttributes) }}>
    {{ $slot }}
</div>