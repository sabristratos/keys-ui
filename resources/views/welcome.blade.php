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
                        Accordion, Avatar, Badge, Breadcrumbs, Modal, Toast, Table, Tabs, and Tooltip components showcase
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

                        <!-- Button Group Components -->
                        <section class="space-y-4">
                            <h2 class="text-lg font-semibold border-b border-border pb-2">Button Group Components</h2>

                            <div class="space-y-6">
                                <!-- Basic Horizontal Button Groups -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Horizontal Button Groups</h3>
                                    <div class="space-y-3">
                                        <div>
                                            <p class="text-sm text-muted mb-2">Basic button group with different variants</p>
                                            <x-keys::button.group>
                                                <x-keys::button variant="brand">First</x-keys::button>
                                                <x-keys::button variant="brand">Second</x-keys::button>
                                                <x-keys::button variant="brand">Third</x-keys::button>
                                            </x-keys::button.group>
                                        </div>

                                        <div>
                                            <p class="text-sm text-muted mb-2">Outline variant button group</p>
                                            <x-keys::button.group>
                                                <x-keys::button variant="outline">Edit</x-keys::button>
                                                <x-keys::button variant="outline">Copy</x-keys::button>
                                                <x-keys::button variant="outline">Delete</x-keys::button>
                                            </x-keys::button.group>
                                        </div>

                                        <div>
                                            <p class="text-sm text-muted mb-2">Mixed variants (not recommended but functional)</p>
                                            <x-keys::button.group>
                                                <x-keys::button variant="success">Save</x-keys::button>
                                                <x-keys::button variant="neutral">Cancel</x-keys::button>
                                                <x-keys::button variant="danger">Delete</x-keys::button>
                                            </x-keys::button.group>
                                        </div>
                                    </div>
                                </div>

                                <!-- Vertical Button Groups -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Vertical Button Groups</h3>
                                    <div class="space-y-3">
                                        <div>
                                            <p class="text-sm text-muted mb-2">Vertical orientation for stacked layouts</p>
                                            <x-keys::button.group orientation="vertical">
                                                <x-keys::button variant="ghost">Profile Settings</x-keys::button>
                                                <x-keys::button variant="ghost">Account Settings</x-keys::button>
                                                <x-keys::button variant="ghost">Privacy Settings</x-keys::button>
                                                <x-keys::button variant="ghost">Security Settings</x-keys::button>
                                            </x-keys::button.group>
                                        </div>
                                    </div>
                                </div>

                                <!-- Icon-Only Button Groups -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Icon-Only Button Groups</h3>
                                    <div class="space-y-3">
                                        <div>
                                            <p class="text-sm text-muted mb-2">Text formatting toolbar</p>
                                            <x-keys::button.group>
                                                <x-keys::button variant="outline" icon="heroicon-o-bold" />
                                                <x-keys::button variant="outline" icon="heroicon-o-italic" />
                                                <x-keys::button variant="outline" icon="heroicon-o-underline" />
                                            </x-keys::button.group>
                                        </div>

                                        <div>
                                            <p class="text-sm text-muted mb-2">Media controls</p>
                                            <x-keys::button.group>
                                                <x-keys::button variant="neutral" icon="heroicon-o-backward" />
                                                <x-keys::button variant="brand" icon="heroicon-o-play" />
                                                <x-keys::button variant="neutral" icon="heroicon-o-forward" />
                                                <x-keys::button variant="neutral" icon="heroicon-o-stop" />
                                            </x-keys::button.group>
                                        </div>
                                    </div>
                                </div>

                                <!-- Size Variants -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Size Variants</h3>
                                    <div class="space-y-3">
                                        <div>
                                            <p class="text-sm text-muted mb-2">Small buttons for compact interfaces</p>
                                            <x-keys::button.group>
                                                <x-keys::button variant="outline" size="sm">Small</x-keys::button>
                                                <x-keys::button variant="outline" size="sm">Group</x-keys::button>
                                                <x-keys::button variant="outline" size="sm">Example</x-keys::button>
                                            </x-keys::button.group>
                                        </div>

                                        <div>
                                            <p class="text-sm text-muted mb-2">Large buttons for prominence</p>
                                            <x-keys::button.group>
                                                <x-keys::button variant="brand" size="lg">Large</x-keys::button>
                                                <x-keys::button variant="brand" size="lg">Button</x-keys::button>
                                                <x-keys::button variant="brand" size="lg">Group</x-keys::button>
                                            </x-keys::button.group>
                                        </div>
                                    </div>
                                </div>

                                <!-- Practical Examples -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Practical Use Cases</h3>
                                    <div class="space-y-4">
                                        <div>
                                            <p class="text-sm text-muted mb-2">Pagination controls</p>
                                            <x-keys::button.group>
                                                <x-keys::button variant="outline" icon="heroicon-o-chevron-left">Previous</x-keys::button>
                                                <x-keys::button variant="outline">1</x-keys::button>
                                                <x-keys::button variant="brand">2</x-keys::button>
                                                <x-keys::button variant="outline">3</x-keys::button>
                                                <x-keys::button variant="outline">Next<x-keys::icon name="heroicon-o-chevron-right" /></x-keys::button>
                                            </x-keys::button.group>
                                        </div>

                                        <div>
                                            <p class="text-sm text-muted mb-2">Segmented control / Toggle group</p>
                                            <x-keys::button.group>
                                                <x-keys::button variant="brand">Day</x-keys::button>
                                                <x-keys::button variant="outline">Week</x-keys::button>
                                                <x-keys::button variant="outline">Month</x-keys::button>
                                                <x-keys::button variant="outline">Year</x-keys::button>
                                            </x-keys::button.group>
                                        </div>

                                        <div>
                                            <p class="text-sm text-muted mb-2">Action toolbar</p>
                                            <x-keys::button.group>
                                                <x-keys::button variant="outline" icon="heroicon-o-pencil">Edit</x-keys::button>
                                                <x-keys::button variant="outline" icon="heroicon-o-document-duplicate">Duplicate</x-keys::button>
                                                <x-keys::button variant="outline" icon="heroicon-o-archive-box">Archive</x-keys::button>
                                                <x-keys::button variant="danger" icon="heroicon-o-trash">Delete</x-keys::button>
                                            </x-keys::button.group>
                                        </div>
                                    </div>
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

                        <!-- Accordion Components -->
                        <section class="mb-8">
                            <div class="bg-surface border border-border rounded-lg p-6">
                                <h2 class="text-xl font-bold mb-4">Accordion Components</h2>
                                <p class="text-foreground/70 mb-6">
                                    Collapsible content containers with smooth WAAPI animations, semantic HTML, and full accessibility support.
                                </p>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <!-- Basic Accordion -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Basic Accordion</h3>
                                        <div class="space-y-2">
                                            <x-keys::accordion title="What is Keys UI?">
                                                Keys UI is a modern Blade components library built specifically for Laravel 12 and Tailwind v4.
                                                It provides semantic design tokens, progressive enhancement, and accessibility-first components.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="How does it work?" collapsed>
                                                Keys UI components use native HTML elements enhanced with JavaScript for smooth animations.
                                                All components work without JavaScript and are progressively enhanced for better user experience.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Is it accessible?">
                                                Yes! All Keys UI components are built with WCAG compliance in mind, featuring proper ARIA attributes,
                                                keyboard navigation, and respect for user preferences like reduced motion.
                                            </x-keys::accordion>
                                        </div>
                                    </div>

                                    <!-- Color Variants -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Color Variants</h3>
                                        <div class="space-y-2">
                                            <x-keys::accordion title="Brand" color="brand">
                                                Brand colored accordion with consistent theming across light and dark modes.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Success" color="success" collapsed>
                                                Success variant perfect for positive feedback and completion states.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Warning" color="warning">
                                                Warning variant for important notices and caution messages.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Danger" color="danger" collapsed>
                                                Danger variant for critical information and error states.
                                            </x-keys::accordion>
                                        </div>
                                    </div>

                                    <!-- Neutral Variant -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Neutral Variant</h3>
                                        <div class="space-y-2">
                                            <x-keys::accordion title="Default Neutral" color="neutral">
                                                Neutral variant using semantic tokens (surface, border, foreground, muted) for consistent theming.
                                            </x-keys::accordion>
                                        </div>
                                    </div>

                                    <!-- Size Variants -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Size Variants</h3>
                                        <div class="space-y-2">
                                            <x-keys::accordion title="Extra Small" size="xs">
                                                Compact accordion perfect for dense layouts and sidebars.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Small" size="sm" collapsed>
                                                Small size variant for secondary content areas.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Medium (Default)" size="md">
                                                Default medium size - perfect for most use cases.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Large" size="lg" collapsed>
                                                Large size for prominent sections and main content areas.
                                            </x-keys::accordion>
                                        </div>
                                    </div>

                                    <!-- With Actions -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">With Actions</h3>
                                        <div class="space-y-2">
                                            <x-keys::accordion
                                                title="User Settings"
                                                color="brand"
                                                :actions="[
                                                    ['type' => 'edit', 'icon' => 'heroicon-o-pencil', 'label' => 'Edit'],
                                                    ['type' => 'delete', 'icon' => 'heroicon-o-trash', 'label' => 'Delete']
                                                ]">
                                                <div class="space-y-3">
                                                    <div class="flex items-center justify-between">
                                                        <span>Email Notifications</span>
                                                        <x-keys::toggle size="sm" checked />
                                                    </div>
                                                    <div class="flex items-center justify-between">
                                                        <span>Push Notifications</span>
                                                        <x-keys::toggle size="sm" />
                                                    </div>
                                                    <div class="flex items-center justify-between">
                                                        <span>Marketing Emails</span>
                                                        <x-keys::toggle size="sm" />
                                                    </div>
                                                </div>
                                            </x-keys::accordion>

                                            <x-keys::accordion
                                                title="Privacy Settings"
                                                color="neutral"
                                                collapsed
                                                :actions="[
                                                    ['type' => 'info', 'icon' => 'heroicon-o-information-circle', 'label' => 'Info'],
                                                    ['type' => 'share', 'icon' => 'heroicon-o-share', 'label' => 'Share']
                                                ]">
                                                <div class="text-sm text-muted space-y-2">
                                                    <p>Your privacy is important to us. Here are your current privacy settings:</p>
                                                    <ul class="list-disc list-inside space-y-1 ml-4">
                                                        <li>Profile visibility: Public</li>
                                                        <li>Search indexing: Enabled</li>
                                                        <li>Data collection: Minimal</li>
                                                    </ul>
                                                </div>
                                            </x-keys::accordion>
                                        </div>
                                    </div>
                                </div>

                                <!-- Layout Variants -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <!-- Default and Outlined -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Layout Variants</h3>
                                        <div class="space-y-2">
                                            <x-keys::accordion title="Default Variant" variant="default" color="brand">
                                                Default variant with background and borders - perfect for most use cases.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Outlined Variant" variant="outlined" color="success" collapsed>
                                                Outlined variant with borders only - clean and minimal appearance.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Elevated Variant" variant="elevated" color="warning">
                                                Elevated variant with shadow - stands out from the background.
                                            </x-keys::accordion>
                                        </div>
                                    </div>

                                    <!-- Flush and Spaced -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Clean Variants</h3>
                                        <div class="space-y-0">
                                            <x-keys::accordion title="Flush Item 1" variant="flush" color="neutral">
                                                Flush variant with no borders or backgrounds - seamless integration.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Flush Item 2" variant="flush" color="brand" collapsed>
                                                Multiple flush items create a clean, list-like appearance.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Flush Item 3" variant="flush" color="danger">
                                                Perfect for FAQ sections and content hierarchies.
                                            </x-keys::accordion>
                                        </div>

                                        <h4 class="text-sm font-medium mt-6 mb-3">Spaced Variant</h4>
                                        <div>
                                            <x-keys::accordion title="Spaced Item 1" variant="spaced" color="success">
                                                Spaced variant adds margins between items for better visual separation.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Spaced Item 2" variant="spaced" color="warning" collapsed>
                                                Each accordion has its own space, making content easier to scan.
                                            </x-keys::accordion>
                                        </div>
                                    </div>
                                </div>

                                <!-- Border Radius Examples -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <!-- Different Rounded Options -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Border Radius Options</h3>
                                        <div class="space-y-2">
                                            <x-keys::accordion title="No Radius" rounded="none" color="neutral">
                                                Sharp corners for modern, geometric designs.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Small Radius" rounded="sm" color="brand" collapsed>
                                                Subtle rounding for a softer appearance.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Default (Large)" rounded="lg" color="success">
                                                Default large radius - balanced and friendly.
                                            </x-keys::accordion>

                                            <x-keys::accordion title="Extra Large" rounded="2xl" color="warning" collapsed>
                                                Pronounced rounding for a modern, approachable feel.
                                            </x-keys::accordion>
                                        </div>
                                    </div>

                                    <!-- Mixed Examples -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Combined Examples</h3>
                                        <div class="space-y-2">
                                            <x-keys::accordion
                                                title="Elevated + Extra Rounded"
                                                variant="elevated"
                                                rounded="xl"
                                                color="brand"
                                                size="lg">
                                                Combining elevated variant with extra rounding for maximum visual impact.
                                            </x-keys::accordion>

                                            <x-keys::accordion
                                                title="Outlined + Medium Size"
                                                variant="outlined"
                                                rounded="md"
                                                color="success"
                                                size="md"
                                                collapsed>
                                                Clean outlined style perfect for secondary content areas.
                                            </x-keys::accordion>

                                            <x-keys::accordion
                                                title="Small + Minimal"
                                                variant="outlined"
                                                rounded="sm"
                                                color="neutral"
                                                size="sm">
                                                Compact size with subtle styling for dense layouts.
                                            </x-keys::accordion>
                                        </div>
                                    </div>
                                </div>

                                <!-- Features List -->
                                <div class="bg-muted/50 p-4 rounded-lg">
                                    <h3 class="text-base font-medium mb-3">Key Features</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <strong>Semantic HTML:</strong> Uses native details/summary elements
                                        </div>
                                        <div>
                                            <strong>WAAPI Animations:</strong> Smooth height transitions with Web Animations API
                                        </div>
                                        <div>
                                            <strong>Progressive Enhancement:</strong> Works without JavaScript
                                        </div>
                                        <div>
                                            <strong>Accessibility:</strong> WCAG compliant with proper ARIA attributes
                                        </div>
                                        <div>
                                            <strong>Action Support:</strong> Integrated action buttons with multi-state icons
                                        </div>
                                        <div>
                                            <strong>Reduced Motion:</strong> Respects user preferences for animations
                                        </div>
                                        <div>
                                            <strong>Layout Variants:</strong> Default, flush, spaced, outlined, elevated options
                                        </div>
                                        <div>
                                            <strong>Border Radius:</strong> Configurable rounding from none to 3xl
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Tabs Components -->
                        <section class="space-y-4">
                            <h2 class="text-lg font-semibold border-b border-border pb-2">Tabs Components</h2>

                            <div class="space-y-6">
                                <!-- Basic Tabs -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Basic Tabs</h3>
                                    <x-keys::tabs default-value="overview">
                                        <x-keys::tabs.tab value="overview" label="Overview" />
                                        <x-keys::tabs.tab value="details" label="Details" />
                                        <x-keys::tabs.tab value="settings" label="Settings" />

                                        <x-slot name="panels">
                                            <x-keys::tabs.panel value="overview">
                                                <div class="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                                                    <h4 class="font-medium mb-2">Overview Content</h4>
                                                    <p class="text-muted">This is the overview panel content. It contains general information about the product or feature.</p>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="details">
                                                <div class="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                                                    <h4 class="font-medium mb-2">Details Content</h4>
                                                    <p class="text-muted">Here you'll find detailed information, specifications, and technical details.</p>
                                                    <ul class="list-disc list-inside mt-2 text-muted">
                                                        <li>Feature A</li>
                                                        <li>Feature B</li>
                                                        <li>Feature C</li>
                                                    </ul>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="settings">
                                                <div class="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                                                    <h4 class="font-medium mb-2">Settings Panel</h4>
                                                    <p class="text-muted">Configure your preferences and options here.</p>
                                                    <div class="mt-3 space-y-2">
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2"> Enable notifications
                                                        </label>
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2"> Auto-save changes
                                                        </label>
                                                    </div>
                                                </div>
                                            </x-keys::tabs.panel>
                                        </x-slot>
                                    </x-keys::tabs>
                                </div>

                                <!-- Tabs with Icons -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Tabs with Icons</h3>
                                    <x-keys::tabs default-value="dashboard">
                                        <x-keys::tabs.tab value="dashboard" label="Dashboard" icon="heroicon-o-squares-2x2" />
                                        <x-keys::tabs.tab value="analytics" label="Analytics" icon="heroicon-o-chart-bar" />
                                        <x-keys::tabs.tab value="settings" label="Settings" icon="heroicon-o-cog-6-tooth" />
                                        <x-keys::tabs.tab value="profile" label="Profile" icon="heroicon-o-user" />

                                        <x-slot name="panels">
                                            <x-keys::tabs.panel value="dashboard">
                                                <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                                                    <h4 class="font-medium mb-2 text-blue-800 dark:text-blue-200">Dashboard</h4>
                                                    <p class="text-blue-600 dark:text-blue-300">Welcome to your dashboard! Here's an overview of your account activity.</p>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="analytics">
                                                <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                                                    <h4 class="font-medium mb-2 text-green-800 dark:text-green-200">Analytics</h4>
                                                    <p class="text-green-600 dark:text-green-300">View detailed analytics and performance metrics here.</p>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="settings">
                                                <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md">
                                                    <h4 class="font-medium mb-2 text-purple-800 dark:text-purple-200">Settings</h4>
                                                    <p class="text-purple-600 dark:text-purple-300">Manage your account settings and preferences.</p>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="profile">
                                                <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-md">
                                                    <h4 class="font-medium mb-2 text-orange-800 dark:text-orange-200">Profile</h4>
                                                    <p class="text-orange-600 dark:text-orange-300">Update your profile information and personal details.</p>
                                                </div>
                                            </x-keys::tabs.panel>
                                        </x-slot>
                                    </x-keys::tabs>
                                </div>

                                <!-- Pills Variant -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Pills Variant</h3>
                                    <x-keys::tabs variant="pills" default-value="home">
                                        <x-keys::tabs.tab value="home" label="Home" icon="heroicon-o-home" />
                                        <x-keys::tabs.tab value="projects" label="Projects" icon="heroicon-o-folder" />
                                        <x-keys::tabs.tab value="team" label="Team" icon="heroicon-o-users" />

                                        <x-slot name="panels">
                                            <x-keys::tabs.panel value="home">
                                                <div class="p-4 bg-surface border border-border rounded-md">
                                                    <h4 class="font-medium mb-2">Home Panel</h4>
                                                    <p class="text-muted">This is the home panel with pills-style tabs above.</p>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="projects">
                                                <div class="p-4 bg-surface border border-border rounded-md">
                                                    <h4 class="font-medium mb-2">Projects Panel</h4>
                                                    <p class="text-muted">View and manage your projects here.</p>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="team">
                                                <div class="p-4 bg-surface border border-border rounded-md">
                                                    <h4 class="font-medium mb-2">Team Panel</h4>
                                                    <p class="text-muted">Collaborate with your team members.</p>
                                                </div>
                                            </x-keys::tabs.panel>
                                        </x-slot>
                                    </x-keys::tabs>
                                </div>

                                <!-- Vertical Tabs -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Vertical Orientation</h3>
                                    <x-keys::tabs orientation="vertical" default-value="general">
                                        <x-keys::tabs.tab value="general" label="General" icon="heroicon-o-cog-6-tooth" />
                                        <x-keys::tabs.tab value="security" label="Security" icon="heroicon-o-shield-check" />
                                        <x-keys::tabs.tab value="notifications" label="Notifications" icon="heroicon-o-bell" />
                                        <x-keys::tabs.tab value="billing" label="Billing" icon="heroicon-o-credit-card" />

                                        <x-slot name="panels">
                                            <x-keys::tabs.panel value="general">
                                                <div class="p-4 bg-surface border border-border rounded-md">
                                                    <h4 class="font-medium mb-2">General Settings</h4>
                                                    <p class="text-muted">Configure general application settings.</p>
                                                    <div class="mt-3 space-y-2">
                                                        <div>
                                                            <label class="block text-sm font-medium mb-1">App Name</label>
                                                            <input type="text" class="w-full px-3 py-2 border border-border rounded-md" value="My Application">
                                                        </div>
                                                        <div>
                                                            <label class="block text-sm font-medium mb-1">Description</label>
                                                            <textarea class="w-full px-3 py-2 border border-border rounded-md" rows="3">Application description</textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="security">
                                                <div class="p-4 bg-surface border border-border rounded-md">
                                                    <h4 class="font-medium mb-2">Security Settings</h4>
                                                    <p class="text-muted">Manage your security preferences.</p>
                                                    <div class="mt-3 space-y-3">
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2" checked> Enable two-factor authentication
                                                        </label>
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2"> Require password for sensitive actions
                                                        </label>
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2"> Log out from all devices
                                                        </label>
                                                    </div>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="notifications">
                                                <div class="p-4 bg-surface border border-border rounded-md">
                                                    <h4 class="font-medium mb-2">Notification Preferences</h4>
                                                    <p class="text-muted">Choose how you want to be notified.</p>
                                                    <div class="mt-3 space-y-3">
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2" checked> Email notifications
                                                        </label>
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2" checked> Push notifications
                                                        </label>
                                                        <label class="flex items-center">
                                                            <input type="checkbox" class="mr-2"> SMS notifications
                                                        </label>
                                                    </div>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="billing">
                                                <div class="p-4 bg-surface border border-border rounded-md">
                                                    <h4 class="font-medium mb-2">Billing Information</h4>
                                                    <p class="text-muted">Manage your billing and subscription.</p>
                                                    <div class="mt-3">
                                                        <p class="text-sm"><strong>Current Plan:</strong> Pro Plan</p>
                                                        <p class="text-sm"><strong>Next Billing:</strong> January 1, 2025</p>
                                                        <p class="text-sm"><strong>Amount:</strong> $29.99/month</p>
                                                    </div>
                                                </div>
                                            </x-keys::tabs.panel>
                                        </x-slot>
                                    </x-keys::tabs>
                                </div>

                                <!-- Size Variants -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Size Variants</h3>
                                    <div class="space-y-4">
                                        <!-- Small -->
                                        <div>
                                            <h4 class="text-sm font-medium mb-2">Small (sm)</h4>
                                            <x-keys::tabs size="sm" default-value="tab1">
                                                <x-keys::tabs.tab value="tab1" label="Tab 1" />
                                                <x-keys::tabs.tab value="tab2" label="Tab 2" />
                                                <x-keys::tabs.tab value="tab3" label="Tab 3" />

                                                <x-slot name="panels">
                                                    <x-keys::tabs.panel value="tab1">
                                                        <div class="p-3 bg-surface border border-border rounded-md text-sm">Small tabs content</div>
                                                    </x-keys::tabs.panel>
                                                    <x-keys::tabs.panel value="tab2">
                                                        <div class="p-3 bg-surface border border-border rounded-md text-sm">Second small tab</div>
                                                    </x-keys::tabs.panel>
                                                    <x-keys::tabs.panel value="tab3">
                                                        <div class="p-3 bg-surface border border-border rounded-md text-sm">Third small tab</div>
                                                    </x-keys::tabs.panel>
                                                </x-slot>
                                            </x-keys::tabs>
                                        </div>

                                        <!-- Large -->
                                        <div>
                                            <h4 class="text-sm font-medium mb-2">Large (lg)</h4>
                                            <x-keys::tabs size="lg" default-value="large1">
                                                <x-keys::tabs.tab value="large1" label="Large Tab 1" icon="heroicon-o-star" />
                                                <x-keys::tabs.tab value="large2" label="Large Tab 2" icon="heroicon-o-heart" />

                                                <x-slot name="panels">
                                                    <x-keys::tabs.panel value="large1">
                                                        <div class="p-4 bg-surface border border-border rounded-md">
                                                            <h4 class="text-lg font-medium mb-2">Large Tab Content</h4>
                                                            <p class="text-muted">This is a large tab with bigger text and spacing.</p>
                                                        </div>
                                                    </x-keys::tabs.panel>
                                                    <x-keys::tabs.panel value="large2">
                                                        <div class="p-4 bg-surface border border-border rounded-md">
                                                            <h4 class="text-lg font-medium mb-2">Second Large Tab</h4>
                                                            <p class="text-muted">Another large tab with generous spacing.</p>
                                                        </div>
                                                    </x-keys::tabs.panel>
                                                </x-slot>
                                            </x-keys::tabs>
                                        </div>
                                    </div>
                                </div>

                                <!-- Disabled Tab -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">With Disabled Tab</h3>
                                    <x-keys::tabs default-value="available">
                                        <x-keys::tabs.tab value="available" label="Available" icon="heroicon-o-check-circle" />
                                        <x-keys::tabs.tab value="disabled" label="Coming Soon" icon="heroicon-o-clock" disabled />
                                        <x-keys::tabs.tab value="beta" label="Beta" icon="heroicon-o-beaker" />

                                        <x-slot name="panels">
                                            <x-keys::tabs.panel value="available">
                                                <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                                                    <h4 class="font-medium mb-2 text-green-800 dark:text-green-200">Available Feature</h4>
                                                    <p class="text-green-600 dark:text-green-300">This feature is fully available and ready to use.</p>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="disabled">
                                                <div class="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                                                    <h4 class="font-medium mb-2">Coming Soon</h4>
                                                    <p class="text-muted">This feature is not yet available.</p>
                                                </div>
                                            </x-keys::tabs.panel>

                                            <x-keys::tabs.panel value="beta">
                                                <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                                                    <h4 class="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Beta Feature</h4>
                                                    <p class="text-yellow-600 dark:text-yellow-300">This feature is in beta testing.</p>
                                                </div>
                                            </x-keys::tabs.panel>
                                        </x-slot>
                                    </x-keys::tabs>
                                </div>

                                <!-- Feature Highlights -->
                                <div class="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                                    <h4 class="text-sm font-medium mb-2">Tabs Features</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted">
                                        <div>
                                            <strong>Slot-Based Architecture:</strong> Nested tab and panel components using Laravel slots
                                        </div>
                                        <div>
                                            <strong>Icon Support:</strong> Full Heroicon integration with auto icon-only detection
                                        </div>
                                        <div>
                                            <strong>Accessibility First:</strong> ARIA attributes, keyboard navigation, focus management
                                        </div>
                                        <div>
                                            <strong>Multiple Variants:</strong> Default, pills, and underline styling options
                                        </div>
                                        <div>
                                            <strong>Responsive Design:</strong> Horizontal and vertical orientations with size variants
                                        </div>
                                        <div>
                                            <strong>Progressive Enhancement:</strong> Works without JavaScript, enhanced with TypeScript
                                        </div>
                                        <div>
                                            <strong>Keyboard Navigation:</strong> Arrow keys, Home, End, Enter, and Space key support
                                        </div>
                                        <div>
                                            <strong>Dark Mode:</strong> Full support for light/dark theme switching
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Table Component Section -->
                        <section class="space-y-6">
                            <div class="bg-surface p-6 rounded-lg border border-border">
                                <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <x-keys::icon name="heroicon-o-table-cells" class="text-brand" />
                                    Table Component
                                </h2>
                                <p class="text-foreground/60 mb-6">
                                    Data display component with sorting, pagination, striping, hover effects, and responsive design.
                                </p>

                                <div class="space-y-8">
                                    <!-- Basic Table -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Basic Table</h3>
                                        <x-keys::table>
                                            <x-keys::table.head>
                                                <x-keys::table.row>
                                                    <x-keys::table.header>Name</x-keys::table.header>
                                                    <x-keys::table.header>Email</x-keys::table.header>
                                                    <x-keys::table.header>Role</x-keys::table.header>
                                                    <x-keys::table.header align="end">Actions</x-keys::table.header>
                                                </x-keys::table.row>
                                            </x-keys::table.head>
                                            <x-keys::table.body>
                                                <x-keys::table.row>
                                                    <x-keys::table.cell variant="strong">John Doe</x-keys::table.cell>
                                                    <x-keys::table.cell>john@example.com</x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="success">Admin</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell align="end">
                                                        <x-keys::button size="sm" variant="outline">Edit</x-keys::button>
                                                    </x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row>
                                                    <x-keys::table.cell variant="strong">Jane Smith</x-keys::table.cell>
                                                    <x-keys::table.cell>jane@example.com</x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="blue">Editor</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell align="end">
                                                        <x-keys::button size="sm" variant="outline">Edit</x-keys::button>
                                                    </x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row>
                                                    <x-keys::table.cell variant="strong">Bob Wilson</x-keys::table.cell>
                                                    <x-keys::table.cell>bob@example.com</x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="neutral">Viewer</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell align="end">
                                                        <x-keys::button size="sm" variant="outline">Edit</x-keys::button>
                                                    </x-keys::table.cell>
                                                </x-keys::table.row>
                                            </x-keys::table.body>
                                        </x-keys::table>
                                    </div>

                                    <!-- Striped and Hover Table -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Striped & Hover Effects</h3>
                                        <x-keys::table striped hover bordered>
                                            <x-keys::table.head>
                                                <x-keys::table.row>
                                                    <x-keys::table.header>Product</x-keys::table.header>
                                                    <x-keys::table.header>Category</x-keys::table.header>
                                                    <x-keys::table.header align="end">Price</x-keys::table.header>
                                                    <x-keys::table.header align="center">Status</x-keys::table.header>
                                                </x-keys::table.row>
                                            </x-keys::table.head>
                                            <x-keys::table.body>
                                                <x-keys::table.row>
                                                    <x-keys::table.cell variant="strong">MacBook Pro</x-keys::table.cell>
                                                    <x-keys::table.cell variant="muted">Electronics</x-keys::table.cell>
                                                    <x-keys::table.cell align="end" variant="strong">$2,399</x-keys::table.cell>
                                                    <x-keys::table.cell align="center">
                                                        <x-keys::badge color="success">In Stock</x-keys::badge>
                                                    </x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row>
                                                    <x-keys::table.cell variant="strong">iPhone 15</x-keys::table.cell>
                                                    <x-keys::table.cell variant="muted">Electronics</x-keys::table.cell>
                                                    <x-keys::table.cell align="end" variant="strong">$999</x-keys::table.cell>
                                                    <x-keys::table.cell align="center">
                                                        <x-keys::badge color="warning">Low Stock</x-keys::badge>
                                                    </x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row>
                                                    <x-keys::table.cell variant="strong">AirPods Pro</x-keys::table.cell>
                                                    <x-keys::table.cell variant="muted">Electronics</x-keys::table.cell>
                                                    <x-keys::table.cell align="end" variant="strong">$249</x-keys::table.cell>
                                                    <x-keys::table.cell align="center">
                                                        <x-keys::badge color="danger">Out of Stock</x-keys::badge>
                                                    </x-keys::table.cell>
                                                </x-keys::table.row>
                                            </x-keys::table.body>
                                        </x-keys::table>
                                    </div>

                                    <!-- Interactive Sortable Table -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Interactive Sortable Headers</h3>
                                        <x-keys::table hover>
                                            <x-keys::table.head>
                                                <x-keys::table.row>
                                                    <x-keys::table.header sortable sorted direction="asc" sortKey="name">Name</x-keys::table.header>
                                                    <x-keys::table.header sortable sortKey="date">Date Created</x-keys::table.header>
                                                    <x-keys::table.header sortable sortKey="size">Size</x-keys::table.header>
                                                    <x-keys::table.header>Type</x-keys::table.header>
                                                </x-keys::table.row>
                                            </x-keys::table.head>
                                            <x-keys::table.body>
                                                <x-keys::table.row>
                                                    <x-keys::table.cell variant="strong">document.pdf</x-keys::table.cell>
                                                    <x-keys::table.cell variant="muted">Dec 15, 2024</x-keys::table.cell>
                                                    <x-keys::table.cell>2.4 MB</x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="red">PDF</x-keys::badge>
                                                    </x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row>
                                                    <x-keys::table.cell variant="strong">image.jpg</x-keys::table.cell>
                                                    <x-keys::table.cell variant="muted">Dec 14, 2024</x-keys::table.cell>
                                                    <x-keys::table.cell>856 KB</x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="green">Image</x-keys::badge>
                                                    </x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row>
                                                    <x-keys::table.cell variant="strong">spreadsheet.xlsx</x-keys::table.cell>
                                                    <x-keys::table.cell variant="muted">Dec 13, 2024</x-keys::table.cell>
                                                    <x-keys::table.cell>1.2 MB</x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="blue">Excel</x-keys::badge>
                                                    </x-keys::table.cell>
                                                </x-keys::table.row>
                                            </x-keys::table.body>
                                        </x-keys::table>
                                        <p class="text-xs text-muted mt-2">
                                            <strong>Try:</strong> Click the sortable header icons to toggle sort direction
                                        </p>
                                    </div>

                                    <!-- Row Selection Table -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Row Selection</h3>
                                        <x-keys::table hover selectable>
                                            <x-keys::table.head>
                                                <x-keys::table.row>
                                                    <x-keys::table.header selectAll />
                                                    <x-keys::table.header>User</x-keys::table.header>
                                                    <x-keys::table.header>Status</x-keys::table.header>
                                                    <x-keys::table.header>Role</x-keys::table.header>
                                                </x-keys::table.row>
                                            </x-keys::table.head>
                                            <x-keys::table.body>
                                                <x-keys::table.row selectable rowId="user-1">
                                                    <x-keys::table.cell>
                                                        <div class="flex items-center gap-3">
                                                            <x-keys::avatar name="Alice Johnson" size="sm" color="brand" />
                                                            <div>
                                                                <div class="font-medium">Alice Johnson</div>
                                                                <div class="text-xs text-muted">alice@company.com</div>
                                                            </div>
                                                        </div>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="success">Active</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell>Admin</x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row selectable rowId="user-2" selected>
                                                    <x-keys::table.cell>
                                                        <div class="flex items-center gap-3">
                                                            <x-keys::avatar name="Bob Smith" size="sm" color="success" />
                                                            <div>
                                                                <div class="font-medium">Bob Smith</div>
                                                                <div class="text-xs text-muted">bob@company.com</div>
                                                            </div>
                                                        </div>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="warning">Pending</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell>Editor</x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row selectable rowId="user-3">
                                                    <x-keys::table.cell>
                                                        <div class="flex items-center gap-3">
                                                            <x-keys::avatar name="Carol Wilson" size="sm" color="purple" />
                                                            <div>
                                                                <div class="font-medium">Carol Wilson</div>
                                                                <div class="text-xs text-muted">carol@company.com</div>
                                                            </div>
                                                        </div>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="neutral">Inactive</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell>Viewer</x-keys::table.cell>
                                                </x-keys::table.row>
                                            </x-keys::table.body>
                                        </x-keys::table>
                                        <p class="text-xs text-muted mt-2">
                                            <strong>Try:</strong> Use checkboxes to select rows. The "Select All" checkbox supports indeterminate state.
                                        </p>
                                    </div>

                                    <!-- Empty State Table -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Empty State</h3>
                                        <x-keys::table bordered>
                                            <x-keys::table.head>
                                                <x-keys::table.row>
                                                    <x-keys::table.header>Product</x-keys::table.header>
                                                    <x-keys::table.header>Price</x-keys::table.header>
                                                    <x-keys::table.header>Stock</x-keys::table.header>
                                                </x-keys::table.row>
                                            </x-keys::table.head>
                                            <x-keys::table.body>
                                                <x-keys::table.empty-state
                                                    title="No products found"
                                                    description="Start by adding your first product to the inventory."
                                                    icon="heroicon-o-cube"
                                                    actionText="Add Product"
                                                    actionUrl="#"
                                                    variant="brand"
                                                />
                                            </x-keys::table.body>
                                        </x-keys::table>
                                    </div>

                                    <!-- Loading State Table -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Loading State</h3>
                                        <x-keys::table bordered>
                                            <x-keys::table.head>
                                                <x-keys::table.row>
                                                    <x-keys::table.header>Order ID</x-keys::table.header>
                                                    <x-keys::table.header>Customer</x-keys::table.header>
                                                    <x-keys::table.header>Status</x-keys::table.header>
                                                    <x-keys::table.header>Total</x-keys::table.header>
                                                </x-keys::table.row>
                                            </x-keys::table.head>
                                            <x-keys::table.body>
                                                <x-keys::table.loading-state
                                                    text="Loading orders..."
                                                    animation="spinner"
                                                    size="md"
                                                    colspan="4"
                                                />
                                            </x-keys::table.body>
                                        </x-keys::table>
                                        <p class="text-xs text-muted mt-2">
                                            <strong>Usage:</strong> Perfect for async data loading with Livewire integration
                                        </p>
                                    </div>

                                    <!-- Clickable Rows -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Clickable Rows</h3>
                                        <x-keys::table hover>
                                            <x-keys::table.head>
                                                <x-keys::table.row>
                                                    <x-keys::table.header>User</x-keys::table.header>
                                                    <x-keys::table.header>Status</x-keys::table.header>
                                                    <x-keys::table.header>Last Active</x-keys::table.header>
                                                </x-keys::table.row>
                                            </x-keys::table.head>
                                            <x-keys::table.body>
                                                <x-keys::table.row clickable href="/users/1">
                                                    <x-keys::table.cell>
                                                        <div class="flex items-center gap-3">
                                                            <x-keys::avatar name="Alice Johnson" size="sm" color="brand" />
                                                            <div>
                                                                <div class="font-medium">Alice Johnson</div>
                                                                <div class="text-xs text-muted">alice@company.com</div>
                                                            </div>
                                                        </div>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="success">Online</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell variant="muted">2 min ago</x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row clickable href="/users/2">
                                                    <x-keys::table.cell>
                                                        <div class="flex items-center gap-3">
                                                            <x-keys::avatar name="Bob Smith" size="sm" color="success" />
                                                            <div>
                                                                <div class="font-medium">Bob Smith</div>
                                                                <div class="text-xs text-muted">bob@company.com</div>
                                                            </div>
                                                        </div>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="warning">Away</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell variant="muted">1 hour ago</x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row clickable href="/users/3">
                                                    <x-keys::table.cell>
                                                        <div class="flex items-center gap-3">
                                                            <x-keys::avatar name="Carol Wilson" size="sm" color="purple" />
                                                            <div>
                                                                <div class="font-medium">Carol Wilson</div>
                                                                <div class="text-xs text-muted">carol@company.com</div>
                                                            </div>
                                                        </div>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="neutral">Offline</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell variant="muted">2 days ago</x-keys::table.cell>
                                                </x-keys::table.row>
                                            </x-keys::table.body>
                                        </x-keys::table>
                                    </div>

                                    <!-- Size Variants -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Size Variants</h3>
                                        <div class="space-y-4">
                                            <!-- Small -->
                                            <div>
                                                <h4 class="text-sm font-medium mb-2">Small (sm)</h4>
                                                <x-keys::table size="sm" bordered>
                                                    <x-keys::table.head>
                                                        <x-keys::table.row>
                                                            <x-keys::table.header size="sm">Item</x-keys::table.header>
                                                            <x-keys::table.header size="sm">Quantity</x-keys::table.header>
                                                            <x-keys::table.header size="sm" align="end">Price</x-keys::table.header>
                                                        </x-keys::table.row>
                                                    </x-keys::table.head>
                                                    <x-keys::table.body>
                                                        <x-keys::table.row>
                                                            <x-keys::table.cell size="sm">Coffee</x-keys::table.cell>
                                                            <x-keys::table.cell size="sm">2</x-keys::table.cell>
                                                            <x-keys::table.cell size="sm" align="end">$8.00</x-keys::table.cell>
                                                        </x-keys::table.row>
                                                        <x-keys::table.row>
                                                            <x-keys::table.cell size="sm">Pastry</x-keys::table.cell>
                                                            <x-keys::table.cell size="sm">1</x-keys::table.cell>
                                                            <x-keys::table.cell size="sm" align="end">$3.50</x-keys::table.cell>
                                                        </x-keys::table.row>
                                                    </x-keys::table.body>
                                                </x-keys::table>
                                            </div>

                                            <!-- Large -->
                                            <div>
                                                <h4 class="text-sm font-medium mb-2">Large (lg)</h4>
                                                <x-keys::table size="lg" bordered>
                                                    <x-keys::table.head>
                                                        <x-keys::table.row>
                                                            <x-keys::table.header size="lg">Project</x-keys::table.header>
                                                            <x-keys::table.header size="lg">Description</x-keys::table.header>
                                                            <x-keys::table.header size="lg" align="center">Status</x-keys::table.header>
                                                        </x-keys::table.row>
                                                    </x-keys::table.head>
                                                    <x-keys::table.body>
                                                        <x-keys::table.row>
                                                            <x-keys::table.cell size="lg" variant="strong">Website Redesign</x-keys::table.cell>
                                                            <x-keys::table.cell size="lg">Complete overhaul of company website with new branding</x-keys::table.cell>
                                                            <x-keys::table.cell size="lg" align="center">
                                                                <x-keys::badge color="success">Complete</x-keys::badge>
                                                            </x-keys::table.cell>
                                                        </x-keys::table.row>
                                                        <x-keys::table.row>
                                                            <x-keys::table.cell size="lg" variant="strong">Mobile App</x-keys::table.cell>
                                                            <x-keys::table.cell size="lg">Development of iOS and Android applications</x-keys::table.cell>
                                                            <x-keys::table.cell size="lg" align="center">
                                                                <x-keys::badge color="warning">In Progress</x-keys::badge>
                                                            </x-keys::table.cell>
                                                        </x-keys::table.row>
                                                    </x-keys::table.body>
                                                </x-keys::table>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Row States -->
                                    <div>
                                        <h3 class="text-base font-medium mb-3">Row States</h3>
                                        <x-keys::table hover>
                                            <x-keys::table.head>
                                                <x-keys::table.row>
                                                    <x-keys::table.header>Task</x-keys::table.header>
                                                    <x-keys::table.header>Priority</x-keys::table.header>
                                                    <x-keys::table.header>Status</x-keys::table.header>
                                                </x-keys::table.row>
                                            </x-keys::table.head>
                                            <x-keys::table.body>
                                                <x-keys::table.row selected>
                                                    <x-keys::table.cell variant="strong">Selected Task</x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="danger">High</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell variant="success">Active</x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row variant="success">
                                                    <x-keys::table.cell variant="strong">Success Task</x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="success">Low</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell variant="success">Completed</x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row variant="warning">
                                                    <x-keys::table.cell variant="strong">Warning Task</x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="warning">Medium</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell variant="warning">Needs Attention</x-keys::table.cell>
                                                </x-keys::table.row>
                                                <x-keys::table.row variant="danger">
                                                    <x-keys::table.cell variant="strong">Error Task</x-keys::table.cell>
                                                    <x-keys::table.cell>
                                                        <x-keys::badge color="danger">Critical</x-keys::badge>
                                                    </x-keys::table.cell>
                                                    <x-keys::table.cell variant="danger">Failed</x-keys::table.cell>
                                                </x-keys::table.row>
                                            </x-keys::table.body>
                                        </x-keys::table>
                                    </div>

                                    <!-- Feature Highlights -->
                                    <div class="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-md">
                                        <h4 class="text-sm font-medium mb-2">Table Features</h4>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted">
                                            <div>
                                                <strong>Nested Architecture:</strong> Table, Head, Body, Row, Cell, Header components
                                            </div>
                                            <div>
                                                <strong>Sortable Headers:</strong> Sort icons with direction indicators and hover states
                                            </div>
                                            <div>
                                                <strong>Row States:</strong> Selected, success, warning, danger variants
                                            </div>
                                            <div>
                                                <strong>Cell Alignment:</strong> Start, center, end alignment options
                                            </div>
                                            <div>
                                                <strong>Size Variants:</strong> Small, medium, large with consistent spacing
                                            </div>
                                            <div>
                                                <strong>Interactive Sorting:</strong> Click headers to toggle sort direction with TypeScript integration
                                            </div>
                                            <div>
                                                <strong>Row Selection:</strong> Checkbox-based selection with "select all" and indeterminate states
                                            </div>
                                            <div>
                                                <strong>Empty States:</strong> Customizable empty state with actions and icons
                                            </div>
                                            <div>
                                                <strong>Loading States:</strong> Built-in loading indicators with animation variants
                                            </div>
                                            <div>
                                                <strong>Interactive Rows:</strong> Clickable rows with href navigation
                                            </div>
                                            <div>
                                                <strong>Visual Effects:</strong> Striped rows, hover effects, bordered tables
                                            </div>
                                            <div>
                                                <strong>Responsive Design:</strong> Overflow handling and flexible layouts
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Tooltip Components -->
                        <section class="space-y-4">
                            <h2 class="text-lg font-semibold border-b border-border pb-2">Tooltip Components</h2>
                            <div class="space-y-6">
                                <!-- Basic Tooltips -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Basic Tooltips</h3>
                                    <div class="flex flex-wrap items-center gap-6">
                                        <div class="relative">
                                            <x-keys::button variant="brand" data-tooltip-target="tooltip-basic">
                                                Hover me
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-basic" placement="top">
                                                This is a basic tooltip with default settings
                                            </x-keys::tooltip>
                                        </div>

                                        <div class="relative">
                                            <x-keys::button variant="success" data-tooltip-target="tooltip-click">
                                                Click me
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-click" trigger="click" placement="bottom">
                                                This tooltip appears on click
                                            </x-keys::tooltip>
                                        </div>

                                        <div class="relative">
                                            <x-keys::input placeholder="Focus me" data-tooltip-target="tooltip-focus" />
                                            <x-keys::tooltip id="tooltip-focus" trigger="focus" placement="right">
                                                This tooltip appears on focus
                                            </x-keys::tooltip>
                                        </div>
                                    </div>
                                </div>

                                <!-- Placement Options -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Placement Options</h3>
                                    <div class="grid grid-cols-2 gap-6 max-w-lg mx-auto">
                                        <div class="text-center">
                                            <x-keys::button variant="neutral" data-tooltip-target="tooltip-top">
                                                Top
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-top" placement="top">
                                                Tooltip on top
                                            </x-keys::tooltip>
                                        </div>

                                        <div class="text-center">
                                            <x-keys::button variant="neutral" data-tooltip-target="tooltip-bottom">
                                                Bottom
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-bottom" placement="bottom">
                                                Tooltip on bottom
                                            </x-keys::tooltip>
                                        </div>

                                        <div class="text-center">
                                            <x-keys::button variant="neutral" data-tooltip-target="tooltip-left">
                                                Left
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-left" placement="left">
                                                Tooltip on left
                                            </x-keys::tooltip>
                                        </div>

                                        <div class="text-center">
                                            <x-keys::button variant="neutral" data-tooltip-target="tooltip-right">
                                                Right
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-right" placement="right">
                                                Tooltip on right
                                            </x-keys::tooltip>
                                        </div>
                                    </div>
                                </div>

                                <!-- Color Variants -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Color Variants</h3>
                                    <div class="flex flex-wrap items-center gap-4">
                                        <div class="relative">
                                            <x-keys::button variant="brand" data-tooltip-target="tooltip-dark">
                                                Dark
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-dark" color="dark">
                                                Dark tooltip (default)
                                            </x-keys::tooltip>
                                        </div>

                                        <div class="relative">
                                            <x-keys::button variant="neutral" data-tooltip-target="tooltip-light">
                                                Light
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-light" color="light">
                                                Light tooltip with shadow
                                            </x-keys::tooltip>
                                        </div>
                                    </div>
                                </div>

                                <!-- Size Variants -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Size Variants</h3>
                                    <div class="flex flex-wrap items-center gap-4">
                                        <div class="relative">
                                            <x-keys::button variant="success" size="sm" data-tooltip-target="tooltip-sm">
                                                Small
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-sm" size="sm">
                                                Small tooltip
                                            </x-keys::tooltip>
                                        </div>

                                        <div class="relative">
                                            <x-keys::button variant="warning" data-tooltip-target="tooltip-md">
                                                Medium
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-md" size="md">
                                                Medium tooltip (default)
                                            </x-keys::tooltip>
                                        </div>

                                        <div class="relative">
                                            <x-keys::button variant="danger" size="lg" data-tooltip-target="tooltip-lg">
                                                Large
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-lg" size="lg">
                                                Large tooltip with more content
                                            </x-keys::tooltip>
                                        </div>
                                    </div>
                                </div>

                                <!-- With and Without Arrows -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Arrow Options</h3>
                                    <div class="flex flex-wrap items-center gap-4">
                                        <div class="relative">
                                            <x-keys::button variant="purple" data-tooltip-target="tooltip-arrow">
                                                With Arrow
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-arrow" :arrow="true">
                                                Tooltip with arrow (default)
                                            </x-keys::tooltip>
                                        </div>

                                        <div class="relative">
                                            <x-keys::button variant="pink" data-tooltip-target="tooltip-no-arrow">
                                                No Arrow
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-no-arrow" :arrow="false">
                                                Tooltip without arrow
                                            </x-keys::tooltip>
                                        </div>
                                    </div>
                                </div>

                                <!-- Complex Content -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Rich Content</h3>
                                    <div class="flex flex-wrap items-center gap-4">
                                        <div class="relative">
                                            <x-keys::avatar name="John Doe" status="online" data-tooltip-target="tooltip-avatar" />
                                            <x-keys::tooltip id="tooltip-avatar" size="lg" placement="bottom">
                                                <div class="text-center">
                                                    <div class="font-medium">John Doe</div>
                                                    <div class="text-xs opacity-75">Senior Developer</div>
                                                    <div class="text-xs opacity-75 mt-1">Online now</div>
                                                </div>
                                            </x-keys::tooltip>
                                        </div>

                                        <div class="relative">
                                            <x-keys::badge color="warning" data-tooltip-target="tooltip-badge">
                                                Beta
                                            </x-keys::badge>
                                            <x-keys::tooltip id="tooltip-badge">
                                                This feature is currently in beta testing
                                            </x-keys::tooltip>
                                        </div>
                                    </div>
                                </div>

                                <!-- Delay Options -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Custom Delays</h3>
                                    <div class="flex flex-wrap items-center gap-4">
                                        <div class="relative">
                                            <x-keys::button variant="indigo" data-tooltip-target="tooltip-fast">
                                                Fast (50ms)
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-fast" :delay="50">
                                                Fast appearing tooltip
                                            </x-keys::tooltip>
                                        </div>

                                        <div class="relative">
                                            <x-keys::button variant="cyan" data-tooltip-target="tooltip-slow">
                                                Slow (500ms)
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-slow" :delay="500">
                                                Slow appearing tooltip
                                            </x-keys::tooltip>
                                        </div>
                                    </div>
                                </div>

                                <!-- Disabled State -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Disabled Tooltip</h3>
                                    <div class="flex flex-wrap items-center gap-4">
                                        <div class="relative">
                                            <x-keys::button variant="neutral" disabled data-tooltip-target="tooltip-disabled">
                                                Disabled Button
                                            </x-keys::button>
                                            <x-keys::tooltip id="tooltip-disabled" :disabled="true">
                                                This tooltip won't show (disabled)
                                            </x-keys::tooltip>
                                        </div>
                                    </div>
                                </div>

                                <!-- Features Summary -->
                                <div>
                                    <h3 class="text-base font-medium mb-3">Tooltip Features</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <strong>Smart Positioning:</strong>
                                            <ul class="list-disc pl-4 text-muted">
                                                <li>Collision detection</li>
                                                <li>Viewport constraints</li>
                                                <li>Automatic fallback placement</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <strong>Interaction Types:</strong>
                                            <ul class="list-disc pl-4 text-muted">
                                                <li>Hover (default)</li>
                                                <li>Click to toggle</li>
                                                <li>Focus for form elements</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <strong>Accessibility:</strong>
                                            <ul class="list-disc pl-4 text-muted">
                                                <li>ARIA attributes</li>
                                                <li>Keyboard ESC support</li>
                                                <li>Focus management</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <strong>Dynamic Features:</strong>
                                            <ul class="list-disc pl-4 text-muted">
                                                <li>Auto-initialization</li>
                                                <li>Livewire compatibility</li>
                                                <li>Mutation observer support</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <footer class="text-center mt-8 text-sm text-muted">
                    <p>This page demonstrates Keys UI Breadcrumbs, Avatar, Badge, Modal, Toast, Table, Tabs, and Tooltip components.</p>
                    <p class="mt-1">Components: Breadcrumbs, Avatar/Stack, Badge with auto icon-only detection, Modal with native dialog features, Toast with server-side dispatching, Table with nested architecture and sortable headers, Tabs with slot-based architecture and keyboard navigation, Tooltip with smart positioning and multiple trigger types.</p>
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
