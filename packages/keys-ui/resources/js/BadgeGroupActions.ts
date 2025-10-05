/**
 * BadgeGroupActions - Handles interactive actions for badge group components
 *
 * Provides functionality for:
 * - Group-level badge management (Clear All)
 * - Max badge limiting with "+N more" indicators
 * - Size inheritance propagation to child badges
 * - Group action events and callbacks
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import BadgeActions from './BadgeActions';

interface BadgeGroupActionEvent {
    group: HTMLElement;
    action: string;
    badges?: HTMLElement[];
}

export class BadgeGroupActions extends BaseActionClass {
    /**
     * Initialize badge group elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        const badgeGroups = DOMUtils.querySelectorAll('[data-keys-badge-group="true"]');
        badgeGroups.forEach((group) => {
            this.initializeBadgeGroup(group as HTMLElement);
        });
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        EventUtils.handleDelegatedClick('[data-badge-group-action="clear-all"]', (button, event) => {
            event.preventDefault();
            this.handleClearAllClick(button as HTMLButtonElement);
        });

        EventUtils.handleDelegatedKeydown('[data-badge-group-action="clear-all"]', (button, event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.handleClearAllClick(button as HTMLButtonElement);
            }
        });

        EventUtils.handleDelegatedClick('[data-badge-group-action="show-more"]', (button, event) => {
            event.preventDefault();
            this.handleShowMoreClick(button as HTMLButtonElement);
        });
    }

    /**
     * Initialize a single badge group
     */
    private initializeBadgeGroup(group: HTMLElement): void {
        this.applyMaxBadgeLogic(group);
        this.applySizeInheritance(group);
        this.dispatchGroupEvent(group, 'init');
    }

    /**
     * Apply max badge logic to limit visible badges
     */
    private applyMaxBadgeLogic(group: HTMLElement): void {
        const maxAttr = group.getAttribute('data-max');
        if (!maxAttr) return;

        const max = parseInt(maxAttr, 10);
        if (isNaN(max) || max < 1) return;

        const badgeContainer = (group.querySelector('[data-badge-container="true"]') as HTMLElement) || group;
        const badges = Array.from(badgeContainer.children).filter(child =>
            child.hasAttribute('data-keys-badge') || child.classList.contains('badge')
        ) as HTMLElement[];

        if (badges.length <= max) return;

        const hiddenBadges = badges.slice(max);
        hiddenBadges.forEach(badge => {
            badge.style.display = 'none';
            badge.setAttribute('data-hidden-by-max', 'true');
        });

        this.createOrUpdateMoreIndicator(group, badgeContainer, hiddenBadges.length);
    }

    /**
     * Create or update the "+N more" indicator
     */
    private createOrUpdateMoreIndicator(group: HTMLElement, container: HTMLElement, hiddenCount: number): void {
        const existingIndicator = container.querySelector('[data-badge-group-action="show-more"]');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const indicator = document.createElement('button');
        indicator.className = 'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-neutral/10 text-neutral hover:bg-neutral/20 transition-colors duration-200';
        indicator.setAttribute('data-badge-group-action', 'show-more');
        indicator.setAttribute('data-hidden-count', hiddenCount.toString());
        indicator.setAttribute('type', 'button');
        indicator.setAttribute('aria-label', `Show ${hiddenCount} more badges`);
        indicator.innerHTML = `+${hiddenCount} more`;

        container.appendChild(indicator);
    }

    /**
     * Apply size inheritance to child badges
     */
    private applySizeInheritance(group: HTMLElement): void {
        const groupSize = group.getAttribute('data-size');
        if (!groupSize) return;

        group.style.setProperty('--badge-group-size', groupSize);

        const badges = group.querySelectorAll('[data-keys-badge="true"]:not([data-size])');
        badges.forEach(badge => {
            badge.setAttribute('data-size', groupSize);

            this.updateBadgeSizeClasses(badge as HTMLElement, groupSize);
        });
    }

    /**
     * Update badge CSS classes for size inheritance
     */
    private updateBadgeSizeClasses(badge: HTMLElement, size: string): void {
        badge.classList.remove('px-1.5', 'py-0.5', 'text-xs', 'px-2.5', 'px-3', 'py-1', 'text-sm');

        const sizeClasses = {
            'xs': ['px-1.5', 'py-0.5', 'text-xs'],
            'sm': ['px-2.5', 'py-0.5', 'text-xs'],
            'md': ['px-3', 'py-1', 'text-sm']
        };

        const classes = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.sm;
        badge.classList.add(...classes);
    }

    /**
     * Handle "Clear All" button click
     */
    private handleClearAllClick(button: HTMLButtonElement): void {
        const group = this.findBadgeGroupForButton(button);
        if (!group) return;

        this.clearAllBadges(group);
        this.dispatchGroupEvent(group, 'clear-all');
    }

    /**
     * Handle "Show More" button click
     */
    private handleShowMoreClick(button: HTMLButtonElement): void {
        const group = this.findBadgeGroupForButton(button);
        if (!group) return;

        this.showAllBadges(group);
        this.dispatchGroupEvent(group, 'show-more');
    }

    /**
     * Find the badge group element associated with an action button
     */
    private findBadgeGroupForButton(button: HTMLButtonElement): HTMLElement | null {
        return button.closest('[data-keys-badge-group="true"]') as HTMLElement;
    }

    /**
     * Clear all dismissible badges in a group
     */
    public clearAllBadges(group: HTMLElement): void {
        const dismissibleBadges = group.querySelectorAll('[data-dismiss-target], [data-dismissible="true"]');

        dismissibleBadges.forEach((badge) => {
            if (badge.hasAttribute('data-dismiss-target')) {
                const targetId = badge.getAttribute('data-dismiss-target');
                if (targetId) {
                    const targetBadge = DOMUtils.querySelector(targetId.startsWith('#') ? targetId : `#${targetId}`);
                    if (targetBadge) {
                        BadgeActions.dismissBadge(targetBadge as HTMLElement);
                    }
                }
            } else {
                BadgeActions.dismissBadge(badge as HTMLElement);
            }
        });

        const moreIndicator = group.querySelector('[data-badge-group-action="show-more"]');
        if (moreIndicator) {
            moreIndicator.remove();
        }
    }

    /**
     * Show all hidden badges in a group
     */
    public showAllBadges(group: HTMLElement): void {
        const hiddenBadges = group.querySelectorAll('[data-hidden-by-max="true"]');

        hiddenBadges.forEach(badge => {
            (badge as HTMLElement).style.display = '';
            badge.removeAttribute('data-hidden-by-max');
        });

        const moreIndicator = group.querySelector('[data-badge-group-action="show-more"]');
        if (moreIndicator) {
            moreIndicator.remove();
        }

        group.setAttribute('data-all-badges-shown', 'true');
    }

    /**
     * Add a badge to a group programmatically
     */
    public addBadgeToGroup(group: HTMLElement, badgeOptions: {
        variant?: string;
        color?: string;
        size?: string;
        text: string;
        icon?: string;
        dismissible?: boolean;
    }): HTMLElement {
        const groupSize = group.getAttribute('data-size');
        const badgeSize = badgeOptions.size || groupSize || 'sm';

        const badge = BadgeActions.createBadge({
            ...badgeOptions,
            size: badgeSize,
            container: (group.querySelector('[data-badge-container="true"]') as HTMLElement) || group
        });

        this.applyMaxBadgeLogic(group);

        this.dispatchGroupEvent(group, 'badge-added', [badge]);

        return badge;
    }

    /**
     * Refresh a badge group (re-apply all logic)
     */
    public refreshBadgeGroup(group: HTMLElement): void {
        this.initializeBadgeGroup(group);
    }

    /**
     * Dispatch custom event for badge group action
     */
    private dispatchGroupEvent(group: HTMLElement, action: string, badges?: HTMLElement[]): void {
        EventUtils.dispatchCustomEvent(group, 'badge-group-action', {
            group,
            action,
            badges
        } as BadgeGroupActionEvent);

        EventUtils.dispatchCustomEvent(document.body, 'badge-group-action', {
            group,
            action,
            badges
        } as BadgeGroupActionEvent);
    }

    /**
     * Add a custom badge group action handler
     */
    public addGroupActionHandler(action: string, handler: (group: HTMLElement, badges?: HTMLElement[]) => void): () => void {
        return EventUtils.addEventListener(document, 'badge-group-action', (event) => {
            const customEvent = event as CustomEvent<BadgeGroupActionEvent>;
            if (customEvent.detail.action === action) {
                handler(customEvent.detail.group, customEvent.detail.badges);
            }
        });
    }

    /**
     * Initialize badge groups that are added dynamically
     */
    public initializeDynamicGroups(): void {
        const uninitializedGroups = DOMUtils.querySelectorAll('[data-keys-badge-group="true"]:not([data-group-initialized])');
        uninitializedGroups.forEach((group) => {
            this.initializeBadgeGroup(group as HTMLElement);
            group.setAttribute('data-group-initialized', 'true');
        });
    }

    /**
     * Clean up BadgeGroupActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
    }
}

export default BadgeGroupActions.getInstance();