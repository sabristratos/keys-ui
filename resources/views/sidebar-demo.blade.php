<x-layouts.sidebar
    title="Dashboard"
    sidebarTitle="Keys UI"
    sidebarSubtitle="Component Library"
>
    {{-- Sidebar slot with custom navigation for demo --}}
    <x-slot:sidebar>
        <x-keys::sidebar
            id="main-sidebar"
            width="md"
            collapsible
            :collapsed="false"
            aria-label="Main navigation"
            variant="default"
            title="Keys UI"
            subtitle="Component Library"
        >
            {{-- Logo - uses same style as layout for consistency --}}
            <x-slot:logo>
                <div class="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
                    <x-keys::icon name="heroicon-o-squares-2x2" size="sm" class="text-white" />
                </div>
            </x-slot:logo>

            {{-- Main Navigation --}}
            <x-keys::sidebar.section heading="Navigation" icon="heroicon-o-chevron-down">
                <x-keys::sidebar.item href="/sidebar-demo" icon="heroicon-o-chart-bar" active>
                    Dashboard
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-folder">
                    Projects
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-clipboard-document-list" badge="12" badge-variant="brand">
                    Tasks
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-calendar">
                    Calendar
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-chart-pie">
                    Analytics
                </x-keys::sidebar.item>
            </x-keys::sidebar.section>

            <x-keys::sidebar.divider />

            {{-- Team Section --}}
            <x-keys::sidebar.section heading="Team" icon="heroicon-o-chevron-down" :collapsed="false">
                <x-keys::sidebar.item href="#" icon="heroicon-o-users">
                    Team Members
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-building-office">
                    Departments
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-envelope" badge="3" badge-variant="danger">
                    Messages
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-chat-bubble-left-right">
                    Discussions
                </x-keys::sidebar.item>
            </x-keys::sidebar.section>

            <x-keys::sidebar.divider label="Settings" />

            {{-- Settings Section --}}
            <x-keys::sidebar.section heading="Administration" icon="heroicon-o-chevron-down" :collapsed="true">
                <x-keys::sidebar.item href="#" icon="heroicon-o-user-group" badge="24">
                    Users
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-cog-6-tooth">
                    Settings
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-shield-check">
                    Security
                </x-keys::sidebar.item>
                <x-keys::sidebar.item href="#" icon="heroicon-o-key">
                    API Keys
                </x-keys::sidebar.item>
            </x-keys::sidebar.section>

            {{-- Sidebar Footer --}}
            <x-slot:footer>
                <div class="p-2">
                    <x-keys::sidebar.item href="#" icon="heroicon-o-user-circle">
                        Profile Settings
                    </x-keys::sidebar.item>
                    <x-keys::sidebar.item href="#" icon="heroicon-o-question-mark-circle">
                        Help & Support
                    </x-keys::sidebar.item>
                    <x-keys::sidebar.divider spacing="sm" />
                    <x-keys::sidebar.item href="#" icon="heroicon-o-arrow-right-on-rectangle">
                        Sign Out
                    </x-keys::sidebar.item>
                </div>
            </x-slot:footer>
        </x-keys::sidebar>
    </x-slot:sidebar>

    {{-- Main Content --}}
    <div class="space-y-6">
        {{-- Welcome Section --}}
        <div>
            <h1 class="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
            <p class="text-lg text-muted">Here's what's happening with your projects today.</p>
        </div>

        {{-- Stats Grid --}}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <x-keys::card>
                <x-slot:body>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted">Total Projects</p>
                            <p class="text-2xl font-bold mt-1">24</p>
                        </div>
                        <div class="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center">
                            <x-keys::icon name="heroicon-o-folder" size="md" class="text-brand" />
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-2">
                        <span class="text-sm text-success">↑ 12%</span>
                        <span class="text-sm text-muted">from last month</span>
                    </div>
                </x-slot:body>
            </x-keys::card>

            <x-keys::card>
                <x-slot:body>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted">Active Tasks</p>
                            <p class="text-2xl font-bold mt-1">142</p>
                        </div>
                        <div class="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                            <x-keys::icon name="heroicon-o-clipboard-document-list" size="md" class="text-warning" />
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-2">
                        <span class="text-sm text-success">↑ 8%</span>
                        <span class="text-sm text-muted">from last week</span>
                    </div>
                </x-slot:body>
            </x-keys::card>

            <x-keys::card>
                <x-slot:body>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted">Team Members</p>
                            <p class="text-2xl font-bold mt-1">18</p>
                        </div>
                        <div class="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                            <x-keys::icon name="heroicon-o-users" size="md" class="text-success" />
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-2">
                        <span class="text-sm text-success">↑ 2</span>
                        <span class="text-sm text-muted">new this month</span>
                    </div>
                </x-slot:body>
            </x-keys::card>

            <x-keys::card>
                <x-slot:body>
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted">Completion Rate</p>
                            <p class="text-2xl font-bold mt-1">87%</p>
                        </div>
                        <div class="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                            <x-keys::icon name="heroicon-o-chart-pie" size="md" class="text-info" />
                        </div>
                    </div>
                    <div class="mt-4 flex items-center gap-2">
                        <span class="text-sm text-success">↑ 5%</span>
                        <span class="text-sm text-muted">from last quarter</span>
                    </div>
                </x-slot:body>
            </x-keys::card>
        </div>

        {{-- Recent Activity --}}
        <x-keys::card>
            <x-slot:header>
                <h2 class="text-lg font-semibold">Recent Activity</h2>
            </x-slot:header>
            <x-slot:body>
                <div class="space-y-4">
                    @for($i = 1; $i <= 8; $i++)
                        <div class="flex items-start gap-4 pb-4 {{ $i < 8 ? 'border-b border-border' : '' }}">
                            <div class="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <x-keys::icon name="heroicon-o-user" size="sm" class="text-brand" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-foreground">User {{ $i }} completed a task</p>
                                <p class="text-sm text-muted mt-1">Updated the project documentation and fixed several bugs</p>
                                <p class="text-xs text-muted mt-2">{{ $i }} hours ago</p>
                            </div>
                            <x-keys::badge variant="success">Completed</x-keys::badge>
                        </div>
                    @endfor
                </div>
            </x-slot:body>
            <x-slot:footer>
                <div class="flex justify-center">
                    <x-keys::button variant="ghost" size="sm">
                        View All Activity
                        <x-keys::icon name="heroicon-o-arrow-right" size="xs" />
                    </x-keys::button>
                </div>
            </x-slot:footer>
        </x-keys::card>

        {{-- Projects Grid --}}
        <div>
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Active Projects</h2>
                <x-keys::button size="sm">
                    <x-keys::icon name="heroicon-o-plus" size="xs" />
                    New Project
                </x-keys::button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for($i = 1; $i <= 6; $i++)
                    <x-keys::card hoverable>
                        <x-slot:header>
                            <div class="flex items-center justify-between">
                                <h3 class="font-semibold">Project {{ $i }}</h3>
                                <x-keys::badge variant="{{ $i % 3 === 0 ? 'success' : ($i % 2 === 0 ? 'warning' : 'brand') }}">
                                    {{ $i % 3 === 0 ? 'Active' : ($i % 2 === 0 ? 'Pending' : 'In Progress') }}
                                </x-keys::badge>
                            </div>
                        </x-slot:header>
                        <x-slot:body>
                            <p class="text-sm text-muted mb-4">
                                A comprehensive project description that explains what this project is about and its current status.
                            </p>
                            <div class="space-y-2">
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-muted">Progress</span>
                                    <span class="font-medium">{{ rand(45, 95) }}%</span>
                                </div>
                                <x-keys::progress :value="rand(45, 95)" size="sm" />
                            </div>
                        </x-slot:body>
                        <x-slot:footer>
                            <div class="flex items-center justify-between">
                                <x-keys::avatar.stack>
                                    <x-keys::avatar name="User 1" size="xs" />
                                    <x-keys::avatar name="User 2" size="xs" />
                                    <x-keys::avatar name="User 3" size="xs" />
                                </x-keys::avatar.stack>
                                <span class="text-xs text-muted">Due in {{ rand(1, 30) }} days</span>
                            </div>
                        </x-slot:footer>
                    </x-keys::card>
                @endfor
            </div>
        </div>

        {{-- Bottom padding for scroll --}}
        <div class="h-16"></div>
    </div>
</x-layouts.sidebar>
