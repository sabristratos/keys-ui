<?php

namespace Keys\UI\Components\Sidebar;

use Illuminate\View\Component;

class Toggle extends Component
{
    public function __construct(
        public ?string $sidebarId = null,
        public string $desktopIcon = 'heroicon-o-chevron-up-down',
        public string $mobileIcon = 'heroicon-o-x-mark',
        public string $variant = 'outline',
        public string $size = 'xs',
        public string $position = 'right',
    ) {
        $this->sidebarId = $this->sidebarId ?? 'main-sidebar';
    }

    public function getDataAttributes(): array
    {
        return [
            'data-sidebar-toggle' => $this->sidebarId,
            'data-keys-sidebar-toggle' => 'true',
        ];
    }

    public function render()
    {
        return view('keys::components.sidebar.toggle', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
