<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Label extends Component
{
    public function __construct(
        public ?string $for = null,
        public string $size = 'md',
        public bool $required = false,
        public bool $optional = false
    ) {}

    public function baseClasses(): string
    {
        return 'block font-medium text-foreground mb-2';
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'text-xs',
            'md' => 'text-sm',
            'lg' => 'text-base',
            default => 'text-sm'
        };
    }

    public function render()
    {
        return view('keys::components.label');
    }
}
