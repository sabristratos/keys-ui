<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Badge extends Component
{
    public function __construct(
        public string $variant = 'simple',
        public string $color = 'blue',
        public string $size = 'sm',
        public ?string $icon = null,
        public bool $dismissible = false,
        public ?string $id = null
    ) {
        if ($this->dismissible && !$this->id) {
            $this->id = 'badge-' . uniqid();
        }

        if (!in_array($this->variant, ComponentConstants::BADGE_VARIANTS)) {
            $this->variant = 'simple';
        }

        if (!in_array($this->size, ComponentConstants::BADGE_SIZES)) {
            $this->size = 'sm';
        }

        if (!ComponentConstants::isValidColorForComponent($this->color, 'badge')) {
            $this->color = 'blue';
        }

        if ($this->dismissible && $this->variant === 'simple') {
            $this->variant = 'chip';
        }

        if ($this->dismissible && $this->variant === 'subtle') {
            $this->dismissible = false;
        }
    }

    public function isIconOnly(string $slotContent = ''): bool
    {
        return !empty($this->icon) && empty(trim(strip_tags($slotContent)));
    }


    public function sizeClasses(bool $isIconOnly = false): string
    {
        if ($isIconOnly) {
            return match ($this->size) {
                'xs' => 'w-4 h-4 p-0.5',
                'sm' => 'w-5 h-5 p-1',
                'md' => 'w-6 h-6 p-1.5',
                default => 'w-5 h-5 p-1'
            };
        }

        return match ($this->size) {
            'xs' => 'px-1.5 py-0.5 text-xs',
            'sm' => 'px-2.5 py-0.5 text-xs',
            'md' => 'px-3 py-1 text-sm',
            default => 'px-2.5 py-0.5 text-xs'
        };
    }

    public function shapeClasses(): string
    {
        return match ($this->variant) {
            'simple' => 'rounded-full',
            'chip' => 'rounded-sm',
            'subtle' => '',
            default => 'rounded-full'
        };
    }

    public function colorClasses(): string
    {
        if ($this->variant === 'subtle') {
            return $this->colorClassesSubtle();
        }

        return match ($this->color) {
            'brand' => 'bg-brand text-white',
            'success' => 'bg-success text-white',
            'warning' => 'bg-warning text-white',
            'danger' => 'bg-danger text-white',
            'neutral' => 'bg-neutral text-white',
            'blue' => 'bg-blue-600 text-white',
            'gray' => 'bg-neutral-600 text-white',
            'red' => 'bg-red-600 text-white',
            'green' => 'bg-green-600 text-white',
            'yellow' => 'bg-yellow-600 text-white',
            'indigo' => 'bg-indigo-600 text-white',
            'purple' => 'bg-purple-600 text-white',
            'pink' => 'bg-pink-600 text-white',
            'dark' => 'bg-neutral-900 text-white',
            default => 'bg-blue-600 text-white'
        };
    }

    public function colorClassesSubtle(): string
    {
        // For subtle variant, text should use foreground color, only dot gets the color
        return 'text-foreground';
    }

    public function dotColorClasses(): string
    {
        return match ($this->color) {
            'brand' => 'text-brand',
            'success' => 'text-success',
            'warning' => 'text-warning',
            'danger' => 'text-danger',
            'neutral' => 'text-neutral',
            'blue' => 'text-blue-600',
            'gray' => 'text-neutral-600',
            'red' => 'text-red-600',
            'green' => 'text-green-600',
            'yellow' => 'text-yellow-600',
            'indigo' => 'text-indigo-600',
            'purple' => 'text-purple-600',
            'pink' => 'text-pink-600',
            default => 'text-blue-600'
        };
    }


    public function badgeClasses(bool $isIconOnly = false): string
    {
        if ($this->variant === 'subtle') {
            return $this->subtleBadgeClasses($isIconOnly);
        }

        $baseClasses = 'inline-flex items-center font-medium';

        if ($isIconOnly) {
            $baseClasses .= ' justify-center flex-shrink-0';
        } elseif ($this->dismissible) {
            $baseClasses .= ' justify-between cursor-pointer transition-colors';
        }

        $sizeClasses = $this->sizeClasses($isIconOnly);
        $shapeClasses = $this->shapeClasses();
        $colorClasses = $this->colorClasses();
        $hoverClasses = $this->dismissible ? $this->hoverClasses() : '';

        return trim("{$baseClasses} {$sizeClasses} {$shapeClasses} {$colorClasses} {$hoverClasses}");
    }

    public function subtleBadgeClasses(bool $isIconOnly = false): string
    {
        $baseClasses = 'inline-flex items-center gap-1.5 font-medium';
        $colorClasses = $this->colorClassesSubtle();
        $sizeClasses = match ($this->size) {
            'xs' => 'text-xs',
            'sm' => 'text-xs',
            'md' => 'text-sm',
            default => 'text-xs'
        };

        return trim("{$baseClasses} {$sizeClasses} {$colorClasses}");
    }

    public function hoverClasses(): string
    {
        return match ($this->color) {
            'brand' => 'hover:bg-brand-hover',
            'success' => 'hover:bg-success-hover',
            'warning' => 'hover:bg-warning-hover',
            'danger' => 'hover:bg-danger-hover',
            'neutral' => 'hover:bg-neutral-hover',
            'blue' => 'hover:bg-blue-700',
            'gray' => 'hover:bg-neutral-700',
            'red' => 'hover:bg-red-700',
            'green' => 'hover:bg-green-700',
            'yellow' => 'hover:bg-yellow-700',
            'indigo' => 'hover:bg-indigo-700',
            'purple' => 'hover:bg-purple-700',
            'pink' => 'hover:bg-pink-700',
            'dark' => 'hover:bg-neutral-800',
            default => 'hover:bg-blue-700'
        };
    }

    public function iconSize(): string
    {
        return match ($this->size) {
            'xs' => 'xs',
            'sm' => 'sm',
            'md' => 'md',
            default => 'sm'
        };
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-badge' => 'true',
            'data-variant' => $this->variant,
            'data-color' => $this->color,
            'data-size' => $this->size,
        ];

        if ($this->dismissible) {
            $attributes['data-dismissible'] = 'true';
            $attributes['data-badge-id'] = $this->id;
        }

        if ($this->icon) {
            $attributes['data-has-icon'] = 'true';
            $attributes['data-icon'] = $this->icon;
        }


        return $attributes;
    }

    public function render()
    {
        return view('keys::components.badge', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
