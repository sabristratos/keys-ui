<?php

namespace Keys\UI\Components\Tabs;

use Illuminate\View\Component;

class Panel extends Component
{
    public function __construct(
        public string $value,
        public bool $preserveOffscreen = false,
        public ?string $className = null
    ) {
        //
    }

    public function panelClasses(): string
    {
        $base = 'tabs-panel focus:outline-none';
        $custom = $this->className ? ' ' . $this->className : '';

        return trim($base . $custom);
    }

    public function getComputedPanelClasses(): string
    {
        return $this->panelClasses();
    }

    public function getAriaAttributes(): array
    {
        return [
            'role' => 'tabpanel',
            'data-value' => $this->value,
            'data-tabs-panel' => 'true',
            'tabindex' => '0',
            'aria-labelledby' => 'tab-' . $this->value,
            'id' => 'panel-' . $this->value
        ];
    }

    public function getStyleAttributes(): array
    {
        if (!$this->preserveOffscreen) {
            return ['style' => 'display: none;'];
        }

        return [];
    }

    public function render()
    {
        return view('keys::components.tabs.panel', [
            'computedPanelClasses' => $this->getComputedPanelClasses(),
            'ariaAttributes' => $this->getAriaAttributes(),
            'styleAttributes' => $this->getStyleAttributes(),
        ]);
    }
}
