@php
    $textareaAttributes = $attributes->whereStartsWith('wire:');
    $wrapperAttributes = $attributes->whereDoesntStartWith('wire:');

    // Base classes for all textareas
    $baseClasses = 'block w-full rounded-md border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    // Size classes
    $sizeClasses = match ($size) {
        'xs' => 'px-2.5 py-1 text-xs',
        'sm' => 'px-3 py-1.5 text-sm',
        'md' => 'px-3 py-2 text-sm',
        'lg' => 'px-4 py-2.5 text-base',
        'xl' => 'px-4 py-3 text-base',
        default => 'px-3 py-2 text-sm'
    };

    // Resize classes
    $resizeClasses = match ($resize) {
        'none' => 'resize-none',
        'both' => 'resize',
        'horizontal' => 'resize-x',
        'vertical' => 'resize-y',
        default => 'resize-y'
    };

    // State classes
    $stateClasses = '';
    if ($disabled) {
        $stateClasses = 'bg-surface border-border text-muted cursor-not-allowed opacity-50';
    } elseif ($hasError()) {
        $stateClasses = 'bg-input border-danger text-foreground focus-visible:border-danger focus-visible:ring-danger';
    } else {
        $stateClasses = 'bg-input border-border text-foreground focus-visible:border-brand focus-visible:ring-brand hover:border-neutral';
    }

    // Icon padding
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
            // Calculate action padding dynamically
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

    // Merge data attributes
    $textareaAttributes = $textareaAttributes->merge($dataAttributes);

    // Icon size based on textarea size
    $iconSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        'xl' => 'md',
        default => 'sm'
    };

    // Icon positioning classes (textarea-specific - use top positioning)
    $iconPositionClasses = 'absolute top-3 flex items-center pointer-events-none';

    // Icon offset classes based on size
    $iconOffsets = match ($size) {
        'xs' => ['left' => 'left-2.5', 'right' => 'right-2.5'],
        'sm' => ['left' => 'left-3', 'right' => 'right-3'],
        'md' => ['left' => 'left-3', 'right' => 'right-3'],
        'lg' => ['left' => 'left-3.5', 'right' => 'right-3.5'],
        'xl' => ['left' => 'left-3.5', 'right' => 'right-3.5'],
        default => ['left' => 'left-3', 'right' => 'right-3']
    };

    // Action size and container classes
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

        <div class="relative mt-1 focus-within:[&_[data-icon]]:text-brand">
            @if($iconLeft)
                <div class="{{ $iconPositionClasses }} {{ $iconOffsets['left'] }}" data-icon>
                    <x-keys::icon name="{{ $iconLeft }}" size="{{ $iconSize }}" class="text-neutral" />
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
                    <x-keys::icon name="{{ $iconRight }}" size="{{ $iconSize }}" class="text-neutral" />
                </div>
            @endif
        </div>

        @if($hint)
            <p class="mt-1 text-xs text-muted">{{ $hint }}</p>
        @endif

        @if($showCharacterCount)
            <div class="mt-1 flex justify-between items-center text-xs">
                <div></div>
                <div class="text-muted"
                     data-character-count
                     data-max-length="{{ $maxLength }}"
                     data-target-id="{{ $id }}">
                    @if($maxLength)
                        <span data-current-count>{{ $value ? strlen($value) : 0 }}</span>/<span data-max-count>{{ $maxLength }}</span> characters
                    @else
                        <span data-current-count>{{ $value ? strlen($value) : 0 }}</span> characters
                    @endif
                </div>
            </div>
        @endif

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div class="relative focus-within:[&_[data-icon]]:text-brand" {{ $wrapperAttributes->only('class') }}>
        @if($iconLeft)
            <div class="{{ $iconPositionClasses }} {{ $iconOffsets['left'] }}" data-icon>
                <x-keys::icon name="{{ $iconLeft }}" size="{{ $iconSize }}" class="text-neutral" />
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
                <x-keys::icon name="{{ $iconRight }}" size="{{ $iconSize }}" class="text-neutral" />
            </div>
        @endif
    </div>

    @if($showCharacterCount)
        <div class="mt-1 flex justify-end">
            <div class="text-xs text-muted"
                 data-character-count
                 data-max-length="{{ $maxLength }}"
                 data-target-id="{{ $id }}">
                @if($maxLength)
                    <span data-current-count>{{ $value ? strlen($value) : 0 }}</span>/<span data-max-count>{{ $maxLength }}</span> characters
                @else
                    <span data-current-count>{{ $value ? strlen($value) : 0 }}</span> characters
                @endif
            </div>
        </div>
    @endif
@endif