@php
    $slotContent = $slot->toHtml();
    $isIconOnly = $isIconOnly($slotContent);

    // Base classes for all buttons
    $baseClasses = 'flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    // Variant classes
    $variantClasses = match ($variant) {
        'brand' => 'border border-brand bg-brand text-foreground-brand hover:border-brand-hover hover:bg-brand-hover active:border-brand-active active:bg-brand-active disabled:border-brand-disabled disabled:bg-brand-disabled focus-visible:ring-brand',
        'danger' => 'border border-danger bg-danger text-foreground-danger hover:border-danger-hover hover:bg-danger-hover active:border-danger-active active:bg-danger-active disabled:border-danger-disabled disabled:bg-danger-disabled focus-visible:ring-danger',
        'warning' => 'border border-warning bg-warning text-foreground-warning hover:border-warning-hover hover:bg-warning-hover active:border-warning-active active:bg-warning-active disabled:border-warning-disabled disabled:bg-warning-disabled focus-visible:ring-warning',
        'success' => 'border border-success bg-success text-foreground-success hover:border-success-hover hover:bg-success-hover active:border-success-active active:bg-success-active disabled:border-success-disabled disabled:bg-success-disabled focus-visible:ring-success',
        'info' => 'border border-info bg-info text-foreground-info hover:border-info-hover hover:bg-info-hover active:border-info-active active:bg-info-active disabled:border-info-disabled disabled:bg-info-disabled focus-visible:ring-info',
        'neutral' => 'border border-neutral bg-neutral text-foreground-neutral hover:border-neutral-hover hover:bg-neutral-hover active:border-neutral-active active:bg-neutral-active disabled:border-neutral-disabled disabled:bg-neutral-disabled focus-visible:ring-neutral',
        'ghost' => 'border border-transparent bg-transparent text-foreground hover:bg-surface active:bg-border disabled:text-neutral-disabled focus-visible:ring-neutral',
        'outline' => 'bg-transparent border border-border text-foreground hover:border-brand hover:bg-brand hover:text-foreground-brand active:bg-border disabled:text-neutral-disabled focus-visible:ring-neutral',
        default => 'border border-brand bg-brand text-foreground-brand hover:border-brand-hover hover:bg-brand-hover active:border-brand-active active:bg-brand-active disabled:border-brand-disabled disabled:bg-brand-disabled focus-visible:ring-brand'
    };

    // Size classes based on icon-only state
    $sizeClasses = $isIconOnly
        ? match ($size) {
            'xs' => 'p-1 text-xs rounded-sm w-max h-max',
            'sm' => 'p-1.5 text-sm rounded-md w-max h-max',
            'md' => 'p-2 text-sm rounded-md w-max h-max',
            'lg' => 'p-2.5 text-base rounded-lg w-max h-max',
            'xl' => 'p-3 text-lg rounded-lg w-max h-max',
            default => 'p-2 text-sm rounded-md w-max h-max'
        }
        : match ($size) {
            'xs' => 'px-2 py-1 text-xs rounded-sm',
            'sm' => 'px-3 py-1.5 text-sm rounded-md',
            'md' => 'px-4 py-2 text-sm rounded-md',
            'lg' => 'px-6 py-2.5 text-base rounded-lg',
            'xl' => 'px-8 py-3 text-lg rounded-lg',
            default => 'px-4 py-2 text-sm rounded-md'
        };

    // Disabled classes
    $disabledClasses = ($disabled || $loading) ? 'cursor-not-allowed opacity-50' : '';

    // Multi-state positioning
    $positionClasses = $isMultiState ? 'relative' : '';

    // Icon size for child components
    $iconSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'sm',
        'md' => 'sm',
        'lg' => 'md',
        'xl' => 'lg',
        default => 'sm'
    };

    $elementAttributes = $attributes->merge([
        'class' => trim("$baseClasses $variantClasses $sizeClasses $disabledClasses $positionClasses")
    ]);

    if ($elementType === 'button') {
        $elementAttributes = $elementAttributes->merge([
            'type' => $buttonType,
            'disabled' => $disabled || $loading
        ]);
    } elseif ($elementType === 'a') {
        $elementAttributes = $elementAttributes->merge([
            'href' => $href
        ]);
    }

    // Merge data attributes with slot-dependent attributes
    $elementAttributes = $elementAttributes->merge($dataAttributes)->merge($getDataAttributesForSlot($slotContent));
@endphp

<{{ $elementType }} {{ $elementAttributes }}>
    @if($loading)
        <x-keys::loading :animation="$loadingAnimation" :size="$iconSize" class="mr-2" />
    @elseif($iconLeft && !$loading)
        @if($isMultiState)
            <div class="relative {{ $isIconOnly ? '' : 'mr-2' }} flex-shrink-0">
                <x-keys::icon
                    :name="$iconLeft"
                    :size="$iconSize"
                    class="button-icon-default transition-all duration-200"
                />

                @if($iconToggle)
                    <x-keys::icon
                        :name="$iconToggle"
                        :size="$iconSize"
                        class="button-icon-toggle absolute inset-0 opacity-0 transition-all duration-200"
                    />
                @endif

                @if($iconSuccess)
                    <x-keys::icon
                        :name="$iconSuccess"
                        :size="$iconSize"
                        class="button-icon-success absolute inset-0 opacity-0 transition-all duration-200 text-success"
                    />
                @endif
            </div>
        @else
            <x-keys::icon :name="$iconLeft" :size="$iconSize" class="{{ $isIconOnly ? '' : 'mr-2' }}" />
        @endif
    @endif

    @unless($isIconOnly)
        {{ $slot }}
    @endunless

    @if($iconRight && !$loading && !$isIconOnly)
        <x-keys::icon :name="$iconRight" :size="$iconSize" class="ml-2" />
    @endif
</{{ $elementType }}>
