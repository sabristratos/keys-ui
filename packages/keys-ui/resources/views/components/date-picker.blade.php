@php
    $wireOnlyAttributes = $attributes->whereStartsWith('wire:');
    $nonWireAttributes = $attributes->whereDoesntStartWith('wire:');
    $isLivewireEnabled = $wireOnlyAttributes->isNotEmpty();

    if ($isLivewireEnabled) {
        $dataAttributes = array_merge($dataAttributes, [
            'data-livewire-enabled' => 'true',
            'data-livewire-mode' => 'true',
        ]);

        $wireModelName = $wireOnlyAttributes->whereStartsWith('wire:model')->first();
        if ($wireModelName) {
            $dataAttributes['data-wire-model'] = $wireModelName;
            $dataAttributes['data-livewire-property'] = $wireModelName;
        }
    }

    $datePickerAttributes = $nonWireAttributes
        ->except(['class'])
        ->merge($dataAttributes);

    // Ensure calendar data is properly formatted for JavaScript
    $calendarDataJson = htmlspecialchars(json_encode($calendarData), ENT_QUOTES, 'UTF-8');
    $datePickerAttributes['data-date-picker-config'] = $calendarDataJson;

    $baseClasses = 'flex items-center justify-between w-full rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer';

    $sizeClasses = match ($size) {
        'sm' => 'px-3 py-1.5 text-sm',
        'md' => 'px-3 py-2 text-sm',
        'lg' => 'px-4 py-2.5 text-base',
        default => 'px-3 py-2 text-sm'
    };

    $stateClasses = '';
    if ($disabled) {
        $stateClasses = 'bg-surface border-border text-muted cursor-not-allowed opacity-50';
    } elseif ($hasError()) {
        $stateClasses = 'bg-input border-danger text-foreground focus-visible:border-danger focus-visible:ring-danger';
    } else {
        $stateClasses = 'bg-input border-border text-foreground focus-visible:border-brand focus-visible:ring-brand hover:border-neutral';
    }

    $iconSize = match ($size) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };

    $rightPadding = match ($size) {
        'sm' => 'pr-3',
        'md' => 'pr-4',
        'lg' => 'pr-5',
        default => 'pr-4'
    };

    $triggerClasses = "$baseClasses $sizeClasses $stateClasses $rightPadding";

    $inputBaseClasses = 'block w-full rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
    $inputLeftPadding = match ($size) {
        'sm' => $iconLeft ? 'pl-8' : 'pl-3',
        'md' => $iconLeft ? 'pl-10' : 'pl-3',
        'lg' => $iconLeft ? 'pl-12' : 'pl-4',
        default => $iconLeft ? 'pl-10' : 'pl-3'
    };
    $inputRightPadding = match ($size) {
        'sm' => ($iconRight || $clearable || $showCalendarIcon) ? 'pr-12' : 'pr-3',
        'md' => ($iconRight || $clearable || $showCalendarIcon) ? 'pr-14' : 'pr-3',
        'lg' => ($iconRight || $clearable || $showCalendarIcon) ? 'pr-16' : 'pr-4',
        default => ($iconRight || $clearable || $showCalendarIcon) ? 'pr-14' : 'pr-3'
    };
    $inputClasses = "$inputBaseClasses $sizeClasses $stateClasses $inputLeftPadding $inputRightPadding";

    $dropdownWidthClasses = 'w-auto min-w-full max-w-lg';
@endphp

@if($isShorthand())
    <div {{ $attributes->only('class') }}>
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1" {{ $datePickerAttributes }}>
            @include('keys::partials.date-picker-content')
        </div>

        @if($showErrors && $hasError())
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div {{ $attributes->only('class') }} @if(!$isShorthand()) {{ $datePickerAttributes }} @endif>
        @include('keys::partials.date-picker-content')

        @if($showErrors && $hasError())
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@endif