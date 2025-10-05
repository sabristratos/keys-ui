
@php
    $baseClasses = 'flex flex-col gap-0.5 outline-none';
@endphp

<div
    {{ $attributes->merge(['class' => $baseClasses, 'id' => $id])->merge($ariaAttributes)->merge($dataAttributes) }}
>
    {{ $slot }}
</div>
