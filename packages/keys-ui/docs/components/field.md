# Field Component

A form field wrapper component that provides consistent spacing and layout for form elements.

## Basic Usage

```blade
{{-- Simple field wrapper --}}
<x-keys::field>
    <x-keys::label for="username">Username</x-keys::label>
    <x-keys::input name="username" id="username" />
    <x-keys::error :messages="$errors->get('username')" />
</x-keys::field>

{{-- Field with custom spacing --}}
<x-keys::field spacing="lg">
    <x-keys::label for="description">Description</x-keys::label>
    <x-keys::textarea name="description" id="description" />
    <x-keys::error :messages="$errors->get('description')" />
</x-keys::field>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `spacing` | string | `md` | Vertical spacing: `none`, `sm`, `md`, `lg` |

## Spacing Variants

```blade
{{-- No spacing between elements --}}
<x-keys::field spacing="none">
    <x-keys::label>Compact Field</x-keys::label>
    <x-keys::input name="compact" />
</x-keys::field>

{{-- Small spacing --}}
<x-keys::field spacing="sm">
    <x-keys::label>Small Spacing</x-keys::label>
    <x-keys::input name="small" />
</x-keys::field>

{{-- Medium spacing (default) --}}
<x-keys::field spacing="md">
    <x-keys::label>Medium Spacing</x-keys::label>
    <x-keys::input name="medium" />
</x-keys::field>

{{-- Large spacing --}}
<x-keys::field spacing="lg">
    <x-keys::label>Large Spacing</x-keys::label>
    <x-keys::input name="large" />
</x-keys::field>
```

## Use Cases

### Basic Form Layout
```blade
<form class="space-y-6">
    <x-keys::field>
        <x-keys::label for="first_name" required>First Name</x-keys::label>
        <x-keys::input name="first_name" id="first_name" required />
        <x-keys::error :messages="$errors->get('first_name')" />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="last_name" required>Last Name</x-keys::label>
        <x-keys::input name="last_name" id="last_name" required />
        <x-keys::error :messages="$errors->get('last_name')" />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="email" required>Email Address</x-keys::label>
        <x-keys::input name="email" id="email" type="email" required />
        <x-keys::error :messages="$errors->get('email')" />
    </x-keys::field>

    <x-keys::button type="submit" variant="brand">Submit</x-keys::button>
</form>
```

### Complex Form Fields
```blade
<x-keys::field spacing="lg">
    <x-keys::label for="preferences">Notification Preferences</x-keys::label>
    <div class="space-y-3">
        <x-keys::checkbox name="notifications[]" value="email" label="Email notifications" />
        <x-keys::checkbox name="notifications[]" value="sms" label="SMS notifications" />
        <x-keys::checkbox name="notifications[]" value="push" label="Push notifications" />
    </div>
    <p class="text-sm text-neutral-600">Choose how you'd like to be notified</p>
    <x-keys::error :messages="$errors->get('notifications')" />
</x-keys::field>
```

### Grid Form Layout
```blade
<form class="grid grid-cols-2 gap-6">
    <x-keys::field>
        <x-keys::label for="first_name">First Name</x-keys::label>
        <x-keys::input name="first_name" id="first_name" />
        <x-keys::error :messages="$errors->get('first_name')" />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="last_name">Last Name</x-keys::label>
        <x-keys::input name="last_name" id="last_name" />
        <x-keys::error :messages="$errors->get('last_name')" />
    </x-keys::field>

    <x-keys::field class="col-span-2">
        <x-keys::label for="address">Address</x-keys::label>
        <x-keys::input name="address" id="address" />
        <x-keys::error :messages="$errors->get('address')" />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="city">City</x-keys::label>
        <x-keys::input name="city" id="city" />
        <x-keys::error :messages="$errors->get('city')" />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="postal_code">Postal Code</x-keys::label>
        <x-keys::input name="postal_code" id="postal_code" />
        <x-keys::error :messages="$errors->get('postal_code')" />
    </x-keys::field>
</form>
```

### Card-based Form
```blade
<x-keys::card variant="padded">
    <h3 class="font-semibold text-lg mb-6">Profile Settings</h3>

    <div class="space-y-6">
        <x-keys::field>
            <x-keys::label for="bio">Bio</x-keys::label>
            <x-keys::textarea name="bio" id="bio" rows="4" />
            <p class="text-sm text-neutral-600">Tell us about yourself</p>
            <x-keys::error :messages="$errors->get('bio')" />
        </x-keys::field>

        <x-keys::field>
            <x-keys::label for="website">Website</x-keys::label>
            <x-keys::input name="website" id="website" type="url" placeholder="https://example.com" />
            <x-keys::error :messages="$errors->get('website')" />
        </x-keys::field>

        <x-keys::field>
            <x-keys::label for="location">Location</x-keys::label>
            <x-keys::input name="location" id="location" placeholder="City, Country" />
            <x-keys::error :messages="$errors->get('location')" />
        </x-keys::field>
    </div>
</x-keys::card>
```

### Compact Form Layout
```blade
{{-- Compact form with minimal spacing --}}
<div class="bg-neutral-50 p-4 rounded-lg">
    <h4 class="font-medium mb-3">Quick Search</h4>

    <x-keys::field spacing="sm">
        <x-keys::label for="search_term" class="text-sm">Search Term</x-keys::label>
        <x-keys::input name="search_term" id="search_term" size="sm" />
    </x-keys::field>

    <x-keys::field spacing="sm">
        <x-keys::label for="category" class="text-sm">Category</x-keys::label>
        <x-keys::select name="category" id="category" size="sm">
            <x-keys::select.option value="" label="All Categories" />
            <x-keys::select.option value="tech" label="Technology" />
            <x-keys::select.option value="business" label="Business" />
        </x-keys::select>
    </x-keys::field>

    <x-keys::button variant="brand" size="sm" class="mt-3">Search</x-keys::button>
</div>
```

### Settings Form with Sections
```blade
<form class="space-y-8">
    {{-- Account Section --}}
    <div>
        <h3 class="font-semibold text-lg mb-4">Account Information</h3>
        <div class="space-y-4">
            <x-keys::field>
                <x-keys::label for="display_name">Display Name</x-keys::label>
                <x-keys::input name="display_name" id="display_name" />
                <x-keys::error :messages="$errors->get('display_name')" />
            </x-keys::field>

            <x-keys::field>
                <x-keys::label for="username">Username</x-keys::label>
                <x-keys::input name="username" id="username" />
                <p class="text-sm text-neutral-600">This will be your unique identifier</p>
                <x-keys::error :messages="$errors->get('username')" />
            </x-keys::field>
        </div>
    </div>

    {{-- Privacy Section --}}
    <div>
        <h3 class="font-semibold text-lg mb-4">Privacy Settings</h3>
        <div class="space-y-4">
            <x-keys::field spacing="sm">
                <x-keys::checkbox name="profile_public" label="Make profile public" />
                <p class="text-sm text-neutral-600">Allow others to view your profile</p>
            </x-keys::field>

            <x-keys::field spacing="sm">
                <x-keys::checkbox name="show_email" label="Show email address" />
                <p class="text-sm text-neutral-600">Display email on your public profile</p>
            </x-keys::field>
        </div>
    </div>
</form>
```

### Wizard/Multi-step Form
```blade
<div class="max-w-2xl mx-auto">
    <div class="mb-8">
        <h2 class="text-2xl font-bold">Step 2: Contact Information</h2>
        <div class="w-full bg-neutral-200 rounded-full h-2 mt-4">
            <div class="bg-brand h-2 rounded-full" style="width: 66%"></div>
        </div>
    </div>

    <div class="space-y-6">
        <x-keys::field>
            <x-keys::label for="phone" required>Phone Number</x-keys::label>
            <x-keys::input name="phone" id="phone" type="tel" required />
            <x-keys::error :messages="$errors->get('phone')" />
        </x-keys::field>

        <x-keys::field>
            <x-keys::label for="emergency_contact">Emergency Contact</x-keys::label>
            <x-keys::input name="emergency_contact" id="emergency_contact" />
            <p class="text-sm text-neutral-600">Optional: Name and phone number</p>
            <x-keys::error :messages="$errors->get('emergency_contact')" />
        </x-keys::field>

        <x-keys::field>
            <x-keys::label for="preferred_contact">Preferred Contact Method</x-keys::label>
            <div class="space-y-2">
                <x-keys::radio name="preferred_contact" value="email" label="Email" />
                <x-keys::radio name="preferred_contact" value="phone" label="Phone" />
                <x-keys::radio name="preferred_contact" value="sms" label="SMS" />
            </div>
            <x-keys::error :messages="$errors->get('preferred_contact')" />
        </x-keys::field>
    </div>

    <div class="flex justify-between mt-8">
        <x-keys::button variant="ghost">Previous</x-keys::button>
        <x-keys::button variant="brand">Next</x-keys::button>
    </div>
</div>
```

## Benefits

1. **Consistent Spacing**: Ensures uniform spacing between form elements
2. **Semantic Structure**: Provides proper grouping for related form elements
3. **Flexible Layout**: Works with any form element combination
4. **Easy Styling**: Single component to target for form field styling
5. **Accessibility**: Groups related elements for screen readers
6. **Maintainable**: Centralized control over form field spacing

## CSS Customization

```css
/* Custom field styling */
[data-keys-field="true"] {
    position: relative;
}

/* Custom spacing variants */
[data-keys-field="true"][data-spacing="custom"] {
    gap: 0.75rem;
}

/* Field with errors */
[data-keys-field="true"]:has([data-keys-error="true"]) {
    /* Additional styling for fields with errors */
}

/* Field focus within */
[data-keys-field="true"]:focus-within {
    /* Highlight entire field when any child element has focus */
}
```

## Best Practices

1. **Use consistently** - Wrap all form elements with Field components
2. **Choose appropriate spacing** - Match spacing to form density
3. **Group related elements** - Use Field to group labels, inputs, and errors
4. **Maintain hierarchy** - Use consistent spacing throughout forms
5. **Consider mobile** - Test spacing on different screen sizes
6. **Accessibility** - Ensure proper label-input associations
7. **Error handling** - Always include error display within fields