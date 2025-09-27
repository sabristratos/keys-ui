<?php

namespace Keys\UI\Components\Breadcrumbs;

use Illuminate\View\Component;

class Item extends Component
{
    public function __construct(
        public ?string $href = null,
        public ?string $icon = null,
        public string $separator = 'chevron',
        public bool $truncate = false,
        public ?string $maxWidth = null
    ) {
        if (! in_array($this->separator, ['chevron', 'slash', 'none'])) {
            $this->separator = 'chevron';
        }
    }

    public function isLink(): bool
    {
        return ! empty($this->href);
    }

    public function hasIcon(): bool
    {
        return ! empty($this->icon);
    }

    public function isIconOnly(string $slotContent = ''): bool
    {
        return $this->hasIcon() && empty(trim(strip_tags($slotContent)));
    }

    public function getSeparatorIcon(): ?string
    {
        return match ($this->separator) {
            'chevron' => 'heroicon-o-chevron-right',
            'slash' => null,
            'none' => null,
            default => 'heroicon-o-chevron-right'
        };
    }

    public function getSeparatorText(): string
    {
        return match ($this->separator) {
            'slash' => '/',
            default => ''
        };
    }

    public function showSeparator(): bool
    {
        return $this->separator !== 'none';
    }

    public function getDataAttributes(): array
    {
        return [
            'data-keys-breadcrumb-item' => 'true',
            'data-separator' => $this->separator,
            'data-is-link' => $this->isLink() ? 'true' : 'false',
            'data-has-icon' => $this->hasIcon() ? 'true' : 'false',
            'data-truncate' => $this->truncate ? 'true' : 'false',
        ];
    }

    public function render()
    {
        return view('keys::components.breadcrumbs.item', [
            'dataAttributes' => $this->getDataAttributes(),
            'separatorIcon' => $this->getSeparatorIcon(),
            'separatorText' => $this->getSeparatorText(),
        ]);
    }
}
