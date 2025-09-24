<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $title ?? 'Keys UI Demo' }} - Keys UI Component Library</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <x-keys::scripts />

    @livewireStyles
</head>
<body class="bg-body text-foreground font-sans antialiased">
    <script>
        // Prevent FOUC and handle initial theme detection
        (function() {
            const theme = localStorage.getItem('theme');
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (theme === 'dark' || (!theme && systemDark)) {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
            }
        })();

        // Theme switching function
        function setTheme(theme) {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
                localStorage.setItem('theme', 'light');
            }
            updateThemeButtons();
        }

        function updateThemeButtons() {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            document.querySelectorAll('.theme-btn').forEach(btn => {
                const theme = btn.getAttribute('data-theme');
                if (theme === currentTheme) {
                    btn.classList.add('bg-brand', 'text-white');
                    btn.classList.remove('hover:bg-neutral/10');
                } else {
                    btn.classList.remove('bg-brand', 'text-white');
                    btn.classList.add('hover:bg-neutral/10');
                }
            });
        }

        // Initialize theme buttons when DOM loads
        document.addEventListener('DOMContentLoaded', updateThemeButtons);
    </script>

    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-surface border-b border-border sticky top-0 z-40">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <!-- Logo and title -->
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                                <x-keys::icon name="heroicon-o-squares-2x2" size="sm" class="text-white" />
                            </div>
                            <h1 class="text-xl font-bold">Keys UI Demo</h1>
                        </div>

                        @if(isset($title))
                            <x-keys::separator orientation="vertical" spacing="none" class="h-6" />
                            <h2 class="text-lg font-medium text-muted">{{ $title }}</h2>
                        @endif
                    </div>

                    <!-- Navigation and theme toggle -->
                    <div class="flex items-center gap-4">
                        <!-- Navigation links -->
                        <nav class="hidden md:flex items-center gap-2">
                            <a href="/" class="px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral/10 transition-colors">
                                Home
                            </a>
                            <a href="/user-demo" class="px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral/10 transition-colors">
                                User Demo
                            </a>
                            <a href="/livewire-select-test" class="px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral/10 transition-colors">
                                Select Test
                            </a>
                        </nav>

                        <x-keys::separator orientation="vertical" spacing="none" class="h-6" />

                        <!-- Theme toggle -->
                        <div class="flex gap-1 p-1 bg-surface rounded-lg border border-border">
                            <button
                                onclick="setTheme('light')"
                                class="theme-btn px-2 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1"
                                data-theme="light"
                                title="Light mode"
                            >
                                <x-keys::icon name="heroicon-o-sun" size="xs" />
                                <span class="hidden sm:inline">Light</span>
                            </button>
                            <button
                                onclick="setTheme('dark')"
                                class="theme-btn px-2 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1"
                                data-theme="dark"
                                title="Dark mode"
                            >
                                <x-keys::icon name="heroicon-o-moon" size="xs" />
                                <span class="hidden sm:inline">Dark</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main content -->
        <main class="flex-1">
            {{ $slot }}
        </main>

        <!-- Footer -->
        <footer class="bg-surface border-t border-border mt-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="text-center text-sm text-muted">
                    <p class="mb-2">
                        <strong>Keys UI Component Library</strong> - A comprehensive Blade components library for Laravel 12
                    </p>
                    <p class="flex items-center justify-center gap-1">
                        Built with
                        <x-keys::icon name="heroicon-o-heart" size="xs" class="text-danger" />
                        using Laravel {{ app()->version() }}, Livewire 3, and Tailwind CSS
                    </p>
                </div>
            </div>
        </footer>
    </div>

    @livewireScripts
</body>
</html>
