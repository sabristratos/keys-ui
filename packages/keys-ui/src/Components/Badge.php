<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Badge extends Component
{
    public function __construct(
        public string $variant = 'simple',
        public string $color = 'blue',
        public string $size = 'sm',
        public ?string $icon = null,
        public bool $dismissible = false,
        public ?string $id = null
    ) {
        if ($this->dismissible && !$this->id) {
            $this->id = 'badge-' . uniqid();
        }

        if (!in_array($this->variant, ComponentConstants::BADGE_VARIANTS)) {
            $this->variant = 'simple';
        }

        if (!in_array($this->size, ComponentConstants::BADGE_SIZES)) {
            $this->size = 'sm';
        }

        if (!ComponentConstants::isValidColorForComponent($this->color, 'badge')) {
            $this->color = 'blue';
        }

        if ($this->dismissible && $this->variant === 'simple') {
            $this->variant = 'chip';
        }

        if ($this->dismissible && $this->variant === 'subtle') {
            $this->dismissible = false;
        }
    }

    public function isIconOnly(string $slotContent = ''): bool
    {
        return !empty($this->icon) && empty(trim(strip_tags($slotContent)));
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-badge' => 'true',
            'data-variant' => $this->variant,
            'data-color' => $this->color,
            'data-size' => $this->size,
        ];

        if ($this->dismissible) {
            $attributes['data-dismissible'] = 'true';
            $attributes['data-badge-id'] = $this->id;
        }

        if ($this->icon) {
            $attributes['data-has-icon'] = 'true';
            $attributes['data-icon'] = $this->icon;
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.badge', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
