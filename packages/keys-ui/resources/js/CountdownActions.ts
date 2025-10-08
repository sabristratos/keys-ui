/**
 * CountdownActions - Handles countdown timer functionality
 *
 * Provides functionality for:
 * - Real-time countdown updates
 * - Multiple timer instances
 * - Pause/resume capability
 * - Custom event callbacks
 * - Auto-cleanup on completion
 */

import { BaseActionClass } from './utils/BaseActionClass';
import { EventUtils } from './utils/EventUtils';
import { DOMUtils } from './utils/DOMUtils';

interface CountdownState {
    targetTimestamp: number;
    intervalId?: number;
    isPaused: boolean;
    isComplete: boolean;
    showDays: boolean;
    showHours: boolean;
    showMinutes: boolean;
    showSeconds: boolean;
    showLabels: boolean;
    completeMessage?: string;
    units: CountdownUnit[];
}

interface CountdownUnit {
    element: HTMLElement;
    key: string;
    max: number;
}

interface CountdownEventDetail {
    countdown: HTMLElement;
    timeRemaining: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export class CountdownActions extends BaseActionClass<CountdownState> {
    private rafId?: number;
    private lastUpdate = 0;

    /**
     * Initialize countdown elements
     */
    protected initializeElements(): void {
        const countdowns = DOMUtils.querySelectorAll('[data-keys-countdown="true"]');

        countdowns.forEach(countdown => {
            this.initializeCountdown(countdown as HTMLElement);
        });
    }

    /**
     * Initialize a single countdown element
     */
    private initializeCountdown(element: HTMLElement): void {
        const targetTimestamp = parseInt(element.dataset.target || '0', 10);
        const autoStart = element.dataset.autoStart !== 'false';

        if (!targetTimestamp) {
            console.error('[CountdownActions] Invalid target timestamp for countdown', element);
            return;
        }

        // Find all unit elements
        const units: CountdownUnit[] = [];
        const unitElements = element.querySelectorAll('[data-unit]');

        unitElements.forEach(unitEl => {
            const htmlEl = unitEl as HTMLElement;
            // Make sure the countdown-value and countdown-next elements exist
            const valueEl = htmlEl.querySelector('.countdown-value');
            const nextEl = htmlEl.querySelector('.countdown-next');

            if (!valueEl && !nextEl) {
                // For minimal variant or older structure, use the element itself
                units.push({
                    element: htmlEl,
                    key: htmlEl.dataset.unit || '',
                    max: parseInt(htmlEl.dataset.max || '999', 10)
                });
            } else {
                units.push({
                    element: htmlEl,
                    key: htmlEl.dataset.unit || '',
                    max: parseInt(htmlEl.dataset.max || '999', 10)
                });
            }
        });

        // Initialize state
        const state: CountdownState = {
            targetTimestamp: targetTimestamp * 1000, // Convert to milliseconds
            isPaused: !autoStart,
            isComplete: false,
            showDays: element.dataset.showDays === 'true',
            showHours: element.dataset.showHours === 'true',
            showMinutes: element.dataset.showMinutes === 'true',
            showSeconds: element.dataset.showSeconds === 'true',
            showLabels: element.dataset.showLabels === 'true',
            completeMessage: element.dataset.completeMessage,
            units
        };

        this.stateManager.set(element, state);

        // Start countdown if auto-start is enabled
        if (autoStart) {
            this.startCountdown(element);
        }
    }

    /**
     * Bind event listeners
     */
    protected bindEventListeners(): void {
        // Global animation frame for all countdowns
        this.startAnimationFrame();
    }

    /**
     * Start animation frame loop for smooth updates
     */
    private startAnimationFrame(): void {
        const update = (timestamp: number) => {
            // Update at most once per second
            if (timestamp - this.lastUpdate >= 1000) {
                this.updateAllCountdowns();
                this.lastUpdate = timestamp;
            }

            this.rafId = requestAnimationFrame(update);
        };

        this.rafId = requestAnimationFrame(update);
    }

    /**
     * Update all active countdowns
     */
    private updateAllCountdowns(): void {
        this.stateManager.forEach((state, element) => {
            if (!state.isPaused && !state.isComplete) {
                this.updateCountdown(element, state);
            }
        });
    }

    /**
     * Update a single countdown
     */
    private updateCountdown(element: HTMLElement, state: CountdownState): void {
        const now = Date.now();
        const diff = Math.max(0, state.targetTimestamp - now);

        if (diff === 0 && !state.isComplete) {
            this.completeCountdown(element, state);
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);

        // Calculate time units
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // Update display values
        state.units.forEach(unit => {
            let value = 0;

            switch (unit.key) {
                case 'days':
                    value = days;
                    break;
                case 'hours':
                    value = state.showDays ? hours : Math.floor(totalSeconds / 3600);
                    break;
                case 'minutes':
                    value = state.showHours ? minutes : Math.floor(totalSeconds / 60);
                    break;
                case 'seconds':
                    value = state.showMinutes ? seconds : totalSeconds;
                    break;
            }

            // Ensure value doesn't exceed max
            value = Math.min(value, unit.max);

            // Update element with animation
            const paddedValue = value.toString().padStart(2, '0');
            const currentElement = unit.element.querySelector('.countdown-value') as HTMLElement;
            const nextElement = unit.element.querySelector('.countdown-next') as HTMLElement;

            if (currentElement && nextElement) {
                const currentValue = currentElement.textContent?.trim();

                if (currentValue !== paddedValue) {
                    // Prepare the next value
                    nextElement.textContent = paddedValue;

                    // Apply animation classes using Tailwind
                    this.animateFlip(currentElement, nextElement, paddedValue);

                    // Update aria-label
                    const label = currentElement.getAttribute('aria-label');
                    if (label) {
                        const labelParts = label.split(' ');
                        labelParts[0] = value.toString();
                        currentElement.setAttribute('aria-label', labelParts.join(' '));
                    }
                }
            } else {
                // Fallback for elements without animation structure
                if (unit.element.textContent !== paddedValue) {
                    unit.element.textContent = paddedValue;
                }
            }
        });

        // Dispatch tick event
        this.dispatchCountdownEvent(element, 'tick', {
            timeRemaining: diff,
            days,
            hours,
            minutes,
            seconds
        });
    }

    /**
     * Animate flip transition for countdown numbers
     */
    private animateFlip(currentElement: HTMLElement, nextElement: HTMLElement, newValue: string): void {
        // Prepare the new value at the top (invisible)
        nextElement.textContent = newValue;
        nextElement.style.transform = 'translateY(-100%)';
        nextElement.style.opacity = '0';

        // Force a reflow to ensure the initial state is applied
        void nextElement.offsetHeight;

        // Set up transition styles
        currentElement.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        nextElement.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

        // Trigger animation
        requestAnimationFrame(() => {
            // Current value slides down and fades out
            currentElement.style.transform = 'translateY(100%)';
            currentElement.style.opacity = '0';

            // New value slides down from top and fades in
            nextElement.style.transform = 'translateY(0)';
            nextElement.style.opacity = '1';
        });

        // After animation completes, reset for next animation
        setTimeout(() => {
            // Update current element with new value and reset position
            currentElement.textContent = newValue;
            currentElement.style.transition = 'none';
            currentElement.style.transform = 'translateY(0)';
            currentElement.style.opacity = '1';

            // Reset next element to top position
            nextElement.style.transition = 'none';
            nextElement.style.transform = 'translateY(-100%)';
            nextElement.style.opacity = '0';
            nextElement.textContent = '';
        }, 500);
    }

    /**
     * Complete a countdown
     */
    private completeCountdown(element: HTMLElement, state: CountdownState): void {
        state.isComplete = true;

        // Show complete message if exists
        const completeEl = element.querySelector('.countdown-complete') as HTMLElement;
        if (completeEl) {
            completeEl.style.display = '';
            completeEl.classList.remove('hidden');

            // Hide unit displays
            state.units.forEach(unit => {
                unit.element.parentElement?.classList.add('hidden');
            });
        }

        // Dispatch complete event
        this.dispatchCountdownEvent(element, 'complete', {
            timeRemaining: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        });
    }

    /**
     * Start a countdown
     */
    public startCountdown(element: HTMLElement): void {
        const state = this.stateManager.get(element);
        if (!state || state.isComplete) return;

        state.isPaused = false;

        // Dispatch start event
        this.dispatchCountdownEvent(element, 'start', this.getTimeValues(element));
    }

    /**
     * Pause a countdown
     */
    public pauseCountdown(element: HTMLElement): void {
        const state = this.stateManager.get(element);
        if (!state || state.isComplete) return;

        state.isPaused = true;

        // Dispatch pause event
        this.dispatchCountdownEvent(element, 'pause', this.getTimeValues(element));
    }

    /**
     * Resume a countdown
     */
    public resumeCountdown(element: HTMLElement): void {
        this.startCountdown(element);
    }

    /**
     * Reset a countdown to a new target
     */
    public resetCountdown(element: HTMLElement, newTarget?: number): void {
        const state = this.stateManager.get(element);
        if (!state) return;

        // Use new target or original target
        state.targetTimestamp = newTarget ? newTarget * 1000 : parseInt(element.dataset.target || '0', 10) * 1000;
        state.isComplete = false;
        state.isPaused = false;

        // Show units again if they were hidden
        const completeEl = element.querySelector('.countdown-complete') as HTMLElement;
        if (completeEl) {
            completeEl.style.display = 'none';
            completeEl.classList.add('hidden');
        }

        state.units.forEach(unit => {
            unit.element.parentElement?.classList.remove('hidden');
        });

        // Update immediately
        this.updateCountdown(element, state);
    }

    /**
     * Get current time values for a countdown
     */
    private getTimeValues(element: HTMLElement): Partial<CountdownEventDetail> {
        const state = this.stateManager.get(element);
        if (!state) return {};

        const now = Date.now();
        const diff = Math.max(0, state.targetTimestamp - now);
        const totalSeconds = Math.floor(diff / 1000);

        return {
            timeRemaining: diff,
            days: Math.floor(totalSeconds / 86400),
            hours: Math.floor((totalSeconds % 86400) / 3600),
            minutes: Math.floor((totalSeconds % 3600) / 60),
            seconds: totalSeconds % 60
        };
    }

    /**
     * Dispatch countdown event
     */
    private dispatchCountdownEvent(
        element: HTMLElement,
        action: string,
        detail: Partial<CountdownEventDetail>
    ): void {
        EventUtils.dispatchCustomEvent(element, `countdown-${action}`, {
            countdown: element,
            ...detail
        } as CountdownEventDetail);
    }

    /**
     * Add event listener for countdown events
     */
    public onCountdownEvent(
        eventType: 'start' | 'pause' | 'tick' | 'complete',
        callback: (detail: CountdownEventDetail) => void
    ): () => void {
        return EventUtils.addEventListener(document, `countdown-${eventType}`, (event) => {
            const customEvent = event as CustomEvent<CountdownEventDetail>;
            callback(customEvent.detail);
        });
    }

    /**
     * Get countdown instance by ID
     */
    public getCountdown(id: string): HTMLElement | null {
        return DOMUtils.querySelector(`#${id}[data-keys-countdown="true"]`);
    }

    /**
     * Clean up on destroy
     */
    protected onDestroy(): void {
        // Cancel animation frame
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }

    /**
     * Setup dynamic observer for new countdowns
     */
    protected setupDynamicObserver(): void {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement) {
                        if (node.matches('[data-keys-countdown="true"]')) {
                            this.initializeCountdown(node);
                        }

                        const countdowns = node.querySelectorAll('[data-keys-countdown="true"]');
                        countdowns.forEach(countdown => {
                            this.initializeCountdown(countdown as HTMLElement);
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
}

export default CountdownActions.getInstance();