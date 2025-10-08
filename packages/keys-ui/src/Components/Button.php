<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Button Component
 *
 * A versatile button component supporting multiple variants, sizes, icons, and states.
 * Features auto icon-only detection, multi-state functionality, loading states,
 * and can render as both button and link elements.
 */
class Button extends Component
{

    /**
     * Create a new Button component instance.
     *
     * @param  string  $color  Button color (primary, secondary, danger, warning, success, info)
     * @param  string  $variant  Button variant (solid, outlined, ghost, subtle)
     * @param  string  $size  Size variant (xs, sm, md, lg, xl)
     * @param  string|null  $type  Button type attribute (button, submit, reset)
     * @param  string|null  $href  URL for link buttons
     * @param  bool  $disabled  Whether the button is disabled
     * @param  bool  $loading  Whether the button is in loading state
     * @param  string|null  $icon  Alias for iconLeft
     * @param  string|null  $iconLeft  Left icon name
     * @param  string|null  $iconRight  Right icon name
     * @param  string  $loadingAnimation  Loading animation type (spinner, dots)
     * @param  string|null  $iconToggle  Icon for toggle state (multi-state)
     * @param  string|null  $iconSuccess  Icon for success state (multi-state)
     * @param  string|null  $labelToggle  Label for toggle state (multi-state)
     * @param  string|null  $labelSuccess  Label for success state (multi-state)
     * @param  string|null  $popovertarget  ID of popover element to control
     */
    public function __construct(
        public string $color = 'secondary',
        public string $variant = 'solid',
        public string $size = 'md',
        public string $type = 'button',
        public ?string $href = null,
        public bool $disabled = false,
        public bool $loading = false,
        public ?string $icon = null,
        public ?string $iconLeft = null,
        public ?string $iconRight = null,
        public string $loadingAnimation = 'spinner',
        public ?string $iconToggle = null,
        public ?string $iconSuccess = null,
        public ?string $labelToggle = null,
        public ?string $labelSuccess = null,
        public ?string $popovertarget = null
    ) {
        if ($this->icon && ! $this->iconLeft) {
            $this->iconLeft = $this->icon;
        }

        $this->color = ComponentConstants::validate($this->color, ComponentConstants::BUTTON_COLORS, 'primary');
        $this->variant = ComponentConstants::validate($this->variant, ComponentConstants::BUTTON_VARIANTS, 'solid');
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_XS_TO_XL, 'md');
        $this->loadingAnimation = ComponentConstants::validate($this->loadingAnimation, ComponentConstants::LOADING_ANIMATIONS, 'spinner');
    }

    /**
     * Check if the button should render as a link element.
     */
    public function isLink(): bool
    {
        return ! is_null($this->href);
    }

    /**
     * Determine the HTML element type to render.
     * Returns 'a' for links, 'span' for disabled links, 'button' for buttons.
     */
    public function elementType(): string
    {
        if ($this->isLink()) {
            return $this->disabled ? 'span' : 'a';
        }

        return 'button';
    }

    /**
     * Get the button type attribute value.
     * Returns null for links, defaults to 'button' for button elements.
     */
    public function buttonType(): ?string
    {
        return $this->isLink() ? null : $this->type;
    }

    /**
     * Auto-detect if the button should render as icon-only.
     * Ignores screen reader only content when determining visibility.
     */
    public function isIconOnly(string $slotContent = ''): bool
    {
        $contentWithoutSrOnly = preg_replace('/<[^>]*sr-only[^>]*>.*?<\/[^>]*>/s', '', $slotContent);
        $contentWithoutSrOnly = preg_replace('/<[^>]*sr-only[^>]*>/s', '', $contentWithoutSrOnly);

        return trim(strip_tags($contentWithoutSrOnly)) === '' && ($this->iconLeft || $this->iconRight);
    }

    /**
     * Check if the button has multi-state functionality.
     * Multi-state buttons can toggle between default, toggle, and success states.
     */
    public function isMultiState(): bool
    {
        return ! is_null($this->iconToggle) || ! is_null($this->iconSuccess);
    }

    /**
     * Generate comprehensive data attributes for CSS targeting and JavaScript functionality.
     * Includes component identification, state, multi-state, and link attributes.
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-button' => 'true',
            'data-keys-group-target' => 'true',
            'data-color' => $this->color,
            'data-variant' => $this->variant,
            'data-size' => $this->size,
            'data-element-type' => $this->elementType(),
        ];

        if ($this->disabled) {
            $attributes['data-disabled'] = 'true';
        }

        if ($this->loading) {
            $attributes['data-loading'] = 'true';
            $attributes['data-loading-animation'] = $this->loadingAnimation;
        }

        if ($this->isMultiState()) {
            $attributes['data-multi-state'] = 'true';
            $attributes['data-icon-default'] = $this->iconLeft;

            if ($this->iconToggle) {
                $attributes['data-icon-toggle'] = $this->iconToggle;
            }

            if ($this->iconSuccess) {
                $attributes['data-icon-success'] = $this->iconSuccess;
            }

            if ($this->labelToggle) {
                $attributes['data-label-toggle'] = $this->labelToggle;
            }

            if ($this->labelSuccess) {
                $attributes['data-label-success'] = $this->labelSuccess;
            }
        }

        if ($this->iconLeft || $this->iconRight) {
            $attributes['data-has-icon'] = 'true';
        }

        if ($this->isLink()) {
            $attributes['data-href'] = $this->href;
        }

        return $attributes;
    }

    /**
     * Generate data attributes based on slot content analysis.
     * Used by the template to determine icon-only styling.
     */
    public function getDataAttributesForSlot(string $slotContent = ''): array
    {
        $isIconOnly = $this->isIconOnly($slotContent);

        return [
            'data-icon-only' => $isIconOnly ? 'true' : 'false',
        ];
    }

    /**
     * Render the button component view.
     */
    public function render()
    {
        return view('keys::components.button');
    }
}
