<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
        <div class="min-h-screen p-8">
            <div class="max-w-4xl mx-auto">
                <header class="text-center mb-12">
                    <h1 class="text-4xl font-bold mb-4">Keys UI Icons</h1>
                    <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
                        Icon component showcase with Heroicons integration
                    </p>
                    <button
                        onclick="document.documentElement.classList.toggle('dark')"
                        class="bg-brand text-on-brand px-4 py-2 rounded-lg font-medium hover:bg-brand-hover transition-colors"
                    >
                        Toggle Dark Mode
                    </button>
                </header>

                <div class="grid gap-12">
                    <section>
                        <h2 class="text-2xl font-bold mb-6">Icon Sizes</h2>
                        <div class="flex items-center gap-8 p-6 bg-surface-elevated rounded-lg">
                            <div class="text-center">
                                <x-keys::icon name="heroicon-o-star" size="xs" class="text-brand mx-auto mb-2" />
                                <p class="text-sm font-medium">Extra Small</p>
                                <p class="text-xs text-neutral-600 dark:text-neutral-400">12px</p>
                            </div>
                            <div class="text-center">
                                <x-keys::icon name="heroicon-o-star" size="sm" class="text-brand mx-auto mb-2" />
                                <p class="text-sm font-medium">Small</p>
                                <p class="text-xs text-neutral-600 dark:text-neutral-400">16px</p>
                            </div>
                            <div class="text-center">
                                <x-keys::icon name="heroicon-o-star" size="md" class="text-brand mx-auto mb-2" />
                                <p class="text-sm font-medium">Medium</p>
                                <p class="text-xs text-neutral-600 dark:text-neutral-400">20px</p>
                            </div>
                            <div class="text-center">
                                <x-keys::icon name="heroicon-o-star" size="lg" class="text-brand mx-auto mb-2" />
                                <p class="text-sm font-medium">Large</p>
                                <p class="text-xs text-neutral-600 dark:text-neutral-400">24px</p>
                            </div>
                            <div class="text-center">
                                <x-keys::icon name="heroicon-o-star" size="xl" class="text-brand mx-auto mb-2" />
                                <p class="text-sm font-medium">Extra Large</p>
                                <p class="text-xs text-neutral-600 dark:text-neutral-400">32px</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold mb-6">Icon Variants</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="p-6 bg-surface-elevated rounded-lg">
                                <h3 class="text-lg font-semibold mb-4">Outline Icons</h3>
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="text-center">
                                        <x-keys::icon name="heroicon-o-home" size="lg" class="text-brand mx-auto mb-2" />
                                        <p class="text-xs">Home</p>
                                    </div>
                                    <div class="text-center">
                                        <x-keys::icon name="heroicon-o-user" size="lg" class="text-brand mx-auto mb-2" />
                                        <p class="text-xs">User</p>
                                    </div>
                                    <div class="text-center">
                                        <x-keys::icon name="heroicon-o-cog-6-tooth" size="lg" class="text-brand mx-auto mb-2" />
                                        <p class="text-xs">Settings</p>
                                    </div>
                                </div>
                            </div>

                            <div class="p-6 bg-surface-elevated rounded-lg">
                                <h3 class="text-lg font-semibold mb-4">Solid Icons</h3>
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="text-center">
                                        <x-keys::icon name="heroicon-s-home" size="lg" class="text-brand mx-auto mb-2" />
                                        <p class="text-xs">Home</p>
                                    </div>
                                    <div class="text-center">
                                        <x-keys::icon name="heroicon-s-user" size="lg" class="text-brand mx-auto mb-2" />
                                        <p class="text-xs">User</p>
                                    </div>
                                    <div class="text-center">
                                        <x-keys::icon name="heroicon-s-cog-6-tooth" size="lg" class="text-brand mx-auto mb-2" />
                                        <p class="text-xs">Settings</p>
                                    </div>
                                </div>
                            </div>

                            <div class="p-6 bg-surface-elevated rounded-lg">
                                <h3 class="text-lg font-semibold mb-4">Mini Icons</h3>
                                <div class="grid grid-cols-3 gap-4">
                                    <div class="text-center">
                                        <x-keys::icon name="heroicon-m-home" size="lg" class="text-brand mx-auto mb-2" />
                                        <p class="text-xs">Home</p>
                                    </div>
                                    <div class="text-center">
                                        <x-keys::icon name="heroicon-m-user" size="lg" class="text-brand mx-auto mb-2" />
                                        <p class="text-xs">User</p>
                                    </div>
                                    <div class="text-center">
                                        <x-keys::icon name="heroicon-m-cog-6-tooth" size="lg" class="text-brand mx-auto mb-2" />
                                        <p class="text-xs">Settings</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold mb-6">Themed Icons</h2>
                        <div class="grid grid-cols-2 md:grid-cols-6 gap-4 p-6 bg-surface-elevated rounded-lg">
                            <div class="text-center">
                                <x-keys::icon name="heroicon-o-star" size="lg" class="text-brand mx-auto mb-2" />
                                <p class="text-xs font-medium">Brand</p>
                            </div>
                            <div class="text-center">
                                <x-keys::icon name="heroicon-o-heart" size="lg" class="text-danger mx-auto mb-2" />
                                <p class="text-xs font-medium">Danger</p>
                            </div>
                            <div class="text-center">
                                <x-keys::icon name="heroicon-o-check-circle" size="lg" class="text-success mx-auto mb-2" />
                                <p class="text-xs font-medium">Success</p>
                            </div>
                            <div class="text-center">
                                <x-keys::icon name="heroicon-o-exclamation-triangle" size="lg" class="text-warning mx-auto mb-2" />
                                <p class="text-xs font-medium">Warning</p>
                            </div>
                            <div class="text-center">
                                <x-keys::icon name="heroicon-o-information-circle" size="lg" class="text-info mx-auto mb-2" />
                                <p class="text-xs font-medium">Info</p>
                            </div>
                            <div class="text-center">
                                <x-keys::icon name="heroicon-o-adjustments-horizontal" size="lg" class="text-neutral mx-auto mb-2" />
                                <p class="text-xs font-medium">Neutral</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 class="text-2xl font-bold mb-6">Usage Examples</h2>
                        <div class="grid gap-6">
                            <div class="p-6 bg-surface-elevated rounded-lg">
                                <h3 class="text-lg font-semibold mb-4">Basic Usage</h3>
                                <div class="bg-neutral-900 text-neutral-100 p-4 rounded font-mono text-sm">
                                    <div>&lt;x-keys::icon name="heroicon-o-star" /&gt;</div>
                                    <div>&lt;x-keys::icon name="heroicon-o-star" size="lg" /&gt;</div>
                                    <div>&lt;x-keys::icon name="heroicon-o-star" size="lg" class="text-brand" /&gt;</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </body>
</html>