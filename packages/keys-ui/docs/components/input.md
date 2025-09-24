# Input Component

Text inputs with actions, validation, and comprehensive styling options for form building.

## Basic Usage

```blade
{{-- Simple text input --}}
<x-keys::input name="email" placeholder="Enter your email" />

{{-- Input with label --}}
<x-keys::input name="name" label="Full Name" />

{{-- Required input with validation --}}
<x-keys::input
    name="password"
    type="password"
    label="Password"
    required
    :errors="$errors"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Input name attribute |
| `type` | string | `text` | Input type: `text`, `email`, `password`, `number`, `tel`, `url` |
| `label` | string | `null` | Input label text |
| `placeholder` | string | `null` | Placeholder text |
| `value` | string | `null` | Input value |
| `size` | string | `md` | Size: `sm`, `md`, `lg` |
| `required` | boolean | `false` | Mark as required |
| `disabled` | boolean | `false` | Disable input |
| `readonly` | boolean | `false` | Make read-only |
| `errors` | object | `null` | Validation errors collection |
| `optional` | boolean | `false` | Show optional indicator |

## Input Types

```blade
{{-- Text inputs --}}
<x-keys::input type="text" name="name" label="Name" />
<x-keys::input type="email" name="email" label="Email" />
<x-keys::input type="password" name="password" label="Password" />
<x-keys::input type="tel" name="phone" label="Phone" />
<x-keys::input type="url" name="website" label="Website" />

{{-- Number input --}}
<x-keys::input type="number" name="age" label="Age" min="18" max="100" />
```

## Icons

```blade
{{-- Left icon --}}
<x-keys::input
    name="search"
    placeholder="Search..."
    icon-left="heroicon-o-magnifying-glass"
/>

{{-- Right icon --}}
<x-keys::input
    name="email"
    placeholder="Email address"
    icon-right="heroicon-o-envelope"
/>

{{-- Both icons --}}
<x-keys::input
    name="amount"
    placeholder="0.00"
    icon-left="heroicon-o-currency-dollar"
    icon-right="heroicon-o-calculator"
/>
```

## Input Actions

The Input component supports various interactive actions:

### Password Toggle
```blade
<x-keys::input
    type="password"
    name="password"
    label="Password"
    password-toggle
/>
```

### Clear Action
```blade
<x-keys::input
    name="search"
    placeholder="Search..."
    clearable
/>
```

### Copy Action
```blade
<x-keys::input
    name="api_key"
    label="API Key"
    value="sk-abc123..."
    copyable
    readonly
/>
```

### Custom Actions
```blade
<x-keys::input name="code" label="Verification Code">
    <x-slot:actions>
        <x-keys::button size="sm" variant="ghost">Resend</x-keys::button>
    </x-slot:actions>
</x-keys::input>
```

## Size Variants

```blade
<x-keys::input size="sm" placeholder="Small input" />
<x-keys::input size="md" placeholder="Medium input" />
<x-keys::input size="lg" placeholder="Large input" />
```

## Validation States

```blade
{{-- With validation errors --}}
<x-keys::input
    name="email"
    label="Email"
    :errors="$errors"
    value="{{ old('email') }}"
/>

{{-- Success state --}}
<x-keys::input
    name="username"
    label="Username"
    value="john_doe"
    success
/>

{{-- Warning state --}}
<x-keys::input
    name="domain"
    label="Domain"
    warning="Domain availability uncertain"
/>
```

## Form Integration

### Basic Form
```blade
<form method="POST">
    @csrf

    <x-keys::input
        name="name"
        label="Full Name"
        required
        :errors="$errors"
        value="{{ old('name') }}"
    />

    <x-keys::input
        type="email"
        name="email"
        label="Email Address"
        required
        :errors="$errors"
        value="{{ old('email') }}"
    />

    <x-keys::button type="submit" variant="brand">Submit</x-keys::button>
</form>
```

### Livewire Integration
```blade
<div>
    <x-keys::input
        name="search"
        placeholder="Search users..."
        wire:model.live="search"
        clearable
    />

    @if($search)
        <div>Searching for: {{ $search }}</div>
    @endif
</div>
```

## Accessibility

- Proper label associations
- ARIA attributes for validation states
- Keyboard navigation support
- Screen reader announcements
- Focus management

## Data Attributes

```html
<input
    data-keys-input="true"
    data-type="email"
    data-size="md"
    data-has-icon-left="true"
    data-has-actions="true"
    data-required="true"
/>
```

## JavaScript Integration

```javascript
// Target inputs with actions
document.querySelectorAll('[data-keys-input][data-has-actions="true"]')

// Handle input events
input.addEventListener('input', function() {
    // Custom validation or formatting
});
```

## Examples

### Search Input
```blade
<x-keys::input
    name="search"
    placeholder="Search products..."
    icon-left="heroicon-o-magnifying-glass"
    clearable
    wire:model.live.debounce.300ms="search"
/>
```

### Contact Form
```blade
<x-keys::input
    name="name"
    label="Full Name"
    required
    :errors="$errors"
/>

<x-keys::input
    type="email"
    name="email"
    label="Email Address"
    required
    :errors="$errors"
/>

<x-keys::input
    type="tel"
    name="phone"
    label="Phone Number"
    optional
/>
```

### Settings Form
```blade
<x-keys::input
    name="api_key"
    label="API Key"
    value="{{ $user->api_key }}"
    copyable
    readonly
/>

<x-keys::input
    type="password"
    name="current_password"
    label="Current Password"
    password-toggle
    required
/>

<x-keys::input
    type="password"
    name="new_password"
    label="New Password"
    password-toggle
    required
/>
```

## CSS Customization

```css
/* Custom input styles */
[data-keys-input][data-invalid="true"] {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

[data-keys-input][data-has-value="true"] + label {
    transform: translateY(-24px) scale(0.875);
}

/* Action button styles */
[data-keys-input] .input-actions button {
    transition: opacity 0.2s ease;
}
```