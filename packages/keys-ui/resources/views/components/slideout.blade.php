@php

    $dialogClasses = 'fixed m-0 p-0 bg-elevation-1 shadow-xl overflow-y-auto';
    if ($animate) {
        $dialogClasses .= ' transition-transform transition-discrete duration-300 ease-out';
    }

    $backdropClasses = match ($backdrop) {
        'dark' => 'backdrop:bg-black/75',
        'blur' => 'backdrop:bg-black/50 backdrop:backdrop-blur-sm',
        'none' => 'backdrop:bg-transparent',
        default => 'backdrop:bg-black/50 backdrop:backdrop-blur-sm'
    };

    $positionClasses = match ($position) {
        'left' => 'mr-auto border-r border-line min-h-dvh max-h-dvh' . ($animate ? ' starting:-translate-x-full' : ''),
        'right' => 'ml-auto border-l border-line min-h-dvh max-h-dvh' . ($animate ? ' starting:translate-x-full' : ''),
        default => 'ml-auto border-l border-line min-h-dvh max-h-dvh' . ($animate ? ' starting:translate-x-full' : '')
    };

    if ($width) {
        $sizeClasses = "w-[$width]";
    } else {
        $sizeClasses = match ($size) {
            'xs' => 'w-80 max-w-[20rem]',
            'sm' => 'w-96 max-w-[24rem]',
            'md' => 'w-[28rem] max-w-[28rem]',
            'lg' => 'w-[32rem] max-w-[32rem]',
            'xl' => 'w-[40rem] max-w-[40rem]',
            'full' => 'w-full',
            default => 'w-[28rem] max-w-[28rem]'
        };
    }

    $allDialogClasses = "$dialogClasses $positionClasses $sizeClasses $backdropClasses";

    $headerClasses = 'flex items-center justify-between py-6 border-b border-line';
    if ($scrollable) {
        $headerClasses .= ' flex-shrink-0';
    }

    $bodyClasses = 'py-6';
    if ($scrollable) {
        $bodyClasses .= ' flex-1 overflow-y-auto';
    }

    $footerClasses = 'flex items-center justify-end gap-3 py-6 border-t border-line';
    if ($scrollable) {
        $footerClasses .= ' flex-shrink-0';
    }

    $dialogAttributes = $attributes
        ->except(['header', 'footer', 'wire:model', 'wire:open', 'wire:close', 'wire:escape', 'wire:cancel', '@open', '@close', '@escape', '@cancel'])
        ->merge([
            'id' => $id,
            'class' => $allDialogClasses,
            'closedby' => $closedby,
        ])
        ->merge($livewireAttributes)
        ->merge($eventAttributes)
        ->merge($dataAttributes);
@endphp

<dialog {{ $dialogAttributes }} role="document">
    <div class="relative w-full h-full p-6 {{ $scrollable ? 'flex flex-col' : '' }}">
        @if($dismissible)
            <x-keys::button
                variant="ghost"
                size="sm"
                icon="heroicon-o-x-mark"
                class="absolute top-4 right-4 z-10"
                onclick="this.closest('dialog').close()"
            />
        @endif

        @isset($header)
            <header class="{{ $headerClasses }}">
                {{ $header }}
            </header>
        @endisset

        <main class="{{ $bodyClasses }}">
            {{ $slot }}
        </main>

        @isset($footer)
            <footer class="{{ $footerClasses }}">
                {{ $footer }}
            </footer>
        @endisset
    </div>


    @if($isLivewireEnabled)
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const slideout = document.getElementById('{{ $id }}');
                if (!slideout) return;

                if (typeof Livewire !== 'undefined') {
                    Livewire.on('openSlideout', (data) => {
                        if (data.id === '{{ $id }}' || data.slideout === '{{ $id }}') {
                            slideout.showModal();
                        }
                    });

                    Livewire.on('closeSlideout', (data) => {
                        if (!data.id || data.id === '{{ $id }}' || data.slideout === '{{ $id }}') {
                            slideout.close();
                        }
                    });

                    slideout.addEventListener('close', () => {
                        @if($wireModelAttribute)
                            @this.set('{{ $wireModelAttribute }}', false);
                        @endif

                        Livewire.dispatch('slideoutClosed', { id: '{{ $id }}' });

                        @if($eventAttributes['@close'] ?? false)
                            {{ $eventAttributes['@close'] }};
                        @endif

                        @if($eventAttributes['wire:close'] ?? false)
                            @this.{{ $eventAttributes['wire:close'] }};
                        @endif
                    });

                    slideout.addEventListener('cancel', (event) => {
                        Livewire.dispatch('slideoutCancelled', { id: '{{ $id }}' });

                        @if($eventAttributes['@escape'] ?? false)
                            {{ $eventAttributes['@escape'] }};
                        @endif

                        @if($eventAttributes['wire:escape'] ?? false)
                            @this.{{ $eventAttributes['wire:escape'] }};
                        @endif

                        @if($eventAttributes['@cancel'] ?? false)
                            {{ $eventAttributes['@cancel'] }};
                        @endif

                        @if($eventAttributes['wire:cancel'] ?? false)
                            @this.{{ $eventAttributes['wire:cancel'] }};
                        @endif
                    });

                    slideout.addEventListener('slideout:open', () => {
                        @if($eventAttributes['@open'] ?? false)
                            {{ $eventAttributes['@open'] }};
                        @endif

                        @if($eventAttributes['wire:open'] ?? false)
                            @this.{{ $eventAttributes['wire:open'] }};
                        @endif
                    });
                }
            });
        </script>
    @endif
</dialog>

@once
<style>
/* Enable smooth transitions for discrete properties (display, overlay) */
@supports (transition-behavior: allow-discrete) {
    dialog[data-keys-slideout="true"] {
        transition: translate 0.3s ease-out,
                    display 0.3s allow-discrete,
                    overlay 0.3s allow-discrete;
    }
}

/* Exit state - dialog slides back when closing */
dialog[data-keys-slideout="true"][data-position="right"]:not([open]) {
    translate: 100% 0;
}

dialog[data-keys-slideout="true"][data-position="left"]:not([open]) {
    translate: -100% 0;
}

/* Entry state using @starting-style for smooth slide-in */
@starting-style {
    dialog[data-keys-slideout="true"][data-position="right"][open] {
        translate: 100% 0;
    }

    dialog[data-keys-slideout="true"][data-position="left"][open] {
        translate: -100% 0;
    }
}
</style>
@endonce
