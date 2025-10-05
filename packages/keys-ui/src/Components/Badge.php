<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Badge extends Component
{
    private const VALID_VARIANTS = ['filled', 'outlined', 'subtle'];
    private const VALID_SIZES = ['xs', 'sm', 'md'];
    private const VALID_COLORS = [
        'brand', 'success', 'warning', 'danger', 'neutral', 'info',
        'red', 'green', 'blue', 'purple', 'yellow', 'indigo',
        'pink', 'gray', 'teal', 'orange', 'dark'
    ];

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

        if (!in_array($this->variant, self::VALID_VARIANTS)) {
            $this->variant = 'filled';
        }

        if (!in_array($this->size, self::VALID_SIZES)) {
            $this->size = 'sm';
        }

        if (!in_array($this->color, self::VALID_COLORS)) {
            $this->color = 'blue';
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
