<div {{ $attributes->merge(['class' => $computedContainerClasses]) }}
     data-tabs="true"
     data-orientation="{{ $orientation }}"
     data-variant="{{ $variant }}"
     data-size="{{ $size }}"
     data-value="{{ $value }}"
     data-disabled="{{ $disabled ? 'true' : 'false' }}"
     id="{{ $uniqueId }}">

    
    <div class="{{ $computedTabListClasses }}" role="tablist" aria-label="Tabs" data-tabs-list="true">
        {{ $slot }}

        {{-- Animated marker element --}}
        <div class="tab-marker" data-tab-marker="true" aria-hidden="true"></div>
    </div>

    {{-- Panels container --}}
    <div class="{{ $computedPanelsContainerClasses }}" data-tabs-panels="true">
        {{ $panels ?? '' }}
    </div>
</div>

{{-- Component-specific styles for animated marker --}}
<style>
[data-tabs="true"] {
    position: relative;
}

[data-tabs-list="true"] {
    position: relative;
}

.tab-marker {
    position: absolute;
    transition: all 0.2s ease;
    pointer-events: none;
    z-index: 0;
}

/* Horizontal tabs marker */
[data-orientation="horizontal"] .tab-marker {
    height: 2px;
    bottom: 0;
    left: 0;
    border-radius: var(--radius-sm);
    background: var(--color-brand);
}

/* Vertical tabs marker */
[data-orientation="vertical"] .tab-marker {
    width: 2px;
    top: 0;
    left: 0;
    border-radius: var(--radius-sm);
    background: var(--color-brand);
}

/* Pills variant marker - full height behind tab */
[data-variant="pills"] .tab-marker {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    top: 0;
    left: 0;
    z-index: 0;
}

/* Tab states */
[data-tabs-trigger="true"] {
    position: relative;
    transition: color 0.2s ease;
    z-index: 1;
}

/* Hover state handled by Tailwind classes in Tab.php */

/* Remove focus styles for non-keyboard users */
[data-tabs-trigger="true"]:focus:not(:focus-visible) {
    outline: 0;
    box-shadow: none;
}

/* Focus ring only on keyboard navigation */
[data-tabs-trigger="true"]:focus-visible {
    outline: 2px solid var(--color-border);
    outline-offset: 2px;
}

/* Active state handled by Tailwind classes in Tab.php */

/* Panel states */
[data-tabs-panel="true"] {
    display: none;
    outline: none;
}

[data-tabs-panel="true"][data-state="active"] {
    display: block;
}

/* Vertical tabs alignment - left align content */
[data-orientation="vertical"] [data-tabs-trigger="true"] {
    justify-content: flex-start;
    text-align: left;
}

/* Horizontal tabs - keep center alignment */
[data-orientation="horizontal"] [data-tabs-trigger="true"] {
    justify-content: center;
}
</style>
