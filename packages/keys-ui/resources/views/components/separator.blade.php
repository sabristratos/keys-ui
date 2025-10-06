@php
    $slotContent = $slot->toHtml();
    $isIconOnly = $isIconOnly($slotContent);
    $hasContent = !empty(trim(strip_tags($slotContent))) || !empty($icon);

    $containerClasses = 'flex items-center';
    if ($orientation === 'vertical') {
        $containerClasses = 'flex flex-col justify-center';
    }

    if ($orientation === 'vertical') {
        $spacingClasses = match ($spacing) {
            'none' => 'h-0',
            'xs' => 'h-4',
            'sm' => 'h-6',
            'md' => 'h-8',
            'lg' => 'h-12',
            'xl' => 'h-16',
            default => 'h-8'
        };
    } else {
        $spacingClasses = match ($spacing) {
            'none' => 'my-0',
            'xs' => 'my-2',
            'sm' => 'my-3',
            'md' => 'my-4',
            'lg' => 'my-6',
            'xl' => 'my-8',
            default => 'my-4'
        };
    }

    $lineBaseClasses = $orientation === 'vertical' ? 'h-full' : 'flex-1';

    if ($orientation === 'vertical') {
        $lineSizeClasses = match ($size) {
            'xs' => 'border-l',
            'sm' => 'border-l-2',
            'md' => 'border-l-4',
            'lg' => 'border-l-8',
            default => 'border-l-2'
        };
    } else {
        $lineSizeClasses = match ($size) {
            'xs' => 'border-t',
            'sm' => 'border-t-2',
            'md' => 'border-t-4',
            'lg' => 'border-t-8',
            default => 'border-t-2'
        };
    }

    $lineColorClasses = match ($color) {
        'brand' => 'border-accent',
        'success' => 'border-success',
        'warning' => 'border-warning',
        'danger' => 'border-danger',
        'neutral' => 'border-line',
        'blue' => 'border-blue-500',
        'gray' => 'border-neutral-400',
        'red' => 'border-red-500',
        'green' => 'border-green-500',
        'yellow' => 'border-yellow-500',
        'indigo' => 'border-indigo-500',
        'purple' => 'border-purple-500',
        'pink' => 'border-pink-500',
        default => 'border-line'
    };

    if ($variant === 'dashed') {
        $lineClasses = $orientation === 'vertical'
            ? "$lineBaseClasses border-l border-dashed $lineSizeClasses $lineColorClasses"
            : "$lineBaseClasses border-t border-dashed $lineSizeClasses $lineColorClasses";
    } else {
        $lineClasses = $orientation === 'vertical'
            ? "$lineBaseClasses border-l $lineSizeClasses $lineColorClasses"
            : "$lineBaseClasses border-t $lineSizeClasses $lineColorClasses";
    }

    $gradientDirection = $orientation === 'vertical' ? 'bg-gradient-to-b' : 'bg-gradient-to-r';
    $gradientColors = match ($color) {
        'brand' => 'from-transparent via-accent to-transparent',
        'success' => 'from-transparent via-success to-transparent',
        'warning' => 'from-transparent via-warning to-transparent',
        'danger' => 'from-transparent via-danger to-transparent',
        'neutral' => 'from-transparent via-line to-transparent',
        'blue' => 'from-transparent via-blue-500 to-transparent',
        'gray' => 'from-transparent via-neutral-400 to-transparent',
        'red' => 'from-transparent via-red-500 to-transparent',
        'green' => 'from-transparent via-green-500 to-transparent',
        'yellow' => 'from-transparent via-yellow-500 to-transparent',
        'indigo' => 'from-transparent via-indigo-500 to-transparent',
        'purple' => 'from-transparent via-purple-500 to-transparent',
        'pink' => 'from-transparent via-pink-500 to-transparent',
        default => 'from-transparent via-line to-transparent'
    };

    if ($orientation === 'vertical') {
        $gradientSizeClasses = match ($size) {
            'xs' => 'w-px h-full',
            'sm' => 'w-0.5 h-full',
            'md' => 'w-1 h-full',
            'lg' => 'w-2 h-full',
            default => 'w-0.5 h-full'
        };
    } else {
        $gradientSizeClasses = match ($size) {
            'xs' => 'h-px w-full',
            'sm' => 'h-0.5 w-full',
            'md' => 'h-1 w-full',
            'lg' => 'h-2 w-full',
            default => 'h-0.5 w-full'
        };
    }
    $gradientClasses = "$gradientDirection $gradientColors $gradientSizeClasses";

    $contentSizeClasses = match ($size) {
        'xs' => 'text-xs px-2',
        'sm' => 'text-sm px-3',
        'md' => 'text-base px-4',
        'lg' => 'text-lg px-5',
        default => 'text-sm px-3'
    };
    $contentClasses = "bg-base px-3 text-muted $contentSizeClasses";

    $iconSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'sm',
        'md' => 'md',
        'lg' => 'lg',
        default => 'sm'
    };

    $iconColorClasses = match ($color) {
        'brand' => 'text-accent',
        'success' => 'text-success',
        'warning' => 'text-warning',
        'danger' => 'text-danger',
        'neutral' => 'text-muted',
        'blue' => 'text-blue-500',
        'gray' => 'text-neutral-400',
        'red' => 'text-red-500',
        'green' => 'text-green-500',
        'yellow' => 'text-yellow-500',
        'indigo' => 'text-indigo-500',
        'purple' => 'text-purple-500',
        'pink' => 'text-pink-500',
        default => 'text-muted'
    };

    if ($orientation === 'vertical') {
        $justifyClasses = match ($alignment) {
            'left' => 'justify-start',
            'center' => 'justify-center',
            'right' => 'justify-end',
            default => 'justify-center'
        };
    } else {
        $justifyClasses = 'justify-center';
    }
@endphp

<div {{ $attributes->merge(['class' => "$containerClasses $spacingClasses"])->merge($dataAttributes) }}
     role="separator"
     @if($orientation === 'vertical') aria-orientation="vertical" @endif>

    @if($variant === 'gradient')
        
        <div class="{{ $gradientClasses }}"></div>

    @elseif($variant === 'line' || $variant === 'dashed')
        
        <div class="{{ $lineClasses }}"></div>

    @elseif(($variant === 'text' || $variant === 'icon') && $hasContent)
        
        @if($orientation === 'horizontal')
            <div class="{{ $lineClasses }}"></div>
            <div class="{{ $contentClasses }} {{ $justifyClasses }}">
                @if($variant === 'icon' && $icon)
                    <x-keys::icon :name="$icon" :size="$iconSize" class="{{ $iconColorClasses }}" />
                @elseif($variant === 'text' && !$isIconOnly)
                    {{ $slot }}
                @endif
            </div>
            <div class="{{ $lineClasses }}"></div>
        @else
            
            <div class="{{ $lineClasses }}"></div>
            <div class="{{ $contentClasses }} {{ $justifyClasses }} py-2">
                @if($variant === 'icon' && $icon)
                    <x-keys::icon :name="$icon" :size="$iconSize" class="{{ $iconColorClasses }}" />
                @elseif($variant === 'text' && !$isIconOnly)
                    <span class="writing-mode-vertical-rl text-orientation-mixed">{{ $slot }}</span>
                @endif
            </div>
            <div class="{{ $lineClasses }}"></div>
        @endif

    @else
        
        <div class="{{ $lineClasses }}"></div>
    @endif
</div>