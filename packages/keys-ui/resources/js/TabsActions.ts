/**
 * TabsActions - Handles interactive functionality for Tabs components
 *
 * Provides functionality for:
 * - Tab activation and state management
 * - Keyboard navigation (arrow keys, home, end)
 * - Focus management and accessibility
 * - Panel visibility control
 * - Event delegation and custom events
 */

interface TabState {
    activeTab: string | null;
    tabs: HTMLElement[];
    panels: HTMLElement[];
    orientation: 'horizontal' | 'vertical';
    variant: string;
    disabled: boolean;
}

export class TabsActions {
    private static instance: TabsActions | null = null;
    private initialized = false;
    private tabsStates = new Map<HTMLElement, TabState>();

    /**
     * Get singleton instance
     */
    public static getInstance(): TabsActions {
        if (!TabsActions.instance) {
            TabsActions.instance = new TabsActions();
        }
        return TabsActions.instance;
    }

    /**
     * Initialize TabsActions for all tabs elements
     */
    public init(): void {
        if (this.initialized) {
            return;
        }

        this.bindEventListeners();
        this.initializeTabs();
        this.initialized = true;

    }

    /**
     * Initialize all existing tabs elements
     */
    private initializeTabs(): void {
        document.querySelectorAll('[data-tabs="true"]').forEach(tabs => {
            this.initializeTabsElement(tabs as HTMLElement);
        });
    }

    /**
     * Initialize a single tabs element
     */
    private initializeTabsElement(tabsElement: HTMLElement): void {
        const orientation = (tabsElement.dataset.orientation || 'horizontal') as 'horizontal' | 'vertical';
        const variant = tabsElement.dataset.variant || 'default';
        const disabled = tabsElement.dataset.disabled === 'true';
        const initialValue = tabsElement.dataset.value;

        const tabs = Array.from(tabsElement.querySelectorAll('[data-tabs-trigger="true"]')) as HTMLElement[];
        const panels = Array.from(tabsElement.querySelectorAll('[data-tabs-panel="true"]')) as HTMLElement[];

        let activeTab = initialValue;
        if (!activeTab && tabs.length > 0) {
            const firstEnabledTab = tabs.find(tab => tab.getAttribute('aria-disabled') !== 'true');
            activeTab = firstEnabledTab?.dataset.value || null;
        }

        const state: TabState = {
            activeTab,
            tabs,
            panels,
            orientation,
            variant,
            disabled
        };

        this.tabsStates.set(tabsElement, state);
        this.updateTabsState(tabsElement);

        this.initializeMarker(tabsElement);
        tabsElement.classList.add('tabs-initialized');
    }

    /**
     * Bind global event listeners using event delegation
     */
    private bindEventListeners(): void {
        document.addEventListener('click', (event) => {
            const tab = (event.target as Element)?.closest('[data-tabs-trigger="true"]') as HTMLElement;
            if (tab) {
                event.preventDefault();

                const tabsElement = tab.closest('[data-tabs="true"]') as HTMLElement;
                if (tabsElement && tab.getAttribute('aria-disabled') !== 'true') {
                    this.activateTab(tabsElement, tab.dataset.value || '');
                }
            }
        });

        document.addEventListener('keydown', (event) => {
            const tab = (event.target as Element)?.closest('[data-tabs-trigger="true"]') as HTMLElement;
            if (tab) {
                const tabsElement = tab.closest('[data-tabs="true"]') as HTMLElement;
                if (tabsElement) {
                    this.handleKeydown(tabsElement, event);
                }
            }
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        const tabs = element.querySelectorAll('[data-tabs="true"]');
                        tabs.forEach(tabsEl => {
                            if (!this.tabsStates.has(tabsEl as HTMLElement)) {
                                this.initializeTabsElement(tabsEl as HTMLElement);
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
     * Activate a specific tab
     */
    private activateTab(tabsElement: HTMLElement, value: string, shouldFocus: boolean = false): void {
        const state = this.tabsStates.get(tabsElement);
        if (!state || state.disabled) return;

        const targetTab = state.tabs.find(tab => tab.dataset.value === value);
        if (!targetTab || targetTab.getAttribute('aria-disabled') === 'true') {
            return;
        }

        const previousTab = state.activeTab;

        state.activeTab = value;
        this.tabsStates.set(tabsElement, state);

        this.updateTabsState(tabsElement);

        this.repositionMarker(tabsElement, targetTab);

        // Only focus when activated via keyboard
        if (shouldFocus) {
            targetTab.focus();
        }

        this.dispatchTabsEvent(tabsElement, 'tabs:change', {
            activeTab: value,
            previousTab: previousTab
        });
    }

    /**
     * Update tabs visual state and panel visibility
     */
    private updateTabsState(tabsElement: HTMLElement): void {
        const state = this.tabsStates.get(tabsElement);
        if (!state) return;

        state.tabs.forEach(tab => {
            const isActive = tab.dataset.value === state.activeTab;
            const isDisabled = tab.getAttribute('aria-disabled') === 'true';

            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            tab.setAttribute('data-state', isActive ? 'active' : 'inactive');

            if (isDisabled) {
                tab.setAttribute('tabindex', '-1');
            } else if (isActive) {
                tab.setAttribute('tabindex', '0');
            } else {
                tab.setAttribute('tabindex', '-1');
            }

            tab.id = `tab-${tab.dataset.value}`;

        });

        state.panels.forEach(panel => {
            const isActive = panel.dataset.value === state.activeTab;

            panel.setAttribute('data-state', isActive ? 'active' : 'inactive');
            panel.style.display = isActive ? 'block' : 'none';

            panel.setAttribute('aria-labelledby', `tab-${panel.dataset.value}`);
        });
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeydown(tabsElement: HTMLElement, event: KeyboardEvent): void {
        const state = this.tabsStates.get(tabsElement);
        if (!state || state.disabled) return;

        const currentTab = event.target as HTMLElement;
        const currentIndex = state.tabs.indexOf(currentTab);

        let targetIndex = -1;

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                targetIndex = state.orientation === 'horizontal'
                    ? this.getPreviousEnabledTabIndex(state, currentIndex)
                    : (event.key === 'ArrowUp' ? this.getPreviousEnabledTabIndex(state, currentIndex) : currentIndex);
                break;

            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                targetIndex = state.orientation === 'horizontal'
                    ? this.getNextEnabledTabIndex(state, currentIndex)
                    : (event.key === 'ArrowDown' ? this.getNextEnabledTabIndex(state, currentIndex) : currentIndex);
                break;

            case 'Home':
                event.preventDefault();
                targetIndex = this.getFirstEnabledTabIndex(state);
                break;

            case 'End':
                event.preventDefault();
                targetIndex = this.getLastEnabledTabIndex(state);
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                if (currentTab.dataset.value) {
                    this.activateTab(tabsElement, currentTab.dataset.value, true);
                }
                return;
        }

        if (targetIndex >= 0 && targetIndex < state.tabs.length) {
            const targetTab = state.tabs[targetIndex];
            if (targetTab.dataset.value) {
                this.activateTab(tabsElement, targetTab.dataset.value, true);
            }
        }
    }

    /**
     * Get next enabled tab index
     */
    private getNextEnabledTabIndex(state: TabState, currentIndex: number): number {
        for (let i = 1; i < state.tabs.length; i++) {
            const nextIndex = (currentIndex + i) % state.tabs.length;
            if (state.tabs[nextIndex].getAttribute('aria-disabled') !== 'true') {
                return nextIndex;
            }
        }
        return currentIndex;
    }

    /**
     * Get previous enabled tab index
     */
    private getPreviousEnabledTabIndex(state: TabState, currentIndex: number): number {
        for (let i = 1; i < state.tabs.length; i++) {
            const prevIndex = (currentIndex - i + state.tabs.length) % state.tabs.length;
            if (state.tabs[prevIndex].getAttribute('aria-disabled') !== 'true') {
                return prevIndex;
            }
        }
        return currentIndex;
    }

    /**
     * Get first enabled tab index
     */
    private getFirstEnabledTabIndex(state: TabState): number {
        for (let i = 0; i < state.tabs.length; i++) {
            if (state.tabs[i].getAttribute('aria-disabled') !== 'true') {
                return i;
            }
        }
        return 0;
    }

    /**
     * Get last enabled tab index
     */
    private getLastEnabledTabIndex(state: TabState): number {
        for (let i = state.tabs.length - 1; i >= 0; i--) {
            if (state.tabs[i].getAttribute('aria-disabled') !== 'true') {
                return i;
            }
        }
        return state.tabs.length - 1;
    }

    /**
     * Dispatch custom tabs event
     */
    private dispatchTabsEvent(tabsElement: HTMLElement, eventName: string, detail: any = null): void {
        const event = new CustomEvent(eventName, {
            detail: {
                tabs: tabsElement,
                ...detail
            },
            bubbles: true
        });
        tabsElement.dispatchEvent(event);
    }

    /**
     * Get tabs state (for external access)
     */
    public getTabsState(tabsElement: HTMLElement): TabState | null {
        return this.tabsStates.get(tabsElement) || null;
    }

    /**
     * Set active tab programmatically
     */
    public setActiveTab(tabsElement: HTMLElement, value: string, shouldFocus: boolean = false): void {
        this.activateTab(tabsElement, value, shouldFocus);
    }

    /**
     * Initialize marker position for the active tab
     */
    private initializeMarker(tabsElement: HTMLElement): void {
        const state = this.tabsStates.get(tabsElement);
        if (!state || !state.activeTab) return;

        const activeTab = state.tabs.find(tab => tab.dataset.value === state.activeTab);
        if (activeTab) {
            setTimeout(() => {
                this.repositionMarker(tabsElement, activeTab);
            }, 10);
        }
    }

    /**
     * Reposition marker to match the given tab
     */
    private repositionMarker(tabsElement: HTMLElement, targetTab: HTMLElement): void {
        const state = this.tabsStates.get(tabsElement);
        if (!state) return;

        const marker = tabsElement.querySelector('[data-tab-marker="true"]') as HTMLElement;
        if (!marker) return;

        const { orientation, variant } = state;

        if (orientation === 'vertical') {
            this.repositionVerticalMarker(marker, targetTab, variant);
        } else {
            this.repositionHorizontalMarker(marker, targetTab, variant);
        }
    }

    /**
     * Reposition marker for horizontal orientation
     */
    private repositionHorizontalMarker(marker: HTMLElement, targetTab: HTMLElement, variant: string): void {
        const width = targetTab.offsetWidth;
        const left = targetTab.offsetLeft;

        marker.style.width = `${width}px`;

        if (variant === 'pills') {
            const height = targetTab.offsetHeight;
            const top = targetTab.offsetTop;
            marker.style.height = `${height}px`;
            marker.style.transform = `translate(${left}px, ${top}px)`;
        } else {
            marker.style.transform = `translateX(${left}px)`;
        }
    }

    /**
     * Reposition marker for vertical orientation
     */
    private repositionVerticalMarker(marker: HTMLElement, targetTab: HTMLElement, variant: string): void {
        const height = targetTab.offsetHeight;
        const top = targetTab.offsetTop;

        marker.style.height = `${height}px`;

        if (variant === 'pills') {
            const width = targetTab.offsetWidth;
            const left = targetTab.offsetLeft;
            marker.style.width = `${width}px`;
            marker.style.transform = `translate(${left}px, ${top}px)`;
        } else {
            marker.style.transform = `translateY(${top}px)`;
        }
    }

    /**
     * Handle window resize - reposition all markers
     */
    private handleResize(): void {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.tabsStates.forEach((state, tabsElement) => {
                if (state.activeTab) {
                    const activeTab = state.tabs.find(tab => tab.dataset.value === state.activeTab);
                    if (activeTab) {
                        this.repositionMarker(tabsElement, activeTab);
                    }
                }
            });
        }, 100);
    }

    private resizeTimeout: number = 0;

    /**
     * Destroy TabsActions and clean up
     */
    public destroy(): void {
        this.tabsStates.clear();
        this.initialized = false;
        clearTimeout(this.resizeTimeout);
    }
}

export default TabsActions.getInstance();
