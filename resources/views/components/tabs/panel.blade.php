<div {{ $attributes->merge(array_merge(
    ['class' => $computedPanelClasses],
    $ariaAttributes,
    $styleAttributes
)) }}>
    {{ $slot }}
</div>