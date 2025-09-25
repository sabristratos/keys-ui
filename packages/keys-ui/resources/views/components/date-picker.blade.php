@php
    $wireAttributes = $attributes->whereStartsWith('wire:');
    $containerAttributes = $attributes->whereDoesntStartWith('wire:')->merge([
        'class' => 'date-picker-container relative',
        'data-date-picker' => 'true',
        'data-date-picker-config' => json_encode($calendarData),
        'data-inline' => $inline ? 'true' : 'false',
        'data-disabled' => $disabled ? 'true' : 'false',
        'data-size' => $size,
        'id' => $id . '-container'
    ]);
@endphp

@if($isShorthand())
    <x-keys::field :label="$label" :optional="$optional" :required="$required" :errors="$errors" :showErrors="$showErrors">
        <div {{ $containerAttributes }}>
            @include('keys::components.date-picker-content')
        </div>
    </x-keys::field>
@else
    <div {{ $containerAttributes }}>
        @include('keys::components.date-picker-content')
    </div>
@endif

