@php
    $containerId = $id . '-container';
    $editorId = $id . '-editor';
    $hiddenInputId = $id . '-input';

    $editorWrapperAttributes = $attributes->whereDoesntStartWith('wire:');
    $editorAttributes = $attributes->whereStartsWith('wire:');

    $editorContainerAttributes = $editorAttributes->merge([
        'class' => $editorClasses
    ])->merge($dataAttributes);

    // Build accessibility attributes for the editor container
    $editorAccessibilityAttrs = '';
    foreach ($accessibilityAttributes as $attr => $value) {
        $editorAccessibilityAttrs .= ' ' . $attr . '="' . e($value) . '"';
    }

    // Add error state to accessibility attributes
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
            @include('keys::partials.editor-field')
        </div>

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div {{ $editorWrapperAttributes->only('class') }}>
        @include('keys::partials.editor-field')
    </div>
@endif