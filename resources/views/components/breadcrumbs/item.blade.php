@php
    $isIconOnly = $isIconOnly($slot->toHtml() ?? '');

    $linkAttributes = $attributes->except(['class', 'separator']);

    if ($isLink()) {
        $linkAttributes = $linkAttributes->merge([
            'href' => $href,
            'class' => $computedLinkClasses,
        ]);
    } else {
        $linkAttributes = $linkAttributes->merge([
            'class' => $computedLinkClasses,
            'aria-current' => 'page',
        ]);
    }
@endphp

<li class="{{ $computedItemClasses }}">
    @if($isLink())
        <a {{ $linkAttributes }}>
            @if($hasIcon() && !$isIconOnly)
                <x-keys::icon name="{{ $icon }}" size="sm" class="inline mr-1 flex-shrink-0" />
                <span class="{{ $computedTextClasses }}">{{ $slot }}</span>
            @elseif($hasIcon() && $isIconOnly)
                <x-keys::icon name="{{ $icon }}" size="sm" class="inline" />
            @else
                <span class="{{ $computedTextClasses }}">{{ $slot }}</span>
            @endif
        </a>
    @else
        <span {{ $linkAttributes }}>
            @if($hasIcon() && !$isIconOnly)
                <x-keys::icon name="{{ $icon }}" size="sm" class="inline mr-1 flex-shrink-0" />
                <span class="{{ $computedTextClasses }}">{{ $slot }}</span>
            @elseif($hasIcon() && $isIconOnly)
                <x-keys::icon name="{{ $icon }}" size="sm" class="inline" />
            @else
                <span class="{{ $computedTextClasses }}">{{ $slot }}</span>
            @endif
        </span>
    @endif

    
    @if($showSeparator())
        <div class="{{ $computedSeparatorClasses }}" aria-hidden="true">
            @if($separatorIcon)
                <x-keys::icon name="{{ $separatorIcon }}" size="xs" />
            @elseif($separatorText)
                {{ $separatorText }}
            @endif
        </div>
    @endif
</li>