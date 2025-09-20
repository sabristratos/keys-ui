<?php

namespace Keys\UI\Components\Button;

use Illuminate\View\Component;

class Group extends Component
{
    public function __construct(
        public string $orientation = 'horizontal',
        public ?string $size = null,
        public bool $attached = true
    ) {
        if (!in_array($this->orientation, ['horizontal', 'vertical'])) {
            $this->orientation = 'horizontal';
        }

        if ($this->size && !in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->size = null;
        }
    }

    public function containerClasses(): string
    {
        $classes = 'inline-flex';

        if ($this->orientation === 'vertical') {
            $classes .= ' flex-col';
        } else {
            $classes .= ' flex-row';
        }

        return $classes;
    }

    public function getDataAttributes(): array
    {
        return [
            'data-button-group' => 'true',
            'data-orientation' => $this->orientation,
            'data-attached' => $this->attached ? 'true' : 'false',
        ];
    }

    public function render()
    {
        return view('keys::components.button.group', [
            'containerClasses' => $this->containerClasses(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}