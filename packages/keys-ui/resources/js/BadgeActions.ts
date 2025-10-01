/**
 * BadgeActions - Handles interactive actions for badge components
 *
 * Provides functionality for:
 * - Dismiss badges with smooth animations
 * - Custom badge callbacks
 * - Accessibility support
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';

interface BadgeActionEvent {
    badge: HTMLElement;
    action: string;
}

export class BadgeActions extends BaseActionClass {
    /**
     * Initialize badge elements - required by BaseActionClass
     */
    protected initializeElements(): void {
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        EventUtils.handleDelegatedClick('[data-dismiss-target]', (button, event) => {
            event.preventDefault();
            this.handleDismissClick(button as HTMLButtonElement);
        });

        EventUtils.handleDelegatedKeydown('[data-dismiss-target]', (button, event) => {
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
        const badge = this.findBadgeForButton(button);
        if (!badge) return;

        this.dismissBadge(badge);
        this.dispatchBadgeEvent(badge, 'dismiss');
    }

    /**
     * Find the badge element associated with a dismiss button
     */
    private findBadgeForButton(button: HTMLButtonElement): HTMLElement | null {
        const target = button.getAttribute('data-dismiss-target');
        if (!target) return null;

        const targetId = target.startsWith('#') ? target.slice(1) : target;
        return DOMUtils.querySelector(`#${targetId}`);
    }

    /**
     * Dismiss a badge with smooth animation
     */
    public dismissBadge(badge: HTMLElement): void {
        badge.classList.add('badge-dismissing');

        badge.style.transition = 'all 250ms ease-out';
        badge.style.transform = 'scale(0.8)';
        badge.style.opacity = '0';

        setTimeout(() => {
            if (badge.parentNode) {
                badge.parentNode.removeChild(badge);
            }
        }, 250);
    }

    /**
     * Show a badge programmatically
     */
    public showBadge(badge: HTMLElement): void {
        badge.style.display = 'inline-flex';
        badge.style.opacity = '0';
        badge.style.transform = 'scale(0.8)';

        setTimeout(() => {
            badge.style.transition = 'all 250ms ease-out';
            badge.style.opacity = '1';
            badge.style.transform = 'scale(1)';

            this.dispatchBadgeEvent(badge, 'show');
        }, 10);
    }

    /**
     * Create and show a new badge dynamically
     */
    public createBadge(options: {
        variant?: string;
        color?: string;
        size?: string;
        text: string;
        icon?: string;
        dismissible?: boolean;
        container?: HTMLElement;
    }): HTMLElement {
        const {
            variant = 'simple',
            color = 'blue',
            size = 'sm',
            text,
            icon,
            dismissible = false,
            container = document.body
        } = options;

        const badge = document.createElement(dismissible ? 'button' : 'span');
        const badgeId = dismissible ? `badge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : undefined;

        badge.className = this.getBadgeClasses(variant, color, size);

        if (badgeId) {
            badge.id = badgeId;
        }

        if (dismissible) {
            badge.setAttribute('type', 'button');
            badge.setAttribute('data-dismiss-target', `#${badgeId}`);
            badge.setAttribute('aria-label', 'Remove badge');
        }

        const badgeContent = this.buildBadgeContent(text, icon, dismissible);
        badge.innerHTML = badgeContent;

        container.appendChild(badge);

        badge.style.opacity = '0';
        badge.style.transform = 'scale(0.8)';

        setTimeout(() => {
            this.showBadge(badge);
        }, 10);

        this.dispatchBadgeEvent(badge, 'create');

        return badge;
    }

    /**
     * Get CSS classes for badge
     */
    private getBadgeClasses(variant: string, color: string, size: string): string {
        const baseClasses = 'inline-flex items-center font-medium';

        const sizeClasses = {
            'xs': 'px-1.5 py-0.5 text-xs',
            'sm': 'px-2.5 py-0.5 text-xs',
            'md': 'px-3 py-1 text-sm'
        };

        const shapeClasses = {
            'simple': 'rounded-full',
            'chip': 'rounded-sm',
            'subtle': ''
        };

        const colorClasses = this.getColorClasses(variant, color);

        return `${baseClasses} ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.sm} ${shapeClasses[variant as keyof typeof shapeClasses] || shapeClasses.simple} ${colorClasses}`;
    }

    /**
     * Get color classes for badge
     */
    private getColorClasses(variant: string, color: string): string {
        if (variant === 'subtle') {
            const subtleColors = {
                'brand': 'text-brand',
                'success': 'text-success',
                'warning': 'text-warning',
                'danger': 'text-danger',
                'neutral': 'text-neutral',
                'blue': 'text-blue-600',
                'green': 'text-green-600',
                'red': 'text-red-600',
                'purple': 'text-purple-600',
                'yellow': 'text-yellow-600'
            };
            return subtleColors[color as keyof typeof subtleColors] || subtleColors.blue;
        }

        const colors = {
            'brand': 'bg-brand/10 text-brand',
            'success': 'bg-success/10 text-success',
            'warning': 'bg-warning/10 text-warning',
            'danger': 'bg-danger/10 text-danger',
            'neutral': 'bg-neutral/10 text-neutral',
            'blue': 'bg-blue-500/10 text-blue-600',
            'green': 'bg-green-500/10 text-green-600',
            'red': 'bg-red-500/10 text-red-600',
            'purple': 'bg-purple-500/10 text-purple-600',
            'yellow': 'bg-yellow-500/10 text-yellow-600'
        };

        return colors[color as keyof typeof colors] || colors.blue;
    }

    /**
     * Build badge content HTML
     */
    private buildBadgeContent(text: string, icon?: string, dismissible?: boolean): string {
        let content = '';

        if (icon) {
            content += `<svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <!-- Icon would be rendered here -->
            </svg>`;
        }

        content += text;

        if (dismissible) {
            content += `<svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>`;
        }

        return content;
    }

    /**
     * Dispatch custom event for badge action
     */
    private dispatchBadgeEvent(badge: HTMLElement, action: string): void {
        EventUtils.dispatchCustomEvent(badge, 'badge-action', {
            badge,
            action
        } as BadgeActionEvent);

        EventUtils.dispatchCustomEvent(document.body, 'badge-action', {
            badge,
            action
        } as BadgeActionEvent);
    }

    /**
     * Add a custom badge action handler with automatic cleanup
     */
    public addActionHandler(action: string, handler: (badge: HTMLElement) => void): () => void {
        return EventUtils.addEventListener(document, 'badge-action', (event) => {
            const customEvent = event as CustomEvent<BadgeActionEvent>;
            if (customEvent.detail.action === action) {
                handler(customEvent.detail.badge);
            }
        });
    }

    /**
     * Dismiss all badges of a specific color
     */
    public dismissAllByColor(color: string): void {
        const badges = DOMUtils.querySelectorAll(`[data-dismissible="true"][class*="${color}"]`);
        badges.forEach((badge) => {
            this.dismissBadge(badge as HTMLElement);
        });
    }

    /**
     * Dismiss all dismissible badges
     */
    public dismissAll(): void {
        const badges = DOMUtils.querySelectorAll('[data-dismiss-target]');
        badges.forEach((button) => {
            const badge = this.findBadgeForButton(button as HTMLButtonElement);
            if (badge) {
                this.dismissBadge(badge);
            }
        });
    }

    /**
     * Clean up BadgeActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
    }
}

export default BadgeActions.getInstance();