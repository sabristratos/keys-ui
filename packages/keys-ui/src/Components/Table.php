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
    ) {}

    public function hasPagination(): bool
    {
        return ! is_null($this->paginate);
    }

    public function getPaginationInfo(): ?string
    {
        if (! $this->hasPagination()) {
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

    public function isRowSelected(string $rowId): bool
    {
        return in_array($rowId, $this->selectedIds);
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-table' => 'true',
            'data-size' => $this->size,
        ];

        if ($this->selectable) {
            $attributes['data-selectable'] = 'true';
            $attributes['data-selection-name'] = $this->selectionName;

            if ($this->livewireSelectionMethod) {
                $attributes['data-selection-method'] = $this->livewireSelectionMethod;
            }
        }

        if ($this->striped) {
            $attributes['data-striped'] = 'true';
        }

        if ($this->hover) {
            $attributes['data-hover'] = 'true';
        }

        if ($this->bordered) {
            $attributes['data-bordered'] = 'true';
        }

        if ($this->responsive) {
            $attributes['data-responsive'] = 'true';
        }

        if ($this->loading) {
            $attributes['data-loading'] = 'true';
        }

        if ($this->hasPagination()) {
            $attributes['data-has-pagination'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.table', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
