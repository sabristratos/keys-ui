
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