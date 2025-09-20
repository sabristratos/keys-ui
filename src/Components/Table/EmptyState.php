<?php

namespace Keys\UI\Components\Table;

use Illuminate\View\Component;

class EmptyState extends Component
{
    public function __construct(
        public string $title = 'No data found',
        public string $description = 'There are no items to display.',
        public ?string $icon = 'heroicon-o-document-text',
        public ?string $actionText = null,
        public ?string $actionUrl = null,
        public string $variant = 'neutral',
        public string $size = 'md'
    ) {
    }

    public function getEmptyClasses(): string
    {
        $base = 'text-center py-12';
        $size = $this->getSizeClasses();

        return trim($base . ' ' . $size);
    }

    protected function getSizeClasses(): string
    {
        return match ($this->size) {
            'sm' => 'py-8',
            'md' => 'py-12',
            'lg' => 'py-16',
            default => 'py-12'
        };
    }

    public function getIconSize(): string
    {
        return match ($this->size) {
            'sm' => 'lg',
            'md' => 'xl',
            'lg' => '2xl',
            default => 'xl'
        };
    }

    public function getTitleClasses(): string
    {
        $base = 'font-medium text-foreground mb-2';

        return match ($this->size) {
            'sm' => $base . ' text-sm',
            'md' => $base . ' text-base',
            'lg' => $base . ' text-lg',
            default => $base . ' text-base'
        };
    }

    public function getDescriptionClasses(): string
    {
        $base = 'text-muted mb-4';

        return match ($this->size) {
            'sm' => $base . ' text-xs',
            'md' => $base . ' text-sm',
            'lg' => $base . ' text-base',
            default => $base . ' text-sm'
        };
    }

    public function getIconClasses(): string
    {
        $base = 'mx-auto mb-4';

        return match ($this->variant) {
            'success' => $base . ' text-success-400',
            'warning' => $base . ' text-warning-400',
            'danger' => $base . ' text-danger-400',
            'brand' => $base . ' text-brand-400',
            default => $base . ' text-neutral-400'
        };
    }

    public function hasAction(): bool
    {
        return !is_null($this->actionText) && !is_null($this->actionUrl);
    }

    public function getComputedEmptyClasses(): string
    {
        return $this->getEmptyClasses();
    }

    public function getComputedIconClasses(): string
    {
        return $this->getIconClasses();
    }

    public function getComputedTitleClasses(): string
    {
        return $this->getTitleClasses();
    }

    public function getComputedDescriptionClasses(): string
    {
        return $this->getDescriptionClasses();
    }

    public function render()
    {
        return view('keys::components.table.empty', [
            'computedEmptyClasses' => $this->getComputedEmptyClasses(),
            'computedIconClasses' => $this->getComputedIconClasses(),
            'computedTitleClasses' => $this->getComputedTitleClasses(),
            'computedDescriptionClasses' => $this->getComputedDescriptionClasses(),
        ]);
    }
}