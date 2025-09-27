@php
    // Separate wire: attributes for Livewire integration
    $wireOnlyAttributes = $attributes->whereStartsWith('wire:');
    $nonWireAttributes = $attributes->whereDoesntStartWith('wire:');
    $isLivewireEnabled = $wireOnlyAttributes->isNotEmpty();
    $wireModelName = $wireOnlyAttributes->whereStartsWith('wire:model')->first();

    // Add Livewire data attributes when enabled
    if ($isLivewireEnabled) {
        $dataAttributes = array_merge($dataAttributes, [
            'data-livewire-enabled' => 'true',
            'data-livewire-mode' => 'true',
        ]);

        if ($wireModelName) {
            $dataAttributes['data-wire-model'] = $wireModelName;
            $dataAttributes['data-livewire-property'] = $wireModelName;
        }
    }

    // Base classes for trigger button
    $baseClasses = 'flex items-center justify-between w-full rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    // Size classes
    $sizeClasses = match ($size) {
        'sm' => 'px-3 py-1.5 text-sm',
        'md' => 'px-3 py-2 text-sm',
        'lg' => 'px-4 py-2.5 text-base',
        default => 'px-3 py-2 text-sm'
    };

    // Width classes
    $widthClasses = match ($width) {
        'auto' => 'w-auto',
        'xs' => 'w-20',
        'sm' => 'w-32',
        'md' => 'w-48',
        'lg' => 'w-64',
        'xl' => 'w-80',
        '2xl' => 'w-96',
        'fit' => 'w-fit',
        'full' => 'w-full',
        default => 'w-full'
    };

    // State classes
    $stateClasses = '';
    if ($disabled) {
        $stateClasses = 'bg-surface border-border text-muted cursor-not-allowed opacity-50';
    } elseif ($hasError) {
        $stateClasses = 'bg-input border-danger text-foreground focus-visible:border-danger focus-visible:ring-danger';
    } else {
        $stateClasses = 'bg-input border-border text-foreground focus-visible:border-brand focus-visible:ring-brand hover:border-neutral';
    }

    $triggerClasses = trim("$baseClasses $sizeClasses $widthClasses $stateClasses");

    // Icon size based on select size
    $iconSize = match ($size) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };

    // Popover width should match trigger
    $dropdownWidthClasses = $width === 'auto' || $width === 'fit' ? 'w-auto min-w-full' : 'w-full';

    // Hidden input name
    $hiddenInputName = $multiple ? ($name . '[]') : $name;

    // Merge all component attributes
    $selectAttributes = $nonWireAttributes
        ->except(['class'])
        ->merge($dataAttributes);
@endphp

@if($isShorthand())
    <div {{ $attributes->only('class') }}>
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1" {{ $selectAttributes }}>
            {{-- Hidden inputs for form submission --}}
            @include('keys::partials.select-inputs')

            {{-- Popover-based Select --}}
            <x-keys::popover
                class="w-full"
                :id="'select-dropdown-' . $id"
                placement="bottom-start"
                :manual="false"
            >
                <x-slot name="trigger">
                    <div class="relative">
                        <button
                            type="button"
                            id="{{ $id }}"
                            class="{{ $triggerClasses }}"
                            data-select-trigger
                            @if($disabled) disabled @endif
                            @if($ariaLabel) aria-label="{{ $ariaLabel }}" @endif
                            @if($ariaDescribedby) aria-describedby="{{ $ariaDescribedby }}" @endif
                        >
                            <div class="flex items-center flex-1 min-w-0">
                                <div class="select-display flex justify-start flex-1">
                                    @if($multiple)
                                        <span class="select-value truncate">
                                            <span class="text-muted select-placeholder" data-select-placeholder="true">{{ $placeholder ?? 'Select options...' }}</span>
                                            {{-- Invisible spacer to maintain height when placeholder is hidden --}}
                                            <span class="text-muted invisible" data-select-spacer="true" style="display: none;">{{ $placeholder ?? 'Select options...' }}</span>
                                        </span>
                                    @else
                                        <span class="select-value truncate">
                                            @if($value)
                                                {{ $value }}
                                            @else
                                                <span class="text-muted select-placeholder">{{ $placeholder ?? 'Select option...' }}</span>
                                            @endif
                                        </span>
                                    @endif
                                </div>
                            </div>

                            <div class="flex items-center ml-2">
                                <x-keys::icon
                                    name="heroicon-o-chevron-down"
                                    size="{{ $iconSize }}"
                                    class="text-muted select-arrow transition-transform duration-200"
                                />
                            </div>
                        </button>

                        {{-- Absolutely positioned overlay for chips and clear button --}}
                        @if($multiple || ($clearable && !$disabled))
                            <div class="absolute inset-0 flex justify-between items-center pointer-events-none px-3 py-2">
                                @if($multiple)
                                    <div class="flex flex-wrap gap-1 pointer-events-auto" data-select-chips>
                                        {{-- Chips will be dynamically created by JavaScript --}}
                                    </div>
                                @endif

                                @if($clearable && !$disabled)
                                    <x-keys::button
                                        type="button"
                                        variant="ghost"
                                        size="xs"
                                        class="opacity-0 pointer-events-none transition-opacity duration-150 ml-auto mr-6"
                                        data-select-clear
                                        icon="heroicon-o-x-mark"
                                        aria-label="Clear selection"
                                    >
                                    </x-keys::button>
                                @endif
                            </div>
                        @endif
                    </div>
                </x-slot>

                {{-- Dropdown Content --}}
                <div class="{{ $dropdownWidthClasses }}" data-select-dropdown>
                    @if($searchable)
                        <div class="mb-2">
                            <x-keys::input
                                type="text"
                                placeholder="Search options..."
                                size="sm"
                                icon-left="heroicon-o-magnifying-glass"
                                data-select-search="true"
                            />
                        </div>
                    @endif

                    <div class="max-h-48 overflow-y-auto overflow-x-hidden"
                         data-select-options
                         role="listbox"
                         aria-labelledby="{{ $id }}"
                         aria-multiselectable="{{ $multiple ? 'true' : 'false' }}">
                        {{ $slot }}
                    </div>

                    <div class="px-3 py-2 text-sm text-muted text-left hidden" data-select-no-results>
                        No options found
                    </div>
                </div>
            </x-keys::popover>
        </div>

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div {{ $attributes->only('class') }} {{ $selectAttributes }}>
        {{-- Hidden inputs for form submission --}}
        @include('keys::partials.select-inputs')

        {{-- Popover-based Select --}}
        <x-keys::popover
            class="w-full"
            :id="'select-dropdown-' . $id"
            placement="bottom-start"
            :manual="false"
        >
            <x-slot name="trigger">
                <div class="relative">
                    <button
                        type="button"
                        id="{{ $id }}"
                        class="{{ $triggerClasses }}"
                        data-select-trigger
                        @if($disabled) disabled @endif
                        @if($ariaLabel) aria-label="{{ $ariaLabel }}" @endif
                        @if($ariaDescribedby) aria-describedby="{{ $ariaDescribedby }}" @endif
                    >
                        <div class="flex items-center flex-1 min-w-0">
                            <div class="select-display flex justify-start flex-1">
                                @if($multiple)
                                    <span class="select-value truncate">
                                        <span class="text-muted select-placeholder" data-select-placeholder="true">{{ $placeholder ?? 'Select options...' }}</span>
                                        {{-- Invisible spacer to maintain height when placeholder is hidden --}}
                                        <span class="text-muted invisible" data-select-spacer="true" style="display: none;">{{ $placeholder ?? 'Select options...' }}</span>
                                    </span>
                                @else
                                    <span class="select-value truncate">
                                        @if($value)
                                            {{ $value }}
                                        @else
                                            <span class="text-muted select-placeholder">{{ $placeholder ?? 'Select option...' }}</span>
                                        @endif
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="flex items-center ml-2">
                            <x-keys::icon
                                name="heroicon-o-chevron-down"
                                size="{{ $iconSize }}"
                                class="text-muted select-arrow transition-transform duration-200"
                            />
                        </div>
                    </button>

                    {{-- Absolutely positioned overlay for chips and clear button --}}
                    @if($multiple || ($clearable && !$disabled))
                        <div class="absolute inset-0 flex justify-between items-center pointer-events-none px-3 py-2">
                            @if($multiple)
                                <div class="flex flex-wrap gap-1 pointer-events-auto" data-select-chips>
                                    {{-- Chips will be dynamically created by JavaScript --}}
                                </div>
                            @endif

                            @if($clearable && !$disabled)
                                <x-keys::button
                                    type="button"
                                    variant="ghost"
                                    size="xs"
                                    class="opacity-0 pointer-events-none transition-opacity duration-150 text-muted hover:text-danger ml-auto mr-6"
                                    data-select-clear
                                    aria-label="Clear selection"
                                >
                                    <x-keys::icon name="heroicon-o-x-mark" size="xs" />
                                </x-keys::button>
                            @endif
                        </div>
                    @endif
                </div>
            </x-slot>

            {{-- Dropdown Content --}}
            <div class="{{ $dropdownWidthClasses }}" data-select-dropdown>
                @if($searchable)
                    <div class="mb-2">
                        <x-keys::input
                            type="text"
                            placeholder="Search options..."
                            size="sm"
                            icon-left="heroicon-o-magnifying-glass"
                            data-select-search="true"
                        />
                    </div>
                @endif

                <div class="max-h-48 overflow-y-auto overflow-x-hidden"
                     data-select-options
                     role="listbox"
                     aria-labelledby="{{ $id }}"
                     aria-multiselectable="{{ $multiple ? 'true' : 'false' }}">
                    {{ $slot }}
                </div>

                <div class="px-3 py-2 text-sm text-muted text-left hidden" data-select-no-results>
                    No options found
                </div>
            </div>
        </x-keys::popover>
    </div>
@endif
