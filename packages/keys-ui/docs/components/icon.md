# Icon Component

Flexible icon system supporting Heroicons and custom SVG icons with size variants and fallback handling.

## Basic Usage

```blade
{{-- Basic Heroicon --}}
<x-keys::icon name="heroicon-o-star" />

{{-- Icon with size --}}
<x-keys::icon name="heroicon-o-heart" size="lg" />

{{-- Custom icon --}}
<x-keys::icon name="custom-logo" size="xl" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Icon name (Heroicon or custom) |
| `size` | string | `md` | Size: `xs`, `sm`, `md`, `lg`, `xl` |
| `fallback` | string | `heroicon-o-question-mark-circle` | Fallback icon if not found |

## Size Variants

```blade
<div class="flex items-center gap-4">
    <x-keys::icon name="heroicon-o-star" size="xs" />   {{-- 12px (3x3) --}}
    <x-keys::icon name="heroicon-o-star" size="sm" />   {{-- 16px (4x4) --}}
    <x-keys::icon name="heroicon-o-star" size="md" />   {{-- 20px (5x5) --}}
    <x-keys::icon name="heroicon-o-star" size="lg" />   {{-- 24px (6x6) --}}
    <x-keys::icon name="heroicon-o-star" size="xl" />   {{-- 32px (8x8) --}}
</div>
```

## Heroicons Support

The component supports all Heroicons with proper naming convention:

```blade
{{-- Outline icons --}}
<x-keys::icon name="heroicon-o-home" />
<x-keys::icon name="heroicon-o-user" />
<x-keys::icon name="heroicon-o-cog" />
<x-keys::icon name="heroicon-o-bell" />

{{-- Solid icons --}}
<x-keys::icon name="heroicon-s-heart" />
<x-keys::icon name="heroicon-s-star" />
<x-keys::icon name="heroicon-s-check-circle" />

{{-- Mini icons --}}
<x-keys::icon name="heroicon-m-plus" />
<x-keys::icon name="heroicon-m-minus" />
```

## Custom Icons

Place custom SVG icons in `resources/icons/` directory:

```blade
{{-- For resources/icons/logo.svg --}}
<x-keys::icon name="logo" size="lg" />

{{-- For resources/icons/brand/primary.svg --}}
<x-keys::icon name="brand/primary" size="xl" />
```

## Fallback Handling

```blade
{{-- If icon doesn't exist, shows fallback --}}
<x-keys::icon name="non-existent-icon" />

{{-- Custom fallback --}}
<x-keys::icon
    name="might-not-exist"
    fallback="heroicon-o-exclamation-triangle"
/>
```

## Use Cases

### Navigation Icons
```blade
<nav class="flex items-center gap-6">
    <a href="/dashboard" class="flex items-center gap-2">
        <x-keys::icon name="heroicon-o-home" size="sm" />
        <span>Dashboard</span>
    </a>

    <a href="/users" class="flex items-center gap-2">
        <x-keys::icon name="heroicon-o-users" size="sm" />
        <span>Users</span>
    </a>

    <a href="/settings" class="flex items-center gap-2">
        <x-keys::icon name="heroicon-o-cog-6-tooth" size="sm" />
        <span>Settings</span>
    </a>
</nav>
```

### Button Icons
```blade
<div class="flex gap-2">
    <x-keys::button variant="brand">
        <x-keys::icon name="heroicon-o-plus" size="sm" class="mr-2" />
        Add Item
    </x-keys::button>

    <x-keys::button variant="ghost">
        <x-keys::icon name="heroicon-o-pencil" size="sm" class="mr-2" />
        Edit
    </x-keys::button>

    <x-keys::button variant="danger">
        <x-keys::icon name="heroicon-o-trash" size="sm" class="mr-2" />
        Delete
    </x-keys::button>
</div>
```

### Status Indicators
```blade
<div class="space-y-2">
    <div class="flex items-center gap-2">
        <x-keys::icon name="heroicon-o-check-circle" size="sm" class="text-success-500" />
        <span>Process completed successfully</span>
    </div>

    <div class="flex items-center gap-2">
        <x-keys::icon name="heroicon-o-exclamation-triangle" size="sm" class="text-warning-500" />
        <span>Warning: Review required</span>
    </div>

    <div class="flex items-center gap-2">
        <x-keys::icon name="heroicon-o-x-circle" size="sm" class="text-danger-500" />
        <span>Operation failed</span>
    </div>
</div>
```

### Card Headers
```blade
<x-keys::card variant="bordered">
    <div class="p-6">
        <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <x-keys::icon name="heroicon-o-chart-bar" size="md" class="text-brand-600" />
            </div>
            <div>
                <h3 class="font-semibold">Analytics</h3>
                <p class="text-sm text-neutral-600">Track your performance</p>
            </div>
        </div>
        <!-- Card content -->
    </div>
</x-keys::card>
```

### Form Field Icons
```blade
<div class="space-y-4">
    <div class="relative">
        <x-keys::input name="search" placeholder="Search..." class="pl-10" />
        <div class="absolute left-3 top-1/2 -translate-y-1/2">
            <x-keys::icon name="heroicon-o-magnifying-glass" size="sm" class="text-neutral-400" />
        </div>
    </div>

    <div class="relative">
        <x-keys::input name="email" type="email" placeholder="Email address" class="pl-10" />
        <div class="absolute left-3 top-1/2 -translate-y-1/2">
            <x-keys::icon name="heroicon-o-envelope" size="sm" class="text-neutral-400" />
        </div>
    </div>
</div>
```

### Loading States
```blade
<x-keys::button :loading="$isLoading">
    @if($isLoading)
        <x-keys::icon name="heroicon-o-arrow-path" size="sm" class="mr-2 animate-spin" />
        Processing...
    @else
        <x-keys::icon name="heroicon-o-check" size="sm" class="mr-2" />
        Complete
    @endif
</x-keys::button>
```

### Decorative Icons
```blade
<div class="text-center py-12">
    <div class="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
        <x-keys::icon name="heroicon-o-inbox" size="xl" class="text-neutral-400" />
    </div>
    <h3 class="text-lg font-semibold">No messages</h3>
    <p class="text-neutral-600">Your inbox is empty</p>
</div>
```

## CSS Styling

```blade
{{-- Colored icons --}}
<x-keys::icon name="heroicon-o-heart" class="text-red-500" />
<x-keys::icon name="heroicon-o-star" class="text-yellow-500" />

{{-- Icons with hover effects --}}
<button class="group">
    <x-keys::icon
        name="heroicon-o-heart"
        class="text-neutral-400 group-hover:text-red-500 transition-colors"
    />
</button>

{{-- Animated icons --}}
<x-keys::icon name="heroicon-o-arrow-path" class="animate-spin" />
<x-keys::icon name="heroicon-o-bell" class="animate-pulse" />
```

## Accessibility

- Icons are decorative by default (hidden from screen readers)
- Add meaningful alt text when icons convey information
- Use proper ARIA labels for interactive icons
- Ensure adequate color contrast

```blade
{{-- Decorative icon (default) --}}
<x-keys::icon name="heroicon-o-star" />

{{-- Informational icon --}}
<span class="flex items-center gap-2">
    <x-keys::icon name="heroicon-o-check-circle" aria-hidden="false" />
    <span class="sr-only">Success:</span>
    <span>Task completed</span>
</span>

{{-- Interactive icon --}}
<button aria-label="Add to favorites">
    <x-keys::icon name="heroicon-o-heart" />
</button>
```

## Performance

- Heroicons are included in the build and optimized
- Custom icons are loaded as needed
- SVG icons are cached by the browser
- Minimal runtime overhead

## Custom Icon Setup

1. **Add SVG files** to `resources/icons/`
2. **Use kebab-case naming** for consistency
3. **Optimize SVGs** before adding (remove unnecessary elements)
4. **Test fallback behavior** for missing icons

```
resources/
└── icons/
    ├── logo.svg
    ├── brand-icon.svg
    └── social/
        ├── twitter.svg
        └── github.svg
```

```blade
<x-keys::icon name="logo" />
<x-keys::icon name="brand-icon" />
<x-keys::icon name="social/twitter" />
<x-keys::icon name="social/github" />
```