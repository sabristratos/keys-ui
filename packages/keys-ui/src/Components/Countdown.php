<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

class Countdown extends Component
{
    public array $units = [];
    public string $formattedTarget;
    public int $targetTimestamp;

    public function __construct(
        public ?string $target = null,
        public ?int $days = null,
        public ?int $hours = null,
        public ?int $minutes = null,
        public ?int $seconds = null,
        public string $variant = 'boxed',
        public string $size = 'md',
        public string $color = 'neutral',
        public bool $showLabels = true,
        public bool $showDays = true,
        public bool $showHours = true,
        public bool $showMinutes = true,
        public bool $showSeconds = true,
        public ?string $id = null,
        public ?string $completeMessage = null,
        public bool $autoStart = true
    ) {
        // Generate ID if not provided
        $this->id = $this->id ?? 'countdown-' . uniqid();

        // Validate props
        $this->variant = ComponentConstants::validate($this->variant, ['boxed', 'inline', 'minimal'], 'boxed');
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_XS_TO_XL, 'md');
        $this->color = ComponentConstants::validate($this->color, ComponentConstants::COLORS_EXTENDED, 'neutral');

        // Calculate target timestamp
        $this->calculateTargetTimestamp();

        // Build units array based on what should be shown
        $this->buildUnits();
    }

    /**
     * Calculate the target timestamp from various input formats
     */
    private function calculateTargetTimestamp(): void
    {
        if ($this->target) {
            // If target is provided as a date/time string
            if (is_numeric($this->target)) {
                $this->targetTimestamp = (int) $this->target;
            } else {
                $this->targetTimestamp = strtotime($this->target);
            }
        } else {
            // Calculate from relative time units
            $now = time();
            $additionalSeconds = 0;

            if ($this->days !== null) {
                $additionalSeconds += $this->days * 86400;
            }
            if ($this->hours !== null) {
                $additionalSeconds += $this->hours * 3600;
            }
            if ($this->minutes !== null) {
                $additionalSeconds += $this->minutes * 60;
            }
            if ($this->seconds !== null) {
                $additionalSeconds += $this->seconds;
            }

            $this->targetTimestamp = $now + $additionalSeconds;
        }

        // Format target for display
        $this->formattedTarget = date('Y-m-d H:i:s', $this->targetTimestamp);
    }

    /**
     * Build the units array for display
     */
    private function buildUnits(): void
    {
        // Calculate initial values
        $now = time();
        $diff = max(0, $this->targetTimestamp - $now);

        $days = floor($diff / 86400);
        $hours = floor(($diff % 86400) / 3600);
        $minutes = floor(($diff % 3600) / 60);
        $seconds = $diff % 60;

        // Add units based on configuration
        if ($this->showDays) {
            $this->units[] = [
                'value' => $days,
                'label' => $days === 1 ? 'day' : 'days',
                'key' => 'days',
                'max' => 999
            ];
        }

        if ($this->showHours) {
            $this->units[] = [
                'value' => $this->showDays ? $hours : floor($diff / 3600),
                'label' => $hours === 1 ? 'hour' : 'hours',
                'key' => 'hours',
                'max' => $this->showDays ? 23 : 999
            ];
        }

        if ($this->showMinutes) {
            $this->units[] = [
                'value' => $this->showHours ? $minutes : floor($diff / 60),
                'label' => $minutes === 1 ? 'min' : 'min',
                'key' => 'minutes',
                'max' => $this->showHours ? 59 : 999
            ];
        }

        if ($this->showSeconds) {
            $this->units[] = [
                'value' => $this->showMinutes ? $seconds : $diff,
                'label' => $seconds === 1 ? 'sec' : 'sec',
                'key' => 'seconds',
                'max' => $this->showMinutes ? 59 : 999
            ];
        }
    }

    /**
     * Get data attributes for JavaScript integration
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-countdown' => 'true',
            'data-target' => $this->targetTimestamp,
            'data-variant' => $this->variant,
            'data-size' => $this->size,
            'data-color' => $this->color,
            'data-auto-start' => $this->autoStart ? 'true' : 'false',
        ];

        if ($this->completeMessage) {
            $attributes['data-complete-message'] = $this->completeMessage;
        }

        // Add unit visibility flags
        $attributes['data-show-days'] = $this->showDays ? 'true' : 'false';
        $attributes['data-show-hours'] = $this->showHours ? 'true' : 'false';
        $attributes['data-show-minutes'] = $this->showMinutes ? 'true' : 'false';
        $attributes['data-show-seconds'] = $this->showSeconds ? 'true' : 'false';
        $attributes['data-show-labels'] = $this->showLabels ? 'true' : 'false';

        return $attributes;
    }

    public function render()
    {
        return view('keys::components.countdown', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}