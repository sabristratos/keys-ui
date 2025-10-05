<?php

namespace Keys\UI\Components\Table;

use Illuminate\View\Component;

class Loading extends Component
{
    public function __construct(
        public string $text = 'Loading...',
        public string $animation = 'spinner',
        public string $size = 'md',
        public int $colspan = 1
    ) {}

    public function getLoadingIconSize(): string
    {
        return match ($this->size) {
            'sm' => 'sm',
            'md' => 'md',
            'lg' => 'lg',
            default => 'md'
        };
    }

    public function getDataAttributes(): array
    {
        return [
            'data-keys-table-loading' => 'true',
            'data-animation' => $this->animation,
            'data-size' => $this->size,
            'data-colspan' => (string) $this->colspan,
        ];
    }

    public function render()
    {
        return view('keys::components.table.loading', [
            'size' => $this->size,
            'animation' => $this->animation,
            'text' => $this->text,
            'colspan' => $this->colspan,
            'loadingIconSize' => $this->getLoadingIconSize(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
