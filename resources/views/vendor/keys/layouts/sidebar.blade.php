<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $title ?? config('app.name', 'Dashboard') }}</title>

    {{-- Custom Styles Stack --}}
    @stack('styles')

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    {{-- Keys UI Scripts (CSS + JS) --}}
    <x-keys::scripts />

    {{-- Livewire Styles (if Livewire is installed) --}}
    @if(class_exists(\Livewire\Livewire::class))
        @livewireStyles
    @endif
</head>
<body class="h-full overflow-hidden bg-base text-primary font-sans antialiased">
    {{-- Full-height Layout Container --}}
    <div class="h-full flex">
        @isset($sidebar)
            {{-- Custom sidebar content provided by page --}}
            {{ $sidebar }}
        @else
            {{-- Default sidebar with responsive header pattern --}}
            <x-keys::sidebar
                :id="$sidebarId ?? 'main-sidebar'"
                :width="$sidebarWidth ?? 'md'"
                :collapsible="$sidebarCollapsible ?? true"
                :collapsed="$sidebarCollapsed ?? true"
                :variant="$sidebarVariant ?? 'default'"
                :sticky="$sidebarSticky ?? false"
                :aria-label="$sidebarAriaLabel ?? 'Main navigation'"
                :title="$sidebarTitle ?? config('app.name', 'App')"
                :subtitle="$sidebarSubtitle ?? 'Dashboard'"
            >
                {{-- Built-in default logo (always present for consistency) --}}
                <x-slot:logo>
                    <div class="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                        <x-keys::icon :name="$sidebarLogoIcon ?? 'heroicon-o-squares-2x2'" size="sm" class="text-white" />
                    </div>
                </x-slot:logo>

            {{-- Navigation Content --}}
            <x-keys::sidebar.section heading="Main">
                <x-keys::sidebar.item href="#" icon="heroicon-o-home" active>
                    Dashboard
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-inbox">
                    Inbox
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-document-text">
                    Documents
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-calendar">
                    Calendar
                </x-keys::sidebar.item>
            </x-keys::sidebar.section>

            <x-keys::sidebar.divider />

            <x-keys::sidebar.section heading="Settings">
                <x-keys::sidebar.item href="#" icon="heroicon-o-cog-6-tooth">
                    Settings
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-question-mark-circle">
                    Help
                </x-keys::sidebar.item>
            </x-keys::sidebar.section>

                {{-- Sidebar Footer --}}
                <x-slot:footer>
                    <div class="p-4 border-t border-line">
                        <p class="text-xs text-muted">{{ config('app.name', 'App') }} v1.0</p>
                    </div>
                </x-slot:footer>
            </x-keys::sidebar>
        @endisset

        {{-- Main Content Area (auto-wrapped with Main component) --}}
        <x-keys::main
            :title="$title ?? null"
            :sidebar-id="$sidebarId ?? 'main-sidebar'"
            :show-mobile-toggle="$showMobileToggle ?? true"
            :padding="$padding ?? 'md'"
        >
            {{-- Page Content --}}
            {{ $slot }}
        </x-keys::main>
    </div>

    {{-- Custom Scripts Stack --}}
    @stack('scripts')

    {{-- Livewire Scripts (if Livewire is installed) --}}
    @if(class_exists(\Livewire\Livewire::class))
        @livewireScripts
    @endif
</body>
</html>
