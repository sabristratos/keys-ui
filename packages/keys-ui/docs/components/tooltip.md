# Tooltip Component

Floating tooltips with smart positioning, multiple triggers, and comprehensive accessibility support.

## Basic Usage

```blade
{{-- Simple tooltip --}}
<x-keys::tooltip target="#my-button">
    This is a helpful tooltip
</x-keys::tooltip>

<x-keys::button id="my-button">Hover me</x-keys::button>

{{-- Inline tooltip --}}
<span data-tooltip="This explains the feature">
    Feature name
    <x-keys::tooltip placement="top" color="dark">
        Detailed explanation of this feature
    </x-keys::tooltip>
</span>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `target` | string | `null` | CSS selector for target element |
| `placement` | string | `top` | Placement: `top`, `bottom`, `left`, `right` |
| `color` | string | `dark` | Color theme: `dark`, `light` |
| `size` | string | `md` | Size: `sm`, `md`, `lg` |
| `arrow` | boolean | `true` | Show arrow pointer |
| `trigger` | string | `hover` | Trigger: `hover`, `click`, `focus` |
| `delay` | integer | `100` | Show delay in milliseconds |
| `id` | string | auto | Custom tooltip ID |
| `disabled` | boolean | `false` | Disable tooltip |

## Placement Variants

```blade
{{-- Top placement (default) --}}
<x-keys::button id="top-btn">Top</x-keys::button>
<x-keys::tooltip target="#top-btn" placement="top">
    Tooltip appears above
</x-keys::tooltip>

{{-- Bottom placement --}}
<x-keys::button id="bottom-btn">Bottom</x-keys::button>
<x-keys::tooltip target="#bottom-btn" placement="bottom">
    Tooltip appears below
</x-keys::tooltip>

{{-- Left placement --}}
<x-keys::button id="left-btn">Left</x-keys::button>
<x-keys::tooltip target="#left-btn" placement="left">
    Tooltip appears to the left
</x-keys::tooltip>

{{-- Right placement --}}
<x-keys::button id="right-btn">Right</x-keys::button>
<x-keys::tooltip target="#right-btn" placement="right">
    Tooltip appears to the right
</x-keys::tooltip>
```

## Color Themes

```blade
{{-- Dark theme (default) --}}
<x-keys::button id="dark-btn">Dark Tooltip</x-keys::button>
<x-keys::tooltip target="#dark-btn" color="dark">
    Dark theme tooltip with white text
</x-keys::tooltip>

{{-- Light theme --}}
<x-keys::button id="light-btn">Light Tooltip</x-keys::button>
<x-keys::tooltip target="#light-btn" color="light">
    Light theme tooltip with dark text
</x-keys::tooltip>
```

## Size Variants

```blade
<div class="flex gap-4">
    <div>
        <x-keys::button id="small-btn">Small</x-keys::button>
        <x-keys::tooltip target="#small-btn" size="sm">
            Small tooltip
        </x-keys::tooltip>
    </div>

    <div>
        <x-keys::button id="medium-btn">Medium</x-keys::button>
        <x-keys::tooltip target="#medium-btn" size="md">
            Medium sized tooltip
        </x-keys::tooltip>
    </div>

    <div>
        <x-keys::button id="large-btn">Large</x-keys::button>
        <x-keys::tooltip target="#large-btn" size="lg">
            Large tooltip with more content
        </x-keys::tooltip>
    </div>
</div>
```

## Trigger Types

```blade
{{-- Hover trigger (default) --}}
<x-keys::button id="hover-btn">Hover me</x-keys::button>
<x-keys::tooltip target="#hover-btn" trigger="hover">
    Shown on hover
</x-keys::tooltip>

{{-- Click trigger --}}
<x-keys::button id="click-btn">Click me</x-keys::button>
<x-keys::tooltip target="#click-btn" trigger="click">
    Shown on click
</x-keys::tooltip>

{{-- Focus trigger --}}
<x-keys::input id="focus-input" placeholder="Focus me" />
<x-keys::tooltip target="#focus-input" trigger="focus">
    Shown when focused
</x-keys::tooltip>
```

## Custom Delays

```blade
{{-- Instant tooltip --}}
<x-keys::button id="instant-btn">Instant</x-keys::button>
<x-keys::tooltip target="#instant-btn" :delay="0">
    Shows immediately
</x-keys::tooltip>

{{-- Delayed tooltip --}}
<x-keys::button id="delayed-btn">Delayed</x-keys::button>
<x-keys::tooltip target="#delayed-btn" :delay="500">
    Shows after 500ms delay
</x-keys::tooltip>
```

## Use Cases

### Form Field Help
```blade
<div class="space-y-4">
    <div>
        <x-keys::label for="password">
            Password
            <span id="password-help" class="ml-1 text-neutral-400 cursor-help">?</span>
        </x-keys::label>
        <x-keys::input id="password" type="password" />
        <x-keys::tooltip target="#password-help" placement="right">
            Password must be at least 8 characters long and contain both letters and numbers
        </x-keys::tooltip>
    </div>

    <div>
        <x-keys::label for="username">
            Username
            <span id="username-help" class="ml-1 text-neutral-400 cursor-help">?</span>
        </x-keys::label>
        <x-keys::input id="username" />
        <x-keys::tooltip target="#username-help" placement="right">
            Username can only contain letters, numbers, and underscores
        </x-keys::tooltip>
    </div>
</div>
```

### Icon Explanations
```blade
<div class="flex items-center gap-4">
    <div class="flex items-center gap-2">
        <x-keys::icon id="verified-icon" name="heroicon-o-check-badge" class="text-success-500" />
        <span>Verified Account</span>
        <x-keys::tooltip target="#verified-icon" placement="top">
            This account has been verified by our team
        </x-keys::tooltip>
    </div>

    <div class="flex items-center gap-2">
        <x-keys::icon id="premium-icon" name="heroicon-o-star" class="text-yellow-500" />
        <span>Premium User</span>
        <x-keys::tooltip target="#premium-icon" placement="top">
            This user has a premium subscription
        </x-keys::tooltip>
    </div>
</div>
```

### Action Button Descriptions
```blade
<div class="flex gap-2">
    <x-keys::button id="edit-btn" variant="ghost" size="sm">
        <x-keys::icon name="heroicon-o-pencil" />
    </x-keys::button>
    <x-keys::tooltip target="#edit-btn" placement="top">
        Edit this item
    </x-keys::tooltip>

    <x-keys::button id="delete-btn" variant="ghost" size="sm">
        <x-keys::icon name="heroicon-o-trash" />
    </x-keys::button>
    <x-keys::tooltip target="#delete-btn" placement="top">
        Delete this item permanently
    </x-keys::tooltip>

    <x-keys::button id="share-btn" variant="ghost" size="sm">
        <x-keys::icon name="heroicon-o-share" />
    </x-keys::button>
    <x-keys::tooltip target="#share-btn" placement="top">
        Share with others
    </x-keys::tooltip>
</div>
```

### Status Indicators
```blade
<div class="space-y-3">
    <div class="flex items-center gap-2">
        <div id="online-status" class="w-3 h-3 bg-success-500 rounded-full"></div>
        <span>Online</span>
        <x-keys::tooltip target="#online-status" placement="right">
            User is currently online and available
        </x-keys::tooltip>
    </div>

    <div class="flex items-center gap-2">
        <div id="away-status" class="w-3 h-3 bg-warning-500 rounded-full"></div>
        <span>Away</span>
        <x-keys::tooltip target="#away-status" placement="right">
            User is away and may not respond immediately
        </x-keys::tooltip>
    </div>

    <div class="flex items-center gap-2">
        <div id="offline-status" class="w-3 h-3 bg-neutral-400 rounded-full"></div>
        <span>Offline</span>
        <x-keys::tooltip target="#offline-status" placement="right">
            User is offline and will not receive messages
        </x-keys::tooltip>
    </div>
</div>
```

### Dashboard Metrics
```blade
<div class="grid grid-cols-3 gap-6">
    <x-keys::card variant="padded">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-neutral-600">Total Sales</p>
                <p id="sales-amount" class="text-2xl font-bold">$12,345</p>
            </div>
            <x-keys::icon name="heroicon-o-currency-dollar" class="text-green-500" />
        </div>
        <x-keys::tooltip target="#sales-amount" placement="top">
            Total sales for the current month
        </x-keys::tooltip>
    </x-keys::card>

    <x-keys::card variant="padded">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-neutral-600">Active Users</p>
                <p id="user-count" class="text-2xl font-bold">1,234</p>
            </div>
            <x-keys::icon name="heroicon-o-users" class="text-blue-500" />
        </div>
        <x-keys::tooltip target="#user-count" placement="top">
            Users who have been active in the last 30 days
        </x-keys::tooltip>
    </x-keys::card>
</div>
```

### Feature Flags
```blade
<div class="space-y-4">
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <span>Advanced Analytics</span>
            <span id="beta-flag" class="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded">BETA</span>
        </div>
        <x-keys::toggle name="analytics" />
        <x-keys::tooltip target="#beta-flag" placement="left">
            This feature is currently in beta testing
        </x-keys::tooltip>
    </div>

    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <span>Real-time Sync</span>
            <span id="new-flag" class="text-xs bg-success-100 text-success-700 px-2 py-1 rounded">NEW</span>
        </div>
        <x-keys::toggle name="sync" />
        <x-keys::tooltip target="#new-flag" placement="left">
            Newly released feature - sync data in real-time
        </x-keys::tooltip>
    </div>
</div>
```

### Complex Content Tooltips
```blade
<div class="flex items-center gap-2">
    <span>Server Status</span>
    <span id="server-info" class="text-neutral-400 cursor-help">ℹ</span>
    <x-keys::tooltip target="#server-info" placement="bottom" size="lg">
        <div class="space-y-2">
            <div class="font-semibold">Server Information</div>
            <div class="text-xs space-y-1">
                <div>Region: US-East-1</div>
                <div>Uptime: 99.9%</div>
                <div>Last restart: 2 days ago</div>
                <div>Memory usage: 45%</div>
            </div>
        </div>
    </x-keys::tooltip>
</div>
```

## Accessibility

- Proper ARIA attributes for screen readers
- Keyboard navigation support
- Focus management for interactive tooltips
- High contrast mode support
- Respects prefers-reduced-motion

```blade
{{-- Accessible tooltip with proper ARIA --}}
<x-keys::button
    id="accessible-btn"
    aria-describedby="tooltip-accessible"
>
    Accessible Button
</x-keys::button>

<x-keys::tooltip
    target="#accessible-btn"
    id="tooltip-accessible"
    placement="top"
>
    This tooltip is properly associated with the button for screen readers
</x-keys::tooltip>
```

## Data Attributes

```html
<div
    data-tooltip="true"
    data-placement="top"
    data-trigger="hover"
    data-delay="100"
    data-color="dark"
    data-size="md"
    role="tooltip"
    id="tooltip-unique-id"
>
```

## JavaScript Integration

```javascript
// Programmatically show/hide tooltips
const tooltip = document.getElementById('my-tooltip');

// Show tooltip
tooltip.style.display = 'block';
tooltip.setAttribute('data-show', 'true');

// Hide tooltip
tooltip.style.display = 'none';
tooltip.removeAttribute('data-show');

// Toggle tooltip
function toggleTooltip(tooltipId) {
    const tooltip = document.getElementById(tooltipId);
    const isVisible = tooltip.hasAttribute('data-show');

    if (isVisible) {
        tooltip.style.display = 'none';
        tooltip.removeAttribute('data-show');
    } else {
        tooltip.style.display = 'block';
        tooltip.setAttribute('data-show', 'true');
    }
}
```

## CSS Customization

```css
/* Custom tooltip styling */
[data-tooltip="true"] {
    border-radius: 0.375rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    max-width: 200px;
    z-index: 9999;
}

/* Dark theme customization */
[data-tooltip="true"][data-color="dark"] {
    background: rgba(0, 0, 0, 0.9);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Light theme customization */
[data-tooltip="true"][data-color="light"] {
    background: white;
    color: var(--color-foreground);
    border: 1px solid var(--color-border);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Size variants */
[data-tooltip="true"][data-size="sm"] {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}

[data-tooltip="true"][data-size="lg"] {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    max-width: 300px;
}

/* Animation */
[data-tooltip="true"] {
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 0.2s ease, transform 0.2s ease;
}

[data-tooltip="true"][data-show="true"] {
    opacity: 1;
    transform: scale(1);
}
```

## Best Practices

1. **Keep content concise** - Tooltips should be brief and helpful
2. **Use appropriate triggers** - Hover for info, click for actions
3. **Position intelligently** - Avoid covering important content
4. **Test on mobile** - Consider touch interactions
5. **Ensure accessibility** - Proper ARIA attributes and keyboard support
6. **Respect motion preferences** - Handle prefers-reduced-motion
7. **Don't overuse** - Only for truly helpful information