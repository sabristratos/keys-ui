
<div class="{{ $computedDropdownClasses }}" {{ $attributes->merge($computedDataAttributes) }}>
    
    <div class="{{ $computedTriggerClasses }}" data-dropdown-trigger>
        {{ $trigger }}
    </div>

    
    <div class="{{ $computedPanelClasses }}" data-dropdown-panel>
        {{ $slot }}
    </div>
</div>