<?php

namespace Keys\UI\Constants;

/**
 * ComponentConstants - Centralized validation constants for Keys UI components
 *
 * Provides a single source of truth for all component validation arrays,
 * eliminating duplication across 22+ component classes.
 *
 * Usage:
 * - Use specific constant arrays for validation
 * - Use helper methods for quick validation checks
 * - Extend arrays for custom component needs
 */
class ComponentConstants
{
    /**
     * Standard contextual colors used across components
     * Includes semantic colors (success, danger, etc.) and brand colors
     */
    public const COLORS = [
        'brand', 'primary', 'secondary', 'accent',
        'success', 'warning', 'danger', 'info', 'neutral'
    ];

    /**
     * Extended color palette for Badge and similar components
     * Includes all contextual colors plus additional named colors
     */
    public const COLORS_EXTENDED = [
        'brand', 'success', 'warning', 'danger', 'neutral', 'info',
        'red', 'green', 'blue', 'purple', 'yellow', 'indigo',
        'pink', 'gray', 'teal', 'orange', 'dark'
    ];

    /**
     * Button-specific colors (subset with different naming)
     */
    public const BUTTON_COLORS = ['primary', 'secondary', 'danger', 'warning', 'success', 'info'];

    /**
     * Typography colors (for Text and Heading components)
     */
    public const TEXT_COLORS = [
        'heading', 'text', 'primary', 'secondary', 'muted', 'disabled',
        'brand', 'accent', 'success', 'warning', 'danger', 'info', 'neutral'
    ];

    /**
     * Full size scale (xs to xl)
     * Used by: Button, Checkbox, Radio, Avatar, Loading, Rating, Chart, Icon, Heading, Text
     */
    public const SIZES_XS_TO_XL = ['xs', 'sm', 'md', 'lg', 'xl'];

    /**
     * Small to large sizes
     * Used by: Alert, Calendar, DatePicker, Dropdown, Tooltip, EmptyState
     */
    public const SIZES_SM_TO_LG = ['sm', 'md', 'lg'];

    /**
     * Extra small to medium (limited)
     * Used by: Badge, Select\Chip
     */
    public const SIZES_XS_TO_MD = ['xs', 'sm', 'md'];

    /**
     * Extended sizes including typography scales
     * Used by: Modal, Slideout, Popover
     */
    public const SIZES_EXTENDED = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];

    /**
     * Typography-specific sizes with 2xl-4xl
     * Used by: Text, Heading
     */
    public const SIZES_TYPOGRAPHY = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    public const SIZES_TYPOGRAPHY_EXTENDED = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

    /**
     * Thumbnail sizes
     * Used by: Gallery
     */
    public const SIZES_THUMBNAIL = ['xs', 'sm', 'md', 'lg'];

    /**
     * Button variants
     * Solid, outlined, ghost, subtle
     */
    public const BUTTON_VARIANTS = ['solid', 'outlined', 'ghost', 'subtle'];

    /**
     * Badge variants
     * Filled, outlined, subtle
     */
    public const BADGE_VARIANTS = ['filled', 'outlined', 'subtle'];

    /**
     * Form control variants (Checkbox, Radio)
     * Standard, bordered, colored, card
     */
    public const FORM_CONTROL_VARIANTS = ['standard', 'bordered', 'colored', 'card'];

    /**
     * Alert/Toast/EmptyState variants (contextual colors as variants)
     */
    public const CONTEXTUAL_VARIANTS = ['brand', 'success', 'warning', 'danger', 'neutral', 'info'];

    /**
     * Icon variants
     */
    public const ICON_VARIANTS = ['outline', 'solid', 'mini'];

    /**
     * Loading animations
     */
    public const LOADING_ANIMATIONS = ['spinner', 'dots', 'bars', 'pulse', 'wave', 'bounce'];

    /**
     * Avatar shapes
     */
    public const AVATAR_SHAPES = ['circle', 'square'];

    /**
     * Avatar status indicators
     */
    public const AVATAR_STATUS = ['online', 'offline', 'away', 'busy'];

    /**
     * Heading levels (semantic HTML)
     */
    public const HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    /**
     * Font weights
     */
    public const FONT_WEIGHTS = ['light', 'normal', 'medium', 'semibold', 'bold'];
    public const FONT_WEIGHTS_EXTENDED = ['normal', 'medium', 'semibold', 'bold', 'extrabold'];

    /**
     * Letter spacing (tracking)
     */
    public const LETTER_SPACING = ['tighter', 'tight', 'normal', 'wide', 'wider'];

    /**
     * Text alignments
     */
    public const TEXT_ALIGNMENTS = ['', 'left', 'center', 'right', 'justify'];

    /**
     * Line height (leading)
     */
    public const LINE_HEIGHT = ['tight', 'normal', 'relaxed', 'loose'];

    /**
     * Line clamp values
     */
    public const LINE_CLAMP = ['none', '1', '2', '3', '4', '5', '6'];

    /**
     * Text element types
     */
    public const TEXT_ELEMENTS = ['p', 'span', 'div', 'label', 'small'];

    /**
     * Popover/Tooltip placements
     * Comprehensive list with start/end variants
     */
    public const PLACEMENTS = [
        'top', 'top-start', 'top-end',
        'bottom', 'bottom-start', 'bottom-end',
        'left', 'left-start', 'left-end',
        'right', 'right-start', 'right-end',
    ];

    /**
     * Toast positions
     */
    public const TOAST_POSITIONS = [
        'top-left', 'top-center', 'top-right',
        'bottom-left', 'bottom-center', 'bottom-right',
        'center'
    ];

    /**
     * Toast variants
     */
    public const TOAST_VARIANTS = [
        'success', 'error', 'warning', 'info', 'default'
    ];

    /**
     * Tabs variants
     */
    public const TABS_VARIANTS = [
        'default', 'pills', 'underline'
    ];

    /**
     * Tooltip-specific placements (Label component)
     */
    public const TOOLTIP_PLACEMENTS = [
        'top', 'bottom', 'left', 'right'
    ];

    /**
     * Helper method to validate a value against a constant array
     *
     * @param string $value The value to validate
     * @param array $validValues The array of valid values
     * @param string $default The default value if validation fails
     * @return string The validated value or default
     */
    public static function validate(string $value, array $validValues, string $default): string
    {
        return in_array($value, $validValues) ? $value : $default;
    }

    /**
     * Helper method to check if a value is valid
     *
     * @param string $value The value to check
     * @param array $validValues The array of valid values
     * @return bool True if valid, false otherwise
     */
    public static function isValid(string $value, array $validValues): bool
    {
        return in_array($value, $validValues);
    }
}
