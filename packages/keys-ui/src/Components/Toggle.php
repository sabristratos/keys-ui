<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Toggle extends Component
{
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = '1',
        public bool $checked = false,
        public bool $disabled = false,
        public bool $required = false,
        public string $color = 'brand',
        public string $size = 'md',
        public ?string $label = null,
        public ?string $description = null,
        public string $labelPosition = 'right',
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public array $actions = [],
        public string $actionVariant = 'ghost',
        public string $actionSize = 'xs',
        public bool $hasError = false
    ) {
        $this->id = $this->id ?? ($this->name ? $this->name . '-toggle-' . uniqid() : 'toggle-' . uniqid());

        if (!$this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }

        $validColors = ['brand', 'success', 'warning', 'danger', 'neutral', 'red', 'green', 'purple', 'yellow', 'teal', 'orange'];
        if (!in_array($this->color, $validColors)) {
            $this->color = 'brand';
        }

        if (!in_array($this->size, ['sm', 'md', 'lg'])) {
            $this->size = 'md';
        }

        if (!in_array($this->labelPosition, ['left', 'right'])) {
            $this->labelPosition = 'right';
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

    public function toggleClasses(): string
    {
        $baseClasses = 'sr-only peer';

        return $baseClasses;
    }

    public function trackClasses(): string
    {
        $sizeClasses = match ($this->size) {
            'sm' => 'w-9 h-5',
            'md' => 'w-11 h-6',
            'lg' => 'w-14 h-7',
            default => 'w-11 h-6'
        };

        $baseClasses = "relative {$sizeClasses} bg-neutral-200 rounded-full peer dark:bg-neutral-700 transition-all duration-200";

        $focusClasses = $this->getFocusClasses();

        $checkedClasses = $this->getCheckedClasses();

        $thumbClasses = $this->getThumbClasses();

        $disabledClasses = $this->disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

        return trim("{$baseClasses} {$focusClasses} {$checkedClasses} {$thumbClasses} {$disabledClasses}");
    }

    public function getFocusClasses(): string
    {
        $focusColor = match ($this->color) {
            'brand' => 'peer-focus:ring-brand/30',
            'success' => 'peer-focus:ring-success/30',
            'warning' => 'peer-focus:ring-warning/30',
            'danger' => 'peer-focus:ring-danger/30',
            'neutral' => 'peer-focus:ring-neutral/30',
            'red' => 'peer-focus:ring-red-300 dark:peer-focus:ring-red-800',
            'green' => 'peer-focus:ring-green-300 dark:peer-focus:ring-green-800',
            'purple' => 'peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800',
            'yellow' => 'peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800',
            'teal' => 'peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800',
            'orange' => 'peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800',
            default => 'peer-focus:ring-brand/30'
        };

        return "peer-focus:ring-4 {$focusColor}";
    }

    public function getCheckedClasses(): string
    {
        $checkedColor = match ($this->color) {
            'brand' => 'peer-checked:bg-brand',
            'success' => 'peer-checked:bg-success',
            'warning' => 'peer-checked:bg-warning',
            'danger' => 'peer-checked:bg-danger',
            'neutral' => 'peer-checked:bg-neutral',
            'red' => 'peer-checked:bg-red-600',
            'green' => 'peer-checked:bg-green-600',
            'purple' => 'peer-checked:bg-purple-600',
            'yellow' => 'peer-checked:bg-yellow-400',
            'teal' => 'peer-checked:bg-teal-600',
            'orange' => 'peer-checked:bg-orange-500',
            default => 'peer-checked:bg-brand'
        };

        return $checkedColor;
    }

    public function getThumbClasses(): string
    {
        $thumbSize = match ($this->size) {
            'sm' => 'after:h-4 after:w-4',
            'md' => 'after:h-5 after:w-5',
            'lg' => 'after:h-6 after:w-6',
            default => 'after:h-5 after:w-5'
        };

        $translateDistance = match ($this->size) {
            'sm' => 'peer-checked:after:translate-x-4',
            'md' => 'peer-checked:after:translate-x-5',
            'lg' => 'peer-checked:after:translate-x-7',
            default => 'peer-checked:after:translate-x-5'
        };

        $baseThumbClasses = "after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full {$thumbSize} after:transition-all dark:border-neutral-600 peer-checked:after:border-white";

        return "{$translateDistance} rtl:peer-checked:after:-translate-x-full {$baseThumbClasses}";
    }

    public function combinedClasses(): string
    {
        $flexDirection = $this->labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row';
        $gap = $this->hasContent() ? 'gap-3' : 'gap-0';

        $baseClasses = "inline-flex items-center {$flexDirection} {$gap} cursor-pointer";

        if ($this->disabled) {
            $baseClasses .= ' opacity-50 cursor-not-allowed';
        }

        if ($this->hasError()) {
            $baseClasses .= ' text-danger';
        }

        return $baseClasses;
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
        $weightClasses = 'font-medium';

        return trim($sizeClasses . ' ' . $colorClasses . ' ' . $weightClasses);
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

    public function hasContent(): bool
    {
        return $this->label || $this->description;
    }

    public function render()
    {
        return view('keys::components.toggle', [
            'computedActionSize' => $this->getComputedActionSize(),
            'computedActionData' => $this->getComputedActionData(),
        ]);
    }
}
