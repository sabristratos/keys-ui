# Quick Start Guide

Get up and running with Keys UI components in minutes.

## Installation

Keys UI is already included in this Laravel application. For new projects:

```bash
composer require keys/ui
```

## Basic Setup

### 1. Include Scripts
Add the Keys UI scripts to your layout:

```blade
{{-- In your layout file --}}
<keys:scripts />
```

### 2. Build Assets
```bash
# Build Keys UI assets
php artisan keys:build

# Watch for changes during development
php artisan keys:build --watch
```

## Your First Component

```blade
{{-- Simple button --}}
<x-keys::button variant="brand">Hello Keys UI!</x-keys::button>

{{-- Button with icon --}}
<x-keys::button icon="heroicon-o-plus" variant="success">
    Add Item
</x-keys::button>

{{-- Auto icon-only button --}}
<x-keys::button icon="heroicon-o-heart" />
```

## Form Components

### Basic Form
```blade
<form method="POST" class="space-y-4">
    @csrf

    <x-keys::input
        name="name"
        label="Full Name"
        required
        :errors="$errors"
    />

    <x-keys::input
        name="email"
        type="email"
        label="Email Address"
        required
        :errors="$errors"
    />

    <x-keys::select name="role" label="Role" required>
        <x-keys::select.option value="user" label="User" />
        <x-keys::select.option value="admin" label="Administrator" />
    </x-keys::select>

    <x-keys::checkbox
        name="newsletter"
        label="Subscribe to newsletter"
    />

    <x-keys::button type="submit" variant="brand">
        Create Account
    </x-keys::button>
</form>
```

### Advanced Form Elements
```blade
{{-- Multi-select with search --}}
<x-keys::select name="skills[]" multiple searchable clearable>
    <x-keys::select.option value="php" label="PHP" />
    <x-keys::select.option value="js" label="JavaScript" />
    <x-keys::select.option value="react" label="React" />
</x-keys::select>

{{-- Card-style selections --}}
<x-keys::radio
    variant="card"
    name="plan"
    value="pro"
    title="Pro Plan"
    description="Perfect for growing teams"
    icon="heroicon-o-star"
/>

{{-- File upload with drag & drop --}}
<x-keys::file-upload
    name="documents[]"
    multiple
    accept=".pdf,.doc,.docx"
    max-size="10MB"
/>
```

## Display Components

### User Interface Elements
```blade
{{-- Status badges --}}
<x-keys::badge color="success">Active</x-keys::badge>
<x-keys::badge icon="heroicon-o-check" color="success" />

{{-- User avatars --}}
<x-keys::avatar
    src="/avatar.jpg"
    name="John Doe"
    status="online"
/>

{{-- Avatar groups --}}
<x-keys::avatar.stack size="md">
    <x-keys::avatar name="John Doe" />
    <x-keys::avatar name="Jane Smith" />
    <x-keys::avatar name="Bob Wilson" />
</x-keys::avatar.stack>

{{-- Alerts and notifications --}}
<x-keys::alert variant="success" dismissible>
    Your changes have been saved!
</x-keys::alert>
```

### Progress and Feedback
```blade
{{-- Progress bars --}}
<x-keys::progress value="75" max="100" show-percentage />

{{-- Loading states --}}
<x-keys::progress indeterminate label="Processing..." />

{{-- Range sliders --}}
<x-keys::range
    name="volume"
    min="0"
    max="100"
    value="75"
    show-value
/>
```

## Layout Components

### Content Organization
```blade
{{-- Simple card --}}
<x-keys::card variant="padded">
    <h3 class="font-semibold mb-2">Card Title</h3>
    <p>Card content goes here.</p>
</x-keys::card>

{{-- Selectable cards --}}
<x-keys::card selectable name="option" value="premium">
    <div class="p-4">
        <h3 class="font-semibold">Premium Option</h3>
        <p class="text-sm text-neutral-600">Advanced features included</p>
    </div>
</x-keys::card>

{{-- Modal dialogs --}}
<x-keys::modal id="user-modal" size="md">
    <h2 class="text-lg font-semibold mb-4">User Details</h2>
    <!-- Modal content -->
    <div class="flex justify-end gap-2 mt-6">
        <x-keys::button variant="ghost" onclick="closeModal('user-modal')">
            Cancel
        </x-keys::button>
        <x-keys::button variant="brand">Save</x-keys::button>
    </div>
</x-keys::modal>
```

## Common Patterns

### Settings Interface
```blade
<x-keys::card variant="padded">
    <h3 class="text-lg font-semibold mb-6">Notification Settings</h3>

    <div class="space-y-4">
        <x-keys::toggle
            name="email_notifications"
            label="Email Notifications"
            description="Receive updates via email"
        />

        <x-keys::toggle
            name="push_notifications"
            label="Push Notifications"
            description="Browser and mobile notifications"
        />

        <x-keys::range
            name="notification_frequency"
            label="Frequency (hours)"
            min="1"
            max="24"
            value="6"
            show-value
        />
    </div>
</x-keys::card>
```

### Dashboard Widget
```blade
<x-keys::card variant="elevated">
    <div class="p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold">Server Status</h3>
            <x-keys::badge color="success">Online</x-keys::badge>
        </div>

        <div class="space-y-3">
            <div>
                <div class="flex justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span>45%</span>
                </div>
                <x-keys::progress value="45" max="100" color="brand" />
            </div>

            <div>
                <div class="flex justify-between text-sm mb-1">
                    <span>Memory</span>
                    <span>67%</span>
                </div>
                <x-keys::progress value="67" max="100" color="warning" />
            </div>
        </div>
    </div>
</x-keys::card>
```

### User Profile Card
```blade
<x-keys::card variant="bordered">
    <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
            <x-keys::avatar
                src="/avatar.jpg"
                name="John Doe"
                size="lg"
                status="online"
            />
            <div>
                <h3 class="font-semibold">John Doe</h3>
                <p class="text-sm text-neutral-600">Software Developer</p>
                <div class="flex gap-2 mt-2">
                    <x-keys::badge size="xs" color="blue">PHP</x-keys::badge>
                    <x-keys::badge size="xs" color="green">Laravel</x-keys::badge>
                    <x-keys::badge size="xs" color="purple">Vue.js</x-keys::badge>
                </div>
            </div>
        </div>

        <div class="flex gap-2">
            <x-keys::button size="sm" variant="brand">Message</x-keys::button>
            <x-keys::button size="sm" variant="ghost">Follow</x-keys::button>
        </div>
    </div>
</x-keys::card>
```

## Framework Integration

### Livewire
```blade
{{-- Real-time form --}}
<div>
    <x-keys::input
        name="search"
        placeholder="Search..."
        wire:model.live.debounce.300ms="search"
        clearable
    />

    <x-keys::toggle
        name="show_inactive"
        label="Show inactive items"
        wire:model.live="showInactive"
    />

    @foreach($results as $item)
        <x-keys::card>{{ $item->name }}</x-keys::card>
    @endforeach
</div>
```

### Alpine.js
```blade
<div x-data="{ darkMode: false }">
    <x-keys::toggle
        name="dark_mode"
        label="Dark Mode"
        x-model="darkMode"
        @change="document.documentElement.classList.toggle('dark', darkMode)"
    />

    <div x-show="darkMode" x-transition>
        <x-keys::alert variant="info">Dark mode enabled!</x-keys::alert>
    </div>
</div>
```

## Customization

### CSS Custom Properties
```css
:root {
    --color-brand: #3b82f6;
    --color-brand-hover: #2563eb;
    --color-surface: #ffffff;
    --color-foreground: #111827;
}

/* Dark mode */
:root.dark {
    --color-surface: #1f2937;
    --color-foreground: #f9fafb;
}
```

### Component Targeting
```css
/* Target specific component states */
[data-keys-button][data-loading="true"] {
    cursor: wait;
}

[data-keys-card][data-selected="true"] {
    border-color: var(--color-brand);
    box-shadow: 0 0 0 3px rgba(var(--color-brand-rgb), 0.1);
}
```

## Next Steps

1. **Explore Components**: Browse the [Component Index](components/index.md) for all available components
2. **Read Documentation**: Check individual component docs for detailed usage
3. **Build Forms**: Use the comprehensive form components for user input
4. **Create Interfaces**: Combine display and layout components for rich UIs
5. **Customize Styling**: Use CSS custom properties and data attributes for theming

## Development Commands

```bash
# Build Keys UI assets
php artisan keys:build

# Watch for changes
php artisan keys:build --watch

# Development build with publishing
php artisan keys:build --dev --publish

# Laravel development server
composer run dev
```

For more detailed information, see the full component documentation in the [components](components/) folder.