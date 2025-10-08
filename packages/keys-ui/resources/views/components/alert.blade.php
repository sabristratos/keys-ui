@php

    $baseClasses = 'rounded-lg border';

    $variantClasses = match ($variant) {
        'info' => 'border-info bg-info-subtle',
        'success' => 'border-success bg-success-subtle',
        'warning' => 'border-warning bg-warning-subtle',
        'danger' => 'border-danger bg-danger-subtle',
        'neutral' => 'border-line bg-elevation-1',
        'brand' => 'border-accent bg-accent-subtle',
        default => 'border-info bg-info-subtle'
    };

    $sizeClasses = match ($size) {
        'sm' => 'p-3 space-y-2 text-sm',
        'md' => 'p-4 space-y-3 text-sm',
        'lg' => 'p-5 space-y-4 text-base',
        default => 'p-4 space-y-3 text-sm'
    };

    $iconColor = match ($variant) {
        'info' => 'text-info',
        'success' => 'text-success',
        'warning' => 'text-warning',
        'danger' => 'text-danger',
        'neutral' => 'text-muted',
        'brand' => 'text-accent',
        default => 'text-info'
    };

    $iconSize = match ($size) {
        'sm' => 'sm',
        'md' => 'md',
        'lg' => 'lg',
        default => 'md'
    };

    $headingSize = match ($size) {
        'sm' => 'sm',
        'md' => 'md',
        'lg' => 'lg',
        default => 'md'
    };

    $headingWeight = match ($size) {
        'sm' => 'medium',
        'md' => 'medium',
        'lg' => 'semibold',
        default => 'medium'
    };

    $textSize = match ($size) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };

    $elementAttributes = $attributes->merge([
        'class' => trim("$baseClasses $variantClasses $sizeClasses"),
        'role' => 'alert',
        'aria-live' => 'polite'
    ])->merge($dataAttributes);

    if (isset($actions)) {
        $elementAttributes = $elementAttributes->merge(['data-has-actions' => 'true']);
    }
@endphp

<div {{ $elementAttributes }}>
    <div class="flex">
        @if($hasIcon)
            <div class="flex-shrink-0 mt-1">
                <x-keys::icon
                    :name="$iconName"
                    :size="$iconSize"
                    :class="$iconColor" />
            </div>
        @endif

        <div class="{{ $hasIcon ? 'ml-3' : '' }} flex-1">
            @if($hasTitle)
                <x-keys::heading :size="$headingSize" :weight="$headingWeight">
                    {{ $title }}
                </x-keys::heading>
            @endif

            <x-keys::text color="text" :size="$textSize" :class="$hasTitle ? 'mt-1' : ''">
                {{ $slot }}
            </x-keys::text>

            @isset($actions)
                <div class="flex space-x-2 [&:not(:has(.hidden))]:mt-3" data-alert-actions="true">
                    {{ $actions }}
                </div>
            @endisset
        </div>

        @if($dismissible)
            <div class="ml-auto pl-3">
                <x-keys::button
                    variant="ghost"
                    size="xs"
                    icon-left="heroicon-o-x-mark"
                    onclick="this.closest('[data-keys-alert]').remove()"
                    aria-label="Dismiss alert"
                    :class="$iconColor"
                />
            </div>
        @endif
    </div>
</div>
