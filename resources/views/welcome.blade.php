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
                <!-- Header -->
                <div class="text-center mb-16">
                    <h1 class="text-4xl font-bold text-foreground mb-4">Keys UI Component Library</h1>
                    <p class="text-xl text-muted-foreground mb-8">
                        Modern Blade components for Laravel applications
                    </p>

                    <div class="flex flex-wrap justify-center gap-2 mb-8">
                        <x-keys::badge color="brand" icon="heroicon-o-code-bracket">Modern Components</x-keys::badge>
                        <x-keys::badge color="success" icon="heroicon-o-check-circle">Laravel Ready</x-keys::badge>
                        <x-keys::badge color="info" icon="heroicon-o-sparkles">Tailwind v4</x-keys::badge>
                        <x-keys::badge color="purple" icon="heroicon-o-cpu-chip">Performance</x-keys::badge>
                    </div>
                </div>



                <!-- DatePicker Test Section -->
                <section class="mb-20">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl font-bold text-foreground mb-4">DatePicker Test</h2>
                        <p class="text-lg text-muted-foreground">
                            Testing DatePicker with various configurations and feature sets
                        </p>
                    </div>

                    <div class="max-w-4xl mx-auto space-y-8">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Basic DatePickers -->
                            <div class="space-y-6">
                                <h3 class="text-xl font-semibold mb-4">Basic DatePickers</h3>

                                <x-keys::date-picker
                                    name="basic_date"
                                    label="Basic DatePicker"
                                    placeholder="Select a date"
                                    value="2024-03-15"
                                />

                                <x-keys::date-picker
                                    name="clearable_date"
                                    label="Clearable DatePicker"
                                    placeholder="Select a date"
                                    clearable
                                    value="2024-04-20"
                                />

                                <x-keys::date-picker
                                    name="with_icon_date"
                                    label="With Left Icon"
                                    placeholder="Select a date"
                                    icon-left="heroicon-o-user"
                                    clearable
                                />
                            </div>

                            <!-- Advanced DatePickers -->
                            <div class="space-y-6">
                                <h3 class="text-xl font-semibold mb-4">Advanced Features</h3>

                                <x-keys::date-picker
                                    name="range_date"
                                    label="Date Range Picker"
                                    placeholder="Select date range"
                                    :is-range="true"
                                    :quick-selectors="true"
                                    clearable
                                />

                                <x-keys::date-picker
                                    name="quick_date"
                                    label="With Quick Selectors"
                                    placeholder="Select a date"
                                    :quick-selectors="true"
                                    clearable
                                />

                                <x-keys::date-picker
                                    name="custom_format_date"
                                    label="Custom Format (F j, Y)"
                                    placeholder="Select a date"
                                    format="Y-m-d"
                                    display-format="F j, Y"
                                    clearable
                                    value="2024-12-25"
                                />
                            </div>
                        </div>

                        <!-- Inline Calendar -->
                        <div class="border border-border rounded-lg p-6">
                            <h3 class="text-xl font-semibold mb-4">Inline Calendar</h3>
                            <x-keys::date-picker
                                name="inline_date"
                                label="Always Visible Calendar"
                                :inline="true"
                                value="2024-06-15"
                            />
                        </div>
                    </div>
                </section>

                <!-- Calendar Component Testing Section -->
                <section class="mb-20">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl font-bold text-foreground mb-4">Calendar Component Testing</h2>
                        <p class="text-lg text-muted-foreground">
                            Testing standalone Calendar component with various quick selector configurations
                        </p>
                    </div>

                    <div class="max-w-4xl mx-auto space-y-8">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Basic Calendar with Quick Selectors -->
                            <div class="space-y-6">
                                <h3 class="text-xl font-semibold mb-4">Calendar with Quick Selectors</h3>

                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium mb-2">Calendar with Default Quick Selectors</label>
                                        <x-keys::calendar
                                            name="calendar_basic"
                                            :quickSelectors="[
                                                ['label' => 'Today', 'value' => 'today'],
                                                ['label' => 'Yesterday', 'value' => 'yesterday'],
                                                ['label' => 'Last 7 Days', 'value' => 'last7days', 'range' => true],
                                                ['label' => 'Last 30 Days', 'value' => 'last30days', 'range' => true],
                                            ]"
                                        />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium mb-2">Calendar with Range Quick Selectors</label>
                                        <x-keys::calendar
                                            name="calendar_range"
                                            :isRange="true"
                                            :quickSelectors="[
                                                ['label' => 'Last 7 Days', 'value' => 'last7days', 'range' => true],
                                                ['label' => 'Last 30 Days', 'value' => 'last30days', 'range' => true],
                                                ['label' => 'This Month', 'value' => 'thismonth', 'range' => true],
                                                ['label' => 'Last Month', 'value' => 'lastmonth', 'range' => true],
                                            ]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Calendar without Quick Selectors (Control) -->
                            <div class="space-y-6">
                                <h3 class="text-xl font-semibold mb-4">Control Tests</h3>

                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium mb-2">Calendar without Quick Selectors</label>
                                        <x-keys::calendar
                                            name="calendar_no_selectors"
                                        />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium mb-2">Calendar with Empty Quick Selectors</label>
                                        <x-keys::calendar
                                            name="calendar_empty_selectors"
                                            :quickSelectors="[]"
                                        />
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium mb-2">Calendar with Boolean True</label>
                                        <x-keys::calendar
                                            name="calendar_bool_selectors"
                                            :quickSelectors="true"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>



                <!-- Badge Components -->
                <section class="mb-20">
                    <div class="text-center mb-12">
                        <h2 class="text-3xl font-bold text-foreground mb-4">Badge Components</h2>
                        <p class="text-lg text-muted-foreground">
                            Flexible status indicators with auto icon-only detection and comprehensive variants
                        </p>
                    </div>

                    <div class="max-w-6xl mx-auto space-y-12">
                        <!-- Basic Badges -->
                        <div class="space-y-8">
                            <h3 class="text-xl font-semibold mb-6">Basic Badge Variants</h3>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <!-- Simple Badges -->
                                <div class="space-y-6">
                                    <h4 class="text-lg font-medium mb-4">Simple Badges</h4>
                                    <div class="flex flex-wrap gap-3">
                                        <x-keys::badge color="brand">Brand</x-keys::badge>
                                        <x-keys::badge color="success">Success</x-keys::badge>
                                        <x-keys::badge color="warning">Warning</x-keys::badge>
                                        <x-keys::badge color="danger">Danger</x-keys::badge>
                                        <x-keys::badge color="neutral">Neutral</x-keys::badge>
                                    </div>

                                    <div class="flex flex-wrap gap-3">
                                        <x-keys::badge color="blue">Blue</x-keys::badge>
                                        <x-keys::badge color="green">Green</x-keys::badge>
                                        <x-keys::badge color="purple">Purple</x-keys::badge>
                                        <x-keys::badge color="pink">Pink</x-keys::badge>
                                        <x-keys::badge color="indigo">Indigo</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Chip Badges -->
                                <div class="space-y-6">
                                    <h4 class="text-lg font-medium mb-4">Chip Badges</h4>
                                    <div class="flex flex-wrap gap-3">
                                        <x-keys::badge variant="chip" color="brand">React</x-keys::badge>
                                        <x-keys::badge variant="chip" color="success">Vue.js</x-keys::badge>
                                        <x-keys::badge variant="chip" color="blue">TypeScript</x-keys::badge>
                                        <x-keys::badge variant="chip" color="purple">Laravel</x-keys::badge>
                                        <x-keys::badge variant="chip" color="yellow">Tailwind</x-keys::badge>
                                    </div>

                                    <div class="flex flex-wrap gap-3">
                                        <x-keys::badge variant="chip" color="green" dismissible>PHP 8.3</x-keys::badge>
                                        <x-keys::badge variant="chip" color="blue" dismissible>JavaScript</x-keys::badge>
                                        <x-keys::badge variant="chip" color="red" dismissible>CSS3</x-keys::badge>
                                        <x-keys::badge variant="chip" color="yellow" dismissible>HTML5</x-keys::badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Badge with Icons -->
                        <div class="space-y-8">
                            <h3 class="text-xl font-semibold mb-6">Badges with Icons</h3>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <!-- Icons with Text -->
                                <div class="space-y-6">
                                    <h4 class="text-lg font-medium mb-4">Icons with Text</h4>
                                    <div class="flex flex-wrap gap-3">
                                        <x-keys::badge color="success" icon="heroicon-o-check-circle">Verified</x-keys::badge>
                                        <x-keys::badge color="brand" icon="heroicon-o-star">Featured</x-keys::badge>
                                        <x-keys::badge color="warning" icon="heroicon-o-exclamation-triangle">Warning</x-keys::badge>
                                        <x-keys::badge color="danger" icon="heroicon-o-x-circle">Error</x-keys::badge>
                                        <x-keys::badge color="blue" icon="heroicon-o-information-circle">Info</x-keys::badge>
                                    </div>

                                    <div class="flex flex-wrap gap-3">
                                        <x-keys::badge color="purple" icon="heroicon-o-cpu-chip">Performance</x-keys::badge>
                                        <x-keys::badge color="green" icon="heroicon-o-shield-check">Secure</x-keys::badge>
                                        <x-keys::badge color="indigo" icon="heroicon-o-sparkles">Premium</x-keys::badge>
                                        <x-keys::badge color="pink" icon="heroicon-o-heart">Favorite</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Auto Icon-Only (No text = icon-only) -->
                                <div class="space-y-6">
                                    <h4 class="text-lg font-medium mb-4">Auto Icon-Only Detection</h4>
                                    <div class="flex flex-wrap gap-3">
                                        <x-keys::badge color="success" icon="heroicon-o-check" />
                                        <x-keys::badge color="danger" icon="heroicon-o-x-mark" />
                                        <x-keys::badge color="warning" icon="heroicon-o-exclamation-triangle" />
                                        <x-keys::badge color="blue" icon="heroicon-o-information-circle" />
                                        <x-keys::badge color="brand" icon="heroicon-o-star" />
                                    </div>

                                    <div class="flex flex-wrap gap-3">
                                        <x-keys::badge color="purple" icon="heroicon-o-heart" />
                                        <x-keys::badge color="green" icon="heroicon-o-bolt" />
                                        <x-keys::badge color="indigo" icon="heroicon-o-fire" />
                                        <x-keys::badge color="pink" icon="heroicon-o-sparkles" />
                                        <x-keys::badge color="yellow" icon="heroicon-o-sun" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Size Variants -->
                        <div class="space-y-8">
                            <h3 class="text-xl font-semibold mb-6">Size Variants</h3>

                            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <!-- Extra Small -->
                                <div class="space-y-4">
                                    <h4 class="text-lg font-medium mb-4">Extra Small (xs)</h4>
                                    <div class="flex flex-wrap gap-2">
                                        <x-keys::badge size="xs" color="brand">Brand</x-keys::badge>
                                        <x-keys::badge size="xs" color="success" icon="heroicon-o-check">Success</x-keys::badge>
                                        <x-keys::badge size="xs" color="blue" icon="heroicon-o-star" />
                                        <x-keys::badge size="xs" variant="chip" color="purple" dismissible>Chip</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Small (Default) -->
                                <div class="space-y-4">
                                    <h4 class="text-lg font-medium mb-4">Small - Default (sm)</h4>
                                    <div class="flex flex-wrap gap-2">
                                        <x-keys::badge size="sm" color="brand">Brand</x-keys::badge>
                                        <x-keys::badge size="sm" color="success" icon="heroicon-o-check">Success</x-keys::badge>
                                        <x-keys::badge size="sm" color="blue" icon="heroicon-o-star" />
                                        <x-keys::badge size="sm" variant="chip" color="purple" dismissible>Chip</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Medium -->
                                <div class="space-y-4">
                                    <h4 class="text-lg font-medium mb-4">Medium (md)</h4>
                                    <div class="flex flex-wrap gap-2">
                                        <x-keys::badge size="md" color="brand">Brand</x-keys::badge>
                                        <x-keys::badge size="md" color="success" icon="heroicon-o-check">Success</x-keys::badge>
                                        <x-keys::badge size="md" color="blue" icon="heroicon-o-star" />
                                        <x-keys::badge size="md" variant="chip" color="purple" dismissible>Chip</x-keys::badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Subtle Variant -->
                        <div class="space-y-8">
                            <h3 class="text-xl font-semibold mb-6">Subtle Variant with Status Dots</h3>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <!-- Subtle with Text -->
                                <div class="space-y-6">
                                    <h4 class="text-lg font-medium mb-4">Status Indicators</h4>
                                    <div class="space-y-3">
                                        <div><x-keys::badge variant="subtle" color="success">Online</x-keys::badge></div>
                                        <div><x-keys::badge variant="subtle" color="warning">Away</x-keys::badge></div>
                                        <div><x-keys::badge variant="subtle" color="danger">Offline</x-keys::badge></div>
                                        <div><x-keys::badge variant="subtle" color="blue">Busy</x-keys::badge></div>
                                        <div><x-keys::badge variant="subtle" color="neutral">Idle</x-keys::badge></div>
                                    </div>
                                </div>

                                <!-- Subtle with Icons -->
                                <div class="space-y-6">
                                    <h4 class="text-lg font-medium mb-4">With Icons</h4>
                                    <div class="space-y-3">
                                        <div><x-keys::badge variant="subtle" color="success" icon="heroicon-o-check-circle">Completed</x-keys::badge></div>
                                        <div><x-keys::badge variant="subtle" color="warning" icon="heroicon-o-clock">Pending</x-keys::badge></div>
                                        <div><x-keys::badge variant="subtle" color="danger" icon="heroicon-o-x-circle">Failed</x-keys::badge></div>
                                        <div><x-keys::badge variant="subtle" color="blue" icon="heroicon-o-play">In Progress</x-keys::badge></div>
                                        <div><x-keys::badge variant="subtle" color="purple" icon="heroicon-o-pause">Paused</x-keys::badge></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Real-World Examples -->
                        <div class="space-y-8">
                            <h3 class="text-xl font-semibold mb-6">Real-World Use Cases</h3>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <!-- User Profile -->
                                <div class="p-6 border border-border rounded-lg">
                                    <div class="flex items-center justify-between mb-4">
                                        <h4 class="text-lg font-medium">User Profile</h4>
                                        <x-keys::badge variant="subtle" color="success">Online</x-keys::badge>
                                    </div>
                                    <div class="space-y-3">
                                        <div class="flex items-center justify-between">
                                            <span>John Doe</span>
                                            <x-keys::badge color="brand" icon="heroicon-o-shield-check">Verified</x-keys::badge>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            <x-keys::badge variant="chip" color="blue" dismissible>Admin</x-keys::badge>
                                            <x-keys::badge variant="chip" color="green" dismissible>Premium</x-keys::badge>
                                            <x-keys::badge variant="chip" color="purple" dismissible>Pro User</x-keys::badge>
                                        </div>
                                    </div>
                                </div>

                                <!-- E-commerce Product -->
                                <div class="p-6 border border-border rounded-lg">
                                    <div class="flex items-center justify-between mb-4">
                                        <h4 class="text-lg font-medium">MacBook Pro 14"</h4>
                                        <x-keys::badge color="success" icon="heroicon-o-check">In Stock</x-keys::badge>
                                    </div>
                                    <div class="space-y-3">
                                        <div class="flex flex-wrap gap-2">
                                            <x-keys::badge color="yellow" icon="heroicon-o-star">Bestseller</x-keys::badge>
                                            <x-keys::badge color="danger">Sale</x-keys::badge>
                                            <x-keys::badge color="blue">Free Shipping</x-keys::badge>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            <x-keys::badge variant="chip" color="neutral" dismissible>M3 Pro</x-keys::badge>
                                            <x-keys::badge variant="chip" color="neutral" dismissible>16GB RAM</x-keys::badge>
                                            <x-keys::badge variant="chip" color="neutral" dismissible>1TB SSD</x-keys::badge>
                                        </div>
                                    </div>
                                </div>

                                <!-- Project Status -->
                                <div class="p-6 border border-border rounded-lg">
                                    <h4 class="text-lg font-medium mb-4">Project Dashboard</h4>
                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between">
                                            <span>Frontend Development</span>
                                            <x-keys::badge variant="subtle" color="blue" icon="heroicon-o-play">In Progress</x-keys::badge>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <span>Backend API</span>
                                            <x-keys::badge variant="subtle" color="success" icon="heroicon-o-check-circle">Completed</x-keys::badge>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <span>Testing</span>
                                            <x-keys::badge variant="subtle" color="warning" icon="heroicon-o-clock">Pending</x-keys::badge>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <span>Deployment</span>
                                            <x-keys::badge variant="subtle" color="neutral">Not Started</x-keys::badge>
                                        </div>
                                    </div>
                                </div>

                                <!-- Content Management -->
                                <div class="p-6 border border-border rounded-lg">
                                    <h4 class="text-lg font-medium mb-4">Blog Post</h4>
                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between">
                                            <span>Status</span>
                                            <x-keys::badge color="success" icon="heroicon-o-check-circle">Published</x-keys::badge>
                                        </div>
                                        <div class="space-y-2">
                                            <div class="text-sm text-muted-foreground">Categories</div>
                                            <div class="flex flex-wrap gap-2">
                                                <x-keys::badge variant="chip" color="blue" dismissible>Web Development</x-keys::badge>
                                                <x-keys::badge variant="chip" color="purple" dismissible>Laravel</x-keys::badge>
                                                <x-keys::badge variant="chip" color="green" dismissible>Tutorial</x-keys::badge>
                                            </div>
                                        </div>
                                        <div class="flex flex-wrap gap-2">
                                            <x-keys::badge color="yellow" icon="heroicon-o-star">Featured</x-keys::badge>
                                            <x-keys::badge color="pink" icon="heroicon-o-heart">Popular</x-keys::badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Footer -->
                <div class="text-center pt-12 border-t border-border">
                    <div class="flex flex-wrap justify-center items-center gap-4 mb-6">
                        <x-keys::badge color="brand" icon="heroicon-o-code-bracket">Modern Architecture</x-keys::badge>
                        <x-keys::badge color="success" icon="heroicon-o-check-circle">Laravel 12 Ready</x-keys::badge>
                        <x-keys::badge color="info" icon="heroicon-o-sparkles">Tailwind v4</x-keys::badge>
                        <x-keys::badge color="purple" icon="heroicon-o-cpu-chip">High Performance</x-keys::badge>
                        <x-keys::badge color="warning" icon="heroicon-o-shield-check">Accessible</x-keys::badge>
                    </div>

                    <p class="text-muted-foreground mb-4">
                        Keys UI follows modern component development principles with direct Tailwind utilities,
                        semantic design tokens, and progressive enhancement.
                    </p>

                    <div class="flex justify-center gap-4">
                        <x-keys::button variant="brand" icon="heroicon-o-document-text">
                            Documentation
                        </x-keys::button>
                        <x-keys::button variant="outline" icon="heroicon-o-code-bracket">
                            View Source
                        </x-keys::button>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
