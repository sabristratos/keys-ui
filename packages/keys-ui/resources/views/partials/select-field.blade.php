
<style>
[data-select="true"] [data-select-dropdown] {
    z-index: 50;
    background-color: var(--color-surface);
    border-color: var(--color-border);
}


[data-select="true"] [data-select-option] {
    transition: background-color 150ms ease-in-out;
}

[data-select="true"] [data-select-option]:hover:not([aria-disabled="true"]):not([aria-selected="true"]) {
    background-color: var(--color-neutral-100);
}

.dark [data-select="true"] [data-select-option]:hover:not([aria-disabled="true"]):not([aria-selected="true"]) {
    background-color: var(--color-neutral-800);
}

[data-select="true"] [data-select-option][aria-selected="true"] {
    background-color: var(--color-brand-50);
    color: var(--color-brand-700);
}

.dark [data-select="true"] [data-select-option][aria-selected="true"] {
    background-color: rgba(var(--color-brand-900), 0.2);
    color: var(--color-brand-300);
}

[data-select="true"] [data-select-option][aria-disabled="true"] {
    background-color: var(--color-neutral-50);
    color: var(--color-neutral-400);
    cursor: not-allowed;
}

.dark [data-select="true"] [data-select-option][aria-disabled="true"] {
    background-color: var(--color-neutral-800);
    color: var(--color-neutral-500);
}

[data-select="true"] [data-chip-value] {
    animation: chipIn 200ms ease-out;
}

[data-select="true"] .select-arrow {
    transition: transform 200ms ease-in-out;
}

[data-select="true"] [data-select-dropdown]:not(.hidden) {
    animation: dropdownSlideIn 200ms ease-out;
}

[data-select="true"] [data-select-trigger]:focus {
    outline: none;
    ring: 2px;
    ring-color: var(--color-brand);
    ring-offset: 2px;
}

[data-select="true"] [data-remove-chip]:hover svg {
    transform: scale(1.1);
}

[data-select="true"] [data-select-no-results] {
    font-style: italic;
    color: var(--color-neutral-400);
}

@keyframes chipIn {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes dropdownSlideIn {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 640px) {
    [data-select="true"] [data-select-dropdown] {
        max-height: 50vh;
    }

    [data-select="true"] [data-select-option] {
        padding: 0.75rem 1rem;
    }
}
</style>


@if($multiple)
    @foreach($getSelectedValues() as $selectedValue)
        <input type="hidden" name="{{ $name }}[]" value="{{ $selectedValue }}" class="select-hidden-input" {{ $livewireAttributes ?? '' }}>
    @endforeach
@else
    <input type="hidden" name="{{ $name }}" value="{{ is_array($value) ? '' : $value }}" class="select-hidden-input" {{ $livewireAttributes ?? '' }}>
@endif


<div
    role="button"
    tabindex="0"
    class="{{ $computedTriggerClasses }}"
    id="{{ $uniqueId }}"
    aria-haspopup="listbox"
    aria-expanded="false"
    data-select-trigger
    @if($disabled) aria-disabled="true" @endif
>
    <div class="flex items-center justify-between">
        <div class="flex items-center flex-1 min-w-0">
            
            <div class="select-display flex justify-start flex-1">
                @if($multiple)
                    
                    <div class="flex flex-wrap gap-1" data-select-chips>
                        <span class="text-neutral-500 select-placeholder">{{ $placeholder ?? 'Select options...' }}</span>
                    </div>
                @else
                    
                    <span class="select-value truncate">
                        @if($value)
                            {{ $value }}
                        @else
                            <span class="text-neutral-500 select-placeholder">{{ $placeholder ?? 'Select option...' }}</span>
                        @endif
                    </span>
                @endif
            </div>
        </div>

        
        <div class="flex items-center gap-1 ml-2">
            @if($clearable && !empty($getSelectedValues()) && !$disabled)
                <button type="button" class="p-1 hover:text-danger-500" data-select-clear>
                    <x-keys::icon name="heroicon-o-x-mark" size="{{ $computedIconSize }}" />
                </button>
            @endif
            <x-keys::icon
                name="heroicon-o-chevron-down"
                size="{{ $computedIconSize }}"
                class="text-neutral-400 select-arrow transition-transform duration-200"
            />
        </div>
    </div>
</div>


<div class="{{ $computedDropdownClasses }} hidden p-2" data-select-dropdown>
    
    @if($searchable)
        <div class="mb-2">
            <x-keys::input
                type="text"
                placeholder="Search options..."
                size="sm"
                icon-left="heroicon-o-magnifying-glass"
                data-select-search
            />
        </div>
    @endif

    
    <div class="max-h-48 overflow-y-auto overflow-x-hidden" data-select-options>
        {{ $slot }}
    </div>

    
    <div class="px-3 py-2 text-sm text-neutral-500 text-left hidden" data-select-no-results>
        No options found
    </div>
</div>
