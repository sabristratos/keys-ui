# Button Component

Interactive buttons with multi-state support, icon handling, and comprehensive styling options.

## Basic Usage

```blade
{{-- Simple button --}}
<x-keys::button>Click Me</x-keys::button>

{{-- Branded button --}}
<x-keys::button variant="brand">Save Changes</x-keys::button>

{{-- Button with icon --}}
<x-keys::button icon="heroicon-o-plus">Add Item</x-keys::button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `default` | Style variant: `default`, `brand`, `success`, `warning`, `danger`, `ghost`, `link` |
| `size` | string | `md` | Size: `xs`, `sm`, `md`, `lg`, `xl` |
| `icon` | string | `null` | Heroicon name for default state |
| `icon-toggle` | string | `null` | Heroicon name for toggle state |
| `icon-success` | string | `null` | Heroicon name for success state |
| `loading` | boolean | `false` | Show loading state |
| `disabled` | boolean | `false` | Disable button |
| `type` | string | `button` | Button type: `button`, `submit`, `reset` |

## Variants

### Style Variants
```blade
{{-- Primary variants --}}
<x-keys::button variant="default">Default</x-keys::button>
<x-keys::button variant="brand">Brand</x-keys::button>
<x-keys::button variant="success">Success</x-keys::button>
<x-keys::button variant="warning">Warning</x-keys::button>
<x-keys::button variant="danger">Danger</x-keys::button>

{{-- Secondary variants --}}
<x-keys::button variant="ghost">Ghost</x-keys::button>
<x-keys::button variant="link">Link</x-keys::button>
```

### Size Variants
```blade
<x-keys::button size="xs">Extra Small</x-keys::button>
<x-keys::button size="sm">Small</x-keys::button>
<x-keys::button size="md">Medium</x-keys::button>
<x-keys::button size="lg">Large</x-keys::button>
<x-keys::button size="xl">Extra Large</x-keys::button>
```

## Multi-State Support

The Button component natively supports icon state changes for interactive feedback:

```blade
{{-- Password toggle button --}}
<x-keys::button
    icon="heroicon-o-eye"
    icon-toggle="heroicon-o-eye-slash"
    onclick="togglePassword()"
>
    Toggle Password
</x-keys::button>

{{-- Like button with success state --}}
<x-keys::button
    icon="heroicon-o-heart"
    icon-success="heroicon-s-heart"
    variant="ghost"
    onclick="toggleLike()"
>
    Like
</x-keys::button>
```

## Auto Icon-Only Detection

When slot content is empty, the button automatically renders as icon-only:

```blade
{{-- Automatically becomes icon-only --}}
<x-keys::button icon="heroicon-o-plus" />
<x-keys::button icon="heroicon-o-trash" variant="danger" />

{{-- Regular button with icon and text --}}
<x-keys::button icon="heroicon-o-plus">Add Item</x-keys::button>
```

## Loading States

```blade
{{-- Loading button --}}
<x-keys::button loading>Saving...</x-keys::button>

{{-- Loading with custom text --}}
<x-keys::button :loading="$isLoading">
    {{ $isLoading ? 'Saving...' : 'Save Changes' }}
</x-keys::button>
```

## Form Integration

```blade
{{-- Submit button --}}
<x-keys::button type="submit" variant="brand">Submit Form</x-keys::button>

{{-- Reset button --}}
<x-keys::button type="reset" variant="ghost">Reset</x-keys::button>

{{-- Disabled state --}}
<x-keys::button disabled>Cannot Click</x-keys::button>
```

## JavaScript Integration

The Button component includes data attributes for JavaScript integration:

```javascript
// Target multi-state buttons
document.querySelectorAll('[data-keys-button][data-multi-state="true"]')

// Handle state changes
button.setAttribute('data-icon-current', 'toggle');
```

### Data Attributes

```html
<button
    data-keys-button="true"
    data-variant="brand"
    data-size="md"
    data-multi-state="true"
    data-icon-default="eye"
    data-icon-toggle="eye-slash"
>
```

## Accessibility

- Proper ARIA attributes for screen readers
- Keyboard navigation support
- Focus management for state changes
- Loading state announcements

## Examples

### Action Buttons
```blade
{{-- Primary actions --}}
<x-keys::button variant="brand" type="submit">Save Changes</x-keys::button>
<x-keys::button variant="success">Approve</x-keys::button>
<x-keys::button variant="danger">Delete</x-keys::button>

{{-- Secondary actions --}}
<x-keys::button variant="ghost">Cancel</x-keys::button>
<x-keys::button variant="link">Learn More</x-keys::button>
```

### Icon Buttons
```blade
{{-- Toolbar buttons --}}
<x-keys::button icon="heroicon-o-bold" size="sm" />
<x-keys::button icon="heroicon-o-italic" size="sm" />
<x-keys::button icon="heroicon-o-underline" size="sm" />

{{-- Navigation buttons --}}
<x-keys::button icon="heroicon-o-arrow-left" variant="ghost">Back</x-keys::button>
<x-keys::button icon="heroicon-o-arrow-right" variant="ghost">Next</x-keys::button>
```

### Interactive States
```blade
{{-- Toggle button with state management --}}
<x-keys::button
    icon="heroicon-o-bookmark"
    icon-toggle="heroicon-s-bookmark"
    variant="ghost"
    x-data="{ bookmarked: false }"
    x-on:click="bookmarked = !bookmarked"
    x-bind:data-icon-current="bookmarked ? 'toggle' : 'default'"
>
    Bookmark
</x-keys::button>
```

## CSS Customization

Target specific button states with data attributes:

```css
/* Custom loading styles */
[data-keys-button][data-loading="true"] {
    cursor: wait;
    opacity: 0.7;
}

/* Custom icon-only styles */
[data-keys-button][data-icon-only="true"] {
    border-radius: 50%;
}

/* Custom variant styles */
[data-keys-button][data-variant="custom"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```