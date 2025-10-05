<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class HeadingDecorator extends Component
{
    public function __construct(
        public string $variant = 'gradient',
        public string $color = 'brand',
        public ?string $animation = null
    ) {
        if (!in_array($this->variant, ['gradient', 'highlight', 'underline', 'glow', 'outline'])) {
            $this->variant = 'gradient';
        }

        $validColors = [
            'brand', 'success', 'warning', 'danger', 'neutral',
            'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'indigo'
        ];
        if (!in_array($this->color, $validColors)) {
            $this->color = 'brand';
        }

        
        if ($this->animation === null) {
            $this->animation = match ($this->variant) {
                'underline' => 'draw',
                'highlight' => 'fade',
                default => 'none'
            };
        }
    }

    public function getAnimationName(): string
    {
        return match ($this->variant) {
            'underline' => match ($this->animation) {
                'draw' => 'keys-underline-draw',
                'grow' => 'keys-underline-grow',
                'slide' => 'keys-underline-slide',
                default => 'keys-underline-draw'
            },
            'highlight' => match ($this->animation) {
                'fade' => 'keys-highlight-fade',
                'slide' => 'keys-highlight-slide',
                default => 'keys-highlight-fade'
            },
            'glow' => 'keys-glow-subtle',
            default => ''
        };
    }

    public function getUnderlineColor(): string
    {
        return match ($this->color) {
            'brand' => 'var(--color-brand-500)',
            'success' => 'var(--color-success-500)',
            'warning' => 'var(--color-warning-500)',
            'danger' => 'var(--color-danger-500)',
            'blue' => '#3b82f6',
            'green' => '#10b981',
            'red' => '#ef4444',
            'purple' => '#8b5cf6',
            'pink' => '#ec4899',
            default => 'var(--color-brand-500)'
        };
    }

    public function getGlowColor(): string
    {
        return match ($this->color) {
            'brand' => 'var(--color-brand-500)',
            'success' => '#10b981',
            'warning' => '#f59e0b',
            'danger' => '#ef4444',
            'rainbow' => '#8b5cf6',
            default => 'var(--color-brand-500)'
        };
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-heading-decorator' => 'true',
            'data-variant' => $this->variant,
            'data-color' => $this->color,
        ];

        if ($this->animation && $this->animation !== 'none') {
            $attributes['data-animation'] = $this->animation;
        }

        $animationName = $this->getAnimationName();
        if (!empty($animationName)) {
            $attributes['data-animation-name'] = $animationName;
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.heading-decorator', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}