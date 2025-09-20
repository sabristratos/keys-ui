<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Input extends Component
{
    public function __construct(
        public string $type = 'text',
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = null,
        public ?string $placeholder = null,
        public string $size = 'md',
        public bool $disabled = false,
        public bool $readonly = false,
        public bool $required = false,
        public ?string $label = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public ?string $icon = null,  // Alias for iconLeft
        public ?string $iconLeft = null,
        public ?string $iconRight = null,
        public ?string $hint = null,  // Add support for hint text
        public array $actions = [],
        public bool $clearable = false,
        public bool $copyable = false,
        public bool $showPassword = false,
        public ?string $externalUrl = null,
        public string $actionVariant = 'ghost',
        public string $actionSize = 'xs',
        public bool $hasError = false
    ) {
        // Handle icon alias for iconLeft
        if ($this->icon && !$this->iconLeft) {
            $this->iconLeft = $this->icon;
        }

        $this->id = $this->id ?? $this->name;

        if (!$this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
    }

    public function isShorthand(): bool
    {
        return ! is_null($this->label);
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

    public function baseClasses(): string
    {
        return 'block w-full rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'xs' => 'px-2.5 py-1 text-xs',
            'sm' => 'px-3 py-1.5 text-sm',
            'md' => 'px-3 py-2 text-sm',
            'lg' => 'px-4 py-2.5 text-base',
            'xl' => 'px-4 py-3 text-base',
            default => 'px-3 py-2 text-sm'
        };
    }

    public function stateClasses(): string
    {
        if ($this->disabled) {
            return 'bg-surface border-border text-muted cursor-not-allowed opacity-50';
        }

        if ($this->hasError()) {
            return 'bg-input border-danger text-foreground focus:border-danger focus:ring-danger';
        }

        return 'bg-input border-border text-foreground focus:border-brand focus:ring-brand hover:border-neutral';
    }

    public function iconSize(): string
    {
        return match ($this->size) {
            'xs' => 'xs',
            'sm' => 'xs',
            'md' => 'sm',
            'lg' => 'md',
            'xl' => 'md',
            default => 'sm'
        };
    }

    public function iconPadding(): string
    {
        $leftPadding = '';
        $rightPadding = '';

        if ($this->iconLeft) {
            $leftPadding = match ($this->size) {
                'xs' => 'pl-7',
                'sm' => 'pl-8',
                'md' => 'pl-10',
                'lg' => 'pl-12',
                'xl' => 'pl-12',
                default => 'pl-10'
            };
        }

        if ($this->iconRight || $this->hasActions()) {
            $padding = $this->hasActions() ? $this->actionPadding() : match ($this->size) {
                'xs' => 'pr-7',
                'sm' => 'pr-8',
                'md' => 'pr-10',
                'lg' => 'pr-12',
                'xl' => 'pr-12',
                default => 'pr-10'
            };
            $rightPadding = $padding;
        }

        return trim($leftPadding . ' ' . $rightPadding);
    }

    public function iconPosition(): string
    {
        return 'top-1/2 transform -translate-y-1/2';
    }

    public function iconOffset(): array
    {
        // Use logical positioning (start/end) for RTL support
        return match ($this->size) {
            'xs' => ['left' => 'start-2', 'right' => 'end-2'],
            'sm' => ['left' => 'start-2.5', 'right' => 'end-2.5'],
            'md' => ['left' => 'start-3', 'right' => 'end-3'],
            'lg' => ['left' => 'start-3.5', 'right' => 'end-3.5'],
            'xl' => ['left' => 'start-3.5', 'right' => 'end-3.5'],
            default => ['left' => 'start-3', 'right' => 'end-3']
        };
    }

    public function hasActions(): bool
    {
        return ! empty($this->getAllActions());
    }

    public function getAllActions(): array
    {
        return $this->configuredActions();
    }

    public function actionPadding(): string
    {
        if (! $this->hasActions()) {
            return '';
        }

        $actionsCount = count($this->getAllActions());
        $actionWidth = match ($this->actionSize) {
            'xs' => 24,
            'sm' => 32,
            'md' => 40,
            default => 24
        };

        $totalWidth = ($actionsCount * $actionWidth) + (($actionsCount - 1) * 4) + 8;
        return 'pr-' . ceil($totalWidth / 4);
    }


    public function configuredActions(): array
    {
        $autoActions = [];

        if ($this->clearable) {
            $autoActions[] = [
                'action' => 'clear',
                'icon' => 'heroicon-o-x-mark',
                'label' => __('keys-ui::keys-ui.actions.clear_input')
            ];
        }

        if ($this->copyable) {
            $autoActions[] = [
                'action' => 'copy',
                'icon' => 'heroicon-o-clipboard',
                'label' => __('keys-ui::keys-ui.actions.copy_clipboard'),
                'icon_success' => 'heroicon-o-check',
                'label_success' => __('keys-ui::keys-ui.actions.copied')
            ];
        }

        if ($this->type === 'password' && $this->showPassword) {
            $autoActions[] = [
                'action' => 'password_toggle',
                'icon' => 'heroicon-o-eye',
                'label' => __('keys-ui::keys-ui.actions.show_password'),
                'icon_toggle' => 'heroicon-o-eye-slash',
                'label_toggle' => __('keys-ui::keys-ui.actions.hide_password')
            ];
        }

        if ($this->externalUrl) {
            $autoActions[] = [
                'action' => 'external',
                'icon' => 'heroicon-o-arrow-top-right-on-square',
                'label' => __('keys-ui::keys-ui.actions.open_new_tab'),
                'url' => $this->externalUrl
            ];
        }

        return array_merge($autoActions, $this->actions);
    }

    public function getComputedIconSize(): string
    {
        return $this->iconSize();
    }

    public function getComputedActionSize(): string
    {
        return $this->getActionSize();
    }

    public function getComputedActionData(): array
    {
        $actions = [];

        foreach ($this->getAllActions() as $action) {
            // Handle both 'type' and 'action' keys for action type
            $actionType = $action['type'] ?? $action['action'] ?? 'custom';

            // Handle label - use provided label or generate default
            $label = $action['label'] ?? $action['tooltip'] ?? 'Action';

            $computedAction = [
                'type' => $actionType,
                'icon' => $action['icon'] ?? 'heroicon-o-cursor-arrow-rays',
                'label' => $label,
                'is_multi_state' => isset($action['icon_toggle']) || isset($action['icon_success']),
                'data_action' => $actionType,
                'data_icon_default' => $action['icon'] ?? 'heroicon-o-cursor-arrow-rays',
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

    public function getComputedIconOffsets(): array
    {
        return $this->iconOffset();
    }

    public function getComputedIconPosition(): string
    {
        return $this->iconPosition();
    }

    public function getActionSize(): string
    {
        return match ($this->actionSize) {
            'xs' => 'xs',
            'sm' => 'sm',
            'md' => 'md',
            default => 'xs'
        };
    }

    public function render()
    {
        return view('keys::components.input', [
            'computedIconSize' => $this->getComputedIconSize(),
            'computedActionSize' => $this->getComputedActionSize(),
            'computedActionData' => $this->getComputedActionData(),
            'computedIconOffsets' => $this->getComputedIconOffsets(),
            'computedIconPosition' => $this->getComputedIconPosition(),
        ]);
    }
}
