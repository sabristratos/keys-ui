/**
 * AvatarActions - Handles interactive functionality for Avatar components
 *
 * Provides functionality for:
 * - Image load error detection and fallback handling
 * - Graceful transitions from broken images to initials/icon fallbacks
 * - Retry mechanism for temporary network issues
 * - Lazy loading compatibility
 * - Accessibility maintenance during fallbacks
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

interface AvatarState {
    element: HTMLElement;
    img: HTMLImageElement | null;
    fallbackContainer: HTMLElement | null;
    hasInitials: boolean;
    hasIcon: boolean;
    retryCount: number;
    maxRetries: number;
    isLoading: boolean;
    hasFailed: boolean;
}

export class AvatarActions extends BaseActionClass<AvatarState> {
    private failedUrls = new Set<string>();
    private readonly MAX_RETRIES = 2;
    private readonly RETRY_DELAY = 1000;

    /**
     * Bind event listeners - required by BaseActionClass
     */
    protected bindEventListeners(): void {
    }

    /**
     * Set up dynamic observer for newly added avatars
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    if (element.hasAttribute('data-keys-avatar')) {
                        this.initializeAvatar(element);
                    }

                    const avatars = element.querySelectorAll('[data-keys-avatar="true"]') as NodeListOf<HTMLElement>;
                    avatars.forEach(avatar => {
                        this.initializeAvatar(avatar);
                    });
                }
            });
        });
    }

    /**
     * Initialize avatar elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        const avatars = DOMUtils.querySelectorAll('[data-keys-avatar="true"]') as HTMLElement[];

        avatars.forEach(avatar => {
            this.initializeAvatar(avatar);
        });
    }

    /**
     * Initialize a single avatar element
     */
    private initializeAvatar(avatar: HTMLElement): void {
        const img = avatar.querySelector('img') as HTMLImageElement | null;
        const fallbackContainer = avatar.querySelector('[data-avatar-fallback="true"]') as HTMLElement | null;

        if (!img) {
            return;
        }

        const fallbackType = avatar.getAttribute('data-fallback-type') || 'icon';
        const state: AvatarState = {
            element: avatar,
            img: img,
            fallbackContainer: fallbackContainer,
            hasInitials: fallbackType === 'initials',
            hasIcon: fallbackType === 'icon',
            retryCount: 0,
            maxRetries: this.MAX_RETRIES,
            isLoading: false,
            hasFailed: false
        };

        this.setState(avatar, state);

        this.setupImageErrorHandling(state);

        if (img.complete && !img.naturalWidth) {
            this.handleImageError(state);
        }
    }

    /**
     * Set up error handling for avatar image
     */
    private setupImageErrorHandling(state: AvatarState): void {
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
     * Handle image load error
     */
    private handleImageError(state: AvatarState): void {
        if (!state.img || state.hasFailed) return;

        const imgSrc = state.img.src;

        this.failedUrls.add(imgSrc);

        if (state.retryCount < state.maxRetries && !this.failedUrls.has(imgSrc)) {
            this.retryImageLoad(state);
            return;
        }

        state.hasFailed = true;
        this.showFallback(state);
    }

    /**
     * Handle successful image load
     */
    private handleImageLoad(state: AvatarState): void {
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
    private retryImageLoad(state: AvatarState): void {
        if (!state.img || state.retryCount >= state.maxRetries) return;

        state.retryCount++;
        state.isLoading = true;

        state.element.setAttribute('data-avatar-loading', 'true');

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
     * Show the fallback (initials or icon) using existing styled template structure
     */
    private showFallback(state: AvatarState): void {
        if (!state.img) return;

        state.img.style.display = 'none';

        if (state.fallbackContainer) {
            state.fallbackContainer.style.display = 'block';
        }

        state.element.setAttribute('data-avatar-fallback-active', 'true');
        state.element.removeAttribute('data-avatar-image-active');
        state.element.removeAttribute('data-avatar-loading');

        this.updateAccessibility(state, 'fallback');

        this.dispatchAvatarEvent(state.element, 'fallback', {
            hasInitials: state.hasInitials,
            hasIcon: state.hasIcon
        });
    }

    /**
     * Show the image (hide fallback) using existing template structure
     */
    private showImage(state: AvatarState): void {
        if (!state.img) return;

        state.img.style.display = 'block';

        if (state.fallbackContainer) {
            state.fallbackContainer.style.display = 'none';
        }

        state.element.setAttribute('data-avatar-image-active', 'true');
        state.element.removeAttribute('data-avatar-fallback-active');
        state.element.removeAttribute('data-avatar-loading');

        this.updateAccessibility(state, 'image');

        this.dispatchAvatarEvent(state.element, 'imageLoad', {
            src: state.img.src
        });
    }

    /**
     * Set up lazy loading support
     */
    private setupLazyLoadingSupport(state: AvatarState): void {
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
    private updateAccessibility(state: AvatarState, type: 'image' | 'fallback'): void {
        const name = state.element.getAttribute('data-avatar-name');
        const alt = state.img?.getAttribute('alt');

        if (type === 'fallback') {
            const fallbackText = state.hasInitials && name ?
                `Initials for ${name}` :
                `Avatar placeholder`;

            state.element.setAttribute('aria-label', fallbackText);
        } else if (type === 'image' && alt) {
            state.element.setAttribute('aria-label', alt);
        }
    }

    /**
     * Dispatch custom avatar events
     */
    private dispatchAvatarEvent(element: HTMLElement, type: string, detail: any = {}): void {
        const event = new CustomEvent(`avatar:${type}`, {
            detail: {
                element,
                ...detail
            },
            bubbles: true
        });

        element.dispatchEvent(event);
    }

    /**
     * Public method to manually trigger fallback for an avatar
     */
    public triggerFallback(avatarElement: HTMLElement): void {
        const state = this.getState(avatarElement);
        if (state && !state.hasFailed) {
            this.handleImageError(state);
        }
    }

    /**
     * Public method to retry loading an avatar image
     */
    public retryAvatar(avatarElement: HTMLElement): void {
        const state = this.getState(avatarElement);
        if (state && state.hasFailed && state.img) {
            state.hasFailed = false;
            state.retryCount = 0;
            this.handleImageLoad(state);
        }
    }

    /**
     * Public method to check if an avatar has failed
     */
    public hasAvatarFailed(avatarElement: HTMLElement): boolean {
        const state = this.getState(avatarElement);
        return state ? state.hasFailed : false;
    }

    /**
     * Clear failed URLs cache (useful for network recovery scenarios)
     */
    public clearFailedUrlsCache(): void {
        this.failedUrls.clear();
    }
}

export default AvatarActions;