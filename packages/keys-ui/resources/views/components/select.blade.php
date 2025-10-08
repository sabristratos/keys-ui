@php

    $wireOnlyAttributes = $attributes->whereStartsWith('wire:');
    $nonWireAttributes = $attributes->whereDoesntStartWith('wire:');
    $isLivewireEnabled = $wireOnlyAttributes->isNotEmpty();
    $wireModelName = $wireOnlyAttributes->whereStartsWith('wire:model')->first();

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

    // Wrapper gets all visual styling for group selector targeting
    $wrapperVisualClasses = 'relative bg-input border border-line rounded-md transition-colors duration-200 hover:border-neutral-300 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20';

    // Button is just transparent click overlay
    $buttonClasses = 'absolute inset-0 cursor-pointer';

    $sizeClasses = match ($size) {
        'sm' => 'min-h-[32px] text-sm',
        'md' => 'min-h-[38px] text-sm',
        'lg' => 'min-h-[42px] text-base',
        default => 'min-h-[38px] text-sm'
    };

    $paddingClasses = match ($size) {
        'sm' => 'px-3 py-1.5',
        'md' => 'px-3 py-2',
        'lg' => 'px-4 py-2.5',
        default => 'px-3 py-2'
    };

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

    if ($disabled) {
        $stateClasses = 'opacity-50 cursor-not-allowed bg-elevation-1 text-muted';
    } elseif ($hasError) {
        $stateClasses = 'border-danger focus-within:border-danger focus-within:ring-danger/20 text-primary';
    } else {
        $stateClasses = 'text-primary';
    }

    $overlayClasses = trim("$sizeClasses $paddingClasses");

    $iconSize = match ($size) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };

    $dropdownWidthClasses = $width === 'auto' || $width === 'fit' ? 'w-auto min-w-full' : 'w-full';

    $hiddenInputName = $multiple ? ($name . '[]') : $name;

    $shorthandSpacing = ($isShorthand() && $label) ? ' mt-1' : '';

    $selectAttributes = $nonWireAttributes
        ->except(['class'])
        ->merge(array_merge($dataAttributes, [
            'class' => trim("$wrapperVisualClasses $widthClasses $stateClasses$shorthandSpacing")
        ]));
@endphp

@if($isShorthand())
    <div {{ $attributes->only('class') }}>
        @if($label)
            <x-keys::label :for="$id" :required="$required" :optional="$optional">
                {{ $label }}
            </x-keys::label>
        @endif

        <div {{ $selectAttributes }}>

            @if($isLivewireEnabled ?? false)
                @if($multiple)
                    <input
                        type="hidden"
                        name="{{ $name }}"
                        class="select-stable-input select-livewire-input"
                        data-livewire-input="true"
                        data-livewire-multiple="true"
                        {{ $wireOnlyAttributes ?? collect() }}
                    >
                @else
                    <input
                        type="hidden"
                        name="{{ $name }}"
                        class="select-stable-input select-livewire-input"
                        data-livewire-input="true"
                        data-livewire-multiple="false"
                        {{ $wireOnlyAttributes ?? collect() }}
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

            <div wire:ignore>
                <x-keys::popover
                :id="'select-dropdown-' . $id"
                placement="bottom-start"
                :manual="false"
            >
                <x-slot name="trigger">
                    <div class="relative">

                        <button
                            type="button"
                            id="{{ $id }}"
                            popovertarget="select-dropdown-{{ $id }}"
                            class="{{ $buttonClasses }}"
                            data-select-trigger
                            @if($disabled) disabled @endif
                            @if($ariaLabel) aria-label="{{ $ariaLabel }}" @endif
                            @if($ariaDescribedby) aria-describedby="{{ $ariaDescribedby }}" @endif
                        >

                            <span class="sr-only" data-select-value>
                                @if($multiple)
                                    {{ $placeholder ?? 'Select options...' }}
                                @else
                                    @if($value)
                                        {{ $value }}
                                    @else
                                        {{ $placeholder ?? 'Select option...' }}
                                    @endif
                                @endif
                            </span>
                        </button>


                        <div class="relative flex items-center justify-between pointer-events-none {{ $overlayClasses }}">

                            <div class="flex items-center gap-2.5 flex-1 min-w-0">
                                @if($multiple)

                                    <div class="flex flex-wrap gap-1 pointer-events-auto" data-select-chips>

                                    </div>


                                    <span class="text-muted select-placeholder pointer-events-none hidden" data-select-placeholder>
                                        {{ $placeholder ?? 'Select options...' }}
                                    </span>
                                @else

                                    <div class="flex items-center gap-2.5 select-value truncate pointer-events-none text-primary" data-select-display>
                                        @if($value)
                                            {{ $value }}
                                        @else
                                            <span class="text-muted">{{ $placeholder ?? 'Select option...' }}</span>
                                        @endif
                                    </div>
                                @endif
                            </div>


                            <div class="flex items-center gap-2.5">
                                @if($clearable && !$disabled)
                                    <x-keys::button
                                        type="button"
                                        variant="ghost"
                                        size="xs"
                                        class="opacity-0 pointer-events-auto transition-opacity duration-150"
                                        data-select-clear
                                        icon="heroicon-o-x-mark"
                                        aria-label="Clear selection"
                                    />
                                @endif


                                <div class="text-muted pointer-events-none">
                                    <x-keys::icon
                                        name="heroicon-o-chevron-down"
                                        size="{{ $iconSize }}"
                                        class="select-arrow transition-transform duration-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </x-slot>


                @if($searchable)
                    <div class="mb-2 {{ $dropdownWidthClasses }}">
                        <x-keys::input
                            type="text"
                            placeholder="Search options..."
                            size="sm"
                            icon-left="heroicon-o-magnifying-glass"
                            data-select-search="true"
                        />
                    </div>
                @endif

                <div class="max-h-60 overflow-y-auto overflow-x-hidden {{ $dropdownWidthClasses }}"
                     data-select-options
                     role="listbox"
                     aria-labelledby="{{ $id }}"
                     aria-multiselectable="{{ $multiple ? 'true' : 'false' }}">
                    {{ $slot }}
                </div>

                <div class="px-3 py-2 text-sm text-muted text-left hidden {{ $dropdownWidthClasses }}" data-select-no-results>
                    No options found
                </div>
            </x-keys::popover>
            </div>
        </div>

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div {{ $attributes->only('class') }} {{ $selectAttributes }}>

        @if($isLivewireEnabled ?? false)
            @if($multiple)
                <input
                    type="hidden"
                    name="{{ $name }}"
                    class="select-stable-input select-livewire-input"
                    data-livewire-input="true"
                    data-livewire-multiple="true"
                    {{ $wireOnlyAttributes ?? collect() }}
                >
            @else
                <input
                    type="hidden"
                    name="{{ $name }}"
                    class="select-stable-input select-livewire-input"
                    data-livewire-input="true"
                    data-livewire-multiple="false"
                    {{ $wireOnlyAttributes ?? collect() }}
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


        <div wire:ignore>
            <x-keys::popover
            :id="'select-dropdown-' . $id"
            placement="bottom-start"
            :manual="false"
        >
            <x-slot name="trigger">
                <div class="relative">

                    <button
                        type="button"
                        id="{{ $id }}"
                        popovertarget="select-dropdown-{{ $id }}"
                        class="{{ $buttonClasses }}"
                        data-select-trigger
                        @if($disabled) disabled @endif
                        @if($ariaLabel) aria-label="{{ $ariaLabel }}" @endif
                        @if($ariaDescribedby) aria-describedby="{{ $ariaDescribedby }}" @endif
                    >

                        <span class="sr-only" data-select-value>
                            @if($multiple)
                                {{ $placeholder ?? 'Select options...' }}
                            @else
                                @if($value)
                                    {{ $value }}
                                @else
                                    {{ $placeholder ?? 'Select option...' }}
                                @endif
                            @endif
                        </span>
                    </button>


                    <div class="relative flex items-center justify-between pointer-events-none {{ $overlayClasses }}">

                        <div class="flex items-center gap-2 flex-1 min-w-0">
                            @if($multiple)

                                <div class="flex flex-wrap gap-1 pointer-events-auto" data-select-chips>

                                </div>


                                <span class="text-muted select-placeholder pointer-events-none hidden" data-select-placeholder>
                                    {{ $placeholder ?? 'Select options...' }}
                                </span>
                            @else

                                <div class="flex items-center gap-2 select-value truncate pointer-events-none text-primary" data-select-display>
                                    @if($value)
                                        {{ $value }}
                                    @else
                                        <span class="text-muted">{{ $placeholder ?? 'Select option...' }}</span>
                                    @endif
                                </div>
                            @endif
                        </div>


                        <div class="flex items-center gap-2">
                            @if($clearable && !$disabled)
                                <x-keys::button
                                    type="button"
                                    variant="ghost"
                                    size="xs"
                                    class="opacity-0 pointer-events-auto transition-opacity duration-150"
                                    data-select-clear
                                    icon="heroicon-o-x-mark"
                                    aria-label="Clear selection"
                                />
                            @endif


                            <div class="text-muted pointer-events-none">
                                <x-keys::icon
                                    name="heroicon-o-chevron-down"
                                    size="{{ $iconSize }}"
                                    class="select-arrow transition-transform duration-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </x-slot>


            @if($searchable)
                <div class="mb-2 {{ $dropdownWidthClasses }}">
                    <x-keys::input
                        type="text"
                        placeholder="Search options..."
                        size="sm"
                        icon-left="heroicon-o-magnifying-glass"
                        data-select-search="true"
                    />
                </div>
            @endif

            <div class="max-h-48 overflow-y-auto overflow-x-hidden {{ $dropdownWidthClasses }}"
                 data-select-options
                 role="listbox"
                 aria-labelledby="{{ $id }}"
                 aria-multiselectable="{{ $multiple ? 'true' : 'false' }}">
                {{ $slot }}
            </div>

            <div class="px-3 py-2 text-sm text-muted text-left hidden {{ $dropdownWidthClasses }}" data-select-no-results>
                No options found
            </div>
        </x-keys::popover>
        </div>
    </div>
@endif
