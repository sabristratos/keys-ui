/**
 * ModalActions - Optional enhancements for Modal components
 *
 * Provides functionality for:
 * - Enhanced animations beyond CSS
 * - Custom event dispatching
 * - Programmatic modal control
 * - Focus restoration enhancements
 *
 * Note: Core modal functionality works without JavaScript using native dialog features
 */

interface ModalState {
    lastFocusedElement: HTMLElement | null;
    isAnimating: boolean;
}

interface ModalEventDetail {
    modal: HTMLDialogElement;
    trigger?: HTMLElement;
}

export class ModalActions {
    private static instance: ModalActions | null = null;
    private initialized = false;
    private modalStates = new Map<HTMLDialogElement, ModalState>();

    /**
     * Get singleton instance
     */
    public static getInstance(): ModalActions {
        if (!ModalActions.instance) {
            ModalActions.instance = new ModalActions();
        }
        return ModalActions.instance;
    }

    /**
     * Initialize ModalActions for enhanced features
     */
    public init(): void {
        if (this.initialized) {
            return;
        }

        this.bindEventListeners();
        this.initializeModals();
        this.setupLivewireIntegration();
        this.initialized = true;
        console.log('ModalActions initialized');
    }

    /**
     * Initialize all existing modal elements
     */
    private initializeModals(): void {
        document.querySelectorAll('dialog[data-modal]').forEach(modal => {
            this.initializeModal(modal as HTMLDialogElement);
        });
    }

    /**
     * Initialize a single modal element
     */
    private initializeModal(modal: HTMLDialogElement): void {
        if (this.modalStates.has(modal)) {
            return;
        }

        const state: ModalState = {
            lastFocusedElement: null,
            isAnimating: false
        };

        this.modalStates.set(modal, state);

        // Listen for native dialog events
        modal.addEventListener('close', () => {
            this.handleModalClose(modal);
        });

        modal.addEventListener('cancel', (event) => {
            this.handleModalCancel(modal, event);
        });
    }

    /**
     * Bind event listeners for enhanced modal functionality
     */
    private bindEventListeners(): void {
        // Handle command invoker clicks for focus tracking
        document.addEventListener('click', (event) => {
            const trigger = (event.target as Element)?.closest('[commandfor]') as HTMLElement;
            if (trigger) {
                const command = trigger.getAttribute('command');
                const modalId = trigger.getAttribute('commandfor');

                if (command === 'show-modal' && modalId) {
                    const modal = document.getElementById(modalId) as HTMLDialogElement;
                    if (modal && modal.matches('dialog[data-modal]')) {
                        this.handleModalOpen(modal, trigger);
                    }
                }
            }

            // Handle data-modal-close attributes for custom close buttons
            const closeButton = (event.target as Element)?.closest('[data-modal-close]') as HTMLElement;
            if (closeButton) {
                const modal = closeButton.closest('dialog[data-modal]') as HTMLDialogElement;
                if (modal) {
                    modal.close();
                }
            }
        });

        // Watch for new modals being added to the DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        const modals = element.querySelectorAll('dialog[data-modal]');
                        modals.forEach(modal => {
                            this.initializeModal(modal as HTMLDialogElement);
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
     * Handle modal opening for enhanced features
     */
    private handleModalOpen(modal: HTMLDialogElement, trigger?: HTMLElement): void {
        const state = this.modalStates.get(modal);
        if (!state) return;

        // Store the trigger element for focus restoration
        state.lastFocusedElement = trigger || document.activeElement as HTMLElement;
        this.modalStates.set(modal, state);

        // Dispatch custom open event
        this.dispatchModalEvent(modal, 'modal:open', { trigger });

        // Enhanced focus management
        setTimeout(() => {
            this.setInitialFocus(modal);
        }, 50); // Small delay to ensure modal is fully rendered
    }

    /**
     * Handle modal close event
     */
    private handleModalClose(modal: HTMLDialogElement): void {
        const state = this.modalStates.get(modal);
        if (!state) return;

        // Restore focus to the trigger element
        if (state.lastFocusedElement && document.contains(state.lastFocusedElement)) {
            state.lastFocusedElement.focus();
        }

        // Reset state
        state.lastFocusedElement = null;
        state.isAnimating = false;
        this.modalStates.set(modal, state);

        // Dispatch custom close event
        this.dispatchModalEvent(modal, 'modal:close');
    }

    /**
     * Handle modal cancel event (ESC key)
     */
    private handleModalCancel(modal: HTMLDialogElement, event: Event): void {
        // Allow default behavior but dispatch custom event
        this.dispatchModalEvent(modal, 'modal:cancel', { originalEvent: event });
    }

    /**
     * Set initial focus when modal opens
     */
    private setInitialFocus(modal: HTMLDialogElement): void {
        // Look for autofocus element first
        const autofocusElement = modal.querySelector('[autofocus]') as HTMLElement;
        if (autofocusElement) {
            autofocusElement.focus();
            return;
        }

        // Look for first focusable element
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
        }
    }


    /**
     * Check if a modal is open
     */
    public isModalOpen(modalId: string): boolean {
        const modal = document.getElementById(modalId) as HTMLDialogElement;
        return modal ? modal.open : false;
    }

    /**
     * Dispatch custom modal events
     */
    private dispatchModalEvent(modal: HTMLDialogElement, eventName: string, detail: any = {}): void {
        const event = new CustomEvent(eventName, {
            detail: {
                modal,
                ...detail
            },
            bubbles: true,
            cancelable: true
        });
        modal.dispatchEvent(event);
    }

    /**
     * Get modal state (for external access)
     */
    public getModalState(modalId: string): ModalState | null {
        const modal = document.getElementById(modalId) as HTMLDialogElement;
        return modal ? this.modalStates.get(modal) || null : null;
    }

    /**
     * Set up Livewire integration if available
     */
    private setupLivewireIntegration(): void {
        // Check if Livewire is available
        if (typeof window.Livewire === 'undefined') {
            return;
        }

        // Listen for Livewire modal control events
        window.Livewire.on('openModal', (data: any) => {
            const modalId = data.id || data.modal;
            if (modalId) {
                this.openModal(modalId);

                // Update wire:model if specified
                if (data.wireModel) {
                    this.updateWireModel(modalId, true);
                }
            }
        });

        window.Livewire.on('closeModal', (data: any) => {
            const modalId = data.id || data.modal;
            if (modalId) {
                this.closeModal(modalId);

                // Update wire:model if specified
                if (data.wireModel) {
                    this.updateWireModel(modalId, false);
                }
            } else {
                // Close all modals if no specific ID
                this.closeAllModals();
            }
        });

        window.Livewire.on('toggleModal', (data: any) => {
            const modalId = data.id || data.modal;
            if (modalId) {
                this.toggleModal(modalId);
            }
        });

        console.log('Livewire modal integration initialized');
    }

    /**
     * Update Livewire wire:model for modal state
     */
    private updateWireModel(modalId: string, isOpen: boolean): void {
        const modal = document.getElementById(modalId) as HTMLDialogElement;
        if (!modal) return;

        const wireModel = modal.getAttribute('wire:model');
        if (wireModel && typeof window.Livewire !== 'undefined' && window.Livewire.find) {
            // Find the Livewire component and update the model
            const component = window.Livewire.find(modal.closest('[wire\\:id]')?.getAttribute('wire:id'));
            if (component) {
                component.set(wireModel, isOpen);
            }
        }
    }

    /**
     * Toggle a modal's open state
     */
    public toggleModal(modalId: string): boolean {
        const modal = document.getElementById(modalId) as HTMLDialogElement;
        if (!modal || !modal.matches('dialog[data-modal]')) {
            console.warn(`Modal with id "${modalId}" not found`);
            return false;
        }

        if (modal.open) {
            return this.closeModal(modalId);
        } else {
            return this.openModal(modalId);
        }
    }

    /**
     * Close all open modals
     */
    public closeAllModals(): void {
        document.querySelectorAll('dialog[data-modal][open]').forEach(modal => {
            if (modal.id) {
                this.closeModal(modal.id);
            }
        });
    }

    /**
     * Enhanced modal open with Livewire event dispatching
     */
    public openModal(modalId: string, trigger?: HTMLElement): boolean {
        const modal = document.getElementById(modalId) as HTMLDialogElement;
        if (!modal || !modal.matches('dialog[data-modal]')) {
            console.warn(`Modal with id "${modalId}" not found`);
            return false;
        }

        this.handleModalOpen(modal, trigger);
        modal.showModal();

        // Dispatch Livewire event if available
        this.dispatchLivewireEvent('modalOpened', { id: modalId, modal: modalId });

        return true;
    }

    /**
     * Enhanced modal close with Livewire event dispatching
     */
    public closeModal(modalId: string): boolean {
        const modal = document.getElementById(modalId) as HTMLDialogElement;
        if (!modal || !modal.matches('dialog[data-modal]')) {
            console.warn(`Modal with id "${modalId}" not found`);
            return false;
        }

        modal.close();

        // Dispatch Livewire event if available
        this.dispatchLivewireEvent('modalClosed', { id: modalId, modal: modalId });

        return true;
    }

    /**
     * Dispatch Livewire events
     */
    private dispatchLivewireEvent(eventName: string, data: any): void {
        if (typeof window.Livewire !== 'undefined' && window.Livewire.dispatch) {
            window.Livewire.dispatch(eventName, data);
        }
    }

    /**
     * Enhanced modal close handler with Livewire integration
     */
    private handleModalClose(modal: HTMLDialogElement): void {
        const state = this.modalStates.get(modal);
        if (!state) return;

        // Update wire:model if present
        const wireModel = modal.getAttribute('wire:model');
        if (wireModel) {
            this.updateWireModel(modal.id, false);
        }

        // Restore focus to the trigger element
        if (state.lastFocusedElement && document.contains(state.lastFocusedElement)) {
            state.lastFocusedElement.focus();
        }

        // Reset state
        state.lastFocusedElement = null;
        state.isAnimating = false;
        this.modalStates.set(modal, state);

        // Dispatch custom close event
        this.dispatchModalEvent(modal, 'modal:close');

        // Dispatch Livewire event
        this.dispatchLivewireEvent('modalClosed', { id: modal.id, modal: modal.id });
    }

    /**
     * Enhanced modal open handler with Livewire integration
     */
    private handleModalOpen(modal: HTMLDialogElement, trigger?: HTMLElement): void {
        const state = this.modalStates.get(modal);
        if (!state) return;

        // Update wire:model if present
        const wireModel = modal.getAttribute('wire:model');
        if (wireModel) {
            this.updateWireModel(modal.id, true);
        }

        // Store the trigger element for focus restoration
        state.lastFocusedElement = trigger || document.activeElement as HTMLElement;
        this.modalStates.set(modal, state);

        // Dispatch custom open event
        this.dispatchModalEvent(modal, 'modal:open', { trigger });

        // Dispatch Livewire event
        this.dispatchLivewireEvent('modalOpened', { id: modal.id, modal: modal.id });

        // Enhanced focus management
        setTimeout(() => {
            this.setInitialFocus(modal);
        }, 50); // Small delay to ensure modal is fully rendered
    }

    /**
     * Destroy ModalActions and clean up
     */
    public destroy(): void {
        this.modalStates.clear();
        this.initialized = false;
        console.log('ModalActions destroyed');
    }
}

// Type declarations for Livewire integration
declare global {
    interface Window {
        Livewire?: {
            on: (event: string, callback: (data: any) => void) => void;
            dispatch: (event: string, data?: any) => void;
            find: (id: string) => any;
        };
    }
}

// Export default instance
export default ModalActions.getInstance();