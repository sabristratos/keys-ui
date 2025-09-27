<span {{ $attributes->merge([
    'class' => $chipClasses(),
    'id' => $id
])->merge($dataAttributes) }}>
    <span class="chip-label">
        @if($slot->isNotEmpty())
            {{ $slot }}
        @else
            {{ $label }}
        @endif
    </span>

    @if($removable)
        <button
            type="button"
            class="ml-1.5 p-0.5 rounded hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            data-chip-remove
            data-chip-value="{{ $value }}"
            aria-label="Remove {{ $label }}"
        >
            <x-keys::icon name="heroicon-o-x-mark" size="{{ $removeButtonSize() }}" />
            <span class="sr-only">Remove {{ $label }}</span>
        </button>
    @endif
</span>