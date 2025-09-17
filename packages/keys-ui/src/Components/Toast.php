<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Toast extends Component
{
    public function __construct(
        public string $position = 'top-right'
    ) {
        // Validate position
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

    public function getToastData(string $variant): array
    {
        return [
            'data-toast' => 'true',
            'data-toast-variant' => $variant,
            'data-toast-position' => $this->position,
            'data-toast-visible' => 'false',
            'style' => 'display: none;',
            'aria-live' => 'polite',
            'role' => 'alert'
        ];
    }

    public function getAnimationClasses(string $position): string
    {
        // Position-specific animation classes
        return match ($position) {
            'top-left', 'top-right', 'top-center' => 'data-[toast-visible=true]:translate-y-0 data-[toast-visible=true]:opacity-100 data-[toast-visible=true]:scale-100',
            'bottom-left', 'bottom-right', 'bottom-center' => 'translate-y-2 data-[toast-visible=true]:translate-y-0 data-[toast-visible=true]:opacity-100 data-[toast-visible=true]:scale-100',
            default => 'data-[toast-visible=true]:translate-y-0 data-[toast-visible=true]:opacity-100 data-[toast-visible=true]:scale-100'
        };
    }

    public function render()
    {
        return view('keys::components.toast', [
            'computedContainerClasses' => $this->containerClasses(),
            'computedToastClasses' => $this->toastClasses(),
            'computedAnimationClasses' => $this->getAnimationClasses($this->position),
        ]);
    }
}