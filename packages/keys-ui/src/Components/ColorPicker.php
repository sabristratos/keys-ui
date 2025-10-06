<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Concerns\HandlesValidationErrors;

/**
 * ColorPicker Component
 *
 * A clean and accessible color picker component combining native HTML5 color input
 * with a text input for manual entry. Supports hex color format with validation.
 */
class ColorPicker extends Component
{
    use HandlesValidationErrors;

    /**
     * Create a new ColorPicker component instance.
     *
     * @param  string|null  $name  Form field name
     * @param  string|null  $id  Input ID (auto-generated from name if not provided)
     * @param  string|null  $value  Color value in hex format (e.g., #3b82f6)
     * @param  string  $size  Size variant (xs, sm, md, lg)
     * @param  bool  $disabled  Whether the color picker is disabled
     * @param  bool  $readonly  Whether the color picker is readonly
     * @param  bool  $required  Whether the color picker is required
     * @param  string|null  $label  Label text for shorthand mode
     * @param  bool  $optional  Whether to show optional indicator
     * @param  string|array|Collection|null  $errors  Validation errors
     * @param  bool  $showErrors  Whether to display validation errors
     * @param  string|null  $hint  Hint text below input
     * @param  bool  $forceError
     * @param  string|null  $placeholder  Placeholder text for the text input
     */
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = '#3b82f6',
        public string $size = 'md',
        public bool $disabled = false,
        public bool $readonly = false,
        public bool $required = false,
        public ?string $label = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public ?string $hint = null,
        public bool $forceError = false,
        public ?string $placeholder = '#000000'
    ) {
        $this->id = $this->id ?? $this->name ?? 'color-picker-'.uniqid();



        if ($this->value && ! str_starts_with($this->value, '#')) {
            $this->value = '#'.$this->value;
        }

        if (! $this->forceError && $this->hasErrors()) {
            $this->forceError = true;
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
     * Check if the color picker has an error state.
     */
    public function hasError(): bool
    {
        return $this->forceError || $this->hasErrors();
    }


    /**
     * Generate comprehensive data attributes for CSS targeting and JavaScript functionality.
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-color-picker' => 'true',
            'data-size' => $this->size,
        ];

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->readonly) {
            $attributes['data-readonly'] = 'true';
        }

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        if ($this->hasError()) {
            $attributes['data-invalid'] = 'true';
        }

        if (! empty($this->value)) {
            $attributes['data-has-value'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the color picker component view.
     */
    public function render()
    {
        return view('keys::components.color-picker', [
            'dataAttributes' => $this->getDataAttributes(),
            'hasError' => $this->hasError(),
            'isShorthand' => $this->isShorthand(),
        ]);
    }
}
