@php
    $attributes = $attributes->except(['title', 'icon', 'collapsed', 'disabled', 'color', 'size', 'actions', 'actionVariant', 'actionSize', 'animated']);
@endphp

<details
    id="{{ $id }}"
    class="{{ $detailsClasses() }}"
    {{ $collapsed ? '' : 'open' }}
    {{ $disabled ? 'disabled' : '' }}
    @if($animated) data-accordion="true" @endif
    {{ $attributes }}
>
    <summary class="{{ $summaryClasses() }}" @if($disabled) tabindex="-1" @endif>
        <div class="flex items-center gap-3 flex-1 min-w-0">
            @if($title)
                <span class="font-medium truncate">{{ $title }}</span>
            @endif
        </div>

        <div class="flex items-center gap-2 ml-auto">
            @if($hasActions())
                <div class="flex items-center gap-1">
                    @foreach($computedActionData as $action)
                        <div class="input-action"
                             data-action="{{ $action['data_action'] }}"
                             @if($action['data_url']) data-url="{{ $action['data_url'] }}" @endif
                             @if($action['data_icon_toggle']) data-icon-toggle="{{ $action['data_icon_toggle'] }}" @endif
                             @if($action['data_icon_success']) data-icon-success="{{ $action['data_icon_success'] }}" @endif
                             @if($action['data_label_toggle']) data-label-toggle="{{ $action['data_label_toggle'] }}" @endif
                             @if($action['data_label_success']) data-label-success="{{ $action['data_label_success'] }}" @endif>
                            <x-keys::button
                                :variant="$actionVariant"
                                :size="$computedActionSize"
                                :icon="$action['icon']"
                                :data-icon-default="$action['data_icon_default']"
                                :data-icon-toggle="$action['data_icon_toggle']"
                                :data-icon-success="$action['data_icon_success']"
                                :data-label-toggle="$action['data_label_toggle']"
                                :data-label-success="$action['data_label_success']"
                                onclick="event.stopPropagation();">
                                <span class="sr-only">{{ $action['label'] }}</span>
                                @if($action['is_multi_state'])
                                    <span class="button-icon-default {{ $action['icon'] === $action['data_icon_default'] ? 'opacity-100' : 'opacity-0' }} transition-opacity duration-200">
                                        <x-keys::icon :name="$action['data_icon_default']" :size="$computedActionSize" />
                                    </span>
                                    @if($action['data_icon_toggle'])
                                        <span class="button-icon-toggle {{ $action['icon'] === $action['data_icon_toggle'] ? 'opacity-100' : 'opacity-0' }} absolute inset-0 flex items-center justify-center transition-all duration-200">
                                            <x-keys::icon :name="$action['data_icon_toggle']" :size="$computedActionSize" />
                                        </span>
                                    @endif
                                    @if($action['data_icon_success'])
                                        <span class="button-icon-success opacity-0 absolute inset-0 flex items-center justify-center transition-all duration-200">
                                            <x-keys::icon :name="$action['data_icon_success']" :size="$computedActionSize" />
                                        </span>
                                    @endif
                                @endif
                            </x-keys::button>
                        </div>
                    @endforeach
                </div>
            @endif

            @if($icon)
                <div class="{{ $iconClasses() }}">
                    <x-keys::icon :name="$icon" :size="$iconSize()" />
                </div>
            @endif
        </div>
    </summary>

    <div class="{{ $contentClasses() }}">
        {{ $slot }}
    </div>

    <style>
        /* Remove default summary styling */
        [data-accordion] summary {
            list-style: none;
        }

        [data-accordion] summary::-webkit-details-marker {
            display: none;
        }

        /* Ensure content doesn't overflow during animation */
        [data-accordion][animating] {
            overflow: hidden;
        }

        /* Handle focus styles for summary */
        [data-accordion] summary:focus {
            outline: 2px solid transparent;
            outline-offset: 2px;
        }

        [data-accordion] summary:focus-visible {
            @apply ring-2 ring-offset-2 ring-brand/50;
        }

        /* Disabled state */
        [data-accordion][disabled] summary {
            pointer-events: none;
        }


        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
            [data-accordion] * {
                transition-duration: 0.01ms !important;
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
            }
        }
    </style>
</details>