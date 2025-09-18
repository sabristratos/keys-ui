<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Tabs extends Component
{
    public function __construct(
        public ?string $id = null,
        public string $orientation = 'horizontal',
        public string $size = 'md',
        public ?string $defaultValue = null,
        public ?string $value = null,
        public bool $disabled = false,
        public string $variant = 'default'
    ) {

        $this->id = $this->id ?? 'tabs-' . uniqid();

        if ($this->value === null && $this->defaultValue !== null) {
            $this->value = $this->defaultValue;
        }
    }

    public function containerClasses(): string
    {
        $base = 'tabs-container';
        $orientation = $this->orientationClasses();
        $size = $this->sizeClasses();
        $variant = $this->variantClasses();

        return trim($base . ' ' . $orientation . ' ' . $size . ' ' . $variant);
    }

    public function orientationClasses(): string
    {
        return match ($this->orientation) {
            'vertical' => 'flex gap-6',
            'horizontal' => 'flex flex-col space-y-4',
            default => 'flex flex-col space-y-4'
        };
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'text-sm',
            'md' => 'text-sm',
            'lg' => 'text-base',
            default => 'text-sm'
        };
    }

    public function variantClasses(): string
    {
        return match ($this->variant) {
            'pills' => 'tabs-pills',
            'underline' => 'tabs-underline',
            'default' => 'tabs-default',
            default => 'tabs-default'
        };
    }

    public function tabListClasses(): string
    {
        $base = 'tabs-list flex';
        $orientation = $this->tabListOrientationClasses();
        $variant = $this->tabListVariantClasses();

        return trim($base . ' ' . $orientation . ' ' . $variant);
    }

    public function tabListOrientationClasses(): string
    {
        return match ($this->orientation) {
            'vertical' => 'flex-col space-y-1 min-w-0',
            'horizontal' => 'space-x-1',
            default => 'space-x-1'
        };
    }

    public function tabListVariantClasses(): string
    {
        return match ($this->variant) {
            'pills' => 'bg-body p-1 rounded-lg',
            'underline' => 'border-b border-border',
            'default' => 'border-b border-border',
            default => 'border-b border-border'
        };
    }

    public function panelsContainerClasses(): string
    {
        return match ($this->orientation) {
            'vertical' => 'flex-1 min-w-0',
            'horizontal' => 'mt-4',
            default => 'mt-4'
        };
    }

    public function getComputedContainerClasses(): string
    {
        return $this->containerClasses();
    }

    public function getComputedTabListClasses(): string
    {
        return $this->tabListClasses();
    }

    public function getComputedPanelsContainerClasses(): string
    {
        return $this->panelsContainerClasses();
    }

    public function getUniqueId(): string
    {
        return $this->id ?? 'tabs-' . uniqid();
    }

    public function render()
    {
        return view('keys::components.tabs', [
            'computedContainerClasses' => $this->getComputedContainerClasses(),
            'computedTabListClasses' => $this->getComputedTabListClasses(),
            'computedPanelsContainerClasses' => $this->getComputedPanelsContainerClasses(),
            'uniqueId' => $this->getUniqueId(),
        ]);
    }
}
