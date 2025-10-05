import { BaseActionClass } from './utils/BaseActionClass';
import { DOMUtils } from './utils/DOMUtils';

/**
 * PopoverActions - Handles basic popover trigger functionality
 *
 * Uses native HTML Popover API for positioning and rendering.
 * Provides click handling for popover triggers.
 */
export class PopoverActions extends BaseActionClass {

    /**
     * Initialize popover elements - required by BaseActionClass
     */
    protected initializeElements(): void {
        // Popovers are wired up via event delegation
        // No per-element initialization needed
    }

    /**
     * Bind event listeners using event delegation - required by BaseActionClass
     */
    protected bindEventListeners(): void {
        // Native popovertarget attribute handles all popover toggling
        // No JavaScript event handling needed
    }

    /**
     * Clean up PopoverActions - extends BaseActionClass destroy
     */
    protected onDestroy(): void {
        // Event listeners use delegation so no cleanup needed
    }
}

export default PopoverActions.getInstance();