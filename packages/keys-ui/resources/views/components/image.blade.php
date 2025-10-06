@php

    $baseClasses = 'relative overflow-hidden';
    $sizeClasses = match ($size) {
        'xs' => 'w-16 h-16',
        'sm' => 'w-24 h-24',
        'md' => 'w-32 h-32',
        'lg' => 'w-48 h-48',
        'xl' => 'w-64 h-64',
        'full' => 'w-full h-auto',
        default => 'w-full h-auto'
    };

    $aspectClasses = '';
    if ($size === 'full') {
        $aspectClasses = match ($aspectRatio) {
            'square' => 'aspect-square',
            'video' => 'aspect-video',
            'photo' => 'aspect-[4/3]',
            'wide' => 'aspect-[21/9]',
            'auto' => '',
            default => ''
        };
    }

    $radiusClasses = match ($radius) {
        'sm' => 'rounded-sm',
        'md' => 'rounded-md',
        'lg' => 'rounded-lg',
        'xl' => 'rounded-xl',
        'full' => 'rounded-full',
        'none' => '',
        default => ''
    };

    $containerClasses = trim("$baseClasses $sizeClasses $aspectClasses $radiusClasses");

    $imageBaseClasses = 'absolute inset-0 w-full h-full';
    $objectFitClasses = match ($objectFit) {
        'cover' => 'object-cover',
        'contain' => 'object-contain',
        'fill' => 'object-fill',
        'scale-down' => 'object-scale-down',
        'none' => 'object-none',
        default => 'object-cover'
    };
    $imageClasses = trim("$imageBaseClasses $objectFitClasses $radiusClasses");

    $overlayClasses = '';
    if ($hasOverlay()) {
        $overlayBase = 'absolute inset-0 flex items-end justify-start p-6 text-white';

        $overlayBg = match ($overlay) {
            'gradient-top' => match ($overlayColor) {
                'black' => "bg-gradient-to-b from-black/{$overlayOpacity} to-transparent",
                'white' => "bg-gradient-to-b from-white/{$overlayOpacity} to-transparent",
                'brand' => "bg-gradient-to-b from-blue-600/{$overlayOpacity} to-transparent",
                'success' => "bg-gradient-to-b from-emerald-600/{$overlayOpacity} to-transparent",
                'warning' => "bg-gradient-to-b from-amber-500/{$overlayOpacity} to-transparent",
                'danger' => "bg-gradient-to-b from-red-600/{$overlayOpacity} to-transparent",
                'neutral' => "bg-gradient-to-b from-gray-600/{$overlayOpacity} to-transparent",
                default => "bg-gradient-to-b from-black/{$overlayOpacity} to-transparent"
            },
            'gradient-bottom' => match ($overlayColor) {
                'black' => "bg-gradient-to-t from-black/{$overlayOpacity} to-transparent",
                'white' => "bg-gradient-to-t from-white/{$overlayOpacity} to-transparent",
                'brand' => "bg-gradient-to-t from-blue-600/{$overlayOpacity} to-transparent",
                'success' => "bg-gradient-to-t from-emerald-600/{$overlayOpacity} to-transparent",
                'warning' => "bg-gradient-to-t from-amber-500/{$overlayOpacity} to-transparent",
                'danger' => "bg-gradient-to-t from-red-600/{$overlayOpacity} to-transparent",
                'neutral' => "bg-gradient-to-t from-gray-600/{$overlayOpacity} to-transparent",
                default => "bg-gradient-to-t from-black/{$overlayOpacity} to-transparent"
            },
            'solid' => match ($overlayColor) {
                'black' => "bg-black/{$overlayOpacity}",
                'white' => "bg-white/{$overlayOpacity}",
                'brand' => "bg-blue-600/{$overlayOpacity}",
                'success' => "bg-emerald-600/{$overlayOpacity}",
                'warning' => "bg-amber-500/{$overlayOpacity}",
                'danger' => "bg-red-600/{$overlayOpacity}",
                'neutral' => "bg-gray-600/{$overlayOpacity}",
                default => "bg-black/{$overlayOpacity}"
            },
            default => ''
        };

        $overlayClasses = trim("$overlayBase $overlayBg");
    }

    $fallbackClasses = 'absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400';

    $figureClasses = $hasCaption() ? "relative $radiusClasses" : $containerClasses;

    $lightboxAttributes = $lightbox ? [
        'data-lightbox-container' => 'true',
        'data-lightbox-image' => 'true',
        'data-lightbox-trigger' => $imageId,
        'role' => 'button',
        'tabindex' => '0',
        'aria-label' => 'View ' . $alt . ' in lightbox',
        'style' => 'cursor: pointer;'
    ] : [];
@endphp

@if($hasCaption())
    <figure {{ $attributes->merge(['class' => $figureClasses])->merge($lightboxAttributes)->merge($dataAttributes) }}>
        <div class="{{ $containerClasses }}">
            @if($hasImage())
                
                <img
                    id="{{ $imageId }}"
                    src="{{ $src }}"
                    alt="{{ $alt }}"
                    class="{{ $imageClasses }}"
                    @if($lazy) loading="lazy" @endif
                    @if($placeholder) style="background: {{ $placeholder }};" @endif
                    @if($lightbox)
                        data-filename="{{ basename($src) }}"
                        data-filetype="image"
                    @endif
                />

                
                <div data-image-fallback="true" style="display: none;" class="{{ $fallbackClasses }} {{ $radiusClasses }}">
                    @if($isSmallSize())
                        
                        <x-keys::icon :name="$fallbackIcon" :size="$getFallbackIconSize()" class="opacity-50" />
                    @else
                        
                        <div class="flex flex-col items-center justify-center space-y-2">
                            <x-keys::icon :name="$fallbackIcon" :size="$getFallbackIconSize()" class="opacity-50" />
                            <span class="text-xs text-center opacity-75">Image unavailable</span>
                        </div>
                    @endif
                </div>
            @else
                
                <div class="{{ $fallbackClasses }} {{ $radiusClasses }}">
                    @if($isSmallSize())
                        
                        <x-keys::icon :name="$fallbackIcon" :size="$getFallbackIconSize()" class="opacity-50" />
                    @else
                        
                        <div class="flex flex-col items-center justify-center space-y-2">
                            <x-keys::icon :name="$fallbackIcon" :size="$getFallbackIconSize()" class="opacity-50" />
                            <span class="text-xs text-center opacity-75">No image provided</span>
                        </div>
                    @endif
                </div>
            @endif

            @if($hasOverlay())
                <div class="{{ $overlayClasses }}" data-image-overlay>
                    {{ $slot }}
                </div>
            @endif
        </div>

        <figcaption class="mt-2 text-sm text-muted">
            {{ $caption }}
        </figcaption>
    </figure>
@else
    <div {{ $attributes->merge(['class' => $containerClasses])->merge($lightboxAttributes)->merge($dataAttributes) }}>
        @if($hasImage())
            
            <img
                id="{{ $imageId }}"
                src="{{ $src }}"
                alt="{{ $alt }}"
                class="{{ $imageClasses }}"
                @if($lazy) loading="lazy" @endif
                @if($placeholder) style="background: {{ $placeholder }};" @endif
                @if($lightbox)
                    data-filename="{{ basename($src) }}"
                    data-filetype="image"
                @endif
            />

            
            <div data-image-fallback="true" style="display: none;" class="{{ $fallbackClasses }} {{ $radiusClasses }}">
                @if($isSmallSize())
                    
                    <x-keys::icon :name="$fallbackIcon" :size="$getFallbackIconSize()" class="opacity-50" />
                @else
                    
                    <div class="flex flex-col items-center justify-center space-y-2">
                        <x-keys::icon :name="$fallbackIcon" :size="$getFallbackIconSize()" class="opacity-50" />
                        <span class="text-xs text-center opacity-75">Image unavailable</span>
                    </div>
                @endif
            </div>
        @else
            
            <div class="{{ $fallbackClasses }} {{ $radiusClasses }}">
                @if($isSmallSize())
                    
                    <x-keys::icon :name="$fallbackIcon" :size="$getFallbackIconSize()" class="opacity-50" />
                @else
                    
                    <div class="flex flex-col items-center justify-center space-y-2">
                        <x-keys::icon :name="$fallbackIcon" :size="$getFallbackIconSize()" class="opacity-50" />
                        <span class="text-xs text-center opacity-75">No image provided</span>
                    </div>
                @endif
            </div>
        @endif

        @if($hasOverlay())
            <div class="{{ $overlayClasses }}" data-image-overlay>
                {{ $slot }}
            </div>
        @endif
    </div>
@endif

