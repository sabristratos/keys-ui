<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Radio extends Component
{
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = null,
        public bool $checked = false,
        public bool $disabled = false,
        public bool $required = false,
        public string $variant = 'standard',
        public string $color = 'brand',
        public string $size = 'md',
        public ?string $label = null,
        public ?string $description = null,
        public ?string $title = null,
        public ?string $icon = null,
        public string $labelPosition = 'right',
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public array $actions = [],
        public string $actionVariant = 'ghost',
        public string $actionSize = 'xs',
        public bool $hasError = false,
        public bool $showInput = true
    ) {

        $this->id = $this->id ?? ($this->name ? $this->name . '-' . $this->value : 'radio-' . uniqid());


        if (!$this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }


        if (!in_array($this->variant, ['standard', 'bordered', 'colored', 'card'])) {
            $this->variant = 'standard';
        }


        if (!in_array($this->color, ['brand', 'success', 'warning', 'danger', 'neutral'])) {
            $this->color = 'brand';
        }

        if ($this->variant === 'card' && !$this->title && $this->label) {
            $this->title = $this->label;
            $this->label = null;
        }
    }

    public function hasError(): bool
    {
        return $this->hasError || $this->hasErrors();
    }

    public function hasErrors(): bool
    {
        if (is_null($this->errors)) {
            return false;
        }

        if (is_string($this->errors)) {
            return ! empty(trim($this->errors));
        }

        if (is_array($this->errors)) {
            return ! empty($this->errors);
        }

        if ($this->errors instanceof Collection) {
            return $this->errors->isNotEmpty();
        }

        return false;
    }

    public function radioClasses(): string
    {
        $baseClasses = 'border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

        $sizeClasses = match ($this->size) {
            'sm' => 'h-3 w-3 text-xs',
            'md' => 'h-3.5 w-3.5 text-sm',
            'lg' => 'h-4 w-4 text-base',
            default => 'h-3.5 w-3.5 text-sm'
        };

        $variantClasses = match ($this->variant) {
            'standard', 'bordered', 'card' => 'rounded-full',
            'colored' => 'rounded-full border-2',
            default => 'rounded-full'
        };

        $stateClasses = $this->getStateClasses();

        return trim($baseClasses . ' ' . $sizeClasses . ' ' . $variantClasses . ' ' . $stateClasses);
    }

    public function getStateClasses(): string
    {
        if ($this->disabled) {
            return 'bg-neutral-100 border-neutral-300 text-neutral-400 cursor-not-allowed dark:bg-neutral-800 dark:border-neutral-700';
        }

        if ($this->hasError()) {
            return 'bg-input border-danger text-danger focus:border-danger focus:ring-danger';
        }

        $colorClasses = match ($this->color) {
            'brand' => 'text-brand focus:ring-brand',
            'success' => 'text-success focus:ring-success',
            'warning' => 'text-warning focus:ring-warning',
            'danger' => 'text-danger focus:ring-danger',
            'neutral' => 'text-neutral-600 focus:ring-neutral-500',
            default => 'text-brand focus:ring-brand'
        };

        if ($this->variant === 'colored') {
            $borderColor = match ($this->color) {
                'brand' => 'border-brand',
                'success' => 'border-success',
                'warning' => 'border-warning',
                'danger' => 'border-danger',
                'neutral' => 'border-neutral-400',
                default => 'border-brand'
            };
            return "bg-input border-border hover:$borderColor $colorClasses";
        }

        return 'bg-input border-border hover:border-neutral-300 dark:hover:border-neutral-600 ' . $colorClasses;
    }

    public function combinedClasses(): string
    {
        $gap = ($this->variant === 'card' && !$this->showInput) ? 'gap-0' : 'gap-3';

        $baseClasses = match ($this->variant) {
            'standard' => "flex items-center {$gap} cursor-pointer",
            'bordered' => "flex items-center {$gap} p-4 border border-border rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200 cursor-pointer",
            'colored' => "flex items-center {$gap} p-4 border-2 rounded-lg transition-colors duration-200 cursor-pointer",
            'card' => "flex items-center {$gap} p-4 border border-border rounded-lg hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors duration-200 cursor-pointer",
            default => "flex items-center {$gap} cursor-pointer"
        };

        if ($this->variant === 'colored') {
            $borderColor = match ($this->color) {
                'brand' => 'border-border has-[:checked]:border-brand has-[:checked]:bg-brand/5',
                'success' => 'border-border has-[:checked]:border-success has-[:checked]:bg-success/5',
                'warning' => 'border-border has-[:checked]:border-warning has-[:checked]:bg-warning/5',
                'danger' => 'border-border has-[:checked]:border-danger has-[:checked]:bg-danger/5',
                'neutral' => 'border-border has-[:checked]:border-neutral-400 has-[:checked]:bg-neutral-100 dark:has-[:checked]:bg-neutral-800',
                default => 'border-border has-[:checked]:border-brand has-[:checked]:bg-brand/5'
            };
            $baseClasses .= ' ' . $borderColor;
        }

        if ($this->variant === 'card') {
            $bgColor = match ($this->color) {
                'brand' => 'has-[:checked]:bg-brand/5 has-[:checked]:border-brand',
                'success' => 'has-[:checked]:bg-success/5 has-[:checked]:border-success',
                'warning' => 'has-[:checked]:bg-warning/5 has-[:checked]:border-warning',
                'danger' => 'has-[:checked]:bg-danger/5 has-[:checked]:border-danger',
                'neutral' => 'has-[:checked]:bg-neutral-100 has-[:checked]:border-neutral-400 dark:has-[:checked]:bg-neutral-800',
                default => 'has-[:checked]:bg-brand/5 has-[:checked]:border-brand'
            };
            $baseClasses .= ' ' . $bgColor;
        }

        if ($this->hasError()) {
            $baseClasses .= ' border-danger';
        }

        return $baseClasses;
    }

    public function wrapperClasses(): string
    {
        return $this->combinedClasses();
    }

    public function labelClasses(): string
    {
        $sizeClasses = match ($this->size) {
            'sm' => 'text-sm',
            'md' => 'text-sm',
            'lg' => 'text-base',
            default => 'text-sm'
        };

        $colorClasses = $this->disabled ? 'text-neutral-500 dark:text-neutral-400' : 'text-foreground';
        $weightClasses = $this->variant === 'card' ? 'font-medium' : 'font-normal';

        return trim($sizeClasses . ' ' . $colorClasses . ' ' . $weightClasses);
    }

    public function iconSize(): string
    {
        return match ($this->size) {
            'sm' => 'sm',
            'md' => 'md',
            'lg' => 'lg',
            default => 'md'
        };
    }

    public function hasActions(): bool
    {
        return ! empty($this->actions);
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

    public function isCard(): bool
    {
        return $this->variant === 'card';
    }

    public function hasContent(): bool
    {
        return $this->label || $this->title || $this->description;
    }

    public function render()
    {
        return view('keys::components.radio', [
            'computedActionSize' => $this->getComputedActionSize(),
            'computedActionData' => $this->getComputedActionData(),
        ]);
    }
}
