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
    ) {}

    public function getIconSize(): string
    {
        return match ($this->size) {
            'sm' => 'lg',
            'md' => 'xl',
            'lg' => '2xl',
            default => 'xl'
        };
    }

    public function hasAction(): bool
    {
        return ! is_null($this->actionText) && ! is_null($this->actionUrl);
    }

    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-table-empty' => 'true',
            'data-variant' => $this->variant,
            'data-size' => $this->size,
        ];

        if ($this->hasAction()) {
            $attributes['data-has-action'] = 'true';
        }

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.table.empty', [
            'size' => $this->size,
            'variant' => $this->variant,
            'icon' => $this->icon,
            'title' => $this->title,
            'description' => $this->description,
            'actionText' => $this->actionText,
            'actionUrl' => $this->actionUrl,
            'iconSize' => $this->getIconSize(),
            'hasAction' => $this->hasAction(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
