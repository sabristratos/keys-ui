/**
 * ChartActions - Handles interactive chart functionality
 *
 * Provides functionality for:
 * - Tooltip display and positioning on hover
 * - Chart animations and transitions
 * - Click event handling for data points
 * - Keyboard navigation for accessibility
 * - Custom event dispatching for framework integration
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

interface ChartState {
    element: HTMLElement;
    isInteractive: boolean;
    isAnimated: boolean;
    dataItems: HTMLElement[];
    activeClickedItem?: HTMLElement;
    tooltipPinned: boolean;
}

export class ChartActions extends BaseActionClass {
    private chartStates = new Map<HTMLElement, ChartState>();
    private outsideClickHandlers = new WeakMap<HTMLElement, (e: Event) => void>();

    /**
     * Bind event listeners - required by BaseActionClass
     */
    protected bindEventListeners(): void {
    }

    /**
     * Initialize chart elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        const charts = DOMUtils.querySelectorAll('[data-keys-chart="true"]') as HTMLElement[];

        charts.forEach(chart => {
            this.initializeChart(chart);
        });
    }

    /**
     * Initialize a single chart element
     */
    private initializeChart(chartElement: HTMLElement): void {
        const isInteractive = chartElement.getAttribute('data-interactive') === 'true';
        const isAnimated = chartElement.getAttribute('data-animated') === 'true';
        const dataItems = Array.from(chartElement.querySelectorAll('[data-chart-item="true"]')) as HTMLElement[];

        const state: ChartState = {
            element: chartElement,
            isInteractive,
            isAnimated,
            dataItems,
            activeClickedItem: undefined,
            tooltipPinned: false
        };

        this.chartStates.set(chartElement, state);

        if (isInteractive && dataItems.length > 0) {
            this.setupInteractiveEvents(state);
        }

        this.setupKeyboardNavigation(state);

        this.setupOutsideClickHandler(state);

        if (isAnimated) {
            this.triggerAnimations(state);
        }
    }

    /**
     * Set up interactive event listeners for chart data items
     */
    private setupInteractiveEvents(state: ChartState): void {
        state.dataItems.forEach((item, index) => {
            item.addEventListener('mouseenter', (event) => {
                const target = event.target as HTMLElement;
                if (!state.tooltipPinned || state.activeClickedItem === target) {
                    this.showTooltip(state, target);
                }
            });

            item.addEventListener('mouseleave', () => {
                if (!state.tooltipPinned) {
                    this.hideTooltip(state);
                }
            });

            item.addEventListener('click', (event) => {
                this.handleDataItemClick(state, event.target as HTMLElement);
            });
        });
    }

    /**
     * Set up keyboard navigation for chart accessibility
     */
    private setupKeyboardNavigation(state: ChartState): void {
        if (!state.isInteractive || state.dataItems.length === 0) {
            return;
        }

        const firstItem = state.dataItems[0];
        if (firstItem) {
            firstItem.setAttribute('tabindex', '0');
            firstItem.setAttribute('role', 'button');
            const label = firstItem.getAttribute('data-label') || '';
            const value = firstItem.getAttribute('data-value') || '';
            firstItem.setAttribute('aria-label', `${label}: ${value}`);
        }

        state.dataItems.forEach((item, index) => {
            const existingLabel = item.getAttribute('aria-label');
            if (!existingLabel) {
                const label = item.getAttribute('data-label') || '';
                const value = item.getAttribute('data-value') || '';
                item.setAttribute('aria-label', `${label}: ${value}`);
            }

            item.addEventListener('keydown', (event) => {
                this.handleKeyboardNavigation(state, event as KeyboardEvent, index);
            });
        });
    }

    /**
     * Set up outside click handler for pinned tooltips
     */
    private setupOutsideClickHandler(state: ChartState): void {
        const handler = (event: Event) => {
            const target = event.target as Node;

            if (state.tooltipPinned && !state.element.contains(target)) {
                this.hideTooltip(state);
                state.tooltipPinned = false;
                state.activeClickedItem = undefined;
            }
        };

        this.outsideClickHandlers.set(state.element, handler);
        document.addEventListener('click', handler);
    }

    /**
     * Clean up event listeners for a chart (prevents memory leaks)
     */
    public destroyChart(chartElement: HTMLElement): void {
        const handler = this.outsideClickHandlers.get(chartElement);
        if (handler) {
            document.removeEventListener('click', handler);
            this.outsideClickHandlers.delete(chartElement);
        }

        this.chartStates.delete(chartElement);
    }

    /**
     * Handle keyboard navigation between chart data items
     */
    private handleKeyboardNavigation(state: ChartState, event: KeyboardEvent, currentIndex: number): void {
        let nextIndex = -1;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                nextIndex = (currentIndex + 1) % state.dataItems.length;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                nextIndex = currentIndex === 0 ? state.dataItems.length - 1 : currentIndex - 1;
                break;
            case 'Home':
                nextIndex = 0;
                break;
            case 'End':
                nextIndex = state.dataItems.length - 1;
                break;
            case 'Enter':
            case ' ':
                this.handleDataItemClick(state, event.target as HTMLElement);
                event.preventDefault();
                return;
        }

        if (nextIndex !== -1) {
            event.preventDefault();
            this.focusDataItem(state, nextIndex);
        }
    }

    /**
     * Focus on a specific data item
     */
    private focusDataItem(state: ChartState, index: number): void {
        state.dataItems.forEach(item => {
            item.setAttribute('tabindex', '-1');
        });

        const targetItem = state.dataItems[index];
        if (targetItem) {
            targetItem.setAttribute('tabindex', '0');
            targetItem.focus();
        }
    }

    /**
     * Show tooltip for chart item on hover
     */
    private showTooltip(state: ChartState, item: HTMLElement): void {
        const itemData = this.extractItemData(item);
        if (!itemData) return;

        let tooltip = state.element.querySelector('[data-chart-tooltip]') as HTMLElement;
        if (!tooltip) {
            tooltip = this.createTooltip(state);
        }

        const isPieSlice = item.hasAttribute('data-chart-pie-slice');
        let tooltipContent: string;

        if (isPieSlice) {
            const percentage = item.getAttribute('data-percentage') || '0';
            tooltipContent = `${itemData.label}: ${this.formatTooltipValue(itemData.value)} (${percentage}%)`;
        } else {
            tooltipContent = `${itemData.label}: ${this.formatTooltipValue(itemData.value)}`;
        }

        tooltip.textContent = tooltipContent;

        this.positionTooltip(tooltip, item);

        tooltip.style.opacity = '1';
        tooltip.style.pointerEvents = 'none';
    }

    /**
     * Hide tooltip
     */
    private hideTooltip(state: ChartState): void {
        const tooltip = state.element.querySelector('[data-chart-tooltip]') as HTMLElement;
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }

    /**
     * Create tooltip element
     */
    private createTooltip(state: ChartState): HTMLElement {
        const tooltip = document.createElement('div');
        tooltip.setAttribute('data-chart-tooltip', 'true');
        tooltip.className = 'chart-tooltip absolute px-2 py-1 text-xs font-medium pointer-events-none opacity-0 transition-opacity duration-200';
        state.element.appendChild(tooltip);
        return tooltip;
    }

    /**
     * Position tooltip relative to chart item
     */
    private positionTooltip(tooltip: HTMLElement, item: HTMLElement): void {
        const itemRect = item.getBoundingClientRect();
        const containerRect = tooltip.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };

        const left = itemRect.left - containerRect.left + (itemRect.width / 2) - (tooltip.offsetWidth / 2);
        const top = itemRect.top - containerRect.top - tooltip.offsetHeight - 8;

        tooltip.style.left = `${Math.max(0, left)}px`;
        tooltip.style.top = `${Math.max(0, top)}px`;
    }

    /**
     * Format tooltip value for display
     */
    private formatTooltipValue(value: string): string {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return value;
        return numValue.toLocaleString();
    }

    /**
     * Extract data from chart item element for click handling
     */
    private extractItemData(item: HTMLElement): {index: number, value: string, label: string} | null {
        const index = item.getAttribute('data-index');
        const value = item.getAttribute('data-value');
        const label = item.getAttribute('data-label');

        if (index === null || value === null || label === null) {
            return null;
        }

        return {
            index: parseInt(index),
            value,
            label
        };
    }

    /**
     * Handle click events on chart data items
     */
    private handleDataItemClick(state: ChartState, item: HTMLElement): void {
        const itemData = this.extractItemData(item);
        if (!itemData) return;

        if (state.activeClickedItem === item && state.tooltipPinned) {
            this.hideTooltip(state);
            state.tooltipPinned = false;
            state.activeClickedItem = undefined;
        } else {
            this.showTooltip(state, item);
            state.tooltipPinned = true;
            state.activeClickedItem = item;
        }

        (item as HTMLElement).blur();

        const customEvent = new CustomEvent('chart:item:click', {
            detail: {
                ...itemData,
                element: item,
                chart: state.element
            },
            bubbles: true,
            cancelable: true
        });

        state.element.dispatchEvent(customEvent);

        if ('Livewire' in window) {
            const livewireEl = state.element.closest('[wire\\:id]');
            if (livewireEl) {
                const componentId = livewireEl.getAttribute('wire:id');
                if (componentId) {
                    (window as any).Livewire.find(componentId)?.$dispatch('chart-item-clicked', {
                        index: itemData.index,
                        value: itemData.value,
                        label: itemData.label
                    });
                }
            }
        }
    }

    /**
     * Trigger chart animations
     * Note: Animations are now handled by CSS @keyframes with animation-delay attributes
     * This method dispatches the animation complete event for framework integration
     */
    private triggerAnimations(state: ChartState): void {
        const staggerDelay = state.dataItems.length * 100;
        const animationDuration = 800;
        const totalDelay = staggerDelay + animationDuration;

        setTimeout(() => {
            const event = new CustomEvent('chart:animation:complete', {
                detail: { chart: state.element },
                bubbles: true
            });
            state.element.dispatchEvent(event);
        }, totalDelay);
    }

    /**
     * Public API: Refresh chart (useful for dynamic data updates)
     */
    public refreshChart(chartElement: HTMLElement): void {
        const state = this.chartStates.get(chartElement);
        if (!state) return;

        state.dataItems = Array.from(chartElement.querySelectorAll('[data-chart-item="true"]')) as HTMLElement[];

        if (state.isInteractive) {
            this.setupInteractiveEvents(state);
        }

        if (state.isAnimated) {
            this.triggerAnimations(state);
        }
    }

    /**
     * Public API: Update chart data (for dynamic charts)
     */
    public updateChartData(chartElement: HTMLElement, newData: any[]): void {
        const event = new CustomEvent('chart:data:update', {
            detail: { chart: chartElement, data: newData },
            bubbles: true
        });
        chartElement.dispatchEvent(event);
    }
}