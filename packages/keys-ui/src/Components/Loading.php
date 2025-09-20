<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Loading extends Component
{
    public function __construct(
        public string $animation = 'spinner',
        public string $size = 'md'
    ) {
        if (!in_array($this->animation, ComponentConstants::LOADING_ANIMATIONS)) {
            $this->animation = 'spinner';
        }

        if (!ComponentConstants::isValidSize($this->size)) {
            $this->size = ComponentConstants::getDefaultSize();
        }
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'xs' => 'w-3 h-3',
            'sm' => 'w-4 h-4',
            'md' => 'w-5 h-5',
            'lg' => 'w-6 h-6',
            'xl' => 'w-8 h-8',
            default => 'w-5 h-5'
        };
    }

    public function animationClasses(): string
    {
        return match ($this->animation) {
            'spinner' => 'animate-spin',
            'pulse' => 'animate-ping',
            'bounce' => 'animate-bounce',
            'dots' => 'animate-bounce',
            'bars' => 'animate-pulse',
            'wave' => 'animate-pulse',
            default => 'animate-spin'
        };
    }

    public function render()
    {
        return view('keys::components.loading');
    }
}
