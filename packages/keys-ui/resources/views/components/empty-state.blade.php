@php
    // Container styling with size-based padding
    $containerClasses = 'text-center';
    $containerClasses .= match ($size) {
        'sm' => ' py-8 px-4',
        'md' => ' py-12 px-6',
        'lg' => ' py-16 px-8',
        default => ' py-12 px-6'
    };

    // Icon styling with variant-based colors
    $iconClasses = 'mx-auto mb-4';
    $iconClasses .= match ($variant) {
        'brand' => ' text-brand',
        'success' => ' text-success',
        'warning' => ' text-warning',
        'danger' => ' text-danger',
        'info' => ' text-info',
        default => ' text-muted'
    };

    // Title styling with size variants
    $titleClasses = 'font-semibold text-foreground mb-2';
    $titleClasses .= match ($size) {
        'sm' => ' text-base',
        'md' => ' text-lg',
        'lg' => ' text-xl',
        default => ' text-lg'
    };

    // Description styling with size variants
    $descriptionClasses = 'text-muted max-w-md mx-auto';
    $descriptionClasses .= match ($size) {
        'sm' => ' text-sm mb-4',
        'md' => ' text-base mb-6',
        'lg' => ' text-lg mb-6',
        default => ' text-base mb-6'
    };

    // Action container spacing and centering
    $actionContainerClasses = 'flex justify-center';
    $actionContainerClasses .= match ($size) {
        'sm' => ' mt-4',
        'md' => ' mt-6',
        'lg' => ' mt-6',
        default => ' mt-6'
    };
@endphp

<div {{ $attributes->merge(['class' => $containerClasses])->merge($dataAttributes) }}>
    @if($icon)
        <x-keys::icon
            :name="$icon"
            :size="$getIconSize()"
            :class="$iconClasses"
        />
    @endif

    <h3 class="{{ $titleClasses }}">
        {{ $title }}
    </h3>

    <p class="{{ $descriptionClasses }}">
        {{ $description }}
    </p>

    @if($hasAction())
        <div class="{{ $actionContainerClasses }}">
            <x-keys::button
                :href="$actionUrl"
                :variant="$getButtonVariant()"
                :size="$getButtonSize()"
                :icon-left="$actionIcon"
            >
                {{ $actionText }}
            </x-keys::button>
        </div>
    @endif

    @if($slot->isNotEmpty())
        <div class="{{ $actionContainerClasses }}">
            {{ $slot }}
        </div>
    @endif
</div>
