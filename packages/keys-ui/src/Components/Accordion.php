<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Accordion extends Component
{
    public function __construct(
        public ?string $title = null,
        public ?string $id = null,
        public ?string $icon = 'heroicon-o-chevron-down',
        public bool $collapsed = false,
        public bool $disabled = false,
        public string $color = 'neutral',
        public string $size = 'md',
        public string $variant = 'default',
        public string $rounded = 'lg',
        public array $actions = [],
        public string $actionVariant = 'ghost',
        public string $actionSize = 'xs',
        public bool $animated = true
    ) {
        $this->id = $this->id ?? 'accordion-' . uniqid();

        
        $validColors = ['brand', 'success', 'warning', 'danger', 'neutral'];
        if (!in_array($this->color, $validColors)) {
            $this->color = 'neutral';
        }

        
        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg'])) {
            $this->size = 'md';
        }

        
        $validVariants = ['default', 'flush', 'spaced', 'outlined', 'elevated'];
        if (!in_array($this->variant, $validVariants)) {
            $this->variant = 'default';
        }

        
        $validRounded = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
        if (!in_array($this->rounded, $validRounded)) {
            $this->rounded = 'lg';
        }
    }

    public function hasActions(): bool
    {
        return !empty($this->actions);
    }

    public function getComputedActionSize(): string
    {
        return match ($this->actionSize) {
            'xs' => 'xs',
            'sm' => 'sm',
            'md' => 'md',
            default => 'xs'
        };
    }

    public function getComputedActionData(): array
    {
        $actions = [];

        foreach ($this->actions as $action) {
            $computedAction = [
                'type' => $action['type'],
                'icon' => $action['icon'],
                'label' => $action['label'],
                'is_multi_state' => isset($action['icon_toggle']) || isset($action['icon_success']),
                'data_action' => $action['type'],
                'data_icon_default' => $action['icon'],
                'icon_toggle' => $action['icon_toggle'] ?? null,
                'icon_success' => $action['icon_success'] ?? null,
                'label_toggle' => $action['label_toggle'] ?? null,
                'label_success' => $action['label_success'] ?? null,
                'data_url' => $action['url'] ?? null,
                'data_icon_toggle' => $action['icon_toggle'] ?? null,
                'data_icon_success' => $action['icon_success'] ?? null,
                'data_label_toggle' => $action['label_toggle'] ?? null,
                'data_label_success' => $action['label_success'] ?? null,
            ];

            $actions[] = $computedAction;
        }

        return $actions;
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-accordion' => 'true',
            'data-variant' => $this->variant,
            'data-size' => $this->size,
            'data-color' => $this->color,
            'data-rounded' => $this->rounded,
        ];

        
        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->animated) {
            $attributes['data-animated'] = 'true';
        }

        if ($this->hasActions()) {
            $attributes['data-has-actions'] = 'true';
        }

        if ($this->icon) {
            $attributes['data-has-icon'] = 'true';
            $attributes['data-icon'] = $this->icon;
        }

        if ($this->title) {
            $attributes['data-has-title'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.accordion', [
            'computedActionSize' => $this->getComputedActionSize(),
            'computedActionData' => $this->getComputedActionData(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}