<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Field extends Component
{
    public function __construct(
        public string $spacing = 'md'
    ) {}

    public function baseClasses(): string
    {
        return 'space-y-1';
    }

    public function spacingClasses(): string
    {
        return match ($this->spacing) {
            'sm' => 'space-y-1',
            'md' => 'space-y-1',
            'lg' => 'space-y-2',
            'none' => 'space-y-0',
            default => 'space-y-1'
        };
    }

    public function render()
    {
        return view('keys::components.field');
    }
}
