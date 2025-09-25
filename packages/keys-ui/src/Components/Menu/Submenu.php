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
        public ?string $id = null,
        public string $size = 'md',
    ) {
        $this->id = $this->id ?? 'submenu-' . uniqid();
    }

    /**
     * Get computed classes for the submenu trigger
     */
    public function getComputedTriggerClasses(): string
    {
        $baseClasses = [
            'flex items-center justify-between w-full px-2 py-2 text-sm text-left',
            'transition-colors duration-150 rounded-md group relative',
            'text-foreground hover:bg-neutral-hover',
            'focus:outline-none focus:bg-neutral-hover',
            'cursor-pointer',
        ];

        if ($this->disabled) {
            $baseClasses[] = 'opacity-50 cursor-not-allowed';
        }

        return implode(' ', $baseClasses);
    }

    /**
     * Get computed classes for the submenu panel (now handled by popover)
     */
    public function getComputedPanelClasses(): string
    {
        $base = 'focus:outline-none space-y-1 max-w-[85vw] w-max';

        $sizeClasses = match ($this->size) {
            'sm' => 'min-w-40 sm:min-w-40 p-1',
            'md' => 'min-w-48 sm:min-w-48 p-1',
            'lg' => 'min-w-56 sm:min-w-56 p-1',
            default => 'min-w-48 sm:min-w-48 p-1'
        };

        return trim($base . ' ' . $sizeClasses);
    }

    /**
     * Get computed placement for popover positioning
     * Mobile-responsive: bottom on small screens, right on larger screens
     */
    public function getComputedPlacement(): string
    {
        // Map position + align to popover placement format
        return match ($this->position) {
            'right' => match ($this->align) {
                'start' => 'right-start',
                'end' => 'right-end',
                default => 'right'
            },
            'left' => match ($this->align) {
                'start' => 'left-start',
                'end' => 'left-end',
                default => 'left'
            },
            'top' => match ($this->align) {
                'start' => 'top-start',
                'end' => 'top-end',
                default => 'top'
            },
            'bottom' => match ($this->align) {
                'start' => 'bottom-start',
                'end' => 'bottom-end',
                default => 'bottom'
            },
            default => 'right-start'
        };
    }

    /**
     * Get mobile-responsive placement (for CSS media queries)
     */
    public function getMobilePlacement(): string
    {
        // On mobile, prefer bottom opening for accordion-style behavior
        return match ($this->align) {
            'end' => 'bottom-end',
            'center' => 'bottom',
            default => 'bottom-start'
        };
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
     * Get button classes for submenu trigger (consistent with MenuItem)
     */
    public function getComputedButtonClasses(): string
    {
        $baseClasses = [
            'flex items-center w-full px-2 py-2 text-sm text-left',
            'transition-colors duration-150 rounded-md group relative',
            'text-foreground hover:bg-neutral-hover',
            'focus:outline-none focus:bg-neutral-hover',
            'cursor-pointer',
        ];

        if ($this->disabled) {
            $baseClasses = [
                'flex items-center w-full px-2 py-2 text-sm text-left',
                'transition-colors duration-150 rounded-md group relative',
                'text-neutral-400 cursor-not-allowed',
                'bg-neutral-disabled dark:text-neutral-500',
            ];
        }

        return implode(' ', $baseClasses);
    }

    /**
     * Render the component.
     */
    public function render()
    {
        return view('keys::components.menu.submenu', [
            'computedTriggerClasses' => $this->getComputedTriggerClasses(),
            'computedPanelClasses' => $this->getComputedPanelClasses(),
            'computedPlacement' => $this->getComputedPlacement(),
            'computedMobilePlacement' => $this->getMobilePlacement(),
            'computedDataAttributes' => $this->getComputedDataAttributes(),
            'computedTriggerDataAttributes' => $this->getComputedTriggerDataAttributes(),
            'computedPanelDataAttributes' => $this->getComputedPanelDataAttributes(),
            'computedIconSize' => $this->getIconSize(),
            'computedIconClasses' => $this->getIconClasses(),
            'computedButtonClasses' => $this->getComputedButtonClasses(),
            'id' => $this->id,
        ]);
    }
}
