@php
    $justifyClasses = match ($justify) {
        'start' => 'justify-start',
        'center' => 'justify-center',
        'end' => 'justify-end',
        'between' => 'justify-between',
        'around' => 'justify-around',
        'evenly' => 'justify-evenly',
        default => 'justify-between'
    };
@endphp

@if($divider)
    <x-keys::separator spacing="none" />
@endif

<div class="flex items-center {{ $justifyClasses }}" data-keys-card-slot="footer">
    {{ $slot }}
</div>