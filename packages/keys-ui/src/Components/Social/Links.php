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
            'facebook' => 'keys::icons.facebook',
            'instagram' => 'keys::icons.instagram',
            'twitter' => 'keys::icons.x',
            'x' => 'keys::icons.x',
            'linkedin' => 'keys::icons.linkedin',
            'youtube' => 'keys::icons.youtube',
            'tiktok' => 'keys::icons.tiktok',
            'whatsapp' => 'keys::icons.whatsapp',
            'pinterest' => 'keys::icons.pinterest',
            'reddit' => 'keys::icons.reddit',
            'telegram' => 'keys::icons.telegram',
            'github' => 'keys::icons.github',
            'dribbble' => 'heroicon-o-paint-brush',
            'behance' => 'heroicon-o-sparkles',
            'figma' => 'keys::icons.figma',
            'google' => 'keys::icons.google',
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
