<?php

namespace Keys\UI\Concerns;

trait HasRTLSupport
{
    /**
     * Get logical class name for directional properties
     */
    protected function getLogicalClass(string $property, string $value): string
    {
        $logicalMap = [
            // Margin classes
            'ml' => 'ms',  // margin-left -> margin-start
            'mr' => 'me',  // margin-right -> margin-end

            // Padding classes
            'pl' => 'ps',  // padding-left -> padding-start
            'pr' => 'pe',  // padding-right -> padding-end

            // Border classes
            'border-l' => 'border-s',  // border-left -> border-start
            'border-r' => 'border-e',  // border-right -> border-end

            // Positioning classes
            'left' => 'start',
            'right' => 'end',

            // Border radius classes
            'rounded-l' => 'rounded-s',
            'rounded-r' => 'rounded-e',
            'rounded-tl' => 'rounded-ss',
            'rounded-tr' => 'rounded-se',
            'rounded-bl' => 'rounded-es',
            'rounded-br' => 'rounded-ee',

            // Text alignment
            'text-left' => 'text-start',
            'text-right' => 'text-end',
        ];

        return isset($logicalMap[$property])
            ? "{$logicalMap[$property]}-{$value}"
            : "{$property}-{$value}";
    }

    /**
     * Convert directional classes to logical equivalents
     */
    protected function convertToLogicalClasses(string $classes): string
    {
        $patterns = [
            // Match margin/padding classes like ml-4, mr-2, etc.
            '/\b(ml|mr|pl|pr)-([a-zA-Z0-9.\[\]\/%-]+)\b/',
            // Match positioning classes like left-4, right-2, etc.
            '/\b(left|right)-([a-zA-Z0-9.\[\]\/%-]+)\b/',
            // Match border classes
            '/\b(border-l|border-r)-([a-zA-Z0-9.\[\]\/%-]+)\b/',
            // Match rounded classes
            '/\b(rounded-[lr]|rounded-[tb][lr])-([a-zA-Z0-9.\[\]\/%-]+)\b/',
            // Match text alignment
            '/\b(text-left|text-right)\b/',
        ];

        foreach ($patterns as $pattern) {
            $classes = preg_replace_callback($pattern, function ($matches) {
                $property = $matches[1];
                $value = $matches[2] ?? '';
                return $this->getLogicalClass($property, $value);
            }, $classes);
        }

        return $classes;
    }

    /**
     * Get RTL-aware icon positioning classes
     */
    protected function getRTLIconPosition(string $position, string $size = 'md'): array
    {
        $offsets = match ($size) {
            'sm' => ['start' => 'start-2.5', 'end' => 'end-2.5'],
            'md' => ['start' => 'start-3', 'end' => 'end-3'],
            'lg' => ['start' => 'start-3.5', 'end' => 'end-3.5'],
            default => ['start' => 'start-3', 'end' => 'end-3']
        };

        return [
            'left' => $offsets['start'],
            'right' => $offsets['end']
        ];
    }

    /**
     * Get RTL-aware flex direction classes
     */
    protected function getRTLFlexDirection(string $direction = 'row'): string
    {
        return match ($direction) {
            'row' => 'flex-row', // Will be handled by CSS for RTL
            'row-reverse' => 'flex-row-reverse',
            'col' => 'flex-col',
            'col-reverse' => 'flex-col-reverse',
            default => 'flex-row'
        };
    }

    /**
     * Get RTL-aware justification classes
     */
    protected function getRTLJustification(string $justify = 'start'): string
    {
        return match ($justify) {
            'start' => 'justify-start', // CSS will handle RTL conversion
            'end' => 'justify-end',
            'center' => 'justify-center',
            'between' => 'justify-between',
            'around' => 'justify-around',
            'evenly' => 'justify-evenly',
            default => 'justify-start'
        };
    }

    /**
     * Get RTL-aware alignment classes
     */
    protected function getRTLAlignment(string $align = 'start'): string
    {
        return match ($align) {
            'start' => 'items-start',
            'end' => 'items-end',
            'center' => 'items-center',
            'baseline' => 'items-baseline',
            'stretch' => 'items-stretch',
            default => 'items-start'
        };
    }

    /**
     * Check if current locale suggests RTL direction
     */
    protected function isRTLLocale(): bool
    {
        $locale = app()->getLocale();

        // Common RTL language codes
        $rtlLocales = [
            'ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ug', 'yi',
            'arc', 'ckb', 'dv', 'ha', 'ji', 'ku', 'ks', 'ms',
            'nqo', 'pnb', 'prs', 'ug', 'uz'
        ];

        return in_array(substr($locale, 0, 2), $rtlLocales);
    }

    /**
     * Get direction attribute for HTML elements
     */
    protected function getDirectionAttribute(): string
    {
        return $this->isRTLLocale() ? 'rtl' : 'ltr';
    }

    /**
     * Get CSS classes that should be applied to containers for RTL support
     */
    protected function getRTLContainerClasses(): string
    {
        if ($this->isRTLLocale()) {
            return 'rtl';
        }

        return 'ltr';
    }
}