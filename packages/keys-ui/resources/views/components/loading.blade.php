@php

    $sizeClasses = match ($size) {
        'xs' => 'w-3 h-3',
        'sm' => 'w-4 h-4',
        'md' => 'w-5 h-5',
        'lg' => 'w-6 h-6',
        'xl' => 'w-8 h-8',
        default => 'w-5 h-5'
    };

    $animationClasses = match ($animation) {
        'spinner' => 'animate-spin',
        'pulse' => 'animate-ping',
        'bounce' => 'animate-bounce',
        'dots' => 'animate-bounce',
        'bars' => 'animate-pulse',
        'wave' => 'animate-pulse',
        default => 'animate-spin'
    };

    $loadingAttributes = $attributes->merge($dataAttributes);

    if ($id) {
        $loadingAttributes = $loadingAttributes->merge(['id' => $id]);
    }
@endphp

@if($animation === 'spinner')
    
    <svg {{ $loadingAttributes->merge(['class' => "inline-flex {$sizeClasses} {$animationClasses}"]) }} fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

@elseif($animation === 'dots')
    
    <div {{ $loadingAttributes->merge(['class' => 'inline-flex gap-1 items-center']) }}>
        <div class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
        <div class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
        <div class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
    </div>

@elseif($animation === 'bars')
    
    <div {{ $loadingAttributes->merge(['class' => 'inline-flex gap-1 items-end h-4']) }}>
        <div class="w-1 bg-current rounded-full animate-pulse h-2" style="animation-delay: 0ms;"></div>
        <div class="w-1 bg-current rounded-full animate-pulse h-3" style="animation-delay: 150ms;"></div>
        <div class="w-1 bg-current rounded-full animate-pulse h-4" style="animation-delay: 300ms;"></div>
        <div class="w-1 bg-current rounded-full animate-pulse h-3" style="animation-delay: 450ms;"></div>
        <div class="w-1 bg-current rounded-full animate-pulse h-2" style="animation-delay: 600ms;"></div>
    </div>

@elseif($animation === 'pulse')
    
    <div {{ $loadingAttributes->merge(['class' => "inline-flex relative {$sizeClasses}"]) }}>
        <div class="absolute inset-0 bg-current rounded-full animate-ping opacity-40 scale-110"></div>
        <div class="relative bg-current rounded-full {{ $sizeClasses }}"></div>
    </div>

@elseif($animation === 'wave')
    
    <div {{ $loadingAttributes->merge(['class' => 'inline-flex gap-1 items-center']) }}>
        <div class="w-1 h-4 bg-current rounded-full animate-pulse" style="animation-delay: 0ms;"></div>
        <div class="w-1 h-6 bg-current rounded-full animate-pulse" style="animation-delay: 100ms;"></div>
        <div class="w-1 h-4 bg-current rounded-full animate-pulse" style="animation-delay: 200ms;"></div>
        <div class="w-1 h-6 bg-current rounded-full animate-pulse" style="animation-delay: 300ms;"></div>
        <div class="w-1 h-4 bg-current rounded-full animate-pulse" style="animation-delay: 400ms;"></div>
    </div>

@elseif($animation === 'bounce')
    
    <div {{ $loadingAttributes->merge(['class' => 'inline-flex gap-1 items-center']) }}>
        <div class="w-3 h-3 bg-current rounded-full animate-bounce" style="animation-delay: 0.7s;"></div>
        <div class="w-3 h-3 bg-current rounded-full animate-bounce" style="animation-delay: 0.3s;"></div>
        <div class="w-3 h-3 bg-current rounded-full animate-bounce" style="animation-delay: 0.7s;"></div>
    </div>

@else
    
    <div {{ $loadingAttributes->merge(['class' => "inline-flex {$sizeClasses} {$animationClasses} bg-current rounded-full"]) }}></div>
@endif