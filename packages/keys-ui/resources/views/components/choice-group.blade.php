@php

    $fieldsetClasses = 'space-y-3';

    $legendSizeClasses = match ($size) {
        'sm' => 'text-sm',
        'md' => 'text-base',
        'lg' => 'text-lg',
        default => 'text-base'
    };
    $legendColorClasses = $disabled ? 'text-neutral-500 dark:text-neutral-400' : 'text-primary';
    $legendClasses = trim('font-medium mb-2 ' . $legendSizeClasses . ' ' . $legendColorClasses);

    $descriptionSizeClasses = match ($size) {
        'sm' => 'text-xs',
        'md' => 'text-sm',
        'lg' => 'text-sm',
        default => 'text-sm'
    };
    $descriptionClasses = trim('text-muted mb-3 ' . $descriptionSizeClasses);

    $choicesClasses = match ($layout) {
        'stacked' => 'space-y-3',
        'grid' => 'grid grid-cols-1 md:grid-cols-2 gap-3',
        'inline' => 'flex flex-wrap gap-4',
        default => 'space-y-3'
    };
@endphp

<fieldset {{ $attributes->merge(['class' => $fieldsetClasses])->merge($dataAttributes)->merge($accessibilityAttributes) }}>
    @if($hasLegend())
        <legend class="{{ $legendClasses }}">
            {{ $legend }}
            @if($required)
                <span class="text-danger ml-1">*</span>
            @endif
        </legend>
    @endif

    @if($hasDescription())
        <p id="{{ $getDescriptionId() }}" class="{{ $descriptionClasses }}">
            {{ $description }}
        </p>
    @endif

    <div class="{{ $choicesClasses }}" role="{{ $isRadioGroup() ? 'radiogroup' : 'group' }}">
        {{ $slot }}
    </div>

    @if($showErrors && !is_null($errors))
        <x-keys::error :messages="$errors" />
    @endif
</fieldset>