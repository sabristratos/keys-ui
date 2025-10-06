
@php
    $baseClasses = 'flex items-center w-full gap-3 px-3 py-2 text-sm transition-all duration-150 rounded-md group relative';

    $stateClasses = $disabled
        ? 'text-muted cursor-not-allowed opacity-50'
        : 'cursor-pointer';

    $activeClasses = $active && !$disabled
        ? 'bg-accent/10 text-accent font-medium hover:bg-accent/15'
        : (!$disabled ? 'text-muted hover:text-primary hover:bg-neutral-hover' : '');

    $iconClasses = 'flex-shrink-0 w-5 h-5';
    $contentClasses = 'flex-1 min-w-0 truncate';

    $badgeClasses = match ($badgeVariant) {
        'brand' => 'bg-accent/10 text-accent',
        'success' => 'bg-success/10 text-success',
        'warning' => 'bg-warning/10 text-warning',
        'danger' => 'bg-danger/10 text-danger',
        default => 'bg-neutral-100 text-muted dark:bg-neutral-800'
    };
@endphp

<{{ $elementType }}
    {{ $attributes->merge(['class' => "$baseClasses $stateClasses $activeClasses"])->merge($elementAttributes) }}
    data-sidebar-item
    @if($icon)
        title="{{ trim((string) $slot) }}"
        data-tooltip-placement="right"
    @endif
>
    @if($icon)
        <div class="flex items-center justify-center lg:[.sidebar-collapsed_&]:mx-auto">
            @if($iconToggle || $iconSuccess)
                <x-keys::icon
                    :name="$icon"
                    size="sm"
                    class="button-icon-default {{ $iconClasses }} transition-all duration-200"
                />

                @if($iconToggle)
                    <x-keys::icon
                        :name="$iconToggle"
                        size="sm"
                        class="button-icon-toggle absolute left-3 opacity-0 transition-all duration-200 {{ $iconClasses }}"
                    />
                @endif

                @if($iconSuccess)
                    <x-keys::icon
                        :name="$iconSuccess"
                        size="sm"
                        class="button-icon-success absolute left-3 opacity-0 transition-all duration-200 text-success {{ $iconClasses }}"
                    />
                @endif
            @else
                <x-keys::icon :name="$icon" size="sm" class="{{ $iconClasses }}" />
            @endif
        </div>
    @endif

    <div class="{{ $contentClasses }} lg:[.sidebar-collapsed_&]:hidden">
        {{ $slot }}
    </div>

    @if($badge)
        <span class="text-xs font-medium px-2 py-0.5 rounded-full {{ $badgeClasses }} lg:[.sidebar-collapsed_&]:hidden">
            {{ $badge }}
        </span>
    @endif
</{{ $elementType }}>
