
@php
    // Icon size based on input size
    $iconSize = match ($size) {
        'xs' => 'xs',
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md',
        'xl' => 'md',
        default => 'sm'
    };

    // Icon positioning classes
    $iconPositionClasses = 'absolute inset-y-0 flex items-center pointer-events-none';

    // Icon offset classes based on size
    $iconOffsets = match ($size) {
        'xs' => ['left' => 'left-2.5', 'right' => 'right-2.5'],
        'sm' => ['left' => 'left-3', 'right' => 'right-3'],
        'md' => ['left' => 'left-3', 'right' => 'right-3'],
        'lg' => ['left' => 'left-3.5', 'right' => 'right-3.5'],
        'xl' => ['left' => 'left-3.5', 'right' => 'right-3.5'],
        default => ['left' => 'left-3', 'right' => 'right-3']
    };

    // Action size and container classes
    $computedActionSize = match ($actionSize) {
        'xs' => 'xs',
        'sm' => 'sm',
        'md' => 'md',
        default => 'xs'
    };

    $actionContainerClasses = 'absolute inset-y-0 right-0 flex items-center gap-1 pr-2';
@endphp

@if($iconLeft)
    <div class="{{ $iconPositionClasses }} {{ $iconOffsets['left'] }}" data-icon>
        <x-keys::icon name="{{ $iconLeft }}" size="{{ $iconSize }}" class="text-neutral" />
    </div>
@endif

<input {{ $inputAttributes }} data-input-actions="{{ $hasActions() ? 'true' : 'false' }}" />

@if($hasActions())
    <div class="{{ $actionContainerClasses }}">
        @foreach($computedActionData as $action)
            @php
                // Apply action-specific styling directly
                $actionClasses = match($action['data_action']) {
                    'clear' => 'text-neutral-400 hover:text-danger',
                    'copy' => 'text-neutral-400 hover:text-brand data-[state=success]:text-success',
                    'password_toggle' => 'text-neutral-400 hover:text-neutral-600',
                    'external' => 'text-neutral-400 hover:text-brand',
                    default => 'text-neutral-400 hover:text-brand'
                };
            @endphp

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
                    class="{{ $actionClasses }}"
                >
                    <span class="sr-only">{{ $action['label'] }}</span>
                </x-keys::button>
            </div>
        @endforeach
    </div>
@endif

@if($iconRight && !$hasActions())
    <div class="{{ $iconPositionClasses }} {{ $iconOffsets['right'] }}" data-icon>
        <x-keys::icon name="{{ $iconRight }}" size="{{ $iconSize }}" class="text-neutral" />
    </div>
@endif