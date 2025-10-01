/**
 * LightboxActions - Unified image lightbox functionality across Image, Gallery, and File Upload components
 *
 * Features:
 * - Opens images in modal lightbox when thumbnails are clicked
 * - Keyboard navigation support (arrow keys, escape)
 * - Multiple image navigation support
 * - Integrates with existing Modal component system
 * - Mobile-responsive touch gestures
 * - Supports File Upload, Gallery, and standalone Image components
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

interface LightboxState {
    currentImageIndex: number;
    images: LightboxImage[];
    isOpen: boolean;
    elementId: string;
}

interface LightboxImage {
    id: string;
    src: string;
    alt: string;
    fileName: string;
    fileSize: string;
    fileType: string;
}

export class LightboxActions extends BaseActionClass<LightboxState> {
    private cleanupFunctions: (() => void)[] = [];
    private currentModal: HTMLDialogElement | null = null;

    constructor() {
        super();
    }

    protected bindEventListeners(): void {
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-lightbox-trigger]',
                (element, event) => this.handleThumbnailClick(element, event)
            )
        );

        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-lightbox-close]',
                (element, event) => this.handleCloseClick(element, event)
            )
        );

        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-lightbox-prev]',
                (element, event) => this.handlePrevClick(element, event)
            )
        );

        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-lightbox-next]',
                (element, event) => this.handleNextClick(element, event)
            )
        );

        this.cleanupFunctions.push(
            EventUtils.addEventListener(document, 'keydown', (event) => {
                this.handleKeydown(event as KeyboardEvent);
            })
        );

        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-lightbox-modal]',
                (element, event) => this.handleModalBackgroundClick(element, event)
            )
        );

        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-lightbox-trigger]',
                (element, event) => this.handleTriggerClick(element, event)
            )
        );
    }

    protected initializeElements(): void {
        console.log('[Lightbox] Initializing lightbox elements...');

        const fileUploadZones = DOMUtils.findByDataAttribute('file-upload-zone');
        console.log('[Lightbox] Found file upload zones:', fileUploadZones.length);
        fileUploadZones.forEach(zone => {
            const hasLightbox = zone.getAttribute('data-lightbox') === 'true';
            if (hasLightbox) {
                const wrapper = zone.parentElement;
                if (wrapper) {
                    console.log('[Lightbox] Initializing lightbox for upload zone');
                    this.initializeLightboxForUpload(wrapper);
                }
            }
        });

        const lightboxImages = DOMUtils.findByDataAttribute('lightbox-image');
        console.log('[Lightbox] Found standalone images:', lightboxImages.length);
        lightboxImages.forEach(image => {
            console.log('[Lightbox] Initializing lightbox for image:', image);
            this.initializeLightboxForImage(image);
        });

        const galleryContainers = DOMUtils.findByDataAttribute('gallery');
        console.log('[Lightbox] Found gallery containers:', galleryContainers.length);
        galleryContainers.forEach(gallery => {
            const hasLightbox = gallery.getAttribute('data-lightbox') === 'true';
            console.log('[Lightbox] Gallery has lightbox enabled:', hasLightbox, gallery);
            if (hasLightbox) {
                console.log('[Lightbox] Initializing lightbox for gallery');
                this.initializeLightboxForGallery(gallery);
            }
        });

        console.log('[Lightbox] Initialization complete');
    }

    private initializeLightboxForUpload(uploadElement: HTMLElement): void {
        const elementId = uploadElement.getAttribute('data-file-upload-id') ||
                         uploadElement.id ||
                         'upload-' + Date.now();

        this.setState(uploadElement, {
            currentImageIndex: 0,
            images: [],
            isOpen: false,
            elementId: elementId
        });
    }

    private initializeLightboxForImage(imageElement: HTMLElement): void {
        const imageId = imageElement.id || 'image-' + Date.now();
        const imageContainer = imageElement.closest('[data-lightbox-container]') || imageElement;

        const img = imageElement.querySelector('img') || imageElement as HTMLImageElement;
        if (img && img.tagName === 'IMG') {
            const lightboxImage = this.extractImageData(img, imageId);

            this.setState(imageContainer as HTMLElement, {
                currentImageIndex: 0,
                images: [lightboxImage],
                isOpen: false,
                elementId: imageId
            });
        }
    }

    private initializeLightboxForGallery(galleryElement: HTMLElement): void {
        const galleryId = galleryElement.getAttribute('data-gallery-id') ||
                         galleryElement.id ||
                         'gallery-' + Date.now();

        const images: LightboxImage[] = [];
        const galleryImages = galleryElement.querySelectorAll('[data-gallery-image]');

        galleryImages.forEach((imageElement, index) => {
            const img = imageElement.querySelector('img') || imageElement as HTMLImageElement;
            if (img && img.tagName === 'IMG') {
                images.push(this.extractImageData(img, `${galleryId}-${index}`, index));
            }
        });

        this.setState(galleryElement, {
            currentImageIndex: 0,
            images: images,
            isOpen: false,
            elementId: galleryId
        });
    }

    private getFilenameFromSrc(src: string): string {
        try {
            const url = new URL(src);
            const pathname = url.pathname;
            return pathname.split('/').pop() || 'image';
        } catch {
            return src.split('/').pop() || 'image';
        }
    }

    /**
     * Extract image data from HTML image element for lightbox display
     *
     * Reads image source, alt text, and metadata attributes to build LightboxImage object.
     * Falls back to extracting filename from src URL if data-filename not provided.
     *
     * @param img - The HTML image element to extract data from
     * @param id - Unique identifier for this image in the lightbox
     * @param index - Optional index for auto-generating alt text
     * @returns LightboxImage object with all metadata for display
     */
    private extractImageData(img: HTMLImageElement, id: string, index?: number): LightboxImage {
        return {
            id: id,
            src: img.src,
            alt: img.alt || (index !== undefined ? `Gallery image ${index + 1}` : 'Image'),
            fileName: img.getAttribute('data-filename') || this.getFilenameFromSrc(img.src),
            fileSize: img.getAttribute('data-filesize') || 'Unknown size',
            fileType: img.getAttribute('data-filetype') || 'image'
        };
    }

    /**
     * Handle click on lightbox trigger element (image preview)
     */
    private handleTriggerClick(trigger: HTMLElement, event: MouseEvent): void {
        console.log('[Lightbox] Trigger clicked:', trigger);
        event.preventDefault();
        event.stopPropagation();

        const container = trigger.closest('.file-upload-wrapper') ||
                         trigger.closest('[data-gallery]') ||
                         trigger.closest('[data-lightbox-container]') ||
                         trigger.closest('[data-keys-file-upload]');

        if (!container) {
            console.warn('[Lightbox] No container found for trigger:', trigger);
            return;
        }

        console.log('[Lightbox] Found container:', container);

        const state = this.getState(container as HTMLElement);
        if (!state) {
            console.warn('[Lightbox] No state found for container');
            return;
        }

        console.log('[Lightbox] State:', state);

        const imageId = trigger.getAttribute('data-lightbox-trigger');
        if (!imageId) {
            console.warn('[Lightbox] No image ID on trigger');
            return;
        }

        const imageIndex = state.images.findIndex(img => img.id === imageId);
        if (imageIndex === -1) {
            console.warn('[Lightbox] Image not found in state:', imageId);
            return;
        }

        console.log('[Lightbox] Opening lightbox at index:', imageIndex);

        this.openLightbox(container as HTMLElement, imageIndex);
    }

    private handleThumbnailClick(thumbnail: HTMLElement, event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        const lightboxContainer = this.findLightboxContainer(thumbnail);
        if (!lightboxContainer) {
            return;
        }

        const state = this.getState(lightboxContainer);
        if (!state) {
            return;
        }

        let imageIndex = 0;

        const fileId = thumbnail.getAttribute('data-lightbox-trigger');
        if (fileId) {
            imageIndex = state.images.findIndex(img => img.id === fileId);
        }

        const galleryImageIndex = thumbnail.getAttribute('data-gallery-image');
        if (galleryImageIndex !== null) {
            imageIndex = parseInt(galleryImageIndex, 10);
        }

        if (thumbnail.hasAttribute('data-lightbox-image')) {
            imageIndex = 0;
        }

        if (imageIndex === -1 || imageIndex >= state.images.length) {
            return;
        }

        this.openLightbox(lightboxContainer, imageIndex);
    }

    private handleCloseClick(element: HTMLElement, event: MouseEvent): void {
        event.preventDefault();
        this.closeLightbox();
    }

    private handlePrevClick(element: HTMLElement, event: MouseEvent): void {
        event.preventDefault();
        this.navigateToPrevious();
    }

    private handleNextClick(element: HTMLElement, event: MouseEvent): void {
        event.preventDefault();
        this.navigateToNext();
    }

    private handleKeydown(event: KeyboardEvent): void {
        if (!this.currentModal || !this.currentModal.open) {
            return;
        }

        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.navigateToPrevious();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.navigateToNext();
                break;
        }
    }

    private handleModalBackgroundClick(modal: HTMLElement, event: MouseEvent): void {
        if (event.target === modal) {
            this.closeLightbox();
        }
    }

    private openLightbox(containerElement: HTMLElement, imageIndex: number): void {
        const state = this.getState(containerElement);
        if (!state || !state.images.length) {
            return;
        }

        state.currentImageIndex = imageIndex;
        state.isOpen = true;
        this.setState(containerElement, state);

        const modal = this.getOrCreateLightboxModal(containerElement);
        this.currentModal = modal;

        this.updateModalContent(modal, state);

        modal.showModal();

        EventUtils.dispatchCustomEvent(containerElement, 'lightbox:open', {
            imageIndex: imageIndex,
            image: state.images[imageIndex]
        });
    }

    private closeLightbox(): void {
        if (!this.currentModal) {
            return;
        }

        const containerElement = this.findContainerElementFromModal(this.currentModal);

        if (containerElement) {
            const state = this.getState(containerElement);
            if (state) {
                state.isOpen = false;
                this.setState(containerElement, state);
            }

            EventUtils.dispatchCustomEvent(containerElement, 'lightbox:close', {});
        }

        this.currentModal.close();
        this.currentModal = null;
    }

    private navigateToPrevious(): void {
        if (!this.currentModal) return;

        const containerElement = this.findContainerElementFromModal(this.currentModal);
        if (!containerElement) return;

        const state = this.getState(containerElement);
        if (!state || !state.images.length) return;

        const newIndex = state.currentImageIndex > 0 ?
                        state.currentImageIndex - 1 :
                        state.images.length - 1;

        state.currentImageIndex = newIndex;
        this.setState(containerElement, state);

        this.updateModalContent(this.currentModal, state);

        EventUtils.dispatchCustomEvent(containerElement, 'lightbox:navigate', {
            direction: 'previous',
            imageIndex: newIndex,
            image: state.images[newIndex]
        });
    }

    private navigateToNext(): void {
        if (!this.currentModal) return;

        const containerElement = this.findContainerElementFromModal(this.currentModal);
        if (!containerElement) return;

        const state = this.getState(containerElement);
        if (!state || !state.images.length) return;

        const newIndex = state.currentImageIndex < state.images.length - 1 ?
                        state.currentImageIndex + 1 :
                        0;

        state.currentImageIndex = newIndex;
        this.setState(containerElement, state);

        this.updateModalContent(this.currentModal, state);

        EventUtils.dispatchCustomEvent(containerElement, 'lightbox:navigate', {
            direction: 'next',
            imageIndex: newIndex,
            image: state.images[newIndex]
        });
    }

    private getOrCreateLightboxModal(element: HTMLElement): HTMLDialogElement {
        const elementId = this.getElementId(element);
        const modalId = elementId + '-lightbox-modal';
        let modal = document.getElementById(modalId) as HTMLDialogElement;

        if (!modal) {
            modal = this.createLightboxModal(modalId);
            document.body.appendChild(modal);
        }

        return modal;
    }

    private getElementId(element: HTMLElement): string {
        const fileUploadId = element.getAttribute('data-file-upload-id');
        if (fileUploadId) {
            return fileUploadId;
        }

        const galleryId = element.getAttribute('data-gallery-id');
        if (galleryId) {
            return galleryId;
        }

        return element.id || 'lightbox-' + Date.now();
    }

    private createLightboxModal(modalId: string): HTMLDialogElement {
        const modal = DOMUtils.createElement('dialog', {
            attributes: {
                id: modalId,
                'data-lightbox-modal': 'true',
                'data-modal': 'true',
                class: 'lightbox-modal p-0 m-0 w-full h-full max-w-none max-h-none bg-black/90 backdrop:bg-black/50'
            }
        }) as HTMLDialogElement;

        modal.innerHTML = `
            <div class="lightbox-content relative w-full h-full flex items-center justify-center p-8">
                <!-- Close button -->
                <button
                    type="button"
                    class="lightbox-close absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 flex items-center justify-center"
                    data-lightbox-close="true"
                    aria-label="Close lightbox"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <!-- Previous button -->
                <button
                    type="button"
                    class="lightbox-nav lightbox-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 flex items-center justify-center"
                    data-lightbox-prev="true"
                    aria-label="Previous image"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>

                <!-- Next button -->
                <button
                    type="button"
                    class="lightbox-nav lightbox-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 flex items-center justify-center"
                    data-lightbox-next="true"
                    aria-label="Next image"
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>

                <!-- Image container -->
                <div class="lightbox-image-container flex-1 flex items-center justify-center">
                    <img
                        class="lightbox-image max-w-full max-h-full object-contain"
                        src=""
                        alt=""
                        data-lightbox-image="true"
                    />
                </div>

                <!-- Image info -->
                <div class="lightbox-info absolute bottom-4 left-4 right-4 z-20 bg-black/70 text-white p-4 rounded-lg">
                    <h3 class="lightbox-title text-lg font-semibold mb-1" data-lightbox-title="true"></h3>
                    <div class="lightbox-meta text-sm text-white/80 flex items-center gap-4">
                        <span data-lightbox-size="true"></span>
                        <span data-lightbox-counter="true"></span>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    private updateModalContent(modal: HTMLDialogElement, state: LightboxState): void {
        const currentImage = state.images[state.currentImageIndex];
        if (!currentImage) return;

        const img = modal.querySelector('[data-lightbox-image]') as HTMLImageElement;
        if (img) {
            img.src = currentImage.src;
            img.alt = currentImage.alt;
        }

        const title = modal.querySelector('[data-lightbox-title]');
        if (title) {
            title.textContent = currentImage.fileName;
        }

        const size = modal.querySelector('[data-lightbox-size]');
        if (size) {
            size.textContent = currentImage.fileSize;
        }

        const counter = modal.querySelector('[data-lightbox-counter]');
        if (counter) {
            counter.textContent = `${state.currentImageIndex + 1} of ${state.images.length}`;
        }

        const prevBtn = modal.querySelector('[data-lightbox-prev]') as HTMLElement;
        const nextBtn = modal.querySelector('[data-lightbox-next]') as HTMLElement;

        if (prevBtn && nextBtn) {
            const showNav = state.images.length > 1;
            prevBtn.style.display = showNav ? 'flex' : 'none';
            nextBtn.style.display = showNav ? 'flex' : 'none';
        }
    }

    private findLightboxContainer(trigger: HTMLElement): HTMLElement | null {
        const uploadElement = DOMUtils.findClosest(trigger, '[data-file-upload-id]');
        if (uploadElement) {
            return uploadElement;
        }

        const galleryElement = DOMUtils.findClosest(trigger, '[data-gallery]');
        if (galleryElement) {
            return galleryElement;
        }

        const imageContainer = DOMUtils.findClosest(trigger, '[data-lightbox-container]');
        if (imageContainer) {
            return imageContainer;
        }

        if (trigger.hasAttribute('data-lightbox-image')) {
            return trigger;
        }

        return null;
    }

    private findContainerElementFromModal(modal: HTMLElement): HTMLElement | null {
        const modalId = modal.id;
        const elementId = modalId.replace('-lightbox-modal', '');

        let element = document.querySelector(`[data-file-upload-id="${elementId}"]`);
        if (element) {
            return element as HTMLElement;
        }

        element = document.querySelector(`[data-gallery-id="${elementId}"]`);
        if (element) {
            return element as HTMLElement;
        }

        element = document.getElementById(elementId);
        if (element) {
            return element as HTMLElement;
        }

        return null;
    }

    public addImage(element: HTMLElement, image: LightboxImage): void {
        const state = this.getState(element);
        if (!state) return;

        state.images.push(image);
        this.setState(element, state);
    }

    public addImages(element: HTMLElement, images: LightboxImage[]): void {
        const state = this.getState(element);
        if (!state) return;

        state.images.push(...images);
        this.setState(element, state);
    }

    public setImages(element: HTMLElement, images: LightboxImage[]): void {
        const state = this.getState(element);
        if (!state) return;

        state.images = images;
        this.setState(element, state);
    }

    public removeImage(containerElement: HTMLElement, imageId: string): void {
        const state = this.getState(containerElement);
        if (!state) return;

        const imageIndex = state.images.findIndex(img => img.id === imageId);
        if (imageIndex === -1) return;

        state.images.splice(imageIndex, 1);

        if (state.currentImageIndex >= state.images.length) {
            state.currentImageIndex = Math.max(0, state.images.length - 1);
        }

        this.setState(containerElement, state);

        if (state.images.length === 0 && state.isOpen) {
            this.closeLightbox();
        }
    }

    public destroy(): void {
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];

        if (this.currentModal) {
            this.currentModal.close();
            this.currentModal = null;
        }

        super.destroy();
    }
}

export default LightboxActions;