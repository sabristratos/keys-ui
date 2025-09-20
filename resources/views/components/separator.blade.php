@php
    $slotContent = $slot->toHtml();
    $isIconOnly = $isIconOnly($slotContent);
    $hasContent = !empty(trim(strip_tags($slotContent))) || !empty($icon);
@endphp

<div {{ $attributes->merge(['class' => $containerClasses()]) }} role="separator"
     @if($orientation === 'vertical') aria-orientation="vertical" @endif>

    @if($variant === 'gradient')
        {{-- Gradient separator --}}
        <div class="{{ $gradientClasses() }}"></div>

    @elseif($variant === 'line' || $variant === 'dashed')
        {{-- Simple line or dashed separator --}}
        <div class="{{ $lineClasses() }}"></div>

    @elseif(($variant === 'text' || $variant === 'icon') && $hasContent)
        {{-- Text or icon separator with content --}}
        @if($orientation === 'horizontal')
            <div class="{{ $lineClasses() }}"></div>
            <div class="{{ $contentClasses() }} {{ $justifyClasses() }}">
                @if($variant === 'icon' && $icon)
                    <x-keys::icon :name="$icon" :size="$iconSize()" class="{{ $iconColorClasses() }}" />
                @elseif($variant === 'text' && !$isIconOnly)
                    {{ $slot }}
                @endif
            </div>
            <div class="{{ $lineClasses() }}"></div>
        @else
            {{-- Vertical orientation --}}
            <div class="{{ $lineClasses() }}"></div>
            <div class="{{ $contentClasses() }} {{ $justifyClasses() }} py-2">
                @if($variant === 'icon' && $icon)
                    <x-keys::icon :name="$icon" :size="$iconSize()" class="{{ $iconColorClasses() }}" />
                @elseif($variant === 'text' && !$isIconOnly)
                    <span class="writing-mode-vertical-rl text-orientation-mixed">{{ $slot }}</span>
                @endif
            </div>
            <div class="{{ $lineClasses() }}"></div>
        @endif

    @else
        {{-- Fallback to simple line --}}
        <div class="{{ $lineClasses() }}"></div>
    @endif
</div>

<style>
    /* Vertical text orientation for text separators */
    .writing-mode-vertical-rl {
        writing-mode: vertical-rl;
    }

    .text-orientation-mixed {
        text-orientation: mixed;
    }

    /* Enhanced dashed line styles */
    [data-separator="dashed"] .border-dashed {
        border-style: dashed;
        border-width: 1px;
    }

    /* Gradient separator enhancements */
    [data-separator="gradient"] {
        position: relative;
    }

    /* Hover effects for interactive separators */
    [data-separator="text"]:hover .separator-content,
    [data-separator="icon"]:hover .separator-content {
        transition: all 0.2s ease-in-out;
        transform: scale(1.05);
    }

    /* Focus styles for accessibility */
    [role="separator"]:focus-within {
        outline: 2px solid var(--color-brand);
        outline-offset: 2px;
        border-radius: 4px;
    }

    /* Dark mode specific adjustments */
    .dark [data-separator] .separator-content {
        background-color: var(--color-body);
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
        [data-separator="text"] .separator-content,
        [data-separator="icon"] .separator-content {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
        }
    }

    /* Animation for gradient separators */
    [data-separator="gradient"] .gradient-line {
        background-size: 200% 200%;
        animation: gradient-shift 3s ease-in-out infinite;
    }

    @keyframes gradient-shift {
        0%, 100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }

    /* Enhanced border styles for different sizes */
    .border-t-2 {
        border-top-width: 2px;
    }

    .border-t-4 {
        border-top-width: 4px;
    }

    .border-t-8 {
        border-top-width: 8px;
    }

    .border-l-2 {
        border-left-width: 2px;
    }

    .border-l-4 {
        border-left-width: 4px;
    }

    .border-l-8 {
        border-left-width: 8px;
    }
</style>

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Add data attributes for CSS targeting
    document.querySelectorAll('[role="separator"]').forEach(separator => {
        const classes = separator.className;

        if (classes.includes('border-dashed')) {
            separator.setAttribute('data-separator', 'dashed');
        } else if (classes.includes('bg-gradient')) {
            separator.setAttribute('data-separator', 'gradient');
        } else if (separator.querySelector('.separator-content')) {
            const hasIcon = separator.querySelector('svg');
            separator.setAttribute('data-separator', hasIcon ? 'icon' : 'text');
        } else {
            separator.setAttribute('data-separator', 'line');
        }
    });
});
</script>
@endpush