<?php

namespace Keys\UI\Components\Table;

use Illuminate\View\Component;

class Cell extends Component
{
    public function __construct(
        public string $align = 'start',
        public string $variant = 'default',
        public string $size = 'md',
        public bool $wrap = true,
        public bool $truncate = false
    ) {}

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-table-cell' => 'true',
            'data-align' => $this->align,
            'data-variant' => $this->variant,
            'data-size' => $this->size,
        ];

        if ($this->wrap) {
            $attributes['data-wrap'] = 'true';
        }

        if ($this->truncate) {
            $attributes['data-truncate'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.table.cell', [
            'size' => $this->size,
            'align' => $this->align,
            'variant' => $this->variant,
            'wrap' => $this->wrap,
            'truncate' => $this->truncate,
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
