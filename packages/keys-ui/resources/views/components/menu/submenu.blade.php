
<div class="relative" {{ $attributes->merge($computedDataAttributes) }}>
    
    <div class="{{ $computedTriggerClasses }}" {{ $attributes->only([])->merge($computedTriggerDataAttributes) }}>
        <div class="flex items-center flex-1 min-w-0">
            @if($hasIcon())
                <x-keys::icon :name="$icon" :size="$computedIconSize" class="{{ $computedIconClasses }}" />
            @endif

            @if($hasHeading())
                <span class="truncate">{{ $heading }}</span>
            @endif
        </div>

        
        <x-keys::icon name="heroicon-o-chevron-right" class="w-4 h-4 text-muted flex-shrink-0 transition-transform duration-200" />
    </div>

    
    <div class="{{ $computedPanelClasses }}" {{ $attributes->only([])->merge($computedPanelDataAttributes) }}>
        {{ $slot }}
    </div>
</div>