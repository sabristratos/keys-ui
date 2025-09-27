/**
 * ToastActions handles toast notifications with positioning, animations, and Livewire integration
 * Provides programmatic control over toast notifications with auto-dismiss functionality
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';

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
        // Toast dismiss buttons - target dialogs specifically
        EventUtils.handleDelegatedClick('[data-toast-dismiss]', (dismissButton, event) => {
            const dismissId = dismissButton.getAttribute('data-toast-dismiss');
            if (dismissId) {
                event.preventDefault();
                event.stopPropagation();
                this.dismiss(dismissId);
            }
        });

        // Handle dialog close events
        EventUtils.handleDelegatedEvent('close', 'dialog[data-keys-toast]', (dialog) => {
            const id = dialog.id;
            if (id) {
                this.dispatchToastEvent('toast:close', id);
            }
        });

        // Toast action buttons - target within dialogs
        EventUtils.handleDelegatedClick('[data-toast-action]', (actionButton, event) => {
            const action = actionButton.getAttribute('data-toast-action');
            const toast = DOMUtils.findClosest(actionButton, 'dialog[data-keys-toast]');
            if (action && toast) {
                event.preventDefault();
                event.stopPropagation();
                this.dispatchToastEvent('toast:action', toast.id, { action });
            }
        });

        // Pause/resume timers on hover - target dialog elements
        EventUtils.handleDelegatedEvent('mouseenter', 'dialog[data-keys-toast]', (toast) => {
            this.pauseTimer(toast.id);
        });

        EventUtils.handleDelegatedEvent('mouseleave', 'dialog[data-keys-toast]', (toast) => {
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

                    // Check for toast containers and dialogs within the added node
                    const containers = element.querySelectorAll('[data-toast-container]');
                    const toasts = element.querySelectorAll('dialog[data-keys-toast]');

                    if (containers.length > 0 || toasts.length > 0) {
                        this.discoverToasts();
                    }
                }
            });
        });
    }

    /**
     * Discover and register toast containers and existing toasts
     */
    public discoverToasts(): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        // Discover containers
        DOMUtils.findByDataAttribute('toast-container').forEach(container => {
            const position = container.getAttribute('data-toast-container');
            if (position) {
                globalState.containers.set(position, container);
            }
        });

        // Discover existing toast dialogs
        document.querySelectorAll('dialog[data-keys-toast]').forEach(toastDialog => {
            if (toastDialog instanceof HTMLDialogElement) {
                const id = toastDialog.id;
                if (id) {
                    globalState.toasts.set(id, toastDialog);
                    this.setupToastListeners(toastDialog);
                }
            }
        });
    }

    /**
     * Get global toast state
     */
    private getGlobalState(): ToastState | null {
        return this.getState(document.documentElement) || null;
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

        // Add toast to container or create dynamic container
        if (container) {
            container.appendChild(toast);
        } else {
            // Create a new container if none exists for this position
            const newContainer = document.createElement('div');
            newContainer.className = this.getContainerClasses(position);
            newContainer.setAttribute('data-toast-container', position);
            newContainer.appendChild(toast);
            document.body.appendChild(newContainer);

            // Register the new container
            globalState.containers.set(position, newContainer);
        }

        // Show toast using dialog API
        if (toast instanceof HTMLDialogElement) {
            toast.show(); // Use show() instead of showModal() to avoid backdrop
        }
        toast.setAttribute('data-toast-visible', 'true');

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
     * Create a toast dialog element dynamically to match Blade template
     */
    private createToastElement(toastId: string, variant: string, position: string, data: Record<string, any>): HTMLDialogElement {
        const alertVariant = variant === 'error' ? 'danger' : variant;

        // Create dialog element
        const toastDialog = document.createElement('dialog') as HTMLDialogElement;

        // Set dialog classes and attributes to match Blade template
        toastDialog.className = this.getDialogClasses(position, alertVariant);
        toastDialog.setAttribute('data-keys-toast', 'true');
        toastDialog.setAttribute('data-variant', variant);
        toastDialog.setAttribute('data-position', position);
        toastDialog.setAttribute('data-element-type', 'dialog');
        toastDialog.setAttribute('data-dismissible', 'true');
        toastDialog.setAttribute('role', 'alert');
        toastDialog.setAttribute('aria-live', 'assertive');
        toastDialog.id = toastId;

        // Set ARIA labels
        if (data.title) {
            toastDialog.setAttribute('aria-labelledby', `${toastId}-title`);
            toastDialog.setAttribute('data-has-title', 'true');
        }
        toastDialog.setAttribute('aria-describedby', `${toastId}-message`);

        // Create HTML that matches Blade template structure
        toastDialog.innerHTML = `
            <div class="p-4 space-y-3">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 mt-0.5">
                        <svg class="w-5 h-5 ${this.getIconColor(alertVariant)}" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-icon="true">
                            ${this.getIconPath(alertVariant)}
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 id="${toastId}-title" class="hidden font-semibold text-sm leading-5 mb-1"></h3>
                        <div id="${toastId}-message" class="text-sm opacity-90 leading-5"></div>
                    </div>
                    <div class="flex-shrink-0">
                        <button type="button"
                                class="inline-flex items-center justify-center rounded-md bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-6 w-6 text-xs hover:bg-surface active:bg-muted focus:ring-brand text-current opacity-60 hover:opacity-100 -m-1"
                                data-keys-button="true"
                                data-variant="ghost"
                                data-size="xs"
                                data-element-type="button"
                                data-icon-only="true"
                                data-has-icon="true"
                                data-toast-dismiss="${toastId}"
                                aria-label="Dismiss notification">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <span class="sr-only">Dismiss</span>
                        </button>
                    </div>
                </div>
                <div class="hidden flex gap-2 pt-1" data-toast-actions></div>
            </div>
        `;

        this.updateToastContent(toastDialog, data);

        return toastDialog;
    }

    /**
     * Get container classes for toast positioning
     */
    private getContainerClasses(position: string): string {
        const base = 'fixed z-50';

        return position === 'top-left' ? `${base} top-4 left-4` :
               position === 'top-right' ? `${base} top-4 right-4` :
               position === 'top-center' ? `${base} top-4 left-1/2 -translate-x-1/2` :
               position === 'bottom-left' ? `${base} bottom-4 left-4` :
               position === 'bottom-right' ? `${base} bottom-4 right-4` :
               position === 'bottom-center' ? `${base} bottom-4 left-1/2 -translate-x-1/2` :
               `${base} top-4 right-4`;
    }

    /**
     * Get dialog classes for toast styling to match Blade template
     */
    private getDialogClasses(position: string, variant: string): string {
        let classes = 'max-w-sm w-full p-0 m-0 border rounded-lg shadow-lg backdrop:bg-transparent transition-all duration-300 ease-out';

        // Initial state (hidden)
        classes += ' translate-y-2 opacity-0 scale-95';

        // Open state animations
        classes += ' open:translate-y-0 open:opacity-100 open:scale-100';

        // Position-specific animations
        if (position.startsWith('bottom')) {
            classes += ' -translate-y-2 open:translate-y-0';
        }

        // Hover effects
        classes += ' hover:shadow-xl hover:-translate-y-1 focus-within:shadow-xl focus-within:-translate-y-1';

        // Variant styling to match Blade template
        classes += ' ' + this.getVariantClasses(variant);

        return classes;
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

        // Close dialog and remove from DOM
        if (toast instanceof HTMLDialogElement) {
            toast.close();
        }

        // Use timeout to allow exit animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            globalState.toasts.delete(id);
        }, 300); // Match transition duration

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
            // Update ARIA attributes
            toast.setAttribute('data-has-title', 'true');
        } else if (titleElement) {
            titleElement.classList.add('hidden');
            toast.removeAttribute('data-has-title');
        }

        if (messageElement && data.message) {
            messageElement.textContent = data.message;
            toast.setAttribute('data-has-content', 'true');
        }

        if (actionsElement && data.actions) {
            actionsElement.innerHTML = data.actions;
            actionsElement.classList.remove('hidden');
        } else if (actionsElement) {
            actionsElement.classList.add('hidden');
        }

        // Update data attributes
        toast.setAttribute('data-timeout', String(data.duration || 5000));
        if (data.persistent === true) {
            toast.setAttribute('data-persistent', 'true');
        }
        if (data.duration > 0 && !data.persistent) {
            toast.setAttribute('data-auto-hide', 'true');
        }
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

        toast.removeAttribute('data-timeout');
        toast.removeAttribute('data-persistent');
        toast.removeAttribute('data-auto-hide');
        toast.removeAttribute('data-has-title');
        toast.removeAttribute('data-has-content');
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

        const timer = setTimeout(() => {
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
            clearTimeout(timer);
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
            // Clear current timer and calculate remaining time
            const duration = parseInt(toast.getAttribute('data-timeout') || '5000');
            const startTime = parseInt(toast.getAttribute('data-toast-start-time') || '0');
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, duration - elapsed);

            this.clearTimer(id);
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
            const persistent = toast.getAttribute('data-persistent') === 'true';

            if (!persistent) {
                // Timer already running, no need to resume
                globalState.pausedTimers.delete(id);
            }
        } else if (toast && pausedInfo) {
            const persistent = toast.getAttribute('data-persistent') === 'true';
            const autoHide = toast.getAttribute('data-auto-hide') === 'true';

            if (!persistent && autoHide && pausedInfo.remaining > 0) {
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

        EventUtils.dispatchCustomEvent(document.documentElement, eventName, eventData, {
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
            open: toast instanceof HTMLDialogElement ? toast.open : false,
            variant: toast.getAttribute('data-variant'),
            position: toast.getAttribute('data-position'),
            duration: parseInt(toast.getAttribute('data-timeout') || '0'),
            persistent: toast.getAttribute('data-persistent') === 'true',
            autoHide: toast.getAttribute('data-auto-hide') === 'true',
            hasTitle: toast.getAttribute('data-has-title') === 'true',
            hasContent: toast.getAttribute('data-has-content') === 'true'
        };
    }

    /**
     * Clean up ToastActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        globalState.timers.forEach(timer => clearTimeout(timer));
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
const toastActionsInstance = ToastActions.getInstance();
(window as any).ToastActions = toastActionsInstance;

declare global {
    interface Window {
        ToastActions: ToastActions;
        Livewire?: {
            on: (event: string, callback: (data: any) => void) => void;
            dispatch: (event: string, data?: any) => void;
            find: (id: string) => any;
        };
    }
}

export default ToastActions.getInstance();
