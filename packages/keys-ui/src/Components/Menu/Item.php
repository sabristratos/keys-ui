<?php

namespace Keys\UI\Components\Menu;

use Illuminate\View\Component;

class Item extends Component
{
    public function __construct(
        public ?string $href = null,
        public ?string $icon = null,
        public ?string $kbd = null,
        public string $variant = 'default',
        public bool $disabled = false,
        public bool $keepOpen = false,
        public ?string $target = null,
        public ?string $iconToggle = null,
        public ?string $iconSuccess = null,
        public ?string $labelToggle = null,
        public ?string $labelSuccess = null
    ) {

        if (!in_array($this->variant, ['default', 'brand', 'danger', 'success', 'warning', 'info'])) {
            $this->variant = 'default';
        }
    }

    public function isLink(): bool
    {
        return !is_null($this->href);
    }

    public function elementType(): string
    {
        if ($this->isLink()) {
            return $this->disabled ? 'div' : 'a';
        }

        return 'button';
    }

    public function itemClasses(): string
    {
        $base = 'flex items-center w-full px-3 py-2 text-sm text-left transition-colors duration-150 rounded-md group relative';

        if ($this->disabled) {
            return $base . ' text-neutral-400 cursor-not-allowed bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-500';
        }

        $variantClasses = match ($this->variant) {
            'danger' => 'text-danger-600 hover:bg-danger-50 hover:text-danger-700 dark:text-danger-400 dark:hover:bg-danger-900/20',
            'success' => 'text-success-600 hover:bg-success-50 hover:text-success-700 dark:text-success-400 dark:hover:bg-success-900/20',
            'warning' => 'text-warning-600 hover:bg-warning-50 hover:text-warning-700 dark:text-warning-400 dark:hover:bg-warning-900/20',
            'brand' => 'text-brand-600 hover:bg-brand-50 hover:text-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/20',
            'info' => 'text-info-600 hover:bg-info-50 hover:text-info-700 dark:text-info-400 dark:hover:bg-info-900/20',
            default => 'text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
        };

        return $base . ' ' . $variantClasses . ' cursor-pointer';
    }

    public function iconClasses(): string
    {
        return 'flex-shrink-0 mr-3';
    }

    public function iconSize(): string
    {
        return 'sm';
    }

    public function contentClasses(): string
    {
        return 'flex-1 min-w-0';
    }

    public function kbdClasses(): string
    {
        return 'ml-auto text-xs text-muted font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border';
    }

    public function isMultiState(): bool
    {
        return !is_null($this->iconToggle) || !is_null($this->iconSuccess);
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-menu-item' => 'true',
            'data-keep-open' => $this->keepOpen ? 'true' : 'false',
            'data-variant' => $this->variant
        ];

        if ($this->isMultiState()) {
            $attributes['data-icon-default'] = $this->icon;

            if ($this->iconToggle) {
                $attributes['data-icon-toggle'] = $this->iconToggle;
            }

            if ($this->iconSuccess) {
                $attributes['data-icon-success'] = $this->iconSuccess;
            }

            if ($this->labelToggle) {
                $attributes['data-label-toggle'] = $this->labelToggle;
            }

            if ($this->labelSuccess) {
                $attributes['data-label-success'] = $this->labelSuccess;
            }
        }

        return $attributes;
    }

    public function getElementAttributes(): array
    {
        $attributes = [
            'role' => 'menuitem',
            'tabindex' => '-1',
            'disabled' => $this->disabled
        ];

        if ($this->isLink() && !$this->disabled) {
            $attributes['href'] = $this->href;
            if ($this->target) {
                $attributes['target'] = $this->target;
            }
        } elseif (!$this->isLink()) {
            $attributes['type'] = 'button';
        }

        return array_merge($attributes, $this->getDataAttributes());
    }

    public function hasIcon(): bool
    {
        return !empty($this->icon);
    }

    public function hasKbd(): bool
    {
        return !empty($this->kbd);
    }

    public function render()
    {
        return view('keys::components.menu.item', [
            'computedItemClasses' => $this->itemClasses(),
            'computedIconClasses' => $this->iconClasses(),
            'computedContentClasses' => $this->contentClasses(),
            'computedKbdClasses' => $this->kbdClasses(),
            'computedElementAttributes' => $this->getElementAttributes(),
            'elementType' => $this->elementType(),
        ]);
    }
}
