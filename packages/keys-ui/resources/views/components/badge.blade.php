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
], $elementAttributes)) }}>
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
</{{ $elementTag }}>