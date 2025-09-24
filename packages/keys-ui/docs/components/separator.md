# Separator Component

Visual dividers and separators with multiple styles, orientations, and customization options for organizing content.

## Basic Usage

```blade
{{-- Simple horizontal line --}}
<x-keys::separator />

{{-- Separator with text --}}
<x-keys::separator>or</x-keys::separator>

{{-- Vertical separator --}}
<x-keys::separator orientation="vertical" />

{{-- Gradient separator --}}
<x-keys::separator variant="gradient" color="brand" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `line` | Style: `line`, `text`, `icon`, `gradient`, `dashed` |
| `orientation` | string | `horizontal` | Direction: `horizontal`, `vertical` |
| `color` | string | `neutral` | Color: `brand`, `success`, `warning`, `danger`, `neutral`, or specific colors |
| `size` | string | `sm` | Thickness: `xs`, `sm`, `md`, `lg` |
| `spacing` | string | `md` | Margin spacing: `none`, `xs`, `sm`, `md`, `lg`, `xl` |
| `alignment` | string | `center` | Text/icon alignment: `left`, `center`, `right` |
| `icon` | string | `null` | Heroicon name for icon variant |

## Variant Types

### Line Separator (Default)
```blade
{{-- Basic line --}}
<x-keys::separator />

{{-- Colored line --}}
<x-keys::separator color="brand" />

{{-- Thick line --}}
<x-keys::separator size="lg" color="success" />
```

### Text Separator
```blade
{{-- Text in the middle --}}
<x-keys::separator variant="text">OR</x-keys::separator>

{{-- Left-aligned text --}}
<x-keys::separator variant="text" alignment="left">Section 1</x-keys::separator>

{{-- Right-aligned text --}}
<x-keys::separator variant="text" alignment="right">End</x-keys::separator>
```

### Icon Separator
```blade
{{-- Icon in the middle --}}
<x-keys::separator variant="icon" icon="heroicon-o-star" />

{{-- Icon with color --}}
<x-keys::separator variant="icon" icon="heroicon-o-heart" color="danger" />

{{-- Icon with text --}}
<x-keys::separator variant="icon" icon="heroicon-o-plus">Add More</x-keys::separator>
```

### Gradient Separator
```blade
{{-- Gradient line --}}
<x-keys::separator variant="gradient" />

{{-- Colored gradient --}}
<x-keys::separator variant="gradient" color="brand" />

{{-- Thick gradient --}}
<x-keys::separator variant="gradient" color="success" size="md" />
```

### Dashed Separator
```blade
{{-- Dashed line --}}
<x-keys::separator variant="dashed" />

{{-- Colored dashed line --}}
<x-keys::separator variant="dashed" color="warning" />
```

## Orientation

### Horizontal (Default)
```blade
<div class="space-y-4">
    <p>Content above</p>
    <x-keys::separator />
    <p>Content below</p>
</div>
```

### Vertical
```blade
<div class="flex items-center gap-4">
    <span>Left content</span>
    <x-keys::separator orientation="vertical" spacing="none" />
    <span>Right content</span>
</div>
```

## Color Variants

```blade
<div class="space-y-4">
    {{-- Semantic colors --}}
    <x-keys::separator color="brand" />
    <x-keys::separator color="success" />
    <x-keys::separator color="warning" />
    <x-keys::separator color="danger" />
    <x-keys::separator color="neutral" />

    {{-- Specific colors --}}
    <x-keys::separator color="blue" />
    <x-keys::separator color="green" />
    <x-keys::separator color="purple" />
    <x-keys::separator color="pink" />
</div>
```

## Size and Spacing

```blade
<div class="space-y-6">
    {{-- Different sizes --}}
    <x-keys::separator size="xs" />
    <x-keys::separator size="sm" />
    <x-keys::separator size="md" />
    <x-keys::separator size="lg" />

    {{-- Different spacing --}}
    <x-keys::separator spacing="none" />
    <x-keys::separator spacing="xs" />
    <x-keys::separator spacing="sm" />
    <x-keys::separator spacing="md" />
    <x-keys::separator spacing="lg" />
    <x-keys::separator spacing="xl" />
</div>
```

## Use Cases

### Form Section Dividers
```blade
<form class="space-y-6">
    {{-- Personal Information --}}
    <div class="space-y-4">
        <h3 class="font-semibold text-lg">Personal Information</h3>
        <x-keys::input name="first_name" label="First Name" />
        <x-keys::input name="last_name" label="Last Name" />
        <x-keys::input name="email" label="Email" type="email" />
    </div>

    <x-keys::separator variant="text" color="brand">Contact Details</x-keys::separator>

    <div class="space-y-4">
        <x-keys::input name="phone" label="Phone Number" type="tel" />
        <x-keys::textarea name="address" label="Address" />
    </div>

    <x-keys::separator />

    <x-keys::button type="submit" variant="brand">Submit</x-keys::button>
</form>
```

### Content Sections
```blade
<article class="prose max-w-none">
    <h1>Article Title</h1>
    <p>Introduction paragraph...</p>

    <x-keys::separator variant="gradient" color="brand" spacing="lg" />

    <h2>Main Content</h2>
    <p>Main content here...</p>

    <x-keys::separator variant="text">Conclusion</x-keys::separator>

    <p>Concluding thoughts...</p>
</article>
```

### Login/Registration Forms
```blade
<x-keys::card variant="padded" class="max-w-md mx-auto">
    <h2 class="text-xl font-semibold mb-6">Sign In</h2>

    {{-- Email/Password login --}}
    <form class="space-y-4">
        <x-keys::input name="email" label="Email" type="email" />
        <x-keys::input name="password" label="Password" type="password" />
        <x-keys::button type="submit" variant="brand" class="w-full">Sign In</x-keys::button>
    </form>

    <x-keys::separator variant="text" spacing="lg">or</x-keys::separator>

    {{-- Social login --}}
    <div class="space-y-3">
        <x-keys::button variant="ghost" class="w-full">
            <x-keys::icon name="heroicon-o-globe-alt" size="sm" class="mr-2" />
            Continue with Google
        </x-keys::button>

        <x-keys::button variant="ghost" class="w-full">
            <x-keys::icon name="heroicon-o-share" size="sm" class="mr-2" />
            Continue with GitHub
        </x-keys::button>
    </div>

    <x-keys::separator spacing="lg" />

    <p class="text-center text-sm text-neutral-600">
        Don't have an account?
        <a href="/register" class="text-brand hover:underline">Sign up</a>
    </p>
</x-keys::card>
```

### Dashboard Sections
```blade
<div class="space-y-8">
    {{-- Stats Section --}}
    <div>
        <h2 class="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <div class="grid grid-cols-3 gap-6">
            <x-keys::card variant="stats">
                <div class="text-2xl font-bold text-brand">1,234</div>
                <div class="text-sm text-neutral-600">Total Users</div>
            </x-keys::card>
            <!-- More stats cards -->
        </div>
    </div>

    <x-keys::separator variant="gradient" color="brand" />

    {{-- Recent Activity --}}
    <div>
        <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
        <!-- Activity content -->
    </div>

    <x-keys::separator variant="text" icon="heroicon-o-chart-bar">Analytics</x-keys::separator>

    {{-- Analytics Section --}}
    <div>
        <!-- Analytics content -->
    </div>
</div>
```

### Sidebar Navigation
```blade
<aside class="w-64 bg-surface border-r">
    <div class="p-4">
        <h2 class="font-bold text-lg mb-4">Navigation</h2>

        <nav class="space-y-1">
            <a href="/dashboard" class="nav-link">Dashboard</a>
            <a href="/projects" class="nav-link">Projects</a>
            <a href="/tasks" class="nav-link">Tasks</a>
        </nav>

        <x-keys::separator spacing="lg" />

        <h3 class="font-medium text-sm text-neutral-600 mb-2">TOOLS</h3>
        <nav class="space-y-1">
            <a href="/analytics" class="nav-link">Analytics</a>
            <a href="/reports" class="nav-link">Reports</a>
        </nav>

        <x-keys::separator variant="dashed" spacing="lg" />

        <h3 class="font-medium text-sm text-neutral-600 mb-2">SETTINGS</h3>
        <nav class="space-y-1">
            <a href="/profile" class="nav-link">Profile</a>
            <a href="/preferences" class="nav-link">Preferences</a>
        </nav>
    </div>
</aside>
```

### Card Content Dividers
```blade
<x-keys::card variant="padded">
    <div class="flex items-center justify-between">
        <h3 class="font-semibold">User Profile</h3>
        <x-keys::button variant="ghost" size="sm">Edit</x-keys::button>
    </div>

    <x-keys::separator spacing="md" />

    <div class="space-y-3">
        <div class="flex justify-between">
            <span class="text-neutral-600">Name:</span>
            <span class="font-medium">John Doe</span>
        </div>
        <div class="flex justify-between">
            <span class="text-neutral-600">Email:</span>
            <span class="font-medium">john@example.com</span>
        </div>
        <div class="flex justify-between">
            <span class="text-neutral-600">Role:</span>
            <span class="font-medium">Administrator</span>
        </div>
    </div>

    <x-keys::separator variant="dashed" spacing="md" />

    <div class="flex gap-2">
        <x-keys::button variant="brand" size="sm">Save Changes</x-keys::button>
        <x-keys::button variant="ghost" size="sm">Cancel</x-keys::button>
    </div>
</x-keys::card>
```

### Timeline/Steps
```blade
<div class="max-w-2xl">
    <div class="space-y-6">
        <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <div>
                <h3 class="font-medium">Account Setup</h3>
                <p class="text-neutral-600 text-sm">Create your account and verify email</p>
            </div>
        </div>

        <div class="ml-4">
            <x-keys::separator orientation="vertical" size="md" color="brand" spacing="none" />
        </div>

        <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-neutral-200 text-neutral-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <div>
                <h3 class="font-medium">Profile Information</h3>
                <p class="text-neutral-600 text-sm">Add your personal details and preferences</p>
            </div>
        </div>

        <div class="ml-4">
            <x-keys::separator orientation="vertical" size="md" color="neutral" spacing="none" />
        </div>

        <div class="flex items-start gap-4">
            <div class="w-8 h-8 bg-neutral-200 text-neutral-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <div>
                <h3 class="font-medium">Getting Started</h3>
                <p class="text-neutral-600 text-sm">Explore features and customize your experience</p>
            </div>
        </div>
    </div>
</div>
```

### Menu Separators
```blade
<div class="bg-surface border rounded-lg p-2 w-48">
    <button class="menu-item">Profile</button>
    <button class="menu-item">Settings</button>

    <x-keys::separator spacing="xs" />

    <button class="menu-item">Help Center</button>
    <button class="menu-item">Keyboard Shortcuts</button>

    <x-keys::separator spacing="xs" />

    <button class="menu-item text-danger">Sign Out</button>
</div>
```

## Accessibility

- **Semantic Markup**: Uses appropriate ARIA roles for screen readers
- **Color Independence**: Works without relying solely on color
- **Focus Management**: Doesn't interfere with keyboard navigation
- **High Contrast**: Maintains visibility in high contrast mode

## CSS Customization

```css
/* Custom separator colors */
[data-keys-separator="true"][data-color="custom"] {
    border-color: #custom-color;
}

/* Custom gradient */
[data-keys-separator="true"][data-variant="gradient"][data-color="custom"] {
    background: linear-gradient(to right, transparent, #custom-color, transparent);
}

/* Custom spacing */
[data-keys-separator="true"][data-spacing="custom"] {
    margin: 2rem 0;
}

/* Custom text styling */
[data-keys-separator="true"][data-variant="text"] .separator-text {
    background: var(--color-surface);
    padding: 0 1rem;
    font-weight: 500;
    color: var(--color-neutral-600);
}

/* Animation effects */
[data-keys-separator="true"][data-variant="gradient"] {
    animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}
```

## Best Practices

1. **Use semantically** - Choose variants that match content hierarchy
2. **Consistent spacing** - Use consistent spacing throughout your design
3. **Color meaning** - Use colors that align with your design system
4. **Don't overuse** - Too many separators can create visual clutter
5. **Consider context** - Match separator style to surrounding content
6. **Test accessibility** - Ensure separators don't confuse screen readers
7. **Mobile friendly** - Test spacing and visibility on small screens