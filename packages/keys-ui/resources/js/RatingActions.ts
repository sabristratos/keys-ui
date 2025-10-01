import { BaseActionClass } from './utils/BaseActionClass';

export class RatingActions extends BaseActionClass {
    private container: HTMLElement;
    private stars: NodeListOf<HTMLButtonElement>;
    private hiddenInput: HTMLInputElement | null;
    private currentValue: number;
    private maxValue: number;
    private readonly: boolean;
    private disabled: boolean;
    private allowHalf: boolean;
    private hoverValue: number = 0;

    constructor(container: HTMLElement) {
        super();
        this.container = container;
        this.stars = container.querySelectorAll('.rating-star');
        this.hiddenInput = container.querySelector('[data-rating-input="true"]') ||
                          document.querySelector(`#${container.dataset.ratingId}`);

        this.currentValue = parseFloat(container.dataset.value || '0');
        this.maxValue = parseInt(container.dataset.max || '5');
        this.readonly = container.dataset.readonly === 'true';
        this.disabled = container.dataset.disabled === 'true';
        this.allowHalf = container.dataset.allowHalf === 'true';

        if (!this.readonly && !this.disabled) {
            this.initializeInteractive();
        }
    }

    private initializeInteractive(): void {
        this.stars.forEach((star, index) => {
            star.addEventListener('click', (e) => this.handleClick(e, index + 1));
            star.addEventListener('mouseenter', () => this.handleHover(index + 1));
            star.addEventListener('mouseleave', () => this.handleHoverEnd());
        });

        this.container.addEventListener('keydown', (e) => this.handleKeyDown(e));

        this.container.addEventListener('mouseleave', () => this.handleHoverEnd());

        console.log(`[Rating] Initialized interactive rating with value: ${this.currentValue}/${this.maxValue}`);
    }

    private handleClick(event: Event, value: number): void {
        event.preventDefault();

        if (this.readonly || this.disabled) {
            return;
        }

        if (this.allowHalf) {
            const star = event.currentTarget as HTMLButtonElement;
            const rect = star.getBoundingClientRect();
            const clickX = (event as MouseEvent).clientX - rect.left;
            const isLeftHalf = clickX < rect.width / 2;

            value = isLeftHalf ? value - 0.5 : value;
        }

        this.setRating(value);
        console.log(`[Rating] Rating set to: ${value}`);

        this.container.dispatchEvent(new CustomEvent('rating-change', {
            detail: { value },
            bubbles: true
        }));
    }

    private handleHover(value: number): void {
        if (this.readonly || this.disabled) {
            return;
        }

        this.hoverValue = value;
        this.updateStars(value);
    }

    private handleHoverEnd(): void {
        if (this.readonly || this.disabled) {
            return;
        }

        this.hoverValue = 0;
        this.updateStars(this.currentValue);
    }

    private handleKeyDown(event: KeyboardEvent): void {
        if (this.readonly || this.disabled) {
            return;
        }

        let newValue = this.currentValue;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowUp':
                event.preventDefault();
                newValue = Math.min(this.maxValue, this.currentValue + 1);
                break;

            case 'ArrowLeft':
            case 'ArrowDown':
                event.preventDefault();
                newValue = Math.max(0, this.currentValue - 1);
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
                if (numValue <= this.maxValue) {
                    newValue = numValue;
                }
                break;

            case 'Home':
                event.preventDefault();
                newValue = 1;
                break;

            case 'End':
                event.preventDefault();
                newValue = this.maxValue;
                break;

            default:
                return;
        }

        if (newValue !== this.currentValue) {
            this.setRating(newValue);
        }
    }

    private setRating(value: number): void {
        this.currentValue = value;
        this.updateStars(value);
        this.updateHiddenInput(value);
        this.updateLivewire(value);
    }

    private updateStars(value: number): void {
        const displayValue = this.hoverValue || value;

        this.stars.forEach((star, index) => {
            const starValue = index + 1;
            const icon = star.querySelector('[data-keys-icon]');

            if (!icon) return;

            const shouldFill = starValue <= displayValue;

            const color = this.container.dataset.color || 'warning';
            const colorClass = `text-${color}`;
            const inactiveClasses = ['opacity-30', 'text-neutral-400', 'dark:text-neutral-500'];
            const activeClasses = ['text-brand', 'text-warning', 'text-success', 'text-danger', 'text-neutral-500'];

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

        this.container.dataset.value = value.toString();
    }

    private updateHiddenInput(value: number): void {
        if (this.hiddenInput) {
            this.hiddenInput.value = value.toString();

            this.hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
            this.hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    private updateLivewire(value: number): void {
        const livewireComponent = (this.hiddenInput as any)?.__livewire;
        if (livewireComponent && this.hiddenInput?.hasAttribute('wire:model')) {
            const modelName = this.hiddenInput.getAttribute('wire:model');
            if (modelName) {
                livewireComponent.set(modelName, value);
            }
        }

        if (typeof (window as any).Livewire !== 'undefined' && this.hiddenInput?.name) {
            try {
                const component = (window as any).Livewire.find(
                    this.container.closest('[wire\\:id]')?.getAttribute('wire:id')
                );
                if (component) {
                    component.set(this.hiddenInput.name, value);
                }
            } catch (e) {
            }
        }
    }

    public getValue(): number {
        return this.currentValue;
    }

    public setValue(value: number): void {
        if (!this.readonly && !this.disabled) {
            this.setRating(value);
        }
    }

    public destroy(): void {
        console.log('[Rating] Component destroyed');
    }
}

if (typeof window !== 'undefined') {
    const initializeRatings = () => {
        console.log('[Rating] Initializing rating components...');
        const ratings = document.querySelectorAll('[data-keys-rating="true"]');
        console.log(`[Rating] Found ${ratings.length} rating component(s)`);

        ratings.forEach((rating) => {
            if (!(rating as any).__ratingActions) {
                (rating as any).__ratingActions = new RatingActions(rating as HTMLElement);
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRatings);
    } else {
        initializeRatings();
    }

    document.addEventListener('livewire:navigated', initializeRatings);
}

export default RatingActions;
