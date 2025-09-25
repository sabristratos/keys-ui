@php
    $dialogAttributes = $attributes
        ->except(['header', 'footer', 'wire:model', 'wire:open', 'wire:close', 'wire:escape', 'wire:cancel', '@open', '@close', '@escape', '@cancel'])
        ->merge([
            'id' => $id,
            'class' => $computedDialogClasses,
            'closedby' => $closedby,
            'data-modal' => true,
            'data-backdrop' => $backdrop,
            'data-scrollable' => $scrollable ? 'true' : 'false',
        ])
        ->merge($livewireAttributes);

    // All modals now use CSS animations by default

    $dialogAttributes = $dialogAttributes->merge($eventAttributes)->merge($dataAttributes);
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