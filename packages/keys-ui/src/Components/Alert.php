<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Alert extends Component
{
    public function __construct(
        public string $variant = 'info',
        public string $size = 'md',
        public ?string $icon = null,
        public ?string $title = null,
        public bool $dismissible = false
    ) {}

    public function baseClasses(): string
    {
        return 'rounded-lg border p-4 space-y-3';
    }

    public function variantClasses(): string
    {
        return match ($this->variant) {
            'info' => 'bg-info/5 border-info/20 text-info-foreground',
            'success' => 'bg-success/5 border-success/20 text-success-foreground',
            'warning' => 'bg-warning/5 border-warning/20 text-warning-foreground',
            'danger' => 'bg-danger/5 border-danger/20 text-danger-foreground',
            'neutral' => 'bg-neutral/5 border-neutral/20 text-neutral-foreground',
            default => 'bg-info/5 border-info/20 text-info-foreground'
        };
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'p-3 space-y-2 text-sm',
            'md' => 'p-4 space-y-3 text-sm',
            'lg' => 'p-5 space-y-4 text-base',
            default => 'p-4 space-y-3 text-sm'
        };
    }

    public function iconColor(): string
    {
        return match ($this->variant) {
            'info' => 'text-info',
            'success' => 'text-success',
            'warning' => 'text-warning',
            'danger' => 'text-danger',
            'neutral' => 'text-neutral',
            default => 'text-info'
        };
    }

    public function defaultIcon(): string
    {
        return match ($this->variant) {
            'info' => 'heroicon-o-information-circle',
            'success' => 'heroicon-o-check-circle',
            'warning' => 'heroicon-o-exclamation-triangle',
            'danger' => 'heroicon-o-x-circle',
            'neutral' => 'heroicon-o-chat-bubble-left-ellipsis',
            default => 'heroicon-o-information-circle'
        };
    }

    public function iconName(): string
    {
        return $this->icon ?? $this->defaultIcon();
    }

    public function iconSize(): string
    {
        return match ($this->size) {
            'sm' => 'sm',
            'md' => 'md',
            'lg' => 'lg',
            default => 'md'
        };
    }

    public function titleClasses(): string
    {
        return match ($this->size) {
            'sm' => 'text-sm font-medium',
            'md' => 'text-base font-medium',
            'lg' => 'text-lg font-semibold',
            default => 'text-base font-medium'
        };
    }

    public function contentClasses(): string
    {
        return match ($this->size) {
            'sm' => 'text-xs opacity-90',
            'md' => 'text-sm opacity-90',
            'lg' => 'text-base opacity-90',
            default => 'text-sm opacity-90'
        };
    }


    public function render()
    {
        return view('keys::components.alert');
    }
}