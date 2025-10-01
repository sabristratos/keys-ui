<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Sidebar extends Component
{
    public function __construct(
        public ?string $id = null,
        public string $position = 'left',
        public string $width = 'md',
        public string $variant = 'default',
        public bool $collapsible = true,
        public bool $collapsed = false,
        public bool $sticky = false,
        public ?string $ariaLabel = null,
        public ?string $title = null,
        public ?string $subtitle = null,
    ) {
        $this->id = $this->id ?? 'sidebar-' . uniqid();

        if (!in_array($this->position, ['left', 'right'])) {
            $this->position = 'left';
        }

        if (!in_array($this->width, ['xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->width = 'md';
        }

        if (!in_array($this->variant, ['default', 'bordered', 'elevated', 'transparent'])) {
            $this->variant = 'default';
        }
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-sidebar' => 'true',
            'data-position' => $this->position,
            'data-width' => $this->width,
            'data-variant' => $this->variant,
        ];

        if ($this->collapsible) {
            $attributes['data-collapsible'] = 'true';
            $attributes['data-collapsed'] = $this->collapsed ? 'true' : 'false';
        }

        if ($this->sticky) {
            $attributes['data-sticky'] = 'true';
        }

        return $attributes;
    }

    public function getAriaAttributes(): array
    {
        $attributes = [
            'role' => 'navigation',
        ];

        if ($this->ariaLabel) {
            $attributes['aria-label'] = $this->ariaLabel;
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.sidebar', [
            'dataAttributes' => $this->getDataAttributes(),
            'ariaAttributes' => $this->getAriaAttributes(),
        ]);
    }
}
