@php
    $toggleAttributes = $attributes->whereStartsWith('wire:model');
    $wrapperAttributes = $attributes->whereDoesntStartWith('wire:model');

    $flexDirection = $labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row';
    $gap = $hasContent() ? 'gap-3' : 'gap-0';
    $baseWrapperClasses = "inline-flex items-center {$flexDirection} {$gap} cursor-pointer";

    $computedActionSize = match ($actionSize) {
        'xs' => 'xs',
        'sm' => 'sm',
        'md' => 'md',
        default => 'xs'
    };

    if ($disabled) {
        $baseWrapperClasses .= ' opacity-50 cursor-not-allowed';
    }

    if ($hasError()) {
        $baseWrapperClasses .= ' text-danger';
    }

    $toggleClasses = 'sr-only peer';

    $sizeClasses = match ($size) {
        'xs' => 'w-7 h-4',
        'sm' => 'w-9 h-5',
        'md' => 'w-11 h-6',
        'lg' => 'w-14 h-7',
        'xl' => 'w-16 h-8',
        default => 'w-11 h-6'
    };

    $focusColor = match ($color) {
        'brand' => 'peer-focus-visible:ring-accent/30',
        'success' => 'peer-focus-visible:ring-success/30',
        'warning' => 'peer-focus-visible:ring-warning/30',
        'danger' => 'peer-focus-visible:ring-danger/30',
        'neutral' => 'peer-focus-visible:ring-neutral/30',
        'red' => 'peer-focus-visible:ring-red-300 dark:peer-focus-visible:ring-red-800',
        'green' => 'peer-focus-visible:ring-green-300 dark:peer-focus-visible:ring-green-800',
        'purple' => 'peer-focus-visible:ring-purple-300 dark:peer-focus-visible:ring-purple-800',
        'yellow' => 'peer-focus-visible:ring-yellow-300 dark:peer-focus-visible:ring-yellow-800',
        'teal' => 'peer-focus-visible:ring-teal-300 dark:peer-focus-visible:ring-teal-800',
        'orange' => 'peer-focus-visible:ring-orange-300 dark:peer-focus-visible:ring-orange-800',
        default => 'peer-focus-visible:ring-accent/30'
    };

    $checkedColor = match ($color) {
        'brand' => 'peer-checked:bg-accent',
        'success' => 'peer-checked:bg-success',
        'warning' => 'peer-checked:bg-warning',
        'danger' => 'peer-checked:bg-danger',
        'neutral' => 'peer-checked:bg-neutral',
        'red' => 'peer-checked:bg-red-600',
        'green' => 'peer-checked:bg-green-600',
        'purple' => 'peer-checked:bg-purple-600',
        'yellow' => 'peer-checked:bg-yellow-400',
        'teal' => 'peer-checked:bg-teal-600',
        'orange' => 'peer-checked:bg-orange-500',
        default => 'peer-checked:bg-accent'
    };

    $thumbSize = match ($size) {
        'xs' => 'after:h-3 after:w-3',
        'sm' => 'after:h-4 after:w-4',
        'md' => 'after:h-5 after:w-5',
        'lg' => 'after:h-6 after:w-6',
        'xl' => 'after:h-7 after:w-7',
        default => 'after:h-5 after:w-5'
    };

    $translateDistance = match ($size) {
        'xs' => 'peer-checked:after:translate-x-3',
        'sm' => 'peer-checked:after:translate-x-4',
        'md' => 'peer-checked:after:translate-x-5',
        'lg' => 'peer-checked:after:translate-x-7',
        'xl' => 'peer-checked:after:translate-x-8',
        default => 'peer-checked:after:translate-x-5'
    };

    $baseTrackClasses = "relative {$sizeClasses} bg-neutral-200 rounded-full dark:bg-neutral-700 transition-all duration-200";
    $focusClasses = "peer-focus-visible:ring-4 {$focusColor}";
    $baseThumbClasses = "after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full {$thumbSize} after:transition-all dark:border-neutral-600 peer-checked:after:border-white";
    $thumbClasses = "{$translateDistance} rtl:peer-checked:after:-translate-x-full {$baseThumbClasses}";
    $disabledClasses = $disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    $trackClasses = trim("{$baseTrackClasses} {$focusClasses} {$checkedColor} {$thumbClasses} {$disabledClasses}");

    $labelSize = match ($size) {
        'sm' => 'sm',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };
    $labelColor = $disabled ? 'muted' : 'text';
    $labelWeight = 'medium';
@endphp

<label for="{{ $id }}" {{ $wrapperAttributes->merge(['class' => $baseWrapperClasses])->merge($dataAttributes) }}>

    <input
        type="checkbox"
        id="{{ $id }}"
        name="{{ $name }}"
        value="{{ $value }}"
        {{ $checked ? 'checked' : '' }}
        {{ $disabled ? 'disabled' : '' }}
        {{ $required ? 'required' : '' }}
        class="{{ $toggleClasses }}"
        data-keys-input="true"
        data-type="checkbox"
        {{ $toggleAttributes }}
    />

    <div class="{{ $trackClasses }}" data-keys-track="true" data-toggle-target="{{ $id }}"></div>

    
    @if($hasContent())
        <div class="flex-1 min-w-0 focus-within:[&_[data-icon]]:text-accent">
            <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
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
                    @if($hint)
                        <x-keys::text size="xs" color="muted" class="mt-1">{{ $hint }}</x-keys::text>
                    @endif
                </div>

                @if($hasActions())
                    <div class="flex items-center gap-1 ml-2" data-keys-actions="true">
                        @foreach($computedActionData as $action)
                            <div class="input-action"
                                 data-keys-action="true"
                                 data-action="{{ $action['data_action'] }}"
                                 data-toggle-component="{{ $id }}"
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
                                        <span class="button-icon-default {{ $action['icon'] === $action['data_icon_default'] ? 'opacity-100' : 'opacity-0' }} transition-opacity duration-200" data-icon="true">
                                            <x-keys::icon :name="$action['data_icon_default']" :size="$computedActionSize" />
                                        </span>
                                        @if($action['data_icon_toggle'])
                                            <span class="button-icon-toggle {{ $action['icon'] === $action['data_icon_toggle'] ? 'opacity-100' : 'opacity-0' }} absolute inset-0 flex items-center justify-center transition-all duration-200" data-icon="true">
                                                <x-keys::icon :name="$action['data_icon_toggle']" :size="$computedActionSize" />
                                            </span>
                                        @endif
                                        @if($action['data_icon_success'])
                                            <span class="button-icon-success opacity-0 absolute inset-0 flex items-center justify-center transition-all duration-200" data-icon="true">
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