{{-- File Preview Item Partial --}}
@php
    $isImage = str_starts_with($fileType ?? '', 'image/');
    $fileIconName = $getFileIconName($fileType ?? '', $fileName ?? '');
    $statusClass = match($status ?? 'pending') {
        'success' => 'border-success bg-success/5',
        'error' => 'border-danger bg-danger/5',
        'uploading' => 'border-brand bg-brand/5',
        default => ''
    };
@endphp

<div
    class="file-preview-item group relative flex items-center justify-between p-4 border border-border rounded-lg bg-surface hover:bg-surface/80 transition-all duration-200 {{ $statusClass }}"
    data-file-id="{{ $fileId }}"
    data-file-status="{{ $status ?? 'pending' }}"
    role="listitem"
>
    {{-- File Thumbnail --}}
    <div class="flex items-center space-x-4 flex-1 min-w-0">
        <div class="file-preview-thumbnail flex-shrink-0">
            @if($isImage && !empty($previewUrl ?? null))
                {{-- Use Keys UI Image component for image previews --}}
                <x-keys::image
                    :src="$previewUrl"
                    :alt="'Preview of ' . ($fileName ?? 'image')"
                    size="xs"
                    aspect-ratio="square"
                    object-fit="cover"
                    radius="md"
                    class="w-12 h-12"
                >
                    {{-- Overlay with file info on hover --}}
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
                        <div class="text-center text-white text-xs px-2">
                            <div class="font-medium truncate max-w-20" title="{{ $fileName ?? '' }}">
                                {{ Str::limit($fileName ?? '', 15) }}
                            </div>
                            <div class="text-white/80">
                                {{ $fileSize ?? '' }}
                            </div>
                        </div>
                    </div>
                </x-keys::image>
            @else
                {{-- File type icon for non-images --}}
                <div class="w-12 h-12 rounded-md bg-surface border border-border flex items-center justify-center text-muted group-hover:text-foreground transition-colors">
                    <x-keys::icon :name="$fileIconName" size="md" />
                </div>
            @endif
        </div>

        {{-- File Information --}}
        <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-foreground truncate group-hover:text-brand transition-colors" title="{{ $fileName ?? '' }}">
                {{ $fileName ?? 'Unknown file' }}
            </p>
            <div class="flex items-center space-x-2 text-xs text-muted">
                <span>{{ $fileSize ?? '' }}</span>
                @if(!empty($status ?? '') && $status !== 'pending')
                    <span class="text-muted/50">•</span>
                    <span class="capitalize {{ $status === 'success' ? 'text-success' : ($status === 'error' ? 'text-danger' : 'text-brand') }}">
                        {{ $status }}
                    </span>
                @endif
            </div>
        </div>
    </div>

    {{-- Action Buttons --}}
    <div class="flex items-center space-x-2 flex-shrink-0">
        {{-- Upload Progress Indicator --}}
        @if(($status ?? '') === 'uploading')
            <x-keys::loading size="xs" class="text-brand" />
        @endif

        {{-- Success Indicator --}}
        @if(($status ?? '') === 'success')
            <x-keys::icon name="heroicon-o-check-circle" size="sm" class="text-success" />
        @endif

        {{-- Error Indicator --}}
        @if(($status ?? '') === 'error')
            <x-keys::icon name="heroicon-o-exclamation-triangle" size="sm" class="text-danger" />
        @endif

        {{-- Delete Button --}}
        <x-keys::button
            variant="ghost"
            size="xs"
            color="danger"
            icon="heroicon-o-trash"
            data-remove-file="{{ $fileId }}"
            :aria-label="'Remove ' . ($fileName ?? 'file')"
            class="opacity-60 group-hover:opacity-100 hover:bg-danger/10 transition-all duration-200"
        />
    </div>

    {{-- Progress Bar for Upload Status --}}
    @if(($status ?? '') === 'uploading' && ($showProgress ?? true))
        <div class="absolute bottom-0 left-0 right-0 h-1 bg-border rounded-b-lg overflow-hidden">
            <div
                class="h-full bg-brand transition-all duration-300 ease-out"
                style="width: {{ $progress ?? 0 }}%"
                data-progress-bar="{{ $fileId }}"
            ></div>
        </div>
    @endif
</div>

{{-- Enhanced styling for file preview items --}}
<style>
    .file-preview-item {
        position: relative;
    }

    .file-preview-item:hover .file-preview-thumbnail {
        transform: scale(1.05);
        transition: transform 0.2s ease;
    }

    .file-preview-item.upload-success {
        @apply border-success bg-success/5;
    }

    .file-preview-item.upload-error {
        @apply border-danger bg-danger/5;
    }

    .file-preview-item.uploading {
        @apply border-brand bg-brand/5;
    }

    /* Image overlay hover effects */
    .file-preview-thumbnail .absolute {
        backdrop-filter: blur(2px);
    }

    /* Focus states for accessibility */
    .file-preview-item:focus-within {
        @apply ring-2 ring-brand ring-offset-2;
    }

    /* Progress bar animation */
    @keyframes progress {
        0% { width: 0%; }
    }

    .file-preview-item [data-progress-bar] {
        animation: progress 0.3s ease-out;
    }
</style>