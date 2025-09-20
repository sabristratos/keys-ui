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


        // Set default animations for variants
        if ($this->animation === null) {
            $this->animation = match ($this->variant) {
                'underline' => 'draw',
                'highlight' => 'fade',
                default => 'none'
            };
        }
    }

    public function componentClasses(): string
    {
        $baseClasses = 'inline relative';

        return trim($baseClasses);
    }

    public function variantClasses(): string
    {
        return match ($this->variant) {
            'gradient' => $this->gradientClasses(),
            'highlight' => $this->highlightClasses(),
            'underline' => $this->underlineClasses(),
            'glow' => $this->glowClasses(),
            'outline' => $this->outlineClasses(),
            default => ''
        };
    }

    protected function gradientClasses(): string
    {
        $baseClasses = 'bg-gradient-to-r bg-clip-text text-transparent font-bold';

        return match ($this->color) {
            'brand' => "{$baseClasses} from-brand-500 to-brand-600",
            'success' => "{$baseClasses} from-green-500 to-emerald-600",
            'warning' => "{$baseClasses} from-yellow-500 to-orange-600",
            'danger' => "{$baseClasses} from-red-500 to-pink-600",
            'rainbow' => "{$baseClasses} from-purple-500 via-blue-500 via-green-500 to-yellow-500",
            'blue' => "{$baseClasses} from-blue-500 to-cyan-600",
            'purple' => "{$baseClasses} from-purple-500 to-indigo-600",
            'pink' => "{$baseClasses} from-pink-500 to-rose-600",
            default => "{$baseClasses} from-brand-500 to-brand-600"
        };
    }

    protected function highlightClasses(): string
    {
        $baseClasses = 'px-1 py-0.5 rounded-sm font-medium relative';

        return match ($this->color) {
            'brand' => "{$baseClasses} bg-brand-100 text-brand-800",
            'success' => "{$baseClasses} bg-green-100 text-green-800",
            'warning' => "{$baseClasses} bg-yellow-100 text-yellow-800",
            'danger' => "{$baseClasses} bg-red-100 text-red-800",
            'neutral' => "{$baseClasses} bg-neutral-100 text-neutral-800",
            default => "{$baseClasses} bg-brand-100 text-brand-800"
        };
    }

    protected function underlineClasses(): string
    {
        return 'font-medium relative';
    }

    protected function glowClasses(): string
    {
        $baseClasses = 'font-medium relative';

        return match ($this->color) {
            'brand' => "{$baseClasses} text-brand-700",
            'success' => "{$baseClasses} text-green-700",
            'warning' => "{$baseClasses} text-yellow-700",
            'danger' => "{$baseClasses} text-red-700",
            'neutral' => "{$baseClasses} text-neutral-700",
            default => "{$baseClasses} text-brand-700"
        };
    }

    protected function outlineClasses(): string
    {
        return 'font-bold';
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

    public function render()
    {
        return view('keys::components.heading-decorator');
    }
}