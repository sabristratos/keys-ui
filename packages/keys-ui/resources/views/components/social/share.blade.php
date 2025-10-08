
<x-keys::group
    :orientation="$layout"
    :attached="$attached"
    {{ $attributes->merge($dataAttributes) }}
>
    @foreach($platforms as $platform)
        @if(isset($shareUrls[$platform]))
            <x-keys::button
                :href="$shareUrls[$platform]"
                target="_blank"
                rel="noopener noreferrer"
                :variant="$variant"
                :size="$size"
                :icon-left="$platformIcons[$platform]"
                onclick="window.open(this.href, 'share-dialog', 'width=600,height=600'); return false;"
            >
                @if($showLabels)
                    {{ $platformLabels[$platform] }}
                @endif
            </x-keys::button>
        @endif
    @endforeach
</x-keys::group>
