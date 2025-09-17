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
                    <h1 class="text-3xl font-bold mb-3">Keys UI Components</h1>
                    <p class="text-foreground/60 mb-4">
                        Avatar, Badge, Breadcrumbs, and Modal components showcase
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
                                updateThemeButtons();
                            }
                        });
                    </script>
                </header>

                <!-- Components Showcase -->
                <div class="bg-surface rounded-xl border border-border p-6">
                    <div class="space-y-8">
                        <!-- Breadcrumbs Components -->
                        <section class="space-y-4">
                            <h2 class="text-lg font-semibold border-b border-border pb-2">Breadcrumbs Components</h2>

                            <div class="space-y-6">
                                <!-- Basic breadcrumbs -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Basic Breadcrumbs</h3>
                                    <x-keys::breadcrumbs>
                                        <x-keys::breadcrumbs.item href="#">Home</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item href="#">Blog</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item>Post</x-keys::breadcrumbs.item>
                                    </x-keys::breadcrumbs>
                                </div>

                                <!-- Slash separator -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Slash Separator</h3>
                                    <x-keys::breadcrumbs>
                                        <x-keys::breadcrumbs.item href="#" separator="slash">Home</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item href="#" separator="slash">Blog</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item separator="slash">Post</x-keys::breadcrumbs.item>
                                    </x-keys::breadcrumbs>
                                </div>

                                <!-- Icon-only items -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Icon-Only Items (Auto-Detected)</h3>
                                    <x-keys::breadcrumbs>
                                        <x-keys::breadcrumbs.item href="#" icon="heroicon-o-home" />
                                        <x-keys::breadcrumbs.item href="#">Blog</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item>Post</x-keys::breadcrumbs.item>
                                    </x-keys::breadcrumbs>
                                </div>

                                <!-- Ellipsis breadcrumbs -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Truncated with Ellipsis</h3>
                                    <x-keys::breadcrumbs>
                                        <x-keys::breadcrumbs.item href="#" icon="heroicon-o-home" />
                                        <x-keys::breadcrumbs.item icon="heroicon-o-ellipsis-horizontal" />
                                        <x-keys::breadcrumbs.item>Post</x-keys::breadcrumbs.item>
                                    </x-keys::breadcrumbs>
                                </div>

                                <!-- Mixed icons and text -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Mixed Icons and Text</h3>
                                    <x-keys::breadcrumbs>
                                        <x-keys::breadcrumbs.item href="#" icon="heroicon-o-home">Home</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item href="#" icon="heroicon-o-document-text">Blog</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item icon="heroicon-o-pencil">Edit Post</x-keys::breadcrumbs.item>
                                    </x-keys::breadcrumbs>
                                </div>

                                <!-- Long breadcrumb chain for responsive testing -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Long Chain (Responsive)</h3>
                                    <x-keys::breadcrumbs>
                                        <x-keys::breadcrumbs.item href="#" icon="heroicon-o-home">Home</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item href="#">E-commerce</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item href="#">Categories</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item href="#">Electronics</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item href="#">Computers & Laptops</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item href="#">Gaming Laptops</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item>Very Long Product Name with Many Details</x-keys::breadcrumbs.item>
                                    </x-keys::breadcrumbs>
                                </div>

                                <!-- Truncated breadcrumbs -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Truncated Text</h3>
                                    <x-keys::breadcrumbs>
                                        <x-keys::breadcrumbs.item href="#" icon="heroicon-o-home" truncate>Home</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item href="#" truncate>Very Long Category Name That Should Be Truncated</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item href="#" truncate>Another Extremely Long Subcategory Name</x-keys::breadcrumbs.item>
                                        <x-keys::breadcrumbs.item truncate>Final Very Long Product Name That Exceeds Normal Length</x-keys::breadcrumbs.item>
                                    </x-keys::breadcrumbs>
                                </div>
                            </div>
                        </section>

                        <!-- Modal Components -->
                        <section class="space-y-4">
                            <h2 class="text-lg font-semibold border-b border-border pb-2">Modal Components</h2>

                            <div class="space-y-6">
                                <!-- Basic Modal Examples -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Native Dialog Features (Zero JavaScript)</h3>
                                    <div class="flex flex-wrap gap-3">
                                        <x-keys::button commandfor="basic-modal" command="show-modal" variant="brand">
                                            Basic Modal
                                        </x-keys::button>

                                        <x-keys::button commandfor="confirmation-modal" command="show-modal" variant="danger">
                                            Confirmation Modal
                                        </x-keys::button>

                                        <x-keys::button commandfor="large-modal" command="show-modal" variant="neutral">
                                            Large Scrollable Modal
                                        </x-keys::button>
                                    </div>
                                </div>

                                <!-- Modal Size Variants -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Size Variants</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <x-keys::button commandfor="xs-modal" command="show-modal" size="sm">XS</x-keys::button>
                                        <x-keys::button commandfor="sm-modal" command="show-modal" size="sm">SM</x-keys::button>
                                        <x-keys::button commandfor="md-modal" command="show-modal" size="sm">MD</x-keys::button>
                                        <x-keys::button commandfor="lg-modal" command="show-modal" size="sm">LG</x-keys::button>
                                        <x-keys::button commandfor="xl-modal" command="show-modal" size="sm">XL</x-keys::button>
                                    </div>
                                </div>

                                <!-- Modal Features -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Modal Features</h3>
                                    <div class="space-y-2">
                                        <div class="text-sm text-muted">
                                            <strong>Native Features:</strong>
                                            • Light dismiss (click outside/ESC) • Focus management • Top layer rendering • Accessibility built-in
                                        </div>
                                        <div class="text-sm text-muted">
                                            <strong>Command Invokers:</strong>
                                            Uses <code>commandfor</code> and <code>command</code> attributes for zero-JavaScript control
                                        </div>
                                        <div class="text-sm text-muted">
                                            <strong>Enhanced JS:</strong>
                                            Optional smooth animations and custom events
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Badge Components -->
                        <section class="space-y-4">
                            <h2 class="text-lg font-semibold border-b border-border pb-2">Badge Components</h2>

                            <div class="space-y-6">
                                <!-- Simple Badges -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Simple Badges</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <x-keys::badge color="blue">Default</x-keys::badge>
                                        <x-keys::badge color="gray">Dark</x-keys::badge>
                                        <x-keys::badge color="red">Red</x-keys::badge>
                                        <x-keys::badge color="green">Green</x-keys::badge>
                                        <x-keys::badge color="yellow">Yellow</x-keys::badge>
                                        <x-keys::badge color="indigo">Indigo</x-keys::badge>
                                        <x-keys::badge color="purple">Purple</x-keys::badge>
                                        <x-keys::badge color="pink">Pink</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Semantic Colors -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Semantic Colors</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <x-keys::badge color="brand">Brand</x-keys::badge>
                                        <x-keys::badge color="success">Success</x-keys::badge>
                                        <x-keys::badge color="warning">Warning</x-keys::badge>
                                        <x-keys::badge color="danger">Danger</x-keys::badge>
                                        <x-keys::badge color="neutral">Neutral</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Badge Sizes -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Badge Sizes</h3>
                                    <div class="flex items-center gap-2">
                                        <x-keys::badge size="xs" color="blue">Extra Small</x-keys::badge>
                                        <x-keys::badge size="sm" color="green">Small</x-keys::badge>
                                        <x-keys::badge size="md" color="purple">Medium</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Icon Badges -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Badges with Icons</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <x-keys::badge icon="heroicon-o-star" color="yellow">Featured</x-keys::badge>
                                        <x-keys::badge icon="heroicon-o-check-circle" color="success">Verified</x-keys::badge>
                                        <x-keys::badge icon="heroicon-o-fire" color="red">Hot</x-keys::badge>
                                        <x-keys::badge icon="heroicon-o-sparkles" color="purple">New</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Auto Icon-Only Badges -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Auto Icon-Only Badges</h3>
                                    <p class="text-sm text-muted mb-2">Automatically detected when slot is empty</p>
                                    <div class="flex items-center gap-2">
                                        <x-keys::badge icon="heroicon-o-check" color="success" />
                                        <x-keys::badge icon="heroicon-o-x-mark" color="danger" />
                                        <x-keys::badge icon="heroicon-o-exclamation-triangle" color="warning" />
                                        <x-keys::badge icon="heroicon-o-information-circle" color="blue" />
                                        <x-keys::badge icon="heroicon-o-star" color="yellow" size="md" />
                                    </div>
                                </div>

                                <!-- Chip Badges (Dismissible) -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Chip Badges (Dismissible)</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <x-keys::badge variant="chip" color="blue" dismissible>Default</x-keys::badge>
                                        <x-keys::badge variant="chip" color="gray" dismissible>Dark</x-keys::badge>
                                        <x-keys::badge variant="chip" color="red" dismissible>Red</x-keys::badge>
                                        <x-keys::badge variant="chip" color="green" dismissible>Green</x-keys::badge>
                                        <x-keys::badge variant="chip" color="yellow" dismissible>Yellow</x-keys::badge>
                                        <x-keys::badge variant="chip" color="purple" dismissible>Purple</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Use Cases -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Use Case Examples</h3>
                                    <div class="space-y-3">
                                        <!-- Status indicators -->
                                        <div>
                                            <h4 class="text-sm font-medium text-neutral-600 mb-2">Status Indicators</h4>
                                            <div class="flex gap-2">
                                                <x-keys::badge color="success" icon="heroicon-o-check-circle">Online</x-keys::badge>
                                                <x-keys::badge color="warning" icon="heroicon-o-clock">Pending</x-keys::badge>
                                                <x-keys::badge color="danger" icon="heroicon-o-x-circle">Offline</x-keys::badge>
                                            </div>
                                        </div>

                                        <!-- Tags -->
                                        <div>
                                            <h4 class="text-sm font-medium text-neutral-600 mb-2">Content Tags</h4>
                                            <div class="flex flex-wrap gap-2">
                                                <x-keys::badge variant="chip" color="brand" dismissible>React</x-keys::badge>
                                                <x-keys::badge variant="chip" color="green" dismissible>Vue.js</x-keys::badge>
                                                <x-keys::badge variant="chip" color="blue" dismissible>TypeScript</x-keys::badge>
                                                <x-keys::badge variant="chip" color="purple" dismissible>Laravel</x-keys::badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Dropdown Components ---->
                        <section class="space-y-4">
                            <h2 class="text-lg font-semibold border-b border-border pb-2">Dropdown Components</h2>

                            <div class="space-y-6">
                                <!-- Basic Dropdown with Menu Items -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Basic Dropdown with Menu Items</h3>
                                    <x-keys::dropdown position="bottom" align="start">
                                        <x-slot:trigger>
                                            <x-keys::button icon="heroicon-o-ellipsis-vertical" variant="ghost">
                                                Actions
                                            </x-keys::button>
                                        </x-slot:trigger>

                                        <x-keys::menu>
                                            <x-keys::menu.item icon="heroicon-o-pencil" href="#" kbd="⌘E">
                                                Edit Post
                                            </x-keys::menu.item>
                                            <x-keys::menu.item icon="heroicon-o-share" href="#" kbd="⌘S">
                                                Share
                                            </x-keys::menu.item>
                                            <x-keys::menu.item icon="heroicon-o-document-duplicate" href="#">
                                                Duplicate
                                            </x-keys::menu.item>
                                            <x-keys::menu.separator />
                                            <x-keys::menu.item icon="heroicon-o-eye" href="#">
                                                Preview
                                            </x-keys::menu.item>
                                            <x-keys::menu.separator />
                                            <x-keys::menu.item icon="heroicon-o-trash" variant="danger" href="#">
                                                Delete
                                            </x-keys::menu.item>
                                        </x-keys::menu>
                                    </x-keys::dropdown>
                                </div>

                                <!-- Dropdown with Form Controls -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Dropdown with Form Controls (Stay Open)</h3>
                                    <x-keys::dropdown position="bottom" align="start">
                                        <x-slot:trigger>
                                            <x-keys::button icon="heroicon-o-cog-6-tooth" variant="outline">
                                                Settings
                                            </x-keys::button>
                                        </x-slot:trigger>

                                        <x-keys::menu>
                                            <x-keys::menu.item icon="heroicon-o-user" href="#">
                                                Profile
                                            </x-keys::menu.item>
                                            <x-keys::menu.item icon="heroicon-o-key" href="#">
                                                Change Password
                                            </x-keys::menu.item>
                                            <x-keys::menu.separator label="Preferences" />
                                            <x-keys::menu.checkbox name="notifications" value="email" checked>
                                                Email Notifications
                                            </x-keys::menu.checkbox>
                                            <x-keys::menu.checkbox name="notifications" value="push">
                                                Push Notifications
                                            </x-keys::menu.checkbox>
                                            <x-keys::menu.separator />
                                            <x-keys::menu.radio name="theme" value="light" checked>
                                                Light Theme
                                            </x-keys::menu.radio>
                                            <x-keys::menu.radio name="theme" value="dark">
                                                Dark Theme
                                            </x-keys::menu.radio>
                                            <x-keys::menu.radio name="theme" value="system">
                                                System Theme
                                            </x-keys::menu.radio>
                                            <x-keys::menu.separator />
                                            <x-keys::menu.item icon="heroicon-o-arrow-right-start-on-rectangle" variant="danger" href="#">
                                                Sign Out
                                            </x-keys::menu.item>
                                        </x-keys::menu>
                                    </x-keys::dropdown>
                                </div>

                                <!-- Dropdown Positioning Variants -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Positioning Variants</h3>
                                    <div class="flex gap-4 items-center justify-center p-8">
                                        <!-- Top -->
                                        <x-keys::dropdown position="top" align="center">
                                            <x-slot:trigger>
                                                <x-keys::button variant="outline" size="sm">Top</x-keys::button>
                                            </x-slot:trigger>
                                            <x-keys::menu>
                                                <x-keys::menu.item>Top positioned menu</x-keys::menu.item>
                                                <x-keys::menu.item>Another item</x-keys::menu.item>
                                            </x-keys::menu>
                                        </x-keys::dropdown>

                                        <!-- Left -->
                                        <x-keys::dropdown position="left" align="center">
                                            <x-slot:trigger>
                                                <x-keys::button variant="outline" size="sm">Left</x-keys::button>
                                            </x-slot:trigger>
                                            <x-keys::menu>
                                                <x-keys::menu.item>Left positioned menu</x-keys::menu.item>
                                                <x-keys::menu.item>Another item</x-keys::menu.item>
                                            </x-keys::menu>
                                        </x-keys::dropdown>

                                        <!-- Bottom -->
                                        <x-keys::dropdown position="bottom" align="center">
                                            <x-slot:trigger>
                                                <x-keys::button variant="outline" size="sm">Bottom</x-keys::button>
                                            </x-slot:trigger>
                                            <x-keys::menu>
                                                <x-keys::menu.item>Bottom positioned menu</x-keys::menu.item>
                                                <x-keys::menu.item>Another item</x-keys::menu.item>
                                            </x-keys::menu>
                                        </x-keys::dropdown>

                                        <!-- Right -->
                                        <x-keys::dropdown position="right" align="center">
                                            <x-slot:trigger>
                                                <x-keys::button variant="outline" size="sm">Right</x-keys::button>
                                            </x-slot:trigger>
                                            <x-keys::menu>
                                                <x-keys::menu.item>Right positioned menu</x-keys::menu.item>
                                                <x-keys::menu.item>Another item</x-keys::menu.item>
                                            </x-keys::menu>
                                        </x-keys::dropdown>
                                    </div>
                                </div>

                                <!-- Nested Dropdowns (Submenus) -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Nested Dropdowns (Submenus)</h3>
                                    <div class="flex gap-4">
                                        <!-- Sort & Filter Example (like Flux UI) -->
                                        <x-keys::dropdown position="bottom" align="start">
                                            <x-slot:trigger>
                                                <x-keys::button icon="heroicon-o-funnel" variant="outline">
                                                    Sort & Filter
                                                </x-keys::button>
                                            </x-slot:trigger>

                                            <x-keys::menu>
                                                <x-keys::menu.submenu heading="Sort by" icon="heroicon-o-bars-arrow-up">
                                                    <x-keys::menu.radio name="sort" value="name" checked>
                                                        Name
                                                    </x-keys::menu.radio>
                                                    <x-keys::menu.radio name="sort" value="date">
                                                        Date Created
                                                    </x-keys::menu.radio>
                                                    <x-keys::menu.radio name="sort" value="size">
                                                        File Size
                                                    </x-keys::menu.radio>
                                                    <x-keys::menu.radio name="sort" value="type">
                                                        File Type
                                                    </x-keys::menu.radio>
                                                </x-keys::menu.submenu>

                                                <x-keys::menu.submenu heading="Filter" icon="heroicon-o-funnel">
                                                    <x-keys::menu.checkbox name="filter" value="draft" checked>
                                                        Draft
                                                    </x-keys::menu.checkbox>
                                                    <x-keys::menu.checkbox name="filter" value="published">
                                                        Published
                                                    </x-keys::menu.checkbox>
                                                    <x-keys::menu.checkbox name="filter" value="archived">
                                                        Archived
                                                    </x-keys::menu.checkbox>
                                                    <x-keys::menu.separator />
                                                    <x-keys::menu.checkbox name="filter" value="has-images">
                                                        Has Images
                                                    </x-keys::menu.checkbox>
                                                    <x-keys::menu.checkbox name="filter" value="has-videos">
                                                        Has Videos
                                                    </x-keys::menu.checkbox>
                                                </x-keys::menu.submenu>

                                                <x-keys::menu.separator />
                                                <x-keys::menu.item icon="heroicon-o-arrow-path">
                                                    Reset Filters
                                                </x-keys::menu.item>
                                            </x-keys::menu>
                                        </x-keys::dropdown>

                                        <!-- Multi-level Navigation Example -->
                                        <x-keys::dropdown position="bottom" align="start">
                                            <x-slot:trigger>
                                                <x-keys::button icon="heroicon-o-squares-2x2" variant="outline">
                                                    Navigation
                                                </x-keys::button>
                                            </x-slot:trigger>

                                            <x-keys::menu>
                                                <x-keys::menu.item icon="heroicon-o-home" href="#">
                                                    Dashboard
                                                </x-keys::menu.item>

                                                <x-keys::menu.submenu heading="Content" icon="heroicon-o-document-text">
                                                    <x-keys::menu.item icon="heroicon-o-plus" href="#">
                                                        New Post
                                                    </x-keys::menu.item>
                                                    <x-keys::menu.item icon="heroicon-o-document-duplicate" href="#">
                                                        All Posts
                                                    </x-keys::menu.item>
                                                    <x-keys::menu.item icon="heroicon-o-tag" href="#">
                                                        Categories
                                                    </x-keys::menu.item>
                                                    <x-keys::menu.separator />
                                                    <x-keys::menu.submenu heading="Media" icon="heroicon-o-photo">
                                                        <x-keys::menu.item icon="heroicon-o-cloud-arrow-up" href="#">
                                                            Upload Files
                                                        </x-keys::menu.item>
                                                        <x-keys::menu.item icon="heroicon-o-folder" href="#">
                                                            Media Library
                                                        </x-keys::menu.item>
                                                        <x-keys::menu.item icon="heroicon-o-cog-6-tooth" href="#">
                                                            Settings
                                                        </x-keys::menu.item>
                                                    </x-keys::menu.submenu>
                                                </x-keys::menu.submenu>

                                                <x-keys::menu.submenu heading="Users" icon="heroicon-o-users">
                                                    <x-keys::menu.item icon="heroicon-o-user-plus" href="#">
                                                        Add User
                                                    </x-keys::menu.item>
                                                    <x-keys::menu.item icon="heroicon-o-users" href="#">
                                                        All Users
                                                    </x-keys::menu.item>
                                                    <x-keys::menu.separator />
                                                    <x-keys::menu.item icon="heroicon-o-shield-check" href="#">
                                                        Permissions
                                                    </x-keys::menu.item>
                                                </x-keys::menu.submenu>

                                                <x-keys::menu.separator />
                                                <x-keys::menu.item icon="heroicon-o-cog-6-tooth" href="#">
                                                    Settings
                                                </x-keys::menu.item>
                                            </x-keys::menu>
                                        </x-keys::dropdown>
                                    </div>

                                    <div class="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md text-sm">
                                        <p class="font-medium mb-2">Submenu Features:</p>
                                        <ul class="space-y-1 text-neutral-600 dark:text-neutral-400">
                                            <li>• <strong>Desktop:</strong> Hover to open, automatic positioning (right/left based on space)</li>
                                            <li>• <strong>Mobile:</strong> Click to open, responsive touch-friendly interface</li>
                                            <li>• <strong>Smart Hierarchy:</strong> Siblings close when opening new submenu</li>
                                            <li>• <strong>Form Controls:</strong> Checkboxes and radios keep submenus open</li>
                                            <li>• <strong>Keyboard Navigation:</strong> Arrow keys navigate in/out of submenus</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Select Component with Badge Chips ---->
                        <section class="space-y-4">
                            <h2 class="text-lg font-semibold border-b border-border pb-2">Select with Badge Chips</h2>

                            <div class="space-y-6">
                                <!-- Multiselect with chips -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Multiselect with Dismissible Badge Chips</h3>
                                    <x-keys::select
                                        name="technologies[]"
                                        multiple
                                        clearable
                                        placeholder="Select technologies"
                                        :value="['React', 'Laravel', 'TypeScript']"
                                    >
                                        <x-keys::select.option value="React" label="React" />
                                        <x-keys::select.option value="Vue" label="Vue.js" />
                                        <x-keys::select.option value="Laravel" label="Laravel" />
                                        <x-keys::select.option value="TypeScript" label="TypeScript" />
                                        <x-keys::select.option value="PHP" label="PHP" />
                                    </x-keys::select>
                                </div>
                            </div>
                        </section>

                        <!-- Avatar Components -->
                        <section class="space-y-4">
                            <h2 class="text-lg font-semibold border-b border-border pb-2">Avatar Components</h2>

                            <div class="space-y-6">
                                <!-- Basic Avatars -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Basic Avatars</h3>
                                    <div class="flex items-center space-x-4">
                                        <x-keys::avatar
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                                            name="John Doe"
                                            alt="John Doe's profile picture"
                                        />
                                        <x-keys::avatar name="Jane Smith" />
                                        <x-keys::avatar />
                                    </div>
                                </div>

                                <!-- Avatar Sizes -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Avatar Sizes</h3>
                                    <div class="flex items-center space-x-4">
                                        <div class="text-center">
                                            <x-keys::avatar name="XS" size="xs" />
                                            <p class="text-xs mt-1">xs</p>
                                        </div>
                                        <div class="text-center">
                                            <x-keys::avatar name="SM" size="sm" />
                                            <p class="text-xs mt-1">sm</p>
                                        </div>
                                        <div class="text-center">
                                            <x-keys::avatar name="MD" size="md" />
                                            <p class="text-xs mt-1">md</p>
                                        </div>
                                        <div class="text-center">
                                            <x-keys::avatar name="LG" size="lg" />
                                            <p class="text-xs mt-1">lg</p>
                                        </div>
                                        <div class="text-center">
                                            <x-keys::avatar name="XL" size="xl" />
                                            <p class="text-xs mt-1">xl</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Avatar Stacks -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Avatar Stacks</h3>
                                    <div class="space-y-4">
                                        <div>
                                            <h4 class="text-sm font-medium text-neutral-600 mb-2">Default Stack</h4>
                                            <x-keys::avatar.stack>
                                                <x-keys::avatar name="John Doe" color="brand" />
                                                <x-keys::avatar name="Jane Smith" color="success" />
                                                <x-keys::avatar name="Bob Johnson" color="warning" />
                                                <x-keys::avatar name="Alice Brown" color="danger" />
                                            </x-keys::avatar.stack>
                                        </div>
                                        <div>
                                            <h4 class="text-sm font-medium text-neutral-600 mb-2">Large Stack</h4>
                                            <x-keys::avatar.stack size="lg" spacing="tight">
                                                <x-keys::avatar name="Team" color="brand" />
                                                <x-keys::avatar name="Lead" color="success" />
                                                <x-keys::avatar name="Dev" color="blue" />
                                                <x-keys::avatar name="QA" color="purple" />
                                            </x-keys::avatar.stack>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Modal Components Section -->
                        <section class="mb-8">
                            <div class="bg-surface border border-border rounded-lg p-6">
                                <h2 class="text-xl font-bold mb-4">Modal Components</h2>
                                <p class="text-foreground/70 mb-6">
                                    Native HTML dialog element with enhanced features, Livewire integration, and progressive enhancement.
                                </p>

                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <!-- Basic Modal Triggers -->
                                    <div class="space-y-3">
                                        <h3 class="text-base font-medium">Basic Modals</h3>
                                        <div class="flex flex-col gap-2">
                                            <x-keys::button commandfor="basic-modal" command="show-modal" variant="brand">
                                                Open Basic Modal
                                            </x-keys::button>
                                            <x-keys::button commandfor="confirmation-modal" command="show-modal" variant="danger">
                                                Open Confirmation
                                            </x-keys::button>
                                            <x-keys::button commandfor="large-modal" command="show-modal" variant="neutral">
                                                Open Scrollable Modal
                                            </x-keys::button>
                                        </div>
                                    </div>

                                    <!-- Size Variants -->
                                    <div class="space-y-3">
                                        <h3 class="text-base font-medium">Size Variants</h3>
                                        <div class="flex flex-col gap-2 text-sm">
                                            <x-keys::button commandfor="xs-modal" command="show-modal" variant="neutral" size="sm">Extra Small (xs)</x-keys::button>
                                            <x-keys::button commandfor="sm-modal" command="show-modal" variant="neutral" size="sm">Small (sm)</x-keys::button>
                                            <x-keys::button commandfor="md-modal" command="show-modal" variant="neutral" size="sm">Medium (md)</x-keys::button>
                                            <x-keys::button commandfor="lg-modal" command="show-modal" variant="neutral" size="sm">Large (lg)</x-keys::button>
                                            <x-keys::button commandfor="xl-modal" command="show-modal" variant="neutral" size="sm">Extra Large (xl)</x-keys::button>
                                        </div>
                                    </div>

                                    <!-- Livewire Integration -->
                                    <div class="space-y-3">
                                        <h3 class="text-base font-medium">Livewire Features</h3>
                                        <div class="flex flex-col gap-2">
                                            <x-keys::button commandfor="livewire-modal" command="show-modal" variant="success">
                                                <x-keys::icon name="heroicon-o-bolt" />
                                                Livewire Modal
                                            </x-keys::button>
                                            <x-keys::button commandfor="event-modal" command="show-modal" variant="purple">
                                                <x-keys::icon name="heroicon-o-cursor-arrow-rays" />
                                                Event Handlers
                                            </x-keys::button>
                                        </div>
                                        <div class="text-xs text-muted">
                                            <p>• Server-side rendering</p>
                                            <p>• Event integration</p>
                                            <p>• Two-way binding</p>
                                            <p>• ModalManager API</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Modal Feature Highlights -->
                                <div class="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                                    <h4 class="text-sm font-medium mb-2">Modal Features</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted">
                                        <div>
                                            <strong>Native HTML Dialog:</strong> Built on native &lt;dialog&gt; element with 2025 features
                                        </div>
                                        <div>
                                            <strong>Command Invokers:</strong> `commandfor` and `command` attributes for zero-JS controls
                                        </div>
                                        <div>
                                            <strong>Progressive Enhancement:</strong> Works without JavaScript, enhanced with it
                                        </div>
                                        <div>
                                            <strong>Livewire Integration:</strong> Server-side rendering and event handling
                                        </div>
                                        <div>
                                            <strong>Focus Management:</strong> Automatic focus trapping and restoration
                                        </div>
                                        <div>
                                            <strong>Accessibility:</strong> WCAG compliant with proper ARIA attributes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Toast Components Section -->
                        <section class="mb-8">
                            <div class="bg-surface border border-border rounded-lg p-6">
                                <h2 class="text-xl font-bold mb-4">Toast Components</h2>
                                <p class="text-foreground/70 mb-6">
                                    Toast notifications with server-side dispatching, auto-dismiss, positioning, and Livewire integration.
                                </p>

                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <!-- Basic Toast Variants -->
                                    <div class="space-y-3">
                                        <h3 class="text-base font-medium">Toast Variants</h3>
                                        <div class="flex flex-col gap-2">
                                            <x-keys::button
                                                onclick="showDemoToast('success', 'Success!', 'Operation completed successfully')"
                                                variant="success"
                                                size="sm"
                                            >
                                                <x-keys::icon name="heroicon-o-check-circle" />
                                                Show Success Toast
                                            </x-keys::button>

                                            <x-keys::button
                                                onclick="showDemoToast('error', 'Error!', 'Something went wrong')"
                                                variant="danger"
                                                size="sm"
                                            >
                                                <x-keys::icon name="heroicon-o-x-circle" />
                                                Show Error Toast
                                            </x-keys::button>

                                            <x-keys::button
                                                onclick="showDemoToast('warning', 'Warning!', 'Please check your input')"
                                                variant="warning"
                                                size="sm"
                                            >
                                                <x-keys::icon name="heroicon-o-exclamation-triangle" />
                                                Show Warning Toast
                                            </x-keys::button>

                                            <x-keys::button
                                                onclick="showDemoToast('info', 'Info', 'Here is some information')"
                                                variant="neutral"
                                                size="sm"
                                            >
                                                <x-keys::icon name="heroicon-o-information-circle" />
                                                Show Info Toast
                                            </x-keys::button>
                                        </div>
                                    </div>

                                    <!-- Toast Positioning -->
                                    <div class="space-y-3">
                                        <h3 class="text-base font-medium">Toast Positioning</h3>
                                        <div class="grid grid-cols-2 gap-2 text-xs">
                                            <x-keys::button
                                                onclick="showPositionedToast('top-left')"
                                                variant="outline"
                                                size="sm"
                                            >Top Left</x-keys::button>

                                            <x-keys::button
                                                onclick="showPositionedToast('top-right')"
                                                variant="outline"
                                                size="sm"
                                            >Top Right</x-keys::button>

                                            <x-keys::button
                                                onclick="showPositionedToast('bottom-left')"
                                                variant="outline"
                                                size="sm"
                                            >Bottom Left</x-keys::button>

                                            <x-keys::button
                                                onclick="showPositionedToast('bottom-right')"
                                                variant="outline"
                                                size="sm"
                                            >Bottom Right</x-keys::button>

                                            <x-keys::button
                                                onclick="showPositionedToast('top-center')"
                                                variant="outline"
                                                size="sm"
                                            >Top Center</x-keys::button>

                                            <x-keys::button
                                                onclick="showPositionedToast('bottom-center')"
                                                variant="outline"
                                                size="sm"
                                            >Bottom Center</x-keys::button>
                                        </div>
                                    </div>

                                    <!-- Advanced Toast Features -->
                                    <div class="space-y-3">
                                        <h3 class="text-base font-medium">Advanced Features</h3>
                                        <div class="flex flex-col gap-2">
                                            <x-keys::button
                                                onclick="showPersistentToast()"
                                                variant="purple"
                                                size="sm"
                                            >
                                                <x-keys::icon name="heroicon-o-clock" />
                                                Persistent Toast
                                            </x-keys::button>

                                            <x-keys::button
                                                onclick="showActionToast()"
                                                variant="brand"
                                                size="sm"
                                            >
                                                <x-keys::icon name="heroicon-o-cursor-arrow-rays" />
                                                Toast with Action
                                            </x-keys::button>

                                            <x-keys::button
                                                onclick="showMultipleToasts()"
                                                variant="neutral"
                                                size="sm"
                                            >
                                                <x-keys::icon name="heroicon-o-squares-plus" />
                                                Multiple Toasts
                                            </x-keys::button>

                                            <x-keys::button
                                                onclick="dismissAllToasts()"
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <x-keys::icon name="heroicon-o-x-mark" />
                                                Dismiss All
                                            </x-keys::button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Toast API Examples -->
                                <div class="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                                    <h4 class="text-sm font-medium mb-2">Server-Side API Examples</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-foreground/70">
                                        <div>
                                            <p class="font-bold text-foreground mb-1">Simple Notifications:</p>
                                            <p>Keys::success('User created!');</p>
                                            <p>Keys::error('Validation failed');</p>
                                            <p>Keys::warning('Session expiring');</p>
                                            <p>Keys::info('Update available');</p>
                                        </div>
                                        <div>
                                            <p class="font-bold text-foreground mb-1">Advanced Configuration:</p>
                                            <p>Keys::toast()->success('Message')</p>
                                            <p>&nbsp;&nbsp;->action('Undo', 'undoAction')</p>
                                            <p>&nbsp;&nbsp;->persistent()->show();</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Toast Feature Highlights -->
                                <div class="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                                    <h4 class="text-sm font-medium mb-2">Toast Features</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted">
                                        <div>
                                            <strong>Server-Side Dispatching:</strong> Trigger toasts from Livewire components
                                        </div>
                                        <div>
                                            <strong>Auto-Dismiss:</strong> Configurable timeout with hover pause
                                        </div>
                                        <div>
                                            <strong>6 Positioning Options:</strong> Smart container system for all corners
                                        </div>
                                        <div>
                                            <strong>Action Buttons:</strong> Interactive notifications with custom actions
                                        </div>
                                        <div>
                                            <strong>Progressive Enhancement:</strong> Works without JavaScript
                                        </div>
                                        <div>
                                            <strong>Responsive Design:</strong> Optimized for all screen sizes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <footer class="text-center mt-8 text-sm text-muted">
                    <p>This page demonstrates Keys UI Breadcrumbs, Avatar, Badge, Modal, and Toast components.</p>
                    <p class="mt-1">Components: Breadcrumbs, Avatar/Stack, Badge with auto icon-only detection, Modal with native dialog features, Toast with server-side dispatching.</p>
                </footer>
            </div>
        </div>

        <!-- Modal Definitions -->

        <!-- Livewire Modal with Event Handlers -->
        <x-keys::modal id="livewire-modal" size="md" wire:model="showLivewireModal"
                       @open="console.log('Modal opened via Alpine')"
                       @close="console.log('Modal closed via Alpine')"
                       wire:open="handleModalOpen"
                       wire:close="handleModalClose">
            <x-slot:header>
                <div class="flex items-center gap-3">
                    <x-keys::icon name="heroicon-o-bolt" class="text-success" />
                    <h2 class="text-lg font-semibold">Livewire Integration Modal</h2>
                </div>
                <x-keys::button commandfor="livewire-modal" command="close" variant="ghost" size="sm">
                    <x-keys::icon name="heroicon-o-x-mark" />
                </x-keys::button>
            </x-slot:header>

            <div class="space-y-4">
                <p class="text-foreground/80">
                    This modal demonstrates full Livewire integration with:
                </p>
                <ul class="list-disc pl-6 space-y-1 text-sm text-foreground/70">
                    <li><strong>wire:model</strong> - Two-way binding for modal state</li>
                    <li><strong>@open/@close</strong> - Alpine.js event handlers</li>
                    <li><strong>wire:open/wire:close</strong> - Livewire method calls</li>
                    <li><strong>Server-side rendering</strong> - Modal content from server</li>
                    <li><strong>Event dispatching</strong> - Custom Livewire events</li>
                </ul>

                <div class="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                    <h4 class="text-sm font-medium mb-2">Usage Examples:</h4>
                    <div class="text-xs font-mono text-foreground/60">
                        <p>// From Livewire component:</p>
                        <p>Keys::modal('my-modal')->show();</p>
                        <p>Keys::modal('my-modal')->title('Dynamic Title')->show();</p>
                        <p>Keys::modal('my-modal')->component('user-form', ['user' => $user]);</p>
                    </div>
                </div>
            </div>

            <x-slot:footer>
                <x-keys::button variant="success">
                    <x-keys::icon name="heroicon-o-check" />
                    Livewire Action
                </x-keys::button>
                <x-keys::button commandfor="livewire-modal" command="close" variant="neutral">
                    Close Modal
                </x-keys::button>
            </x-slot:footer>
        </x-keys::modal>

        <!-- Event Handlers Demo Modal -->
        <x-keys::modal id="event-modal" size="sm"
                       @escape="console.log('Escaped pressed')"
                       @cancel="console.log('Modal cancelled')"
                       wire:escape="handleEscape">
            <x-slot:header>
                <div class="flex items-center gap-3">
                    <x-keys::icon name="heroicon-o-cursor-arrow-rays" class="text-purple-500" />
                    <h2 class="text-lg font-semibold">Event Handlers</h2>
                </div>
            </x-slot:header>

            <div class="space-y-3">
                <p class="text-foreground/80">
                    This modal demonstrates event handling:
                </p>
                <div class="text-sm space-y-1">
                    <p>• <strong>ESC key:</strong> Triggers @escape and wire:escape</p>
                    <p>• <strong>Backdrop click:</strong> Triggers @close</p>
                    <p>• <strong>Cancel event:</strong> Triggers @cancel</p>
                    <p>• <strong>Open event:</strong> Triggers @open</p>
                </div>

                <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                    <strong>Try:</strong> Press ESC key or click outside to see console logs
                </div>
            </div>

            <x-slot:footer>
                <x-keys::button commandfor="event-modal" command="close" variant="purple">
                    Close with Event
                </x-keys::button>
            </x-slot:footer>
        </x-keys::modal>

        <!-- Basic Modal -->
        <x-keys::modal id="basic-modal" size="md">
            <x-slot:header>
                <h2 class="text-lg font-semibold">Basic Modal</h2>
                <x-keys::button commandfor="basic-modal" command="close" variant="ghost" size="sm">
                    <x-keys::icon name="heroicon-o-x-mark" />
                </x-keys::button>
            </x-slot:header>

            <p class="text-foreground/80">
                This is a basic modal using the native HTML dialog element with command invokers.
                It works without any JavaScript and includes automatic focus management, ESC key handling,
                and click-outside-to-close functionality.
            </p>

            <x-slot:footer>
                <x-keys::button variant="brand">Save Changes</x-keys::button>
                <x-keys::button commandfor="basic-modal" command="close" variant="neutral">Cancel</x-keys::button>
            </x-slot:footer>
        </x-keys::modal>

        <!-- Confirmation Modal -->
        <x-keys::modal id="confirmation-modal" size="sm">
            <x-slot:header>
                <div class="flex items-center gap-3">
                    <x-keys::icon name="heroicon-o-exclamation-triangle" class="text-danger" />
                    <h2 class="text-lg font-semibold">Confirm Action</h2>
                </div>
            </x-slot:header>

            <p class="text-foreground/80">
                Are you sure you want to delete this item? This action cannot be undone.
            </p>

            <x-slot:footer>
                <x-keys::button variant="danger">Delete</x-keys::button>
                <x-keys::button commandfor="confirmation-modal" command="close" variant="neutral">Cancel</x-keys::button>
            </x-slot:footer>
        </x-keys::modal>

        <!-- Large Scrollable Modal -->
        <x-keys::modal id="large-modal" size="lg" scrollable>
            <x-slot:header>
                <h2 class="text-lg font-semibold">Large Scrollable Modal</h2>
                <x-keys::button commandfor="large-modal" command="close" variant="ghost" size="sm">
                    <x-keys::icon name="heroicon-o-x-mark" />
                </x-keys::button>
            </x-slot:header>

            <div class="space-y-4">
                <p>This modal demonstrates scrollable content with a fixed header and footer.</p>

                @for($i = 1; $i <= 20; $i++)
                    <div class="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                        <h4 class="font-medium">Section {{ $i }}</h4>
                        <p class="text-sm text-muted">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                            exercitation ullamco laboris.
                        </p>
                    </div>
                @endfor
            </div>

            <x-slot:footer>
                <x-keys::button variant="brand">Save All</x-keys::button>
                <x-keys::button commandfor="large-modal" command="close" variant="neutral">Close</x-keys::button>
            </x-slot:footer>
        </x-keys::modal>

        <!-- Size Variant Modals -->
        <x-keys::modal id="xs-modal" size="xs">
            <x-slot:header>
                <h3 class="font-semibold">XS Modal</h3>
            </x-slot:header>
            <p class="text-sm">Extra small modal content.</p>
        </x-keys::modal>

        <x-keys::modal id="sm-modal" size="sm">
            <x-slot:header>
                <h3 class="font-semibold">Small Modal</h3>
            </x-slot:header>
            <p>Small modal with more content space.</p>
        </x-keys::modal>

        <x-keys::modal id="md-modal" size="md">
            <x-slot:header>
                <h3 class="font-semibold">Medium Modal</h3>
            </x-slot:header>
            <p>Medium modal - the default size for most use cases.</p>
        </x-keys::modal>

        <x-keys::modal id="lg-modal" size="lg">
            <x-slot:header>
                <h3 class="font-semibold">Large Modal</h3>
            </x-slot:header>
            <p>Large modal for more complex content and forms.</p>
        </x-keys::modal>

        <x-keys::modal id="xl-modal" size="xl">
            <x-slot:header>
                <h3 class="font-semibold">Extra Large Modal</h3>
            </x-slot:header>
            <p>Extra large modal for detailed content, tables, or complex layouts.</p>
        </x-keys::modal>

        <!-- Toast Containers for all positions -->
        <x-keys::toast position="top-left" />
        <x-keys::toast position="top-right" />
        <x-keys::toast position="top-center" />
        <x-keys::toast position="bottom-left" />
        <x-keys::toast position="bottom-right" />
        <x-keys::toast position="bottom-center" />

        <!-- Toast Demo JavaScript -->
        <script>
            // Simple toast demo functions using the new ToastActions API
            function showDemoToast(variant, title, message) {
                if (window.ToastActions) {
                    const toastActions = window.ToastActions.getInstance();
                    toastActions.show(variant, {
                        title: title,
                        message: message,
                        position: 'top-right'
                    });
                }
            }

            function showPositionedToast(position) {
                if (window.ToastActions) {
                    const toastActions = window.ToastActions.getInstance();
                    toastActions.show('info', {
                        title: `${position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Toast`,
                        message: `This toast appears in the ${position} position`,
                        position: position
                    });
                }
            }

            function showPersistentToast() {
                if (window.ToastActions) {
                    const toastActions = window.ToastActions.getInstance();
                    toastActions.show('warning', {
                        title: 'Persistent Toast',
                        message: 'This toast will not auto-dismiss. You must manually close it.',
                        position: 'top-right',
                        persistent: true
                    });
                }
            }

            function showActionToast() {
                if (window.ToastActions) {
                    const toastActions = window.ToastActions.getInstance();
                    toastActions.show('info', {
                        title: 'Action Required',
                        message: 'Your session will expire soon.',
                        position: 'top-right',
                        actions: '<button class="text-xs bg-brand-100 text-brand-600 px-2 py-1 rounded mr-2">Extend</button><button class="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Logout</button>'
                    });
                }
            }

            function showMultipleToasts() {
                const variants = ['success', 'error', 'warning', 'info'];
                const messages = [
                    ['Success!', 'First operation completed'],
                    ['Error!', 'Second operation failed'],
                    ['Warning!', 'Third operation needs attention'],
                    ['Info', 'Fourth operation is informational']
                ];

                variants.forEach((variant, index) => {
                    setTimeout(() => {
                        showDemoToast(variant, messages[index][0], messages[index][1]);
                    }, index * 500);
                });
            }

            function dismissAllToasts() {
                if (window.ToastActions) {
                    const toastActions = window.ToastActions.getInstance();
                    toastActions.dismissAll();
                }
            }
        </script>

    </body>
</html>
