<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Editor Livewire Demo - {{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @vite(['resources/css/app.css', 'resources/js/app.js'])

        @livewireStyles
    </head>
    <body class="bg-body text-foreground font-sans">
        <script>

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
        </script>

        
        <nav class="bg-surface border-b border-border p-4">
            <div class="max-w-6xl mx-auto flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <h1 class="text-xl font-bold">Keys UI Testing</h1>
                    <div class="flex gap-4">
                        <a href="/" class="text-foreground/70 hover:text-foreground transition-colors">
                            Components Demo
                        </a>
                        <a href="/livewire-select-test" class="text-foreground/70 hover:text-foreground transition-colors">
                            Livewire Select Test
                        </a>
                        <a href="/editor-demo" class="text-brand font-medium">
                            Editor Demo
                        </a>
                        <a href="/test-toggle" class="text-foreground/70 hover:text-foreground transition-colors">
                            Toggle Test
                        </a>
                    </div>
                </div>

                
                <div class="flex gap-2 p-1 bg-body rounded-lg border border-border">
                    <button
                        onclick="setTheme('light')"
                        class="theme-btn px-3 py-1.5 text-sm font-medium rounded transition-colors"
                        data-theme="light"
                    >
                        Light
                    </button>
                    <button
                        onclick="setTheme('dark')"
                        class="theme-btn px-3 py-1.5 text-sm font-medium rounded transition-colors"
                        data-theme="dark"
                    >
                        Dark
                    </button>
                    <button
                        onclick="setTheme('system')"
                        class="theme-btn px-3 py-1.5 text-sm font-medium rounded transition-colors"
                        data-theme="system"
                    >
                        System
                    </button>
                </div>
            </div>
        </nav>

        
        <main class="min-h-screen">
            @livewire('editor-demo')
        </main>

        
        <script>
            function setTheme(theme) {
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (theme === 'system') {
                    localStorage.removeItem('theme');
                    document.documentElement.classList.toggle('dark', systemDark);
                    document.documentElement.style.colorScheme = systemDark ? 'dark' : 'light';
                } else {
                    localStorage.setItem('theme', theme);
                    document.documentElement.classList.toggle('dark', theme === 'dark');
                    document.documentElement.style.colorScheme = theme;
                }

                updateThemeButtons();
            }

            function updateThemeButtons() {
                const currentTheme = localStorage.getItem('theme') || 'system';

                document.querySelectorAll('.theme-btn').forEach(btn => {
                    if (btn.dataset.theme === currentTheme) {
                        btn.classList.add('bg-brand', 'text-foreground-brand');
                        btn.classList.remove('hover:bg-surface');
                    } else {
                        btn.classList.remove('bg-brand', 'text-foreground-brand');
                        btn.classList.add('hover:bg-surface');
                    }
                });
            }

            updateThemeButtons();

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    document.documentElement.classList.toggle('dark', e.matches);
                    document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light';
                }
            });
        </script>

        @livewireScripts
        <keys:scripts />
    </body>
</html>
