@php
    $slotContent = $slot->toHtml();
    $isIconOnly = $isIconOnly($slotContent);
    $elementTag = $dismissible ? 'button' : 'span';
    $elementAttributes = $dismissible ? [
        'type' => 'button',
        'data-dismiss-target' => "#$id",
        'aria-label' => __('keys-ui::keys-ui.actions.remove_badge')
    ] : [];

    // Base classes
    $baseClasses = $variant === 'subtle'
        ? 'inline-flex items-center gap-1.5 font-medium'
        : 'inline-flex items-center font-medium rounded-full';

    if ($variant !== 'subtle') {
        if ($isIconOnly) {
            $baseClasses .= ' justify-center flex-shrink-0';
        } elseif ($dismissible) {
            $baseClasses .= ' justify-between cursor-pointer transition-colors';
        }
    }

    // Size classes
    if ($variant === 'subtle') {
        $sizeClasses = match ($size) {
            'xs' => 'text-xs',
            'sm' => 'text-xs',
            'md' => 'text-sm',
            default => 'text-xs'
        };
    } else {
        $sizeClasses = $isIconOnly
            ? match ($size) {
                'xs' => 'w-4 h-4 p-0.5',
                'sm' => 'w-5 h-5 p-1',
                'md' => 'w-6 h-6 p-1.5',
                default => 'w-5 h-5 p-1'
            }
            : match ($size) {
                'xs' => 'px-1.5 py-0.5 text-xs',
                'sm' => 'px-2.5 py-0.5 text-xs',
                'md' => 'px-3 py-1 text-sm',
                default => 'px-2.5 py-0.5 text-xs'
            };
    }

    // Color classes by variant
    $colorClasses = match ($variant) {
        'filled' => match ($color) {
            'brand' => 'bg-accent text-white',
            'success' => 'bg-success text-white',
            'warning' => 'bg-warning text-white',
            'danger' => 'bg-danger text-white',
            'info' => 'bg-info text-white',
            'neutral' => 'bg-muted text-white',
            default => 'bg-info text-white'
        },
        'outlined' => match ($color) {
            'brand' => 'bg-accent-subtle border border-accent text-accent',
            'success' => 'bg-success-subtle border border-success text-success',
            'warning' => 'bg-warning-subtle border border-warning text-warning',
            'danger' => 'bg-danger-subtle border border-danger text-danger',
            'info' => 'bg-info-subtle border border-info text-info',
            'neutral' => 'bg-elevation-1 border border-line text-muted',
            default => 'bg-info-subtle border border-info text-info'
        },
        'subtle' => 'text-primary',
        default => 'bg-info text-white'
    };

    // Hover classes (only for dismissible filled/outlined badges)
    $hoverClasses = ($dismissible && $variant === 'filled')
        ? match ($color) {
            'brand' => 'hover:bg-accent-hover',
            'success' => 'hover:bg-success-hover',
            'warning' => 'hover:bg-warning-hover',
            'danger' => 'hover:bg-danger-hover',
            'info' => 'hover:bg-info-hover',
            'neutral' => 'hover:bg-hover',
            default => 'hover:bg-info-hover'
        }
        : (($dismissible && $variant === 'outlined')
            ? match ($color) {
                'brand' => 'hover:bg-accent-100',
                'success' => 'hover:bg-success-100',
                'warning' => 'hover:bg-warning-100',
                'danger' => 'hover:bg-danger-100',
                'info' => 'hover:bg-info-100',
                'neutral' => 'hover:bg-neutral-hover',
                default => 'hover:bg-info-100'
            }
            : '');

    // Dot color for subtle variant
    $dotColorClasses = match ($color) {
        'brand' => 'text-accent',
        'success' => 'text-success',
        'warning' => 'text-warning',
        'danger' => 'text-danger',
        'info' => 'text-info',
        'neutral' => 'text-muted',
        default => 'text-info'
    };

    $iconSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'sm',
        'md' => 'md',
        default => 'sm'
    };

    $badgeClasses = trim("$baseClasses $sizeClasses $colorClasses $hoverClasses");
@endphp

<{{ $elementTag }} {{ $attributes->merge(array_merge([
    'class' => $badgeClasses,
    'id' => $id
], $elementAttributes))->merge($dataAttributes)->merge(['data-icon-only' => $isIconOnly ? 'true' : 'false']) }}>
    @if($variant === 'subtle')
        {{-- Subtle variant: dot + icon + text --}}
        @if(!$isIconOnly)
            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 relative {{ $dotColorClasses }}">
                <span class="absolute inset-0 bg-current rounded-full"></span>
                <span class="absolute inset-0 rounded-full ring-2 ring-current opacity-20"></span>
            </span>
        @endif

        @if($icon && !$isIconOnly)
            <x-keys::icon :name="$icon" :size="$iconSize" />
        @endif

        @if($isIconOnly)
            <x-keys::icon :name="$icon" :size="$iconSize" />
        @else
            {{ $slot }}
        @endif
    @else
        {{-- Filled & Outlined variants: icon + text + dismiss button --}}
        @if($icon && !$isIconOnly)
            <x-keys::icon :name="$icon" :size="$iconSize" class="mr-1" />
        @endif

        @if($isIconOnly)
            <x-keys::icon :name="$icon" :size="$iconSize" />
        @else
            {{ $slot }}
        @endif

        @if($dismissible)
            <x-keys::icon name="heroicon-o-x-mark" size="xs" class="ml-1" />
            <span class="sr-only">{{ __('keys-ui::keys-ui.actions.remove_badge') }}</span>
        @endif
    @endif
</{{ $elementTag }}>

