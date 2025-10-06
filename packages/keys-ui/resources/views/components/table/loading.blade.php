@php
    $loadingContainerClasses = 'text-center';
    $loadingContainerClasses .= match ($size) {
        'sm' => ' py-8',
        'md' => ' py-12',
        'lg' => ' py-16',
        default => ' py-12'
    };

    $textSize = match ($size) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };
@endphp

<tr {{ $attributes->merge($dataAttributes) }}>
    <td colspan="{{ $colspan }}" class="px-6 py-4 bg-elevation-1 border-t border-line">
        <div class="{{ $loadingContainerClasses }}">
            <div class="flex flex-col items-center">
                <x-keys::loading
                    animation="{{ $animation }}"
                    size="{{ $loadingIconSize }}"
                    class="text-accent"
                />

                @if($text)
                    <x-keys::text color="muted" :size="$textSize" class="mt-4">
                        {{ $text }}
                    </x-keys::text>
                @endif

                {{ $slot }}
            </div>
        </div>
    </td>
</tr>