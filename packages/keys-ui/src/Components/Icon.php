<?php

namespace Keys\UI\Components;

use Illuminate\Support\Facades\File;
use Illuminate\View\Component;

class Icon extends Component
{
    private const VALID_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

    public function __construct(
        public string $name,
        public string $size = 'md',
        public ?string $fallback = 'heroicon-o-question-mark-circle'
    ) {
        if (!in_array($this->size, self::VALID_SIZES)) {
            $this->size = 'md';
        }
    }

    public function iconName(): string
    {
        if ($this->isBladeComponentIcon()) {
            return 'keys::' . $this->name;
        }

        if ($this->isCustomIcon()) {
            return $this->name;
        }

        if ($this->isHeroicon()) {
            return $this->name;
        }

        return $this->fallback ?? 'heroicon-o-question-mark-circle';
    }

    public function iconExists(): bool
    {
        if ($this->isBladeComponentIcon()) {
            return $this->bladeComponentIconExists();
        }

        if ($this->isCustomIcon()) {
            return $this->customIconExists();
        }

        if ($this->isHeroicon()) {
            return true;
        }

        return false;
    }

    protected function isBladeComponentIcon(): bool
    {
        return str_starts_with($this->name, 'icons.');
    }

    protected function isCustomIcon(): bool
    {
        return !str_starts_with($this->name, 'heroicon-') && !str_starts_with($this->name, 'icons.');
    }

    protected function isHeroicon(): bool
    {
        return str_starts_with($this->name, 'heroicon-');
    }

    protected function bladeComponentIconExists(): bool
    {
        $iconName = str_replace('icons.', '', $this->name);
        $iconPath = __DIR__ . "/../resources/views/components/icons/{$iconName}.blade.php";
        return File::exists($iconPath);
    }

    protected function customIconExists(): bool
    {
        $iconPath = resource_path("icons/{$this->name}.svg");
        return File::exists($iconPath);
    }

    public function getDataAttributes(): array
    {
        $iconType = 'custom';
        if ($this->isHeroicon()) {
            $iconType = 'heroicon';
        } elseif ($this->isBladeComponentIcon()) {
            $iconType = 'blade-component';
        }

        $attributes = [
            'data-keys-icon' => 'true',
            'data-size' => $this->size,
            'data-icon-type' => $iconType,
        ];

        if ($this->isBladeComponentIcon()) {
            $attributes['data-blade-component-icon'] = 'true';
            $attributes['data-blade-component-name'] = $this->name;
        } elseif ($this->isCustomIcon()) {
            $attributes['data-custom-icon'] = 'true';
            $attributes['data-custom-name'] = $this->name;
        }

        if (!$this->iconExists()) {
            $attributes['data-fallback'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.icon', [
            'dataAttributes' => $this->getDataAttributes(),
            'iconExists' => $this->iconExists(),
            'iconName' => $this->iconName(),
        ]);
    }
}
