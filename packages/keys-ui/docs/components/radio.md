# Radio Component

Radio buttons with rich card layouts, full clickability, and enhanced visual feedback for single-choice selections.

## Basic Usage

```blade
{{-- Simple radio buttons --}}
<x-keys::radio name="plan" value="basic" label="Basic Plan" />
<x-keys::radio name="plan" value="pro" label="Pro Plan" checked />
<x-keys::radio name="plan" value="enterprise" label="Enterprise Plan" />

{{-- With validation --}}
<x-keys::radio
    name="subscription"
    value="monthly"
    label="Monthly Billing"
    required
    :errors="$errors"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Radio name attribute (same for group) |
| `value` | string | required | Radio value |
| `label` | string | `null` | Radio label text |
| `checked` | boolean | `false` | Pre-checked state |
| `disabled` | boolean | `false` | Disable radio |
| `required` | boolean | `false` | Mark as required |
| `variant` | string | `standard` | Variant: `standard`, `bordered`, `colored`, `card` |
| `color` | string | `brand` | Color theme for variants |
| `showInput` | boolean | `true` | Show/hide actual radio input |
| `title` | string | `null` | Card title (for card variant) |
| `description` | string | `null` | Card description |
| `icon` | string | `null` | Heroicon name |
| `errors` | object | `null` | Validation errors |

## Variants

### Standard Radio
```blade
<fieldset>
    <legend>Delivery Options</legend>
    <x-keys::radio name="delivery" value="standard" label="Standard (5-7 days)" />
    <x-keys::radio name="delivery" value="express" label="Express (2-3 days)" />
    <x-keys::radio name="delivery" value="overnight" label="Overnight" />
</fieldset>
```

### Bordered Variant
```blade
<fieldset>
    <legend class="text-lg font-semibold mb-4">Choose Size</legend>
    <div class="space-y-3">
        <x-keys::radio
            variant="bordered"
            name="size"
            value="small"
            label="Small"
            description="Perfect for individuals"
        />
        <x-keys::radio
            variant="bordered"
            name="size"
            value="medium"
            label="Medium"
            description="Great for small teams"
        />
        <x-keys::radio
            variant="bordered"
            name="size"
            value="large"
            label="Large"
            description="Ideal for organizations"
        />
    </div>
</fieldset>
```

### Colored Variant
```blade
<fieldset>
    <legend class="text-lg font-semibold mb-4">Priority Level</legend>
    <div class="space-y-3">
        <x-keys::radio
            variant="colored"
            color="green"
            name="priority"
            value="low"
            label="Low Priority"
            icon="heroicon-o-arrow-down"
        />
        <x-keys::radio
            variant="colored"
            color="yellow"
            name="priority"
            value="medium"
            label="Medium Priority"
            icon="heroicon-o-minus"
        />
        <x-keys::radio
            variant="colored"
            color="red"
            name="priority"
            value="high"
            label="High Priority"
            icon="heroicon-o-arrow-up"
        />
    </div>
</fieldset>
```

### Card Variant
```blade
<fieldset>
    <legend class="text-xl font-bold mb-6">Select Your Plan</legend>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <x-keys::radio
            variant="card"
            name="subscription_plan"
            value="starter"
            title="Starter"
            description="Perfect for getting started"
            icon="heroicon-o-rocket-launch"
            color="blue"
        />

        <x-keys::radio
            variant="card"
            name="subscription_plan"
            value="professional"
            title="Professional"
            description="For growing businesses"
            icon="heroicon-o-briefcase"
            color="brand"
        />

        <x-keys::radio
            variant="card"
            name="subscription_plan"
            value="enterprise"
            title="Enterprise"
            description="Advanced features and support"
            icon="heroicon-o-building-office"
            color="purple"
        />
    </div>
</fieldset>
```

## Color Options

```blade
{{-- Semantic colors --}}
<x-keys::radio variant="colored" color="brand" name="test" value="brand" label="Brand" />
<x-keys::radio variant="colored" color="success" name="test" value="success" label="Success" />
<x-keys::radio variant="colored" color="warning" name="test" value="warning" label="Warning" />
<x-keys::radio variant="colored" color="danger" name="test" value="danger" label="Danger" />

{{-- Specific colors --}}
<x-keys::radio variant="colored" color="blue" name="test" value="blue" label="Blue" />
<x-keys::radio variant="colored" color="green" name="test" value="green" label="Green" />
<x-keys::radio variant="colored" color="purple" name="test" value="purple" label="Purple" />
<x-keys::radio variant="colored" color="pink" name="test" value="pink" label="Pink" />
```

## Pure Card Mode

For selection interfaces without visible form inputs:

```blade
<div class="grid grid-cols-2 gap-4">
    <x-keys::radio
        variant="card"
        :showInput="false"
        name="theme"
        value="light"
        title="Light Theme"
        description="Clean and bright interface"
        icon="heroicon-o-sun"
    />

    <x-keys::radio
        variant="card"
        :showInput="false"
        name="theme"
        value="dark"
        title="Dark Theme"
        description="Easy on the eyes"
        icon="heroicon-o-moon"
    />
</div>
```

## Radio Groups

### Payment Methods
```blade
<fieldset>
    <legend class="text-lg font-semibold mb-4">Payment Method</legend>
    <div class="space-y-3">
        <x-keys::radio
            variant="card"
            name="payment_method"
            value="credit_card"
            title="Credit Card"
            description="Visa, MasterCard, American Express"
            icon="heroicon-o-credit-card"
        />

        <x-keys::radio
            variant="card"
            name="payment_method"
            value="paypal"
            title="PayPal"
            description="Pay with your PayPal account"
            icon="heroicon-o-globe-alt"
        />

        <x-keys::radio
            variant="card"
            name="payment_method"
            value="bank_transfer"
            title="Bank Transfer"
            description="Direct bank account transfer"
            icon="heroicon-o-building-library"
        />
    </div>
</fieldset>
```

### User Preferences
```blade
<div class="space-y-6">
    {{-- Notification frequency --}}
    <fieldset>
        <legend class="text-sm font-medium text-neutral-700">Email Frequency</legend>
        <div class="mt-2 space-y-2">
            <x-keys::radio name="frequency" value="immediate" label="Immediate" />
            <x-keys::radio name="frequency" value="daily" label="Daily digest" />
            <x-keys::radio name="frequency" value="weekly" label="Weekly summary" />
            <x-keys::radio name="frequency" value="never" label="Never" />
        </div>
    </fieldset>

    {{-- Privacy level --}}
    <fieldset>
        <legend class="text-sm font-medium text-neutral-700">Privacy Level</legend>
        <div class="mt-2 space-y-3">
            <x-keys::radio
                variant="bordered"
                name="privacy"
                value="public"
                label="Public"
                description="Visible to everyone"
            />
            <x-keys::radio
                variant="bordered"
                name="privacy"
                value="friends"
                label="Friends Only"
                description="Visible to your connections"
            />
            <x-keys::radio
                variant="bordered"
                name="privacy"
                value="private"
                label="Private"
                description="Only visible to you"
            />
        </div>
    </fieldset>
</div>
```

## Form Integration

### Laravel Forms
```blade
<form method="POST">
    @csrf

    <fieldset>
        <legend class="text-lg font-semibold mb-4">Account Type</legend>
        <div class="space-y-3">
            <x-keys::radio
                name="account_type"
                value="personal"
                label="Personal Account"
                :checked="old('account_type') === 'personal'"
                required
                :errors="$errors"
            />

            <x-keys::radio
                name="account_type"
                value="business"
                label="Business Account"
                :checked="old('account_type') === 'business'"
                required
                :errors="$errors"
            />
        </div>
    </fieldset>

    <x-keys::button type="submit" variant="brand">Continue</x-keys::button>
</form>
```

### Livewire Integration
```blade
<div>
    <fieldset>
        <legend class="text-lg font-semibold">View Mode</legend>
        <div class="flex space-x-4 mt-2">
            <x-keys::radio
                name="view_mode"
                value="grid"
                label="Grid View"
                wire:model.live="viewMode"
            />
            <x-keys::radio
                name="view_mode"
                value="list"
                label="List View"
                wire:model.live="viewMode"
            />
        </div>
    </fieldset>

    {{-- Content changes based on selection --}}
    @if($viewMode === 'grid')
        <div class="grid grid-cols-3 gap-4 mt-4">...</div>
    @else
        <div class="space-y-2 mt-4">...</div>
    @endif
</div>
```

## Advanced Features

### Focus Management
The Radio component includes JavaScript for proper keyboard navigation:

```javascript
// Automatic focus management when selection changes
class RadioActions {
    init() {
        // Focus moves to checked radio for keyboard navigation
        this.manageFocus();
    }
}
```

### Full Card Clickability
Like the Checkbox component, the entire card area is clickable:

```html
<label data-keys-radio="true" data-variant="card" class="cursor-pointer">
    <input type="radio" class="sr-only" />
    <div class="card-content">...</div>
</label>
```

### Dynamic Highlighting
Cards highlight when selected using CSS:

```css
[data-keys-radio][data-variant="card"]:has(:checked) {
    border-color: var(--color-brand);
    background-color: var(--color-brand-50);
}
```

## Accessibility

- Full keyboard navigation with arrow keys
- Screen reader compatibility
- ARIA attributes for radio groups
- Focus management for proper tab order
- High contrast mode support

## Data Attributes

```html
<label
    data-keys-radio="true"
    data-variant="card"
    data-color="brand"
    data-value="premium"
    data-has-icon="true"
    data-checked="true"
>
```

## JavaScript Integration

```javascript
// Target radio groups
document.querySelectorAll('[data-keys-radio][name="plan"]')

// Handle selection changes
radio.addEventListener('change', function() {
    console.log('Selected:', this.value);

    // Update other parts of the UI
    updatePricing(this.value);
});

// Programmatic selection
function selectPlan(value) {
    document.querySelector(`[data-keys-radio][value="${value}"]`).checked = true;
}
```

## Examples

### Pricing Plans
```blade
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <x-keys::radio
        variant="card"
        name="plan"
        value="basic"
        color="gray"
    >
        <div class="text-center">
            <h3 class="text-lg font-semibold">Basic</h3>
            <p class="text-3xl font-bold mt-2">$9<span class="text-sm">/mo</span></p>
            <ul class="mt-4 space-y-2 text-sm">
                <li>5 Projects</li>
                <li>10GB Storage</li>
                <li>Email Support</li>
            </ul>
        </div>
    </x-keys::radio>

    <x-keys::radio
        variant="card"
        name="plan"
        value="pro"
        color="brand"
        checked
    >
        <div class="text-center">
            <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span class="bg-brand-500 text-white px-3 py-1 rounded-full text-xs">Popular</span>
            </div>
            <h3 class="text-lg font-semibold">Pro</h3>
            <p class="text-3xl font-bold mt-2">$29<span class="text-sm">/mo</span></p>
            <ul class="mt-4 space-y-2 text-sm">
                <li>50 Projects</li>
                <li>100GB Storage</li>
                <li>Priority Support</li>
                <li>Advanced Features</li>
            </ul>
        </div>
    </x-keys::radio>

    <x-keys::radio
        variant="card"
        name="plan"
        value="enterprise"
        color="purple"
    >
        <div class="text-center">
            <h3 class="text-lg font-semibold">Enterprise</h3>
            <p class="text-3xl font-bold mt-2">$99<span class="text-sm">/mo</span></p>
            <ul class="mt-4 space-y-2 text-sm">
                <li>Unlimited Projects</li>
                <li>1TB Storage</li>
                <li>24/7 Support</li>
                <li>Custom Integration</li>
            </ul>
        </div>
    </x-keys::radio>
</div>
```

### Survey Questions
```blade
<div class="space-y-8">
    <fieldset>
        <legend class="text-lg font-semibold">How satisfied are you with our service?</legend>
        <div class="mt-4 space-y-2">
            <x-keys::radio name="satisfaction" value="very_satisfied" label="Very Satisfied" />
            <x-keys::radio name="satisfaction" value="satisfied" label="Satisfied" />
            <x-keys::radio name="satisfaction" value="neutral" label="Neutral" />
            <x-keys::radio name="satisfaction" value="dissatisfied" label="Dissatisfied" />
            <x-keys::radio name="satisfaction" value="very_dissatisfied" label="Very Dissatisfied" />
        </div>
    </fieldset>

    <fieldset>
        <legend class="text-lg font-semibold">Would you recommend us to others?</legend>
        <div class="mt-4 flex space-x-6">
            <x-keys::radio name="recommend" value="yes" label="Yes" />
            <x-keys::radio name="recommend" value="no" label="No" />
            <x-keys::radio name="recommend" value="maybe" label="Maybe" />
        </div>
    </fieldset>
</div>
```

## CSS Customization

```css
/* Custom card hover effects */
[data-keys-radio][data-variant="card"]:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Custom selection styles */
[data-keys-radio][data-variant="card"]:has(:checked) {
    border: 2px solid var(--color-brand);
    box-shadow: 0 0 0 4px rgba(var(--color-brand-rgb), 0.1);
}

/* Popular badge positioning */
[data-keys-radio][data-variant="card"] {
    position: relative;
}
```