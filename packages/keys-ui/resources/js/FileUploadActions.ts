/**
 * FileUploadActions - Handles file upload functionality with drag & drop, progress tracking, and Livewire integration
 *
 * Features:
 * - Drag & drop file handling
 * - File validation (type, size, count)
 * - Preview generation for images
 * - Progress tracking with visual feedback
 * - Automatic Livewire integration when wire: attributes are detected
 * - Error handling and retry functionality
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

interface FileUploadState {
    files: File[];
    isUploading: boolean;
    isDragOver: boolean;
    hasLivewire: boolean;
    livewireProperty?: string;
    validationRules: {
        accept?: string;
        maxSize?: number;
        maxFiles?: number;
    };
    preview: boolean;
    progress: boolean;
    autoUpload: boolean;
    fileUploadZone?: HTMLElement;
}

interface FilePreview {
    file: File;
    id: string;
    preview?: string;
    progress: number;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
}

export class FileUploadActions extends BaseActionClass<FileUploadState> {
    private cleanupFunctions: (() => void)[] = [];
    private filePreviewsMap = new Map<HTMLElement, Map<string, FilePreview>>();

    protected bindEventListeners(): void {
        // Handle drop zone clicks
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-file-upload-zone]',
                (element, event) => this.handleDropZoneClick(element, event)
            )
        );

        // Handle keyboard navigation
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedEvent(
                'keydown',
                '[data-file-upload-zone]',
                (element, event) => this.handleDropZoneKeydown(element, event as KeyboardEvent)
            )
        );

        // Browse button functionality is now handled by drop zone click

        // Handle file input changes
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedChange(
                '[data-file-input]',
                (element, event) => this.handleFileInputChange(element, event)
            )
        );

        // Handle drag and drop events
        this.setupDragAndDropEvents();

        // Handle remove file buttons
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-remove-file]',
                (element, event) => this.handleRemoveFile(element, event)
            )
        );

        // Handle remove existing file buttons
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-remove-existing-file]',
                (element, event) => this.handleRemoveExistingFile(element, event)
            )
        );

        // Handle error dismissal
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-dismiss-error]',
                (element, event) => this.handleDismissError(element, event)
            )
        );

        // Handle add more files button
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-add-more-files]',
                (element, event) => this.handleAddMoreFiles(element, event)
            )
        );
    }

    protected initializeElements(): void {
        const zones = DOMUtils.findByDataAttribute('file-upload-zone');
        console.log(`FileUploadActions: Found ${zones.length} file upload zones to initialize`);
        zones.forEach((zone, index) => {
            console.log(`FileUploadActions: Initializing zone ${index + 1}:`, zone);
            this.initializeZone(zone);
        });
    }

    private initializeZone(zone: HTMLElement): void {
        const input = this.findFileInput(zone);
        console.log(`FileUploadActions: Found input for zone:`, input);
        if (!input) {
            console.warn('FileUploadActions: No file input found for zone:', zone);
            return;
        }

        const previewAttr = DOMUtils.getDataAttribute(zone, 'preview');
        const progressAttr = DOMUtils.getDataAttribute(zone, 'progress');
        const autoUploadAttr = DOMUtils.getDataAttribute(zone, 'auto-upload');
        console.log('FileUploadActions: Data attributes - preview:', previewAttr, 'progress:', progressAttr, 'auto-upload:', autoUploadAttr);

        const state: FileUploadState = {
            files: [],
            isUploading: false,
            isDragOver: false,
            hasLivewire: this.detectLivewire(input),
            livewireProperty: this.getLivewireProperty(input),
            validationRules: this.parseValidationRules(zone),
            preview: previewAttr === 'true',
            progress: progressAttr === 'true',
            autoUpload: autoUploadAttr === 'true',
            fileUploadZone: zone
        };

        this.setState(zone, state);
        this.filePreviewsMap.set(zone, new Map());
    }

    private setupDragAndDropEvents(): void {
        // Prevent default drag behaviors on the document
        this.cleanupFunctions.push(
            EventUtils.addEventListener(document, 'dragenter', (e) => e.preventDefault()),
            EventUtils.addEventListener(document, 'dragover', (e) => e.preventDefault()),
            EventUtils.addEventListener(document, 'drop', (e) => e.preventDefault())
        );

        // Handle drop zone specific drag events
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedEvent(
                'dragenter',
                '[data-file-upload-zone]',
                (element, event) => this.handleDragEnter(element, event as DragEvent)
            ),
            EventUtils.handleDelegatedEvent(
                'dragover',
                '[data-file-upload-zone]',
                (element, event) => this.handleDragOver(element, event as DragEvent)
            ),
            EventUtils.handleDelegatedEvent(
                'dragleave',
                '[data-file-upload-zone]',
                (element, event) => this.handleDragLeave(element, event as DragEvent)
            ),
            EventUtils.handleDelegatedEvent(
                'drop',
                '[data-file-upload-zone]',
                (element, event) => this.handleDrop(element, event as DragEvent)
            )
        );
    }

    private handleDropZoneClick(zone: HTMLElement, event: MouseEvent): void {
        console.log('FileUploadActions: Drop zone clicked:', zone, event);
        if (DOMUtils.isDisabled(zone)) {
            console.log('FileUploadActions: Zone is disabled, ignoring click');
            return;
        }

        const target = event.target as Element;

        // Allow clicks directly on the drop zone itself (which has role="button" for accessibility)
        if (target === zone || target.closest('[data-file-upload-zone]') === zone) {
            // Check if we clicked on a nested interactive element INSIDE the drop zone
            // but exclude the drop zone itself and elements with pointer-events-none
            const clickedElement = target.closest('button, a, [role="button"]:not([data-file-upload-zone])');

            if (clickedElement && !target.closest('.pointer-events-none')) {
                console.log('FileUploadActions: Clicked on nested interactive element, ignoring');
                return;
            }

            console.log('FileUploadActions: Valid drop zone click, triggering file select');
            this.triggerFileSelect(zone);
        }
    }

    private handleDropZoneKeydown(zone: HTMLElement, event: KeyboardEvent): void {
        if (DOMUtils.isDisabled(zone)) {
            return;
        }

        // Handle Enter and Space key presses
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.triggerFileSelect(zone);
        }
    }

    private triggerFileSelect(zone: HTMLElement): void {
        const input = this.findFileInput(zone);
        console.log('FileUploadActions: Found input for trigger:', input);
        if (input) {
            console.log('FileUploadActions: Triggering input click');
            input.click();
            // Announce to screen readers
            this.announceToScreenReader('File selection dialog opened');
        } else {
            console.warn('FileUploadActions: No input found for zone trigger');
        }
    }

    // Browse button functionality removed - now handled by drop zone click

    private handleFileInputChange(input: HTMLInputElement, event: Event): void {
        console.log('FileUploadActions: File input change detected:', input, event);
        // Find the sibling zone within the same wrapper
        const wrapper = input.parentElement;
        const zone = wrapper ? wrapper.querySelector('[data-file-upload-zone]') as HTMLElement : null;
        console.log('FileUploadActions: Found zone for file input:', zone);
        if (!zone) return;

        const files = Array.from(input.files || []);
        console.log('FileUploadActions: Selected files:', files);
        this.processFiles(zone, files);
    }

    private handleDragEnter(zone: HTMLElement, event: DragEvent): void {
        if (DOMUtils.isDisabled(zone)) return;

        event.preventDefault();
        this.setDragState(zone, true);
    }

    private handleDragOver(zone: HTMLElement, event: DragEvent): void {
        if (DOMUtils.isDisabled(zone)) return;

        event.preventDefault();
        event.dataTransfer!.dropEffect = 'copy';
    }

    private handleDragLeave(zone: HTMLElement, event: DragEvent): void {
        if (DOMUtils.isDisabled(zone)) return;

        // Only remove drag state if leaving the zone entirely
        const rect = zone.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;

        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            this.setDragState(zone, false);
        }
    }

    private handleDrop(zone: HTMLElement, event: DragEvent): void {
        if (DOMUtils.isDisabled(zone)) return;

        event.preventDefault();
        this.setDragState(zone, false);

        const files = Array.from(event.dataTransfer?.files || []);
        if (files.length > 0) {
            this.processFiles(zone, files);
        }
    }

    private handleRemoveFile(button: HTMLElement, event: MouseEvent): void {
        console.log('FileUploadActions: Remove button clicked:', button, event);
        event.stopPropagation();

        const fileId = button.getAttribute('data-remove-file');
        console.log('FileUploadActions: File ID to remove:', fileId);

        // The preview area is outside the zone, so we need to find the zone via the wrapper
        const previewArea = DOMUtils.findClosest(button, '[data-file-previews]');
        const wrapper = previewArea?.parentElement;
        const zone = wrapper ? wrapper.querySelector('[data-file-upload-zone]') as HTMLElement : null;

        console.log('FileUploadActions: Found preview area:', previewArea);
        console.log('FileUploadActions: Found wrapper:', wrapper);
        console.log('FileUploadActions: Found zone for removal:', zone);

        if (zone && fileId) {
            this.removeFile(zone, fileId);
        } else {
            console.warn('FileUploadActions: Could not find zone or fileId for removal');
        }
    }

    private handleRemoveExistingFile(button: HTMLElement, event: MouseEvent): void {
        console.log('FileUploadActions: Remove existing file button clicked:', button, event);
        event.stopPropagation();

        const fileId = button.getAttribute('data-remove-existing-file');
        console.log('FileUploadActions: File ID to remove:', fileId);

        // Emit custom event for parent component to handle
        EventUtils.dispatchCustomEvent(button, 'file-upload:remove-existing', {
            fileId: fileId
        });

        console.log('FileUploadActions: Dispatched remove-existing event for file:', fileId);
    }

    private handleAddMoreFiles(button: HTMLElement, event: MouseEvent): void {
        console.log('FileUploadActions: Add more files button clicked:', button, event);
        event.stopPropagation();

        // Find the zone through the preview area
        const previewArea = DOMUtils.findClosest(button, '[data-file-previews]');
        const wrapper = previewArea?.parentElement;
        const zone = wrapper ? wrapper.querySelector('[data-file-upload-zone]') as HTMLElement : null;

        console.log('FileUploadActions: Found zone for add more button:', zone);
        if (!zone) {
            console.warn('FileUploadActions: No zone found for add more button');
            return;
        }

        // Trigger file selection
        const input = this.findFileInput(zone);
        if (input) {
            console.log('FileUploadActions: Triggering input click for add more');
            input.click();
            this.announceToScreenReader('File selection dialog opened for additional files');
        } else {
            console.warn('FileUploadActions: No input found for add more button');
        }
    }

    private processFiles(zone: HTMLElement, files: File[]): void {
        console.log('FileUploadActions: Processing files:', files);
        const state = this.getState(zone);
        console.log('FileUploadActions: Current state:', state);
        if (!state) return;

        // Validate files
        const validationResult = this.validateFiles(files, state.validationRules, state.files.length);
        console.log('FileUploadActions: Validation result:', validationResult);
        if (!validationResult.valid) {
            this.showError(zone, validationResult.errors.join(', '));
            return;
        }

        // Add files to state
        const newFiles = validationResult.validFiles;
        console.log('FileUploadActions: Adding new files to state:', newFiles);

        // Check if we need to clear existing files (single file mode)
        const input = this.findFileInput(zone);
        const isMultiple = input?.hasAttribute('multiple') ?? false;

        if (!isMultiple && state.files.length > 0) {
            // Single file mode - replace existing file
            state.files = [...newFiles];
            // Clear existing previews first
            this.clearAllPreviews(zone);
        } else {
            // Multiple file mode - add to existing files
            state.files.push(...newFiles);
        }

        this.setState(zone, state);

        // Create previews if enabled
        console.log('FileUploadActions: Preview enabled?', state.preview);
        if (state.preview) {
            console.log('FileUploadActions: Creating file previews for:', newFiles);
            this.createFilePreviews(zone, newFiles);
        }

        // Update file input if Livewire is detected
        if (state.hasLivewire) {
            this.updateLivewireFiles(zone, state.files);
        }

        // Auto upload if enabled
        if (state.autoUpload) {
            this.uploadFiles(zone, newFiles);
        }

        // Announce file selection to screen readers
        const fileCount = newFiles.length;
        const totalCount = state.files.length;
        const selectionMessage = fileCount === 1
            ? `Selected ${newFiles[0].name}`
            : `Selected ${fileCount} files`;
        const totalMessage = totalCount > fileCount
            ? ` (${totalCount} files total)`
            : '';
        this.announceToScreenReader(selectionMessage + totalMessage);

        // Emit custom event
        EventUtils.dispatchCustomEvent(zone, 'file-upload:files-added', {
            files: newFiles,
            allFiles: state.files
        });
    }

    private validateFiles(
        files: File[],
        rules: FileUploadState['validationRules'],
        existingCount: number
    ): { valid: boolean; validFiles: File[]; errors: string[] } {
        const errors: string[] = [];
        const validFiles: File[] = [];

        // Check file count
        if (rules.maxFiles && (existingCount + files.length) > rules.maxFiles) {
            errors.push(`Maximum ${rules.maxFiles} files allowed`);
            return { valid: false, validFiles: [], errors };
        }

        for (const file of files) {
            const fileErrors: string[] = [];

            // Check file type
            if (rules.accept && !this.isFileTypeAllowed(file, rules.accept)) {
                fileErrors.push(`${file.name}: File type not allowed`);
            }

            // Check file size
            if (rules.maxSize && file.size > rules.maxSize) {
                fileErrors.push(`${file.name}: File too large (max ${this.formatFileSize(rules.maxSize)})`);
            }

            if (fileErrors.length === 0) {
                validFiles.push(file);
            } else {
                errors.push(...fileErrors);
            }
        }

        return { valid: errors.length === 0, validFiles, errors };
    }

    private isFileTypeAllowed(file: File, accept: string): boolean {
        const acceptTypes = accept.split(',').map(type => type.trim());

        return acceptTypes.some(acceptType => {
            if (acceptType.startsWith('.')) {
                // File extension check
                return file.name.toLowerCase().endsWith(acceptType.toLowerCase());
            } else if (acceptType.includes('*')) {
                // MIME type wildcard check
                const pattern = acceptType.replace('*', '.*');
                return new RegExp(pattern).test(file.type);
            } else {
                // Exact MIME type check
                return file.type === acceptType;
            }
        });
    }

    private createFilePreviews(zone: HTMLElement, files: File[]): void {
        const previewContainer = zone.parentElement?.querySelector('[data-preview-list]') as HTMLElement;
        if (!previewContainer) {
            console.warn('FileUploadActions: Preview container not found');
            return;
        }

        const previews = this.filePreviewsMap.get(zone) || new Map();

        files.forEach(file => {
            const fileId = this.generateFileId(file);
            const preview: FilePreview = {
                file,
                id: fileId,
                progress: 0,
                status: 'pending'
            };

            previews.set(fileId, preview);
            this.renderFilePreview(previewContainer, preview);
        });

        this.filePreviewsMap.set(zone, previews);

        // Update layout based on file types
        this.updatePreviewLayout(zone);
        this.showPreviewArea(zone);
    }

    private renderFilePreview(container: HTMLElement, preview: FilePreview): void {
        const layoutType = container.getAttribute('data-layout-type') || 'file-list';
        this.renderFilePreviewForLayout(container, preview, layoutType);
    }

    /**
     * Renders a file preview for a specific layout type
     */
    private renderFilePreviewForLayout(container: HTMLElement, preview: FilePreview, layoutType: string): void {
        const isImage = preview.file.type.startsWith('image/');
        const fileSize = this.formatFileSize(preview.file.size);
        const fileIconName = this.getFileTypeIconName(preview.file);

        // Create preview element with layout-specific structure
        let previewElement: HTMLElement;

        if (layoutType === 'image-grid' && isImage) {
            // Large image card layout for pure image uploads
            previewElement = this.createImageGridPreview(preview, fileSize);
        } else if (layoutType === 'mixed' && isImage) {
            // Enhanced image preview for mixed uploads
            previewElement = this.createMixedImagePreview(preview, fileSize);
        } else {
            // Standard file list layout
            previewElement = this.createFileListPreview(preview, fileSize, fileIconName, isImage);
        }

        // Add to container
        container.appendChild(previewElement);

        // Initialize image preview loading for images
        if (isImage) {
            this.loadImagePreview(previewElement, preview);
        }

        // Update status-specific classes
        this.updatePreviewStatus(previewElement, preview.status);
    }

    /**
     * Creates a large image grid preview for pure image uploads
     */
    private createImageGridPreview(preview: FilePreview, fileSize: string): HTMLElement {
        const element = DOMUtils.createElement('div', {
            classes: ['image-grid-item', 'group', 'relative', 'bg-surface', 'border', 'border-border', 'rounded-lg', 'overflow-hidden', 'transition-all', 'duration-200', 'hover:shadow-lg', 'hover:border-brand'],
            attributes: {
                'data-file-id': preview.id,
                'data-file-status': preview.status,
                'role': 'listitem'
            }
        });

        element.innerHTML = `
            <!-- Large Image Display (1:1 aspect ratio) -->
            <div class="aspect-square relative bg-surface overflow-hidden">
                <img
                    src=""
                    alt="Preview of ${this.escapeHtml(preview.file.name)}"
                    class="w-full h-full object-cover opacity-50 transition-opacity duration-200"
                    data-image-preview="true"
                />

                <!-- Status indicator corner badge -->
                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    ${this.getStatusIndicator(preview.status)}
                </div>

                <!-- Hover overlay with file details -->
                <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end">
                    <div class="p-4 w-full text-white">
                        <h4 class="font-medium text-sm truncate mb-1" title="${this.escapeHtml(preview.file.name)}">
                            ${this.escapeHtml(preview.file.name)}
                        </h4>
                        <div class="flex items-center justify-between text-xs text-white/80">
                            <span>${fileSize}</span>
                            ${preview.status !== 'pending' ? `<span class="capitalize">${preview.status}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delete button (always visible on mobile, hover on desktop) -->
            <button
                type="button"
                class="absolute top-2 left-2 w-8 h-8 bg-black/60 hover:bg-danger text-white rounded-full transition-all duration-200 opacity-70 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                data-remove-file="${preview.id}"
                aria-label="Remove ${this.escapeHtml(preview.file.name)}"
            >
                ${this.getHeroiconSvg('heroicon-o-x-mark', 'w-4 h-4')}
            </button>

            <!-- Progress bar for uploads -->
            ${preview.status === 'uploading' ? `
                <div class="absolute bottom-0 left-0 right-0 h-2 bg-black/20">
                    <div
                        class="h-full bg-brand transition-all duration-300 ease-out"
                        style="width: ${preview.progress}%"
                        data-progress-bar="${preview.id}"
                    ></div>
                </div>
            ` : ''}
        `;

        return element;
    }

    /**
     * Creates an enhanced image preview for mixed file uploads
     */
    private createMixedImagePreview(preview: FilePreview, fileSize: string): HTMLElement {
        const element = DOMUtils.createElement('div', {
            classes: ['mixed-image-item', 'group', 'relative', 'flex', 'items-center', 'p-4', 'border', 'border-border', 'rounded-lg', 'bg-surface', 'hover:bg-surface/80', 'transition-all', 'duration-200'],
            attributes: {
                'data-file-id': preview.id,
                'data-file-status': preview.status,
                'role': 'listitem'
            }
        });

        element.innerHTML = `
            <!-- Enhanced Image Thumbnail (larger than standard) -->
            <div class="flex items-center space-x-4 flex-1 min-w-0">
                <div class="file-preview-thumbnail flex-shrink-0">
                    <div class="relative w-20 h-20 rounded-lg overflow-hidden bg-surface border border-border">
                        <img
                            src=""
                            alt="Preview of ${this.escapeHtml(preview.file.name)}"
                            class="w-full h-full object-cover opacity-50"
                            data-image-preview="true"
                        />
                        <!-- Status indicator -->
                        <div class="absolute top-1 right-1">
                            ${this.getStatusIndicator(preview.status, 'sm')}
                        </div>
                    </div>
                </div>

                <!-- File Information -->
                <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-foreground truncate group-hover:text-brand transition-colors" title="${this.escapeHtml(preview.file.name)}">
                        ${this.escapeHtml(preview.file.name)}
                    </p>
                    <div class="flex items-center space-x-2 text-xs text-muted mt-1">
                        <span>${fileSize}</span>
                        ${preview.status !== 'pending' ? `
                            <span class="text-muted/50">•</span>
                            <span class="capitalize ${this.getStatusColor(preview.status)}">
                                ${preview.status}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center space-x-2 flex-shrink-0">
                ${preview.status === 'uploading' ? `
                    <div class="w-4 h-4 animate-spin text-brand">
                        <svg fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ` : ''}

                <button
                    type="button"
                    class="p-2 opacity-60 group-hover:opacity-100 hover:bg-danger/10 text-danger hover:text-danger-hover rounded transition-all duration-200"
                    data-remove-file="${preview.id}"
                    aria-label="Remove ${this.escapeHtml(preview.file.name)}"
                >
                    ${this.getHeroiconSvg('heroicon-o-trash', 'w-4 h-4')}
                </button>
            </div>

            <!-- Progress Bar -->
            ${preview.status === 'uploading' ? `
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-border rounded-b-lg overflow-hidden">
                    <div
                        class="h-full bg-brand transition-all duration-300 ease-out"
                        style="width: ${preview.progress}%"
                        data-progress-bar="${preview.id}"
                    ></div>
                </div>
            ` : ''}
        `;

        return element;
    }

    /**
     * Creates a standard file list preview
     */
    private createFileListPreview(preview: FilePreview, fileSize: string, fileIconName: string, isImage: boolean): HTMLElement {
        const element = DOMUtils.createElement('div', {
            classes: ['file-preview-item', 'group', 'relative', 'flex', 'items-center', 'justify-between', 'p-4', 'border', 'border-border', 'rounded-lg', 'bg-surface', 'hover:bg-surface/80', 'transition-all', 'duration-200'],
            attributes: {
                'data-file-id': preview.id,
                'data-file-status': preview.status,
                'role': 'listitem'
            }
        });

        element.innerHTML = `
            <div class="flex items-center space-x-4 flex-1 min-w-0">
                <div class="file-preview-thumbnail flex-shrink-0">
                    ${isImage ?
                        `<div class="relative w-12 h-12 rounded-md overflow-hidden bg-surface border border-border">
                            <img src="" alt="Preview of ${this.escapeHtml(preview.file.name)}" class="w-full h-full object-cover opacity-50" data-image-preview="true" />
                        </div>` :
                        `<div class="w-12 h-12 rounded-md bg-surface border border-border flex items-center justify-center text-muted group-hover:text-foreground transition-colors">
                            ${this.getHeroiconSvg(fileIconName, 'w-6 h-6')}
                        </div>`
                    }
                </div>

                <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-foreground truncate group-hover:text-brand transition-colors" title="${this.escapeHtml(preview.file.name)}">
                        ${this.escapeHtml(preview.file.name)}
                    </p>
                    <div class="flex items-center space-x-2 text-xs text-muted">
                        <span>${fileSize}</span>
                        ${preview.status !== 'pending' ? `
                            <span class="text-muted/50">•</span>
                            <span class="capitalize ${this.getStatusColor(preview.status)}">
                                ${preview.status}
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>

            <div class="flex items-center space-x-2 flex-shrink-0">
                ${preview.status === 'uploading' ? `
                    <div class="w-4 h-4 animate-spin text-brand">
                        <svg fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ` : ''}

                ${preview.status === 'success' ? `
                    ${this.getHeroiconSvg('heroicon-o-check-circle', 'w-5 h-5 text-success')}
                ` : ''}

                ${preview.status === 'error' ? `
                    ${this.getHeroiconSvg('heroicon-o-exclamation-triangle', 'w-5 h-5 text-danger')}
                ` : ''}

                <button
                    type="button"
                    class="p-2 opacity-60 group-hover:opacity-100 hover:bg-danger/10 text-danger hover:text-danger-hover rounded transition-all duration-200"
                    data-remove-file="${preview.id}"
                    aria-label="Remove ${this.escapeHtml(preview.file.name)}"
                >
                    ${this.getHeroiconSvg('heroicon-o-trash', 'w-4 h-4')}
                </button>
            </div>

            ${preview.status === 'uploading' ? `
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-border rounded-b-lg overflow-hidden">
                    <div
                        class="h-full bg-brand transition-all duration-300 ease-out"
                        style="width: ${preview.progress}%"
                        data-progress-bar="${preview.id}"
                    ></div>
                </div>
            ` : ''}
        `;

        return element;
    }

    /**
     * Gets status indicator for corner badges
     */
    private getStatusIndicator(status: string, size: string = 'md'): string {
        const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
        const bgClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';

        switch (status) {
            case 'success':
                return `<div class="${bgClass} bg-success rounded-full flex items-center justify-center">
                    ${this.getHeroiconSvg('heroicon-o-check', `${size === 'sm' ? 'w-2.5 h-2.5' : 'w-4 h-4'} text-white`)}
                </div>`;
            case 'error':
                return `<div class="${bgClass} bg-danger rounded-full flex items-center justify-center">
                    ${this.getHeroiconSvg('heroicon-o-x-mark', `${size === 'sm' ? 'w-2.5 h-2.5' : 'w-4 h-4'} text-white`)}
                </div>`;
            case 'uploading':
                return `<div class="${bgClass} bg-brand rounded-full flex items-center justify-center">
                    <div class="${size === 'sm' ? 'w-2.5 h-2.5' : 'w-4 h-4'} animate-spin text-white">
                        <svg fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>`;
            default:
                return '';
        }
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private truncateText(text: string, maxLength: number): string {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    private getStatusColor(status: string): string {
        switch (status) {
            case 'success': return 'text-success';
            case 'error': return 'text-danger';
            case 'uploading': return 'text-brand';
            default: return 'text-muted';
        }
    }

    private loadImagePreview(element: HTMLElement, preview: FilePreview): void {
        const img = element.querySelector('[data-image-preview]') as HTMLImageElement;
        if (img && preview.file.type.startsWith('image/')) {
            // Add loading skeleton
            const thumbnail = element.querySelector('.file-preview-thumbnail');
            if (thumbnail) {
                thumbnail.classList.add('skeleton-loader');
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    img.src = e.target.result as string;
                    img.classList.remove('opacity-50');

                    // Remove skeleton loader when image loads
                    img.onload = () => {
                        if (thumbnail) {
                            thumbnail.classList.remove('skeleton-loader');
                        }
                    };

                    preview.preview = e.target.result as string;
                    console.log('FileUploadActions: Image preview loaded for:', preview.id);
                }
            };
            reader.onerror = () => {
                console.error('FileUploadActions: Failed to read image file:', preview.file.name);
                // Remove skeleton loader on error
                if (thumbnail) {
                    thumbnail.classList.remove('skeleton-loader');
                }
                this.announceToScreenReader(`Failed to load preview for ${preview.file.name}`);
            };
            reader.readAsDataURL(preview.file);
        }
    }

    private updatePreviewStatus(element: HTMLElement, status: string): void {
        // Remove existing status classes
        element.classList.remove('upload-success', 'upload-error', 'uploading');

        // Add appropriate status class
        if (status === 'success') {
            element.classList.add('upload-success');
        } else if (status === 'error') {
            element.classList.add('upload-error');
        } else if (status === 'uploading') {
            element.classList.add('uploading');
        }

        // Update data attribute
        element.setAttribute('data-file-status', status);
    }

    /**
     * Updates the preview layout based on file types (grid for images, list for files)
     */
    private updatePreviewLayout(zone: HTMLElement): void {
        const previewContainer = zone.parentElement?.querySelector('[data-preview-list]') as HTMLElement;
        if (!previewContainer) {
            console.warn('FileUploadActions: Preview container not found for layout update');
            return;
        }

        const state = this.getState(zone);
        if (!state) return;

        // Detect if we have images
        const hasImages = state.files.some(file => file.type.startsWith('image/'));
        const imageCount = state.files.filter(file => file.type.startsWith('image/')).length;
        const totalFiles = state.files.length;

        // Determine layout type
        const isImageOnlyUpload = hasImages && imageCount === totalFiles;
        const isMixedUpload = hasImages && imageCount < totalFiles;

        console.log('FileUploadActions: Layout detection - Images:', imageCount, 'Total:', totalFiles, 'Image-only:', isImageOnlyUpload);

        // Update layout classes
        previewContainer.classList.remove('image-grid-layout', 'file-list-layout', 'mixed-layout');

        if (isImageOnlyUpload) {
            // Pure image upload - use grid layout
            previewContainer.classList.add('image-grid-layout');
            previewContainer.setAttribute('data-layout-type', 'image-grid');
        } else if (isMixedUpload) {
            // Mixed files - use enhanced list with larger images
            previewContainer.classList.add('mixed-layout');
            previewContainer.setAttribute('data-layout-type', 'mixed');
        } else {
            // Regular files - use list layout
            previewContainer.classList.add('file-list-layout');
            previewContainer.setAttribute('data-layout-type', 'file-list');
        }

        // Re-render existing previews with new layout
        this.reRenderPreviewsForLayout(previewContainer, state);
    }

    /**
     * Re-renders all previews for the current layout type
     */
    private reRenderPreviewsForLayout(container: HTMLElement, state: FileUploadState): void {
        const layoutType = container.getAttribute('data-layout-type') || 'file-list';

        // Clear existing previews
        container.innerHTML = '';

        // Get all current previews
        const zone = state.fileUploadZone;
        const previews = this.filePreviewsMap.get(zone);
        if (!previews) return;

        // Re-render each preview with the new layout
        previews.forEach(preview => {
            this.renderFilePreviewForLayout(container, preview, layoutType);
        });
    }

    private updateFilePreviewProgress(fileId: string, progress: number, status?: string): void {
        const previewElement = document.querySelector(`[data-file-id="${fileId}"]`) as HTMLElement;
        if (!previewElement) return;

        // Update progress bar
        const progressBar = previewElement.querySelector('[data-progress-bar]') as HTMLElement;
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        // Update status if provided
        if (status) {
            this.updatePreviewStatus(previewElement, status);
        }
    }

    private generateImagePreview(file: File, fileId: string, container: HTMLElement): void {
        // This is now handled by loadImagePreview in the initializePreviewItem method
        // Keep for backward compatibility but functionality moved to template-based approach
        console.log('FileUploadActions: Image preview generation handled by template system');
    }

    private removeFile(zone: HTMLElement, fileId: string): void {
        console.log('FileUploadActions: removeFile called with zone:', zone, 'fileId:', fileId);
        const state = this.getState(zone);
        if (!state) {
            console.warn('FileUploadActions: No state found for zone');
            return;
        }

        console.log('FileUploadActions: Current files before removal:', state.files);

        // Get file name for announcement
        const fileToRemove = state.files.find(file => this.generateFileId(file) === fileId);
        const fileName = fileToRemove?.name || 'File';

        // Remove from state
        state.files = state.files.filter(file => this.generateFileId(file) !== fileId);
        this.setState(zone, state);

        console.log('FileUploadActions: Files after removal:', state.files);

        // Remove preview
        const previews = this.filePreviewsMap.get(zone);
        if (previews) {
            previews.delete(fileId);
            console.log('FileUploadActions: Removed from previews map');
        }

        // Remove from DOM
        const previewElement = zone.parentElement?.querySelector(`[data-file-id="${fileId}"]`);
        console.log('FileUploadActions: Found preview element to remove:', previewElement);
        if (previewElement) {
            DOMUtils.removeElement(previewElement as HTMLElement);
            console.log('FileUploadActions: Removed preview element from DOM');
        }

        // Update Livewire if applicable
        if (state.hasLivewire) {
            this.updateLivewireFiles(zone, state.files);
        }

        // Hide preview area if no files
        if (state.files.length === 0) {
            this.hidePreviewArea(zone);
        }

        // Announce removal to screen readers
        this.announceToScreenReader(`${fileName} removed`);

        // Emit custom event
        EventUtils.dispatchCustomEvent(zone, 'file-upload:file-removed', {
            fileId: fileId,
            fileName: fileName,
            allFiles: state.files
        });
    }

    private uploadFiles(zone: HTMLElement, files: File[]): void {
        const state = this.getState(zone);
        if (!state || state.isUploading) return;

        state.isUploading = true;
        this.setState(zone, state);
        this.setUploadingState(zone, true);

        // Emit upload start event
        EventUtils.dispatchCustomEvent(zone, 'file-upload:upload-start', {
            files: files
        });

        // Here you would implement actual upload logic
        // For now, we'll simulate progress
        this.simulateUpload(zone, files);
    }

    private simulateUpload(zone: HTMLElement, files: File[]): void {
        const progressBar = zone.querySelector('[data-upload-progress]') as HTMLElement;

        // Update individual file previews to uploading status
        const state = this.getState(zone);
        if (state) {
            files.forEach(file => {
                const fileId = this.generateFileId(file);
                this.updateFilePreviewProgress(fileId, 0, 'uploading');
            });
        }

        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                this.completeUpload(zone, files);
            }

            // Update zone-level progress bar
            if (progressBar) {
                const bar = progressBar.querySelector('.progress-bar') as HTMLElement;
                if (bar) {
                    bar.style.width = `${progress}%`;
                }
            }

            // Update individual file progress
            files.forEach(file => {
                const fileId = this.generateFileId(file);
                this.updateFilePreviewProgress(fileId, progress);
            });
        }, 100);
    }

    private completeUpload(zone: HTMLElement, files: File[]): void {
        const state = this.getState(zone);
        if (!state) return;

        state.isUploading = false;
        this.setState(zone, state);
        this.setUploadingState(zone, false);

        // Mark individual files as successful
        files.forEach(file => {
            const fileId = this.generateFileId(file);
            this.updateFilePreviewProgress(fileId, 100, 'success');
        });

        // Announce completion to screen readers
        const fileCount = files.length;
        const message = fileCount === 1
            ? `File ${files[0].name} uploaded successfully`
            : `${fileCount} files uploaded successfully`;
        this.announceToScreenReader(message);

        // Emit upload complete event
        EventUtils.dispatchCustomEvent(zone, 'file-upload:upload-complete', {
            files: files
        });
    }

    // Helper methods
    private findFileInput(zone: HTMLElement): HTMLInputElement | null {
        // The input is a sibling of the zone within the same wrapper
        const wrapper = zone.parentElement;
        if (!wrapper) return null;

        const input = wrapper.querySelector('[data-file-input]') as HTMLInputElement;
        console.log('FileUploadActions: Looking for input in wrapper:', wrapper, 'found:', input);
        return input || null;
    }

    private detectLivewire(input: HTMLElement): boolean {
        return Array.from(input.attributes).some(attr => attr.name.startsWith('wire:'));
    }

    private getLivewireProperty(input: HTMLElement): string | undefined {
        const wireModel = input.getAttribute('wire:model') || input.getAttribute('wire:model.live');
        return wireModel || undefined;
    }

    private parseValidationRules(zone: HTMLElement): FileUploadState['validationRules'] {
        const rulesData = DOMUtils.getDataAttribute(zone, 'validation-rules');
        try {
            return rulesData ? JSON.parse(rulesData) : {};
        } catch {
            return {};
        }
    }

    private updateLivewireFiles(zone: HTMLElement, files: File[]): void {
        const input = this.findFileInput(zone);
        if (!input) return;

        // Create a new FileList-like object
        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        input.files = dataTransfer.files;

        // Trigger change event for Livewire
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    private setDragState(zone: HTMLElement, isDragOver: boolean): void {
        const state = this.getState(zone);
        if (!state) return;

        state.isDragOver = isDragOver;
        this.setState(zone, state);

        DOMUtils.toggleClass(zone, 'drag-over', isDragOver);
    }

    private setUploadingState(zone: HTMLElement, isUploading: boolean): void {
        DOMUtils.toggleClass(zone, 'uploading', isUploading);
    }

    private showPreviewArea(zone: HTMLElement): void {
        const previewArea = zone.parentElement?.querySelector('[data-file-previews]') as HTMLElement;
        if (previewArea) {
            DOMUtils.removeClass(previewArea, 'hidden');

            // Show "Add More Files" button for multiple file mode
            const addMoreBtn = previewArea.querySelector('[data-add-more-files]') as HTMLElement;
            if (addMoreBtn) {
                DOMUtils.removeClass(addMoreBtn, 'hidden');
            }
        }
    }

    private hidePreviewArea(zone: HTMLElement): void {
        const previewArea = zone.parentElement?.querySelector('[data-file-previews]') as HTMLElement;
        if (previewArea) {
            DOMUtils.addClass(previewArea, 'hidden');
        }
    }

    private clearAllPreviews(zone: HTMLElement): void {
        const previewContainer = zone.parentElement?.querySelector('[data-preview-list]') as HTMLElement;
        if (previewContainer) {
            // Remove all preview elements
            const previewItems = previewContainer.querySelectorAll('[data-file-id]');
            previewItems.forEach(item => {
                DOMUtils.removeElement(item as HTMLElement);
            });
        }

        // Clear the previews map for this zone
        this.filePreviewsMap.set(zone, new Map());

        // Reset layout to default
        this.updatePreviewLayout(zone);
    }

    private handleDismissError(button: HTMLElement, event: MouseEvent): void {
        event.stopPropagation();

        const errorContainer = DOMUtils.findClosest(button, '[data-file-upload-errors]');
        if (errorContainer) {
            DOMUtils.addClass(errorContainer, 'hidden');
        }
    }

    private showError(zone: HTMLElement, message: string): void {
        // Show in custom error container
        const errorContainer = zone.parentElement?.querySelector('[data-file-upload-errors]') as HTMLElement;
        if (errorContainer) {
            const messageElement = errorContainer.querySelector('[data-error-message]') as HTMLElement;
            if (messageElement) {
                messageElement.textContent = message;
            }
            DOMUtils.removeClass(errorContainer, 'hidden');

            // Focus the error for screen readers
            errorContainer.focus();
        }

        // Announce error to screen readers
        this.announceToScreenReader(`Error: ${message}`);

        // Also emit custom event for external handling
        EventUtils.dispatchCustomEvent(zone, 'file-upload:error', {
            message: message
        });
    }

    private announceToScreenReader(message: string): void {
        // Check if we have a persistent live region, create if not
        let liveRegion = document.getElementById('file-upload-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'file-upload-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'sr-only';
            document.body.appendChild(liveRegion);
        }

        // Clear any existing timeout
        if ((liveRegion as any).__clearTimeout) {
            clearTimeout((liveRegion as any).__clearTimeout);
        }

        // Set the message
        liveRegion.textContent = message;

        // Clear the message after 5 seconds
        (liveRegion as any).__clearTimeout = setTimeout(() => {
            liveRegion!.textContent = '';
        }, 5000);
    }

    private generateFileId(file: File): string {
        return `${file.name}-${file.size}-${Date.now()}`;
    }

    private getFileTypeIconName(file: File): string {
        const type = file.type.toLowerCase();
        const extension = file.name.split('.').pop()?.toLowerCase();

        // Images
        if (type.startsWith('image/')) {
            return 'heroicon-o-photo';
        }

        // Videos
        if (type.startsWith('video/')) {
            return 'heroicon-o-video-camera';
        }

        // Audio
        if (type.startsWith('audio/')) {
            return 'heroicon-o-musical-note';
        }

        // PDFs
        if (type === 'application/pdf') {
            return 'heroicon-o-document-text';
        }

        // Archives
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '') || type.includes('zip') || type.includes('compressed')) {
            return 'heroicon-o-archive-box';
        }

        // Code files
        if (['js', 'ts', 'html', 'css', 'php', 'py', 'java', 'cpp', 'c', 'json', 'xml'].includes(extension || '') || type.includes('text')) {
            return 'heroicon-o-code-bracket';
        }

        // Presentations
        if (['ppt', 'pptx'].includes(extension || '') || type.includes('presentation')) {
            return 'heroicon-o-presentation-chart-bar';
        }

        // Spreadsheets
        if (['xls', 'xlsx', 'csv'].includes(extension || '') || type.includes('spreadsheet')) {
            return 'heroicon-o-table-cells';
        }

        // Default document icon
        return 'heroicon-o-document';
    }

    private getHeroiconSvg(iconName: string, sizeClasses: string): string {
        const baseClasses = `${sizeClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"`;

        switch (iconName) {
            case 'heroicon-o-photo':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>`;

            case 'heroicon-o-video-camera':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>`;

            case 'heroicon-o-musical-note':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                </svg>`;

            case 'heroicon-o-document-text':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>`;

            case 'heroicon-o-archive-box':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>`;

            case 'heroicon-o-code-bracket':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>`;

            case 'heroicon-o-presentation-chart-bar':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0-1-3m1 3-1-3m-16.5-3h12.75" />
                </svg>`;

            case 'heroicon-o-table-cells':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625a1.125 1.125 0 0 0 1.125-1.125m-1.125 1.125h-1.5A1.125 1.125 0 0 1 18 18.375m3.375 1.125V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75V5.625M3.375 4.5c0-.621.504-1.125 1.125-1.125M4.5 4.5h1.5" />
                </svg>`;

            case 'heroicon-o-x-mark':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12" />
                </svg>`;

            case 'heroicon-o-check':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m4.5 12.75 6 6 9-13.5" />
                </svg>`;

            case 'heroicon-o-check-circle':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>`;

            case 'heroicon-o-exclamation-triangle':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>`;

            case 'heroicon-o-trash':
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>`;

            case 'heroicon-o-document':
            default:
                return `<svg class="${baseClasses}">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>`;
        }
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    public destroy(): void {
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];
        this.filePreviewsMap.clear();
        super.destroy();
    }
}

// Note: Initialization is handled by the main app via initializeKeysUI()
// to prevent double initialization conflicts

export default FileUploadActions;