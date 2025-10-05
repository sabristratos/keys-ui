<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

/**
 * Image Component
 *
 * Displays images with intelligent fallback handling, overlay support, and comprehensive
 * customization options. Features automatic broken image detection with retry mechanisms
 * and seamless fallback to placeholder icons.
 *
 * Features:
 * - Image display with lazy loading support
 * - Smart fallback handling for broken/failed images
 * - Overlay support with gradients and solid colors
 * - Multiple aspect ratios and object fit options
 * - Caption and lightbox support
 * - Size variants and radius options
 * - Comprehensive data attributes for JavaScript integration
 * - Retry mechanism for temporary network failures
 */
class Image extends Component
{
    /**
     * Create a new Image component instance.
     *
     * @param  string  $src  Image URL for display
     * @param  string  $alt  Alternative text for accessibility
     * @param  string  $size  Size variant affecting image dimensions
     * @param  string  $aspectRatio  Aspect ratio for the image container
     * @param  string  $objectFit  How the image should fit within its container
     * @param  string  $radius  Border radius variant
     * @param  string|null  $caption  Optional caption text below image
     * @param  string|null  $overlay  Overlay type (gradient-top, gradient-bottom, solid, none)
     * @param  string  $overlayColor  Color for overlay background
     * @param  string  $overlayOpacity  Opacity level for overlay (10-90)
     * @param  bool  $lazy  Whether to enable lazy loading
     * @param  string|null  $placeholder  Background color while loading
     * @param  bool  $lightbox  Whether to enable lightbox functionality
     * @param  string  $fallbackIcon  Icon to show when image fails to load
     * @param  string|null  $fallbackText  Custom text for fallback accessibility
     * @param  int  $retryAttempts  Number of retry attempts for failed images
     */
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
        public bool $lightbox = false,
        public string $fallbackIcon = 'heroicon-o-photo',
        public ?string $fallbackText = null,
        public int $retryAttempts = 2
    ) {
        
        $this->imageId = 'image-' . uniqid();
        
        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl', 'full'])) {
            $this->size = 'full';
        }

        
        if (!in_array($this->aspectRatio, ['auto', 'square', 'video', 'photo', 'wide'])) {
            $this->aspectRatio = 'auto';
        }

        
        if (!in_array($this->objectFit, ['cover', 'contain', 'fill', 'scale-down', 'none'])) {
            $this->objectFit = 'cover';
        }

        
        if (!in_array($this->radius, ['none', 'sm', 'md', 'lg', 'xl', 'full'])) {
            $this->radius = 'none';
        }

        
        if ($this->overlay && !in_array($this->overlay, ['gradient-top', 'gradient-bottom', 'solid', 'none'])) {
            $this->overlay = null;
        }

        
        $validColors = ['black', 'white', 'brand', 'success', 'warning', 'danger', 'neutral'];
        if (!in_array($this->overlayColor, $validColors)) {
            $this->overlayColor = 'black';
        }

        
        if (!in_array($this->overlayOpacity, ['10', '20', '30', '40', '50', '60', '70', '80', '90'])) {
            $this->overlayOpacity = '50';
        }

        
        if ($this->retryAttempts < 0 || $this->retryAttempts > 5) {
            $this->retryAttempts = 2;
        }

        
        if (!$this->fallbackText) {
            $this->fallbackText = "Image placeholder for {$this->alt}";
        }
    }

    /**
     * Auto-generated unique ID for image element.
     */
    public string $imageId;

    /**
     * Check if image has a caption.
     *
     * @return bool True if caption text is provided
     */
    public function hasCaption(): bool
    {
        return !empty($this->caption);
    }

    /**
     * Check if image should display an overlay.
     *
     * @return bool True if overlay is configured and not 'none'
     */
    public function hasOverlay(): bool
    {
        return !empty($this->overlay) && $this->overlay !== 'none';
    }

    /**
     * Check if image has a valid source URL.
     *
     * @return bool True if src property contains a URL
     */
    public function hasImage(): bool
    {
        return !empty($this->src);
    }

    /**
     * Check if fallback should be shown immediately.
     *
     * @return bool True if no src provided (immediate fallback needed)
     */
    public function shouldShowFallback(): bool
    {
        return !$this->hasImage();
    }

    /**
     * Check if image size is considered small for fallback display.
     *
     * @return bool True for xs, sm, md sizes (should show icon-only fallback)
     */
    public function isSmallSize(): bool
    {
        return in_array($this->size, ['xs', 'sm', 'md']);
    }

    /**
     * Get appropriate icon size for the fallback based on container size.
     *
     * @return string Icon size variant
     */
    public function getFallbackIconSize(): string
    {
        return match ($this->size) {
            'xs' => 'xs',
            'sm' => 'sm',
            'md' => 'md',
            'lg' => 'lg',
            'xl' => 'xl',
            default => 'lg'
        };
    }

    /**
     * Generate comprehensive data attributes for image functionality.
     *
     * Provides data attributes for JavaScript initialization, fallback handling,
     * accessibility enhancements, and visual state management.
     *
     * @return array Complete set of data attributes for image element
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-image' => 'true',
            'data-size' => $this->size,
            'data-aspect-ratio' => $this->aspectRatio,
            'data-object-fit' => $this->objectFit,
            'data-radius' => $this->radius,
        ];

        if ($this->hasImage()) {
            $attributes['data-has-image'] = 'true';
            $attributes['data-image-active'] = 'true';
        } else {
            $attributes['data-has-fallback'] = 'true';
            $attributes['data-fallback-active'] = 'true';
        }

        if ($this->hasOverlay()) {
            $attributes['data-has-overlay'] = 'true';
            $attributes['data-overlay-type'] = $this->overlay;
            $attributes['data-overlay-color'] = $this->overlayColor;
            $attributes['data-overlay-opacity'] = $this->overlayOpacity;
        }

        if ($this->hasCaption()) {
            $attributes['data-has-caption'] = 'true';
        }

        if ($this->lightbox) {
            $attributes['data-lightbox'] = 'true';
            $attributes['data-lightbox-trigger'] = $this->imageId;
        }

        if ($this->lazy && $this->hasImage()) {
            $attributes['data-lazy'] = 'true';
        }

        if ($this->retryAttempts > 0) {
            $attributes['data-retry-attempts'] = (string) $this->retryAttempts;
        }

        $attributes['data-fallback-icon'] = $this->fallbackIcon;
        $attributes['data-fallback-text'] = $this->fallbackText;
        $attributes['data-is-small-size'] = $this->isSmallSize() ? 'true' : 'false';
        $attributes['data-fallback-mode'] = $this->isSmallSize() ? 'icon-only' : 'icon-text';

        return $attributes;
    }

    /**
     * Render the image component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.image', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}