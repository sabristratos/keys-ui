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

interface GalleryState {
    currentIndex: number;
    isAutoplayActive: boolean;
    autoplayInterval: number | null;
    touchStartX: number;
    touchEndX: number;
    isDragging: boolean;
}

export class GalleryActions extends BaseActionClass<GalleryState> {

    /**
     * Initialize gallery elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.findByDataAttribute('gallery', 'true').forEach(gallery => {
            this.initializeGallery(gallery);
        });
    }

    /**
     * Initialize a single gallery element
     */
    private initializeGallery(galleryElement: HTMLElement): void {
        const galleryId = galleryElement.dataset.galleryId;
        if (!galleryId) return;

        // Initialize state
        this.setState(galleryId, {
            currentIndex: 0,
            isAutoplayActive: galleryElement.dataset.autoplay === 'true',
            autoplayInterval: null,
            touchStartX: 0,
            touchEndX: 0,
            isDragging: false
        });

        // Set up event listeners
        this.setupGalleryEventListeners(galleryElement, galleryId);

        // Initialize autoplay if enabled
        if (galleryElement.dataset.autoplay === 'true') {
            this.startAutoplay(galleryId, galleryElement);
        }

        // Set initial accessibility attributes
        this.updateAccessibility(galleryElement, galleryId);

        // Initialize image error handling
        this.initializeImageErrorHandling(galleryElement);

        // Start preloading adjacent images
        this.preloadAdjacentImages(galleryElement, 0);
    }

    /**
     * Set up event listeners for gallery interactions
     */
    private setupGalleryEventListeners(galleryElement: HTMLElement, galleryId: string): void {
        // Navigation button clicks
        const prevButton = galleryElement.querySelector('[data-gallery-action="prev"]') as HTMLElement;
        const nextButton = galleryElement.querySelector('[data-gallery-action="next"]') as HTMLElement;

        if (prevButton) {
            EventUtils.delegate(prevButton, 'click', () => {
                this.navigateToImage(galleryId, galleryElement, 'prev');
            });
        }

        if (nextButton) {
            EventUtils.delegate(nextButton, 'click', () => {
                this.navigateToImage(galleryId, galleryElement, 'next');
            });
        }

        // Thumbnail clicks and keyboard navigation
        const thumbnails = galleryElement.querySelectorAll('[data-gallery-thumbnail]');
        thumbnails.forEach((thumbnail, index) => {
            EventUtils.delegate(thumbnail as HTMLElement, 'click', () => {
                this.goToImage(galleryId, galleryElement, index);
            });

            // Keyboard support for thumbnails
            EventUtils.delegate(thumbnail as HTMLElement, 'keydown', (e: KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToImage(galleryId, galleryElement, index);
                }
            });
        });

        // Autoplay toggle
        const autoplayToggle = galleryElement.querySelector('[data-gallery-action="toggle-autoplay"]') as HTMLElement;
        if (autoplayToggle) {
            EventUtils.delegate(autoplayToggle, 'click', () => {
                this.toggleAutoplay(galleryId, galleryElement);
            });
        }

        // Keyboard navigation
        EventUtils.delegate(galleryElement, 'keydown', (e: KeyboardEvent) => {
            this.handleKeyboardNavigation(e, galleryId, galleryElement);
        });

        // Touch/swipe events
        this.setupTouchEvents(galleryElement, galleryId);

        // Pause autoplay on hover
        EventUtils.delegate(galleryElement, 'mouseenter', () => {
            this.pauseAutoplayOnHover(galleryId);
        });

        EventUtils.delegate(galleryElement, 'mouseleave', () => {
            this.resumeAutoplayOnHover(galleryId, galleryElement);
        });
    }

    /**
     * Set up touch/swipe event listeners
     */
    private setupTouchEvents(galleryElement: HTMLElement, galleryId: string): void {
        const mainImage = galleryElement.querySelector('.gallery-main');
        if (!mainImage) return;

        // Touch start
        EventUtils.delegate(mainImage as HTMLElement, 'touchstart', (e: TouchEvent) => {
            const state = this.getState(galleryId);
            if (!state) return;

            state.touchStartX = e.touches[0].clientX;
            state.isDragging = true;
            this.setState(galleryId, state);
        }, { passive: true });

        // Touch move
        EventUtils.delegate(mainImage as HTMLElement, 'touchmove', (e: TouchEvent) => {
            const state = this.getState(galleryId);
            if (!state?.isDragging) return;

            state.touchEndX = e.touches[0].clientX;
            this.setState(galleryId, state);
        }, { passive: true });

        // Touch end
        EventUtils.delegate(mainImage as HTMLElement, 'touchend', () => {
            const state = this.getState(galleryId);
            if (!state?.isDragging) return;

            state.isDragging = false;
            const touchDiff = state.touchStartX - state.touchEndX;
            const threshold = 50; // Minimum swipe distance

            if (Math.abs(touchDiff) > threshold) {
                if (touchDiff > 0) {
                    // Swipe left - next image
                    this.navigateToImage(galleryId, galleryElement, 'next');
                } else {
                    // Swipe right - previous image
                    this.navigateToImage(galleryId, galleryElement, 'prev');
                }
            }

            this.setState(galleryId, state);
        });
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
                const totalImages = parseInt(galleryElement.dataset.totalImages || '0');
                this.goToImage(galleryId, galleryElement, totalImages - 1);
                break;
            case 'Escape':
                e.preventDefault();
                // Close lightbox if open, or pause autoplay
                if (this.getState(galleryId)?.isAutoplayActive) {
                    this.pauseAutoplay(galleryId, galleryElement);
                }
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoplay(galleryId, galleryElement);
                break;
        }
    }

    /**
     * Navigate to previous or next image
     */
    private navigateToImage(galleryId: string, galleryElement: HTMLElement, direction: 'prev' | 'next'): void {
        const state = this.getState(galleryId);
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
        const state = this.getState(galleryId);
        if (!state) return;

        const totalImages = parseInt(galleryElement.dataset.totalImages || '0');
        if (index < 0 || index >= totalImages) return;

        // Update state
        state.currentIndex = index;
        this.setState(galleryId, state);

        // Update UI
        this.updateImageDisplay(galleryElement, index);
        this.updateThumbnails(galleryElement, index);
        this.updateCounter(galleryElement, index);
        this.updateImageDetails(galleryElement, index);
        this.updateNavigationButtons(galleryElement, index, totalImages);
        this.updateAccessibility(galleryElement, galleryId);
        this.announceImageChange(galleryElement, index, totalImages);
        this.preloadAdjacentImages(galleryElement, index);

        // Emit custom event
        this.emitGalleryEvent(galleryElement, 'gallery:imageChanged', {
            currentIndex: index,
            galleryId: galleryId
        });
    }

    /**
     * Update image display
     */
    private updateImageDisplay(galleryElement: HTMLElement, index: number): void {
        const slides = galleryElement.querySelectorAll('.gallery-slide');
        slides.forEach((slide, i) => {
            const slideElement = slide as HTMLElement;
            if (i === index) {
                slideElement.classList.remove('opacity-0');
                slideElement.classList.add('opacity-100', 'active');
            } else {
                slideElement.classList.remove('opacity-100', 'active');
                slideElement.classList.add('opacity-0');
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
                thumbElement.classList.add('active', 'border-brand-500');
                thumbElement.classList.remove('border-transparent');
                thumbElement.setAttribute('aria-current', 'true');
            } else {
                thumbElement.classList.remove('active', 'border-brand-500');
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

        // This would need to be enhanced to get image data from a data attribute or global variable
        // For now, we'll skip this implementation as it requires additional data structure
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
     * Start autoplay
     */
    private startAutoplay(galleryId: string, galleryElement: HTMLElement): void {
        const state = this.getState(galleryId);
        if (!state) return;

        const delay = parseInt(galleryElement.dataset.autoplayDelay || '3000');

        state.autoplayInterval = window.setInterval(() => {
            this.navigateToImage(galleryId, galleryElement, 'next');
        }, delay);

        state.isAutoplayActive = true;
        this.setState(galleryId, state);
        this.updateAutoplayButton(galleryElement, true);
    }

    /**
     * Pause autoplay
     */
    private pauseAutoplay(galleryId: string, galleryElement: HTMLElement): void {
        const state = this.getState(galleryId);
        if (!state) return;

        if (state.autoplayInterval) {
            clearInterval(state.autoplayInterval);
            state.autoplayInterval = null;
        }

        state.isAutoplayActive = false;
        this.setState(galleryId, state);
        this.updateAutoplayButton(galleryElement, false);
    }

    /**
     * Toggle autoplay
     */
    private toggleAutoplay(galleryId: string, galleryElement: HTMLElement): void {
        const state = this.getState(galleryId);
        if (!state) return;

        if (state.isAutoplayActive) {
            this.pauseAutoplay(galleryId, galleryElement);
        } else {
            this.startAutoplay(galleryId, galleryElement);
        }
    }

    /**
     * Update autoplay button icon and aria-pressed state
     */
    private updateAutoplayButton(galleryElement: HTMLElement, isPlaying: boolean): void {
        const autoplayButton = galleryElement.querySelector('.gallery-autoplay-toggle') as HTMLElement;
        const playIcon = galleryElement.querySelector('.play-icon') as HTMLElement;
        const pauseIcon = galleryElement.querySelector('.pause-icon') as HTMLElement;

        if (autoplayButton) {
            autoplayButton.setAttribute('aria-pressed', isPlaying.toString());
            autoplayButton.setAttribute('aria-label', isPlaying ? 'Pause autoplay' : 'Resume autoplay');
        }

        if (playIcon && pauseIcon) {
            if (isPlaying) {
                playIcon.classList.add('show');
                playIcon.classList.remove('hide');
                pauseIcon.classList.add('hide');
                pauseIcon.classList.remove('show');
            } else {
                playIcon.classList.add('hide');
                playIcon.classList.remove('show');
                pauseIcon.classList.add('show');
                pauseIcon.classList.remove('hide');
            }
        }
    }

    /**
     * Pause autoplay on hover
     */
    private pauseAutoplayOnHover(galleryId: string): void {
        const state = this.getState(galleryId);
        if (!state?.isAutoplayActive || !state.autoplayInterval) return;

        clearInterval(state.autoplayInterval);
        state.autoplayInterval = null;
        this.setState(galleryId, state);
    }

    /**
     * Resume autoplay when hover ends
     */
    private resumeAutoplayOnHover(galleryId: string, galleryElement: HTMLElement): void {
        const state = this.getState(galleryId);
        if (!state?.isAutoplayActive || state.autoplayInterval) return;

        const delay = parseInt(galleryElement.dataset.autoplayDelay || '3000');
        state.autoplayInterval = window.setInterval(() => {
            this.navigateToImage(galleryId, galleryElement, 'next');
        }, delay);

        this.setState(galleryId, state);
    }

    /**
     * Update accessibility attributes
     */
    private updateAccessibility(galleryElement: HTMLElement, galleryId: string): void {
        const state = this.getState(galleryId);
        if (!state) return;

        const totalImages = parseInt(galleryElement.dataset.totalImages || '0');
        const currentSlide = galleryElement.querySelector(`[data-gallery-slide="${state.currentIndex}"]`) as HTMLElement;

        if (currentSlide) {
            currentSlide.setAttribute('aria-current', 'true');
            currentSlide.setAttribute('aria-label', `Image ${state.currentIndex + 1} of ${totalImages}`);
        }

        // Remove aria-current from other slides
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
            // Get image information
            const imageElements = galleryElement.querySelectorAll('[data-gallery-slide]');
            const currentImage = imageElements[index] as HTMLElement;
            const imgElement = currentImage?.querySelector('img');
            const altText = imgElement?.getAttribute('alt') || `Image ${index + 1}`;

            // Create announcement
            const announcement = `Showing ${altText}, image ${index + 1} of ${totalImages}`;
            liveRegion.textContent = announcement;

            // Clear announcement after a delay to allow for new announcements
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

            // Add loading state
            if (!imgElement.complete) {
                this.setImageLoadingState(imgElement, true);
            }

            // Handle successful image load
            imgElement.addEventListener('load', () => {
                this.setImageLoadingState(imgElement, false);
                this.setImageErrorState(imgElement, false);
            });

            // Handle image load errors
            imgElement.addEventListener('error', () => {
                this.setImageLoadingState(imgElement, false);
                this.setImageErrorState(imgElement, true);
                console.warn(`Failed to load gallery image: ${imgElement.src}`);
            });
        });

        // Handle thumbnail image errors
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

            // Create error placeholder if it doesn't exist
            if (!container.querySelector('.gallery-error-placeholder')) {
                this.createImageErrorPlaceholder(container);
            }
        } else {
            container.classList.remove('gallery-image-error');
            container.removeAttribute('aria-label');

            // Remove error placeholder
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

            // Create thumbnail error placeholder if it doesn't exist
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
        placeholder.className = 'gallery-error-placeholder absolute inset-0 flex items-center justify-center bg-surface border border-border rounded-lg';
        placeholder.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-3 text-muted opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
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
        placeholder.className = 'gallery-thumbnail-error-placeholder absolute inset-0 flex items-center justify-center bg-surface border border-border rounded text-muted';
        placeholder.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
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

        // Determine which images to preload (previous and next)
        const imagesToPreload: number[] = [];

        // Add previous image
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            imagesToPreload.push(prevIndex);
        } else if (isLoop && totalImages > 1) {
            imagesToPreload.push(totalImages - 1);
        }

        // Add next image
        const nextIndex = currentIndex + 1;
        if (nextIndex < totalImages) {
            imagesToPreload.push(nextIndex);
        } else if (isLoop && totalImages > 1) {
            imagesToPreload.push(0);
        }

        // Preload the images
        imagesToPreload.forEach(index => {
            const slideElement = galleryElement.querySelector(`[data-gallery-slide="${index}"]`) as HTMLElement;
            if (slideElement) {
                const imgElement = slideElement.querySelector('img') as HTMLImageElement;
                if (imgElement && imgElement.src && !imgElement.complete) {
                    // Create a new image element to trigger preloading
                    const preloadImg = new Image();
                    preloadImg.src = imgElement.src;

                    // Add error handling for preloading
                    preloadImg.onerror = () => {
                        console.warn(`Failed to preload image: ${preloadImg.src}`);
                    };
                }
            }
        });
    }

    /**
     * Clean up when gallery is removed
     */
    public cleanup(galleryId: string): void {
        const state = this.getState(galleryId);
        if (state?.autoplayInterval) {
            clearInterval(state.autoplayInterval);
        }
        this.removeState(galleryId);
    }
}