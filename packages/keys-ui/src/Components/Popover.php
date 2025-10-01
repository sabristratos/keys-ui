<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Popover extends Component
{
    public string $id;

    public string $variant;

    public string $size;

    public string $placement;

    public bool $arrow;

    public bool $manual;

    public function __construct(
        ?string $id = null,
        string $variant = 'default',
        string $size = 'md',
        string $placement = 'bottom',
        bool $arrow = false,
        bool $manual = false,
    ) {
        $this->id = $id ?? 'popover-'.uniqid();
        $this->variant = $variant;

        
        if (! in_array($size, ComponentConstants::SIZES)) {
            $size = ComponentConstants::getDefaultSize();
        }
        $this->size = $size;

        
        if (! in_array($placement, ComponentConstants::POPOVER_PLACEMENTS)) {
            $placement = 'bottom';
        }
        $this->placement = $placement;

        $this->arrow = $arrow;
        $this->manual = $manual;
    }

    public function getBaseClasses(): string
    {
        return 'keys-popover z-[2000] m-0 p-0 border-0 bg-transparent text-inherit';
    }

    public function getContentClasses(): string
    {
        $base = 'bg-surface border border-border space-y-1 rounded-lg shadow-lg text-foreground my-2 max-w-[90vw] w-max';

        $sizeClasses = match ($this->size) {
            'sm' => 'p-1 text-xs min-w-40 sm:min-w-46 leading-5',
            'md' => 'p-2 text-sm min-w-48 sm:min-w-60 leading-6',
            'lg' => 'p-4 text-base min-w-56 sm:min-w-80 leading-7',
            default => 'p-2 text-sm min-w-48 sm:min-w-60 leading-6'
        };

        $variantClasses = match ($this->variant) {
            'tooltip' => 'bg-neutral-900 dark:bg-neutral-800 text-white border-0 text-xs px-2.5 py-1.5',
            'menu' => 'p-2 min-w-40',
            default => ''
        };

        return trim($base.' '.$sizeClasses.' '.$variantClasses);
    }

    public function getArrowClasses(): string
    {
        if (! $this->arrow) {
            return '';
        }

        $base = 'keys-popover__arrow absolute w-2 h-2 rotate-45 -z-10';

        $variantClasses = match ($this->variant) {
            'tooltip' => 'bg-neutral-900 dark:bg-neutral-800 border-0',
            default => 'bg-surface border border-border'
        };

        return trim($base.' '.$variantClasses);
    }

    public function render()
    {
        return view('keys::components.popover', [
            'baseClasses' => $this->getBaseClasses(),
            'contentClasses' => $this->getContentClasses(),
            'arrowClasses' => $this->getArrowClasses(),
        ]);
    }
}
