<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

/**
 * Steps Component
 *
 * A multi-step progress indicator for wizards, forms, and sequential workflows.
 * Horizontal orientation is responsive by default (vertical on mobile, horizontal on desktop).
 *
 * Features:
 * - Two orientations: horizontal (responsive by default) and vertical (always vertical)
 * - Variant styles (numbered, icon, dots)
 * - Size variants (sm, md, lg)
 * - Clickable steps support
 * - Auto-calculated step states (pending, current, complete)
 * - Comprehensive data attributes
 * - Direct Tailwind utilities in template
 */
class Steps extends Component
{
    /**
     * Create a new Steps component instance.
     *
     * @param  int  $currentStep  Current active step (1-based index)
     * @param  string  $orientation  Layout orientation (horizontal=responsive, vertical=always vertical)
     * @param  string  $variant  Visual variant (numbered, icon, dots)
     * @param  string  $size  Size variant (sm, md, lg)
     * @param  bool  $clickable  Whether completed/available steps are clickable
     * @param  string|null  $id  Custom ID for the steps container
     */
    public function __construct(
        public int $currentStep = 1,
        public string $orientation = 'horizontal',
        public string $variant = 'numbered',
        public string $size = 'md',
        public bool $clickable = false,
        public ?string $id = null
    ) {
        
        $this->id = $this->id ?? 'steps-' . uniqid();

        
        $this->currentStep = max(1, $this->currentStep);

        
        if (!in_array($this->orientation, ['vertical', 'horizontal'])) {
            $this->orientation = 'horizontal';
        }

        
        if (!in_array($this->variant, ['numbered', 'icon', 'dots'])) {
            $this->variant = 'numbered';
        }

        
        if (!in_array($this->size, ['sm', 'md', 'lg'])) {
            $this->size = 'md';
        }
    }

    /**
     * Determine if a step is complete.
     *
     * @param  int  $stepIndex  Step index (1-based)
     * @return bool True if the step is completed
     */
    public function isStepComplete(int $stepIndex): bool
    {
        return $stepIndex < $this->currentStep;
    }

    /**
     * Determine if a step is current.
     *
     * @param  int  $stepIndex  Step index (1-based)
     * @return bool True if the step is current
     */
    public function isStepCurrent(int $stepIndex): bool
    {
        return $stepIndex === $this->currentStep;
    }

    /**
     * Determine if a step is pending.
     *
     * @param  int  $stepIndex  Step index (1-based)
     * @return bool True if the step is pending
     */
    public function isStepPending(int $stepIndex): bool
    {
        return $stepIndex > $this->currentStep;
    }

    /**
     * Get the status string for a step.
     *
     * @param  int  $stepIndex  Step index (1-based)
     * @return string Status string (complete, current, pending)
     */
    public function getStepStatus(int $stepIndex): string
    {
        if ($this->isStepComplete($stepIndex)) {
            return 'complete';
        }

        if ($this->isStepCurrent($stepIndex)) {
            return 'current';
        }

        return 'pending';
    }

    /**
     * Determine if a step should be clickable.
     *
     * @param  int  $stepIndex  Step index (1-based)
     * @return bool True if the step should be clickable
     */
    public function isStepClickable(int $stepIndex): bool
    {
        if (!$this->clickable) {
            return false;
        }

        
        return $stepIndex <= $this->currentStep;
    }

    /**
     * Generate comprehensive data attributes for the steps container.
     *
     * @return array Complete set of data attributes
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-steps' => 'true',
            'data-orientation' => $this->orientation,
            'data-variant' => $this->variant,
            'data-size' => $this->size,
            'data-current-step' => (string) $this->currentStep,
        ];

        if ($this->clickable) {
            $attributes['data-clickable'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the steps component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.steps', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
