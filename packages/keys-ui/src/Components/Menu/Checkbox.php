<?php

namespace Keys\UI\Components\Menu;

use Illuminate\View\Component;
use Illuminate\Support\Collection;

class Checkbox extends Component
{
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

        $this->id = $this->id ?? ($this->name ? $this->name . '-' . $this->value . '-' . uniqid() : 'menu-checkbox-' . uniqid());


        if (!in_array($this->color, ['brand', 'success', 'warning', 'danger', 'neutral'])) {
            $this->color = 'brand';
        }
    }

    public function itemClasses(): string
    {
        $base = 'flex items-center w-full px-3 py-2 text-sm transition-colors duration-150 rounded-md cursor-pointer';

        if ($this->disabled) {
            return $base . ' text-neutral-400 cursor-not-allowed bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-500';
        }

        return $base . ' text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 has-[:checked]:bg-' . $this->color . '-50 has-[:checked]:text-' . $this->color . '-700 dark:has-[:checked]:bg-' . $this->color . '-900/20 dark:has-[:checked]:text-' . $this->color . '-300';
    }

    public function checkboxClasses(): string
    {
        $base = 'h-4 w-4 border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded';

        if ($this->disabled) {
            return $base . ' bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700';
        }

        $colorClasses = match ($this->color) {
            'brand' => 'text-brand focus:ring-brand border-border hover:border-brand',
            'success' => 'text-success focus:ring-success border-border hover:border-success',
            'warning' => 'text-warning focus:ring-warning border-border hover:border-warning',
            'danger' => 'text-danger focus:ring-danger border-border hover:border-danger',
            'neutral' => 'text-neutral-600 focus:ring-neutral-500 border-border hover:border-neutral-400',
            default => 'text-brand focus:ring-brand border-border hover:border-brand'
        };

        return $base . ' bg-input ' . $colorClasses;
    }

    public function iconClasses(): string
    {
        return 'flex-shrink-0 mr-3';
    }

    public function contentClasses(): string
    {
        return 'flex-1 min-w-0 ml-3';
    }

    public function labelClasses(): string
    {
        return 'block text-sm font-medium text-foreground';
    }

    public function getDataAttributes(): array
    {
        return [
            'data-menu-checkbox' => 'true',
            'data-keep-open' => $this->keepOpen ? 'true' : 'false',
            'data-color' => $this->color
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
            'class' => $this->checkboxClasses()
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
            'class' => $this->itemClasses()
        ];
    }

    public function hasIcon(): bool
    {
        return !empty($this->icon);
    }

    public function hasError(): bool
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

    public function iconSize(): string
    {
        return 'sm';
    }

    public function render()
    {
        return view('keys::components.menu.checkbox', [
            'computedItemClasses' => $this->itemClasses(),
            'computedIconClasses' => $this->iconClasses(),
            'computedContentClasses' => $this->contentClasses(),
            'computedLabelClasses' => $this->labelClasses(),
            'computedDataAttributes' => $this->getDataAttributes(),
            'computedCheckboxAttributes' => $this->getCheckboxAttributes(),
            'computedLabelAttributes' => $this->getLabelAttributes(),
        ]);
    }
}
