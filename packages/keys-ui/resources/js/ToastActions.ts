/**
 * ToastActions handles toast notifications with positioning, animations, and Livewire integration
 * Provides programmatic control over toast notifications with auto-dismiss functionality
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import { AnimationUtils } from './utils/AnimationUtils';

interface ToastState {
    toasts: Map<string, HTMLElement>;
    containers: Map<string, HTMLElement>;
    timers: Map<string, number>;
    pausedTimers: Map<string, { remaining: number, startTime: number }>;
    toastCounter: number;
}

export class ToastActions extends BaseActionClass<ToastState> {

    /**
     * Initialize toast elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        this.initializeToastSystem();
        this.setupLivewireIntegration();
    }

    /**
     * Initialize the global toast system
     */
    private initializeToastSystem(): void {
        // Create global state for toast system
        const globalElement = document.documentElement;
        if (!this.hasState(globalElement)) {
            const state: ToastState = {
                toasts: new Map(),
                containers: new Map(),
                timers: new Map(),
                pausedTimers: new Map(),
                toastCounter: 0
            };
            this.setState(globalElement, state);
        }

        this.discoverToasts();
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Toast dismiss buttons
        EventUtils.handleDelegatedClick('[data-toast-dismiss]', (dismissButton, event) => {
            const dismissId = dismissButton.getAttribute('data-toast-dismiss');
            if (dismissId) {
                event.preventDefault();
                event.stopPropagation();
                this.dismiss(dismissId);
            }
        });

        // Toast action buttons
        EventUtils.handleDelegatedClick('[data-toast-action]', (actionButton, event) => {
            const action = actionButton.getAttribute('data-toast-action');
            const toast = DOMUtils.findClosest(actionButton, '[data-toast="true"]');
            if (action && toast) {
                event.preventDefault();
                event.stopPropagation();
                this.dispatchToastEvent('toast:action', toast.id, { action });
            }
        });

        // Pause/resume timers on hover
        EventUtils.handleDelegatedEvent('mouseenter', '[data-toast="true"]', (toast) => {
            this.pauseTimer(toast.id);
        });

        EventUtils.handleDelegatedEvent('mouseleave', '[data-toast="true"]', (toast) => {
            this.resumeTimer(toast.id);
        });
    }

    /**
     * Setup dynamic observer for new toast containers - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    // Check if the added node is a toast container
                    if (DOMUtils.hasDataAttribute(element, 'toast-container')) {
                        this.discoverToasts();
                    }

                    // Check for toast containers within the added node
                    DOMUtils.findByDataAttribute('toast-container').forEach(() => {
                        this.discoverToasts();
                    });
                }
            });
        });
    }

    /**
     * Discover and register toast containers
     */
    public discoverToasts(): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        DOMUtils.findByDataAttribute('toast-container').forEach(container => {
            const position = container.getAttribute('data-toast-container');
            if (position) {
                globalState.containers.set(position, container);
            }
        });
    }

    /**
     * Get global toast state
     */
    private getGlobalState(): ToastState | null {
        return this.getState(document.documentElement);
    }

    /**
     * Register a toast element for management
     */
    public registerToast(id: string, toast: HTMLElement): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        globalState.toasts.set(id, toast);
        this.setupToastListeners(toast);
    }

    /**
     * Set up individual toast event listeners (no longer needed with event delegation)
     */
    private setupToastListeners(toast: HTMLElement): void {
        // Event listeners are now handled via event delegation in bindEventListeners
        // This method is kept for backward compatibility but does nothing
    }

    /**
     * Setup Livewire integration
     */
    private setupLivewireIntegration(): void {
        if (typeof window.Livewire === 'undefined') return;

        window.Livewire.on('showToast', (data: any) => {
            const variant = data.variant || 'info';
            this.show(variant, data);
        });

        window.Livewire.on('hideToast', (data: any) => {
            if (data.id) {
                this.dismiss(data.id);
            } else {
                this.dismissAll();
            }
        });
    }

    /**
     * Show a toast programmatically
     */
    public show(variant: string, data: Record<string, any> = {}): boolean {
        const globalState = this.getGlobalState();
        if (!globalState) return false;

        const position = data.position || 'top-right';
        const container = globalState.containers.get(position);

        if (!container) {
            return false;
        }

        const toastId = `toast-${variant}-${position}-${++globalState.toastCounter}`;

        const toast = this.createToastElement(toastId, variant, position, data);

        container.appendChild(toast);

        // Use AnimationUtils for fade in animation
        AnimationUtils.fadeIn(toast, {
            scale: true,
            duration: 300,
            onComplete: () => {
                toast.setAttribute('data-toast-visible', 'true');
            }
        });

        const duration = data.duration || 5000;
        const persistent = data.persistent === true;

        if (!persistent && duration > 0) {
            this.setTimer(toastId, duration);
        }

        globalState.toasts.set(toastId, toast);
        this.setupToastListeners(toast);

        this.dispatchToastEvent('toast:show', toastId, data);

        return true;
    }

    /**
     * Create a toast element dynamically
     */
    private createToastElement(toastId: string, variant: string, position: string, data: Record<string, any>): HTMLElement {
        const alertVariant = variant === 'error' ? 'danger' : variant;

        const toastElement = document.createElement('div');
        toastElement.className = 'pointer-events-auto transform transition-all duration-300 ease-out opacity-0 scale-95 translate-y-2';
        toastElement.setAttribute('data-toast', 'true');
        toastElement.setAttribute('data-toast-variant', variant);
        toastElement.setAttribute('data-toast-position', position);
        toastElement.setAttribute('data-toast-visible', 'false');
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'polite');
        toastElement.id = toastId;

        toastElement.innerHTML = `
            <div class="rounded-lg border p-4 space-y-3 ${this.getVariantClasses(alertVariant)}" role="alert" data-dismissible="true">
                <div class="flex">
                    <div class="flex-shrink-0 mt-1">
                        <svg class="w-5 h-5 ${this.getIconColor(alertVariant)}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            ${this.getIconPath(alertVariant)}
                        </svg>
                    </div>
                    <div class="ml-3 flex-1">
                        <div data-toast-title class="hidden font-medium text-base"></div>
                        <div data-toast-message class="text-sm opacity-90"></div>
                        <div class="flex space-x-2 [&:not(:has(.hidden))]:mt-3">
                            <div data-toast-actions class="hidden"></div>
                        </div>
                    </div>
                    <div class="ml-auto pl-3">
                        <button type="button" class="inline-flex items-center justify-center rounded-md bg-transparent p-1.5 text-sm font-medium transition-colors hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${this.getIconColor(alertVariant)}" data-toast-dismiss="${toastId}" aria-label="Dismiss">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <span class="sr-only">Dismiss</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.updateToastContent(toastElement, data);

        return toastElement;
    }

    /**
     * Get variant classes for alert styling
     */
    private getVariantClasses(variant: string): string {
        const variants: Record<string, string> = {
            'info': 'bg-info-100 border-info-200 text-info-foreground',
            'success': 'bg-success-100 border-success-200 text-success-foreground',
            'warning': 'bg-warning-100 border-warning-200 text-warning-foreground',
            'danger': 'bg-danger-100 border-danger-200 text-danger-foreground',
            'neutral': 'bg-neutral-100 border-neutral-200 text-neutral-foreground'
        };
        return variants[variant] || variants.info;
    }

    /**
     * Get icon color for variant
     */
    private getIconColor(variant: string): string {
        const colors: Record<string, string> = {
            'info': 'text-info',
            'success': 'text-success',
            'warning': 'text-warning',
            'danger': 'text-danger',
            'neutral': 'text-neutral'
        };
        return colors[variant] || colors.info;
    }

    /**
     * Get icon SVG path for variant
     */
    private getIconPath(variant: string): string {
        const paths: Record<string, string> = {
            'info': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
            'success': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
            'warning': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>',
            'danger': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
            'neutral': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>'
        };
        return paths[variant] || paths.info;
    }

    /**
     * Dismiss a toast
     */
    public dismiss(id: string): boolean {
        const globalState = this.getGlobalState();
        if (!globalState) return false;

        const toast = globalState.toasts.get(id);

        if (!toast) {
            return false;
        }

        this.clearTimer(id);
        globalState.pausedTimers.delete(id);

        toast.setAttribute('data-toast-visible', 'false');
        toast.setAttribute('data-toast-exiting', 'true');

        // Use AnimationUtils for fade out animation
        AnimationUtils.fadeOut(toast, {
            scale: true,
            duration: 300,
            onComplete: () => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                globalState.toasts.delete(id);
            }
        });

        this.dispatchToastEvent('toast:dismiss', id);

        return true;
    }

    /**
     * Dismiss all visible toasts
     */
    public dismissAll(): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        globalState.toasts.forEach((toast, id) => {
            if (toast.getAttribute('data-toast-visible') === 'true') {
                this.dismiss(id);
            }
        });
    }

    /**
     * Helper methods for convenience
     */
    public success(message: string, options: Record<string, any> = {}): boolean {
        return this.show('success', { message, ...options });
    }

    public error(message: string, options: Record<string, any> = {}): boolean {
        return this.show('error', { message, ...options });
    }

    public warning(message: string, options: Record<string, any> = {}): boolean {
        return this.show('warning', { message, ...options });
    }

    public info(message: string, options: Record<string, any> = {}): boolean {
        return this.show('info', { message, ...options });
    }

    /**
     * Update toast content
     */
    private updateToastContent(toast: HTMLElement, data: Record<string, any>): void {
        const titleElement = DOMUtils.querySelector('[data-toast-title]', toast) as HTMLElement;
        const messageElement = DOMUtils.querySelector('[data-toast-message]', toast) as HTMLElement;
        const actionsElement = DOMUtils.querySelector('[data-toast-actions]', toast) as HTMLElement;

        if (titleElement && data.title) {
            titleElement.textContent = data.title;
            titleElement.classList.remove('hidden');
        } else if (titleElement) {
            titleElement.classList.add('hidden');
        }

        if (messageElement && data.message) {
            messageElement.textContent = data.message;
        }

        if (actionsElement && data.actions) {
            actionsElement.innerHTML = data.actions;
            actionsElement.classList.remove('hidden');
        } else if (actionsElement) {
            actionsElement.classList.add('hidden');
        }

        toast.setAttribute('data-toast-duration', String(data.duration || 5000));
        toast.setAttribute('data-toast-persistent', String(data.persistent === true));
    }

    /**
     * Reset toast content for reuse
     */
    private resetToastContent(toast: HTMLElement): void {
        const titleElement = DOMUtils.querySelector('[data-toast-title]', toast) as HTMLElement;
        const messageElement = DOMUtils.querySelector('[data-toast-message]', toast) as HTMLElement;
        const actionsElement = DOMUtils.querySelector('[data-toast-actions]', toast) as HTMLElement;

        if (titleElement) {
            titleElement.textContent = '';
            titleElement.classList.add('hidden');
        }

        if (messageElement) {
            messageElement.textContent = '';
        }

        if (actionsElement) {
            actionsElement.innerHTML = '';
            actionsElement.classList.add('hidden');
        }

        toast.removeAttribute('data-toast-duration');
        toast.removeAttribute('data-toast-persistent');
    }

    /**
     * Set auto-dismiss timer
     */
    private setTimer(id: string, duration: number): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        this.clearTimer(id);

        const toast = globalState.toasts.get(id);
        if (toast) {
            toast.setAttribute('data-toast-start-time', String(Date.now()));
        }

        const timer = AnimationUtils.createTimer(() => {
            this.dismiss(id);
        }, duration);

        globalState.timers.set(id, timer);
    }

    /**
     * Clear timer
     */
    private clearTimer(id: string): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        const timer = globalState.timers.get(id);
        if (timer) {
            AnimationUtils.clearTimer(timer);
            globalState.timers.delete(id);
        }
    }

    /**
     * Pause timer (on hover)
     */
    private pauseTimer(id: string): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        const timer = globalState.timers.get(id);
        const toast = globalState.toasts.get(id);

        if (timer && toast) {
            AnimationUtils.pauseTimer(timer);
            const duration = parseInt(toast.getAttribute('data-toast-duration') || '5000');
            const startTime = parseInt(toast.getAttribute('data-toast-start-time') || '0');
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, duration - elapsed);

            globalState.pausedTimers.set(id, {
                remaining: remaining,
                startTime: Date.now()
            });
        }
    }

    /**
     * Resume timer (on mouse leave)
     */
    private resumeTimer(id: string): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        const toast = globalState.toasts.get(id);
        const timer = globalState.timers.get(id);
        const pausedInfo = globalState.pausedTimers.get(id);

        if (toast && timer) {
            const persistent = toast.getAttribute('data-toast-persistent') === 'true';

            if (!persistent) {
                AnimationUtils.resumeTimer(timer);
                globalState.pausedTimers.delete(id);
            }
        } else if (toast && pausedInfo) {
            const persistent = toast.getAttribute('data-toast-persistent') === 'true';
            if (!persistent && pausedInfo.remaining > 0) {
                this.setTimer(id, pausedInfo.remaining);
                globalState.pausedTimers.delete(id);
            }
        }
    }

    /**
     * Dispatch custom toast events
     */
    private dispatchToastEvent(eventName: string, toastId: string, data: Record<string, any> = {}): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        const eventData = { id: toastId, toast: toastId, ...data };

        EventUtils.dispatchCustomEvent(document, eventName, eventData, {
            bubbles: true,
            cancelable: true
        });

        const toast = globalState.toasts.get(toastId);
        if (toast) {
            EventUtils.dispatchCustomEvent(toast, eventName, eventData, {
                bubbles: true,
                cancelable: true
            });
        }

        if (typeof window.Livewire !== 'undefined') {
            const livewireEventName = eventName.replace('toast:', 'toast');
            window.Livewire.dispatch(livewireEventName, eventData);
        }
    }

    /**
     * Get toast state (for external access)
     */
    public getToastState(toastId: string): any {
        const globalState = this.getGlobalState();
        if (!globalState) return null;

        const toast = globalState.toasts.get(toastId);
        if (!toast) return null;

        return {
            id: toastId,
            visible: toast.getAttribute('data-toast-visible') === 'true',
            variant: toast.getAttribute('data-toast-variant'),
            position: toast.getAttribute('data-toast-position'),
            duration: parseInt(toast.getAttribute('data-toast-duration') || '0'),
            persistent: toast.getAttribute('data-toast-persistent') === 'true'
        };
    }

    /**
     * Clean up ToastActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        globalState.timers.forEach(timer => AnimationUtils.clearTimer(timer));
        globalState.timers.clear();

        globalState.pausedTimers.clear();

        globalState.toasts.forEach((toast) => {
            this.resetToastContent(toast);
            toast.style.display = 'none';
            toast.setAttribute('data-toast-visible', 'false');
        });

        globalState.toasts.clear();
        globalState.containers.clear();
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ToastActions.getInstance().init();
    });
} else {
    ToastActions.getInstance().init();
}

// Export for global access
(window as any).ToastActions = ToastActions;

declare global {
    interface Window {
        ToastActions: typeof ToastActions;
        Livewire?: {
            on: (event: string, callback: (data: any) => void) => void;
            dispatch: (event: string, data?: any) => void;
            find: (id: string) => any;
        };
    }
}

export default ToastActions.getInstance();
