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

        this.setState(dropdownElement, state);
        this.updateMenuItems(dropdownElement);
        this.initializeSubmenus(dropdownElement);
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
        // Handle all click events with a single delegated listener
        EventUtils.handleDelegatedClick('[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]', (element, event) => {
            if (element.matches('[data-submenu-trigger]')) {
                event.preventDefault();
                event.stopPropagation();
                const submenu = DOMUtils.findClosest(element, '[data-submenu="true"]');
                if (submenu && !this.isDisabled(submenu)) {
                    this.toggleSubmenu(submenu);
                }
                return;
            }

            if (element.matches('[data-dropdown-trigger]')) {
                event.preventDefault();
                event.stopPropagation();
                const dropdown = DOMUtils.findClosest(element, '[data-dropdown="true"]');
                if (dropdown && !this.isDisabled(dropdown)) {
                    this.toggleDropdown(dropdown);
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

        // Handle click outside to close dropdowns
        EventUtils.addEventListener(document, 'click', (event) => {
            const target = event.target as Node;

            // Check if the click was inside any dropdown element
            if (target && target instanceof Element) {
                const closestDropdownElement = target.closest('[data-submenu-trigger], [data-dropdown-trigger], [data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-dropdown-panel], [data-submenu-panel]');

                // If click is not inside any dropdown element, close all dropdowns
                if (!closestDropdownElement) {
                    this.closeAllDropdowns();
                }
            }
        });

        // Handle submenu hover events
        EventUtils.addEventListener(document, 'mouseenter', (event) => {
            const submenuTrigger = DOMUtils.findClosest(event.target as Element, '[data-submenu-trigger]') as HTMLElement;
            if (submenuTrigger && !this.isMobile()) {
                const submenu = DOMUtils.findClosest(submenuTrigger, '[data-submenu="true"]');
                if (submenu && !this.isDisabled(submenu)) {
                    this.closeSiblingSubmenus(submenu);
                    setTimeout(() => {
                        if (submenuTrigger.matches(':hover')) {
                            this.openSubmenu(submenu);
                        }
                    }, 100);
                }
            }
        }, { capture: true });

        EventUtils.addEventListener(document, 'mouseleave', (event) => {
            const submenu = DOMUtils.findClosest(event.target as Element, '[data-submenu="true"]') as HTMLElement;
            if (submenu && !this.isMobile()) {
                const state = this.getState(submenu);
                if (state?.isOpen) {
                    setTimeout(() => {
                        if (!submenu.matches(':hover')) {
                            this.closeSubmenu(submenu);
                        }
                    }, 150);
                }
            }
        }, { capture: true });

        // Handle keyboard navigation
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

                    // Check if the added node is a dropdown
                    if (DOMUtils.hasDataAttribute(element, 'dropdown', 'true')) {
                        if (!this.hasState(element)) {
                            this.initializeDropdown(element);
                        }
                    }

                    // Check for dropdowns within the added node
                    const dropdowns = DOMUtils.findByDataAttribute('dropdown', 'true', element);
                    dropdowns.forEach(dropdown => {
                        if (!this.hasState(dropdown)) {
                            this.initializeDropdown(dropdown);
                        }
                    });
                }
            });
        });
    }

    /**
     * Toggle dropdown open/closed state
     */
    private toggleDropdown(dropdown: HTMLElement): void {
        const state = this.getState(dropdown);
        if (!state) return;

        if (state.isOpen) {
            this.closeDropdown(dropdown);
        } else {
            this.openDropdown(dropdown);
        }
    }

    /**
     * Open dropdown
     */
    private openDropdown(dropdown: HTMLElement): void {
        const state = this.getState(dropdown);
        if (!state || this.isDisabled(dropdown)) return;

        this.closeSiblingDropdowns(dropdown);

        state.isOpen = true;
        state.focusedIndex = -1;
        this.setState(dropdown, state);

        const panel = DOMUtils.querySelector('[data-dropdown-panel]', dropdown) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-dropdown-trigger]', dropdown) as HTMLElement;

        if (panel) {
            panel.classList.remove('hidden');
            this.positionDropdown(dropdown);
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'true');
        }

        this.updateMenuItems(dropdown);

        this.dispatchDropdownEvent(dropdown, 'dropdown:open');
    }

    /**
     * Open submenu
     */
    private openSubmenu(submenu: HTMLElement): void {
        const state = this.getState(submenu);
        if (!state || this.isDisabled(submenu)) return;

        state.isOpen = true;
        state.focusedIndex = -1;
        this.setState(submenu, state);

        const panel = DOMUtils.querySelector('[data-submenu-panel]', submenu) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-submenu-trigger]', submenu) as HTMLElement;

        if (panel) {
            panel.classList.remove('hidden');
            this.positionSubmenu(submenu);
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'true');
        }

        this.updateMenuItems(submenu);

        this.dispatchDropdownEvent(submenu, 'submenu:open');
    }

    /**
     * Close dropdown
     */
    private closeDropdown(dropdown: HTMLElement): void {
        const state = this.getState(dropdown);
        if (!state || !state.isOpen) return;

        this.closeChildSubmenus(dropdown);

        state.isOpen = false;
        state.focusedIndex = -1;
        this.setState(dropdown, state);

        const panel = DOMUtils.querySelector('[data-dropdown-panel]', dropdown) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-dropdown-trigger]', dropdown) as HTMLElement;

        if (panel) {
            panel.classList.add('hidden');
        }

        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
        }

        this.dispatchDropdownEvent(dropdown, 'dropdown:close');
    }

    /**
     * Close submenu
     */
    private closeSubmenu(submenu: HTMLElement): void {
        const state = this.getState(submenu);
        if (!state || !state.isOpen) return;

        this.closeChildSubmenus(submenu);

        state.isOpen = false;
        state.focusedIndex = -1;
        this.setState(submenu, state);

        const panel = DOMUtils.querySelector('[data-submenu-panel]', submenu) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-submenu-trigger]', submenu) as HTMLElement;

        if (panel) {
            panel.classList.add('hidden');
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
        if (!state) return;

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
                    const trigger = DOMUtils.querySelector('[data-dropdown-trigger]', dropdown) as HTMLElement;
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
     * Position dropdown relative to trigger
     */
    private positionDropdown(dropdown: HTMLElement): void {
        const panel = DOMUtils.querySelector('[data-dropdown-panel]', dropdown) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-dropdown-trigger]', dropdown) as HTMLElement;

        if (!panel || !trigger) return;

        const rect = trigger.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const position = dropdown.dataset.position || 'bottom';
        const align = dropdown.dataset.align || 'start';
        const offset = parseInt(dropdown.dataset.offset || '8');

        panel.style.top = '';
        panel.style.bottom = '';
        panel.style.left = '';
        panel.style.right = '';

        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const spaceRight = viewportWidth - rect.left;
        const spaceLeft = rect.right;

        let finalPosition = position;
        let finalAlign = align;

        if (position === 'bottom' && spaceBelow < panelRect.height && spaceAbove > panelRect.height) {
            finalPosition = 'top';
        } else if (position === 'top' && spaceAbove < panelRect.height && spaceBelow > panelRect.height) {
            finalPosition = 'bottom';
        }

        switch (finalPosition) {
            case 'top':
                panel.style.bottom = '100%';
                panel.style.marginBottom = `${offset}px`;
                break;
            case 'bottom':
                panel.style.top = '100%';
                panel.style.marginTop = `${offset}px`;
                break;
            case 'left':
                panel.style.right = '100%';
                panel.style.marginRight = `${offset}px`;
                break;
            case 'right':
                panel.style.left = '100%';
                panel.style.marginLeft = `${offset}px`;
                break;
        }

        if (finalPosition === 'top' || finalPosition === 'bottom') {
            switch (finalAlign) {
                case 'start':
                    panel.style.left = '0';
                    break;
                case 'center':
                    panel.style.left = '50%';
                    panel.style.transform = 'translateX(-50%)';
                    break;
                case 'end':
                    panel.style.right = '0';
                    break;
            }
        } else {
            switch (finalAlign) {
                case 'start':
                    panel.style.top = '0';
                    break;
                case 'center':
                    panel.style.top = '50%';
                    panel.style.transform = 'translateY(-50%)';
                    break;
                case 'end':
                    panel.style.bottom = '0';
                    break;
            }
        }
    }

    /**
     * Position submenu relative to trigger
     */
    private positionSubmenu(submenu: HTMLElement): void {
        const panel = DOMUtils.querySelector('[data-submenu-panel]', submenu) as HTMLElement;
        const trigger = DOMUtils.querySelector('[data-submenu-trigger]', submenu) as HTMLElement;

        if (!panel || !trigger) return;

        const rect = trigger.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const position = submenu.dataset.position || 'right';
        const align = submenu.dataset.align || 'start';
        const offset = parseInt(submenu.dataset.offset || '4');

        panel.style.top = '';
        panel.style.bottom = '';
        panel.style.left = '';
        panel.style.right = '';
        panel.style.transform = '';

        const spaceRight = viewportWidth - rect.right;
        const spaceLeft = rect.left;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        let finalPosition = position;

        if (position === 'right' && spaceRight < panelRect.width && spaceLeft > panelRect.width) {
            finalPosition = 'left';
        } else if (position === 'left' && spaceLeft < panelRect.width && spaceRight > panelRect.width) {
            finalPosition = 'right';
        }

        switch (finalPosition) {
            case 'right':
                panel.style.left = '100%';
                panel.style.marginLeft = `${offset}px`;
                break;
            case 'left':
                panel.style.right = '100%';
                panel.style.marginRight = `${offset}px`;
                break;
        }

        switch (align) {
            case 'start':
                panel.style.top = '0';
                break;
            case 'center':
                panel.style.top = '50%';
                panel.style.transform = 'translateY(-50%)';
                break;
            case 'end':
                panel.style.bottom = '0';
                break;
        }

        const finalPanelRect = panel.getBoundingClientRect();
        if (finalPanelRect.bottom > viewportHeight) {
            const overflow = finalPanelRect.bottom - viewportHeight + 8;
            panel.style.transform = `translateY(-${overflow}px)`;
        } else if (finalPanelRect.top < 0) {
            const overflow = Math.abs(finalPanelRect.top) + 8;
            panel.style.transform = `translateY(${overflow}px)`;
        }
    }

    /**
     * Reposition all open dropdowns and submenus
     */
    private repositionDropdowns(): void {
        this.getAllStates().forEach((state, dropdown) => {
            if (state.isOpen) {
                if (dropdown.hasAttribute('data-submenu')) {
                    this.positionSubmenu(dropdown);
                } else {
                    this.positionDropdown(dropdown);
                }
            }
        });
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
        // DropdownActions doesn't have additional cleanup beyond base class
        // Event listeners and observers are automatically cleaned up
    }
}

export default DropdownActions.getInstance();
