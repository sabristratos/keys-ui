import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';
import { EventUtils } from './utils/EventUtils';

interface CountdownState {
    targetTimestamp: number;
    isComplete: boolean;
    units: Record<string, UnitState>;
    timeLeft: Record<string, number>;
}

interface UnitState {
    container: HTMLElement;
    spanA: HTMLElement;
    spanB: HTMLElement;
    isA_Active: boolean; // Tracks which span is currently visible
}

export class CountdownActions extends BaseActionClass<CountdownState> {
    private intervalId?: number;

    protected initializeElements(): void {
        const countdowns = DOMUtils.querySelectorAll('[data-keys-countdown="true"]');
        countdowns.forEach(countdown => this.initializeCountdown(countdown as HTMLElement));
    }

    private initializeCountdown(element: HTMLElement): void {
        const targetTimestamp = parseInt(element.dataset.target || '0', 10) * 1000;
        const unitKeys: string[] = JSON.parse(element.dataset.units || '[]');

        const units: Record<string, UnitState> = {};
        unitKeys.forEach(key => {
            const container = DOMUtils.querySelector(`[data-unit-container="${key}"]`, element) as HTMLElement;
            const spanA = DOMUtils.querySelector(`[data-span-a-for="${key}"]`, element) as HTMLElement;
            const spanB = DOMUtils.querySelector(`[data-span-b-for="${key}"]`, element) as HTMLElement;
            if (container && spanA && spanB) {
                units[key] = { container, spanA, spanB, isA_Active: true };
            }
        });

        const state: CountdownState = {
            targetTimestamp,
            isComplete: false,
            units,
            timeLeft: {},
        };

        this.stateManager.set(element, state);
        this.updateCountdown(element, state); // Initial update
    }

    protected bindEventListeners(): void {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = window.setInterval(() => this.updateAllCountdowns(), 1000);
    }

    private updateAllCountdowns(): void {
        this.stateManager.forEach((state, element) => {
            if (!state.isComplete) {
                this.updateCountdown(element, state);
            }
        });
    }

    private updateCountdown(element: HTMLElement, state: CountdownState): void {
        const now = Date.now();
        const distance = state.targetTimestamp - now;

        if (distance <= 0) {
            this.completeCountdown(element, state);
            return;
        }

        const newTime = {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
        };

        Object.entries(state.units).forEach(([key, unitState]) => {
            const newValue = newTime[key as keyof typeof newTime];
            // Set initial value without animation
            if (state.timeLeft[key] === undefined) {
                unitState.spanA.textContent = String(newValue).padStart(2, '0');
            } else if (newValue !== state.timeLeft[key]) {
                this.animate(unitState, newValue);
            }
        });

        state.timeLeft = newTime;
    }

    /**
     * Animate by swapping the roles of two span elements.
     */
    private animate(unitState: UnitState, newValue: number): void {
        const currentEl = unitState.isA_Active ? unitState.spanA : unitState.spanB;
        const nextEl = unitState.isA_Active ? unitState.spanB : unitState.spanA;

        nextEl.textContent = String(newValue).padStart(2, '0');

        // Animate current number down and out
        currentEl.classList.add('translate-y-full', 'opacity-0');
        // Animate next number from top to center
        nextEl.classList.remove('-translate-y-full', 'opacity-0');

        setTimeout(() => {
            // Instantly snap the old element (which is now hidden) back to the top
            // position, ready for its next turn.
            currentEl.classList.remove('duration-300');
            currentEl.classList.remove('translate-y-full');
            currentEl.classList.add('-translate-y-full');

            // Restore transition class after the snap
            requestAnimationFrame(() => {
                currentEl.classList.add('duration-300');
            });
        }, 300); // Must match Tailwind transition duration

        // Flip the active flag for the next cycle
        unitState.isA_Active = !unitState.isA_Active;
    }

    private completeCountdown(element: HTMLElement, state: CountdownState): void {
        state.isComplete = true;
        Object.values(state.units).forEach(unit => unit.container.classList.add('hidden'));

        const completeEl = DOMUtils.querySelector('.countdown-complete', element) as HTMLElement;
        if (completeEl) {
            completeEl.classList.remove('hidden');
        }

        EventUtils.dispatchCustomEvent(element, 'countdown-complete', { countdown: element });
    }

    protected setupDynamicObserver(): void {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement) {
                        if (node.matches('[data-keys-countdown="true"]')) {
                            this.initializeCountdown(node);
                        }
                        const countdowns = node.querySelectorAll('[data-keys-countdown="true"]');
                        countdowns.forEach(c => this.initializeCountdown(c as HTMLElement));
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    protected onDestroy(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
