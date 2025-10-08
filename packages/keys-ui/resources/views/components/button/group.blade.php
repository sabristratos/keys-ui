@php

    $baseClasses = 'inline-flex';
    $orientationClasses = $orientation === 'vertical' ? 'flex-col' : 'flex-row';

    if ($attached) {
        if ($orientation === 'horizontal') {
            $attachedClasses = '[&>*]:border [&>*]:border-line [&>*:not(:first-child)]:-ms-px [&>*:first-child:not(:last-child)]:rounded-e-none [&>*:first-child:not(:last-child)]:before:rounded-e-none [&>*:last-child:not(:first-child)]:rounded-s-none [&>*:last-child:not(:first-child)]:before:rounded-s-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:first-child):not(:last-child)]:before:rounded-none [&>*:hover]:relative [&>*:hover]:z-10 [&>*:focus-within]:relative [&>*:focus-within]:z-10 [&>*[data-selected="true"]]:bg-accent [&>*[data-selected="true"]]:text-accent-contrast [&>*[data-selected="true"]]:relative [&>*[data-selected="true"]]:z-10';
        } else {
            $attachedClasses = '[&>*]:border [&>*]:border-line [&>*:not(:first-child)]:-mt-px [&>*:first-child:not(:last-child)]:rounded-b-none [&>*:first-child:not(:last-child)]:before:rounded-b-none [&>*:last-child:not(:first-child)]:rounded-t-none [&>*:last-child:not(:first-child)]:before:rounded-t-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:first-child):not(:last-child)]:before:rounded-none [&>*:hover]:relative [&>*:hover]:z-10 [&>*:focus-within]:relative [&>*:focus-within]:z-10 [&>*[data-selected="true"]]:bg-accent [&>*[data-selected="true"]]:text-accent-contrast [&>*[data-selected="true"]]:relative [&>*[data-selected="true"]]:z-10';
        }
    } else {
        $attachedClasses = $orientation === 'horizontal' ? 'gap-2' : 'gap-2';
    }

    $allClasses = "$baseClasses $orientationClasses $attachedClasses";
@endphp

<div {{ $attributes->merge(['class' => $allClasses]) }}
     data-button-group="true"
     data-orientation="{{ $orientation }}"
     data-attached="{{ $attached ? 'true' : 'false' }}">
    {{ $slot }}
</div>