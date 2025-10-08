<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

/**
 * Generic Group Component
 *
 * A flexible grouping component that visually combines multiple form elements
 * and interactive components with shared borders and consistent styling.
 * Works seamlessly with buttons, inputs, selects, textareas, and any other
 * Keys UI components.
 *
 * Features:
 * - Visual attachment with shared borders and collapsed spacing
 * - Support for both horizontal and vertical orientations
 * - Optional size inheritance passed to child components
 * - Flexible gap spacing for detached mode
 * - Automatic border radius management (first/last children)
 * - Smart z-index stacking on hover and focus states
 * - Works with any combination of components
 *
 * Common Use Cases:
 * - Search inputs with submit buttons
 * - Filter dropdowns with apply buttons
 * - Compound date/time inputs
 * - Segmented controls and toolbars
 * - Pagination controls
 *
 * @package Keys\UI\Components
 */
class Group extends Component
{
    /**
     * Create a new Group component instance.
     *
     * @param  string  $orientation  Layout direction (horizontal, vertical)
     * @param  bool  $attached  Whether children share borders (attached) or have spacing (detached)
     * @param  string|null  $size  Size variant propagated to child components (xs, sm, md, lg, xl)
     * @param  string  $gap  Gap spacing for detached mode (xs, sm, md, lg, xl)
     */
    public function __construct(
        public string $orientation = 'horizontal',
        public bool $attached = true,
        public ?string $size = null,
        public string $gap = 'md'
    ) {
        // Validate orientation
        if (!in_array($this->orientation, ['horizontal', 'vertical'])) {
            $this->orientation = 'horizontal';
        }

        // Validate size if provided
        if ($this->size && !in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->size = null;
        }

        // Validate gap
        if (!in_array($this->gap, ['xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->gap = 'md';
        }
    }

    /**
     * Get comprehensive data attributes for component targeting and JavaScript integration.
     *
     * @return array Complete set of data attributes
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-group' => 'true',
            'data-orientation' => $this->orientation,
            'data-attached' => $this->attached ? 'true' : 'false',
            'data-gap' => $this->gap,
        ];

        if ($this->size) {
            $attributes['data-size'] = $this->size;
        }

        return $attributes;
    }

    /**
     * Render the group component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.group', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
