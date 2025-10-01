<x-layouts.sidebar title="Keys UI - Component Library">
    <div class="space-y-16">
        {{-- Hero Section --}}
        <section>
            <h1 class="text-4xl font-bold text-foreground mb-4">Welcome to Keys UI</h1>
            <p class="text-lg text-muted max-w-3xl">
                A modern Blade components library built specifically for Laravel 12 and Tailwind v4.
                Build beautiful dashboards and applications with pre-styled, accessible components.
            </p>
        </section>

        {{-- Popover & Dropdown Testing --}}
        <section class="mb-16">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-foreground mb-4">Popover & Dropdown Components</h2>
                <p class="text-lg text-muted max-w-3xl">
                    Versatile popover menus with CSS anchor positioning. Features include menu items with icons, keyboard shortcuts, nested submenus, separators, and multiple variants. All positioning happens via CSS - No Floating UI needed!
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {{-- Basic Popover (Bottom) --}}
                <div class="space-y-2">
                    <h3 class="text-sm font-medium text-foreground">Basic Popover (Bottom)</h3>
                    <x-keys::popover id="basic-popover" placement="bottom-start">
                        <x-slot:trigger>
                            <x-keys::button variant="brand">
                                Open Menu
                            </x-keys::button>
                        </x-slot:trigger>

                        <div class="p-4 space-y-2">
                            <p class="text-sm text-foreground font-medium">Menu Title</p>
                            <div class="space-y-1">
                                <a href="#" class="block px-3 py-2 text-sm text-foreground hover:bg-surface-hover rounded">Dashboard</a>
                                <a href="#" class="block px-3 py-2 text-sm text-foreground hover:bg-surface-hover rounded">Profile</a>
                                <a href="#" class="block px-3 py-2 text-sm text-foreground hover:bg-surface-hover rounded">Settings</a>
                            </div>
                        </div>
                    </x-keys::popover>
                </div>

                {{-- Top Aligned --}}
                <div class="space-y-2">
                    <h3 class="text-sm font-medium text-foreground">Top Aligned</h3>
                    <x-keys::popover id="top-popover" placement="top">
                        <x-slot:trigger>
                            <x-keys::button variant="brand">
                                Open Top
                            </x-keys::button>
                        </x-slot:trigger>

                        <div class="p-4">
                            <p class="text-sm text-foreground">This popover opens above the trigger button!</p>
                        </div>
                    </x-keys::popover>
                </div>

                {{-- Right Aligned --}}
                <div class="space-y-2">
                    <h3 class="text-sm font-medium text-foreground">Right Side</h3>
                    <x-keys::popover id="right-popover" placement="right">
                        <x-slot:trigger>
                            <x-keys::button variant="outline">
                                Open Right
                            </x-keys::button>
                        </x-slot:trigger>

                        <div class="p-4">
                            <p class="text-sm text-foreground">Opens to the right!</p>
                        </div>
                    </x-keys::popover>
                </div>

                {{-- Left Side --}}
                <div class="space-y-2">
                    <h3 class="text-sm font-medium text-foreground">Left Side</h3>
                    <x-keys::popover id="left-popover" placement="left">
                        <x-slot:trigger>
                            <x-keys::button variant="outline">
                                Open Left
                            </x-keys::button>
                        </x-slot:trigger>

                        <div class="p-4">
                            <p class="text-sm text-foreground">Opens to the left!</p>
                        </div>
                    </x-keys::popover>
                </div>

                {{-- Settings Menu with Icons and Separators --}}
                <div class="space-y-2">
                    <h3 class="text-sm font-medium text-foreground">Settings Menu</h3>
                    <x-keys::dropdown id="settings-menu">
                        <x-slot:trigger>
                            <x-keys::button variant="brand" icon-left="heroicon-o-cog-6-tooth">
                                Settings
                            </x-keys::button>
                        </x-slot:trigger>

                        <x-keys::menu>
                            <x-keys::menu.item href="#" icon="heroicon-o-user">
                                Profile Settings
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-bell">
                                Notifications
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-shield-check">
                                Privacy & Security
                            </x-keys::menu.item>

                            <x-keys::menu.separator />

                            <x-keys::menu.item href="#" icon="heroicon-o-paint-brush">
                                Appearance
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-language">
                                Language
                            </x-keys::menu.item>

                            <x-keys::menu.separator />

                            <x-keys::menu.item href="#" icon="heroicon-o-question-mark-circle">
                                Help & Support
                            </x-keys::menu.item>
                        </x-keys::menu>
                    </x-keys::dropdown>
                </div>

                {{-- User Profile Menu --}}
                <div class="space-y-2">
                    <h3 class="text-sm font-medium text-foreground">User Profile</h3>
                    <x-keys::dropdown id="user-menu">
                        <x-slot:trigger>
                            <x-keys::button variant="outline" icon-left="heroicon-o-user-circle">
                                Account
                            </x-keys::button>
                        </x-slot:trigger>

                        <x-keys::menu>
                            <x-keys::menu.item href="#" icon="heroicon-o-user">
                                View Profile
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-cog-6-tooth" kbd="⌘,">
                                Settings
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-credit-card">
                                Billing
                            </x-keys::menu.item>

                            <x-keys::menu.separator />

                            <x-keys::menu.item href="#" icon="heroicon-o-information-circle">
                                About
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-document-text">
                                Documentation
                            </x-keys::menu.item>

                            <x-keys::menu.separator />

                            <x-keys::menu.item href="#" icon="heroicon-o-arrow-right-on-rectangle" variant="danger">
                                Sign Out
                            </x-keys::menu.item>
                        </x-keys::menu>
                    </x-keys::dropdown>
                </div>

                {{-- Navigation with Nested Submenus --}}
                <div class="space-y-2">
                    <h3 class="text-sm font-medium text-foreground">Nested Navigation</h3>
                    <x-keys::dropdown id="nav-menu">
                        <x-slot:trigger>
                            <x-keys::button variant="brand" icon-left="heroicon-o-squares-2x2">
                                More
                            </x-keys::button>
                        </x-slot:trigger>

                        <x-keys::menu>
                            <x-keys::menu.item href="#" icon="heroicon-o-home">
                                Dashboard
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-chart-bar">
                                Analytics
                            </x-keys::menu.item>

                            <x-keys::menu.separator />

                            <x-keys::menu.submenu heading="Products" icon="heroicon-o-shopping-bag">
                                <x-keys::menu.item href="#" icon="heroicon-o-plus">
                                    Add Product
                                </x-keys::menu.item>
                                <x-keys::menu.item href="#" icon="heroicon-o-queue-list">
                                    View All Products
                                </x-keys::menu.item>
                                <x-keys::menu.item href="#" icon="heroicon-o-archive-box">
                                    Inventory
                                </x-keys::menu.item>

                                <x-keys::menu.separator />

                                <x-keys::menu.submenu heading="Categories" icon="heroicon-o-folder">
                                    <x-keys::menu.item href="#" icon="heroicon-o-tag">
                                        Electronics
                                    </x-keys::menu.item>
                                    <x-keys::menu.item href="#" icon="heroicon-o-tag">
                                        Clothing
                                    </x-keys::menu.item>
                                    <x-keys::menu.item href="#" icon="heroicon-o-tag">
                                        Books
                                    </x-keys::menu.item>
                                </x-keys::menu.submenu>
                            </x-keys::menu.submenu>

                            <x-keys::menu.submenu heading="Team" icon="heroicon-o-user-group">
                                <x-keys::menu.item href="#" icon="heroicon-o-user-plus">
                                    Invite Members
                                </x-keys::menu.item>
                                <x-keys::menu.item href="#" icon="heroicon-o-users">
                                    Manage Team
                                </x-keys::menu.item>
                                <x-keys::menu.item href="#" icon="heroicon-o-adjustments-horizontal">
                                    Team Settings
                                </x-keys::menu.item>
                            </x-keys::menu.submenu>

                            <x-keys::menu.separator />

                            <x-keys::menu.item href="#" icon="heroicon-o-cog-6-tooth">
                                Settings
                            </x-keys::menu.item>
                        </x-keys::menu>
                    </x-keys::dropdown>
                </div>

                {{-- Actions Menu with Keyboard Shortcuts --}}
                <div class="space-y-2">
                    <h3 class="text-sm font-medium text-foreground">Actions Menu</h3>
                    <x-keys::dropdown id="actions-menu" align="end">
                        <x-slot:trigger>
                            <x-keys::button variant="ghost" icon="heroicon-o-ellipsis-vertical" />
                        </x-slot:trigger>

                        <x-keys::menu>
                            <x-keys::menu.item href="#" icon="heroicon-o-pencil" kbd="⌘E">
                                Edit
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-document-duplicate" kbd="⌘D">
                                Duplicate
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-share" kbd="⌘⇧S">
                                Share
                            </x-keys::menu.item>

                            <x-keys::menu.separator />

                            <x-keys::menu.item href="#" icon="heroicon-o-arrow-down-tray">
                                Download
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-archive-box">
                                Archive
                            </x-keys::menu.item>

                            <x-keys::menu.separator />

                            <x-keys::menu.item href="#" icon="heroicon-o-trash" variant="danger" kbd="⌘⌫">
                                Delete
                            </x-keys::menu.item>
                        </x-keys::menu>
                    </x-keys::dropdown>
                </div>

                {{-- Different Sizes --}}
                <div class="space-y-2">
                    <h3 class="text-sm font-medium text-foreground">Small Menu</h3>
                    <x-keys::dropdown id="small-menu" size="sm">
                        <x-slot:trigger>
                            <x-keys::button variant="outline" size="sm">
                                Small
                            </x-keys::button>
                        </x-slot:trigger>

                        <x-keys::menu>
                            <x-keys::menu.item href="#" icon="heroicon-o-home">
                                Home
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-cog-6-tooth">
                                Settings
                            </x-keys::menu.item>
                        </x-keys::menu>
                    </x-keys::dropdown>
                </div>

                {{-- Large Size --}}
                <div class="space-y-2">
                    <h3 class="text-sm font-medium text-foreground">Large Menu</h3>
                    <x-keys::dropdown id="large-menu" size="lg">
                        <x-slot:trigger>
                            <x-keys::button variant="brand" size="lg">
                                Large
                            </x-keys::button>
                        </x-slot:trigger>

                        <x-keys::menu>
                            <x-keys::menu.item href="#" icon="heroicon-o-rocket-launch">
                                Get Started
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-book-open">
                                Learn More
                            </x-keys::menu.item>
                            <x-keys::menu.item href="#" icon="heroicon-o-phone">
                                Contact Us
                            </x-keys::menu.item>
                        </x-keys::menu>
                    </x-keys::dropdown>
                </div>
            </div>

            <div class="mt-8 p-4 bg-success/10 border border-success rounded-lg">
                <p class="text-sm text-foreground font-medium">✅ All positioning powered by CSS Anchor Positioning!</p>
                <p class="text-xs text-muted mt-1">Floating UI (@floating-ui/dom) has been completely removed. Everything uses native CSS anchor positioning with the @oddbird/css-anchor-positioning polyfill for browser compatibility.</p>
            </div>
        </section>

        {{-- Social Share & Links Components --}}
        <section class="mb-16">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-foreground mb-4">Social Share & Links</h2>
                <p class="text-lg text-muted max-w-3xl">
                    Pre-built social media components with 13 custom icons. Share content or link to profiles with consistent styling and layouts.
                </p>
            </div>

            <div class="space-y-12">
                {{-- Social Share Demos --}}
                <div>
                    <h3 class="text-xl font-semibold text-foreground mb-6">Social Share Component</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {{-- Basic Share --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">Basic Share (Icon Only)</h4>
                            <x-keys::social.share
                                :platforms="['facebook', 'twitter', 'linkedin', 'whatsapp']"
                                variant="outline"
                                size="md"
                            />
                        </div>

                        {{-- With Labels --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">With Labels</h4>
                            <x-keys::social.share
                                :platforms="['facebook', 'twitter', 'linkedin']"
                                variant="brand"
                                size="sm"
                                :show-labels="true"
                            />
                        </div>

                        {{-- Attached Buttons --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">Attached Style</h4>
                            <x-keys::social.share
                                :platforms="['facebook', 'twitter', 'linkedin', 'reddit']"
                                variant="outline"
                                size="sm"
                                :attached="true"
                            />
                        </div>

                        {{-- Ghost Variant --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">Ghost Variant</h4>
                            <x-keys::social.share
                                :platforms="['facebook', 'twitter', 'pinterest', 'whatsapp']"
                                variant="ghost"
                                size="lg"
                            />
                        </div>

                        {{-- All Platforms --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">All Platforms</h4>
                            <x-keys::social.share
                                :platforms="['facebook', 'twitter', 'linkedin', 'whatsapp', 'pinterest', 'reddit', 'telegram']"
                                variant="outline"
                                size="xs"
                            />
                        </div>

                        {{-- Vertical Layout --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">Vertical Layout</h4>
                            <x-keys::social.share
                                :platforms="['facebook', 'twitter', 'linkedin']"
                                layout="vertical"
                                variant="outline"
                                size="sm"
                            />
                        </div>
                    </div>
                </div>

                {{-- Social Links Demos --}}
                <div>
                    <h3 class="text-xl font-semibold text-foreground mb-6">Social Links Component</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {{-- Profile Links --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">Profile Links</h4>
                            <x-keys::social.links
                                :links="[
                                    'facebook' => 'https://facebook.com',
                                    'instagram' => 'https://instagram.com',
                                    'twitter' => 'https://twitter.com',
                                    'youtube' => 'https://youtube.com',
                                ]"
                                variant="ghost"
                                size="md"
                            />
                        </div>

                        {{-- Developer Links --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">Developer Links</h4>
                            <x-keys::social.links
                                :links="[
                                    'github' => 'https://github.com',
                                    'figma' => 'https://figma.com',
                                ]"
                                variant="outline"
                                size="lg"
                                :show-labels="true"
                            />
                        </div>

                        {{-- Business Links --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">Business Links</h4>
                            <x-keys::social.links
                                :links="[
                                    'linkedin' => 'https://linkedin.com',
                                    'whatsapp' => 'https://wa.me',
                                    'telegram' => 'https://t.me',
                                ]"
                                variant="brand"
                                size="md"
                                :attached="true"
                            />
                        </div>

                        {{-- Full Social Suite --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">Complete Suite</h4>
                            <x-keys::social.links
                                :links="[
                                    'facebook' => '#',
                                    'instagram' => '#',
                                    'twitter' => '#',
                                    'linkedin' => '#',
                                    'youtube' => '#',
                                    'tiktok' => '#',
                                    'github' => '#',
                                ]"
                                variant="outline"
                                size="sm"
                            />
                        </div>

                        {{-- Vertical with Labels --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">Vertical with Labels</h4>
                            <x-keys::social.links
                                :links="[
                                    'github' => 'https://github.com',
                                    'figma' => 'https://figma.com',
                                    'google' => 'https://google.com',
                                ]"
                                layout="vertical"
                                variant="outline"
                                size="sm"
                                :show-labels="true"
                            />
                        </div>

                        {{-- Minimalist Footer Style --}}
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-foreground">Footer Style</h4>
                            <x-keys::social.links
                                :links="[
                                    'facebook' => '#',
                                    'instagram' => '#',
                                    'twitter' => '#',
                                    'youtube' => '#',
                                ]"
                                variant="ghost"
                                size="sm"
                                class="justify-center"
                            />
                        </div>
                    </div>
                </div>

                {{-- Available Icons --}}
                <div class="p-6 bg-surface border border-border rounded-lg">
                    <h3 class="text-lg font-semibold text-foreground mb-4">13 Custom Social Media Icons</h3>
                    <div class="flex flex-wrap gap-4">
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.facebook" size="md" />
                            <span class="text-sm text-muted">Facebook</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.instagram" size="md" />
                            <span class="text-sm text-muted">Instagram</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.x" size="md" />
                            <span class="text-sm text-muted">X/Twitter</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.linkedin" size="md" />
                            <span class="text-sm text-muted">LinkedIn</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.youtube" size="md" />
                            <span class="text-sm text-muted">YouTube</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.tiktok" size="md" />
                            <span class="text-sm text-muted">TikTok</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.whatsapp" size="md" />
                            <span class="text-sm text-muted">WhatsApp</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.pinterest" size="md" />
                            <span class="text-sm text-muted">Pinterest</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.reddit" size="md" />
                            <span class="text-sm text-muted">Reddit</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.telegram" size="md" />
                            <span class="text-sm text-muted">Telegram</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.github" size="md" />
                            <span class="text-sm text-muted">GitHub</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.figma" size="md" />
                            <span class="text-sm text-muted">Figma</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <x-keys::icon name="icons.google" size="md" />
                            <span class="text-sm text-muted">Google</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</x-layouts.sidebar>
