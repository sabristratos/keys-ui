/**
 * ImageActions - Handles interactive functionality for Image components
 *
 * Provides functionality for:
 * - Image load error detection and fallback handling
 * - Graceful transitions from broken images to placeholder icons
 * - Retry mechanism for temporary network issues
 * - Lazy loading compatibility
 * - Accessibility maintenance during fallbacks
 * - Lightbox integration support
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

interface ImageState {
    element: HTMLElement;
    img: HTMLImageElement | null;
    fallbackContainer: HTMLElement | null;
    fallbackIcon: string;
    fallbackText: string;
    retryCount: number;
    maxRetries: number;
    isLoading: boolean;
    hasFailed: boolean;
    hasLightbox: boolean;
}

export class ImageActions extends BaseActionClass<ImageState> {
    private failedUrls = new Set<string>();
    private readonly DEFAULT_MAX_RETRIES = 2;
    private readonly RETRY_DELAY = 1000;

    /**
     * Bind event listeners - required by BaseActionClass
     */
    protected bindEventListeners(): void {
    }

    /**
     * Set up dynamic observer for newly added images
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    if (element.hasAttribute('data-keys-image')) {
                        this.initializeImage(element);
                    }

                    const images = element.querySelectorAll('[data-keys-image="true"]') as NodeListOf<HTMLElement>;
                    images.forEach(image => {
                        this.initializeImage(image);
                    });
                }
            });
        });
    }

    /**
     * Initialize image elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        const images = DOMUtils.querySelectorAll('[data-keys-image="true"]') as HTMLElement[];

        images.forEach(image => {
            this.initializeImage(image);
        });
    }

    /**
     * Initialize a single image element
     */
    private initializeImage(imageContainer: HTMLElement): void {
        const img = imageContainer.querySelector('img') as HTMLImageElement | null;
        const fallbackContainer = imageContainer.querySelector('[data-image-fallback="true"]') as HTMLElement | null;

        if (!img) {
            return;
        }

        const fallbackIcon = imageContainer.getAttribute('data-fallback-icon') || 'heroicon-o-photo';
        const fallbackText = imageContainer.getAttribute('data-fallback-text') || 'Image placeholder';
        const retryAttempts = parseInt(imageContainer.getAttribute('data-retry-attempts') || '2', 10);
        const hasLightbox = imageContainer.hasAttribute('data-lightbox');

        const state: ImageState = {
            element: imageContainer,
            img: img,
            fallbackContainer: fallbackContainer,
            fallbackIcon: fallbackIcon,
            fallbackText: fallbackText,
            retryCount: 0,
            maxRetries: Math.max(0, Math.min(retryAttempts, 5)),
            isLoading: false,
            hasFailed: false,
            hasLightbox: hasLightbox
        };

        this.setState(imageContainer, state);

        this.setupImageErrorHandling(state);

        if (img.complete && !img.naturalWidth) {
            this.handleImageError(state);
        }
    }

    /**
     * Set up error handling for image
     */
    private setupImageErrorHandling(state: ImageState): void {
        if (!state.img) return;

        EventUtils.addEventListener(state.img, 'error', () => {
            this.handleImageError(state);
        });

        EventUtils.addEventListener(state.img, 'load', () => {
            this.handleImageLoad(state);
        });

        if (state.img.loading === 'lazy') {
            this.setupLazyLoadingSupport(state);
        }
    }

    /**
     * Handle image load error with retry logic
     *
     * Implements progressive retry strategy with exponential backoff.
     * Tracks failed URLs globally to avoid repeated retry attempts.
     * Falls back to placeholder icon after max retries exceeded.
     *
     * @param state - Current image component state
     */
    private handleImageError(state: ImageState): void {
        if (!state.img || state.hasFailed) return;

        const imgSrc = state.img.src;

        this.failedUrls.add(imgSrc);

        if (state.retryCount < state.maxRetries && !this.isKnownFailedUrl(imgSrc)) {
            this.retryImageLoad(state);
            return;
        }

        state.hasFailed = true;
        this.showFallback(state);
    }

    /**
     * Handle successful image load
     */
    private handleImageLoad(state: ImageState): void {
        if (!state.img) return;

        const imgSrc = state.img.src;

        this.failedUrls.delete(imgSrc);

        state.hasFailed = false;
        state.retryCount = 0;
        state.isLoading = false;

        this.showImage(state);
    }

    /**
     * Retry loading the image after a delay
     */
    private retryImageLoad(state: ImageState): void {
        if (!state.img || state.retryCount >= state.maxRetries) return;

        state.retryCount++;
        state.isLoading = true;

        state.element.setAttribute('data-image-loading', 'true');

        setTimeout(() => {
            if (!state.img || state.hasFailed) return;

            const originalSrc = state.img.src;
            state.img.src = '';
            requestAnimationFrame(() => {
                if (state.img) {
                    state.img.src = originalSrc;
                }
            });
        }, this.RETRY_DELAY * state.retryCount);
    }

    /**
     * Show the fallback placeholder using existing styled template structure
     */
    private showFallback(state: ImageState): void {
        if (!state.img) return;

        state.img.style.display = 'none';

        if (state.fallbackContainer) {
            state.fallbackContainer.style.display = 'flex';
        }

        state.element.setAttribute('data-fallback-active', 'true');
        state.element.removeAttribute('data-image-active');
        state.element.removeAttribute('data-image-loading');

        if (state.hasLightbox) {
            this.disableLightbox(state);
        }

        this.updateAccessibility(state, 'fallback');

        this.dispatchImageEvent(state.element, 'fallback', {
            fallbackIcon: state.fallbackIcon,
            fallbackText: state.fallbackText,
            originalSrc: state.img.src
        });
    }

    /**
     * Show the image (hide fallback) using existing template structure
     */
    private showImage(state: ImageState): void {
        if (!state.img) return;

        state.img.style.display = 'block';

        if (state.fallbackContainer) {
            state.fallbackContainer.style.display = 'none';
        }

        state.element.setAttribute('data-image-active', 'true');
        state.element.removeAttribute('data-fallback-active');
        state.element.removeAttribute('data-image-loading');

        if (state.hasLightbox) {
            this.enableLightbox(state);
        }

        this.updateAccessibility(state, 'image');

        this.dispatchImageEvent(state.element, 'imageLoad', {
            src: state.img.src
        });
    }

    /**
     * Set up lazy loading support
     */
    private setupLazyLoadingSupport(state: ImageState): void {
        if (!state.img || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });

        observer.observe(state.img);
    }

    /**
     * Update accessibility attributes based on current state
     */
    private updateAccessibility(state: ImageState, type: 'image' | 'fallback'): void {
        const alt = state.img?.getAttribute('alt');

        if (type === 'fallback') {
            state.element.setAttribute('aria-label', state.fallbackText);
            if (state.img) {
                state.img.setAttribute('alt', '');
                state.img.setAttribute('aria-hidden', 'true');
            }
        } else if (type === 'image' && alt) {
            state.element.removeAttribute('aria-label');
            if (state.img) {
                state.img.setAttribute('alt', alt);
                state.img.removeAttribute('aria-hidden');
            }
        }
    }

    /**
     * Disable lightbox functionality for fallback state
     */
    private disableLightbox(state: ImageState): void {
        state.element.removeAttribute('role');
        state.element.removeAttribute('tabindex');
        state.element.style.cursor = 'default';

        const lightboxTrigger = state.element.getAttribute('data-lightbox-trigger');
        if (lightboxTrigger) {
            state.element.setAttribute('data-lightbox-disabled', 'true');
        }
    }

    /**
     * Enable lightbox functionality for image state
     */
    private enableLightbox(state: ImageState): void {
        if (!state.hasLightbox) return;

        state.element.setAttribute('role', 'button');
        state.element.setAttribute('tabindex', '0');
        state.element.style.cursor = 'pointer';
        state.element.removeAttribute('data-lightbox-disabled');
    }

    /**
     * Check if URL is known to be failed
     */
    private isKnownFailedUrl(url: string): boolean {
        return this.failedUrls.has(url);
    }

    /**
     * Dispatch custom image events
     */
    private dispatchImageEvent(element: HTMLElement, type: string, detail: any = {}): void {
        const event = new CustomEvent(`image:${type}`, {
            detail: {
                element,
                ...detail
            },
            bubbles: true
        });

        element.dispatchEvent(event);
    }

    /**
     * Public method to manually trigger fallback for an image
     */
    public triggerFallback(imageElement: HTMLElement): void {
        const state = this.getState(imageElement);
        if (state && !state.hasFailed) {
            this.handleImageError(state);
        }
    }

    /**
     * Public method to retry loading an image
     */
    public retryImage(imageElement: HTMLElement): void {
        const state = this.getState(imageElement);
        if (state && state.hasFailed && state.img) {
            state.hasFailed = false;
            state.retryCount = 0;
            this.handleImageLoad(state);
        }
    }

    /**
     * Public method to check if an image has failed
     */
    public hasImageFailed(imageElement: HTMLElement): boolean {
        const state = this.getState(imageElement);
        return state ? state.hasFailed : false;
    }

    /**
     * Clear failed URLs cache (useful for network recovery scenarios)
     */
    public clearFailedUrlsCache(): void {
        this.failedUrls.clear();
    }

    /**
     * Get image loading state
     */
    public isImageLoading(imageElement: HTMLElement): boolean {
        const state = this.getState(imageElement);
        return state ? state.isLoading : false;
    }

    /**
     * Force reload an image (useful for updating dynamic sources)
     */
    public reloadImage(imageElement: HTMLElement, newSrc?: string): void {
        const state = this.getState(imageElement);
        if (state && state.img) {
            if (newSrc) {
                state.img.src = newSrc;
            } else {
                const currentSrc = state.img.src;
                state.img.src = '';
                requestAnimationFrame(() => {
                    if (state.img) {
                        state.img.src = currentSrc;
                    }
                });
            }
        }
    }
}

export default ImageActions;