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

        if (! in_array($this->placement, ComponentConstants::POPOVER_PLACEMENTS)) {
            $this->placement = 'top';
        }

        if (! in_array($this->color, ['dark', 'light'])) {
            $this->color = 'dark';
        }

        if (! in_array($this->size, ComponentConstants::TOOLTIP_SIZES)) {
            $this->size = 'md';
        }
    }

    /**
     * Check if tooltip has direct content set.
     */
    public function hasContent(): bool
    {
        return ! empty($this->content);
    }

    /**
     * Get base tooltip classes using Tailwind utilities.
     */
    public function getTooltipClasses(): string
    {
        $baseClasses = 'rounded-md font-medium pointer-events-none shadow-lg';

        $sizeClasses = match ($this->size) {
            'sm' => 'px-2 py-1 text-xs',
            'md' => 'px-3 py-2 text-sm',
            'lg' => 'px-4 py-3 text-base',
            default => 'px-3 py-2 text-sm'
        };

        $colorClasses = match ($this->color) {
            'dark' => 'bg-neutral-900 text-white border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600',
            'light' => 'bg-surface text-foreground border border-border',
            default => 'bg-neutral-900 text-white border border-neutral-700 dark:bg-neutral-800 dark:border-neutral-600'
        };

        return "{$baseClasses} {$sizeClasses} {$colorClasses}";
    }

    /**
     * Get anchor name for CSS positioning.
     */
    public function getAnchorName(): string
    {
        return "--tooltip-{$this->id}";
    }

    /**
     * Render the tooltip component.
     */
    public function render()
    {
        return view('keys::components.tooltip', [
            'tooltipClasses' => $this->getTooltipClasses(),
            'anchorName' => $this->getAnchorName(),
        ]);
    }
}
