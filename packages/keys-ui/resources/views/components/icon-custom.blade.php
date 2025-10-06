@php
    $sizeClasses = match ($size) {
        'xs' => 'w-3 h-3',
        'sm' => 'w-4 h-4',
        'md' => 'w-5 h-5',
        'lg' => 'w-6 h-6',
        'xl' => 'w-8 h-8',
        default => 'w-5 h-5'
    };

    // Read SVG content and inject attributes
    $svgContent = file_exists($iconPath) ? file_get_contents($iconPath) : null;

    // Build attributes string
    $attributesString = $attributes->class($sizeClasses)->merge($dataAttributes)->toHtml();
@endphp

@if($svgContent)
    {{-- Inject attributes into SVG tag --}}
    {!! preg_replace('/<svg/', '<svg ' . $attributesString, $svgContent, 1) !!}
@else
    {{-- Fallback if SVG file not found --}}
    <x-heroicon-o-question-mark-circle {{ $attributes->class($sizeClasses)->merge($dataAttributes) }} />
@endif
