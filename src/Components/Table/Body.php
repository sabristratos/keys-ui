<?php

namespace Keys\UI\Components\Table;

use Illuminate\View\Component;

class Body extends Component
{
    public function __construct(
        public string $variant = 'default'
    ) {
    }

    public function getBodyClasses(): string
    {
        return match ($this->variant) {
            'divided' => 'divide-y divide-border bg-surface',
            'bordered' => 'divide-y divide-border bg-surface border-t border-border',
            default => 'divide-y divide-border bg-surface'
        };
    }

    public function getComputedBodyClasses(): string
    {
        return $this->getBodyClasses();
    }

    public function render()
    {
        return view('keys::components.table.body', [
            'computedBodyClasses' => $this->getComputedBodyClasses(),
        ]);
    }
}