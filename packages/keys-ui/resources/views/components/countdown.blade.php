@php
    // Determine classes based on variant and size
    $containerClasses = match ($variant) {
        'boxed' => 'grid grid-flow-col auto-cols-max gap-2 md:gap-4',
        'inline' => 'flex w-fit items-end justify-center gap-x-3 md:gap-x-4',
        default => 'flex w-fit items-end justify-center gap-x-3 md:gap-x-4',
    };

    $unitContainerClasses = match ($variant) {
        'boxed' => 'flex flex-col items-center rounded-lg bg-gray-800 p-2 text-white',
        default => 'flex flex-col items-center',
    };

    $valueClasses = 'relative w-full overflow-hidden font-mono font-semibold tabular-nums' . match ($size) {
        'sm' => ' h-[1em] text-lg',
        'md' => ' h-[1.1em] text-2xl',
        'lg' => ' h-[1.2em] text-4xl',
        'xl' => ' h-[1.2em] text-5xl',
        default => 'h-[1.1em] text-2xl',
    };

    $labelClasses = 'mt-1 uppercase opacity-70' . match ($size) {
        'sm' => ' text-[10px]',
        'md' => ' text-xs',
        'lg' => ' text-sm',
        'xl' => ' text-base',
        default => 'text-xs',
    };

    $completeMessageClasses = 'font-semibold' . match ($size) {
        'sm' => ' text-lg',
        'md' => ' text-2xl',
        'lg' => ' text-4xl',
        'xl' => ' text-5xl',
        default => 'text-2xl',
    };
@endphp

<div
    {{ $attributes->merge([
        'id' => $id,
        'role' => 'timer',
        'aria-live' => 'polite',
        'class' => $containerClasses,
    ])->merge($dataAttributes) }}
>
    @foreach ($units as $unit)
        <div class="{{ $unitContainerClasses }}" data-unit-container="{{ $unit['key'] }}">
            <div class="{{ $valueClasses }}">
                {{-- These two spans will swap roles to create a continuous animation --}}
                <span
                    class="block transition-all duration-300 ease-in-out"
                    data-span-a-for="{{ $unit['key'] }}"
                >00</span>

                <span
                    class="absolute inset-0 block -translate-y-full opacity-0 transition-all duration-300 ease-in-out"
                    data-span-b-for="{{ $unit['key'] }}"
                ></span>
            </div>

            @if ($showLabels)
                <span class="{{ $labelClasses }}">{{ $unit['label'] }}</span>
            @endif
        </div>
    @endforeach

    {{-- This message is shown on completion --}}
    <div class="countdown-complete hidden {{ $completeMessageClasses }}">{{ $completeMessage }}</div>

    <noscript>
        <div>Countdown requires JavaScript.</div>
    </noscript>
</div>
