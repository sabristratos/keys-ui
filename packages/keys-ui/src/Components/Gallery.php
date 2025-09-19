<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

class Gallery extends Component
{
    public function __construct(
        public array $images = [],
        public string $type = 'thumbnail',
        public string $aspectRatio = 'auto',
        public string $radius = 'lg',
        public string $thumbnailPosition = 'bottom',
        public string $thumbnailSize = 'sm',
        public bool $showThumbnails = true,
        public bool $autoplay = false,
        public bool $loop = true,
        public bool $lightbox = false,
        public int $autoplayDelay = 3000,
        public ?string $id = null
    ) {
        // Validate type
        if (!in_array($this->type, ['basic', 'thumbnail', 'ecommerce'])) {
            $this->type = 'thumbnail';
        }

        // Validate aspect ratio
        if (!in_array($this->aspectRatio, ['auto', 'square', 'video', 'photo', 'wide'])) {
            $this->aspectRatio = 'auto';
        }

        // Validate radius
        if (!in_array($this->radius, ['none', 'sm', 'md', 'lg', 'xl', 'full'])) {
            $this->radius = 'lg';
        }

        // Validate thumbnail position
        if (!in_array($this->thumbnailPosition, ['bottom', 'side', 'top'])) {
            $this->thumbnailPosition = 'bottom';
        }

        // Validate thumbnail size
        if (!in_array($this->thumbnailSize, ['xs', 'sm', 'md', 'lg'])) {
            $this->thumbnailSize = 'sm';
        }

        // Generate ID if not provided
        if (empty($this->id)) {
            $this->id = 'gallery-' . uniqid();
        }

        // Process images to ensure consistent structure
        $this->images = $this->processImages($this->images);
    }

    /**
     * Process and validate image array
     */
    protected function processImages(array $images): array
    {
        return array_map(function ($image, $index) {
            // Handle different input formats
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
     * Generate container classes
     */
    public function containerClasses(): string
    {
        $baseClasses = 'gallery-container relative';
        $radiusClasses = $this->radiusClasses();
        $typeClasses = "gallery-{$this->type}";

        return trim("{$baseClasses} {$typeClasses} {$radiusClasses}");
    }

    /**
     * Generate main image container classes
     */
    public function mainImageClasses(): string
    {
        $baseClasses = 'gallery-main relative overflow-hidden';
        $radiusClasses = $this->radiusClasses();
        $aspectClasses = $this->aspectRatioClasses();

        return trim("{$baseClasses} {$aspectClasses} {$radiusClasses}");
    }

    /**
     * Generate thumbnail container classes
     */
    public function thumbnailContainerClasses(): string
    {
        $baseClasses = 'gallery-thumbnails';

        $layoutClasses = match ($this->thumbnailPosition) {
            'bottom' => 'flex flex-wrap gap-2 mt-4 justify-center',
            'top' => 'flex flex-wrap gap-2 mb-4 justify-center',
            'side' => 'flex flex-col gap-2 ml-4',
            default => 'flex flex-wrap gap-2 mt-4 justify-center'
        };

        return trim("{$baseClasses} {$layoutClasses}");
    }

    /**
     * Generate thumbnail classes
     */
    public function thumbnailClasses(): string
    {
        $baseClasses = 'gallery-thumbnail cursor-pointer border-2 border-transparent transition-all duration-200 hover:border-brand-500';
        $sizeClasses = $this->thumbnailSizeClasses();
        $radiusClasses = match ($this->radius) {
            'none' => '',
            'sm' => 'rounded-sm',
            'md' => 'rounded-md',
            'lg' => 'rounded-md',
            'xl' => 'rounded-lg',
            'full' => 'rounded-lg',
            default => 'rounded-md'
        };

        return trim("{$baseClasses} {$sizeClasses} {$radiusClasses}");
    }

    /**
     * Generate gallery layout classes for main container
     */
    public function galleryLayoutClasses(): string
    {
        if ($this->thumbnailPosition === 'side' && $this->shouldShowThumbnails()) {
            return 'flex flex-row';
        }

        return 'flex flex-col';
    }

    /**
     * Generate aspect ratio classes
     */
    protected function aspectRatioClasses(): string
    {
        return match ($this->aspectRatio) {
            'square' => 'aspect-square',
            'video' => 'aspect-video',
            'photo' => 'aspect-[4/3]',
            'wide' => 'aspect-[21/9]',
            'auto' => '',
            default => ''
        };
    }

    /**
     * Generate radius classes
     */
    protected function radiusClasses(): string
    {
        return match ($this->radius) {
            'sm' => 'rounded-sm',
            'md' => 'rounded-md',
            'lg' => 'rounded-lg',
            'xl' => 'rounded-xl',
            'full' => 'rounded-full',
            'none' => '',
            default => ''
        };
    }

    /**
     * Generate thumbnail size classes
     */
    protected function thumbnailSizeClasses(): string
    {
        return match ($this->thumbnailSize) {
            'xs' => 'w-12 h-12',
            'sm' => 'w-16 h-16',
            'md' => 'w-20 h-20',
            'lg' => 'w-24 h-24',
            default => 'w-16 h-16'
        };
    }

    /**
     * Get computed gallery data for JavaScript
     */
    public function getComputedGalleryData(): array
    {
        return [
            'gallery_id' => $this->id,
            'gallery_type' => $this->type,
            'autoplay' => $this->autoplay,
            'autoplay_delay' => $this->autoplayDelay,
            'loop' => $this->loop,
            'total_images' => count($this->images),
            'lightbox' => $this->lightbox,
        ];
    }

    public function render()
    {
        return view('keys::components.gallery', [
            'computedGalleryData' => $this->getComputedGalleryData(),
        ]);
    }
}