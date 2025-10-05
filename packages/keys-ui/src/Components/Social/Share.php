<?php

namespace Keys\UI\Components\Social;

use Illuminate\View\Component;

class Share extends Component
{
    public array $platforms;

    public ?string $url;

    public ?string $title;

    public ?string $description;

    public string $variant;

    public string $size;

    public string $layout;

    public bool $attached;

    public bool $showLabels;

    public array $shareUrls;

    public array $platformLabels;

    public array $platformIcons;

    public function __construct(
        array $platforms = ['facebook', 'twitter', 'linkedin', 'whatsapp'],
        ?string $url = null,
        ?string $title = null,
        ?string $description = null,
        string $variant = 'outline',
        string $size = 'md',
        string $layout = 'horizontal',
        bool $attached = false,
        bool $showLabels = false
    ) {
        $this->platforms = $platforms;
        $this->url = $url ?? request()->url();
        $this->title = $title;
        $this->description = $description;
        $this->variant = $variant;
        $this->size = $size;
        $this->layout = $layout;
        $this->attached = $attached;
        $this->showLabels = $showLabels;

        

        $this->shareUrls = $this->buildShareUrls();
        $this->platformLabels = $this->buildPlatformLabels();
        $this->platformIcons = $this->buildPlatformIcons();
    }

    protected function buildShareUrls(): array
    {
        $encoded = [
            'url' => urlencode($this->url),
            'title' => urlencode($this->title ?? ''),
            'description' => urlencode($this->description ?? ''),
        ];

        return [
            'facebook' => "https://www.facebook.com/sharer/sharer.php?u={$encoded['url']}",
            'twitter' => "https://twitter.com/intent/tweet?url={$encoded['url']}&text={$encoded['title']}",
            'linkedin' => "https://www.linkedin.com/sharing/share-offsite/?url={$encoded['url']}",
            'whatsapp' => "https://wa.me/?text={$encoded['title']} {$encoded['url']}",
            'pinterest' => "https://pinterest.com/pin/create/button/?url={$encoded['url']}&description={$encoded['title']}",
            'reddit' => "https://reddit.com/submit?url={$encoded['url']}&title={$encoded['title']}",
            'telegram' => "https://t.me/share/url?url={$encoded['url']}&text={$encoded['title']}",
        ];
    }

    protected function buildPlatformLabels(): array
    {
        return [
            'facebook' => 'Facebook',
            'twitter' => 'Twitter',
            'linkedin' => 'LinkedIn',
            'whatsapp' => 'WhatsApp',
            'pinterest' => 'Pinterest',
            'reddit' => 'Reddit',
            'telegram' => 'Telegram',
        ];
    }

    protected function buildPlatformIcons(): array
    {
        return [
            'facebook' => 'icons.facebook',
            'twitter' => 'icons.x',
            'linkedin' => 'icons.linkedin',
            'whatsapp' => 'icons.whatsapp',
            'pinterest' => 'icons.pinterest',
            'reddit' => 'icons.reddit',
            'telegram' => 'icons.telegram',
        ];
    }

    public function getDataAttributes(): array
    {
        return [
            'data-keys-social-share' => 'true',
            'data-layout' => $this->layout,
            'data-variant' => $this->variant,
            'data-size' => $this->size,
        ];
    }

    public function render()
    {
        return view('keys::components.social.share', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
