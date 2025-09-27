<?php

namespace Keys\UI\Components\Avatar;

use Illuminate\View\Component;

/**
 * Avatar Stack Component
 *
 * Displays multiple avatars in an overlapping stack layout with flexible
 * positioning and size inheritance. Provides professional user group
 * visualization with customizable spacing and direction.
 *
 * Features:
 * - Overlapping avatar layout with configurable spacing
 * - Size inheritance passed to child avatars
 * - Multiple spacing options (tight, default, loose)
 * - Direction control (left-to-right, right-to-left)
 * - Slot-based content for maximum flexibility
 * - Validation for maximum avatar count (1-10)
 * - Comprehensive data attributes for styling and JavaScript
 */
class Stack extends Component
{
    /**
     * Create a new Avatar Stack component instance.
     *
     * @param  int  $max  Maximum number of avatars to display (1-10)
     * @param  string  $size  Size variant passed to child avatars
     * @param  string  $spacing  Overlap spacing between avatars (tight, default, loose)
     * @param  string  $direction  Stacking direction (ltr, rtl)
     */
    public function __construct(
        public int $max = 5,
        public string $size = 'md',
        public string $spacing = 'default',
        public string $direction = 'ltr'
    ) {
        if ($this->max < 1) {
            $this->max = 1;
        } elseif ($this->max > 10) {
            $this->max = 10;
        }

        if (! in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->size = 'md';
        }

        if (! in_array($this->spacing, ['tight', 'default', 'loose'])) {
            $this->spacing = 'default';
        }

        if (! in_array($this->direction, ['ltr', 'rtl'])) {
            $this->direction = 'ltr';
        }
    }

    /**
     * Generate comprehensive data attributes for avatar stack functionality.
     *
     * Provides data attributes for JavaScript initialization, layout styling,
     * and visual configuration management.
     *
     * @return array Complete set of data attributes for avatar stack element
     */
    public function getDataAttributes(): array
    {
        return [
            'data-keys-avatar-stack' => 'true',
            'data-size' => $this->size,
            'data-spacing' => $this->spacing,
            'data-direction' => $this->direction,
            'data-max' => (string) $this->max,
        ];
    }

    /**
     * Render the avatar stack component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.avatar.stack', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
