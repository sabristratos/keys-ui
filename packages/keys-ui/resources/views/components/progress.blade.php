@php

    $baseClasses = 'progress-wrapper';

    $heightClasses = match ($size) {
        'xs' => 'h-1',
        'sm' => 'h-2',
        'md' => 'h-3',
        'lg' => 'h-4',
        'xl' => 'h-6',
        default => 'h-3'
    };

    $textClasses = match ($size) {
        'xs', 'sm' => 'text-xs',
        'md' => 'text-sm',
        'lg', 'xl' => 'text-base',
        default => 'text-sm'
    };

    $colorClasses = match ($color) {
        'brand' => 'bg-accent',
        'success' => 'bg-success',
        'warning' => 'bg-warning',
        'danger' => 'bg-danger',
        'info' => 'bg-info',
        'neutral' => 'bg-neutral',
        default => 'bg-accent'
    };

    $containerClasses = "progress-container relative overflow-hidden rounded-full bg-line {$heightClasses}";

    $barClasses = "progress-bar h-full rounded-full transition-all duration-300 ease-out {$colorClasses}";

    if ($animated) {
        $barClasses .= ' progress-animated';
    } elseif ($striped) {
        $barClasses .= ' progress-striped';
    }

    $wrapperAttributes = $attributes->merge([
        'class' => $baseClasses
    ])->merge($dataAttributes);

    if ($id) {
        $wrapperAttributes = $wrapperAttributes->merge(['id' => $id]);
    }
@endphp

<div {{ $wrapperAttributes }}>
    
    @if($label || $showValue || $showPercentage)
        <div class="progress-header flex items-center justify-between mb-2">
            @if($label)
                <span class="progress-label font-medium text-primary {{ $textClasses }}">
                    {{ $label }}
                </span>
            @endif

            @if($showValue || $showPercentage)
                <span class="progress-value text-muted {{ $textClasses }}">
                    {{ $displayValue }}
                </span>
            @endif
        </div>
    @endif

    
    <div
        class="{{ $containerClasses }}"
        role="progressbar"
        aria-valuenow="{{ $value }}"
        aria-valuemin="0"
        aria-valuemax="{{ $max }}"
        aria-label="{{ $ariaLabel }}"
    >
        
        <div
            class="{{ $barClasses }}"
            style="width: {{ $percentage }}%"
            data-progress-value="{{ $value }}"
            data-progress-max="{{ $max }}"
            data-progress-percentage="{{ $percentage }}"
        ></div>
    </div>

    
    @if($status)
        <div class="progress-status mt-1">
            <span class="text-muted {{ $textClasses }}">
                {{ $status }}
            </span>
        </div>
    @endif
</div>

<style>
    .progress-animated .progress-bar {
        background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
        );
        background-size: 1rem 1rem;
        animation: progress-bar-stripes 1s linear infinite;
    }

    .progress-striped .progress-bar {
        background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
        );
        background-size: 1rem 1rem;
    }

    @keyframes progress-bar-stripes {
        0% {
            background-position-x: 1rem;
        }
    }
</style>