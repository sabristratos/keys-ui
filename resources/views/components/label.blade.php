@php
    $labelAttributes = $attributes->merge([
        'class' => trim($baseClasses() . ' ' . $sizeClasses())
    ]);

    if ($for) {
        $labelAttributes = $labelAttributes->merge(['for' => $for]);
    }
@endphp

<label {{ $labelAttributes }}>
    {{ $slot }}

    @if($required)
        <span class="text-danger ml-1" aria-label="{{ __('keys-ui::keys-ui.aria.required_field') }}">*</span>
    @elseif($optional)
        <span class="text-neutral ml-1 text-xs">{{ __('keys-ui::keys-ui.labels.optional') }}</span>
    @endif
</label>