<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Badge extends Component
{
    public function __construct(
        public string $variant = 'filled',
        public string $color = 'blue',
        public string $size = 'sm',
        public ?string $icon = null,
        public bool $dismissible = false,
        public ?string $id = null
    ) {
        if ($this->dismissible && !$this->id) {
            $this->id = 'badge-' . uniqid();
        }

        $this->variant = ComponentConstants::validate($this->variant, ComponentConstants::BADGE_VARIANTS, 'filled');
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_XS_TO_MD, 'sm');
        $this->color = ComponentConstants::validate($this->color, ComponentConstants::COLORS_EXTENDED, 'blue');

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
