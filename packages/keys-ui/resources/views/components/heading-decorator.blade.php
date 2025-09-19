<span {{ $attributes->merge([
    'class' => trim($componentClasses() . ' ' . $variantClasses()),
    'data-heading-decorator' => $variant,
    'data-animation' => $getAnimationName()
]) }}>
    {{ $slot }}

    {{-- Underline effect pseudo-element --}}
    @if($variant === 'underline')
        <span class="absolute -bottom-0.5 left-0 w-full h-0.5 transform scale-x-0 origin-left transition-transform duration-500 ease-out"
              style="background-color: {{ $getUnderlineColor() }}; animation: {{ $getAnimationName() }} 1.2s ease-out forwards;"></span>
    @endif
</span>

{{-- Inline styles for component-specific effects --}}
<style>
    [data-heading-decorator="underline"] {
        position: relative;
        overflow: hidden;
    }

    [data-heading-decorator="underline"]:hover span {
        transform: scaleX(1);
    }

    [data-heading-decorator="glow"] {
        position: relative;
    }

    [data-heading-decorator="glow"]::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, {{ $getGlowColor() }}15, transparent, {{ $getGlowColor() }}10);
        border-radius: 2px;
        z-index: -1;
        animation: {{ $getAnimationName() }} 3s ease-in-out infinite;
    }

    [data-heading-decorator="outline"] {
        -webkit-text-stroke: 1px {{ $getUnderlineColor() }};
        text-shadow:
            2px 2px 0 {{ $getUnderlineColor() }}40,
            4px 4px 0 {{ $getUnderlineColor() }}20;
    }

    @keyframes keys-underline-draw {
        0% {
            transform: scaleX(0);
            transform-origin: left;
        }
        15% {
            transform: scaleX(0.3) scaleY(1.2);
            transform-origin: left;
        }
        35% {
            transform: scaleX(0.7) scaleY(0.8);
            transform-origin: left;
        }
        60% {
            transform: scaleX(0.9) scaleY(1.1);
            transform-origin: left;
        }
        80% {
            transform: scaleX(1.02) scaleY(0.9);
            transform-origin: left;
        }
        100% {
            transform: scaleX(1) scaleY(1);
            transform-origin: left;
        }
    }

    @keyframes keys-underline-grow {
        from {
            transform: scaleX(0);
        }
        to {
            transform: scaleX(1);
        }
    }

    @keyframes keys-underline-slide {
        from {
            transform: translateX(-100%);
            transform-origin: left;
        }
        to {
            transform: translateX(0);
            transform-origin: left;
        }
    }

    @keyframes keys-glow-subtle {
        0%, 100% {
            opacity: 0.8;
            filter: brightness(1);
        }
        50% {
            opacity: 1;
            filter: brightness(1.1);
        }
    }

    @keyframes keys-highlight-fade {
        0% {
            opacity: 0;
            transform: scale(0.95);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes keys-highlight-slide {
        0% {
            transform: translateX(-10px);
            opacity: 0;
        }
        100% {
            transform: translateX(0);
            opacity: 1;
        }
    }

    /* Blend mode variant for highlight */
    [data-heading-decorator="highlight"].blend-mode {
        mix-blend-mode: multiply;
        background: linear-gradient(120deg, {{ $getGlowColor() }}20, {{ $getGlowColor() }}10, transparent);
        backdrop-filter: blur(0.5px);
    }

    /* Highlight animation trigger */
    [data-heading-decorator="highlight"] {
        animation: {{ $getAnimationName() }} 0.6s ease-out forwards;
    }

    /* Dark mode adjustments */
    .dark [data-heading-decorator="highlight"] {
        filter: brightness(0.9);
    }

    .dark [data-heading-decorator="highlight"].blend-mode {
        mix-blend-mode: screen;
        background: linear-gradient(120deg, {{ $getGlowColor() }}15, {{ $getGlowColor() }}08, transparent);
    }

    .dark [data-heading-decorator="glow"]::before {
        background: linear-gradient(45deg, {{ $getGlowColor() }}20, transparent, {{ $getGlowColor() }}12);
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        [data-heading-decorator] * {
            animation: none !important;
            transition: none !important;
        }

        [data-heading-decorator="glow"] {
            text-shadow: 0 0 8px {{ $getGlowColor() }}40;
        }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
        [data-heading-decorator="gradient"] {
            background: none;
            color: inherit;
            -webkit-text-fill-color: inherit;
            font-weight: bold;
        }

        [data-heading-decorator="glow"] {
            text-shadow: none;
            font-weight: bold;
        }
    }

    /* Responsive gradient adjustments */
    @media (max-width: 640px) {
        [data-heading-decorator="gradient"] {
            background-size: 200% 200%;
            animation: keys-gradient-shift 3s ease infinite;
        }
    }

    @keyframes keys-gradient-shift {
        0%, 100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }

    /* Focus states for accessibility */
    [data-heading-decorator]:focus-visible {
        outline: 2px solid var(--color-brand-500);
        outline-offset: 2px;
        border-radius: 4px;
    }

    /* Print styles */
    @media print {
        [data-heading-decorator="gradient"] {
            background: none;
            color: black;
            -webkit-text-fill-color: black;
        }

        [data-heading-decorator="glow"],
        [data-heading-decorator="outline"] {
            text-shadow: none;
            -webkit-text-stroke: none;
        }

        [data-heading-decorator="highlight"] {
            background: none;
            color: black;
        }
    }
</style>