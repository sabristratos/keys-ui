@php
    $containerClasses = 'text-center';
    $containerClasses .= match ($size) {
        'sm' => ' py-8 px-4',
        'md' => ' py-12 px-6',
        'lg' => ' py-16 px-8',
        default => ' py-12 px-6'
    };

    $iconClasses = 'mx-auto mb-4';
    $iconClasses .= match ($variant) {
        'brand' => ' text-accent',
        'success' => ' text-success',
        'warning' => ' text-warning',
        'danger' => ' text-danger',
        'info' => ' text-info',
        default => ' text-muted'
    };

    $headingSize = match ($size) {
        'sm' => 'md',
        'md' => 'lg',
        'lg' => 'xl',
        default => 'lg'
    };

    $textSize = match ($size) {
        'sm' => 'sm',
        'md' => 'md',
        'lg' => 'lg',
        default => 'md'
    };

    $textMargin = match ($size) {
        'sm' => ' mb-4',
        'md' => ' mb-6',
        'lg' => ' mb-6',
        default => ' mb-6'
    };

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

    <x-keys::heading level="h3" :size="$headingSize" weight="semibold" class="mb-2">
        {{ $title }}
    </x-keys::heading>

    <x-keys::text color="muted" :size="$textSize" :class="'max-w-md mx-auto' . $textMargin">
        {{ $description }}
    </x-keys::text>

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
