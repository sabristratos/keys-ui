<?php

namespace Keys\UI\Components\Dropdown;

use Illuminate\View\Component;

class Submenu extends Component
{
    public function __construct(
        public ?string $heading = null,
        public ?string $icon = null,
        public bool $keepOpen = true,
        public bool $disabled = false,
        public string $position = 'right',
        public string $align = 'start',
        public int $offset = 4,
        public ?string $id = null,
        public string $size = 'md',
    ) {
        $this->id = $this->id ?? 'submenu-'.uniqid();
    }

    public function getPlacement(): string
    {
        return match ($this->position) {
            'right' => match ($this->align) {
                'start' => 'right-start',
                'end' => 'right-end',
                default => 'right'
            },
            'left' => match ($this->align) {
                'start' => 'left-start',
                'end' => 'left-end',
                default => 'left'
            },
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
            default => 'right-start'
        };
    }

    public function getMobilePlacement(): string
    {
        return match ($this->align) {
            'end' => 'bottom-end',
            'center' => 'bottom',
            default => 'bottom-start'
        };
    }

    public function hasHeading(): bool
    {
        return ! empty($this->heading);
    }

    public function hasIcon(): bool
    {
        return ! empty($this->icon);
    }

    public function getDataAttributes(): array
    {
        return [
            'data-keys-dropdown-submenu' => 'true',
            'data-position' => $this->position,
            'data-align' => $this->align,
            'data-offset' => $this->offset,
            'data-size' => $this->size,
            'data-keep-open' => $this->keepOpen ? 'true' : 'false',
            'data-disabled' => $this->disabled ? 'true' : 'false',
            'data-has-heading' => $this->hasHeading() ? 'true' : 'false',
            'data-has-icon' => $this->hasIcon() ? 'true' : 'false',
        ];
    }

    public function getTriggerDataAttributes(): array
    {
        return [
            'data-submenu-trigger' => 'true',
            'role' => 'menuitem',
            'aria-haspopup' => 'true',
            'aria-expanded' => 'false',
            'tabindex' => $this->disabled ? '-1' : '0',
        ];
    }

    public function getPanelDataAttributes(): array
    {
        return [
            'data-submenu-panel' => 'true',
            'role' => 'menu',
            'aria-orientation' => 'vertical',
        ];
    }

    public function render()
    {
        return view('keys::components.dropdown.submenu', [
            'dataAttributes' => $this->getDataAttributes(),
            'triggerDataAttributes' => $this->getTriggerDataAttributes(),
            'panelDataAttributes' => $this->getPanelDataAttributes(),
            'placement' => $this->getPlacement(),
            'mobilePlacement' => $this->getMobilePlacement(),
        ]);
    }
}
