<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;
use Keys\UI\Concerns\HandlesValidationErrors;

/**
 * FileUpload Component
 *
 * A comprehensive file upload component with drag-and-drop support, file preview,
 * validation, and Livewire integration for real-time upload progress.
 */
class FileUpload extends Component
{
    use HandlesValidationErrors;

    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public string $accept = '*',
        public ?string $maxSize = null,
        public string $size = 'md',
        public bool $disabled = false,
        public bool $required = false,
        public ?string $label = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $dragDrop = true,
        public ?string $placeholder = null,
        public string $previewStyle = 'transform',
        public bool $multiple = false,
        public ?int $maxFiles = null
    ) {

        $this->id = $this->id ?? $this->name ?? 'file-upload-' . uniqid();


        if ($this->placeholder === null) {
            $this->placeholder = $this->multiple
                ? 'Drop files here or click to browse'
                : 'Drop file here or click to browse';
        }
    }

    /**
     * Check if the component is using shorthand mode (with label).
     */
    public function isShorthand(): bool
    {
        return !is_null($this->label);
    }

    /**
     * Check if Livewire is available and should be used for this component.
     *
     * Simple check:
     * - Livewire class must exist
     * - Component must have a name (required for wire:model)
     */
    public function isLivewireMode(): bool
    {
        if (!class_exists('Livewire\Component') || !app()->bound('livewire')) {
            return false;
        }


        if (empty($this->name)) {
            return false;
        }

        return true;
    }

    /**
     * Convert human-readable file size to bytes.
     *
     * Supports: KB, MB, GB, or raw bytes
     * Examples: "5MB", "100KB", "1GB", "1024"
     */
    public function getMaxSizeInBytes(): ?int
    {
        if (!$this->maxSize) {
            return null;
        }

        $size = trim(strtoupper($this->maxSize));
        $number = (int) $size;

        return match (true) {
            str_contains($size, 'GB') => $number * 1024 * 1024 * 1024,
            str_contains($size, 'MB') => $number * 1024 * 1024,
            str_contains($size, 'KB') => $number * 1024,
            default => $number
        };
    }

    /**
     * Get formatted accepted file types for display.
     *
     * Converts MIME types like "image/png,application/pdf" to "PNG, PDF"
     */
    public function getFormattedAcceptedTypes(): string
    {
        if ($this->accept === '*') {
            return '';
        }

        $acceptedTypes = explode(',', $this->accept);
        $displayTypes = array_map(
            fn($type) => strtoupper(str_replace(['image/', 'application/', '.'], '', trim($type))),
            $acceptedTypes
        );

        return implode(', ', $displayTypes);
    }

    /**
     * Get the appropriate icon size based on component size.
     */
    public function getIconSize(): string
    {
        return $this->size === 'sm' ? 'lg' : 'xl';
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-file-upload' => 'true',
            'data-size' => $this->size,
            'data-drag-drop' => $this->dragDrop ? 'true' : 'false',
            'data-livewire' => $this->isLivewireMode() ? 'true' : 'false',
            'data-preview-style' => $this->previewStyle,
            'data-multiple' => $this->multiple ? 'true' : 'false',
        ];

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        if ($this->hasErrors()) {
            $attributes['data-invalid'] = 'true';
        }

        if ($this->accept !== '*') {
            $attributes['data-accept'] = $this->accept;
        }

        if ($this->maxSize) {
            $attributes['data-max-size'] = (string) $this->getMaxSizeInBytes();
            $attributes['data-max-size-formatted'] = $this->maxSize;
        }

        if ($this->maxFiles) {
            $attributes['data-max-files'] = (string) $this->maxFiles;
        }

        return $attributes;
    }

    public function getComputedWireAttributes(): array
    {
        if (!$this->isLivewireMode() || !$this->name) {
            return [];
        }

        return [
            'wire:model' => $this->name,
            'wire:loading.attr' => 'disabled',
        ];
    }

    public function shouldShowLivewireContent(): bool
    {
        return $this->isLivewireMode() && $this->name;
    }

    /**
     * Render the file upload component.
     */
    public function render()
    {
        return view('keys::components.file-upload', [
            'dataAttributes' => $this->getDataAttributes(),
            'computedWireAttributes' => $this->getComputedWireAttributes(),
            'shouldShowLivewireContent' => $this->shouldShowLivewireContent(),
            'formattedAcceptedTypes' => $this->getFormattedAcceptedTypes(),
            'iconSize' => $this->getIconSize(),
        ]);
    }
}
