<?php

namespace Keys\UI\Components\Select;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Chip extends Component
{

    public function __construct(
        public string $value = '',
        public string $label = '',
        public string $size = 'sm',
        public string $color = 'blue',
        public bool $removable = true,
        public ?string $id = null
    ) {

        if (! $this->id) {
            $this->id = 'select-chip-'.uniqid();
        }


        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_XS_TO_MD, 'sm');
        $this->color = ComponentConstants::validate($this->color, ComponentConstants::COLORS_EXTENDED, 'blue');


        if (empty($this->label) && ! empty($this->value)) {
            $this->label = $this->value;
        }
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-select-chip' => 'true',
            'data-select-chip' => 'true',
            'data-chip-value' => $this->value,
            'data-size' => $this->size,
            'data-color' => $this->color,
        ];

        if ($this->removable) {
            $attributes['data-removable'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.select.chip', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
