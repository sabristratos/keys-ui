@if($hasImages())
    <div
        {{ $attributes->merge(['class' => $containerClasses()]) }}
        data-gallery="true"
        data-gallery-id="{{ $id }}"
        data-gallery-type="{{ $type }}"
        data-autoplay="{{ $autoplay ? 'true' : 'false' }}"
        data-autoplay-delay="{{ $autoplayDelay }}"
        data-loop="{{ $loop ? 'true' : 'false' }}"
        data-lightbox="{{ $lightbox ? 'true' : 'false' }}"
        data-total-images="{{ count($images) }}"
        role="region"
        aria-label="Image gallery with {{ count($images) }} images"
        aria-describedby="{{ $id }}-description"
        tabindex="0"
    >
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

                {{-- Main Image Container --}}
                <div class="{{ $mainImageClasses() }}" role="img" aria-label="Current gallery image">
                    @foreach($images as $index => $image)
                        <div
                            class="gallery-slide absolute inset-0 transition-opacity duration-300 ease-in-out @if($index === 0) opacity-100 @else opacity-0 @endif"
                            data-gallery-slide="{{ $index }}"
                            data-gallery-target="{{ $id }}"
                        >
                            <x-keys::image
                                :src="$image['src']"
                                :alt="$image['alt']"
                                size="full"
                                :aspect-ratio="$aspectRatio"
                                object-fit="cover"
                                :radius="$radius"
                                :caption="$image['caption']"
                                :lightbox="$lightbox"
                            />
                        </div>
                    @endforeach

                    {{-- Navigation Arrows (for basic and ecommerce types) --}}
                    @if(count($images) > 1 && in_array($type, ['basic', 'ecommerce']))
                        <div class="gallery-navigation absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
                            <button
                                type="button"
                                class="gallery-prev absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500"
                                data-gallery-action="prev"
                                data-gallery-target="{{ $id }}"
                                aria-label="Previous image"
                                aria-describedby="{{ $id }}-description"
                            >
                                <x-keys::icon name="heroicon-o-chevron-left" size="sm" />
                            </button>
                            <button
                                type="button"
                                class="gallery-next absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500"
                                data-gallery-action="next"
                                data-gallery-target="{{ $id }}"
                                aria-label="Next image"
                                aria-describedby="{{ $id }}-description"
                            >
                                <x-keys::icon name="heroicon-o-chevron-right" size="sm" />
                            </button>
                        </div>
                    @endif

                    {{-- Image Counter (for ecommerce type) --}}
                    @if($type === 'ecommerce' && count($images) > 1)
                        <div class="gallery-counter absolute bottom-4 right-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                            <span data-gallery-current="{{ $id }}">1</span> / {{ count($images) }}
                        </div>
                    @endif

                    {{-- Autoplay Controls --}}
                    @if($autoplay)
                        <div class="gallery-autoplay-controls absolute top-4 right-4">
                            <button
                                type="button"
                                class="gallery-autoplay-toggle w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
                                data-gallery-action="toggle-autoplay"
                                data-gallery-target="{{ $id }}"
                                aria-label="Toggle autoplay"
                                aria-pressed="true"
                            >
                                <x-keys::icon name="heroicon-o-pause" size="xs" class="play-icon hidden" />
                                <x-keys::icon name="heroicon-o-play" size="xs" class="pause-icon" />
                            </button>
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

            {{-- Side Thumbnails --}}
            @if($shouldShowThumbnails() && $thumbnailPosition === 'side')
                <div class="{{ $thumbnailContainerClasses() }}">
                    @foreach($images as $index => $image)
                        <div
                            class="{{ $thumbnailClasses() }} @if($index === 0) border-brand-500 @endif"
                            data-gallery-thumbnail="{{ $index }}"
                            data-gallery-target="{{ $id }}"
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
    </div>

@else
    <div class="gallery-empty bg-surface border border-border rounded-lg p-8 text-center">
        <x-keys::icon name="heroicon-o-photo" size="lg" class="mx-auto mb-4 text-muted" />
        <p class="text-foreground/70">No images to display</p>
    </div>
@endif