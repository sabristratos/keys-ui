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

import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';
import LightboxActions from './LightboxActions';
import LivewireUtils from './utils/LivewireUtils';

// Type definitions
interface LivewireProgressEvent extends CustomEvent {
    detail: { progress: number };
}

interface LivewireErrorEvent extends CustomEvent {
    detail: { message?: string };
}

interface FileUploadState {
    files: File[];
}

// Translation helper function
function t(key: string, fallback: string = '', replacements: Record<string, string | number> = {}): string {
    const translations = (window as any).KeysUITranslations;
    if (!translations) {
        return fallback;
    }
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
            return fallback;
        }
    }
    let translation = value || fallback;
    for (const placeholder in replacements) {
        translation = translation.replace(`:${placeholder}`, String(replacements[placeholder]));
    }
    return translation;
}

export class FileUploadActions extends BaseActionClass<FileUploadState> {
    private lightboxActions = LightboxActions.getInstance();

    protected initializeElements(): void {
        DOMUtils.querySelectorAll('[data-keys-file-upload]').forEach(container => {
            if (container.dataset.initialized !== 'true') {
                this.initializeFileUpload(container as HTMLElement);
            }
        });
    }

    protected bindEventListeners(): void {
        // Bound per-instance to correctly scope them
    }

    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach(node => {
                if (node instanceof Element) {
                    if (node.matches('[data-keys-file-upload]') && node.getAttribute('data-initialized') !== 'true') {
                        this.initializeFileUpload(node as HTMLElement);
                    }
                    DOMUtils.querySelectorAll('[data-keys-file-upload]', node).forEach(container => {
                        if (container.getAttribute('data-initialized') !== 'true') {
                            this.initializeFileUpload(container as HTMLElement);
                        }
                    });
                }
            });
        });
    }

    private initializeFileUpload(container: HTMLElement): void {
        const fileInput = DOMUtils.querySelector('[data-file-input]', container) as HTMLInputElement;
        if (!fileInput || this.hasState(container)) return;

        this.setState(container, { files: [] });

        this.setupFileHandling(container, fileInput);
        this.setupDragDrop(container, fileInput);
        this.setupClickHandlers(container, fileInput);
        this.setupRemoveHandler(container, fileInput);
        this.setupLivewireIntegration(container, fileInput);

        this.lightboxActions.setState(container, {
            currentImageIndex: 0,
            images: [],
            isOpen: false,
            elementId: container.id || `upload-${Date.now()}`
        });

        container.setAttribute('data-initialized', 'true');
    }

    private setupFileHandling(container: HTMLElement, fileInput: HTMLInputElement): void {
        const isMultiple = container.dataset.multiple === 'true';
        fileInput.addEventListener('change', () => {
            const isAddingMore = container.hasAttribute('data-adding-more');
            const state = this.getState(container);
            const existingFiles = state ? state.files : [];
            if (fileInput.files && fileInput.files.length > 0) {
                if (isMultiple) {
                    const shouldAppend = isAddingMore && existingFiles.length > 0;
                    this.handleMultipleFiles(container, fileInput, Array.from(fileInput.files), shouldAppend);
                    container.removeAttribute('data-adding-more');
                } else {
                    this.handleFile(container, fileInput, fileInput.files[0]);
                }
            } else {
                this.showEmptyState(container);
            }
        });
    }

    private setupDragDrop(container: HTMLElement, fileInput: HTMLInputElement): void {
        const dragDropEnabled = container.dataset.dragDrop === 'true';
        const isDisabled = container.dataset.disabled === 'true';
        if (!dragDropEnabled || isDisabled) return;

        const events: Array<keyof HTMLElementEventMap> = ['dragenter', 'dragover', 'dragleave', 'drop'];
        events.forEach(event => container.addEventListener(event, this.preventDefault));
        ['dragenter', 'dragover'].forEach(event => container.addEventListener(event, () => container.classList.add('dragover')));
        ['dragleave', 'drop'].forEach(event => container.addEventListener(event, () => container.classList.remove('dragover')));
        container.addEventListener('drop', (e) => {
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
                container.dataset.multiple === 'true'
                    ? this.handleMultipleFiles(container, fileInput, Array.from(files))
                    : this.handleFile(container, fileInput, files[0]);
            }
        });
    }

    private setupClickHandlers(container: HTMLElement, fileInput: HTMLInputElement): void {
        EventUtils.handleDelegatedClick('[data-file-change-btn]', () => !fileInput.disabled && fileInput.click(), container);
        EventUtils.handleDelegatedClick('[data-file-upload-empty-state]', (_, e) => {
            if((e.target as HTMLElement).closest('[data-file-input]') || container.hasAttribute('data-is-removing')) return
            if (!fileInput.disabled) fileInput.click();
        }, container);
        EventUtils.handleDelegatedClick('[data-add-more-files-btn]', () => {
            if (!fileInput.disabled) {
                container.setAttribute('data-adding-more', 'true');
                fileInput.click();
            }
        }, container);
        EventUtils.handleDelegatedClick('[data-remove-file]', (btn) => {
            const fileIndex = parseInt(btn.getAttribute('data-remove-file') || '0');
            this.removeFileAtIndex(container, fileInput, fileIndex);
        }, container);
    }

    private setupRemoveHandler(container: HTMLElement, fileInput: HTMLInputElement): void {
        EventUtils.handleDelegatedClick('[data-file-remove]', (_, e) => {
            e.preventDefault();
            e.stopPropagation();
            container.setAttribute('data-is-removing', 'true');
            fileInput.value = '';
            this.showEmptyState(container);
            this.clearError(container);
            this.announceChange(container, t('file_upload.file_removed', 'File removed.'));
            setTimeout(() => container.removeAttribute('data-is-removing'), 150);
            if (LivewireUtils.isLivewireEnabled(container)) {
                LivewireUtils.dispatchInputEvent(fileInput);
            }
        }, container);
    }

    private removeFileAtIndex(container: HTMLElement, fileInput: HTMLInputElement, index: number): void {
        const state = this.getState(container);
        if (!state) return;
        const files = state.files;
        if (index < 0 || index >= files.length) return;
        const imageId = `preview-${index}-`;
        const lightboxState = this.lightboxActions.getState(container);
        if (lightboxState && lightboxState.images) {
            const imagesToRemove = lightboxState.images.filter(img => img.id.startsWith(imageId));
            imagesToRemove.forEach(img => this.lightboxActions.removeImage(container, img.id));
        }
        files.splice(index, 1);
        this.setState(container, { files });
        if (files.length === 0) {
            fileInput.value = '';
            this.showEmptyState(container);
            this.announceChange(container, t('file_upload.file_removed', 'File removed.'));
        } else {
            this.updateFileInputFiles(fileInput, files);
            this.showMultipleFilesState(container, files);
            this.announceChange(container, `${t('file_upload.file_removed', 'File removed.')} ${files.length} file(s) remaining`);
        }
    }

    private setupLivewireIntegration(container: HTMLElement, fileInput: HTMLInputElement): void {
        if (!LivewireUtils.isLivewireEnabled(container) || !LivewireUtils.isLivewireAvailable()) return;
        fileInput.addEventListener('livewire-upload-start', () => {
            container.classList.add('uploading');
            this.showUploadProgress(container, true, true);
        });
        fileInput.addEventListener('livewire-upload-progress', (e) => this.setProgressWidth(container, (e as LivewireProgressEvent).detail.progress));
        fileInput.addEventListener('livewire-upload-finish', () => {
            container.classList.remove('uploading');
            container.classList.add('upload-success');
            setTimeout(() => container.classList.remove('upload-success'), 2000);
            this.showUploadProgress(container, false);
            if (fileInput.files && fileInput.files.length > 0) {
                this.showFileState(container, fileInput.files[0]);
            }
        });
        fileInput.addEventListener('livewire-upload-error', (e) => {
            container.classList.remove('uploading');
            container.classList.add('upload-error');
            this.showError(container, (e as LivewireErrorEvent).detail?.message || t('file_upload.upload_failed', 'Upload failed. Please try again.'));
            this.showUploadProgress(container, false);
        });
        fileInput.addEventListener('livewire-upload-cancel', () => this.showUploadProgress(container, false));
    }

    private handleFile(container: HTMLElement, fileInput: HTMLInputElement, file: File): void {
        const validation = this.validateFile(container, file);
        if (!validation.valid) {
            this.showError(container, validation.error || t('file_upload.invalid_file', 'Invalid file selected.'));
            return;
        }
        this.clearError(container);
        this.setState(container, { files: [file] });
        if (LivewireUtils.isLivewireEnabled(container) && LivewireUtils.isLivewireAvailable()) {
            this.showUploadProgress(container, true, true);
            setTimeout(() => {
                if (!container.classList.contains('uploading')) {
                    this.showUploadProgress(container, false);
                    this.showFileState(container, file);
                }
            }, 500);
        } else {
            this.showFileState(container, file);
        }
    }

    private handleMultipleFiles(container: HTMLElement, fileInput: HTMLInputElement, newFiles: File[], append: boolean = false): void {
        const maxFilesAttr = container.dataset.maxFiles;
        const maxFiles = maxFilesAttr ? parseInt(maxFilesAttr) : null;
        const state = this.getState(container);
        const currentFiles = state ? state.files : [];
        let files = append ? [...currentFiles] : [];

        for (const file of newFiles) {
            const validation = this.validateFile(container, file);
            if (!validation.valid) {
                this.showError(container, validation.error || t('file_upload.invalid_file', 'Invalid file selected.'));
                continue;
            }
            if (maxFiles && files.length >= maxFiles) {
                this.showError(container, t('file_upload.max_files_error', 'Maximum :max file(s) allowed.', { max: maxFiles }));
                break;
            }
            files.push(file);
        }
        if (files.length === 0) {
            this.showEmptyState(container);
            return;
        }
        this.setState(container, { files });
        this.updateFileInputFiles(fileInput, files);
        this.clearError(container);
        this.showMultipleFilesState(container, files);
    }

    private updateFileInputFiles(fileInput: HTMLInputElement, files: File[]): void {
        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
        // CORRECTED: Do NOT dispatch a change event here to avoid an infinite loop.
        // The calling function will handle UI updates.
    }

    private validateFile(container: HTMLElement, file: File): { valid: boolean; error?: string } {
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
            if (!isValid) return { valid: false, error: t('file_upload.file_type_error', 'File type not allowed. Accepted: :types', { types: acceptedTypes.join(', ') }) };
        }
        if (maxSize && file.size > parseInt(maxSize)) {
            return { valid: false, error: t('file_upload.file_size_error', 'File too large. Maximum size: :size', { size: maxSizeFormatted || '10MB' }) };
        }
        return { valid: true };
    }

    private showEmptyState(container: HTMLElement): void {
        this.toggleElement(DOMUtils.querySelector('[data-file-upload-empty-state]', container), true);
        this.toggleElement(DOMUtils.querySelector('[data-file-upload-preview-state]', container), false);
        this.showUploadProgress(container, false);
        container.classList.remove('dragover');
    }

    private showFileState(container: HTMLElement, file: File): void {
        this.toggleElement(DOMUtils.querySelector('[data-file-upload-empty-state]', container), false);
        this.toggleElement(DOMUtils.querySelector('[data-file-upload-preview-state]', container), true);
        this.toggleElement(DOMUtils.querySelector('[data-single-file-preview]', container), true);
        this.toggleElement(DOMUtils.querySelector('[data-multiple-files-preview]', container), false);
        this.toggleElement(DOMUtils.querySelector('[data-file-summary]', container), false);
        this.toggleElement(DOMUtils.querySelector('[data-add-more-files-container]', container), false);
        this.updateFileInfo(container, file);
        this.announceChange(container, t('file_upload.files_selected', ':count file(s) selected', { count: 1 }));
    }

    private showMultipleFilesState(container: HTMLElement, files: File[]): void {
        this.toggleElement(DOMUtils.querySelector('[data-file-upload-empty-state]', container), false);
        this.toggleElement(DOMUtils.querySelector('[data-file-upload-preview-state]', container), true);
        this.toggleElement(DOMUtils.querySelector('[data-single-file-preview]', container), false);
        this.toggleElement(DOMUtils.querySelector('[data-multiple-files-preview]', container), true);
        this.toggleElement(DOMUtils.querySelector('[data-file-summary]', container), true);
        this.toggleElement(DOMUtils.querySelector('[data-add-more-files-container]', container), true);

        const fileCount = DOMUtils.querySelector('[data-file-count]', container);
        if (fileCount) fileCount.textContent = files.length.toString();

        const fileTotalSize = DOMUtils.querySelector('[data-file-total-size]', container);
        if (fileTotalSize) {
            const totalSize = files.reduce((sum, f) => sum + f.size, 0);
            fileTotalSize.textContent = this.formatFileSize(totalSize);
        }

        const multiplePreview = DOMUtils.querySelector('[data-multiple-files-preview]', container);
        if (multiplePreview) {
            multiplePreview.innerHTML = '';
            files.forEach((file, index) => {
                const fileCard = this.createFileCard(container, file, index);
                multiplePreview.appendChild(fileCard);
            });
        }
        this.announceChange(container, t('file_upload.files_selected', ':count file(s) selected', { count: files.length }));
    }

    private createFileCard(container: HTMLElement, file: File, index: number): HTMLElement {
        const template = DOMUtils.querySelector('[data-file-card-template]', container.parentElement || document) as HTMLTemplateElement;
        const cardFragment = template.content.cloneNode(true) as DocumentFragment;
        const card = cardFragment.firstElementChild as HTMLElement;

        card.setAttribute('data-file-index', index.toString());

        const img = DOMUtils.querySelector('[data-file-card-image]', card) as HTMLImageElement;
        const icon = DOMUtils.querySelector('[data-file-card-icon]', card) as HTMLElement;
        const name = DOMUtils.querySelector('[data-file-card-name]', card) as HTMLElement;
        const size = DOMUtils.querySelector('[data-file-card-size]', card) as HTMLElement;
        const removeBtn = DOMUtils.querySelector('[data-remove-file]', card) as HTMLElement;

        name.textContent = file.name;
        name.title = file.name;
        size.textContent = this.formatFileSize(file.size);
        removeBtn.setAttribute('data-remove-file', index.toString());
        removeBtn.setAttribute('aria-label', `${t('file_upload.remove_file', 'Remove file')} ${file.name}`);

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    const imageUrl = e.target.result as string;
                    img.src = imageUrl;
                    img.alt = file.name;
                    img.classList.remove('hidden');
                    icon.classList.add('hidden');
                    const imageId = `preview-${index}-${Date.now()}`;
                    img.setAttribute('data-lightbox-trigger', imageId);
                    img.setAttribute('data-filename', file.name);
                    img.setAttribute('data-filetype', 'image');
                    img.setAttribute('data-filesize', this.formatFileSize(file.size));
                    img.style.cursor = 'pointer';
                    img.setAttribute('role', 'button');
                    img.setAttribute('tabindex', '0');
                    img.setAttribute('aria-label', `View ${file.name} in lightbox`);
                    this.lightboxActions.addImage(container, { id: imageId, src: imageUrl, alt: file.name, fileName: file.name, fileSize: this.formatFileSize(file.size), fileType: file.type });
                }
            };
            reader.readAsDataURL(file);
        }

        return card;
    }

    private updateFileInfo(container: HTMLElement, file: File): void {
        const singlePreview = DOMUtils.querySelector('[data-single-file-preview]', container);
        if (!singlePreview) return;
        const fileName = DOMUtils.querySelector('[data-file-name]', singlePreview);
        const fileSize = DOMUtils.querySelector('[data-file-size]', singlePreview);
        const previewImage = DOMUtils.querySelector('[data-file-preview-image]', singlePreview) as HTMLImageElement;
        const fileIcon = DOMUtils.querySelector('[data-file-icon]', singlePreview);
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = this.formatFileSize(file.size);
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
                    previewImage.setAttribute('data-filesize', this.formatFileSize(file.size));
                    previewImage.style.cursor = 'pointer';
                    previewImage.setAttribute('role', 'button');
                    previewImage.setAttribute('tabindex', '0');
                    previewImage.setAttribute('aria-label', `View ${file.name} in lightbox`);
                    this.lightboxActions.addImage(container, { id: imageId, src: imageUrl, alt: file.name, fileName: file.name, fileSize: this.formatFileSize(file.size), fileType: file.type });
                    this.toggleElement(previewImage, true);
                    this.toggleElement(fileIcon as HTMLElement, false);
                }
            };
            reader.readAsDataURL(file);
        } else {
            this.toggleElement(previewImage, false);
            this.toggleElement(fileIcon as HTMLElement, true);
        }
    }

    private showUploadProgress(container: HTMLElement, show: boolean, isLivewire: boolean = false): void {
        const target = isLivewire ? container : DOMUtils.querySelector('[data-single-file-preview]', container);
        if (!target) return;
        const progress = DOMUtils.querySelector('[data-upload-progress]', target);
        this.toggleElement(progress, show);
        if(show) this.setProgressWidth(container, 0);
    }

    private setProgressWidth(container: HTMLElement, progress: number): void {
        // This targets the specific bar inside the progress component
        const progressBar = DOMUtils.querySelector('[data-progress-bar]', container) as HTMLElement;
        if (progressBar) progressBar.style.width = `${progress}%`;
    }

    private showError(container: HTMLElement, message: string): void {
        container.setAttribute('data-invalid', 'true');
        console.error("File Upload Error:", message);
    }

    private clearError(container: HTMLElement): void {
        container.removeAttribute('data-invalid');
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    private toggleElement(element: HTMLElement | null, show: boolean): void {
        if (element) element.classList.toggle('hidden', !show);
    }

    private preventDefault(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
    }

    private announceChange(container: HTMLElement, message: string): void {
        const announcement = DOMUtils.createElement('div', {
            attributes: { 'aria-live': 'polite', 'aria-atomic': 'true' },
            classes: ['sr-only'],
            textContent: message
        });
        container.appendChild(announcement);
        setTimeout(() => {
            if (container.contains(announcement)) {
                container.removeChild(announcement);
            }
        }, 1000);
    }
}
