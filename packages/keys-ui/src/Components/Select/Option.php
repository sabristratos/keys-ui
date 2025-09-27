<?php

namespace Keys\UI\Components\Select;

use Illuminate\View\Component;

/**
 * Select Option Component
 *
 * A flexible option component for use within the Select component. Supports icons,
 * descriptions, custom content, and provides comprehensive search functionality.
 * Uses dot notation component structure: x-keys::select.option
 */
class Option extends Component
{
    /**
     * Create a new Select Option component instance.
     *
     * @param  string|null  $value  Option value for form submission
     * @param  string|null  $label  Display text (falls back to value if not provided)
     * @param  string|null  $displayLabel  Alternative display label override
     * @param  string|null  $icon  Heroicon name for left icon
     * @param  string|null  $description  Secondary text below label
     * @param  bool  $disabled  Whether this option is disabled
     * @param  bool  $selected  Whether this option is pre-selected
     */
    public function __construct(
        public ?string $value = null,
        public ?string $label = null,
        public ?string $displayLabel = null,
        public ?string $icon = null,
        public ?string $description = null,
        public bool $disabled = false,
        public bool $selected = false
    ) {
        $this->label = $this->label ?? $this->value ?? '';
    }

    /**
     * Generate comprehensive data attributes for CSS targeting and JavaScript functionality.
     * Includes component identification, value data, state, and feature flags.
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-option' => 'true',
            'data-select-option' => 'true',
            'data-value' => $this->value,
            'data-display-label' => $this->getDisplayLabel(),
            'data-searchable-text' => $this->getSearchableText(),
        ];

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->selected) {
            $attributes['data-selected'] = 'true';
        }

        if ($this->hasIcon()) {
            $attributes['data-has-icon'] = 'true';
            $attributes['data-icon'] = $this->icon;
        }

        if ($this->hasDescription()) {
            $attributes['data-has-description'] = 'true';
        }

        if ($this->hasContent()) {
            $attributes['data-has-content'] = 'true';
        }

        return $attributes;
    }

    /**
     * Check if the option has label content.
     */
    public function hasContent(): bool
    {
        return ! empty(trim($this->label ?? ''));
    }

    /**
     * Check if the option has a description.
     */
    public function hasDescription(): bool
    {
        return ! empty(trim($this->description ?? ''));
    }

    /**
     * Check if the option has an icon.
     */
    public function hasIcon(): bool
    {
        return ! empty(trim($this->icon ?? ''));
    }

    /**
     * Get searchable text for filtering functionality.
     * Combines label and description for comprehensive search.
     */
    public function getSearchableText(): string
    {
        $text = $this->label ?? '';
        if ($this->description) {
            $text .= ' '.$this->description;
        }

        return strtolower(trim($text));
    }

    /**
     * Get display label with fallback hierarchy.
     * Priority: displayLabel -> label -> empty string.
     */
    public function getDisplayLabel(): string
    {
        return $this->displayLabel ?? $this->label ?? '';
    }

    /**
     * Render the select option component view.
     */
    public function render()
    {
        return view('keys::components.select.option', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
