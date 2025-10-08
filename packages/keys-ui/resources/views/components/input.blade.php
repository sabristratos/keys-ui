@php
    $wrapperClasses = 'relative flex items-center gap-2.5 bg-input border border-line transition-colors duration-200 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20';

    $wrapperSizeClasses = match ($size) {
        'xs' => 'px-2 rounded-sm',
        'sm' => 'px-2.5 rounded-md',
        'md' => 'px-3 rounded-md',
        'lg' => 'px-3 rounded-lg',
        'xl' => 'px-3.5 rounded-lg',
        default => 'px-3 rounded-md'
    };

    if ($disabled) {
        $wrapperStateClasses = 'opacity-50 cursor-not-allowed bg-elevation-1';
    } elseif ($hasError()) {
        $wrapperStateClasses = 'border-danger focus-within:border-danger focus-within:ring-danger/20';
    } else {
        $wrapperStateClasses = '';
    }

    $shorthandSpacing = ($isShorthand && $label) ? ' mt-1' : '';

    $wrapperAttributes = $attributes
        ->except(['type', 'name', 'id', 'value', 'placeholder', 'disabled', 'readonly', 'required'])
        ->filter(fn($value, $key) => !str_starts_with($key, 'wire:'))
        ->merge(array_merge([
            'class' => trim("$wrapperClasses $wrapperSizeClasses $wrapperStateClasses$shorthandSpacing"),
        ], $dataAttributes));

    $inputClasses = 'flex-1 bg-transparent border-0 outline-none focus:outline-none placeholder:text-muted';

    $inputTextClasses = match ($size) {
        'xs' => 'text-xs py-1',
        'sm' => 'text-sm py-1.5',
        'md' => 'text-sm py-2',
        'lg' => 'text-base py-2.5',
        'xl' => 'text-base py-3',
        default => 'text-sm py-2'
    };

    $inputColorClasses = $disabled ? 'text-muted' : 'text-primary';

    $wireAndAlpineAttributes = $attributes->filter(fn($value, $key) => str_starts_with($key, 'wire:') || str_starts_with($key, 'x-'))->getAttributes();
    $dataOnlyAttributes = $attributes->filter(fn($value, $key) => str_starts_with($key, 'data-'))->getAttributes();

    $inputAttributes = $attributes
        ->only(['type', 'name', 'id', 'value', 'placeholder', 'disabled', 'readonly', 'required'])
        ->merge(array_merge(
            array_filter([
                'type' => $type,
                'name' => $name,
                'id' => $id,
                'value' => $value,
                'placeholder' => $placeholder,
                'disabled' => $disabled ?: null,
                'readonly' => $readonly ?: null,
                'required' => $required ?: null,
            ], fn($v) => $v !== null),
            $wireAndAlpineAttributes,
            $dataOnlyAttributes,
            [
                'class' => trim("$inputClasses $inputTextClasses $inputColorClasses"),
                'data-input-element' => 'true',
            ]
        ));

    $iconSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        'xl' => 'md',
        default => 'sm'
    };

    $computedActionSize = $actionSize;

    $outerWrapperAttributes = $attributes->filter(fn($value, $key) => !in_array($key, ['type', 'name', 'id', 'value', 'placeholder', 'disabled', 'readonly', 'required', 'class']) && !str_starts_with($key, 'wire:') && !str_starts_with($key, 'x-') && !str_starts_with($key, 'data-'));
@endphp

@if($isShorthand)
    <div {{ $outerWrapperAttributes->only('class') }}>
        @if($label)
            <x-keys::label :for="$id" :required="$required" :optional="$optional">
                {{ $label }}
            </x-keys::label>
        @endif

        <div {{ $wrapperAttributes }}>
                @if($iconLeft)
                    <div class="flex items-center text-muted pointer-events-none">
                        <x-keys::icon name="{{ $iconLeft }}" size="{{ $iconSize }}" data-icon />
                    </div>
                @endif

                <input {{ $inputAttributes }} data-input-actions="{{ $hasActions() ? 'true' : 'false' }}" />

                @if($hasActions())
                    <div class="flex items-center gap-1">
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
                @elseif($iconRight)
                    <div class="flex items-center text-muted pointer-events-none">
                        <x-keys::icon name="{{ $iconRight }}" size="{{ $iconSize }}" data-icon />
                    </div>
                @endif
        </div>

        @if($hint)
            <x-keys::text size="xs" color="muted" class="mt-1">{{ $hint }}</x-keys::text>
        @endif

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div {{ $wrapperAttributes }} data-keys-group-target>
        @if($iconLeft)
            <div class="flex items-center text-muted pointer-events-none">
                <x-keys::icon name="{{ $iconLeft }}" size="{{ $iconSize }}" data-icon />
            </div>
        @endif

        <input {{ $inputAttributes }} data-input-actions="{{ $hasActions() ? 'true' : 'false' }}" />

        @if($hasActions())
            <div class="flex items-center gap-1">
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
        @elseif($iconRight)
            <div class="flex items-center text-muted pointer-events-none">
                <x-keys::icon name="{{ $iconRight }}" size="{{ $iconSize }}" data-icon />
            </div>
        @endif
    </div>
@endif
