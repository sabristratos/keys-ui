@php

    $iconSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        'xl' => 'md',
        default => 'sm'
    };

    $computedActionSize = match ($actionSize) {
        'xs' => 'xs',
        'sm' => 'sm',
        'md' => 'md',
        default => 'xs'
    };
@endphp

<div {{ $wrapperAttributes }} data-keys-input-wrapper="true">
    
    @if($prefix || $iconLeft)
        <div class="flex items-center gap-2 {{ $leftSlotPadding }}" data-input-left-slot>
            @if($prefix)
                <span class="text-base text-muted select-none" data-prefix>{{ $prefix }}</span>
            @elseif($iconLeft)
                <div data-icon class="text-muted">
                    <x-keys::icon name="{{ $iconLeft }}" size="{{ $iconSize }}" />
                </div>
            @endif
        </div>
    @endif

    
    <input {{ $inputAttributes }} data-input-actions="{{ $hasActions ? 'true' : 'false' }}" />

    
    @if($postfix || $iconRight || $hasActions)
        <div class="flex items-center gap-1 {{ $rightSlotPadding }}" data-input-right-slot>
            @if($hasActions)
                @foreach($computedActionData as $action)
                    <div
                        data-action="{{ $action['data_action'] }}"
                        data-icon-default="{{ $action['data_icon_default'] }}"
                        @if(isset($action['data_url'])) data-url="{{ $action['data_url'] }}" @endif
                        @if(isset($action['data_icon_toggle'])) data-icon-toggle="{{ $action['data_icon_toggle'] }}" @endif
                        @if(isset($action['data_icon_success'])) data-icon-success="{{ $action['data_icon_success'] }}" @endif
                        @if(isset($action['data_label_toggle'])) data-label-toggle="{{ $action['data_label_toggle'] }}" @endif
                        @if(isset($action['data_label_success'])) data-label-success="{{ $action['data_label_success'] }}" @endif
                    >
                        <x-keys::button
                            variant="{{ $actionVariant }}"
                            size="{{ $computedActionSize }}"
                            type="button"
                            icon="{{ $action['icon'] }}"
                            icon-toggle="{{ $action['icon_toggle'] }}"
                            icon-success="{{ $action['icon_success'] }}"
                            label-toggle="{{ $action['label_toggle'] }}"
                            label-success="{{ $action['label_success'] }}"
                            data-action="{{ $action['data_action'] }}"
                            data-url="{{ $action['data_url'] }}"
                        >
                            <span class="sr-only">{{ $action['label'] }}</span>
                        </x-keys::button>
                    </div>
                @endforeach
            @elseif($postfix)
                <span class="text-sm text-muted select-none" data-postfix>{{ $postfix }}</span>
            @elseif($iconRight)
                <div data-icon class="text-muted">
                    <x-keys::icon name="{{ $iconRight }}" size="{{ $iconSize }}" />
                </div>
            @endif
        </div>
    @endif
</div>
