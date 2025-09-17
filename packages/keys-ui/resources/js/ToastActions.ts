/**
 * ToastActions handles toast notifications with positioning, animations, and Livewire integration
 * Provides programmatic control over toast notifications with auto-dismiss functionality
 */
export class ToastActions {
    private static instance: ToastActions | null = null;
    private toasts: Map<string, HTMLElement> = new Map();
    private containers: Map<string, HTMLElement> = new Map();
    private timers: Map<string, number> = new Map();

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
     * Initialize global event listeners for Livewire integration
     */
    private initializeGlobalListeners(): void {
        document.addEventListener('DOMContentLoaded', () => {
            this.discoverToasts();
            this.setupLivewireListeners();
        });
    }


    /**
     * Discover and register all toast elements
     */
    public discoverToasts(): void {
        const toastElements = document.querySelectorAll('[data-toast]');

        toastElements.forEach((toast) => {
            if (toast instanceof HTMLElement && toast.id) {
                this.registerToast(toast.id, toast);
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

        // Handle dismiss button clicks
        toast.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;

            if (target.hasAttribute('data-toast-dismiss')) {
                const dismissId = target.getAttribute('data-toast-dismiss');
                if (dismissId) {
                    this.dismiss(dismissId);
                }
            }

            // Handle action button clicks
            if (target.hasAttribute('data-toast-action')) {
                const action = target.getAttribute('data-toast-action');
                if (action) {
                    this.dispatchToastEvent('toast:action', toastId, { action });
                }
            }
        });

        // Pause timer on hover
        toast.addEventListener('mouseenter', () => {
            this.pauseTimer(toastId);
        });

        // Resume timer on mouse leave
        toast.addEventListener('mouseleave', () => {
            this.resumeTimer(toastId);
        });
    }

    /**
     * Set up Livewire event listeners if available
     */
    private setupLivewireListeners(): void {
        if (typeof window.Livewire !== 'undefined') {
            // Listen for global toast control events
            window.Livewire.on('showToast', (data: any) => {
                const variant = data.variant || 'info';
                this.show(variant, data);
            });

            window.Livewire.on('hideToast', (data: any) => {
                if (data.id) {
                    this.dismiss(data.id);
                } else {
                    // Dismiss all toasts if no specific ID
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
        const toastId = `toast-${variant}-${position}`;
        const toast = document.getElementById(toastId);

        if (!toast) {
            console.warn(`Toast element with ID "${toastId}" not found`);
            return false;
        }

        // Update toast content
        this.updateToastContent(toast, data);

        // Show toast with animation
        toast.style.display = 'block';

        // Trigger animation
        requestAnimationFrame(() => {
            toast.setAttribute('data-toast-visible', 'true');
        });

        // Set up auto-dismiss timer
        const duration = data.duration || 5000;
        const persistent = data.persistent === true;

        if (!persistent && duration > 0) {
            this.setTimer(toastId, duration);
        }

        // Register for management
        this.toasts.set(toastId, toast);
        this.setupToastListeners(toast);

        // Dispatch show event
        this.dispatchToastEvent('toast:show', toastId, data);

        return true;
    }

    /**
     * Dismiss a toast
     */
    public dismiss(id: string): boolean {
        const toast = this.toasts.get(id);

        if (!toast) {
            console.warn(`Toast with ID "${id}" not found`);
            return false;
        }

        // Clear timer
        this.clearTimer(id);

        // Hide with animation
        toast.setAttribute('data-toast-visible', 'false');

        // Remove from DOM after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);

        // Dispatch dismiss event
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
        // Find title and message elements within the Alert component
        const titleElement = toast.querySelector('[data-toast-title]') as HTMLElement;
        const messageElement = toast.querySelector('[data-toast-message]') as HTMLElement;
        const actionsElement = toast.querySelector('[data-toast-actions]') as HTMLElement;

        // Update title
        if (titleElement && data.title) {
            titleElement.textContent = data.title;
            titleElement.classList.remove('hidden');
        } else if (titleElement) {
            titleElement.classList.add('hidden');
        }

        // Update message
        if (messageElement && data.message) {
            messageElement.textContent = data.message;
        }

        // Update actions
        if (actionsElement && data.actions) {
            actionsElement.innerHTML = data.actions;
            actionsElement.classList.remove('hidden');
        } else if (actionsElement) {
            actionsElement.classList.add('hidden');
        }
    }

    /**
     * Set auto-dismiss timer
     */
    private setTimer(id: string, duration: number): void {
        this.clearTimer(id);

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
        // For now, just clear the timer - would need more complex logic for true pause/resume
        this.clearTimer(id);
    }

    /**
     * Resume timer (on mouse leave)
     */
    private resumeTimer(id: string): void {
        const toast = this.toasts.get(id);
        if (toast) {
            const duration = parseInt(toast.getAttribute('data-toast-duration') || '5000');
            const persistent = toast.getAttribute('data-toast-persistent') === 'true';

            if (!persistent && duration > 0) {
                // Resume with remaining time (simplified - just restart full duration)
                this.setTimer(id, duration);
            }
        }
    }

    /**
     * Dispatch custom toast events
     */
    private dispatchToastEvent(eventName: string, toastId: string, data: Record<string, any> = {}): void {
        // Dispatch DOM event
        const event = new CustomEvent(eventName, {
            detail: { id: toastId, toast: toastId, ...data }
        });
        document.dispatchEvent(event);

        // Dispatch to specific toast element
        const toast = this.toasts.get(toastId);
        if (toast) {
            toast.dispatchEvent(event);
        }

        // Dispatch Livewire event if available
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
        this.toasts.clear();
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();

        console.log('ToastActions destroyed');
    }
}

// Global instance for direct access
export const toastActions = ToastActions.getInstance();

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    toastActions.discoverToasts();

    // Make available globally for debugging
    (window as any).ToastActions = ToastActions;
}

// Type declarations for Livewire integration
declare global {
    interface Window {
        Livewire?: {
            on: (event: string, callback: (data: any) => void) => void;
            dispatch: (event: string, data?: any) => void;
        };
    }
}