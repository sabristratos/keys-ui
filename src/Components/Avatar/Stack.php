<?php

namespace Keys\UI\Components\Avatar;

use Illuminate\View\Component;

class Stack extends Component
{
    public function __construct(
        public int $max = 5,
        public string $size = 'md',
        public string $spacing = 'default',
        public string $direction = 'ltr'
    ) {

        if ($this->max < 1) {
            $this->max = 1;
        } elseif ($this->max > 10) {
            $this->max = 10;
        }


        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->size = 'md';
        }


        if (!in_array($this->spacing, ['tight', 'default', 'loose'])) {
            $this->spacing = 'default';
        }


        if (!in_array($this->direction, ['ltr', 'rtl'])) {
            $this->direction = 'ltr';
        }
    }

    public function spacingClasses(): string
    {
        $spacing = match ($this->spacing) {
            'tight' => match ($this->size) {
                'xs' => '-space-x-1',
                'sm' => '-space-x-1.5',
                'md' => '-space-x-2',
                'lg' => '-space-x-2.5',
                'xl' => '-space-x-3',
                default => '-space-x-2'
            },
            'default' => match ($this->size) {
                'xs' => '-space-x-1.5',
                'sm' => '-space-x-2',
                'md' => '-space-x-2.5',
                'lg' => '-space-x-3',
                'xl' => '-space-x-4',
                default => '-space-x-2.5'
            },
            'loose' => match ($this->size) {
                'xs' => '-space-x-0.5',
                'sm' => '-space-x-1',
                'md' => '-space-x-1.5',
                'lg' => '-space-x-2',
                'xl' => '-space-x-2.5',
                default => '-space-x-1.5'
            },
            default => '-space-x-2.5'
        };

        return $this->direction === 'rtl' ? str_replace('-space-x-', '-space-x-reverse ', $spacing) : $spacing;
    }

    public function stackClasses(): string
    {
        $baseClasses = 'flex items-center';
        $directionClasses = $this->direction === 'rtl' ? 'flex-row-reverse' : 'flex-row';
        $spacingClasses = $this->spacingClasses();

        return trim("{$baseClasses} {$directionClasses} {$spacingClasses}");
    }

    public function moreButtonClasses(): string
    {
        $sizeClasses = match ($this->size) {
            'xs' => 'w-6 h-6 text-xs',
            'sm' => 'w-8 h-8 text-sm',
            'md' => 'w-10 h-10 text-base',
            'lg' => 'w-12 h-12 text-lg',
            'xl' => 'w-16 h-16 text-xl',
            default => 'w-10 h-10 text-base'
        };

        $baseClasses = 'inline-flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 border-2 border-white dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-800 font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors';

        return trim("{$baseClasses} {$sizeClasses}");
    }

    public function getAvatarSize(): string
    {
        return $this->size;
    }

    public function getMaxAvatars(): int
    {
        return $this->max;
    }

    public function render()
    {
        return view('keys::components.avatar.stack', [
            'stackClasses' => $this->stackClasses(),
            'moreButtonClasses' => $this->moreButtonClasses(),
            'avatarSize' => $this->getAvatarSize(),
            'maxAvatars' => $this->getMaxAvatars(),
        ]);
    }
}
