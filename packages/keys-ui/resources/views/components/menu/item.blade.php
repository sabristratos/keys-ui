
@php
    $baseClasses = 'flex items-center w-full px-2 py-2 text-sm text-left transition-colors duration-150 rounded-md group relative';

    $stateClasses = $disabled
        ? 'text-neutral-400 cursor-not-allowed bg-neutral-disabled dark:text-neutral-500'
        : 'cursor-pointer';

    $variantClasses = $disabled ? '' : match ($variant) {
        'danger' => 'text-danger-600 hover:bg-danger-50 hover:text-danger-700 dark:text-danger-400 dark:hover:bg-danger-900/20',
        'success' => 'text-success-600 hover:bg-success-50 hover:text-success-700 dark:text-success-400 dark:hover:bg-success-900/20',
        'warning' => 'text-warning-600 hover:bg-warning-50 hover:text-warning-700 dark:text-warning-400 dark:hover:bg-warning-900/20',
        'brand' => 'text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/20',
        'info' => 'text-info-600 hover:bg-info-50 hover:text-info-700 dark:text-info-400 dark:hover:bg-info-900/20',
        default => 'text-foreground hover:bg-neutral-hover'
    };

    $iconClasses = 'flex-shrink-0 mr-3';
    $contentClasses = 'flex-1 min-w-0';
@endphp

<{{ $elementType }}
    {{ $attributes->merge(['class' => "$baseClasses $stateClasses $variantClasses"])->merge($elementAttributes) }}
>
    @if($hasIcon())
        @if($isMultiState())
            <x-keys::icon
                :name="$icon"
                size="sm"
                class="button-icon-default {{ $iconClasses }} transition-all duration-200"
            />

            @if($iconToggle)
                <x-keys::icon
                    :name="$iconToggle"
                    size="sm"
                    class="button-icon-toggle absolute opacity-0 transition-all duration-200 {{ $iconClasses }}"
                />
            @endif

            @if($iconSuccess)
                <x-keys::icon
                    :name="$iconSuccess"
                    size="sm"
                    class="button-icon-success absolute opacity-0 transition-all duration-200 text-success {{ $iconClasses }}"
                />
            @endif
        @else
            <x-keys::icon :name="$icon" size="sm" class="{{ $iconClasses }}" />
        @endif
    @endif

    <div class="{{ $contentClasses }}">
        {{ $slot }}
    </div>

    @if($hasKbd())
        <x-keys::kbd :keys="$kbd" variant="muted" size="xs" class="ml-auto" />
    @endif
</{{ $elementType }}>