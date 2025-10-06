<?php

namespace Keys\UI\Components;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Avatar Component
 *
 * Displays user profile images with intelligent fallback handling and comprehensive
 * customization options. Features automatic initials generation, status indicators,
 * and flexible theming with full accessibility support.
 *
 * Features:
 * - Image display with lazy loading support
 * - Smart initials fallback generation from names
 * - Icon fallback for users without names
 * - Multiple size variants (xs, sm, md, lg, xl)
 * - Shape options (circle, square)
 * - Status indicators (online, offline, away, busy)
 * - Color theming for backgrounds and borders
 * - Optional border styling
 * - Auto-generated alt text for accessibility
 * - Comprehensive data attributes for JavaScript integration
 */
class Avatar extends Component
{

    /**
     * Create a new Avatar component instance.
     *
     * @param  string|null  $src  Image URL for avatar display
     * @param  string|null  $alt  Alternative text for accessibility (auto-generated if not provided)
     * @param  string|null  $name  User name for initials fallback and accessibility
     * @param  string  $size  Size variant affecting avatar dimensions
     * @param  string  $shape  Avatar shape (circle or square)
     * @param  string|null  $status  Status indicator (online, offline, away, busy)
     * @param  string  $color  Color theme for avatar background and styling
     * @param  bool  $border  Whether to display border around avatar
     * @param  bool  $lazy  Whether to enable lazy loading for images
     */
    public function __construct(
        public ?string $src = null,
        public ?string $alt = null,
        public ?string $name = null,
        public string $size = 'md',
        public string $shape = 'circle',
        public ?string $status = null,
        public string $color = 'neutral',
        public bool $border = false,
        public bool $lazy = true
    ) {
        if (! $this->alt && $this->name) {
            $this->alt = "Avatar for {$this->name}";
        }

        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_XS_TO_XL, 'md');
        $this->shape = ComponentConstants::validate($this->shape, ComponentConstants::AVATAR_SHAPES, 'circle');
        $this->color = ComponentConstants::validate($this->color, ComponentConstants::COLORS_EXTENDED, 'neutral');

        if ($this->status) {
            $this->status = ComponentConstants::validate($this->status, ComponentConstants::AVATAR_STATUS, '');
            if ($this->status === '') {
                $this->status = null;
            }
        }
    }

    /**
     * Check if avatar has an image source.
     *
     * @return bool True if src property contains a URL
     */
    public function hasImage(): bool
    {
        return ! empty($this->src);
    }

    /**
     * Check if avatar has a name for initials generation.
     *
     * @return bool True if name property is set
     */
    public function hasName(): bool
    {
        return ! empty($this->name);
    }

    /**
     * Check if avatar should display initials.
     *
     * @return bool True if name exists and no image is provided
     */
    public function hasInitials(): bool
    {
        return ! empty($this->name) && ! $this->hasImage();
    }

    /**
     * Check if initials fallback should be available.
     *
     * @return bool True if name is available for fallback display
     */
    public function shouldShowInitialsFallback(): bool
    {
        return ! empty($this->name);
    }

    /**
     * Generate initials from the user's name.
     *
     * Creates 1-2 character initials from the name:
     * - Two words or more: first letter of first and second words
     * - Single word: first two characters
     *
     * @return string Generated initials in uppercase
     */
    public function getInitials(): string
    {
        if (! $this->name) {
            return '';
        }

        $words = explode(' ', trim($this->name));

        if (count($words) >= 2) {
            return strtoupper(substr($words[0], 0, 1).substr($words[1], 0, 1));
        }

        return strtoupper(substr($words[0], 0, 2));
    }

    /**
     * Generate comprehensive data attributes for avatar functionality.
     *
     * Provides data attributes for JavaScript initialization, fallback handling,
     * accessibility enhancements, and visual state management.
     *
     * @return array Complete set of data attributes for avatar element
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-avatar' => 'true',
            'data-size' => $this->size,
            'data-shape' => $this->shape,
        ];

        if ($this->status) {
            $attributes['data-status'] = $this->status;
        }

        if ($this->border) {
            $attributes['data-border'] = 'true';
        }

        if ($this->src) {
            $attributes['data-has-image'] = 'true';
            $attributes['data-avatar-image-active'] = 'true';
            $attributes['data-fallback-type'] = $this->shouldShowInitialsFallback() ? 'initials' : 'icon';
        } else {
            $attributes['data-fallback-type'] = $this->name ? 'initials' : 'icon';
            $attributes['data-avatar-fallback-active'] = 'true';
        }

        if ($this->color) {
            $attributes['data-color'] = $this->color;
        }

        if ($this->name) {
            $attributes['data-avatar-name'] = $this->name;
        }

        if ($this->lazy && $this->src) {
            $attributes['data-avatar-lazy'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the avatar component.
     *
     * @return View
     */
    public function render()
    {
        return view('keys::components.avatar', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
