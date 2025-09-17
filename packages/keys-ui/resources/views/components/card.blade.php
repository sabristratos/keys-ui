@php
    $elementAttributes = $attributes->merge([
        'class' => trim(
            $baseClasses() . ' ' .
            $variantClasses() . ' ' .
            $paddingClasses() . ' ' .
            $roundedClasses() . ' ' .
            $shadowClasses() . ' ' .
            $interactiveClasses() . ' ' .
            $disabledClasses()
        )
    ]);

    if ($elementType() === 'a') {
        $elementAttributes = $elementAttributes->merge([
            'href' => $href,
            'role' => $disabled ? 'link' : null,
            'aria-disabled' => $disabled ? 'true' : null,
            'tabindex' => $disabled ? '-1' : null
        ]);
    } elseif ($interactive) {
        $elementAttributes = $elementAttributes->merge([
            'role' => 'button',
            'tabindex' => $disabled ? '-1' : '0',
            'aria-disabled' => $disabled ? 'true' : null
        ]);
    }
@endphp

<{{ $elementType() }} {{ $elementAttributes }}>
    {{ $slot }}
</{{ $elementType() }}>