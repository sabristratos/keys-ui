<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Slideout Component
 *
 * A slideout panel component using native <dialog> element with slide-in/out animations.
 * Supports multiple positions (left, right, top, bottom), sizes, backdrop variants,
 * and full Livewire integration. Uses pure CSS animations without JavaScript.
 */
class Slideout extends Component
{

    /**
     * Create a new Slideout component instance.
     *
     * @param  string  $id  Unique identifier for the slideout
     * @param  string  $position  Slideout position (left, right)
     * @param  string  $size  Slideout size (xs, sm, md, lg, xl, full)
     * @param  string|null  $width  Custom width (e.g., "500px", "40rem") - overrides size
     * @param  string  $closedby  How slideout can be closed (any, closerequest, none)
     * @param  string  $backdrop  Backdrop variant (blur, dark, none)
     * @param  bool  $scrollable  Whether slideout body is scrollable
     * @param  bool  $animate  Whether to use CSS animations
     * @param  bool  $dismissible  Whether to show close button
     * @param  bool  $lazy  Whether to lazy load slideout content
     * @param  bool  $persistent  Whether slideout persists across navigation
     * @param  bool  $trapFocus  Whether to trap focus within slideout
     * @param  string|null  $wireModel  Livewire model binding
     */
    public function __construct(
        public string $id,
        public string $position = 'right',
        public string $size = 'md',
        public ?string $width = null,
        public string $closedby = 'any',
        public string $backdrop = 'blur',
        public bool $scrollable = false,
        public bool $animate = true,
        public bool $dismissible = true,
        public bool $lazy = false,
        public bool $persistent = false,
        public bool $trapFocus = true,
        public ?string $wireModel = null
    ) {


        if (!in_array($this->position, ['left', 'right'])) {
            $this->position = 'right';
        }


        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_EXTENDED, 'md');


        if (!in_array($this->closedby, ['any', 'closerequest', 'none'])) {
            $this->closedby = 'any';
        }

        
        if (!in_array($this->backdrop, ['blur', 'dark', 'none'])) {
            $this->backdrop = 'blur';
        }
    }

    /**
     * Check if slideout has header content.
     */
    public function hasHeader(): bool
    {
        return ($this->attributes && isset($this->attributes['header'])) ||
               ($this->attributes && !empty(trim($this->attributes->get('header', ''))));
    }

    /**
     * Check if slideout has footer content.
     */
    public function hasFooter(): bool
    {
        return ($this->attributes && isset($this->attributes['footer'])) ||
               ($this->attributes && !empty(trim($this->attributes->get('footer', ''))));
    }

    /**
     * Check if Livewire integration is enabled.
     */
    public function isLivewireEnabled(): bool
    {
        return !is_null($this->wireModel) || ($this->attributes && $this->attributes->has('wire:model'));
    }

    /**
     * Get the Livewire model attribute value.
     */
    public function getWireModelAttribute(): ?string
    {
        return $this->wireModel ?? ($this->attributes ? $this->attributes->get('wire:model') : null);
    }

    /**
     * Generate Livewire-specific attributes.
     */
    public function getLivewireAttributes(): array
    {
        $attributes = [];

        if ($wireModel = $this->getWireModelAttribute()) {
            $attributes['wire:model'] = $wireModel;
        }

        if ($this->isLivewireEnabled()) {
            $attributes['data-slideout-livewire'] = true;
        }

        if ($this->lazy) {
            $attributes['data-slideout-lazy'] = true;
        }

        if ($this->persistent) {
            $attributes['data-slideout-persistent'] = true;
        }

        if (!$this->trapFocus) {
            $attributes['data-slideout-no-focus-trap'] = true;
        }

        return $attributes;
    }

    /**
     * Generate event handling attributes.
     */
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

    /**
     * Generate comprehensive data attributes for component targeting and state management.
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-slideout' => 'true',
            'data-position' => $this->position,
            'data-size' => $this->size,
            'data-backdrop' => $this->backdrop,
            'data-closedby' => $this->closedby,
        ];

        
        if ($this->animate) {
            $attributes['data-animate'] = 'true';
        }

        if ($this->scrollable) {
            $attributes['data-scrollable'] = 'true';
        }

        
        if ($this->hasHeader()) {
            $attributes['data-has-header'] = 'true';
        }

        if ($this->hasFooter()) {
            $attributes['data-has-footer'] = 'true';
        }

        
        if ($this->lazy) {
            $attributes['data-lazy'] = 'true';
        }

        if ($this->persistent) {
            $attributes['data-persistent'] = 'true';
        }

        if ($this->isLivewireEnabled()) {
            $attributes['data-livewire-enabled'] = 'true';
        }

        
        if (!$this->trapFocus) {
            $attributes['data-trap-focus'] = 'false';
        }

        return $attributes;
    }

    /**
     * Render the slideout component view.
     */
    public function render()
    {
        return view('keys::components.slideout', [
            'hasHeader' => $this->hasHeader(),
            'hasFooter' => $this->hasFooter(),
            'isLivewireEnabled' => $this->isLivewireEnabled(),
            'wireModelAttribute' => $this->getWireModelAttribute(),
            'livewireAttributes' => $this->getLivewireAttributes(),
            'eventAttributes' => $this->getEventAttributes(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
