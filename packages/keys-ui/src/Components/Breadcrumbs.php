<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Breadcrumbs extends Component
{
    public function __construct()
    {
    }

    public function containerClasses(): string
    {
        return 'overflow-hidden min-w-0 text-sm';
    }

    public function navClasses(): string
    {
        return 'flex min-w-0';
    }

    public function listClasses(): string
    {
        return 'flex items-center space-x-1 min-w-0 flex-wrap sm:flex-nowrap';
    }

    public function getComputedContainerClasses(): string
    {
        return $this->containerClasses();
    }

    public function getComputedNavClasses(): string
    {
        return $this->navClasses();
    }

    public function getComputedListClasses(): string
    {
        return $this->listClasses();
    }

    public function render()
    {
        return view('keys::components.breadcrumbs', [
            'computedContainerClasses' => $this->getComputedContainerClasses(),
            'computedNavClasses' => $this->getComputedNavClasses(),
            'computedListClasses' => $this->getComputedListClasses(),
        ]);
    }
}
