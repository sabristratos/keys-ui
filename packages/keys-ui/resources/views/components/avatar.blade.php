@php
    // Avatar container classes
    $baseClasses = 'inline-block flex-shrink-0 relative';
    $sizeClasses = match ($size) {
        'xs' => 'w-6 h-6 text-xs',
        'sm' => 'w-8 h-8 text-sm',
        'md' => 'w-10 h-10 text-base',
        'lg' => 'w-12 h-12 text-lg',
        'xl' => 'w-16 h-16 text-xl',
        default => 'w-10 h-10 text-base'
    };
    $shapeClasses = match ($shape) {
        'circle' => 'rounded-full',
        'square' => 'rounded-lg',
        default => 'rounded-full'
    };

    // Color classes for fallback (initials/icon) - used for both direct fallback and JavaScript fallback
    $colorClasses = '';
    if (!$hasImage()) {
        $colorClasses = match ($color) {
            'brand' => 'bg-brand text-brand-foreground',
            'success' => 'bg-success text-success-foreground',
            'warning' => 'bg-warning text-warning-foreground',
            'danger' => 'bg-danger text-danger-foreground',
            'neutral' => 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200',
            'red' => 'bg-red-500 text-white',
            'green' => 'bg-green-500 text-white',
            'blue' => 'bg-blue-500 text-white',
            'purple' => 'bg-purple-500 text-white',
            'yellow' => 'bg-yellow-400 text-yellow-900',
            'teal' => 'bg-teal-500 text-white',
            'orange' => 'bg-orange-500 text-white',
            default => 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200'
        };
    }

    // Fallback color classes - always available for JavaScript fallback
    $fallbackColorClasses = match ($color) {
        'brand' => 'bg-brand text-brand-foreground',
        'success' => 'bg-success text-success-foreground',
        'warning' => 'bg-warning text-warning-foreground',
        'danger' => 'bg-danger text-danger-foreground',
        'neutral' => 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200',
        'red' => 'bg-red-500 text-white',
        'green' => 'bg-green-500 text-white',
        'blue' => 'bg-blue-500 text-white',
        'purple' => 'bg-purple-500 text-white',
        'yellow' => 'bg-yellow-400 text-yellow-900',
        'teal' => 'bg-teal-500 text-white',
        'orange' => 'bg-orange-500 text-white',
        default => 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200'
    };

    $borderClasses = $border ? 'ring-2 ring-white dark:ring-neutral-800' : '';

    $avatarClasses = trim("$baseClasses $sizeClasses $shapeClasses $colorClasses $borderClasses");

    // Image classes
    $imageClasses = "w-full h-full object-cover $shapeClasses";

    // Initials/Icon container classes
    $initialsClasses = 'flex items-center justify-center w-full h-full font-medium select-none';

    // Status indicator classes
    $statusClasses = '';
    if ($status) {
        $statusBaseClasses = 'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-neutral-800';
        $statusSizeClasses = match ($size) {
            'xs' => 'w-2 h-2',
            'sm' => 'w-2.5 h-2.5',
            'md' => 'w-3 h-3',
            'lg' => 'w-3.5 h-3.5',
            'xl' => 'w-4 h-4',
            default => 'w-3 h-3'
        };
        $statusColorClasses = match ($status) {
            'online' => 'bg-green-400',
            'offline' => 'bg-neutral-400',
            'away' => 'bg-yellow-400',
            'busy' => 'bg-red-400',
            default => 'bg-neutral-400'
        };
        $statusClasses = trim("$statusBaseClasses $statusSizeClasses $statusColorClasses");
    }

    // Icon size for fallback
    $iconSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'sm',
        default => 'md'
    };
@endphp

<div {{ $attributes->merge(['class' => $avatarClasses])->merge($dataAttributes) }}>
    @if($hasImage())
        {{-- Primary image --}}
        <img
            src="{{ $src }}"
            alt="{{ $alt }}"
            class="{{ $imageClasses }}"
            @if($lazy) loading="lazy" @endif
        />

        {{-- Hidden fallback container for JavaScript error handling with proper styling --}}
        <div data-avatar-fallback="true" style="display: none;" class="{{ $fallbackColorClasses }} {{ $shapeClasses }} w-full h-full">
            @if($shouldShowInitialsFallback())
                <span class="{{ $initialsClasses }}">
                    {{ $getInitials() }}
                </span>
            @else
                <span class="{{ $initialsClasses }}">
                    <x-keys::icon name="heroicon-o-user" :size="$iconSize" />
                </span>
            @endif
        </div>
    @elseif($hasInitials())
        {{-- Show initials directly when no image provided --}}
        <span class="{{ $initialsClasses }}">
            {{ $getInitials() }}
        </span>
    @else
        {{-- Show icon directly when no image or name provided --}}
        <span class="{{ $initialsClasses }}">
            <x-keys::icon name="heroicon-o-user" :size="$iconSize" />
        </span>
    @endif

    @if($status)
        <span class="{{ $statusClasses }}" aria-label="Status: {{ $status }}"></span>
    @endif
</div>