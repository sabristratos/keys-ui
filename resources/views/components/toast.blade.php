<div class="{{ $computedContainerClasses }}" data-toast-container="{{ $position }}">
</div>
<style>
/* Toast container base */
[data-toast-container] {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

/* Default toast state (invisible) */
[data-toast-container] [data-toast] {
    transform: scale(0.95) translateY(-1rem);
    opacity: 0;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

/* Position-specific entry animations */
[data-toast-container] [data-toast][data-toast-position^="top"] {
    transform: scale(0.95) translateY(-1rem);
}

[data-toast-container] [data-toast][data-toast-position^="bottom"] {
    transform: scale(0.95) translateY(1rem);
}

/* Visible state */
[data-toast-container] [data-toast][data-toast-visible="true"] {
    transform: scale(1) translateY(0);
    opacity: 1;
    pointer-events: auto;
}

/* Hover effects for visible toasts */
[data-toast-container] [data-toast][data-toast-visible="true"]:hover {
    transform: translateY(0) translateZ(0);
    box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Exit animation */
[data-toast-container] [data-toast][data-toast-exiting="true"] {
    transform: scale(0.9) translateY(-0.5rem);
    opacity: 0;
    pointer-events: none;
}

/* Stacking improvements for multiple toasts */
[data-toast-container] [data-toast] + [data-toast] {
    margin-top: 0; /* Reset margins, use container gap instead */
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
    [data-toast-container] [data-toast]:not(:hover) {
        backdrop-filter: blur(8px);
    }

    [data-toast-container] [data-toast]:hover {
        box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
    }
}

/* Ensure proper z-index stacking for newer toasts */
[data-toast-container] [data-toast] {
    position: relative;
    z-index: 1;
    transform: translateZ(0); /* GPU acceleration for smoother animations */
}
</style>