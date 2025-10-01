<div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-surface">
    {{-- Mobile Header with Logo and Sidebar Toggle (no border) --}}
    @if($showMobileToggle)
        <header class="flex-shrink-0 bg-surface lg:hidden">
            <div class="flex items-center justify-between p-4">
                {{-- Logo (consistent with sidebar) --}}
                <div class="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
                    <x-keys::icon name="heroicon-o-squares-2x2" size="sm" class="text-white" />
                </div>

                {{-- Menu Toggle --}}
                <x-keys::button
                    variant="ghost"
                    size="sm"
                    icon-left="heroicon-o-bars-3"
                    :data-sidebar-toggle="$sidebarId"
                    data-keys-sidebar-toggle="true"
                    title="Open menu"
                ></x-keys::button>
            </div>
        </header>
    @endif

    {{-- Optional Custom Header Slot --}}
    @isset($header)
        <header class="flex-shrink-0">
            {{ $header }}
        </header>
    @endisset

    {{-- Scrollable Main Content Area --}}
    <main class="flex-1 overflow-y-auto overflow-x-hidden bg-body rounded-t-xl border-t border-l border-r border-border">
        <div class="{{ $paddingClasses }}">
            {{ $slot }}
        </div>
    </main>

    {{-- Optional Footer Slot --}}
    @isset($footer)
        <footer class="flex-shrink-0 bg-surface border-t border-border">
            {{ $footer }}
        </footer>
    @endisset
</div>
