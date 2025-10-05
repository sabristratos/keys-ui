<?php

namespace Keys\UI\Components\Table;

use Illuminate\View\Component;

class Body extends Component
{
    public function __construct(
        public string $variant = 'default'
    ) {}

    public function getDataAttributes(): array
    {
        return [
            'data-keys-table-body' => 'true',
            'data-variant' => $this->variant,
        ];
    }

    public function render()
    {
        return view('keys::components.table.body', [
            'variant' => $this->variant,
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
