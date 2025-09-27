{{-- Simplified Popover Component using Pure HTML Popover API --}}

{{-- Trigger Element --}}
<div {{ $attributes->merge(['class' => $triggerClasses]) }} data-popover-trigger="{{ $id }}" style="anchor-name: --trigger-{{ $id }};">
    {{ $trigger }}
</div>

{{-- Popover Content --}}
<div
    id="{{ $id }}"
    popover="{{ $manual ? 'manual' : 'auto' }}"
    data-keys-popover="true"
    data-variant="{{ $variant }}"
    data-size="{{ $size }}"
    data-placement="{{ $placement }}"
    class="{{ $baseClasses }}"
    style="--popover-anchor: --trigger-{{ $id }};"
>
    {{-- Arrow (optional) --}}
    @if($arrow)
        <div class="{{ $arrowClasses }}"></div>
    @endif

    {{-- Content --}}
    <div class="{{ $contentClasses }}">
        {{ $slot }}
    </div>
</div>

{{-- Enhanced JavaScript for trigger enhancement with debug logging --}}
<script>
    // Auto-add popovertarget to buttons with data-popover-trigger or buttons inside trigger wrappers
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔍 [Popover Debug] Initializing popover: {{ $id }}');

        // Handle buttons that directly have data-popover-trigger attribute
        const directButtons = document.querySelectorAll('button[data-popover-trigger="{{ $id }}"]');
        console.log('🔍 [Popover Debug] Found direct buttons:', directButtons.length, directButtons);

        directButtons.forEach((button, index) => {
            console.log(`🔍 [Popover Debug] Setting popovertarget on direct button ${index}:`, button);
            button.setAttribute('popovertarget', '{{ $id }}');
            console.log(`🔍 [Popover Debug] Button ${index} popovertarget set to:`, button.getAttribute('popovertarget'));
        });

        // Handle buttons inside trigger wrapper elements (for backwards compatibility)
        // ONLY process buttons that don't already have data-popover-trigger attribute
        const wrapperTriggers = document.querySelectorAll('[data-popover-trigger="{{ $id }}"]:not(button)');
        console.log('🔍 [Popover Debug] Found wrapper triggers:', wrapperTriggers.length, wrapperTriggers);

        wrapperTriggers.forEach((trigger, triggerIndex) => {
            const buttons = trigger.querySelectorAll('button:not([data-popover-trigger])');
            console.log(`🔍 [Popover Debug] Wrapper ${triggerIndex} contains non-direct buttons:`, buttons.length, buttons);

            buttons.forEach((button, buttonIndex) => {
                console.log(`🔍 [Popover Debug] Setting popovertarget on wrapper button ${triggerIndex}-${buttonIndex}:`, button);
                button.setAttribute('popovertarget', '{{ $id }}');
                console.log(`🔍 [Popover Debug] Wrapper button ${triggerIndex}-${buttonIndex} popovertarget set to:`, button.getAttribute('popovertarget'));
            });
        });

        // Add listener to track popover events with detailed logging
        const popover = document.getElementById('{{ $id }}');
        console.log('🔍 [Popover Debug] Popover element found:', !!popover, popover);

        if (popover) {
            console.log('🔍 [Popover Debug] Popover element details:', {
                id: popover.id,
                popoverAttribute: popover.getAttribute('popover'),
                computedStyle: window.getComputedStyle(popover),
                boundingRect: popover.getBoundingClientRect(),
                isOpen: popover.matches(':popover-open')
            });

            popover.addEventListener('beforetoggle', function(event) {
                console.log('📝 [Popover Debug] beforetoggle event:', {
                    currentState: event.currentState,
                    newState: event.newState,
                    popoverElement: event.target,
                    timestamp: new Date().toISOString()
                });
            });

            popover.addEventListener('toggle', function(event) {
                console.log('📝 [Popover Debug] toggle event:', {
                    currentState: event.currentState,
                    newState: event.newState,
                    popoverElement: event.target,
                    isOpen: event.target.matches(':popover-open'),
                    boundingRect: event.target.getBoundingClientRect(),
                    computedDisplay: window.getComputedStyle(event.target).display,
                    computedVisibility: window.getComputedStyle(event.target).visibility,
                    computedOpacity: window.getComputedStyle(event.target).opacity,
                    timestamp: new Date().toISOString()
                });
            });

            // Add click listener to the trigger buttons for additional debugging
            // Collect both direct buttons and non-direct buttons from wrappers
            const allTriggerButtons = [
                ...directButtons,
                ...Array.from(wrapperTriggers).flatMap(trigger =>
                    Array.from(trigger.querySelectorAll('button:not([data-popover-trigger])'))
                )
            ];

            allTriggerButtons.forEach((button, index) => {
                button.addEventListener('click', function(event) {
                    console.log(`🖱️ [Popover Debug] Button ${index} clicked:`, {
                        button: button,
                        popovertarget: button.getAttribute('popovertarget'),
                        targetPopover: document.getElementById(button.getAttribute('popovertarget')),
                        isPopoverOpen: popover.matches(':popover-open'),
                        eventDefaultPrevented: event.defaultPrevented,
                        timestamp: new Date().toISOString()
                    });

                    // Log after a short delay to see the result
                    setTimeout(() => {
                        console.log(`🖱️ [Popover Debug] After click - Popover state:`, {
                            isOpen: popover.matches(':popover-open'),
                            boundingRect: popover.getBoundingClientRect(),
                            computedDisplay: window.getComputedStyle(popover).display,
                            computedVisibility: window.getComputedStyle(popover).visibility,
                            computedOpacity: window.getComputedStyle(popover).opacity
                        });
                    }, 100);
                });
            });
        } else {
            console.error('❌ [Popover Debug] Popover element not found for ID: {{ $id }}');
        }
    });
</script>