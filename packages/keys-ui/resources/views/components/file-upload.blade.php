@php
    $classes = $baseClasses() . ' ' . $sizeClasses() . ' ' . $stateClasses();
@endphp

<div @if($isShorthand()) class="space-y-2" @endif>
    @if($isShorthand())
        <x-keys::label :for="$id" :required="$required" :optional="$optional">{{ $label }}</x-keys::label>
    @endif

    <div {{ $attributes->merge(['class' => $classes])->merge($dataAttributes) }} wire:ignore>
        @include('keys::partials.file-upload-content')
    </div>

    @if($isShorthand() && $showErrors)
        <x-keys::error :errors="$errors" />
    @endif
</div>

