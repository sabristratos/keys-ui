@php
    $slotContent = $slot->toHtml();
    $isIconOnly = $isIconOnly($slotContent);
    $sizeClass = $isIconOnly ? $iconOnlySizeClasses() : $sizeClasses();

    $elementAttributes = $attributes->merge([
        'class' => trim($baseClasses() . ' ' . $variantClasses() . ' ' . $sizeClass . ' ' . $disabledClasses() . ($isMultiState() ? ' relative' : ''))
    ]);

    if ($elementType() === 'button') {
        $elementAttributes = $elementAttributes->merge([
            'type' => $buttonType(),
            'disabled' => $disabled || $loading
        ]);
    } elseif ($elementType() === 'a') {
        $elementAttributes = $elementAttributes->merge([
            'href' => $href
        ]);
    }

    $elementAttributes = $elementAttributes->merge($getDataAttributes());
@endphp

<{{ $elementType() }} {{ $elementAttributes }}>
    @if($loading)
        <x-keys::loading :animation="$loadingAnimation" :size="$iconSize()" class="mr-2" />
    @elseif($iconLeft && !$loading)
        @if($isMultiState())
            <x-keys::icon
                :name="$iconLeft"
                :size="$iconSize()"
                class="button-icon-default {{ $isIconOnly ? '' : 'mr-2' }} transition-all duration-200"
            />

            @if($iconToggle)
                <x-keys::icon
                    :name="$iconToggle"
                    :size="$iconSize()"
                    class="button-icon-toggle absolute inset-0 m-auto opacity-0 transition-all duration-200"
                />
            @endif

            @if($iconSuccess)
                <x-keys::icon
                    :name="$iconSuccess"
                    :size="$iconSize()"
                    class="button-icon-success absolute inset-0 m-auto opacity-0 transition-all duration-200 text-success"
                />
            @endif
        @else
            <x-keys::icon :name="$iconLeft" :size="$iconSize()" class="{{ $isIconOnly ? '' : 'mr-2' }}" />
        @endif
    @endif

    @unless($isIconOnly)
        {{ $slot }}
    @endunless

    @if($iconRight && !$loading && !$isIconOnly)
        <x-keys::icon :name="$iconRight" :size="$iconSize()" class="ml-2" />
    @endif
</{{ $elementType() }}>