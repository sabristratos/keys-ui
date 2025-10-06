
@php
    $itemClasses = 'flex items-center w-full px-2 py-2 text-sm transition-colors duration-150 rounded-md cursor-pointer';

    // Item background state (with checked state)
    $itemStateClasses = $disabled
        ? 'text-muted cursor-not-allowed opacity-50'
        : 'text-primary hover:bg-neutral-hover';

    $itemCheckedClasses = !$disabled ? match ($color) {
        'brand' => 'has-[:checked]:bg-accent-subtle has-[:checked]:text-accent',
        'success' => 'has-[:checked]:bg-success-subtle has-[:checked]:text-success',
        'warning' => 'has-[:checked]:bg-warning-subtle has-[:checked]:text-warning',
        'danger' => 'has-[:checked]:bg-danger-subtle has-[:checked]:text-danger',
        'info' => 'has-[:checked]:bg-info-subtle has-[:checked]:text-info',
        'neutral' => 'has-[:checked]:bg-elevation-1 has-[:checked]:text-muted',
        default => 'has-[:checked]:bg-accent-subtle has-[:checked]:text-accent'
    } : '';

    $checkboxBase = 'h-4 w-4 border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded';

    $checkboxStateClasses = $disabled
        ? 'bg-elevation-1 border-line text-muted cursor-not-allowed opacity-50'
        : 'bg-input border-line';

    $checkboxColorClasses = $disabled ? '' : match ($color) {
        'brand' => 'text-accent focus-visible:ring-accent hover:border-accent',
        'success' => 'text-success focus-visible:ring-success hover:border-success',
        'warning' => 'text-warning focus-visible:ring-warning hover:border-warning',
        'danger' => 'text-danger focus-visible:ring-danger hover:border-danger',
        'info' => 'text-info focus-visible:ring-info hover:border-info',
        'neutral' => 'text-muted focus-visible:ring-border hover:border-muted',
        default => 'text-accent focus-visible:ring-accent hover:border-accent'
    };

    $iconClasses = 'flex-shrink-0 mr-3';
    $contentClasses = 'flex-1 min-w-0 ml-3';
    $labelTextClasses = 'block text-sm font-medium text-heading';
@endphp

<label {{ $attributes->merge(['class' => "$itemClasses $itemStateClasses $itemCheckedClasses"])->merge($labelAttributes)->merge($dataAttributes) }}>
    @if($hasIcon())
        <x-keys::icon :name="$icon" size="sm" class="{{ $iconClasses }}" />
    @endif

    <input {{ $attributes->merge(['class' => "$checkboxBase $checkboxStateClasses $checkboxColorClasses"])->merge($checkboxAttributes) }}>

    <div class="{{ $contentClasses }}">
        <span class="{{ $labelTextClasses }}">
            {{ $slot }}
        </span>
    </div>
</label>
