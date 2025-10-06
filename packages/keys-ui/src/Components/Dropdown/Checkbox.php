<?php

namespace Keys\UI\Components\Dropdown;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Concerns\HandlesValidationErrors;

class Checkbox extends Component
{
    use HandlesValidationErrors;

    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = '1',
        public bool $checked = false,
        public bool $disabled = false,
        public bool $indeterminate = false,
        public ?string $icon = null,
        public string $color = 'brand',
        public ?string $wireModel = null,
        public string|array|Collection|null $errors = null,
        public bool $keepOpen = true
    ) {
        $this->id = $this->id ?? ($this->name ? $this->name.'-'.$this->value.'-'.uniqid() : 'dropdown-checkbox-'.uniqid());

        if (! in_array($this->color, ['brand', 'success', 'warning', 'danger', 'neutral'])) {
            $this->color = 'brand';
        }
    }

    public function hasIcon(): bool
    {
        return ! empty($this->icon);
    }

    public function getDataAttributes(): array
    {
        return [
            'data-keys-dropdown-checkbox' => 'true',
            'data-keep-open' => $this->keepOpen ? 'true' : 'false',
            'data-color' => $this->color,
            'data-disabled' => $this->disabled ? 'true' : 'false',
            'data-checked' => $this->checked ? 'true' : 'false',
            'data-has-icon' => $this->hasIcon() ? 'true' : 'false',
            'data-has-error' => $this->hasError() ? 'true' : 'false'
        ];
    }

    public function getCheckboxAttributes(): array
    {
        $attributes = [
            'type' => 'checkbox',
            'id' => $this->id,
            'value' => $this->value,
            'checked' => $this->checked,
            'disabled' => $this->disabled,
        ];

        if ($this->name) {
            $attributes['name'] = $this->name;
        }

        if ($this->wireModel) {
            $attributes['wire:model'] = $this->wireModel;
        }

        if ($this->indeterminate) {
            $attributes['data-indeterminate'] = 'true';
        }

        return $attributes;
    }

    public function getLabelAttributes(): array
    {
        return [
            'for' => $this->id,
        ];
    }

    public function render()
    {
        return view('keys::components.dropdown.checkbox', [
            'dataAttributes' => $this->getDataAttributes(),
            'checkboxAttributes' => $this->getCheckboxAttributes(),
            'labelAttributes' => $this->getLabelAttributes(),
        ]);
    }
}
