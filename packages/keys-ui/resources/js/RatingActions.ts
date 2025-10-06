import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';

interface RatingState {
    stars: HTMLButtonElement[];
    hiddenInput: HTMLInputElement | null;
    currentValue: number;
    maxValue: number;
    readonly: boolean;
    disabled: boolean;
    allowHalf: boolean;
    hoverValue: number;
}

export class RatingActions extends BaseActionClass<RatingState> {
    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Use event delegation for all rating interactions
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;

            const star = target.closest('.rating-star') as HTMLButtonElement;
            if (star) {
                this.handleClick(e, star);
            }
        });

        // Use mouseover (bubbling) instead of mouseenter (non-bubbling)
        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;

            const star = target.closest('.rating-star') as HTMLButtonElement;
            if (star) {
                // Check if we're entering the star from outside (not from a child element)
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || !(relatedTarget instanceof Node) || !star.contains(relatedTarget as Node)) {
                    this.handleHover(star);
                }
            }
        });

        // Use mouseout (bubbling) instead of mouseleave (non-bubbling)
        document.addEventListener('mouseout', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;

            const star = target.closest('.rating-star') as HTMLButtonElement;
            if (star) {
                // Check if we're leaving the star to outside (not to a child element)
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || !(relatedTarget instanceof Node) || !star.contains(relatedTarget as Node)) {
                    const container = star.closest('[data-keys-rating="true"]') as HTMLElement;
                    if (container) {
                        this.handleHoverEnd(container);
                    }
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;

            const container = target.closest('[data-keys-rating="true"]') as HTMLElement;
            if (container) {
                this.handleKeyDown(e as KeyboardEvent, container);
            }
        });
    }

    /**
     * Initialize rating elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        const ratings = DOMUtils.querySelectorAll('[data-keys-rating="true"]') as HTMLElement[];

        ratings.forEach(rating => {
            this.initializeRating(rating);
        });
    }

    /**
     * Initialize a single rating element
     */
    private initializeRating(container: HTMLElement): void {
        const stars = Array.from(container.querySelectorAll('.rating-star')) as HTMLButtonElement[];
        const hiddenInput = container.querySelector('[data-rating-input="true"]') as HTMLInputElement ||
                           document.querySelector(`#${container.dataset.ratingId}`) as HTMLInputElement;

        const state: RatingState = {
            stars,
            hiddenInput,
            currentValue: parseFloat(container.dataset.value || '0'),
            maxValue: parseInt(container.dataset.max || '5'),
            readonly: container.dataset.readonly === 'true',
            disabled: container.dataset.disabled === 'true',
            allowHalf: container.dataset.allowHalf === 'true',
            hoverValue: 0
        };

        this.setState(container, state);
        this.updateStars(container, state.currentValue);
    }

    private handleClick(event: Event, star: HTMLButtonElement): void {
        event.preventDefault();

        const container = star.closest('[data-keys-rating="true"]') as HTMLElement;
        if (!container) return;

        const state = this.getState(container);
        if (!state || state.readonly || state.disabled) return;

        const starIndex = state.stars.indexOf(star);
        let value = starIndex + 1;

        if (state.allowHalf) {
            const rect = star.getBoundingClientRect();
            const clickX = (event as MouseEvent).clientX - rect.left;
            const isLeftHalf = clickX < rect.width / 2;
            value = isLeftHalf ? value - 0.5 : value;
        }

        this.setRating(container, value);

        container.dispatchEvent(new CustomEvent('rating-change', {
            detail: { value },
            bubbles: true
        }));
    }

    private handleHover(star: HTMLButtonElement): void {
        const container = star.closest('[data-keys-rating="true"]') as HTMLElement;
        if (!container) return;

        const state = this.getState(container);
        if (!state || state.readonly || state.disabled) return;

        const starIndex = state.stars.indexOf(star);
        const value = starIndex + 1;

        state.hoverValue = value;
        this.updateStars(container, value);
    }

    private handleHoverEnd(container: HTMLElement): void {
        const state = this.getState(container);
        if (!state || state.readonly || state.disabled) return;

        state.hoverValue = 0;
        this.updateStars(container, state.currentValue);
    }

    private handleKeyDown(event: KeyboardEvent, container: HTMLElement): void {
        const state = this.getState(container);
        if (!state || state.readonly || state.disabled) return;

        let newValue = state.currentValue;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowUp':
                event.preventDefault();
                newValue = Math.min(state.maxValue, state.currentValue + 1);
                break;

            case 'ArrowLeft':
            case 'ArrowDown':
                event.preventDefault();
                newValue = Math.max(0, state.currentValue - 1);
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                event.preventDefault();
                const numValue = parseInt(event.key);
                if (numValue <= state.maxValue) {
                    newValue = numValue;
                }
                break;

            case 'Home':
                event.preventDefault();
                newValue = 1;
                break;

            case 'End':
                event.preventDefault();
                newValue = state.maxValue;
                break;

            default:
                return;
        }

        if (newValue !== state.currentValue) {
            this.setRating(container, newValue);
        }
    }

    private setRating(container: HTMLElement, value: number): void {
        const state = this.getState(container);
        if (!state) return;

        state.currentValue = value;
        this.updateStars(container, value);
        this.updateHiddenInput(container, value);
        this.updateLivewire(container, value);
    }

    private updateStars(container: HTMLElement, value: number): void {
        const state = this.getState(container);
        if (!state) return;

        const displayValue = state.hoverValue || value;

        state.stars.forEach((star, index) => {
            const starValue = index + 1;
            const icon = star.querySelector('[data-keys-icon]');

            if (!icon) return;

            const shouldFill = starValue <= displayValue;

            const color = container.dataset.color || 'warning';
            const colorClass = `text-${color}`;
            const inactiveClasses = ['opacity-30', 'text-neutral-400', 'dark:text-neutral-500'];
            const activeClasses = ['text-accent', 'text-warning', 'text-success', 'text-danger', 'text-neutral-500'];

            icon.classList.remove(
                ...inactiveClasses,
                ...activeClasses,
                colorClass
            );

            if (shouldFill) {
                icon.classList.add(colorClass);
            } else {
                icon.classList.add(...inactiveClasses);
            }

            star.setAttribute('aria-pressed', shouldFill ? 'true' : 'false');
        });

        container.dataset.value = value.toString();
    }

    private updateHiddenInput(container: HTMLElement, value: number): void {
        const state = this.getState(container);
        if (!state || !state.hiddenInput) return;

        state.hiddenInput.value = value.toString();
        state.hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
        state.hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    private updateLivewire(container: HTMLElement, value: number): void {
        const state = this.getState(container);
        if (!state || !state.hiddenInput) return;

        const livewireComponent = (state.hiddenInput as any)?.__livewire;
        if (livewireComponent && state.hiddenInput.hasAttribute('wire:model')) {
            const modelName = state.hiddenInput.getAttribute('wire:model');
            if (modelName) {
                livewireComponent.set(modelName, value);
            }
        }

        if (typeof window.Livewire !== 'undefined' && state.hiddenInput.name) {
            try {
                const component = window.Livewire.find(
                    container.closest('[wire\\:id]')?.getAttribute('wire:id')
                );
                if (component) {
                    component.set(state.hiddenInput.name, value);
                }
            } catch (e) {
                // Silently fail if Livewire component not found
            }
        }
    }

    /**
     * Public API: Get current value of a rating
     */
    public getValue(container: HTMLElement): number {
        const state = this.getState(container);
        return state?.currentValue || 0;
    }

    /**
     * Public API: Set value of a rating
     */
    public setValue(container: HTMLElement, value: number): void {
        const state = this.getState(container);
        if (state && !state.readonly && !state.disabled) {
            this.setRating(container, value);
        }
    }

    /**
     * Clean up RatingActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // State cleanup is handled by BaseActionClass
        // Event listeners use delegation so no cleanup needed
    }
}

export default RatingActions.getInstance();
