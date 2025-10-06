
@php
    $triggerClasses = 'flex items-center w-full px-2 py-2 text-sm text-left transition-colors duration-150 rounded-md group relative';

    $triggerStateClasses = $disabled
        ? 'text-muted cursor-not-allowed opacity-50'
        : 'text-primary hover:bg-neutral-hover focus-visible:outline-none focus-visible:bg-neutral-hover cursor-pointer';

    $iconClasses = 'flex-shrink-0 mr-3';
@endphp

<div class="w-full" {{ $attributes->merge($dataAttributes) }}>
    <x-keys::popover
        :id="$id"
        :placement="$placement"
        :fullWidth="true"
    >
        <x-slot:trigger>
            <button
                type="button"
                class="{{ $triggerClasses }} {{ $triggerStateClasses }}"
                data-popover-trigger="{{ $id }}"
                popovertarget="{{ $id }}"
                {{ $attributes->only([])->merge($triggerDataAttributes) }}
            >
                @if($hasIcon())
                    <x-keys::icon
                        :name="$icon"
                        size="sm"
                        class="{{ $iconClasses }}"
                    />
                @endif

                @if($hasHeading())
                    <div class="flex-1 min-w-0">
                        <span class="truncate">{{ $heading }}</span>
                    </div>
                @endif

                <x-keys::icon
                    name="heroicon-o-chevron-right"
                    size="sm"
                    class="flex-shrink-0 transition-transform duration-200"
                    data-submenu-chevron="true"
                />
            </button>
        </x-slot:trigger>

        <div role="menu" class="flex flex-col gap-0.5">
            {{ $slot }}
        </div>
    </x-keys::popover>
</div>
