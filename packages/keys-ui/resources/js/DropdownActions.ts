/**
 * DropdownActions - Handles interactive functionality for Dropdown components
 *
 * Provides functionality for:
 * - Dropdown open/close with keyboard navigation
 * - Smart closing behavior (menu items close, form controls stay open)
 * - Positioning and click-outside handling
 * - Focus management and accessibility
 */

interface DropdownState {
    isOpen: boolean;
    focusedIndex: number;
    menuItems: HTMLElement[];
    parent?: HTMLElement;
    children: HTMLElement[];
}

export class DropdownActions {
    private static instance: DropdownActions | null = null;
    private initialized = false;
    private dropdownStates = new Map<HTMLElement, DropdownState>();

    /**
     * Get singleton instance
     */
    public static getInstance(): DropdownActions {
        if (!DropdownActions.instance) {
            DropdownActions.instance = new DropdownActions();
        }
        return DropdownActions.instance;
    }

    /**
     * Initialize DropdownActions for all dropdown elements
     */
    public init(): void {
        if (this.initialized) {
            return;
        }

        this.bindEventListeners();
        this.initializeDropdowns();
        this.initialized = true;

    }

    /**
     * Initialize all existing dropdown elements
     */
    private initializeDropdowns(): void {
        document.querySelectorAll('[data-dropdown="true"]').forEach(dropdown => {
            this.initializeDropdown(dropdown as HTMLElement);
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

        const parentSubmenu = dropdownElement.closest('[data-submenu="true"]');
        if (parentSubmenu && parentSubmenu !== dropdownElement) {
            state.parent = parentSubmenu as HTMLElement;
        }

        this.dropdownStates.set(dropdownElement, state);
        this.updateMenuItems(dropdownElement);
        this.initializeSubmenus(dropdownElement);
    }

    /**
     * Initialize submenus within a dropdown
     */
    private initializeSubmenus(dropdownElement: HTMLElement): void {
        const submenus = dropdownElement.querySelectorAll('[data-submenu="true"]');
        const state = this.dropdownStates.get(dropdownElement);

        if (state) {
            state.children = Array.from(submenus) as HTMLElement[];
            this.dropdownStates.set(dropdownElement, state);
        }

        submenus.forEach(submenu => {
            if (!this.dropdownStates.has(submenu as HTMLElement)) {
                this.initializeDropdown(submenu as HTMLElement);
            }
        });
    }

    /**
     * Bind global event listeners using event delegation
     */
    private bindEventListeners(): void {
        document.addEventListener('click', (event) => {
            const submenuTrigger = event.target && (event.target as Element).closest && (event.target as Element).closest('[data-submenu-trigger]') as HTMLElement;
            if (submenuTrigger) {
                event.preventDefault();
                event.stopPropagation();
                const submenu = submenuTrigger.closest('[data-submenu="true"]') as HTMLElement;
                if (submenu && !this.isDisabled(submenu)) {
                    this.toggleSubmenu(submenu);
                }
                return;
            }

            const trigger = event.target && (event.target as Element).closest && (event.target as Element).closest('[data-dropdown-trigger]') as HTMLElement;
            if (trigger) {
                event.preventDefault();
                event.stopPropagation();
                const dropdown = trigger.closest('[data-dropdown="true"]') as HTMLElement;
                if (dropdown && !this.isDisabled(dropdown)) {
                    this.toggleDropdown(dropdown);
                }
                return;
            }

            const menuItem = event.target && (event.target as Element).closest && (event.target as Element).closest('[data-menu-item]') as HTMLElement;
            if (menuItem) {
                const dropdown = menuItem.closest('[data-dropdown="true"]') as HTMLElement;
                if (dropdown) {
                    const keepOpen = menuItem.dataset.keepOpen === 'true';
                    if (!keepOpen) {
                        this.closeDropdown(dropdown);
                    }
                }
                return;
            }

            const formControl = event.target && (event.target as Element).closest && (event.target as Element).closest('[data-menu-checkbox], [data-menu-radio]') as HTMLElement;
            if (formControl) {
                event.stopPropagation();
                const keepOpen = formControl.dataset.keepOpen !== 'false';
                if (!keepOpen) {
                    const dropdown = formControl.closest('[data-dropdown="true"]') as HTMLElement;
                    if (dropdown) {
                        this.closeDropdown(dropdown);
                    }
                }
                return;
            }

            const dropdownPanel = event.target && (event.target as Element).closest && (event.target as Element).closest('[data-dropdown-panel], [data-submenu-panel]') as HTMLElement;
            if (dropdownPanel) {
                event.stopPropagation();
                return;
            }

            this.closeAllDropdowns();
        });

        document.addEventListener('mouseenter', (event) => {
            const submenuTrigger = event.target && (event.target as Element).closest && (event.target as Element).closest('[data-submenu-trigger]') as HTMLElement;
            if (submenuTrigger && !this.isMobile()) {
                const submenu = submenuTrigger.closest('[data-submenu="true"]') as HTMLElement;
                if (submenu && !this.isDisabled(submenu)) {
                    this.closeSiblingSubmenus(submenu);
                    setTimeout(() => {
                        if (submenuTrigger.matches(':hover')) {
                            this.openSubmenu(submenu);
                        }
                    }, 100);
                }
            }
        }, true);

        document.addEventListener('mouseleave', (event) => {
            const submenu = event.target && (event.target as Element).closest && (event.target as Element).closest('[data-submenu="true"]') as HTMLElement;
            if (submenu && !this.isMobile()) {
                const state = this.dropdownStates.get(submenu);
                if (state?.isOpen) {
                    setTimeout(() => {
                        if (!submenu.matches(':hover')) {
                            this.closeSubmenu(submenu);
                        }
                    }, 150);
                }
            }
        }, true);

        document.addEventListener('keydown', (event) => {
            const dropdown = event.target && (event.target as Element).closest && (event.target as Element).closest('[data-dropdown="true"]') as HTMLElement;
            if (dropdown) {
                this.handleKeydown(dropdown, event);
            }
        });

        window.addEventListener('resize', () => {
            this.repositionDropdowns();
        });

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        const dropdowns = element.querySelectorAll('[data-dropdown="true"]');
                        dropdowns.forEach(dropdown => {
                            if (!this.dropdownStates.has(dropdown as HTMLElement)) {
                                this.initializeDropdown(dropdown as HTMLElement);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Toggle dropdown open/closed state
     */
    private toggleDropdown(dropdown: HTMLElement): void {
        const state = this.dropdownStates.get(dropdown);
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
        const state = this.dropdownStates.get(dropdown);
        if (!state || this.isDisabled(dropdown)) return;

        this.closeSiblingDropdowns(dropdown);

        state.isOpen = true;
        state.focusedIndex = -1;
        this.dropdownStates.set(dropdown, state);

        const panel = dropdown.querySelector('[data-dropdown-panel]') as HTMLElement;
        const trigger = dropdown.querySelector('[data-dropdown-trigger]') as HTMLElement;

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
        const state = this.dropdownStates.get(submenu);
        if (!state || this.isDisabled(submenu)) return;

        state.isOpen = true;
        state.focusedIndex = -1;
        this.dropdownStates.set(submenu, state);

        const panel = submenu.querySelector('[data-submenu-panel]') as HTMLElement;
        const trigger = submenu.querySelector('[data-submenu-trigger]') as HTMLElement;

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
        const state = this.dropdownStates.get(dropdown);
        if (!state || !state.isOpen) return;

        this.closeChildSubmenus(dropdown);

        state.isOpen = false;
        state.focusedIndex = -1;
        this.dropdownStates.set(dropdown, state);

        const panel = dropdown.querySelector('[data-dropdown-panel]') as HTMLElement;
        const trigger = dropdown.querySelector('[data-dropdown-trigger]') as HTMLElement;

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
        const state = this.dropdownStates.get(submenu);
        if (!state || !state.isOpen) return;

        this.closeChildSubmenus(submenu);

        state.isOpen = false;
        state.focusedIndex = -1;
        this.dropdownStates.set(submenu, state);

        const panel = submenu.querySelector('[data-submenu-panel]') as HTMLElement;
        const trigger = submenu.querySelector('[data-submenu-trigger]') as HTMLElement;

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
        this.dropdownStates.forEach((state, dropdown) => {
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
        const state = this.dropdownStates.get(dropdown);

        this.dropdownStates.forEach((otherState, otherDropdown) => {
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
        const state = this.dropdownStates.get(submenu);
        const parent = state?.parent;

        if (parent) {
            const parentState = this.dropdownStates.get(parent);
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
        const state = this.dropdownStates.get(dropdown);

        state?.children.forEach(childSubmenu => {
            this.closeSubmenu(childSubmenu);
        });
    }

    /**
     * Toggle submenu open/closed state
     */
    private toggleSubmenu(submenu: HTMLElement): void {
        const state = this.dropdownStates.get(submenu);
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
        const state = this.dropdownStates.get(dropdown);
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
                    const trigger = dropdown.querySelector('[data-dropdown-trigger]') as HTMLElement;
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
        const state = this.dropdownStates.get(dropdown);
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

        this.dropdownStates.set(dropdown, state);
        this.updateItemFocus(dropdown);
    }

    /**
     * Update visual focus state of menu items
     */
    private updateItemFocus(dropdown: HTMLElement): void {
        const state = this.dropdownStates.get(dropdown);
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
        const state = this.dropdownStates.get(dropdown);
        if (!state) return;

        const items = dropdown.querySelectorAll('[data-menu-item], [data-menu-checkbox], [data-menu-radio], [data-submenu-trigger]');
        state.menuItems = Array.from(items).filter(item => {
            const element = item as HTMLElement;
            return !element.hasAttribute('disabled') && element.offsetParent !== null;
        }) as HTMLElement[];

        this.dropdownStates.set(dropdown, state);
    }

    /**
     * Position dropdown relative to trigger
     */
    private positionDropdown(dropdown: HTMLElement): void {
        const panel = dropdown.querySelector('[data-dropdown-panel]') as HTMLElement;
        const trigger = dropdown.querySelector('[data-dropdown-trigger]') as HTMLElement;

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
        const panel = submenu.querySelector('[data-submenu-panel]') as HTMLElement;
        const trigger = submenu.querySelector('[data-submenu-trigger]') as HTMLElement;

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
        this.dropdownStates.forEach((state, dropdown) => {
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
        const event = new CustomEvent(eventName, {
            detail: {
                dropdown,
                ...detail
            },
            bubbles: true
        });
        dropdown.dispatchEvent(event);
    }

    /**
     * Destroy DropdownActions and clean up
     */
    public destroy(): void {
        this.dropdownStates.clear();
        this.initialized = false;

    }
}

export default DropdownActions.getInstance();
