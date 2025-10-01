<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Radio extends Component
{
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = null,
        public bool $checked = false,
        public bool $disabled = false,
        public bool $required = false,
        public string $variant = 'standard',
        public string $color = 'brand',
        public string $size = 'md',
        public ?string $label = null,
        public ?string $description = null,
        public ?string $title = null,
        public ?string $icon = null,
        public string $labelPosition = 'right',
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public array $actions = [],
        public string $actionVariant = 'ghost',
        public string $actionSize = 'xs',
        public bool $hasError = false,
        public bool $showInput = true
    ) {

        $this->id = $this->id ?? ($this->name ? $this->name.'-'.$this->value : 'radio-'.uniqid());

        if (! $this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }

        if (! in_array($this->variant, ComponentConstants::FORM_VARIANTS)) {
            $this->variant = 'standard';
        }

        if (! ComponentConstants::isValidSize($this->size)) {
            $this->size = ComponentConstants::getDefaultSize();
        }

        if (! in_array($this->color, ComponentConstants::SEMANTIC_COLORS)) {
            $this->color = ComponentConstants::getDefaultColor();
        }

        if ($this->variant === 'card' && ! $this->title && $this->label) {
            $this->title = $this->label;
            $this->label = null;
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

        
        if (is_object($this->errors) && method_exists($this->errors, 'any')) {
            return $this->errors->any();
        }

        
        if (is_object($this->errors) && method_exists($this->errors, 'getBag')) {
            try {
                $bag = $this->errors->getBag('default');

                return $bag && $bag->any();
            } catch (\Exception $e) {
                
                return false;
            }
        }

        return false;
    }

    public function iconSize(): string
    {
        return match ($this->size) {
            'sm' => 'sm',
            'md' => 'md',
            'lg' => 'lg',
            default => 'md'
        };
    }

    public function hasActions(): bool
    {
        return ! empty($this->actions);
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

    public function isCard(): bool
    {
        return $this->variant === 'card';
    }

    public function hasContent(): bool
    {
        return $this->label || $this->title || $this->description;
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-radio' => 'true',
            'data-variant' => $this->variant,
            'data-color' => $this->color,
            'data-size' => $this->size,
            'data-value' => $this->value,
        ];

        
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

        
        if ($this->hasContent()) {
            $attributes['data-has-content'] = 'true';
        }

        if ($this->icon) {
            $attributes['data-has-icon'] = 'true';
            $attributes['data-icon'] = $this->icon;
        }

        if ($this->description) {
            $attributes['data-has-description'] = 'true';
        }

        
        if ($this->hasActions()) {
            $attributes['data-has-actions'] = 'true';
            $attributes['data-actions-count'] = count($this->actions);
        }

        
        if (! $this->showInput) {
            $attributes['data-input-hidden'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.radio', [
            'computedActionSize' => $this->getComputedActionSize(),
            'computedActionData' => $this->getComputedActionData(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
