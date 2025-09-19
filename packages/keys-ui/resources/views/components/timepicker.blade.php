@php
    $timePickerAttributes = $attributes
        ->except(['class'])
        ->merge(array_filter([
            'data-timepicker' => 'true',
            'data-format' => $format,
            'data-format-mode' => $formatMode,
            'data-step' => $step,
            'data-show-seconds' => $showSeconds ? 'true' : 'false',
            'data-min-time' => $minTime,
            'data-max-time' => $maxTime,
            'data-disabled' => $disabled ? 'true' : 'false',
            'data-readonly' => $readonly ? 'true' : 'false',
            'data-clearable' => $clearable ? 'true' : 'false',
            'data-name' => $name,
            'data-value' => $value,
        ], fn($value) => !is_null($value)));
@endphp

@if($isShorthand())
    <div {{ $attributes->only('class') }}>
        <x-keys::label :for="$uniqueId" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1" {{ $timePickerAttributes }}>
            @include('keys::partials.timepicker-field')
        </div>

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div class="relative" {{ $attributes->only('class') }} {{ $timePickerAttributes }}>
        @include('keys::partials.timepicker-field')
    </div>
@endif