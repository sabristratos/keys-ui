<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Tooltip Component - Pure Popover API Implementation
 *
 * Provides contextual information through floating tooltips using the native
 * HTML Popover API with CSS anchor positioning. Zero JavaScript required.
 *
 * Features:
 * - Native browser positioning via CSS anchor positioning
 * - Multiple placement options (top, bottom, left, right with variants)
 * - Dark and light color themes
 * - Configurable size variants (sm, md, lg)
 * - Rich content support via template slot
 * - Full accessibility with ARIA attributes
 */
class Tooltip extends Component
{

    /**
     * Create a new Tooltip component instance.
     *
     * @param  string  $placement  Tooltip placement position relative to trigger element
     * @param  string  $color  Color theme for tooltip appearance (dark, light)
     * @param  string  $size  Size variant affecting tooltip dimensions and typography
     * @param  string|null  $id  Unique identifier for tooltip element
     * @param  string|null  $content  Tooltip text content for simple tooltips
     */
    public function __construct(
        public string $placement = 'top',
        public string $color = 'dark',
        public string $size = 'md',
        public ?string $id = null,
        public ?string $content = null
    ) {
        $this->id = $this->id ?? 'tooltip-'.uniqid();

        $this->placement = ComponentConstants::validate($this->placement, ComponentConstants::PLACEMENTS, 'top');
        $this->color = ComponentConstants::validate($this->color, ['dark', 'light'], 'dark');
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_SM_TO_LG, 'md');
    }

    /**
     * Check if tooltip has direct content set.
     */
    public function hasContent(): bool
    {
        return ! empty($this->content);
    }

    /**
     * Render the tooltip component.
     */
    public function render()
    {
        return view('keys::components.tooltip');
    }
}
