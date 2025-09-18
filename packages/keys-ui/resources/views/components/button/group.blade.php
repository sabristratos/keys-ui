@php
    $elementAttributes = $attributes->merge([
        'class' => $containerClasses
    ])->merge($dataAttributes);
@endphp

<div {{ $elementAttributes }}>
    {{ $slot }}

    <style>
        /* Negative margins for seamless button connections */
        [data-button-group="true"][data-orientation="horizontal"][data-attached="true"] > *:not(:first-child) {
            margin-left: -1px;
        }

        [data-button-group="true"][data-orientation="vertical"][data-attached="true"] > *:not(:first-child) {
            margin-top: -1px;
        }

        /* Ensure buttons in group maintain proper z-index on hover/focus */
        [data-button-group="true"][data-attached="true"] > *:hover,
        [data-button-group="true"][data-attached="true"] > *:focus-within {
            position: relative;
            z-index: 10;
        }
    </style>

</div>