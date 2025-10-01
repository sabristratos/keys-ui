@php
    use Keys\UI\Components\Steps;

    $containerClasses = 'keys-steps w-full';

    $orientationClasses = match ($orientation) {
        'vertical' => 'flex flex-col',
        'horizontal' => 'flex flex-row items-start justify-start',
        default => 'flex flex-row items-start justify-start'
    };

    if ($orientation === 'horizontal') {

        $gridClasses = 'grid w-full grid-cols-1 md:auto-cols-fr md:grid-flow-col';
        $gridStyle = '';
    } else {

        $gridClasses = 'grid w-full grid-cols-1';
        $gridStyle = '';
    }

    $sizeClasses = '';

    $wrapperAttributes = $attributes->merge([
        'class' => $containerClasses,
        'id' => $id
    ])->merge($dataAttributes);
@endphp

<div {{ $wrapperAttributes }} role="list">
    <div class="{{ $gridClasses }} {{ $sizeClasses }}" @if(isset($gridStyle) && $gridStyle) style="{{ $gridStyle }}" @endif>
        {{ $slot }}
    </div>
</div>
