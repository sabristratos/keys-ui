<?php

namespace Keys\UI\Components\Menu;

use Illuminate\View\Component;

class Submenu extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct(
        public ?string $heading = null,
        public ?string $icon = null,
        public bool $keepOpen = true,
        public bool $disabled = false,
        public string $position = 'right',
        public string $align = 'start',
        public int $offset = 4,
    ) {
        //
    }

    /**
     * Get computed classes for the submenu trigger
     */
    public function getComputedTriggerClasses(): string
    {
        $baseClasses = [
            'flex items-center justify-between w-full px-3 py-2 text-sm text-left',
            'transition-colors duration-150 rounded-md group relative',
            'text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800',
            'focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-800',
            'cursor-pointer',
        ];

        if ($this->disabled) {
            $baseClasses[] = 'opacity-50 cursor-not-allowed';
        }

        return implode(' ', $baseClasses);
    }

    /**
     * Get computed classes for the submenu panel
     */
    public function getComputedPanelClasses(): string
    {
        return implode(' ', [
            'absolute hidden z-50 min-w-48 p-2',
            'bg-surface border border-border',
            'rounded-lg shadow-lg',
            'focus:outline-none',
        ]);
    }

    /**
     * Get computed data attributes
     */
    public function getComputedDataAttributes(): array
    {
        return [
            'data-submenu' => 'true',
            'data-position' => $this->position,
            'data-align' => $this->align,
            'data-offset' => $this->offset,
            'data-keep-open' => $this->keepOpen ? 'true' : 'false',
            'data-disabled' => $this->disabled ? 'true' : 'false',
        ];
    }

    /**
     * Get computed trigger data attributes
     */
    public function getComputedTriggerDataAttributes(): array
    {
        return [
            'data-submenu-trigger' => 'true',
            'role' => 'menuitem',
            'aria-haspopup' => 'true',
            'aria-expanded' => 'false',
            'tabindex' => $this->disabled ? '-1' : '0',
        ];
    }

    /**
     * Get computed panel data attributes
     */
    public function getComputedPanelDataAttributes(): array
    {
        return [
            'data-submenu-panel' => 'true',
            'role' => 'menu',
            'aria-orientation' => 'vertical',
        ];
    }

    /**
     * Check if submenu has heading
     */
    public function hasHeading(): bool
    {
        return !empty($this->heading);
    }

    /**
     * Check if submenu has icon
     */
    public function hasIcon(): bool
    {
        return !empty($this->icon);
    }

    /**
     * Get icon size (consistent with Menu Item)
     */
    public function getIconSize(): string
    {
        return 'sm';
    }

    /**
     * Get icon classes (consistent with Menu Item)
     */
    public function getIconClasses(): string
    {
        return 'flex-shrink-0 mr-3';
    }

    /**
     * Render the component.
     */
    public function render()
    {
        return view('keys::components.menu.submenu', [
            'computedTriggerClasses' => $this->getComputedTriggerClasses(),
            'computedPanelClasses' => $this->getComputedPanelClasses(),
            'computedDataAttributes' => $this->getComputedDataAttributes(),
            'computedTriggerDataAttributes' => $this->getComputedTriggerDataAttributes(),
            'computedPanelDataAttributes' => $this->getComputedPanelDataAttributes(),
            'computedIconSize' => $this->getIconSize(),
            'computedIconClasses' => $this->getIconClasses(),
        ]);
    }
}
