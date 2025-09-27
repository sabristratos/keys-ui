<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

/**
 * Textarea Component
 *
 * A comprehensive textarea component with icon support, actions, validation, and advanced features.
 * Supports auto-resize, character counting, resize modes, and auto-generated actions.
 */
class Textarea extends Component
{
    /**
     * Create a new Textarea component instance.
     *
     * @param  string|null  $name  Form field name
     * @param  string|null  $id  Textarea ID (auto-generated if not provided)
     * @param  string|null  $value  Textarea value
     * @param  string|null  $placeholder  Placeholder text
     * @param  string  $size  Size variant (xs, sm, md, lg)
     * @param  bool  $disabled  Whether the textarea is disabled
     * @param  bool  $readonly  Whether the textarea is readonly
     * @param  bool  $required  Whether the textarea is required
     * @param  int  $rows  Number of visible text lines
     * @param  int|null  $cols  Number of visible character widths
     * @param  string  $resize  Resize behavior (none, both, horizontal, vertical)
     * @param  bool  $autoResize  Enable automatic height adjustment
     * @param  string|null  $label  Label text for shorthand mode
     * @param  bool  $optional  Whether to show optional indicator
     * @param  string|array|Collection|null  $errors  Validation errors
     * @param  bool  $showErrors  Whether to display validation errors
     * @param  string|null  $icon  Alias for iconLeft
     * @param  string|null  $iconLeft  Left icon name
     * @param  string|null  $iconRight  Right icon name
     * @param  string|null  $hint  Hint text below textarea
     * @param  array  $actions  Custom actions array
     * @param  bool  $clearable  Enable clear action
     * @param  bool  $copyable  Enable copy action
     * @param  string|null  $externalUrl  Enable external link action
     * @param  string  $actionVariant  Action button variant
     * @param  string  $actionSize  Action button size
     * @param  bool  $hasError  Force error state
     * @param  bool  $showCharacterCount  Show character count
     * @param  int|null  $maxLength  Maximum character length
     */
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = null,
        public ?string $placeholder = null,
        public string $size = 'md',
        public bool $disabled = false,
        public bool $readonly = false,
        public bool $required = false,
        public int $rows = 4,
        public ?int $cols = null,
        public string $resize = 'vertical',
        public bool $autoResize = false,
        public ?string $label = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public ?string $icon = null,
        public ?string $iconLeft = null,
        public ?string $iconRight = null,
        public ?string $hint = null,
        public array $actions = [],
        public bool $clearable = false,
        public bool $copyable = false,
        public ?string $externalUrl = null,
        public string $actionVariant = 'ghost',
        public string $actionSize = 'xs',
        public bool $hasError = false,
        public bool $showCharacterCount = false,
        public ?int $maxLength = null
    ) {
        if ($this->icon && ! $this->iconLeft) {
            $this->iconLeft = $this->icon;
        }

        $this->id = $this->id ?? $this->name ?? 'textarea-'.uniqid();

        if (! $this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
    }

    /**
     * Check if the component is using shorthand mode (with label).
     */
    public function isShorthand(): bool
    {
        return ! is_null($this->label);
    }

    /**
     * Check if the textarea has an error state.
     */
    public function hasError(): bool
    {
        return $this->hasError || $this->hasErrors();
    }

    /**
     * Check if validation errors exist.
     * Handles multiple error formats: string, array, Collection, MessageBag, ViewErrorBag.
     */
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

        if (is_object($this->errors) && method_exists($this->errors, 'any')) {
            return $this->errors->any();
        }

        if (is_object($this->errors) && method_exists($this->errors, 'getBag')) {
            try {
                $bag = $this->errors->getBag('default');

                return $bag && $bag->any();
            } catch (\Exception $e) {
                return false;
            }
        }

        return false;
    }

    /**
     * Check if the textarea has any configured actions.
     */
    public function hasActions(): bool
    {
        return ! empty($this->configuredActions());
    }

    /**
     * Get all configured actions including auto-generated and custom actions.
     * Auto-generates actions for clear, copy, and external URL features.
     */
    public function configuredActions(): array
    {
        $autoActions = [];

        if ($this->clearable) {
            $autoActions[] = [
                'action' => 'clear',
                'icon' => 'heroicon-o-x-mark',
                'label' => __('keys-ui::keys-ui.actions.clear_textarea'),
            ];
        }

        if ($this->copyable) {
            $autoActions[] = [
                'action' => 'copy',
                'icon' => 'heroicon-o-clipboard',
                'label' => __('keys-ui::keys-ui.actions.copy_clipboard'),
                'icon_success' => 'heroicon-o-check',
                'label_success' => __('keys-ui::keys-ui.actions.copied'),
            ];
        }

        if ($this->externalUrl) {
            $autoActions[] = [
                'action' => 'external',
                'icon' => 'heroicon-o-arrow-top-right-on-square',
                'label' => __('keys-ui::keys-ui.actions.open_new_tab'),
                'url' => $this->externalUrl,
            ];
        }

        return array_merge($autoActions, $this->actions);
    }

    /**
     * Process configured actions into computed data for Button components.
     * Transforms action arrays into format expected by Button component with multi-state support.
     */
    public function getComputedActionData(): array
    {
        $actions = [];

        foreach ($this->configuredActions() as $action) {
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

    /**
     * Generate comprehensive data attributes for CSS targeting and JavaScript functionality.
     * Includes component identification, state, features, icons, actions, and character counting.
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-textarea' => 'true',
            'data-size' => $this->size,
        ];

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

        if ($this->autoResize) {
            $attributes['data-auto-resize'] = 'true';
        }

        if ($this->showCharacterCount) {
            $attributes['data-show-character-count'] = 'true';
        }

        if ($this->maxLength) {
            $attributes['data-max-length'] = $this->maxLength;
        }

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

        if ($this->hasActions()) {
            $attributes['data-has-actions'] = 'true';
            $attributes['data-actions-count'] = count($this->configuredActions());
        }

        if ($this->clearable) {
            $attributes['data-clearable'] = 'true';
        }

        if ($this->copyable) {
            $attributes['data-copyable'] = 'true';
        }

        if ($this->externalUrl) {
            $attributes['data-external-url'] = $this->externalUrl;
        }

        if (! empty($this->value)) {
            $attributes['data-has-value'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the textarea component view.
     */
    public function render()
    {
        return view('keys::components.textarea', [
            'computedActionData' => $this->getComputedActionData(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
