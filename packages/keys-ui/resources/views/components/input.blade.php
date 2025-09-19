@php
    $inputAttributes = $attributes->whereStartsWith('wire:');
    $wrapperAttributes = $attributes->whereDoesntStartWith('wire:');

    $inputAttributes = $inputAttributes->merge(array_filter([
        'type' => $type,
        'class' => trim($baseClasses() . ' ' . $sizeClasses() . ' ' . $stateClasses() . ' ' . $iconPadding()),
        'name' => $name,
        'id' => $id,
        'value' => $value,
        'placeholder' => $placeholder,
        'disabled' => $disabled,
        'readonly' => $readonly,
        'required' => $required,
    ], fn($value) => !is_null($value)));

@endphp

@if($isShorthand())
    <div {{ $wrapperAttributes->only('class') }}>
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1">
            @include('keys::partials.input-field')
        </div>

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div class="relative" {{ $wrapperAttributes->only('class') }}>
        @include('keys::partials.input-field')
    </div>
@endif