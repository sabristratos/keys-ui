
@php
    $triggerClasses = 'flex items-center w-full px-2 py-2 text-sm text-left transition-colors duration-150 rounded-md group relative';

    $triggerStateClasses = $disabled
        ? 'text-neutral-400 cursor-not-allowed bg-neutral-disabled dark:text-neutral-500'
        : 'text-foreground hover:bg-neutral-hover focus-visible:outline-none focus-visible:bg-neutral-hover cursor-pointer';

    $panelBase = 'focus-visible:outline-none space-y-1 max-w-[85vw] w-max';

    $panelSizeClasses = match ($size) {
        'sm' => 'min-w-40 sm:min-w-40 p-1',
        'md' => 'min-w-48 sm:min-w-48 p-1',
        'lg' => 'min-w-56 sm:min-w-56 p-1',
        default => 'min-w-48 sm:min-w-48 p-1'
    };

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
                    class="text-muted flex-shrink-0 transition-transform duration-200"
                />
            </button>
        </x-slot:trigger>

        <div class="{{ $panelBase }} {{ $panelSizeClasses }}" {{ $attributes->only([])->merge($panelDataAttributes) }}>
            {{ $slot }}
        </div>
    </x-keys::popover>
</div>
