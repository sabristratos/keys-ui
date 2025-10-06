@if($hasImages())
    @php
        $containerClasses = 'gallery-container relative';
        $typeClasses = "gallery-{$type}";
        $radiusClasses = match ($radius) {
            'sm' => 'rounded-sm',
            'md' => 'rounded-md',
            'lg' => 'rounded-lg',
            'xl' => 'rounded-xl',
            'full' => 'rounded-full',
            'none' => '',
            default => ''
        };
    @endphp

    <div
        {{ $attributes->merge(['class' => trim("$containerClasses $typeClasses $radiusClasses")])->merge($dataAttributes) }}
        role="region"
        aria-label="Image gallery with {{ count($images) }} images"
        aria-describedby="{{ $id }}-description"
        @if(!$isAlternativeLayout()) tabindex="0" @endif
    >
        
        @if($isAlternativeLayout())
            
            @if($layout === 'masonry')
                <div class="gallery-masonry-container">
                    @foreach($images as $index => $image)
                        <div class="gallery-masonry-item break-inside-avoid mb-4">
                            <img
                                src="{{ $image['src'] }}"
                                alt="{{ $image['alt'] }}"
                                class="w-full h-auto @if($radius === 'sm') rounded-sm @elseif($radius === 'md') rounded-md @elseif($radius === 'lg') rounded-lg @elseif($radius === 'xl') rounded-xl @elseif($radius === 'full') rounded-full @endif object-cover cursor-pointer"
                                loading="lazy"
                                data-gallery-image="{{ $index }}"
                                data-gallery-target="{{ $id }}"
                                @if($lightbox)
                                    data-lightbox-trigger="gallery-{{ $id }}-{{ $index }}"
                                    data-lightbox-group="{{ $id }}"
                                    data-filename="{{ basename($image['src']) }}"
                                    data-filetype="image"
                                    role="button"
                                    tabindex="0"
                                    aria-label="View {{ $image['alt'] }} in lightbox"
                                @endif
                            />
                            @if($image['caption'])
                                <p class="mt-2 text-sm text-muted">{{ $image['caption'] }}</p>
                            @endif
                        </div>
                    @endforeach
                </div>
            @endif

            
            @if($layout === 'grid')
                @php
                    $gridClasses = match ($gridColumns) {
                        1 => 'grid-cols-1',
                        2 => 'grid-cols-1 sm:grid-cols-2',
                        3 => 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                        4 => 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
                        5 => 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
                        6 => 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
                        default => 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    };
                @endphp

                <div class="gallery-grid-container grid gap-4 {{ $gridClasses }}">
                    @foreach($images as $index => $image)
                        <div class="gallery-grid-item flex flex-col">
                            <div class="flex-1 relative aspect-square">
                                <img
                                    src="{{ $image['src'] }}"
                                    alt="{{ $image['alt'] }}"
                                    class="absolute inset-0 w-full h-full @if($radius === 'sm') rounded-sm @elseif($radius === 'md') rounded-md @elseif($radius === 'lg') rounded-lg @elseif($radius === 'xl') rounded-xl @elseif($radius === 'full') rounded-full @endif object-cover cursor-pointer"
                                    loading="lazy"
                                    data-gallery-image="{{ $index }}"
                                    data-gallery-target="{{ $id }}"
                                    @if($lightbox)
                                        data-lightbox-trigger="gallery-{{ $id }}-{{ $index }}"
                                        data-lightbox-group="{{ $id }}"
                                        data-filename="{{ basename($image['src']) }}"
                                        data-filetype="image"
                                        role="button"
                                        tabindex="0"
                                        aria-label="View {{ $image['alt'] }} in lightbox"
                                    @endif
                                />
                            </div>
                            @if($image['caption'])
                                <p class="mt-2 text-sm text-muted px-1 line-clamp-2">{{ $image['caption'] }}</p>
                            @endif
                        </div>
                    @endforeach
                </div>
            @endif

        @else
        
        @php
            $galleryLayoutClasses = ($thumbnailPosition === 'side' && $shouldShowThumbnails())
                ? 'flex flex-row max-w-full'
                : 'flex flex-col';
        @endphp

        <div class="{{ $galleryLayoutClasses }}">
            
            <div class="gallery-main-container flex-1 min-w-0">
                
                @if($shouldShowThumbnails() && $thumbnailPosition === 'top')
                    <div class="{{ $thumbnailContainerClasses }}">
                        @foreach($images as $index => $image)
                            <div
                                class="{{ $thumbnailClasses }} {{ $thumbnailSizeClasses }} {{ $thumbnailRadius }} @if($index === 0) border-accent-500 @endif"
                                data-gallery-thumbnail="{{ $index }}"
                                data-gallery-target="{{ $id }}"
                                role="button"
                                tabindex="0"
                                aria-label="View image {{ $index + 1 }}: {{ $image['alt'] }}"
                                @if($index === 0) aria-current="true" @endif
                            >
                                <img
                                    src="{{ $image['thumbnail'] }}"
                                    alt="{{ $image['alt'] }}"
                                    class="absolute inset-0 w-full h-full object-cover {{ $radius === 'none' ? '' : 'rounded-sm' }}"
                                    loading="eager"
                                />
                            </div>
                        @endforeach
                    </div>
                @endif

                
                @php
                    $mainImageClasses = 'gallery-main relative overflow-hidden';

                    if ($aspectRatio === 'square') {
                        $aspectClasses = 'aspect-square';
                    } elseif ($aspectRatio === 'video') {
                        $aspectClasses = 'aspect-video';
                    } elseif ($aspectRatio === 'photo') {
                        $aspectClasses = 'aspect-[4/3]';
                    } elseif ($aspectRatio === 'wide') {
                        $aspectClasses = 'aspect-[21/9]';
                    } else {
                        $aspectClasses = '';
                    }

                    $mainImageRadius = match ($radius) {
                        'sm' => 'rounded-sm',
                        'md' => 'rounded-md',
                        'lg' => 'rounded-lg',
                        'xl' => 'rounded-xl',
                        'full' => 'rounded-full',
                        'none' => '',
                        default => ''
                    };
                @endphp

                <div class="{{ trim("$mainImageClasses $aspectClasses $mainImageRadius") }}">
                    
                    <div
                        class="gallery-scroll-container flex overflow-x-scroll scroll-smooth snap-x snap-mandatory scrollbar-hide"
                        data-gallery-scroll="{{ $id }}"
                        role="region"
                        aria-label="Image gallery carousel"
                        tabindex="0"
                    >
                        @foreach($images as $index => $image)
                            <div
                                class="gallery-slide flex-shrink-0 w-full h-full relative snap-center snap-always"
                                data-gallery-slide="{{ $index }}"
                                data-gallery-target="{{ $id }}"
                                id="{{ $id }}-slide-{{ $index }}"
                            >
                                <img
                                    src="{{ $image['src'] }}"
                                    alt="{{ $image['alt'] }}"
                                    class="w-full h-full @if($radius === 'sm') rounded-sm @elseif($radius === 'md') rounded-md @elseif($radius === 'lg') rounded-lg @elseif($radius === 'xl') rounded-xl @elseif($radius === 'full') rounded-full @endif object-cover cursor-pointer"
                                    loading="lazy"
                                    data-gallery-image="{{ $index }}"
                                    data-gallery-target="{{ $id }}"
                                    @if($lightbox)
                                        data-lightbox-trigger="gallery-{{ $id }}-{{ $index }}"
                                        data-lightbox-group="{{ $id }}"
                                        data-filename="{{ basename($image['src']) }}"
                                        data-filetype="image"
                                        role="button"
                                        tabindex="0"
                                        aria-label="View {{ $image['alt'] }} in lightbox"
                                    @endif
                                />
                                @if($image['caption'])
                                    <div class="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-2 rounded">
                                        <p class="text-sm">{{ $image['caption'] }}</p>
                                    </div>
                                @endif
                            </div>
                        @endforeach
                    </div>

                    
                    <div class="gallery-controls absolute bottom-4 right-4 flex items-center gap-2 z-[15]">
                        
                        @if(count($images) > 1 && in_array($type, ['basic', 'ecommerce']))
                            <x-keys::button
                                variant="ghost"
                                size="sm"
                                iconLeft="heroicon-o-chevron-left"
                                class="gallery-prev bg-white/90 hover:bg-white shadow-lg !text-black"
                                data-gallery-action="prev"
                                data-gallery-target="{{ $id }}"
                                aria-label="Previous image"
                                aria-describedby="{{ $id }}-description"
                            />
                            <x-keys::button
                                variant="ghost"
                                size="sm"
                                iconLeft="heroicon-o-chevron-right"
                                class="gallery-next bg-white/90 hover:bg-white shadow-lg !text-black"
                                data-gallery-action="next"
                                data-gallery-target="{{ $id }}"
                                aria-label="Next image"
                                aria-describedby="{{ $id }}-description"
                            />
                        @endif

                        
                        @if($autoplay)
                            <x-keys::button
                                variant="ghost"
                                size="sm"
                                iconLeft="heroicon-o-pause"
                                iconToggle="heroicon-o-play"
                                class="gallery-autoplay-toggle bg-neutral-800 hover:bg-neutral-900 text-white"
                                data-gallery-action="toggle-autoplay"
                                data-gallery-target="{{ $id }}"
                                aria-label="Pause autoplay"
                                aria-pressed="true"
                            />
                        @endif

                        
                        @if($type === 'ecommerce' && count($images) > 1)
                            <div class="gallery-counter px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                                <span data-gallery-current="{{ $id }}">1</span> / {{ count($images) }}
                            </div>
                        @endif
                    </div>

                    
                    @if($shouldShowThumbnails() && $thumbnailPosition === 'overlay')
                        @php
                            $overlayThumbnailClasses = 'gallery-thumbnail relative cursor-pointer border-2 border-transparent transition-all duration-200 hover:border-accent-500 overflow-hidden flex-shrink-0 drop-shadow-sm';
                            $overlayThumbnailSizeClasses = match ($thumbnailSize) {
                                'xs' => 'w-12 h-12',
                                'sm' => 'w-16 h-16',
                                'md' => 'w-20 h-20',
                                'lg' => 'w-24 h-24',
                                default => 'w-16 h-16'
                            };
                            $overlayThumbnailRadius = match ($radius) {
                                'none' => '',
                                'sm' => 'rounded-sm',
                                'md' => 'rounded-md',
                                'lg' => 'rounded-md',
                                'xl' => 'rounded-lg',
                                'full' => 'rounded-lg',
                                default => 'rounded-md'
                            };
                        @endphp

                        <div class="gallery-thumbnails-overlay absolute bottom-4 left-4 right-20 z-[12]">
                            <div class="flex items-center gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-lg overflow-x-auto scrollbar-hide">
                                @foreach($images as $index => $image)
                                    <div
                                        class="{{ $overlayThumbnailClasses }} {{ $overlayThumbnailSizeClasses }} {{ $overlayThumbnailRadius }} @if($index === 0) border-accent-500 @endif"
                                        data-gallery-thumbnail="{{ $index }}"
                                        data-gallery-target="{{ $id }}"
                                        role="button"
                                        tabindex="0"
                                        aria-label="View image {{ $index + 1 }}: {{ $image['alt'] }}"
                                        @if($index === 0) aria-current="true" @endif
                                    >
                                        <img
                                            src="{{ $image['thumbnail'] }}"
                                            alt="{{ $image['alt'] }}"
                                            class="absolute inset-0 w-full h-full object-cover aspect-square {{ $radius === 'none' ? '' : 'rounded-sm' }}"
                                            loading="eager"
                                        />
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif

                    
                    @if($shouldShowThumbnails() && $thumbnailPosition === 'overlay-top')
                        @php
                            $overlayTopThumbnailClasses = 'gallery-thumbnail relative cursor-pointer border-2 border-transparent transition-all duration-200 hover:border-accent-500 overflow-hidden flex-shrink-0 drop-shadow-sm';
                            $overlayTopThumbnailSizeClasses = match ($thumbnailSize) {
                                'xs' => 'w-12 h-12',
                                'sm' => 'w-16 h-16',
                                'md' => 'w-20 h-20',
                                'lg' => 'w-24 h-24',
                                default => 'w-16 h-16'
                            };
                            $overlayTopThumbnailRadius = match ($radius) {
                                'none' => '',
                                'sm' => 'rounded-sm',
                                'md' => 'rounded-md',
                                'lg' => 'rounded-md',
                                'xl' => 'rounded-lg',
                                'full' => 'rounded-lg',
                                default => 'rounded-md'
                            };
                        @endphp

                        <div class="gallery-thumbnails-overlay-top absolute top-4 left-4 right-20 z-[12]">
                            <div class="flex items-center gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-lg overflow-x-auto scrollbar-hide">
                                @foreach($images as $index => $image)
                                    <div
                                        class="{{ $overlayTopThumbnailClasses }} {{ $overlayTopThumbnailSizeClasses }} {{ $overlayTopThumbnailRadius }} @if($index === 0) border-accent-500 @endif"
                                        data-gallery-thumbnail="{{ $index }}"
                                        data-gallery-target="{{ $id }}"
                                        role="button"
                                        tabindex="0"
                                        aria-label="View image {{ $index + 1 }}: {{ $image['alt'] }}"
                                        @if($index === 0) aria-current="true" @endif
                                    >
                                        <img
                                            src="{{ $image['thumbnail'] }}"
                                            alt="{{ $image['alt'] }}"
                                            class="absolute inset-0 w-full h-full object-cover aspect-square {{ $radius === 'none' ? '' : 'rounded-sm' }}"
                                            loading="eager"
                                        />
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>

                
                @if($shouldShowThumbnails() && $thumbnailPosition === 'bottom')
                    @php
                        $bottomThumbnailContainerClasses = 'gallery-thumbnails flex flex-wrap gap-2 mt-4 justify-center p-1';
                        $bottomThumbnailClasses = 'gallery-thumbnail relative cursor-pointer border-2 border-transparent transition-all duration-200 hover:border-accent-500 overflow-hidden drop-shadow-sm';
                        $bottomThumbnailSizeClasses = match ($thumbnailSize) {
                            'xs' => 'w-12 h-12',
                            'sm' => 'w-16 h-16',
                            'md' => 'w-20 h-20',
                            'lg' => 'w-24 h-24',
                            default => 'w-16 h-16'
                        };
                        $bottomThumbnailRadius = match ($radius) {
                            'none' => '',
                            'sm' => 'rounded-sm',
                            'md' => 'rounded-md',
                            'lg' => 'rounded-md',
                            'xl' => 'rounded-lg',
                            'full' => 'rounded-lg',
                            default => 'rounded-md'
                        };
                    @endphp

                    <div class="{{ $bottomThumbnailContainerClasses }}">
                        @foreach($images as $index => $image)
                            <div
                                class="{{ $bottomThumbnailClasses }} {{ $bottomThumbnailSizeClasses }} {{ $bottomThumbnailRadius }} @if($index === 0) border-accent-500 @endif"
                                data-gallery-thumbnail="{{ $index }}"
                                data-gallery-target="{{ $id }}"
                                role="button"
                                tabindex="0"
                                aria-label="View image {{ $index + 1 }}: {{ $image['alt'] }}"
                                @if($index === 0) aria-current="true" @endif
                            >
                                <img
                                    src="{{ $image['thumbnail'] }}"
                                    alt="{{ $image['alt'] }}"
                                    class="absolute inset-0 w-full h-full object-cover aspect-square {{ $radius === 'none' ? '' : 'rounded-sm' }}"
                                    loading="eager"
                                />
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>

            
            @if($shouldShowThumbnails() && $thumbnailPosition === 'side')
                @php
                    $sideThumbnailContainerClasses = 'gallery-thumbnails flex flex-col gap-2 ml-4 p-1';
                    $sideThumbnailClasses = 'gallery-thumbnail relative cursor-pointer border-2 border-transparent transition-all duration-200 hover:border-accent-500 overflow-hidden drop-shadow-sm';
                    $sideThumbnailSizeClasses = match ($thumbnailSize) {
                        'xs' => 'w-12 h-12',
                        'sm' => 'w-16 h-16',
                        'md' => 'w-20 h-20',
                        'lg' => 'w-24 h-24',
                        default => 'w-16 h-16'
                    };
                    $sideThumbnailRadius = match ($radius) {
                        'none' => '',
                        'sm' => 'rounded-sm',
                        'md' => 'rounded-md',
                        'lg' => 'rounded-md',
                        'xl' => 'rounded-lg',
                        'full' => 'rounded-lg',
                        default => 'rounded-md'
                    };
                @endphp

                <div class="gallery-thumbnails flex flex-col gap-2 ml-4 p-1 flex-shrink-0 max-h-full overflow-y-auto">
                    @foreach($images as $index => $image)
                        <div
                            class="{{ $sideThumbnailClasses }} {{ $sideThumbnailSizeClasses }} {{ $sideThumbnailRadius }} @if($index === 0) border-accent-500 @endif"
                            data-gallery-thumbnail="{{ $index }}"
                            data-gallery-target="{{ $id }}"
                            role="button"
                            tabindex="0"
                            aria-label="View image {{ $index + 1 }}: {{ $image['alt'] }}"
                            @if($index === 0) aria-current="true" @endif
                        >
                            <img
                                src="{{ $image['thumbnail'] }}"
                                alt="{{ $image['alt'] }}"
                                class="absolute inset-0 w-full h-full object-cover {{ $radius === 'none' ? '' : 'rounded-sm' }}"
                                loading="eager"
                            />
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        
        <div
            id="{{ $id }}-live"
            class="sr-only"
            aria-live="polite"
            aria-atomic="true"
            data-gallery-live="{{ $id }}"
        ></div>

        
        <div id="{{ $id }}-description" class="sr-only">
            Use arrow keys to navigate between images, or click on thumbnails. Press space to toggle autoplay.
        </div>

        
        <style>
            /* Gallery-specific responsive behaviors for masonry on mobile */
            @media (max-width: 768px) {
                .gallery-masonry-container {
                    columns: 2 !important;
                    column-gap: 0.75rem !important;
                }
            }

            @media (max-width: 480px) {
                .gallery-masonry-container {
                    columns: 1 !important;
                    column-gap: 0 !important;
                }
                .gallery-grid-item {
                    min-height: 150px;
                }
            }

            /* Scroll snap container styles - scrollbar hiding */
            .gallery-scroll-container.scrollbar-hide,
            .scrollbar-hide {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }

            .gallery-scroll-container.scrollbar-hide::-webkit-scrollbar,
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }

            /* Keyboard focus for scroll container */
            .gallery-scroll-container:focus {
                outline: 2px solid var(--color-accent-500);
                outline-offset: 2px;
            }

            /* Thumbnail focus states that require CSS for proper accessibility */
            .gallery-thumbnail:focus {
                outline: 2px solid var(--color-accent-500);
                outline-offset: 2px;
                z-index: 5;
            }

            .gallery-thumbnail.active {
                border-color: var(--color-accent-500);
            }

            /* Webkit scrollbar hiding for thumbnail overlays */
            .gallery-thumbnails.scrollbar-hide {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }

            .gallery-thumbnails.scrollbar-hide::-webkit-scrollbar {
                display: none;
            }

            /* Loading animation keyframes */
            @keyframes gallery-spin {
                to { transform: rotate(360deg); }
            }

            .gallery-loading::after {
                animation: gallery-spin 1s linear infinite;
            }

            /* Ecommerce minimum height */
            .gallery-ecommerce .gallery-main {
                min-height: 400px;
            }

            /* Smooth scroll behavior for all browsers */
            @supports not (scroll-behavior: smooth) {
                .gallery-scroll-container {
                    scroll-behavior: auto;
                }
            }
        </style>

        
        @if($type === 'ecommerce')
            @php $mainImage = $getMainImage(); @endphp
            @if($mainImage && ($mainImage['title'] || $mainImage['description']))
                <div class="gallery-details mt-4 p-4 bg-elevation-1 border border-line rounded-lg">
                    @if($mainImage['title'])
                        <h3 class="text-lg font-semibold text-primary mb-2" data-gallery-title="{{ $id }}">
                            {{ $mainImage['title'] }}
                        </h3>
                    @endif
                    @if($mainImage['description'])
                        <p class="text-sm text-muted" data-gallery-description="{{ $id }}">
                            {{ $mainImage['description'] }}
                        </p>
                    @endif
                </div>
            @endif
        @endif
        @endif
    </div>

@else
    <div class="gallery-empty bg-elevation-1 border border-line rounded-lg p-8 text-center" data-keys-gallery="true" data-has-images="false">
        <x-keys::icon name="heroicon-o-photo" size="lg" class="mx-auto mb-4" />
        <p class="text-muted">No images to display</p>
    </div>
@endif
