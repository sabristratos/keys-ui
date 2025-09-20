<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Button extends Component
{
    public function __construct(
        public string $variant = 'brand',
        public string $size = 'md',
        public ?string $type = null,
        public ?string $href = null,
        public bool $disabled = false,
        public bool $loading = false,
        public ?string $icon = null,
        public ?string $iconLeft = null,
        public ?string $iconRight = null,
        public string $loadingAnimation = 'spinner',
        public ?string $iconToggle = null,
        public ?string $iconSuccess = null,
        public ?string $labelToggle = null,
        public ?string $labelSuccess = null
    ) {
        if ($this->icon && !$this->iconLeft) {
            $this->iconLeft = $this->icon;
        }

        if (!in_array($this->variant, ComponentConstants::BUTTON_VARIANTS)) {
            $this->variant = ComponentConstants::getDefaultColor();
        }

        if (!ComponentConstants::isValidSize($this->size)) {
            $this->size = ComponentConstants::getDefaultSize();
        }

        if (!in_array($this->loadingAnimation, ComponentConstants::BUTTON_LOADING_ANIMATIONS)) {
            $this->loadingAnimation = 'spinner';
        }
    }

    public function isLink(): bool
    {
        return ! is_null($this->href);
    }

    public function elementType(): string
    {
        if ($this->isLink()) {
            return $this->disabled ? 'span' : 'a';
        }

        return 'button';
    }

    public function buttonType(): ?string
    {
        if ($this->isLink()) {
            return null;
        }

        return $this->type ?? 'button';
    }

    public function baseClasses(): string
    {
        return 'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
    }

    public function variantClasses(): string
    {
        return match ($this->variant) {
            'brand' => 'border border-brand bg-brand text-foreground-brand hover:border-brand-hover hover:bg-brand-hover active:border-brand-active active:bg-brand-active disabled:border-brand-disabled disabled:bg-brand-disabled focus-visible:ring-brand',
            'danger' => 'border border-danger bg-danger text-foreground-danger hover:border-danger-hover hover:bg-danger-hover active:border-danger-active active:bg-danger-active disabled:border-danger-disabled disabled:bg-danger-disabled focus-visible:ring-danger',
            'warning' => 'border border-warning bg-warning text-foreground-warning hover:border-warning-hover hover:bg-warning-hover active:border-warning-active active:bg-warning-active disabled:border-warning-disabled disabled:bg-warning-disabled focus-visible:ring-warning',
            'success' => 'border border-success bg-success text-foreground-success hover:border-success-hover hover:bg-success-hover active:border-success-active active:bg-success-active disabled:border-success-disabled disabled:bg-success-disabled focus-visible:ring-success',
            'info' => 'border border-info bg-info text-foreground-info hover:border-info-hover hover:bg-info-hover active:border-info-active active:bg-info-active disabled:border-info-disabled disabled:bg-info-disabled focus-visible:ring-info',
            'neutral' => 'border border-neutral bg-neutral text-foreground-neutral hover:border-neutral-hover hover:bg-neutral-hover active:border-neutral-active active:bg-neutral-active disabled:border-neutral-disabled disabled:bg-neutral-disabled focus-visible:ring-neutral',
            'ghost' => 'border border-transparent bg-transparent text-foreground hover:bg-surface active:bg-border disabled:text-neutral-disabled focus-visible:ring-neutral',
            'outline' => 'bg-transparent border border-border text-foreground hover:bg-surface active:bg-border disabled:text-neutral-disabled focus-visible:ring-neutral',
            default => 'border border-brand bg-brand text-foreground-brand hover:border-brand-hover hover:bg-brand-hover active:border-brand-active active:bg-brand-active disabled:border-brand-disabled disabled:bg-brand-disabled focus-visible:ring-brand'
        };
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'xs' => 'px-2 py-1 text-xs rounded-sm',
            'sm' => 'px-3 py-1.5 text-sm rounded-md',
            'md' => 'px-4 py-2 text-sm rounded-md',
            'lg' => 'px-6 py-2.5 text-base rounded-lg',
            'xl' => 'px-8 py-3 text-lg rounded-lg',
            default => 'px-4 py-2 text-sm rounded-md'
        };
    }

    public function iconOnlySizeClasses(): string
    {
        return match ($this->size) {
            'xs' => 'p-1 text-xs rounded-sm w-max h-max',
            'sm' => 'p-1.5 text-sm rounded-md w-max h-max',
            'md' => 'p-2 text-sm rounded-md w-max h-max',
            'lg' => 'p-2.5 text-base rounded-lg w-max h-max',
            'xl' => 'p-3 text-lg rounded-lg w-max h-max',
            default => 'p-2 text-sm rounded-md w-max h-max'
        };
    }

    public function iconSize(): string
    {
        return match ($this->size) {
            'xs' => 'xs',
            'sm' => 'sm',
            'md' => 'sm',
            'lg' => 'md',
            'xl' => 'lg',
            default => 'sm'
        };
    }

    public function disabledClasses(): string
    {
        return ($this->disabled || $this->loading) ? 'cursor-not-allowed opacity-50' : '';
    }

    public function isIconOnly(string $slotContent = ''): bool
    {
        $contentWithoutSrOnly = preg_replace('/<[^>]*sr-only[^>]*>.*?<\/[^>]*>/s', '', $slotContent);
        $contentWithoutSrOnly = preg_replace('/<[^>]*sr-only[^>]*>/s', '', $contentWithoutSrOnly);

        return trim(strip_tags($contentWithoutSrOnly)) === '' && ($this->iconLeft || $this->iconRight);
    }

    public function isMultiState(): bool
    {
        return ! is_null($this->iconToggle) || ! is_null($this->iconSuccess);
    }

    public function getDataAttributes(): array
    {
        $attributes = [];

        if ($this->isMultiState()) {
            $attributes['data-icon-default'] = $this->iconLeft;

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

    public function render()
    {
        return view('keys::components.button');
    }
}
