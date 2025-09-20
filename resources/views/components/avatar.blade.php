<div {{ $attributes->merge(['class' => $avatarClasses()]) }}>
    @if($hasImage())
        <img
            src="{{ $src }}"
            alt="{{ $alt }}"
            class="{{ $imageClasses() }}"
            @if($lazy) loading="lazy" @endif
        />
    @elseif($hasInitials())
        <span class="{{ $initialsClasses() }}">
            {{ $getInitials() }}
        </span>
    @else
        
        <span class="{{ $initialsClasses() }}">
            <x-keys::icon name="heroicon-o-user" :size="$size === 'xs' ? 'xs' : ($size === 'sm' ? 'sm' : 'md')" />
        </span>
    @endif

    @if($status)
        <span class="{{ $statusClasses() }}" aria-label="Status: {{ $status }}"></span>
    @endif
</div>