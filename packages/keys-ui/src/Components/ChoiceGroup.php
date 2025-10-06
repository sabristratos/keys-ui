<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Concerns\HandlesValidationErrors;

class ChoiceGroup extends Component
{
    use HandlesValidationErrors;

    public function __construct(
        public ?string $name = null,
        public ?string $legend = null,
        public ?string $description = null,
        public string $type = 'checkbox',
        public string $layout = 'stacked',
        public string $size = 'md',
        public bool $required = false,
        public bool $disabled = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $hasError = false
    ) {

        if (!$this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }

        if (!in_array($this->type, ['checkbox', 'radio'])) {
            $this->type = 'checkbox';
        }

        if (!in_array($this->layout, ['stacked', 'grid', 'inline'])) {
            $this->layout = 'stacked';
        }
    }

    public function hasError(): bool
    {
        return $this->hasError || $this->hasErrors();
    }


    public function hasLegend(): bool
    {
        return ! is_null($this->legend) && ! empty(trim($this->legend));
    }

    public function hasDescription(): bool
    {
        return ! is_null($this->description) && ! empty(trim($this->description));
    }

    public function isRadioGroup(): bool
    {
        return $this->type === 'radio';
    }

    public function isCheckboxGroup(): bool
    {
        return $this->type === 'checkbox';
    }

    public function getAccessibilityAttributes(): array
    {
        $attributes = [];

        if ($this->hasError()) {
            $attributes['aria-invalid'] = 'true';
        }

        if ($this->required) {
            $attributes['aria-required'] = 'true';
        }

        if ($this->description) {
            $attributes['aria-describedby'] = $this->getDescriptionId();
        }

        return $attributes;
    }

    public function getDescriptionId(): string
    {
        return ($this->name ?? 'choicegroup') . '-description';
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-choice-group' => 'true',
            'data-type' => $this->type,
            'data-layout' => $this->layout,
            'data-size' => $this->size,
        ];

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        if ($this->hasError()) {
            $attributes['data-invalid'] = 'true';
        }

        if ($this->hasLegend()) {
            $attributes['data-has-legend'] = 'true';
        }

        if ($this->hasDescription()) {
            $attributes['data-has-description'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.choice-group', [
            'dataAttributes' => $this->getDataAttributes(),
            'accessibilityAttributes' => $this->getAccessibilityAttributes(),
        ]);
    }
}
