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
        $opacity = $this->overlayOpacity;

        return match ($this->overlayColor) {
            'black' => "bg-gradient-{$direction} from-black/{$opacity} to-transparent",
            'white' => "bg-gradient-{$direction} from-white/{$opacity} to-transparent",
            'brand' => "bg-gradient-{$direction} from-blue-600/{$opacity} to-transparent",
            'success' => "bg-gradient-{$direction} from-emerald-600/{$opacity} to-transparent",
            'warning' => "bg-gradient-{$direction} from-amber-500/{$opacity} to-transparent",
            'danger' => "bg-gradient-{$direction} from-red-600/{$opacity} to-transparent",
            'neutral' => "bg-gradient-{$direction} from-gray-600/{$opacity} to-transparent",
            default => "bg-gradient-{$direction} from-black/{$opacity} to-transparent"
        };
    }

    protected function getSolidOverlayClass(): string
    {
        $opacity = $this->overlayOpacity;

        return match ($this->overlayColor) {
            'black' => "bg-black/{$opacity}",
            'white' => "bg-white/{$opacity}",
            'brand' => "bg-brand/{$opacity}",
            'success' => "bg-success/{$opacity}",
            'warning' => "bg-warning/{$opacity}",
            'danger' => "bg-danger/{$opacity}",
            'neutral' => "bg-neutral/{$opacity}",
            default => "bg-black/{$opacity}"
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