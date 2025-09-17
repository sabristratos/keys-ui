<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Toast extends Component
{
    public function __construct(
        public string $position = 'top-right'
    ) {
        if (!in_array($this->position, ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'])) {
            $this->position = 'top-right';
        }
    }

    public function containerClasses(): string
    {
        $base = 'fixed z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full';

        $positionClasses = match ($this->position) {
            'top-left' => 'top-4 left-4',
            'top-right' => 'top-4 right-4',
            'top-center' => 'top-4 left-1/2 -translate-x-1/2',
            'bottom-left' => 'bottom-4 left-4',
            'bottom-right' => 'bottom-4 right-4',
            'bottom-center' => 'bottom-4 left-1/2 -translate-x-1/2',
            default => 'top-4 right-4'
        };

        return "{$base} {$positionClasses}";
    }

    public function toastClasses(): string
    {
        return 'pointer-events-auto transform transition-all duration-300 ease-out opacity-0 scale-95 translate-y-2';
    }

    public function render()
    {
        return view('keys::components.toast', [
            'computedContainerClasses' => $this->containerClasses(),
            'computedToastClasses' => $this->toastClasses(),
        ]);
    }
}
