<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Breadcrumbs extends Component
{
    public function __construct()
    {
    }

    public function getDataAttributes(): array
    {
        return [
            'data-keys-breadcrumbs' => 'true',
        ];
    }

    public function render()
    {
        return view('keys::components.breadcrumbs', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
