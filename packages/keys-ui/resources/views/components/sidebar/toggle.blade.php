
@php
    $orderClasses = match ($position) {
        'left' => 'order-first',
        'right' => 'order-last',
        default => 'order-last'
    };
@endphp

<x-keys::button
    :variant="$variant"
    :size="$size"
    :icon-left="$desktopIcon"
    :class="'rotate-90 ' . $orderClasses"
    :data-sidebar-toggle="$sidebarId"
    data-keys-sidebar-toggle="true"
    :data-mobile-icon="$mobileIcon"
    :data-desktop-icon="$desktopIcon"
    title="Toggle sidebar"
    {{ $attributes }}
></x-keys::button>
