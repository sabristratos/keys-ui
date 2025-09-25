// File upload functionality for Keys UI
function initializeFileUploads(): void {
    const containers = document.querySelectorAll('[data-keys-file-upload="true"]:not([data-initialized="true"])');
    const isLivewireAvailable = typeof (window as any).Livewire !== 'undefined';

    containers.forEach((container) => {
        const element = container as HTMLElement;
        const fileInput = element.querySelector('.file-input') as HTMLInputElement;

        if (!fileInput) return;

        setupFileHandling(element, fileInput, isLivewireAvailable);
        setupDragDrop(element, fileInput);
        setupClickHandlers(element, fileInput);
        setupRemoveHandler(element, fileInput);
        setupLivewireIntegration(element, fileInput, isLivewireAvailable);

        element.dataset.initialized = 'true';
    });
}

function setupFileHandling(container: HTMLElement, fileInput: HTMLInputElement, isLivewireAvailable: boolean): void {
    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
            handleFile(container, fileInput, fileInput.files[0], isLivewireAvailable);
        } else {
            // File was cleared, show empty state
            showEmptyState(container);
        }
    });
}

function setupDragDrop(container: HTMLElement, fileInput: HTMLInputElement): void {
    if (container.dataset.dragDrop !== 'true' || container.dataset.disabled === 'true') {
        return;
    }

    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    events.forEach(event => container.addEventListener(event, preventDefault));

    ['dragenter', 'dragover'].forEach(event => {
        container.addEventListener(event, () => container.classList.add('dragover'));
    });

    ['dragleave', 'drop'].forEach(event => {
        container.addEventListener(event, () => container.classList.remove('dragover'));
    });

    container.addEventListener('drop', (e) => {
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            handleFile(container, fileInput, files[0], typeof (window as any).Livewire !== 'undefined');
        }
    });
}

function setupClickHandlers(container: HTMLElement, fileInput: HTMLInputElement): void {
    // Make the button and container clickable in empty state
    const button = container.querySelector('[type="button"]:not(.file-change-btn)');
    if (button) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!fileInput.disabled) {
                fileInput.click();
            }
        });
    }

    // Handle "Change file" button
    const changeButton = container.querySelector('.file-change-btn');
    if (changeButton) {
        changeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!fileInput.disabled) {
                fileInput.click();
            }
        });
    }

    // Make the container clickable only in empty state
    container.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const isEmptyStateVisible = !container.querySelector('.upload-empty-state')?.classList.contains('hidden');

        const shouldTrigger = isEmptyStateVisible && (
            target === container ||
            target.closest('.upload-empty-state') ||
            target.closest('.file-input')
        ) && !target.closest('button');

        if (shouldTrigger && !fileInput.disabled) {
            fileInput.click();
        }
    });
}

function setupRemoveHandler(container: HTMLElement, fileInput: HTMLInputElement): void {
    const removeButton = container.querySelector('.file-remove');
    if (removeButton) {
        removeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            fileInput.value = '';
            showEmptyState(container);
            clearError(container);
            announceChange(container, 'File removed');

            // Trigger change for Livewire
            if (container.dataset.livewire === 'true') {
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
}

function setupLivewireIntegration(container: HTMLElement, fileInput: HTMLInputElement, isLivewireAvailable: boolean): void {
    if (!isLivewireAvailable || container.dataset.livewire !== 'true') {
        return;
    }

    fileInput.addEventListener('livewire-upload-start', () => {
        showUploadProgress(container, true);
        setProgressWidth(container, 0);
    });

    fileInput.addEventListener('livewire-upload-progress', (e: Event) => {
        const event = e as CustomEvent;
        if (event.detail?.progress) {
            setProgressWidth(container, event.detail.progress);
        }
    });

    fileInput.addEventListener('livewire-upload-finish', () => {
        showUploadProgress(container, false);
        if (fileInput.files && fileInput.files.length > 0) {
            showFileState(container, fileInput.files[0]);
        }
    });

    fileInput.addEventListener('livewire-upload-error', (e: Event) => {
        const event = e as CustomEvent;
        showError(container, event.detail?.message || 'Upload failed. Please try again.');
        showUploadProgress(container, false);
    });

    fileInput.addEventListener('livewire-upload-cancel', () => {
        showUploadProgress(container, false);
        clearError(container);
    });
}

function handleFile(container: HTMLElement, fileInput: HTMLInputElement, file: File, isLivewireAvailable: boolean): void {
    const validation = validateFile(container, file);
    if (!validation.valid) {
        showError(container, validation.error || 'Invalid file');
        return;
    }

    clearError(container);

    if (container.dataset.livewire === 'true') {
        showUploadProgress(container, true);
        setProgressWidth(container, 0);
    } else {
        showFileState(container, file);
    }
}

function validateFile(container: HTMLElement, file: File): { valid: boolean; error?: string } {
    const accept = container.dataset.accept;
    const maxSize = container.dataset.maxSize;
    const maxSizeFormatted = container.dataset.maxSizeFormatted;

    if (accept && accept !== '*') {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const isValid = acceptedTypes.some(type => {
            if (type.startsWith('.')) return file.name.toLowerCase().endsWith(type.toLowerCase());
            if (type.includes('*')) return file.type.startsWith(type.split('/')[0] + '/');
            return file.type === type;
        });

        if (!isValid) {
            return { valid: false, error: `File type not allowed. Accepted: ${acceptedTypes.join(', ')}` };
        }
    }

    if (maxSize && file.size > parseInt(maxSize)) {
        return { valid: false, error: `File too large. Maximum size: ${maxSizeFormatted || '10MB'}` };
    }

    return { valid: true };
}

function showEmptyState(container: HTMLElement): void {
    const emptyState = container.querySelector('.upload-empty-state') as HTMLElement;
    const fileState = container.querySelector('.upload-file-state') as HTMLElement;

    toggleElement(emptyState, true);
    toggleElement(fileState, false);
    showUploadProgress(container, false);

    // Remove drag state
    container.classList.remove('dragover');
}

function showFileState(container: HTMLElement, file: File): void {
    const emptyState = container.querySelector('.upload-empty-state') as HTMLElement;
    const fileState = container.querySelector('.upload-file-state') as HTMLElement;

    toggleElement(emptyState, false);
    toggleElement(fileState, true);

    updateFileInfo(container, file);
    announceChange(container, `File selected: ${file.name}`);
}

function updateFileInfo(container: HTMLElement, file: File): void {
    const fileName = container.querySelector('.file-name');
    const fileSize = container.querySelector('.file-size');
    const previewImage = container.querySelector('.file-preview-image') as HTMLImageElement;
    const fileIcon = container.querySelector('.file-icon');

    if (fileName) fileName.textContent = file.name;
    if (fileSize) fileSize.textContent = formatFileSize(file.size);

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (previewImage && e.target?.result) {
                previewImage.src = e.target.result as string;
                toggleElement(previewImage, true);
                toggleElement(fileIcon as HTMLElement, false);
            }
        };
        reader.readAsDataURL(file);
    } else {
        toggleElement(previewImage, false);
        toggleElement(fileIcon as HTMLElement, true);
    }
}

function showUploadProgress(container: HTMLElement, show: boolean): void {
    const progressContainer = container.querySelector('.upload-progress') as HTMLElement;
    toggleElement(progressContainer, show);
}

function showError(container: HTMLElement, message: string): void {
    const errorElement = container.querySelector('.error-message') as HTMLElement;
    if (errorElement) {
        errorElement.textContent = message;
        toggleElement(errorElement, true);
    }
    container.setAttribute('data-invalid', 'true');
}

function clearError(container: HTMLElement): void {
    const errorElement = container.querySelector('.error-message') as HTMLElement;
    if (errorElement) {
        toggleElement(errorElement, false);
    }
    container.removeAttribute('data-invalid');
}

function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function toggleElement(element: HTMLElement | null, show: boolean): void {
    if (!element) return;
    element.classList.toggle('hidden', !show);
}

function setProgressWidth(container: HTMLElement, progress: number): void {
    const progressBar = container.querySelector('.upload-progress-bar') as HTMLElement;
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

function preventDefault(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
}

function announceChange(container: HTMLElement, message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    container.appendChild(announcement);
    setTimeout(() => {
        if (container.contains(announcement)) {
            container.removeChild(announcement);
        }
    }, 1000);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeFileUploads);

// Re-initialize on Livewire navigation (though unnecessary with wire:ignore)
if (typeof (window as any).Livewire !== 'undefined') {
    document.addEventListener('livewire:navigated', initializeFileUploads);
}