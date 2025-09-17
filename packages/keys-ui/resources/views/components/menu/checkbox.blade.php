
<label {{ $attributes->merge($computedLabelAttributes)->merge($computedDataAttributes) }}>
    @if($hasIcon())
        <x-keys::icon :name="$icon" :size="$iconSize()" class="{{ $computedIconClasses }}" />
    @endif

    <input {{ $attributes->merge($computedCheckboxAttributes) }}>

    <div class="{{ $computedContentClasses }}">
        <span class="{{ $computedLabelClasses }}">
            {{ $slot }}
        </span>
    </div>
</label>