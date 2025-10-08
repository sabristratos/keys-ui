
@php

    $baseClasses = 'max-w-sm w-fit h-fit rounded-lg shadow-lg text-primary z-[9999] p-0 overflow-visible opacity-100';

    $variantClasses = match ($variant) {
        'success' => 'border border-success bg-success-subtle',
        'warning' => 'border border-warning bg-warning-subtle',
        'danger' => 'border border-danger bg-danger-subtle',
        'info' => 'border border-info bg-info-subtle',
        'neutral' => 'border border-line bg-elevation-1',
        default => 'border border-info bg-info-subtle'
    };

    $iconWrapperClasses = match ($variant) {
        'success' => 'bg-success text-white',
        'warning' => 'bg-warning text-black',
        'danger' => 'bg-danger text-white',
        'info' => 'bg-info text-white',
        'neutral' => 'bg-muted text-white',
        default => 'bg-info text-white'
    };

    $ariaLive = in_array($variant, ['danger', 'warning']) ? 'assertive' : 'polite';
@endphp

<div {{ $attributes->merge(['class' => "$baseClasses $variantClasses"])->merge($dataAttributes) }}
     id="{{ $id }}"
     popover="manual"
     role="status"
     aria-live="{{ $ariaLive }}"
     aria-atomic="true"
     @if(!empty($title)) aria-labelledby="{{ $id }}-title" @endif
     aria-describedby="{{ $id }}-message"
     tabindex="-1">

    <div class="px-4 pt-4 pb-3">
        <div class="flex {{ empty($title) ? 'items-center' : 'items-start' }} gap-3">
            
            @if($getVariantIcon())
                <div class="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center {{ $iconWrapperClasses }}">
                    <x-keys::icon :name="$getVariantIcon()" size="md" />
                </div>
            @endif

            
            <div class="flex-1 min-w-0">
                
                @if(!empty($title))
                    <x-keys::heading level="h3" size="sm" color="heading" weight="semibold" tracking="tight" id="{{ $id }}-title" class="mb-1">
                        {{ $title }}
                    </x-keys::heading>
                @endif


                <x-keys::text element="div" size="sm" color="text" leading="tight" id="{{ $id }}-message" class="opacity-90">
                    @if(!empty($message))
                        {{ $message }}
                    @else
                        {{ $slot }}
                    @endif
                </x-keys::text>
            </div>

            
            @if($dismissible)
                <div class="flex-shrink-0">
                    <x-keys::button
                        variant="ghost"
                        size="xs"
                        icon="heroicon-o-x-mark"
                        class="text-current opacity-60 hover:opacity-100 -m-1"
                        :data-toast-dismiss="$id"
                        aria-label="Close {{ $variant }} notification{{ !empty($title) ? ': ' . $title : '' }}"
                        title="Close notification"
                    />
                </div>
            @endif
        </div>

        
        @isset($actions)
            <div class="flex gap-2 mt-3" data-toast-actions="true">
                {{ $actions }}
            </div>
        @endisset
    </div>
</div>