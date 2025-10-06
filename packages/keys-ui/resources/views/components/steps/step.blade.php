@php

    $parentVariant = $attributes->get('data-parent-variant', 'numbered');
    $parentSize = $attributes->get('data-parent-size', 'md');
    $parentOrientation = $attributes->get('data-parent-orientation', 'horizontal');
    $isLastStep = $attributes->get('data-is-last', false);
    $stepCount = $attributes->get('data-step-count', 1);

    $isComplete = $status === 'complete';
    $isCurrent = $status === 'current';
    $isPending = $status === 'pending';

    $wrapperClasses = 'group flex h-max items-start justify-start';

    $opacityClasses = $isPending ? 'opacity-60' : '';

    $gapClasses = match ($parentSize) {
        'sm' => 'gap-2',
        'md' => 'gap-3',
        'lg' => 'gap-4',
        default => 'gap-3'
    };

    $flexDirection = $parentOrientation === 'horizontal'
        ? 'flex-col items-center'
        : 'flex-row';

    $indicatorColumnClasses = 'flex flex-col items-center self-stretch';

    $indicatorSize = match ($parentSize) {
        'sm' => 'size-5',
        'md' => 'size-6',
        'lg' => 'size-8',
        default => 'size-6'
    };

    $iconSize = match ($parentSize) {
        'sm' => 'size-2.5',
        'md' => 'size-3',
        'lg' => 'size-4',
        default => 'size-3'
    };

    $textSize = match ($parentSize) {
        'sm' => 'text-xs',
        'md' => 'text-xs',
        'lg' => 'text-sm',
        default => 'text-xs'
    };

    $titleSize = match ($parentSize) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        default => 'sm'
    };

    $descriptionSize = match ($parentSize) {
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'sm',
        default => 'sm'
    };

    $indicatorClasses = '';
    if ($parentVariant === 'numbered') {
        if ($isComplete) {
            $indicatorClasses = "flex items-center justify-center rounded-full bg-success text-white {$indicatorSize}";
        } elseif ($isCurrent) {
            $indicatorClasses = "flex items-center justify-center rounded-full bg-accent ring-2 ring-accent ring-offset-base ring-offset-2 text-white {$indicatorSize}";
        } else {
            $indicatorClasses = "flex items-center justify-center rounded-full bg-elevation-1 ring-1 ring-inset ring-line text-muted {$indicatorSize}";
        }
    } elseif ($parentVariant === 'icon') {
        $iconBoxSize = match ($parentSize) {
            'sm' => 'size-10',
            'md' => 'size-12',
            'lg' => 'size-14',
            default => 'size-12'
        };
        if ($isComplete) {
            $indicatorClasses = "relative flex shrink-0 items-center justify-center *:data-icon:size-6 bg-elevation-1 shadow-xs-skeumorphic ring-1 ring-inset ring-success {$iconBoxSize} rounded-[10px] text-success";
        } elseif ($isCurrent) {
            $indicatorClasses = "relative flex shrink-0 items-center justify-center *:data-icon:size-6 bg-elevation-1 shadow-xs-skeumorphic ring-1 ring-inset ring-accent {$iconBoxSize} rounded-[10px] text-accent";
        } else {
            $indicatorClasses = "relative flex shrink-0 items-center justify-center *:data-icon:size-6 bg-elevation-1 shadow-xs-skeumorphic ring-1 ring-inset ring-line {$iconBoxSize} rounded-[10px] text-muted";
        }
    } elseif ($parentVariant === 'dots') {
        if ($isComplete) {
            $indicatorClasses = "flex items-center justify-center rounded-full bg-success {$indicatorSize}";
        } elseif ($isCurrent) {
            $indicatorClasses = "flex items-center justify-center rounded-full bg-accent ring-2 ring-accent ring-offset-base ring-offset-2 {$indicatorSize}";
        } else {
            $indicatorClasses = "flex items-center justify-center rounded-full bg-line {$indicatorSize}";
        }
    }

    $connectorClasses = 'my-1 flex-1 rounded-xs';
    if ($parentOrientation === 'horizontal') {

        $showConnector = !$isLastStep;
    } else {

        $showConnector = !$isLastStep;
        $connectorClasses .= $isComplete ? ' border-l-2 border-success' : ' border-l-2 border-line';
    }

    $contentPaddingClasses = $isLastStep ? '' : 'not-group-last:pb-6';

    $textAlignment = $parentOrientation === 'horizontal'
        ? 'text-left md:text-center'
        : 'text-left';

    $titleColor = $isPending ? 'muted' : 'text';

    $contentMargin = match ($parentSize) {
        'sm' => 'mb-2 md:mb-0',
        'md' => 'mb-3 md:mb-0',
        'lg' => 'mb-4 md:mb-0',
        default => 'mb-3 md:mb-0'
    };

    $contentWrapperClasses = $parentOrientation === 'horizontal'
        ? "flex w-full flex-col items-start self-stretch gap-0 md:items-center {$contentMargin}"
        : 'flex flex-col items-start';

    $stepWrapperClasses = $parentOrientation === 'horizontal'
        ? 'flex w-full flex-col items-center justify-center gap-3 max-md:flex-row max-md:items-start max-md:justify-start'
        : "{$wrapperClasses} {$flexDirection} {$opacityClasses} {$gapClasses}";

    $indicatorWrapperClasses = $parentOrientation === 'horizontal'
        ? 'relative flex w-full flex-col items-center self-stretch max-md:items-center'
        : $indicatorColumnClasses;
@endphp

@if($parentOrientation === 'horizontal')
    
    <div class="{{ $stepWrapperClasses }}" {{ collect($dataAttributes)->map(fn($v, $k) => "{$k}=\"{$v}\"")->implode(' ') }}>
        
        <div class="{{ $indicatorWrapperClasses }}">
            <span class="z-10 shrink-0 {{ $indicatorClasses }}">
                @if($parentVariant === 'numbered')
                    @if($isComplete)
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="{{ $iconSize }}">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    @elseif($isCurrent)
                        <span class="rounded-full bg-white {{ match($parentSize) { 'sm' => 'size-1.5', 'md' => 'size-2', 'lg' => 'size-2.5', default => 'size-2' } }}"></span>
                    @else
                        <span class="font-semibold {{ $textSize }}">{{ $index }}</span>
                    @endif
                @elseif($parentVariant === 'icon')
                    @if($icon)
                        <x-keys::icon :name="$icon" size="md" />
                    @else
                        <span class="font-semibold {{ $textSize }}">{{ $index }}</span>
                    @endif
                @elseif($parentVariant === 'dots')
                    @if($isCurrent)
                        <span class="rounded-full bg-white {{ match($parentSize) { 'sm' => 'size-1.5', 'md' => 'size-2', 'lg' => 'size-2.5', default => 'size-2' } }}"></span>
                    @endif
                @endif
            </span>

            @if($showConnector)
                
                @if($parentVariant === 'numbered' || $parentVariant === 'dots')
                    <div class="relative flex h-full w-full justify-center self-center overflow-hidden {{ $opacityClasses }} my-1 md:hidden">
                        <svg class="absolute" width="3">
                            <line x1="1.2" y1="1.2" x2="1.2" y2="100%"
                                  class="{{ $isComplete ? 'stroke-success' : 'stroke-line' }}"
                                  stroke="currentColor"
                                  stroke-width="2.4"
                                  stroke-dasharray="{{ $isComplete ? '0' : '0,6' }}"
                                  stroke-linecap="round">
                            </line>
                        </svg>
                    </div>
                @else
                    
                    <span class="{{ $connectorClasses }} md:hidden"></span>
                @endif


                <svg class="absolute top-1/2 left-[53%] z-0 h-[2.5px] w-full flex-1 -translate-y-1/2 hidden md:block">
                    <line x1="1.2" y1="1.2" x2="100%" y2="1.2"
                          class="{{ $isComplete ? 'stroke-success' : 'stroke-line' }}"
                          stroke="currentColor"
                          stroke-width="2.4"
                          stroke-dasharray="{{ $isComplete ? '0' : '0,6' }}"
                          stroke-linecap="round">
                    </line>
                </svg>
            @endif
        </div>


        <div class="{{ $contentWrapperClasses }} {{ $opacityClasses }}">
            <x-keys::text :size="$titleSize" :color="$titleColor" weight="semibold" :class="'w-full ' . $textAlignment">
                {{ $title }}
            </x-keys::text>
            @if($description)
                <x-keys::text :size="$descriptionSize" color="muted" :class="'w-full ' . $textAlignment">
                    {{ $description }}
                </x-keys::text>
            @endif
        </div>
    </div>
@else
    
    <div class="{{ $stepWrapperClasses }}" {{ collect($dataAttributes)->map(fn($v, $k) => "{$k}=\"{$v}\"")->implode(' ') }}>
        
        <div class="{{ $indicatorColumnClasses }}">
            <div class="shrink-0 {{ $indicatorClasses }}">
                @if($parentVariant === 'numbered')
                    @if($isComplete)
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="{{ $iconSize }}">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    @elseif($isCurrent)
                        <span class="rounded-full bg-white {{ match($parentSize) { 'sm' => 'size-1.5', 'md' => 'size-2', 'lg' => 'size-2.5', default => 'size-2' } }}"></span>
                    @else
                        <span class="font-semibold {{ $textSize }}">{{ $index }}</span>
                    @endif
                @elseif($parentVariant === 'icon')
                    @if($icon)
                        <x-keys::icon :name="$icon" size="md" />
                    @else
                        <span class="font-semibold {{ $textSize }}">{{ $index }}</span>
                    @endif
                @elseif($parentVariant === 'dots')
                    @if($isCurrent)
                        <span class="rounded-full bg-white {{ match($parentSize) { 'sm' => 'size-1.5', 'md' => 'size-2', 'lg' => 'size-2.5', default => 'size-2' } }}"></span>
                    @endif
                @endif
            </div>

            @if($showConnector)
                @if($parentVariant === 'numbered' || $parentVariant === 'dots')

                    <div class="relative flex h-full w-full justify-center self-center overflow-hidden {{ $opacityClasses }} my-1">
                        <svg class="absolute" width="3">
                            <line x1="1.2" y1="1.2" x2="1.2" y2="100%"
                                  class="{{ $isComplete ? 'stroke-success' : 'stroke-line' }}"
                                  stroke="currentColor"
                                  stroke-width="2.4"
                                  stroke-dasharray="{{ $isComplete ? '0' : '0,6' }}"
                                  stroke-linecap="round">
                            </line>
                        </svg>
                    </div>
                @else
                    
                    <span class="{{ $connectorClasses }}"></span>
                @endif
            @endif
        </div>


        <div class="flex flex-col items-start pt-0.5 {{ $contentPaddingClasses }}">
            <x-keys::text :size="$titleSize" :color="$titleColor" weight="semibold">
                {{ $title }}
            </x-keys::text>
            @if($description)
                <x-keys::text :size="$descriptionSize" color="muted">
                    {{ $description }}
                </x-keys::text>
            @endif
        </div>
    </div>
@endif
