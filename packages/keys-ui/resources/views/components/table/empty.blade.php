@php
    $emptyContainerClasses = 'text-center';
    $emptyContainerClasses .= match ($size) {
        'sm' => ' py-8',
        'md' => ' py-12',
        'lg' => ' py-16',
        default => ' py-12'
    };

    $iconClasses = 'mx-auto mb-4';
    $iconClasses .= match ($variant) {
        'success' => ' text-success-400',
        'warning' => ' text-warning-400',
        'danger' => ' text-danger-400',
        'brand' => ' text-brand-400',
        default => ' text-neutral-400'
    };

    $titleClasses = 'font-medium text-foreground mb-2';
    $titleClasses .= match ($size) {
        'sm' => ' text-sm',
        'md' => ' text-base',
        'lg' => ' text-lg',
        default => ' text-base'
    };

    $descriptionClasses = 'text-muted mb-4';
    $descriptionClasses .= match ($size) {
        'sm' => ' text-xs',
        'md' => ' text-sm',
        'lg' => ' text-base',
        default => ' text-sm'
    };
@endphp

<tr {{ $attributes->merge($dataAttributes) }}>
    <td colspan="100" class="px-6 py-4 bg-surface border-t border-border">
        <div class="{{ $emptyContainerClasses }}">
            @if($icon)
                <x-keys::icon
                    :name="$icon"
                    size="{{ $getIconSize() }}"
                    class="{{ $iconClasses }}"
                />
            @endif

            @if($title)
                <h3 class="{{ $titleClasses }}">
                    {{ $title }}
                </h3>
            @endif

            @if($description)
                <p class="{{ $descriptionClasses }}">
                    {{ $description }}
                </p>
            @endif

            @if($hasAction())
                <x-keys::button
                    :href="$actionUrl"
                    variant="brand"
                    size="sm"
                >
                    {{ $actionText }}
                </x-keys::button>
            @endif

            {{ $slot }}
        </div>
    </td>
</tr>