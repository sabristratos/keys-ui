<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Heading extends Component
{

    public function __construct(
        public string $level = 'h2',
        public ?string $size = null,
        public string $color = 'heading',
        public string $weight = 'semibold',
        public string $tracking = 'normal',
        public bool $underline = false,
        public bool $gradient = false
    ) {
        $this->level = ComponentConstants::validate($this->level, ComponentConstants::HEADING_LEVELS, 'h2');

        // If size is null, auto-map from level
        if ($this->size === null) {
            $this->size = $this->getDefaultSizeForLevel($this->level);
        }

        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_TYPOGRAPHY_EXTENDED, 'lg');
        $this->color = ComponentConstants::validate($this->color, ComponentConstants::TEXT_COLORS, 'heading');
        $this->weight = ComponentConstants::validate($this->weight, ComponentConstants::FONT_WEIGHTS_EXTENDED, 'semibold');
        $this->tracking = ComponentConstants::validate($this->tracking, ComponentConstants::LETTER_SPACING, 'normal');
    }

    /**
     * Get default size for a heading level (semantic defaults)
     */
    protected function getDefaultSizeForLevel(string $level): string
    {
        return match ($level) {
            'h1' => '4xl',
            'h2' => '3xl',
            'h3' => '2xl',
            'h4' => 'xl',
            'h5' => 'lg',
            'h6' => 'md',
            default => 'lg'
        };
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-heading' => 'true',
            'data-level' => $this->level,
            'data-size' => $this->size,
            'data-color' => $this->color,
            'data-weight' => $this->weight,
        ];

        if ($this->gradient) {
            $attributes['data-gradient'] = 'true';
        }

        if ($this->underline) {
            $attributes['data-underline'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.heading', [
            'level' => $this->level,
            'size' => $this->size,
            'color' => $this->color,
            'weight' => $this->weight,
            'tracking' => $this->tracking,
            'underline' => $this->underline,
            'gradient' => $this->gradient,
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
