<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Button extends Component
{
    public function __construct(
        public string $variant = 'brand',
        public string $size = 'md',
        public ?string $type = null,
        public ?string $href = null,
        public bool $disabled = false,
        public bool $loading = false,
        public ?string $icon = null,
        public ?string $iconLeft = null,
        public ?string $iconRight = null,
        public string $loadingAnimation = 'spinner',
        public ?string $iconToggle = null,
        public ?string $iconSuccess = null,
        public ?string $labelToggle = null,
        public ?string $labelSuccess = null
    ) {
        if ($this->icon && !$this->iconLeft) {
            $this->iconLeft = $this->icon;
        }

        if (!in_array($this->variant, ComponentConstants::BUTTON_VARIANTS)) {
            $this->variant = ComponentConstants::getDefaultColor();
        }

        if (!ComponentConstants::isValidSize($this->size)) {
            $this->size = ComponentConstants::getDefaultSize();
        }

        if (!in_array($this->loadingAnimation, ComponentConstants::BUTTON_LOADING_ANIMATIONS)) {
            $this->loadingAnimation = 'spinner';
        }
    }

    public function isLink(): bool
    {
        return ! is_null($this->href);
    }

    public function elementType(): string
    {
        if ($this->isLink()) {
            return $this->disabled ? 'span' : 'a';
        }

        return 'button';
    }

    public function buttonType(): ?string
    {
        if ($this->isLink()) {
            return null;
        }

        return $this->type ?? 'button';
    }


    public function isIconOnly(string $slotContent = ''): bool
    {
        $contentWithoutSrOnly = preg_replace('/<[^>]*sr-only[^>]*>.*?<\/[^>]*>/s', '', $slotContent);
        $contentWithoutSrOnly = preg_replace('/<[^>]*sr-only[^>]*>/s', '', $contentWithoutSrOnly);

        return trim(strip_tags($contentWithoutSrOnly)) === '' && ($this->iconLeft || $this->iconRight);
    }

    public function isMultiState(): bool
    {
        return ! is_null($this->iconToggle) || ! is_null($this->iconSuccess);
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-button' => 'true',
            'data-variant' => $this->variant,
            'data-size' => $this->size,
            'data-element-type' => $this->elementType(),
        ];

        // Add state attributes
        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->loading) {
            $attributes['data-loading'] = 'true';
            $attributes['data-loading-animation'] = $this->loadingAnimation;
        }

        // Multi-state functionality (preserve existing behavior)
        if ($this->isMultiState()) {
            $attributes['data-multi-state'] = 'true';
            $attributes['data-icon-default'] = $this->iconLeft;

            if ($this->iconToggle) {
                $attributes['data-icon-toggle'] = $this->iconToggle;
            }

            if ($this->iconSuccess) {
                $attributes['data-icon-success'] = $this->iconSuccess;
            }

            if ($this->labelToggle) {
                $attributes['data-label-toggle'] = $this->labelToggle;
            }

            if ($this->labelSuccess) {
                $attributes['data-label-success'] = $this->labelSuccess;
            }
        }

        // Icon state
        if ($this->iconLeft || $this->iconRight) {
            $attributes['data-has-icon'] = 'true';
        }

        // Link specific attributes
        if ($this->isLink()) {
            $attributes['data-href'] = $this->href;
        }

        return $attributes;
    }

    public function getDataAttributesForSlot(string $slotContent = ''): array
    {
        $isIconOnly = $this->isIconOnly($slotContent);

        return [
            'data-icon-only' => $isIconOnly ? 'true' : 'false',
        ];
    }

    public function render()
    {
        return view('keys::components.button');
    }
}
