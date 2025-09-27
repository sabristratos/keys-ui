
@php
    $itemClasses = 'flex items-center w-full px-2 py-2 text-sm transition-colors duration-150 rounded-md cursor-pointer';

    $stateClasses = $disabled
        ? 'text-neutral-400 cursor-not-allowed bg-neutral-disabled dark:text-neutral-500'
        : "text-foreground hover:bg-neutral-hover has-[:checked]:bg-{$color}-50 has-[:checked]:text-{$color}-700 dark:has-[:checked]:bg-{$color}-900/20 dark:has-[:checked]:text-{$color}-300";

    $radioBase = 'h-4 w-4 border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-full';

    $radioStateClasses = $disabled
        ? 'bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700'
        : 'bg-input';

    $radioColorClasses = $disabled ? '' : match ($color) {
        'brand' => 'text-brand focus-visible:ring-brand border-border hover:border-brand',
        'success' => 'text-success focus-visible:ring-success border-border hover:border-success',
        'warning' => 'text-warning focus-visible:ring-warning border-border hover:border-warning',
        'danger' => 'text-danger focus-visible:ring-danger border-border hover:border-danger',
        'neutral' => 'text-neutral-600 focus-visible:ring-neutral-500 border-border hover:border-neutral-400',
        default => 'text-brand focus-visible:ring-brand border-border hover:border-brand'
    };

    $iconClasses = 'flex-shrink-0 mr-3';
    $contentClasses = 'flex-1 min-w-0 ml-3';
    $labelTextClasses = 'block text-sm font-medium text-foreground';
@endphp

<label {{ $attributes->merge(['class' => "$itemClasses $stateClasses"])->merge($labelAttributes)->merge($dataAttributes) }}>
    @if($hasIcon())
        <x-keys::icon :name="$icon" size="sm" class="{{ $iconClasses }}" />
    @endif

    <input {{ $attributes->merge(['class' => "$radioBase $radioStateClasses $radioColorClasses"])->merge($radioAttributes) }}>

    <div class="{{ $contentClasses }}">
        <span class="{{ $labelTextClasses }}">
            {{ $slot }}
        </span>
    </div>
</label>