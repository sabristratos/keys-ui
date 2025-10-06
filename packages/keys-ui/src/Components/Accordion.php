<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Concerns\HasActions;

class Accordion extends Component
{
    use HasActions;

    public function __construct(
        public ?string $title = null,
        public ?string $id = null,
        public ?string $icon = 'heroicon-o-chevron-down',
        public bool $collapsed = false,
        public bool $disabled = false,
        public string $color = 'neutral',
        public string $size = 'md',
        public string $variant = 'default',
        public string $rounded = 'lg',
        public array $actions = [],
        public string $actionVariant = 'ghost',
        public string $actionSize = 'xs',
        public bool $animated = true
    ) {
        $this->id = $this->id ?? 'accordion-' . uniqid();

        
        $validColors = ['brand', 'success', 'warning', 'danger', 'neutral'];
        if (!in_array($this->color, $validColors)) {
            $this->color = 'neutral';
        }

        
        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg'])) {
            $this->size = 'md';
        }

        
        $validVariants = ['default', 'flush', 'spaced', 'outlined', 'elevated'];
        if (!in_array($this->variant, $validVariants)) {
            $this->variant = 'default';
        }

        
        $validRounded = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
        if (!in_array($this->rounded, $validRounded)) {
            $this->rounded = 'lg';
        }
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-accordion' => 'true',
            'data-variant' => $this->variant,
            'data-size' => $this->size,
            'data-color' => $this->color,
            'data-rounded' => $this->rounded,
        ];

        
        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->animated) {
            $attributes['data-animated'] = 'true';
        }

        if ($this->hasActions()) {
            $attributes['data-has-actions'] = 'true';
        }

        if ($this->icon) {
            $attributes['data-has-icon'] = 'true';
            $attributes['data-icon'] = $this->icon;
        }

        if ($this->title) {
            $attributes['data-has-title'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.accordion', [
            'computedActionSize' => $this->getComputedActionSize(),
            'computedActionData' => $this->getComputedActionData(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}