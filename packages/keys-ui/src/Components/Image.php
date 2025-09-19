<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Image extends Component
{
    public function __construct(
        public string $src,
        public string $alt,
        public string $size = 'full',
        public string $aspectRatio = 'auto',
        public string $objectFit = 'cover',
        public string $radius = 'none',
        public ?string $caption = null,
        public ?string $overlay = null,
        public string $overlayColor = 'black',
        public string $overlayOpacity = '50',
        public bool $lazy = true,
        public ?string $placeholder = null,
        public bool $lightbox = false
    ) {
        // Validate size
        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl', 'full'])) {
            $this->size = 'full';
        }

        // Validate aspect ratio
        if (!in_array($this->aspectRatio, ['auto', 'square', 'video', 'photo', 'wide'])) {
            $this->aspectRatio = 'auto';
        }

        // Validate object fit
        if (!in_array($this->objectFit, ['cover', 'contain', 'fill', 'scale-down', 'none'])) {
            $this->objectFit = 'cover';
        }

        // Validate radius
        if (!in_array($this->radius, ['none', 'sm', 'md', 'lg', 'xl', 'full'])) {
            $this->radius = 'none';
        }

        // Validate overlay
        if ($this->overlay && !in_array($this->overlay, ['gradient-top', 'gradient-bottom', 'solid', 'none'])) {
            $this->overlay = null;
        }

        // Validate overlay color
        $validColors = ['black', 'white', 'brand', 'success', 'warning', 'danger', 'neutral'];
        if (!in_array($this->overlayColor, $validColors)) {
            $this->overlayColor = 'black';
        }

        // Validate overlay opacity
        if (!in_array($this->overlayOpacity, ['10', '20', '30', '40', '50', '60', '70', '80', '90'])) {
            $this->overlayOpacity = '50';
        }
    }

    public function hasCaption(): bool
    {
        return !empty($this->caption);
    }

    public function hasOverlay(): bool
    {
        return !empty($this->overlay) && $this->overlay !== 'none';
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'xs' => 'w-16 h-16',
            'sm' => 'w-24 h-24',
            'md' => 'w-32 h-32',
            'lg' => 'w-48 h-48',
            'xl' => 'w-64 h-64',
            'full' => 'w-full h-auto',
            default => 'w-full h-auto'
        };
    }

    public function aspectRatioClasses(): string
    {
        if ($this->size !== 'full') {
            return '';
        }

        return match ($this->aspectRatio) {
            'square' => 'aspect-square',
            'video' => 'aspect-video',
            'photo' => 'aspect-[4/3]',
            'wide' => 'aspect-[21/9]',
            'auto' => '',
            default => ''
        };
    }

    public function objectFitClasses(): string
    {
        return match ($this->objectFit) {
            'cover' => 'object-cover',
            'contain' => 'object-contain',
            'fill' => 'object-fill',
            'scale-down' => 'object-scale-down',
            'none' => 'object-none',
            default => 'object-cover'
        };
    }

    public function radiusClasses(): string
    {
        return match ($this->radius) {
            'sm' => 'rounded-sm',
            'md' => 'rounded-md',
            'lg' => 'rounded-lg',
            'xl' => 'rounded-xl',
            'full' => 'rounded-full',
            'none' => '',
            default => ''
        };
    }

    public function overlayClasses(): string
    {
        if (!$this->hasOverlay()) {
            return '';
        }

        $baseClasses = 'absolute inset-0 flex items-end justify-start p-6';

        $overlayBg = match ($this->overlay) {
            'gradient-top' => $this->getGradientClass('to-b'),
            'gradient-bottom' => $this->getGradientClass('to-t'),
            'solid' => $this->getSolidOverlayClass(),
            default => ''
        };

        return trim("{$baseClasses} {$overlayBg}");
    }

    protected function getGradientClass(string $direction): string
    {
        // Map opacity values to valid Tailwind opacity modifiers
        $opacityMap = [
            '10' => '10',
            '20' => '20',
            '30' => '30',
            '40' => '40',
            '50' => '50',
            '60' => '60',
            '70' => '70',
            '80' => '80',
            '90' => '90'
        ];

        $opacity = $opacityMap[$this->overlayOpacity] ?? '50';

        // Build complete gradient class names that Tailwind can detect
        $colorClass = match ($this->overlayColor) {
            'black' => match($opacity) {
                '10' => 'from-black/10',
                '20' => 'from-black/20',
                '30' => 'from-black/30',
                '40' => 'from-black/40',
                '50' => 'from-black/50',
                '60' => 'from-black/60',
                '70' => 'from-black/70',
                '80' => 'from-black/80',
                '90' => 'from-black/90',
                default => 'from-black/50'
            },
            'white' => match($opacity) {
                '10' => 'from-white/10',
                '20' => 'from-white/20',
                '30' => 'from-white/30',
                '40' => 'from-white/40',
                '50' => 'from-white/50',
                '60' => 'from-white/60',
                '70' => 'from-white/70',
                '80' => 'from-white/80',
                '90' => 'from-white/90',
                default => 'from-white/50'
            },
            'brand' => match($opacity) {
                '10' => 'from-blue-600/10',
                '20' => 'from-blue-600/20',
                '30' => 'from-blue-600/30',
                '40' => 'from-blue-600/40',
                '50' => 'from-blue-600/50',
                '60' => 'from-blue-600/60',
                '70' => 'from-blue-600/70',
                '80' => 'from-blue-600/80',
                '90' => 'from-blue-600/90',
                default => 'from-blue-600/50'
            },
            'success' => match($opacity) {
                '10' => 'from-emerald-600/10',
                '20' => 'from-emerald-600/20',
                '30' => 'from-emerald-600/30',
                '40' => 'from-emerald-600/40',
                '50' => 'from-emerald-600/50',
                '60' => 'from-emerald-600/60',
                '70' => 'from-emerald-600/70',
                '80' => 'from-emerald-600/80',
                '90' => 'from-emerald-600/90',
                default => 'from-emerald-600/50'
            },
            'warning' => match($opacity) {
                '10' => 'from-amber-500/10',
                '20' => 'from-amber-500/20',
                '30' => 'from-amber-500/30',
                '40' => 'from-amber-500/40',
                '50' => 'from-amber-500/50',
                '60' => 'from-amber-500/60',
                '70' => 'from-amber-500/70',
                '80' => 'from-amber-500/80',
                '90' => 'from-amber-500/90',
                default => 'from-amber-500/50'
            },
            'danger' => match($opacity) {
                '10' => 'from-red-600/10',
                '20' => 'from-red-600/20',
                '30' => 'from-red-600/30',
                '40' => 'from-red-600/40',
                '50' => 'from-red-600/50',
                '60' => 'from-red-600/60',
                '70' => 'from-red-600/70',
                '80' => 'from-red-600/80',
                '90' => 'from-red-600/90',
                default => 'from-red-600/50'
            },
            'neutral' => match($opacity) {
                '10' => 'from-gray-600/10',
                '20' => 'from-gray-600/20',
                '30' => 'from-gray-600/30',
                '40' => 'from-gray-600/40',
                '50' => 'from-gray-600/50',
                '60' => 'from-gray-600/60',
                '70' => 'from-gray-600/70',
                '80' => 'from-gray-600/80',
                '90' => 'from-gray-600/90',
                default => 'from-gray-600/50'
            },
            default => match($opacity) {
                '10' => 'from-black/10',
                '20' => 'from-black/20',
                '30' => 'from-black/30',
                '40' => 'from-black/40',
                '50' => 'from-black/50',
                '60' => 'from-black/60',
                '70' => 'from-black/70',
                '80' => 'from-black/80',
                '90' => 'from-black/90',
                default => 'from-black/50'
            }
        };

        return "bg-gradient-{$direction} {$colorClass} to-transparent";
    }

    protected function getSolidOverlayClass(): string
    {
        // Use complete class names for proper Tailwind detection
        return match ($this->overlayColor) {
            'black' => match($this->overlayOpacity) {
                '10' => 'bg-black/10',
                '20' => 'bg-black/20',
                '30' => 'bg-black/30',
                '40' => 'bg-black/40',
                '50' => 'bg-black/50',
                '60' => 'bg-black/60',
                '70' => 'bg-black/70',
                '80' => 'bg-black/80',
                '90' => 'bg-black/90',
                default => 'bg-black/50'
            },
            'white' => match($this->overlayOpacity) {
                '10' => 'bg-white/10',
                '20' => 'bg-white/20',
                '30' => 'bg-white/30',
                '40' => 'bg-white/40',
                '50' => 'bg-white/50',
                '60' => 'bg-white/60',
                '70' => 'bg-white/70',
                '80' => 'bg-white/80',
                '90' => 'bg-white/90',
                default => 'bg-white/50'
            },
            'brand' => match($this->overlayOpacity) {
                '10' => 'bg-blue-600/10',
                '20' => 'bg-blue-600/20',
                '30' => 'bg-blue-600/30',
                '40' => 'bg-blue-600/40',
                '50' => 'bg-blue-600/50',
                '60' => 'bg-blue-600/60',
                '70' => 'bg-blue-600/70',
                '80' => 'bg-blue-600/80',
                '90' => 'bg-blue-600/90',
                default => 'bg-blue-600/50'
            },
            'success' => match($this->overlayOpacity) {
                '10' => 'bg-emerald-600/10',
                '20' => 'bg-emerald-600/20',
                '30' => 'bg-emerald-600/30',
                '40' => 'bg-emerald-600/40',
                '50' => 'bg-emerald-600/50',
                '60' => 'bg-emerald-600/60',
                '70' => 'bg-emerald-600/70',
                '80' => 'bg-emerald-600/80',
                '90' => 'bg-emerald-600/90',
                default => 'bg-emerald-600/50'
            },
            'warning' => match($this->overlayOpacity) {
                '10' => 'bg-amber-500/10',
                '20' => 'bg-amber-500/20',
                '30' => 'bg-amber-500/30',
                '40' => 'bg-amber-500/40',
                '50' => 'bg-amber-500/50',
                '60' => 'bg-amber-500/60',
                '70' => 'bg-amber-500/70',
                '80' => 'bg-amber-500/80',
                '90' => 'bg-amber-500/90',
                default => 'bg-amber-500/50'
            },
            'danger' => match($this->overlayOpacity) {
                '10' => 'bg-red-600/10',
                '20' => 'bg-red-600/20',
                '30' => 'bg-red-600/30',
                '40' => 'bg-red-600/40',
                '50' => 'bg-red-600/50',
                '60' => 'bg-red-600/60',
                '70' => 'bg-red-600/70',
                '80' => 'bg-red-600/80',
                '90' => 'bg-red-600/90',
                default => 'bg-red-600/50'
            },
            'neutral' => match($this->overlayOpacity) {
                '10' => 'bg-gray-600/10',
                '20' => 'bg-gray-600/20',
                '30' => 'bg-gray-600/30',
                '40' => 'bg-gray-600/40',
                '50' => 'bg-gray-600/50',
                '60' => 'bg-gray-600/60',
                '70' => 'bg-gray-600/70',
                '80' => 'bg-gray-600/80',
                '90' => 'bg-gray-600/90',
                default => 'bg-gray-600/50'
            },
            default => match($this->overlayOpacity) {
                '10' => 'bg-black/10',
                '20' => 'bg-black/20',
                '30' => 'bg-black/30',
                '40' => 'bg-black/40',
                '50' => 'bg-black/50',
                '60' => 'bg-black/60',
                '70' => 'bg-black/70',
                '80' => 'bg-black/80',
                '90' => 'bg-black/90',
                default => 'bg-black/50'
            }
        };
    }

    public function containerClasses(): string
    {
        $baseClasses = 'relative overflow-hidden';
        $sizeClasses = $this->sizeClasses();
        $aspectClasses = $this->aspectRatioClasses();
        $radiusClasses = $this->radiusClasses();

        return trim("{$baseClasses} {$sizeClasses} {$aspectClasses} {$radiusClasses}");
    }

    public function imageClasses(): string
    {
        $baseClasses = 'absolute inset-0 w-full h-full';
        $objectFitClasses = $this->objectFitClasses();
        $radiusClasses = $this->radiusClasses();

        return trim("{$baseClasses} {$objectFitClasses} {$radiusClasses}");
    }

    public function figureClasses(): string
    {
        if (!$this->hasCaption()) {
            return $this->containerClasses();
        }

        $baseClasses = 'relative';
        $radiusClasses = $this->radiusClasses();

        return trim("{$baseClasses} {$radiusClasses}");
    }

    public function render()
    {
        return view('keys::components.image');
    }
}