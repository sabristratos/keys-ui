@if ($isLink())
    <a {{ $attributes->merge(array_merge(
        ['class' => $computedTabClasses],
        $ariaAttributes,
        $linkAttributes
    )) }}>
        @if ($hasIcon())
            <x-keys::icon :name="$icon" class="{{ $computedIconClasses }}" />
        @endif

        @if ($hasLabel())
            <span>{{ $label }}</span>
        @endif

        {{ $slot }}
    </a>
@else
    <button {{ $attributes->merge(array_merge(
        ['class' => $computedTabClasses, 'type' => 'button'],
        $ariaAttributes
    )) }}>
        @if ($hasIcon())
            <x-keys::icon :name="$icon" class="{{ $computedIconClasses }}" />
        @endif

        @if ($hasLabel())
            <span>{{ $label }}</span>
        @endif

        {{ $slot }}
    </button>
@endif