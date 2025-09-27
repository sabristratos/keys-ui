<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Tooltip Component
 *
 * Provides contextual information through floating tooltips with positioning,
 * theming, and trigger customization. Features intelligent positioning,
 * customizable appearance, and comprehensive accessibility support.
 *
 * Features:
 * - Multiple placement options (top, bottom, left, right with variants)
 * - Dark and light color themes
 * - Configurable size variants (sm, md, lg)
 * - Multiple trigger types (hover, click, focus)
 * - Customizable delay and arrow display
 * - Auto-generated unique IDs for accessibility
 * - Comprehensive data attributes for JavaScript integration
 * - Disable functionality for conditional display
 */
class Tooltip extends Component
{
    /**
     * Create a new Tooltip component instance.
     *
     * @param  string  $placement  Tooltip placement position relative to trigger element
     * @param  string  $color  Color theme for tooltip appearance (dark, light)
     * @param  string  $size  Size variant affecting tooltip dimensions and typography
     * @param  bool  $arrow  Whether to display positioning arrow pointing to trigger
     * @param  string  $trigger  Interaction type that shows the tooltip
     * @param  int  $delay  Delay in milliseconds before tooltip appears
     * @param  string|null  $id  Unique identifier for tooltip element
     * @param  bool  $disabled  Whether tooltip functionality is disabled
     * @param  string|null  $content  Tooltip text content for direct content mode
     */
    public function __construct(
        public string $placement = 'top',
        public string $color = 'dark',
        public string $size = 'md',
        public bool $arrow = true,
        public string $trigger = 'hover',
        public int $delay = 100,
        public ?string $id = null,
        public bool $disabled = false,
        public ?string $content = null
    ) {
        $this->id = $this->id ?? 'tooltip-'.uniqid();

        if (! in_array($this->placement, ComponentConstants::POPOVER_PLACEMENTS)) {
            $this->placement = 'top';
        }

        if (! in_array($this->color, ['dark', 'light'])) {
            $this->color = 'dark';
        }

        if (! in_array($this->size, ComponentConstants::TOOLTIP_SIZES)) {
            $this->size = 'md';
        }

        if (! in_array($this->trigger, ComponentConstants::TOOLTIP_TRIGGERS)) {
            $this->trigger = 'hover';
        }
    }

    /**
     * Check if tooltip has direct content set.
     *
     * @return bool True if content property contains text
     */
    public function hasContent(): bool
    {
        return ! empty($this->content);
    }

    /**
     * Generate comprehensive data attributes for tooltip functionality.
     *
     * Provides all necessary data attributes for JavaScript tooltip initialization,
     * positioning, theming, and interaction handling.
     *
     * @return array Complete set of data attributes for tooltip element
     */
    public function getTooltipDataAttributes(): array
    {
        $attributes = [
            'data-tooltip' => $this->hasContent() ? $this->content : 'true',
            'data-tooltip-placement' => $this->placement,
            'data-tooltip-trigger' => $this->trigger,
            'data-tooltip-delay' => (string) $this->delay,
            'data-tooltip-color' => $this->color,
            'data-tooltip-size' => $this->size,
            'data-tooltip-id' => $this->id,
            'data-keys-tooltip' => 'true',
        ];

        if ($this->arrow) {
            $attributes['data-tooltip-arrow'] = 'true';
        }

        if ($this->disabled) {
            $attributes['data-tooltip-disabled'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the tooltip component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.tooltip', [
            'tooltipDataAttributes' => $this->getTooltipDataAttributes(),
        ]);
    }
}
