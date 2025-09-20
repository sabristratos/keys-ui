<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Editor extends Component
{
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $value = null,
        public string $placeholder = 'Start typing...',
        public string $height = '200px',
        public bool $disabled = false,
        public array $toolbar = [],
        public string $size = 'md',
        public string $theme = 'snow',
        public ?string $label = null,
        public bool $required = false,
        public ?string $describedBy = null,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $hasError = false,
        public bool $optional = false,
        public bool $loading = false,
        public string $loadingAnimation = 'spinner',
        public string $loadingText = 'Loading...'
    ) {
        // Default toolbar if none provided - using proper Quill format
        if (empty($this->toolbar)) {
            $this->toolbar = [
                ['bold', 'italic', 'underline'],
                [['header' => [1, 2, false]]],
                [['list' => 'ordered'], ['list' => 'bullet']],
                ['link'],
                ['clean']
            ];
        }

        // Generate unique ID if not provided
        if (!$this->id) {
            $this->id = 'editor-' . uniqid();
        }

        // Validate size
        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->size = 'md';
        }

        // Validate theme
        if (!in_array($this->theme, ['snow', 'bubble'])) {
            $this->theme = 'snow';
        }

        // Validate loading animation
        if (!in_array($this->loadingAnimation, ['spinner', 'dots', 'pulse'])) {
            $this->loadingAnimation = 'spinner';
        }

        // Set error state if errors are present
        if (!$this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
    }

    public function getQuillConfig(): array
    {
        $config = [
            'theme' => $this->theme,
            'placeholder' => $this->placeholder,
            'modules' => $this->getQuillModules()
        ];

        // Add readOnly if disabled or loading
        if ($this->disabled || $this->loading) {
            $config['readOnly'] = true;
        }

        return $config;
    }

    public function getQuillModules(): array
    {
        return [
            'toolbar' => $this->toolbar
        ];
    }

    public function editorClasses(): string
    {
        $classes = "quill-editor quill-editor-{$this->size}";

        $stateClasses = $this->stateClasses();
        if ($stateClasses) {
            $classes .= ' ' . $stateClasses;
        }

        return $classes;
    }

    public function containerClasses(): string
    {
        return "quill-container quill-container-{$this->size}";
    }

    public function getDataAttributes(): array
    {
        return [
            'data-quill-editor' => 'true',
            'data-editor-id' => $this->id,
            'data-size' => $this->size,
            'data-disabled' => $this->disabled ? 'true' : 'false',
        ];
    }

    public function getAccessibilityAttributes(): array
    {
        $attributes = [
            'role' => 'textbox',
            'aria-multiline' => 'true',
            'aria-label' => $this->label ?? ($this->name ? ucfirst(str_replace('_', ' ', $this->name)) : 'Rich text editor'),
        ];

        if ($this->required) {
            $attributes['aria-required'] = 'true';
        }

        if ($this->disabled) {
            $attributes['aria-disabled'] = 'true';
        }

        if ($this->describedBy) {
            $attributes['aria-describedby'] = $this->describedBy;
        }

        return $attributes;
    }

    public function getToolbarAccessibilityAttributes(): array
    {
        return [
            'role' => 'toolbar',
            'aria-label' => 'Rich text editor toolbar',
            'data-quill-toolbar' => 'true',
        ];
    }

    public function getLiveRegionId(): string
    {
        return $this->id . '-live-region';
    }

    public function isShorthand(): bool
    {
        return !is_null($this->label);
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
            return !empty(trim($this->errors));
        }

        if (is_array($this->errors)) {
            return !empty($this->errors);
        }

        if ($this->errors instanceof Collection) {
            return $this->errors->isNotEmpty();
        }

        return false;
    }

    public function stateClasses(): string
    {
        $classes = [];

        if ($this->disabled || $this->loading) {
            $classes[] = 'quill-editor-disabled';
        }

        if ($this->loading) {
            $classes[] = 'quill-editor-loading';
        }

        if ($this->hasError()) {
            $classes[] = 'quill-editor-error';
        }

        return implode(' ', $classes);
    }

    public function isDisabledOrLoading(): bool
    {
        return $this->disabled || $this->loading;
    }

    public function getEditorHeight(): string
    {
        return $this->height;
    }

    public function render()
    {
        return view('keys::components.editor', [
            'quillConfig' => $this->getQuillConfig(),
            'editorClasses' => $this->editorClasses(),
            'containerClasses' => $this->containerClasses(),
            'dataAttributes' => $this->getDataAttributes(),
            'editorHeight' => $this->getEditorHeight(),
            'accessibilityAttributes' => $this->getAccessibilityAttributes(),
            'toolbarAccessibilityAttributes' => $this->getToolbarAccessibilityAttributes(),
            'liveRegionId' => $this->getLiveRegionId(),
        ]);
    }
}