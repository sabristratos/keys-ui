<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Card extends Component
{
    public function __construct(
        public string $variant = 'default',
        public string $padding = 'md',
        public string $rounded = 'md',
        public string $shadow = 'sm',
        public bool $interactive = false,
        public ?string $href = null,
        public bool $disabled = false
    ) {}

    public function isLink(): bool
    {
        return ! is_null($this->href);
    }

    public function elementType(): string
    {
        if ($this->isLink()) {
            return $this->disabled ? 'div' : 'a';
        }

        return 'div';
    }

    public function baseClasses(): string
    {
        return 'block transition-all duration-200';
    }

    public function variantClasses(): string
    {
        return match ($this->variant) {
            'default' => 'bg-surface border border-border',
            'elevated' => 'bg-surface border border-border',
            'outlined' => 'bg-transparent border-2 border-border',
            'filled' => 'bg-body border border-transparent',
            default => 'bg-surface border border-border'
        };
    }

    public function paddingClasses(): string
    {
        return match ($this->padding) {
            'none' => '',
            'xs' => 'p-2',
            'sm' => 'p-3',
            'md' => 'p-4',
            'lg' => 'p-6',
            'xl' => 'p-8',
            default => 'p-4'
        };
    }

    public function roundedClasses(): string
    {
        return match ($this->rounded) {
            'none' => '',
            'xs' => 'rounded-sm',
            'sm' => 'rounded',
            'md' => 'rounded-md',
            'lg' => 'rounded-lg',
            'xl' => 'rounded-xl',
            '2xl' => 'rounded-2xl',
            '3xl' => 'rounded-3xl',
            default => 'rounded-md'
        };
    }

    public function shadowClasses(): string
    {
        if ($this->variant === 'elevated') {
            $baseShadow = match ($this->shadow) {
                'none' => '',
                'xs' => 'shadow-xs',
                'sm' => 'shadow-sm',
                'md' => 'shadow-md',
                'lg' => 'shadow-lg',
                'xl' => 'shadow-xl',
                '2xl' => 'shadow-2xl',
                default => 'shadow-sm'
            };
            return $this->shadow === 'none' ? '' : ($baseShadow ?: 'shadow-sm');
        }

        if ($this->shadow !== 'none' && $this->shadow !== 'sm') {
            return match ($this->shadow) {
                'xs' => 'shadow-xs',
                'md' => 'shadow-md',
                'lg' => 'shadow-lg',
                'xl' => 'shadow-xl',
                '2xl' => 'shadow-2xl',
                default => ''
            };
        }

        return '';
    }

    public function interactiveClasses(): string
    {
        if (! $this->interactive || $this->disabled) {
            return '';
        }

        $hoverClasses = match ($this->variant) {
            'default' => 'hover:shadow-sm hover:border-neutral',
            'elevated' => 'hover:shadow-md hover:-translate-y-0.5',
            'outlined' => 'hover:bg-surface hover:border-neutral',
            'filled' => 'hover:bg-surface',
            default => 'hover:shadow-sm hover:border-neutral'
        };

        $focusClasses = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2';
        $activeClasses = 'active:scale-[0.98]';

        return trim("{$hoverClasses} {$focusClasses} {$activeClasses}");
    }

    public function disabledClasses(): string
    {
        return $this->disabled ? 'opacity-50 cursor-not-allowed' : '';
    }

    public function render()
    {
        return view('keys::components.card');
    }
}
