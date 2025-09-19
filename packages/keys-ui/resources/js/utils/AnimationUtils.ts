/**
 * AnimationUtils - Centralized animation utilities for Keys UI components
 *
 * Provides common animation patterns and utilities used across components:
 * - Fade animations with scale transforms
 * - Height animations for expand/collapse
 * - Slide animations for panels and markers
 * - Timer management for auto-dismiss features
 * - Reduced motion preference handling
 */

export interface AnimationOptions {
    duration?: number;
    easing?: string;
    delay?: number;
    fill?: FillMode;
    onComplete?: () => void;
}

export interface TimerInfo {
    id: number;
    callback: () => void;
    delay: number;
    startTime: number;
    remaining?: number;
    paused?: boolean;
}

export class AnimationUtils {
    private static timers: Map<number, TimerInfo> = new Map();
    private static timerCounter = 0;

    /**
     * Check if user prefers reduced motion
     */
    static prefersReducedMotion(): boolean {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Fade in animation with optional scale transform
     */
    static fadeIn(
        element: HTMLElement,
        options: AnimationOptions & { scale?: boolean } = {}
    ): Animation | null {
        if (this.prefersReducedMotion()) {
            element.style.opacity = '1';
            if (options.scale) {
                element.style.transform = 'scale(1)';
            }
            options.onComplete?.();
            return null;
        }

        const {
            duration = 300,
            easing = 'ease-out',
            delay = 0,
            fill = 'forwards',
            scale = false,
            onComplete
        } = options;

        const keyframes: Keyframe[] = scale ? [
            { opacity: '0', transform: 'scale(0.95)' },
            { opacity: '1', transform: 'scale(1)' }
        ] : [
            { opacity: '0' },
            { opacity: '1' }
        ];

        const animation = element.animate(keyframes, {
            duration,
            easing,
            delay,
            fill
        });

        if (onComplete) {
            animation.addEventListener('finish', onComplete, { once: true });
        }

        return animation;
    }

    /**
     * Fade out animation with optional scale transform
     */
    static fadeOut(
        element: HTMLElement,
        options: AnimationOptions & { scale?: boolean } = {}
    ): Animation | null {
        if (this.prefersReducedMotion()) {
            element.style.opacity = '0';
            if (options.scale) {
                element.style.transform = 'scale(0.95)';
            }
            options.onComplete?.();
            return null;
        }

        const {
            duration = 300,
            easing = 'ease-in',
            delay = 0,
            fill = 'forwards',
            scale = false,
            onComplete
        } = options;

        const keyframes: Keyframe[] = scale ? [
            { opacity: '1', transform: 'scale(1)' },
            { opacity: '0', transform: 'scale(0.95)' }
        ] : [
            { opacity: '1' },
            { opacity: '0' }
        ];

        const animation = element.animate(keyframes, {
            duration,
            easing,
            delay,
            fill
        });

        if (onComplete) {
            animation.addEventListener('finish', onComplete, { once: true });
        }

        return animation;
    }

    /**
     * Expand height animation (for accordions, dropdowns, etc.)
     */
    static expandHeight(
        element: HTMLElement,
        options: AnimationOptions & {
            fromHeight?: number | 'auto';
            toHeight?: number | 'auto';
        } = {}
    ): Animation | null {
        if (this.prefersReducedMotion()) {
            element.style.height = options.toHeight === 'auto' ? '' : `${options.toHeight}px`;
            options.onComplete?.();
            return null;
        }

        const {
            duration = 300,
            easing = 'ease-out',
            fromHeight = 0,
            toHeight = 'auto',
            onComplete
        } = options;

        // Get the actual heights
        const startHeight = fromHeight === 'auto' ? element.offsetHeight : fromHeight;
        let endHeight: number;

        if (toHeight === 'auto') {
            // Temporarily set height to auto to measure
            const currentHeight = element.style.height;
            element.style.height = 'auto';
            endHeight = element.offsetHeight;
            element.style.height = currentHeight;
        } else {
            endHeight = toHeight;
        }

        // Set initial state
        element.style.height = `${startHeight}px`;
        element.style.overflow = 'hidden';

        // Animate
        const animation = element.animate([
            { height: `${startHeight}px` },
            { height: `${endHeight}px` }
        ], {
            duration,
            easing,
            fill: 'forwards'
        });

        animation.addEventListener('finish', () => {
            if (toHeight === 'auto') {
                element.style.height = '';
            }
            element.style.overflow = '';
            onComplete?.();
        }, { once: true });

        return animation;
    }

    /**
     * Collapse height animation
     */
    static collapseHeight(
        element: HTMLElement,
        options: AnimationOptions & {
            toHeight?: number;
        } = {}
    ): Animation | null {
        if (this.prefersReducedMotion()) {
            element.style.height = `${options.toHeight || 0}px`;
            options.onComplete?.();
            return null;
        }

        const {
            duration = 300,
            easing = 'ease-out',
            toHeight = 0,
            onComplete
        } = options;

        const startHeight = element.offsetHeight;

        // Set initial state
        element.style.height = `${startHeight}px`;
        element.style.overflow = 'hidden';

        // Animate
        const animation = element.animate([
            { height: `${startHeight}px` },
            { height: `${toHeight}px` }
        ], {
            duration,
            easing,
            fill: 'forwards'
        });

        animation.addEventListener('finish', () => {
            if (toHeight === 0) {
                element.style.display = 'none';
            }
            element.style.overflow = '';
            onComplete?.();
        }, { once: true });

        return animation;
    }

    /**
     * Slide in animation (for panels, tooltips, etc.)
     */
    static slideIn(
        element: HTMLElement,
        direction: 'up' | 'down' | 'left' | 'right',
        options: AnimationOptions & { distance?: number } = {}
    ): Animation | null {
        if (this.prefersReducedMotion()) {
            element.style.transform = 'translate(0, 0)';
            element.style.opacity = '1';
            options.onComplete?.();
            return null;
        }

        const {
            duration = 200,
            easing = 'ease-out',
            distance = 10,
            onComplete
        } = options;

        const transforms: Record<string, string> = {
            up: `translateY(${distance}px)`,
            down: `translateY(-${distance}px)`,
            left: `translateX(${distance}px)`,
            right: `translateX(-${distance}px)`
        };

        const animation = element.animate([
            {
                transform: transforms[direction],
                opacity: '0'
            },
            {
                transform: 'translate(0, 0)',
                opacity: '1'
            }
        ], {
            duration,
            easing,
            fill: 'forwards'
        });

        if (onComplete) {
            animation.addEventListener('finish', onComplete, { once: true });
        }

        return animation;
    }

    /**
     * Slide out animation
     */
    static slideOut(
        element: HTMLElement,
        direction: 'up' | 'down' | 'left' | 'right',
        options: AnimationOptions & { distance?: number } = {}
    ): Animation | null {
        if (this.prefersReducedMotion()) {
            element.style.opacity = '0';
            options.onComplete?.();
            return null;
        }

        const {
            duration = 200,
            easing = 'ease-in',
            distance = 10,
            onComplete
        } = options;

        const transforms: Record<string, string> = {
            up: `translateY(-${distance}px)`,
            down: `translateY(${distance}px)`,
            left: `translateX(-${distance}px)`,
            right: `translateX(${distance}px)`
        };

        const animation = element.animate([
            {
                transform: 'translate(0, 0)',
                opacity: '1'
            },
            {
                transform: transforms[direction],
                opacity: '0'
            }
        ], {
            duration,
            easing,
            fill: 'forwards'
        });

        if (onComplete) {
            animation.addEventListener('finish', onComplete, { once: true });
        }

        return animation;
    }

    /**
     * Cancel an animation if it exists
     */
    static cancelAnimation(animation: Animation | null): void {
        if (animation && animation.playState !== 'finished') {
            animation.cancel();
        }
    }

    /**
     * Wait for an animation to complete
     */
    static async waitForAnimation(animation: Animation | null): Promise<void> {
        if (!animation) return;

        return new Promise((resolve) => {
            if (animation.playState === 'finished') {
                resolve();
            } else {
                animation.addEventListener('finish', () => resolve(), { once: true });
            }
        });
    }

    /**
     * Animate with automatic cleanup
     */
    static animateWithCleanup(
        element: HTMLElement,
        keyframes: Keyframe[] | PropertyIndexedKeyframes,
        options: KeyframeAnimationOptions & { cleanup?: () => void } = {}
    ): Animation | null {
        if (this.prefersReducedMotion()) {
            options.cleanup?.();
            return null;
        }

        const { cleanup, ...animationOptions } = options;
        const animation = element.animate(keyframes, animationOptions);

        animation.addEventListener('finish', () => {
            cleanup?.();
        }, { once: true });

        animation.addEventListener('cancel', () => {
            cleanup?.();
        }, { once: true });

        return animation;
    }

    /**
     * Create a managed timer that can be paused/resumed
     */
    static createTimer(callback: () => void, delay: number): number {
        const timerId = ++this.timerCounter;

        const timerInfo: TimerInfo = {
            id: timerId,
            callback,
            delay,
            startTime: Date.now(),
            paused: false
        };

        const timeoutId = window.setTimeout(() => {
            this.timers.delete(timerId);
            callback();
        }, delay);

        timerInfo.id = timeoutId;
        this.timers.set(timerId, timerInfo);

        return timerId;
    }

    /**
     * Clear a timer
     */
    static clearTimer(timerId: number): void {
        const timer = this.timers.get(timerId);
        if (timer) {
            clearTimeout(timer.id);
            this.timers.delete(timerId);
        }
    }

    /**
     * Pause a timer
     */
    static pauseTimer(timerId: number): void {
        const timer = this.timers.get(timerId);
        if (timer && !timer.paused) {
            clearTimeout(timer.id);
            const elapsed = Date.now() - timer.startTime;
            timer.remaining = Math.max(0, timer.delay - elapsed);
            timer.paused = true;
        }
    }

    /**
     * Resume a paused timer
     */
    static resumeTimer(timerId: number): void {
        const timer = this.timers.get(timerId);
        if (timer && timer.paused && timer.remaining !== undefined) {
            timer.paused = false;
            timer.startTime = Date.now();
            timer.delay = timer.remaining;

            const timeoutId = window.setTimeout(() => {
                this.timers.delete(timerId);
                timer.callback();
            }, timer.remaining);

            timer.id = timeoutId;
        }
    }

    /**
     * Clear all timers (useful for cleanup)
     */
    static clearAllTimers(): void {
        this.timers.forEach(timer => {
            clearTimeout(timer.id);
        });
        this.timers.clear();
    }

    /**
     * Apply transition classes for CSS-based animations
     */
    static applyTransitionClasses(
        element: HTMLElement,
        enterClass: string,
        activeClass: string,
        duration: number = 300
    ): void {
        element.classList.add(enterClass);

        // Force reflow
        element.offsetHeight;

        element.classList.add(activeClass);

        setTimeout(() => {
            element.classList.remove(enterClass);
        }, duration);
    }
}

// Export for global access if needed
if (typeof window !== 'undefined') {
    (window as any).AnimationUtils = AnimationUtils;
}

export default AnimationUtils;