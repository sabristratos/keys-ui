<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Menu extends Component
{
    public function __construct(
        public ?string $id = null,
        public string $role = 'menu',
        public ?string $ariaLabel = null,
        public ?string $ariaLabelledBy = null
    ) {

        $this->id = $this->id ?? 'menu-' . uniqid();


        if (!in_array($this->role, ['menu', 'listbox', 'group'])) {
            $this->role = 'menu';
        }
    }

    public function menuClasses(): string
    {
        return 'flex flex-col gap-0.5 outline-none';
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
            'data-menu' => 'true',
            'data-menu-id' => $this->id
        ];
    }

    public function render()
    {
        return view('keys::components.menu', [
            'computedMenuClasses' => $this->menuClasses(),
            'computedAriaAttributes' => $this->getAriaAttributes(),
            'computedDataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
