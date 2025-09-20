
<{{ $elementType }} class="{{ $computedItemClasses }}" {{ $attributes->merge($computedElementAttributes) }}>
    @if($hasIcon())
        @if($isMultiState())
            
            <x-keys::icon
                :name="$icon"
                :size="$iconSize()"
                class="button-icon-default {{ $computedIconClasses }} transition-all duration-200"
            />

            @if($iconToggle)
                <x-keys::icon
                    :name="$iconToggle"
                    :size="$iconSize()"
                    class="button-icon-toggle absolute opacity-0 transition-all duration-200 {{ $computedIconClasses }}"
                />
            @endif

            @if($iconSuccess)
                <x-keys::icon
                    :name="$iconSuccess"
                    :size="$iconSize()"
                    class="button-icon-success absolute opacity-0 transition-all duration-200 text-success {{ $computedIconClasses }}"
                />
            @endif
        @else
            
            <x-keys::icon :name="$icon" :size="$iconSize()" class="{{ $computedIconClasses }}" />
        @endif
    @endif

    <div class="{{ $computedContentClasses }}">
        {{ $slot }}
    </div>

    @if($hasKbd())
        <span class="{{ $computedKbdClasses }}">{{ $kbd }}</span>
    @endif
</{{ $elementType }}>