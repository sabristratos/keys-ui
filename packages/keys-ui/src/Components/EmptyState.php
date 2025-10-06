<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * EmptyState Component
 *
 * A flexible empty state component for displaying when no data is available.
 * Features semantic color variants, optional icons, titles, descriptions,
 * and action buttons for guiding users to the next step.
 */
class EmptyState extends Component
{

    /**
     * Create a new EmptyState component instance.
     *
     * @param  string  $title  Main heading for the empty state
     * @param  string  $description  Descriptive text explaining the empty state
     * @param  string|null  $icon  Icon name (heroicon format)
     * @param  string  $variant  Color variant (neutral, brand, success, warning, danger, info)
     * @param  string  $size  Size variant (sm, md, lg)
     * @param  string|null  $actionText  Text for the action button
     * @param  string|null  $actionUrl  URL for the action button
     * @param  string|null  $actionIcon  Icon for the action button
     */
    public function __construct(
        public string $title = 'No data found',
        public string $description = 'There are no items to display.',
        public ?string $icon = 'heroicon-o-document-text',
        public string $variant = 'neutral',
        public string $size = 'md',
        public ?string $actionText = null,
        public ?string $actionUrl = null,
        public ?string $actionIcon = null
    ) {
        $this->variant = ComponentConstants::validate($this->variant, ComponentConstants::CONTEXTUAL_VARIANTS, 'neutral');
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_SM_TO_LG, 'md');

        

        if ($this->icon && ! str_starts_with($this->icon, 'heroicon-')) {
            if (empty(trim($this->icon))) {
                $this->icon = null;
            }
        }
    }

    /**
     * Get the icon size based on the component size.
     */
    public function getIconSize(): string
    {
        return match ($this->size) {
            'sm' => 'lg',
            'md' => 'xl',
            'lg' => '2xl',
            default => 'xl'
        };
    }

    /**
     * Check if the empty state has an action button.
     */
    public function hasAction(): bool
    {
        return ! is_null($this->actionText) && ! is_null($this->actionUrl);
    }

    /**
     * Get the button size based on the component size.
     */
    public function getButtonSize(): string
    {
        return match ($this->size) {
            'sm' => 'sm',
            'md' => 'md',
            'lg' => 'md',
            default => 'md'
        };
    }

    /**
     * Get the button variant based on the component variant.
     */
    public function getButtonVariant(): string
    {
        return match ($this->variant) {
            'brand' => 'brand',
            'success' => 'success',
            'warning' => 'warning',
            'danger' => 'danger',
            'info' => 'info',
            default => 'brand'
        };
    }

    /**
     * Generate comprehensive data attributes for CSS targeting and JavaScript functionality.
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-empty-state' => 'true',
            'data-variant' => $this->variant,
            'data-size' => $this->size,
        ];

        if ($this->hasAction()) {
            $attributes['data-has-action'] = 'true';
        }

        if ($this->icon) {
            $attributes['data-has-icon'] = 'true';
            $attributes['data-icon'] = $this->icon;
        }

        return $attributes;
    }

    /**
     * Render the empty state component view.
     */
    public function render()
    {
        return view('keys::components.empty-state', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
