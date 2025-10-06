/**
 * GalleryActions - Handles interactive functionality for Gallery components
 *
 * Provides functionality for:
 * - Image navigation (prev/next, thumbnails)
 * - Autoplay with controls
 * - Keyboard navigation (arrow keys, escape)
 * - Touch/swipe gestures
 * - Thumbnail highlighting
 * - Lightbox integration
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import LightboxActions from './LightboxActions';

interface GalleryImage {
    id: string;
    src: string;
    alt: string;
    caption?: string | null;
    thumbnail: string;
    title?: string | null;
    description?: string | null;
}

interface GalleryState {
    currentIndex: number;
    isAutoplayActive: boolean;
    autoplayInterval: number | null;
    touchStartX: number;
    touchStartY?: number;
    touchEndX: number;
    isDragging: boolean;
    totalImages: number;
    images: GalleryImage[];
}

export class GalleryActions extends BaseActionClass<GalleryState> {
    private lightboxActions: LightboxActions;

    constructor() {
        super();
        this.lightboxActions = LightboxActions.getInstance();
        this.init();
    }

    /**
     * Initialize gallery elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.findByDataAttribute('gallery', 'true').forEach(gallery => {
            this.initializeGallery(gallery);
        });
    }

    /**
     * Bind event listeners - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        EventUtils.handleDelegatedKeydown('[data-gallery="true"]', (element, event) => {
            const galleryId = element.dataset.galleryId;
            if (galleryId) {
                this.handleKeyboardNavigation(event, galleryId, element);
            }
        });
    }

    /**
     * Extract image data from gallery DOM elements
     *
     * Scans all gallery slides and extracts image metadata for state management.
     * Looks for data attributes (caption, title, description) on img elements.
     *
     * @param galleryElement - The gallery container element
     * @returns Array of GalleryImage objects with extracted metadata
     */
    private extractImageData(galleryElement: HTMLElement): GalleryImage[] {
        const images: GalleryImage[] = [];
        const slideElements = galleryElement.querySelectorAll('[data-gallery-slide]');

        slideElements.forEach((slide, index) => {
            const imgElement = slide.querySelector('img');
            if (imgElement) {
                images.push({
                    id: slide.getAttribute('data-gallery-slide') || `img-${index}`,
                    src: imgElement.src,
                    alt: imgElement.alt || `Image ${index + 1}`,
                    caption: imgElement.getAttribute('data-caption'),
                    thumbnail: imgElement.src,
                    title: imgElement.getAttribute('data-title'),
                    description: imgElement.getAttribute('data-description')
                });
            }
        });

        return images;
    }

    /**
     * Initialize a single gallery element
     */
    private initializeGallery(galleryElement: HTMLElement): void {
        const galleryId = galleryElement.dataset.galleryId;
        if (!galleryId) return;

        const totalImages = parseInt(galleryElement.dataset.totalImages || '0');
        const images = this.extractImageData(galleryElement);

        this.setState(galleryElement, {
            currentIndex: 0,
            isAutoplayActive: galleryElement.dataset.autoplay === 'true',
            autoplayInterval: null,
            touchStartX: 0,
            touchEndX: 0,
            isDragging: false,
            totalImages,
            images
        });

        this.setupGalleryEventListeners(galleryElement, galleryId);

        if (galleryElement.dataset.autoplay === 'true') {
            this.startAutoplay(galleryId, galleryElement);
        }

        this.updateAccessibility(galleryElement, galleryId);

        this.initializeImageErrorHandling(galleryElement);

        this.preloadAdjacentImages(galleryElement, 0);
    }

    /**
     * Set up event listeners for gallery interactions
     */
    private setupGalleryEventListeners(galleryElement: HTMLElement, galleryId: string): void {
        const prevButton = galleryElement.querySelector('[data-gallery-action="prev"]') as HTMLElement;
        const nextButton = galleryElement.querySelector('[data-gallery-action="next"]') as HTMLElement;

        if (prevButton) {
            EventUtils.addEventListener(prevButton, 'click', () => {
                this.navigateToImage(galleryId, galleryElement, 'prev');
            });
        }

        if (nextButton) {
            EventUtils.addEventListener(nextButton, 'click', () => {
                this.navigateToImage(galleryId, galleryElement, 'next');
            });
        }

        const thumbnails = galleryElement.querySelectorAll('[data-gallery-thumbnail]');
        thumbnails.forEach((thumbnail, index) => {
            EventUtils.addEventListener(thumbnail as HTMLElement, 'click', () => {
                this.goToImage(galleryId, galleryElement, index);
            });

            EventUtils.addEventListener(thumbnail as HTMLElement, 'keydown', (e: Event) => {
                const keyboardEvent = e as KeyboardEvent;
                if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                    keyboardEvent.preventDefault();
                    this.goToImage(galleryId, galleryElement, index);
                }
            });
        });

        const autoplayToggle = galleryElement.querySelector('[data-gallery-action="toggle-autoplay"]') as HTMLElement;
        if (autoplayToggle) {
            EventUtils.addEventListener(autoplayToggle, 'click', () => {
                this.toggleAutoplay(galleryId, galleryElement);
            });
        }

        this.setupTouchEvents(galleryElement, galleryId);

        EventUtils.addEventListener(galleryElement, 'mouseenter', () => {
            this.pauseAutoplayOnHover(galleryId);
        });

        EventUtils.addEventListener(galleryElement, 'mouseleave', () => {
            this.resumeAutoplayOnHover(galleryId, galleryElement);
        });
    }

    /**
     * Set up touch/swipe event listeners (simplified for scroll-based navigation)
     */
    private setupTouchEvents(galleryElement: HTMLElement, galleryId: string): void {
        const scrollContainer = galleryElement.querySelector('.gallery-scroll-container') as HTMLElement;
        if (!scrollContainer) return;

        EventUtils.addEventListener(scrollContainer, 'scroll', () => {
            this.updateCurrentIndexFromScroll(galleryElement, scrollContainer);
        });

        EventUtils.addEventListener(scrollContainer, 'touchstart', (e: Event) => {
            const touchEvent = e as TouchEvent;
            const state = this.getState(galleryElement);
            if (!state) return;

            state.touchStartX = touchEvent.touches[0].clientX;
            this.setState(galleryElement, state);
        });

        EventUtils.addEventListener(scrollContainer, 'touchmove', (e: Event) => {
            const touchEvent = e as TouchEvent;
            const state = this.getState(galleryElement);
            if (!state || !touchEvent.touches[0]) return;

            const currentX = touchEvent.touches[0].clientX;
            const currentY = touchEvent.touches[0].clientY;

            if (!state.touchStartY) {
                state.touchStartY = currentY;
            }

            const horizontalDiff = Math.abs(currentX - state.touchStartX);
            const verticalDiff = Math.abs(currentY - state.touchStartY);
            const threshold = 10;

            if (horizontalDiff > threshold && horizontalDiff > verticalDiff) {
                e.preventDefault();
            }

            this.setState(galleryElement, state);
        });
    }

    /**
     * Update current index based on scroll position
     *
     * Calculates which slide is closest to the center of the viewport during scroll.
     * Updates gallery state and UI elements (thumbnails, counter) when the centered slide changes.
     * Used for scroll-snap navigation to keep UI in sync with scroll position.
     *
     * @param galleryElement - The gallery container element
     * @param scrollContainer - The scrollable container with gallery slides
     */
    private updateCurrentIndexFromScroll(galleryElement: HTMLElement, scrollContainer: HTMLElement): void {
        const slides = scrollContainer.querySelectorAll('.gallery-slide');
        if (slides.length === 0) return;

        const containerRect = scrollContainer.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        slides.forEach((slide, index) => {
            const slideRect = slide.getBoundingClientRect();
            const slideCenter = slideRect.left + slideRect.width / 2;
            const distance = Math.abs(slideCenter - containerCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        const state = this.getState(galleryElement);
        if (state && state.currentIndex !== closestIndex) {
            state.currentIndex = closestIndex;
            this.setState(galleryElement, state);
            this.updateThumbnails(galleryElement, closestIndex);
            this.updateCounter(galleryElement, closestIndex);
        }
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeyboardNavigation(e: KeyboardEvent, galleryId: string, galleryElement: HTMLElement): void {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.navigateToImage(galleryId, galleryElement, 'prev');
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.navigateToImage(galleryId, galleryElement, 'next');
                break;
            case 'Home':
                e.preventDefault();
                this.goToImage(galleryId, galleryElement, 0);
                break;
            case 'End':
                e.preventDefault();
                const state = this.getState(galleryElement);
                if (state) {
                    this.goToImage(galleryId, galleryElement, state.totalImages - 1);
                }
                break;
            case 'Escape':
                e.preventDefault();
                this.handleEscapeKey(galleryId, galleryElement);
                break;
            case ' ':
            case 'Spacebar':
                e.preventDefault();
                this.toggleAutoplay(galleryId, galleryElement);
                break;
            case 'Enter':
                const target = e.target as HTMLElement;
                if (target.hasAttribute('data-gallery-thumbnail')) {
                    e.preventDefault();
                    const thumbnailIndex = parseInt(target.getAttribute('data-gallery-thumbnail') || '0');
                    this.goToImage(galleryId, galleryElement, thumbnailIndex);
                }
                break;
        }
    }

    /**
     * Handle escape key with proper lightbox and autoplay logic
     */
    private handleEscapeKey(galleryId: string, galleryElement: HTMLElement): void {
        const isLightboxEnabled = galleryElement.dataset.lightbox === 'true';
        const state = this.getState(galleryElement);

        if (isLightboxEnabled) {
            this.closeLightbox(galleryElement);
        } else if (state?.isAutoplayActive) {
            this.pauseAutoplay(galleryId, galleryElement);
        }

        this.announceAction(galleryElement, 'Gallery navigation closed');
    }

    /**
     * Close lightbox using the unified LightboxActions
     */
    private closeLightbox(galleryElement: HTMLElement): void {
        const state = this.lightboxActions.getState(galleryElement);
        if (state && state.isOpen) {
            this.emitGalleryEvent(galleryElement, 'gallery:lightboxClose', {});
            this.announceAction(galleryElement, 'Lightbox closed');
        }
    }

    /**
     * Announce actions to screen readers
     */
    private announceAction(galleryElement: HTMLElement, message: string): void {
        const liveRegion = galleryElement.querySelector('[data-gallery-live]') as HTMLElement;
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                if (liveRegion.textContent === message) {
                    liveRegion.textContent = '';
                }
            }, 1000);
        }
    }

    /**
     * Navigate to previous or next image
     */
    private navigateToImage(galleryId: string, galleryElement: HTMLElement, direction: 'prev' | 'next'): void {
        const state = this.getState(galleryElement);
        if (!state) return;

        const totalImages = parseInt(galleryElement.dataset.totalImages || '0');
        const isLoop = galleryElement.dataset.loop === 'true';

        let newIndex = state.currentIndex;

        if (direction === 'next') {
            newIndex = state.currentIndex + 1;
            if (newIndex >= totalImages) {
                newIndex = isLoop ? 0 : totalImages - 1;
            }
        } else {
            newIndex = state.currentIndex - 1;
            if (newIndex < 0) {
                newIndex = isLoop ? totalImages - 1 : 0;
            }
        }

        this.goToImage(galleryId, galleryElement, newIndex);
    }

    /**
     * Go to a specific image by index
     */
    private goToImage(galleryId: string, galleryElement: HTMLElement, index: number): void {
        const state = this.getState(galleryElement);
        if (!state) return;

        const totalImages = parseInt(galleryElement.dataset.totalImages || '0');
        if (index < 0 || index >= totalImages) return;

        state.currentIndex = index;
        this.setState(galleryElement, state);

        this.updateImageDisplay(galleryElement, index);
        this.updateThumbnails(galleryElement, index);
        this.updateCounter(galleryElement, index);
        this.updateImageDetails(galleryElement, index);
        this.updateNavigationButtons(galleryElement, index, totalImages);
        this.updateAccessibility(galleryElement, galleryId);
        this.announceImageChange(galleryElement, index, totalImages);
        this.preloadAdjacentImages(galleryElement, index);

        this.emitGalleryEvent(galleryElement, 'gallery:imageChanged', {
            currentIndex: index,
            galleryId: galleryId
        });
    }

    /**
     * Update image display using container-only scrolling (no page scroll hijacking)
     */
    private updateImageDisplay(galleryElement: HTMLElement, index: number): void {
        const scrollContainer = galleryElement.querySelector('.gallery-scroll-container') as HTMLElement;
        if (!scrollContainer) return;

        const slideWidth = scrollContainer.offsetWidth;
        const targetScrollLeft = slideWidth * index;

        scrollContainer.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });

        const slides = scrollContainer.querySelectorAll('.gallery-slide');
        slides.forEach((slide, i) => {
            const slideElement = slide as HTMLElement;
            if (i === index) {
                slideElement.classList.add('active');
                slideElement.setAttribute('aria-current', 'true');
            } else {
                slideElement.classList.remove('active');
                slideElement.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Update thumbnail highlighting
     */
    private updateThumbnails(galleryElement: HTMLElement, index: number): void {
        const thumbnails = galleryElement.querySelectorAll('.gallery-thumbnail');
        thumbnails.forEach((thumb, i) => {
            const thumbElement = thumb as HTMLElement;
            if (i === index) {
                thumbElement.classList.add('active', 'border-accent-500');
                thumbElement.classList.remove('border-transparent');
                thumbElement.setAttribute('aria-current', 'true');
            } else {
                thumbElement.classList.remove('active', 'border-accent-500');
                thumbElement.classList.add('border-transparent');
                thumbElement.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Update image counter
     */
    private updateCounter(galleryElement: HTMLElement, index: number): void {
        const counter = galleryElement.querySelector('[data-gallery-current]') as HTMLElement;
        if (counter) {
            counter.textContent = (index + 1).toString();
        }
    }

    /**
     * Update image details for ecommerce type
     */
    private updateImageDetails(galleryElement: HTMLElement, index: number): void {
        const titleElement = galleryElement.querySelector('[data-gallery-title]') as HTMLElement;
        const descriptionElement = galleryElement.querySelector('[data-gallery-description]') as HTMLElement;

    }

    /**
     * Update navigation button states
     */
    private updateNavigationButtons(galleryElement: HTMLElement, index: number, totalImages: number): void {
        const prevButton = galleryElement.querySelector('[data-gallery-action="prev"]') as HTMLButtonElement;
        const nextButton = galleryElement.querySelector('[data-gallery-action="next"]') as HTMLButtonElement;
        const isLoop = galleryElement.dataset.loop === 'true';

        if (prevButton) {
            prevButton.disabled = !isLoop && index === 0;
        }

        if (nextButton) {
            nextButton.disabled = !isLoop && index === totalImages - 1;
        }
    }

    /**
     * Start autoplay with scroll-based navigation
     */
    private startAutoplay(galleryId: string, galleryElement: HTMLElement): void {
        const state = this.getState(galleryElement);
        if (!state) return;

        const delay = parseInt(galleryElement.dataset.autoplayDelay || '3000');

        state.autoplayInterval = window.setInterval(() => {
            this.navigateToImageWithScroll(galleryId, galleryElement, 'next');
        }, delay);

        state.isAutoplayActive = true;
        this.setState(galleryElement, state);
        this.updateAutoplayButton(galleryElement, true);
    }

    /**
     * Navigate using scroll-based approach
     */
    private navigateToImageWithScroll(galleryId: string, galleryElement: HTMLElement, direction: 'prev' | 'next'): void {
        const state = this.getState(galleryElement);
        if (!state) return;

        const totalImages = parseInt(galleryElement.dataset.totalImages || '0');
        const isLoop = galleryElement.dataset.loop === 'true';

        let newIndex = state.currentIndex;

        if (direction === 'next') {
            newIndex = state.currentIndex + 1;
            if (newIndex >= totalImages) {
                newIndex = isLoop ? 0 : totalImages - 1;
            }
        } else {
            newIndex = state.currentIndex - 1;
            if (newIndex < 0) {
                newIndex = isLoop ? totalImages - 1 : 0;
            }
        }

        this.goToImage(galleryId, galleryElement, newIndex);
    }

    /**
     * Pause autoplay
     */
    private pauseAutoplay(galleryId: string, galleryElement: HTMLElement): void {
        const state = this.getState(galleryElement);
        if (!state) return;

        if (state.autoplayInterval) {
            clearInterval(state.autoplayInterval);
            state.autoplayInterval = null;
        }

        state.isAutoplayActive = false;
        this.setState(galleryElement, state);
        this.updateAutoplayButton(galleryElement, false);
    }

    /**
     * Toggle autoplay
     */
    private toggleAutoplay(galleryId: string, galleryElement: HTMLElement): void {
        const state = this.getState(galleryElement);
        if (!state) return;

        if (state.isAutoplayActive) {
            this.pauseAutoplay(galleryId, galleryElement);
        } else {
            this.startAutoplay(galleryId, galleryElement);
        }
    }

    /**
     * Update autoplay button state using Button component's multi-state functionality
     */
    private updateAutoplayButton(galleryElement: HTMLElement, isPlaying: boolean): void {
        const autoplayButton = galleryElement.querySelector('.gallery-autoplay-toggle') as HTMLElement;

        if (autoplayButton) {
            autoplayButton.setAttribute('aria-pressed', isPlaying.toString());
            autoplayButton.setAttribute('aria-label', isPlaying ? 'Pause autoplay' : 'Resume autoplay');

            const defaultIcon = autoplayButton.querySelector('.button-icon-default') as HTMLElement;
            const toggleIcon = autoplayButton.querySelector('.button-icon-toggle') as HTMLElement;

            if (defaultIcon && toggleIcon) {
                if (isPlaying) {
                    defaultIcon.classList.remove('opacity-0');
                    defaultIcon.classList.add('opacity-100');
                    toggleIcon.classList.remove('opacity-100');
                    toggleIcon.classList.add('opacity-0');
                } else {
                    defaultIcon.classList.remove('opacity-100');
                    defaultIcon.classList.add('opacity-0');
                    toggleIcon.classList.remove('opacity-0');
                    toggleIcon.classList.add('opacity-100');
                }
            }
        }
    }

    /**
     * Pause autoplay on hover
     */
    private pauseAutoplayOnHover(galleryId: string): void {
        const galleryElement = document.querySelector(`[data-gallery-id="${galleryId}"]`) as HTMLElement;
        if (!galleryElement) return;

        const state = this.getState(galleryElement);
        if (!state?.isAutoplayActive || !state.autoplayInterval) return;

        clearInterval(state.autoplayInterval);
        state.autoplayInterval = null;
        this.setState(galleryElement, state);
    }

    /**
     * Resume autoplay when hover ends
     */
    private resumeAutoplayOnHover(galleryId: string, galleryElement: HTMLElement): void {
        const state = this.getState(galleryElement);
        if (!state?.isAutoplayActive || state.autoplayInterval) return;

        const delay = parseInt(galleryElement.dataset.autoplayDelay || '3000');
        state.autoplayInterval = window.setInterval(() => {
            this.navigateToImage(galleryId, galleryElement, 'next');
        }, delay);

        this.setState(galleryElement, state);
    }

    /**
     * Update accessibility attributes
     */
    private updateAccessibility(galleryElement: HTMLElement, galleryId: string): void {
        const state = this.getState(galleryElement);
        if (!state) return;

        const totalImages = parseInt(galleryElement.dataset.totalImages || '0');
        const currentSlide = galleryElement.querySelector(`[data-gallery-slide="${state.currentIndex}"]`) as HTMLElement;

        if (currentSlide) {
            currentSlide.setAttribute('aria-current', 'true');
            currentSlide.setAttribute('aria-label', `Image ${state.currentIndex + 1} of ${totalImages}`);
        }

        const allSlides = galleryElement.querySelectorAll('[data-gallery-slide]');
        allSlides.forEach((slide, index) => {
            if (index !== state.currentIndex) {
                slide.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Emit custom gallery events
     */
    private emitGalleryEvent(galleryElement: HTMLElement, eventName: string, detail: any): void {
        const event = new CustomEvent(eventName, { detail, bubbles: true });
        galleryElement.dispatchEvent(event);
    }

    /**
     * Announce image change to screen readers
     */
    private announceImageChange(galleryElement: HTMLElement, index: number, totalImages: number): void {
        const liveRegion = galleryElement.querySelector('[data-gallery-live]') as HTMLElement;
        if (liveRegion) {
            const imageElements = galleryElement.querySelectorAll('[data-gallery-slide]');
            const currentImage = imageElements[index] as HTMLElement;
            const imgElement = currentImage?.querySelector('img');
            const altText = imgElement?.getAttribute('alt') || `Image ${index + 1}`;

            const announcement = `Showing ${altText}, image ${index + 1} of ${totalImages}`;
            liveRegion.textContent = announcement;

            setTimeout(() => {
                if (liveRegion.textContent === announcement) {
                    liveRegion.textContent = '';
                }
            }, 1000);
        }
    }

    /**
     * Initialize error handling for gallery images
     */
    private initializeImageErrorHandling(galleryElement: HTMLElement): void {
        const imageElements = galleryElement.querySelectorAll('.gallery-slide img');
        imageElements.forEach((img) => {
            const imgElement = img as HTMLImageElement;

            if (!imgElement.complete) {
                this.setImageLoadingState(imgElement, true);
            }

            imgElement.addEventListener('load', () => {
                this.setImageLoadingState(imgElement, false);
                this.setImageErrorState(imgElement, false);
            });

            imgElement.addEventListener('error', () => {
                this.setImageLoadingState(imgElement, false);
                this.setImageErrorState(imgElement, true);
                this.handleImageError(imgElement, galleryElement);
                console.warn(`Failed to load gallery image: ${imgElement.src}`);
            });
        });

        const thumbnailImages = galleryElement.querySelectorAll('.gallery-thumbnail img');
        thumbnailImages.forEach((img) => {
            const imgElement = img as HTMLImageElement;

            imgElement.addEventListener('error', () => {
                this.setThumbnailErrorState(imgElement, true);
                console.warn(`Failed to load gallery thumbnail: ${imgElement.src}`);
            });
        });
    }

    /**
     * Set loading state for an image
     */
    private setImageLoadingState(imgElement: HTMLImageElement, isLoading: boolean): void {
        const container = imgElement.closest('.gallery-slide') as HTMLElement;
        if (!container) return;

        if (isLoading) {
            container.classList.add('gallery-image-loading');
            container.setAttribute('aria-busy', 'true');
        } else {
            container.classList.remove('gallery-image-loading');
            container.removeAttribute('aria-busy');
        }
    }

    /**
     * Set error state for an image
     */
    private setImageErrorState(imgElement: HTMLImageElement, hasError: boolean): void {
        const container = imgElement.closest('.gallery-slide') as HTMLElement;
        if (!container) return;

        if (hasError) {
            container.classList.add('gallery-image-error');
            container.setAttribute('aria-label', 'Image failed to load');

            if (!container.querySelector('.gallery-error-placeholder')) {
                this.createImageErrorPlaceholder(container);
            }
        } else {
            container.classList.remove('gallery-image-error');
            container.removeAttribute('aria-label');

            const errorPlaceholder = container.querySelector('.gallery-error-placeholder');
            if (errorPlaceholder) {
                errorPlaceholder.remove();
            }
        }
    }

    /**
     * Set error state for thumbnail images
     */
    private setThumbnailErrorState(imgElement: HTMLImageElement, hasError: boolean): void {
        const container = imgElement.closest('.gallery-thumbnail') as HTMLElement;
        if (!container) return;

        if (hasError) {
            container.classList.add('gallery-thumbnail-error');
            imgElement.style.display = 'none';

            if (!container.querySelector('.gallery-thumbnail-error-placeholder')) {
                this.createThumbnailErrorPlaceholder(container);
            }
        }
    }

    /**
     * Create error placeholder for main images
     */
    private createImageErrorPlaceholder(container: HTMLElement): void {
        const placeholder = document.createElement('div');
        placeholder.className = 'gallery-error-placeholder absolute inset-0 flex items-center justify-center bg-elevation-1 border border-line rounded-lg';
        placeholder.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-3 text-muted opacity-50">
                    <svg xmlns="http:
                        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                </div>
                <p class="text-sm text-muted">Image failed to load</p>
            </div>
        `;
        container.appendChild(placeholder);
    }

    /**
     * Create error placeholder for thumbnail images
     */
    private createThumbnailErrorPlaceholder(container: HTMLElement): void {
        const placeholder = document.createElement('div');
        placeholder.className = 'gallery-thumbnail-error-placeholder absolute inset-0 flex items-center justify-center bg-elevation-1 border border-line rounded text-muted';
        placeholder.innerHTML = `
            <svg xmlns="http:
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
        `;
        container.appendChild(placeholder);
    }

    /**
     * Preload adjacent images for smoother transitions
     */
    private preloadAdjacentImages(galleryElement: HTMLElement, currentIndex: number): void {
        const totalImages = parseInt(galleryElement.dataset.totalImages || '0');
        const isLoop = galleryElement.dataset.loop === 'true';

        const imagesToPreload: number[] = [];

        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            imagesToPreload.push(prevIndex);
        } else if (isLoop && totalImages > 1) {
            imagesToPreload.push(totalImages - 1);
        }

        const nextIndex = currentIndex + 1;
        if (nextIndex < totalImages) {
            imagesToPreload.push(nextIndex);
        } else if (isLoop && totalImages > 1) {
            imagesToPreload.push(0);
        }

        imagesToPreload.forEach(index => {
            const slideElement = galleryElement.querySelector(`[data-gallery-slide="${index}"]`) as HTMLElement;
            if (slideElement) {
                const imgElement = slideElement.querySelector('img') as HTMLImageElement;
                if (imgElement && imgElement.src && !imgElement.complete) {
                    const preloadImg = new Image();
                    preloadImg.src = imgElement.src;

                    preloadImg.onerror = () => {
                        console.warn(`Failed to preload image: ${preloadImg.src}`);
                    };
                }
            }
        });
    }

    /**
     * Handle image load errors with retry logic
     */
    private handleImageError(imgElement: HTMLImageElement, galleryElement: HTMLElement): void {
        const retryCount = parseInt(imgElement.dataset.retryCount || '0');
        const maxRetries = 2;

        if (retryCount < maxRetries) {
            imgElement.dataset.retryCount = (retryCount + 1).toString();

            setTimeout(() => {
                const originalSrc = imgElement.src;
                imgElement.src = '';
                imgElement.src = originalSrc + '?retry=' + retryCount;
            }, 1000 * (retryCount + 1));
        } else {
            this.checkGalleryHealth(galleryElement);

            this.announceAction(galleryElement, 'Image failed to load');
        }
    }

    /**
     * Check if gallery has too many failed images
     */
    private checkGalleryHealth(galleryElement: HTMLElement): void {
        const totalImages = galleryElement.querySelectorAll('.gallery-slide img').length;
        const failedImages = galleryElement.querySelectorAll('.gallery-image-error').length;

        if (failedImages > totalImages / 2) {
            this.setGalleryErrorState(galleryElement, true);
        }
    }

    /**
     * Set error state for entire gallery
     */
    private setGalleryErrorState(galleryElement: HTMLElement, hasError: boolean): void {
        if (hasError) {
            galleryElement.classList.add('gallery-has-errors');
            this.announceAction(galleryElement, 'Gallery has loading issues. Some images may not be available.');
        } else {
            galleryElement.classList.remove('gallery-has-errors');
        }
    }

    /**
     * Clean up when gallery is removed
     */
    public cleanup(galleryId: string): void {
        const galleryElement = document.querySelector(`[data-gallery-id="${galleryId}"]`) as HTMLElement;
        if (!galleryElement) return;

        const state = this.getState(galleryElement);
        if (state?.autoplayInterval) {
            clearInterval(state.autoplayInterval);
        }
        this.removeState(galleryElement);
    }
}