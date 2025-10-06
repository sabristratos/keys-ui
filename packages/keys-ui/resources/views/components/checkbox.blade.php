@php
    $checkboxAttributes = $attributes->whereStartsWith('wire:model');
    $wrapperAttributes = $attributes->whereDoesntStartWith('wire:model');

    $checkboxBaseClasses = 'border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 shrink-0';

    $checkboxSizeClasses = match ($size) {
        'sm' => 'h-3 w-3 text-xs',
        'md' => 'h-3.5 w-3.5 text-sm',
        'lg' => 'h-4 w-4 text-base',
        default => 'h-3.5 w-3.5 text-sm'
    };

    $checkboxVariantClasses = match ($variant) {
        'standard', 'bordered', 'card' => 'rounded',
        'colored' => 'rounded border-2',
        default => 'rounded'
    };

    if ($disabled) {
        $checkboxStateClasses = 'bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700';
    } elseif ($hasError()) {
        $checkboxStateClasses = 'bg-input border-danger text-danger focus-visible:border-danger focus-visible:ring-danger';
    } else {
        $colorClasses = match ($color) {
            'brand' => 'text-accent focus-visible:ring-accent',
            'success' => 'text-success focus-visible:ring-success',
            'warning' => 'text-warning focus-visible:ring-warning',
            'danger' => 'text-danger focus-visible:ring-danger',
            'neutral' => 'text-neutral-600 focus-visible:ring-neutral-500',
            default => 'text-accent focus-visible:ring-accent'
        };

        if ($variant === 'colored') {
            $borderColor = match ($color) {
                'brand' => 'border-accent',
                'success' => 'border-success',
                'warning' => 'border-warning',
                'danger' => 'border-danger',
                'neutral' => 'border-neutral-400',
                default => 'border-accent'
            };
            $checkboxStateClasses = "bg-input border-line hover:$borderColor $colorClasses";
        } else {
            $checkboxStateClasses = 'bg-input border-line hover:border-neutral-300 dark:hover:border-neutral-600 ' . $colorClasses;
        }
    }

    $checkboxClasses = "$checkboxBaseClasses $checkboxSizeClasses $checkboxVariantClasses $checkboxStateClasses";

    $gap = ($variant === 'card' && !$showInput) ? 'gap-0' : 'gap-3';

    $wrapperBaseClasses = match ($variant) {
        'standard' => "flex items-center {$gap} cursor-pointer",
        'bordered' => "flex items-center {$gap} p-4 border border-line rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200 cursor-pointer",
        'colored' => "flex items-center {$gap} p-4 border-2 rounded-lg transition-colors duration-200 cursor-pointer",
        'card' => "flex items-center {$gap} p-4 border border-line rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200 cursor-pointer",
        default => "flex items-center {$gap} cursor-pointer"
    };

    if ($variant === 'colored') {
        $borderColor = match ($color) {
            'brand' => 'border-line has-[:checked]:border-accent has-[:checked]:bg-accent/5',
            'success' => 'border-line has-[:checked]:border-success has-[:checked]:bg-success/5',
            'warning' => 'border-line has-[:checked]:border-warning has-[:checked]:bg-warning/5',
            'danger' => 'border-line has-[:checked]:border-danger has-[:checked]:bg-danger/5',
            'neutral' => 'border-line has-[:checked]:border-neutral-400 has-[:checked]:bg-neutral-100 dark:has-[:checked]:bg-neutral-800',
            default => 'border-line has-[:checked]:border-accent has-[:checked]:bg-accent/5'
        };
        $wrapperBaseClasses .= ' ' . $borderColor;
    }

    if ($variant === 'card') {
        $bgColor = match ($color) {
            'brand' => 'has-[:checked]:bg-accent/5 has-[:checked]:border-accent',
            'success' => 'has-[:checked]:bg-success/5 has-[:checked]:border-success',
            'warning' => 'has-[:checked]:bg-warning/5 has-[:checked]:border-warning',
            'danger' => 'has-[:checked]:bg-danger/5 has-[:checked]:border-danger',
            'neutral' => 'has-[:checked]:bg-neutral-100 has-[:checked]:border-neutral-400 dark:has-[:checked]:bg-neutral-800',
            default => 'has-[:checked]:bg-accent/5 has-[:checked]:border-accent'
        };
        $wrapperBaseClasses .= ' ' . $bgColor;
    }

    if ($hasError()) {
        $wrapperBaseClasses .= ' border-danger';
    }

    $labelSize = match ($size) {
        'sm' => 'sm',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };

    $labelColor = $disabled ? 'muted' : 'text';
    $labelWeight = $variant === 'card' ? 'medium' : 'normal';
@endphp

<label for="{{ $id }}" {{ $wrapperAttributes->merge(['class' => $wrapperBaseClasses])->merge($dataAttributes) }}>
    @if($showInput)
        <input
            type="checkbox"
            id="{{ $id }}"
            name="{{ $name }}"
            value="{{ $value }}"
            {{ $checked ? 'checked' : '' }}
            {{ $disabled ? 'disabled' : '' }}
            {{ $required ? 'required' : '' }}
            {{ $indeterminate ? 'data-indeterminate=true' : '' }}
            class="{{ $checkboxClasses }}"
            {{ $checkboxAttributes }}
        />
    @else
        <input
            type="checkbox"
            id="{{ $id }}"
            name="{{ $name }}"
            value="{{ $value }}"
            {{ $checked ? 'checked' : '' }}
            {{ $disabled ? 'disabled' : '' }}
            {{ $required ? 'required' : '' }}
            {{ $indeterminate ? 'data-indeterminate=true' : '' }}
            class="sr-only"
            {{ $checkboxAttributes }}
        />
    @endif

    @if($hasContent())
        <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                    @if($isCard())
                        
                        @if($icon)
                            <div class="flex items-center gap-2 mb-1 text-muted">
                                <x-keys::icon :name="$icon" :size="$iconSize()" class="shrink-0" />
                                @if($title)
                                    <x-keys::text element="span" :size="$labelSize" :color="$labelColor" :weight="$labelWeight">
                                        {{ $title }}
                                        @if($required)
                                            <span class="text-danger ml-1">*</span>
                                        @endif
                                    </x-keys::text>
                                @endif
                            </div>
                        @elseif($title)
                            <x-keys::text element="span" :size="$labelSize" :color="$labelColor" :weight="$labelWeight" class="block mb-1">
                                {{ $title }}
                                @if($required)
                                    <span class="text-danger ml-1">*</span>
                                @endif
                            </x-keys::text>
                        @endif

                        @if($description)
                            <x-keys::text size="sm" color="muted">{{ $description }}</x-keys::text>
                        @endif
                    @else
                        
                        @if($label)
                            <x-keys::text element="span" :size="$labelSize" :color="$labelColor" :weight="$labelWeight">
                                {{ $label }}
                                @if($required)
                                    <span class="text-danger ml-1">*</span>
                                @endif
                            </x-keys::text>
                        @endif
                        @if($description)
                            <x-keys::text size="sm" color="muted" class="mt-1">{{ $description }}</x-keys::text>
                        @endif
                    @endif
                </div>

                @if($hasActions())
                    <div class="flex items-center gap-1 ml-2">
                        @foreach($computedActionData as $action)
                            <div class="input-action"
                                 data-action="{{ $action['data_action'] }}"
                                 @if($action['data_url']) data-url="{{ $action['data_url'] }}" @endif
                                 @if($action['data_icon_toggle']) data-icon-toggle="{{ $action['data_icon_toggle'] }}" @endif
                                 @if($action['data_icon_success']) data-icon-success="{{ $action['data_icon_success'] }}" @endif
                                 @if($action['data_label_toggle']) data-label-toggle="{{ $action['data_label_toggle'] }}" @endif
                                 @if($action['data_label_success']) data-label-success="{{ $action['data_label_success'] }}" @endif>
                                <x-keys::button
                                    :variant="$actionVariant"
                                    :size="$computedActionSize"
                                    :icon="$action['icon']"
                                    :data-icon-default="$action['data_icon_default']"
                                    :data-icon-toggle="$action['data_icon_toggle']"
                                    :data-icon-success="$action['data_icon_success']"
                                    :data-label-toggle="$action['data_label_toggle']"
                                    :data-label-success="$action['data_label_success']">
                                    <span class="sr-only">{{ $action['label'] }}</span>
                                    @if($action['is_multi_state'])
                                        <span class="button-icon-default {{ $action['icon'] === $action['data_icon_default'] ? 'opacity-100' : 'opacity-0' }} transition-opacity duration-200">
                                            <x-keys::icon :name="$action['data_icon_default']" :size="$computedActionSize" />
                                        </span>
                                        @if($action['data_icon_toggle'])
                                            <span class="button-icon-toggle {{ $action['icon'] === $action['data_icon_toggle'] ? 'opacity-100' : 'opacity-0' }} absolute inset-0 flex items-center justify-center transition-all duration-200">
                                                <x-keys::icon :name="$action['data_icon_toggle']" :size="$computedActionSize" />
                                            </span>
                                        @endif
                                        @if($action['data_icon_success'])
                                            <span class="button-icon-success opacity-0 absolute inset-0 flex items-center justify-center transition-all duration-200">
                                                <x-keys::icon :name="$action['data_icon_success']" :size="$computedActionSize" />
                                            </span>
                                        @endif
                                    @endif
                                </x-keys::button>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
        </div>
    @endif
</label>

@if($showErrors && !is_null($errors))
    <x-keys::error :messages="$errors" />
@endif

