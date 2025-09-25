{{-- Simplified Popover Component using Pure HTML Popover API --}}

{{-- Trigger Element --}}
<div class="{{ $triggerClasses }} w-full" data-popover-trigger="{{ $id }}" style="anchor-name: --trigger-{{ $id }};">
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

{{-- Minimal JavaScript for trigger enhancement --}}
<script>
    // Auto-add popovertarget to buttons with data-popover-trigger or buttons inside trigger wrappers
    document.addEventListener('DOMContentLoaded', function() {
        // Handle buttons that directly have data-popover-trigger attribute
        const directButtons = document.querySelectorAll('button[data-popover-trigger="{{ $id }}"]');
        directButtons.forEach(button => {
            button.setAttribute('popovertarget', '{{ $id }}');
        });

        // Handle buttons inside trigger wrapper elements (for backwards compatibility)
        const wrapperTriggers = document.querySelectorAll('[data-popover-trigger="{{ $id }}"]:not(button)');
        wrapperTriggers.forEach(trigger => {
            const buttons = trigger.querySelectorAll('button');
            buttons.forEach(button => {
                button.setAttribute('popovertarget', '{{ $id }}');
            });
        });

        // Add listener to track popover events
        const popover = document.getElementById('{{ $id }}');
        if (popover) {
            popover.addEventListener('beforetoggle', function(event) {
                // Event tracking can be added here if needed
            });
            popover.addEventListener('toggle', function(event) {
                // Event tracking can be added here if needed
            });
        }
    });
</script>