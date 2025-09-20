@php
    $dialogAttributes = $attributes
        ->except(['header', 'footer', 'wire:model', 'wire:open', 'wire:close', 'wire:escape', 'wire:cancel', '@open', '@close', '@escape', '@cancel'])
        ->merge([
            'id' => $id,
            'class' => $computedDialogClasses,
            'closedby' => $closedby,
            'data-modal' => true,
        ])
        ->merge($livewireAttributes);

    if ($animate) {
        $dialogAttributes = $dialogAttributes->merge(['data-modal-animate' => true]);
    }

    $dialogAttributes = $dialogAttributes->merge($eventAttributes);
@endphp

<dialog {{ $dialogAttributes }}>
    <div class="{{ $computedContainerClasses }}">
        <div class="{{ $computedModalClasses }}" role="document">
            
            @isset($header)
                <header class="{{ $computedHeaderClasses }}">
                    {{ $header }}
                </header>
            @endisset

            
            <main class="{{ $computedBodyClasses }}">
                {{ $slot }}
            </main>

            
            @isset($footer)
                <footer class="{{ $computedFooterClasses }}">
                    {{ $footer }}
                </footer>
            @endisset
        </div>
    </div>

    
    <style>
        dialog[data-modal] {
            color: var(--color-foreground);
        }

        dialog[data-modal]::backdrop {
            background: rgba(0, 0, 0, 0.5);
            @if($backdrop === 'blur')
            backdrop-filter: blur(4px);
            @endif
        }

        /* Animation support for modal */
        @if($animate)
        dialog[data-modal-animate] {
            opacity: 0;
            transform: scale(0.95);
            transition: opacity 200ms ease-out, transform 200ms ease-out, overlay 200ms ease-out allow-discrete, display 200ms ease-out allow-discrete;
        }

        dialog[data-modal-animate][open] {
            opacity: 1;
            transform: scale(1);
        }

        dialog[data-modal-animate]::backdrop {
            opacity: 0;
            transition: opacity 200ms ease-out, overlay 200ms ease-out allow-discrete, display 200ms ease-out allow-discrete;
        }

        dialog[data-modal-animate][open]::backdrop {
            opacity: 1;
        }

        /* Starting style for entry animation */
        @starting-style {
            dialog[data-modal-animate][open] {
                opacity: 0;
                transform: scale(0.95);
            }

            dialog[data-modal-animate][open]::backdrop {
                opacity: 0;
            }
        }
        @endif

        /* Scrollable modal styles */
        @if($scrollable)
        dialog[data-modal] .modal-body {
            max-height: calc(80vh - 8rem);
            overflow-y: auto;
        }
        @endif

        /* Focus management */
        dialog[data-modal]:focus {
            outline: none;
        }

        dialog[data-modal] [data-modal-close]:focus-visible {
            outline: 2px solid var(--color-brand);
            outline-offset: 2px;
            border-radius: var(--radius-sm);
        }

        /* Livewire integration styles */
        dialog[data-modal-livewire] {
            /* Enhanced styles for Livewire modals */
        }

        dialog[data-modal-lazy] {
            /* Lazy loading placeholder styles */
        }

        dialog[data-modal-lazy]:not([open]) .modal-content {
            display: none;
        }

        /* Loading state for lazy modals */
        dialog[data-modal-lazy][data-loading] .modal-content::before {
            content: 'Loading...';
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--color-surface);
            z-index: 1;
        }

    </style>

    
    @if($isLivewireEnabled())
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
                        @if($getWireModelAttribute())
                            @this.set('{{ $getWireModelAttribute() }}', false);
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