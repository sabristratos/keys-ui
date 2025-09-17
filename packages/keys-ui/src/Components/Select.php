<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Select extends Component
{
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public mixed $value = null,
        public bool $multiple = false,
        public bool $searchable = false,
        public bool $clearable = false,
        public ?string $placeholder = null,
        public string $size = 'md',
        public bool $disabled = false,
        public bool $required = false,
        public ?string $label = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $hasError = false
    ) {

        $this->id = $this->id ?? $this->name;

        if ($this->multiple && !is_array($this->value)) {
            $this->value = $this->value ? [$this->value] : [];
        }


        if (!$this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
    }

    public function isShorthand(): bool
    {
        return !is_null($this->label);
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
            return !empty(trim($this->errors));
        }

        if (is_array($this->errors)) {
            return !empty($this->errors);
        }

        if ($this->errors instanceof Collection) {
            return $this->errors->isNotEmpty();
        }

        return false;
    }

    public function triggerClasses(): string
    {
        $base = 'relative w-full cursor-pointer rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
        $size = $this->sizeClasses();
        $state = $this->stateClasses();

        return trim($base . ' ' . $size . ' ' . $state);
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'px-3 py-1.5 text-sm',
            'md' => 'px-3 py-2 text-sm',
            'lg' => 'px-4 py-2.5 text-base',
            default => 'px-3 py-2 text-sm'
        };
    }

    public function stateClasses(): string
    {
        if ($this->disabled) {
            return 'bg-neutral-100 border-neutral-300 text-neutral-500 cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400';
        }

        if ($this->hasError()) {
            return 'bg-input border-danger text-foreground focus:border-danger focus:ring-danger';
        }

        return 'bg-input border-border text-foreground focus:border-brand focus:ring-brand hover:border-neutral-300 dark:hover:border-neutral-600';
    }

    public function dropdownClasses(): string
    {
        return 'absolute z-50 mt-1 w-full rounded-md bg-surface border border-border shadow-lg';
    }



    public function iconSize(): string
    {
        return match ($this->size) {
            'sm' => 'xs',
            'md' => 'sm',
            'lg' => 'md',
            default => 'sm'
        };
    }

    public function getSelectedValues(): array
    {
        if ($this->multiple) {
            return is_array($this->value) ? $this->value : [];
        }

        return $this->value ? [$this->value] : [];
    }

    public function isValueSelected($optionValue): bool
    {
        $selectedValues = $this->getSelectedValues();
        return in_array($optionValue, $selectedValues, true);
    }

    public function getComputedIconSize(): string
    {
        return $this->iconSize();
    }

    public function getComputedTriggerClasses(): string
    {
        return $this->triggerClasses();
    }

    public function getComputedDropdownClasses(): string
    {
        return $this->dropdownClasses();
    }



    public function getUniqueId(): string
    {
        return $this->id ?? 'select-' . uniqid();
    }

    public function render()
    {
        return view('keys::components.select', [
            'computedIconSize' => $this->getComputedIconSize(),
            'computedTriggerClasses' => $this->getComputedTriggerClasses(),
            'computedDropdownClasses' => $this->getComputedDropdownClasses(),
            'uniqueId' => $this->getUniqueId(),
        ]);
    }
}
