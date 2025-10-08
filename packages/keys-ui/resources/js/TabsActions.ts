/**
 * Tabs Component Actions
 *
 * Handles tab switching, sliding indicator animation, and panel visibility management.
 */

export function initializeTabs(): void {
    console.log('[Tabs] Initializing tabs...');
    const tabsContainers = document.querySelectorAll('[data-keys-tabs]');
    console.log('[Tabs] Found tabs containers:', tabsContainers.length);

    tabsContainers.forEach((container) => {
        const tabs = container.querySelectorAll<HTMLElement>('[data-tab]');
        const panels = container.querySelectorAll<HTMLElement>('[data-tab-panel]');
        const slider = container.querySelector<HTMLElement>('[data-tab-slider]');
        const tabsList = container.querySelector<HTMLElement>('[role="tablist"]');
        const defaultValue = container.getAttribute('data-value');

        if (!tabs.length || !panels.length || !tabsList) {
            return;
        }

        /**
         * Activate a specific tab and show its corresponding panel
         */
        function activateTab(activeTab: HTMLElement): void {
            const value = activeTab.getAttribute('data-tab');

            if (!value) return;

            // Update slider position
            updateSlider(activeTab);

            // Update tab states and ARIA attributes
            tabs.forEach((tab) => {
                const isActive = tab === activeTab;

                // Toggle text colors
                tab.classList.toggle('text-primary', isActive);
                tab.classList.toggle('font-semibold', isActive);
                tab.classList.toggle('text-muted', !isActive);

                // Update ARIA attributes
                tab.setAttribute('aria-selected', String(isActive));
                tab.setAttribute('tabindex', isActive ? '0' : '-1');
            });

            // Update panel visibility
            panels.forEach((panel) => {
                const panelValue = panel.getAttribute('data-tab-panel');
                const matches = panelValue === value;

                panel.classList.toggle('hidden', !matches);
                panel.setAttribute('aria-hidden', String(!matches));

                if (matches) {
                    panel.classList.add('block');
                } else {
                    panel.classList.remove('block');
                }
            });

            // Update container's current value
            container.setAttribute('data-value', value);
        }

        /**
         * Update slider position and dimensions to match the active tab
         */
        function updateSlider(activeTab: HTMLElement): void {
            if (!slider) return;

            const containerRect = tabsList.getBoundingClientRect();
            const tabRect = activeTab.getBoundingClientRect();

            // Calculate position relative to tabs container
            const left = tabRect.left - containerRect.left;

            // Check if this is pills variant (has inset-y positioning)
            const isPillsVariant = slider.classList.contains('inset-y-1');

            // Update slider position and size
            slider.style.width = `${tabRect.width}px`;
            slider.style.left = `${left}px`;

            // For pills variant, CSS handles vertical positioning (inset-y-1)
            // For underline variant, we need to set position dynamically
            if (!isPillsVariant) {
                const top = tabRect.top - containerRect.top;
                slider.style.height = `${tabRect.height}px`;
                slider.style.top = `${top}px`;
            }
        }

        /**
         * Handle keyboard navigation
         */
        function handleKeyboard(event: KeyboardEvent): void {
            const currentTab = event.target as HTMLElement;
            const currentIndex = Array.from(tabs).indexOf(currentTab);
            let nextTab: HTMLElement | null = null;

            const orientation = container.getAttribute('data-orientation') || 'horizontal';
            const isHorizontal = orientation === 'horizontal';

            switch (event.key) {
                case isHorizontal ? 'ArrowLeft' : 'ArrowUp':
                    event.preventDefault();
                    nextTab = tabs[currentIndex - 1] || tabs[tabs.length - 1];
                    break;
                case isHorizontal ? 'ArrowRight' : 'ArrowDown':
                    event.preventDefault();
                    nextTab = tabs[currentIndex + 1] || tabs[0];
                    break;
                case 'Home':
                    event.preventDefault();
                    nextTab = tabs[0];
                    break;
                case 'End':
                    event.preventDefault();
                    nextTab = tabs[tabs.length - 1];
                    break;
            }

            if (nextTab) {
                activateTab(nextTab);
                nextTab.focus();
            }
        }

        // Attach click event listeners
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                if (!tab.hasAttribute('disabled')) {
                    activateTab(tab);
                }
            });

            // Keyboard navigation
            tab.addEventListener('keydown', handleKeyboard);
        });

        // Initialize default tab
        const defaultTab = defaultValue
            ? container.querySelector<HTMLElement>(`[data-tab="${defaultValue}"]`)
            : tabs[0];

        if (defaultTab) {
            // Delay to ensure DOM is fully rendered
            setTimeout(() => {
                activateTab(defaultTab);
            }, 50);
        }

        // Responsive slider recalculation on window resize
        let resizeTimeout: number;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(() => {
                const activeTab = container.querySelector<HTMLElement>('[data-tab][aria-selected="true"]');
                if (activeTab && slider) {
                    updateSlider(activeTab);
                }
            }, 100);
        });
    });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTabs);
} else {
    initializeTabs();
}
