<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants; // Assuming you have a constants helper

class Countdown extends Component
{
    public array $units = [];
    public int $targetTimestamp;

    public function __construct(
        // Functional props
        public ?string $target = null,
        public ?int $days = null,
        public ?int $hours = null,
        public ?int $minutes = null,
        public ?int $seconds = null,

        // Style props
        public string $variant = 'inline', // New: 'inline' or 'boxed'
        public string $size = 'md',        // New: 'sm', 'md', 'lg', 'xl'

        // Display options
        public bool $showLabels = true,
        public bool $showDays = true,
        public bool $showHours = true,
        public bool $showMinutes = true,
        public bool $showSeconds = true,
        public ?string $completeMessage = 'Countdown finished!',
        public ?string $id = null
    ) {
        $this->id = $this->id ?? 'countdown-' . uniqid();

        // You can use a helper or simple array checks for validation
        $this->variant = in_array($variant, ['inline', 'boxed']) ? $variant : 'inline';
        $this->size = in_array($size, ['sm', 'md', 'lg', 'xl']) ? $size : 'md';

        $this->calculateTargetTimestamp();
        $this->buildUnits();
    }

    private function calculateTargetTimestamp(): void
    {
        if ($this->target) {
            $this->targetTimestamp = is_numeric($this->target) ? (int) $this->target : strtotime($this->target);
        } else {
            $now = time();
            $additionalSeconds = ($this->days * 86400) + ($this->hours * 3600) + ($this->minutes * 60) + $this->seconds;
            $this->targetTimestamp = $now + $additionalSeconds;
        }
    }

    private function buildUnits(): void
    {
        if ($this->showDays) $this->units[] = ['key' => 'days', 'label' => 'days'];
        if ($this->showHours) $this->units[] = ['key' => 'hours', 'label' => 'hours'];
        if ($this->showMinutes) $this->units[] = ['key' => 'minutes', 'label' => 'minutes'];
        if ($this->showSeconds) $this->units[] = ['key' => 'seconds', 'label' => 'seconds'];
    }

    public function getDataAttributes(): array
    {
        return [
            'data-keys-countdown' => 'true',
            'data-target' => $this->targetTimestamp,
            'data-units' => json_encode(array_column($this->units, 'key')),
            'data-complete-message' => $this->completeMessage,
        ];
    }

    public function render()
    {
        return view('keys::components.countdown', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
