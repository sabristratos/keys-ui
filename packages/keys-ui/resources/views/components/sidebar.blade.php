@php
    $widthClass = match ($width) {
        'xs' => 'w-48',
        'sm' => 'w-56',
        'lg' => 'w-72',
        'xl' => 'w-80',
        default => 'w-64',
    };

    $baseClasses = 'flex flex-col h-screen transition-all duration-300 ease-in-out';

    $variantClasses = match ($variant) {
        'bordered' => 'bg-elevation-1 border-r border-line',
        'elevated' => 'bg-elevation-1 shadow-lg',
        'transparent' => 'bg-transparent',
        default => 'bg-elevation-1'
    };
    if ($position === 'right') {
        $variantClasses = str_replace('border-r', 'border-l', $variantClasses);
    }

    $responsiveClasses = 'fixed inset-y-0 z-50 lg:relative lg:z-auto lg:inset-y-auto';
    if ($sticky) {
        $responsiveClasses .= ' lg:sticky lg:top-0';
    }

    $stateClasses = [
        $widthClass,
        'translate-x-0',
        $position === 'right' ? '[.sidebar-collapsed&]:translate-x-full' : '[.sidebar-collapsed&]:-translate-x-full',
        'lg:[.sidebar-collapsed&]:w-16',
        'lg:[.sidebar-collapsed&]:translate-x-0',
    ];

    $initialCollapsedClass = $collapsible && $collapsed ? 'sidebar-collapsed' : '';

    $allClasses = collect([$baseClasses, $variantClasses, $responsiveClasses])
        ->merge($stateClasses)
        ->push($initialCollapsedClass)
        ->filter()
        ->all();

@endphp

<nav
    id="{{ $id }}"
    {{ $attributes->class($allClasses)->merge($dataAttributes)->merge($ariaAttributes) }}
>
    @if($title || isset($header))
        <div class="flex-shrink-0 p-2" data-sidebar-header>
            <div class="flex items-center gap-2 flex-wrap justify-between lg:justify-center lg:[.sidebar-collapsed_&]:flex-col">
                @isset($logo)
                    <div data-sidebar-logo class="flex-shrink-0">
                        {{ $logo }}
                    </div>
                @endisset

                @if($title)
                    <div class="flex-1 min-w-0 lg:[.sidebar-collapsed_&]:hidden" data-sidebar-branding>
                        <h2 class="font-bold text-lg text-primary truncate">{{ $title }}</h2>
                        @if($subtitle)
                            <p class="text-xs text-muted truncate">{{ $subtitle }}</p>
                        @endif
                    </div>
                @endif

                @if(!$title && isset($header))
                    <div class="flex-1 min-w-0 lg:[.sidebar-collapsed_&]:hidden" data-sidebar-custom-header>
                        {{ $header }}
                    </div>
                @endif

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
        <div class="flex-shrink-0 border-t border-line lg:[.sidebar-collapsed_&]:hidden" data-sidebar-footer>
            {{ $footer }}
        </div>
    @endisset
</nav>

@if($collapsible)
    <div
        data-sidebar-overlay
        data-sidebar-target="{{ $id }}"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 {{ $collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100' }}"
    ></div>
@endif
