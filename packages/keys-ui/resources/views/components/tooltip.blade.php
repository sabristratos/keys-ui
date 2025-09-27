{{--
  Keys UI Tooltip Component - Direct Attribute Application

  This component applies tooltip data attributes directly to child elements,
  eliminating wrapper interference with interactions.

  Usage:
  <x-keys::tooltip content="Save changes" placement="top">
    <button>Save</button>
  </x-keys::tooltip>

  Or with rich content using the default slot:
  <x-keys::tooltip placement="right">
    <button>Info</button>
    <x-slot>
      <div class="space-y-2">
        <div class="font-semibold">Rich Content</div>
        <div>Detailed information here</div>
      </div>
    </x-slot>
  </x-keys::tooltip>

  Note: Rich content is detected when no 'content' prop is provided AND
  the default slot contains template content. This creates a template element
  that is referenced by the tooltip system for dynamic content injection.
--}}

@php
    // Determine if this is a rich content tooltip
    // Rich content exists when we have no simple content prop AND we have a named template slot
    $hasRichContent = !$hasContent() && isset($template) && !empty(trim($template ?? ''));

    // Use the consolidated tooltip data attributes
    $allTooltipAttributes = $tooltipDataAttributes;

    // Handle rich content templates
    if ($hasRichContent) {
        $allTooltipAttributes['data-tooltip'] = 'template';
        $allTooltipAttributes['data-tooltip-template-id'] = $id . '-template';
    }

    // Add title fallback for accessibility when using simple content
    if ($hasContent()) {
        $allTooltipAttributes['title'] = $content;
    }

    // Convert attributes to JavaScript-safe format for the script
    $attributesJson = json_encode($allTooltipAttributes, JSON_HEX_APOS | JSON_HEX_QUOT);
    $wrapperId = 'tooltip-wrapper-' . uniqid();
@endphp

{{-- Template for rich content tooltips - CREATE FIRST to avoid race conditions --}}
@if($hasRichContent)
    <template id="{{ $id }}-template" data-tooltip-template="true">
        {{ $template }}
    </template>
@endif

{{-- Use transfer approach to apply tooltip attributes to child elements --}}
<div id="{{ $wrapperId }}" data-tooltip-transfer="true" style="display: contents;">
    {{ $slot }}
</div>

{{-- Script to transfer attributes from wrapper to first child --}}
<script>
(function() {
    const wrapper = document.getElementById('{{ $wrapperId }}');
    const attributes = {!! $attributesJson !!};

    if (!wrapper) {
        console.warn('Tooltip wrapper not found:', '{{ $wrapperId }}');
        return;
    }

    // Find the first interactive element or any element
    const target = wrapper.querySelector('button, input, a, select, textarea, [tabindex], [role="button"]') ||
                  wrapper.querySelector('*:not(script):not(template)') ||
                  wrapper.firstElementChild;

    if (target) {
        // Transfer all tooltip attributes to the target element
        Object.entries(attributes).forEach(([key, value]) => {
            target.setAttribute(key, value);
        });
    }

    // Remove the wrapper by moving its children to parent
    const parent = wrapper.parentNode;
    while (wrapper.firstChild) {
        parent.insertBefore(wrapper.firstChild, wrapper);
    }
    wrapper.remove();
})();
</script>