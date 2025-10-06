@php

    $containerId = $id . '-container';
    $editorId = $id . '-editor';
    $hiddenInputId = $id . '-input';

    $editorWrapperAttributes = $attributes->whereDoesntStartWith('wire:');
    $editorAttributes = $attributes->whereStartsWith('wire:');
    $isLivewireEnabled = $editorAttributes->isNotEmpty();

    $editorBaseClasses = 'quill-editor has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 transition-all duration-200 overflow-hidden';

    $editorSizeClasses = match ($size) {
        'xs' => 'rounded-sm',
        'sm' => 'rounded-md',
        'md' => 'rounded-md',
        'lg' => 'rounded-lg',
        'xl' => 'rounded-lg',
        default => 'rounded-md'
    };

    $editorStateClasses = '';
    if ($disabled || $loading) {
        $editorStateClasses .= ' quill-editor-disabled cursor-not-allowed opacity-50';
    }
    if ($loading) {
        $editorStateClasses .= ' quill-editor-loading relative';
    }
    if ($hasError) {
        $editorStateClasses .= ' quill-editor-error';
    }

    $editorClasses = trim("$editorBaseClasses quill-editor-{$size} $editorSizeClasses $editorStateClasses");

    $containerClasses = "quill-container quill-container-{$size} border border-line bg-elevation-1";

    $editorContainerAttributes = $editorAttributes->merge([
        'class' => $editorClasses
    ])->merge($dataAttributes);

    if ($isLivewireEnabled) {
        $editorContainerAttributes = $editorContainerAttributes->merge([
            'data-livewire-enabled' => 'true',
            'data-livewire-mode' => 'true',
        ]);
    }

    $editorAccessibilityAttrs = '';
    foreach ($accessibilityAttributes as $attr => $value) {
        $editorAccessibilityAttrs .= ' ' . $attr . '="' . e($value) . '"';
    }

    if ($hasError) {
        $editorAccessibilityAttrs .= ' aria-invalid="true"';
        if ($errors && $showErrors) {
            $editorAccessibilityAttrs .= ' aria-describedby="' . $hiddenInputId . '-error"';
        }
    }
@endphp

@if($isShorthand())
    <div {{ $editorWrapperAttributes->only('class') }}>
        <x-keys::label :for="$id" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="mt-1">
            
            <div {{ $editorContainerAttributes }} @if($isLivewireEnabled) wire:ignore @endif>
                
                <div
                    id="{{ $liveRegionId }}"
                    aria-live="polite"
                    aria-atomic="true"
                    class="sr-only"
                    data-quill-live-region="true"
                ></div>

                
                <div
                    class="{{ $containerClasses }}"
                    id="{{ $editorId }}"
                    data-quill-container="true"
                    style="min-height: {{ $height }}"
                    data-quill-config="{{ json_encode($quillConfig) }}"
                    data-quill-value="{{ json_encode($value) }}"
                    @if($isLivewireEnabled)
                        {{ $editorAttributes }}
                        @php
                            $wireModelName = $editorAttributes->whereStartsWith('wire:model')->first();
                        @endphp
                        @if($wireModelName)
                            data-wire-model="{{ $wireModelName }}"
                            data-livewire-property="{{ $wireModelName }}"
                        @endif
                    @else
                        data-editor-sync-target="{{ $hiddenInputId }}"
                    @endif
                    {!! $editorAccessibilityAttrs !!}
                    tabindex="0"
                ></div>

                
                @if($loading)
                    <div class="loading-container">
                        <div class="flex items-center space-x-2 text-muted">
                            <x-keys::loading :animation="$loadingAnimation" :size="$size" />
                            <span class="text-sm">{{ $loadingText }}</span>
                        </div>
                    </div>
                @endif
            </div>

            
            @if($name && !$isLivewireEnabled)
                <input
                    type="hidden"
                    id="{{ $hiddenInputId }}"
                    name="{{ $name }}"
                    value="{{ $value }}"
                    data-quill-input="true"
                    @if($required) required @endif
                />
            @endif
        </div>

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div {{ $editorWrapperAttributes->only('class') }}>
        
        <div {{ $editorContainerAttributes }} @if($isLivewireEnabled) wire:ignore @endif>
            
            <div
                id="{{ $liveRegionId }}"
                aria-live="polite"
                aria-atomic="true"
                class="sr-only"
                data-quill-live-region="true"
            ></div>

            
            <div
                class="{{ $containerClasses }}"
                id="{{ $editorId }}"
                data-quill-container="true"
                style="min-height: {{ $height }}"
                data-quill-config="{{ json_encode($quillConfig) }}"
                data-quill-value="{{ json_encode($value) }}"
                @if($isLivewireEnabled)
                    {{ $editorAttributes }}
                    @php
                        $wireModelName = $editorAttributes->whereStartsWith('wire:model')->first();
                    @endphp
                    @if($wireModelName)
                        data-wire-model="{{ $wireModelName }}"
                        data-livewire-property="{{ $wireModelName }}"
                    @endif
                @else
                    data-editor-sync-target="{{ $hiddenInputId }}"
                @endif
                {!! $editorAccessibilityAttrs !!}
                tabindex="0"
            ></div>

            
            @if($loading)
                <div class="loading-container">
                    <div class="flex items-center space-x-2 text-muted">
                        <x-keys::loading :animation="$loadingAnimation" :size="$size" />
                        <span class="text-sm">{{ $loadingText }}</span>
                    </div>
                </div>
            @endif
        </div>

        
        @if($name && !$isLivewireEnabled)
            <input
                type="hidden"
                id="{{ $hiddenInputId }}"
                name="{{ $name }}"
                value="{{ $value }}"
                data-quill-input="true"
                @if($required) required @endif
            />
        @endif
    </div>
@endif