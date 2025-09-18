<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

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

        if (!in_array($this->variant, ['simple', 'chip'])) {
            $this->variant = 'simple';
        }

        if (!in_array($this->size, ['xs', 'sm', 'md'])) {
            $this->size = 'sm';
        }

        $validColors = [
            'brand', 'success', 'warning', 'danger', 'neutral',
            'blue', 'gray', 'red', 'green', 'yellow', 'indigo', 'purple', 'pink'
        ];
        if (!in_array($this->color, $validColors)) {
            $this->color = 'blue';
        }

        if ($this->dismissible && $this->variant === 'simple') {
            $this->variant = 'chip';
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
            default => 'rounded-full'
        };
    }

    public function colorClasses(): string
    {
        return match ($this->color) {
            'brand' => 'bg-brand/10 text-brand',
            'success' => 'bg-success/10 text-success',
            'warning' => 'bg-warning/10 text-warning',
            'danger' => 'bg-danger/10 text-danger',
            'neutral' => 'bg-neutral/10 text-neutral',
            'blue' => 'bg-blue-500/10 text-blue-600',
            'gray' => 'bg-neutral-500/10 text-neutral-600',
            'red' => 'bg-red-500/10 text-red-600',
            'green' => 'bg-green-500/10 text-green-600',
            'yellow' => 'bg-yellow-500/10 text-yellow-600',
            'indigo' => 'bg-indigo-500/10 text-indigo-600',
            'purple' => 'bg-purple-500/10 text-purple-600',
            'pink' => 'bg-pink-500/10 text-pink-600',
            default => 'bg-blue-500/10 text-blue-600'
        };
    }


    public function badgeClasses(bool $isIconOnly = false): string
    {
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

    public function hoverClasses(): string
    {
        return match ($this->color) {
            'brand' => 'hover:bg-brand/20',
            'success' => 'hover:bg-success/20',
            'warning' => 'hover:bg-warning/20',
            'danger' => 'hover:bg-danger/20',
            'neutral' => 'hover:bg-neutral/20',
            'blue' => 'hover:bg-blue-500/20',
            'gray' => 'hover:bg-neutral-500/20',
            'red' => 'hover:bg-red-500/20',
            'green' => 'hover:bg-green-500/20',
            'yellow' => 'hover:bg-yellow-500/20',
            'indigo' => 'hover:bg-indigo-500/20',
            'purple' => 'hover:bg-purple-500/20',
            'pink' => 'hover:bg-pink-500/20',
            default => 'hover:bg-blue-500/20'
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

    public function render()
    {
        return view('keys::components.badge');
    }
}
