/**
 * DropdownActions - Handles interactive functionality for Dropdown components
 *
 * Provides functionality for:
 * - Dropdown open/close with keyboard navigation
 * - Smart closing behavior (menu items close, form controls stay open)
 * - Positioning and click-outside handling
 * - Focus management and accessibility
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';
import { RTLUtils } from './utils/RTLUtils';

interface DropdownState {
    isOpen: boolean;
    focusedIndex: number;
    menuItems: HTMLElement[];
    parent?: HTMLElement;
    children: HTMLElement[];
}

export class DropdownActions extends BaseActionClass<DropdownState> {


    /**
     * Initialize dropdown elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.findByDataAttribute('dropdown', 'true').forEach(dropdown => {
            this.initializeDropdown(dropdown);
        });

        DOMUtils.findByDataAttribute('submenu', 'true').forEach(submenu => {
            this.initializeDropdown(submenu);
        });
    }

    /**
     * Initialize a single dropdown element
     */
    private initializeDropdown(dropdownElement: HTMLElement): void {
        const state: DropdownState = {
            isOpen: false,
            focusedIndex: -1,
            menuItems: [],
            children: []
        };

        const parentSubmenu = DOMUtils.findClosest(dropdownElement, '[data-submenu="true"]');
        if (parentSubmenu && parentSubmenu !== dropdownElement) {
            state.parent = parentSubmenu as HTMLElement;
        }

        // Auto-wire user's trigger button to popover
        this.setupTriggerButton(dropdownElement);

        this.setState(dropdownElement, state);
        this.updateMenuItems(dropdownElement);
        this.initializeSubmenus(dropdownElement);
    }

    /**
     * Automatically add popovertarget and data-dropdown-trigger to user's button
     */
    private setupTriggerButton(dropdownElement: HTMLElement): void {
        // Find the popover trigger wrapper (created by popover component)
        const triggerWrapper = dropdownElement.previousElementSibling;
        if (!triggerWrapper || !triggerWrapper.hasAttribute('data-popover-trigger')) {
            return;
        }

        // Get the popover ID
        const popoverId = triggerWrapper.getAttribute('data-popover-trigger');
        if (!popoverId) {
            return;
        }

        // Find the first button inside the trigger wrapper
        const triggerButton = triggerWrapper.querySelector('button');
        if (!triggerButton) {
            return;
        }

        // Add popovertarget to make it trigger the popover
        triggerButton.setAttribute('popovertarget', popoverId);

        // Add data-dropdown-trigger for our event binding
        triggerButton.setAttribute('data-dropdown-trigger', '');

        // Set aria-expanded for accessibility
        triggerButton.setAttribute('aria-expanded', 'false');
    }

    /**
     * Initialize submenus within a dropdown
     */
    private initializeSubmenus(dropdownElement: HTMLElement): void {
        const submenus = DOMUtils.querySelectorAll('[data-submenu="true"]', dropdownElement);
        const state = this.getState(dropdownElement);

        if (state) {
            state.children = Array.from(submenus) as HTMLElement[];
            this.setState(dropdownElement, state);
        }

        submenus.forEach(submenu => {
            if (!this.hasState(submenu as HTMLElement)) {
                this.initializeDropdown(submenu as HTMLElement);
            }
        });
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Listen to the native popover toggle event instead of click events
        // This allows the browser's native Popover API to handle opening/closing
        EventUtils.addEventListener(document, 'toggle', (event) => {
            const dropdown = event.target as HTMLElement;
            if (dropdown && DOMUtils.hasDataAttribute(dropdown, 'dropdown', 'true')) {
                const state = this.getState(dropdown);
                if (!state) return;

                const isOpen = dropdown.matches(':popover-open');
                state.isOpen = isOpen;
                this.setState(dropdown, state);

                // Update aria-expanded on trigger
                const triggerWrapper = dropdown.previousElementSibling as HTMLElement;
                const trigger = triggerWrapper?.querySelector('[data-dropdown-trigger]') as HTMLElement;
                if (trigger) {
                    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                }

                if (isOpen) {
                    this.updateMenuItems(dropdown);
                    this.dispatchDropdownEvent(dropdown, 'dropdown:open');
                } else {
                    this.dispatchDropdownEvent(dropdown, 'dropdown:close');
                }
            }
        }, true);

        EventUtils.handleDelegatedClick('[data-submenu-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]', (element, event) => {
            if (element.matches('[data-submenu-trigger]')) {
                event.preventDefault();
                event.stopPropagation();
                const submenu = DOMUtils.findClosest(element, '[data-submenu="true"]');
                if (submenu && !this.isDisabled(submenu)) {
                    this.toggleSubmenu(submenu);
                }
                return;
            }

            if (element.matches('[data-menu-item]')) {
                const dropdown = DOMUtils.findClosest(element, '[data-dropdown="true"]');
                if (dropdown) {
                    const keepOpen = element.dataset.keepOpen === 'true';
                    if (!keepOpen) {
                        this.closeDropdown(dropdown);
                    }
                }
                return;
            }

            if (element.matches('[data-menu-checkbox], [data-menu-radio]')) {
                event.stopPropagation();
                const keepOpen = element.dataset.keepOpen !== 'false';
                if (!keepOpen) {
                    const dropdown = DOMUtils.findClosest(element, '[data-dropdown="true"]');
                    if (dropdown) {
                        this.closeDropdown(dropdown);
                    }
                }
                return;
            }

            if (element.matches('[data-dropdown-panel], [data-submenu-panel]')) {
                event.stopPropagation();
                return;
            }
        });

        EventUtils.addEventListener(document, 'click', (event) => {
            const target = event.target as Node;

            if (target && target instanceof Element) {
                const closestDropdownElement = target.closest('[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]');

                if (!closestDropdownElement) {
                    this.closeAllDropdowns();
                }
            }
        });

        // Improved hover behavior for submenus - immediate open, delayed close
        let hoverTimeout: number | null = null;

        EventUtils.addEventListener(document, 'mouseenter', (event) => {
            const submenuTrigger = DOMUtils.findClosest(event.target as Element, '[data-submenu-trigger]') as HTMLElement;
            if (submenuTrigger && !this.isMobile()) {
                // Clear any pending close timeout
                if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                    hoverTimeout = null;
                }

                const popoverTrigger = DOMUtils.findClosest(submenuTrigger, '[data-popover-trigger]') as HTMLElement;
                if (popoverTrigger) {
                    const popoverId = popoverTrigger.getAttribute('data-popover-trigger');
                    const popover = popoverId ? document.getElementById(popoverId) : null;

                    // Only open if not already open
                    if (popover && !popover.matches(':popover-open')) {
                        // Close sibling submenus in the same parent menu
                        const parentMenu = DOMUtils.findClosest(submenuTrigger, '[role="menu"]');
                        if (parentMenu) {
                            const siblingTriggers = DOMUtils.querySelectorAll('[data-submenu-trigger]', parentMenu);
                            siblingTriggers.forEach(trigger => {
                                if (trigger !== submenuTrigger) {
                                    const siblingPopoverId = trigger.getAttribute('data-popover-trigger');
                                    if (siblingPopoverId) {
                                        const siblingPopover = document.getElementById(siblingPopoverId);
                                        if (siblingPopover && siblingPopover.matches(':popover-open')) {
                                            // Skip animation when closing siblings to prevent flashing
                                            const originalTransition = (siblingPopover as HTMLElement).style.transition;
                                            (siblingPopover as HTMLElement).style.transition = 'none';
                                            (siblingPopover as any).hidePopover?.();
                                            // Reset transition after hide completes
                                            requestAnimationFrame(() => {
                                                (siblingPopover as HTMLElement).style.transition = originalTransition;
                                            });
                                        }
                                    }
                                }
                            });
                        }

                        // Open this submenu immediately
                        submenuTrigger.click();
                    }
                }
            }
        }, { capture: true });

        // Handle mouse leave to close submenus with a small delay
        EventUtils.addEventListener(document, 'mouseleave', (event) => {
            const submenuTrigger = DOMUtils.findClosest(event.target as Element, '[data-submenu-trigger]') as HTMLElement;
            if (submenuTrigger && !this.isMobile()) {
                const popoverTrigger = DOMUtils.findClosest(submenuTrigger, '[data-popover-trigger]') as HTMLElement;
                if (popoverTrigger) {
                    const popoverId = popoverTrigger.getAttribute('data-popover-trigger');
                    const popover = popoverId ? document.getElementById(popoverId) : null;

                    if (popover && popover.matches(':popover-open')) {
                        const relatedTarget = (event as any).relatedTarget as Element;

                        // Don't close if moving into the submenu panel itself
                        if (relatedTarget && (
                            DOMUtils.findClosest(relatedTarget, `#${popoverId}`) ||
                            relatedTarget.id === popoverId
                        )) {
                            return;
                        }

                        // Close with a small delay to allow moving to the submenu
                        hoverTimeout = window.setTimeout(() => {
                            // Check if mouse is now over the popover or another submenu trigger
                            if (popover.matches(':hover')) {
                                return;
                            }

                            // Check if mouse moved to a sibling submenu trigger
                            const hoveredElement = document.querySelector(':hover');
                            const hoveredSubmenuTrigger = hoveredElement ? DOMUtils.findClosest(hoveredElement, '[data-submenu-trigger]') : null;

                            if (!hoveredSubmenuTrigger || hoveredSubmenuTrigger === submenuTrigger) {
                                (popover as any).hidePopover?.();
                            }
                        }, 200);
                    }
                }
            }
        }, { capture: true });

        EventUtils.handleDelegatedKeydown('[data-dropdown="true"]', (dropdown, event) => {
            this.handleKeydown(dropdown, event);
        });
    }

    /**
     * Setup dynamic observer for new dropdowns - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    if (DOMUtils.hasDataAttribute(element, 'dropdown', 'true')) {
                        if (!this.hasState(element)) {
                            this.initializeDropdown(element);
                        }
                    }

                    if (DOMUtils.hasDataAttribute(element, 'submenu', 'true')) {
                        if (!this.hasState(element)) {
                            this.initializeDropdown(element);
                        }
                    }

                    const dropdowns = DOMUtils.findByDataAttribute('dropdown', 'true', element);
                    dropdowns.forEach(dropdown => {
                        if (!this.hasState(dropdown)) {
                            this.initializeDropdown(dropdown);
                        }
                    });

                    const submenus = DOMUtils.findByDataAttribute('submenu', 'true', element);
                    submenus.forEach(submenu => {
                        if (!this.hasState(submenu)) {
                            this.initializeDropdown(submenu);
                        }
                    });
                }
            });
        });
    }

    /**
     * Toggle dropdown open/closed state using native popover API
     */
    private toggleDropdown(dropdown: HTMLElement): void {
        const state = this.getState(dropdown);
        if (!state) return;

        // Use native popover toggle - the toggle event listener will update state
        if ((dropdown as any).togglePopover) {
            (dropdown as any).togglePopover();
        }
    }

    /**
     * Open dropdown using native popover API
     */
    private openDropdown(dropdown: HTMLElement): void {
        const state = this.getState(dropdown);
        if (!state || this.isDisabled(dropdown)) return;

        this.closeSiblingDropdowns(dropdown);

        // Use native popover API - the toggle event listener will handle state updates
        if ((dropdown as any).showPopover) {
            (dropdown as any).showPopover();
        }
    }

    /**
     * Open submenu using HTML Popover API
     */
    private openSubmenu(submenu: HTMLElement): void {
        const state = this.getState(submenu);
        if (!state || this.isDisabled(submenu)) {
            return;
        }

        state.isOpen = true;
        state.focusedIndex = -1;
        this.closeSiblingSubmenus(submenu);
        this.setState(submenu, state);

        // The submenu element IS the popover element
        const popover = submenu;
        const triggerWrapper = submenu.previousElementSibling as HTMLElement;
        const trigger = triggerWrapper?.querySelector('[data-submenu-trigger]') as HTMLElement;

        if (popover && (popover as any).showPopover) {
            try {
                (popover as any).showPopover();
            } catch (error) {
            }
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'true');
        }

        this.updateMenuItems(submenu);

        this.dispatchDropdownEvent(submenu, 'submenu:open');
    }

    /**
     * Close dropdown using native popover API
     */
    private closeDropdown(dropdown: HTMLElement): void {
        const state = this.getState(dropdown);
        if (!state || !state.isOpen) return;

        this.closeChildSubmenus(dropdown);

        // Use native popover API - the toggle event listener will handle state updates
        if ((dropdown as any).hidePopover) {
            (dropdown as any).hidePopover();
        }
    }

    /**
     * Close submenu using HTML Popover API
     */
    private closeSubmenu(submenu: HTMLElement): void {
        const state = this.getState(submenu);
        if (!state || !state.isOpen) return;

        this.closeChildSubmenus(submenu);

        state.isOpen = false;
        state.focusedIndex = -1;
        this.setState(submenu, state);

        // The submenu element IS the popover element
        const popover = submenu;
        const triggerWrapper = submenu.previousElementSibling as HTMLElement;
        const trigger = triggerWrapper?.querySelector('[data-submenu-trigger]') as HTMLElement;

        if (popover && (popover as any).hidePopover) {
            (popover as any).hidePopover();
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
        }

        this.dispatchDropdownEvent(submenu, 'submenu:close');
    }

    /**
     * Close all open dropdowns
     */
    private closeAllDropdowns(): void {
        this.getAllStates().forEach((state, dropdown) => {
            if (state.isOpen) {
                if (!state.parent) {
                    this.closeDropdown(dropdown);
                }
            }
        });
    }

    /**
     * Close sibling dropdowns but preserve parent-child relationships
     */
    private closeSiblingDropdowns(dropdown: HTMLElement): void {
        const state = this.getState(dropdown);

        this.getAllStates().forEach((otherState, otherDropdown) => {
            if (otherDropdown !== dropdown && otherState.isOpen) {
                const isParent = state?.parent === otherDropdown;
                const isChild = otherState.parent === dropdown;

                if (!isParent && !isChild) {
                    this.closeDropdown(otherDropdown);
                }
            }
        });
    }

    /**
     * Close sibling submenus
     */
    private closeSiblingSubmenus(submenu: HTMLElement): void {
        const state = this.getState(submenu);
        const parent = state?.parent;

        if (parent) {
            const parentState = this.getState(parent);
            parentState?.children.forEach(childSubmenu => {
                if (childSubmenu !== submenu) {
                    this.closeSubmenu(childSubmenu);
                }
            });
        }
    }

    /**
     * Close all child submenus
     */
    private closeChildSubmenus(dropdown: HTMLElement): void {
        const state = this.getState(dropdown);

        state?.children.forEach(childSubmenu => {
            this.closeSubmenu(childSubmenu);
        });
    }

    /**
     * Toggle submenu open/closed state
     */
    private toggleSubmenu(submenu: HTMLElement): void {
        const state = this.getState(submenu);
        if (!state) {
            return;
        }

        if (state.isOpen) {
            this.closeSubmenu(submenu);
        } else {
            this.openSubmenu(submenu);
        }
    }

    /**
     * Check if device is mobile
     */
    private isMobile(): boolean {
        return window.innerWidth < 768 || 'ontouchstart' in window;
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeydown(dropdown: HTMLElement, event: KeyboardEvent): void {
        const state = this.getState(dropdown);
        if (!state) return;

        switch (event.key) {
            case 'Enter':
            case ' ':
                if (!state.isOpen) {
                    event.preventDefault();
                    this.openDropdown(dropdown);
                } else if (state.focusedIndex >= 0) {
                    event.preventDefault();
                    const focusedItem = state.menuItems[state.focusedIndex];
                    if (focusedItem) {
                        focusedItem.click();
                    }
                }
                break;

            case 'Escape':
                if (state.isOpen) {
                    event.preventDefault();
                    this.closeDropdown(dropdown);
                    const triggerWrapper = dropdown.previousElementSibling as HTMLElement;
                    const trigger = triggerWrapper?.querySelector('[data-dropdown-trigger]') as HTMLElement;
                    if (trigger) trigger.focus();
                }
                break;

            case 'ArrowDown':
                if (!state.isOpen) {
                    event.preventDefault();
                    this.openDropdown(dropdown);
                } else {
                    event.preventDefault();
                    this.navigateItems(dropdown, 1);
                }
                break;

            case 'ArrowUp':
                if (state.isOpen) {
                    event.preventDefault();
                    this.navigateItems(dropdown, -1);
                }
                break;

            case 'Tab':
                if (state.isOpen) {
                    this.closeDropdown(dropdown);
                }
                break;
        }
    }

    /**
     * Navigate through menu items with arrow keys
     */
    private navigateItems(dropdown: HTMLElement, direction: number): void {
        const state = this.getState(dropdown);
        if (!state || !state.isOpen) return;

        const itemCount = state.menuItems.length;
        if (itemCount === 0) return;

        if (state.focusedIndex === -1) {
            state.focusedIndex = direction > 0 ? 0 : itemCount - 1;
        } else {
            state.focusedIndex += direction;
            if (state.focusedIndex >= itemCount) {
                state.focusedIndex = 0;
            } else if (state.focusedIndex < 0) {
                state.focusedIndex = itemCount - 1;
            }
        }

        this.setState(dropdown, state);
        this.updateItemFocus(dropdown);
    }

    /**
     * Update visual focus state of menu items
     */
    private updateItemFocus(dropdown: HTMLElement): void {
        const state = this.getState(dropdown);
        if (!state) return;

        state.menuItems.forEach((item, index) => {
            if (index === state.focusedIndex) {
                item.classList.add('bg-neutral-100', 'dark:bg-neutral-800');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('bg-neutral-100', 'dark:bg-neutral-800');
            }
        });
    }

    /**
     * Update menu items list for keyboard navigation
     */
    private updateMenuItems(dropdown: HTMLElement): void {
        const state = this.getState(dropdown);
        if (!state) return;

        const items = DOMUtils.querySelectorAll('[data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-submenu-trigger]', dropdown);
        state.menuItems = Array.from(items).filter(item => {
            const element = item as HTMLElement;
            return !element.hasAttribute('disabled') && element.offsetParent !== null;
        }) as HTMLElement[];

        this.setState(dropdown, state);
    }

    /**
     * Check if dropdown is disabled
     */
    private isDisabled(dropdown: HTMLElement): boolean {
        return dropdown.dataset.disabled === 'true';
    }

    /**
     * Dispatch custom dropdown event
     */
    private dispatchDropdownEvent(dropdown: HTMLElement, eventName: string, detail: any = null): void {
        EventUtils.dispatchCustomEvent(dropdown, eventName, {
            dropdown,
            ...detail
        }, {
            bubbles: true
        });
    }

    /**
     * Clean up DropdownActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
    }
}

export default DropdownActions.getInstance();
