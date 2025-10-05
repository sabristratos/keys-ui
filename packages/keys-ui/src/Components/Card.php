<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Card extends Component
{
    public function __construct(
        public string $variant = 'default',
        public string $colorVariant = 'neutral',
        public string $padding = 'lg',
        public string $rounded = 'lg',
        public string $shadow = 'xs',
        public bool $selected = false,
        public bool $loading = false,
        public ?string $loadingText = null,
        public ?string $href = null,
        public bool $disabled = false,
        public ?string $imageUrl = null,
        public ?string $imageAlt = null,
        public string $imagePosition = 'top',
        public string $density = 'comfortable'
    ) {}

    public function isLink(): bool
    {
        return ! is_null($this->href);
    }

    public function elementType(): string
    {
        if ($this->isLink()) {
            return $this->disabled ? 'div' : 'a';
        }

        return 'div';
    }

    public function hasImage(): bool
    {
        return !is_null($this->imageUrl);
    }

    public function shouldShowSkeleton(): bool
    {
        return $this->loading;
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-card' => 'true',
            'data-variant' => $this->variant,
            'data-color-variant' => $this->colorVariant,
            'data-padding' => $this->padding,
            'data-rounded' => $this->rounded,
            'data-shadow' => $this->shadow,
            'data-element-type' => $this->elementType(),
            'data-density' => $this->density,
        ];

        if ($this->selected) {
            $attributes['data-selected'] = 'true';
        }

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->loading) {
            $attributes['data-loading'] = 'true';
            $attributes['aria-busy'] = 'true';
            if ($this->loadingText) {
                $attributes['aria-label'] = $this->loadingText;
            }
        }

        if ($this->href) {
            $attributes['data-href'] = $this->href;
            $attributes['data-clickable'] = 'true';
        }

        if ($this->hasImage()) {
            $attributes['data-has-image'] = 'true';
            $attributes['data-image-position'] = $this->imagePosition;
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.card', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
