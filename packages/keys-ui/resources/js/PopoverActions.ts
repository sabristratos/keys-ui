
class PopoverActions {
    constructor() {
        console.log('PopoverActions: Using native HTML Popover API');
        this.init();
    }

    init() {
        // Wire up popover triggers on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.wirePopovers());
        } else {
            this.wirePopovers();
        }
    }

    wirePopovers() {
        // Find all popover trigger wrappers
        const triggers = document.querySelectorAll('[data-popover-trigger]');

        triggers.forEach(triggerWrapper => {
            const popoverId = triggerWrapper.getAttribute('data-popover-trigger');
            if (!popoverId) return;

            const popover = document.getElementById(popoverId);
            if (!popover) return;

            // Find the button/element inside the trigger wrapper
            const button = triggerWrapper.querySelector('button, a, [role="button"]');
            if (!button) return;

            // Add click listener to toggle the popover using the Popover API
            button.addEventListener('click', (e) => {
                e.preventDefault();

                if (popover.matches(':popover-open')) {
                    popover.hidePopover();
                } else {
                    popover.showPopover();
                }
            });

            console.log(`[PopoverActions] Wired click listener for popover: ${popoverId}`);
        });
    }
}

const popoverActions = new PopoverActions();

export { PopoverActions, popoverActions };