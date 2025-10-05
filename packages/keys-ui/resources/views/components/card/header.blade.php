@if($title || $subtitle || $icon || $slot->isNotEmpty())
    <div class="flex items-center justify-between" data-keys-card-slot="header">
        @if($icon || $title || $subtitle)
            <div class="flex items-center space-x-3">
                @if($icon)
                    <x-keys::icon :name="$icon" class="w-5 h-5" />
                @endif

                <div>
                    @if($title)
                        <x-keys::heading :level="$titleTag" size="lg" weight="semibold">
                            {{ $title }}
                        </x-keys::heading>
                    @endif

                    @if($subtitle)
                        <x-keys::text color="muted" size="sm" class="mt-1">{{ $subtitle }}</x-keys::text>
                    @endif
                </div>
            </div>
        @endif

        @if($slot->isNotEmpty())
            <div class="flex items-center space-x-2">
                {{ $slot }}
            </div>
        @endif
    </div>
@endif

@if($divider)
    <x-keys::separator spacing="none" />
@endif