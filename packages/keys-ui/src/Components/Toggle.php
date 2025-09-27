<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Toggle extends Component
{
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = '1',
        public bool $checked = false,
        public bool $disabled = false,
        public bool $required = false,
        public string $color = 'brand',
        public string $size = 'md',
        public ?string $label = null,
        public ?string $description = null,
        public ?string $hint = null,  // Add hint support
        public string $labelPosition = 'right',
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public array $actions = [],
        public string $actionVariant = 'ghost',
        public string $actionSize = 'xs',
        public bool $hasError = false
    ) {
        $this->id = $this->id ?? $this->name ?? 'toggle-'.uniqid();

        if (! $this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
    }

    public function hasError(): bool
    {
        return $this->hasError || $this->hasErrors();
    }

    public function hasErrors(): bool
    {
        if (is_null($this->errors)) {
            return false;
        }

        if (is_string($this->errors)) {
            return ! empty(trim($this->errors));
        }

        if (is_array($this->errors)) {
            return ! empty($this->errors);
        }

        if ($this->errors instanceof Collection) {
            return $this->errors->isNotEmpty();
        }

        return false;
    }

    public function hasActions(): bool
    {
        return ! empty($this->actions);
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

    public function hasContent(): bool
    {
        return $this->label || $this->description;
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-toggle' => 'true',
            'data-size' => $this->size,
            'data-color' => $this->color,
            'data-label-position' => $this->labelPosition,
            'data-value' => $this->value,
        ];

        // State attributes
        if ($this->checked) {
            $attributes['data-checked'] = 'true';
        }

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        if ($this->hasError()) {
            $attributes['data-invalid'] = 'true';
        }

        // Content attributes
        if ($this->hasContent()) {
            $attributes['data-has-content'] = 'true';
        }

        if ($this->label) {
            $attributes['data-has-label'] = 'true';
        }

        if ($this->description) {
            $attributes['data-has-description'] = 'true';
        }

        if ($this->hint) {
            $attributes['data-has-hint'] = 'true';
        }

        // Actions
        if ($this->hasActions()) {
            $attributes['data-has-actions'] = 'true';
            $attributes['data-actions-count'] = count($this->actions);
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.toggle', [
            'computedActionData' => $this->getComputedActionData(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
