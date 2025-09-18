@php
    $checkboxAttributes = $attributes->whereStartsWith('wire:model');
    $wrapperAttributes = $attributes->whereDoesntStartWith('wire:model');
@endphp


<label for="{{ $id }}" {{ $wrapperAttributes->merge(['class' => $combinedClasses()]) }}>
    <input
        type="checkbox"
        id="{{ $id }}"
        name="{{ $name }}"
        value="{{ $value }}"
        {{ $checked ? 'checked' : '' }}
        {{ $disabled ? 'disabled' : '' }}
        {{ $required ? 'required' : '' }}
        {{ $indeterminate ? 'data-indeterminate=true' : '' }}
        class="{{ $checkboxClasses() }} shrink-0"
        {{ $checkboxAttributes }}
    />

    @if($hasContent())
        <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                    @if($isCard())
                        
                        @if($icon)
                            <div class="flex items-center gap-2 mb-1">
                                <x-keys::icon :name="$icon" :size="$iconSize()" class="shrink-0" />
                                @if($title)
                                    <span class="{{ $labelClasses() }}">
                                        {{ $title }}
                                        @if($required)
                                            <span class="text-danger ml-1">*</span>
                                        @endif
                                    </span>
                                @endif
                            </div>
                        @elseif($title)
                            <span class="{{ $labelClasses() }} block mb-1">
                                {{ $title }}
                                @if($required)
                                    <span class="text-danger ml-1">*</span>
                                @endif
                            </span>
                        @endif

                        @if($description)
                            <p class="text-sm text-muted">{{ $description }}</p>
                        @endif
                    @else
                        
                        @if($label)
                            <span class="{{ $labelClasses() }}">
                                {{ $label }}
                                @if($required)
                                    <span class="text-danger ml-1">*</span>
                                @endif
                            </span>
                        @endif
                        @if($description)
                            <p class="text-sm text-muted mt-1">{{ $description }}</p>
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

