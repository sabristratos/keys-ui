<?php

namespace Keys\UI\Components\Card;

use Illuminate\View\Component;

class Header extends Component
{
    public function __construct(
        public ?string $title = null,
        public ?string $subtitle = null,
        public ?string $icon = null,
        public string $titleTag = 'h3',
        public bool $divider = false
    ) {}

    public function render()
    {
        return view('keys::components.card.header');
    }
}