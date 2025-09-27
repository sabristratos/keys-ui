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

    public function hasIcon(): bool
    {
        return ! empty(trim($this->icon ?? ''));
    }

    public function hasLabel(): bool
    {
        return ! empty(trim($this->label ?? ''));
    }

    public function isLink(): bool
    {
        return ! empty($this->href);
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-tab' => 'true',
            'data-tabs-trigger' => 'true',
            'data-value' => $this->value,
            'role' => 'tab',
            'aria-selected' => 'false',
            'tabindex' => '-1',
        ];

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
            $attributes['aria-disabled'] = 'true';
            $attributes['tabindex'] = '-1';
        }

        if ($this->hasIcon()) {
            $attributes['data-has-icon'] = 'true';
        }

        return $attributes;
    }

    public function getLinkAttributes(): array
    {
        if (! $this->isLink()) {
            return [];
        }

        $attributes = [
            'href' => $this->href,
        ];

        if ($this->target) {
            $attributes['target'] = $this->target;
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.tabs.tab', [
            'dataAttributes' => $this->getDataAttributes(),
            'linkAttributes' => $this->getLinkAttributes(),
        ]);
    }
}
