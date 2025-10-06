<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Loading Component
 *
 * Displays loading indicators with various animations following modern CLAUDE.md patterns.
 *
 * Features:
 * - Multiple animation types (spinner, dots, bars, pulse, wave, bounce)
 * - Size variants (xs, sm, md, lg, xl)
 * - Auto-generated IDs for accessibility
 * - Comprehensive data attributes
 * - Direct Tailwind utilities in template
 * - Business logic only in PHP class
 */
class Loading extends Component
{

    /**
     * Create a new Loading component instance.
     *
     * @param  string  $animation  Animation type
     * @param  string  $size  Size variant (xs, sm, md, lg, xl)
     * @param  string|null  $label  Accessibility label for screen readers
     * @param  string|null  $id  Custom ID for the loading element
     */
    public function __construct(
        public string $animation = 'spinner',
        public string $size = 'md',
        public ?string $label = null,
        public ?string $id = null
    ) {

        $this->id = $this->id ?? 'loading-' . uniqid();

        $this->animation = ComponentConstants::validate($this->animation, ComponentConstants::LOADING_ANIMATIONS, 'spinner');
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_XS_TO_XL, 'md');


        if (!$this->label) {
            $this->label = 'Loading...';
        }
    }

    /**
     * Generate comprehensive data attributes for loading functionality.
     *
     * @return array Complete set of data attributes for loading element
     */
    public function getDataAttributes(): array
    {
        return [
            'data-keys-loading' => 'true',
            'data-animation' => $this->animation,
            'data-size' => $this->size,
            'aria-label' => $this->label,
            'role' => 'status',
            'aria-live' => 'polite',
        ];
    }

    /**
     * Render the loading component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.loading', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}