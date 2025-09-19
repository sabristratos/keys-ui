<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class FileUpload extends Component
{
    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public ?string $accept = null,
        public bool $multiple = false,
        public ?int $maxSize = null,
        public ?int $maxFiles = null,
        public bool $disabled = false,
        public bool $required = false,
        public ?string $label = null,
        public ?string $description = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $preview = true,
        public bool $progress = true,
        public bool $dragDrop = true,
        public bool $autoUpload = false,
        public ?int $chunkSize = null,
        public array $existingFiles = [],
        public string $variant = 'default',
        public string $size = 'md',
        public bool $hasError = false
    ) {
        $this->id = $this->id ?? $this->name ?? 'file-upload-' . uniqid();

        if (!$this->hasError && $this->hasErrors()) {
            $this->hasError = true;
        }
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

    public function baseClasses(): string
    {
        return 'file-upload-wrapper relative';
    }

    public function dropZoneClasses(): string
    {
        $base = 'file-upload-zone relative rounded-lg border-2 border-dashed transition-all duration-200 ease-in-out';

        if ($this->disabled) {
            return $base . ' border-border bg-surface cursor-not-allowed opacity-50';
        }

        if ($this->hasError()) {
            return $base . ' border-danger bg-danger/5 hover:border-danger hover:bg-danger/10';
        }

        return $base . ' border-border bg-input hover:border-brand hover:bg-brand/5 focus-within:border-brand focus-within:bg-brand/5';
    }

    public function dropZoneSize(): string
    {
        return match ($this->size) {
            'sm' => 'p-4 min-h-24',
            'md' => 'p-6 min-h-32',
            'lg' => 'p-8 min-h-40',
            default => 'p-6 min-h-32'
        };
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

    public function buttonSize(): string
    {
        return match ($this->size) {
            'sm' => 'sm',
            'md' => 'md',
            'lg' => 'lg',
            default => 'md'
        };
    }

    public function getAcceptAttribute(): ?string
    {
        return $this->accept;
    }

    public function getMaxSizeInBytes(): ?int
    {
        return $this->maxSize ? $this->maxSize * 1024 : null;
    }

    public function getValidationRules(): array
    {
        $rules = [];

        if ($this->accept) {
            $rules['accept'] = $this->accept;
        }

        if ($this->maxSize) {
            $rules['maxSize'] = $this->getMaxSizeInBytes();
        }

        if ($this->maxFiles && $this->multiple) {
            $rules['maxFiles'] = $this->maxFiles;
        }

        return $rules;
    }

    public function getDropZoneText(): array
    {
        if ($this->multiple) {
            return [
                'primary' => __('Drop files here or click to browse'),
                'secondary' => $this->getFileTypeText() . ($this->maxFiles ? ' (max ' . $this->maxFiles . ' files)' : '')
            ];
        }

        return [
            'primary' => __('Drop a file here or click to browse'),
            'secondary' => $this->getFileTypeText()
        ];
    }

    public function getFileTypeText(): string
    {
        if (!$this->accept) {
            return 'Any file type';
        }

        $types = explode(',', $this->accept);
        $types = array_map('trim', $types);

        $readableTypes = [];
        foreach ($types as $type) {
            if (str_starts_with($type, 'image/')) {
                $readableTypes[] = 'Images';
            } elseif (str_starts_with($type, 'video/')) {
                $readableTypes[] = 'Videos';
            } elseif (str_starts_with($type, 'audio/')) {
                $readableTypes[] = 'Audio';
            } elseif ($type === 'application/pdf') {
                $readableTypes[] = 'PDF';
            } elseif (str_contains($type, 'document') || str_contains($type, 'text')) {
                $readableTypes[] = 'Documents';
            } else {
                $readableTypes[] = strtoupper(str_replace(['application/', 'text/'], '', $type));
            }
        }

        $readableTypes = array_unique($readableTypes);

        if (count($readableTypes) > 3) {
            return 'Multiple file types';
        }

        return implode(', ', $readableTypes) . ' only';
    }

    public function getSizeLimit(): ?string
    {
        if (!$this->maxSize) {
            return null;
        }

        if ($this->maxSize < 1024) {
            return $this->maxSize . ' KB';
        }

        return round($this->maxSize / 1024, 1) . ' MB';
    }

    public function formatFileSize(int $bytes): string
    {
        if ($bytes === 0) return '0 Bytes';
        $k = 1024;
        $sizes = ['Bytes', 'KB', 'MB', 'GB'];
        $i = floor(log($bytes) / log($k));
        return round($bytes / pow($k, $i), 2) . ' ' . $sizes[$i];
    }

    public function getComputedDropZoneData(): array
    {
        return [
            'file_upload_id' => $this->id,
            'accept' => $this->getAcceptAttribute(),
            'multiple' => $this->multiple ? 'true' : 'false',
            'max_size' => $this->getMaxSizeInBytes(),
            'max_files' => $this->maxFiles,
            'auto_upload' => $this->autoUpload ? 'true' : 'false',
            'chunk_size' => $this->chunkSize,
            'preview' => $this->preview ? 'true' : 'false',
            'progress' => $this->progress ? 'true' : 'false',
            'validation_rules' => json_encode($this->getValidationRules()),
            'existing_files' => json_encode($this->existingFiles)
        ];
    }

    public function getFileIconName(string $fileType, string $fileName): string
    {
        $type = strtolower($fileType);
        $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        // Images
        if (str_starts_with($type, 'image/')) {
            return 'heroicon-o-photo';
        }

        // Videos
        if (str_starts_with($type, 'video/')) {
            return 'heroicon-o-video-camera';
        }

        // Audio
        if (str_starts_with($type, 'audio/')) {
            return 'heroicon-o-musical-note';
        }

        // PDFs
        if ($type === 'application/pdf') {
            return 'heroicon-o-document-text';
        }

        // Archives
        if (in_array($extension, ['zip', 'rar', '7z', 'tar', 'gz']) || str_contains($type, 'zip') || str_contains($type, 'compressed')) {
            return 'heroicon-o-archive-box';
        }

        // Code files
        if (in_array($extension, ['js', 'ts', 'html', 'css', 'php', 'py', 'java', 'cpp', 'c', 'json', 'xml']) || str_contains($type, 'text')) {
            return 'heroicon-o-code-bracket';
        }

        // Presentations
        if (in_array($extension, ['ppt', 'pptx']) || str_contains($type, 'presentation')) {
            return 'heroicon-o-presentation-chart-bar';
        }

        // Spreadsheets
        if (in_array($extension, ['xls', 'xlsx', 'csv']) || str_contains($type, 'spreadsheet')) {
            return 'heroicon-o-table-cells';
        }

        // Default document icon
        return 'heroicon-o-document';
    }

    public function render()
    {
        return view('keys::components.file-upload', [
            'computedDropZoneData' => $this->getComputedDropZoneData(),
            'dropZoneText' => $this->getDropZoneText(),
            'sizeLimit' => $this->getSizeLimit(),
            'formatFileSize' => fn($bytes) => $this->formatFileSize($bytes),
            'getFileIconName' => fn($type, $name) => $this->getFileIconName($type, $name),
        ]);
    }
}