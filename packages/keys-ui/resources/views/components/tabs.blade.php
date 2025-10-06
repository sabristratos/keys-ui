@php

    $containerClasses = match ($orientation) {
        'vertical' => 'flex gap-6',
        'horizontal' => 'flex flex-col space-y-4',
        default => 'flex flex-col space-y-4'
    };

    $sizeClasses = match ($size) {
        'sm' => 'text-sm',
        'md' => 'text-sm',
        'lg' => 'text-base',
        default => 'text-sm'
    };

    $tabListBaseClasses = 'tabs-list flex relative';
    $tabListOrientationClasses = match ($orientation) {
        'vertical' => 'flex-col space-y-1 min-w-0',
        'horizontal' => $stretch ? 'w-full gap-1' : 'space-x-1',
        default => $stretch ? 'w-full gap-1' : 'space-x-1'
    };
    $tabListVariantClasses = match ($variant) {
        'pills' => 'bg-base p-1 rounded-lg',
        'underline' => 'border-b border-line',
        'default' => 'border-b border-line',
        default => 'border-b border-line'
    };
    $tabListClasses = "$tabListBaseClasses $tabListOrientationClasses $tabListVariantClasses";

    $panelsContainerClasses = match ($orientation) {
        'vertical' => 'flex-1 min-w-0',
        'horizontal' => 'mt-4',
        default => 'mt-4'
    };

    $finalContainerClasses = trim("tabs-container $containerClasses $sizeClasses");
@endphp

<div {{ $attributes->merge(['class' => $finalContainerClasses])->merge($dataAttributes) }}>
    <div class="{{ $tabListClasses }}" role="tablist" aria-label="Tabs" data-tabs-list="true">
        {{ $slot }}

        
        <div class="tab-marker" data-tab-marker="true" aria-hidden="true"></div>
    </div>

    
    <div class="{{ $panelsContainerClasses }}" data-tabs-panels="true">
        {{ $panels ?? '' }}
    </div>
</div>

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
    background: var(--color-accent);
}

/* Vertical tabs marker */
[data-orientation="vertical"] .tab-marker {
    width: 2px;
    top: 0;
    left: 0;
    border-radius: var(--radius-sm);
    background: var(--color-accent);
}

/* Pills variant marker - full height behind tab */
[data-variant="pills"] .tab-marker {
    background: var(--color-elevation-1);
    border: 1px solid var(--color-line);
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
    outline: 2px solid var(--color-line);
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

/* Stretched tabs - make tabs grow to fill available space */
[data-stretch="true"] [data-tabs-trigger="true"] {
    flex: 1;
}
</style>
