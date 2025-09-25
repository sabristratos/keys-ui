<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @vite(['resources/css/app.css', 'resources/js/app.js'])
        <keys:scripts />
    </head>
    <body class="bg-body text-foreground font-sans">
        <div class="container mx-auto px-8 py-12">
            <div class="max-w-7xl mx-auto">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-foreground mb-4">Keys UI Component Library</h1>
                    <p class="text-xl text-muted-foreground mb-8">
                        Modern Blade components for Laravel applications
                    </p>

                    <div class="bg-green-50 border border-green-200 rounded-lg p-8 max-w-2xl mx-auto mb-12">
                        <x-keys::icon name="heroicon-o-check-circle" size="lg" class="text-green-600 mx-auto mb-4" />
                        <h2 class="text-xl font-semibold text-green-900 mb-3">Modern Popover Component</h2>
                        <p class="text-green-800 mb-4">
                            Keys UI now features a modern Popover component built with the native HTML Popover API and CSS Anchor Positioning for maximum performance and accessibility.
                        </p>
                        <p class="text-sm text-green-700">
                            The component works without JavaScript for basic functionality, with progressive enhancement using Floating UI for advanced positioning in older browsers.
                        </p>
                    </div>

                    <!-- Popover Component Examples -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        <!-- Basic Popover -->
                        <div class="rounded-lg border border-border p-6">
                            <h3 class="text-lg font-semibold mb-4">Basic Popover</h3>
                            <p class="text-muted-foreground mb-4">Click the button to show a popover with basic content.</p>

                            <x-keys::popover id="basic-popover" placement="top">
                                <x-slot:trigger>
                                    <x-keys::button variant="brand">Show Popover</x-keys::button>
                                </x-slot:trigger>
                                <div class="text-center">
                                    <p class="font-semibold mb-2">Welcome!</p>
                                    <p class="text-sm text-muted-foreground">This is a basic popover using the native HTML Popover API.</p>
                                </div>
                            </x-keys::popover>
                        </div>

                        <!-- Tooltip Style -->
                        <div class="rounded-lg border border-border p-6">
                            <h3 class="text-lg font-semibold mb-4">Tooltip Style</h3>
                            <p class="text-muted-foreground mb-4">Hover over the button to show a tooltip-style popover.</p>

                            <x-keys::popover id="tooltip-popover" placement="bottom" variant="tooltip" trigger="hover" delay="300">
                                <x-slot:trigger>
                                    <x-keys::button variant="outline" icon="heroicon-o-information-circle">Hover Me</x-keys::button>
                                </x-slot:trigger>
                                <span class="text-white text-sm">This is helpful information!</span>
                            </x-keys::popover>
                        </div>

                        <!-- Menu Style -->
                        <div class="rounded-lg border border-border p-6">
                            <h3 class="text-lg font-semibold mb-4">Menu Style</h3>
                            <p class="text-muted-foreground mb-4">Click to show a menu-style popover with actions.</p>

                            <x-keys::popover id="menu-popover" placement="bottom-start" variant="menu">
                                <x-slot:trigger>
                                    <x-keys::button variant="outline" icon="heroicon-o-ellipsis-horizontal">Actions</x-keys::button>
                                </x-slot:trigger>
                                <div class="py-1">
                                    <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 rounded">
                                        <x-keys::icon name="heroicon-o-pencil" size="sm" />
                                        Edit
                                    </a>
                                    <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 rounded">
                                        <x-keys::icon name="heroicon-o-share" size="sm" />
                                        Share
                                    </a>
                                    <hr class="my-1">
                                    <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                                        <x-keys::icon name="heroicon-o-trash" size="sm" />
                                        Delete
                                    </a>
                                </div>
                            </x-keys::popover>
                        </div>

                        <!-- Different Placements -->
                        <div class="rounded-lg border border-border p-6">
                            <h3 class="text-lg font-semibold mb-4">Placement Options</h3>
                            <p class="text-muted-foreground mb-4">Popovers can be positioned in different directions.</p>

                            <div class="grid grid-cols-2 gap-2">
                                <x-keys::popover id="top-popover" placement="top" size="sm">
                                    <x-slot:trigger>
                                        <x-keys::button variant="outline" size="sm">Top</x-keys::button>
                                    </x-slot:trigger>
                                    <p class="text-sm">Positioned at the top</p>
                                </x-keys::popover>

                                <x-keys::popover id="right-popover" placement="right" size="sm">
                                    <x-slot:trigger>
                                        <x-keys::button variant="outline" size="sm">Right</x-keys::button>
                                    </x-slot:trigger>
                                    <p class="text-sm">Positioned to the right</p>
                                </x-keys::popover>

                                <x-keys::popover id="bottom-popover" placement="bottom" size="sm">
                                    <x-slot:trigger>
                                        <x-keys::button variant="outline" size="sm">Bottom</x-keys::button>
                                    </x-slot:trigger>
                                    <p class="text-sm">Positioned at the bottom</p>
                                </x-keys::popover>

                                <x-keys::popover id="left-popover" placement="left" size="sm">
                                    <x-slot:trigger>
                                        <x-keys::button variant="outline" size="sm">Left</x-keys::button>
                                    </x-slot:trigger>
                                    <p class="text-sm">Positioned to the left</p>
                                </x-keys::popover>
                            </div>
                        </div>

                        <!-- Size Variants -->
                        <div class="rounded-lg border border-border p-6">
                            <h3 class="text-lg font-semibold mb-4">Size Variants</h3>
                            <p class="text-muted-foreground mb-4">Popovers come in different sizes.</p>

                            <div class="flex flex-wrap gap-2">
                                <x-keys::popover id="small-popover" placement="top" size="sm">
                                    <x-slot:trigger>
                                        <x-keys::button variant="outline" size="sm">Small</x-keys::button>
                                    </x-slot:trigger>
                                    <p class="text-xs">Small popover content</p>
                                </x-keys::popover>

                                <x-keys::popover id="medium-popover" placement="top" size="md">
                                    <x-slot:trigger>
                                        <x-keys::button variant="outline">Medium</x-keys::button>
                                    </x-slot:trigger>
                                    <p class="text-sm">Medium popover content with more text</p>
                                </x-keys::popover>

                                <x-keys::popover id="large-popover" placement="top" size="lg">
                                    <x-slot:trigger>
                                        <x-keys::button variant="outline">Large</x-keys::button>
                                    </x-slot:trigger>
                                    <div>
                                        <p class="text-base font-semibold mb-2">Large Popover</p>
                                        <p class="text-sm text-muted-foreground">This is a larger popover with more content and better spacing for complex information.</p>
                                    </div>
                                </x-keys::popover>
                            </div>
                        </div>

                        <!-- Focus Trigger -->
                        <div class="rounded-lg border border-border p-6">
                            <h3 class="text-lg font-semibold mb-4">Focus Trigger</h3>
                            <p class="text-muted-foreground mb-4">Tab to or click on the input to show help text.</p>

                            <x-keys::popover id="focus-popover" placement="right" trigger="focus" variant="tooltip">
                                <x-slot:trigger>
                                    <x-keys::input placeholder="Enter your username" />
                                </x-slot:trigger>
                                <span class="text-white text-sm">Username must be 3-20 characters long</span>
                            </x-keys::popover>
                        </div>
                    </div>

                    <!-- Dropdown Component Demos -->
                    <div class="mt-16">
                        <h2 class="text-2xl font-bold text-center mb-8">Dropdown Components</h2>
                        <p class="text-center text-muted-foreground mb-8">Modern dropdown components using CSS anchor positioning with comprehensive menu items</p>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <!-- Basic Dropdown -->
                            <div class="rounded-lg border border-border p-6">
                                <h3 class="text-lg font-semibold mb-4">Basic Dropdown</h3>
                                <p class="text-muted-foreground mb-4">Simple dropdown with menu items and different variants.</p>

                                <x-keys::dropdown id="basic-dropdown" position="bottom" align="start">
                                    <x-slot:trigger>
                                        <x-keys::button variant="outline" icon="heroicon-o-chevron-down">
                                            Options
                                        </x-keys::button>
                                    </x-slot:trigger>

                                    <x-keys::menu.item icon="heroicon-o-eye" href="#">
                                        View Details
                                    </x-keys::menu.item>
                                    <x-keys::menu.item icon="heroicon-o-pencil" href="#" variant="brand">
                                        Edit Item
                                    </x-keys::menu.item>
                                    <x-keys::menu.item icon="heroicon-o-share" href="#">
                                        Share
                                    </x-keys::menu.item>
                                    <hr class="my-1">
                                    <x-keys::menu.item icon="heroicon-o-trash" href="#" variant="danger">
                                        Delete
                                    </x-keys::menu.item>
                                </x-keys::dropdown>
                            </div>

                            <!-- Dropdown with Keyboard Shortcuts -->
                            <div class="rounded-lg border border-border p-6">
                                <h3 class="text-lg font-semibold mb-4">With Shortcuts</h3>
                                <p class="text-muted-foreground mb-4">Dropdown showing keyboard shortcuts and different states.</p>

                                <x-keys::dropdown id="shortcuts-dropdown" position="bottom" align="center">
                                    <x-slot:trigger>
                                        <x-keys::button variant="brand" icon="heroicon-o-cog-6-tooth">
                                            Actions
                                        </x-keys::button>
                                    </x-slot:trigger>

                                    <x-keys::menu.item icon="heroicon-o-document-duplicate" kbd="⌘C">
                                        Copy
                                    </x-keys::menu.item>
                                    <x-keys::menu.item icon="heroicon-o-scissors" kbd="⌘X">
                                        Cut
                                    </x-keys::menu.item>
                                    <x-keys::menu.item icon="heroicon-o-clipboard" kbd="⌘V">
                                        Paste
                                    </x-keys::menu.item>
                                    <hr class="my-1">
                                    <x-keys::menu.item icon="heroicon-o-arrow-uturn-left" kbd="⌘Z">
                                        Undo
                                    </x-keys::menu.item>
                                    <x-keys::menu.item icon="heroicon-o-arrow-uturn-right" kbd="⌘⇧Z">
                                        Redo
                                    </x-keys::menu.item>
                                    <hr class="my-1">
                                    <x-keys::menu.item icon="heroicon-o-cog-6-tooth" kbd="⌘,">
                                        Settings
                                    </x-keys::menu.item>
                                </x-keys::dropdown>
                            </div>

                            <!-- Dropdown with Multi-State Items -->
                            <div class="rounded-lg border border-border p-6">
                                <h3 class="text-lg font-semibold mb-4">Multi-State Items</h3>
                                <p class="text-muted-foreground mb-4">Interactive items with toggle states and success feedback.</p>

                                <x-keys::dropdown id="multistate-dropdown" position="bottom" align="end">
                                    <x-slot:trigger>
                                        <x-keys::button variant="outline" icon="heroicon-o-ellipsis-vertical">
                                            More
                                        </x-keys::button>
                                    </x-slot:trigger>

                                    <x-keys::menu.item
                                        icon="heroicon-o-eye"
                                        icon-toggle="heroicon-o-eye-slash"
                                        label-toggle="Hide Item"
                                        :keep-open="true"
                                    >
                                        Show Item
                                    </x-keys::menu.item>
                                    <x-keys::menu.item
                                        icon="heroicon-o-heart"
                                        icon-toggle="heroicon-s-heart"
                                        icon-success="heroicon-s-check-circle"
                                        label-success="Liked!"
                                        variant="danger"
                                        :keep-open="true"
                                    >
                                        Like
                                    </x-keys::menu.item>
                                    <x-keys::menu.item
                                        icon="heroicon-o-bookmark"
                                        icon-toggle="heroicon-s-bookmark"
                                        label-toggle="Bookmarked"
                                        variant="success"
                                        :keep-open="true"
                                    >
                                        Bookmark
                                    </x-keys::menu.item>
                                    <hr class="my-1">
                                    <x-keys::menu.item icon="heroicon-o-information-circle" disabled>
                                        Disabled Item
                                    </x-keys::menu.item>
                                </x-keys::dropdown>
                            </div>

                            <!-- Dropdown with Submenu -->
                            <div class="rounded-lg border border-border p-6">
                                <h3 class="text-lg font-semibold mb-4">With Submenus</h3>
                                <p class="text-muted-foreground mb-4">Nested dropdown menus with submenus for complex navigation.</p>

                                <x-keys::dropdown id="submenu-dropdown" position="bottom" align="start">
                                    <x-slot:trigger>
                                        <x-keys::button variant="ghost" icon="heroicon-o-squares-plus">
                                            Create
                                        </x-keys::button>
                                    </x-slot:trigger>

                                    <x-keys::menu.item icon="heroicon-o-document-text">
                                        New Document
                                    </x-keys::menu.item>
                                    <x-keys::menu.item icon="heroicon-o-folder-plus">
                                        New Folder
                                    </x-keys::menu.item>

                                    <x-keys::menu.submenu icon="heroicon-o-photo" heading="Import">
                                        <x-keys::menu.item icon="heroicon-o-cloud-arrow-up">
                                            From Cloud
                                        </x-keys::menu.item>
                                        <x-keys::menu.item icon="heroicon-o-computer-desktop">
                                            From Computer
                                        </x-keys::menu.item>
                                        <x-keys::menu.item icon="heroicon-o-link">
                                            From URL
                                        </x-keys::menu.item>
                                        <hr class="my-1">
                                        <x-keys::menu.item icon="heroicon-o-arrow-down-tray" variant="brand">
                                            Bulk Import
                                        </x-keys::menu.item>
                                    </x-keys::menu.submenu>

                                    <x-keys::menu.submenu icon="heroicon-o-share" heading="Export">
                                        <x-keys::menu.item icon="heroicon-o-document-arrow-down">
                                            Export as PDF
                                        </x-keys::menu.item>
                                        <x-keys::menu.item icon="heroicon-o-table-cells">
                                            Export as CSV
                                        </x-keys::menu.item>
                                        <x-keys::menu.item icon="heroicon-o-code-bracket">
                                            Export as JSON
                                        </x-keys::menu.item>
                                    </x-keys::menu.submenu>

                                    <hr class="my-1">
                                    <x-keys::menu.item icon="heroicon-o-cog-6-tooth">
                                        Templates
                                    </x-keys::menu.item>
                                </x-keys::dropdown>
                            </div>

                            <!-- Different Positions -->
                            <div class="rounded-lg border border-border p-6">
                                <h3 class="text-lg font-semibold mb-4">Position Variants</h3>
                                <p class="text-muted-foreground mb-4">Dropdowns can be positioned in different directions.</p>

                                <div class="grid grid-cols-2 gap-3">
                                    <x-keys::dropdown id="top-dropdown" position="top" align="center">
                                        <x-slot:trigger>
                                            <x-keys::button variant="outline" size="sm">Top</x-keys::button>
                                        </x-slot:trigger>
                                        <x-keys::menu.item icon="heroicon-o-arrow-up">Up Arrow</x-keys::menu.item>
                                        <x-keys::menu.item>Top Menu Item</x-keys::menu.item>
                                    </x-keys::dropdown>

                                    <x-keys::dropdown id="right-dropdown" position="right" align="start">
                                        <x-slot:trigger>
                                            <x-keys::button variant="outline" size="sm">Right</x-keys::button>
                                        </x-slot:trigger>
                                        <x-keys::menu.item icon="heroicon-o-arrow-right">Right Arrow</x-keys::menu.item>
                                        <x-keys::menu.item>Right Menu Item</x-keys::menu.item>
                                    </x-keys::dropdown>

                                    <x-keys::dropdown id="left-dropdown" position="left" align="start">
                                        <x-slot:trigger>
                                            <x-keys::button variant="outline" size="sm">Left</x-keys::button>
                                        </x-slot:trigger>
                                        <x-keys::menu.item icon="heroicon-o-arrow-left">Left Arrow</x-keys::menu.item>
                                        <x-keys::menu.item>Left Menu Item</x-keys::menu.item>
                                    </x-keys::dropdown>

                                    <x-keys::dropdown id="bottom-end-dropdown" position="bottom" align="end">
                                        <x-slot:trigger>
                                            <x-keys::button variant="outline" size="sm">Bottom End</x-keys::button>
                                        </x-slot:trigger>
                                        <x-keys::menu.item icon="heroicon-o-arrow-down">Down Arrow</x-keys::menu.item>
                                        <x-keys::menu.item>Bottom End Item</x-keys::menu.item>
                                    </x-keys::dropdown>
                                </div>
                            </div>

                            <!-- Large Dropdown -->
                            <div class="rounded-lg border border-border p-6">
                                <h3 class="text-lg font-semibold mb-4">Large Dropdown</h3>
                                <p class="text-muted-foreground mb-4">Large dropdown with comprehensive menu structure.</p>

                                <x-keys::dropdown id="large-dropdown" size="lg" position="bottom" align="start">
                                    <x-slot:trigger>
                                        <x-keys::button variant="brand" size="lg" icon="heroicon-o-squares-2x2">
                                            Dashboard
                                        </x-keys::button>
                                    </x-slot:trigger>

                                    <div class="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                                        Analytics
                                    </div>
                                    <x-keys::menu.item icon="heroicon-o-chart-bar" href="#" kbd="⌘A">
                                        Overview
                                    </x-keys::menu.item>
                                    <x-keys::menu.item icon="heroicon-o-users" href="#" variant="brand">
                                        Users
                                    </x-keys::menu.item>
                                    <x-keys::menu.item icon="heroicon-o-banknotes" href="#" variant="success">
                                        Revenue
                                    </x-keys::menu.item>

                                    <div class="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
                                        Management
                                    </div>
                                    <x-keys::menu.item icon="heroicon-o-cog-6-tooth" href="#">
                                        Settings
                                    </x-keys::menu.item>
                                    <x-keys::menu.item icon="heroicon-o-user-group" href="#">
                                        Team
                                    </x-keys::menu.item>

                                    <x-keys::menu.submenu icon="heroicon-o-wrench-screwdriver" heading="Tools">
                                        <x-keys::menu.item icon="heroicon-o-bug-ant">
                                            Debug Console
                                        </x-keys::menu.item>
                                        <x-keys::menu.item icon="heroicon-o-cpu-chip">
                                            System Monitor
                                        </x-keys::menu.item>
                                        <x-keys::menu.item icon="heroicon-o-clipboard-document-list">
                                            Logs
                                        </x-keys::menu.item>
                                    </x-keys::menu.submenu>

                                    <hr class="my-1">
                                    <x-keys::menu.item icon="heroicon-o-arrow-right-on-rectangle" href="#" variant="danger">
                                        Sign Out
                                    </x-keys::menu.item>
                                </x-keys::dropdown>
                            </div>
                        </div>
                    </div>

                    <!-- CSS Anchor Positioning Notice -->
                    <div class="mt-16 bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-4xl mx-auto">
                        <div class="flex items-start">
                            <x-keys::icon name="heroicon-o-information-circle" size="lg" class="text-blue-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h3 class="text-lg font-semibold text-blue-900 mb-2">Modern CSS Anchor Positioning</h3>
                                <p class="text-blue-800 mb-3">
                                    All positioning components (Popover, Dropdown, Tooltip) now use CSS Anchor Positioning with the OddBird polyfill for maximum performance and compatibility.
                                </p>
                                <ul class="text-sm text-blue-700 space-y-1">
                                    <li>• <strong>Native Performance:</strong> CSS handles positioning without JavaScript overhead</li>
                                    <li>• <strong>Modern Standards:</strong> Uses cutting-edge web technologies with polyfill fallback</li>
                                    <li>• <strong>Consistent API:</strong> All overlay components share the same positioning system</li>
                                    <li>• <strong>Future-Proof:</strong> Ready for native browser support as it becomes available</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
