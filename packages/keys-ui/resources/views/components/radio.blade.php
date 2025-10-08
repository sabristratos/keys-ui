@php
    $radioAttributes = $attributes->whereStartsWith('wire:model');
    $wrapperAttributes = $attributes->whereDoesntStartWith('wire:model');

    // Custom radio circle size
    $circleSizeClasses = match ($size) {
        'sm' => 'w-4 h-4',
        'md' => 'w-5 h-5',
        'lg' => 'w-6 h-6',
        default => 'w-5 h-5'
    };

    // Inner dot size
    $dotSizeClasses = match ($size) {
        'sm' => 'w-2 h-2',
        'md' => 'w-2.5 h-2.5',
        'lg' => 'w-3 h-3',
        default => 'w-2.5 h-2.5'
    };

    // Base radio circle styling - custom visual element
    if ($disabled) {
        $radioCircleClasses = 'border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-700/30 rounded-full flex items-center justify-center cursor-not-allowed shadow-xs';
        $dotClasses = 'bg-neutral-400 dark:bg-neutral-600 rounded-full';
    } elseif ($hasError()) {
        $radioCircleClasses = 'border-2 rounded-full flex items-center justify-center transition-all duration-300 border-danger group-hover:border-danger group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-offset-2 group-has-[:focus-visible]:ring-danger dark:group-has-[:focus-visible]:ring-offset-neutral-900 shadow-xs';
        $dotClasses = 'bg-danger rounded-full transform scale-0 transition-transform duration-200 ease-out group-has-[:checked]:scale-100';
        $radioCircleClasses .= ' group-has-[:checked]:border-danger';
    } else {
        // Color-based solid backgrounds and states
        $gradientClasses = match ($color) {
            'brand' => 'group-has-[:checked]:border-indigo-600',
            'success' => 'group-has-[:checked]:border-green-600',
            'warning' => 'group-has-[:checked]:border-amber-600',
            'danger' => 'group-has-[:checked]:border-red-600',
            'neutral' => 'group-has-[:checked]:border-neutral-500',
            default => 'group-has-[:checked]:border-indigo-600'
        };

        $dotBackground = match ($color) {
            'brand' => 'bg-indigo-500',
            'success' => 'bg-green-500',
            'warning' => 'bg-amber-500',
            'danger' => 'bg-red-500',
            'neutral' => 'bg-neutral-500 dark:bg-neutral-600',
            default => 'bg-indigo-500'
        };

        $hoverColor = match ($color) {
            'brand' => 'group-hover:border-indigo-500',
            'success' => 'group-hover:border-green-500',
            'warning' => 'group-hover:border-amber-500',
            'danger' => 'group-hover:border-red-500',
            'neutral' => 'group-hover:border-neutral-400',
            default => 'group-hover:border-indigo-500'
        };

        $focusRing = match ($color) {
            'brand' => 'group-has-[:focus-visible]:ring-indigo-500',
            'success' => 'group-has-[:focus-visible]:ring-green-500',
            'warning' => 'group-has-[:focus-visible]:ring-amber-500',
            'danger' => 'group-has-[:focus-visible]:ring-red-500',
            'neutral' => 'group-has-[:focus-visible]:ring-neutral-500',
            default => 'group-has-[:focus-visible]:ring-indigo-500'
        };

        $radioCircleClasses = "border-2 border-neutral-400 dark:border-neutral-500 rounded-full flex items-center justify-center transition-all duration-300 {$hoverColor} {$gradientClasses} group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-offset-2 {$focusRing} dark:group-has-[:focus-visible]:ring-offset-neutral-900 shadow-xs";
        $dotClasses = "{$dotBackground} rounded-full transform scale-0 transition-transform duration-200 ease-out group-has-[:checked]:scale-100";
    }

    $gap = ($variant === 'card' && !$showInput) ? 'gap-0' : 'gap-3';

    $wrapperBaseClasses = match ($variant) {
        'standard' => "group flex items-center {$gap} cursor-pointer",
        'bordered' => "group flex items-center {$gap} p-4 border border-line rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200 cursor-pointer",
        'colored' => "group flex items-center {$gap} p-4 border-2 rounded-lg transition-colors duration-200 cursor-pointer",
        'card' => "group flex items-center {$gap} p-4 border border-line rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200 cursor-pointer",
        default => "group flex items-center {$gap} cursor-pointer"
    };

    if ($disabled) {
        $wrapperBaseClasses = str_replace('cursor-pointer', 'cursor-not-allowed', $wrapperBaseClasses);
    }

    if ($variant === 'colored') {
        $borderColor = match ($color) {
            'brand' => 'border-line has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-950/30',
            'success' => 'border-line has-[:checked]:border-green-500 has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-950/30',
            'warning' => 'border-line has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50 dark:has-[:checked]:bg-amber-950/30',
            'danger' => 'border-line has-[:checked]:border-red-500 has-[:checked]:bg-red-50 dark:has-[:checked]:bg-red-950/30',
            'neutral' => 'border-line has-[:checked]:border-neutral-400 has-[:checked]:bg-neutral-100 dark:has-[:checked]:bg-neutral-800',
            default => 'border-line has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 dark:has-[:checked]:bg-indigo-950/30'
        };
        $wrapperBaseClasses .= ' ' . $borderColor;
    }

    if ($variant === 'card') {
        $bgColor = match ($color) {
            'brand' => 'has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500 dark:has-[:checked]:bg-indigo-950/30',
            'success' => 'has-[:checked]:bg-green-50 has-[:checked]:border-green-500 dark:has-[:checked]:bg-green-950/30',
            'warning' => 'has-[:checked]:bg-amber-50 has-[:checked]:border-amber-500 dark:has-[:checked]:bg-amber-950/30',
            'danger' => 'has-[:checked]:bg-red-50 has-[:checked]:border-red-500 dark:has-[:checked]:bg-red-950/30',
            'neutral' => 'has-[:checked]:bg-neutral-100 has-[:checked]:border-neutral-400 dark:has-[:checked]:bg-neutral-800',
            default => 'has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-500 dark:has-[:checked]:bg-indigo-950/30'
        };
        $wrapperBaseClasses .= ' ' . $bgColor;
    }

    if ($hasError() && in_array($variant, ['bordered', 'colored', 'card'])) {
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
    {{-- Hidden native radio input --}}
    <input
        type="radio"
        id="{{ $id }}"
        name="{{ $name }}"
        value="{{ $value }}"
        {{ $checked ? 'checked' : '' }}
        {{ $disabled ? 'disabled' : '' }}
        {{ $required ? 'required' : '' }}
        class="absolute opacity-0 w-0 h-0"
        {{ $radioAttributes }}
    />

    @if($showInput)
        {{-- Custom visual radio with animated dot --}}
        <div class="{{ $circleSizeClasses }} {{ $radioCircleClasses }} shrink-0">
            <div class="{{ $dotSizeClasses }} {{ $dotClasses }}"></div>
        </div>
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