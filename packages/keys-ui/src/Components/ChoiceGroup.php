<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class ChoiceGroup extends Component
{
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

    public function fieldsetClasses(): string
    {
        return 'space-y-3';
    }

    public function legendClasses(): string
    {
        $sizeClasses = match ($this->size) {
            'sm' => 'text-sm',
            'md' => 'text-base',
            'lg' => 'text-lg',
            default => 'text-base'
        };

        $colorClasses = $this->disabled ? 'text-neutral-500 dark:text-neutral-400' : 'text-foreground';

        return trim('font-medium mb-2 ' . $sizeClasses . ' ' . $colorClasses);
    }

    public function descriptionClasses(): string
    {
        $sizeClasses = match ($this->size) {
            'sm' => 'text-xs',
            'md' => 'text-sm',
            'lg' => 'text-sm',
            default => 'text-sm'
        };

        return trim('text-muted mb-3 ' . $sizeClasses);
    }

    public function choicesClasses(): string
    {
        return match ($this->layout) {
            'stacked' => 'space-y-3',
            'grid' => 'grid grid-cols-1 md:grid-cols-2 gap-3',
            'inline' => 'flex flex-wrap gap-4',
            default => 'space-y-3'
        };
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

    public function render()
    {
        return view('keys::components.choice-group');
    }
}
