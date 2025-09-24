# Badge Component

Status indicators and tags with auto icon-only detection functionality and comprehensive styling options.

## Basic Usage

```blade
{{-- Simple badges --}}
<x-keys::badge>Default</x-keys::badge>
<x-keys::badge color="success">Success</x-keys::badge>
<x-keys::badge color="warning">Warning</x-keys::badge>
<x-keys::badge color="danger">Danger</x-keys::badge>

{{-- Auto icon-only badges (no icon-only prop needed) --}}
<x-keys::badge icon="heroicon-o-check" color="success" />
<x-keys::badge icon="heroicon-o-x-mark" color="danger" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `simple` | Variant: `simple`, `chip` |
| `color` | string | `neutral` | Color: semantic colors or specific colors |
| `size` | string | `sm` | Size: `xs`, `sm`, `md` |
| `icon` | string | `null` | Heroicon name for icon display |
| `dismissible` | boolean | `false` | Enable dismissible functionality (auto-enables chip variant) |
| `id` | string | auto | Custom ID (auto-generated for dismissible badges) |

## Auto Icon-Only Detection

The Badge component automatically detects when only an icon should be displayed, following the Button component pattern:

```blade
{{-- These automatically become icon-only --}}
<x-keys::badge icon="heroicon-o-star" color="yellow" />
<x-keys::badge icon="heroicon-o-check-circle" color="success" />
<x-keys::badge icon="heroicon-o-exclamation-triangle" color="warning" />

{{-- This shows both icon and text --}}
<x-keys::badge icon="heroicon-o-star" color="yellow">Featured</x-keys::badge>
```

## Variants

### Simple Badges (Default)
```blade
<x-keys::badge>Default</x-keys::badge>
<x-keys::badge color="brand">Brand</x-keys::badge>
<x-keys::badge color="success">Active</x-keys::badge>
<x-keys::badge color="warning">Pending</x-keys::badge>
<x-keys::badge color="danger">Error</x-keys::badge>
```

### Chip Badges
```blade
{{-- Manual chip variant --}}
<x-keys::badge variant="chip" color="blue">React</x-keys::badge>
<x-keys::badge variant="chip" color="green">Vue.js</x-keys::badge>

{{-- Auto chip variant (when dismissible=true) --}}
<x-keys::badge color="purple" dismissible>Laravel</x-keys::badge>
<x-keys::badge color="orange" dismissible>TypeScript</x-keys::badge>
```

## Color Options

### Semantic Colors
```blade
<x-keys::badge color="brand">Brand</x-keys::badge>
<x-keys::badge color="success">Success</x-keys::badge>
<x-keys::badge color="warning">Warning</x-keys::badge>
<x-keys::badge color="danger">Danger</x-keys::badge>
<x-keys::badge color="neutral">Neutral</x-keys::badge>
```

### Specific Colors
```blade
<x-keys::badge color="blue">Blue</x-keys::badge>
<x-keys::badge color="green">Green</x-keys::badge>
<x-keys::badge color="yellow">Yellow</x-keys::badge>
<x-keys::badge color="red">Red</x-keys::badge>
<x-keys::badge color="purple">Purple</x-keys::badge>
<x-keys::badge color="pink">Pink</x-keys::badge>
<x-keys::badge color="indigo">Indigo</x-keys::badge>
<x-keys::badge color="gray">Gray</x-keys::badge>
```

## Size Variants

```blade
<x-keys::badge size="xs">Extra Small</x-keys::badge>
<x-keys::badge size="sm">Small</x-keys::badge>
<x-keys::badge size="md">Medium</x-keys::badge>
```

## Icon Integration

### Icons with Text
```blade
<x-keys::badge icon="heroicon-o-star" color="yellow">Featured</x-keys::badge>
<x-keys::badge icon="heroicon-o-check-circle" color="success">Verified</x-keys::badge>
<x-keys::badge icon="heroicon-o-clock" color="warning">Pending</x-keys::badge>
<x-keys::badge icon="heroicon-o-fire" color="red">Hot</x-keys::badge>
```

### Icon-Only Badges
```blade
{{-- Status indicators --}}
<x-keys::badge icon="heroicon-o-check" color="success" />
<x-keys::badge icon="heroicon-o-x-mark" color="danger" />
<x-keys::badge icon="heroicon-o-minus" color="warning" />

{{-- Action indicators --}}
<x-keys::badge icon="heroicon-o-plus" color="brand" size="xs" />
<x-keys::badge icon="heroicon-o-pencil" color="blue" size="xs" />
<x-keys::badge icon="heroicon-o-trash" color="red" size="xs" />
```

## Dismissible Badges

When `dismissible` is true, the badge automatically becomes a chip variant:

```blade
{{-- Tag system --}}
<div class="flex flex-wrap gap-2">
    <x-keys::badge color="blue" dismissible>React</x-keys::badge>
    <x-keys::badge color="green" dismissible>Vue.js</x-keys::badge>
    <x-keys::badge color="purple" dismissible>Laravel</x-keys::badge>
    <x-keys::badge color="orange" dismissible>TypeScript</x-keys::badge>
</div>

{{-- Filter chips --}}
<div class="flex flex-wrap gap-2">
    <x-keys::badge color="brand" dismissible>Category: Tech</x-keys::badge>
    <x-keys::badge color="success" dismissible>Status: Active</x-keys::badge>
    <x-keys::badge color="purple" dismissible>Price: $0-50</x-keys::badge>
</div>
```

## Use Cases

### Status Indicators
```blade
<div class="flex items-center gap-2">
    <span>Server Status:</span>
    <x-keys::badge icon="heroicon-o-check-circle" color="success">Online</x-keys::badge>
</div>

<div class="flex items-center gap-2">
    <span>Build:</span>
    <x-keys::badge icon="heroicon-o-x-circle" color="danger">Failed</x-keys::badge>
</div>

<div class="flex items-center gap-2">
    <span>Deploy:</span>
    <x-keys::badge icon="heroicon-o-clock" color="warning">In Progress</x-keys::badge>
</div>
```

### Content Tags
```blade
<article class="space-y-4">
    <div class="flex flex-wrap gap-2">
        <x-keys::badge color="blue">Technology</x-keys::badge>
        <x-keys::badge color="green">Web Development</x-keys::badge>
        <x-keys::badge color="purple">Laravel</x-keys::badge>
    </div>

    <h1>Building Modern Web Applications</h1>
    <p>Article content...</p>
</article>
```

### User Permissions
```blade
<div class="flex items-center gap-3">
    <img src="avatar.jpg" alt="User" class="w-8 h-8 rounded-full">
    <span>John Doe</span>
    <x-keys::badge color="brand" size="xs">Admin</x-keys::badge>
    <x-keys::badge icon="heroicon-o-check-badge" color="success" />
</div>
```

### Notification Counts
```blade
<div class="relative">
    <x-keys::button icon="heroicon-o-bell" variant="ghost" />
    <x-keys::badge
        color="danger"
        size="xs"
        class="absolute -top-1 -right-1"
    >3</x-keys::badge>
</div>

<div class="relative">
    <x-keys::button icon="heroicon-o-envelope" variant="ghost" />
    <x-keys::badge
        icon="heroicon-o-exclamation"
        color="warning"
        size="xs"
        class="absolute -top-1 -right-1"
    />
</div>
```

### Filter Interface
```blade
<div class="space-y-4">
    <h3>Active Filters:</h3>
    <div class="flex flex-wrap gap-2">
        <x-keys::badge color="brand" dismissible id="filter-category">
            Category: Technology
        </x-keys::badge>
        <x-keys::badge color="success" dismissible id="filter-status">
            Status: Published
        </x-keys::badge>
        <x-keys::badge color="purple" dismissible id="filter-author">
            Author: John Doe
        </x-keys::badge>
    </div>
</div>
```

### Product Features
```blade
<div class="product-card">
    <div class="flex justify-between items-start mb-2">
        <h3>Premium Plan</h3>
        <x-keys::badge icon="heroicon-o-star" color="yellow">Popular</x-keys::badge>
    </div>

    <div class="flex flex-wrap gap-1 mt-4">
        <x-keys::badge size="xs" color="green">SSL</x-keys::badge>
        <x-keys::badge size="xs" color="blue">CDN</x-keys::badge>
        <x-keys::badge size="xs" color="purple">API</x-keys::badge>
        <x-keys::badge size="xs" color="orange">Analytics</x-keys::badge>
    </div>
</div>
```

## Form Integration

### Livewire Tag Management
```blade
<div>
    {{-- Add new tag --}}
    <div class="flex gap-2 mb-4">
        <x-keys::input
            wire:model="newTag"
            placeholder="Add tag..."
            wire:keydown.enter="addTag"
        />
        <x-keys::button wire:click="addTag">Add</x-keys::button>
    </div>

    {{-- Display tags --}}
    <div class="flex flex-wrap gap-2">
        @foreach($tags as $index => $tag)
            <x-keys::badge
                color="brand"
                dismissible
                wire:click="removeTag({{ $index }})"
            >{{ $tag }}</x-keys::badge>
        @endforeach
    </div>
</div>
```

## Accessibility

- Proper ARIA labels for dismissible badges
- Keyboard navigation support for interactive badges
- Screen reader announcements for status changes
- High contrast mode support
- Focus management for dismissible actions

## Data Attributes

```html
<span
    data-keys-badge="true"
    data-variant="chip"
    data-color="success"
    data-size="sm"
    data-dismissible="true"
    data-has-icon="true"
>
```

## JavaScript Integration

```javascript
// Target dismissible badges
document.querySelectorAll('[data-keys-badge][data-dismissible="true"]')

// Handle dismiss events
badge.addEventListener('click', function(e) {
    if (this.dataset.dismissible === 'true') {
        this.remove();

        // Custom event
        document.dispatchEvent(new CustomEvent('badge:dismissed', {
            detail: { id: this.id, value: this.textContent }
        }));
    }
});

// Listen for badge events
document.addEventListener('badge:dismissed', function(event) {
    console.log('Badge dismissed:', event.detail);
    // Update filters, tags, etc.
});
```

## CSS Customization

```css
/* Custom badge hover effects */
[data-keys-badge][data-dismissible="true"]:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Custom color variants */
[data-keys-badge][data-color="custom"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

/* Icon-only styling */
[data-keys-badge][data-icon-only="true"] {
    border-radius: 50%;
    padding: 0.25rem;
}

/* Pulse animation for notifications */
[data-keys-badge].pulse {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

## Dark Mode Support

All badge variants automatically support dark mode with proper contrast ratios and color adjustments using the Tailwind v4 dark mode features and CSS custom properties.