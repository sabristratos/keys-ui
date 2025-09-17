
@if($iconLeft)
    <div class="absolute {{ $computedIconPosition }} {{ $computedIconOffsets['left'] }} pointer-events-none">
        <x-keys::icon name="{{ $iconLeft }}" size="{{ $computedIconSize }}" class="text-neutral" />
    </div>
@endif


<input {{ $inputAttributes }} data-input-actions="{{ $hasActions() ? 'true' : 'false' }}" />


@if($hasActions())
    <div class="absolute {{ $computedIconPosition }} right-2 flex gap-1">
        @foreach($computedActionData as $action)
            <div
                class="input-action"
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
    </div>
@endif


@if($iconRight && !$hasActions())
    <div class="absolute {{ $computedIconPosition }} {{ $computedIconOffsets['right'] }} pointer-events-none">
        <x-keys::icon name="{{ $iconRight }}" size="{{ $computedIconSize }}" class="text-neutral" />
    </div>
@endif