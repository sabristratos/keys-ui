# Label Component

Enhanced form labels with size variants, required/optional indicators, and consistent styling.

## Basic Usage

```blade
{{-- Simple label --}}
<x-keys::label for="username">Username</x-keys::label>
<x-keys::input name="username" id="username" />

{{-- Required field label --}}
<x-keys::label for="email" required>Email Address</x-keys::label>
<x-keys::input name="email" id="email" type="email" required />

{{-- Optional field label --}}
<x-keys::label for="phone" optional>Phone Number</x-keys::label>
<x-keys::input name="phone" id="phone" type="tel" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `for` | string | `null` | ID of the associated form element |
| `size` | string | `md` | Label size: `sm`, `md`, `lg` |
| `required` | boolean | `false` | Show required indicator (*) |
| `optional` | boolean | `false` | Show optional text |

## Size Variants

```blade
<div class="space-y-4">
    {{-- Small label --}}
    <div>
        <x-keys::label for="small_field" size="sm">Small Label</x-keys::label>
        <x-keys::input name="small_field" id="small_field" size="sm" />
    </div>

    {{-- Medium label (default) --}}
    <div>
        <x-keys::label for="medium_field" size="md">Medium Label</x-keys::label>
        <x-keys::input name="medium_field" id="medium_field" size="md" />
    </div>

    {{-- Large label --}}
    <div>
        <x-keys::label for="large_field" size="lg">Large Label</x-keys::label>
        <x-keys::input name="large_field" id="large_field" size="lg" />
    </div>
</div>
```

## Required and Optional Indicators

```blade
{{-- Required field --}}
<x-keys::label for="password" required>Password</x-keys::label>
<x-keys::input name="password" id="password" type="password" required />

{{-- Optional field --}}
<x-keys::label for="middle_name" optional>Middle Name</x-keys::label>
<x-keys::input name="middle_name" id="middle_name" />

{{-- Both indicators (not recommended) --}}
<x-keys::label for="example" required optional>Conflicting Label</x-keys::label>
```

## Use Cases

### Basic Form Labels
```blade
<form class="space-y-6">
    <x-keys::field>
        <x-keys::label for="first_name" required>First Name</x-keys::label>
        <x-keys::input name="first_name" id="first_name" required />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="last_name" required>Last Name</x-keys::label>
        <x-keys::input name="last_name" id="last_name" required />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="nickname" optional>Nickname</x-keys::label>
        <x-keys::input name="nickname" id="nickname" />
    </x-keys::field>
</form>
```

### Complex Form Elements
```blade
{{-- Select field --}}
<x-keys::field>
    <x-keys::label for="country" required>Country</x-keys::label>
    <x-keys::select name="country" id="country" required>
        <x-keys::select.option value="" label="Choose a country" />
        <x-keys::select.option value="us" label="United States" />
        <x-keys::select.option value="ca" label="Canada" />
        <x-keys::select.option value="uk" label="United Kingdom" />
    </x-keys::select>
</x-keys::field>

{{-- Textarea field --}}
<x-keys::field>
    <x-keys::label for="description" optional>Description</x-keys::label>
    <x-keys::textarea name="description" id="description" rows="4" />
</x-keys::field>

{{-- File upload --}}
<x-keys::field>
    <x-keys::label for="documents" optional>Supporting Documents</x-keys::label>
    <x-keys::file-upload name="documents[]" id="documents" multiple accept=".pdf,.doc,.docx" />
</x-keys::field>
```

### Checkbox and Radio Groups
```blade
{{-- Checkbox group --}}
<x-keys::field>
    <x-keys::label required>Notification Preferences</x-keys::label>
    <div class="space-y-2 mt-2">
        <x-keys::checkbox name="notifications[]" value="email" label="Email notifications" />
        <x-keys::checkbox name="notifications[]" value="sms" label="SMS notifications" />
        <x-keys::checkbox name="notifications[]" value="push" label="Push notifications" />
    </div>
</x-keys::field>

{{-- Radio group --}}
<x-keys::field>
    <x-keys::label required>Account Type</x-keys::label>
    <div class="space-y-2 mt-2">
        <x-keys::radio name="account_type" value="personal" label="Personal Account" />
        <x-keys::radio name="account_type" value="business" label="Business Account" />
        <x-keys::radio name="account_type" value="enterprise" label="Enterprise Account" />
    </div>
</x-keys::field>
```

### Compact Forms
```blade
<div class="grid grid-cols-2 gap-4">
    <x-keys::field>
        <x-keys::label for="start_date" size="sm" required>Start Date</x-keys::label>
        <x-keys::date-picker name="start_date" id="start_date" size="sm" />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="end_date" size="sm" optional>End Date</x-keys::label>
        <x-keys::date-picker name="end_date" id="end_date" size="sm" />
    </x-keys::field>
</div>
```

### Settings Forms
```blade
<x-keys::card variant="padded">
    <h3 class="font-semibold text-lg mb-6">Privacy Settings</h3>

    <div class="space-y-6">
        <x-keys::field>
            <x-keys::label for="visibility">Profile Visibility</x-keys::label>
            <x-keys::select name="visibility" id="visibility">
                <x-keys::select.option value="public" label="Public" />
                <x-keys::select.option value="friends" label="Friends Only" />
                <x-keys::select.option value="private" label="Private" />
            </x-keys::select>
        </x-keys::field>

        <x-keys::field>
            <x-keys::label>Contact Preferences</x-keys::label>
            <div class="space-y-3 mt-2">
                <x-keys::checkbox name="allow_messages" label="Allow messages from other users" />
                <x-keys::checkbox name="show_online_status" label="Show when I'm online" />
                <x-keys::checkbox name="show_last_seen" label="Show last seen timestamp" />
            </div>
        </x-keys::field>
    </div>
</x-keys::card>
```

### Multi-column Layout
```blade
<form class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {{-- Personal Information --}}
    <div class="space-y-4">
        <h3 class="font-semibold text-base">Personal Information</h3>

        <x-keys::field>
            <x-keys::label for="personal_first_name" required>First Name</x-keys::label>
            <x-keys::input name="first_name" id="personal_first_name" />
        </x-keys::field>

        <x-keys::field>
            <x-keys::label for="personal_last_name" required>Last Name</x-keys::label>
            <x-keys::input name="last_name" id="personal_last_name" />
        </x-keys::field>

        <x-keys::field>
            <x-keys::label for="birth_date" optional>Date of Birth</x-keys::label>
            <x-keys::date-picker name="birth_date" id="birth_date" />
        </x-keys::field>
    </div>

    {{-- Contact Information --}}
    <div class="space-y-4">
        <h3 class="font-semibold text-base">Contact Information</h3>

        <x-keys::field>
            <x-keys::label for="contact_email" required>Email</x-keys::label>
            <x-keys::input name="email" id="contact_email" type="email" />
        </x-keys::field>

        <x-keys::field>
            <x-keys::label for="contact_phone" optional>Phone</x-keys::label>
            <x-keys::input name="phone" id="contact_phone" type="tel" />
        </x-keys::field>

        <x-keys::field>
            <x-keys::label for="contact_address" optional>Address</x-keys::label>
            <x-keys::textarea name="address" id="contact_address" rows="3" />
        </x-keys::field>
    </div>
</form>
```

### Dynamic Forms
```blade
<div x-data="{ showAdvanced: false }">
    {{-- Basic fields --}}
    <x-keys::field>
        <x-keys::label for="project_name" required>Project Name</x-keys::label>
        <x-keys::input name="project_name" id="project_name" />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="project_type" required>Project Type</x-keys::label>
        <x-keys::select name="project_type" id="project_type">
            <x-keys::select.option value="" label="Choose type" />
            <x-keys::select.option value="web" label="Web Application" />
            <x-keys::select.option value="mobile" label="Mobile App" />
            <x-keys::select.option value="desktop" label="Desktop Software" />
        </x-keys::select>
    </x-keys::field>

    {{-- Toggle for advanced options --}}
    <x-keys::button type="button" variant="ghost" @click="showAdvanced = !showAdvanced">
        <span x-text="showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'"></span>
    </x-keys::button>

    {{-- Advanced fields --}}
    <div x-show="showAdvanced" x-transition class="space-y-4 mt-4">
        <x-keys::field>
            <x-keys::label for="budget" optional>Budget Range</x-keys::label>
            <x-keys::select name="budget" id="budget">
                <x-keys::select.option value="" label="Not specified" />
                <x-keys::select.option value="small" label="$5,000 - $15,000" />
                <x-keys::select.option value="medium" label="$15,000 - $50,000" />
                <x-keys::select.option value="large" label="$50,000+" />
            </x-keys::select>
        </x-keys::field>

        <x-keys::field>
            <x-keys::label for="timeline" optional>Expected Timeline</x-keys::label>
            <x-keys::input name="timeline" id="timeline" placeholder="e.g., 3-6 months" />
        </x-keys::field>
    </div>
</div>
```

## Accessibility

- **Proper Association**: Uses `for` attribute to associate with form elements
- **Required Indicators**: Visual and semantic indication of required fields
- **Screen Reader Support**: Clear labeling for assistive technologies
- **High Contrast**: Maintains readability in high contrast mode
- **Focus Management**: Works with keyboard navigation

```blade
{{-- Accessible label example --}}
<x-keys::label for="accessible_field" required>
    Field Label
    <span class="sr-only">(required)</span>
</x-keys::label>
<x-keys::input
    name="accessible_field"
    id="accessible_field"
    aria-required="true"
    aria-describedby="accessible_field_help"
/>
<p id="accessible_field_help" class="text-sm text-neutral-600">
    Additional help text for this field
</p>
```

## CSS Customization

```css
/* Custom label styling */
[data-keys-label="true"] {
    color: var(--color-foreground);
    font-weight: 500;
}

/* Required indicator styling */
[data-keys-label="true"][data-required="true"]::after {
    content: " *";
    color: var(--color-danger);
}

/* Optional indicator styling */
[data-keys-label="true"][data-optional="true"]::after {
    content: " (optional)";
    color: var(--color-neutral-500);
    font-weight: normal;
    font-size: 0.875em;
}

/* Size variants */
[data-keys-label="true"][data-size="sm"] {
    font-size: 0.75rem;
}

[data-keys-label="true"][data-size="lg"] {
    font-size: 1rem;
    font-weight: 600;
}

/* Label focus styles (when associated input is focused) */
[data-keys-label="true"]:has(+ input:focus),
[data-keys-label="true"]:has(+ [data-keys-input]:focus-within) {
    color: var(--color-brand);
}
```

## Best Practices

1. **Always associate** - Use `for` attribute to connect labels with inputs
2. **Clear hierarchy** - Use appropriate label sizes for form structure
3. **Consistent indicators** - Use required/optional consistently across forms
4. **Descriptive text** - Make labels clear and descriptive
5. **Group related fields** - Use fieldsets for related form sections
6. **Test accessibility** - Verify with screen readers and keyboard navigation
7. **Mobile friendly** - Ensure labels are touch-friendly and readable on small screens