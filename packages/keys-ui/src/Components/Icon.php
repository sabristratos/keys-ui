<?php

namespace Keys\UI\Components;

use Illuminate\Support\Facades\File;
use Illuminate\View\Component;

class Icon extends Component
{
    public function __construct(
        public string $name,
        public string $size = 'md',
        public ?string $fallback = 'heroicon-o-question-mark-circle'
    ) {
        if (!in_array($this->size, ['xs', 'sm', 'md', 'lg', 'xl'])) {
            $this->size = 'md';
        }
    }

    public function sizeClasses(): string
    {
        return match ($this->size) {
            'xs' => 'w-3 h-3',
            'sm' => 'w-4 h-4',
            'md' => 'w-5 h-5',
            'lg' => 'w-6 h-6',
            'xl' => 'w-8 h-8',
            default => 'w-5 h-5'
        };
    }

    public function iconName(): string
    {
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
        if ($this->isCustomIcon()) {
            return $this->customIconExists();
        }

        if ($this->isHeroicon()) {
            return true;
        }

        return false;
    }

    protected function isCustomIcon(): bool
    {
        return !str_starts_with($this->name, 'heroicon-');
    }

    protected function isHeroicon(): bool
    {
        return str_starts_with($this->name, 'heroicon-');
    }

    protected function customIconExists(): bool
    {
        $iconPath = resource_path("icons/{$this->name}.svg");
        return File::exists($iconPath);
    }

    public function render()
    {
        return view('keys::components.icon');
    }
}
