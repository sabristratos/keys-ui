<?php

namespace Keys\UI\Components\Social;

use Illuminate\View\Component;

class Links extends Component
{
    public array $links;

    public string $variant;

    public string $size;

    public string $layout;

    public bool $attached;

    public bool $showLabels;

    public string $target;

    public array $platformLabels;

    public array $platformIcons;

    public function __construct(
        array $links = [],
        string $variant = 'ghost',
        string $size = 'md',
        string $layout = 'horizontal',
        bool $attached = false,
        bool $showLabels = false,
        string $target = '_blank'
    ) {
        $this->links = $links;
        $this->variant = $variant;
        $this->size = $size;
        $this->layout = $layout;
        $this->attached = $attached;
        $this->showLabels = $showLabels;
        $this->target = $target;

        // Compute arrays as properties
        $this->platformLabels = $this->buildPlatformLabels();
        $this->platformIcons = $this->buildPlatformIcons();
    }

    protected function buildPlatformLabels(): array
    {
        return [
            'facebook' => 'Facebook',
            'instagram' => 'Instagram',
            'twitter' => 'Twitter',
            'linkedin' => 'LinkedIn',
            'youtube' => 'YouTube',
            'tiktok' => 'TikTok',
            'whatsapp' => 'WhatsApp',
            'pinterest' => 'Pinterest',
            'reddit' => 'Reddit',
            'telegram' => 'Telegram',
            'github' => 'GitHub',
            'dribbble' => 'Dribbble',
            'behance' => 'Behance',
            'figma' => 'Figma',
            'google' => 'Google',
        ];
    }

    protected function buildPlatformIcons(): array
    {
        return [
            'facebook' => 'icons.facebook',
            'instagram' => 'icons.instagram',
            'twitter' => 'icons.x',
            'x' => 'icons.x',
            'linkedin' => 'icons.linkedin',
            'youtube' => 'icons.youtube',
            'tiktok' => 'icons.tiktok',
            'whatsapp' => 'icons.whatsapp',
            'pinterest' => 'icons.pinterest',
            'reddit' => 'icons.reddit',
            'telegram' => 'icons.telegram',
            'github' => 'icons.github',
            'dribbble' => 'heroicon-o-paint-brush',
            'behance' => 'heroicon-o-sparkles',
            'figma' => 'icons.figma',
            'google' => 'icons.google',
        ];
    }

    public function getDataAttributes(): array
    {
        return [
            'data-keys-social-links' => 'true',
            'data-layout' => $this->layout,
            'data-variant' => $this->variant,
            'data-size' => $this->size,
        ];
    }

    public function render()
    {
        return view('keys::components.social.links', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
