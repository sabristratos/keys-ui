<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Modal Component
 *
 * A comprehensive modal component supporting multiple sizes, backdrop variants,
 * scrollable content, Livewire integration, and accessibility features.
 * Features focus trapping, lazy loading, persistent modals, and comprehensive
 * event handling for both Livewire and Alpine.js integration.
 */
class Modal extends Component
{

    /**
     * Create a new Modal component instance.
     *
     * @param  string  $id  Unique identifier for the modal
     * @param  string  $size  Modal size (xs, sm, md, lg, xl, full)
     * @param  string  $closedby  How modal can be closed (any, closerequest, none)
     * @param  string  $backdrop  Backdrop variant (blur, dark, none)
     * @param  bool  $centered  Whether modal is vertically centered
     * @param  bool  $scrollable  Whether modal body is scrollable
     * @param  bool  $animate  Whether to use CSS animations
     * @param  bool  $lazy  Whether to lazy load modal content
     * @param  bool  $persistent  Whether modal persists across navigation
     * @param  bool  $trapFocus  Whether to trap focus within modal
     * @param  string|null  $wireModel  Livewire model binding
     */
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


        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_EXTENDED, 'md');


        if (!in_array($this->closedby, ['any', 'closerequest', 'none'])) {
            $this->closedby = 'any';
        }


        if (!in_array($this->backdrop, ['blur', 'dark', 'none'])) {
            $this->backdrop = 'blur';
        }
    }

    /**
     * Check if modal has header content.
     * Business logic for detecting header slot content.
     */

    public function hasHeader(): bool
    {
        return ($this->attributes && isset($this->attributes['header'])) ||
               ($this->attributes && !empty(trim($this->attributes->get('header', ''))));
    }

    /**
     * Check if modal has footer content.
     * Business logic for detecting footer slot content.
     */
    public function hasFooter(): bool
    {
        return ($this->attributes && isset($this->attributes['footer'])) ||
               ($this->attributes && !empty(trim($this->attributes->get('footer', ''))));
    }

    /**
     * Check if Livewire integration is enabled.
     * Business logic for detecting Livewire model binding.
     */
    public function isLivewireEnabled(): bool
    {
        return !is_null($this->wireModel) || ($this->attributes && $this->attributes->has('wire:model'));
    }

    /**
     * Get the Livewire model attribute value.
     * Business logic for retrieving wire:model binding.
     */
    public function getWireModelAttribute(): ?string
    {
        return $this->wireModel ?? ($this->attributes ? $this->attributes->get('wire:model') : null);
    }

    /**
     * Generate Livewire-specific attributes.
     * Business logic for building Livewire integration attributes.
     */
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

    /**
     * Generate event handling attributes.
     * Business logic for building Livewire and Alpine.js event bindings.
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
     * Follows Keys UI data attributes naming convention for consistent CSS/JS targeting.
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-modal' => 'true',
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

        if (!$this->centered) {
            $attributes['data-centered'] = 'false';
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
     * Render the modal component view.
     * Passes only computed data and data attributes following modern CLAUDE.md patterns.
     */
    public function render()
    {
        return view('keys::components.modal', [
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
