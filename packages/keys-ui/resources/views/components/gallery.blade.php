@if($hasImages())
    <div
        {{ $attributes->merge(['class' => $containerClasses()]) }}
        data-gallery="true"
        data-gallery-id="{{ $id }}"
        data-gallery-type="{{ $type }}"
        data-gallery-layout="{{ $layout }}"
        data-autoplay="{{ $autoplay ? 'true' : 'false' }}"
        data-autoplay-delay="{{ $autoplayDelay }}"
        data-loop="{{ $loop ? 'true' : 'false' }}"
        data-lightbox="{{ $lightbox ? 'true' : 'false' }}"
        data-total-images="{{ count($images) }}"
        role="region"
        aria-label="Image gallery with {{ count($images) }} images"
        aria-describedby="{{ $id }}-description"
        @if(!$isAlternativeLayout()) tabindex="0" @endif
    >
        {{-- Alternative layouts (Masonry/Grid) - Pure image display layouts --}}
        @if($isAlternativeLayout())
            {{-- Masonry Layout --}}
            @if($layout === 'masonry')
                <div class="gallery-masonry-container {{ $layoutWrapperClasses() }}">
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
                                <p class="mt-2 text-sm text-foreground/70">{{ $image['caption'] }}</p>
                            @endif
                        </div>
                    @endforeach
                </div>
            @endif

            {{-- Grid Layout --}}
            @if($layout === 'grid')
                <div class="gallery-grid-container {{ $layoutWrapperClasses() }} {{ $gridLayoutClasses() }}">
                    @foreach($images as $index => $image)
                        <div class="gallery-grid-item">
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
                                <p class="mt-2 text-sm text-foreground/70">{{ $image['caption'] }}</p>
                            @endif
                        </div>
                    @endforeach
                </div>
            @endif

        @else
        {{-- Default Slider Layout --}}
        <div class="{{ $galleryLayoutClasses() }}">
            {{-- Main Image Display --}}
            <div class="gallery-main-container flex-1">
                {{-- Thumbnails on top --}}
                @if($shouldShowThumbnails() && $thumbnailPosition === 'top')
                    <div class="{{ $thumbnailContainerClasses() }}">
                        @foreach($images as $index => $image)
                            <div
                                class="{{ $thumbnailClasses() }} @if($index === 0) border-brand-500 @endif"
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

                {{-- Main Image Container --}}
                <div class="{{ $mainImageClasses() }}" role="img" aria-label="Current gallery image">
                    @foreach($images as $index => $image)
                        <div
                            class="gallery-slide absolute inset-0 transition-opacity duration-300 ease-in-out z-[1] @if($index === 0) opacity-100 z-[2] @else opacity-0 @endif"
                            data-gallery-slide="{{ $index }}"
                            data-gallery-target="{{ $id }}"
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

                    {{-- Controls positioned at bottom right --}}
                    <div class="gallery-controls absolute bottom-4 right-4 flex items-center gap-2 z-[15]">
                        {{-- Navigation Arrows (for basic and ecommerce types) --}}
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

                        {{-- Autoplay Controls --}}
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

                        {{-- Image Counter (for ecommerce type) --}}
                        @if($type === 'ecommerce' && count($images) > 1)
                            <div class="gallery-counter px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                                <span data-gallery-current="{{ $id }}">1</span> / {{ count($images) }}
                            </div>
                        @endif
                    </div>

                    {{-- Overlay Thumbnails (Bottom) --}}
                    @if($shouldShowThumbnails() && $thumbnailPosition === 'overlay')
                        <div class="gallery-thumbnails-overlay absolute bottom-4 left-4 right-16 z-[12]">
                            <div class="flex items-center gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-lg overflow-x-auto scrollbar-hide">
                                @foreach($images as $index => $image)
                                    <div
                                        class="{{ $thumbnailClasses() }} @if($index === 0) border-brand-500 @endif"
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
                        </div>
                    @endif

                    {{-- Overlay Thumbnails (Top) --}}
                    @if($shouldShowThumbnails() && $thumbnailPosition === 'overlay-top')
                        <div class="gallery-thumbnails-overlay-top absolute top-4 left-4 right-16 z-[12]">
                            <div class="flex items-center gap-2 p-2 bg-black/20 backdrop-blur-sm rounded-lg overflow-x-auto scrollbar-hide">
                                @foreach($images as $index => $image)
                                    <div
                                        class="{{ $thumbnailClasses() }} @if($index === 0) border-brand-500 @endif"
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
                        </div>
                    @endif
                </div>

                {{-- Thumbnails on bottom --}}
                @if($shouldShowThumbnails() && $thumbnailPosition === 'bottom')
                    <div class="{{ $thumbnailContainerClasses() }}">
                        @foreach($images as $index => $image)
                            <div
                                class="{{ $thumbnailClasses() }} @if($index === 0) border-brand-500 @endif"
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

            {{-- Side Thumbnails --}}
            @if($shouldShowThumbnails() && $thumbnailPosition === 'side')
                <div class="{{ $thumbnailContainerClasses() }}">
                    @foreach($images as $index => $image)
                        <div
                            class="{{ $thumbnailClasses() }} @if($index === 0) border-brand-500 @endif"
                            data-gallery-thumbnail="{{ $index }}"
                            data-gallery-target="{{ $id }}"
                            role="button"
                            tabindex="0"
                            aria-label="View image {{ $index + 1 }}: {{ $image['alt'] }}"
                            @if($index === 0) aria-current="true" @endif
                        >
                            <x-keys::image
                                :src="$image['thumbnail']"
                                :alt="$image['alt']"
                                size="full"
                                :aspect-ratio="$aspectRatio"
                                object-fit="cover"
                                :radius="$radius === 'none' ? 'none' : 'sm'"
                                :lazy="false"
                            />
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        {{-- Aria-live region for screen reader announcements --}}
        <div
            id="{{ $id }}-live"
            class="sr-only"
            aria-live="polite"
            aria-atomic="true"
            data-gallery-live="{{ $id }}"
        ></div>

        {{-- Gallery description for accessibility --}}
        <div id="{{ $id }}-description" class="sr-only">
            Use arrow keys to navigate between images, or click on thumbnails. Press space to toggle autoplay.
        </div>

        {{-- Gallery-specific styles using CSS-in-Blade pattern --}}
        <style>
            /* Masonry Layout - Responsive CSS Columns Implementation */
            .gallery-masonry-container {
                columns: {{ $masonryColumns }}; /* Configurable columns property */
                column-gap: 1rem;
                column-fill: balance; /* Better column distribution */
            }

            @media (max-width: 768px) {
                .gallery-masonry-container {
                    columns: 2; /* Force 2 columns on tablet */
                    column-gap: 0.75rem;
                }
            }

            @media (max-width: 480px) {
                .gallery-masonry-container {
                    columns: 1; /* Force single column on mobile */
                    column-gap: 0;
                }
            }

            .gallery-masonry-item {
                break-inside: avoid;
                page-break-inside: avoid;
                margin-bottom: 1rem;
                display: inline-block; /* Critical for CSS columns */
                width: 100%;
                vertical-align: top;
            }

            .gallery-masonry-item img {
                width: 100%;
                height: auto;
                aspect-ratio: auto !important; /* Force override any inherited aspect ratio */
                object-fit: cover; /* Maintain aspect ratio while filling space */
                display: block;
                border-radius: inherit;
            }

            /* Grid Layout - Enhanced Responsive Behavior */
            .gallery-grid-container {
                display: grid;
                gap: 1rem;
            }

            /* Responsive grid adjustments */
            @media (max-width: 768px) {
                .gallery-grid-container {
                    gap: 0.75rem;
                }
            }

            @media (max-width: 480px) {
                .gallery-grid-container {
                    gap: 0.5rem;
                }
            }

            .gallery-grid-item {
                overflow: hidden;
                min-height: 200px; /* Ensure consistent grid height */
            }

            .gallery-grid-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: inherit;
            }

            /* Mobile optimization for grid items */
            @media (max-width: 480px) {
                .gallery-grid-item {
                    min-height: 150px;
                }
            }

            /* Complex interactive states that require custom CSS */
            .gallery-thumbnail {
                /* Ensure proper overflow handling */
                overflow: hidden;
            }

            .gallery-thumbnail img {
                /* Ensure thumbnail images fill their containers properly */
                aspect-ratio: 1;
                object-fit: cover;
            }

            .gallery-thumbnail.active {
                border-color: var(--color-brand-500);
            }

            .gallery-thumbnail:hover {
                border-color: var(--color-brand-400);
            }

            .gallery-thumbnail:focus {
                outline: 2px solid var(--color-brand-500);
                outline-offset: 2px;
                z-index: 5;
            }

            /* Autoplay button styling is now handled by Keys Button component */

            /* Webkit scrollbar hiding for thumbnails */
            [data-gallery-type="thumbnail"] .gallery-thumbnails {
                max-width: 100%;
                overflow-x: auto;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }

            [data-gallery-type="thumbnail"] .gallery-thumbnails::-webkit-scrollbar {
                display: none;
            }

            /* Complex CSS selectors for layout */
            .gallery-container:has(.gallery-thumbnails) .gallery-main-container {
                flex: 1;
            }

            /* Ecommerce-specific layout */
            .gallery-ecommerce .gallery-main {
                min-height: 400px;
            }

            /* Loading animation */
            .gallery-image-loading {
                position: relative;
            }

            .gallery-image-loading::before {
                content: '';
                position: absolute;
                inset: 0;
                background: var(--color-surface);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
            }

            .gallery-image-loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 2rem;
                height: 2rem;
                margin: -1rem 0 0 -1rem;
                border: 2px solid var(--color-neutral-200);
                border-top-color: var(--color-brand-500);
                border-radius: 50%;
                animation: gallery-spin 1s linear infinite;
                z-index: 11;
            }

            @keyframes gallery-spin {
                to { transform: rotate(360deg); }
            }

            /* Error states */
            .gallery-image-error {
                position: relative;
            }

            .gallery-error-placeholder {
                z-index: 10;
            }

            .gallery-thumbnail-error {
                position: relative;
            }

            .gallery-thumbnail-error-placeholder {
                z-index: 10;
            }

            /* Gallery-wide error state */
            .gallery-has-errors {
                border: 2px dashed rgb(239 68 68 / 0.5);
                background: rgb(239 68 68 / 0.05);
            }

            .gallery-has-errors::before {
                content: '';
                position: absolute;
                top: 4px;
                right: 4px;
                width: 12px;
                height: 12px;
                background: rgb(239 68 68);
                border-radius: 50%;
                z-index: 20;
            }

            /* Mobile responsive adjustments */
            @media (max-width: 768px) {
                .gallery-navigation .gallery-prev,
                .gallery-navigation .gallery-next {
                    padding: 0.375rem; /* Smaller buttons on mobile */
                }

                .gallery-thumbnails {
                    gap: 0.5rem;
                }

                .gallery-thumbnail {
                    width: 3rem;
                    height: 3rem;
                }
            }
        </style>

        {{-- Image Details (for ecommerce type) --}}
        @if($type === 'ecommerce')
            @php $mainImage = $getMainImage(); @endphp
            @if($mainImage && ($mainImage['title'] || $mainImage['description']))
                <div class="gallery-details mt-4 p-4 bg-surface border border-border rounded-lg">
                    @if($mainImage['title'])
                        <h3 class="text-lg font-semibold text-foreground mb-2" data-gallery-title="{{ $id }}">
                            {{ $mainImage['title'] }}
                        </h3>
                    @endif
                    @if($mainImage['description'])
                        <p class="text-sm text-foreground/70" data-gallery-description="{{ $id }}">
                            {{ $mainImage['description'] }}
                        </p>
                    @endif
                </div>
            @endif
        @endif
        @endif
    </div>

@else
    <div class="gallery-empty bg-surface border border-border rounded-lg p-8 text-center">
        <x-keys::icon name="heroicon-o-photo" size="lg" class="mx-auto mb-4 text-muted" />
        <p class="text-foreground/70">No images to display</p>
    </div>
@endif
