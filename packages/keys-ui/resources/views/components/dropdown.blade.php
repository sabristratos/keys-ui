{{-- Dropdown Component --}}
<div class="{{ $computedDropdownClasses }}" {{ $attributes->merge($computedDataAttributes) }}>
    {{-- Trigger --}}
    <div class="{{ $computedTriggerClasses }}" data-dropdown-trigger>
        {{ $trigger }}
    </div>

    {{-- Dropdown Panel --}}
    <div class="{{ $computedPanelClasses }}" data-dropdown-panel>
        {{ $slot }}
    </div>
</div>