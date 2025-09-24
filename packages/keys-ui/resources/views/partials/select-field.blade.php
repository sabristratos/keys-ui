@once
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

[data-select="true"] [data-select-no-results] {
    font-style: italic;
    color: var(--color-neutral-400);
}

[data-select="true"][data-invalid="true"] [data-select-trigger] {
    border-color: var(--color-danger);
    box-shadow: 0 0 0 1px var(--color-danger);
}

[data-select="true"][data-invalid="true"] [data-select-trigger]:focus {
    ring-color: var(--color-danger);
    border-color: var(--color-danger);
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
@endonce

@if($isLivewireEnabled ?? false)
    @if($multiple)
        <input
            type="hidden"
            name="{{ $name }}"
            class="select-stable-input select-livewire-input"
            data-livewire-input="true"
            data-livewire-multiple="true"
            {{ $wireAttributes ?? collect() }}
        >
    @else
        <input
            type="hidden"
            name="{{ $name }}"
            class="select-stable-input select-livewire-input"
            data-livewire-input="true"
            data-livewire-multiple="false"
            {{ $wireAttributes ?? collect() }}
        >
    @endif
@else
    @if($multiple)
        @php
            $selectedValues = $getSelectedValues();
            $maxInputs = 15;
        @endphp

        @for($i = 0; $i < $maxInputs; $i++)
            @php
                $currentValue = $selectedValues[$i] ?? '';
                $isActive = $i < count($selectedValues);
                $isFirst = $i === 0;
            @endphp

            <input
                type="hidden"
                name="{{ $name }}[]"
                value="{{ $currentValue }}"
                class="select-stable-input select-pool-input"
                data-pool-index="{{ $i }}"
                data-pool-active="{{ $isActive ? 'true' : 'false' }}"
                style="{{ $isActive ? '' : 'display: none;' }}"
            >
        @endfor
    @else
        <input
            type="hidden"
            name="{{ $name }}"
            value="{{ $value ?? '' }}"
            class="select-stable-input select-single-input"
            data-single-input="true"
        >
    @endif
@endif

{{-- Protect Select component from Livewire re-rendering --}}
<div @if($isLivewireEnabled ?? false) wire:ignore @endif>
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
                            <span class="text-neutral-500 select-placeholder" data-select-placeholder="true">{{ $placeholder ?? 'Select options...' }}</span>
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
                @if($clearable && !$disabled)
                    <div class="opacity-0 pointer-events-none transition-opacity duration-150" data-select-clear>
                        <x-keys::button
                            type="button"
                            variant="ghost"
                            size="{{ $size === 'sm' ? 'xs' : ($size === 'lg' ? 'sm' : 'xs') }}"
                            icon="heroicon-o-x-mark"
                        >
                            <span class="sr-only">Clear selection</span>
                        </x-keys::button>
                    </div>
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

    <div class="max-h-48 overflow-y-auto overflow-x-hidden"
         data-select-options
         role="listbox"
         aria-labelledby="{{ $uniqueId }}"
         aria-multiselectable="{{ $multiple ? 'true' : 'false' }}">
        {{ $slot }}
    </div>

    <div class="px-3 py-2 text-sm text-neutral-500 text-left hidden" data-select-no-results>
        No options found
    </div>
    </div>
</div>