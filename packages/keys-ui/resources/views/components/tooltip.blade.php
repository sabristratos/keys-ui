

@php

    $hasRichContent = !$hasContent() && isset($template) && !empty(trim($template ?? ''));
@endphp

<span style="anchor-name: {{ $anchorName }};" class="flex" data-tooltip-trigger="{{ $id }}">
    {{ $slot }}
</span>

<div
    id="{{ $id }}"
    popover="manual"
    data-keys-popover="true"
    data-keys-tooltip="true"
    data-placement="{{ $placement }}"
    data-color="{{ $color }}"
    {{ $attributes->only('data-sidebar-tooltip') }}
    class="{{ $tooltipClasses }}"
    style="--popover-anchor: {{ $anchorName }};"
    role="tooltip"
    aria-hidden="true"
>

    @if($hasContent())
        {{ $content }}
    @elseif($hasRichContent)
        {{ $template }}
    @endif
</div>

<script>
(function() {
    const trigger = document.querySelector('[data-tooltip-trigger="{{ $id }}"]');
    const tooltip = document.getElementById('{{ $id }}');
    if (!trigger || !tooltip) return;

    const isSidebarTooltip = tooltip.hasAttribute('data-sidebar-tooltip');

    let hideTimeout;
    const show = () => {
        if (isSidebarTooltip) {
            const sidebar = trigger.closest('[data-keys-sidebar="true"]');
            if (!sidebar || sidebar.dataset.collapsed !== 'true') {
                return;
            }
        }
        clearTimeout(hideTimeout);
        tooltip.showPopover();
    };
    const hide = () => { hideTimeout = setTimeout(() => tooltip.hidePopover(), 100); };

    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    tooltip.addEventListener('mouseenter', show);
    tooltip.addEventListener('mouseleave', hide);
})();
</script>
