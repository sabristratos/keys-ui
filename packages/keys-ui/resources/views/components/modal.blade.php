@php

    $dialogClasses = 'w-full h-full max-w-none max-h-none m-0 p-0 border-0 bg-transparent';
    if ($animate) {
        $dialogClasses .= ' transition-opacity transition-transform duration-300 ease-out starting:opacity-0 starting:scale-95';
    }

    $backdropClasses = match ($backdrop) {
        'dark' => 'backdrop:bg-black/75',
        'blur' => 'backdrop:bg-black/50 backdrop:backdrop-blur-sm',
        'none' => 'backdrop:bg-transparent',
        default => 'backdrop:bg-black/50'
    };
    $dialogClasses .= ' ' . $backdropClasses;

    $containerClasses = 'flex w-full h-full p-4';
    if ($centered) {
        $containerClasses .= ' items-center justify-center';
    } else {
        $containerClasses .= ' items-start justify-center pt-16';
    }

    $modalClasses = 'relative bg-elevation-1 border border-line shadow-xl rounded-lg';

    $sizeClasses = match ($size) {
        'xs' => 'w-full max-w-xs',
        'sm' => 'w-full max-w-sm',
        'md' => 'w-full max-w-md',
        'lg' => 'w-full max-w-lg',
        'xl' => 'w-full max-w-xl',
        'full' => 'max-w-full w-full max-h-full',
        default => 'max-w-md'
    };

    if ($scrollable && $size !== 'full') {
        $modalClasses .= ' max-h-[80vh] flex flex-col';
    }

    $modalClasses .= ' ' . $sizeClasses;

    $headerClasses = 'flex items-center justify-between p-6 border-b border-line';
    if ($scrollable) {
        $headerClasses .= ' flex-shrink-0';
    }

    $bodyClasses = 'p-6';
    if ($scrollable) {
        $bodyClasses .= ' flex-1 overflow-y-auto';
    }

    $footerClasses = 'flex items-center justify-end gap-3 p-6 border-t border-line';
    if ($scrollable) {
        $footerClasses .= ' flex-shrink-0';
    }

    $dialogAttributes = $attributes
        ->except(['header', 'footer', 'wire:model', 'wire:open', 'wire:close', 'wire:escape', 'wire:cancel', '@open', '@close', '@escape', '@cancel'])
        ->merge([
            'id' => $id,
            'class' => $dialogClasses,
            'closedby' => $closedby,
        ])
        ->merge($livewireAttributes)
        ->merge($eventAttributes)
        ->merge($dataAttributes);
@endphp

<dialog {{ $dialogAttributes }}>
    <div class="{{ $containerClasses }}">
        <div class="{{ $modalClasses }}" role="document">

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
    </div>


    @if($isLivewireEnabled)
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const modal = document.getElementById('{{ $id }}');
                if (!modal) return;

                if (typeof Livewire !== 'undefined') {
                    Livewire.on('openModal', (data) => {
                        if (data.id === '{{ $id }}' || data.modal === '{{ $id }}') {
                            modal.showModal();
                        }
                    });

                    Livewire.on('closeModal', (data) => {
                        if (!data.id || data.id === '{{ $id }}' || data.modal === '{{ $id }}') {
                            modal.close();
                        }
                    });

                    modal.addEventListener('close', () => {
                        @if($wireModelAttribute)
                            @this.set('{{ $wireModelAttribute }}', false);
                        @endif

                        Livewire.dispatch('modalClosed', { id: '{{ $id }}' });

                        @if($eventAttributes['@close'] ?? false)
                            {{ $eventAttributes['@close'] }};
                        @endif

                        @if($eventAttributes['wire:close'] ?? false)
                            @this.{{ $eventAttributes['wire:close'] }};
                        @endif
                    });

                    modal.addEventListener('cancel', (event) => {
                        Livewire.dispatch('modalCancelled', { id: '{{ $id }}' });

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

                    modal.addEventListener('modal:open', () => {
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
/* ===== SCROLLABLE MODAL SUPPORT ===== */
/* Scrollable modal body styling */
dialog[data-keys-modal="true"][data-scrollable="true"] main {
    max-height: calc(80vh - 12rem);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgb(156 163 175 / 0.5) transparent;
}

dialog[data-keys-modal="true"][data-scrollable="true"] main::-webkit-scrollbar {
    width: 6px;
}

dialog[data-keys-modal="true"][data-scrollable="true"] main::-webkit-scrollbar-track {
    background: transparent;
}

dialog[data-keys-modal="true"][data-scrollable="true"] main::-webkit-scrollbar-thumb {
    background: rgb(156 163 175 / 0.5);
    border-radius: 3px;
}

dialog[data-keys-modal="true"][data-scrollable="true"] main::-webkit-scrollbar-thumb:hover {
    background: rgb(156 163 175 / 0.7);
}

/* ===== FOCUS MANAGEMENT ===== */
/* Remove default focus outline on dialog */
dialog[data-keys-modal="true"]:focus-visible {
    outline: none;
}

/* Focus styling for close buttons and interactive elements */
dialog[data-keys-modal="true"] [data-modal-close]:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
}

/* ===== SIZE VARIANT ANIMATIONS ===== */
/* Different animation scales for different modal sizes */
dialog[data-keys-modal="true"][data-size="xs"][data-animate="true"] {
    transform: scale(0.9);
}

dialog[data-keys-modal="true"][data-size="xl"][data-animate="true"],
dialog[data-keys-modal="true"][data-size="full"][data-animate="true"] {
    transform: scale(0.98);
}

/* ===== RESPONSIVE BEHAVIOR ===== */
/* Mobile-specific modal behavior */
@media (max-width: 640px) {
    dialog[data-keys-modal="true"] {
        margin: 1rem;
    }

    dialog[data-keys-modal="true"][data-scrollable="true"] main {
        max-height: calc(80vh - 8rem);
    }
}

/* ===== LIVEWIRE INTEGRATION ENHANCEMENTS ===== */
/* Enhanced styling for Livewire modals */
dialog[data-keys-modal="true"][data-livewire-enabled="true"] {
    /* Livewire-specific optimizations can be added here */
}

/* ===== DARK MODE SUPPORT ===== */
/* Dark mode backdrop adjustments */
@media (prefers-color-scheme: dark) {
    dialog[data-keys-modal="true"]::backdrop {
        background: rgb(0 0 0 / 0.7);
    }

    dialog[data-keys-modal="true"][data-backdrop="dark"]::backdrop {
        background: rgb(0 0 0 / 0.85);
    }
}

</style>
@endonce
