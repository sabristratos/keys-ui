<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Avatar extends Component
{
    public function __construct(
        public ?string $src = null,
        public ?string $alt = null,
        public ?string $name = null,
        public string $size = 'md',
        public string $shape = 'circle',
        public ?string $status = null,
        public string $color = 'neutral',
        public bool $border = false,
        public bool $lazy = true
    ) {

        if (!$this->alt && $this->name) {
            $this->alt = "Avatar for {$this->name}";
        }


        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->size = 'md';
        }


        if (!in_array($this->shape, ['circle', 'square'])) {
            $this->shape = 'circle';
        }


        $validColors = ['brand', 'success', 'warning', 'danger', 'neutral', 'red', 'green', 'blue', 'purple', 'yellow', 'teal', 'orange'];
        if (!in_array($this->color, $validColors)) {
            $this->color = 'neutral';
        }


        if ($this->status && !in_array($this->status, ['online', 'offline', 'away', 'busy'])) {
            $this->status = null;
        }
    }

    public function hasImage(): bool
    {
        return !empty($this->src);
    }

    public function hasInitials(): bool
    {
        return !empty($this->name) && !$this->hasImage();
    }

    public function getInitials(): string
    {
        if (!$this->name) {
            return '';
        }

        $words = explode(' ', trim($this->name));

        if (count($words) >= 2) {
            return strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1));
        }

        return strtoupper(substr($words[0], 0, 2));
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'xs' => 'w-6 h-6 text-xs',
            'sm' => 'w-8 h-8 text-sm',
            'md' => 'w-10 h-10 text-base',
            'lg' => 'w-12 h-12 text-lg',
            'xl' => 'w-16 h-16 text-xl',
            default => 'w-10 h-10 text-base'
        };
    }

    public function shapeClasses(): string
    {
        return match ($this->shape) {
            'circle' => 'rounded-full',
            'square' => 'rounded-lg',
            default => 'rounded-full'
        };
    }

    public function colorClasses(): string
    {
        if ($this->hasImage()) {
            return '';
        }

        return match ($this->color) {
            'brand' => 'bg-brand text-brand-foreground',
            'success' => 'bg-success text-success-foreground',
            'warning' => 'bg-warning text-warning-foreground',
            'danger' => 'bg-danger text-danger-foreground',
            'neutral' => 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200',
            'red' => 'bg-red-500 text-white',
            'green' => 'bg-green-500 text-white',
            'blue' => 'bg-blue-500 text-white',
            'purple' => 'bg-purple-500 text-white',
            'yellow' => 'bg-yellow-400 text-yellow-900',
            'teal' => 'bg-teal-500 text-white',
            'orange' => 'bg-orange-500 text-white',
            default => 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200'
        };
    }

    public function borderClasses(): string
    {
        if (!$this->border) {
            return '';
        }

        return 'ring-2 ring-white dark:ring-neutral-800';
    }

    public function statusClasses(): string
    {
        if (!$this->status) {
            return '';
        }

        $baseClasses = 'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-neutral-800';

        $sizeClasses = match ($this->size) {
            'xs' => 'w-2 h-2',
            'sm' => 'w-2.5 h-2.5',
            'md' => 'w-3 h-3',
            'lg' => 'w-3.5 h-3.5',
            'xl' => 'w-4 h-4',
            default => 'w-3 h-3'
        };

        $colorClasses = match ($this->status) {
            'online' => 'bg-green-400',
            'offline' => 'bg-neutral-400',
            'away' => 'bg-yellow-400',
            'busy' => 'bg-red-400',
            default => 'bg-neutral-400'
        };

        return trim("{$baseClasses} {$sizeClasses} {$colorClasses}");
    }

    public function avatarClasses(): string
    {
        $baseClasses = 'inline-block flex-shrink-0 relative';
        $sizeClasses = $this->sizeClasses();
        $shapeClasses = $this->shapeClasses();
        $colorClasses = $this->colorClasses();
        $borderClasses = $this->borderClasses();

        return trim("{$baseClasses} {$sizeClasses} {$shapeClasses} {$colorClasses} {$borderClasses}");
    }

    public function imageClasses(): string
    {
        $baseClasses = 'w-full h-full object-cover';
        $shapeClasses = $this->shapeClasses();

        return trim("{$baseClasses} {$shapeClasses}");
    }

    public function initialsClasses(): string
    {
        return 'flex items-center justify-center w-full h-full font-medium select-none';
    }

    public function render()
    {
        return view('keys::components.avatar');
    }
}
