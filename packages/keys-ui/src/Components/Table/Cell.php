<?php

namespace Keys\UI\Components\Table;

use Illuminate\View\Component;

class Cell extends Component
{
    public function __construct(
        public string $align = 'start',
        public string $variant = 'default',
        public string $size = 'md',
        public bool $wrap = true,
        public bool $truncate = false
    ) {
    }

    public function getCellClasses(): string
    {
        $base = 'whitespace-nowrap';
        $padding = $this->getPaddingClasses();
        $alignment = $this->getAlignmentClasses();
        $variant = $this->getVariantClasses();
        $text = $this->getTextClasses();

        return trim($base . ' ' . $padding . ' ' . $alignment . ' ' . $variant . ' ' . $text);
    }

    protected function getPaddingClasses(): string
    {
        return match ($this->size) {
            'sm' => 'px-3 py-2',
            'md' => 'px-6 py-4',
            'lg' => 'px-8 py-5',
            default => 'px-6 py-4'
        };
    }

    protected function getAlignmentClasses(): string
    {
        return match ($this->align) {
            'start' => 'text-left',
            'center' => 'text-center',
            'end' => 'text-right',
            default => 'text-left'
        };
    }

    protected function getVariantClasses(): string
    {
        return match ($this->variant) {
            'strong' => 'font-semibold text-foreground',
            'muted' => 'text-neutral-600 dark:text-neutral-400',
            'success' => 'text-success-600 dark:text-success-400',
            'danger' => 'text-danger-600 dark:text-danger-400',
            'warning' => 'text-warning-600 dark:text-warning-400',
            default => 'text-foreground'
        };
    }

    protected function getTextClasses(): string
    {
        $classes = '';

        if ($this->wrap) {
            $classes .= 'whitespace-normal ';
        } else {
            $classes .= 'whitespace-nowrap ';
        }

        if ($this->truncate) {
            $classes .= 'truncate ';
        }

        return trim($classes);
    }

    public function getComputedCellClasses(): string
    {
        return $this->getCellClasses();
    }

    public function render()
    {
        return view('keys::components.table.cell', [
            'computedCellClasses' => $this->getComputedCellClasses(),
        ]);
    }
}