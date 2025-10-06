<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Gallery extends Component
{

    public function __construct(
        public array $images = [],
        public string $type = 'thumbnail',
        public string $layout = 'default',
        public string $aspectRatio = 'auto',
        public string $radius = 'lg',
        public string $thumbnailPosition = 'bottom',
        public string $thumbnailSize = 'sm',
        public int $gridColumns = 3,
        public string $masonryColumns = '300px',
        public bool $showThumbnails = true,
        public bool $autoplay = false,
        public bool $loop = true,
        public bool $lightbox = false,
        public int $autoplayDelay = 3000,
        public ?string $id = null
    ) {
        
        if (!in_array($this->type, ['basic', 'thumbnail', 'ecommerce'])) {
            $this->type = 'thumbnail';
        }

        
        if (!in_array($this->layout, ['default', 'masonry', 'grid'])) {
            $this->layout = 'default';
        }

        
        if (!in_array($this->aspectRatio, ['auto', 'square', 'video', 'photo', 'wide'])) {
            $this->aspectRatio = 'auto';
        }

        
        if (!in_array($this->radius, ['none', 'sm', 'md', 'lg', 'xl', 'full'])) {
            $this->radius = 'lg';
        }

        
        if (!in_array($this->thumbnailPosition, ['bottom', 'side', 'top', 'overlay', 'overlay-top'])) {
            $this->thumbnailPosition = 'bottom';
        }

        
        if ($this->gridColumns < 1 || $this->gridColumns > 6) {
            $this->gridColumns = 3;
        }



        $this->thumbnailSize = ComponentConstants::validate($this->thumbnailSize, ComponentConstants::SIZES_THUMBNAIL, 'sm');

        
        if (empty($this->id)) {
            $this->id = 'gallery-' . uniqid();
        }

        
        $this->images = $this->processImages($this->images);
    }

    /**
     * Process and validate image array
     */
    protected function processImages(array $images): array
    {
        return array_map(function ($image, $index) {
            
            if (is_string($image)) {
                $image = ['src' => $image];
            }

            return [
                'id' => $image['id'] ?? "img-{$index}",
                'src' => $image['src'] ?? '',
                'alt' => $image['alt'] ?? "Image " . ($index + 1),
                'caption' => $image['caption'] ?? null,
                'thumbnail' => $image['thumbnail'] ?? $image['src'] ?? '',
                'title' => $image['title'] ?? null,
                'description' => $image['description'] ?? null,
            ];
        }, $images, array_keys($images));
    }

    /**
     * Check if gallery has images
     */
    public function hasImages(): bool
    {
        return !empty($this->images);
    }

    /**
     * Check if thumbnails should be shown
     */
    public function shouldShowThumbnails(): bool
    {
        
        if ($this->isAlternativeLayout()) {
            return false;
        }

        return $this->showThumbnails && count($this->images) > 1;
    }

    /**
     * Get the first/main image
     */
    public function getMainImage(): ?array
    {
        return $this->images[0] ?? null;
    }

    /**
     * Check if layout is alternative (masonry/grid)
     */
    public function isAlternativeLayout(): bool
    {
        return in_array($this->layout, ['masonry', 'grid']);
    }

    /**
     * Get comprehensive data attributes for CSS/JS targeting
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-gallery' => 'true',
            'data-gallery-id' => $this->id,
            'data-type' => $this->type,
            'data-layout' => $this->layout,
            'data-aspect-ratio' => $this->aspectRatio,
            'data-radius' => $this->radius,
            'data-thumbnail-position' => $this->thumbnailPosition,
            'data-thumbnail-size' => $this->thumbnailSize,
            'data-grid-columns' => $this->gridColumns,
            'data-masonry-columns' => $this->masonryColumns,
            'data-total-images' => count($this->images),
        ];

        
        if ($this->showThumbnails) {
            $attributes['data-show-thumbnails'] = 'true';
        }
        if ($this->autoplay) {
            $attributes['data-autoplay'] = 'true';
            $attributes['data-autoplay-delay'] = $this->autoplayDelay;
        }
        if ($this->loop) {
            $attributes['data-loop'] = 'true';
        }
        if ($this->lightbox) {
            $attributes['data-lightbox'] = 'true';
        }
        if ($this->shouldShowThumbnails()) {
            $attributes['data-has-thumbnails'] = 'true';
        }
        if ($this->isAlternativeLayout()) {
            $attributes['data-alternative-layout'] = 'true';
        }
        if ($this->hasImages()) {
            $attributes['data-has-images'] = 'true';
        }

        return $attributes;
    }

    /**
     * Get computed gallery data for JavaScript
     */
    public function getComputedGalleryData(): array
    {
        return [
            'gallery_id' => $this->id,
            'gallery_type' => $this->type,
            'gallery_layout' => $this->layout,
            'autoplay' => $this->autoplay,
            'autoplay_delay' => $this->autoplayDelay,
            'loop' => $this->loop,
            'total_images' => count($this->images),
            'lightbox' => $this->lightbox,
            'grid_columns' => $this->gridColumns,
            'masonry_columns' => $this->masonryColumns,
        ];
    }

    public function render()
    {
        return view('keys::components.gallery', [
            'computedGalleryData' => $this->getComputedGalleryData(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}