@php
    $inputAttributes = $attributes->whereStartsWith('wire:');
    $wrapperAttributes = $attributes->whereDoesntStartWith('wire:');

    // Base classes for all inputs
    $baseClasses = 'block w-full rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    // Size classes
    $sizeClasses = match ($size) {
        'xs' => 'px-2.5 py-1 text-xs',
        'sm' => 'px-3 py-1.5 text-sm',
        'md' => 'px-3 py-2 text-sm',
        'lg' => 'px-4 py-2.5 text-base',
        'xl' => 'px-4 py-3 text-base',
        default => 'px-3 py-2 text-sm'
    };

    // State classes
    $stateClasses = '';
    if ($disabled) {
        $stateClasses = 'bg-surface border-border text-muted cursor-not-allowed opacity-50';
    } elseif ($hasError()) {
        $stateClasses = 'bg-input border-danger text-foreground focus-visible:border-danger focus-visible:ring-danger';
    } else {
        $stateClasses = 'bg-input border-border text-foreground focus-visible:border-brand focus-visible:ring-brand hover:border-neutral';
    }

    // Icon padding
    $leftPadding = '';
    $rightPadding = '';

    if ($iconLeft) {
        $leftPadding = match ($size) {
            'xs' => 'pl-7',
            'sm' => 'pl-8',
            'md' => 'pl-10',
            'lg' => 'pl-12',
            'xl' => 'pl-12',
            default => 'pl-10'
        };
    }

    if ($iconRight || $hasActions()) {
        if ($hasActions()) {
            // Calculate action padding dynamically
            $actionsCount = count($configuredActions());
            $actionWidth = match ($actionSize) {
                'xs' => 24,
                'sm' => 32,
                'md' => 40,
                default => 24
            };
            $totalWidth = ($actionsCount * $actionWidth) + (($actionsCount - 1) * 4) + 8;
            $rightPadding = 'pr-' . ceil($totalWidth / 4);
        } else {
            $rightPadding = match ($size) {
                'xs' => 'pr-7',
                'sm' => 'pr-8',
                'md' => 'pr-10',
                'lg' => 'pr-12',
                'xl' => 'pr-12',
                default => 'pr-10'
            };
        }
    }

    $iconPaddingClasses = trim($leftPadding . ' ' . $rightPadding);

    $inputAttributes = $inputAttributes->merge(array_filter([
        'type' => $type,
        'class' => trim("$baseClasses $sizeClasses $stateClasses $iconPaddingClasses"),
        'name' => $name,
        'id' => $id,
        'value' => $value,
        'placeholder' => $placeholder,
        'disabled' => $disabled,
        'readonly' => $readonly,
        'required' => $required,
    ], fn($value) => !is_null($value)));

    // Extract custom data attributes and merge with component data attributes
    $customDataAttributes = $attributes->whereStartsWith('data-')->toArray();
    $inputAttributes = $inputAttributes->merge($dataAttributes)->merge($customDataAttributes);
@endphp

@if($isShorthand())
    <div {{ $wrapperAttributes->only('class') }}>
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1 focus-within:[&_[data-icon]]:text-brand">
            @include('keys::partials.input-field')
        </div>

        @if($hint)
            <p class="mt-1 text-xs text-muted">{{ $hint }}</p>
        @endif

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div class="relative focus-within:[&_[data-icon]]:text-brand" {{ $wrapperAttributes->only('class') }}>
        @include('keys::partials.input-field')
    </div>
@endif