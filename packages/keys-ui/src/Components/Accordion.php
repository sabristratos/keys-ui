<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Accordion extends Component
{
    public function __construct(
        public ?string $title = null,
        public ?string $id = null,
        public ?string $icon = 'heroicon-o-chevron-down',
        public bool $collapsed = false,
        public bool $disabled = false,
        public string $color = 'neutral',
        public string $size = 'md',
        public string $variant = 'default',
        public string $rounded = 'lg',
        public array $actions = [],
        public string $actionVariant = 'ghost',
        public string $actionSize = 'xs',
        public bool $animated = true
    ) {
        $this->id = $this->id ?? 'accordion-' . uniqid();

        $validColors = ['brand', 'success', 'warning', 'danger', 'neutral'];
        if (!in_array($this->color, $validColors)) {
            $this->color = 'neutral';
        }

        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg'])) {
            $this->size = 'md';
        }

        $validVariants = ['default', 'flush', 'spaced', 'outlined', 'elevated'];
        if (!in_array($this->variant, $validVariants)) {
            $this->variant = 'default';
        }

        $validRounded = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
        if (!in_array($this->rounded, $validRounded)) {
            $this->rounded = 'lg';
        }
    }

    public function detailsClasses(): string
    {
        $baseClasses = 'group';
        $variantClasses = $this->variantClasses();
        $roundedClasses = $this->roundedClasses();

        if ($this->animated) {
            $baseClasses .= ' [&[data-accordion]]:overflow-hidden';
        }

        if ($this->disabled) {
            $baseClasses .= ' opacity-50 cursor-not-allowed';
        }

        return trim("{$baseClasses} {$variantClasses} {$roundedClasses}");
    }

    public function roundedClasses(): string
    {
        return match ($this->rounded) {
            'none' => '',
            'xs' => 'rounded-sm',
            'sm' => 'rounded',
            'md' => 'rounded-md',
            'lg' => 'rounded-lg',
            'xl' => 'rounded-xl',
            '2xl' => 'rounded-2xl',
            '3xl' => 'rounded-3xl',
            default => 'rounded-lg'
        };
    }

    public function variantClasses(): string
    {
        return match ($this->variant) {
            'default' => 'bg-surface border border-border',
            'flush' => 'bg-transparent border-0',
            'spaced' => 'bg-surface border border-border mb-3',
            'outlined' => 'bg-transparent border border-border',
            'elevated' => 'bg-surface border border-border shadow-md',
            default => 'bg-surface border border-border'
        };
    }

    public function summaryClasses(): string
    {
        $sizeClasses = match ($this->size) {
            'xs' => 'px-3 py-2 text-sm',
            'sm' => 'px-4 py-3 text-sm',
            'md' => 'px-4 py-3 text-base',
            'lg' => 'px-6 py-4 text-lg',
            default => 'px-4 py-3 text-base'
        };

        $colorClasses = $this->getSummaryColorClasses();

        $baseClasses = "flex items-center justify-between w-full cursor-pointer select-none transition-all duration-200 {$sizeClasses} {$colorClasses}";

        if ($this->disabled) {
            $baseClasses .= ' cursor-not-allowed';
        }

        return $baseClasses;
    }


    private function getSummaryColorClasses(): string
    {
        // For flush variant, no background colors
        if ($this->variant === 'flush') {
            return match ($this->color) {
                'brand' => 'hover:bg-brand/5 text-brand',
                'success' => 'hover:bg-success/5 text-success',
                'warning' => 'hover:bg-warning/5 text-warning',
                'danger' => 'hover:bg-danger/5 text-danger',
                default => 'hover:bg-neutral/5 text-foreground'
            };
        }

        // All other variants - no borders on summary, just background and text
        return match ($this->color) {
            'brand' => 'bg-brand/5 hover:bg-brand/10 text-brand',
            'success' => 'bg-success/5 hover:bg-success/10 text-success',
            'warning' => 'bg-warning/5 hover:bg-warning/10 text-warning',
            'danger' => 'bg-danger/5 hover:bg-danger/10 text-danger',
            default => 'bg-surface hover:bg-neutral/5 text-foreground'
        };
    }

    public function contentClasses(): string
    {
        $sizeClasses = match ($this->size) {
            'xs' => 'px-3 py-2',
            'sm' => 'px-4 py-3',
            'md' => 'px-4 py-3',
            'lg' => 'px-6 py-4',
            default => 'px-4 py-3'
        };

        $colorClasses = $this->getContentColorClasses();

        $borderClass = $this->variant === 'flush' ? '' : 'border-t border-border';
        return trim("{$borderClass} {$sizeClasses} {$colorClasses}");
    }

    private function getContentColorClasses(): string
    {
        // For flush variant, minimal styling
        if ($this->variant === 'flush') {
            return match ($this->color) {
                'brand' => 'text-brand',
                'success' => 'text-success',
                'warning' => 'text-warning',
                'danger' => 'text-danger',
                default => 'text-muted'
            };
        }

        // All other variants - no borders on content, just background and text
        return match ($this->color) {
            'brand' => 'bg-brand/5 text-brand',
            'success' => 'bg-success/5 text-success',
            'warning' => 'bg-warning/5 text-warning',
            'danger' => 'bg-danger/5 text-danger',
            default => 'bg-surface text-muted'
        };
    }

    public function iconSize(): string
    {
        return match ($this->size) {
            'xs' => 'xs',
            'sm' => 'sm',
            'md' => 'sm',
            'lg' => 'md',
            default => 'sm'
        };
    }

    public function iconClasses(): string
    {
        $baseClasses = 'transition-transform duration-200 group-open:rotate-180';

        if ($this->disabled) {
            $baseClasses .= ' opacity-50';
        }

        return $baseClasses;
    }

    public function hasActions(): bool
    {
        return !empty($this->actions);
    }

    public function getComputedActionSize(): string
    {
        return match ($this->actionSize) {
            'xs' => 'xs',
            'sm' => 'sm',
            'md' => 'md',
            default => 'xs'
        };
    }

    public function getComputedActionData(): array
    {
        $actions = [];

        foreach ($this->actions as $action) {
            $computedAction = [
                'type' => $action['type'],
                'icon' => $action['icon'],
                'label' => $action['label'],
                'is_multi_state' => isset($action['icon_toggle']) || isset($action['icon_success']),
                'data_action' => $action['type'],
                'data_icon_default' => $action['icon'],
                'icon_toggle' => $action['icon_toggle'] ?? null,
                'icon_success' => $action['icon_success'] ?? null,
                'label_toggle' => $action['label_toggle'] ?? null,
                'label_success' => $action['label_success'] ?? null,
                'data_url' => $action['url'] ?? null,
                'data_icon_toggle' => $action['icon_toggle'] ?? null,
                'data_icon_success' => $action['icon_success'] ?? null,
                'data_label_toggle' => $action['label_toggle'] ?? null,
                'data_label_success' => $action['label_success'] ?? null,
            ];

            $actions[] = $computedAction;
        }

        return $actions;
    }

    public function render()
    {
        return view('keys::components.accordion', [
            'computedActionSize' => $this->getComputedActionSize(),
            'computedActionData' => $this->getComputedActionData(),
        ]);
    }
}