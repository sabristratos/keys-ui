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
    errorMessage: '.error-message',
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
    console.log('[FileUpload] Initializing file upload components...');

    const containers = document.querySelectorAll(SELECTORS.container);
    const livewireAvailable = isLivewireAvailable();

    console.log(`[FileUpload] Found ${containers.length} file upload component(s)`);
    console.log(`[FileUpload] Livewire available: ${livewireAvailable}`);

    containers.forEach((container, index) => {
        const element = container as HTMLElement;
        const wrapper = element.closest('.file-upload-wrapper') as HTMLElement;
        if (!wrapper) {
            console.warn(`[FileUpload] Component #${index + 1}: No wrapper found - skipping`);
            return;
        }
        const fileInput = element.querySelector(SELECTORS.fileInput) as HTMLInputElement;

        console.log(`[FileUpload] Initializing component #${index + 1}:`, {
            hasFileInput: !!fileInput,
            hasWrapper: !!wrapper,
            dataAttributes: element.dataset,
            dragDropEnabled: element.getAttribute(DATA_ATTRS.dragDrop),
            disabled: element.getAttribute(DATA_ATTRS.disabled)
        });

        if (!fileInput) {
            console.warn(`[FileUpload] Component #${index + 1}: No file input found - skipping`);
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
        console.log(`[FileUpload] Component #${index + 1} initialized successfully`);
    });

    console.log('[FileUpload] Initialization complete');
}

/**
 * Setup file input change handler
 */
function setupFileHandling(container: HTMLElement, fileInput: HTMLInputElement, livewireAvailable: boolean): void {
    console.log('[FileUpload] Setting up file handling');

    const isMultiple = container.getAttribute(DATA_ATTRS.multiple) === 'true';

    fileInput.addEventListener('change', () => {
        const isAddingMore = container.hasAttribute('data-adding-more');
        const existingFiles = filesStore.get(container) || [];

        console.log('[FileUpload] File input change event:', {
            filesCount: fileInput.files?.length || 0,
            files: fileInput.files ? Array.from(fileInput.files).map(f => ({ name: f.name, size: f.size, type: f.type })) : [],
            isMultiple,
            isAddingMore,
            existingFilesCount: existingFiles.length
        });

        if (fileInput.files && fileInput.files.length > 0) {
            if (isMultiple) {
                const shouldAppend = isAddingMore && existingFiles.length > 0;
                console.log('[FileUpload] Should append:', shouldAppend);

                handleMultipleFiles(container, fileInput, Array.from(fileInput.files), livewireAvailable, shouldAppend);

                container.removeAttribute('data-adding-more');
            } else {
                handleFile(container, fileInput, fileInput.files[0], livewireAvailable);
            }
        } else {
            console.log('[FileUpload] No files - showing empty state');
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

    console.log('[FileUpload] Setting up drag and drop:', {
        dragDropEnabled,
        isDisabled
    });

    if (!dragDropEnabled || isDisabled) {
        console.log('[FileUpload] Drag and drop skipped (disabled or not enabled)');
        return;
    }

    const events: Array<keyof HTMLElementEventMap> = ['dragenter', 'dragover', 'dragleave', 'drop'];
    events.forEach(event => container.addEventListener(event, preventDefault));

    ['dragenter', 'dragover'].forEach(event => {
        container.addEventListener(event, () => {
            console.log(`[FileUpload] Drag event: ${event}`);
            container.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(event => {
        container.addEventListener(event, () => {
            console.log(`[FileUpload] Drag event: ${event}`);
            container.classList.remove('dragover');
        });
    });

    container.addEventListener('drop', (e) => {
        const files = e.dataTransfer?.files;
        const isMultiple = container.getAttribute(DATA_ATTRS.multiple) === 'true';

        console.log('[FileUpload] Drop event:', {
            filesCount: files?.length || 0,
            files: files ? Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type })) : [],
            isMultiple
        });

        if (files && files.length > 0) {
            if (isMultiple) {
                handleMultipleFiles(container, fileInput, Array.from(files), isLivewireAvailable());
            } else {
                handleFile(container, fileInput, files[0], isLivewireAvailable());
            }
        }
    });

    console.log('[FileUpload] Drag and drop setup complete');
}

/**
 * Setup click handlers for buttons and container
 */
function setupClickHandlers(container: HTMLElement, fileInput: HTMLInputElement): void {
    console.log('[FileUpload] Setting up click handlers');

    const changeButton = container.querySelector(SELECTORS.changeButton);
    console.log('[FileUpload] Change button found:', !!changeButton);

    if (changeButton) {
        changeButton.addEventListener('click', (e) => {
            console.log('[FileUpload] Change button clicked');
            e.preventDefault();
            e.stopPropagation();
            if (!fileInput.disabled) {
                fileInput.click();
            }
        });
    }

    const emptyState = container.querySelector(SELECTORS.emptyState);
    console.log('[FileUpload] Empty state found:', !!emptyState);

    if (emptyState) {
        emptyState.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            console.log('[FileUpload] Dropzone clicked:', {
                target: target.tagName,
                disabled: fileInput.disabled,
                isRemoving: container.hasAttribute('data-is-removing')
            });

            if (target.closest(SELECTORS.fileInput)) {
                console.log('[FileUpload] Click on file input - ignoring');
                return;
            }

            if (container.hasAttribute('data-is-removing')) {
                console.log('[FileUpload] File was just removed - ignoring click');
                return;
            }

            if (!fileInput.disabled) {
                console.log('[FileUpload] Triggering file input');
                fileInput.click();
            }
        });
    }

    const addMoreBtn = container.querySelector(SELECTORS.addMoreFilesBtn);
    console.log('[FileUpload] Add more files button found:', !!addMoreBtn);

    if (addMoreBtn) {
        addMoreBtn.addEventListener('click', (e) => {
            console.log('[FileUpload] Add more files button clicked');
            e.preventDefault();
            e.stopPropagation();
            if (!fileInput.disabled) {
                container.setAttribute('data-adding-more', 'true');
                console.log('[FileUpload] Set adding-more flag');
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
            console.log('[FileUpload] Remove individual file clicked:', fileIndex);

            removeFileAtIndex(container, fileInput, fileIndex);
        }
    });

    console.log('[FileUpload] Click handlers setup complete');
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

            console.log('[FileUpload] Remove button clicked - setting removal flag');

            container.setAttribute('data-is-removing', 'true');

            fileInput.value = '';
            showEmptyState(container);
            clearError(container);
            announceChange(container, MESSAGES.fileRemoved);

            setTimeout(() => {
                container.removeAttribute('data-is-removing');
                console.log('[FileUpload] Removal flag cleared - dropzone clickable again');
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
    console.log('[FileUpload] Removing file at index:', index);

    const files = filesStore.get(container) || [];

    if (index < 0 || index >= files.length) {
        console.error('[FileUpload] Invalid file index:', index);
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

    console.log('[FileUpload] File removed. Remaining files:', files.length);
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
        console.log('[FileUpload] Livewire upload started');
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
        console.log('[FileUpload] Livewire upload finished');
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
    console.log('[FileUpload] Handling file:', {
        name: file.name,
        size: file.size,
        type: file.type
    });

    const validation = validateFile(container, file);
    console.log('[FileUpload] Validation result:', validation);

    if (!validation.valid) {
        console.error('[FileUpload] Validation failed:', validation.error);
        showError(container, validation.error || MESSAGES.invalidFile);
        return;
    }

    clearError(container);

    const isLivewire = container.getAttribute(DATA_ATTRS.livewire) === 'true';
    const actualLivewireAvailable = livewireAvailable && typeof window.Livewire !== 'undefined';

    console.log('[FileUpload] Livewire mode:', {
        dataAttribute: isLivewire,
        actuallyAvailable: actualLivewireAvailable
    });

    if (isLivewire && actualLivewireAvailable) {
        console.log('[FileUpload] Showing upload progress (Livewire mode)');
        showUploadProgress(container, true);
        setProgressWidth(container, 0);

        setTimeout(() => {
            if (!fileInput.hasAttribute('data-livewire-upload-started')) {
                console.warn('[FileUpload] Livewire upload not started - falling back to standard mode');
                showUploadProgress(container, false);
                showFileState(container, file);
            }
        }, 500);
    } else {
        if (isLivewire && !actualLivewireAvailable) {
            console.warn('[FileUpload] Livewire mode set but Livewire not available - using standard mode');
        }
        console.log('[FileUpload] Showing file state (standard mode)');
        showFileState(container, file);
    }
}

/**
 * Handle multiple files upload
 */
function handleMultipleFiles(container: HTMLElement, fileInput: HTMLInputElement, newFiles: File[], livewireAvailable: boolean, append: boolean = false): void {
    console.log('[FileUpload] Handling multiple files:', {
        newFilesCount: newFiles.length,
        append
    });

    const maxFiles = container.getAttribute(DATA_ATTRS.maxFiles);
    const currentFiles = filesStore.get(container) || [];

    let files = append ? [...currentFiles] : [];

    for (const file of newFiles) {
        const validation = validateFile(container, file);

        if (!validation.valid) {
            console.error('[FileUpload] Validation failed for file:', file.name, validation.error);
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
        console.log('[FileUpload] No valid files - showing empty state');
        showEmptyState(container);
        return;
    }

    filesStore.set(container, files);

    updateFileInputFiles(fileInput, files);

    clearError(container);

    showMultipleFilesState(container, files);

    console.log('[FileUpload] Multiple files handled:', {
        totalFiles: files.length,
        fileNames: files.map(f => f.name)
    });
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
    console.log('[FileUpload] Showing empty state');

    const emptyState = container.querySelector(SELECTORS.emptyState) as HTMLElement;
    const fileState = container.querySelector(SELECTORS.fileState) as HTMLElement;

    console.log('[FileUpload] Empty state elements:', {
        emptyState: !!emptyState,
        fileState: !!fileState
    });

    toggleElement(emptyState, true);
    toggleElement(fileState, false);
    showUploadProgress(container, false);

    container.classList.remove('dragover');
    console.log('[FileUpload] Empty state shown');
}

/**
 * Show file selected state with preview
 */
function showFileState(container: HTMLElement, file: File): void {
    console.log('[FileUpload] Showing file state for:', file.name);

    const emptyState = container.querySelector(SELECTORS.emptyState) as HTMLElement;
    const fileState = container.querySelector(SELECTORS.fileState) as HTMLElement;
    const singlePreview = container.querySelector(SELECTORS.singleFilePreview) as HTMLElement;
    const multiplePreview = container.querySelector(SELECTORS.multipleFilesPreview) as HTMLElement;
    const fileSummary = container.querySelector(SELECTORS.fileSummary) as HTMLElement;
    const addMoreContainer = container.querySelector(SELECTORS.addMoreFilesContainer) as HTMLElement;

    console.log('[FileUpload] File state elements:', {
        emptyState: !!emptyState,
        fileState: !!fileState
    });

    toggleElement(emptyState, false);
    toggleElement(fileState, true);
    toggleElement(singlePreview, true);
    toggleElement(multiplePreview, false);
    toggleElement(fileSummary, false);
    toggleElement(addMoreContainer, false);

    updateFileInfo(container, file);
    announceChange(container, `File selected: ${file.name}`);
    console.log('[FileUpload] File state shown');
}

/**
 * Show multiple files state with grid layout
 */
function showMultipleFilesState(container: HTMLElement, files: File[]): void {
    console.log('[FileUpload] Showing multiple files state:', files.length);

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
    console.log('[FileUpload] Multiple files state shown');
}

/**
 * Create a file card element for grid display
 */
function createFileCard(container: HTMLElement, file: File, index: number): HTMLElement {
    const card = document.createElement('div');
    card.className = 'file-card relative p-3 rounded-lg border-2 border-border bg-surface hover:border-brand transition-colors';
    card.setAttribute('data-file-index', index.toString());

    const preview = document.createElement('div');
    preview.className = 'mb-2 relative';

    const img = document.createElement('img');
    img.className = 'hidden w-full h-24 object-cover rounded';
    img.alt = file.name;

    const icon = document.createElement('div');
    icon.className = 'flex items-center justify-center w-full h-24 bg-surface border border-border rounded';
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

                console.log('[FileUpload] Registering card image with lightbox:', imageId);
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
    name.className = 'text-sm font-medium text-foreground truncate';
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
    console.log('[FileUpload] Updating file info:', file.name);

    const fileName = container.querySelector(SELECTORS.fileName);
    const fileSize = container.querySelector(SELECTORS.fileSize);
    const previewImage = container.querySelector(SELECTORS.previewImage) as HTMLImageElement;
    const fileIcon = container.querySelector(SELECTORS.fileIcon);

    console.log('[FileUpload] Info elements found:', {
        fileName: !!fileName,
        fileSize: !!fileSize,
        previewImage: !!previewImage,
        fileIcon: !!fileIcon
    });

    if (fileName) fileName.textContent = file.name;
    if (fileSize) fileSize.textContent = formatFileSize(file.size);

    if (file.type.startsWith('image/')) {
        console.log('[FileUpload] Reading image preview');
        const reader = new FileReader();
        reader.onload = (e) => {
            if (previewImage && e.target?.result) {
                console.log('[FileUpload] Image preview loaded');
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
                    console.log('[FileUpload] Registering image with lightbox:', imageId, imageContainer);
                    lightboxActions.addImage(imageContainer, {
                        id: imageId,
                        src: imageUrl,
                        alt: file.name,
                        fileName: file.name,
                        fileSize: formatFileSize(file.size),
                        fileType: file.type
                    });
                } else {
                    console.warn('[FileUpload] Could not find wrapper for lightbox registration');
                }

                toggleElement(previewImage, true);
                toggleElement(fileIcon as HTMLElement, false);
            }
        };
        reader.onerror = (e) => {
            console.error('[FileUpload] Error reading image:', e);
        };
        reader.readAsDataURL(file);
    } else {
        console.log('[FileUpload] Showing file icon (non-image file)');
        toggleElement(previewImage, false);
        toggleElement(fileIcon as HTMLElement, true);
    }

    console.log('[FileUpload] File info updated');
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
    console.log('[FileUpload] Showing error:', message);

    const errorElement = container.querySelector(SELECTORS.errorMessage) as HTMLElement;
    if (errorElement) {
        errorElement.textContent = message;
        toggleElement(errorElement, true);
    } else {
        console.warn('[FileUpload] Error message element not found');
    }
    container.setAttribute(DATA_ATTRS.invalid, 'true');
}

/**
 * Clear error message
 */
function clearError(container: HTMLElement): void {
    console.log('[FileUpload] Clearing error');

    const errorElement = container.querySelector(SELECTORS.errorMessage) as HTMLElement;
    if (errorElement) {
        toggleElement(errorElement, false);
    }
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
    if (!element) {
        console.warn('[FileUpload] toggleElement: element is null');
        return;
    }
    console.log('[FileUpload] Toggling element:', {
        element: element.className,
        show,
        wasHidden: element.classList.contains('hidden'),
        willBeHidden: !show
    });
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