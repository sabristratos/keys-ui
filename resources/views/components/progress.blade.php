@php
    $percentage = $computedData['percentage'];
    $displayValue = $computedData['display_value'];
    $ariaLabel = $computedData['aria_label'];
    $isComplete = $computedData['is_complete'];
@endphp

<div {{ $attributes->merge(['class' => $baseClasses()]) }}>
    @if($label || $showValue || $showPercentage)
        <div class="progress-header flex items-center justify-between mb-2">
            @if($label)
                <span class="progress-label font-medium text-foreground {{ $textClasses() }}">
                    {{ $label }}
                </span>
            @endif

            @if($showValue || $showPercentage)
                <span class="progress-value text-muted {{ $textClasses() }}">
                    {{ $displayValue }}
                </span>
            @endif
        </div>
    @endif

    <div class="{{ $containerClasses() }}" role="progressbar" aria-valuenow="{{ $value }}" aria-valuemin="0" aria-valuemax="{{ $max }}" aria-label="{{ $ariaLabel }}">
        <div
            class="{{ $barClasses() }}"
            style="width: {{ $percentage }}%"
            data-progress-value="{{ $value }}"
            data-progress-max="{{ $max }}"
            data-progress-percentage="{{ $percentage }}"
        ></div>
    </div>

    @if($status)
        <div class="progress-status mt-1">
            <span class="text-muted {{ $textClasses() }}">
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