<?php

namespace Keys\UI\Components\Table;

use Illuminate\View\Component;

class Head extends Component
{
    public function __construct(
        public string $variant = 'default'
    ) {
    }

    public function getHeadClasses(): string
    {
        $base = 'bg-neutral-50 dark:bg-neutral-900/50';

        return match ($this->variant) {
            'bordered' => $base . ' border-b border-border',
            'elevated' => $base . ' shadow-sm',
            default => $base
        };
    }

    public function getComputedHeadClasses(): string
    {
        return $this->getHeadClasses();
    }

    public function render()
    {
        return view('keys::components.table.head', [
            'computedHeadClasses' => $this->getComputedHeadClasses(),
        ]);
    }
}