@php
    $slotContent = $slot->toHtml();
    $isIconOnly = $isIconOnly($slotContent);
    $elementTag = $dismissible ? 'button' : 'span';
    $elementAttributes = $dismissible ? [
        'type' => 'button',
        'data-dismiss-target' => "#$id",
        'aria-label' => __('keys-ui::keys-ui.actions.remove_badge')
    ] : [];
@endphp

<{{ $elementTag }} {{ $attributes->merge(array_merge([
    'class' => $badgeClasses($isIconOnly),
    'id' => $id
], $elementAttributes))->merge($dataAttributes)->merge(['data-icon-only' => $isIconOnly ? 'true' : 'false']) }}>
    @if($variant === 'subtle')
        @if(!$isIconOnly)
            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 relative {{ $dotColorClasses() }}">
                <span class="absolute inset-0 bg-current rounded-full"></span>
                <span class="absolute inset-0 rounded-full ring-2 ring-current opacity-20"></span>
            </span>
        @endif

        @if($icon && !$isIconOnly)
            <x-keys::icon :name="$icon" :size="$iconSize()" />
        @endif

        @if($isIconOnly)
            <x-keys::icon :name="$icon" :size="$iconSize()" />
        @else
            {{ $slot }}
        @endif
    @else
        @if($icon && !$isIconOnly)
            <x-keys::icon :name="$icon" :size="$iconSize()" class="mr-1" />
        @endif

        @if($isIconOnly)
            <x-keys::icon :name="$icon" :size="$iconSize()" />
        @else
            {{ $slot }}
        @endif

        @if($dismissible)
            <x-keys::icon name="heroicon-o-x-mark" size="xs" class="ml-1" />
            <span class="sr-only">{{ __('keys-ui::keys-ui.actions.remove_badge') }}</span>
        @endif
    @endif
</{{ $elementTag }}>

