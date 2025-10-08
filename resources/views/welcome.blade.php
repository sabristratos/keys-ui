<x-layouts.sidebar title="Keys UI - Dashboard">

    {{-- Toast Container --}}
    <x-keys::toast />

    {{-- Main Dashboard Content --}}
    <div class="space-y-6">

        {{-- Header Section --}}
        <div class="flex items-center justify-between">
            <div>
                <x-keys::heading level="h1" size="3xl">
                    Welcome back, Sarah
                </x-keys::heading>
                <x-keys::text color="muted" size="sm">
                    Here's what's happening with your projects today
                </x-keys::text>
            </div>

            <div class="flex items-center gap-3">
                {{-- Quick Actions --}}
                <x-keys::group attached>
                    <x-keys::button variant="outlined" icon-left="heroicon-o-plus" onclick="document.getElementById('create-project-modal').showModal()">
                        New Project
                    </x-keys::button>
                    <x-keys::button variant="outlined" icon-left="heroicon-o-cog-6-tooth" onclick="document.getElementById('settings-slideout').showModal()">
                        Settings
                    </x-keys::button>
                </x-keys::group>

                {{-- Notifications Dropdown --}}
                <x-keys::dropdown position="bottom" align="end">
                    <x-slot:trigger>
                        <x-keys::button variant="ghost" icon="heroicon-o-bell">
                            <span class="sr-only">Notifications</span>
                        </x-keys::button>
                    </x-slot:trigger>

                    <x-keys::dropdown.item icon="heroicon-o-inbox">
                        3 new messages
                    </x-keys::dropdown.item>
                    <x-keys::dropdown.item icon="heroicon-o-check-circle">
                        Task completed
                    </x-keys::dropdown.item>
                    <x-keys::dropdown.separator />
                    <x-keys::dropdown.item icon="heroicon-o-cog">
                        Notification settings
                    </x-keys::dropdown.item>
                </x-keys::dropdown>

                {{-- User Profile --}}
                <x-keys::dropdown position="bottom" align="end">
                    <x-slot:trigger>
                        <x-keys::avatar
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                            name="Sarah Johnson"
                            size="md"
                            status="online"
                        />
                    </x-slot:trigger>

                    <x-keys::dropdown.item icon="heroicon-o-user">Profile</x-keys::dropdown.item>
                    <x-keys::dropdown.item icon="heroicon-o-cog">Settings</x-keys::dropdown.item>
                    <x-keys::dropdown.separator />
                    <x-keys::dropdown.item icon="heroicon-o-arrow-right-on-rectangle" variant="danger">
                        Sign out
                    </x-keys::dropdown.item>
                </x-keys::dropdown>
            </div>
        </div>

        {{-- Stats Overview --}}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {{-- Revenue Card --}}
            <x-keys::card>
                <x-keys::card.body>
                    <div class="flex items-center justify-between mb-2">
                        <x-keys::text size="sm" color="muted">Total Revenue</x-keys::text>
                        <x-keys::tooltip content="Revenue from last 30 days">
                            <x-keys::icon name="heroicon-o-information-circle" size="sm" />
                        </x-keys::tooltip>
                    </div>
                    <x-keys::heading level="h3" size="2xl">$45,231</x-keys::heading>
                    <div class="flex items-center gap-2 mt-2">
                        <x-keys::badge color="success" size="xs">+12.5%</x-keys::badge>
                        <x-keys::text size="xs" color="muted">vs last month</x-keys::text>
                    </div>
                </x-keys::card.body>
            </x-keys::card>

            {{-- Active Users Card --}}
            <x-keys::card>
                <x-keys::card.body>
                    <div class="flex items-center justify-between mb-2">
                        <x-keys::text size="sm" color="muted">Active Users</x-keys::text>
                        <x-keys::icon name="heroicon-o-users" size="sm" />
                    </div>
                    <x-keys::heading level="h3" size="2xl">2,345</x-keys::heading>
                    <x-keys::progress :value="75" :max="100" size="sm" color="brand" class="mt-2" />
                    <x-keys::text size="xs" color="muted" class="mt-1">75% of target</x-keys::text>
                </x-keys::card.body>
            </x-keys::card>

            {{-- Pending Tasks Card --}}
            <x-keys::card>
                <x-keys::card.body>
                    <div class="flex items-center justify-between mb-2">
                        <x-keys::text size="sm" color="muted">Pending Tasks</x-keys::text>
                        <x-keys::badge color="warning">15</x-keys::badge>
                    </div>
                    <x-keys::heading level="h3" size="2xl">142</x-keys::heading>
                    <div class="flex items-center gap-2 mt-2">
                        <x-keys::badge color="info" size="xs">23 urgent</x-keys::badge>
                        <x-keys::text size="xs" color="muted">32 due today</x-keys::text>
                    </div>
                </x-keys::card.body>
            </x-keys::card>

            {{-- Success Rate Card --}}
            <x-keys::card>
                <x-keys::card.body>
                    <div class="flex items-center justify-between mb-2">
                        <x-keys::text size="sm" color="muted">Success Rate</x-keys::text>
                        <x-keys::rating :value="4.5" :max="5" readonly size="xs" />
                    </div>
                    <x-keys::heading level="h3" size="2xl">94.2%</x-keys::heading>
                    <x-keys::text size="xs" color="success" class="mt-2">
                        Excellent performance
                    </x-keys::text>
                </x-keys::card.body>
            </x-keys::card>
        </div>

        {{-- Countdown Examples --}}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {{-- Product Launch Countdown --}}
            <x-keys::card>
                <x-keys::card.body>
                    <x-keys::heading level="h4" size="sm" class="mb-3">Product Launch</x-keys::heading>
                    <x-keys::countdown
                        :days="15"
                        :hours="10"
                        :minutes="24"
                        :seconds="30"
                        variant="boxed"
                        size="sm"
                        color="brand"
                    />
                </x-keys::card.body>
            </x-keys::card>

            {{-- Sale Ending Countdown --}}
            <x-keys::card>
                <x-keys::card.body>
                    <x-keys::heading level="h4" size="sm" class="mb-3">Flash Sale Ends In</x-keys::heading>
                    <x-keys::countdown
                        :hours="2"
                        :minutes="45"
                        :seconds="30"
                        variant="inline"
                        size="md"
                        color="danger"
                        :show-days="false"
                    />
                </x-keys::card.body>
            </x-keys::card>

            {{-- Event Timer --}}
            <x-keys::card>
                <x-keys::card.body>
                    <x-keys::heading level="h4" size="sm" class="mb-3">Next Meeting</x-keys::heading>
                    <x-keys::countdown
                        target="{{ now()->addMinutes(30)->format('Y-m-d H:i:s') }}"
                        variant="minimal"
                        size="lg"
                        color="info"
                        :show-days="false"
                        complete-message="Meeting has started!"
                    />
                </x-keys::card.body>
            </x-keys::card>
        </div>

        {{-- Main Content Grid --}}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {{-- Left Column (2/3 width) --}}
            <div class="lg:col-span-2 space-y-6">

                {{-- Recent Activity Table --}}
                <x-keys::card>
                    <x-keys::card.header>
                        <div class="flex items-center justify-between">
                            <x-keys::heading level="h3" size="lg">Recent Activity</x-keys::heading>
                            <x-keys::button variant="ghost" size="sm" icon-right="heroicon-o-arrow-right">
                                View all
                            </x-keys::button>
                        </div>
                    </x-keys::card.header>
                    <x-keys::card.body>
                        <x-keys::table hover>
                            <x-keys::table.head>
                                <x-keys::table.row>
                                    <x-keys::table.header>User</x-keys::table.header>
                                    <x-keys::table.header>Project</x-keys::table.header>
                                    <x-keys::table.header>Status</x-keys::table.header>
                                    <x-keys::table.header>Date</x-keys::table.header>
                                    <x-keys::table.header>Actions</x-keys::table.header>
                                </x-keys::table.row>
                            </x-keys::table.head>
                            <x-keys::table.body>
                                <x-keys::table.row>
                                    <x-keys::table.cell>
                                        <div class="flex items-center gap-2">
                                            <x-keys::avatar
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                                                name="Alex Chen"
                                                size="sm"
                                            />
                                            <div>
                                                <x-keys::text size="sm" weight="medium">Alex Chen</x-keys::text>
                                                <x-keys::text size="xs" color="muted">alex@example.com</x-keys::text>
                                            </div>
                                        </div>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::text size="sm">Website Redesign</x-keys::text>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::badge color="success">Completed</x-keys::badge>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::text size="sm" color="muted">2 hours ago</x-keys::text>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::dropdown size="sm">
                                            <x-slot:trigger>
                                                <x-keys::button variant="ghost" size="xs" icon="heroicon-o-ellipsis-horizontal">
                                                    <span class="sr-only">Actions</span>
                                                </x-keys::button>
                                            </x-slot:trigger>
                                            <x-keys::dropdown.item icon="heroicon-o-eye">View</x-keys::dropdown.item>
                                            <x-keys::dropdown.item icon="heroicon-o-pencil">Edit</x-keys::dropdown.item>
                                            <x-keys::dropdown.separator />
                                            <x-keys::dropdown.item icon="heroicon-o-trash" variant="danger">Delete</x-keys::dropdown.item>
                                        </x-keys::dropdown>
                                    </x-keys::table.cell>
                                </x-keys::table.row>

                                <x-keys::table.row>
                                    <x-keys::table.cell>
                                        <div class="flex items-center gap-2">
                                            <x-keys::avatar
                                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
                                                name="Maria Garcia"
                                                size="sm"
                                            />
                                            <div>
                                                <x-keys::text size="sm" weight="medium">Maria Garcia</x-keys::text>
                                                <x-keys::text size="xs" color="muted">maria@example.com</x-keys::text>
                                            </div>
                                        </div>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::text size="sm">Mobile App</x-keys::text>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::badge color="warning">In Progress</x-keys::badge>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::text size="sm" color="muted">5 hours ago</x-keys::text>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::dropdown size="sm">
                                            <x-slot:trigger>
                                                <x-keys::button variant="ghost" size="xs" icon="heroicon-o-ellipsis-horizontal">
                                                    <span class="sr-only">Actions</span>
                                                </x-keys::button>
                                            </x-slot:trigger>
                                            <x-keys::dropdown.item icon="heroicon-o-eye">View</x-keys::dropdown.item>
                                            <x-keys::dropdown.item icon="heroicon-o-pencil">Edit</x-keys::dropdown.item>
                                            <x-keys::dropdown.separator />
                                            <x-keys::dropdown.item icon="heroicon-o-trash" variant="danger">Delete</x-keys::dropdown.item>
                                        </x-keys::dropdown>
                                    </x-keys::table.cell>
                                </x-keys::table.row>

                                <x-keys::table.row>
                                    <x-keys::table.cell>
                                        <div class="flex items-center gap-2">
                                            <x-keys::avatar
                                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"
                                                name="James Wilson"
                                                size="sm"
                                            />
                                            <div>
                                                <x-keys::text size="sm" weight="medium">James Wilson</x-keys::text>
                                                <x-keys::text size="xs" color="muted">james@example.com</x-keys::text>
                                            </div>
                                        </div>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::text size="sm">API Integration</x-keys::text>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::badge color="info">Review</x-keys::badge>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::text size="sm" color="muted">1 day ago</x-keys::text>
                                    </x-keys::table.cell>
                                    <x-keys::table.cell>
                                        <x-keys::dropdown size="sm">
                                            <x-slot:trigger>
                                                <x-keys::button variant="ghost" size="xs" icon="heroicon-o-ellipsis-horizontal">
                                                    <span class="sr-only">Actions</span>
                                                </x-keys::button>
                                            </x-slot:trigger>
                                            <x-keys::dropdown.item icon="heroicon-o-eye">View</x-keys::dropdown.item>
                                            <x-keys::dropdown.item icon="heroicon-o-pencil">Edit</x-keys::dropdown.item>
                                            <x-keys::dropdown.separator />
                                            <x-keys::dropdown.item icon="heroicon-o-trash" variant="danger">Delete</x-keys::dropdown.item>
                                        </x-keys::dropdown>
                                    </x-keys::table.cell>
                                </x-keys::table.row>
                            </x-keys::table.body>
                        </x-keys::table>
                    </x-keys::card.body>
                </x-keys::card>

                {{-- Filters Accordion --}}
                <x-keys::card>
                    <x-keys::card.header>
                        <x-keys::heading level="h3" size="lg">Quick Filters</x-keys::heading>
                    </x-keys::card.header>
                    <x-keys::card.body>
                        <x-keys::accordion title="Date Range" collapsed>
                            <div class="space-y-4 pt-2">
                                <x-keys::date-picker
                                    name="start_date"
                                    label="Start Date"
                                    clearable
                                />
                                <x-keys::date-picker
                                    name="end_date"
                                    label="End Date"
                                    clearable
                                />
                            </div>
                        </x-keys::accordion>

                        <x-keys::separator />

                        <x-keys::accordion title="Status Filter" collapsed>
                            <div class="space-y-3 pt-2">
                                <x-keys::checkbox name="status[]" value="completed" label="Completed" />
                                <x-keys::checkbox name="status[]" value="in_progress" label="In Progress" />
                                <x-keys::checkbox name="status[]" value="pending" label="Pending" />
                                <x-keys::checkbox name="status[]" value="review" label="Under Review" />
                            </div>
                        </x-keys::accordion>

                        <x-keys::separator />

                        <x-keys::accordion title="Priority Settings" collapsed>
                            <div class="space-y-3 pt-2">
                                <x-keys::toggle
                                    name="high_priority"
                                    label="High Priority Only"
                                    description="Show only high priority items"
                                />
                                <x-keys::toggle
                                    name="urgent"
                                    label="Urgent Tasks"
                                    description="Include urgent tasks"
                                />
                            </div>
                        </x-keys::accordion>
                    </x-keys::card.body>
                </x-keys::card>

            </div>

            {{-- Right Column (1/3 width) --}}
            <div class="space-y-6">

                {{-- Notifications Panel --}}
                <x-keys::card>
                    <x-keys::card.header>
                        <x-keys::heading level="h3" size="lg">Notifications</x-keys::heading>
                    </x-keys::card.header>
                    <x-keys::card.body>
                        <div class="space-y-3">
                            <x-keys::alert variant="success" dismissible size="sm">
                                <strong>Success!</strong> Your project was deployed.
                            </x-keys::alert>

                            <x-keys::alert variant="warning" dismissible size="sm">
                                <strong>Warning!</strong> System maintenance scheduled.
                            </x-keys::alert>

                            <x-keys::alert variant="info" dismissible size="sm">
                                <strong>Info:</strong> New features available.
                            </x-keys::alert>

                            <div class="pt-2">
                                <x-keys::button
                                    variant="ghost"
                                    size="sm"
                                    class="w-full"
                                    onclick="window.ToastActions.success('Profile updated successfully!', { position: 'top-right' }); setTimeout(() => window.ToastActions.info('You have 3 new notifications', { position: 'top-center' }), 300); setTimeout(() => window.ToastActions.warning('Your session will expire in 5 minutes', { position: 'bottom-right' }), 600); setTimeout(() => window.ToastActions.error('Failed to save changes', { position: 'bottom-left' }), 900);"
                                >
                                    Test Toast Notifications
                                </x-keys::button>
                            </div>
                        </div>
                    </x-keys::card.body>
                </x-keys::card>

                {{-- Team Members --}}
                <x-keys::card>
                    <x-keys::card.header>
                        <x-keys::heading level="h3" size="lg">Team Members</x-keys::heading>
                    </x-keys::card.header>
                    <x-keys::card.body>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <x-keys::avatar
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                                        name="Sarah Johnson"
                                        size="sm"
                                        status="online"
                                    />
                                    <div>
                                        <x-keys::text size="sm" weight="medium">Sarah Johnson</x-keys::text>
                                        <x-keys::text size="xs" color="muted">Product Manager</x-keys::text>
                                    </div>
                                </div>
                                <x-keys::badge color="success" size="xs">Active</x-keys::badge>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <x-keys::avatar
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                                        name="Alex Chen"
                                        size="sm"
                                        status="away"
                                    />
                                    <div>
                                        <x-keys::text size="sm" weight="medium">Alex Chen</x-keys::text>
                                        <x-keys::text size="xs" color="muted">Lead Developer</x-keys::text>
                                    </div>
                                </div>
                                <x-keys::badge color="warning" size="xs">Away</x-keys::badge>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <x-keys::avatar
                                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"
                                        name="Maria Garcia"
                                        size="sm"
                                        status="online"
                                    />
                                    <div>
                                        <x-keys::text size="sm" weight="medium">Maria Garcia</x-keys::text>
                                        <x-keys::text size="xs" color="muted">Designer</x-keys::text>
                                    </div>
                                </div>
                                <x-keys::badge color="success" size="xs">Active</x-keys::badge>
                            </div>

                            <x-keys::separator variant="dashed" />

                            <x-keys::avatar.stack>
                                <x-keys::avatar src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" name="James Wilson" />
                                <x-keys::avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" name="Robert Lee" />
                                <x-keys::avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" name="Emma Davis" />
                                <x-keys::avatar name="+12" />
                            </x-keys::avatar.stack>
                            <x-keys::text size="xs" color="muted" class="text-center block">15 team members total</x-keys::text>
                        </div>
                    </x-keys::card.body>
                </x-keys::card>

                {{-- File Upload --}}
                <x-keys::card>
                    <x-keys::card.header>
                        <x-keys::heading level="h3" size="lg">Upload Files</x-keys::heading>
                    </x-keys::card.header>
                    <x-keys::card.body>
                        <x-keys::file-upload
                            name="documents[]"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            max-size="10MB"
                            drag-drop
                        />
                    </x-keys::card.body>
                </x-keys::card>

                {{-- Calendar Widget --}}
                <x-keys::card>
                    <x-keys::card.header>
                        <x-keys::heading level="h3" size="lg">Calendar</x-keys::heading>
                    </x-keys::card.header>
                    <x-keys::card.body>
                        <x-keys::calendar />
                    </x-keys::card.body>
                </x-keys::card>

            </div>

        </div>

        {{-- Component Groups Showcase --}}
        <x-keys::card>
            <x-keys::card.header>
                <x-keys::heading level="h2" size="xl">Component Groups</x-keys::heading>
                <x-keys::text color="muted" size="sm" class="mt-1">
                    Combine multiple components with shared borders and consistent styling
                </x-keys::text>
            </x-keys::card.header>
            <x-keys::card.body>
                <div class="space-y-8">
                    {{-- Search Patterns --}}
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Search Patterns</x-keys::heading>

                        <div class="space-y-3">
                            <div>
                                <x-keys::text size="sm" color="muted" class="mb-2">Input + Button (Attached)</x-keys::text>
                                <x-keys::group attached>
                                    <x-keys::input placeholder="Search projects..." />
                                    <x-keys::button icon="heroicon-o-magnifying-glass">
                                        <span class="sr-only">Search</span>
                                    </x-keys::button>
                                </x-keys::group>
                            </div>

                            <div>
                                <x-keys::text size="sm" color="muted" class="mb-2">With Button Label</x-keys::text>
                                <x-keys::group attached>
                                    <x-keys::input placeholder="Enter keywords..." />
                                    <x-keys::button icon-left="heroicon-o-magnifying-glass">
                                        Search
                                    </x-keys::button>
                                </x-keys::group>
                            </div>
                        </div>
                    </div>

                    <x-keys::separator />

                    {{-- Filter Patterns --}}
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Filter & Action Patterns</x-keys::heading>

                        <div class="space-y-3">
                            <div>
                                <x-keys::text size="sm" color="muted" class="mb-2">Select + Apply Button</x-keys::text>
                                <x-keys::group attached>
                                    <x-keys::select name="filter_status">
                                        <x-keys::select.option value="">All Status</x-keys::select.option>
                                        <x-keys::select.option value="active">Active</x-keys::select.option>
                                        <x-keys::select.option value="pending">Pending</x-keys::select.option>
                                        <x-keys::select.option value="completed">Completed</x-keys::select.option>
                                    </x-keys::select>
                                    <x-keys::button color="primary">Apply</x-keys::button>
                                </x-keys::group>
                            </div>

                            <div>
                                <x-keys::text size="sm" color="muted" class="mb-2">Multiple Filters with Actions</x-keys::text>
                                <x-keys::group attached>
                                    <x-keys::select name="category">
                                        <x-keys::select.option value="">Category</x-keys::select.option>
                                        <x-keys::select.option value="web">Web</x-keys::select.option>
                                        <x-keys::select.option value="mobile">Mobile</x-keys::select.option>
                                    </x-keys::select>
                                    <x-keys::select name="priority">
                                        <x-keys::select.option value="">Priority</x-keys::select.option>
                                        <x-keys::select.option value="high">High</x-keys::select.option>
                                        <x-keys::select.option value="medium">Medium</x-keys::select.option>
                                        <x-keys::select.option value="low">Low</x-keys::select.option>
                                    </x-keys::select>
                                    <x-keys::button variant="outlined" icon="heroicon-o-funnel">Filter</x-keys::button>
                                </x-keys::group>
                            </div>
                        </div>
                    </div>

                    <x-keys::separator />

                    {{-- Date & Time Inputs --}}
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Date & Time Ranges</x-keys::heading>

                        <div class="space-y-3">
                            <div>
                                <x-keys::text size="sm" color="muted" class="mb-2">Date Range Inputs</x-keys::text>
                                <x-keys::group attached>
                                    <x-keys::input type="date" name="start_date" placeholder="Start Date" />
                                    <x-keys::input type="date" name="end_date" placeholder="End Date" />
                                </x-keys::group>
                            </div>

                            <div>
                                <x-keys::text size="sm" color="muted" class="mb-2">Time Range with Button</x-keys::text>
                                <x-keys::group attached>
                                    <x-keys::input type="time" name="start_time" />
                                    <x-keys::input type="time" name="end_time" />
                                    <x-keys::button icon="heroicon-o-check">Confirm</x-keys::button>
                                </x-keys::group>
                            </div>
                        </div>
                    </div>

                    <x-keys::separator />

                    {{-- Pagination & Navigation --}}
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Pagination & Navigation</x-keys::heading>

                        <div class="space-y-3">
                            <div>
                                <x-keys::text size="sm" color="muted" class="mb-2">Pagination Controls</x-keys::text>
                                <x-keys::group attached>
                                    <x-keys::button variant="outlined" icon="heroicon-o-chevron-left">
                                        <span class="sr-only">Previous</span>
                                    </x-keys::button>
                                    <x-keys::input type="number" value="1" class="text-center" style="max-width: 80px;" />
                                    <x-keys::button variant="outlined" icon="heroicon-o-chevron-right">
                                        <span class="sr-only">Next</span>
                                    </x-keys::button>
                                </x-keys::group>
                            </div>

                            <div>
                                <x-keys::text size="sm" color="muted" class="mb-2">View Switcher</x-keys::text>
                                <x-keys::group attached>
                                    <x-keys::button variant="outlined" icon="heroicon-o-squares-2x2" data-selected="true">
                                        Grid
                                    </x-keys::button>
                                    <x-keys::button variant="outlined" icon="heroicon-o-list-bullet">
                                        List
                                    </x-keys::button>
                                    <x-keys::button variant="outlined" icon="heroicon-o-table-cells">
                                        Table
                                    </x-keys::button>
                                </x-keys::group>
                            </div>
                        </div>
                    </div>

                    <x-keys::separator />

                    {{-- Vertical Groups --}}
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Vertical Orientation</x-keys::heading>

                        <div class="flex gap-6">
                            <div class="flex-1">
                                <x-keys::text size="sm" color="muted" class="mb-2">Vertical Button Stack</x-keys::text>
                                <x-keys::group orientation="vertical" attached>
                                    <x-keys::button variant="outlined" icon-left="heroicon-o-document-text">View Details</x-keys::button>
                                    <x-keys::button variant="outlined" icon-left="heroicon-o-pencil">Edit</x-keys::button>
                                    <x-keys::button variant="outlined" icon-left="heroicon-o-trash" class="text-danger">Delete</x-keys::button>
                                </x-keys::group>
                            </div>

                            <div class="flex-1">
                                <x-keys::text size="sm" color="muted" class="mb-2">Vertical Form Controls</x-keys::text>
                                <x-keys::group orientation="vertical" attached>
                                    <x-keys::input placeholder="Name" />
                                    <x-keys::input type="email" placeholder="Email" />
                                    <x-keys::button color="primary">Submit</x-keys::button>
                                </x-keys::group>
                            </div>
                        </div>
                    </div>

                    <x-keys::separator />

                    {{-- Detached Mode --}}
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Detached Mode (With Spacing)</x-keys::heading>

                        <div class="space-y-3">
                            <div>
                                <x-keys::text size="sm" color="muted" class="mb-2">Default Gap (Medium)</x-keys::text>
                                <x-keys::group :attached="false">
                                    <x-keys::button variant="outlined">First</x-keys::button>
                                    <x-keys::button variant="outlined">Second</x-keys::button>
                                    <x-keys::button variant="outlined">Third</x-keys::button>
                                </x-keys::group>
                            </div>

                            <div>
                                <x-keys::text size="sm" color="muted" class="mb-2">Small Gap</x-keys::text>
                                <x-keys::group :attached="false" gap="sm">
                                    <x-keys::input placeholder="First Name" />
                                    <x-keys::input placeholder="Last Name" />
                                    <x-keys::button color="primary">Save</x-keys::button>
                                </x-keys::group>
                            </div>

                            <div>
                                <x-keys::text size="sm" color="muted" class="mb-2">Large Gap</x-keys::text>
                                <x-keys::group :attached="false" gap="lg">
                                    <x-keys::button variant="solid" color="primary">Confirm</x-keys::button>
                                    <x-keys::button variant="outlined">Cancel</x-keys::button>
                                </x-keys::group>
                            </div>
                        </div>
                    </div>
                </div>
            </x-keys::card.body>
        </x-keys::card>

        {{-- Forms Section with Tabs --}}
        <x-keys::card>
            <x-keys::card.header>
                <x-keys::heading level="h2" size="xl">Settings</x-keys::heading>
            </x-keys::card.header>
            <x-keys::card.body>
                <x-keys::tabs
                    :items="[
                        ['value' => 'profile', 'label' => 'Profile'],
                        ['value' => 'preferences', 'label' => 'Preferences'],
                        ['value' => 'advanced', 'label' => 'Advanced'],
                    ]"
                    variant="pills"
                    default-value="profile"
                >
                    {{-- Profile Panel --}}
                    <div data-tab-panel="profile">
                        <div class="space-y-4 pt-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::input
                                    name="first_name"
                                    label="First Name"
                                    value="Sarah"
                                    required
                                />
                                <x-keys::input
                                    name="last_name"
                                    label="Last Name"
                                    value="Johnson"
                                    required
                                />
                            </div>

                            <x-keys::input
                                name="email"
                                type="email"
                                label="Email Address"
                                value="sarah@example.com"
                                icon-left="heroicon-o-envelope"
                                required
                            />

                            <x-keys::textarea
                                name="bio"
                                label="Bio"
                                rows="4"
                                placeholder="Tell us about yourself..."
                                show-character-count
                                max-length="500"
                            />

                            <x-keys::select name="role" label="Role">
                                <x-keys::select.option value="admin">Administrator</x-keys::select.option>
                                <x-keys::select.option value="manager" selected>Manager</x-keys::select.option>
                                <x-keys::select.option value="developer">Developer</x-keys::select.option>
                                <x-keys::select.option value="designer">Designer</x-keys::select.option>
                            </x-keys::select>

                            <x-keys::button type="button" color="primary">
                                Save Profile
                            </x-keys::button>
                        </div>
                    </div>

                    {{-- Preferences Panel --}}
                    <div data-tab-panel="preferences">
                        <div class="space-y-6 pt-4">
                            <div>
                                <x-keys::heading level="h4" size="md" class="mb-3">Notifications</x-keys::heading>
                                <div class="space-y-3">
                                    <x-keys::toggle
                                        name="email_notifications"
                                        label="Email Notifications"
                                        description="Receive notifications via email"
                                        checked
                                    />
                                    <x-keys::toggle
                                        name="push_notifications"
                                        label="Push Notifications"
                                        description="Receive push notifications in browser"
                                        checked
                                    />
                                    <x-keys::toggle
                                        name="sms_notifications"
                                        label="SMS Notifications"
                                        description="Receive text message alerts"
                                    />
                                </div>
                            </div>

                            <x-keys::separator />

                            <div>
                                <x-keys::heading level="h4" size="md" class="mb-3">Theme</x-keys::heading>
                                <x-keys::choice-group
                                    name="theme"
                                    type="radio"
                                    layout="stacked"
                                >
                                    <x-keys::radio name="theme" value="light" label="Light Mode" checked />
                                    <x-keys::radio name="theme" value="dark" label="Dark Mode" />
                                    <x-keys::radio name="theme" value="auto" label="System Default" />
                                </x-keys::choice-group>
                            </div>

                            <x-keys::separator />

                            <div>
                                <x-keys::heading level="h4" size="md" class="mb-3">Time & Date</x-keys::heading>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <x-keys::select name="timezone" label="Timezone">
                                        <x-keys::select.option value="utc">UTC</x-keys::select.option>
                                        <x-keys::select.option value="est" selected>Eastern (EST)</x-keys::select.option>
                                        <x-keys::select.option value="pst">Pacific (PST)</x-keys::select.option>
                                        <x-keys::select.option value="cst">Central (CST)</x-keys::select.option>
                                    </x-keys::select>

                                    <x-keys::time-picker
                                        name="work_start"
                                        label="Work Start Time"
                                        format="12"
                                        value="09:00"
                                    />
                                </div>
                            </div>

                            <x-keys::button type="button" color="primary">
                                Save Preferences
                            </x-keys::button>
                        </div>
                    </div>

                    {{-- Advanced Panel --}}
                    <div data-tab-panel="advanced">
                        <div class="space-y-6 pt-4">
                            <x-keys::alert variant="warning">
                                <strong>Caution:</strong> These settings are for advanced users only.
                            </x-keys::alert>

                            <x-keys::input
                                name="api_key"
                                type="password"
                                label="API Key"
                                show-password
                                copyable
                                value="sk_test_abc123xyz"
                            />

                            <x-keys::range
                                name="performance"
                                label="Performance Level"
                                :min="0"
                                :max="100"
                                :value="75"
                                show-values
                                :ticks="[0, 25, 50, 75, 100]"
                                show-ticks
                            />

                            <x-keys::color-picker
                                name="brand_color"
                                label="Brand Color"
                                value="#3b82f6"
                            />

                            <div>
                                <x-keys::heading level="h4" size="md" class="mb-3">Feature Flags</x-keys::heading>
                                <x-keys::choice-group
                                    name="features[]"
                                    type="checkbox"
                                    layout="grid"
                                >
                                    <x-keys::checkbox
                                        name="features[]"
                                        value="beta"
                                        variant="card"
                                        title="Beta Features"
                                        description="Enable experimental features"
                                        icon="heroicon-o-beaker"
                                    />
                                    <x-keys::checkbox
                                        name="features[]"
                                        value="analytics"
                                        variant="card"
                                        title="Advanced Analytics"
                                        description="Detailed insights and reports"
                                        icon="heroicon-o-chart-bar"
                                        checked
                                    />
                                    <x-keys::checkbox
                                        name="features[]"
                                        value="export"
                                        variant="card"
                                        title="Data Export"
                                        description="Export your data anytime"
                                        icon="heroicon-o-arrow-down-tray"
                                        checked
                                    />
                                </x-keys::choice-group>
                            </div>

                            <x-keys::button type="button" color="primary">
                                Save Advanced Settings
                            </x-keys::button>
                        </div>
                    </div>
                </x-keys::tabs>
            </x-keys::card.body>
        </x-keys::card>

        {{-- Progress & Rating Section --}}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <x-keys::card>
                <x-keys::card.header>
                    <x-keys::heading level="h3" size="lg">Project Progress</x-keys::heading>
                </x-keys::card.header>
                <x-keys::card.body>
                    <div class="space-y-4">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <x-keys::text size="sm">Website Redesign</x-keys::text>
                                <x-keys::text size="sm" weight="medium">85%</x-keys::text>
                            </div>
                            <x-keys::progress :value="85" :max="100" color="success" />
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <x-keys::text size="sm">Mobile App</x-keys::text>
                                <x-keys::text size="sm" weight="medium">60%</x-keys::text>
                            </div>
                            <x-keys::progress :value="60" :max="100" color="info" />
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <x-keys::text size="sm">API Integration</x-keys::text>
                                <x-keys::text size="sm" weight="medium">40%</x-keys::text>
                            </div>
                            <x-keys::progress :value="40" :max="100" color="warning" />
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <x-keys::text size="sm">Testing Phase</x-keys::text>
                                <x-keys::text size="sm" weight="medium">15%</x-keys::text>
                            </div>
                            <x-keys::progress :value="15" :max="100" color="brand" />
                        </div>
                    </div>
                </x-keys::card.body>
            </x-keys::card>

            <x-keys::card>
                <x-keys::card.header>
                    <x-keys::heading level="h3" size="lg">Customer Satisfaction</x-keys::heading>
                </x-keys::card.header>
                <x-keys::card.body>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <x-keys::text size="sm">Product Quality</x-keys::text>
                            <x-keys::rating :value="5" :max="5" readonly />
                        </div>

                        <div class="flex items-center justify-between">
                            <x-keys::text size="sm">Customer Support</x-keys::text>
                            <x-keys::rating :value="4.5" :max="5" readonly />
                        </div>

                        <div class="flex items-center justify-between">
                            <x-keys::text size="sm">Delivery Time</x-keys::text>
                            <x-keys::rating :value="4" :max="5" readonly />
                        </div>

                        <div class="flex items-center justify-between">
                            <x-keys::text size="sm">Value for Money</x-keys::text>
                            <x-keys::rating :value="4.5" :max="5" readonly />
                        </div>

                        <x-keys::separator variant="dashed" />

                        <div>
                            <x-keys::text size="sm" weight="medium" class="mb-2 block">Rate Your Experience</x-keys::text>
                            <x-keys::rating name="user_rating" :max="5" size="lg" show-count />
                        </div>
                    </div>
                </x-keys::card.body>
            </x-keys::card>
        </div>

        {{-- Image Gallery Section --}}
        <x-keys::card>
            <x-keys::card.header>
                <x-keys::heading level="h3" size="lg">Recent Projects</x-keys::heading>
            </x-keys::card.header>
            <x-keys::card.body>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <x-keys::image
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"
                        alt="Analytics Dashboard"
                        aspect-ratio="video"
                        radius="lg"
                        caption="Analytics Dashboard"
                    />
                    <x-keys::image
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600"
                        alt="Data Visualization"
                        aspect-ratio="video"
                        radius="lg"
                        caption="Data Visualization"
                    />
                    <x-keys::image
                        src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600"
                        alt="Mobile Development"
                        aspect-ratio="video"
                        radius="lg"
                        caption="Mobile Development"
                    />
                </div>
            </x-keys::card.body>
        </x-keys::card>

        {{-- Keyboard Shortcuts Info --}}
        <x-keys::card>
            <x-keys::card.header>
                <x-keys::heading level="h3" size="lg">Keyboard Shortcuts</x-keys::heading>
            </x-keys::card.header>
            <x-keys::card.body>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex items-center justify-between">
                        <x-keys::text size="sm">Create New Project</x-keys::text>
                        <div class="flex gap-1">
                            <x-keys::kbd keys="Ctrl" />
                            <x-keys::text size="sm">+</x-keys::text>
                            <x-keys::kbd keys="N" />
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <x-keys::text size="sm">Quick Search</x-keys::text>
                        <div class="flex gap-1">
                            <x-keys::kbd keys="Ctrl" />
                            <x-keys::text size="sm">+</x-keys::text>
                            <x-keys::kbd keys="K" />
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <x-keys::text size="sm">Save Changes</x-keys::text>
                        <div class="flex gap-1">
                            <x-keys::kbd keys="Ctrl" />
                            <x-keys::text size="sm">+</x-keys::text>
                            <x-keys::kbd keys="S" />
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <x-keys::text size="sm">Toggle Sidebar</x-keys::text>
                        <div class="flex gap-1">
                            <x-keys::kbd keys="Ctrl" />
                            <x-keys::text size="sm">+</x-keys::text>
                            <x-keys::kbd keys="B" />
                        </div>
                    </div>
                </div>
            </x-keys::card.body>
        </x-keys::card>


        {{-- Social Links Footer --}}
        <x-keys::card>
            <x-keys::card.body>
                <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                    <x-keys::text color="muted" size="sm">
                        © 2025 Keys UI Dashboard. Built with Laravel & Keys UI.
                    </x-keys::text>

                    <x-keys::social.links
                        :links="[
                            'github' => 'https://github.com',
                            'twitter' => 'https://twitter.com',
                            'linkedin' => 'https://linkedin.com',
                        ]"
                        size="md"
                    />
                </div>
            </x-keys::card.body>
        </x-keys::card>

    </div>

    {{-- Modals --}}

    {{-- Create Project Modal --}}
    <x-keys::modal id="create-project-modal" size="lg" backdrop="blur">
        <x-slot:header>
            <x-keys::heading level="h3" size="xl">Create New Project</x-keys::heading>
        </x-slot:header>

        <div class="space-y-4">
            <x-keys::input
                name="project_name"
                label="Project Name"
                placeholder="Enter project name"
                required
            />

            <x-keys::textarea
                name="project_description"
                label="Description"
                rows="4"
                placeholder="Describe your project..."
            />

            <x-keys::select name="project_category" label="Category">
                <x-keys::select.option value="web">Web Development</x-keys::select.option>
                <x-keys::select.option value="mobile">Mobile App</x-keys::select.option>
                <x-keys::select.option value="design">Design</x-keys::select.option>
                <x-keys::select.option value="marketing">Marketing</x-keys::select.option>
            </x-keys::select>

            <x-keys::date-picker
                name="project_deadline"
                label="Deadline"
                clearable
            />
        </div>

        <x-slot:footer>
            <x-keys::button variant="ghost" onclick="document.getElementById('create-project-modal').close()">
                Cancel
            </x-keys::button>
            <x-keys::button color="primary">
                Create Project
            </x-keys::button>
        </x-slot:footer>
    </x-keys::modal>

    {{-- Settings Slideout --}}
    <x-keys::slideout id="settings-slideout" position="right">
        <x-slot:header>
            <x-keys::heading level="h3" size="xl">Quick Settings</x-keys::heading>
        </x-slot:header>

        <div class="space-y-6">
            <div>
                <x-keys::heading level="h4" size="md" class="mb-3">Display</x-keys::heading>
                <div class="space-y-3">
                    <x-keys::toggle
                        name="compact_mode"
                        label="Compact Mode"
                        description="Reduce spacing for more content"
                    />
                    <x-keys::toggle
                        name="animations"
                        label="Animations"
                        description="Enable smooth transitions"
                        checked
                    />
                </div>
            </div>

            <x-keys::separator />

            <div>
                <x-keys::heading level="h4" size="md" class="mb-3">Editor</x-keys::heading>
                <x-keys::editor
                    name="notes"
                    placeholder="Take some notes..."
                    height="200px"
                />
            </div>
        </div>

        <x-slot:footer>
            <x-keys::button variant="ghost" onclick="document.getElementById('settings-slideout').close()">
                Close
            </x-keys::button>
            <x-keys::button color="primary">
                Save Settings
            </x-keys::button>
        </x-slot:footer>
    </x-keys::slideout>

</x-layouts.sidebar>
