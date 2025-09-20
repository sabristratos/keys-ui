<?php

namespace Keys\UI\Components;

use Keys\UI\Components\Button;

class AddToCart extends Button
{
    public function __construct(
        // Button inherited props
        public string $variant = 'brand',
        public string $size = 'md',
        public ?string $type = null,
        public ?string $href = null,
        public bool $disabled = false,
        public bool $loading = false,
        public ?string $iconLeft = null,
        public ?string $iconRight = null,
        public string $loadingAnimation = 'spinner',
        public ?string $iconToggle = null,
        public ?string $iconSuccess = null,
        public ?string $labelToggle = null,
        public ?string $labelSuccess = null,

        // AddToCart specific props
        public ?string $productId = null,
        public ?string $variantId = null,
        public int $quantity = 1,
        public ?string $price = null,
        public ?int $maxQuantity = null,
        public ?int $stockLevel = null,
        public bool $inCart = false,
        public bool $showQuantity = false,
        public bool $showPrice = false,
        public int $stockWarningThreshold = 5,
        public string $currency = '$',
        public string $addText = 'Add to Cart',
        public string $addingText = 'Adding...',
        public string $addedText = 'Added to Cart',
        public string $outOfStockText = 'Out of Stock',
        public string $ajaxUrl = '/cart/add'
    ) {
        // Set cart-specific defaults only if no icon specified
        if (!$this->iconLeft) {
            $this->iconLeft = 'heroicon-o-shopping-cart';
        }
        $this->iconToggle = $this->iconToggle ?: 'heroicon-o-arrow-path';
        $this->iconSuccess = $this->iconSuccess ?: 'heroicon-o-check';

        // Set default labels if not provided
        if (!$this->labelToggle) {
            $this->labelToggle = $this->addingText;
        }
        if (!$this->labelSuccess) {
            $this->labelSuccess = $this->addedText;
        }

        // Handle stock-based disabling
        if ($this->stockLevel !== null && $this->stockLevel <= 0) {
            $this->disabled = true;
        }

        // Validate quantity constraints
        if ($this->maxQuantity && $this->quantity > $this->maxQuantity) {
            $this->quantity = $this->maxQuantity;
        }

        if ($this->stockLevel && $this->quantity > $this->stockLevel) {
            $this->quantity = $this->stockLevel;
        }

        // Call parent constructor
        parent::__construct(
            variant: $this->variant,
            size: $this->size,
            type: $this->type,
            href: $this->href,
            disabled: $this->disabled,
            loading: $this->loading,
            iconLeft: $this->iconLeft,
            iconRight: $this->iconRight,
            loadingAnimation: $this->loadingAnimation,
            iconToggle: $this->iconToggle,
            iconSuccess: $this->iconSuccess,
            labelToggle: $this->labelToggle,
            labelSuccess: $this->labelSuccess
        );
    }

    public function isOutOfStock(): bool
    {
        return $this->stockLevel !== null && $this->stockLevel <= 0;
    }

    public function getMaxQuantity(): int
    {
        if ($this->maxQuantity && $this->stockLevel) {
            return min($this->maxQuantity, $this->stockLevel);
        }

        return $this->maxQuantity ?: $this->stockLevel ?: 99;
    }

    public function getFormattedPrice(): ?string
    {
        if (!$this->price) {
            return null;
        }

        // Simple price formatting - can be enhanced with proper localization
        $numericPrice = is_numeric($this->price) ? (float) $this->price : null;

        if ($numericPrice === null) {
            return $this->price; // Return as-is if not numeric
        }

        return $this->currency . number_format($numericPrice, 2);
    }

    public function getQuantityInputId(): string
    {
        return 'qty-' . ($this->productId ?: uniqid());
    }

    public function getAddToCartDataAttributes(): array
    {
        $attributes = [];

        // Add cart-specific data attributes
        $attributes['data-add-to-cart'] = 'true';

        if ($this->productId) {
            $attributes['data-product-id'] = $this->productId;
        }

        if ($this->variantId) {
            $attributes['data-variant-id'] = $this->variantId;
        }

        $attributes['data-quantity'] = (string) $this->quantity;
        $attributes['data-max-quantity'] = (string) $this->getMaxQuantity();

        if ($this->stockLevel !== null) {
            $attributes['data-stock-level'] = (string) $this->stockLevel;
        }

        if ($this->price) {
            $attributes['data-price'] = $this->price;
        }

        $attributes['data-ajax-url'] = $this->ajaxUrl;
        $attributes['data-in-cart'] = $this->inCart ? 'true' : 'false';

        return $attributes;
    }

    public function getDataAttributes(): array
    {
        // Merge parent data attributes with cart-specific ones
        return array_merge(
            parent::getDataAttributes(),
            $this->getAddToCartDataAttributes()
        );
    }

    public function getButtonText(): string
    {
        if ($this->isOutOfStock()) {
            return $this->outOfStockText;
        }

        if ($this->inCart) {
            return $this->addedText;
        }

        return $this->addText;
    }

    public function render()
    {
        return view('keys::components.add-to-cart', [
            'formattedPrice' => $this->getFormattedPrice(),
            'quantityInputId' => $this->getQuantityInputId(),
            'maxQuantity' => $this->getMaxQuantity(),
            'buttonText' => $this->getButtonText(),
        ]);
    }
}