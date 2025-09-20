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

        if (!in_array($this->separator, ['chevron', 'slash', 'none'])) {
            $this->separator = 'chevron';
        }
    }

    public function isLink(): bool
    {
        return !empty($this->href);
    }

    public function hasIcon(): bool
    {
        return !empty($this->icon);
    }

    public function isIconOnly(string $slotContent = ''): bool
    {
        return $this->hasIcon() && empty(trim(strip_tags($slotContent)));
    }

    public function itemClasses(): string
    {
        return 'flex items-center';
    }

    public function linkClasses(): string
    {
        $base = 'inline-flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 rounded-sm min-w-0 whitespace-nowrap';

        if ($this->truncate) {
            $base .= ' max-w-32 sm:max-w-48 md:max-w-64';
        }

        if ($this->maxWidth) {
            $base .= ' ' . $this->maxWidth;
        }

        if ($this->isLink()) {
            return $base . ' text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100';
        }

        return $base . ' text-neutral-900 dark:text-neutral-100 font-medium';
    }

    public function textClasses(): string
    {
        if ($this->truncate) {
            return 'truncate';
        }

        return '';
    }

    public function separatorClasses(): string
    {
        return 'flex items-center mx-2 text-neutral-600 dark:text-neutral-400';
    }

    public function iconWrapperClasses(): string
    {
        return 'inline-flex items-center';
    }

    public function getSeparatorIcon(): ?string
    {
        return match ($this->separator) {
            'chevron' => 'heroicon-o-chevron-right',
            'slash' => null, // We'll use text for slash
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

    public function getComputedItemClasses(): string
    {
        return $this->itemClasses();
    }

    public function getComputedLinkClasses(): string
    {
        return $this->linkClasses();
    }

    public function getComputedSeparatorClasses(): string
    {
        return $this->separatorClasses();
    }

    public function getComputedIconWrapperClasses(): string
    {
        return $this->iconWrapperClasses();
    }

    public function getComputedTextClasses(): string
    {
        return $this->textClasses();
    }

    public function render()
    {
        return view('keys::components.breadcrumbs.item', [
            'computedItemClasses' => $this->getComputedItemClasses(),
            'computedLinkClasses' => $this->getComputedLinkClasses(),
            'computedSeparatorClasses' => $this->getComputedSeparatorClasses(),
            'computedIconWrapperClasses' => $this->getComputedIconWrapperClasses(),
            'computedTextClasses' => $this->getComputedTextClasses(),
            'separatorIcon' => $this->getSeparatorIcon(),
            'separatorText' => $this->getSeparatorText(),
        ]);
    }
}
