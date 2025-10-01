<?php

namespace Keys\UI\Components\Sidebar;

use Illuminate\View\Component;

class Divider extends Component
{
    public function __construct(
        public ?string $label = null,
        public string $spacing = 'md',
    ) {
        if (!in_array($this->spacing, ['sm', 'md', 'lg'])) {
            $this->spacing = 'md';
        }
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-sidebar-divider' => 'true',
            'data-spacing' => $this->spacing,
        ];

        if (!empty($this->label)) {
            $attributes['data-has-label'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.sidebar.divider', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
