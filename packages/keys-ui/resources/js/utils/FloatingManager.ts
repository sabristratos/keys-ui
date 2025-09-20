/**
 * FloatingManager - Professional floating element positioning using Floating UI
 *
 * Provides functionality for creating properly anchored floating elements
 * that escape overflow constraints with intelligent positioning
 */

import {
    computePosition,
    flip,
    shift,
    offset,
    autoUpdate,
    arrow,
    hide,
    size,
    inline,
    limitShift,
    detectOverflow,
    Placement,
    Middleware,
    MiddlewareData
} from '@floating-ui/dom';

export interface FloatingOptions {
    placement?: Placement;
    offset?: number | { mainAxis?: number; crossAxis?: number; alignmentAxis?: number | null };
    flip?: boolean | {
        fallbackPlacements?: Placement[];
        fallbackStrategy?: 'bestFit' | 'initialPlacement';
        boundary?: HTMLElement | HTMLElement[];
        rootBoundary?: 'viewport' | 'document';
        padding?: number;
    };
    shift?: boolean | {
        boundary?: HTMLElement | HTMLElement[];
        rootBoundary?: 'viewport' | 'document';
        padding?: number;
        limiter?: typeof limitShift;
        crossAxis?: boolean;
    };
    arrow?: HTMLElement | boolean;
    hide?: boolean | {
        strategy?: 'referenceHidden' | 'escaped';
        boundary?: HTMLElement | HTMLElement[];
        rootBoundary?: 'viewport' | 'document';
        padding?: number;
    };
    size?: boolean | {
        apply?: (args: { availableWidth: number; availableHeight: number; placement: Placement }) => void;
        boundary?: HTMLElement | HTMLElement[];
        rootBoundary?: 'viewport' | 'document';
        padding?: number;
    };
    inline?: boolean | {
        x?: number;
        y?: number;
    };
    autoUpdate?: boolean | {
        ancestorScroll?: boolean;
        ancestorResize?: boolean;
        elementResize?: boolean;
        layoutShift?: boolean;
        animationFrame?: boolean;
    };
    strategy?: 'absolute' | 'fixed';
    boundary?: HTMLElement | HTMLElement[];
    rootBoundary?: 'viewport' | 'document';
    detectOverflowOptions?: {
        boundary?: HTMLElement | HTMLElement[];
        rootBoundary?: 'viewport' | 'document';
        padding?: number;
        altBoundary?: boolean;
    };
    fallbackStrategy?: 'bestFit' | 'initialPlacement';
    useFloating?: boolean; // Enable/disable Floating UI (default true)
}

export interface FloatingInstance {
    id: string;
    trigger: HTMLElement;
    floating: HTMLElement;
    cleanup: () => void;
    update: () => Promise<void>;
    middlewareData?: MiddlewareData;
    placement?: Placement;
    x?: number;
    y?: number;
}

export class FloatingManager {
    private static instance: FloatingManager;
    private floatingElements: Map<string, FloatingInstance> = new Map();

    private constructor() {
        this.bindEvents();
    }

    public static getInstance(): FloatingManager {
        if (!FloatingManager.instance) {
            FloatingManager.instance = new FloatingManager();
        }
        return FloatingManager.instance;
    }

    /**
     * Create a floating element with proper anchoring to trigger
     */
    public createFloating(
        trigger: HTMLElement,
        floating: HTMLElement,
        options: FloatingOptions = {}
    ): FloatingInstance {
        // Check if Floating UI should be used (default true)
        if (options.useFloating === false) {
            return this.createFallbackFloating(trigger, floating, options);
        }

        const id = this.generateFloatingId();

        // Configure middleware based on options
        const middleware: Middleware[] = [];

        // Add offset middleware
        if (options.offset !== undefined) {
            middleware.push(offset(options.offset));
        } else {
            // Default offset
            middleware.push(offset(8));
        }

        // Add inline middleware if specified
        if (options.inline) {
            const inlineOptions = typeof options.inline === 'object' ? options.inline : {};
            middleware.push(inline(inlineOptions));
        }

        // Add flip middleware for smart repositioning
        if (options.flip !== false) {
            const flipOptions = typeof options.flip === 'object' ? options.flip : {};
            middleware.push(flip({
                boundary: flipOptions.boundary || options.boundary,
                rootBoundary: flipOptions.rootBoundary || options.rootBoundary || 'viewport',
                fallbackPlacements: flipOptions.fallbackPlacements || this.getFallbackPlacements(options.placement || 'bottom'),
                fallbackStrategy: flipOptions.fallbackStrategy || options.fallbackStrategy || 'bestFit',
                padding: flipOptions.padding || 8
            }));
        }

        // Add shift middleware to keep in viewport
        if (options.shift !== false) {
            const shiftOptions = typeof options.shift === 'object' ? options.shift : {};
            middleware.push(shift({
                boundary: shiftOptions.boundary || options.boundary,
                rootBoundary: shiftOptions.rootBoundary || options.rootBoundary || 'viewport',
                padding: shiftOptions.padding || 8,
                limiter: shiftOptions.limiter,
                crossAxis: shiftOptions.crossAxis !== false
            }));
        }

        // Add size middleware for adaptive sizing
        if (options.size) {
            const sizeOptions = typeof options.size === 'object' ? options.size : {};
            middleware.push(size({
                boundary: sizeOptions.boundary || options.boundary,
                rootBoundary: sizeOptions.rootBoundary || options.rootBoundary || 'viewport',
                padding: sizeOptions.padding || 8,
                apply: sizeOptions.apply || (({ availableWidth, availableHeight }) => {
                    Object.assign(floating.style, {
                        maxWidth: `${availableWidth}px`,
                        maxHeight: `${availableHeight}px`
                    });
                })
            }));
        }

        // Add hide middleware for visibility detection
        if (options.hide !== false) {
            const hideOptions = typeof options.hide === 'object' ? options.hide : {};
            middleware.push(hide({
                strategy: hideOptions.strategy || 'referenceHidden',
                boundary: hideOptions.boundary || options.boundary,
                rootBoundary: hideOptions.rootBoundary || options.rootBoundary || 'viewport',
                padding: hideOptions.padding || 8
            }));
        }

        // Add arrow middleware if element provided
        if (options.arrow && options.arrow !== true) {
            middleware.push(arrow({ element: options.arrow as HTMLElement }));
        }

        // Update position function with enhanced features
        const updatePosition = async () => {
            const { x, y, placement, middlewareData } = await computePosition(trigger, floating, {
                placement: options.placement || 'bottom-start',
                strategy: options.strategy || 'absolute',
                middleware
            });

            // Store position data
            const instance = this.floatingElements.get(id);
            if (instance) {
                instance.x = x;
                instance.y = y;
                instance.placement = placement;
                instance.middlewareData = middlewareData;
            }

            // Apply position
            Object.assign(floating.style, {
                left: `${x}px`,
                top: `${y}px`,
                position: options.strategy || 'absolute'
            });

            // Update placement attribute for styling
            floating.setAttribute('data-floating-placement', placement);

            // Handle visibility based on hide middleware
            if (middlewareData.hide) {
                const { referenceHidden, escaped } = middlewareData.hide;
                floating.style.visibility = referenceHidden || escaped ? 'hidden' : 'visible';
            }

            // Position arrow if provided
            if (options.arrow && options.arrow !== true && middlewareData.arrow) {
                const arrowEl = options.arrow as HTMLElement;
                const { x: arrowX, y: arrowY } = middlewareData.arrow;

                const staticSide = {
                    top: 'bottom',
                    right: 'left',
                    bottom: 'top',
                    left: 'right',
                }[placement.split('-')[0]];

                Object.assign(arrowEl.style, {
                    left: arrowX != null ? `${arrowX}px` : '',
                    top: arrowY != null ? `${arrowY}px` : '',
                    right: '',
                    bottom: '',
                    [staticSide!]: '-4px',
                });
            }
        };

        // Setup auto-update with configurable options
        const autoUpdateOptions = options.autoUpdate !== false ?
            (typeof options.autoUpdate === 'object' ? options.autoUpdate : {}) : null;

        let cleanupAutoUpdate: (() => void) | null = null;

        if (autoUpdateOptions) {
            cleanupAutoUpdate = autoUpdate(trigger, floating, updatePosition, {
                ancestorScroll: autoUpdateOptions.ancestorScroll !== false,
                ancestorResize: autoUpdateOptions.ancestorResize !== false,
                elementResize: autoUpdateOptions.elementResize !== false,
                layoutShift: autoUpdateOptions.layoutShift !== false,
                animationFrame: autoUpdateOptions.animationFrame === true
            });
        }

        const cleanup = () => {
            if (cleanupAutoUpdate) {
                cleanupAutoUpdate();
            }
            this.destroyFloating(id);
        };

        const floatingInstance: FloatingInstance = {
            id,
            trigger,
            floating,
            cleanup,
            update: updatePosition
        };

        this.floatingElements.set(id, floatingInstance);

        // Initial position
        updatePosition();

        return floatingInstance;
    }

    /**
     * Create fallback floating element when Floating UI is disabled
     * Uses CSS-based positioning as fallback
     */
    private createFallbackFloating(
        trigger: HTMLElement,
        floating: HTMLElement,
        options: FloatingOptions = {}
    ): FloatingInstance {
        const id = this.generateFloatingId();

        // Simple CSS positioning fallback
        const updatePosition = async () => {
            const triggerRect = trigger.getBoundingClientRect();
            const floatingRect = floating.getBoundingClientRect();

            let top = 0;
            let left = 0;

            const placement = options.placement || 'bottom-start';
            const offset = typeof options.offset === 'number' ? options.offset : 8;

            // Basic placement logic
            if (placement.startsWith('bottom')) {
                top = triggerRect.bottom + offset;
            } else if (placement.startsWith('top')) {
                top = triggerRect.top - floatingRect.height - offset;
            } else if (placement.startsWith('right')) {
                left = triggerRect.right + offset;
            } else if (placement.startsWith('left')) {
                left = triggerRect.left - floatingRect.width - offset;
            }

            // Alignment
            if (placement.includes('start')) {
                if (placement.startsWith('top') || placement.startsWith('bottom')) {
                    left = triggerRect.left;
                } else {
                    top = triggerRect.top;
                }
            } else if (placement.includes('end')) {
                if (placement.startsWith('top') || placement.startsWith('bottom')) {
                    left = triggerRect.right - floatingRect.width;
                } else {
                    top = triggerRect.bottom - floatingRect.height;
                }
            } else {
                // Center alignment
                if (placement.startsWith('top') || placement.startsWith('bottom')) {
                    left = triggerRect.left + (triggerRect.width - floatingRect.width) / 2;
                } else {
                    top = triggerRect.top + (triggerRect.height - floatingRect.height) / 2;
                }
            }

            // Apply position
            Object.assign(floating.style, {
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`
            });

            floating.setAttribute('data-floating-placement', placement);
        };

        const cleanup = () => {
            this.destroyFloating(id);
        };

        const floatingInstance: FloatingInstance = {
            id,
            trigger,
            floating,
            cleanup,
            update: updatePosition
        };

        this.floatingElements.set(id, floatingInstance);

        // Initial position
        updatePosition();

        // Simple resize/scroll listeners for fallback
        const handleUpdate = () => updatePosition();
        window.addEventListener('resize', handleUpdate);
        window.addEventListener('scroll', handleUpdate, true);

        // Update cleanup to remove listeners
        floatingInstance.cleanup = () => {
            window.removeEventListener('resize', handleUpdate);
            window.removeEventListener('scroll', handleUpdate, true);
            this.destroyFloating(id);
        };

        return floatingInstance;
    }

    /**
     * Destroy a specific floating element
     */
    public destroyFloating(id: string): void {
        const floating = this.floatingElements.get(id);
        if (floating) {
            this.floatingElements.delete(id);
        }
    }

    /**
     * Destroy all floating elements
     */
    public destroyAllFloating(): void {
        this.floatingElements.forEach(floating => {
            floating.cleanup();
        });
        this.floatingElements.clear();
    }

    /**
     * Get a floating instance by ID
     */
    public getFloating(id: string): FloatingInstance | undefined {
        return this.floatingElements.get(id);
    }

    /**
     * Update all floating elements
     */
    public async updateAllFloating(): Promise<void> {
        const updatePromises = Array.from(this.floatingElements.values()).map(floating =>
            floating.update()
        );
        await Promise.all(updatePromises);
    }

    /**
     * Generate unique floating ID
     */
    private generateFloatingId(): string {
        return `floating-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get fallback placements for flip middleware
     */
    private getFallbackPlacements(placement: Placement): Placement[] {
        const fallbacks: Record<string, Placement[]> = {
            'bottom': ['top', 'bottom-end', 'bottom-start'],
            'bottom-start': ['top-start', 'bottom-end', 'bottom'],
            'bottom-end': ['top-end', 'bottom-start', 'bottom'],
            'top': ['bottom', 'top-end', 'top-start'],
            'top-start': ['bottom-start', 'top-end', 'top'],
            'top-end': ['bottom-end', 'top-start', 'top'],
            'right': ['left', 'right-end', 'right-start'],
            'right-start': ['left-start', 'right-end', 'right'],
            'right-end': ['left-end', 'right-start', 'right'],
            'left': ['right', 'left-end', 'left-start'],
            'left-start': ['right-start', 'left-end', 'left'],
            'left-end': ['right-end', 'left-start', 'left']
        };

        return fallbacks[placement] || ['bottom', 'top', 'right', 'left'];
    }

    /**
     * Bind global events for floating management
     */
    private bindEvents(): void {
        // Clean up floating elements when page unloads
        window.addEventListener('beforeunload', () => {
            this.destroyAllFloating();
        });

        // Handle escape key to close floating elements
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                // Let individual components handle their own escape logic
                // This is just for potential future enhancements
            }
        });
    }

    /**
     * Cleanup manager and all floating elements
     */
    public destroy(): void {
        this.destroyAllFloating();
    }
}

export default FloatingManager.getInstance();