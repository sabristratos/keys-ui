<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Popover extends Component
{

    public string $id;

    public string $variant;

    public string $size;

    public string $placement;

    public bool $arrow;

    public bool $manual;

    public function __construct(
        ?string $id = null,
        string $variant = 'default',
        string $size = 'md',
        string $placement = 'bottom',
        bool $arrow = false,
        bool $manual = false,
    ) {
        $this->id = $id ?? 'popover-'.uniqid();
        $this->variant = $variant;

        $this->size = ComponentConstants::validate($size, ComponentConstants::SIZES_EXTENDED, 'md');
        $this->placement = ComponentConstants::validate($placement, ComponentConstants::PLACEMENTS, 'bottom');

        $this->arrow = $arrow;
        $this->manual = $manual;
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-popover' => 'true',
            'data-variant' => $this->variant,
            'data-size' => $this->size,
            'data-placement' => $this->placement,
        ];

        if ($this->arrow) {
            $attributes['data-arrow'] = 'true';
        }

        if ($this->manual) {
            $attributes['data-manual'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.popover', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
