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
        // Handle image thumbnail clicks
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-lightbox-trigger]',
                (element, event) => this.handleThumbnailClick(element, event)
            )
        );

        // Handle lightbox modal events
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-lightbox-close]',
                (element, event) => this.handleCloseClick(element, event)
            )
        );

        // Handle navigation buttons
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

        // Handle keyboard navigation
        this.cleanupFunctions.push(
            EventUtils.addEventListener(document, 'keydown', (event) => {
                this.handleKeydown(event as KeyboardEvent);
            })
        );

        // Handle modal background click
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-lightbox-modal]',
                (element, event) => this.handleModalBackgroundClick(element, event)
            )
        );
    }

    protected initializeElements(): void {
        // Find all file upload zones with lightbox enabled
        const fileUploadZones = DOMUtils.findByDataAttribute('file-upload-zone');
        fileUploadZones.forEach(zone => {
            const hasLightbox = zone.getAttribute('data-lightbox') === 'true';
            if (hasLightbox) {
                // Find the wrapper element for this zone
                const wrapper = zone.parentElement;
                if (wrapper) {
                    this.initializeLightboxForUpload(wrapper);
                }
            }
        });

        // Find all standalone images with lightbox enabled
        const lightboxImages = DOMUtils.findByDataAttribute('lightbox-image');
        lightboxImages.forEach(image => {
            this.initializeLightboxForImage(image);
        });

        // Find all gallery containers with lightbox enabled
        const galleryContainers = DOMUtils.findByDataAttribute('gallery');
        galleryContainers.forEach(gallery => {
            const hasLightbox = gallery.getAttribute('data-lightbox') === 'true';
            if (hasLightbox) {
                this.initializeLightboxForGallery(gallery);
            }
        });
    }

    private initializeLightboxForUpload(uploadElement: HTMLElement): void {
        const elementId = uploadElement.getAttribute('data-file-upload-id') ||
                         uploadElement.id ||
                         'upload-' + Date.now();

        // Initialize empty state
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

        // Get image data
        const img = imageElement.querySelector('img') || imageElement as HTMLImageElement;
        if (img && img.tagName === 'IMG') {
            const lightboxImage = this.extractImageData(img, imageId);

            // Initialize state with the single image
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

        // Extract images from gallery
        const images: LightboxImage[] = [];
        const galleryImages = galleryElement.querySelectorAll('[data-gallery-image]');

        galleryImages.forEach((imageElement, index) => {
            const img = imageElement.querySelector('img') || imageElement as HTMLImageElement;
            if (img && img.tagName === 'IMG') {
                images.push(this.extractImageData(img, `${galleryId}-${index}`, index));
            }
        });

        // Initialize state with gallery images
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

    private handleThumbnailClick(thumbnail: HTMLElement, event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();

        // Handle different types of lightbox triggers
        const lightboxContainer = this.findLightboxContainer(thumbnail);
        if (!lightboxContainer) {
            return;
        }

        const state = this.getState(lightboxContainer);
        if (!state) {
            return;
        }

        // Determine image index
        let imageIndex = 0;

        // For file upload triggers
        const fileId = thumbnail.getAttribute('data-lightbox-trigger');
        if (fileId) {
            imageIndex = state.images.findIndex(img => img.id === fileId);
        }

        // For gallery triggers
        const galleryImageIndex = thumbnail.getAttribute('data-gallery-image');
        if (galleryImageIndex !== null) {
            imageIndex = parseInt(galleryImageIndex, 10);
        }

        // For standalone image triggers
        if (thumbnail.hasAttribute('data-lightbox-image')) {
            imageIndex = 0; // Single image always at index 0
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

        // Update state
        state.currentImageIndex = imageIndex;
        state.isOpen = true;
        this.setState(containerElement, state);

        // Create or get modal
        const modal = this.getOrCreateLightboxModal(containerElement);
        this.currentModal = modal;

        // Update modal content
        this.updateModalContent(modal, state);

        // Show modal
        modal.showModal();

        // Emit event
        EventUtils.dispatchCustomEvent(containerElement, 'lightbox:open', {
            imageIndex: imageIndex,
            image: state.images[imageIndex]
        });
    }

    private closeLightbox(): void {
        if (!this.currentModal) {
            return;
        }

        // Find the container element that owns this modal
        const containerElement = this.findContainerElementFromModal(this.currentModal);

        if (containerElement) {
            const state = this.getState(containerElement);
            if (state) {
                state.isOpen = false;
                this.setState(containerElement, state);
            }

            // Emit event
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

        // Emit event
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

        // Emit event
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
        // For file uploads
        const fileUploadId = element.getAttribute('data-file-upload-id');
        if (fileUploadId) {
            return fileUploadId;
        }

        // For galleries
        const galleryId = element.getAttribute('data-gallery-id');
        if (galleryId) {
            return galleryId;
        }

        // Fallback to element ID
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

        // Update image
        const img = modal.querySelector('[data-lightbox-image]') as HTMLImageElement;
        if (img) {
            img.src = currentImage.src;
            img.alt = currentImage.alt;
        }

        // Update title
        const title = modal.querySelector('[data-lightbox-title]');
        if (title) {
            title.textContent = currentImage.fileName;
        }

        // Update size
        const size = modal.querySelector('[data-lightbox-size]');
        if (size) {
            size.textContent = currentImage.fileSize;
        }

        // Update counter
        const counter = modal.querySelector('[data-lightbox-counter]');
        if (counter) {
            counter.textContent = `${state.currentImageIndex + 1} of ${state.images.length}`;
        }

        // Update navigation visibility
        const prevBtn = modal.querySelector('[data-lightbox-prev]') as HTMLElement;
        const nextBtn = modal.querySelector('[data-lightbox-next]') as HTMLElement;

        if (prevBtn && nextBtn) {
            const showNav = state.images.length > 1;
            prevBtn.style.display = showNav ? 'flex' : 'none';
            nextBtn.style.display = showNav ? 'flex' : 'none';
        }
    }

    private findLightboxContainer(trigger: HTMLElement): HTMLElement | null {
        // For file uploads
        const uploadElement = DOMUtils.findClosest(trigger, '[data-file-upload-id]');
        if (uploadElement) {
            return uploadElement;
        }

        // For galleries
        const galleryElement = DOMUtils.findClosest(trigger, '[data-gallery]');
        if (galleryElement) {
            return galleryElement;
        }

        // For standalone images
        const imageContainer = DOMUtils.findClosest(trigger, '[data-lightbox-container]');
        if (imageContainer) {
            return imageContainer;
        }

        // For images that are themselves the trigger
        if (trigger.hasAttribute('data-lightbox-image')) {
            return trigger;
        }

        return null;
    }

    private findContainerElementFromModal(modal: HTMLElement): HTMLElement | null {
        const modalId = modal.id;
        const elementId = modalId.replace('-lightbox-modal', '');

        // Try to find file upload element first
        let element = document.querySelector(`[data-file-upload-id="${elementId}"]`);
        if (element) {
            return element as HTMLElement;
        }

        // Try to find gallery element
        element = document.querySelector(`[data-gallery-id="${elementId}"]`);
        if (element) {
            return element as HTMLElement;
        }

        // Fallback to element ID
        element = document.getElementById(elementId);
        if (element) {
            return element as HTMLElement;
        }

        return null;
    }

    // Public method to add an image to the lightbox
    public addImage(element: HTMLElement, image: LightboxImage): void {
        const state = this.getState(element);
        if (!state) return;

        state.images.push(image);
        this.setState(element, state);
    }

    // Public method to add multiple images (for galleries)
    public addImages(element: HTMLElement, images: LightboxImage[]): void {
        const state = this.getState(element);
        if (!state) return;

        state.images.push(...images);
        this.setState(element, state);
    }

    // Public method to set images (replace all)
    public setImages(element: HTMLElement, images: LightboxImage[]): void {
        const state = this.getState(element);
        if (!state) return;

        state.images = images;
        this.setState(element, state);
    }

    // Public method to remove an image from the lightbox
    public removeImage(containerElement: HTMLElement, imageId: string): void {
        const state = this.getState(containerElement);
        if (!state) return;

        const imageIndex = state.images.findIndex(img => img.id === imageId);
        if (imageIndex === -1) return;

        state.images.splice(imageIndex, 1);

        // Adjust current index if necessary
        if (state.currentImageIndex >= state.images.length) {
            state.currentImageIndex = Math.max(0, state.images.length - 1);
        }

        this.setState(containerElement, state);

        // Close lightbox if no images left and it's open
        if (state.images.length === 0 && state.isOpen) {
            this.closeLightbox();
        }
    }

    public destroy(): void {
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];

        // Close any open modals
        if (this.currentModal) {
            this.currentModal.close();
            this.currentModal = null;
        }

        super.destroy();
    }
}

export default LightboxActions;