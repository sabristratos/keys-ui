<?php

namespace Keys\UI\Components\Sidebar;

use Illuminate\View\Component;

class Item extends Component
{
    public function __construct(
        public ?string $href = null,
        public ?string $icon = null,
        public bool $active = false,
        public bool $disabled = false,
        public ?string $target = null,
        public ?string $badge = null,
        public string $badgeVariant = 'neutral',
        public ?string $iconToggle = null,
        public ?string $iconSuccess = null,
    ) {
        if (!in_array($this->badgeVariant, ['neutral', 'brand', 'success', 'warning', 'danger'])) {
            $this->badgeVariant = 'neutral';
        }
    }

    public function elementType(): string
    {
        if (!is_null($this->href)) {
            return $this->disabled ? 'div' : 'a';
        }

        return 'button';
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-sidebar-item' => 'true',
            'data-badge-variant' => $this->badgeVariant,
        ];

        if ($this->active) {
            $attributes['data-active'] = 'true';
            $attributes['aria-current'] = 'page';
        }

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if (!is_null($this->iconToggle) || !is_null($this->iconSuccess)) {
            $attributes['data-multi-state'] = 'true';
            $attributes['data-icon-default'] = $this->icon;

            if ($this->iconToggle) {
                $attributes['data-icon-toggle'] = $this->iconToggle;
            }

            if ($this->iconSuccess) {
                $attributes['data-icon-success'] = $this->iconSuccess;
            }
        }

        if (!empty($this->icon)) {
            $attributes['data-has-icon'] = 'true';
        }

        if (!empty($this->badge)) {
            $attributes['data-has-badge'] = 'true';
        }

        return $attributes;
    }

    public function getElementAttributes(): array
    {
        $attributes = [
            'role' => 'menuitem',
        ];

        if ($this->disabled) {
            $attributes['disabled'] = true;
            $attributes['aria-disabled'] = 'true';
        }

        if (!is_null($this->href) && !$this->disabled) {
            $attributes['href'] = $this->href;
            if ($this->target) {
                $attributes['target'] = $this->target;
            }
        } elseif (is_null($this->href)) {
            $attributes['type'] = 'button';
        }

        return array_merge($attributes, $this->getDataAttributes());
    }

    public function render()
    {
        return view('keys::components.sidebar.item', [
            'elementAttributes' => $this->getElementAttributes(),
        ]);
    }
}
