<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class FileUpload extends Component
{
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
        public string $previewStyle = 'transform'
    ) {
        $this->id = $this->id ?? $this->name ?? 'file-upload';
        $this->placeholder = $this->placeholder ?? 'Drop files here or click to browse';
    }

    public function isShorthand(): bool
    {
        return !is_null($this->label);
    }

    public function hasError(): bool
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

    public function isLivewireMode(): bool
    {
        return class_exists('Livewire\Component') && app()->bound('livewire');
    }

    public function getMaxSizeInBytes(): ?int
    {
        if (!$this->maxSize) {
            return null;
        }

        $size = trim(strtoupper($this->maxSize));
        $number = (int) $size;

        if (str_contains($size, 'KB')) {
            return $number * 1024;
        }

        if (str_contains($size, 'MB')) {
            return $number * 1024 * 1024;
        }

        if (str_contains($size, 'GB')) {
            return $number * 1024 * 1024 * 1024;
        }

        return $number;
    }

    public function baseClasses(): string
    {
        return 'relative border-2 border-dashed rounded-lg transition-all duration-200';
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'p-4',
            'md' => 'p-6',
            'lg' => 'p-8',
            default => 'p-6'
        };
    }

    public function stateClasses(): string
    {
        if ($this->disabled) {
            return 'border-neutral bg-surface cursor-not-allowed opacity-50';
        }

        if ($this->hasError()) {
            return 'border-danger bg-danger/5 hover:border-danger-hover';
        }

        return 'border-border bg-surface hover:border-brand hover:bg-brand/5 focus-within:border-brand focus-within:bg-brand/5';
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-file-upload' => 'true',
            'data-size' => $this->size,
            'data-drag-drop' => $this->dragDrop ? 'true' : 'false',
            'data-livewire' => $this->isLivewireMode() ? 'true' : 'false',
            'data-preview-style' => $this->previewStyle,
        ];

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->required) {
            $attributes['data-required'] = 'true';
        }

        if ($this->hasError()) {
            $attributes['data-invalid'] = 'true';
        }

        if ($this->accept !== '*') {
            $attributes['data-accept'] = $this->accept;
        }

        if ($this->maxSize) {
            $attributes['data-max-size'] = (string) $this->getMaxSizeInBytes();
            $attributes['data-max-size-formatted'] = $this->maxSize;
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

    public function render()
    {
        return view('keys::components.file-upload', [
            'dataAttributes' => $this->getDataAttributes(),
            'computedWireAttributes' => $this->getComputedWireAttributes(),
            'shouldShowLivewireContent' => $this->shouldShowLivewireContent(),
        ]);
    }
}