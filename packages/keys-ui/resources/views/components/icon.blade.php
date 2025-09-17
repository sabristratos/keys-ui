@if($iconExists())
    @svg($iconName(), $attributes->merge(['class' => $sizeClasses()]))
@else
    @svg($fallback, $attributes->merge(['class' => $sizeClasses()]))
@endif