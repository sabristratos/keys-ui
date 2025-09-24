# Checkbox Component

Single and group checkboxes with card variants, full clickability, and enhanced visual feedback.

## Basic Usage

```blade
{{-- Simple checkbox --}}
<x-keys::checkbox name="agree" value="1" label="I agree to the terms" />

{{-- Required checkbox --}}
<x-keys::checkbox
    name="newsletter"
    value="1"
    label="Subscribe to newsletter"
    required
/>

{{-- Pre-checked checkbox --}}
<x-keys::checkbox
    name="notifications"
    value="1"
    label="Enable notifications"
    checked
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Checkbox name attribute |
| `value` | string | `1` | Checkbox value |
| `label` | string | `null` | Checkbox label text |
| `checked` | boolean | `false` | Pre-checked state |
| `disabled` | boolean | `false` | Disable checkbox |
| `required` | boolean | `false` | Mark as required |
| `variant` | string | `standard` | Variant: `standard`, `bordered`, `colored`, `card` |
| `color` | string | `brand` | Color theme for variants |
| `showInput` | boolean | `true` | Show/hide actual checkbox input |
| `title` | string | `null` | Card title (for card variant) |
| `description` | string | `null` | Card description |
| `icon` | string | `null` | Heroicon name |
| `errors` | object | `null` | Validation errors |

## Variants

### Standard Checkbox
```blade
<x-keys::checkbox name="basic" label="Basic checkbox" />
<x-keys::checkbox name="disabled" label="Disabled checkbox" disabled />
<x-keys::checkbox name="checked" label="Checked checkbox" checked />
```

### Bordered Variant
```blade
<x-keys::checkbox
    variant="bordered"
    name="premium"
    label="Premium Features"
    description="Access to advanced tools and priority support"
/>
```

### Colored Variant
```blade
<x-keys::checkbox
    variant="colored"
    color="success"
    name="verified"
    label="Verified Account"
    icon="heroicon-o-check-badge"
/>

<x-keys::checkbox
    variant="colored"
    color="warning"
    name="beta"
    label="Beta Features"
    icon="heroicon-o-beaker"
/>
```

### Card Variant
```blade
<x-keys::checkbox
    variant="card"
    name="plan_pro"
    value="pro"
    title="Pro Plan"
    description="Perfect for growing businesses"
    icon="heroicon-o-star"
    color="brand"
/>

<x-keys::checkbox
    variant="card"
    name="plan_enterprise"
    value="enterprise"
    title="Enterprise Plan"
    description="Advanced features for large teams"
    icon="heroicon-o-building-office"
    color="purple"
/>
```

## Color Options

```blade
{{-- Semantic colors --}}
<x-keys::checkbox variant="colored" color="brand" name="brand" label="Brand" />
<x-keys::checkbox variant="colored" color="success" name="success" label="Success" />
<x-keys::checkbox variant="colored" color="warning" name="warning" label="Warning" />
<x-keys::checkbox variant="colored" color="danger" name="danger" label="Danger" />
<x-keys::checkbox variant="colored" color="neutral" name="neutral" label="Neutral" />

{{-- Specific colors --}}
<x-keys::checkbox variant="colored" color="blue" name="blue" label="Blue" />
<x-keys::checkbox variant="colored" color="green" name="green" label="Green" />
<x-keys::checkbox variant="colored" color="purple" name="purple" label="Purple" />
<x-keys::checkbox variant="colored" color="pink" name="pink" label="Pink" />
```

## Pure Card Mode

For selection interfaces where you want full card clickability without visible form inputs:

```blade
<x-keys::checkbox
    variant="card"
    :showInput="false"
    name="feature"
    value="analytics"
    title="Analytics Dashboard"
    description="Comprehensive insights and reporting"
    icon="heroicon-o-chart-bar"
/>
```

## Checkbox Groups

### Choice Groups
```blade
<fieldset>
    <legend class="text-sm font-medium text-neutral-700">Select Features</legend>

    <div class="space-y-3 mt-2">
        <x-keys::checkbox
            variant="card"
            name="features[]"
            value="analytics"
            title="Analytics"
            description="Track user behavior"
            icon="heroicon-o-chart-bar"
        />

        <x-keys::checkbox
            variant="card"
            name="features[]"
            value="notifications"
            title="Push Notifications"
            description="Engage your users"
            icon="heroicon-o-bell"
        />

        <x-keys::checkbox
            variant="card"
            name="features[]"
            value="storage"
            title="Cloud Storage"
            description="Secure file hosting"
            icon="heroicon-o-cloud"
        />
    </div>
</fieldset>
```

### Permission Matrix
```blade
<div class="space-y-4">
    @foreach($permissions as $permission)
        <x-keys::checkbox
            variant="bordered"
            name="permissions[]"
            :value="$permission->id"
            :label="$permission->name"
            :description="$permission->description"
            :checked="$user->hasPermission($permission)"
        />
    @endforeach
</div>
```

## Form Integration

### Laravel Forms
```blade
<form method="POST">
    @csrf

    <div class="space-y-4">
        <x-keys::checkbox
            name="terms"
            value="1"
            label="I agree to the Terms of Service"
            required
            :errors="$errors"
        />

        <x-keys::checkbox
            name="newsletter"
            value="1"
            label="Subscribe to our newsletter"
            :checked="old('newsletter')"
        />

        <x-keys::checkbox
            name="marketing"
            value="1"
            label="Receive marketing emails"
            :checked="old('marketing')"
        />
    </div>

    <x-keys::button type="submit" variant="brand">Submit</x-keys::button>
</form>
```

### Livewire Integration
```blade
<div>
    <x-keys::checkbox
        name="auto_save"
        label="Auto-save changes"
        wire:model.live="autoSave"
    />

    @if($autoSave)
        <div class="text-sm text-success-600">Auto-save enabled</div>
    @endif
</div>
```

## Advanced Features

### Full Card Clickability
The entire card area (including padding) is clickable thanks to the restructured HTML where the `<label>` element wraps the entire component:

```html
<label data-keys-checkbox="true" data-variant="card" class="cursor-pointer">
    <!-- Entire content is clickable -->
    <input type="checkbox" class="sr-only" />
    <div class="card-content">...</div>
</label>
```

### Dynamic Highlighting
Cards highlight immediately when selected using CSS `has-[:checked]:` selectors:

```css
/* Automatic highlighting when checked */
[data-keys-checkbox][data-variant="card"]:has(:checked) {
    border-color: var(--color-brand);
    background-color: var(--color-brand-50);
}
```

### Unique ID Generation
Prevents DOM conflicts with multiple checkboxes:

```php
// Pattern: {name}-{value}-{uniqid}
$id = "{$this->name}-{$this->value}-" . uniqid();
```

## Accessibility

- Full keyboard navigation support
- Screen reader compatibility with proper labels
- ARIA attributes for enhanced accessibility
- Focus management for card variants
- High contrast mode support

## Data Attributes

```html
<label
    data-keys-checkbox="true"
    data-variant="card"
    data-color="brand"
    data-checked="true"
    data-has-content="true"
    data-has-icon="true"
>
```

## JavaScript Integration

```javascript
// Target checkboxes by variant
document.querySelectorAll('[data-keys-checkbox][data-variant="card"]')

// Handle state changes
checkbox.addEventListener('change', function() {
    console.log('Checked:', this.checked);
    console.log('Value:', this.value);
});

// Listen for custom events
document.addEventListener('checkbox:changed', function(event) {
    console.log('Checkbox changed:', event.detail);
});
```

## Examples

### Settings Form
```blade
<div class="space-y-4">
    <h3 class="text-lg font-semibold">Notification Settings</h3>

    <x-keys::checkbox
        variant="bordered"
        name="email_notifications"
        label="Email Notifications"
        description="Receive updates via email"
        icon="heroicon-o-envelope"
        checked
    />

    <x-keys::checkbox
        variant="bordered"
        name="push_notifications"
        label="Push Notifications"
        description="Browser and mobile push notifications"
        icon="heroicon-o-bell"
    />

    <x-keys::checkbox
        variant="bordered"
        name="sms_notifications"
        label="SMS Notifications"
        description="Text message alerts for urgent updates"
        icon="heroicon-o-device-phone-mobile"
    />
</div>
```

### Feature Selection
```blade
<fieldset>
    <legend class="text-lg font-semibold mb-4">Choose Your Add-ons</legend>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <x-keys::checkbox
            variant="card"
            name="addons[]"
            value="premium_support"
            title="Premium Support"
            description="24/7 priority assistance"
            icon="heroicon-o-headphones"
            color="brand"
        />

        <x-keys::checkbox
            variant="card"
            name="addons[]"
            value="advanced_analytics"
            title="Advanced Analytics"
            description="Detailed reporting and insights"
            icon="heroicon-o-chart-pie"
            color="purple"
        />

        <x-keys::checkbox
            variant="card"
            name="addons[]"
            value="api_access"
            title="API Access"
            description="Integrate with your tools"
            icon="heroicon-o-code-bracket"
            color="green"
        />

        <x-keys::checkbox
            variant="card"
            name="addons[]"
            value="custom_branding"
            title="Custom Branding"
            description="White-label solution"
            icon="heroicon-o-paint-brush"
            color="orange"
        />
    </div>
</fieldset>
```

## CSS Customization

```css
/* Custom card hover effects */
[data-keys-checkbox][data-variant="card"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Custom selection highlighting */
[data-keys-checkbox][data-variant="card"]:has(:checked) {
    border: 2px solid var(--color-brand);
    background: linear-gradient(135deg, var(--color-brand-50), var(--color-brand-100));
}

/* Custom color variants */
[data-keys-checkbox][data-color="custom"] {
    border-color: #667eea;
}
```