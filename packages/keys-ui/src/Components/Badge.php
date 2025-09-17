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
            'brand' => 'bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-300',
            'success' => 'bg-success/10 text-success dark:bg-success/20 dark:text-success-300',
            'warning' => 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning-300',
            'danger' => 'bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger-300',
            'neutral' => 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300',
            'blue' => 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            'gray' => 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
            'red' => 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            'green' => 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            'yellow' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            'indigo' => 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
            'purple' => 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            'pink' => 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
            default => 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
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
            'brand' => 'hover:bg-brand/20 dark:hover:bg-brand/30',
            'success' => 'hover:bg-success/20 dark:hover:bg-success/30',
            'warning' => 'hover:bg-warning/20 dark:hover:bg-warning/30',
            'danger' => 'hover:bg-danger/20 dark:hover:bg-danger/30',
            'neutral' => 'hover:bg-neutral-200 dark:hover:bg-neutral-600',
            'blue' => 'hover:bg-blue-200 dark:hover:bg-blue-800',
            'gray' => 'hover:bg-gray-200 dark:hover:bg-gray-600',
            'red' => 'hover:bg-red-200 dark:hover:bg-red-800',
            'green' => 'hover:bg-green-200 dark:hover:bg-green-800',
            'yellow' => 'hover:bg-yellow-200 dark:hover:bg-yellow-800',
            'indigo' => 'hover:bg-indigo-200 dark:hover:bg-indigo-800',
            'purple' => 'hover:bg-purple-200 dark:hover:bg-purple-800',
            'pink' => 'hover:bg-pink-200 dark:hover:bg-pink-800',
            default => 'hover:bg-blue-200 dark:hover:bg-blue-800'
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
