@php
    $spacingClasses = match ($spacing) {
        'tight' => match ($size ?? 'sm') {
            'xs' => 'gap-1',
            'sm' => 'gap-1.5',
            'md' => 'gap-2',
            default => 'gap-1.5'
        },
        'default' => match ($size ?? 'sm') {
            'xs' => 'gap-2',
            'sm' => 'gap-2.5',
            'md' => 'gap-3',
            default => 'gap-2.5'
        },
        'loose' => match ($size ?? 'sm') {
            'xs' => 'gap-3',
            'sm' => 'gap-4',
            'md' => 'gap-5',
            default => 'gap-4'
        },
        default => 'gap-2.5'
    };

    $layoutClasses = match ($orientation) {
        'horizontal' => $wrap ? 'flex flex-row flex-wrap' : 'flex flex-row',
        'vertical' => 'flex flex-col',
        default => 'flex flex-row flex-wrap'
    };

    $alignmentClasses = match ($align) {
        'start' => $orientation === 'vertical' ? 'items-start' : 'justify-start items-center',
        'center' => $orientation === 'vertical' ? 'items-center' : 'justify-center items-center',
        'end' => $orientation === 'vertical' ? 'items-end' : 'justify-end items-center',
        'justify' => $orientation === 'vertical' ? 'items-stretch' : 'justify-between items-center',
        default => 'justify-start items-center'
    };

    $badgeContainerClasses = trim("$layoutClasses $spacingClasses $alignmentClasses");

    if ($size) {
        $badgeContainerClasses .= " [&>[data-keys-badge]:not([data-size])]:badge-size-{$size}";
    }

    $sizeInheritanceStyles = '';
    if(isset($size) && $size) {
        $sizeInheritanceStyles = "--badge-group-size: {$size};";
    }
@endphp

<div {{ $attributes->merge($dataAttributes)->merge(['style' => $sizeInheritanceStyles]) }}>
    
    @if($label)
        <div class="text-sm font-medium text-primary mb-2">
            {{ $label }}
        </div>
    @endif

    
    <div class="{{ $badgeContainerClasses }}" data-badge-container="true">
        {{ $slot }}
        
    </div>

    
    @if($clearable)
        <div class="mt-2">
            <x-keys::button
                variant="ghost"
                size="xs"
                class="text-neutral-500 hover:text-danger"
                data-badge-group-action="clear-all"
            >
                <x-keys::icon name="heroicon-o-x-mark" size="xs" />
                Clear All
            </x-keys::button>
        </div>
    @endif
</div>