@php
    $textareaAttributes = $attributes
        ->except(['class'])
        ->merge(array_filter([
            'class' => trim($baseClasses() . ' ' . $sizeClasses() . ' ' . $resizeClasses() . ' ' . $stateClasses() . ' ' . $iconPadding()),
            'name' => $name,
            'id' => $id,
            'placeholder' => $placeholder,
            'disabled' => $disabled,
            'readonly' => $readonly,
            'required' => $required,
            'rows' => $rows,
            'cols' => $cols,
        ], fn($value) => !is_null($value)));

@endphp

@if($isShorthand())
    <div {{ $attributes->only('class') }}>
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1">
            @include('keys::partials.textarea-field')
        </div>

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div class="relative" {{ $attributes->only('class') }}>
        @include('keys::partials.textarea-field')
    </div>
@endif