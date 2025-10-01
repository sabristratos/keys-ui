<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

/**
 * Progress Component
 *
 * Displays progress indicators with comprehensive features following modern CLAUDE.md patterns.
 *
 * Features:
 * - Multiple size variants (xs, sm, md, lg, xl)
 * - Color variants (brand, success, warning, danger, info, neutral)
 * - Animated and striped variants
 * - Value display options (percentage, raw values)
 * - Status text support
 * - Auto-generated IDs for accessibility
 * - Comprehensive data attributes
 * - Direct Tailwind utilities in template
 */
class Progress extends Component
{
    /**
     * Create a new Progress component instance.
     *
     * @param  int|float  $value  Current progress value
     * @param  int|float  $max  Maximum progress value
     * @param  string|null  $label  Label text for the progress bar
     * @param  bool  $showValue  Whether to show value/max display
     * @param  bool  $showPercentage  Whether to show percentage display
     * @param  string  $size  Size variant (xs, sm, md, lg, xl)
     * @param  string  $color  Color variant
     * @param  string  $variant  Style variant
     * @param  bool  $animated  Whether to show animated stripes
     * @param  bool  $striped  Whether to show static stripes
     * @param  string|null  $status  Status text below progress bar
     * @param  string|null  $id  Custom ID for the progress element
     */
    public function __construct(
        public int|float $value = 0,
        public int|float $max = 100,
        public ?string $label = null,
        public bool $showValue = true,
        public bool $showPercentage = true,
        public string $size = 'md',
        public string $color = 'brand',
        public string $variant = 'default',
        public bool $animated = false,
        public bool $striped = false,
        public ?string $status = null,
        public ?string $id = null
    ) {
        
        $this->id = $this->id ?? 'progress-' . uniqid();

        
        $this->value = max(0, min($this->value, $this->max));

        
        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->size = 'md';
        }

        
        if (!in_array($this->color, ['brand', 'success', 'warning', 'danger', 'info', 'neutral'])) {
            $this->color = 'brand';
        }
    }

    /**
     * Calculate percentage value.
     *
     * @return float Percentage value rounded to 1 decimal place
     */
    public function getPercentage(): float
    {
        if ($this->max === 0) {
            return 0;
        }
        return round(($this->value / $this->max) * 100, 1);
    }

    /**
     * Get display value based on settings.
     *
     * @return string Formatted display value
     */
    public function getDisplayValue(): string
    {
        if ($this->showPercentage) {
            return $this->getPercentage() . '%';
        }

        if ($this->showValue) {
            return $this->value . '/' . $this->max;
        }

        return '';
    }

    /**
     * Generate ARIA label for accessibility.
     *
     * @return string Formatted ARIA label
     */
    public function getAriaLabel(): string
    {
        $percentage = $this->getPercentage();
        $baseLabel = $this->label ?: 'Progress';

        return $baseLabel . ': ' . $percentage . '% complete';
    }

    /**
     * Check if progress is complete.
     *
     * @return bool True if progress is at 100%
     */
    public function isComplete(): bool
    {
        return $this->value >= $this->max;
    }

    /**
     * Generate comprehensive data attributes for progress functionality.
     *
     * @return array Complete set of data attributes for progress element
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-progress' => 'true',
            'data-variant' => $this->variant,
            'data-size' => $this->size,
            'data-color' => $this->color,
            'data-value' => (string) $this->value,
            'data-max' => (string) $this->max,
            'data-percent' => (string) $this->getPercentage(),
        ];

        if ($this->striped) {
            $attributes['data-striped'] = 'true';
        }

        if ($this->animated) {
            $attributes['data-animated'] = 'true';
        }

        if ($this->showValue) {
            $attributes['data-show-value'] = 'true';
        }

        if ($this->showPercentage) {
            $attributes['data-show-percentage'] = 'true';
        }

        if ($this->status) {
            $attributes['data-status'] = $this->status;
        }

        if ($this->isComplete()) {
            $attributes['data-complete'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the progress component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.progress', [
            'percentage' => $this->getPercentage(),
            'displayValue' => $this->getDisplayValue(),
            'ariaLabel' => $this->getAriaLabel(),
            'isComplete' => $this->isComplete(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}