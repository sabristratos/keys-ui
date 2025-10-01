<?php

namespace Keys\UI\Components\Steps;

use Illuminate\View\Component;

/**
 * Step Component
 *
 * Individual step item for use within Steps component.
 * Auto-calculates status based on parent Steps component context.
 *
 * Features:
 * - Auto-indexed within parent Steps
 * - Status calculation (pending, current, complete)
 * - Optional icon and description support
 * - Clickable state support
 * - Comprehensive data attributes
 */
class Step extends Component
{
    /**
     * Create a new Step component instance.
     *
     * @param  string  $title  Step title
     * @param  string|null  $description  Optional step description
     * @param  string|null  $icon  Optional icon name (for icon variant)
     * @param  int|null  $index  Step index (auto-calculated if not provided)
     * @param  string|null  $status  Step status (auto-calculated from parent if not provided)
     * @param  bool|null  $clickable  Whether the step is clickable (inherited from parent if not provided)
     */
    public function __construct(
        public string $title,
        public ?string $description = null,
        public ?string $icon = null,
        public ?int $index = null,
        public ?string $status = null,
        public ?bool $clickable = null
    ) {
        
        if ($this->status && !in_array($this->status, ['pending', 'current', 'complete'])) {
            $this->status = 'pending';
        }
    }

    /**
     * Determine if the step is complete.
     *
     * @return bool True if the step is completed
     */
    public function isComplete(): bool
    {
        return $this->status === 'complete';
    }

    /**
     * Determine if the step is current.
     *
     * @return bool True if the step is current
     */
    public function isCurrent(): bool
    {
        return $this->status === 'current';
    }

    /**
     * Determine if the step is pending.
     *
     * @return bool True if the step is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Generate comprehensive data attributes for the step item.
     *
     * @return array Complete set of data attributes
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-step' => 'true',
            'data-status' => $this->status ?? 'pending',
        ];

        if ($this->index !== null) {
            $attributes['data-step-index'] = (string) $this->index;
        }

        if ($this->clickable) {
            $attributes['data-clickable'] = 'true';
        }

        if ($this->icon) {
            $attributes['data-has-icon'] = 'true';
        }

        if ($this->description) {
            $attributes['data-has-description'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the step component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.steps.step', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
