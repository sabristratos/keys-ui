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
    ) {
    }

    public function getHeaderClasses(): string
    {
        $base = 'font-medium text-muted tracking-wider uppercase text-xs';
        $padding = $this->getPaddingClasses();
        $alignment = $this->getAlignmentClasses();
        $interaction = $this->getInteractionClasses();
        $text = $this->getTextClasses();

        return trim($base . ' ' . $padding . ' ' . $alignment . ' ' . $interaction . ' ' . $text);
    }

    protected function getPaddingClasses(): string
    {
        return match ($this->size) {
            'sm' => 'px-3 py-2',
            'md' => 'px-6 py-3',
            'lg' => 'px-8 py-4',
            default => 'px-6 py-3'
        };
    }

    protected function getAlignmentClasses(): string
    {
        return match ($this->align) {
            'start' => 'text-left',
            'center' => 'text-center',
            'end' => 'text-right',
            default => 'text-left'
        };
    }

    protected function getInteractionClasses(): string
    {
        if ($this->sortable) {
            return 'cursor-pointer hover:text-foreground select-none group transition-colors duration-150';
        }

        if ($this->selectAll) {
            return 'w-12'; // Fixed width for selection column
        }

        return '';
    }

    protected function getTextClasses(): string
    {
        if ($this->wrap) {
            return 'whitespace-normal';
        }

        return 'whitespace-nowrap';
    }

    public function getSortIcon(): ?string
    {
        if (!$this->sortable) {
            return null;
        }

        if (!$this->sorted) {
            return 'heroicon-o-chevron-up-down';
        }

        return $this->direction === 'asc'
            ? 'heroicon-o-chevron-up'
            : 'heroicon-o-chevron-down';
    }

    public function getSortIconClasses(): string
    {
        $base = 'inline-flex ml-1 transition-opacity duration-150';

        if (!$this->sorted) {
            return $base . ' opacity-0 group-hover:opacity-100';
        }

        return $base . ' opacity-100';
    }

    public function getNextDirection(): string
    {
        if (!$this->sorted) {
            return 'asc';
        }

        return $this->direction === 'asc' ? 'desc' : 'asc';
    }

    public function getComputedHeaderClasses(): string
    {
        return $this->getHeaderClasses();
    }

    public function getComputedSortIconClasses(): string
    {
        return $this->getSortIconClasses();
    }

    public function getSortDataAttributes(): array
    {
        $attributes = [];

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

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.table.header', [
            'computedHeaderClasses' => $this->getComputedHeaderClasses(),
            'computedSortIconClasses' => $this->getComputedSortIconClasses(),
            'sortDataAttributes' => $this->getSortDataAttributes(),
        ]);
    }
}