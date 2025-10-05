<?php

namespace Keys\UI\Components\Dropdown;

use Illuminate\View\Component;

class Separator extends Component
{
    public function __construct(
        public string $variant = 'default',
        public ?string $label = null
    ) {
        if (!in_array($this->variant, ['default', 'labeled'])) {
            $this->variant = 'default';
        }

        if ($this->label && $this->variant === 'default') {
            $this->variant = 'labeled';
        }
    }

    public function hasLabel(): bool
    {
        return !empty($this->label);
    }

    public function isLabeled(): bool
    {
        return $this->variant === 'labeled';
    }

    public function getDataAttributes(): array
    {
        return [
            'data-keys-dropdown-separator' => 'true',
            'data-variant' => $this->variant,
            'data-has-label' => $this->hasLabel() ? 'true' : 'false'
        ];
    }

    public function render()
    {
        return view('keys::components.dropdown.separator', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
