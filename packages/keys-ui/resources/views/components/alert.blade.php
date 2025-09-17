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
        {{-- Icon --}}
        <div class="flex-shrink-0">
            <x-keys::icon
                :name="$iconName()"
                :size="$iconSize()"
                :class="$iconColor()" />
        </div>

        {{-- Content --}}
        <div class="ml-3 flex-1">
            {{-- Title --}}
            @if($title || isset($title))
                <div class="{{ $titleClasses() }}">
                    {{ $title ?? $title }}
                </div>
            @endif

            {{-- Main Content --}}
            <div class="{{ $contentClasses() }} {{ $title ? 'mt-1' : '' }}">
                {{ $slot }}
            </div>

            {{-- Actions --}}
            @isset($actions)
                <div class="mt-3 flex space-x-2">
                    {{ $actions }}
                </div>
            @endisset
        </div>

        {{-- Dismiss Button --}}
        @if($dismissible)
            <div class="ml-auto pl-3">
                <x-keys::button
                    variant="ghost"
                    size="xs"
                    icon-left="heroicon-o-x-mark"
                    :icon-only="true"
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