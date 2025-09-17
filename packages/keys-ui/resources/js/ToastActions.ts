/**
 * ToastActions handles toast notifications with positioning, animations, and Livewire integration
 * Provides programmatic control over toast notifications with auto-dismiss functionality
 */
export class ToastActions {
    private static instance: ToastActions | null = null;
    private toasts: Map<string, HTMLElement> = new Map();
    private containers: Map<string, HTMLElement> = new Map();
    private timers: Map<string, number> = new Map();
    private pausedTimers: Map<string, { remaining: number, startTime: number }> = new Map();
    private toastCounter: number = 0;

    private constructor() {
        this.initializeGlobalListeners();
    }

    public static getInstance(): ToastActions {
        if (!ToastActions.instance) {
            ToastActions.instance = new ToastActions();
        }
        return ToastActions.instance;
    }

    /**
     * Initialize ToastActions and set up global listeners
     */
    public init(): void {
        this.initializeGlobalListeners();
    }

    /**
     * Initialize global event listeners for Livewire integration
     */
    private initializeGlobalListeners(): void {
        document.addEventListener('DOMContentLoaded', () => {
            this.discoverToasts();
            this.setupLivewireListeners();
        });
    }


    /**
     * Discover and register toast containers
     */
    public discoverToasts(): void {
        const toastContainers = document.querySelectorAll('[data-toast-container]');

        toastContainers.forEach((container) => {
            if (container instanceof HTMLElement) {
                const position = container.getAttribute('data-toast-container');
                if (position) {
                    this.containers.set(position, container);
                }
            }
        });
    }

    /**
     * Register a toast element for management
     */
    public registerToast(id: string, toast: HTMLElement): void {
        this.toasts.set(id, toast);
        this.setupToastListeners(toast);
    }

    /**
     * Set up individual toast event listeners
     */
    private setupToastListeners(toast: HTMLElement): void {
        const toastId = toast.id;

        toast.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;

            const dismissButton = target.closest('[data-toast-dismiss]') as HTMLElement;
            if (dismissButton) {
                const dismissId = dismissButton.getAttribute('data-toast-dismiss');
                if (dismissId) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.dismiss(dismissId);
                }
                return;
            }

            const actionButton = target.closest('[data-toast-action]') as HTMLElement;
            if (actionButton) {
                const action = actionButton.getAttribute('data-toast-action');
                if (action) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.dispatchToastEvent('toast:action', toastId, { action });
                }
            }
        });

        toast.addEventListener('mouseenter', () => {
            this.pauseTimer(toastId);
        });

        toast.addEventListener('mouseleave', () => {
            this.resumeTimer(toastId);
        });
    }

    /**
     * Set up Livewire event listeners if available
     */
    private setupLivewireListeners(): void {
        if (typeof window.Livewire !== 'undefined') {
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
    }

    /**
     * Show a toast programmatically
     */
    public show(variant: string, data: Record<string, any> = {}): boolean {
        const position = data.position || 'top-right';
        const container = this.containers.get(position);

        if (!container) {
            return false;
        }

        const toastId = `toast-${variant}-${position}-${++this.toastCounter}`;

        const toast = this.createToastElement(toastId, variant, position, data);

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.setAttribute('data-toast-visible', 'true');
        });

        const duration = data.duration || 5000;
        const persistent = data.persistent === true;

        if (!persistent && duration > 0) {
            this.setTimer(toastId, duration);
        }

        this.toasts.set(toastId, toast);
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
        const variants = {
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
        const colors = {
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
        const paths = {
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
        const toast = this.toasts.get(id);

        if (!toast) {
            return false;
        }

        this.clearTimer(id);
        this.pausedTimers.delete(id);

        toast.setAttribute('data-toast-visible', 'false');
        toast.setAttribute('data-toast-exiting', 'true');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }

            this.toasts.delete(id);
        }, 300);

        this.dispatchToastEvent('toast:dismiss', id);

        return true;
    }

    /**
     * Dismiss all visible toasts
     */
    public dismissAll(): void {
        this.toasts.forEach((toast, id) => {
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
        const titleElement = toast.querySelector('[data-toast-title]') as HTMLElement;
        const messageElement = toast.querySelector('[data-toast-message]') as HTMLElement;
        const actionsElement = toast.querySelector('[data-toast-actions]') as HTMLElement;

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
        const titleElement = toast.querySelector('[data-toast-title]') as HTMLElement;
        const messageElement = toast.querySelector('[data-toast-message]') as HTMLElement;
        const actionsElement = toast.querySelector('[data-toast-actions]') as HTMLElement;

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
        this.clearTimer(id);

        const toast = this.toasts.get(id);
        if (toast) {
            toast.setAttribute('data-toast-start-time', String(Date.now()));
        }

        const timer = window.setTimeout(() => {
            this.dismiss(id);
        }, duration);

        this.timers.set(id, timer);
    }

    /**
     * Clear timer
     */
    private clearTimer(id: string): void {
        const timer = this.timers.get(id);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(id);
        }
    }

    /**
     * Pause timer (on hover)
     */
    private pauseTimer(id: string): void {
        const timer = this.timers.get(id);
        const toast = this.toasts.get(id);

        if (timer && toast) {
            const duration = parseInt(toast.getAttribute('data-toast-duration') || '5000');
            const startTime = parseInt(toast.getAttribute('data-toast-start-time') || '0');
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, duration - elapsed);

            this.pausedTimers.set(id, {
                remaining: remaining,
                startTime: Date.now()
            });

            this.clearTimer(id);
        }
    }

    /**
     * Resume timer (on mouse leave)
     */
    private resumeTimer(id: string): void {
        const toast = this.toasts.get(id);
        const pausedInfo = this.pausedTimers.get(id);

        if (toast) {
            const persistent = toast.getAttribute('data-toast-persistent') === 'true';

            if (!persistent) {
                if (pausedInfo && pausedInfo.remaining > 0) {
                    this.setTimer(id, pausedInfo.remaining);
                    this.pausedTimers.delete(id);
                } else {
                    const duration = parseInt(toast.getAttribute('data-toast-duration') || '5000');
                    if (duration > 0) {
                        this.setTimer(id, duration);
                    }
                }
            }
        }
    }

    /**
     * Dispatch custom toast events
     */
    private dispatchToastEvent(eventName: string, toastId: string, data: Record<string, any> = {}): void {
        const event = new CustomEvent(eventName, {
            detail: { id: toastId, toast: toastId, ...data }
        });
        document.dispatchEvent(event);

        const toast = this.toasts.get(toastId);
        if (toast) {
            toast.dispatchEvent(event);
        }

        if (typeof window.Livewire !== 'undefined') {
            const livewireEventName = eventName.replace('toast:', 'toast');
            window.Livewire.dispatch(livewireEventName, { id: toastId, toast: toastId, ...data });
        }
    }

    /**
     * Get toast state (for external access)
     */
    public getToastState(toastId: string): any {
        const toast = this.toasts.get(toastId);
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
     * Destroy ToastActions and clean up
     */
    public destroy(): void {
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();

        this.pausedTimers.clear();

        this.toasts.forEach((toast) => {
            this.resetToastContent(toast);
            toast.style.display = 'none';
            toast.setAttribute('data-toast-visible', 'false');
        });

        this.toasts.clear();
        this.containers.clear();

    }
}

export const toastActions = ToastActions.getInstance();

if (typeof window !== 'undefined') {
    toastActions.discoverToasts();

    (window as any).ToastActions = ToastActions;
}

declare global {
    interface Window {
        Livewire?: {
            on: (event: string, callback: (data: any) => void) => void;
            dispatch: (event: string, data?: any) => void;
        };
    }
}
