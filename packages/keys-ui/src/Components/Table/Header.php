<?php

namespace Keys\UI\Components\Table;

use Illuminate\View\Component;

class Header extends Component
{
    public function __construct(
        public string $align = 'start',
        public string $size = 'md',
        public bool $sortable = false,
        public bool $sorted = false,
        public string $direction = 'asc',
        public ?string $sortKey = null,
        public bool $wrap = false,
        public bool $selectAll = false
    ) {}

    public function getSortIcon(): ?string
    {
        if (! $this->sortable) {
            return null;
        }

        if (! $this->sorted) {
            return 'heroicon-o-chevron-up-down';
        }

        return $this->direction === 'asc'
            ? 'heroicon-o-chevron-up'
            : 'heroicon-o-chevron-down';
    }

    public function getNextDirection(): string
    {
        if (! $this->sorted) {
            return 'asc';
        }

        return $this->direction === 'asc' ? 'desc' : 'asc';
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-table-header' => 'true',
            'data-align' => $this->align,
            'data-size' => $this->size,
        ];

        if ($this->sortable) {
            $attributes['data-sortable'] = 'true';
            $attributes['data-sorted'] = $this->sorted ? 'true' : 'false';

            if ($this->sorted) {
                $attributes['data-direction'] = $this->direction;
            }

            if ($this->sortKey) {
                $attributes['data-sort-key'] = $this->sortKey;
            }
        }

        if ($this->wrap) {
            $attributes['data-wrap'] = 'true';
        }

        if ($this->selectAll) {
            $attributes['data-select-all'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.table.header', [
            'size' => $this->size,
            'align' => $this->align,
            'sortable' => $this->sortable,
            'sorted' => $this->sorted,
            'selectAll' => $this->selectAll,
            'wrap' => $this->wrap,
            'sortIcon' => $this->getSortIcon(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
