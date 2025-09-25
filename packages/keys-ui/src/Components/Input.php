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

        // Handle Laravel MessageBag
        if (is_object($this->errors) && method_exists($this->errors, 'any')) {
            return $this->errors->any();
        }

        // Handle ViewErrorBag
        if (is_object($this->errors) && method_exists($this->errors, 'getBag')) {
            try {
                $bag = $this->errors->getBag('default');
                return $bag && $bag->any();
            } catch (\Exception $e) {
                // If getBag fails, treat as no errors
                return false;
            }
        }

        return false;
    }


    public function hasActions(): bool
    {
        return ! empty($this->configuredActions());
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


    public function getComputedActionData(): array
    {
        $actions = [];

        foreach ($this->configuredActions() as $action) {
            // Handle both 'type' and 'action' keys for action type
            $actionType = $action['type'] ?? $action['action'] ?? 'custom';

            $computedAction = [
                'data_action' => $actionType,
                'data_icon_default' => $action['icon'] ?? 'heroicon-o-cursor-arrow-rays',
                'icon' => $action['icon'] ?? 'heroicon-o-cursor-arrow-rays',
                'icon_toggle' => $action['icon_toggle'] ?? null,
                'icon_success' => $action['icon_success'] ?? null,
                'label' => $action['label'] ?? $action['tooltip'] ?? 'Action',
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


    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-input' => 'true',
            'data-type' => $this->type,
            'data-size' => $this->size,
        ];

        // State attributes
        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->readonly) {
            $attributes['data-readonly'] = 'true';
        }

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        if ($this->hasError()) {
            $attributes['data-invalid'] = 'true';
        }

        // Icon attributes
        if ($this->iconLeft) {
            $attributes['data-has-icon-left'] = 'true';
            $attributes['data-icon-left'] = $this->iconLeft;
        }

        if ($this->iconRight) {
            $attributes['data-has-icon-right'] = 'true';
            $attributes['data-icon-right'] = $this->iconRight;
        }

        if ($this->iconLeft || $this->iconRight) {
            $attributes['data-has-icon'] = 'true';
        }

        // Action attributes
        if ($this->hasActions()) {
            $attributes['data-has-actions'] = 'true';
            $attributes['data-actions-count'] = count($this->configuredActions());
        }

        // Feature flags
        if ($this->clearable) {
            $attributes['data-clearable'] = 'true';
        }

        if ($this->copyable) {
            $attributes['data-copyable'] = 'true';
        }

        if ($this->type === 'password' && $this->showPassword) {
            $attributes['data-password-toggle'] = 'true';
        }

        if ($this->externalUrl) {
            $attributes['data-external-url'] = $this->externalUrl;
        }

        // Value state (for dynamic styling)
        if (!empty($this->value)) {
            $attributes['data-has-value'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.input', [
            'computedActionData' => $this->getComputedActionData(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
