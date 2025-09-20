<?php

namespace Keys\UI\Components\Table;

use Illuminate\View\Component;

class Loading extends Component
{
    public function __construct(
        public string $text = 'Loading...',
        public string $animation = 'spinner',
        public string $size = 'md',
        public int $colspan = 1
    ) {
    }

    public function getLoadingClasses(): string
    {
        $base = 'text-center py-8';
        $size = $this->getSizeClasses();

        return trim($base . ' ' . $size);
    }

    protected function getSizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'py-6',
            'md' => 'py-8',
            'lg' => 'py-12',
            default => 'py-8'
        };
    }

    public function getTextClasses(): string
    {
        $base = 'mt-3 text-muted';

        return match ($this->size) {
            'sm' => $base . ' text-xs',
            'md' => $base . ' text-sm',
            'lg' => $base . ' text-base',
            default => $base . ' text-sm'
        };
    }

    public function getLoadingIconSize(): string
    {
        return match ($this->size) {
            'sm' => 'sm',
            'md' => 'md',
            'lg' => 'lg',
            default => 'md'
        };
    }

    public function getComputedLoadingClasses(): string
    {
        return $this->getLoadingClasses();
    }

    public function getComputedTextClasses(): string
    {
        return $this->getTextClasses();
    }

    public function render()
    {
        return view('keys::components.table.loading', [
            'computedLoadingClasses' => $this->getComputedLoadingClasses(),
            'computedTextClasses' => $this->getComputedTextClasses(),
        ]);
    }
}