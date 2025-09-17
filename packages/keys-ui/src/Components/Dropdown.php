<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Dropdown extends Component
{
    public function __construct(
        public ?string $id = null,
        public string $position = 'bottom',
        public string $align = 'start',
        public int $offset = 8,
        public bool $disabled = false,
        public bool $modal = false,
        public string $size = 'md'
    ) {

        $this->id = $this->id ?? 'dropdown-' . uniqid();


        if (!in_array($this->position, ['top', 'bottom', 'left', 'right'])) {
            $this->position = 'bottom';
        }


        if (!in_array($this->align, ['start', 'center', 'end'])) {
            $this->align = 'start';
        }


        if (!in_array($this->size, ['sm', 'md', 'lg'])) {
            $this->size = 'md';
        }
    }

    public function dropdownClasses(): string
    {
        $base = 'relative inline-block';

        if ($this->disabled) {
            $base .= ' opacity-50 pointer-events-none';
        }

        return $base;
    }

    public function panelClasses(): string
    {
        $base = 'absolute z-50 min-w-48 bg-surface border border-border rounded-lg shadow-lg hidden';

        $sizeClasses = match ($this->size) {
            'sm' => 'min-w-40 p-1',
            'md' => 'min-w-48 p-2',
            'lg' => 'min-w-56 p-2',
            default => 'min-w-48 p-2'
        };

        $positionClasses = match ($this->position) {
            'top' => 'bottom-full mb-' . ($this->offset / 4),
            'bottom' => 'top-full mt-' . ($this->offset / 4),
            'left' => 'right-full mr-' . ($this->offset / 4),
            'right' => 'left-full ml-' . ($this->offset / 4),
            default => 'top-full mt-2'
        };

        $alignClasses = match ($this->align) {
            'start' => match ($this->position) {
                'left', 'right' => 'top-0',
                default => 'left-0'
            },
            'center' => match ($this->position) {
                'left', 'right' => 'top-1/2 -translate-y-1/2',
                default => 'left-1/2 -translate-x-1/2'
            },
            'end' => match ($this->position) {
                'left', 'right' => 'bottom-0',
                default => 'right-0'
            },
            default => 'left-0'
        };

        return trim($base . ' ' . $sizeClasses . ' ' . $positionClasses . ' ' . $alignClasses);
    }

    public function getDataAttributes(): array
    {
        return [
            'data-dropdown' => 'true',
            'data-dropdown-id' => $this->id,
            'data-position' => $this->position,
            'data-align' => $this->align,
            'data-offset' => $this->offset,
            'data-disabled' => $this->disabled ? 'true' : 'false',
            'data-modal' => $this->modal ? 'true' : 'false'
        ];
    }

    public function triggerClasses(): string
    {
        return 'cursor-pointer';
    }

    public function isDisabled(): bool
    {
        return $this->disabled;
    }

    public function render()
    {
        return view('keys::components.dropdown', [
            'computedDropdownClasses' => $this->dropdownClasses(),
            'computedPanelClasses' => $this->panelClasses(),
            'computedTriggerClasses' => $this->triggerClasses(),
            'computedDataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
