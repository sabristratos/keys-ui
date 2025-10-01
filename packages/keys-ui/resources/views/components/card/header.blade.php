@if($title || $subtitle || $icon || $slot->isNotEmpty())
    <div class="flex items-center justify-between" data-keys-card-slot="header">
        <div class="flex items-center space-x-3">
            @if($icon)
                <x-keys::icon :name="$icon" class="w-5 h-5" />
            @endif

            <div>
                @if($title)
                    <{{ $titleTag }} class="text-lg font-semibold text-foreground">
                        {{ $title }}
                    </{{ $titleTag }}>
                @endif

                @if($subtitle)
                    <p class="text-sm text-muted mt-1">{{ $subtitle }}</p>
                @endif
            </div>
        </div>

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