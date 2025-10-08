<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Tabs Component
 *
 * A simple, accessible tabs component with sliding indicator animation.
 * Supports both array-based and slot-based tab definitions.
 */
class Tabs extends Component
{
    /**
     * Create a new Tabs component instance.
     *
     * @param  string|null  $id  Unique identifier for the tabs container
     * @param  array  $items  Array of tab items (each with 'value', 'label', optional 'icon')
     * @param  string|null  $defaultValue  Initial active tab value
     * @param  string  $variant  Visual variant (default, pills, underline)
     * @param  string  $orientation  Tab orientation (horizontal, vertical)
     * @param  string  $size  Size variant (sm, md, lg)
     * @param  bool  $stretch  Whether tabs should stretch to fill container width
     * @param  bool  $disabled  Whether all tabs are disabled
     */
    public function __construct(
        public ?string $id = null,
        public array $items = [],
        public ?string $defaultValue = null,
        public string $variant = 'default',
        public string $orientation = 'horizontal',
        public string $size = 'md',
        public bool $stretch = false,
        public bool $disabled = false
    ) {
        // Auto-generate ID if not provided
        $this->id = $this->id ?? 'tabs-'.uniqid();

        // Validate variant
        if (! in_array($this->variant, ComponentConstants::TABS_VARIANTS)) {
            $this->variant = 'default';
        }

        // Validate orientation
        if (! in_array($this->orientation, ['horizontal', 'vertical'])) {
            $this->orientation = 'horizontal';
        }

        // Validate size
        if (! in_array($this->size, ComponentConstants::SIZES_SM_TO_LG)) {
            $this->size = 'md';
        }

        // Set default value to first item if not specified
        if ($this->defaultValue === null && ! empty($this->items)) {
            $this->defaultValue = $this->items[0]['value'] ?? null;
        }
    }

    /**
     * Get data attributes for the tabs container
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-tabs' => 'true',
            'data-orientation' => $this->orientation,
            'data-variant' => $this->variant,
            'data-size' => $this->size,
            'data-value' => $this->defaultValue ?? '',
            'id' => $this->id,
        ];

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->stretch) {
            $attributes['data-stretch'] = 'true';
        }

        return $attributes;
    }

    /**
     * Check if component is using array-based items
     */
    public function hasItems(): bool
    {
        return ! empty($this->items);
    }

    public function render()
    {
        return view('keys::components.tabs', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
