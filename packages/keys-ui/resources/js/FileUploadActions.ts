/**
 * File upload functionality for Keys UI
 *
 * Provides comprehensive file upload features including:
 * - Drag and drop support
 * - File validation (type and size)
 * - Image preview with lightbox support
 * - Livewire integration with upload progress
 * - Accessibility announcements
 */

import LightboxActions from './LightboxActions';

interface LivewireProgressEvent extends CustomEvent {
    detail: { progress: number };
}

interface LivewireErrorEvent extends CustomEvent {
    detail: { message?: string };
}

declare global {
    interface Window {
        Livewire?: any;
    }
}

const SELECTORS = {
    container: '[data-keys-file-upload="true"]:not([data-initialized="true"])',
    fileInput: '.file-input',
    emptyState: '.upload-empty-state',
    fileState: '.upload-file-state',
    fileName: '.file-name',
    fileSize: '.file-size',
    previewImage: '.file-preview-image',
    fileIcon: '.file-icon',
    changeButton: '.file-change-btn',
    removeButton: '.file-remove',
    uploadProgress: '.upload-progress',
    progressBar: '.upload-progress-bar',
    chooseButton: '[type="button"]:not(.file-change-btn)',
    singleFilePreview: '.single-file-preview',
    multipleFilesPreview: '.multiple-files-preview',
    fileSummary: '.file-summary',
    fileCount: '.file-count',
    fileTotalSize: '.file-total-size',
    addMoreFilesBtn: '.file-add-more-btn',
    addMoreFilesContainer: '.add-more-files',
} as const;

const DATA_ATTRS = {
    initialized: 'data-initialized',
    dragDrop: 'data-drag-drop',
    disabled: 'data-disabled',
    livewire: 'data-livewire',
    accept: 'data-accept',
    maxSize: 'data-max-size',
    maxSizeFormatted: 'data-max-size-formatted',
    invalid: 'data-invalid',
    multiple: 'data-multiple',
    maxFiles: 'data-max-files',
} as const;

const MESSAGES = {
    fileRemoved: 'File removed',
    uploadFailed: 'Upload failed. Please try again.',
    fileTypeError: (types: string) => `File type not allowed. Accepted: ${types}`,
    fileSizeError: (size: string) => `File too large. Maximum size: ${size}`,
    invalidFile: 'Invalid file',
    maxFilesError: (max: number) => `Maximum ${max} file(s) allowed`,
    filesRemoved: (count: number) => `${count} file(s) removed`,
} as const;

const filesStore = new Map<HTMLElement, File[]>();

const lightboxActions = LightboxActions.getInstance();

const isLivewireAvailable = (): boolean => typeof window.Livewire !== 'undefined';

/**
 * Initialize all file upload components on the page
 */
function initializeFileUploads(): void {

    const containers = document.querySelectorAll(SELECTORS.container);
    const livewireAvailable = isLivewireAvailable();

    containers.forEach((container, index) => {
        const element = container as HTMLElement;
        const wrapper = element.closest('.file-upload-wrapper') as HTMLElement;
        if (!wrapper) {

            return;
        }
        const fileInput = element.querySelector(SELECTORS.fileInput) as HTMLInputElement;

        if (!fileInput) {

            return;
        }

        setupFileHandling(wrapper, fileInput, livewireAvailable);
        setupDragDrop(element, fileInput);
        setupClickHandlers(wrapper, fileInput);
        setupRemoveHandler(wrapper, fileInput);
        setupLivewireIntegration(wrapper, fileInput, livewireAvailable);

        lightboxActions.setState(wrapper, {
            currentImageIndex: 0,
            images: [],
            isOpen: false,
            elementId: wrapper.id || `upload-${Date.now()}`
        });

        element.setAttribute(DATA_ATTRS.initialized, 'true');

    });

}

/**
 * Setup file input change handler
 */
function setupFileHandling(container: HTMLElement, fileInput: HTMLInputElement, livewireAvailable: boolean): void {

    const isMultiple = container.getAttribute(DATA_ATTRS.multiple) === 'true';

    fileInput.addEventListener('change', () => {
        const isAddingMore = container.hasAttribute('data-adding-more');
        const existingFiles = filesStore.get(container) || [];

        if (fileInput.files && fileInput.files.length > 0) {
            if (isMultiple) {
                const shouldAppend = isAddingMore && existingFiles.length > 0;

                handleMultipleFiles(container, fileInput, Array.from(fileInput.files), livewireAvailable, shouldAppend);

                container.removeAttribute('data-adding-more');
            } else {
                handleFile(container, fileInput, fileInput.files[0], livewireAvailable);
            }
        } else {

            showEmptyState(container);
        }
    });
}

/**
 * Setup drag and drop functionality
 */
function setupDragDrop(container: HTMLElement, fileInput: HTMLInputElement): void {
    const dragDropEnabled = container.getAttribute(DATA_ATTRS.dragDrop) === 'true';
    const isDisabled = container.getAttribute(DATA_ATTRS.disabled) === 'true';

    if (!dragDropEnabled || isDisabled) {
        return;
    }

    const events: Array<keyof HTMLElementEventMap> = ['dragenter', 'dragover', 'dragleave', 'drop'];
    events.forEach(event => container.addEventListener(event, preventDefault));

    ['dragenter', 'dragover'].forEach(event => {
        container.addEventListener(event, () => {

            container.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(event => {
        container.addEventListener(event, () => {

            container.classList.remove('dragover');
        });
    });

    container.addEventListener('drop', (e) => {
        const files = e.dataTransfer?.files;
        const isMultiple = container.getAttribute(DATA_ATTRS.multiple) === 'true';

        if (files && files.length > 0) {
            if (isMultiple) {
                handleMultipleFiles(container, fileInput, Array.from(files), isLivewireAvailable());
            } else {
                handleFile(container, fileInput, files[0], isLivewireAvailable());
            }
        }
    });

}

/**
 * Setup click handlers for buttons and container
 */
function setupClickHandlers(container: HTMLElement, fileInput: HTMLInputElement): void {

    const changeButton = container.querySelector(SELECTORS.changeButton);

    if (changeButton) {
        changeButton.addEventListener('click', (e) => {

            e.preventDefault();
            e.stopPropagation();
            if (!fileInput.disabled) {
                fileInput.click();
            }
        });
    }

    const emptyState = container.querySelector(SELECTORS.emptyState);

    if (emptyState) {
        emptyState.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            if (target.closest(SELECTORS.fileInput)) {

                return;
            }

            if (container.hasAttribute('data-is-removing')) {

                return;
            }

            if (!fileInput.disabled) {

                fileInput.click();
            }
        });
    }

    const addMoreBtn = container.querySelector(SELECTORS.addMoreFilesBtn);

    if (addMoreBtn) {
        addMoreBtn.addEventListener('click', (e) => {

            e.preventDefault();
            e.stopPropagation();
            if (!fileInput.disabled) {
                container.setAttribute('data-adding-more', 'true');

                fileInput.click();
            }
        });
    }

    container.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const removeBtn = target.closest('[data-remove-file]') as HTMLElement;

        if (removeBtn) {
            e.preventDefault();
            e.stopPropagation();

            const fileIndex = parseInt(removeBtn.getAttribute('data-remove-file') || '0');

            removeFileAtIndex(container, fileInput, fileIndex);
        }
    });

}

/**
 * Setup remove button handler
 */
function setupRemoveHandler(container: HTMLElement, fileInput: HTMLInputElement): void {
    const removeButton = container.querySelector(SELECTORS.removeButton);
    if (removeButton) {
        removeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            container.setAttribute('data-is-removing', 'true');

            fileInput.value = '';
            showEmptyState(container);
            clearError(container);
            announceChange(container, MESSAGES.fileRemoved);

            setTimeout(() => {
                container.removeAttribute('data-is-removing');

            }, 150);

            const isLivewire = container.getAttribute(DATA_ATTRS.livewire) === 'true';
            if (isLivewire) {
                fileInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
}

/**
 * Remove file at specific index from multiple files list
 */
function removeFileAtIndex(container: HTMLElement, fileInput: HTMLInputElement, index: number): void {

    const files = filesStore.get(container) || [];

    if (index < 0 || index >= files.length) {

        return;
    }

    const imageId = `preview-${index}-`;
    const state = lightboxActions.getState(container);
    if (state && state.images) {
        const imagesToRemove = state.images.filter(img => img.id.startsWith(imageId));
        imagesToRemove.forEach(img => {
            lightboxActions.removeImage(container, img.id);
        });
    }

    files.splice(index, 1);

    if (files.length === 0) {
        filesStore.delete(container);
        fileInput.value = '';
        showEmptyState(container);
        announceChange(container, MESSAGES.fileRemoved);
    } else {
        filesStore.set(container, files);
        updateFileInputFiles(fileInput, files);

        showMultipleFilesState(container, files);
        announceChange(container, `File removed. ${files.length} file(s) remaining`);
    }

}

/**
 * Setup Livewire event listeners for upload progress
 */
function setupLivewireIntegration(container: HTMLElement, fileInput: HTMLInputElement, livewireAvailable: boolean): void {
    const isLivewire = container.getAttribute(DATA_ATTRS.livewire) === 'true';

    if (!livewireAvailable || !isLivewire) {
        return;
    }

    fileInput.addEventListener('livewire-upload-start', () => {

        fileInput.setAttribute('data-livewire-upload-started', 'true');
        showUploadProgress(container, true);
        setProgressWidth(container, 0);
    });

    fileInput.addEventListener('livewire-upload-progress', (e: Event) => {
        const event = e as LivewireProgressEvent;
        if (event.detail?.progress) {
            setProgressWidth(container, event.detail.progress);
        }
    });

    fileInput.addEventListener('livewire-upload-finish', () => {

        fileInput.removeAttribute('data-livewire-upload-started');
        showUploadProgress(container, false);
        if (fileInput.files && fileInput.files.length > 0) {
            showFileState(container, fileInput.files[0]);
        }
    });

    fileInput.addEventListener('livewire-upload-error', (e: Event) => {
        const event = e as LivewireErrorEvent;
        showError(container, event.detail?.message || MESSAGES.uploadFailed);
        showUploadProgress(container, false);
    });

    fileInput.addEventListener('livewire-upload-cancel', () => {
        showUploadProgress(container, false);
        clearError(container);
    });
}

/**
 * Handle file selection - validates and displays the file
 */
function handleFile(container: HTMLElement, fileInput: HTMLInputElement, file: File, livewireAvailable: boolean): void {

    const validation = validateFile(container, file);

    if (!validation.valid) {

        showError(container, validation.error || MESSAGES.invalidFile);
        return;
    }

    clearError(container);

    const isLivewire = container.getAttribute(DATA_ATTRS.livewire) === 'true';
    const actualLivewireAvailable = livewireAvailable && typeof window.Livewire !== 'undefined';

    if (isLivewire && actualLivewireAvailable) {
        showUploadProgress(container, true);
        setProgressWidth(container, 0);

        setTimeout(() => {
            if (!fileInput.hasAttribute('data-livewire-upload-started')) {

                showUploadProgress(container, false);
                showFileState(container, file);
            }
        }, 500);
    } else {
        showFileState(container, file);
    }
}

/**
 * Handle multiple files upload
 */
function handleMultipleFiles(container: HTMLElement, fileInput: HTMLInputElement, newFiles: File[], livewireAvailable: boolean, append: boolean = false): void {

    const maxFiles = container.getAttribute(DATA_ATTRS.maxFiles);
    const currentFiles = filesStore.get(container) || [];

    let files = append ? [...currentFiles] : [];

    for (const file of newFiles) {
        const validation = validateFile(container, file);

        if (!validation.valid) {

            showError(container, validation.error || MESSAGES.invalidFile);
            continue;
        }

        if (maxFiles && files.length >= parseInt(maxFiles)) {
            showError(container, MESSAGES.maxFilesError(parseInt(maxFiles)));
            break;
        }

        files.push(file);
    }

    if (files.length === 0) {

        showEmptyState(container);
        return;
    }

    filesStore.set(container, files);

    updateFileInputFiles(fileInput, files);

    clearError(container);

    showMultipleFilesState(container, files);

}

/**
 * Update file input's FileList with array of files
 */
function updateFileInputFiles(fileInput: HTMLInputElement, files: File[]): void {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
}

/**
 * Validation result interface
 */
interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validate file against accept types and size constraints
 */
function validateFile(container: HTMLElement, file: File): ValidationResult {
    const accept = container.getAttribute(DATA_ATTRS.accept);
    const maxSize = container.getAttribute(DATA_ATTRS.maxSize);
    const maxSizeFormatted = container.getAttribute(DATA_ATTRS.maxSizeFormatted);

    if (accept && accept !== '*') {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const isValid = acceptedTypes.some(type => {
            if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            if (type.includes('*')) {
                return file.type.startsWith(type.split('/')[0] + '/');
            }
            return file.type === type;
        });

        if (!isValid) {
            return {
                valid: false,
                error: MESSAGES.fileTypeError(acceptedTypes.join(', '))
            };
        }
    }

    if (maxSize && file.size > parseInt(maxSize)) {
        return {
            valid: false,
            error: MESSAGES.fileSizeError(maxSizeFormatted || '10MB')
        };
    }

    return { valid: true };
}

/**
 * Show empty upload state
 */
function showEmptyState(container: HTMLElement): void {

    const emptyState = container.querySelector(SELECTORS.emptyState) as HTMLElement;
    const fileState = container.querySelector(SELECTORS.fileState) as HTMLElement;

    toggleElement(emptyState, true);
    toggleElement(fileState, false);
    showUploadProgress(container, false);

    container.classList.remove('dragover');

}

/**
 * Show file selected state with preview
 */
function showFileState(container: HTMLElement, file: File): void {

    const emptyState = container.querySelector(SELECTORS.emptyState) as HTMLElement;
    const fileState = container.querySelector(SELECTORS.fileState) as HTMLElement;
    const singlePreview = container.querySelector(SELECTORS.singleFilePreview) as HTMLElement;
    const multiplePreview = container.querySelector(SELECTORS.multipleFilesPreview) as HTMLElement;
    const fileSummary = container.querySelector(SELECTORS.fileSummary) as HTMLElement;
    const addMoreContainer = container.querySelector(SELECTORS.addMoreFilesContainer) as HTMLElement;

    toggleElement(emptyState, false);
    toggleElement(fileState, true);
    toggleElement(singlePreview, true);
    toggleElement(multiplePreview, false);
    toggleElement(fileSummary, false);
    toggleElement(addMoreContainer, false);

    updateFileInfo(container, file);
    announceChange(container, `File selected: ${file.name}`);

}

/**
 * Show multiple files state with grid layout
 */
function showMultipleFilesState(container: HTMLElement, files: File[]): void {

    const emptyState = container.querySelector(SELECTORS.emptyState) as HTMLElement;
    const fileState = container.querySelector(SELECTORS.fileState) as HTMLElement;
    const singlePreview = container.querySelector(SELECTORS.singleFilePreview) as HTMLElement;
    const multiplePreview = container.querySelector(SELECTORS.multipleFilesPreview) as HTMLElement;
    const fileSummary = container.querySelector(SELECTORS.fileSummary) as HTMLElement;
    const fileCount = container.querySelector(SELECTORS.fileCount);
    const fileTotalSize = container.querySelector(SELECTORS.fileTotalSize);
    const addMoreContainer = container.querySelector(SELECTORS.addMoreFilesContainer) as HTMLElement;

    toggleElement(emptyState, false);
    toggleElement(fileState, true);
    toggleElement(singlePreview, false);
    toggleElement(multiplePreview, true);
    toggleElement(fileSummary, true);
    toggleElement(addMoreContainer, true);

    if (fileCount) fileCount.textContent = files.length.toString();
    if (fileTotalSize) {
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        fileTotalSize.textContent = formatFileSize(totalSize);
    }

    if (multiplePreview) {
        multiplePreview.innerHTML = '';
        files.forEach((file, index) => {
            const fileCard = createFileCard(container, file, index);
            multiplePreview.appendChild(fileCard);
        });
    }

    announceChange(container, `${files.length} file(s) selected`);

}

/**
 * Create a file card element for grid display
 */
function createFileCard(container: HTMLElement, file: File, index: number): HTMLElement {
    const card = document.createElement('div');
    card.className = 'file-card relative p-3 rounded-lg border-2 border-line bg-elevation-1 hover:border-accent transition-colors';
    card.setAttribute('data-file-index', index.toString());

    const preview = document.createElement('div');
    preview.className = 'mb-2 relative';

    const img = document.createElement('img');
    img.className = 'hidden w-full h-24 object-cover rounded';
    img.alt = file.name;

    const icon = document.createElement('div');
    icon.className = 'flex items-center justify-center w-full h-24 bg-elevation-1 border border-line rounded';
    icon.innerHTML = `<svg class="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>`;

    preview.appendChild(img);
    preview.appendChild(icon);

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                const imageUrl = e.target.result as string;
                img.src = imageUrl;
                img.classList.remove('hidden');
                icon.classList.add('hidden');

                const imageId = `preview-${index}-${Date.now()}`;
                img.setAttribute('data-lightbox-trigger', imageId);
                img.setAttribute('data-filename', file.name);
                img.setAttribute('data-filetype', 'image');
                img.setAttribute('data-filesize', formatFileSize(file.size));
                img.style.cursor = 'pointer';
                img.setAttribute('role', 'button');
                img.setAttribute('tabindex', '0');
                img.setAttribute('aria-label', `View ${file.name} in lightbox`);

                lightboxActions.addImage(container, {
                    id: imageId,
                    src: imageUrl,
                    alt: file.name,
                    fileName: file.name,
                    fileSize: formatFileSize(file.size),
                    fileType: file.type
                });
            }
        };
        reader.readAsDataURL(file);
    }

    const info = document.createElement('div');
    info.className = 'space-y-1';

    const name = document.createElement('div');
    name.className = 'text-sm font-medium text-primary truncate';
    name.textContent = file.name;
    name.title = file.name;

    const size = document.createElement('div');
    size.className = 'text-xs text-muted';
    size.textContent = formatFileSize(file.size);

    info.appendChild(name);
    info.appendChild(size);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-danger text-white hover:bg-danger-hover transition-colors';
    removeBtn.setAttribute('data-remove-file', index.toString());
    removeBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>`;

    card.appendChild(preview);
    card.appendChild(info);
    card.appendChild(removeBtn);

    return card;
}

/**
 * Update file info display (name, size, preview)
 */
function updateFileInfo(container: HTMLElement, file: File): void {

    const fileName = container.querySelector(SELECTORS.fileName);
    const fileSize = container.querySelector(SELECTORS.fileSize);
    const previewImage = container.querySelector(SELECTORS.previewImage) as HTMLImageElement;
    const fileIcon = container.querySelector(SELECTORS.fileIcon);

    if (fileName) fileName.textContent = file.name;
    if (fileSize) fileSize.textContent = formatFileSize(file.size);

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (previewImage && e.target?.result) {
                const imageUrl = e.target.result as string;
                previewImage.src = imageUrl;

                const imageId = 'preview-' + Date.now();
                previewImage.setAttribute('data-lightbox-trigger', imageId);
                previewImage.setAttribute('data-filename', file.name);
                previewImage.setAttribute('data-filetype', 'image');
                previewImage.setAttribute('data-filesize', formatFileSize(file.size));
                previewImage.style.cursor = 'pointer';
                previewImage.setAttribute('role', 'button');
                previewImage.setAttribute('tabindex', '0');
                previewImage.setAttribute('aria-label', `View ${file.name} in lightbox`);

                const imageContainer = previewImage.closest('.file-upload-wrapper') as HTMLElement;
                if (imageContainer) {
                    lightboxActions.addImage(imageContainer, {
                        id: imageId,
                        src: imageUrl,
                        alt: file.name,
                        fileName: file.name,
                        fileSize: formatFileSize(file.size),
                        fileType: file.type
                    });
                }

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

/**
 * Show/hide upload progress bar
 */
function showUploadProgress(container: HTMLElement, show: boolean): void {
    const progressContainer = container.querySelector(SELECTORS.uploadProgress) as HTMLElement;
    toggleElement(progressContainer, show);
}

/**
 * Display error message
 */
function showError(container: HTMLElement, message: string): void {
    container.setAttribute(DATA_ATTRS.invalid, 'true');
}

/**
 * Clear error message
 */
function clearError(container: HTMLElement): void {
    container.removeAttribute(DATA_ATTRS.invalid);
}

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Toggle element visibility using hidden class
 */
function toggleElement(element: HTMLElement | null, show: boolean): void {
    if (!element) return;
    element.classList.toggle('hidden', !show);
}

/**
 * Set progress bar width percentage
 */
function setProgressWidth(container: HTMLElement, progress: number): void {
    const progressBar = container.querySelector(SELECTORS.progressBar) as HTMLElement;
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

/**
 * Prevent default event behavior
 */
function preventDefault(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
}

/**
 * Announce change to screen readers for accessibility
 */
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

document.addEventListener('DOMContentLoaded', initializeFileUploads);

if (isLivewireAvailable()) {
    document.addEventListener('livewire:navigated', initializeFileUploads);
}