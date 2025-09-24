<?php

namespace Keys\UI\Components\Select;

use Illuminate\View\Component;

class Option extends Component
{
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
     * Generate CSS classes for option element
     */
    public function optionClasses(): string
    {
        $base = 'flex items-center w-full px-3 py-2 mx-0.5 my-0.5 text-sm text-left cursor-pointer transition-colors duration-150 rounded-md';

        if ($this->disabled) {
            return $base . ' text-neutral-400 cursor-not-allowed bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-500';
        }

        if ($this->selected) {
            return $base . ' bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300';
        }

        return $base . ' text-foreground';
    }

    /**
     * Generate CSS classes for icon container
     */
    public function iconClasses(): string
    {
        return 'flex-shrink-0 mr-2';
    }

    /**
     * Generate CSS classes for content container
     */
    public function contentClasses(): string
    {
        return 'flex-1 min-w-0';
    }

    /**
     * Generate CSS classes for label text
     */
    public function labelClasses(): string
    {
        return 'block font-medium truncate';
    }

    /**
     * Generate CSS classes for description text
     */
    public function descriptionClasses(): string
    {
        return 'block text-xs text-muted mt-0.5 truncate';
    }

    /**
     * Generate CSS classes for checkmark icon
     */
    public function checkmarkClasses(): string
    {
        $base = 'flex-shrink-0 ml-2 transition-opacity duration-150';
        return $base . ($this->selected ? ' opacity-100' : ' opacity-0');
    }

    /**
     * Check if option has label content
     */
    public function hasContent(): bool
    {
        return !empty(trim($this->label ?? ''));
    }

    /**
     * Check if option has description
     */
    public function hasDescription(): bool
    {
        return !empty(trim($this->description ?? ''));
    }

    /**
     * Check if option has icon
     */
    public function hasIcon(): bool
    {
        return !empty(trim($this->icon ?? ''));
    }

    /**
     * Get searchable text for filtering
     */
    public function getSearchableText(): string
    {
        $text = $this->label ?? '';
        if ($this->description) {
            $text .= ' ' . $this->description;
        }
        return strtolower(trim($text));
    }

    /**
     * Get display label with fallback hierarchy
     */
    public function getDisplayLabel(): string
    {
        return $this->displayLabel ?? $this->label ?? '';
    }

    /**
     * Render the component view
     */
    public function render()
    {
        return view('keys::components.select.option', [
            'computedOptionClasses' => $this->optionClasses(),
            'computedIconClasses' => $this->iconClasses(),
            'computedContentClasses' => $this->contentClasses(),
            'computedLabelClasses' => $this->labelClasses(),
            'computedDescriptionClasses' => $this->descriptionClasses(),
            'computedCheckmarkClasses' => $this->checkmarkClasses(),
            'searchableText' => $this->getSearchableText(),
            'displayLabel' => $this->getDisplayLabel(),
        ]);
    }
}