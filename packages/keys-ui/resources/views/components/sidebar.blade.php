
@php
    // Base structure classes
    $baseClasses = 'flex flex-col h-screen transition-all duration-300 ease-in-out';

    // Visual variant styling
    $variantClasses = match ($variant) {
        'bordered' => 'bg-surface border-r border-border',
        'elevated' => 'bg-surface shadow-lg',
        'transparent' => 'bg-transparent',
        default => 'bg-surface'
    };

    // Position in layout
    $positionClasses = match ($position) {
        'right' => 'order-last',
        default => ''
    };

    // Sticky positioning
    $stickyClasses = $sticky ? 'sticky top-0' : '';

    $sidebarClasses = trim("{$baseClasses} {$variantClasses} {$positionClasses} {$stickyClasses}");
@endphp

<nav
    id="{{ $id }}"
    {{ $attributes->merge(['class' => $sidebarClasses . ($collapsible && $collapsed ? ' sidebar-collapsed' : '')])->merge($dataAttributes)->merge($ariaAttributes) }}
>
    {{-- Built-in header with title/subtitle or custom header slot --}}
    @if($title || isset($header))
        <div class="flex-shrink-0 p-2" data-sidebar-header>
            <div class="flex items-center gap-2 flex-wrap justify-center">
                {{-- Logo slot - shows on desktop when collapsed, always shows when expanded --}}
                @isset($logo)
                    <div data-sidebar-logo class="flex-shrink-0">
                        {{ $logo }}
                    </div>
                @endif

                {{-- Title and subtitle - hidden on mobile and when collapsed --}}
                @if($title)
                    <div class="flex-1 min-w-0" data-sidebar-branding>
                        <h2 class="font-bold text-lg text-foreground truncate">{{ $title }}</h2>
                        @if($subtitle)
                            <p class="text-xs text-muted truncate">{{ $subtitle }}</p>
                        @endif
                    </div>
                @endif

                {{-- Custom header content - shown when title is not provided --}}
                @if(!$title && isset($header))
                    <div class="flex-1 min-w-0" data-sidebar-custom-header>
                        {{ $header }}
                    </div>
                @endif

                {{-- Toggle button - always visible --}}
                @if($collapsible)
                    <div class="flex-shrink-0" data-sidebar-toggle-wrapper>
                        <x-keys::sidebar.toggle
                            :sidebar-id="$id"
                            variant="ghost"
                            size="sm"
                        />
                    </div>
                @endif
            </div>
        </div>
    @endif

    <div class="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin" data-sidebar-content>
        {{ $slot }}
    </div>

    @isset($footer)
        <div class="flex-shrink-0 border-t border-border" data-sidebar-footer>
            {{ $footer }}
        </div>
    @endisset
</nav>

@if($collapsible)
    {{-- Mobile overlay --}}
    <div
        data-sidebar-overlay
        data-sidebar-target="{{ $id }}"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 {{ $collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100' }}"
    ></div>
@endif
