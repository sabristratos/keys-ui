<?php

namespace Keys\UI\Components\Card;

use Illuminate\View\Component;

class Actions extends Component
{
    public function __construct(
        public string $position = 'end',
        public string $spacing = 'default',
        public string $variant = 'buttons'
    ) {}

    public function render()
    {
        return view('keys::components.card.actions');
    }
}