# Breadcrumbs Component

Navigation trails showing the user's current location in the site hierarchy with responsive mobile handling.

## Basic Usage

```blade
{{-- Simple breadcrumbs --}}
<x-keys::breadcrumbs>
    <li class="flex items-center">
        <a href="/" class="text-neutral-600 hover:text-neutral-900">Home</a>
        <span class="mx-2 text-neutral-400">/</span>
    </li>
    <li class="flex items-center">
        <a href="/products" class="text-neutral-600 hover:text-neutral-900">Products</a>
        <span class="mx-2 text-neutral-400">/</span>
    </li>
    <li class="text-neutral-900 font-medium">Laptops</li>
</x-keys::breadcrumbs>

{{-- With icons --}}
<x-keys::breadcrumbs>
    <li class="flex items-center">
        <a href="/" class="flex items-center gap-1 text-neutral-600 hover:text-neutral-900">
            <x-keys::icon name="heroicon-o-home" size="xs" />
            Home
        </a>
        <x-keys::icon name="heroicon-o-chevron-right" size="xs" class="mx-2 text-neutral-400" />
    </li>
    <li class="flex items-center">
        <a href="/dashboard" class="text-neutral-600 hover:text-neutral-900">Dashboard</a>
        <x-keys::icon name="heroicon-o-chevron-right" size="xs" class="mx-2 text-neutral-400" />
    </li>
    <li class="text-neutral-900 font-medium">Settings</li>
</x-keys::breadcrumbs>
```

## Component Structure

The breadcrumbs component provides a semantic navigation structure:

- **Outer container**: Overflow handling and text sizing
- **Navigation element**: Semantic `<nav>` with proper ARIA label
- **Ordered list**: Maintains hierarchy order for accessibility
- **Responsive design**: Mobile-optimized with automatic truncation

## Use Cases

### E-commerce Product Navigation
```blade
<x-keys::breadcrumbs>
    <li class="flex items-center">
        <a href="/" class="text-neutral-600 hover:text-neutral-900">Home</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
    </li>
    <li class="flex items-center">
        <a href="/categories" class="text-neutral-600 hover:text-neutral-900">Categories</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
    </li>
    <li class="flex items-center">
        <a href="/categories/electronics" class="text-neutral-600 hover:text-neutral-900">Electronics</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
    </li>
    <li class="flex items-center">
        <a href="/categories/electronics/laptops" class="text-neutral-600 hover:text-neutral-900">Laptops</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
    </li>
    <li class="text-neutral-900 font-medium" aria-current="page">MacBook Pro 16"</li>
</x-keys::breadcrumbs>
```

### Admin Dashboard Navigation
```blade
<x-keys::breadcrumbs>
    <li class="flex items-center">
        <a href="/admin" class="flex items-center gap-1 text-neutral-600 hover:text-neutral-900">
            <x-keys::icon name="heroicon-o-squares-2x2" size="xs" />
            Dashboard
        </a>
        <x-keys::icon name="heroicon-o-chevron-right" size="xs" class="mx-2 text-neutral-400" aria-hidden="true" />
    </li>
    <li class="flex items-center">
        <a href="/admin/users" class="text-neutral-600 hover:text-neutral-900">Users</a>
        <x-keys::icon name="heroicon-o-chevron-right" size="xs" class="mx-2 text-neutral-400" aria-hidden="true" />
    </li>
    <li class="text-neutral-900 font-medium" aria-current="page">John Doe</li>
</x-keys::breadcrumbs>
```

### Documentation Site Navigation
```blade
<x-keys::breadcrumbs>
    <li class="flex items-center">
        <a href="/docs" class="flex items-center gap-1 text-neutral-600 hover:text-neutral-900">
            <x-keys::icon name="heroicon-o-book-open" size="xs" />
            Documentation
        </a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">›</span>
    </li>
    <li class="flex items-center">
        <a href="/docs/components" class="text-neutral-600 hover:text-neutral-900">Components</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">›</span>
    </li>
    <li class="flex items-center">
        <a href="/docs/components/forms" class="text-neutral-600 hover:text-neutral-900">Form Components</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">›</span>
    </li>
    <li class="text-neutral-900 font-medium" aria-current="page">Input</li>
</x-keys::breadcrumbs>
```

### Multi-level Application Navigation
```blade
<x-keys::breadcrumbs>
    <li class="flex items-center">
        <a href="/projects" class="text-neutral-600 hover:text-neutral-900">Projects</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
    </li>
    <li class="flex items-center">
        <a href="/projects/website-redesign" class="text-neutral-600 hover:text-neutral-900">Website Redesign</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
    </li>
    <li class="flex items-center">
        <a href="/projects/website-redesign/tasks" class="text-neutral-600 hover:text-neutral-900">Tasks</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
    </li>
    <li class="text-neutral-900 font-medium" aria-current="page">Homepage Layout</li>
</x-keys::breadcrumbs>
```

### Laravel Route-based Breadcrumbs
```blade
{{-- Using Laravel route names for navigation --}}
<x-keys::breadcrumbs>
    @if(!request()->routeIs('home'))
        <li class="flex items-center">
            <a href="{{ route('home') }}" class="text-neutral-600 hover:text-neutral-900">Home</a>
            <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
        </li>
    @endif

    @if(request()->routeIs('products.*'))
        <li class="flex items-center">
            <a href="{{ route('products.index') }}" class="text-neutral-600 hover:text-neutral-900">Products</a>
            @if(!request()->routeIs('products.index'))
                <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
            @endif
        </li>
    @endif

    @if(request()->routeIs('products.show'))
        <li class="text-neutral-900 font-medium" aria-current="page">{{ $product->name }}</li>
    @endif
</x-keys::breadcrumbs>
```

## Mobile Responsive Features

The breadcrumbs component includes built-in mobile optimization:

### Automatic Truncation
On screens smaller than 640px:
- Only shows first, second-to-last, and last breadcrumb items
- Hidden items are replaced with "..." indicator
- Maintains navigation context while saving space

### Mobile Styling Example
```blade
{{-- Desktop: Home / Products / Electronics / Laptops / MacBook Pro --}}
{{-- Mobile: Home ... Laptops / MacBook Pro --}}

<x-keys::breadcrumbs>
    <li class="flex items-center">
        <a href="/">Home</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
    </li>
    <li class="flex items-center">
        <a href="/products">Products</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
    </li>
    <li class="flex items-center">
        <a href="/electronics">Electronics</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
    </li>
    <li class="flex items-center">
        <a href="/laptops">Laptops</a>
        <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
    </li>
    <li class="text-neutral-900 font-medium">MacBook Pro</li>
</x-keys::breadcrumbs>
```

## Accessibility

- **Semantic Navigation**: Uses proper `<nav>` element with ARIA label
- **Current Page Indicator**: `aria-current="page"` on active item
- **Screen Reader Support**: Separators marked with `aria-hidden="true"`
- **Keyboard Navigation**: All links are keyboard accessible
- **High Contrast**: Proper color contrast ratios maintained

## Laravel Integration

### Blade Helper for Dynamic Breadcrumbs
```php
// In your controller or view composer
$breadcrumbs = [
    ['url' => route('home'), 'title' => 'Home'],
    ['url' => route('products.index'), 'title' => 'Products'],
    ['url' => null, 'title' => $product->name], // Current page
];
```

```blade
<x-keys::breadcrumbs>
    @foreach($breadcrumbs as $index => $crumb)
        <li class="flex items-center">
            @if($crumb['url'])
                <a href="{{ $crumb['url'] }}" class="text-neutral-600 hover:text-neutral-900">
                    {{ $crumb['title'] }}
                </a>
                @if($index < count($breadcrumbs) - 1)
                    <span class="mx-2 text-neutral-400" aria-hidden="true">/</span>
                @endif
            @else
                <span class="text-neutral-900 font-medium" aria-current="page">
                    {{ $crumb['title'] }}
                </span>
            @endif
        </li>
    @endforeach
</x-keys::breadcrumbs>
```

## Data Attributes

```html
<div data-breadcrumb-container="true">
    <nav aria-label="Breadcrumb">
        <ol><!-- breadcrumb items --></ol>
    </nav>
</div>
```

## CSS Customization

The component includes comprehensive responsive styles:

```css
/* Custom separator styling */
[data-breadcrumb-container] .separator {
    color: var(--color-neutral-400);
    user-select: none;
}

/* Custom link hover effects */
[data-breadcrumb-container] a:hover {
    color: var(--color-brand);
    text-decoration: underline;
}

/* Custom current page styling */
[data-breadcrumb-container] [aria-current="page"] {
    color: var(--color-foreground);
    font-weight: 600;
}

/* Custom mobile truncation */
@media (max-width: 640px) {
    [data-breadcrumb-container] .mobile-hidden {
        display: none;
    }
}
```

## Best Practices

1. **Use semantic HTML** - Proper nav and ol elements for structure
2. **Mark separators** - Use `aria-hidden="true"` on decorative elements
3. **Current page indicator** - Always use `aria-current="page"` on current item
4. **Keep hierarchy clear** - Maintain logical parent-child relationships
5. **Limit depth** - Avoid more than 5-6 levels for usability
6. **Test mobile** - Ensure truncation works properly on small screens
7. **Consider performance** - Don't generate unnecessary breadcrumb data