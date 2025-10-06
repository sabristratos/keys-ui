@once
<style>
/* Accordion - Custom CSS that can't be expressed as Tailwind utilities */

/* Remove webkit details marker (pseudo-element can't be styled with Tailwind) */
details[data-keys-accordion] summary::-webkit-details-marker {
    display: none;
}

/* Reduced motion accessibility - Complex media query with !important overrides */
@media (prefers-reduced-motion: reduce) {
    details[data-keys-accordion] .accordion-content-wrapper {
        transition-duration: 0.01ms !important;
    }
    details[data-keys-accordion] * {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
    }
}
</style>
@endonce

@php
    $attributes = $attributes->except(['title', 'icon', 'collapsed', 'disabled', 'color', 'size', 'actions', 'actionVariant', 'actionSize', 'animated']);

    $baseClasses = 'group overflow-hidden transition-all duration-200';

    $variantClasses = match ($variant) {
        'default' => 'bg-elevation-1 border border-line',
        'flush' => 'bg-transparent border-0',
        'spaced' => 'bg-elevation-1 border border-line mb-3',
        'outlined' => 'bg-transparent border border-line',
        'elevated' => 'bg-elevation-1 border border-line shadow-md',
        default => 'bg-elevation-1 border border-line'
    };

    $roundedClasses = match ($rounded) {
        'none' => '',
        'xs' => 'rounded-sm',
        'sm' => 'rounded',
        'md' => 'rounded-md',
        'lg' => 'rounded-lg',
        'xl' => 'rounded-xl',
        '2xl' => 'rounded-2xl',
        '3xl' => 'rounded-3xl',
        default => 'rounded-lg'
    };

    $sizeClasses = match ($size) {
        'xs' => 'px-3 py-2 text-sm',
        'sm' => 'px-4 py-3 text-sm',
        'md' => 'px-4 py-3 text-base',
        'lg' => 'px-6 py-4 text-lg',
        default => 'px-4 py-3 text-base'
    };

    $summaryColorClasses = $variant === 'flush'
        ? match ($color) {
            'brand' => 'hover:bg-accent/5 text-accent',
            'success' => 'hover:bg-success/5 text-success',
            'warning' => 'hover:bg-warning/5 text-warning',
            'danger' => 'hover:bg-danger/5 text-danger',
            default => 'hover:bg-neutral/5 text-primary'
        }
        : match ($color) {
            'brand' => 'bg-accent/5 hover:bg-accent/10 text-accent',
            'success' => 'bg-success/5 hover:bg-success/10 text-success',
            'warning' => 'bg-warning/5 hover:bg-warning/10 text-warning',
            'danger' => 'bg-danger/5 hover:bg-danger/10 text-danger',
            default => 'bg-elevation-1 hover:bg-neutral/5 text-primary'
        };

    $contentWrapperClasses = 'grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-open:grid-rows-[1fr] group-open:opacity-100';

    $contentInnerClasses = 'overflow-hidden';

    $contentColorClasses = $variant === 'flush'
        ? match ($color) {
            'brand' => 'text-accent',
            'success' => 'text-success',
            'warning' => 'text-warning',
            'danger' => 'text-danger',
            default => 'text-muted'
        }
        : match ($color) {
            'brand' => 'bg-accent/5 text-accent',
            'success' => 'bg-success/5 text-success',
            'warning' => 'bg-warning/5 text-warning',
            'danger' => 'bg-danger/5 text-danger',
            default => 'bg-elevation-1 text-muted'
        };

    $contentSizeClasses = match ($size) {
        'xs' => 'px-3 py-2',
        'sm' => 'px-4 py-3',
        'md' => 'px-4 py-3',
        'lg' => 'px-6 py-4',
        default => 'px-4 py-3'
    };

    $iconSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'sm',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };

    $disabledClasses = $disabled ? 'opacity-50 cursor-not-allowed' : '';
    $summaryDisabledClasses = $disabled ? 'cursor-not-allowed' : 'cursor-pointer';

    $contentBorderClass = $variant === 'flush' ? '' : 'border-t border-line';

    $preparedActionData = [];
    foreach ($computedActionData as $action) {
        $preparedActionData[] = [
            'variant' => $actionVariant,
            'size' => $computedActionSize,
            'icon' => $action['icon'],
            'icon_toggle' => $action['icon_toggle'],
            'icon_success' => $action['icon_success'],
            'data_action' => $action['data_action'],
            'data_url' => $action['data_url'] ?? null,
            'label' => $action['label']
        ];
    }

    $detailsClasses = trim("{$baseClasses} {$variantClasses} {$roundedClasses} {$disabledClasses}");
    $summaryClasses = trim("list-none flex items-center justify-between w-full select-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 disabled:pointer-events-none {$sizeClasses} {$summaryColorClasses} {$summaryDisabledClasses}");
    $contentClasses = trim("{$contentBorderClass} {$contentSizeClasses} {$contentColorClasses}");
@endphp

<details
    id="{{ $id }}"
    class="{{ $detailsClasses }}"
    {{ $collapsed ? '' : 'open' }}
    {{ $disabled ? 'disabled' : '' }}
    {{ $attributes->merge($dataAttributes) }}
>
    <summary class="{{ $summaryClasses }}" tabindex="{{ $disabled ? '-1' : '0' }}">
        <div class="flex items-center gap-3 flex-1 min-w-0">
            @if($title)
                <span class="font-medium truncate">{{ $title }}</span>
            @endif
        </div>

        <div class="flex items-center gap-2 ml-auto">
            @if($hasActions())
                <div class="flex items-center gap-1">
                    @foreach($preparedActionData as $actionData)
                        @if($actionData['data_url'])
                            <x-keys::button
                                variant="{{ $actionData['variant'] }}"
                                size="{{ $actionData['size'] }}"
                                icon="{{ $actionData['icon'] }}"
                                icon-toggle="{{ $actionData['icon_toggle'] }}"
                                icon-success="{{ $actionData['icon_success'] }}"
                                data-action="{{ $actionData['data_action'] }}"
                                data-url="{{ $actionData['data_url'] }}"
                                onclick="event.stopPropagation();">
                                <span class="sr-only">{{ $actionData['label'] }}</span>
                            </x-keys::button>
                        @else
                            <x-keys::button
                                variant="{{ $actionData['variant'] }}"
                                size="{{ $actionData['size'] }}"
                                icon="{{ $actionData['icon'] }}"
                                icon-toggle="{{ $actionData['icon_toggle'] }}"
                                icon-success="{{ $actionData['icon_success'] }}"
                                data-action="{{ $actionData['data_action'] }}"
                                onclick="event.stopPropagation();">
                                <span class="sr-only">{{ $actionData['label'] }}</span>
                            </x-keys::button>
                        @endif
                    @endforeach
                </div>
            @endif

            @if($icon)
                <div class="transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-open:rotate-180 {{ $disabled ? 'opacity-50' : '' }}">
                    <x-keys::icon :name="$icon" :size="$iconSize" />
                </div>
            @endif
        </div>
    </summary>

    <div class="{{ $contentWrapperClasses }}">
        <div class="{{ $contentInnerClasses }} {{ $contentClasses }}">
            {{ $slot }}
        </div>
    </div>

</details>