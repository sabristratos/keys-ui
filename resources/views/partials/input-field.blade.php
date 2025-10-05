<div {{ $wrapperAttributes }}>
    @if($iconLeft)
        <div class="flex items-center {{ match($size) { 'xs' => 'pl-2.5', 'sm' => 'pl-3', 'md' => 'pl-3', 'lg' => 'pl-3.5', 'xl' => 'pl-4', default => 'pl-3' } }} pointer-events-none">
            <x-keys::icon name="{{ $iconLeft }}" size="{{ $iconSize }}" class="text-muted" data-icon />
        </div>
    @endif

    <input {{ $inputAttributes }} data-input-actions="{{ $hasActions() ? 'true' : 'false' }}" />

    @if($hasActions())
        <div class="flex items-center {{ match($size) { 'xs' => 'pr-2', 'sm' => 'pr-2', 'md' => 'pr-2', 'lg' => 'pr-2.5', 'xl' => 'pr-3', default => 'pr-2' } }} gap-1">
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
        </div>
    @elseif($iconRight)
        <div class="flex items-center {{ match($size) { 'xs' => 'pr-2.5', 'sm' => 'pr-3', 'md' => 'pr-3', 'lg' => 'pr-3.5', 'xl' => 'pr-4', default => 'pr-3' } }} pointer-events-none">
            <x-keys::icon name="{{ $iconRight }}" size="{{ $iconSize }}" class="text-muted" data-icon />
        </div>
    @endif
</div>
