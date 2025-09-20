@props(['computedTooltipClasses', 'computedArrowClasses', 'tooltipAttributes', 'triggerAttributes', 'arrow'])

<div {{ $attributes->merge($tooltipAttributes)->merge(['class' => $computedTooltipClasses . ' rounded-lg font-medium shadow-lg keys-tooltip']) }}>
    {{ $slot }}

    @if(isset($arrow) && $arrow)
        <div class="absolute w-0 h-0 keys-tooltip-arrow {{ $computedArrowClasses }}" data-popper-arrow></div>
    @endif
</div>

<style>
    /* Tooltip visibility and animations */
    .keys-tooltip {
        position: fixed;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transform: scale(0.95);
        transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                    visibility 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
    }

    .keys-tooltip[data-show="true"] {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
        pointer-events: auto;
    }

    .keys-tooltip[data-show="false"] {
        opacity: 0;
        visibility: hidden;
        transform: scale(0.95);
        pointer-events: none;
    }

    /* Arrow styling for different placements */
    .keys-tooltip[data-placement="top"] .keys-tooltip-arrow {
        bottom: -6px;
        left: 50%;
        margin-left: -6px;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid;
    }

    .keys-tooltip[data-placement="bottom"] .keys-tooltip-arrow {
        top: -6px;
        left: 50%;
        margin-left: -6px;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid;
    }

    .keys-tooltip[data-placement="left"] .keys-tooltip-arrow {
        right: -6px;
        top: 50%;
        margin-top: -6px;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 6px solid;
    }

    .keys-tooltip[data-placement="right"] .keys-tooltip-arrow {
        left: -6px;
        top: 50%;
        margin-top: -6px;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-right: 6px solid;
    }

    /* Arrow colors using semantic tokens with automatic light/dark switching */
    .keys-tooltip[data-color="dark"] .keys-tooltip-arrow {
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }

    .keys-tooltip[data-color="dark"][data-placement="top"] .keys-tooltip-arrow {
        border-top-color: var(--tooltip-dark-bg);
    }

    .keys-tooltip[data-color="dark"][data-placement="bottom"] .keys-tooltip-arrow {
        border-bottom-color: var(--tooltip-dark-bg);
    }

    .keys-tooltip[data-color="dark"][data-placement="left"] .keys-tooltip-arrow {
        border-left-color: var(--tooltip-dark-bg);
    }

    .keys-tooltip[data-color="dark"][data-placement="right"] .keys-tooltip-arrow {
        border-right-color: var(--tooltip-dark-bg);
    }

    /* Arrow colors for light tooltips using semantic tokens */
    .keys-tooltip[data-color="light"] .keys-tooltip-arrow {
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }

    .keys-tooltip[data-color="light"][data-placement="top"] .keys-tooltip-arrow {
        border-top-color: var(--surface);
    }

    .keys-tooltip[data-color="light"][data-placement="bottom"] .keys-tooltip-arrow {
        border-bottom-color: var(--surface);
    }

    .keys-tooltip[data-color="light"][data-placement="left"] .keys-tooltip-arrow {
        border-left-color: var(--surface);
    }

    .keys-tooltip[data-color="light"][data-placement="right"] .keys-tooltip-arrow {
        border-right-color: var(--surface);
    }


    /* Hover states */
    [data-tooltip-target]:hover,
    [data-tooltip-trigger]:hover {
        cursor: help;
    }

    /* Size variants */
    .keys-tooltip[data-size="sm"] {
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
    }

    .keys-tooltip[data-size="md"] {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
    }

    .keys-tooltip[data-size="lg"] {
        padding: 0.75rem 1rem;
        font-size: 1rem;
    }

    /* Mobile responsiveness */
    @media (max-width: 640px) {
        .keys-tooltip {
            max-width: calc(100vw - 2rem);
        }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        .keys-tooltip {
            transition-duration: 0.1s;
        }
    }

    /* High contrast mode */
    @media (prefers-contrast: high) {
        .keys-tooltip {
            border-width: 2px;
        }
    }
</style>