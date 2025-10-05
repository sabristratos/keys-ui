/**
 * AlertActions - Handles interactive actions for alert components
 *
 * Provides functionality for:
 * - Dismiss alerts with smooth animations
 * - Custom alert callbacks
 * - Accessibility support
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';

interface AlertActionEvent {
    alert: HTMLElement;
    action: string;
}

export class AlertActions extends BaseActionClass {
    /**
     * Initialize alert elements - required by BaseActionClass
     */
    protected initializeElements(): void {
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        EventUtils.handleDelegatedClick('[data-dismiss-alert]', (button, event) => {
            event.preventDefault();
            this.handleDismissClick(button as HTMLButtonElement);
        });

        EventUtils.handleDelegatedKeydown('[data-dismiss-alert]', (button, event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.handleDismissClick(button as HTMLButtonElement);
            }
        });
    }

    /**
     * Handle dismiss button click
     */
    private handleDismissClick(button: HTMLButtonElement): void {
        const alert = this.findAlertForButton(button);
        if (!alert) return;

        this.dismissAlert(alert);
        this.dispatchAlertEvent(alert, 'dismiss');
    }

    /**
     * Find the alert element associated with a dismiss button
     */
    private findAlertForButton(button: HTMLButtonElement): HTMLElement | null {
        return DOMUtils.findClosest(button, '[data-dismissible="true"]');
    }

    /**
     * Dismiss an alert with smooth animation
     */
    public dismissAlert(alert: HTMLElement): void {
        alert.classList.add('alert-dismissing');

        // Simple fade out and remove
        alert.style.transition = 'opacity 300ms ease-out, transform 300ms ease-out';
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(100px)';

        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }

    /**
     * Show an alert programmatically
     */
    public showAlert(alert: HTMLElement): void {
        alert.style.display = 'block';

        // Simple slide in animation
        alert.style.transition = 'opacity 300ms ease-out, transform 300ms ease-out';
        alert.style.opacity = '1';
        alert.style.transform = 'translateX(0)';

        setTimeout(() => {
            this.dispatchAlertEvent(alert, 'show');
        }, 300);
    }

    /**
     * Create and show a new alert dynamically
     */
    public createAlert(options: {
        variant?: string;
        title?: string;
        message: string;
        dismissible?: boolean;
        duration?: number;
        container?: HTMLElement;
    }): HTMLElement {
        const {
            variant = 'info',
            title,
            message,
            dismissible = true,
            duration,
            container = document.body
        } = options;

        const alert = document.createElement('div');
        alert.className = this.getAlertClasses(variant);
        alert.setAttribute('role', 'alert');

        if (dismissible) {
            alert.setAttribute('data-dismissible', 'true');
        }

        const alertContent = this.buildAlertContent(variant, title, message, dismissible);
        alert.innerHTML = alertContent;

        container.appendChild(alert);

        alert.style.opacity = '0';
        alert.style.transform = 'translateX(100%)';

        setTimeout(() => {
            this.showAlert(alert);
        }, 10);

        if (duration && duration > 0) {
            setTimeout(() => {
                this.dismissAlert(alert);
            }, duration);
        }

        this.dispatchAlertEvent(alert, 'create');

        return alert;
    }

    /**
     * Get CSS classes for alert variant
     */
    private getAlertClasses(variant: string): string {
        const baseClasses = 'rounded-lg border p-4 space-y-3';
        const variantClasses = {
            'info': 'bg-info/5 border-info/20 text-info-foreground',
            'success': 'bg-success/5 border-success/20 text-success-foreground',
            'warning': 'bg-warning/5 border-warning/20 text-warning-foreground',
            'danger': 'bg-danger/5 border-danger/20 text-danger-foreground',
            'neutral': 'bg-neutral/5 border-neutral/20 text-neutral-foreground'
        };

        return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.info}`;
    }

    /**
     * Build alert content HTML
     */
    private buildAlertContent(variant: string, title?: string, message?: string, dismissible?: boolean): string {
        const iconName = this.getVariantIcon(variant);
        const iconColor = this.getVariantIconColor(variant);

        return `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="w-5 h-5 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${this.getIconSvg(iconName)}
                    </svg>
                </div>
                <div class="ml-3 flex-1">
                    ${title ? `<div class="text-base font-medium">${title}</div>` : ''}
                    <div class="text-sm opacity-90 ${title ? 'mt-1' : ''}">${message || ''}</div>
                </div>
                ${dismissible ? `
                    <div class="ml-auto pl-3">
                        <button type="button" data-dismiss-alert class="inline-flex rounded-md p-1 ${iconColor} hover:bg-current hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current" aria-label="Dismiss">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Get icon name for variant
     */
    private getVariantIcon(variant: string): string {
        const icons = {
            'info': 'information-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'danger': 'x-circle',
            'neutral': 'chat-bubble-left-ellipsis'
        };

        return icons[variant as keyof typeof icons] || icons.info;
    }

    /**
     * Get icon color for variant
     */
    private getVariantIconColor(variant: string): string {
        const colors = {
            'info': 'text-info',
            'success': 'text-success',
            'warning': 'text-warning',
            'danger': 'text-danger',
            'neutral': 'text-neutral'
        };

        return colors[variant as keyof typeof colors] || colors.info;
    }

    /**
     * Get SVG path for icon
     */
    private getIconSvg(iconName: string): string {
        const icons = {
            'information-circle': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
            'check-circle': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
            'exclamation-triangle': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>',
            'x-circle': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
            'chat-bubble-left-ellipsis': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>'
        };

        return icons[iconName as keyof typeof icons] || icons['information-circle'];
    }

    /**
     * Dispatch custom event for alert action
     */
    private dispatchAlertEvent(alert: HTMLElement, action: string): void {
        EventUtils.dispatchCustomEvent(alert, 'alert-action', {
            alert,
            action
        } as AlertActionEvent);

        EventUtils.dispatchCustomEvent(document.body, 'alert-action', {
            alert,
            action
        } as AlertActionEvent);
    }

    /**
     * Add a custom alert action handler with automatic cleanup
     */
    public addActionHandler(action: string, handler: (alert: HTMLElement) => void): () => void {
        return EventUtils.addEventListener(document, 'alert-action', (event) => {
            const customEvent = event as CustomEvent<AlertActionEvent>;
            if (customEvent.detail.action === action) {
                handler(customEvent.detail.alert);
            }
        });
    }

    /**
     * Dismiss all alerts of a specific variant
     */
    public dismissAllByVariant(variant: string): void {
        const alerts = DOMUtils.querySelectorAll(`[data-dismissible="true"][class*="${variant}"]`);
        alerts.forEach((alert) => {
            this.dismissAlert(alert as HTMLElement);
        });
    }

    /**
     * Dismiss all dismissible alerts
     */
    public dismissAll(): void {
        const alerts = DOMUtils.querySelectorAll('[data-dismissible="true"]');
        alerts.forEach((alert) => {
            this.dismissAlert(alert as HTMLElement);
        });
    }

    /**
     * Clean up AlertActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
    }
}

export default AlertActions.getInstance();
