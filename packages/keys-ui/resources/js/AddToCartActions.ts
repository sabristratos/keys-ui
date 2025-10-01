/**
 * AddToCartActions - Handles cart functionality for AddToCart components
 *
 * Features:
 * - Multi-state visual feedback (default → adding → added)
 * - Quantity management with validation
 * - AJAX cart operations
 * - Stock level enforcement
 * - Custom events for integration
 * - Automatic cart state synchronization
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

interface CartState {
    productId: string;
    variantId?: string;
    quantity: number;
    maxQuantity: number;
    stockLevel?: number;
    price?: string;
    ajaxUrl: string;
    inCart: boolean;
    isProcessing: boolean;
    originalText?: string;
}

interface CartResponse {
    success: boolean;
    message?: string;
    cartCount?: number;
    inCart?: boolean;
    stockLevel?: number;
    error?: string;
}

export class AddToCartActions extends BaseActionClass<CartState> {
    private cleanupFunctions: (() => void)[] = [];

    protected bindEventListeners(): void {
        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '[data-add-to-cart="true"]',
                (button, event) => this.handleAddToCart(button, event)
            )
        );

        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '.qty-decrease',
                (button, event) => this.handleQuantityChange(button, event, 'decrease')
            )
        );

        this.cleanupFunctions.push(
            EventUtils.handleDelegatedClick(
                '.qty-increase',
                (button, event) => this.handleQuantityChange(button, event, 'increase')
            )
        );

        this.cleanupFunctions.push(
            EventUtils.handleDelegatedInput(
                '.qty-input',
                (input, event) => this.handleQuantityInput(input as HTMLInputElement, event)
            )
        );

        this.cleanupFunctions.push(
            EventUtils.handleDelegatedKeydown(
                '.qty-input',
                (input, event) => this.handleQuantityKeydown(input as HTMLInputElement, event)
            )
        );
    }

    protected initializeElements(): void {
        const buttons = DOMUtils.findByDataAttribute('add-to-cart', 'true');
        buttons.forEach(button => this.initializeButton(button));
    }

    private initializeButton(button: HTMLElement): void {
        const state = this.extractStateFromButton(button);
        if (state) {
            const textElement = DOMUtils.querySelector('.button-text', button);
            if (textElement) {
                state.originalText = textElement.textContent || '';
            }

            this.setState(button, state);
            this.updateButtonState(button);
            this.updateQuantityControls(button);
        }
    }

    private extractStateFromButton(button: HTMLElement): CartState | null {
        const productId = DOMUtils.getDataAttribute(button, 'productId');
        if (!productId) {
            console.warn('AddToCart button missing required data-product-id attribute');
            return null;
        }

        return {
            productId,
            variantId: DOMUtils.getDataAttribute(button, 'variantId'),
            quantity: parseInt(DOMUtils.getDataAttribute(button, 'quantity') || '1'),
            maxQuantity: parseInt(DOMUtils.getDataAttribute(button, 'maxQuantity') || '99'),
            stockLevel: DOMUtils.getDataAttribute(button, 'stockLevel')
                ? parseInt(DOMUtils.getDataAttribute(button, 'stockLevel')!)
                : undefined,
            price: DOMUtils.getDataAttribute(button, 'price'),
            ajaxUrl: DOMUtils.getDataAttribute(button, 'ajaxUrl') || '/cart/add',
            inCart: DOMUtils.getDataAttribute(button, 'inCart') === 'true',
            isProcessing: false
        };
    }

    private async handleAddToCart(button: HTMLElement, event: MouseEvent): Promise<void> {
        event.preventDefault();

        if (DOMUtils.isDisabled(button)) {
            return;
        }

        const state = this.getState(button);
        if (!state || state.isProcessing) {
            return;
        }

        const quantityInput = this.getQuantityInput(button);
        if (quantityInput) {
            state.quantity = parseInt(quantityInput.value) || 1;
        }

        if (!this.validateQuantity(state.quantity, state)) {
            this.showError(button, 'Invalid quantity');
            return;
        }

        state.isProcessing = true;
        this.setState(button, state);
        this.setButtonState(button, 'adding');

        try {
            const response = await this.sendCartRequest(state);

            if (response.success) {
                state.inCart = response.inCart ?? true;
                state.isProcessing = false;

                if (response.stockLevel !== undefined) {
                    state.stockLevel = response.stockLevel;
                    DOMUtils.setDataAttribute(button, 'stockLevel', response.stockLevel.toString());
                }

                this.setState(button, state);
                this.setButtonState(button, 'added');

                this.dispatchCartEvent(button, 'cart:added', {
                    productId: state.productId,
                    variantId: state.variantId,
                    quantity: state.quantity,
                    cartCount: response.cartCount
                });

                setTimeout(() => {
                    if (this.getState(button)?.inCart) {
                        this.setButtonState(button, 'default');
                    }
                }, 2000);

            } else {
                throw new Error(response.error || response.message || 'Failed to add to cart');
            }

        } catch (error) {
            state.isProcessing = false;
            this.setState(button, state);
            this.setButtonState(button, 'default');
            this.showError(button, error instanceof Error ? error.message : 'An error occurred');
        }

        this.updateQuantityControls(button);
    }

    private handleQuantityChange(button: HTMLElement, event: MouseEvent, action: 'increase' | 'decrease'): void {
        event.preventDefault();

        const targetId = DOMUtils.getDataAttribute(button, 'target');
        if (!targetId) return;

        const input = DOMUtils.getElementById(targetId) as HTMLInputElement;
        if (!input) return;

        const wrapper = DOMUtils.findClosest(button, '.add-to-cart-wrapper');
        const cartButton = wrapper ? DOMUtils.querySelector('[data-add-to-cart="true"]', wrapper) : null;
        if (!cartButton) return;

        const state = this.getState(cartButton);
        if (!state) return;

        const currentValue = parseInt(input.value) || 1;
        let newValue = currentValue;

        if (action === 'increase') {
            newValue = Math.min(currentValue + 1, state.maxQuantity);
        } else {
            newValue = Math.max(currentValue - 1, 1);
        }

        if (newValue !== currentValue) {
            input.value = newValue.toString();
            state.quantity = newValue;
            this.setState(cartButton, state);

            this.dispatchCartEvent(cartButton, 'cart:quantity-changed', {
                productId: state.productId,
                quantity: newValue,
                previousQuantity: currentValue
            });
        }

        this.updateQuantityControls(cartButton);
    }

    private handleQuantityInput(input: HTMLInputElement, event: InputEvent): void {
        const wrapper = DOMUtils.findClosest(input, '.add-to-cart-wrapper');
        const cartButton = wrapper ? DOMUtils.querySelector('[data-add-to-cart="true"]', wrapper) : null;
        if (!cartButton) return;

        const state = this.getState(cartButton);
        if (!state) return;

        let value = parseInt(input.value) || 1;
        value = Math.max(1, Math.min(value, state.maxQuantity));

        if (input.value !== value.toString()) {
            input.value = value.toString();
        }

        state.quantity = value;
        this.setState(cartButton, state);
        this.updateQuantityControls(cartButton);
    }

    private handleQuantityKeydown(input: HTMLInputElement, event: KeyboardEvent): void {
        if ([8, 9, 27, 13, 35, 36, 37, 39, 38, 40].includes(event.keyCode) ||
            (event.ctrlKey && [65, 67, 86, 88].includes(event.keyCode))) {
            return;
        }

        if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) &&
            (event.keyCode < 96 || event.keyCode > 105)) {
            event.preventDefault();
        }
    }

    private validateQuantity(quantity: number, state: CartState): boolean {
        if (quantity < 1 || quantity > state.maxQuantity) {
            return false;
        }

        if (state.stockLevel !== undefined && quantity > state.stockLevel) {
            return false;
        }

        return true;
    }

    private async sendCartRequest(state: CartState): Promise<CartResponse> {
        const formData = new FormData();
        formData.append('product_id', state.productId);
        formData.append('quantity', state.quantity.toString());

        if (state.variantId) {
            formData.append('variant_id', state.variantId);
        }

        const csrfToken = DOMUtils.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            formData.append('_token', csrfToken);
        }

        const response = await fetch(state.ajaxUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    private setButtonState(button: HTMLElement, state: 'default' | 'adding' | 'added'): void {
        DOMUtils.removeClasses(button, ['adding', 'added']);

        if (state !== 'default') {
            DOMUtils.addClass(button, state);
        }

        const textElement = DOMUtils.querySelector('.button-text', button);
        if (textElement) {
            const buttonState = this.getState(button);

            switch (state) {
                case 'adding':
                    const addingText = DOMUtils.getDataAttribute(button, 'labelToggle');
                    if (addingText) textElement.textContent = addingText;
                    break;
                case 'added':
                    const addedText = DOMUtils.getDataAttribute(button, 'labelSuccess');
                    if (addedText) textElement.textContent = addedText;
                    break;
                case 'default':
                    if (buttonState?.originalText) {
                        textElement.textContent = buttonState.originalText;
                    }
                    break;
            }
        }
    }

    private updateButtonState(button: HTMLElement): void {
        const state = this.getState(button);
        if (!state) return;

        if (state.stockLevel !== undefined && state.stockLevel <= 0) {
            DOMUtils.toggleAttribute(button, 'disabled', 'true');
            DOMUtils.addClasses(button, ['cursor-not-allowed', 'opacity-50']);
        } else {
            DOMUtils.toggleAttribute(button, 'disabled');
            DOMUtils.removeClasses(button, ['cursor-not-allowed', 'opacity-50']);
        }
    }

    private updateQuantityControls(button: HTMLElement): void {
        const state = this.getState(button);
        if (!state) return;

        const wrapper = DOMUtils.findClosest(button, '.add-to-cart-wrapper');
        if (!wrapper) return;

        const decreaseBtn = DOMUtils.querySelector('.qty-decrease', wrapper);
        if (decreaseBtn) {
            DOMUtils.toggleAttribute(decreaseBtn, 'disabled', state.quantity <= 1 ? 'true' : undefined);
        }

        const increaseBtn = DOMUtils.querySelector('.qty-increase', wrapper);
        if (increaseBtn) {
            const atMax = state.quantity >= state.maxQuantity ||
                         (state.stockLevel !== undefined && state.quantity >= state.stockLevel);
            DOMUtils.toggleAttribute(increaseBtn, 'disabled', atMax ? 'true' : undefined);
        }

        const input = this.getQuantityInput(button);
        if (input) {
            input.max = state.maxQuantity.toString();
            if (state.stockLevel !== undefined) {
                input.max = Math.min(state.maxQuantity, state.stockLevel).toString();
            }
        }
    }

    private getQuantityInput(button: HTMLElement): HTMLInputElement | null {
        const wrapper = DOMUtils.findClosest(button, '.add-to-cart-wrapper');
        if (!wrapper) return null;
        return DOMUtils.querySelector('.qty-input', wrapper) as HTMLInputElement;
    }

    private showError(button: HTMLElement, message: string): void {
        this.dispatchCartEvent(button, 'cart:error', { message });

        console.error('Add to Cart Error:', message);
    }

    private dispatchCartEvent(button: HTMLElement, eventName: string, detail: any): void {
        EventUtils.dispatchCustomEvent(button, eventName, detail);
    }

    protected setupDynamicObserver(): void {
        this.createDynamicObserver((addedNodes) => {
            addedNodes.forEach(node => {
                if (node instanceof Element) {
                    const buttons = DOMUtils.findByDataAttribute('add-to-cart', 'true', node);
                    buttons.forEach(button => this.initializeButton(button));
                }
            });
        });
    }

    public destroy(): void {
        this.cleanupFunctions.forEach(cleanup => cleanup());
        this.cleanupFunctions = [];
        super.destroy();
    }
}

if (typeof document !== 'undefined') {
    const initializeCart = () => {
        AddToCartActions.getInstance().init();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCart);
    } else {
        initializeCart();
    }
}

export default AddToCartActions;