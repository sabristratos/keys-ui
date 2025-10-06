
@php
    $baseClasses = 'flex items-center w-full px-2 py-2 text-sm text-left transition-colors duration-150 rounded-md group relative';

    $stateClasses = $disabled
        ? 'text-muted cursor-not-allowed opacity-50'
        : 'cursor-pointer';

    $variantClasses = $disabled ? '' : match ($variant) {
        'danger' => 'text-danger hover:bg-danger-subtle',
        'success' => 'text-success hover:bg-success-subtle',
        'warning' => 'text-warning hover:bg-warning-subtle',
        'brand' => 'text-accent hover:bg-accent-subtle',
        'info' => 'text-info hover:bg-info-subtle',
        default => 'text-primary hover:bg-neutral-hover'
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
