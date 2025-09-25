
<div class="w-full" {{ $attributes->merge($computedDataAttributes) }}>
<x-keys::popover
    :id="$id"
    :placement="$computedPlacement"
    :fullWidth="true"
>
    <x-slot:trigger>
        <button
            type="button"
            class="{{ $computedButtonClasses }}"
            data-popover-trigger="{{ $id }}"
            popovertarget="{{ $id }}"
            {{ $attributes->only([])->merge($computedTriggerDataAttributes) }}
        >
            {{-- Icon --}}
            @if($hasIcon())
                <x-keys::icon
                    :name="$icon"
                    size="{{ $computedIconSize }}"
                    class="{{ $computedIconClasses }}"
                />
            @endif

            {{-- Content --}}
            @if($hasHeading())
                <div class="flex-1 min-w-0">
                    <span class="truncate">{{ $heading }}</span>
                </div>
            @endif

            {{-- Chevron Arrow --}}
            <x-keys::icon
                name="heroicon-o-chevron-right"
                size="sm"
                class="text-muted flex-shrink-0 transition-transform duration-200"
            />
        </button>
    </x-slot:trigger>

    {{-- Submenu panel content --}}
    <div class="{{ $computedPanelClasses }}" {{ $attributes->only([])->merge($computedPanelDataAttributes) }}>
        {{ $slot }}
    </div>
</x-keys::popover>
</div>
