/**
 * BaseActionClass - Abstract base class for all Keys UI action classes
 *
 * Eliminates code duplication while preserving 100% of existing functionality:
 * - Singleton pattern implementation
 * - Initialization control and lifecycle management
 * - State management utilities
 * - Common cleanup and destroy patterns
 * - Extensible hooks for specialized functionality
 */

export abstract class BaseActionClass<TState = any> {
    private static instances = new Map<string, BaseActionClass>();
    protected initialized = false;

    /**
     * Singleton pattern implementation
     * Automatically handles instance management based on class name
     */
    public static getInstance<T extends BaseActionClass>(this: new () => T): T {
        const className = this.name;
        if (!BaseActionClass.instances.has(className)) {
            BaseActionClass.instances.set(className, new this());
        }
        return BaseActionClass.instances.get(className) as T;
    }

    /**
     * Built-in state management for component states
     * Most action classes use Map<HTMLElement, State> pattern
     */
    protected stateManager = new Map<HTMLElement, TState>();

    /**
     * Standardized initialization flow
     * Prevents double initialization and provides lifecycle hooks
     */
    public init(): void {
        if (this.initialized) {
            return;
        }

        this.onBeforeInit?.();

        this.bindEventListeners();
        this.initializeElements();

        this.setupDynamicObserver?.();

        this.onAfterInit?.();

        this.initialized = true;
    }

    /**
     * Abstract methods that subclasses must implement
     * These contain the core functionality specific to each action class
     */
    protected abstract bindEventListeners(): void;
    protected abstract initializeElements(): void;

    /**
     * Optional lifecycle hooks for specialized functionality
     * Subclasses can implement these as needed
     */
    protected onBeforeInit?(): void;
    protected onAfterInit?(): void;
    protected setupDynamicObserver?(): void;
    protected onDestroy?(): void;

    /**
     * Standardized cleanup and destroy
     * Handles state cleanup and provides extension point
     */
    public destroy(): void {
        this.onDestroy?.();
        this.stateManager.clear();
        this.initialized = false;
    }

    /**
     * State management utilities
     * Common operations used across multiple action classes
     */
    public getState(element: HTMLElement): TState | undefined {
        return this.stateManager.get(element);
    }

    public setState(element: HTMLElement, state: TState): void {
        this.stateManager.set(element, state);
    }

    public removeState(element: HTMLElement): boolean {
        return this.stateManager.delete(element);
    }

    public hasState(element: HTMLElement): boolean {
        return this.stateManager.has(element);
    }

    protected clearAllStates(): void {
        this.stateManager.clear();
    }

    protected getAllStates(): Map<HTMLElement, TState> {
        return new Map(this.stateManager);
    }

    /**
     * Common utility methods used across action classes
     * Note: For DOM operations use DOMUtils, for events use EventUtils
     */

    /**
     * Common MutationObserver setup for dynamic content
     * Used by many action classes to detect new elements
     */
    protected createDynamicObserver(callback: (addedNodes: NodeList) => void): MutationObserver {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    callback(mutation.addedNodes);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    /**
     * Debounced resize handler utility
     * Used by positioning-aware components
     */
    protected createResizeHandler(callback: () => void, delay: number = 100): () => void {
        let timeout: ReturnType<typeof setTimeout> | null = null;

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(callback, delay);
        };
    }

    /**
     * Check if the action class is properly initialized
     */
    public isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Get the number of managed states
     * Useful for debugging and testing
     */
    protected getStateCount(): number {
        return this.stateManager.size;
    }
}

export default BaseActionClass;