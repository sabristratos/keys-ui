# File Upload Component

File selection with drag & drop functionality, progress tracking, and comprehensive file handling.

## Basic Usage

```blade
{{-- Simple file upload --}}
<x-keys::file-upload name="documents" />

{{-- File upload with label --}}
<x-keys::file-upload
    name="avatar"
    label="Profile Picture"
    accept="image/*"
/>

{{-- Multiple file upload --}}
<x-keys::file-upload
    name="attachments[]"
    label="Attachments"
    multiple
    accept=".pdf,.doc,.docx"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Input name attribute |
| `label` | string | `null` | Upload area label |
| `multiple` | boolean | `false` | Allow multiple file selection |
| `accept` | string | `null` | Accepted file types |
| `max-size` | string | `null` | Maximum file size (e.g., "5MB") |
| `max-files` | integer | `null` | Maximum number of files |
| `preview` | boolean | `true` | Show file previews |
| `progress` | boolean | `true` | Show upload progress |
| `disabled` | boolean | `false` | Disable file upload |
| `errors` | object | `null` | Validation errors |

## File Type Restrictions

```blade
{{-- Image files only --}}
<x-keys::file-upload
    name="photos"
    label="Upload Photos"
    accept="image/*"
    multiple
/>

{{-- Document files --}}
<x-keys::file-upload
    name="documents"
    label="Upload Documents"
    accept=".pdf,.doc,.docx,.txt"
    multiple
/>

{{-- Video files --}}
<x-keys::file-upload
    name="video"
    label="Upload Video"
    accept="video/*"
    max-size="100MB"
/>

{{-- Specific file types --}}
<x-keys::file-upload
    name="data"
    label="Upload Data File"
    accept=".csv,.xlsx,.json"
/>
```

## Size and Count Limits

```blade
{{-- Single file with size limit --}}
<x-keys::file-upload
    name="avatar"
    label="Profile Picture"
    accept="image/*"
    max-size="2MB"
/>

{{-- Multiple files with limits --}}
<x-keys::file-upload
    name="attachments[]"
    label="Attachments"
    multiple
    max-files="5"
    max-size="10MB"
    accept=".pdf,.doc,.docx,.txt"
/>
```

## Use Cases

### Profile Picture Upload
```blade
<x-keys::card variant="padded">
    <h3 class="font-semibold mb-4">Profile Picture</h3>

    <div class="flex items-start gap-6">
        <x-keys::avatar
            :src="$user->avatar_url"
            :name="$user->name"
            size="xl"
        />

        <div class="flex-1">
            <x-keys::file-upload
                name="avatar"
                label="Upload new picture"
                accept="image/*"
                max-size="5MB"
                :preview="false"
            />

            <p class="text-sm text-neutral-600 mt-2">
                JPG, PNG or GIF. Maximum size 5MB.
            </p>
        </div>
    </div>
</x-keys::card>
```

### Document Management
```blade
<form wire:submit="uploadDocuments">
    <x-keys::file-upload
        name="documents[]"
        label="Upload Documents"
        multiple
        max-files="10"
        max-size="20MB"
        accept=".pdf,.doc,.docx,.txt,.rtf"
        wire:model="documents"
    />

    <div class="mt-4 flex justify-end">
        <x-keys::button
            type="submit"
            variant="brand"
            :loading="$uploading"
        >
            Upload Documents
        </x-keys::button>
    </div>
</form>
```

### Image Gallery Upload
```blade
<div>
    <x-keys::file-upload
        name="gallery_images[]"
        label="Add Images to Gallery"
        multiple
        accept="image/*"
        max-files="20"
        max-size="10MB"
        preview
    />

    @if($uploadedImages->count())
        <div class="mt-6">
            <h4 class="font-semibold mb-3">Uploaded Images</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                @foreach($uploadedImages as $image)
                    <div class="relative group">
                        <img
                            src="{{ $image->url }}"
                            alt="{{ $image->name }}"
                            class="w-full h-32 object-cover rounded-lg"
                        >
                        <button
                            type="button"
                            wire:click="removeImage({{ $image->id }})"
                            class="absolute top-2 right-2 bg-danger-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ×
                        </button>
                    </div>
                @endforeach
            </div>
        </div>
    @endif
</div>
```

### Bulk File Processing
```blade
<x-keys::card variant="bordered">
    <div class="p-6">
        <h3 class="font-semibold mb-4">Bulk Import</h3>

        <x-keys::file-upload
            name="import_file"
            label="Upload CSV File"
            accept=".csv"
            max-size="50MB"
        />

        <div class="mt-4 p-4 bg-neutral-50 rounded-lg">
            <h4 class="font-medium mb-2">File Requirements:</h4>
            <ul class="text-sm text-neutral-600 space-y-1">
                <li>• CSV format only</li>
                <li>• Maximum 50MB file size</li>
                <li>• First row should contain headers</li>
                <li>• Required columns: name, email</li>
            </ul>
        </div>

        @if($importProgress)
            <div class="mt-4">
                <x-keys::progress
                    :value="$importProgress"
                    max="100"
                    label="Processing import..."
                    show-percentage
                    variant="animated"
                />
            </div>
        @endif
    </div>
</x-keys::card>
```

### Media Library
```blade
<div>
    <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">Media Library</h2>
        <x-keys::button
            onclick="document.getElementById('media-upload').click()"
            variant="brand"
            icon="heroicon-o-plus"
        >
            Add Media
        </x-keys::button>
    </div>

    <x-keys::file-upload
        id="media-upload"
        name="media[]"
        multiple
        accept="image/*,video/*"
        max-files="50"
        max-size="100MB"
        class="hidden"
        wire:model="newMedia"
    />

    @if($media->count())
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            @foreach($media as $item)
                <div class="relative group bg-neutral-100 rounded-lg overflow-hidden aspect-square">
                    @if($item->type === 'image')
                        <img
                            src="{{ $item->thumbnail_url }}"
                            alt="{{ $item->name }}"
                            class="w-full h-full object-cover"
                        >
                    @else
                        <div class="w-full h-full flex items-center justify-center">
                            <x-keys::icon name="heroicon-o-film" class="w-8 h-8 text-neutral-400" />
                        </div>
                    @endif

                    <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div class="flex gap-2">
                            <x-keys::button
                                size="sm"
                                variant="ghost"
                                icon="heroicon-o-eye"
                                wire:click="viewMedia({{ $item->id }})"
                            />
                            <x-keys::button
                                size="sm"
                                variant="ghost"
                                icon="heroicon-o-trash"
                                wire:click="deleteMedia({{ $item->id }})"
                            />
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</div>
```

### File Dropzone
```blade
<div
    x-data="fileDropzone"
    @dragover.prevent="dragover = true"
    @dragleave.prevent="dragover = false"
    @drop.prevent="handleDrop($event)"
    :class="{ 'border-brand-500 bg-brand-50': dragover }"
    class="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center transition-colors"
>
    <x-keys::icon name="heroicon-o-cloud-arrow-up" class="w-12 h-12 text-neutral-400 mx-auto mb-4" />

    <h3 class="text-lg font-semibold mb-2">Drop files here</h3>
    <p class="text-neutral-600 mb-4">or click to browse</p>

    <x-keys::file-upload
        name="files[]"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.png"
        max-size="10MB"
        class="opacity-0 absolute inset-0 cursor-pointer"
    />

    <x-keys::button variant="brand">Choose Files</x-keys::button>

    <div class="mt-4" x-show="files.length" x-transition>
        <h4 class="font-medium mb-2">Selected Files:</h4>
        <template x-for="file in files" :key="file.name">
            <div class="flex items-center justify-between py-2 px-3 bg-neutral-50 rounded mb-2">
                <span class="text-sm" x-text="file.name"></span>
                <span class="text-xs text-neutral-500" x-text="formatFileSize(file.size)"></span>
            </div>
        </template>
    </div>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('fileDropzone', () => ({
        dragover: false,
        files: [],

        handleDrop(event) {
            this.dragover = false;
            this.files = Array.from(event.dataTransfer.files);
        },

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }));
});
</script>
```

## Progress Tracking

```blade
<div>
    <x-keys::file-upload
        name="large_files[]"
        label="Upload Large Files"
        multiple
        max-size="500MB"
        wire:model="files"
    />

    @if($uploadProgress)
        <div class="mt-4 space-y-3">
            @foreach($uploadProgress as $fileId => $progress)
                <div>
                    <div class="flex justify-between text-sm mb-1">
                        <span>{{ $progress['name'] }}</span>
                        <span>{{ $progress['percentage'] }}%</span>
                    </div>
                    <x-keys::progress
                        :value="$progress['percentage']"
                        max="100"
                        size="sm"
                        :color="$progress['status'] === 'error' ? 'danger' : 'brand'"
                        :variant="$progress['status'] === 'uploading' ? 'animated' : 'default'"
                    />
                    @if($progress['status'] === 'error')
                        <p class="text-sm text-danger-600 mt-1">{{ $progress['error'] }}</p>
                    @endif
                </div>
            @endforeach
        </div>
    @endif
</div>
```

## Form Integration

### Laravel Forms
```blade
<form method="POST" enctype="multipart/form-data">
    @csrf

    <div class="space-y-6">
        <x-keys::input
            name="title"
            label="Document Title"
            required
            :errors="$errors"
        />

        <x-keys::file-upload
            name="document"
            label="Upload Document"
            accept=".pdf,.doc,.docx"
            max-size="10MB"
            required
            :errors="$errors"
        />

        <x-keys::textarea
            name="description"
            label="Description"
            rows="3"
        />

        <x-keys::button type="submit" variant="brand">
            Upload Document
        </x-keys::button>
    </div>
</form>
```

### Livewire Integration
```blade
<div>
    <x-keys::file-upload
        name="files[]"
        label="Upload Files"
        multiple
        wire:model="files"
        max-files="10"
        max-size="20MB"
    />

    <div wire:loading wire:target="files" class="mt-4">
        <x-keys::alert variant="info">
            Processing files...
        </x-keys::alert>
    </div>

    @if($uploadedFiles->count())
        <div class="mt-6">
            <h4 class="font-semibold mb-3">Uploaded Files</h4>
            <div class="space-y-2">
                @foreach($uploadedFiles as $file)
                    <div class="flex items-center justify-between p-3 border rounded-lg">
                        <div class="flex items-center gap-3">
                            <x-keys::icon name="heroicon-o-document" class="w-5 h-5 text-neutral-500" />
                            <div>
                                <div class="font-medium">{{ $file->name }}</div>
                                <div class="text-sm text-neutral-500">{{ $file->size_formatted }}</div>
                            </div>
                        </div>
                        <x-keys::button
                            size="sm"
                            variant="ghost"
                            icon="heroicon-o-trash"
                            wire:click="removeFile({{ $file->id }})"
                        />
                    </div>
                @endforeach
            </div>
        </div>
    @endif
</div>
```

## Accessibility

- Proper ARIA attributes for file upload areas
- Keyboard navigation support
- Screen reader announcements for file selection
- Focus management for drag and drop
- High contrast mode support

## Data Attributes

```html
<div
    data-keys-file-upload="true"
    data-multiple="true"
    data-accept="image/*"
    data-max-size="5MB"
    data-max-files="10"
>
```

## JavaScript Integration

```javascript
// Handle file selection
document.addEventListener('change', function(event) {
    if (event.target.matches('[data-keys-file-upload] input[type="file"]')) {
        const files = Array.from(event.target.files);
        console.log('Files selected:', files);

        // Validate files
        files.forEach(file => {
            validateFile(file);
        });
    }
});

// File validation
function validateFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file.size > maxSize) {
        alert('File too large');
        return false;
    }

    if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type');
        return false;
    }

    return true;
}

// Drag and drop handling
function initFileDrop(element) {
    element.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    element.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    element.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');

        const files = Array.from(e.dataTransfer.files);
        handleFileSelection(files);
    });
}
```

## CSS Customization

```css
/* Drag and drop styling */
[data-keys-file-upload].dragover {
    border-color: var(--color-brand);
    background-color: var(--color-brand-50);
}

/* File preview styling */
[data-keys-file-upload] .file-preview {
    border: 2px solid var(--color-neutral-200);
    border-radius: 0.5rem;
    overflow: hidden;
    transition: border-color 0.2s;
}

[data-keys-file-upload] .file-preview:hover {
    border-color: var(--color-brand);
}

/* Upload progress animation */
[data-keys-file-upload] .upload-progress {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

## Best Practices

1. **Set appropriate limits** - Use reasonable file size and count restrictions
2. **Provide clear feedback** - Show upload progress and validation messages
3. **Handle errors gracefully** - Display helpful error messages
4. **Support drag and drop** - Enhance user experience with modern interactions
5. **Validate on client and server** - Ensure security and user experience
6. **Show file previews** - Help users confirm their selections
7. **Consider mobile users** - Ensure touch-friendly file selection