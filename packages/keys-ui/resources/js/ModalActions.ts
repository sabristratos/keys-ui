/**
 * ModalActions - Optional enhancements for Modal components
 *
 * Provides functionality for:
 * - Custom event dispatching
 * - Programmatic modal control
 * - Focus restoration enhancements
 * - Livewire integration
 *
 * Note: Core modal functionality works without JavaScript using native dialog features
 * Animations are now handled by pure CSS transitions
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';

interface ModalState {
    lastFocusedElement: HTMLElement | null;
}

interface ModalEventDetail {
    modal: HTMLDialogElement;
    trigger?: HTMLElement;
}

export class ModalActions extends BaseActionClass<ModalState> {


    /**
     * Initialize modal elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        DOMUtils.querySelectorAll('dialog[data-modal]').forEach(modal => {
            this.initializeModal(modal as HTMLDialogElement);
        });
        this.setupLivewireIntegration();
    }

    /**
     * Initialize a single modal element
     */
    private initializeModal(modal: HTMLDialogElement): void {
        if (this.hasState(modal)) {
            return;
        }

        const state: ModalState = {
            lastFocusedElement: null
        };

        this.setState(modal, state);

        modal.addEventListener('close', () => {
            this.handleModalClose(modal);
        });

        modal.addEventListener('cancel', (event) => {
            this.handleModalCancel(modal, event);
        });
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        EventUtils.handleDelegatedClick('[commandfor]', (trigger, event) => {
            const command = trigger.getAttribute('command');
            const modalId = trigger.getAttribute('commandfor');

            if (command === 'show-modal' && modalId) {
                const modal = DOMUtils.getElementById(modalId) as HTMLDialogElement;
                if (modal && modal.matches('dialog[data-modal]')) {
                    this.handleModalOpen(modal, trigger);
                }
            }
        });

        EventUtils.handleDelegatedClick('[data-modal-close]', (closeButton, event) => {
            const modal = DOMUtils.findClosest(closeButton, 'dialog[data-modal]') as HTMLDialogElement;
            if (modal) {
                modal.close();
            }
        });
    }

    /**
     * Setup dynamic observer for new modals - uses BaseActionClass utility
     */
    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;

                    if (element.matches && element.matches('dialog[data-modal]')) {
                        this.initializeModal(element as HTMLDialogElement);
                    }

                    const modals = DOMUtils.querySelectorAll('dialog[data-modal]', element);
                    modals.forEach(modal => {
                        this.initializeModal(modal as HTMLDialogElement);
                    });
                }
            });
        });
    }

    /**
     * Handle modal cancel event (ESC key)
     */
    private handleModalCancel(modal: HTMLDialogElement, event: Event): void {
        this.dispatchModalEvent(modal, 'modal:cancel', { originalEvent: event });
    }

    /**
     * Set initial focus when modal opens
     */
    private setInitialFocus(modal: HTMLDialogElement): void {
        const autofocusElement = DOMUtils.querySelector('[autofocus]', modal) as HTMLElement;
        if (autofocusElement) {
            autofocusElement.focus();
            return;
        }

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
        const modal = DOMUtils.getElementById(modalId) as HTMLDialogElement;
        return modal ? modal.open : false;
    }

    /**
     * Dispatch custom modal events
     */
    private dispatchModalEvent(modal: HTMLDialogElement, eventName: string, detail: any = {}): void {
        EventUtils.dispatchCustomEvent(modal, eventName, {
            modal,
            ...detail
        }, {
            bubbles: true,
            cancelable: true
        });
    }

    /**
     * Get modal state (for external access)
     */
    public getModalState(modalId: string): ModalState | null {
        const modal = DOMUtils.getElementById(modalId) as HTMLDialogElement;
        return modal ? this.getState(modal) || null : null;
    }

    /**
     * Set up Livewire integration if available
     */
    private setupLivewireIntegration(): void {
        if (typeof window.Livewire === 'undefined') {
            return;
        }

        window.Livewire.on('openModal', (data: any) => {
            const modalId = data.id || data.modal;
            if (modalId) {
                this.openModal(modalId);

                if (data.wireModel) {
                    this.updateWireModel(modalId, true);
                }
            }
        });

        window.Livewire.on('closeModal', (data: any) => {
            const modalId = data.id || data.modal;
            if (modalId) {
                this.closeModal(modalId);

                if (data.wireModel) {
                    this.updateWireModel(modalId, false);
                }
            } else {
                this.closeAllModals();
            }
        });

        window.Livewire.on('toggleModal', (data: any) => {
            const modalId = data.id || data.modal;
            if (modalId) {
                this.toggleModal(modalId);
            }
        });


    }

    /**
     * Update Livewire wire:model for modal state
     */
    private updateWireModel(modalId: string, isOpen: boolean): void {
        const modal = DOMUtils.getElementById(modalId) as HTMLDialogElement;
        if (!modal) return;

        const wireModel = modal.getAttribute('wire:model');
        if (wireModel && typeof window.Livewire !== 'undefined' && window.Livewire.find) {
            const wireId = DOMUtils.findClosest(modal, '[wire\\:id]')?.getAttribute('wire:id');
            if (wireId) {
                const component = window.Livewire.find(wireId);
                if (component) {
                    component.set(wireModel, isOpen);
                }
            }
        }
    }

    /**
     * Toggle a modal's open state
     */
    public toggleModal(modalId: string): boolean {
        const modal = DOMUtils.getElementById(modalId) as HTMLDialogElement;
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
        DOMUtils.querySelectorAll('dialog[data-modal][open]').forEach(modal => {
            if (modal.id) {
                this.closeModal(modal.id);
            }
        });
    }

    /**
     * Enhanced modal open with Livewire event dispatching
     */
    public openModal(modalId: string, trigger?: HTMLElement): boolean {
        const modal = DOMUtils.getElementById(modalId) as HTMLDialogElement;
        if (!modal || !modal.matches('dialog[data-modal]')) {
            console.warn(`Modal with id "${modalId}" not found`);
            return false;
        }

        this.handleModalOpen(modal, trigger);
        modal.showModal();

        this.dispatchLivewireEvent('modalOpened', { id: modalId, modal: modalId });

        return true;
    }

    /**
     * Enhanced modal close with Livewire event dispatching
     */
    public closeModal(modalId: string): boolean {
        const modal = DOMUtils.getElementById(modalId) as HTMLDialogElement;
        if (!modal || !modal.matches('dialog[data-modal]')) {
            console.warn(`Modal with id "${modalId}" not found`);
            return false;
        }

        modal.close();

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
     * Handle modal close event with Livewire integration
     */
    private handleModalClose(modal: HTMLDialogElement): void {
        const state = this.getState(modal);
        if (!state) return;

        const wireModel = modal.getAttribute('wire:model');
        if (wireModel) {
            this.updateWireModel(modal.id, false);
        }

        if (state.lastFocusedElement && document.contains(state.lastFocusedElement)) {
            state.lastFocusedElement.focus();
        }

        state.lastFocusedElement = null;
        this.setState(modal, state);

        this.dispatchModalEvent(modal, 'modal:close');

        this.dispatchLivewireEvent('modalClosed', { id: modal.id, modal: modal.id });
    }

    /**
     * Handle modal opening with Livewire integration
     */
    private handleModalOpen(modal: HTMLDialogElement, trigger?: HTMLElement): void {
        const state = this.getState(modal);
        if (!state) return;

        const wireModel = modal.getAttribute('wire:model');
        if (wireModel) {
            this.updateWireModel(modal.id, true);
        }

        state.lastFocusedElement = trigger || document.activeElement as HTMLElement;
        this.setState(modal, state);

        this.dispatchModalEvent(modal, 'modal:open', { trigger });

        this.dispatchLivewireEvent('modalOpened', { id: modal.id, modal: modal.id });

        setTimeout(() => {
            this.setInitialFocus(modal);
        }, 50);
    }

    /**
     * Clean up ModalActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
    }
}

export default ModalActions.getInstance();