@php

    $baseClasses = 'block transition-all duration-200';

    $colorClasses = match ($colorVariant) {
        'neutral' => '',
        'brand' => $variant === 'outlined' ? 'border-accent/20 bg-accent/5' : 'border-accent/10',
        'success' => $variant === 'outlined' ? 'border-success/20 bg-success/5' : 'border-success/10',
        'warning' => $variant === 'outlined' ? 'border-warning/20 bg-warning/5' : 'border-warning/10',
        'danger' => $variant === 'outlined' ? 'border-danger/20 bg-danger/5' : 'border-danger/10',
        'info' => $variant === 'outlined' ? 'border-info/20 bg-info/5' : 'border-info/10',
        default => ''
    };

    $variantClasses = match ($variant) {
        'default' => 'bg-elevation-1 bg-gradient-to-b from-white/1 to-transparent',
        'elevated' => 'bg-elevation-1 border border-line',
        'outlined' => 'bg-transparent border-2 border-line',
        'filled' => 'bg-base border border-transparent',
        default => 'bg-elevation-1 bg-gradient-to-b from-white/1 to-transparent'
    };

    if ($colorVariant !== 'neutral') {
        $variantClasses = $colorClasses;
    }

    $densityMultiplier = match ($density) {
        'compact' => 0.75,
        'comfortable' => 1,
        'spacious' => 1.5,
        default => 1
    };

    $slotContent = $slot->toHtml();
    $hasSlotComponents = str_contains($slotContent, 'data-keys-card-slot="header"') ||
                       str_contains($slotContent, 'data-keys-card-slot="body"') ||
                       str_contains($slotContent, 'data-keys-card-slot="footer"') ||
                       str_contains($slotContent, 'data-keys-card-slot="actions"');

    $paddingClasses = '';
    if (!$hasSlotComponents) {
        $paddingClasses = match ($padding) {
            'none' => '',
            'xs' => $density === 'compact' ? 'p-1.5' : ($density === 'spacious' ? 'p-3' : 'p-2'),
            'sm' => $density === 'compact' ? 'p-2' : ($density === 'spacious' ? 'p-4' : 'p-3'),
            'md' => $density === 'compact' ? 'p-3' : ($density === 'spacious' ? 'p-6' : 'p-4'),
            'lg' => $density === 'compact' ? 'p-4' : ($density === 'spacious' ? 'p-8' : 'p-6'),
            'xl' => $density === 'compact' ? 'p-6' : ($density === 'spacious' ? 'p-12' : 'p-8'),
            default => $density === 'compact' ? 'p-3' : ($density === 'spacious' ? 'p-6' : 'p-4')
        };
    }

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

    $shadowClasses = '';
    if ($variant === 'filled') {
        $shadowClasses = '';
    } elseif ($variant === 'elevated') {
        $shadowClasses = match ($shadow) {
            'none' => '',
            'xs' => 'shadow-xs',
            'sm' => 'shadow-sm',
            'md' => 'shadow-md',
            'lg' => 'shadow-lg',
            'xl' => 'shadow-xl',
            '2xl' => 'shadow-2xl',
            default => 'shadow-sm'
        };
    } elseif ($shadow !== 'none' && $shadow !== 'sm') {
        $shadowClasses = match ($shadow) {
            'xs' => 'shadow-xs',
            'md' => 'shadow-md',
            'lg' => 'shadow-lg',
            'xl' => 'shadow-xl',
            '2xl' => 'shadow-2xl',
            default => ''
        };
    }

    $interactiveClasses = '';
    $interactive = !is_null($href);
    if ($interactive && !$disabled && !$loading) {
        $hoverClasses = match ($variant) {
            'default' => 'hover:shadow-md hover:border-line hover:-translate-y-1',
            'elevated' => 'hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]',
            'outlined' => 'hover:bg-elevation-1 hover:border-line hover:shadow-sm',
            'filled' => 'hover:bg-elevation-1 hover:shadow-sm',
            default => 'hover:shadow-md hover:border-line hover:-translate-y-1'
        };

        if ($colorVariant !== 'neutral') {
            $colorHover = match ($colorVariant) {
                'brand' => 'hover:border-accent/40 hover:bg-accent/10',
                'success' => 'hover:border-success/40 hover:bg-success/10',
                'warning' => 'hover:border-warning/40 hover:bg-warning/10',
                'danger' => 'hover:border-danger/40 hover:bg-danger/10',
                'info' => 'hover:border-info/40 hover:bg-info/10',
                default => ''
            };
            $hoverClasses = "$hoverClasses $colorHover";
        }

        $focusClasses = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2';
        $activeClasses = 'active:scale-[0.97] active:translate-y-0';

        $interactiveClasses = trim("$hoverClasses $focusClasses $activeClasses");
    }

    $disabledClasses = $disabled ? 'opacity-50 cursor-not-allowed' : '';

    $loadingClasses = $loading ? 'cursor-wait pointer-events-none' : '';

    $selectedClasses = $selected ? 'ring-2 ring-accent ring-offset-1 shadow-lg' : '';

    $touchClasses = $interactive ? 'min-h-[44px] touch-manipulation' : '';

    $cursorClasses = $interactive && !$disabled && !$loading ? 'cursor-pointer' : '';

    $allClasses = trim("$baseClasses $variantClasses $paddingClasses $roundedClasses $shadowClasses $interactiveClasses $disabledClasses $loadingClasses $selectedClasses $touchClasses $cursorClasses");

    $elementAttributes = $attributes->merge(['class' => $allClasses])->merge($dataAttributes);

    if ($elementType() === 'a') {
        $elementAttributes = $elementAttributes->merge([
            'href' => $href,
            'role' => $disabled ? 'link' : null,
            'aria-disabled' => $disabled ? 'true' : null,
            'tabindex' => $disabled ? '-1' : null
        ]);
    }

@endphp

<{{ $elementType() }} {{ $elementAttributes }}>
    @if($hasImage())
        <div class="@if($imagePosition === 'top') mb-4 @elseif($imagePosition === 'bottom') order-last mt-4 @endif">
            <img
                src="{{ $imageUrl }}"
                alt="{{ $imageAlt ?? '' }}"
                class="w-full h-auto object-cover rounded-md @if($loading) animate-pulse bg-elevation-1 @endif"
                @if(!$loading) loading="lazy" @endif
            />
        </div>
    @endif

    @if($shouldShowSkeleton())

        <div class="animate-pulse space-y-3" role="status" aria-live="polite">
            <div class="h-4 bg-elevation-1 rounded w-3/4"></div>
            <div class="space-y-2">
                <div class="h-3 bg-elevation-1 rounded"></div>
                <div class="h-3 bg-elevation-1 rounded w-5/6"></div>
            </div>
            <div class="flex space-x-2">
                <div class="h-8 bg-elevation-1 rounded w-16"></div>
                <div class="h-8 bg-elevation-1 rounded w-20"></div>
            </div>
            @if($loadingText)
                <span class="sr-only">{{ $loadingText }}</span>
            @endif
        </div>
    @else

        @php

            $contentContainerClasses = '';
            if ($hasSlotComponents) {

                $gapClasses = match ($density) {
                    'compact' => 'gap-3',
                    'comfortable' => 'gap-4',
                    'spacious' => 'gap-6',
                    default => 'gap-4'
                };

                $slotPaddingClasses = match ($padding) {
                    'none' => 'p-0',
                    'xs' => $density === 'compact' ? 'p-1.5' : ($density === 'spacious' ? 'p-3' : 'p-2'),
                    'sm' => $density === 'compact' ? 'p-2' : ($density === 'spacious' ? 'p-4' : 'p-3'),
                    'md' => $density === 'compact' ? 'p-3' : ($density === 'spacious' ? 'p-6' : 'p-4'),
                    'lg' => $density === 'compact' ? 'p-4' : ($density === 'spacious' ? 'p-8' : 'p-6'),
                    'xl' => $density === 'compact' ? 'p-6' : ($density === 'spacious' ? 'p-12' : 'p-8'),
                    default => $density === 'compact' ? 'p-3' : ($density === 'spacious' ? 'p-6' : 'p-4')
                };

                $contentContainerClasses = "flex flex-col $gapClasses $slotPaddingClasses";
            }

            $imageOrderClass = $hasImage() && $imagePosition === 'bottom' ? 'order-first' : '';
        @endphp

        <div class="{{ trim("$contentContainerClasses $imageOrderClass") }}">
            {{ $slot }}
        </div>
    @endif
</{{ $elementType() }}>
