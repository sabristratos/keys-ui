@php

    $baseClasses = 'tab-trigger inline-flex items-center justify-center px-3 py-2 font-medium text-sm transition-colors duration-200 relative z-10';

    $stateClasses = $disabled
        ? 'cursor-not-allowed opacity-50 text-muted'
        : 'cursor-pointer text-muted hover:text-foreground';

    $iconClasses = 'flex-shrink-0 mr-2';

    $tabClasses = trim("$baseClasses $stateClasses");
@endphp

@if ($isLink())
    <a {{ $attributes->merge(['class' => $tabClasses])->merge($dataAttributes)->merge($linkAttributes) }}>
        @if ($hasIcon())
            <x-keys::icon :name="$icon" class="{{ $iconClasses }}" />
        @endif

        @if ($hasLabel())
            <span>{{ $label }}</span>
        @endif

        {{ $slot }}
    </a>
@else
    <button {{ $attributes->merge(['class' => $tabClasses, 'type' => 'button'])->merge($dataAttributes) }}>
        @if ($hasIcon())
            <x-keys::icon :name="$icon" class="{{ $iconClasses }}" />
        @endif

        @if ($hasLabel())
            <span>{{ $label }}</span>
        @endif

        {{ $slot }}
    </button>
@endif