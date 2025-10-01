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
            
            'ml' => 'ms',  
            'mr' => 'me',  

            
            'pl' => 'ps',  
            'pr' => 'pe',  

            
            'border-l' => 'border-s',  
            'border-r' => 'border-e',  

            
            'left' => 'start',
            'right' => 'end',

            
            'rounded-l' => 'rounded-s',
            'rounded-r' => 'rounded-e',
            'rounded-tl' => 'rounded-ss',
            'rounded-tr' => 'rounded-se',
            'rounded-bl' => 'rounded-es',
            'rounded-br' => 'rounded-ee',

            
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
            
            '/\b(ml|mr|pl|pr)-([a-zA-Z0-9.\[\]\/%-]+)\b/',
            
            '/\b(left|right)-([a-zA-Z0-9.\[\]\/%-]+)\b/',
            
            '/\b(border-l|border-r)-([a-zA-Z0-9.\[\]\/%-]+)\b/',
            
            '/\b(rounded-[lr]|rounded-[tb][lr])-([a-zA-Z0-9.\[\]\/%-]+)\b/',
            
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
            'row' => 'flex-row', 
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
            'start' => 'justify-start', 
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