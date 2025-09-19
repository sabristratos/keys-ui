@php
    $dropZoneData = $computedDropZoneData;
    $dropZoneText = $dropZoneText;
    $sizeLimit = $sizeLimit;
@endphp

<div {{ $attributes->whereDoesntStartWith('wire:')->merge(['class' => $baseClasses()]) }}>
    @if($isShorthand())
        <x-keys::label
            :for="$id"
            :required="$required"
            :optional="$optional"
            class="mb-2"
        >
            {{ $label }}
        </x-keys::label>
    @endif

    @if($description)
        <p class="text-sm text-muted mb-3">{{ $description }}</p>
    @endif

    {{-- Hidden file input with Livewire attributes --}}
    <input
        type="file"
        id="{{ $id }}"
        name="{{ $name }}"
        @if($accept) accept="{{ $accept }}" @endif
        @if($multiple) multiple @endif
        @if($required) required @endif
        @if($disabled) disabled @endif
        {{ $attributes->whereStartsWith('wire:') }}
        class="file-input-hidden sr-only"
        data-file-input="true"
    />

    {{-- Drop zone --}}
    <div
        class="{{ $dropZoneClasses() }} {{ $dropZoneSize() }} group focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none cursor-pointer transition-all duration-200"
        data-file-upload-zone="true"
        role="button"
        tabindex="0"
        aria-describedby="{{ $id }}-description"
        aria-label="{{ $multiple ? 'Drop files here or click to browse' : 'Drop a file here or click to browse' }}"
        aria-live="polite"
        @foreach($dropZoneData as $key => $value)
            data-{{ str_replace('_', '-', $key) }}="{{ $value }}"
        @endforeach
    >
        {{-- Default drop zone content --}}
        <div class="file-upload-content text-center pointer-events-none" data-upload-state="idle">
            <div class="flex flex-col items-center space-y-3">
                <div class="relative">
                    <x-keys::icon
                        name="heroicon-o-cloud-arrow-up"
                        :size="$iconSize()"
                        class="text-muted transition-colors group-hover:text-brand group-focus-visible:text-brand"
                    />
                </div>

                <div class="space-y-1">
                    <p class="text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                        <span class="inline-flex items-center gap-2">
                            {{ $dropZoneText['primary'] }}
                        </span>
                    </p>
                    <p class="text-xs text-muted" id="{{ $id }}-description">
                        {{ $dropZoneText['secondary'] }}
                        @if($sizeLimit)
                            <span class="block mt-1 font-medium">Max size: {{ $sizeLimit }}</span>
                        @endif
                    </p>
                </div>
            </div>
        </div>

        {{-- Drag over state --}}
        <div class="file-upload-content text-center hidden" data-upload-state="dragover" aria-live="polite">
            <div class="flex flex-col items-center space-y-3">
                <x-keys::icon
                    name="heroicon-o-cloud-arrow-down"
                    :size="$iconSize()"
                    class="text-brand animate-bounce"
                />

                <div class="space-y-1">
                    <p class="text-sm font-medium text-brand">
                        {{ $multiple ? 'Drop files to upload' : 'Drop file to upload' }}
                    </p>
                </div>
            </div>
        </div>

        {{-- Upload progress state --}}
        <div class="file-upload-content hidden" data-upload-state="uploading" aria-live="polite">
            <div class="space-y-4">
                <div class="flex items-center justify-center space-x-2">
                    <x-keys::loading size="sm" />
                    <span class="text-sm font-medium text-foreground" id="{{ $id }}-upload-status">Uploading...</span>
                </div>

                @if($progress)
                    <x-keys::progress
                        :value="0"
                        size="sm"
                        color="brand"
                        data-upload-progress="true"
                        aria-describedby="{{ $id }}-upload-status"
                    />
                @endif
            </div>
        </div>
    </div>

    {{-- File preview area --}}
    @if($preview)
        <div class="file-preview-area mt-4 hidden" data-file-previews="true" role="region" aria-label="File previews">
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-foreground" id="{{ $id }}-preview-heading">
                        {{ $multiple ? 'Selected Files' : 'Selected File' }}
                    </h4>
                    @if($multiple && !$disabled)
                        <button
                            type="button"
                            class="hidden add-more-files-btn text-xs text-brand hover:text-brand-hover bg-brand/10 hover:bg-brand/20 px-3 py-1 rounded-md transition-colors"
                            data-add-more-files="true"
                            aria-label="Add more files to selection"
                        >
                            + Add More
                        </button>
                    @endif
                </div>
                <div class="file-preview-list space-y-3" data-preview-list="true" aria-labelledby="{{ $id }}-preview-heading" role="list">
                    {{-- File previews will be inserted here by JavaScript --}}
                </div>
            </div>
        </div>
    @endif

    {{-- Existing files --}}
    @if(!empty($existingFiles))
        <div class="existing-files-area mt-4" role="region" aria-label="Current files">
            <div class="space-y-3">
                <h4 class="text-sm font-medium text-foreground" id="{{ $id }}-existing-heading">Current Files</h4>
                <div class="existing-files-list space-y-2" aria-labelledby="{{ $id }}-existing-heading" role="list">
                    @foreach($existingFiles as $file)
                        <div class="existing-file-item flex items-center justify-between p-3 border border-border rounded-md bg-surface transition-colors hover:bg-surface/80" role="listitem">
                            <div class="flex items-center space-x-3">
                                <x-keys::icon
                                    name="heroicon-o-document-text"
                                    size="sm"
                                    class="text-muted flex-shrink-0"
                                />
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-medium text-foreground truncate">
                                        {{ $file['name'] ?? 'Unknown file' }}
                                    </p>
                                    @if(isset($file['size']))
                                        <p class="text-xs text-muted">
                                            {{ $formatFileSize($file['size']) }}
                                        </p>
                                    @endif
                                </div>
                            </div>

                            <div class="flex items-center space-x-1">
                                @if(isset($file['url']))
                                    <x-keys::button
                                        variant="ghost"
                                        size="xs"
                                        :href="$file['url']"
                                        target="_blank"
                                        icon="heroicon-o-arrow-top-right-on-square"
                                        aria-label="Open {{ $file['name'] ?? 'file' }} in new tab"
                                    />
                                @endif

                                <x-keys::button
                                    variant="ghost"
                                    size="xs"
                                    color="danger"
                                    icon="heroicon-o-trash"
                                    data-remove-existing-file="{{ $file['id'] ?? $loop->index }}"
                                    aria-label="Remove {{ $file['name'] ?? 'file' }}"
                                />
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    @endif

    {{-- Error display --}}
    @if($showErrors && $hasError())
        <x-keys::error :errors="$errors" class="mt-2" />
    @endif

    {{-- Dynamic error container for JavaScript validation errors - improved visibility --}}
    <div class="file-upload-errors mt-3 hidden" data-file-upload-errors="true" role="alert" aria-live="assertive">
        <div class="relative animate-in fade-in slide-in-from-top-2 duration-300">
            <div class="text-sm text-white bg-danger border border-danger rounded-lg shadow-lg p-4" data-error-content="true">
                <div class="flex items-start gap-3">
                    <x-keys::icon name="heroicon-o-exclamation-triangle" size="sm" class="text-white shrink-0" />
                    <div class="flex-1">
                        <p class="font-semibold mb-1">Upload Failed</p>
                        <span data-error-message="true" class="text-white/90 text-xs block"></span>
                    </div>
                    <button type="button" class="text-white/80 hover:text-white transition-colors ml-2" data-dismiss-error="true" aria-label="Dismiss error">
                        <x-keys::icon name="heroicon-o-x-mark" size="sm" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .file-upload-zone {
        position: relative;
        cursor: pointer;
        user-select: none;
    }

    /* Better visual feedback without jarring scale transform */
    .file-upload-zone.drag-over {
        border-color: var(--color-brand);
        background: var(--color-brand-100);
        box-shadow: 0 4px 12px rgba(var(--color-brand-rgb), 0.15);
    }

    .file-upload-zone.has-error {
        border-color: var(--color-danger);
        background: var(--color-danger-50);
    }

    .file-upload-zone:disabled,
    .file-upload-zone.disabled {
        cursor: not-allowed;
        opacity: 0.6;
        pointer-events: none;
    }

    /* Smooth transitions between states */
    .file-upload-zone [data-upload-state] {
        transition: opacity 0.2s ease-in-out;
    }

    .file-upload-zone [data-upload-state="idle"] {
        display: block;
    }

    .file-upload-zone [data-upload-state="dragover"] {
        display: none;
    }

    .file-upload-zone [data-upload-state="uploading"] {
        display: none;
    }

    .file-upload-zone.drag-over [data-upload-state="idle"] {
        display: none;
    }

    .file-upload-zone.drag-over [data-upload-state="dragover"] {
        display: block;
    }

    .file-upload-zone.uploading [data-upload-state="idle"] {
        display: none;
    }

    .file-upload-zone.uploading [data-upload-state="uploading"] {
        display: block;
    }

    /* Minimum touch target size for mobile */
    @media (pointer: coarse) {
        .file-upload-zone {
            min-height: 44px;
        }

        [data-remove-file],
        [data-dismiss-error] {
            min-width: 44px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    /* Responsive grid layouts for different file types */
    .image-grid-layout {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    @media (max-width: 640px) {
        .image-grid-layout {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 0.75rem;
        }
    }

    @media (max-width: 480px) {
        .image-grid-layout {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 0.5rem;
        }
    }

    .file-list-layout {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .mixed-layout {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    /* Image grid item enhancements */
    .image-grid-item {
        position: relative;
        width: 100%;
    }

    .image-grid-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }

    /* Enhanced image previews in mixed layout */
    .mixed-image-item .file-preview-thumbnail {
        position: relative;
    }

    .mixed-image-item .file-preview-thumbnail::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(45deg, transparent 30%, rgba(var(--color-brand-rgb), 0.1) 70%);
        border-radius: inherit;
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
    }

    .mixed-image-item:hover .file-preview-thumbnail::after {
        opacity: 1;
    }

    /* Animations */
    @keyframes slide-in-right {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .animate-slide-in-right {
        animation: slide-in-right 0.3s ease-out;
    }

    /* Loading skeleton for image previews */
    .skeleton-loader {
        background: linear-gradient(
            90deg,
            var(--color-surface) 25%,
            var(--color-surface-hover) 50%,
            var(--color-surface) 75%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
    }

    @keyframes skeleton-loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    /* Image grid hover effects and transitions */
    .image-grid-item .aspect-square img {
        transition: transform 0.3s ease, opacity 0.2s ease;
    }

    .image-grid-item:hover .aspect-square img {
        transform: scale(1.05);
    }

    /* Status indicator animations */
    .image-grid-item [data-file-status="uploading"] .aspect-square img {
        animation: pulse-opacity 2s ease-in-out infinite;
    }

    @keyframes pulse-opacity {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 0.8; }
    }

    /* Focus states for accessibility */
    .image-grid-item:focus-within,
    .mixed-image-item:focus-within,
    .file-preview-item:focus-within {
        outline: 2px solid var(--color-brand);
        outline-offset: 2px;
    }

    /* Mobile optimizations */
    @media (pointer: coarse) {
        .image-grid-item button,
        .mixed-image-item button,
        .file-preview-item button {
            min-width: 44px;
            min-height: 44px;
        }

        /* Always show delete button on mobile */
        .image-grid-item button[data-remove-file] {
            opacity: 0.8 !important;
        }
    }
</style>