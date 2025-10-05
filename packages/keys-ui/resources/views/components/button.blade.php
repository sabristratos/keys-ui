@php
    // Compute values needed for rendering
    $elementType = $isLink() ? ($disabled ? 'span' : 'a') : 'button';
    $slotContent = $slot->toHtml();
    $isIconOnly = $isIconOnly($slotContent);
    $isMultiState = $isMultiState();
    $dataAttributes = array_merge(
        $getDataAttributes(),
        $getDataAttributesForSlot($slotContent)
    );

    $baseClasses = 'inline-flex items-center justify-center whitespace-nowrap font-medium cursor-pointer transition-all duration-150 ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2  *:data-icon:pointer-events-none *:data-icon:shrink-0 *:data-icon:transition-all *:data-icon:duration-150';

    // Common classes shared by all button variants
    $commonClasses = 'active:scale-[0.98] disabled:opacity-50';

    // Build color-specific variant classes
    $colorClasses = match ($color) {
        'primary' => match ($variant) {
            'solid' => 'bg-accent shadow-xs text-accent-foreground hover:bg-accent-hover active:bg-accent-active focus-visible:ring-accent',
            'outlined' => 'bg-transparent text-accent border  border-accent hover:bg-accent hover:text-white focus-visible:ring-accent',
            'ghost' => 'bg-transparent text-accent  hover:bg-accent/10 active:bg-accent/20 focus-visible:ring-accent',
            'subtle' => 'bg-accent-subtle text-accent  hover:bg-brand-100 active:bg-brand-200 focus-visible:ring-accent',
            default => 'bg-accent text-accent-foreground hover:bg-accent-hover active:bg-accent-active focus-visible:ring-accent',
        },

        'secondary' => match ($variant) {
            'solid' => 'bg-neutral text-text border  border-border hover:bg-neutral-hover active:bg-neutral-active focus-visible:ring-border',
            'outlined' => 'bg-transparent text-text  border border-border hover:bg-neutral active:bg-neutral-active-light focus-visible:ring-border',
            'ghost' => 'bg-transparent text-text  hover:bg-neutral active:bg-neutral-active-light focus-visible:ring-border',
            'subtle' => 'bg-neutral text-text  hover:bg-neutral-hover active:bg-neutral-active focus-visible:ring-border',
            default => 'bg-neutral text-text  border border-border hover:bg-neutral-hover active:bg-neutral-active focus-visible:ring-border',
        },

        'danger' => match ($variant) {
            'solid' => 'bg-danger shadow-xs text-white hover:bg-danger-hover active:bg-danger-active focus-visible:ring-danger',
            'outlined' => 'bg-transparent text-danger border border-danger hover:bg-danger hover:text-white focus-visible:ring-danger',
            'ghost' => 'bg-transparent text-danger  hover:bg-danger/10 active:bg-danger/20 focus-visible:ring-danger',
            'subtle' => 'bg-danger-subtle text-danger hover:bg-danger-100 active:bg-danger-200 focus-visible:ring-danger',
            default => 'bg-danger text-white hover:bg-danger-hover active:bg-danger-active focus-visible:ring-danger',
        },

        'warning' => match ($variant) {
            'solid' => 'bg-warning shadow-xs text-white hover:bg-warning-hover active:bg-warning-active focus-visible:ring-warning',
            'outlined' => 'bg-transparent text-warning border border-warning hover:bg-warning hover:text-white focus-visible:ring-warning',
            'ghost' => 'bg-transparent text-warning  hover:bg-warning/10 active:bg-warning/20 focus-visible:ring-warning',
            'subtle' => 'bg-warning-subtle text-warning hover:bg-warning-100 active:bg-warning-200 focus-visible:ring-warning',
            default => 'bg-warning text-white hover:bg-warning-hover active:bg-warning-active focus-visible:ring-warning',
        },

        'success' => match ($variant) {
            'solid' => 'bg-success shadow-xs text-white hover:bg-success-hover active:bg-success-active focus-visible:ring-success',
            'outlined' => 'bg-transparent text-success  border border-success hover:bg-success hover:text-white focus-visible:ring-success',
            'ghost' => 'bg-transparent text-success  hover:bg-success/10 active:bg-success/20 focus-visible:ring-success',
            'subtle' => 'bg-success-subtle text-success hover:bg-success-100 active:bg-success-200 focus-visible:ring-success',
            default => 'bg-success text-white hover:bg-success-hover active:bg-success-active focus-visible:ring-success',
        },

        'info' => match ($variant) {
            'solid' => 'bg-info shadow-xs text-white hover:bg-info-hover active:bg-info-active focus-visible:ring-info',
            'outlined' => 'bg-transparent text-info  border border-info hover:bg-info hover:text-white focus-visible:ring-info',
            'ghost' => 'bg-transparent text-info  hover:bg-info/10 active:bg-info/20 focus-visible:ring-info',
            'subtle' => 'bg-info-subtle text-info hover:bg-info-100 active:bg-info-200 focus-visible:ring-info',
            default => 'bg-info text-white hover:bg-info-hover active:bg-info-active focus-visible:ring-info',
        },

        default => match ($variant) {
            'solid' => 'bg-accent shadow-xs text-accent-foreground hover:bg-accent-hover active:bg-accent-active focus-visible:ring-accent',
            'outlined' => 'bg-transparent text-accent  border border-accent hover:bg-accent hover:text-white focus-visible:ring-accent',
            'ghost' => 'bg-transparent text-accent hover:bg-accent/10 active:bg-accent/20 focus-visible:ring-accent',
            'subtle' => 'bg-accent-subtle text-accent hover:bg-brand-100 active:bg-brand-200 focus-visible:ring-accent',
            default => 'bg-accent text-accent-foreground hover:bg-accent-hover active:bg-accent-active focus-visible:ring-accent',
        },
    };

    $variantClasses = "$commonClasses $colorClasses";

    $sizeClasses = $isIconOnly
        ? match ($size) {
            'xs' => 'p-1 text-xs rounded-md',
            'sm' => 'p-1.5 text-sm rounded-lg',
            'md' => 'p-2 text-sm rounded-lg',
            'lg' => 'p-2.5 text-base rounded-xl',
            'xl' => 'p-3.5 text-lg rounded-2xl',
            default => 'p-2 text-sm rounded-lg'
        }
        : match ($size) {
            'xs' => 'px-2 py-0.5 text-xs rounded-sm',
            'sm' => 'px-2.5 py-1 text-sm rounded-md',
            'md' => 'px-3.5 py-1.5 text-sm rounded-md',
            'lg' => 'px-5 py-2 text-base rounded-lg',
            'xl' => 'px-7 py-2.5 text-lg rounded-lg',
            default => 'px-3.5 py-1.5 text-sm rounded-md'
        };

    $disabledClasses = ($disabled || $loading) ? 'cursor-not-allowed' : '';

    $loadingClasses = $loading ? match ($color) {
        'primary' => 'bg-brand-600',
        'danger' => 'bg-danger-600',
        'warning' => 'bg-warning-600',
        'success' => 'bg-success-600',
        'info' => 'bg-info-600',
        'secondary' => 'bg-neutral-300 dark:bg-neutral-700',
        default => 'bg-brand-600'
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
    @if($elementType === 'button') type="{{ $type }}" @endif
    {{ $attributes->class([
        $baseClasses,
        $variantClasses,
        $sizeClasses,
        $disabledClasses,
        $loadingClasses,
    ]) }}
    @foreach($dataAttributes as $key => $value)
        {{ $key }}="{{ $value }}"
    @endforeach
    @if($elementType === 'a') href="{{ $href }}" @endif
    @if($elementType === 'button' && ($disabled || $loading)) disabled @endif
    @if($elementType === 'button' && $popovertarget) popovertarget="{{ $popovertarget}}" @endif
>
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
