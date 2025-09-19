<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Separator extends Component
{
    public function __construct(
        public string $variant = 'line',
        public string $orientation = 'horizontal',
        public string $color = 'neutral',
        public string $size = 'sm',
        public string $spacing = 'md',
        public string $alignment = 'center',
        public ?string $icon = null
    ) {
        if (!in_array($this->variant, ['line', 'text', 'icon', 'gradient', 'dashed'])) {
            $this->variant = 'line';
        }

        if (!in_array($this->orientation, ['horizontal', 'vertical'])) {
            $this->orientation = 'horizontal';
        }

        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg'])) {
            $this->size = 'sm';
        }

        if (!in_array($this->spacing, ['none', 'xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->spacing = 'md';
        }

        if (!in_array($this->alignment, ['left', 'center', 'right'])) {
            $this->alignment = 'center';
        }

        $validColors = [
            'brand', 'success', 'warning', 'danger', 'neutral',
            'blue', 'gray', 'red', 'green', 'yellow', 'indigo', 'purple', 'pink'
        ];
        if (!in_array($this->color, $validColors)) {
            $this->color = 'neutral';
        }
    }

    public function isIconOnly(string $slotContent = ''): bool
    {
        return !empty($this->icon) && empty(trim(strip_tags($slotContent)));
    }

    public function containerClasses(): string
    {
        $baseClasses = 'flex items-center';

        if ($this->orientation === 'vertical') {
            $baseClasses = 'flex flex-col justify-center';
        }

        $spacingClasses = $this->spacingClasses();

        return trim("{$baseClasses} {$spacingClasses}");
    }

    public function spacingClasses(): string
    {
        if ($this->orientation === 'vertical') {
            return match ($this->spacing) {
                'none' => 'h-0',
                'xs' => 'h-4',
                'sm' => 'h-6',
                'md' => 'h-8',
                'lg' => 'h-12',
                'xl' => 'h-16',
                default => 'h-8'
            };
        }

        return match ($this->spacing) {
            'none' => 'my-0',
            'xs' => 'my-2',
            'sm' => 'my-3',
            'md' => 'my-4',
            'lg' => 'my-6',
            'xl' => 'my-8',
            default => 'my-4'
        };
    }

    public function lineClasses(): string
    {
        $baseClasses = $this->orientation === 'vertical' ? 'h-full' : 'flex-1';
        $sizeClasses = $this->lineSizeClasses();
        $colorClasses = $this->lineColorClasses();

        if ($this->variant === 'dashed') {
            $baseClasses .= $this->orientation === 'vertical' ? ' border-l border-dashed' : ' border-t border-dashed';
        } else {
            $baseClasses .= $this->orientation === 'vertical' ? ' border-l' : ' border-t';
        }

        return trim("{$baseClasses} {$sizeClasses} {$colorClasses}");
    }

    public function lineSizeClasses(): string
    {
        if ($this->orientation === 'vertical') {
            return match ($this->size) {
                'xs' => 'border-l',
                'sm' => 'border-l-2',
                'md' => 'border-l-4',
                'lg' => 'border-l-8',
                default => 'border-l-2'
            };
        }

        return match ($this->size) {
            'xs' => 'border-t',
            'sm' => 'border-t-2',
            'md' => 'border-t-4',
            'lg' => 'border-t-8',
            default => 'border-t-2'
        };
    }

    public function lineColorClasses(): string
    {
        return match ($this->color) {
            'brand' => 'border-brand',
            'success' => 'border-success',
            'warning' => 'border-warning',
            'danger' => 'border-danger',
            'neutral' => 'border-border',
            'blue' => 'border-blue-500',
            'gray' => 'border-neutral-400',
            'red' => 'border-red-500',
            'green' => 'border-green-500',
            'yellow' => 'border-yellow-500',
            'indigo' => 'border-indigo-500',
            'purple' => 'border-purple-500',
            'pink' => 'border-pink-500',
            default => 'border-border'
        };
    }

    public function gradientClasses(): string
    {
        $direction = $this->orientation === 'vertical' ? 'bg-gradient-to-b' : 'bg-gradient-to-r';
        $colors = $this->gradientColorClasses();
        $size = $this->gradientSizeClasses();

        return trim("{$direction} {$colors} {$size}");
    }

    public function gradientColorClasses(): string
    {
        return match ($this->color) {
            'brand' => 'from-transparent via-brand to-transparent',
            'success' => 'from-transparent via-success to-transparent',
            'warning' => 'from-transparent via-warning to-transparent',
            'danger' => 'from-transparent via-danger to-transparent',
            'neutral' => 'from-transparent via-border to-transparent',
            'blue' => 'from-transparent via-blue-500 to-transparent',
            'gray' => 'from-transparent via-neutral-400 to-transparent',
            'red' => 'from-transparent via-red-500 to-transparent',
            'green' => 'from-transparent via-green-500 to-transparent',
            'yellow' => 'from-transparent via-yellow-500 to-transparent',
            'indigo' => 'from-transparent via-indigo-500 to-transparent',
            'purple' => 'from-transparent via-purple-500 to-transparent',
            'pink' => 'from-transparent via-pink-500 to-transparent',
            default => 'from-transparent via-border to-transparent'
        };
    }

    public function gradientSizeClasses(): string
    {
        if ($this->orientation === 'vertical') {
            return match ($this->size) {
                'xs' => 'w-px h-full',
                'sm' => 'w-0.5 h-full',
                'md' => 'w-1 h-full',
                'lg' => 'w-2 h-full',
                default => 'w-0.5 h-full'
            };
        }

        return match ($this->size) {
            'xs' => 'h-px w-full',
            'sm' => 'h-0.5 w-full',
            'md' => 'h-1 w-full',
            'lg' => 'h-2 w-full',
            default => 'h-0.5 w-full'
        };
    }

    public function contentClasses(): string
    {
        $baseClasses = 'bg-body px-3 text-foreground/60';
        $sizeClasses = $this->contentSizeClasses();

        return trim("{$baseClasses} {$sizeClasses}");
    }

    public function contentSizeClasses(): string
    {
        return match ($this->size) {
            'xs' => 'text-xs px-2',
            'sm' => 'text-sm px-3',
            'md' => 'text-base px-4',
            'lg' => 'text-lg px-5',
            default => 'text-sm px-3'
        };
    }

    public function iconSize(): string
    {
        return match ($this->size) {
            'xs' => 'xs',
            'sm' => 'sm',
            'md' => 'md',
            'lg' => 'lg',
            default => 'sm'
        };
    }

    public function iconColorClasses(): string
    {
        return match ($this->color) {
            'brand' => 'text-brand',
            'success' => 'text-success',
            'warning' => 'text-warning',
            'danger' => 'text-danger',
            'neutral' => 'text-foreground/60',
            'blue' => 'text-blue-500',
            'gray' => 'text-neutral-400',
            'red' => 'text-red-500',
            'green' => 'text-green-500',
            'yellow' => 'text-yellow-500',
            'indigo' => 'text-indigo-500',
            'purple' => 'text-purple-500',
            'pink' => 'text-pink-500',
            default => 'text-foreground/60'
        };
    }

    public function justifyClasses(): string
    {
        if ($this->orientation === 'vertical') {
            return match ($this->alignment) {
                'left' => 'justify-start',
                'center' => 'justify-center',
                'right' => 'justify-end',
                default => 'justify-center'
            };
        }

        return 'justify-center';
    }

    public function render()
    {
        return view('keys::components.separator');
    }
}