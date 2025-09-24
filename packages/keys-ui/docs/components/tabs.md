# Tabs Component

Tabbed interfaces for content organization with animated markers, orientation options, and accessibility support.

## Basic Usage

```blade
{{-- Simple horizontal tabs --}}
<x-keys::tabs>
    <x-keys::tab value="overview" default>Overview</x-keys::tab>
    <x-keys::tab value="details">Details</x-keys::tab>
    <x-keys::tab value="reviews">Reviews</x-keys::tab>

    <x-slot:panels>
        <x-keys::tab-panel value="overview">
            <h3 class="font-semibold mb-2">Product Overview</h3>
            <p>General information about the product...</p>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="details">
            <h3 class="font-semibold mb-2">Technical Details</h3>
            <p>Detailed specifications and features...</p>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="reviews">
            <h3 class="font-semibold mb-2">Customer Reviews</h3>
            <p>What customers are saying...</p>
        </x-keys::tab-panel>
    </x-slot:panels>
</x-keys::tabs>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | auto | Tabs container identifier |
| `orientation` | string | `horizontal` | Layout: `horizontal`, `vertical` |
| `variant` | string | `default` | Style: `default`, `underline`, `pills` |
| `size` | string | `md` | Size: `sm`, `md`, `lg` |
| `default-value` | string | `null` | Initially active tab |
| `value` | string | `null` | Currently active tab (controlled) |
| `disabled` | boolean | `false` | Disable entire tabs component |

## Orientation Variants

```blade
{{-- Horizontal tabs (default) --}}
<x-keys::tabs orientation="horizontal">
    <x-keys::tab value="tab1">Tab 1</x-keys::tab>
    <x-keys::tab value="tab2">Tab 2</x-keys::tab>
    <x-keys::tab value="tab3">Tab 3</x-keys::tab>

    <x-slot:panels>
        <x-keys::tab-panel value="tab1">Horizontal content 1</x-keys::tab-panel>
        <x-keys::tab-panel value="tab2">Horizontal content 2</x-keys::tab-panel>
        <x-keys::tab-panel value="tab3">Horizontal content 3</x-keys::tab-panel>
    </x-slot:panels>
</x-keys::tabs>

{{-- Vertical tabs --}}
<x-keys::tabs orientation="vertical">
    <x-keys::tab value="settings">Settings</x-keys::tab>
    <x-keys::tab value="profile">Profile</x-keys::tab>
    <x-keys::tab value="notifications">Notifications</x-keys::tab>

    <x-slot:panels>
        <x-keys::tab-panel value="settings">Settings panel content</x-keys::tab-panel>
        <x-keys::tab-panel value="profile">Profile panel content</x-keys::tab-panel>
        <x-keys::tab-panel value="notifications">Notifications panel content</x-keys::tab-panel>
    </x-slot:panels>
</x-keys::tabs>
```

## Style Variants

```blade
{{-- Default tabs with bottom border --}}
<x-keys::tabs variant="default">
    <x-keys::tab value="home">Home</x-keys::tab>
    <x-keys::tab value="about">About</x-keys::tab>
    <x-keys::tab value="contact">Contact</x-keys::tab>
</x-keys::tabs>

{{-- Underline style --}}
<x-keys::tabs variant="underline">
    <x-keys::tab value="dashboard">Dashboard</x-keys::tab>
    <x-keys::tab value="analytics">Analytics</x-keys::tab>
    <x-keys::tab value="reports">Reports</x-keys::tab>
</x-keys::tabs>

{{-- Pills style with background --}}
<x-keys::tabs variant="pills">
    <x-keys::tab value="current">Current</x-keys::tab>
    <x-keys::tab value="pending">Pending</x-keys::tab>
    <x-keys::tab value="completed">Completed</x-keys::tab>
</x-keys::tabs>
```

## Size Variants

```blade
<div class="space-y-8">
    {{-- Small tabs --}}
    <x-keys::tabs size="sm">
        <x-keys::tab value="sm1">Small</x-keys::tab>
        <x-keys::tab value="sm2">Tabs</x-keys::tab>
    </x-keys::tabs>

    {{-- Medium tabs (default) --}}
    <x-keys::tabs size="md">
        <x-keys::tab value="md1">Medium</x-keys::tab>
        <x-keys::tab value="md2">Tabs</x-keys::tab>
    </x-keys::tabs>

    {{-- Large tabs --}}
    <x-keys::tabs size="lg">
        <x-keys::tab value="lg1">Large</x-keys::tab>
        <x-keys::tab value="lg2">Tabs</x-keys::tab>
    </x-keys::tabs>
</div>
```

## Use Cases

### Product Information Tabs
```blade
<x-keys::tabs default-value="description">
    <x-keys::tab value="description">Description</x-keys::tab>
    <x-keys::tab value="specifications">Specifications</x-keys::tab>
    <x-keys::tab value="reviews">Reviews (24)</x-keys::tab>
    <x-keys::tab value="shipping">Shipping</x-keys::tab>

    <x-slot:panels>
        <x-keys::tab-panel value="description">
            <div class="prose max-w-none">
                <h3>Product Description</h3>
                <p>Detailed product description with features and benefits...</p>
                <ul>
                    <li>Feature 1</li>
                    <li>Feature 2</li>
                    <li>Feature 3</li>
                </ul>
            </div>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="specifications">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h4 class="font-semibold">Dimensions</h4>
                    <p>10" x 8" x 2"</p>
                </div>
                <div>
                    <h4 class="font-semibold">Weight</h4>
                    <p>2.5 lbs</p>
                </div>
                <div>
                    <h4 class="font-semibold">Material</h4>
                    <p>Premium aluminum</p>
                </div>
                <div>
                    <h4 class="font-semibold">Color</h4>
                    <p>Space Gray</p>
                </div>
            </div>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="reviews">
            <div class="space-y-4">
                <div class="flex items-center gap-2 mb-4">
                    <div class="flex text-yellow-400">
                        ★★★★☆
                    </div>
                    <span class="font-semibold">4.2 out of 5</span>
                    <span class="text-neutral-600">(24 reviews)</span>
                </div>
                <!-- Review items -->
            </div>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="shipping">
            <div class="space-y-4">
                <h3 class="font-semibold">Shipping Options</h3>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span>Standard Shipping</span>
                        <span>5-7 business days - Free</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Express Shipping</span>
                        <span>2-3 business days - $9.99</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Overnight Shipping</span>
                        <span>Next business day - $24.99</span>
                    </div>
                </div>
            </div>
        </x-keys::tab-panel>
    </x-slot:panels>
</x-keys::tabs>
```

### Dashboard Analytics Tabs
```blade
<x-keys::tabs variant="underline" default-value="overview">
    <x-keys::tab value="overview">
        <x-keys::icon name="heroicon-o-chart-bar" size="sm" class="mr-2" />
        Overview
    </x-keys::tab>
    <x-keys::tab value="traffic">
        <x-keys::icon name="heroicon-o-globe-alt" size="sm" class="mr-2" />
        Traffic
    </x-keys::tab>
    <x-keys::tab value="conversions">
        <x-keys::icon name="heroicon-o-currency-dollar" size="sm" class="mr-2" />
        Conversions
    </x-keys::tab>
    <x-keys::tab value="reports">
        <x-keys::icon name="heroicon-o-document-chart-bar" size="sm" class="mr-2" />
        Reports
    </x-keys::tab>

    <x-slot:panels>
        <x-keys::tab-panel value="overview">
            <div class="grid grid-cols-3 gap-6 mb-6">
                <x-keys::card variant="padded">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-brand">1,234</div>
                        <div class="text-sm text-neutral-600">Total Visitors</div>
                    </div>
                </x-keys::card>
                <!-- More metric cards -->
            </div>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="traffic">
            <div class="space-y-6">
                <h3 class="font-semibold">Traffic Sources</h3>
                <!-- Traffic analytics content -->
            </div>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="conversions">
            <div class="space-y-6">
                <h3 class="font-semibold">Conversion Metrics</h3>
                <!-- Conversion analytics content -->
            </div>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="reports">
            <div class="space-y-6">
                <h3 class="font-semibold">Generated Reports</h3>
                <!-- Reports content -->
            </div>
        </x-keys::tab-panel>
    </x-slot:panels>
</x-keys::tabs>
```

### Settings Panel with Vertical Tabs
```blade
<x-keys::tabs orientation="vertical" variant="pills" default-value="general">
    <x-keys::tab value="general">
        <x-keys::icon name="heroicon-o-cog-6-tooth" size="sm" class="mr-3" />
        General Settings
    </x-keys::tab>
    <x-keys::tab value="profile">
        <x-keys::icon name="heroicon-o-user" size="sm" class="mr-3" />
        Profile Settings
    </x-keys::tab>
    <x-keys::tab value="notifications">
        <x-keys::icon name="heroicon-o-bell" size="sm" class="mr-3" />
        Notifications
    </x-keys::tab>
    <x-keys::tab value="security">
        <x-keys::icon name="heroicon-o-shield-check" size="sm" class="mr-3" />
        Security
    </x-keys::tab>
    <x-keys::tab value="billing">
        <x-keys::icon name="heroicon-o-credit-card" size="sm" class="mr-3" />
        Billing
    </x-keys::tab>

    <x-slot:panels>
        <x-keys::tab-panel value="general">
            <form class="space-y-6">
                <h3 class="font-semibold text-lg">General Settings</h3>

                <x-keys::input name="site_name" label="Site Name" value="My Application" />
                <x-keys::textarea name="site_description" label="Site Description" />
                <x-keys::select name="timezone" label="Timezone">
                    <x-keys::select.option value="UTC" label="UTC" />
                    <x-keys::select.option value="America/New_York" label="Eastern Time" />
                </x-keys::select>

                <x-keys::button variant="brand">Save Changes</x-keys::button>
            </form>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="profile">
            <form class="space-y-6">
                <h3 class="font-semibold text-lg">Profile Settings</h3>
                <!-- Profile settings form -->
            </form>
        </x-keys::tab-panel>

        <!-- Other panels -->
    </x-slot:panels>
</x-keys::tabs>
```

### Documentation Tabs
```blade
<x-keys::tabs default-value="installation">
    <x-keys::tab value="installation">Installation</x-keys::tab>
    <x-keys::tab value="usage">Usage</x-keys::tab>
    <x-keys::tab value="examples">Examples</x-keys::tab>
    <x-keys::tab value="api">API Reference</x-keys::tab>

    <x-slot:panels>
        <x-keys::tab-panel value="installation">
            <div class="prose max-w-none">
                <h3>Installation Guide</h3>
                <pre class="bg-neutral-100 p-4 rounded"><code>npm install my-package</code></pre>
                <p>Follow these steps to install the package...</p>
            </div>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="usage">
            <div class="prose max-w-none">
                <h3>Basic Usage</h3>
                <p>Here's how to get started with the package...</p>
                <pre class="bg-neutral-100 p-4 rounded"><code>import { Component } from 'my-package';</code></pre>
            </div>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="examples">
            <div class="prose max-w-none">
                <h3>Code Examples</h3>
                <p>Common usage patterns and examples...</p>
            </div>
        </x-keys::tab-panel>

        <x-keys::tab-panel value="api">
            <div class="prose max-w-none">
                <h3>API Documentation</h3>
                <p>Complete API reference...</p>
            </div>
        </x-keys::tab-panel>
    </x-slot:panels>
</x-keys::tabs>
```

## Accessibility

- **ARIA Support**: Proper tab roles and relationships
- **Keyboard Navigation**: Arrow keys, Home, End navigation
- **Focus Management**: Logical tab order and focus indicators
- **Screen Reader**: Announces tab panels and current selection
- **State Management**: Active tabs properly announced

## Animated Marker

The tabs component includes an animated marker that smoothly moves between active tabs:

- **Horizontal tabs**: Bottom border indicator
- **Vertical tabs**: Left border indicator
- **Pills variant**: Background highlight behind active tab
- **Smooth transitions**: CSS-based animations for performance

## Data Attributes

```html
<div
    data-tabs="true"
    data-orientation="horizontal"
    data-variant="default"
    data-size="md"
    data-value="current-tab"
    data-disabled="false"
>
```

## JavaScript Integration

```javascript
// Programmatically change active tab
function switchTab(tabsId, value) {
    const tabs = document.getElementById(tabsId);
    tabs.setAttribute('data-value', value);

    // Trigger tab change event
    tabs.dispatchEvent(new CustomEvent('tab:changed', {
        detail: { value }
    }));
}

// Listen for tab changes
document.addEventListener('tab:changed', function(event) {
    console.log('Tab changed to:', event.detail.value);
});
```

## CSS Customization

```css
/* Custom tab styling */
[data-tabs-trigger="true"] {
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
}

/* Custom active tab */
[data-tabs-trigger="true"][data-state="active"] {
    color: var(--color-brand);
    font-weight: 600;
}

/* Custom marker animation */
.tab-marker {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom panel transitions */
[data-tabs-panel="true"] {
    animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(0.5rem); }
    to { opacity: 1; transform: translateY(0); }
}
```

## Best Practices

1. **Limit tab count** - Keep to 5-7 tabs maximum for usability
2. **Clear labels** - Use descriptive, concise tab labels
3. **Related content** - Group related content within tabs
4. **Default selection** - Always specify a default active tab
5. **Mobile consideration** - Consider vertical tabs for mobile layouts
6. **Loading states** - Handle loading content within panels
7. **Keyboard support** - Ensure full keyboard accessibility