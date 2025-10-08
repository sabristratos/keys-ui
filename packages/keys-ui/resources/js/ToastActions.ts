/**
 * ToastActions handles toast notifications with positioning, animations, and Livewire integration
 * Provides programmatic control over toast notifications with auto-dismiss functionality
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';

/**
 * Toast system configuration constants
 */
const TOAST_CONFIG = {
    DEFAULT_TIMEOUT: 5000,
    STACK_OFFSET: 72,
    ANIMATION_DURATION: 300,
    MAX_TOASTS: 10,
    POSITIONS: ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'] as const,
    VARIANTS: ['info', 'success', 'warning', 'danger', 'neutral'] as const
} as const;

/**
 * Toast selectors for DOM queries
 */
const SELECTORS = {
    TOAST: '[data-keys-toast="true"]',
    DISMISS_BUTTON: '[data-toast-dismiss]',
    ACTIONS_CONTAINER: '[data-toast-actions]',
    LIVEWIRE_COMPONENT: '[data-livewire-component]'
} as const;

/**
 * Toast configuration data structure
 */
export interface ToastData {
    title?: string;
    message: string;
    variant?: typeof TOAST_CONFIG.VARIANTS[number];
    position?: typeof TOAST_CONFIG.POSITIONS[number];
    duration?: number;
    persistent?: boolean;
    actions?: string;
    icon?: string;
}

/**
 * Toast options for programmatic creation
 */
export interface ToastOptions {
    position?: typeof TOAST_CONFIG.POSITIONS[number];
    duration?: number;
    persistent?: boolean;
    actions?: string;
    icon?: string;
}

/**
 * Internal toast state management
 */
interface ToastState {
    toasts: Map<string, HTMLElement>;
    timers: Map<string, number>;
    pausedTimers: Map<string, { remaining: number; startTime: number }>;
    toastCounter: number;
}

/**
 * Livewire toast event data
 */
interface LivewireToastData {
    variant: string;
    title?: string;
    message: string;
    position?: string;
    duration?: number;
    persistent?: boolean;
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
        const globalElement = document.documentElement;
        if (!this.hasState(globalElement)) {
            const state: ToastState = {
                toasts: new Map(),
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
        EventUtils.handleDelegatedClick(`${SELECTORS.TOAST}[popover] [data-keys-button]${SELECTORS.DISMISS_BUTTON}`, (dismissButton, event) => {
            const dismissId = dismissButton.getAttribute('data-toast-dismiss');
            if (dismissId) {
                event.preventDefault();
                event.stopPropagation();
                this.dismiss(dismissId);
            }
        });

        EventUtils.handleDelegatedEvent('toggle', `${SELECTORS.TOAST}[popover]`, (toast) => {
            const id = toast.id;
            if (id) {
                const isOpen = (toast as any).matches(':popover-open');
                this.dispatchToastEvent(isOpen ? 'toast:show' : 'toast:close', id);
            }
        });

        EventUtils.handleDelegatedClick(`${SELECTORS.TOAST}[popover] [data-toast-action]`, (actionButton, event) => {
            const action = actionButton.getAttribute('data-toast-action');
            const toast = DOMUtils.findClosest(actionButton, `${SELECTORS.TOAST}[popover]`);
            if (action && toast) {
                event.preventDefault();
                event.stopPropagation();
                this.dispatchToastEvent('toast:action', toast.id, { action });
            }
        });

        EventUtils.handleDelegatedEvent('mouseenter', `${SELECTORS.TOAST}[popover]`, (toast) => {
            this.pauseTimer(toast.id);
        });

        EventUtils.handleDelegatedEvent('mouseleave', `${SELECTORS.TOAST}[popover]`, (toast) => {
            this.resumeTimer(toast.id);
        });

        EventUtils.handleDelegatedEvent('keydown', `${SELECTORS.TOAST}[popover]`, (toast, event) => {
            const keyboardEvent = event as KeyboardEvent;
            if (keyboardEvent.key === 'Escape' && toast.hasAttribute('data-dismissible')) {
                keyboardEvent.preventDefault();
                this.dismiss(toast.id);
            }
        });
    }

    /**
     * Setup dynamic observer for new toasts - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    const toasts = element.querySelectorAll('[data-keys-toast][popover]');

                    if (toasts.length > 0) {
                        this.discoverToasts();
                    }
                }
            });
        });
    }

    /**
     * Discover and register existing toasts (no containers needed)
     */
    public discoverToasts(): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        document.querySelectorAll('[data-keys-toast][popover]').forEach(toastPopover => {
            const id = toastPopover.id;
            if (id) {
                globalState.toasts.set(id, toastPopover as HTMLElement);
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
     * @param variant Toast type (info, success, warning, danger, neutral)
     * @param data Toast configuration object
     * @returns Whether the toast was successfully created and shown
     */
    public show(variant: typeof TOAST_CONFIG.VARIANTS[number], data: ToastData = { message: '' }): boolean {
        const globalState = this.getGlobalState();
        if (!globalState) return false;

        const position = data.position || 'top-right';
        const toastId = `toast-${variant}-${position}-${++globalState.toastCounter}`;

        const toast = this.createToastElement(toastId, variant, position, data);

        const stackIndex = this.calculateStackPosition(position);
        const stackOffset = stackIndex * TOAST_CONFIG.STACK_OFFSET;
        toast.style.setProperty('--stack-offset', `${stackOffset}px`);

        document.body.appendChild(toast);

        this.showToastElement(toast);

        toast.setAttribute('data-toast-visible', 'true');

        const duration = data.duration || TOAST_CONFIG.DEFAULT_TIMEOUT;
        const persistent = data.persistent === true;

        if (!persistent && duration > 0) {
            this.setTimer(toastId, duration);
        }

        globalState.toasts.set(toastId, toast);

        this.dispatchToastEvent('toast:show', toastId, data);

        return true;
    }

    /**
     * Calculate stack position for toasts at a specific position
     */
    private calculateStackPosition(position: string): number {
        const globalState = this.getGlobalState();
        if (!globalState) return 0;

        let stackIndex = 0;
        globalState.toasts.forEach((toast) => {
            if (toast.getAttribute('data-position') === position &&
                toast.getAttribute('data-toast-visible') === 'true') {
                stackIndex++;
            }
        });

        return stackIndex;
    }

    /**
     * Show toast element using Popover API with fallback
     */
    private showToastElement(toast: HTMLElement): void {
        try {
            (toast as any).showPopover();
        } catch (error) {
            console.warn('Popover API not supported, using fallback display');
            toast.style.display = 'block';
        }
    }

    /**
     * Hide toast element using Popover API with fallback
     */
    private hideToastElement(toast: HTMLElement): void {
        try {
            (toast as any).hidePopover();
        } catch (error) {
            console.warn('Popover API hide failed, using manual hide');
            toast.style.display = 'none';
        }
    }

    /**
     * Create a toast popover element dynamically to match Blade template
     */
    private createToastElement(toastId: string, variant: string, position: string, data: Record<string, any>): HTMLElement {
        const alertVariant = variant === 'error' ? 'danger' : variant;

        const toastPopover = document.createElement('div') as HTMLElement;

        toastPopover.className = this.getPopoverClasses(position, alertVariant);
        toastPopover.setAttribute('data-keys-toast', 'true');
        toastPopover.setAttribute('data-variant', variant);
        toastPopover.setAttribute('data-position', position);
        toastPopover.setAttribute('data-element-type', 'popover');
        toastPopover.setAttribute('data-dismissible', 'true');
        toastPopover.setAttribute('data-has-icon', 'true');
        toastPopover.setAttribute('popover', 'manual');
        toastPopover.setAttribute('role', 'status');
        const ariaLive = (alertVariant === 'danger' || alertVariant === 'warning') ? 'assertive' : 'polite';
        toastPopover.setAttribute('aria-live', ariaLive);
        toastPopover.setAttribute('aria-atomic', 'true');
        toastPopover.id = toastId;

        if (data.title) {
            toastPopover.setAttribute('aria-labelledby', `${toastId}-title`);
            toastPopover.setAttribute('data-has-title', 'true');
        }
        toastPopover.setAttribute('aria-describedby', `${toastId}-message`);

        toastPopover.innerHTML = `
            <div class="px-4 pt-4 pb-3">
                <div class="flex ${data.title ? 'items-start' : 'items-center'} gap-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${this.getIconWrapperClasses(alertVariant)}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-icon="true">
                            ${this.getIconPath(alertVariant)}
                        </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 id="${toastId}-title" class="hidden text-sm text-heading font-semibold tracking-tight mb-1"></h3>
                        <div id="${toastId}-message" class="text-sm text-primary font-normal text-left leading-tight opacity-90"></div>
                    </div>
                    <div class="flex-shrink-0">
                        <button type="button"
                                class="inline-flex items-center justify-center rounded-md bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-6 w-6 text-xs hover:bg-elevation-1 active:bg-muted focus:ring-accent text-current opacity-60 hover:opacity-100 -m-1"
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
            </div>
        `;

        this.updateToastContent(toastPopover, data);

        return toastPopover;
    }


    /**
     * Get popover classes for toast styling - matches Blade template exactly
     */
    private getPopoverClasses(position: string, variant: string): string {
        let classes = 'max-w-sm w-fit h-fit rounded-lg shadow-lg text-primary z-[9999] p-0 overflow-visible opacity-100';

        classes += ' ' + this.getVariantClasses(variant);

        return classes;
    }

    /**
     * Get variant classes - adaptive backgrounds that switch between light and dark mode
     */
    private getVariantClasses(variant: string): string {
        const variants: Record<string, string> = {
            'info': 'border border-info bg-info-subtle',
            'success': 'border border-success bg-success-subtle',
            'warning': 'border border-warning bg-warning-subtle',
            'danger': 'border border-danger bg-danger-subtle',
            'neutral': 'border border-line bg-elevation-1'
        };
        return variants[variant] || variants.info;
    }

    /**
     * Get icon wrapper classes for variant - optimized for text contrast
     */
    private getIconWrapperClasses(variant: string): string {
        const wrapperClasses: Record<string, string> = {
            'info': 'bg-info text-white',
            'success': 'bg-success text-white',
            'warning': 'bg-warning text-black',
            'danger': 'bg-danger text-white',
            'neutral': 'bg-neutral text-white'
        };
        return wrapperClasses[variant] || wrapperClasses.info;
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

        const position = toast.getAttribute('data-position');

        this.clearTimer(id);
        globalState.pausedTimers.delete(id);

        toast.setAttribute('data-toast-visible', 'false');

        this.hideToastElement(toast);

        globalState.toasts.delete(id);

        if (position) {
            this.recalculateStackPositions(position);
        }

        window.setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, TOAST_CONFIG.ANIMATION_DURATION);

        this.dispatchToastEvent('toast:dismiss', id);

        return true;
    }

    /**
     * Recalculate stack positions for all toasts at a specific position
     */
    private recalculateStackPositions(position: string): void {
        const globalState = this.getGlobalState();
        if (!globalState) return;

        const toastsAtPosition: HTMLElement[] = [];

        globalState.toasts.forEach((toast) => {
            if (toast.getAttribute('data-position') === position &&
                toast.getAttribute('data-toast-visible') === 'true') {
                toastsAtPosition.push(toast);
            }
        });

        toastsAtPosition.forEach((toast, index) => {
            const stackOffset = index * TOAST_CONFIG.STACK_OFFSET;
            toast.style.setProperty('--stack-offset', `${stackOffset}px`);
        });
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
     * Convenience methods for common toast types
     */

    /**
     * Show a success toast
     * @param message Toast message
     * @param options Additional toast options
     * @returns Whether the toast was successfully created
     */
    public success(message: string, options: ToastOptions = {}): boolean {
        return this.show('success', { message, ...options });
    }

    /**
     * Show an error toast
     * @param message Toast message
     * @param options Additional toast options
     * @returns Whether the toast was successfully created
     */
    public error(message: string, options: ToastOptions = {}): boolean {
        return this.show('danger', { message, ...options });
    }

    /**
     * Show a warning toast
     * @param message Toast message
     * @param options Additional toast options
     * @returns Whether the toast was successfully created
     */
    public warning(message: string, options: ToastOptions = {}): boolean {
        return this.show('warning', { message, ...options });
    }

    /**
     * Show an info toast
     * @param message Toast message
     * @param options Additional toast options
     * @returns Whether the toast was successfully created
     */
    public info(message: string, options: ToastOptions = {}): boolean {
        return this.show('info', { message, ...options });
    }

    /**
     * Update toast content with provided data
     */
    private updateToastContent(toast: HTMLElement, data: Record<string, any>): void {
        const titleElement = toast.querySelector(`#${toast.id}-title`) as HTMLElement;
        const messageElement = toast.querySelector(`#${toast.id}-message`) as HTMLElement;
        const actionsElement = toast.querySelector('[data-toast-actions]') as HTMLElement;

        if (titleElement) {
            if (data.title) {
                titleElement.textContent = data.title;
                titleElement.classList.remove('hidden');
                toast.setAttribute('data-has-title', 'true');
            } else {
                titleElement.classList.add('hidden');
                toast.removeAttribute('data-has-title');
            }
        }

        if (messageElement && data.message) {
            messageElement.textContent = data.message;
        }

        if (actionsElement) {
            if (data.actions) {
                actionsElement.innerHTML = data.actions;
                actionsElement.classList.remove('hidden');
            } else {
                actionsElement.classList.add('hidden');
            }
        }

        const duration = data.duration || TOAST_CONFIG.DEFAULT_TIMEOUT;
        toast.setAttribute('data-timeout', String(duration));

        if (data.persistent === true) {
            toast.setAttribute('data-persistent', 'true');
        }

        if (duration > 0 && !data.persistent) {
            toast.setAttribute('data-auto-hide', 'true');
        }
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

        const timer = window.setTimeout(() => {
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
            window.clearTimeout(timer);
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
            const duration = parseInt(toast.getAttribute('data-timeout') || String(TOAST_CONFIG.DEFAULT_TIMEOUT));
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
            open: (toast as any).matches(':popover-open') || false,
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

        globalState.timers.forEach(timer => window.clearTimeout(timer));
        globalState.timers.clear();
        globalState.pausedTimers.clear();

        globalState.toasts.forEach((toast) => {
            this.hideToastElement(toast);
            toast.setAttribute('data-toast-visible', 'false');
        });

        globalState.toasts.clear();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ToastActions.getInstance().init();
    });
} else {
    ToastActions.getInstance().init();
}

const toastActionsInstance = ToastActions.getInstance();
(window as any).ToastActions = toastActionsInstance;

declare global {
    interface Window {
        ToastActions: ToastActions;
    }
}

export default ToastActions.getInstance();
