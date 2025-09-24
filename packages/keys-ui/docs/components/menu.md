# Menu Component

A flexible menu component for navigation interfaces with accessibility support and keyboard navigation.

## Basic Usage

```blade
{{-- Simple menu --}}
<x-keys::menu>
    <a href="/dashboard" class="px-3 py-2 rounded hover:bg-neutral-100">Dashboard</a>
    <a href="/profile" class="px-3 py-2 rounded hover:bg-neutral-100">Profile</a>
    <a href="/settings" class="px-3 py-2 rounded hover:bg-neutral-100">Settings</a>
</x-keys::menu>

{{-- Menu with custom ID and ARIA label --}}
<x-keys::menu id="main-menu" aria-label="Main navigation">
    <a href="/" class="menu-item">Home</a>
    <a href="/about" class="menu-item">About</a>
    <a href="/contact" class="menu-item">Contact</a>
</x-keys::menu>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | auto | Menu identifier (auto-generated if not provided) |
| `role` | string | `menu` | ARIA role: `menu`, `listbox`, `group` |
| `aria-label` | string | `null` | Accessible label for the menu |
| `aria-labelledby` | string | `null` | ID of element that labels the menu |

## Role Variants

```blade
{{-- Navigation menu (default) --}}
<x-keys::menu role="menu" aria-label="Main navigation">
    <a href="/dashboard">Dashboard</a>
    <a href="/reports">Reports</a>
    <a href="/settings">Settings</a>
</x-keys::menu>

{{-- List selection menu --}}
<x-keys::menu role="listbox" aria-label="Select option">
    <button role="option" aria-selected="false">Option 1</button>
    <button role="option" aria-selected="true">Option 2</button>
    <button role="option" aria-selected="false">Option 3</button>
</x-keys::menu>

{{-- Grouped menu items --}}
<x-keys::menu role="group" aria-labelledby="group-label">
    <h3 id="group-label" class="font-semibold text-sm text-neutral-600 px-3 py-1">User Actions</h3>
    <button class="menu-item">Edit Profile</button>
    <button class="menu-item">Change Password</button>
    <button class="menu-item">Log Out</button>
</x-keys::menu>
```

## Use Cases

### Sidebar Navigation
```blade
<aside class="w-64 bg-surface border-r border-border">
    <div class="p-4">
        <h2 class="font-semibold text-lg mb-4">Navigation</h2>

        <x-keys::menu aria-label="Sidebar navigation">
            <a href="/dashboard" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-neutral-100 {{ request()->is('dashboard') ? 'bg-brand-50 text-brand-700' : '' }}">
                <x-keys::icon name="heroicon-o-home" size="sm" />
                Dashboard
            </a>

            <a href="/projects" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-neutral-100 {{ request()->is('projects*') ? 'bg-brand-50 text-brand-700' : '' }}">
                <x-keys::icon name="heroicon-o-folder" size="sm" />
                Projects
            </a>

            <a href="/team" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-neutral-100 {{ request()->is('team*') ? 'bg-brand-50 text-brand-700' : '' }}">
                <x-keys::icon name="heroicon-o-users" size="sm" />
                Team
            </a>

            <a href="/settings" class="flex items-center gap-3 px-3 py-2 rounded hover:bg-neutral-100 {{ request()->is('settings*') ? 'bg-brand-50 text-brand-700' : '' }}">
                <x-keys::icon name="heroicon-o-cog-6-tooth" size="sm" />
                Settings
            </a>
        </x-keys::menu>
    </div>
</aside>
```

### Context Menu
```blade
<x-keys::menu id="context-menu" role="menu" aria-label="Context actions">
    <button class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 w-full text-left">
        <x-keys::icon name="heroicon-o-pencil" size="xs" />
        Edit
    </button>

    <button class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 w-full text-left">
        <x-keys::icon name="heroicon-o-document-duplicate" size="xs" />
        Duplicate
    </button>

    <button class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 w-full text-left">
        <x-keys::icon name="heroicon-o-share" size="xs" />
        Share
    </button>

    <div class="border-t border-neutral-200 my-1"></div>

    <button class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-100 text-red-700 w-full text-left">
        <x-keys::icon name="heroicon-o-trash" size="xs" />
        Delete
    </button>
</x-keys::menu>
```

### Application Menu Bar
```blade
<header class="bg-surface border-b border-border">
    <div class="flex items-center px-4 py-2">
        <div class="font-bold text-lg mr-8">MyApp</div>

        <x-keys::menu role="menubar" aria-label="Application menu">
            <button class="px-3 py-2 hover:bg-neutral-100 rounded" onclick="toggleSubmenu('file-menu')">
                File
            </button>

            <button class="px-3 py-2 hover:bg-neutral-100 rounded" onclick="toggleSubmenu('edit-menu')">
                Edit
            </button>

            <button class="px-3 py-2 hover:bg-neutral-100 rounded" onclick="toggleSubmenu('view-menu')">
                View
            </button>

            <button class="px-3 py-2 hover:bg-neutral-100 rounded" onclick="toggleSubmenu('help-menu')">
                Help
            </button>
        </x-keys::menu>
    </div>
</header>
```

### Mobile Navigation
```blade
<x-keys::menu aria-label="Mobile navigation" class="mobile-menu">
    <a href="/" class="block px-4 py-3 border-b border-neutral-200 hover:bg-neutral-50">
        Home
    </a>

    <a href="/products" class="block px-4 py-3 border-b border-neutral-200 hover:bg-neutral-50">
        Products
    </a>

    <a href="/services" class="block px-4 py-3 border-b border-neutral-200 hover:bg-neutral-50">
        Services
    </a>

    <a href="/about" class="block px-4 py-3 border-b border-neutral-200 hover:bg-neutral-50">
        About
    </a>

    <a href="/contact" class="block px-4 py-3 hover:bg-neutral-50">
        Contact
    </a>
</x-keys::menu>
```

## Accessibility

- **ARIA Support**: Proper roles and labels for screen readers
- **Keyboard Navigation**: Arrow key navigation between menu items
- **Focus Management**: Logical tab order and focus indicators
- **Screen Reader**: Announces menu structure and current selection
- **High Contrast**: Works with high contrast mode

## Data Attributes

```html
<div
    data-menu="true"
    data-menu-id="menu-unique-id"
    role="menu"
    tabindex="-1"
    aria-label="Menu label"
>
```

## JavaScript Integration

```javascript
// Focus management for keyboard navigation
document.addEventListener('keydown', function(event) {
    const menu = event.target.closest('[data-menu="true"]');
    if (!menu) return;

    const items = menu.querySelectorAll('a, button');
    const currentIndex = Array.from(items).indexOf(event.target);

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % items.length;
            items[nextIndex].focus();
            break;

        case 'ArrowUp':
            event.preventDefault();
            const prevIndex = (currentIndex - 1 + items.length) % items.length;
            items[prevIndex].focus();
            break;

        case 'Home':
            event.preventDefault();
            items[0].focus();
            break;

        case 'End':
            event.preventDefault();
            items[items.length - 1].focus();
            break;
    }
});
```

## CSS Customization

```css
/* Custom menu styling */
[data-menu="true"] {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 0.5rem;
}

/* Menu item hover states */
[data-menu="true"] a:hover,
[data-menu="true"] button:hover {
    background: var(--color-neutral-100);
    color: var(--color-neutral-900);
}

/* Active menu item */
[data-menu="true"] [aria-current="page"] {
    background: var(--color-brand-50);
    color: var(--color-brand-700);
    font-weight: 500;
}

/* Disabled menu items */
[data-menu="true"] [disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}
```

## Best Practices

1. **Use semantic HTML** - Proper anchor tags for navigation, buttons for actions
2. **Provide ARIA labels** - Ensure screen readers can understand menu purpose
3. **Implement keyboard navigation** - Support arrow keys and Home/End
4. **Clear visual states** - Show hover, focus, and active states
5. **Logical grouping** - Group related menu items together
6. **Mobile consideration** - Ensure touch-friendly sizes on mobile devices
7. **Test accessibility** - Verify with screen readers and keyboard-only navigation