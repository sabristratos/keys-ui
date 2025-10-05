<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Rating extends Component
{
    private const VALID_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

    public string $uniqueId;

    public function __construct(
        public ?string $name = null,
        public ?string $id = null,
        public int|float $value = 0,
        public int $max = 5,
        public bool $readonly = false,
        public bool $disabled = false,
        public bool $required = false,
        public string $icon = 'star',
        public ?string $iconFilled = null,
        public ?string $iconOutlined = null,
        public string $color = 'warning',
        public string $size = 'md',
        public ?string $label = null,
        public ?string $hint = null,
        public bool $optional = false,
        public string|array|Collection|null $errors = null,
        public bool $showErrors = true,
        public bool $allowHalf = false,
        public bool $showCount = false
    ) {
        
        $this->uniqueId = $this->id ?? $this->name ?? 'rating-'.uniqid();
        $this->id = $this->uniqueId;

        
        if (! $this->iconFilled) {
            $this->iconFilled = $this->getFilledIcon();
        }

        if (! $this->iconOutlined) {
            $this->iconOutlined = $this->getOutlinedIcon();
        }



        if (! in_array($this->size, self::VALID_SIZES)) {
            $this->size = 'md';
        }


        $this->value = max(0, min($this->max, $this->value));
    }

    public function getFilledIcon(): string
    {
        
        if (str_starts_with($this->icon, 'heroicon-')) {
            return str_replace('-o-', '-s-', $this->icon);
        }

        
        return "heroicon-s-{$this->icon}";
    }

    public function getOutlinedIcon(): string
    {
        
        if (str_starts_with($this->icon, 'heroicon-')) {
            return str_replace('-s-', '-o-', $this->icon);
        }

        
        return "heroicon-o-{$this->icon}";
    }

    public function isShorthand(): bool
    {
        return ! empty($this->label);
    }

    public function hasError(): bool
    {
        return $this->hasErrors();
    }

    public function hasErrors(): bool
    {
        if (is_null($this->errors)) {
            return false;
        }

        if (is_string($this->errors)) {
            return ! empty(trim($this->errors));
        }

        if (is_array($this->errors)) {
            return ! empty($this->errors);
        }

        if ($this->errors instanceof Collection) {
            return $this->errors->isNotEmpty();
        }

        return false;
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-rating' => 'true',
            'data-rating-id' => $this->uniqueId,
            'data-max' => (string) $this->max,
            'data-value' => (string) $this->value,
            'data-size' => $this->size,
            'data-color' => $this->color,
            'data-readonly' => $this->readonly ? 'true' : 'false',
            'data-disabled' => $this->disabled ? 'true' : 'false',
            'data-allow-half' => $this->allowHalf ? 'true' : 'false',
        ];

        if ($this->hasError()) {
            $attributes['data-error'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.rating', [
            'uniqueId' => $this->uniqueId,
            'dataAttributes' => $this->getDataAttributes(),
            'filledIcon' => $this->iconFilled,
            'outlinedIcon' => $this->iconOutlined,
        ]);
    }
}
