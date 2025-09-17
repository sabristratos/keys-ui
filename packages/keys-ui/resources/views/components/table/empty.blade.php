@props(['computedEmptyClasses', 'computedIconClasses', 'computedTitleClasses', 'computedDescriptionClasses'])

<tr>
    <td {{ $attributes->merge(['colspan' => '100', 'class' => 'px-6 py-4 bg-surface border-t border-border']) }}>
        <div class="{{ $computedEmptyClasses }}">
            @if($icon)
                <x-keys::icon
                    :name="$icon"
                    size="{{ $getIconSize() }}"
                    class="{{ $computedIconClasses }}"
                />
            @endif

            @if($title)
                <h3 class="{{ $computedTitleClasses }}">
                    {{ $title }}
                </h3>
            @endif

            @if($description)
                <p class="{{ $computedDescriptionClasses }}">
                    {{ $description }}
                </p>
            @endif

            @if($hasAction())
                <x-keys::button
                    :href="$actionUrl"
                    variant="brand"
                    size="sm"
                >
                    {{ $actionText }}
                </x-keys::button>
            @endif

            {{ $slot }}
        </div>
    </td>
</tr>