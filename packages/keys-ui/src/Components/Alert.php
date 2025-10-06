<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Alert Component
 *
 * A versatile alert component for displaying notifications, messages, and status updates.
 * Features semantic color variants, dismissible functionality, optional titles and icons,
 * and comprehensive accessibility support.
 */
class Alert extends Component
{

    /**
     * Create a new Alert component instance.
     *
     * @param  string  $variant  Alert variant (info, success, warning, danger, neutral, brand)
     * @param  string  $size  Size variant (sm, md, lg)
     * @param  string|null  $icon  Custom icon name (auto-detected from variant if not provided)
     * @param  string|null  $title  Optional alert title
     * @param  bool  $dismissible  Enable dismissible functionality
     * @param  string|null  $id  Alert ID (auto-generated for dismissible alerts)
     */
    public function __construct(
        public string $variant = 'info',
        public string $size = 'md',
        public ?string $icon = null,
        public ?string $title = null,
        public bool $dismissible = false,
        public ?string $id = null
    ) {
        $this->variant = ComponentConstants::validate($this->variant, ComponentConstants::CONTEXTUAL_VARIANTS, 'info');
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_SM_TO_LG, 'md');

        if ($this->icon && ! str_starts_with($this->icon, 'heroicon-')) {
            if (empty(trim($this->icon))) {
                $this->icon = null;
            }
        }

        if ($this->dismissible && ! $this->id) {
            $this->id = 'alert-'.uniqid();
        }
    }

    /**
     * Get the default icon for the current variant.
     * Provides semantic icons that match alert intent.
     */
    public function defaultIcon(): string
    {
        return match ($this->variant) {
            'info' => 'heroicon-o-information-circle',
            'success' => 'heroicon-o-check-circle',
            'warning' => 'heroicon-o-exclamation-triangle',
            'danger' => 'heroicon-o-x-circle',
            'neutral' => 'heroicon-o-chat-bubble-left-ellipsis',
            'brand' => 'heroicon-o-star',
            default => 'heroicon-o-information-circle'
        };
    }

    /**
     * Get the final icon name with fallback to default.
     */
    public function iconName(): string
    {
        return $this->icon ?? $this->defaultIcon();
    }

    /**
     * Check if the alert has a title.
     */
    public function hasTitle(): bool
    {
        return ! is_null($this->title)
            && is_string($this->title)
            && ! empty(trim($this->title))
            && trim($this->title) !== '';
    }

    /**
     * Check if the alert should display an icon.
     * Always returns true as alerts always show either custom or default icons.
     */
    public function hasIcon(): bool
    {
        return ! is_null($this->icon) || true;
    }

    /**
     * Generate comprehensive data attributes for CSS targeting and JavaScript functionality.
     * Includes component identification, variant, state, features, and dismissible functionality.
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-alert' => 'true',
            'data-variant' => $this->variant,
            'data-size' => $this->size,
        ];

        if ($this->dismissible) {
            $attributes['data-dismissible'] = 'true';
            if ($this->id) {
                $attributes['data-alert-id'] = $this->id;
            }
        }

        if ($this->hasIcon()) {
            $attributes['data-has-icon'] = 'true';
            $attributes['data-icon'] = $this->iconName();
        }

        if ($this->hasTitle()) {
            $attributes['data-has-title'] = 'true';
        }

        if (request()->has('actions') || ! empty(trim($this->slot ?? ''))) {
            $attributes['data-has-actions'] = 'true';
        }

        $iconSize = match ($this->size) {
            'sm' => 'sm',
            'md' => 'md',
            'lg' => 'lg',
            default => 'md'
        };
        $attributes['data-icon-size'] = $iconSize;

        return $attributes;
    }

    /**
     * Render the alert component view.
     */
    public function render()
    {
        return view('keys::components.alert', [
            'iconName' => $this->iconName(),
            'hasTitle' => $this->hasTitle(),
            'hasIcon' => $this->hasIcon(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
