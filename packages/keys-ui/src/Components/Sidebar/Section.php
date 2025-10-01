<?php

namespace Keys\UI\Components\Sidebar;

use Illuminate\View\Component;

class Section extends Component
{
    public function __construct(
        public ?string $heading = null,
        public ?string $icon = 'heroicon-o-chevron-down',
        public bool $collapsible = true,
        public bool $collapsed = false,
        public string $variant = 'default',
        public ?string $id = null,
    ) {
        $this->id = $this->id ?? 'sidebar-section-' . uniqid();

        if (!in_array($this->variant, ['default', 'compact'])) {
            $this->variant = 'default';
        }
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-sidebar-section' => 'true',
            'data-variant' => $this->variant,
        ];

        if ($this->collapsible) {
            $attributes['data-collapsible'] = 'true';
        }

        if (!empty($this->heading)) {
            $attributes['data-has-heading'] = 'true';
        }

        if (!empty($this->icon) && $this->collapsible) {
            $attributes['data-has-icon'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.sidebar.section', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
