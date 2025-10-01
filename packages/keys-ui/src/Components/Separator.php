<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Separator extends Component
{
    public function __construct(
        public string $variant = 'line',
        public string $orientation = 'horizontal',
        public string $color = 'neutral',
        public string $size = 'sm',
        public string $spacing = 'md',
        public string $alignment = 'center',
        public ?string $icon = null
    ) {
        if (!in_array($this->variant, ['line', 'text', 'icon', 'gradient', 'dashed'])) {
            $this->variant = 'line';
        }

        if (!in_array($this->orientation, ['horizontal', 'vertical'])) {
            $this->orientation = 'horizontal';
        }

        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg'])) {
            $this->size = 'sm';
        }

        if (!in_array($this->spacing, ['none', 'xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->spacing = 'md';
        }

        if (!in_array($this->alignment, ['left', 'center', 'right'])) {
            $this->alignment = 'center';
        }

        $validColors = [
            'brand', 'success', 'warning', 'danger', 'neutral',
            'blue', 'gray', 'red', 'green', 'yellow', 'indigo', 'purple', 'pink'
        ];
        if (!in_array($this->color, $validColors)) {
            $this->color = 'neutral';
        }
    }

    public function isIconOnly(string $slotContent = ''): bool
    {
        return !empty($this->icon) && empty(trim(strip_tags($slotContent)));
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-separator' => 'true',
            'data-variant' => $this->variant,
            'data-orientation' => $this->orientation,
            'data-color' => $this->color,
            'data-size' => $this->size,
            'data-spacing' => $this->spacing,
            'data-alignment' => $this->alignment,
        ];

        if (!empty($this->icon)) {
            $attributes['data-has-icon'] = 'true';
            $attributes['data-icon'] = $this->icon;
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.separator', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}