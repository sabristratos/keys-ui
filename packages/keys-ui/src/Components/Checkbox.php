<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Concerns\HandlesValidationErrors;
use Keys\UI\Concerns\HasActions;
use Keys\UI\Constants\ComponentConstants;

class Checkbox extends Component
{
    use HandlesValidationErrors;
    use HasActions;

    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = '1',
        public bool $checked = false,
        public bool $disabled = false,
        public bool $required = false,
        public bool $indeterminate = false,
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

        $this->id = $this->id ?? ($this->name ? $this->name.'-'.$this->value.'-'.uniqid() : 'checkbox-'.uniqid());

        if (! $this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }

        $this->variant = ComponentConstants::validate($this->variant, ComponentConstants::FORM_CONTROL_VARIANTS, 'standard');
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_XS_TO_XL, 'md');
        $this->color = ComponentConstants::validate($this->color, ComponentConstants::COLORS, 'brand');

        if ($this->variant === 'card' && ! $this->title && $this->label) {
            $this->title = $this->label;
            $this->label = null;
        }
    }

    public function hasError(): bool
    {
        return $this->hasError || $this->hasErrors();
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
            'data-keys-checkbox' => 'true',
            'data-variant' => $this->variant,
            'data-color' => $this->color,
            'data-size' => $this->size,
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

        if ($this->indeterminate) {
            $attributes['data-indeterminate'] = 'true';
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

        
        $attributes['data-value'] = $this->value;

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.checkbox', [
            'computedActionSize' => $this->getComputedActionSize(),
            'computedActionData' => $this->getComputedActionData(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
