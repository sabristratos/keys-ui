<?php

namespace Keys\UI\Components\Menu;

use Illuminate\View\Component;

class Separator extends Component
{
    public function __construct(
        public string $variant = 'default',
        public ?string $label = null
    ) {

        if (!in_array($this->variant, ['default', 'labeled'])) {
            $this->variant = 'default';
        }


        if ($this->label && $this->variant === 'default') {
            $this->variant = 'labeled';
        }
    }

    public function separatorClasses(): string
    {
        if ($this->variant === 'labeled') {
            return 'flex items-center my-2';
        }

        return 'my-2 border-t border-border';
    }

    public function lineClasses(): string
    {
        return 'flex-1 border-t border-border';
    }

    public function labelClasses(): string
    {
        return 'px-3 text-xs font-medium text-muted uppercase tracking-wider';
    }

    public function getDataAttributes(): array
    {
        return [
            'data-menu-separator' => 'true',
            'data-variant' => $this->variant
        ];
    }

    public function hasLabel(): bool
    {
        return !empty($this->label);
    }

    public function isLabeled(): bool
    {
        return $this->variant === 'labeled';
    }

    public function render()
    {
        return view('keys::components.menu.separator', [
            'computedSeparatorClasses' => $this->separatorClasses(),
            'computedLineClasses' => $this->lineClasses(),
            'computedLabelClasses' => $this->labelClasses(),
            'computedDataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
