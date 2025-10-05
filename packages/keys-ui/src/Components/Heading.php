<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Heading extends Component
{
    private const VALID_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    private const VALID_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
    private const VALID_COLORS = [
        'heading',   // --color-heading
        'text',      // --color-text
        'muted',     // --color-muted
        'brand',
        'success',
        'warning',
        'danger',
        'info',
    ];
    private const VALID_WEIGHTS = ['normal', 'medium', 'semibold', 'bold', 'extrabold'];
    private const VALID_TRACKING = ['tighter', 'tight', 'normal', 'wide', 'wider'];

    public function __construct(
        public string $level = 'h2',
        public ?string $size = null,
        public string $color = 'heading',
        public string $weight = 'semibold',
        public string $tracking = 'normal',
        public bool $underline = false,
        public bool $gradient = false
    ) {
        // Validate level
        if (!in_array($this->level, self::VALID_LEVELS)) {
            $this->level = 'h2';
        }

        // If size is null, auto-map from level
        if ($this->size === null) {
            $this->size = $this->getDefaultSizeForLevel($this->level);
        }

        // Validate size
        if (!in_array($this->size, self::VALID_SIZES)) {
            $this->size = 'lg';
        }

        // Validate color
        if (!in_array($this->color, self::VALID_COLORS)) {
            $this->color = 'heading';
        }

        // Validate weight
        if (!in_array($this->weight, self::VALID_WEIGHTS)) {
            $this->weight = 'semibold';
        }

        // Validate tracking
        if (!in_array($this->tracking, self::VALID_TRACKING)) {
            $this->tracking = 'normal';
        }
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
