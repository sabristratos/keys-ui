<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Kbd extends Component
{
    public string $keys;

    public string $variant;

    public string $size;

    public function __construct(
        string $keys,
        string $variant = 'default',
        string $size = 'sm'
    ) {
        $this->keys = $keys;

        if (! in_array($variant, ['default', 'muted'])) {
            $variant = 'default';
        }
        $this->variant = $variant;

        if (! in_array($size, ['xs', 'sm', 'md'])) {
            $size = 'sm';
        }
        $this->size = $size;
    }

    public function getDataAttributes(): array
    {
        return [
            'data-keys-kbd' => 'true',
            'data-variant' => $this->variant,
            'data-size' => $this->size,
        ];
    }

    public function render()
    {
        return view('keys::components.kbd', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
