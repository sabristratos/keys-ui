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
        : 'inline-flex items-center font-medium';

    // Add layout classes for non-subtle variants
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

    // Shape classes
    $shapeClasses = match ($variant) {
        'simple' => 'rounded-full',
        'chip' => 'rounded-sm',
        'subtle' => '',
        default => 'rounded-full'
    };

    // Color classes
    $colorClasses = $variant === 'subtle'
        ? 'text-foreground'
        : match ($color) {
            'brand' => 'bg-brand text-white',
            'success' => 'bg-success text-white',
            'warning' => 'bg-warning text-white',
            'danger' => 'bg-danger text-white',
            'neutral' => 'bg-neutral text-white',
            'blue' => 'bg-blue-600 text-white',
            'gray' => 'bg-neutral-600 text-white',
            'red' => 'bg-red-600 text-white',
            'green' => 'bg-green-600 text-white',
            'yellow' => 'bg-yellow-600 text-white',
            'indigo' => 'bg-indigo-600 text-white',
            'purple' => 'bg-purple-600 text-white',
            'pink' => 'bg-pink-600 text-white',
            'dark' => 'bg-neutral-900 text-white',
            default => 'bg-blue-600 text-white'
        };

    // Hover classes for dismissible badges
    $hoverClasses = ($dismissible && $variant !== 'subtle')
        ? match ($color) {
            'brand' => 'hover:bg-brand-hover',
            'success' => 'hover:bg-success-hover',
            'warning' => 'hover:bg-warning-hover',
            'danger' => 'hover:bg-danger-hover',
            'neutral' => 'hover:bg-neutral-hover',
            'blue' => 'hover:bg-blue-700',
            'gray' => 'hover:bg-neutral-700',
            'red' => 'hover:bg-red-700',
            'green' => 'hover:bg-green-700',
            'yellow' => 'hover:bg-yellow-700',
            'indigo' => 'hover:bg-indigo-700',
            'purple' => 'hover:bg-purple-700',
            'pink' => 'hover:bg-pink-700',
            'dark' => 'hover:bg-neutral-800',
            default => 'hover:bg-blue-700'
        }
        : '';

    // Dot color classes for subtle variant
    $dotColorClasses = match ($color) {
        'brand' => 'text-brand',
        'success' => 'text-success',
        'warning' => 'text-warning',
        'danger' => 'text-danger',
        'neutral' => 'text-neutral',
        'blue' => 'text-blue-600',
        'gray' => 'text-neutral-600',
        'red' => 'text-red-600',
        'green' => 'text-green-600',
        'yellow' => 'text-yellow-600',
        'indigo' => 'text-indigo-600',
        'purple' => 'text-purple-600',
        'pink' => 'text-pink-600',
        default => 'text-blue-600'
    };

    // Icon size
    $iconSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'sm',
        'md' => 'md',
        default => 'sm'
    };

    // Combine all classes
    $badgeClasses = trim("$baseClasses $sizeClasses $shapeClasses $colorClasses $hoverClasses");
@endphp

<{{ $elementTag }} {{ $attributes->merge(array_merge([
    'class' => $badgeClasses,
    'id' => $id
], $elementAttributes))->merge($dataAttributes)->merge(['data-icon-only' => $isIconOnly ? 'true' : 'false']) }}>
    @if($variant === 'subtle')
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

