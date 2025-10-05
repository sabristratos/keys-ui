@php

    $baseClasses = 'inline relative';

    $variantClasses = match ($variant) {
        'gradient' => match ($color) {
            'brand' => 'bg-gradient-to-r bg-clip-text text-transparent font-bold from-brand-500 to-brand-600',
            'success' => 'bg-gradient-to-r bg-clip-text text-transparent font-bold from-green-500 to-emerald-600',
            'warning' => 'bg-gradient-to-r bg-clip-text text-transparent font-bold from-yellow-500 to-orange-600',
            'danger' => 'bg-gradient-to-r bg-clip-text text-transparent font-bold from-red-500 to-pink-600',
            'rainbow' => 'bg-gradient-to-r bg-clip-text text-transparent font-bold from-purple-500 via-blue-500 via-green-500 to-yellow-500',
            'blue' => 'bg-gradient-to-r bg-clip-text text-transparent font-bold from-blue-500 to-cyan-600',
            'purple' => 'bg-gradient-to-r bg-clip-text text-transparent font-bold from-purple-500 to-indigo-600',
            'pink' => 'bg-gradient-to-r bg-clip-text text-transparent font-bold from-pink-500 to-rose-600',
            default => 'bg-gradient-to-r bg-clip-text text-transparent font-bold from-brand-500 to-brand-600'
        },
        'highlight' => match ($color) {
            'brand' => 'px-1 py-0.5 rounded-sm font-medium relative bg-brand-100 text-brand-800',
            'success' => 'px-1 py-0.5 rounded-sm font-medium relative bg-green-100 text-green-800',
            'warning' => 'px-1 py-0.5 rounded-sm font-medium relative bg-yellow-100 text-yellow-800',
            'danger' => 'px-1 py-0.5 rounded-sm font-medium relative bg-red-100 text-red-800',
            'neutral' => 'px-1 py-0.5 rounded-sm font-medium relative bg-neutral-100 text-neutral-800',
            default => 'px-1 py-0.5 rounded-sm font-medium relative bg-brand-100 text-brand-800'
        },
        'underline' => 'font-medium relative',
        'glow' => match ($color) {
            'brand' => 'font-medium relative text-brand-700',
            'success' => 'font-medium relative text-green-700',
            'warning' => 'font-medium relative text-yellow-700',
            'danger' => 'font-medium relative text-red-700',
            'neutral' => 'font-medium relative text-neutral-700',
            default => 'font-medium relative text-brand-700'
        },
        'outline' => 'font-bold',
        default => ''
    };

    $combinedClasses = trim($baseClasses . ' ' . $variantClasses);
@endphp

<span {{ $attributes->merge(['class' => $combinedClasses])->merge($dataAttributes) }}>
    {{ $slot }}

    
    @if($variant === 'underline')
        <span class="absolute -bottom-0.5 left-0 w-full h-0.5 transform scale-x-0 origin-left transition-transform duration-500 ease-out"
              style="background-color: {{ $getUnderlineColor() }}; animation: {{ $getAnimationName() }} 1.2s ease-out forwards;"></span>
    @endif
</span>

<style>
    [data-keys-heading-decorator][data-variant="underline"] {
        position: relative;
        overflow: hidden;
    }

    [data-keys-heading-decorator][data-variant="underline"]:hover span {
        transform: scaleX(1);
    }

    [data-keys-heading-decorator][data-variant="glow"] {
        position: relative;
    }

    [data-keys-heading-decorator][data-variant="glow"]::before {
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

    [data-keys-heading-decorator][data-variant="outline"] {
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
    [data-keys-heading-decorator][data-variant="highlight"].blend-mode {
        mix-blend-mode: multiply;
        background: linear-gradient(120deg, {{ $getGlowColor() }}20, {{ $getGlowColor() }}10, transparent);
        backdrop-filter: blur(0.5px);
    }

    /* Highlight animation trigger */
    [data-keys-heading-decorator][data-variant="highlight"] {
        animation: {{ $getAnimationName() }} 0.6s ease-out forwards;
    }

    /* Dark mode adjustments */
    .dark [data-keys-heading-decorator][data-variant="highlight"] {
        filter: brightness(0.9);
    }

    .dark [data-keys-heading-decorator][data-variant="highlight"].blend-mode {
        mix-blend-mode: screen;
        background: linear-gradient(120deg, {{ $getGlowColor() }}15, {{ $getGlowColor() }}08, transparent);
    }

    .dark [data-keys-heading-decorator][data-variant="glow"]::before {
        background: linear-gradient(45deg, {{ $getGlowColor() }}20, transparent, {{ $getGlowColor() }}12);
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
        [data-keys-heading-decorator] * {
            animation: none !important;
            transition: none !important;
        }

        [data-keys-heading-decorator][data-variant="glow"] {
            text-shadow: 0 0 8px {{ $getGlowColor() }}40;
        }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
        [data-keys-heading-decorator][data-variant="gradient"] {
            background: none;
            color: inherit;
            -webkit-text-fill-color: inherit;
            font-weight: bold;
        }

        [data-keys-heading-decorator][data-variant="glow"] {
            text-shadow: none;
            font-weight: bold;
        }
    }

    /* Responsive gradient adjustments */
    @media (max-width: 640px) {
        [data-keys-heading-decorator][data-variant="gradient"] {
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
    [data-keys-heading-decorator]:focus-visible {
        outline: 2px solid var(--color-brand-500);
        outline-offset: 2px;
        border-radius: 4px;
    }

    /* Print styles */
    @media print {
        [data-keys-heading-decorator][data-variant="gradient"] {
            background: none;
            color: black;
            -webkit-text-fill-color: black;
        }

        [data-keys-heading-decorator][data-variant="glow"],
        [data-keys-heading-decorator][data-variant="outline"] {
            text-shadow: none;
            -webkit-text-stroke: none;
        }

        [data-keys-heading-decorator][data-variant="highlight"] {
            background: none;
            color: black;
        }
    }
</style>