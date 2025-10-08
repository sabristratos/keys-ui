<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Concerns\HandlesValidationErrors;

/**
 * Select Component
 *
 * A comprehensive dropdown select component with slot-based options, search functionality,
 * multiple selection support, and rich content capabilities. Uses Laravel component slots
 * for maximum flexibility with the x-keys::select.option nested component.
 */
class Select extends Component
{
    use HandlesValidationErrors;

    /**
     * Create a new Select component instance.
     *
     * @param  string|null  $name  Form field name
     * @param  string|null  $id  Select ID (auto-generated if not provided)
     * @param  mixed  $value  Selected value(s)
     * @param  bool  $multiple  Enable multiple selection with chips
     * @param  bool  $searchable  Enable search functionality
     * @param  bool  $clearable  Enable clear button
     * @param  string|null  $placeholder  Placeholder text
     * @param  string  $size  Size variant (sm, md, lg)
     * @param  string  $width  Width variant (full, auto, etc.)
     * @param  bool  $disabled  Whether the select is disabled
     * @param  bool  $required  Whether the select is required
     * @param  string|null  $label  Label text for shorthand mode
     * @param  bool  $optional  Whether to show optional indicator
     * @param  string|array|Collection|null  $errors  Validation errors
     * @param  bool  $showErrors  Whether to display validation errors
     * @param  bool  $hasError  Force error state
     * @param  string|null  $ariaLabel  ARIA label for accessibility
     * @param  string|null  $ariaDescribedby  ARIA described-by for accessibility
     */
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
        $this->id = $this->id ?? $this->name ?? 'select-'.uniqid();

        if ($this->multiple && ! is_array($this->value)) {
            $this->value = $this->value ? [$this->value] : [];
        }

        if (! $this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
    }

    /**
     * Check if the component is using shorthand mode (with label).
     */
    public function isShorthand(): bool
    {
        return ! is_null($this->label);
    }


    /**
     * Get array of selected values.
     * Returns array for both single and multiple selection modes.
     */
    public function getSelectedValues(): array
    {
        if ($this->multiple) {
            return is_array($this->value) ? $this->value : [];
        }

        return $this->value ? [$this->value] : [];
    }

    /**
     * Check if a specific value is selected.
     * Uses strict comparison to ensure type safety.
     */
    public function isValueSelected($optionValue): bool
    {
        $selectedValues = $this->getSelectedValues();

        return in_array($optionValue, $selectedValues, true);
    }

    /**
     * Generate comprehensive data attributes for CSS targeting and JavaScript functionality.
     * Includes component identification, state, features, selection tracking, and accessibility.
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-select' => 'true',
            'data-keys-group-target' => 'true',
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

        if (! empty($this->getSelectedValues())) {
            $attributes['data-has-value'] = 'true';
        }

        if ($this->ariaLabel) {
            $attributes['aria-label'] = $this->ariaLabel;
        }

        if ($this->ariaDescribedby) {
            $attributes['aria-describedby'] = $this->ariaDescribedby;
        }

        return $attributes;
    }

    /**
     * Render the select component view.
     */
    public function render()
    {
        return view('keys::components.select', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
