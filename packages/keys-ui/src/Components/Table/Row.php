<?php

namespace Keys\UI\Components\Table;

use Illuminate\View\Component;

class Row extends Component
{
    public function __construct(
        public bool $selected = false,
        public bool $clickable = false,
        public string $variant = 'default',
        public ?string $href = null,
        public ?string $rowId = null,
        public bool $selectable = false,
        public string $selectionName = 'selected[]'
    ) {}

    public function isClickable(): bool
    {
        return $this->clickable || ! is_null($this->href);
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-table-row' => 'true',
            'data-variant' => $this->variant,
        ];

        if ($this->selected) {
            $attributes['data-selected'] = 'true';
        }

        if ($this->clickable) {
            $attributes['data-clickable'] = 'true';
        }

        if ($this->href) {
            $attributes['data-href'] = $this->href;
        }

        if ($this->selectable && $this->rowId) {
            $attributes['data-selectable'] = 'true';
            $attributes['data-row-id'] = $this->rowId;
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.table.row', [
            'selected' => $this->selected,
            'clickable' => $this->clickable,
            'variant' => $this->variant,
            'href' => $this->href,
            'rowId' => $this->rowId,
            'selectable' => $this->selectable,
            'selectionName' => $this->selectionName,
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
