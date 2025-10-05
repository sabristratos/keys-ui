<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Popover extends Component
{
    private const VALID_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
    private const VALID_PLACEMENTS = [
        'top', 'top-start', 'top-end',
        'bottom', 'bottom-start', 'bottom-end',
        'left', 'left-start', 'left-end',
        'right', 'right-start', 'right-end'
    ];

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


        if (! in_array($size, self::VALID_SIZES)) {
            $size = 'md';
        }
        $this->size = $size;


        if (! in_array($placement, self::VALID_PLACEMENTS)) {
            $placement = 'bottom';
        }
        $this->placement = $placement;

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
