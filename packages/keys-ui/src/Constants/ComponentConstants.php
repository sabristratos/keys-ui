<?php

namespace Keys\UI\Constants;

class ComponentConstants
{
    /**
     * Standard component sizes across all form components
     */
    public const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

    /**
     * Semantic color variants for components
     */
    public const SEMANTIC_COLORS = [
        'brand',
        'success',
        'warning',
        'danger',
        'neutral',
        'info',
    ];

    /**
     * Specific color variants for components that support them
     */
    public const SPECIFIC_COLORS = [
        'red',
        'green',
        'blue',
        'purple',
        'yellow',
        'indigo',
        'pink',
        'gray',
        'teal',
        'orange',
        'dark',
    ];

    /**
     * All valid colors (semantic + specific)
     */
    public const ALL_COLORS = [
        ...self::SEMANTIC_COLORS,
        ...self::SPECIFIC_COLORS,
    ];

    /**
     * Badge-specific color set (includes all colors)
     */
    public const BADGE_COLORS = self::ALL_COLORS;

    /**
     * Avatar-specific color set (semantic + commonly used specific)
     */
    public const AVATAR_COLORS = [
        'brand',
        'success',
        'warning',
        'danger',
        'neutral',
        'red',
        'green',
        'blue',
        'purple',
        'yellow',
        'teal',
        'orange',
    ];

    /**
     * Toggle-specific color set (semantic + commonly used specific)
     */
    public const TOGGLE_COLORS = [
        'brand',
        'success',
        'warning',
        'danger',
        'neutral',
        'red',
        'green',
        'purple',
        'yellow',
        'teal',
        'orange',
    ];

    /**
     * Standard button variants
     */
    public const BUTTON_VARIANTS = [
        'brand',
        'danger',
        'warning',
        'success',
        'info',
        'neutral',
        'ghost',
        'outline',
    ];

    /**
     * Badge variants
     */
    public const BADGE_VARIANTS = ['simple', 'chip', 'subtle'];

    /**
     * Checkbox/Radio variants
     */
    public const FORM_VARIANTS = ['standard', 'bordered', 'colored', 'card'];

    /**
     * Avatar shapes
     */
    public const AVATAR_SHAPES = ['circle', 'square'];

    /**
     * Avatar status indicators
     */
    public const AVATAR_STATUS = ['online', 'offline', 'away', 'busy'];

    /**
     * Popover/Tooltip/Dropdown placement options
     */
    public const POPOVER_PLACEMENTS = [
        'top', 'top-start', 'top-end',
        'bottom', 'bottom-start', 'bottom-end',
        'left', 'left-start', 'left-end',
        'right', 'right-start', 'right-end',
    ];

    /**
     * Tooltip trigger types
     */
    public const TOOLTIP_TRIGGERS = ['hover', 'click', 'focus', 'manual'];

    /**
     * Component-specific size arrays
     */
    public const MODAL_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];

    public const TOOLTIP_SIZES = ['sm', 'md', 'lg'];

    public const ALERT_SIZES = ['sm', 'md', 'lg'];

    public const BADGE_SIZES = ['xs', 'sm', 'md'];

    public const CALENDAR_SIZES = ['sm', 'md', 'lg'];

    public const DATEPICKER_SIZES = ['sm', 'md', 'lg'];

    public const DROPDOWN_SIZES = ['sm', 'md', 'lg'];

    public const GALLERY_THUMBNAIL_SIZES = ['xs', 'sm', 'md', 'lg'];

    /**
     * Loading animations
     */
    public const LOADING_ANIMATIONS = ['spinner', 'dots', 'pulse'];

    /**
     * Image overlay colors
     */
    public const IMAGE_OVERLAY_COLORS = ['black', 'white', 'brand', 'success', 'warning', 'danger', 'neutral'];

    /**
     * Textarea resize options
     */
    public const TEXTAREA_RESIZE = ['none', 'both', 'horizontal', 'vertical'];

    /**
     * Button loading animations
     */
    public const BUTTON_LOADING_ANIMATIONS = ['spinner', 'dots', 'pulse'];

    /**
     * Label positions
     */
    public const LABEL_POSITIONS = ['left', 'right', 'top', 'bottom'];

    /**
     * Get default size for any component
     */
    public static function getDefaultSize(): string
    {
        return 'md';
    }

    /**
     * Get default color for any component
     */
    public static function getDefaultColor(): string
    {
        return 'brand';
    }

    /**
     * Validate if a size is valid
     */
    public static function isValidSize(string $size): bool
    {
        return in_array($size, self::SIZES);
    }

    /**
     * Validate if a color is valid for general use
     */
    public static function isValidColor(string $color): bool
    {
        return in_array($color, self::ALL_COLORS);
    }

    /**
     * Validate component-specific colors
     */
    public static function isValidColorForComponent(string $color, string $component): bool
    {
        return match ($component) {
            'badge' => in_array($color, self::BADGE_COLORS),
            'avatar' => in_array($color, self::AVATAR_COLORS),
            'toggle' => in_array($color, self::TOGGLE_COLORS),
            default => self::isValidColor($color)
        };
    }
}
