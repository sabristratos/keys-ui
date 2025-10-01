<?php

namespace Keys\UI\Components\Button;

use Illuminate\View\Component;

class Group extends Component
{
    public function __construct(
        public string $orientation = 'horizontal',
        public ?string $size = null,
        public bool $attached = true
    ) {}

    public function render()
    {
        return view('keys::components.button.group');
    }
}