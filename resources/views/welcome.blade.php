<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @vite(['resources/css/app.css', 'resources/js/app.js'])
        @keysAssets
    </head>
    <body class="bg-body text-foreground font-sans">
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
        </script>
        <div class="min-h-screen p-8">
            <div class="max-w-4xl mx-auto">
                <header class="text-center mb-8">
                    <h1 class="text-3xl font-bold mb-3">Keys UI Components Testing</h1>
                    <p class="text-foreground/60 mb-4">
                        Testing Image and Calendar components after refactoring
                    </p>
                    <div class="flex justify-center gap-2 p-1 bg-surface rounded-lg border border-border">
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

                        // Initialize theme buttons
                        updateThemeButtons();

                        // Listen for system theme changes
                        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                            if (!localStorage.getItem('theme')) {
                                document.documentElement.classList.toggle('dark', e.matches);
                                document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light';
                            }
                        });
                    </script>
                </header>

                <div class="space-y-12">
                    <!-- Image Component -->
                    <section class="space-y-6">
                        <div>
                            <h2 class="text-2xl font-bold mb-4">Image Component</h2>
                            <p class="text-foreground/70 mb-6">Responsive images with overlays, aspect ratios, and captions</p>
                        </div>
                        <!-- Hero Image with Overlay -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Hero Image with Overlay Content</h3>
                            <x-keys::image
                                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
                                alt="Cozy bedroom with neatly made bed"
                                size="full"
                                aspect="16/9"
                                class="rounded-lg overflow-hidden"
                            >
                                <x-slot:overlay>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                    <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 class="text-2xl font-bold mb-2">Luxury Bedroom Suite</h3>
                                        <p class="text-white/90 mb-4">Experience ultimate comfort in our premium accommodations with modern amenities and stunning city views.</p>
                                        <x-keys::button variant="brand" size="md">
                                            Book Now
                                        </x-keys::button>
                                    </div>
                                </x-slot:overlay>
                            </x-keys::image>
                        </div>
                    </section>

                    <!-- Calendar Component - Multi-Month Range Demo -->
                    <section class="space-y-6">
                        <div>
                            <h2 class="text-2xl font-bold mb-4">Calendar Component - Multi-Month Range Demo</h2>
                            <p class="text-foreground/70 mb-6">Testing calendar functionality after refactoring</p>
                        </div>

                        <!-- Three Months with Range Selection -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Three Months with Range Selection</h3>
                            <x-keys::calendar
                                name="three_months_range"
                                label="Multi-Month Range Selection"
                                :monthsToShow="3"
                                :isRange="true"
                                startDate="{{ now()->addDays(10)->format('Y-m-d') }}"
                                endDate="{{ now()->addDays(45)->format('Y-m-d') }}"
                            />
                        </div>

                        <!-- Test Info -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-3">Refactoring Test Results</h3>
                            <div class="text-sm text-foreground/70 space-y-2">
                                <p><strong>✅ Completed Refactoring:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Extracted calendar content into shared partial (eliminated template duplication)</li>
                                    <li>Refactored constructor into smaller, focused initialization methods</li>
                                    <li>Cleaned up CSS architecture and removed !important declarations</li>
                                    <li>Added comprehensive inline documentation for range selection logic</li>
                                    <li>Standardized method naming conventions throughout Calendar class</li>
                                    <li>Improved computed methods pattern consistency with other Keys UI components</li>
                                </ul>
                                <p class="mt-3"><strong>🧪 Test the following functionality:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Date range selection (click start date, then end date)</li>
                                    <li>Multi-month navigation (previous/next month buttons)</li>
                                    <li>Month/year dropdown selection</li>
                                    <li>Keyboard navigation (arrow keys, Enter, Escape)</li>
                                    <li>Range visual feedback and styling</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </body>
</html>