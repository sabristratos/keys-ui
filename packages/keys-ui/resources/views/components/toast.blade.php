{{-- Toast Container with positioning --}}
<div class="{{ $computedContainerClasses }}" data-toast-container="{{ $position }}">
    {{-- Pre-rendered toast variants using Alert component --}}

    {{-- Success Toast --}}
    <div class="{{ $computedToastClasses }} {{ $computedAnimationClasses }}"
         data-toast="true"
         data-toast-variant="success"
         data-toast-position="{{ $position }}"
         data-toast-visible="false"
         style="display: none;"
         role="alert"
         aria-live="polite"
         id="toast-success-{{ $position }}">
        <x-keys::alert variant="success" dismissible>
            <x-slot name="content">
                <div data-toast-title class="hidden font-medium"></div>
                <div data-toast-message></div>
            </x-slot>
            <x-slot name="actions">
                <div data-toast-actions class="hidden"></div>
            </x-slot>
        </x-keys::alert>
    </div>

    {{-- Error Toast --}}
    <div class="{{ $computedToastClasses }} {{ $computedAnimationClasses }}"
         data-toast="true"
         data-toast-variant="error"
         data-toast-position="{{ $position }}"
         data-toast-visible="false"
         style="display: none;"
         role="alert"
         aria-live="polite"
         id="toast-error-{{ $position }}">
        <x-keys::alert variant="danger" dismissible>
            <x-slot name="content">
                <div data-toast-title class="hidden font-medium"></div>
                <div data-toast-message></div>
            </x-slot>
            <x-slot name="actions">
                <div data-toast-actions class="hidden"></div>
            </x-slot>
        </x-keys::alert>
    </div>

    {{-- Warning Toast --}}
    <div class="{{ $computedToastClasses }} {{ $computedAnimationClasses }}"
         data-toast="true"
         data-toast-variant="warning"
         data-toast-position="{{ $position }}"
         data-toast-visible="false"
         style="display: none;"
         role="alert"
         aria-live="polite"
         id="toast-warning-{{ $position }}">
        <x-keys::alert variant="warning" dismissible>
            <x-slot name="content">
                <div data-toast-title class="hidden font-medium"></div>
                <div data-toast-message></div>
            </x-slot>
            <x-slot name="actions">
                <div data-toast-actions class="hidden"></div>
            </x-slot>
        </x-keys::alert>
    </div>

    {{-- Info Toast --}}
    <div class="{{ $computedToastClasses }} {{ $computedAnimationClasses }}"
         data-toast="true"
         data-toast-variant="info"
         data-toast-position="{{ $position }}"
         data-toast-visible="false"
         style="display: none;"
         role="alert"
         aria-live="polite"
         id="toast-info-{{ $position }}">
        <x-keys::alert variant="info" dismissible>
            <x-slot name="content">
                <div data-toast-title class="hidden font-medium"></div>
                <div data-toast-message></div>
            </x-slot>
            <x-slot name="actions">
                <div data-toast-actions class="hidden"></div>
            </x-slot>
        </x-keys::alert>
    </div>
</div>

{{-- Animation Styles --}}
<style>
/* Toast container animations */
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

/* Stacking animation for multiple toasts */
[data-toast-container] [data-toast][data-toast-visible="true"]:not(:last-child) {
    margin-bottom: 0.75rem;
}

/* Hover effects */
[data-toast-container] [data-toast]:hover {
    transform: scale(1.02) translateY(0);
}

/* Exit animation */
[data-toast-container] [data-toast][data-toast-exiting="true"] {
    transform: scale(0.9) translateY(-0.5rem);
    opacity: 0;
    pointer-events: none;
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
    [data-toast-container] [data-toast] {
        backdrop-filter: blur(8px);
    }
}
</style>