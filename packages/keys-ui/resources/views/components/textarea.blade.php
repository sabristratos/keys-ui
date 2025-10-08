@php
    $textareaAttributes = $attributes->whereStartsWith('wire:');
    $wrapperAttributes = $attributes->whereDoesntStartWith('wire:');

    $baseClasses = 'block w-full bg-input border border-line rounded-md transition-colors duration-200 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 placeholder:text-muted';

    $sizeClasses = match ($size) {
        'xs' => 'px-2.5 py-1 text-xs',
        'sm' => 'px-3 py-1.5 text-sm',
        'md' => 'px-3 py-2 text-sm',
        'lg' => 'px-4 py-2.5 text-base',
        'xl' => 'px-4 py-3 text-base',
        default => 'px-3 py-2 text-sm'
    };

    $resizeClasses = match ($resize) {
        'none' => 'resize-none',
        'both' => 'resize',
        'horizontal' => 'resize-x',
        'vertical' => 'resize-y',
        default => 'resize-y'
    };

    if ($disabled) {
        $stateClasses = 'opacity-50 cursor-not-allowed bg-elevation-1 text-muted';
    } elseif ($hasError()) {
        $stateClasses = 'border-danger focus:border-danger focus:ring-danger/20 text-primary';
    } else {
        $stateClasses = 'text-primary';
    }

    $leftPadding = '';
    $rightPadding = '';

    if ($iconLeft) {
        $leftPadding = match ($size) {
            'xs' => 'pl-7',
            'sm' => 'pl-8',
            'md' => 'pl-10',
            'lg' => 'pl-12',
            'xl' => 'pl-12',
            default => 'pl-10'
        };
    }

    if ($iconRight || $hasActions()) {
        if ($hasActions()) {

            $actionsCount = count($configuredActions());
            $actionWidth = match ($actionSize) {
                'xs' => 24,
                'sm' => 32,
                'md' => 40,
                default => 24
            };
            $totalWidth = ($actionsCount * $actionWidth) + (($actionsCount - 1) * 4) + 8;
            $rightPadding = 'pr-' . ceil($totalWidth / 4);
        } else {
            $rightPadding = match ($size) {
                'xs' => 'pr-7',
                'sm' => 'pr-8',
                'md' => 'pr-10',
                'lg' => 'pr-12',
                'xl' => 'pr-12',
                default => 'pr-10'
            };
        }
    }

    $iconPaddingClasses = trim($leftPadding . ' ' . $rightPadding);

    $textareaAttributes = $textareaAttributes->merge(array_filter([
        'class' => trim("$baseClasses $sizeClasses $resizeClasses $stateClasses $iconPaddingClasses"),
        'name' => $name,
        'id' => $id,
        'placeholder' => $placeholder,
        'disabled' => $disabled,
        'readonly' => $readonly,
        'required' => $required,
        'rows' => $rows,
        'cols' => $cols,
    ], fn($value) => !is_null($value)));

    $textareaAttributes = $textareaAttributes->merge($dataAttributes);

    $iconSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        'xl' => 'md',
        default => 'sm'
    };

    $iconPositionClasses = 'absolute top-3 flex items-center pointer-events-none';

    $iconOffsets = match ($size) {
        'xs' => ['left' => 'left-2.5', 'right' => 'right-2.5'],
        'sm' => ['left' => 'left-3', 'right' => 'right-3'],
        'md' => ['left' => 'left-3', 'right' => 'right-3'],
        'lg' => ['left' => 'left-3.5', 'right' => 'right-3.5'],
        'xl' => ['left' => 'left-3.5', 'right' => 'right-3.5'],
        default => ['left' => 'left-3', 'right' => 'right-3']
    };

    $computedActionSize = match ($actionSize) {
        'xs' => 'xs',
        'sm' => 'sm',
        'md' => 'md',
        default => 'xs'
    };

    $actionContainerClasses = 'absolute top-3 right-2 flex items-center gap-1';
@endphp

@if($isShorthand())
    <div {{ $wrapperAttributes->only('class') }}>
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1 focus-within:[&_[data-icon]]:text-accent">
            @if($iconLeft)
                <div class="{{ $iconPositionClasses }} {{ $iconOffsets['left'] }}" data-icon>
                    <x-keys::icon name="{{ $iconLeft }}" size="{{ $iconSize }}" />
                </div>
            @endif

            <textarea {{ $textareaAttributes }} data-input-actions="{{ $hasActions() ? 'true' : 'false' }}" @if($autoResize) data-auto-resize="true" @endif @if($showCharacterCount) data-show-character-count="true" @endif>{{ $value }}</textarea>

            @if($hasActions())
                <div class="{{ $actionContainerClasses }}">
                    @foreach($computedActionData as $action)
                        <div
                            data-action="{{ $action['data_action'] }}"
                            data-icon-default="{{ $action['data_icon_default'] }}"
                            @if(isset($action['data_url'])) data-url="{{ $action['data_url'] }}" @endif
                            @if(isset($action['data_icon_toggle'])) data-icon-toggle="{{ $action['data_icon_toggle'] }}" @endif
                            @if(isset($action['data_icon_success'])) data-icon-success="{{ $action['data_icon_success'] }}" @endif
                            @if(isset($action['data_label_toggle'])) data-label-toggle="{{ $action['data_label_toggle'] }}" @endif
                            @if(isset($action['data_label_success'])) data-label-success="{{ $action['data_label_success'] }}" @endif
                        >
                            <x-keys::button
                                variant="{{ $actionVariant }}"
                                size="{{ $computedActionSize }}"
                                type="button"
                                icon="{{ $action['icon'] }}"
                                icon-toggle="{{ $action['icon_toggle'] }}"
                                icon-success="{{ $action['icon_success'] }}"
                                label-toggle="{{ $action['label_toggle'] }}"
                                label-success="{{ $action['label_success'] }}"
                                data-action="{{ $action['data_action'] }}"
                                data-url="{{ $action['data_url'] }}"
                            >
                                <span class="sr-only">{{ $action['label'] }}</span>
                            </x-keys::button>
                        </div>
                    @endforeach
                </div>
            @endif

            @if($iconRight && !$hasActions())
                <div class="{{ $iconPositionClasses }} {{ $iconOffsets['right'] }}" data-icon>
                    <x-keys::icon name="{{ $iconRight }}" size="{{ $iconSize }}" />
                </div>
            @endif
        </div>

        @if($hint)
            <x-keys::text size="xs" color="muted" class="mt-1">{{ $hint }}</x-keys::text>
        @endif

        @if($showCharacterCount)
            <div class="mt-1 flex justify-end">
                <x-keys::text size="xs" color="muted"
                     data-character-count
                     data-max-length="{{ $maxLength }}"
                     data-target-id="{{ $id }}">
                    @if($maxLength)
                        <span data-current-count>{{ $value ? strlen($value) : 0 }}</span>/<span data-max-count>{{ $maxLength }}</span> characters
                    @else
                        <span data-current-count>{{ $value ? strlen($value) : 0 }}</span> characters
                    @endif
                </x-keys::text>
            </div>
        @endif

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div class="relative focus-within:[&_[data-icon]]:text-accent" {{ $wrapperAttributes->only('class') }}>
        @if($iconLeft)
            <div class="{{ $iconPositionClasses }} {{ $iconOffsets['left'] }}" data-icon>
                <x-keys::icon name="{{ $iconLeft }}" size="{{ $iconSize }}" />
            </div>
        @endif

        <textarea {{ $textareaAttributes }} data-input-actions="{{ $hasActions() ? 'true' : 'false' }}" @if($autoResize) data-auto-resize="true" @endif @if($showCharacterCount) data-show-character-count="true" @endif>{{ $value }}</textarea>

        @if($hasActions())
            <div class="{{ $actionContainerClasses }}">
                @foreach($computedActionData as $action)
                    <div
                        data-action="{{ $action['data_action'] }}"
                        data-icon-default="{{ $action['data_icon_default'] }}"
                        @if(isset($action['data_url'])) data-url="{{ $action['data_url'] }}" @endif
                        @if(isset($action['data_icon_toggle'])) data-icon-toggle="{{ $action['data_icon_toggle'] }}" @endif
                        @if(isset($action['data_icon_success'])) data-icon-success="{{ $action['data_icon_success'] }}" @endif
                        @if(isset($action['data_label_toggle'])) data-label-toggle="{{ $action['data_label_toggle'] }}" @endif
                        @if(isset($action['data_label_success'])) data-label-success="{{ $action['data_label_success'] }}" @endif
                    >
                        <x-keys::button
                            variant="{{ $actionVariant }}"
                            size="{{ $computedActionSize }}"
                            type="button"
                            icon="{{ $action['icon'] }}"
                            icon-toggle="{{ $action['icon_toggle'] }}"
                            icon-success="{{ $action['icon_success'] }}"
                            label-toggle="{{ $action['label_toggle'] }}"
                            label-success="{{ $action['label_success'] }}"
                            data-action="{{ $action['data_action'] }}"
                            data-url="{{ $action['data_url'] }}"
                        >
                            <span class="sr-only">{{ $action['label'] }}</span>
                        </x-keys::button>
                    </div>
                @endforeach
            </div>
        @endif

        @if($iconRight && !$hasActions())
            <div class="{{ $iconPositionClasses }} {{ $iconOffsets['right'] }}" data-icon>
                <x-keys::icon name="{{ $iconRight }}" size="{{ $iconSize }}" />
            </div>
        @endif
    </div>

    @if($showCharacterCount)
        <div class="mt-1 flex justify-end">
            <x-keys::text size="xs" color="muted"
                 data-character-count
                 data-max-length="{{ $maxLength }}"
                 data-target-id="{{ $id }}">
                @if($maxLength)
                    <span data-current-count>{{ $value ? strlen($value) : 0 }}</span>/<span data-max-count>{{ $maxLength }}</span> characters
                @else
                    <span data-current-count>{{ $value ? strlen($value) : 0 }}</span> characters
                @endif
            </x-keys::text>
        </div>
    @endif
@endif
