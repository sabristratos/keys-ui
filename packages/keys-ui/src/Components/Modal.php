<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Modal extends Component
{
    public function __construct(
        public string $id,
        public string $size = 'md',
        public string $closedby = 'any',
        public string $backdrop = 'blur',
        public bool $centered = true,
        public bool $scrollable = false,
        public bool $animate = true,
        public bool $lazy = false,
        public bool $persistent = false,
        public bool $trapFocus = true,
        public ?string $wireModel = null
    ) {

        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl', 'full'])) {
            $this->size = 'md';
        }


        if (!in_array($this->closedby, ['any', 'closerequest', 'none'])) {
            $this->closedby = 'any';
        }


        if (!in_array($this->backdrop, ['blur', 'dark', 'none'])) {
            $this->backdrop = 'blur';
        }
    }

    public function dialogClasses(): string
    {
        $base = 'w-full h-full max-w-none max-h-none m-0 p-0 border-0 bg-transparent';

        if ($this->backdrop !== 'none') {
            $base .= ' backdrop:bg-black backdrop:bg-opacity-50';

            if ($this->backdrop === 'blur') {
                $base .= ' backdrop:backdrop-blur-sm';
            }
        }

        return $base;
    }

    public function containerClasses(): string
    {
        $base = 'flex w-full h-full';

        if ($this->centered) {
            $base .= ' items-center justify-center';
        } else {
            $base .= ' items-start justify-center pt-16';
        }

        return $base . ' p-4';
    }

    public function modalClasses(): string
    {
        $base = 'relative bg-surface border border-border shadow-xl rounded-lg';

        $sizeClasses = match ($this->size) {
            'xs' => 'max-w-xs',
            'sm' => 'max-w-sm',
            'md' => 'max-w-md',
            'lg' => 'max-w-lg',
            'xl' => 'max-w-xl',
            'full' => 'max-w-full w-full max-h-full',
            default => 'max-w-md'
        };

        if ($this->scrollable && $this->size !== 'full') {
            $base .= ' max-h-[80vh] flex flex-col';
        }

        return trim("{$base} {$sizeClasses}");
    }

    public function headerClasses(): string
    {
        $base = 'flex items-center justify-between p-6 border-b border-border';

        if ($this->scrollable) {
            $base .= ' flex-shrink-0';
        }

        return $base;
    }

    public function bodyClasses(): string
    {
        $base = 'p-6';

        if ($this->scrollable) {
            $base .= ' flex-1 overflow-y-auto';
        }

        return $base;
    }

    public function footerClasses(): string
    {
        $base = 'flex items-center justify-end gap-3 p-6 border-t border-border';

        if ($this->scrollable) {
            $base .= ' flex-shrink-0';
        }

        return $base;
    }

    public function getComputedDialogClasses(): string
    {
        return $this->dialogClasses();
    }

    public function getComputedContainerClasses(): string
    {
        return $this->containerClasses();
    }

    public function getComputedModalClasses(): string
    {
        return $this->modalClasses();
    }

    public function getComputedHeaderClasses(): string
    {
        return $this->headerClasses();
    }

    public function getComputedBodyClasses(): string
    {
        return $this->bodyClasses();
    }

    public function getComputedFooterClasses(): string
    {
        return $this->footerClasses();
    }

    public function hasHeader(): bool
    {
        return ($this->attributes && isset($this->attributes['header'])) ||
               ($this->attributes && !empty(trim($this->attributes->get('header', ''))));
    }

    public function hasFooter(): bool
    {
        return ($this->attributes && isset($this->attributes['footer'])) ||
               ($this->attributes && !empty(trim($this->attributes->get('footer', ''))));
    }

    public function isLivewireEnabled(): bool
    {
        return !is_null($this->wireModel) || ($this->attributes && $this->attributes->has('wire:model'));
    }

    public function getWireModelAttribute(): ?string
    {
        return $this->wireModel ?? ($this->attributes ? $this->attributes->get('wire:model') : null);
    }

    public function getLivewireAttributes(): array
    {
        $attributes = [];

        if ($wireModel = $this->getWireModelAttribute()) {
            $attributes['wire:model'] = $wireModel;
        }

        if ($this->isLivewireEnabled()) {
            $attributes['data-modal-livewire'] = true;
        }

        if ($this->lazy) {
            $attributes['data-modal-lazy'] = true;
        }

        if ($this->persistent) {
            $attributes['data-modal-persistent'] = true;
        }

        if (!$this->trapFocus) {
            $attributes['data-modal-no-focus-trap'] = true;
        }

        return $attributes;
    }

    public function getEventAttributes(): array
    {
        $events = [];

        if (!$this->attributes) {
            return $events;
        }

        foreach (['open', 'close', 'escape', 'cancel'] as $event) {
            $wireEvent = $this->attributes->get("wire:{$event}");
            $alpineEvent = $this->attributes->get("@{$event}");

            if ($wireEvent) {
                $events["wire:{$event}"] = $wireEvent;
            }

            if ($alpineEvent) {
                $events["@{$event}"] = $alpineEvent;
            }
        }

        return $events;
    }

    public function render()
    {
        return view('keys::components.modal', [
            'computedDialogClasses' => $this->getComputedDialogClasses(),
            'computedContainerClasses' => $this->getComputedContainerClasses(),
            'computedModalClasses' => $this->getComputedModalClasses(),
            'computedHeaderClasses' => $this->getComputedHeaderClasses(),
            'computedBodyClasses' => $this->getComputedBodyClasses(),
            'computedFooterClasses' => $this->getComputedFooterClasses(),
            'livewireAttributes' => $this->getLivewireAttributes(),
            'eventAttributes' => $this->getEventAttributes(),
        ]);
    }
}
