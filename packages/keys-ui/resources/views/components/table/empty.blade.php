@php
    $emptyContainerClasses = 'text-center inline-flex flex-col justify-center';
    $emptyContainerClasses .= match ($size) {
        'sm' => ' py-8',
        'md' => ' py-12',
        'lg' => ' py-16',
        default => ' py-12'
    };

    $iconClasses = 'mx-auto mb-4';
    $iconClasses .= match ($variant) {
        'success' => ' text-success',
        'warning' => ' text-warning',
        'danger' => ' text-danger',
        'brand' => ' text-accent',
        default => ' text-muted'
    };

    $headingSize = match ($size) {
        'sm' => 'sm',
        'md' => 'md',
        'lg' => 'lg',
        default => 'md'
    };

    $textSize = match ($size) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };
@endphp

<tr {{ $attributes->merge($dataAttributes) }}>
    <td colspan="100" class="px-6 py-4 bg-elevation-1 text-center border-t border-line">
        <div class="{{ $emptyContainerClasses }}">
            @if($icon)
                <x-keys::icon
                    :name="$icon"
                    size="{{ $iconSize }}"
                    class="{{ $iconClasses }}"
                />
            @endif

            @if($title)
                <x-keys::heading level="h3" :size="$headingSize" weight="medium" class="mb-2">
                    {{ $title }}
                </x-keys::heading>
            @endif

            @if($description)
                <x-keys::text color="muted" :size="$textSize" class="mb-4">
                    {{ $description }}
                </x-keys::text>
            @endif

            @if($hasAction)
                <div>
                <x-keys::button
                    :href="$actionUrl"
                    color="primary"
                    size="sm"
                >
                    {{ $actionText }}
                </x-keys::button>
                </div>
            @endif

            {{ $slot }}
        </div>
    </td>
</tr>
