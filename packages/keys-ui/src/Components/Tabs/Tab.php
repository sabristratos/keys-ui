<?php

namespace Keys\UI\Components\Tabs;

use Illuminate\View\Component;

class Tab extends Component
{
    public function __construct(
        public string $value,
        public ?string $label = null,
        public ?string $icon = null,
        public bool $disabled = false,
        public ?string $href = null,
        public ?string $target = null
    ) {
        $this->label = $this->label ?? $this->value;
    }

    public function tabClasses(): string
    {
        $base = 'tab-trigger inline-flex items-center justify-center px-3 py-2 font-medium text-sm transition-colors duration-200';

        if ($this->disabled) {
            return $base . ' cursor-not-allowed opacity-50 text-muted';
        }

        return $base . ' cursor-pointer text-muted hover:text-foreground';
    }

    public function defaultVariantClasses(): string
    {
        return 'border-b-2 border-transparent hover:border-border data-[state=active]:border-foreground data-[state=active]:text-foreground';
    }

    public function pillsVariantClasses(): string
    {
        return 'rounded-md hover:bg-body data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-sm';
    }

    public function underlineVariantClasses(): string
    {
        return 'border-b-2 border-transparent hover:border-border data-[state=active]:border-foreground data-[state=active]:text-foreground';
    }

    public function iconClasses(): string
    {
        return 'flex-shrink-0 mr-2';
    }

    public function hasIcon(): bool
    {
        return !empty(trim($this->icon ?? ''));
    }

    public function hasLabel(): bool
    {
        return !empty(trim($this->label ?? ''));
    }

    public function isLink(): bool
    {
        return !empty($this->href);
    }

    public function getComputedTabClasses(): string
    {
        return $this->tabClasses();
    }

    public function getComputedIconClasses(): string
    {
        return $this->iconClasses();
    }

    public function getAriaAttributes(): array
    {
        $attributes = [
            'role' => 'tab',
            'aria-selected' => 'false',
            'tabindex' => '-1',
            'data-value' => $this->value,
            'data-tabs-trigger' => 'true'
        ];

        if ($this->disabled) {
            $attributes['aria-disabled'] = 'true';
            $attributes['tabindex'] = '-1';
        }

        return $attributes;
    }

    public function getLinkAttributes(): array
    {
        if (!$this->isLink()) {
            return [];
        }

        $attributes = [
            'href' => $this->href
        ];

        if ($this->target) {
            $attributes['target'] = $this->target;
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.tabs.tab', [
            'computedTabClasses' => $this->getComputedTabClasses(),
            'computedIconClasses' => $this->getComputedIconClasses(),
            'ariaAttributes' => $this->getAriaAttributes(),
            'linkAttributes' => $this->getLinkAttributes(),
        ]);
    }
}
