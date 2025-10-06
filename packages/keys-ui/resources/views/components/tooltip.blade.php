

@php
    $anchorName = "--tooltip-{$id}";

    $baseClasses = 'rounded-md font-medium pointer-events-none shadow-lg';

    $sizeClasses = match ($size) {
        'sm' => 'px-2 py-1 text-xs',
        'md' => 'px-3 py-2 text-sm',
        'lg' => 'px-4 py-3 text-base',
        default => 'px-3 py-2 text-sm'
    };

    $colorClasses = match ($color) {
        'dark' => 'bg-neutral-900 text-white border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600',
        'light' => 'bg-elevation-1 text-primary border border-line',
        default => 'bg-neutral-900 text-white border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600'
    };

    $tooltipClasses = trim("$baseClasses $sizeClasses $colorClasses");

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
