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
        // Auto-generate ID if not provided
        if (! $this->id) {
            $this->id = 'select-chip-'.uniqid();
        }

        // Validate size
        if (! in_array($this->size, ComponentConstants::BADGE_SIZES)) {
            $this->size = 'sm';
        }

        // Validate color - use same colors as Badge component
        if (! ComponentConstants::isValidColorForComponent($this->color, 'badge')) {
            $this->color = 'blue';
        }

        // Use label as value fallback
        if (empty($this->label) && ! empty($this->value)) {
            $this->label = $this->value;
        }
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'xs' => 'px-1.5 py-0.5 text-xs',
            'sm' => 'px-2.5 py-0.5 text-xs',
            'md' => 'px-3 py-1 text-sm',
            default => 'px-2.5 py-0.5 text-xs'
        };
    }

    public function colorClasses(): string
    {
        return match ($this->color) {
            'brand' => 'bg-brand text-white',
            'success' => 'bg-success text-white',
            'warning' => 'bg-warning text-white',
            'danger' => 'bg-danger text-white',
            'neutral' => 'bg-neutral text-white',
            'blue' => 'bg-blue-600 text-white',
            'gray' => 'bg-neutral-600 text-white',
            'red' => 'bg-red-600 text-white',
            'green' => 'bg-green-600 text-white',
            'yellow' => 'bg-yellow-600 text-white',
            'indigo' => 'bg-indigo-600 text-white',
            'purple' => 'bg-purple-600 text-white',
            'pink' => 'bg-pink-600 text-white',
            'dark' => 'bg-neutral-900 text-white',
            default => 'bg-blue-600 text-white'
        };
    }

    public function chipClasses(): string
    {
        $baseClasses = 'inline-flex items-center font-medium rounded-sm';
        $sizeClasses = $this->sizeClasses();
        $colorClasses = $this->colorClasses();

        if ($this->removable) {
            $baseClasses .= ' justify-between';
        }

        return trim("{$baseClasses} {$sizeClasses} {$colorClasses}");
    }

    public function removeButtonSize(): string
    {
        return match ($this->size) {
            'xs' => 'xs',
            'sm' => 'xs',
            'md' => 'sm',
            default => 'xs'
        };
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
