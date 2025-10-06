<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Label Component
 *
 * Provides form field labels with optional tooltip functionality, required/optional indicators,
 * and comprehensive accessibility support following modern CLAUDE.md patterns.
 *
 * Features:
 * - Tooltip support with info icon trigger
 * - Required/optional field indicators
 * - Size variants (sm, md, lg)
 * - Auto-generated IDs for accessibility
 * - Comprehensive data attributes
 * - Direct Tailwind utilities in template
 */
class Label extends Component
{

    /**
     * Create a new Label component instance.
     *
     * @param  string|null  $for  The ID of the associated form control
     * @param  string  $size  Size variant (sm, md, lg)
     * @param  bool  $required  Whether the field is required
     * @param  bool  $optional  Whether to show optional indicator
     * @param  string|null  $tooltip  Tooltip content for info icon
     * @param  string  $tooltipPlacement  Tooltip placement position
     * @param  string  $tooltipColor  Tooltip color theme
     * @param  string|null  $id  Custom ID for the label element
     * @param  string|null  $icon  Icon name to display before label text
     * @param  string  $iconSize  Icon size variant (xs, sm, md, lg)
     */
    public function __construct(
        public ?string $for = null,
        public string $size = 'md',
        public bool $required = false,
        public bool $optional = false,
        public ?string $tooltip = null,
        public string $tooltipPlacement = 'top',
        public string $tooltipColor = 'dark',
        public ?string $id = null,
        public ?string $icon = null,
        public string $iconSize = 'xs'
    ) {
        
        $this->id = $this->id ?? 'label-' . uniqid();

        
        if (!in_array($this->size, ['sm', 'md', 'lg'])) {
            $this->size = 'md';
        }



        $this->tooltipPlacement = ComponentConstants::validate($this->tooltipPlacement, ComponentConstants::PLACEMENTS, 'top');

        if (!in_array($this->tooltipColor, ['dark', 'light'])) {
            $this->tooltipColor = 'dark';
        }

        if (!in_array($this->iconSize, ['xs', 'sm', 'md', 'lg'])) {
            $this->iconSize = 'xs';
        }
    }

    /**
     * Check if label has tooltip content.
     *
     * @return bool True if tooltip content is provided
     */
    public function hasTooltip(): bool
    {
        return !empty($this->tooltip);
    }

    /**
     * Check if label has an icon.
     *
     * @return bool True if icon is provided
     */
    public function hasIcon(): bool
    {
        return !empty($this->icon);
    }

    /**
     * Generate comprehensive data attributes for label functionality.
     *
     * @return array Complete set of data attributes for label element
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-label' => 'true',
            'data-size' => $this->size,
        ];

        if ($this->for) {
            $attributes['data-for'] = $this->for;
        }

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        if ($this->optional) {
            $attributes['data-optional'] = 'true';
        }

        if ($this->hasTooltip()) {
            $attributes['data-has-tooltip'] = 'true';
        }

        if ($this->hasIcon()) {
            $attributes['data-has-icon'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the label component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.label', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}