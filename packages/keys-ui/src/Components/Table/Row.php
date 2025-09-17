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
    ) {
    }

    public function getRowClasses(): string
    {
        $base = 'transition-colors duration-150';
        $variant = $this->getVariantClasses();
        $interaction = $this->getInteractionClasses();

        return trim($base . ' ' . $variant . ' ' . $interaction);
    }

    protected function getVariantClasses(): string
    {
        if ($this->selected) {
            return 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800';
        }

        return match ($this->variant) {
            'danger' => 'bg-danger-50 dark:bg-danger-900/20',
            'warning' => 'bg-warning-50 dark:bg-warning-900/20',
            'success' => 'bg-success-50 dark:bg-success-900/20',
            default => ''
        };
    }

    protected function getInteractionClasses(): string
    {
        if ($this->clickable || $this->href) {
            return 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50';
        }

        return '';
    }

    public function isClickable(): bool
    {
        return $this->clickable || !is_null($this->href);
    }

    public function getComputedRowClasses(): string
    {
        return $this->getRowClasses();
    }

    public function getRowDataAttributes(): array
    {
        $attributes = [];

        if ($this->selectable && $this->rowId) {
            $attributes['data-table-row'] = 'true';
            $attributes['data-row-id'] = $this->rowId;
            $attributes['data-selected'] = $this->selected ? 'true' : 'false';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.table.row', [
            'computedRowClasses' => $this->getComputedRowClasses(),
            'rowDataAttributes' => $this->getRowDataAttributes(),
        ]);
    }
}