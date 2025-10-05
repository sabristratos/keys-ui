<?php

namespace Keys\UI\Components\Dropdown;

use Illuminate\View\Component;

class Menu extends Component
{
    public function __construct(
        public ?string $id = null,
        public string $role = 'menu',
        public ?string $ariaLabel = null,
        public ?string $ariaLabelledBy = null
    ) {
        $this->id = $this->id ?? 'dropdown-menu-' . uniqid();

        if (!in_array($this->role, ['menu', 'listbox', 'group'])) {
            $this->role = 'menu';
        }
    }

    public function getAriaAttributes(): array
    {
        $attributes = [
            'role' => $this->role,
            'tabindex' => '-1'
        ];

        if ($this->ariaLabel) {
            $attributes['aria-label'] = $this->ariaLabel;
        }

        if ($this->ariaLabelledBy) {
            $attributes['aria-labelledby'] = $this->ariaLabelledBy;
        }

        return $attributes;
    }

    public function getDataAttributes(): array
    {
        return [
            'data-keys-dropdown-menu' => 'true',
            'data-menu-id' => $this->id,
            'data-role' => $this->role
        ];
    }

    public function render()
    {
        return view('keys::components.dropdown.menu', [
            'ariaAttributes' => $this->getAriaAttributes(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
