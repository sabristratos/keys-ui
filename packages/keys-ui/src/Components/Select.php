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
        public string $width = 'full',
        public bool $disabled = false,
        public bool $required = false,
        public ?string $label = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $hasError = false,
        public ?string $ariaLabel = null,
        public ?string $ariaDescribedby = null
    ) {
        $this->id = $this->id ?? $this->name;

        if ($this->multiple && !is_array($this->value)) {
            $this->value = $this->value ? [$this->value] : [];
        }

        $this->hasError = $this->hasErrors();
    }

    /**
     * Check if component is in shorthand mode with label
     */
    public function isShorthand(): bool
    {
        return !is_null($this->label);
    }

    /**
     * Check if component has validation errors
     */
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

    /**
     * Generate CSS classes for trigger element
     */
    public function triggerClasses(): string
    {
        $base = 'relative cursor-pointer rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
        $width = $this->widthClasses();
        $size = $this->sizeClasses();
        $state = $this->stateClasses();

        return trim($base . ' ' . $width . ' ' . $size . ' ' . $state);
    }

    /**
     * Generate size-specific CSS classes
     */
    public function sizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'px-3 py-1.5 text-sm',
            'md' => 'px-3 py-2 text-sm',
            'lg' => 'px-4 py-2.5 text-base',
            default => 'px-3 py-2 text-sm'
        };
    }

    /**
     * Generate width-specific CSS classes
     */
    public function widthClasses(): string
    {
        return match ($this->width) {
            'auto' => 'w-auto',
            'xs' => 'w-20',
            'sm' => 'w-32',
            'md' => 'w-48',
            'lg' => 'w-64',
            'xl' => 'w-80',
            '2xl' => 'w-96',
            'fit' => 'w-fit',
            'full' => 'w-full',
            default => 'w-full'
        };
    }

    /**
     * Generate state-dependent CSS classes
     */
    public function stateClasses(): string
    {
        if ($this->disabled) {
            return 'bg-neutral-100 border-neutral-300 text-neutral-500 cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400';
        }

        if ($this->hasError || $this->hasErrors()) {
            return 'bg-input border-danger text-foreground focus:border-danger focus:ring-danger';
        }

        return 'bg-input border-border text-foreground focus:border-brand focus:ring-brand hover:border-neutral-300 dark:hover:border-neutral-600';
    }

    /**
     * Generate CSS classes for dropdown element
     */
    public function dropdownClasses(): string
    {
        $width = $this->width === 'auto' || $this->width === 'fit' ? 'w-auto min-w-full' : 'w-full';
        return "absolute z-50 mt-1 {$width} rounded-md bg-surface border border-border shadow-lg";
    }

    /**
     * Get icon size based on component size
     */
    public function iconSize(): string
    {
        return match ($this->size) {
            'sm' => 'xs',
            'md' => 'sm',
            'lg' => 'md',
            default => 'sm'
        };
    }

    /**
     * Get array of selected values
     */
    public function getSelectedValues(): array
    {
        if ($this->multiple) {
            return is_array($this->value) ? $this->value : [];
        }

        return $this->value ? [$this->value] : [];
    }

    /**
     * Check if specific value is selected
     */
    public function isValueSelected($optionValue): bool
    {
        $selectedValues = $this->getSelectedValues();
        return in_array($optionValue, $selectedValues, true);
    }

    /**
     * Generate unique ID for component
     */
    public function getUniqueId(): string
    {
        return $this->id ?? 'select-' . uniqid();
    }

    /**
     * Generate comprehensive data attributes for component
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-select' => 'true',
            'data-select' => 'true',
            'data-size' => $this->size,
            'data-width' => $this->width,
            'data-multiple' => $this->multiple ? 'true' : 'false',
            'data-searchable' => $this->searchable ? 'true' : 'false',
            'data-clearable' => $this->clearable ? 'true' : 'false',
            'data-disabled' => $this->disabled ? 'true' : 'false',
            'data-name' => $this->name,
        ];

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        if ($this->hasError || $this->hasErrors()) {
            $attributes['data-invalid'] = 'true';
        }

        if ($this->disabled) {
            $attributes['data-state'] = 'disabled';
        } else {
            $attributes['data-state'] = 'enabled';
        }

        if ($this->label) {
            $attributes['data-has-label'] = 'true';
            $attributes['data-shorthand-mode'] = 'true';
        }

        if ($this->placeholder) {
            $attributes['data-has-placeholder'] = 'true';
        }

        if ($this->value !== null) {
            $attributes['data-value'] = is_array($this->value) ? json_encode($this->value) : $this->value;
            $attributes['data-has-value'] = 'true';
        }

        if ($this->multiple) {
            $selectedCount = count($this->getSelectedValues());
            $attributes['data-selected-count'] = $selectedCount;
            if ($selectedCount > 0) {
                $attributes['data-has-selection'] = 'true';
            }
        }

        $attributes['data-floating-placement'] = 'bottom-start';
        $attributes['data-floating-offset'] = '4';

        if ($this->ariaLabel) {
            $attributes['aria-label'] = $this->ariaLabel;
        }

        if ($this->ariaDescribedby) {
            $attributes['aria-describedby'] = $this->ariaDescribedby;
        }


        return $attributes;
    }







    /**
     * Render the component view
     */
    public function render()
    {
        return view('keys::components.select', [
            'computedIconSize' => $this->iconSize(),
            'computedTriggerClasses' => $this->triggerClasses(),
            'computedDropdownClasses' => $this->dropdownClasses(),
            'uniqueId' => $this->getUniqueId(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}