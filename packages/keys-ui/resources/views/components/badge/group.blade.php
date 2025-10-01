@php

    $sizeInheritanceStyles = '';
    if(isset($size) && $size) {
        $sizeInheritanceStyles = "--badge-group-size: {$size};";
    }
@endphp

<div {{ $attributes->merge($dataAttributes)->merge(['style' => $sizeInheritanceStyles]) }}>
    
    @if($label)
        <div class="text-sm font-medium text-foreground mb-2">
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