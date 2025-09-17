@if($iconExists())
    <x-dynamic-component :component="$iconName()" {{ $attributes->merge(['class' => $sizeClasses()]) }} />
@else
    <x-dynamic-component :component="$fallback" {{ $attributes->merge(['class' => $sizeClasses()]) }} />
@endif