@php
    $sizeClasses = match ($size) {
        'xs' => 'px-1.5 py-0.5 text-xs',
        'sm' => 'px-2.5 py-0.5 text-xs',
        'md' => 'px-3 py-1 text-sm',
        default => 'px-2.5 py-0.5 text-xs'
    };

    $colorClasses = match ($color) {
        'brand' => 'bg-accent text-white',
        'success' => 'bg-success text-white',
        'warning' => 'bg-warning text-white',
        'danger' => 'bg-danger text-white',
        'neutral' => 'bg-neutral text-white',
        'blue' => 'bg-blue-600 text-white',
        'gray' => 'bg-neutral-600 text-white',
        'red' => 'bg-red-600 text-white',
        'green' => 'bg-green-600 text-white',
        'yellow' => 'bg-yellow-600 text-white',
        'indigo' => 'bg-indigo-600 text-white',
        'purple' => 'bg-purple-600 text-white',
        'pink' => 'bg-pink-600 text-white',
        'dark' => 'bg-neutral-900 text-white',
        default => 'bg-blue-600 text-white'
    };

    $baseClasses = 'inline-flex items-center font-medium rounded-sm';
    if ($removable) {
        $baseClasses .= ' justify-between';
    }

    $chipClasses = trim("$baseClasses $sizeClasses $colorClasses");

    $removeButtonSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'xs',
        'md' => 'sm',
        default => 'xs'
    };
@endphp

<span {{ $attributes->merge([
    'class' => $chipClasses,
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
            <x-keys::icon name="heroicon-o-x-mark" size="{{ $removeButtonSize }}" />
            <span class="sr-only">Remove {{ $label }}</span>
        </button>
    @endif
</span>