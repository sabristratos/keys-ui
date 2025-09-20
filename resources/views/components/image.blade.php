@if($hasCaption())
    <figure {{ $attributes->merge(['class' => $figureClasses()]) }}>
        <div class="{{ $containerClasses() }}">
            <img
                src="{{ $src }}"
                alt="{{ $alt }}"
                class="{{ $imageClasses() }}"
                @if($lazy) loading="lazy" @endif
                @if($placeholder) style="background: {{ $placeholder }};" @endif
            />

            @if($hasOverlay())
                <div class="{{ $overlayClasses() }}" data-image-overlay>
                    {{ $slot }}
                </div>
            @endif
        </div>

        <figcaption class="mt-2 text-sm text-foreground/70">
            {{ $caption }}
        </figcaption>
    </figure>
@else
    <div {{ $attributes->merge(['class' => $containerClasses()]) }}>
        <img
            src="{{ $src }}"
            alt="{{ $alt }}"
            class="{{ $imageClasses() }}"
            @if($lazy) loading="lazy" @endif
            @if($placeholder) style="background: {{ $placeholder }};" @endif
        />

        @if($hasOverlay())
            <div class="{{ $overlayClasses() }}" data-image-overlay>
                {{ $slot }}
            </div>
        @endif
    </div>
@endif

@if($hasOverlay() && !empty(trim($slot)))
    <style>
        [data-image-overlay] {
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        [data-image-overlay] h1,
        [data-image-overlay] h2,
        [data-image-overlay] h3,
        [data-image-overlay] h4,
        [data-image-overlay] h5,
        [data-image-overlay] h6 {
            color: inherit;
        }

        [data-image-overlay] .btn,
        [data-image-overlay] button {
            margin-top: 1rem;
        }
    </style>
@endif