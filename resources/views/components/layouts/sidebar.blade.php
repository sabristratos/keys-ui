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

        @livewireStyles
</head>
<body class="h-full overflow-hidden bg-base text-primary font-sans antialiased">
    {{-- Full-height Layout Container --}}
    <div class="h-full flex">

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
        @livewireScripts
</body>
</html>
