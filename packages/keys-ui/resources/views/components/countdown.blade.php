@php
    // Base container classes
    $containerClasses = match ($variant) {
        'boxed' => 'grid grid-flow-col gap-2 md:gap-4 text-center auto-cols-max',
        'inline' => 'inline-flex items-center gap-1',
        'minimal' => 'inline-flex items-center',
        default => 'grid grid-flow-col gap-2 md:gap-4 text-center auto-cols-max'
    };

    // Size-based classes for boxed variant
    $boxSizeClasses = match ($size) {
        'xs' => 'p-1.5',
        'sm' => 'p-2',
        'md' => 'p-2 md:p-3',
        'lg' => 'p-3 md:p-4',
        'xl' => 'p-4 md:p-5',
        default => 'p-2 md:p-3'
    };

    // Value text size classes
    $valueSizeClasses = match ($size) {
        'xs' => 'text-lg md:text-xl',
        'sm' => 'text-xl md:text-2xl',
        'md' => 'text-2xl md:text-4xl',
        'lg' => 'text-3xl md:text-5xl',
        'xl' => 'text-4xl md:text-6xl',
        default => 'text-2xl md:text-4xl'
    };

    // Inline/minimal value size classes
    $inlineValueSizeClasses = match ($size) {
        'xs' => 'text-sm',
        'sm' => 'text-base',
        'md' => 'text-lg',
        'lg' => 'text-xl',
        'xl' => 'text-2xl',
        default => 'text-lg'
    };

    // Label text size classes
    $labelSizeClasses = match ($size) {
        'xs' => 'text-xs',
        'sm' => 'text-xs',
        'md' => 'text-sm',
        'lg' => 'text-base',
        'xl' => 'text-lg',
        default => 'text-sm'
    };

    // Color classes for boxed variant
    $boxColorClasses = match ($color) {
        'brand' => 'bg-accent text-white',
        'success' => 'bg-success text-white',
        'warning' => 'bg-warning text-white',
        'danger' => 'bg-danger text-white',
        'info' => 'bg-info text-white',
        'neutral' => 'bg-elevation-1 text-primary border border-line',
        default => 'bg-elevation-1 text-primary border border-line'
    };

    // Color classes for inline/minimal variants
    $textColorClasses = match ($color) {
        'brand' => 'text-accent',
        'success' => 'text-success',
        'warning' => 'text-warning',
        'danger' => 'text-danger',
        'info' => 'text-info',
        'neutral' => 'text-primary',
        default => 'text-primary'
    };
@endphp

<div
    {{ $attributes->merge([
        'id' => $id,
        'class' => $containerClasses,
        'role' => 'timer',
        'aria-live' => 'polite',
        'aria-label' => 'Countdown timer'
    ])->merge($dataAttributes) }}
>
    @if($variant === 'boxed')
        {{-- Boxed variant with individual unit boxes --}}
        @foreach($units as $unit)
            <div class="flex flex-col {{ $boxSizeClasses }} {{ $boxColorClasses }} rounded-lg">
                <div class="relative overflow-hidden countdown-{{ $unit['key'] }}"
                     data-unit="{{ $unit['key'] }}"
                     data-max="{{ $unit['max'] }}">
                    {{-- Flip card structure for animation --}}
                    <div class="relative h-full flex items-center justify-center">
                        <span
                            class="font-mono {{ $valueSizeClasses }} font-bold tabular-nums countdown-value"
                            aria-live="polite"
                            aria-label="{{ $unit['value'] }} {{ $unit['label'] }}"
                        >
                            {{ str_pad($unit['value'], 2, '0', STR_PAD_LEFT) }}
                        </span>
                        {{-- Animation layers will be added by JavaScript --}}
                        <span class="absolute inset-0 flex items-center justify-center font-mono {{ $valueSizeClasses }} font-bold tabular-nums countdown-next opacity-0 translate-y-[-100%]"></span>
                    </div>
                </div>
                @if($showLabels)
                    <span class="{{ $labelSizeClasses }} opacity-75 mt-1">
                        {{ $unit['label'] }}
                    </span>
                @endif
            </div>
        @endforeach
    @elseif($variant === 'inline')
        {{-- Inline variant with compact display --}}
        @foreach($units as $index => $unit)
            <div class="flex items-baseline {{ $textColorClasses }}">
                <div class="relative overflow-hidden countdown-{{ $unit['key'] }}"
                     data-unit="{{ $unit['key'] }}"
                     data-max="{{ $unit['max'] }}">
                    <span
                        class="font-mono {{ $inlineValueSizeClasses }} font-semibold tabular-nums countdown-value inline-block"
                        aria-label="{{ $unit['value'] }} {{ $unit['label'] }}"
                    >
                        {{ str_pad($unit['value'], 2, '0', STR_PAD_LEFT) }}
                    </span>
                    <span class="absolute inset-0 font-mono {{ $inlineValueSizeClasses }} font-semibold tabular-nums countdown-next opacity-0 translate-y-[-100%]"></span>
                </div>
                @if($showLabels)
                    <span class="{{ $labelSizeClasses }} ml-0.5 opacity-75">
                        {{ substr($unit['label'], 0, 1) }}
                    </span>
                @endif
                @if($index < count($units) - 1)
                    <span class="{{ $inlineValueSizeClasses }} mx-1 opacity-50">:</span>
                @endif
            </div>
        @endforeach
    @else
        {{-- Minimal variant with just numbers --}}
        <div class="font-mono {{ $inlineValueSizeClasses }} {{ $textColorClasses }} font-semibold tabular-nums inline-flex items-center">
            @foreach($units as $index => $unit)
                <div class="relative overflow-hidden countdown-{{ $unit['key'] }} inline-block"
                     data-unit="{{ $unit['key'] }}"
                     data-max="{{ $unit['max'] }}">
                    <span
                        class="countdown-value inline-block"
                        aria-label="{{ $unit['value'] }} {{ $unit['label'] }}"
                    >{{ str_pad($unit['value'], 2, '0', STR_PAD_LEFT) }}</span>
                    <span class="absolute inset-0 countdown-next opacity-0 translate-y-[-100%]"></span>
                </div>@if($index < count($units) - 1)<span class="opacity-50">:</span>@endif
            @endforeach
        </div>
    @endif

    {{-- Hidden complete message that will be shown when countdown ends --}}
    @if($completeMessage)
        <div
            class="countdown-complete hidden {{ $variant === 'boxed' ? 'col-span-full text-center' : '' }} {{ $textColorClasses }}"
            style="display: none;"
        >
            {{ $completeMessage }}
        </div>
    @endif

    {{-- Fallback for no-JS: show target date/time --}}
    <noscript>
        <div class="{{ $textColorClasses }} text-sm">
            Countdown to: {{ $formattedTarget }}
        </div>
    </noscript>
</div>