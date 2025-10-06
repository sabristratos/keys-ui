<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

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

        
        $basePlacements = ['top', 'bottom', 'left', 'right'];
        if (!in_array($this->position, $basePlacements)) {
            $this->position = 'bottom';
        }

        if (!in_array($this->align, ['start', 'center', 'end'])) {
            $this->align = 'start';
        }

        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_SM_TO_LG, 'md');
    }

    public function getComputedPlacement(): string
    {
        
        return match ($this->position) {
            'top' => match ($this->align) {
                'start' => 'top-start',
                'end' => 'top-end',
                default => 'top'
            },
            'bottom' => match ($this->align) {
                'start' => 'bottom-start',
                'end' => 'bottom-end',
                default => 'bottom'
            },
            'left' => match ($this->align) {
                'start' => 'left-start',
                'end' => 'left-end',
                default => 'left'
            },
            'right' => match ($this->align) {
                'start' => 'right-start',
                'end' => 'right-end',
                default => 'right'
            },
            default => 'bottom-start'
        };
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
            'data-modal' => $this->modal ? 'true' : 'false',
        ];
    }

    public function isDisabled(): bool
    {
        return $this->disabled;
    }

    public function render()
    {
        return view('keys::components.dropdown', [
            'computedDataAttributes' => $this->getDataAttributes(),
            'computedPlacement' => $this->getComputedPlacement(),
        ]);
    }
}
