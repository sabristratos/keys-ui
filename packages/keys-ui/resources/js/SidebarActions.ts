import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

interface SidebarElements {
    sidebar: HTMLElement;
    overlay: HTMLElement | null;
    toggleButtons: HTMLButtonElement[];
}

export class SidebarActions extends BaseActionClass {
    private sidebars: Map<string, SidebarElements> = new Map();

    protected initializeElements(): void {
        const sidebars = DOMUtils.querySelectorAll('[data-keys-sidebar="true"]') as HTMLElement[];

        sidebars.forEach((sidebar) => {
            const id = sidebar.id;
            if (!id) return;

            const overlay = DOMUtils.querySelector(`[data-sidebar-overlay][data-sidebar-target="${id}"]`);
            const toggleButtons = Array.from(DOMUtils.querySelectorAll(`[data-sidebar-toggle="${id}"]`)) as HTMLButtonElement[];

            const details = DOMUtils.querySelectorAll('details[data-keys-sidebar-section]', sidebar);
            details.forEach((detail) => {
                if (!(detail as HTMLDetailsElement).hasAttribute('open')) {
                    detail.setAttribute('data-originally-collapsed', 'true');
                }
            });

            this.sidebars.set(id, {
                sidebar,
                overlay,
                toggleButtons,
            });
        });

        this.updateAllToggleIcons();
    }

    protected bindEventListeners(): void {
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;

            const toggleButton = target.closest('[data-sidebar-toggle]') as HTMLButtonElement;
            if (toggleButton) {
                const sidebarId = toggleButton.dataset.sidebarToggle;
                if (sidebarId) {
                    this.toggleSidebar(sidebarId);
                }
            }

            const overlay = target.closest('[data-sidebar-overlay]');
            if (overlay) {
                const sidebarId = overlay.getAttribute('data-sidebar-target');
                if (sidebarId) {
                    this.closeSidebar(sidebarId);
                }
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeAllSidebars();
            }
        });

        window.addEventListener('resize', () => {
            this.updateAllToggleIcons();
        });

        document.addEventListener('sidebar:toggle', ((event: CustomEvent) => {
            if (event.detail.sidebarId) this.toggleSidebar(event.detail.sidebarId);
        }) as EventListener);

        document.addEventListener('sidebar:open', ((event: CustomEvent) => {
            if (event.detail.sidebarId) this.openSidebar(event.detail.sidebarId);
        }) as EventListener);

        document.addEventListener('sidebar:close', ((event: CustomEvent) => {
            if (event.detail.sidebarId) this.closeSidebar(event.detail.sidebarId);
        }) as EventListener);
    }

    private toggleSidebar(id: string): void {
        const elements = this.sidebars.get(id);
        if (!elements) return;

        const isCollapsed = elements.sidebar.classList.contains('sidebar-collapsed');
        if (isCollapsed) {
            this.openSidebar(id);
        } else {
            this.closeSidebar(id);
        }
    }

    private openSidebar(id: string): void {
        const elements = this.sidebars.get(id);
        if (!elements) return;

        const { sidebar, overlay, toggleButtons } = elements;

        sidebar.dataset.collapsed = 'false';
        sidebar.classList.remove('sidebar-collapsed');

        const details = DOMUtils.querySelectorAll('details[data-keys-sidebar-section]', sidebar);
        details.forEach((detail) => {
            if (detail.hasAttribute('data-originally-collapsed')) {
                (detail as HTMLDetailsElement).open = false;
            } else {
                (detail as HTMLDetailsElement).open = true;
            }
        });

        if (overlay) {
            overlay.classList.remove('opacity-0', 'pointer-events-none');
            overlay.classList.add('opacity-100');
        }

        this.updateToggleIcons(toggleButtons, id);
        sidebar.dispatchEvent(new CustomEvent('sidebar:opened', { detail: { sidebarId: id } }));
    }

    private closeSidebar(id: string): void {
        const elements = this.sidebars.get(id);
        if (!elements) return;

        const { sidebar, overlay, toggleButtons } = elements;

        sidebar.dataset.collapsed = 'true';
        sidebar.classList.add('sidebar-collapsed');

        const details = DOMUtils.querySelectorAll('details[data-keys-sidebar-section]', sidebar);
        details.forEach((detail) => {
            (detail as HTMLDetailsElement).open = true;
        });

        if (overlay) {
            overlay.classList.remove('opacity-100');
            overlay.classList.add('opacity-0', 'pointer-events-none');
        }

        this.updateToggleIcons(toggleButtons, id);
        sidebar.dispatchEvent(new CustomEvent('sidebar:closed', { detail: { sidebarId: id } }));
    }

    private closeAllSidebars(): void {
        this.sidebars.forEach((_, id) => {
            const elements = this.sidebars.get(id);
            if(elements && !elements.sidebar.classList.contains('sidebar-collapsed')) {
                this.closeSidebar(id);
            }
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

        const isCollapsed = elements.sidebar.classList.contains('sidebar-collapsed');

        toggleButtons.forEach((button) => {
            const mobileIcon = button.dataset.mobileIcon || 'heroicon-o-x-mark';
            const desktopIcon = button.dataset.desktopIcon || 'heroicon-o-chevron-up-down';
            const iconElement = button.querySelector('[data-icon]');
            if (!iconElement) return;

            const targetIconName = isMobile && !isCollapsed ? mobileIcon : desktopIcon;

            const currentIcon = iconElement.getAttribute('data-original-name');
            if(currentIcon !== targetIconName) {
                iconElement.setAttribute('data-original-name', targetIconName);
                this.updateIconSvg(iconElement, targetIconName);
            }
        });
    }

    private updateIconSvg(iconContainer: Element, iconName: string): void {
        const iconPaths: Record<string, string> = {
            'heroicon-o-x-mark': '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />',
            'heroicon-o-chevron-up-down': '<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />',
            'heroicon-o-bars-3': '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />'
        };

        const svg = iconContainer.querySelector('svg');
        if (svg && iconPaths[iconName]) {
            svg.innerHTML = iconPaths[iconName];
        }
    }

    protected onDestroy(): void {
        this.sidebars.clear();
    }
}
