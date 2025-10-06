<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Concerns\HandlesValidationErrors;
use Keys\UI\Concerns\HasActions;

class Toggle extends Component
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
        public string $color = 'brand',
        public string $size = 'md',
        public ?string $label = null,
        public ?string $description = null,
        public ?string $hint = null,  
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

        if ($this->label) {
            $attributes['data-has-label'] = 'true';
        }

        if ($this->description) {
            $attributes['data-has-description'] = 'true';
        }

        if ($this->hint) {
            $attributes['data-has-hint'] = 'true';
        }

        
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
