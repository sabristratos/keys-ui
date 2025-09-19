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

    // Use default button text if slot is empty
    $displayContent = trim(strip_tags($slotContent)) === '' ? $buttonText : $slotContent;
@endphp

<div class="add-to-cart-wrapper {{ $showQuantity ? 'flex items-center gap-2' : '' }}">
    {{-- Quantity Selector (when enabled) --}}
    @if($showQuantity && !$isIconOnly)
        <div class="quantity-selector flex items-center border border-border rounded-md overflow-hidden bg-surface">
            <button
                type="button"
                class="qty-decrease px-3 py-2 text-sm font-medium bg-surface hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-action="decrease"
                data-target="{{ $quantityInputId }}"
                {{ $quantity <= 1 ? 'disabled' : '' }}
            >
                <x-keys::icon name="heroicon-o-minus" size="xs" />
            </button>

            <input
                type="number"
                id="{{ $quantityInputId }}"
                name="quantity"
                value="{{ $quantity }}"
                min="1"
                max="{{ $maxQuantity }}"
                class="qty-input w-16 px-2 py-2 text-center text-sm border-0 bg-surface focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                data-max="{{ $maxQuantity }}"
                {{ $disabled ? 'disabled' : '' }}
            />

            <button
                type="button"
                class="qty-increase px-3 py-2 text-sm font-medium bg-surface hover:bg-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-action="increase"
                data-target="{{ $quantityInputId }}"
                {{ $quantity >= $maxQuantity ? 'disabled' : '' }}
            >
                <x-keys::icon name="heroicon-o-plus" size="xs" />
            </button>
        </div>
    @endif

    {{-- Add to Cart Button --}}
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
            <span class="button-text">{{ $displayContent }}</span>
        @endunless

        {{-- Price Display --}}
        @if($showPrice && $formattedPrice && !$isIconOnly)
            <span class="button-price ml-auto text-sm font-semibold opacity-75">
                {{ $formattedPrice }}
            </span>
        @endif

        @if($iconRight && !$loading && !$isIconOnly)
            <x-keys::icon :name="$iconRight" :size="$iconSize()" class="ml-2" />
        @endif
    </{{ $elementType() }}>

    {{-- Stock Status Indicator --}}
    @if($stockLevel !== null && $stockLevel <= $stockWarningThreshold && $stockLevel > 0 && !$isIconOnly)
        <div class="stock-indicator text-xs text-warning mt-1">
            Only {{ $stockLevel }} left in stock
        </div>
    @endif
</div>

{{-- Component-specific styles --}}
<style>
    [data-add-to-cart="true"] {
        transition: all 200ms ease;
    }

    [data-add-to-cart="true"].adding .button-icon-default {
        opacity: 0;
        transform: rotate(180deg);
    }

    [data-add-to-cart="true"].adding .button-icon-toggle {
        opacity: 1;
        animation: spin 1s linear infinite;
    }

    [data-add-to-cart="true"].added .button-icon-default,
    [data-add-to-cart="true"].added .button-icon-toggle {
        opacity: 0;
        transform: scale(0.8);
    }

    [data-add-to-cart="true"].added .button-icon-success {
        opacity: 1;
        transform: scale(1.1);
        animation: success-pulse 0.6s ease-out;
    }

    [data-add-to-cart="true"].added {
        background-color: rgb(var(--color-success) / 1);
        color: rgb(var(--color-foreground-success) / 1);
        border-color: rgb(var(--color-success) / 1);
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes success-pulse {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1.1); opacity: 1; }
    }

    .quantity-selector input:focus {
        box-shadow: none;
    }

    .quantity-selector .qty-decrease:hover:not(:disabled),
    .quantity-selector .qty-increase:hover:not(:disabled) {
        background-color: rgb(var(--color-border) / 1);
    }

    .stock-indicator {
        font-size: 0.75rem;
        color: rgb(var(--color-warning) / 1);
    }

    .button-price {
        margin-left: auto;
        padding-left: 0.5rem;
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
        .add-to-cart-wrapper.flex {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
        }

        .quantity-selector {
            justify-content: center;
            max-width: 150px;
            margin: 0 auto;
        }
    }
</style>