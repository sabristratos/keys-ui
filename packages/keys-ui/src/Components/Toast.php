<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Toast Component
 *
 * Interactive notification system with positioning, variants, auto-dismiss functionality,
 * and full accessibility support. Supports HTML Popover API for modern browsers.
 */
class Toast extends Component
{
    /**
     * Default timeout value in milliseconds (0 = no auto-hide)
     */
    private const DEFAULT_TIMEOUT = 5000;

    /**
     * Create a new Toast component instance
     *
     * @param string $position Toast position on screen
     * @param string $variant Toast variant/type (info, success, warning, danger, neutral)
     * @param bool $dismissible Whether the toast can be manually dismissed
     * @param bool $autoHide Whether the toast should auto-dismiss after timeout
     * @param int $timeout Auto-dismiss timeout in milliseconds
     * @param string $icon Custom icon override (defaults to variant icon)
     * @param string $title Optional toast title
     * @param string $message Toast message content
     * @param bool $persistent Whether toast persists across page loads
     * @param string $id Custom toast ID (auto-generated if empty)
     */
    public function __construct(
        public string $position = 'top-right',
        public string $variant = 'info',
        public bool $dismissible = true,
        public bool $autoHide = true,
        public int $timeout = self::DEFAULT_TIMEOUT,
        public string $icon = '',
        public string $title = '',
        public string $message = '',
        public bool $persistent = false,
        public string $id = ''
    ) {
        $this->position = ComponentConstants::validate($position, ComponentConstants::TOAST_POSITIONS, 'top-right');
        $this->variant = ComponentConstants::validate($variant, ComponentConstants::TOAST_VARIANTS, 'info');
        $this->timeout = max(0, $timeout);
        $this->id = $this->id ?: 'toast-' . uniqid();
    }

    /**
     * Determine if toast should auto-hide based on configuration
     */
    public function shouldAutoHide(): bool
    {
        return $this->autoHide && !$this->persistent && $this->timeout > 0;
    }

    /**
     * Get the icon for this toast variant
     */
    public function getVariantIcon(): string
    {
        if (!empty($this->icon)) {
            return $this->icon;
        }

        return match ($this->variant) {
            'success' => 'heroicon-o-check-circle',
            'warning' => 'heroicon-o-exclamation-triangle',
            'danger' => 'heroicon-o-x-circle',
            'info' => 'heroicon-o-information-circle',
            'neutral' => 'heroicon-o-chat-bubble-left',
            default => 'heroicon-o-information-circle'
        };
    }

    /**
     * Generate comprehensive data attributes for CSS and JavaScript targeting
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-toast' => 'true',
            'data-variant' => $this->variant,
            'data-position' => $this->position,
            'data-element-type' => 'dialog',
        ];

        
        $conditionalAttributes = [
            'data-dismissible' => $this->dismissible,
            'data-auto-hide' => $this->shouldAutoHide(),
            'data-persistent' => $this->persistent,
            'data-has-title' => !empty($this->title),
            'data-has-icon' => !empty($this->getVariantIcon()),
        ];

        foreach ($conditionalAttributes as $key => $condition) {
            if ($condition) {
                $attributes[$key] = 'true';
            }
        }

        
        if ($this->shouldAutoHide()) {
            $attributes['data-timeout'] = (string) $this->timeout;
        }

        
        if (!empty($this->getVariantIcon())) {
            $attributes['data-icon'] = $this->getVariantIcon();
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.toast', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
