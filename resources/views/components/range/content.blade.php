{{-- Range track container --}}
<div class="{{ $computedTrackClasses }} range-track"
     data-min="{{ $min }}"
     data-max="{{ $max }}"
     data-step="{{ $step }}"
     data-dual="{{ $dual ? 'true' : 'false' }}"
     data-disabled="{{ $disabled ? 'true' : 'false' }}"
     @if(!empty($computedTicks))
         data-ticks="{{ json_encode(array_column($computedTicks, 'value')) }}"
     @endif
     @if($showValues)
         class="{{ $computedTrackClasses }} range-track show-values"
     @endif>

    {{-- Range fill (the colored part) --}}
    @if($dual)
        <div class="{{ $computedFillClasses }} range-fill"
             style="left: {{ $computedPercentage[0] }}%; width: {{ $computedPercentage[1] - $computedPercentage[0] }}%;"></div>
    @else
        <div class="{{ $computedFillClasses }} range-fill"
             style="width: {{ $computedPercentage }}%;"></div>
    @endif

    {{-- Tick marks --}}
    @if($showTicks && !empty($computedTicks))
        @foreach($computedTicks as $tick)
            <div class="range-tick" style="left: {{ $tick['percentage'] }}%;">
                <div class="range-tick-label">{{ $tick['label'] }}</div>
            </div>
        @endforeach
    @endif

    {{-- Range handles --}}
    @if($dual)
        {{-- Min handle --}}
        <div class="{{ $computedHandleClasses }} range-handle"
             style="left: {{ $computedPercentage[0] }}%; top: 50%;"
             tabindex="{{ $disabled ? '-1' : '0' }}"
             role="slider"
             aria-label="Minimum value"
             aria-valuemin="{{ $min }}"
             aria-valuemax="{{ $maxValue }}"
             aria-valuenow="{{ $minValue }}"
             aria-valuetext="{{ $minValue }}"
             data-handle="min">

            @if($showValues)
                <div class="range-value-display" data-value-display="min">
                    {{ $minValue }}
                </div>
            @endif
        </div>

        {{-- Max handle --}}
        <div class="{{ $computedHandleClasses }} range-handle"
             style="left: {{ $computedPercentage[1] }}%; top: 50%;"
             tabindex="{{ $disabled ? '-1' : '0' }}"
             role="slider"
             aria-label="Maximum value"
             aria-valuemin="{{ $minValue }}"
             aria-valuemax="{{ $max }}"
             aria-valuenow="{{ $maxValue }}"
             aria-valuetext="{{ $maxValue }}"
             data-handle="max">

            @if($showValues)
                <div class="range-value-display" data-value-display="max">
                    {{ $maxValue }}
                </div>
            @endif
        </div>
    @else
        {{-- Single handle --}}
        <div class="{{ $computedHandleClasses }} range-handle"
             style="left: {{ $computedPercentage }}%; top: 50%;"
             tabindex="{{ $disabled ? '-1' : '0' }}"
             role="slider"
             aria-label="Value"
             aria-valuemin="{{ $min }}"
             aria-valuemax="{{ $max }}"
             aria-valuenow="{{ $value }}"
             aria-valuetext="{{ $value }}"
             data-handle="single">

            @if($showValues)
                <div class="range-value-display" data-value-display="single">
                    {{ $value }}
                </div>
            @endif
        </div>
    @endif

    {{-- Native range inputs for accessibility (hidden) --}}
    @if($dual)
        <input type="range"
               id="{{ $inputId }}-min"
               min="{{ $min }}"
               max="{{ $max }}"
               step="{{ $step }}"
               value="{{ $minValue }}"
               {{ $disabled ? 'disabled' : '' }}
               {{ $required ? 'required' : '' }}
               data-native-input="min"
               aria-label="Minimum value" />

        <input type="range"
               id="{{ $inputId }}-max"
               min="{{ $min }}"
               max="{{ $max }}"
               step="{{ $step }}"
               value="{{ $maxValue }}"
               {{ $disabled ? 'disabled' : '' }}
               {{ $required ? 'required' : '' }}
               data-native-input="max"
               aria-label="Maximum value" />
    @else
        <input type="range"
               id="{{ $inputId }}"
               min="{{ $min }}"
               max="{{ $max }}"
               step="{{ $step }}"
               value="{{ $value }}"
               {{ $disabled ? 'disabled' : '' }}
               {{ $required ? 'required' : '' }}
               data-native-input="single"
               aria-label="Value" />
    @endif
</div>