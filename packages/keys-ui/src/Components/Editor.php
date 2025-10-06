<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Concerns\HandlesValidationErrors;

class Editor extends Component
{
    use HandlesValidationErrors;

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
        
        if (empty($this->toolbar)) {
            $this->toolbar = [
                ['bold', 'italic', 'underline'],
                [['header' => [1, 2, false]]],
                [['list' => 'ordered'], ['list' => 'bullet']],
                ['link'],
                ['clean']
            ];
        }

        
        if (!$this->id) {
            $this->id = 'editor-' . uniqid();
        }

        
        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->size = 'md';
        }

        
        if (!in_array($this->theme, ['snow', 'bubble'])) {
            $this->theme = 'snow';
        }

        
        if (!in_array($this->loadingAnimation, ['spinner', 'dots', 'pulse'])) {
            $this->loadingAnimation = 'spinner';
        }

        
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

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-editor' => 'true',
            'data-quill-editor' => 'true',
            'data-editor-id' => $this->id,
            'data-size' => $this->size,
            'data-theme' => $this->theme,
        ];

        
        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->loading) {
            $attributes['data-loading'] = 'true';
            $attributes['data-loading-animation'] = $this->loadingAnimation;
        }

        if ($this->hasError()) {
            $attributes['data-invalid'] = 'true';
        }

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        return $attributes;
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


    public function render()
    {
        return view('keys::components.editor', [
            'quillConfig' => $this->getQuillConfig(),
            'dataAttributes' => $this->getDataAttributes(),
            'accessibilityAttributes' => $this->getAccessibilityAttributes(),
            'toolbarAccessibilityAttributes' => $this->getToolbarAccessibilityAttributes(),
            'liveRegionId' => $this->getLiveRegionId(),
        ]);
    }
}