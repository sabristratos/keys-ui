<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Toast extends Component
{
    public function __construct(
        public string $position = 'top-right',
        public string $variant = 'info',
        public bool $dismissible = true,
        public bool $autoHide = true,
        public int $timeout = 5000,
        public string $icon = '',
        public string $title = '',
        public string $message = '',
        public bool $persistent = false,
        public string $id = ''
    ) {
        // Validate position
        $validPositions = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'];
        if (! in_array($this->position, $validPositions)) {
            $this->position = 'top-right';
        }

        // Validate variant
        $validVariants = ['info', 'success', 'warning', 'danger', 'neutral'];
        if (! in_array($this->variant, $validVariants)) {
            $this->variant = 'info';
        }

        // Auto-generate ID if not provided
        $this->id = $this->id ?: 'toast-'.uniqid();

        // Validate timeout
        if ($this->timeout < 0) {
            $this->timeout = 5000;
        }
    }

    public function hasContent(): bool
    {
        return ! empty($this->title) || ! empty($this->message);
    }

    public function shouldAutoHide(): bool
    {
        return $this->autoHide && ! $this->persistent && $this->timeout > 0;
    }

    public function getVariantIcon(): string
    {
        if (! empty($this->icon)) {
            return $this->icon;
        }

        return match ($this->variant) {
            'success' => 'heroicon-o-check-circle',
            'warning' => 'heroicon-o-exclamation-triangle',
            'danger' => 'heroicon-o-x-circle',
            'info' => 'heroicon-o-information-circle',
            'neutral' => 'heroicon-o-chat-bubble-left',
            default => 'heroicon-o-information-circle'
        };
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-toast' => 'true',
            'data-variant' => $this->variant,
            'data-position' => $this->position,
            'data-element-type' => 'dialog',
        ];

        if ($this->dismissible) {
            $attributes['data-dismissible'] = 'true';
        }

        if ($this->shouldAutoHide()) {
            $attributes['data-auto-hide'] = 'true';
            $attributes['data-timeout'] = $this->timeout;
        }

        if ($this->persistent) {
            $attributes['data-persistent'] = 'true';
        }

        if ($this->getVariantIcon()) {
            $attributes['data-has-icon'] = 'true';
            $attributes['data-icon'] = $this->getVariantIcon();
        }

        if ($this->hasContent()) {
            $attributes['data-has-content'] = 'true';
        }

        if (! empty($this->title)) {
            $attributes['data-has-title'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.toast', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
