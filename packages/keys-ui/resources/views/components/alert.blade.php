@php

    $baseClasses = 'rounded-lg border bg-surface';

    $variantClasses = match ($variant) {
        'info' => 'border-blue-600',
        'success' => 'border-green-600',
        'warning' => 'border-yellow-600',
        'danger' => 'border-red-600',
        'neutral' => 'border-border',
        'brand' => 'border-brand',
        default => 'border-blue-600'
    };

    $sizeClasses = match ($size) {
        'sm' => 'p-3 space-y-2 text-sm',
        'md' => 'p-4 space-y-3 text-sm',
        'lg' => 'p-5 space-y-4 text-base',
        default => 'p-4 space-y-3 text-sm'
    };

    $iconColor = match ($variant) {
        'info' => 'text-blue-600',
        'success' => 'text-green-600',
        'warning' => 'text-yellow-600',
        'danger' => 'text-red-600',
        'neutral' => 'text-neutral',
        'brand' => 'text-brand',
        default => 'text-blue-600'
    };

    $iconSize = match ($size) {
        'sm' => 'sm',
        'md' => 'md',
        'lg' => 'lg',
        default => 'md'
    };

    $titleClasses = match ($size) {
        'sm' => 'text-sm font-medium text-foreground',
        'md' => 'text-base font-medium text-foreground',
        'lg' => 'text-lg font-semibold text-foreground',
        default => 'text-base font-medium text-foreground'
    };

    $contentClasses = match ($size) {
        'sm' => 'text-xs text-muted',
        'md' => 'text-sm text-muted',
        'lg' => 'text-base text-muted',
        default => 'text-sm text-muted'
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
                <div class="{{ $titleClasses }}">
                    {{ $title }}
                </div>
            @endif

            <div class="{{ $contentClasses }}{{ $hasTitle ? ' mt-1' : '' }}">
                {{ $slot }}
            </div>

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