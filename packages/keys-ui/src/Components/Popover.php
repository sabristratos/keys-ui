<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Popover extends Component
{
    public function __construct(
        public ?string $id = null,
        public string $placement = 'bottom',
        public string $align = 'center',
        public string $size = 'md',
        public string $trigger = 'click',
        public bool $arrow = true,
        public bool $dismissible = true,
        public bool $closeOnOutsideClick = true,
        public bool $closeOnEscape = true,
        public int $delay = 0,
        public int $hideDelay = 0,
        public bool $disabled = false,
        public ?string $title = null,
        public int $offset = 8,
        public bool $modal = false
    ) {
        // Generate unique ID if not provided
        $this->id = $this->id ?? 'popover-' . uniqid();

        // Validate placement
        if (!in_array($this->placement, ['top', 'bottom', 'left', 'right'])) {
            $this->placement = 'bottom';
        }

        // Validate align
        if (!in_array($this->align, ['start', 'center', 'end'])) {
            $this->align = 'center';
        }

        // Validate size
        if (!in_array($this->size, ComponentConstants::TOOLTIP_SIZES)) {
            $this->size = ComponentConstants::getDefaultSize();
        }

        // Validate trigger
        if (!in_array($this->trigger, ['click', 'hover', 'focus', 'manual'])) {
            $this->trigger = 'click';
        }

        // Auto-enable dismissible for interactive triggers
        if (in_array($this->trigger, ['click', 'focus'])) {
            $this->dismissible = true;
        }
    }

    public function popoverClasses(): string
    {
        $base = 'relative inline-block';

        if ($this->disabled) {
            $base .= ' opacity-50 pointer-events-none';
        }

        return $base;
    }

    public function panelClasses(): string
    {
        $base = 'absolute z-50 bg-surface border border-border rounded-lg shadow-lg hidden';

        $sizeClasses = match ($this->size) {
            'sm' => 'p-3 text-sm max-w-xs',
            'md' => 'p-4 text-sm max-w-sm',
            'lg' => 'p-6 text-base max-w-md',
            default => 'p-4 text-sm max-w-sm'
        };

        $positionClasses = match ($this->placement) {
            'top' => 'bottom-full mb-' . ($this->offset / 4),
            'bottom' => 'top-full mt-' . ($this->offset / 4),
            'left' => 'right-full mr-' . ($this->offset / 4),
            'right' => 'left-full ml-' . ($this->offset / 4),
            default => 'top-full mt-2'
        };

        $alignClasses = match ($this->align) {
            'start' => match ($this->placement) {
                'left', 'right' => 'top-0',
                default => 'left-0'
            },
            'center' => match ($this->placement) {
                'left', 'right' => 'top-1/2 -translate-y-1/2',
                default => 'left-1/2 -translate-x-1/2'
            },
            'end' => match ($this->placement) {
                'left', 'right' => 'bottom-0',
                default => 'right-0'
            },
            default => 'left-1/2 -translate-x-1/2'
        };

        return trim($base . ' ' . $sizeClasses . ' ' . $positionClasses . ' ' . $alignClasses);
    }

    public function triggerClasses(): string
    {
        return 'cursor-pointer';
    }

    public function getTitleClasses(): string
    {
        return match ($this->size) {
            'sm' => 'font-semibold text-sm mb-2',
            'md' => 'font-semibold text-base mb-3',
            'lg' => 'font-semibold text-lg mb-3',
            default => 'font-semibold text-base mb-3'
        };
    }

    public function getDataAttributes(): array
    {
        return [
            'data-popover' => 'true',
            'data-popover-id' => $this->id,
            'data-placement' => $this->placement,
            'data-align' => $this->align,
            'data-trigger' => $this->trigger,
            'data-size' => $this->size,
            'data-offset' => $this->offset,
            'data-disabled' => $this->disabled ? 'true' : 'false',
            'data-modal' => $this->modal ? 'true' : 'false',
            'data-dismissible' => $this->dismissible ? 'true' : 'false',
            'data-close-on-outside-click' => $this->closeOnOutsideClick ? 'true' : 'false',
            'data-close-on-escape' => $this->closeOnEscape ? 'true' : 'false',
            'data-delay' => $this->delay,
            'data-hide-delay' => $this->hideDelay,
            'data-arrow' => $this->arrow ? 'true' : 'false'
        ];
    }

    public function isDisabled(): bool
    {
        return $this->disabled;
    }

    public function hasTitle(): bool
    {
        return !is_null($this->title);
    }

    public function render()
    {
        return view('keys::components.popover', [
            'computedPopoverClasses' => $this->popoverClasses(),
            'computedPanelClasses' => $this->panelClasses(),
            'computedTriggerClasses' => $this->triggerClasses(),
            'computedTitleClasses' => $this->getTitleClasses(),
            'computedDataAttributes' => $this->getDataAttributes(),
        ]);
    }
}