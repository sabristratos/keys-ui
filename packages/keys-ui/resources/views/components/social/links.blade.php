
<x-keys::group
    :orientation="$layout"
    :attached="$attached"
    {{ $attributes->merge($dataAttributes) }}
>
    @foreach($links as $platform => $url)
        @if(isset($platformIcons[$platform]))
            <x-keys::button
                :href="$url"
                :target="$target"
                rel="noopener noreferrer"
                :variant="$variant"
                :size="$size"
                :icon-left="$platformIcons[$platform]"
            >
                @if($showLabels)
                    {{ $platformLabels[$platform] ?? ucfirst($platform) }}
                @endif
            </x-keys::button>
        @endif
    @endforeach
</x-keys::group>
