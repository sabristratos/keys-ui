<?php

namespace Keys\UI\Components\Badge;

use Illuminate\View\Component;

/**
 * Badge Group Component
 *
 * Manages collections of related badges with enhanced layout options, spacing
 * controls, and group-level functionality. Provides professional badge
 * organization with customizable spacing, orientation, and group actions.
 *
 * Features:
 * - Flexible spacing controls (tight, default, loose)
 * - Multiple layout orientations (horizontal, vertical, wrap)
 * - Size inheritance passed to child badges
 * - Group-level actions (clear all for dismissible badges)
 * - Maximum display limits with "+N more" functionality
 * - Alignment options for different layout needs
 * - Optional group labeling for semantic structure
 * - Comprehensive data attributes for styling and JavaScript
 */
class Group extends Component
{
    /**
     * Create a new Badge Group component instance.
     *
     * @param  string  $spacing  Spacing between badges (tight, default, loose)
     * @param  string  $orientation  Layout direction (horizontal, vertical)
     * @param  bool  $wrap  Allow badges to wrap to new lines
     * @param  string|null  $size  Size variant passed to child badges
     * @param  string  $align  Alignment within container (start, center, end, justify)
     * @param  int|null  $max  Maximum badges before "+N more" indicator
     * @param  bool  $clearable  Show "Clear All" action for dismissible groups
     * @param  string|null  $label  Optional group label for semantic structure
     */
    public function __construct(
        public string $spacing = 'default',
        public string $orientation = 'horizontal',
        public bool $wrap = true,
        public ?string $size = null,
        public string $align = 'start',
        public ?int $max = null,
        public bool $clearable = false,
        public ?string $label = null
    ) {
        // Validate spacing
        if (!in_array($this->spacing, ['tight', 'default', 'loose'])) {
            $this->spacing = 'default';
        }

        // Validate orientation
        if (!in_array($this->orientation, ['horizontal', 'vertical'])) {
            $this->orientation = 'horizontal';
        }

        // Validate size if provided
        if ($this->size && !in_array($this->size, ['xs', 'sm', 'md'])) {
            $this->size = null;
        }

        // Validate alignment
        if (!in_array($this->align, ['start', 'center', 'end', 'justify'])) {
            $this->align = 'start';
        }

        // Validate max badges
        if ($this->max !== null && $this->max < 1) {
            $this->max = 1;
        }
    }

    /**
     * Get responsive spacing classes based on badge size inheritance.
     *
     * Provides adaptive spacing that scales appropriately with badge sizes
     * to maintain visual consistency across different badge configurations.
     *
     * @return string CSS classes for badge spacing
     */
    public function getSpacingClasses(): string
    {
        return match ($this->spacing) {
            'tight' => match ($this->size ?? 'sm') {
                'xs' => 'gap-1',
                'sm' => 'gap-1.5',
                'md' => 'gap-2',
                default => 'gap-1.5'
            },
            'default' => match ($this->size ?? 'sm') {
                'xs' => 'gap-2',
                'sm' => 'gap-2.5',
                'md' => 'gap-3',
                default => 'gap-2.5'
            },
            'loose' => match ($this->size ?? 'sm') {
                'xs' => 'gap-3',
                'sm' => 'gap-4',
                'md' => 'gap-5',
                default => 'gap-4'
            },
            default => 'gap-2.5'
        };
    }

    /**
     * Get layout classes for badge group container.
     *
     * Combines orientation and wrapping behavior to create flexible
     * layout options for different badge group use cases.
     *
     * @return string CSS classes for layout configuration
     */
    public function getLayoutClasses(): string
    {
        return match ($this->orientation) {
            'horizontal' => $this->wrap ? 'flex flex-row flex-wrap' : 'flex flex-row',
            'vertical' => 'flex flex-col',
            default => 'flex flex-row flex-wrap'
        };
    }

    /**
     * Get alignment classes for badge positioning.
     *
     * Provides flexible alignment options for different design requirements
     * and layout contexts within the badge group container.
     *
     * @return string CSS classes for badge alignment
     */
    public function getAlignmentClasses(): string
    {
        return match ($this->align) {
            'start' => $this->orientation === 'vertical' ? 'items-start' : 'justify-start items-center',
            'center' => $this->orientation === 'vertical' ? 'items-center' : 'justify-center items-center',
            'end' => $this->orientation === 'vertical' ? 'items-end' : 'justify-end items-center',
            'justify' => $this->orientation === 'vertical' ? 'items-stretch' : 'justify-between items-center',
            default => 'justify-start items-center'
        };
    }

    /**
     * Check if the group should show additional actions.
     *
     * Determines whether group-level actions like "Clear All" should be
     * displayed based on the clearable configuration and badge type.
     *
     * @return bool True if group actions should be displayed
     */
    public function hasGroupActions(): bool
    {
        return $this->clearable;
    }

    /**
     * Generate comprehensive data attributes for badge group functionality.
     *
     * Provides data attributes for JavaScript initialization, layout styling,
     * size inheritance, and group action management.
     *
     * @return array Complete set of data attributes for badge group element
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-badge-group' => 'true',
            'data-spacing' => $this->spacing,
            'data-orientation' => $this->orientation,
            'data-wrap' => $this->wrap ? 'true' : 'false',
            'data-align' => $this->align,
        ];

        if ($this->size) {
            $attributes['data-size'] = $this->size;
        }

        if ($this->max !== null) {
            $attributes['data-max'] = (string) $this->max;
        }

        if ($this->clearable) {
            $attributes['data-clearable'] = 'true';
        }

        if ($this->label) {
            $attributes['data-has-label'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the badge group component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.badge.group', [
            'spacingClasses' => $this->getSpacingClasses(),
            'layoutClasses' => $this->getLayoutClasses(),
            'alignmentClasses' => $this->getAlignmentClasses(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}