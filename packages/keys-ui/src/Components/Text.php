<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Text extends Component
{
    private const VALID_ELEMENTS = ['p', 'span', 'div', 'label', 'small'];
    private const VALID_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
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
    private const VALID_WEIGHTS = ['light', 'normal', 'medium', 'semibold', 'bold'];
    private const VALID_ALIGNMENTS = ['', 'left', 'center', 'right', 'justify'];
    private const VALID_LEADING = ['tight', 'normal', 'relaxed', 'loose'];
    private const VALID_LINE_CLAMP = ['none', '1', '2', '3', '4', '5', '6'];

    public function __construct(
        public string $element = 'p',
        public string $size = 'md',
        public string $color = 'text',
        public string $weight = 'normal',
        public string $align = '',
        public string $leading = 'normal',
        public string $lineClamp = 'none',
        public bool $italic = false,
        public bool $underline = false,
        public bool $uppercase = false,
        public bool $lowercase = false,
        public bool $capitalize = false
    ) {
        // Validate element
        if (!in_array($this->element, self::VALID_ELEMENTS)) {
            $this->element = 'p';
        }

        // Validate size
        if (!in_array($this->size, self::VALID_SIZES)) {
            $this->size = 'md';
        }

        // Validate color
        if (!in_array($this->color, self::VALID_COLORS)) {
            $this->color = 'text';
        }

        // Validate weight
        if (!in_array($this->weight, self::VALID_WEIGHTS)) {
            $this->weight = 'normal';
        }

        // Validate alignment
        if (!in_array($this->align, self::VALID_ALIGNMENTS)) {
            $this->align = '';
        }

        // Validate leading
        if (!in_array($this->leading, self::VALID_LEADING)) {
            $this->leading = 'normal';
        }

        // Validate line clamp
        if (!in_array($this->lineClamp, self::VALID_LINE_CLAMP)) {
            $this->lineClamp = 'none';
        }
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-text' => 'true',
            'data-element' => $this->element,
            'data-size' => $this->size,
            'data-color' => $this->color,
            'data-weight' => $this->weight,
        ];

        if ($this->lineClamp !== 'none') {
            $attributes['data-line-clamp'] = $this->lineClamp;
        }

        if ($this->italic) {
            $attributes['data-italic'] = 'true';
        }

        if ($this->underline) {
            $attributes['data-underline'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.text', [
            'element' => $this->element,
            'size' => $this->size,
            'color' => $this->color,
            'weight' => $this->weight,
            'align' => $this->align,
            'leading' => $this->leading,
            'lineClamp' => $this->lineClamp,
            'italic' => $this->italic,
            'underline' => $this->underline,
            'uppercase' => $this->uppercase,
            'lowercase' => $this->lowercase,
            'capitalize' => $this->capitalize,
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
