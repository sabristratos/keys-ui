
<div {{ $attributes->merge(['class' => $stackClasses]) }}>
    {{--
        The slot content will contain individual Avatar components.
        Note: To limit the number of avatars shown, users should pass only
        the desired avatars in the slot. The "+N more" functionality can be
        implemented by the developer by counting their data and passing a
        subset to the stack component.
    --}}
    {{ $slot }}
</div>