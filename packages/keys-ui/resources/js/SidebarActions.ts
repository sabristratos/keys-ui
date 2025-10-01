/**
 * Sidebar Component Actions
 * Handles mobile collapse/expand behavior and overlay interactions
 */

import { BaseActionClass } from './utils/BaseActionClass';

interface SidebarElements {
    sidebar: HTMLElement;
    overlay: HTMLElement | null;
    toggleButtons: HTMLButtonElement[];
}

export class SidebarActions extends BaseActionClass {
    private sidebars: Map<string, SidebarElements> = new Map();

    constructor() {
        super('SidebarActions');
    }

    public init(): void {
        console.log('[SidebarActions] Initializing sidebar actions');
        this.setupSidebars();
        this.setupEventListeners();
    }

    private setupSidebars(): void {
        const sidebars = document.querySelectorAll<HTMLElement>('[data-keys-sidebar="true"]');

        sidebars.forEach((sidebar) => {
            const id = sidebar.id;
            const overlay = document.querySelector<HTMLElement>(`[data-sidebar-overlay][data-sidebar-target="${id}"]`);
            const toggleButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(`[data-sidebar-toggle="${id}"]`));

            // Store original state of sections for restoration
            const details = sidebar.querySelectorAll('details[data-keys-sidebar-section]');
            details.forEach((detail) => {
                const section = detail as HTMLDetailsElement;
                if (!section.hasAttribute('open')) {
                    section.dataset.originallyCollapsed = 'true';
                }
            });

            this.sidebars.set(id, {
                sidebar,
                overlay,
                toggleButtons,
            });

            console.log(`[SidebarActions] Registered sidebar: ${id}`, { hasOverlay: !!overlay, toggleCount: toggleButtons.length });
        });
    }

    private setupEventListeners(): void {
        // Listen for toggle button clicks
        this.sidebars.forEach(({ sidebar, overlay, toggleButtons }, id) => {
            // Attach listeners to ALL toggle buttons for this sidebar
            toggleButtons.forEach((toggleButton) => {
                toggleButton.addEventListener('click', () => {
                    this.toggleSidebar(id);
                });
            });

            if (overlay) {
                overlay.addEventListener('click', () => {
                    this.closeSidebar(id);
                });
            }
        });

        // Listen for escape key to close sidebar on mobile
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeAllSidebars();
            }
        });

        // Listen for window resize to update toggle icons
        window.addEventListener('resize', () => {
            this.updateAllToggleIcons();
        });

        // Custom event listener for programmatic toggling
        document.addEventListener('sidebar:toggle', ((event: CustomEvent) => {
            const { sidebarId } = event.detail;
            if (sidebarId) {
                this.toggleSidebar(sidebarId);
            }
        }) as EventListener);

        document.addEventListener('sidebar:open', ((event: CustomEvent) => {
            const { sidebarId } = event.detail;
            if (sidebarId) {
                this.openSidebar(sidebarId);
            }
        }) as EventListener);

        document.addEventListener('sidebar:close', ((event: CustomEvent) => {
            const { sidebarId } = event.detail;
            if (sidebarId) {
                this.closeSidebar(sidebarId);
            }
        }) as EventListener);

        // Initial icon update
        this.updateAllToggleIcons();
    }

    private toggleSidebar(id: string): void {
        const elements = this.sidebars.get(id);
        if (!elements) {
            console.error(`[SidebarActions] Sidebar not found: ${id}`);
            return;
        }

        const { sidebar } = elements;
        const isCollapsed = sidebar.dataset.collapsed === 'true';

        if (isCollapsed) {
            this.openSidebar(id);
        } else {
            this.closeSidebar(id);
        }
    }

    private openSidebar(id: string): void {
        const elements = this.sidebars.get(id);
        if (!elements) {
            console.error(`[SidebarActions] Sidebar not found: ${id}`);
            return;
        }

        const { sidebar, overlay, toggleButtons } = elements;

        // Update data attribute and class - CSS handles the rest
        sidebar.dataset.collapsed = 'false';
        sidebar.classList.remove('sidebar-collapsed');

        // Restore original state of details elements when expanded
        const details = sidebar.querySelectorAll('details[data-keys-sidebar-section]');
        details.forEach((detail) => {
            // Check if this section was originally collapsed
            const section = detail as HTMLDetailsElement;
            if (section.dataset.originallyCollapsed === 'true') {
                section.removeAttribute('open');
            }
            // If it was open, keep it open (already has open attribute)
        });

        if (overlay) {
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            overlay.classList.add('opacity-100');
        }

        // Update toggle icons after state change
        this.updateToggleIcons(toggleButtons, id);

        // Dispatch custom event
        sidebar.dispatchEvent(new CustomEvent('sidebar:opened', { detail: { sidebarId: id } }));

        console.log(`[SidebarActions] Opened sidebar: ${id}`);
    }

    private closeSidebar(id: string): void {
        const elements = this.sidebars.get(id);
        if (!elements) {
            console.error(`[SidebarActions] Sidebar not found: ${id}`);
            return;
        }

        const { sidebar, overlay, toggleButtons } = elements;

        // Update data attribute and class - CSS handles the rest
        sidebar.dataset.collapsed = 'true';
        sidebar.classList.add('sidebar-collapsed');

        // Force all details elements to open when collapsed (for icon visibility)
        const details = sidebar.querySelectorAll('details[data-keys-sidebar-section]');
        details.forEach((detail) => {
            detail.setAttribute('open', '');
        });

        if (overlay) {
            overlay.classList.remove('opacity-100');
            overlay.classList.add('opacity-0', 'pointer-events-none');
        }

        // Update toggle icons after state change
        this.updateToggleIcons(toggleButtons, id);

        // Dispatch custom event
        sidebar.dispatchEvent(new CustomEvent('sidebar:closed', { detail: { sidebarId: id } }));

        console.log(`[SidebarActions] Closed sidebar: ${id}`);
    }

    private closeAllSidebars(): void {
        this.sidebars.forEach((_, id) => {
            this.closeSidebar(id);
        });
    }

    private updateAllToggleIcons(): void {
        this.sidebars.forEach(({ toggleButtons }, id) => {
            this.updateToggleIcons(toggleButtons, id);
        });
    }

    private updateToggleIcons(toggleButtons: HTMLButtonElement[], sidebarId: string): void {
        const isMobile = window.innerWidth < 1024;
        const elements = this.sidebars.get(sidebarId);
        if (!elements) return;

        const { sidebar } = elements;
        const isCollapsed = sidebar.dataset.collapsed === 'true';

        toggleButtons.forEach((button) => {
            const mobileIcon = button.dataset.mobileIcon || 'heroicon-o-x-mark';
            const desktopIcon = button.dataset.desktopIcon || 'heroicon-o-chevron-up-down';

            // Find the icon element inside the button
            const iconElement = button.querySelector('[data-icon]');
            if (!iconElement) return;

            const svgElement = iconElement.querySelector('svg');
            if (!svgElement) return;

            // On mobile, show X icon when sidebar is open, hide button when closed (it's in mobile header)
            // On desktop, always show desktop icon (chevron)
            const targetIcon = isMobile && !isCollapsed ? mobileIcon : desktopIcon;

            // Update the icon by changing the data-icon-name attribute
            // This assumes the icon component uses this attribute
            iconElement.setAttribute('data-icon-name', targetIcon);

            // For immediate visual update, we need to replace the SVG
            // This is a simplified approach - in production, you'd want to use the icon component's method
            this.updateIconSvg(svgElement, targetIcon);
        });
    }

    private updateIconSvg(svgElement: SVGElement, iconName: string): void {
        // Map common icon names to their SVG paths
        const iconPaths: Record<string, string> = {
            'heroicon-o-x-mark': 'M6 18L18 6M6 6l12 12',
            'heroicon-o-chevron-up-down': 'M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9',
        };

        const path = iconPaths[iconName];
        if (!path) return;

        // Clear existing paths and add new one
        svgElement.innerHTML = '';
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('stroke-linecap', 'round');
        pathElement.setAttribute('stroke-linejoin', 'round');
        pathElement.setAttribute('d', path);
        svgElement.appendChild(pathElement);
    }

    public destroy(): void {
        console.log('[SidebarActions] Destroying sidebar actions');
        this.sidebars.clear();
    }
}

export default SidebarActions;
