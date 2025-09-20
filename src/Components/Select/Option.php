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
        $this->label = $this->label ?? $this->value;
    }

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

    public function iconClasses(): string
    {
        return 'flex-shrink-0 mr-2';
    }

    public function contentClasses(): string
    {
        return 'flex-1 min-w-0';
    }

    public function labelClasses(): string
    {
        return 'block font-medium truncate';
    }

    public function descriptionClasses(): string
    {
        return 'block text-xs text-muted mt-0.5 truncate';
    }

    public function checkmarkClasses(): string
    {
        $base = 'flex-shrink-0 ml-2 transition-opacity duration-150';
        return $base . ($this->selected ? ' opacity-100' : ' opacity-0');
    }

    public function hasContent(): bool
    {
        return !empty(trim($this->label ?? ''));
    }

    public function hasDescription(): bool
    {
        return !empty(trim($this->description ?? ''));
    }

    public function hasIcon(): bool
    {
        return !empty(trim($this->icon ?? ''));
    }

    public function getComputedOptionClasses(): string
    {
        return $this->optionClasses();
    }

    public function getComputedIconClasses(): string
    {
        return $this->iconClasses();
    }

    public function getComputedContentClasses(): string
    {
        return $this->contentClasses();
    }

    public function getComputedLabelClasses(): string
    {
        return $this->labelClasses();
    }

    public function getComputedDescriptionClasses(): string
    {
        return $this->descriptionClasses();
    }

    public function getComputedCheckmarkClasses(): string
    {
        return $this->checkmarkClasses();
    }

    public function getSearchableText(): string
    {
        $text = $this->label ?? '';
        if ($this->description) {
            $text .= ' ' . $this->description;
        }
        return strtolower(trim($text));
    }

    public function getDisplayLabel(): string
    {
        return $this->displayLabel ?? $this->label ?? $this->value ?? '';
    }

    public function render()
    {
        return view('keys::components.select.option', [
            'computedOptionClasses' => $this->getComputedOptionClasses(),
            'computedIconClasses' => $this->getComputedIconClasses(),
            'computedContentClasses' => $this->getComputedContentClasses(),
            'computedLabelClasses' => $this->getComputedLabelClasses(),
            'computedDescriptionClasses' => $this->getComputedDescriptionClasses(),
            'computedCheckmarkClasses' => $this->getComputedCheckmarkClasses(),
            'searchableText' => $this->getSearchableText(),
            'displayLabel' => $this->getDisplayLabel(),
        ]);
    }
}
