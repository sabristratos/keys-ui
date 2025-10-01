<?php

namespace Keys\UI\Components\Tabs;

use Illuminate\View\Component;

class Panel extends Component
{
    public function __construct(
        public string $value,
        public bool $preserveOffscreen = false,
        public ?string $className = null
    ) {
        
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-panel' => 'true',
            'data-tabs-panel' => 'true',
            'data-value' => $this->value,
            'role' => 'tabpanel',
            'tabindex' => '0',
            'aria-labelledby' => 'tab-'.$this->value,
            'id' => 'panel-'.$this->value,
        ];

        
        if (! $this->preserveOffscreen) {
            $attributes['style'] = 'display: none;';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.tabs.panel', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
