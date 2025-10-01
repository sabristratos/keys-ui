@php
    $slotContent = $slot->toHtml();
    $isIconOnly = $isIconOnly($slotContent);

    $baseClasses = 'flex items-center justify-center whitespace-nowrap font-medium cursor-pointer transition-all duration-150 ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 *:data-icon:pointer-events-none *:data-icon:shrink-0 *:data-icon:transition-all *:data-icon:duration-150';

    $buttonHighlight = 'shadow-[var(--shadow-button-highlight)]';

    $variantClasses = match ($variant) {
        'brand' => "bg-brand text-foreground-brand shadow-xs-skeumorphic ring-1 ring-transparent ring-inset hover:bg-brand-hover active:bg-brand-active active:scale-[0.98] disabled:bg-brand-disabled disabled:shadow-xs focus-visible:ring-brand {$buttonHighlight} *:data-icon:text-button-brand-icon hover:*:data-icon:text-button-brand-icon-hover",
        'secondary' => 'bg-surface text-foreground shadow-xs-skeumorphic ring-1 ring-border ring-inset hover:bg-muted active:bg-border active:scale-[0.98] disabled:bg-surface disabled:text-muted disabled:shadow-xs focus-visible:ring-neutral',
        'danger' => "bg-danger text-foreground-danger shadow-xs-skeumorphic ring-1 ring-transparent ring-inset hover:bg-danger-hover active:bg-danger-active active:scale-[0.98] disabled:bg-danger-disabled disabled:shadow-xs focus-visible:ring-danger {$buttonHighlight} *:data-icon:text-button-danger-icon hover:*:data-icon:text-button-danger-icon-hover",
        'warning' => "bg-warning text-foreground-warning shadow-xs-skeumorphic ring-1 ring-transparent ring-inset hover:bg-warning-hover active:bg-warning-active active:scale-[0.98] disabled:bg-warning-disabled disabled:shadow-xs focus-visible:ring-warning {$buttonHighlight} *:data-icon:text-button-warning-icon hover:*:data-icon:text-button-warning-icon-hover",
        'success' => "bg-success text-foreground-success shadow-xs-skeumorphic ring-1 ring-transparent ring-inset hover:bg-success-hover active:bg-success-active active:scale-[0.98] disabled:bg-success-disabled disabled:shadow-xs focus-visible:ring-success {$buttonHighlight} *:data-icon:text-button-success-icon hover:*:data-icon:text-button-success-icon-hover",
        'info' => "bg-info text-foreground-info shadow-xs-skeumorphic ring-1 ring-transparent ring-inset hover:bg-info-hover active:bg-info-active active:scale-[0.98] disabled:bg-info-disabled disabled:shadow-xs focus-visible:ring-info {$buttonHighlight} *:data-icon:text-button-info-icon hover:*:data-icon:text-button-info-icon-hover",
        'neutral' => "bg-neutral text-foreground-neutral shadow-xs-skeumorphic ring-1 ring-transparent ring-inset hover:bg-neutral-hover active:bg-neutral-active active:scale-[0.98] disabled:bg-neutral-disabled disabled:shadow-xs focus-visible:ring-neutral {$buttonHighlight}",
        'ghost' => 'bg-transparent text-foreground shadow-xs ring-1 ring-transparent ring-inset hover:bg-surface active:bg-border active:scale-[0.98] disabled:text-muted focus-visible:ring-neutral',
        'outline' => 'bg-transparent text-foreground shadow-xs ring-1 ring-border ring-inset hover:ring-brand hover:bg-brand hover:text-foreground-brand active:bg-border active:scale-[0.98] disabled:text-muted focus-visible:ring-neutral',
        default => "bg-brand text-foreground-brand shadow-xs-skeumorphic ring-1 ring-transparent ring-inset hover:bg-brand-hover active:bg-brand-active active:scale-[0.98] disabled:bg-brand-disabled disabled:shadow-xs focus-visible:ring-brand {$buttonHighlight} *:data-icon:text-button-brand-icon hover:*:data-icon:text-button-brand-icon-hover"
    };

    $sizeClasses = $isIconOnly
        ? match ($size) {
            'xs' => 'px-2 py-1 text-xs rounded-md aspect-square',
            'sm' => 'px-3 py-1.5 text-sm rounded-lg aspect-square',
            'md' => 'px-4 py-2 text-sm rounded-lg aspect-square',
            'lg' => 'px-6 py-2.5 text-base rounded-xl aspect-square',
            'xl' => 'px-8 py-3 text-lg rounded-2xl aspect-square',
            default => 'px-4 py-2 text-sm rounded-lg aspect-square'
        }
        : match ($size) {
            'xs' => 'px-2 py-1 text-xs rounded-sm',
            'sm' => 'px-3 py-1.5 text-sm rounded-md',
            'md' => 'px-4 py-2 text-sm rounded-md',
            'lg' => 'px-6 py-2.5 text-base rounded-lg',
            'xl' => 'px-8 py-3 text-lg rounded-lg',
            default => 'px-4 py-2 text-sm rounded-md'
        };

    $disabledClasses = ($disabled || $loading) ? 'cursor-not-allowed' : '';

    $loadingClasses = $loading ? match ($variant) {
        'brand' => 'bg-brand-hover',
        'danger' => 'bg-danger-hover',
        'warning' => 'bg-warning-hover',
        'success' => 'bg-success-hover',
        'info' => 'bg-info-hover',
        default => ''
    } : '';

    $iconSize = $isIconOnly
        ? match ($size) {
            'xs' => 'sm',
            'sm' => 'md',
            'md' => 'md',
            'lg' => 'lg',
            'xl' => 'xl',
            default => 'md'
        }
        : match ($size) {
            'xs' => 'xs',
            'sm' => 'sm',
            'md' => 'sm',
            'lg' => 'md',
            'xl' => 'lg',
            default => 'sm'
        };

@endphp

<{{ $elementType }}
    @if($elementType === 'button') type="{{ $buttonType }}" @endif
    @if($elementType === 'a') href="{{ $href }}" @endif
    @if($elementType === 'button' && ($disabled || $loading)) disabled @endif
    @if($elementType === 'button' && $popovertarget) popovertarget="{{ $popovertarget }}" @endif
    {{ $attributes->merge([
        'class' => trim("$baseClasses $variantClasses $sizeClasses $disabledClasses $loadingClasses"),
    ])->merge($dataAttributes)->merge($getDataAttributesForSlot($slotContent)) }}>
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
        <span data-text="true" class="px-0.5 transition-all duration-150">{{ $slot }}</span>
    @endunless

    @if($iconRight && !$loading && !$isIconOnly)
        <x-keys::icon :name="$iconRight" :size="$iconSize" class="ml-2" />
    @endif
</{{ $elementType }}>
