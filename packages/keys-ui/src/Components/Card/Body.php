<?php

namespace Keys\UI\Components\Card;

use Illuminate\View\Component;

class Body extends Component
{
    public function __construct(
        public string $padding = 'none',
        public string $spacing = 'default'
    ) {}

    public function render()
    {
        return view('keys::components.card.body');
    }
}