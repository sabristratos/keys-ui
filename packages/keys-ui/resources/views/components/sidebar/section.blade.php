
@php
    $paddingClasses = match ($variant) {
        'compact' => 'py-1',
        default => 'py-2'
    };

    $headingClasses = 'px-4 py-2';
@endphp

@if($collapsible)
    {{-- Collapsible Section using details/summary --}}
    <details
        id="{{ $id }}"
        class="group {{ $paddingClasses }}"
        {{ $collapsed ? '' : 'open' }}
        {{ $attributes->merge($dataAttributes) }}
    >
        @if($heading)
            <summary class="{{ $headingClasses }} flex items-center justify-between cursor-pointer list-none select-none transition-colors duration-150 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 lg:[.sidebar-collapsed_&]:hidden">
                <x-keys::text element="span" size="xs" weight="semibold" color="muted" uppercase class="tracking-wider">{{ $heading }}</x-keys::text>

                @if($icon && $collapsible)
                    <x-keys::icon
                        :name="$icon"
                        size="xs"
                        class="transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-open:rotate-180"
                    />
                @endif
            </summary>
        @endif

        <div class="space-y-0.5 px-2 mt-1">
            {{ $slot }}
        </div>
    </details>
@else
    {{-- Non-collapsible Section --}}
    <div
        id="{{ $id }}"
        class="{{ $paddingClasses }}"
        {{ $attributes->merge($dataAttributes) }}
    >
        @if($heading)
            <div class="{{ $headingClasses }} lg:[.sidebar-collapsed_&]:hidden">
                <x-keys::text element="span" size="xs" weight="semibold" color="muted" uppercase class="tracking-wider">{{ $heading }}</x-keys::text>
            </div>
        @endif

        <div class="space-y-0.5 px-2 {{ $heading ? 'mt-1' : '' }}">
            {{ $slot }}
        </div>
    </div>
@endif
