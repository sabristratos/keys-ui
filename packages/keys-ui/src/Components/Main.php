<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;

/**
 * Main Content Area Component
 *
 * Provides a pre-styled main content area with:
 * - Responsive padding
 * - Mobile sidebar toggle in header
 * - Proper scrolling and overflow handling
 * - Optional header/footer slots
 */
class Main extends Component
{
    public function __construct(
        public ?string $title = null,
        public string $sidebarId = 'main-sidebar',
        public bool $showMobileToggle = true,
        public string $padding = 'md',
    ) {
        if (!in_array($this->padding, ['none', 'sm', 'md', 'lg'])) {
            $this->padding = 'md';
        }
    }

    public function getPaddingClasses(): string
    {
        return match ($this->padding) {
            'none' => '',
            'sm' => 'p-4',
            'md' => 'p-4 sm:p-6 lg:p-8',
            'lg' => 'p-6 sm:p-8 lg:p-10',
            default => 'p-4 sm:p-6 lg:p-8',
        };
    }

    public function render()
    {
        return view('keys::components.main', [
            'paddingClasses' => $this->getPaddingClasses(),
        ]);
    }
}
