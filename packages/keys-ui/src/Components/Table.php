<?php

namespace Keys\UI\Components;

use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\View\Component;

class Table extends Component
{
    public function __construct(
        public bool $striped = false,
        public bool $hover = false,
        public string $size = 'md',
        public ?Paginator $paginate = null,
        public bool $bordered = false,
        public bool $responsive = true,
        public bool $selectable = false,
        public string $selectionName = 'selected[]',
        public array $selectedIds = [],
        public ?string $livewireSelectionMethod = null,
        public bool $loading = false,
        public string $loadingText = 'Loading...',
        public string $loadingAnimation = 'spinner'
    ) {
    }

    public function getTableClasses(): string
    {
        $base = 'min-w-full divide-y divide-border';
        $size = $this->getSizeClasses();
        $variants = $this->getVariantClasses();

        return trim($base . ' ' . $size . ' ' . $variants);
    }

    public function getContainerClasses(): string
    {
        $base = '';

        if ($this->responsive) {
            $base .= 'overflow-x-auto ';
        }

        if ($this->bordered) {
            $base .= 'border border-border rounded-md overflow-hidden ';
        }

        return trim($base);
    }

    protected function getSizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'text-sm',
            'md' => 'text-sm',
            'lg' => 'text-base',
            default => 'text-sm'
        };
    }

    protected function getVariantClasses(): string
    {
        $classes = '';

        if ($this->striped) {
            $classes .= '[&_tbody_tr:nth-child(odd)]:bg-body ';
        }

        if ($this->hover) {
            $classes .= '[&_tbody_tr]:hover:bg-body ';
        }

        return trim($classes);
    }

    public function hasPagination(): bool
    {
        return !is_null($this->paginate);
    }

    public function getPaginationInfo(): ?string
    {
        if (!$this->hasPagination()) {
            return null;
        }

        $from = $this->paginate->firstItem();
        $to = $this->paginate->lastItem();
        $total = $this->paginate->total();

        if ($total === 0) {
            return 'No results found';
        }

        return "Showing {$from} to {$to} of {$total} results";
    }

    public function getComputedTableClasses(): string
    {
        return $this->getTableClasses();
    }

    public function getComputedContainerClasses(): string
    {
        return $this->getContainerClasses();
    }

    public function isRowSelected(string $rowId): bool
    {
        return in_array($rowId, $this->selectedIds);
    }

    public function getSelectionDataAttributes(): array
    {
        $attributes = [];

        if ($this->selectable) {
            $attributes['data-table'] = 'true';
            $attributes['data-selectable'] = 'true';

            if ($this->livewireSelectionMethod) {
                $attributes['data-selection-method'] = $this->livewireSelectionMethod;
            }
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.table', [
            'computedTableClasses' => $this->getComputedTableClasses(),
            'computedContainerClasses' => $this->getComputedContainerClasses(),
            'selectionDataAttributes' => $this->getSelectionDataAttributes(),
        ]);
    }
}