<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Text extends Component
{

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
        $this->element = ComponentConstants::validate($this->element, ComponentConstants::TEXT_ELEMENTS, 'p');
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_TYPOGRAPHY, 'md');
        $this->color = ComponentConstants::validate($this->color, ComponentConstants::TEXT_COLORS, 'text');
        $this->weight = ComponentConstants::validate($this->weight, ComponentConstants::FONT_WEIGHTS, 'normal');
        $this->align = ComponentConstants::validate($this->align, ComponentConstants::TEXT_ALIGNMENTS, '');
        $this->leading = ComponentConstants::validate($this->leading, ComponentConstants::LINE_HEIGHT, 'normal');
        $this->lineClamp = ComponentConstants::validate($this->lineClamp, ComponentConstants::LINE_CLAMP, 'none');
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
