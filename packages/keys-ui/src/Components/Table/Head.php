<?php

namespace Keys\UI\Components\Table;

use Illuminate\View\Component;

class Head extends Component
{
    public function __construct(
        public string $variant = 'default'
    ) {}

    public function getDataAttributes(): array
    {
        return [
            'data-keys-table-head' => 'true',
            'data-variant' => $this->variant,
        ];
    }

    public function render()
    {
        return view('keys::components.table.head', [
            'variant' => $this->variant,
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
