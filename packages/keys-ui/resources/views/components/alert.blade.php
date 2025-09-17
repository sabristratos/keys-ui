@php
    $elementAttributes = $attributes->merge([
        'class' => trim($baseClasses() . ' ' . $variantClasses() . ' ' . $sizeClasses()),
        'role' => 'alert'
    ]);

    if ($dismissible) {
        $elementAttributes = $elementAttributes->merge([
            'data-dismissible' => 'true'
        ]);
    }
@endphp

<div {{ $elementAttributes }}>
    <div class="flex">
        <div class="flex-shrink-0">
            <x-keys::icon
                :name="$iconName()"
                :size="$iconSize()"
                :class="$iconColor()" />
        </div>

        <div class="ml-3 flex-1">
            @if($title)
                <div class="{{ $titleClasses() }}">
                    {{ $title }}
                </div>
            @endif

            <div class="{{ $contentClasses() }} {{ $title ? 'mt-1' : '' }}">
                {{ $slot }}
            </div>

            @isset($actions)
                <div class="flex space-x-2 [&:not(:has(.hidden))]:mt-3">
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
                    data-dismiss-alert
                    aria-label="Dismiss"
                    :class="$iconColor()"
                >
                    <span class="sr-only">Dismiss</span>
                </x-keys::button>
            </div>
        @endif
    </div>
</div>