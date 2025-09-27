@php
    $loadingContainerClasses = 'text-center';
    $loadingContainerClasses .= match ($size) {
        'sm' => ' py-8',
        'md' => ' py-12',
        'lg' => ' py-16',
        default => ' py-12'
    };

    $textClasses = 'mt-4 text-muted';
    $textClasses .= match ($size) {
        'sm' => ' text-xs',
        'md' => ' text-sm',
        'lg' => ' text-base',
        default => ' text-sm'
    };
@endphp

<tr {{ $attributes->merge($dataAttributes) }}>
    <td colspan="{{ $colspan }}" class="px-6 py-4 bg-surface border-t border-border">
        <div class="{{ $loadingContainerClasses }}">
            <div class="flex flex-col items-center">
                <x-keys::loading
                    animation="{{ $animation }}"
                    size="{{ $getLoadingIconSize() }}"
                    class="text-brand"
                />

                @if($text)
                    <p class="{{ $textClasses }}">
                        {{ $text }}
                    </p>
                @endif

                {{ $slot }}
            </div>
        </div>
    </td>
</tr>