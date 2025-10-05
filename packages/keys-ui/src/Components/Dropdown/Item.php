<?php

namespace Keys\UI\Components\Dropdown;

use Illuminate\View\Component;

class Item extends Component
{
    public function __construct(
        public ?string $href = null,
        public ?string $icon = null,
        public ?string $kbd = null,
        public string $variant = 'default',
        public bool $disabled = false,
        public bool $keepOpen = false,
        public ?string $target = null,
        public ?string $iconToggle = null,
        public ?string $iconSuccess = null,
        public ?string $labelToggle = null,
        public ?string $labelSuccess = null
    ) {
        if (!in_array($this->variant, ['default', 'brand', 'danger', 'success', 'warning', 'info'])) {
            $this->variant = 'default';
        }
    }

    public function isLink(): bool
    {
        return !is_null($this->href);
    }

    public function elementType(): string
    {
        if ($this->isLink()) {
            return $this->disabled ? 'div' : 'a';
        }

        return 'button';
    }

    public function isMultiState(): bool
    {
        return !is_null($this->iconToggle) || !is_null($this->iconSuccess);
    }

    public function hasIcon(): bool
    {
        return !empty($this->icon);
    }

    public function hasKbd(): bool
    {
        return !empty($this->kbd);
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-dropdown-item' => 'true',
            'data-variant' => $this->variant,
            'data-keep-open' => $this->keepOpen ? 'true' : 'false',
            'data-disabled' => $this->disabled ? 'true' : 'false'
        ];

        if ($this->isMultiState()) {
            $attributes['data-multi-state'] = 'true';
            $attributes['data-icon-default'] = $this->icon;

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

        if ($this->hasIcon()) {
            $attributes['data-has-icon'] = 'true';
        }

        if ($this->hasKbd()) {
            $attributes['data-has-kbd'] = 'true';
        }

        return $attributes;
    }

    public function getElementAttributes(): array
    {
        $attributes = [
            'role' => 'menuitem',
            'tabindex' => '-1'
        ];

        if ($this->disabled) {
            $attributes['disabled'] = true;
        }

        if ($this->isLink() && !$this->disabled) {
            $attributes['href'] = $this->href;
            if ($this->target) {
                $attributes['target'] = $this->target;
            }
        } elseif (!$this->isLink()) {
            $attributes['type'] = 'button';
        }

        return array_merge($attributes, $this->getDataAttributes());
    }

    public function render()
    {
        return view('keys::components.dropdown.item', [
            'elementAttributes' => $this->getElementAttributes(),
        ]);
    }
}
