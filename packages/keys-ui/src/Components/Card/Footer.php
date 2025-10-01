<?php

namespace Keys\UI\Components\Card;

use Illuminate\View\Component;

class Footer extends Component
{
    public function __construct(
        public bool $divider = false,
        public string $justify = 'between'
    ) {}

    public function render()
    {
        return view('keys::components.card.footer');
    }
}