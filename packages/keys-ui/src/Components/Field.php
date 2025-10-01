<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

/**
 * Field Component
 *
 * Provides form field container with configurable spacing following modern CLAUDE.md patterns.
 *
 * Features:
 * - Configurable spacing variants
 * - Direct Tailwind utilities in template
 * - Comprehensive data attributes
 * - Auto-generated IDs for accessibility
 * - Business logic only in PHP class
 */
class Field extends Component
{
    /**
     * Create a new Field component instance.
     *
     * @param  string  $spacing  Spacing variant (none, sm, md, lg)
     * @param  string|null  $id  Custom ID for the field element
     */
    public function __construct(
        public string $spacing = 'md',
        public ?string $id = null
    ) {
        
        $this->id = $this->id ?? 'field-' . uniqid();

        
        if (!in_array($this->spacing, ['none', 'sm', 'md', 'lg'])) {
            $this->spacing = 'md';
        }
    }

    /**
     * Generate comprehensive data attributes for field functionality.
     *
     * @return array Complete set of data attributes for field element
     */
    public function getDataAttributes(): array
    {
        return [
            'data-keys-field' => 'true',
            'data-spacing' => $this->spacing,
        ];
    }

    /**
     * Render the field component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.field', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}