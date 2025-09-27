<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Tabs extends Component
{
    public function __construct(
        public ?string $id = null,
        public string $orientation = 'horizontal',
        public string $size = 'md',
        public ?string $defaultValue = null,
        public ?string $value = null,
        public bool $disabled = false,
        public string $variant = 'default',
        public bool $stretch = false
    ) {
        $this->id = $this->id ?? 'tabs-'.uniqid();

        if ($this->value === null && $this->defaultValue !== null) {
            $this->value = $this->defaultValue;
        }
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-tabs' => 'true',
            'data-orientation' => $this->orientation,
            'data-variant' => $this->variant,
            'data-size' => $this->size,
            'data-value' => $this->value ?? '',
            'id' => $this->id,
        ];

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->stretch) {
            $attributes['data-stretch'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.tabs', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
