# Toggle Component

Switch components for boolean values with smooth animations, labels, and comprehensive styling options.

## Basic Usage

```blade
{{-- Simple toggle --}}
<x-keys::toggle name="notifications" />

{{-- Toggle with label --}}
<x-keys::toggle name="email_alerts" label="Email Alerts" />

{{-- Pre-checked toggle --}}
<x-keys::toggle name="auto_save" label="Auto Save" checked />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Toggle name attribute |
| `label` | string | `null` | Toggle label text |
| `description` | string | `null` | Optional description text |
| `checked` | boolean | `false` | Pre-checked state |
| `disabled` | boolean | `false` | Disable toggle |
| `size` | string | `md` | Size: `sm`, `md`, `lg` |
| `color` | string | `brand` | Color: `brand`, `success`, `warning`, `danger` |
| `required` | boolean | `false` | Mark as required |
| `errors` | object | `null` | Validation errors |

## Size Variants

```blade
<div class="space-y-4">
    <x-keys::toggle size="sm" label="Small Toggle" />
    <x-keys::toggle size="md" label="Medium Toggle" />
    <x-keys::toggle size="lg" label="Large Toggle" />
</div>
```

## Color Variants

```blade
<div class="space-y-4">
    <x-keys::toggle color="brand" label="Brand Color" checked />
    <x-keys::toggle color="success" label="Success Color" checked />
    <x-keys::toggle color="warning" label="Warning Color" checked />
    <x-keys::toggle color="danger" label="Danger Color" checked />
</div>
```

## Toggle with Description

```blade
<x-keys::toggle
    name="notifications"
    label="Push Notifications"
    description="Receive instant notifications about important updates"
    checked
/>

<x-keys::toggle
    name="marketing"
    label="Marketing Emails"
    description="Get updates about new features and promotions"
/>
```

## Use Cases

### Settings Panel
```blade
<x-keys::card variant="padded">
    <h3 class="text-lg font-semibold mb-6">Notification Settings</h3>

    <div class="space-y-6">
        <x-keys::toggle
            name="email_notifications"
            label="Email Notifications"
            description="Receive updates and alerts via email"
            :checked="$user->email_notifications"
        />

        <x-keys::toggle
            name="push_notifications"
            label="Push Notifications"
            description="Get browser and mobile push notifications"
            :checked="$user->push_notifications"
        />

        <x-keys::toggle
            name="sms_notifications"
            label="SMS Notifications"
            description="Receive text messages for urgent alerts"
            :checked="$user->sms_notifications"
        />

        <x-keys::toggle
            name="marketing_emails"
            label="Marketing Communications"
            description="Stay updated with news, features, and promotions"
            :checked="$user->marketing_emails"
        />
    </div>
</x-keys::card>
```

### Privacy Controls
```blade
<div class="space-y-6">
    <section>
        <h3 class="text-lg font-semibold mb-4">Privacy & Security</h3>
        <div class="space-y-4">
            <x-keys::toggle
                name="profile_public"
                label="Public Profile"
                description="Make your profile visible to other users"
                :checked="$user->profile_public"
            />

            <x-keys::toggle
                name="show_online_status"
                label="Show Online Status"
                description="Let others see when you're active"
                :checked="$user->show_online_status"
            />

            <x-keys::toggle
                name="two_factor_auth"
                label="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
                color="success"
                :checked="$user->two_factor_enabled"
            />
        </div>
    </section>

    <section>
        <h3 class="text-lg font-semibold mb-4">Data & Analytics</h3>
        <div class="space-y-4">
            <x-keys::toggle
                name="analytics_tracking"
                label="Analytics Tracking"
                description="Help us improve by sharing anonymous usage data"
                :checked="$user->analytics_enabled"
            />

            <x-keys::toggle
                name="personalization"
                label="Personalized Experience"
                description="Customize your experience based on your activity"
                :checked="$user->personalization_enabled"
            />
        </div>
    </section>
</div>
```

### Feature Toggles
```blade
<x-keys::card variant="bordered">
    <div class="p-6">
        <h3 class="font-semibold mb-4">Feature Access</h3>

        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <div class="font-medium">Advanced Analytics</div>
                    <div class="text-sm text-neutral-600">Access detailed reporting and insights</div>
                </div>
                <x-keys::toggle
                    name="analytics_enabled"
                    :checked="$subscription->has_analytics"
                    :disabled="!$subscription->can_enable_analytics"
                />
            </div>

            <div class="flex items-center justify-between">
                <div>
                    <div class="font-medium">API Access</div>
                    <div class="text-sm text-neutral-600">Integrate with external applications</div>
                </div>
                <x-keys::toggle
                    name="api_enabled"
                    :checked="$subscription->has_api"
                    :disabled="!$subscription->can_enable_api"
                />
            </div>

            <div class="flex items-center justify-between">
                <div>
                    <div class="font-medium">Priority Support</div>
                    <div class="text-sm text-neutral-600">Get faster response times</div>
                </div>
                <x-keys::toggle
                    name="priority_support"
                    :checked="$subscription->has_priority_support"
                    color="success"
                />
            </div>
        </div>
    </div>
</x-keys::card>
```

### Application Settings
```blade
<form method="POST" action="{{ route('settings.update') }}">
    @csrf

    <div class="space-y-8">
        <section>
            <h2 class="text-xl font-bold mb-6">Application Preferences</h2>

            <div class="space-y-6">
                <x-keys::toggle
                    name="dark_mode"
                    label="Dark Mode"
                    description="Use dark theme across the application"
                    :checked="old('dark_mode', $settings->dark_mode)"
                    :errors="$errors"
                />

                <x-keys::toggle
                    name="auto_save"
                    label="Auto Save"
                    description="Automatically save your work every few minutes"
                    :checked="old('auto_save', $settings->auto_save)"
                    :errors="$errors"
                />

                <x-keys::toggle
                    name="compact_mode"
                    label="Compact Mode"
                    description="Use a more condensed layout to fit more content"
                    :checked="old('compact_mode', $settings->compact_mode)"
                    :errors="$errors"
                />

                <x-keys::toggle
                    name="keyboard_shortcuts"
                    label="Keyboard Shortcuts"
                    description="Enable keyboard shortcuts for faster navigation"
                    :checked="old('keyboard_shortcuts', $settings->keyboard_shortcuts)"
                    :errors="$errors"
                />
            </div>
        </section>

        <div class="flex justify-end">
            <x-keys::button type="submit" variant="brand">
                Save Settings
            </x-keys::button>
        </div>
    </div>
</form>
```

### Real-time Controls
```blade
<div class="space-y-4">
    <div class="flex items-center justify-between p-4 border rounded-lg">
        <div>
            <div class="font-medium">Live Updates</div>
            <div class="text-sm text-neutral-600">Automatically refresh data</div>
        </div>
        <x-keys::toggle
            name="live_updates"
            wire:model.live="liveUpdates"
            color="success"
        />
    </div>

    <div class="flex items-center justify-between p-4 border rounded-lg">
        <div>
            <div class="font-medium">Sound Effects</div>
            <div class="text-sm text-neutral-600">Play notification sounds</div>
        </div>
        <x-keys::toggle
            name="sound_effects"
            wire:model.live="soundEffects"
        />
    </div>

    <div class="flex items-center justify-between p-4 border rounded-lg">
        <div>
            <div class="font-medium">Maintenance Mode</div>
            <div class="text-sm text-neutral-600">Temporarily disable public access</div>
        </div>
        <x-keys::toggle
            name="maintenance_mode"
            wire:model.live="maintenanceMode"
            color="warning"
            :disabled="!auth()->user()->isAdmin()"
        />
    </div>
</div>
```

### Permission Toggles
```blade
<x-keys::card variant="padded">
    <h3 class="font-semibold mb-4">User Permissions</h3>

    <div class="space-y-4">
        @foreach($permissions as $permission)
            <div class="flex items-center justify-between">
                <div>
                    <div class="font-medium">{{ $permission->name }}</div>
                    <div class="text-sm text-neutral-600">{{ $permission->description }}</div>
                </div>
                <x-keys::toggle
                    name="permissions[{{ $permission->id }}]"
                    :checked="$user->hasPermission($permission)"
                    :color="$permission->is_critical ? 'danger' : 'brand'"
                />
            </div>
        @endforeach
    </div>
</x-keys::card>
```

## Form Integration

### Laravel Forms
```blade
<form method="POST">
    @csrf

    <div class="space-y-6">
        <x-keys::toggle
            name="newsletter"
            label="Subscribe to Newsletter"
            description="Receive weekly updates about new features"
            :checked="old('newsletter')"
            :errors="$errors"
        />

        <x-keys::toggle
            name="terms"
            label="I agree to the Terms of Service"
            required
            :errors="$errors"
        />

        <x-keys::button type="submit" variant="brand">
            Create Account
        </x-keys::button>
    </div>
</form>
```

### Livewire Integration
```blade
<div>
    <x-keys::toggle
        name="feature_enabled"
        label="Enable Feature"
        wire:model.live="featureEnabled"
    />

    @if($featureEnabled)
        <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-700">Feature is now enabled!</p>
        </div>
    @endif
</div>
```

### Alpine.js Integration
```blade
<div x-data="{ darkMode: false }">
    <x-keys::toggle
        name="dark_mode"
        label="Dark Mode"
        x-model="darkMode"
        @change="document.documentElement.classList.toggle('dark', darkMode)"
    />

    <div class="mt-4">
        <p x-text="darkMode ? 'Dark mode is enabled' : 'Light mode is enabled'"></p>
    </div>
</div>
```

## Validation States

```blade
{{-- Required toggle with error --}}
<x-keys::toggle
    name="agreement"
    label="I agree to the terms"
    required
    :errors="$errors"
/>

{{-- Success state --}}
<x-keys::toggle
    name="verified"
    label="Account Verified"
    checked
    color="success"
    disabled
/>
```

## Accessibility

- Proper ARIA attributes for screen readers
- Keyboard navigation support (Space to toggle)
- Focus management and visual indicators
- Label associations for accessibility
- High contrast mode support

## Data Attributes

```html
<label
    data-keys-toggle="true"
    data-size="md"
    data-color="brand"
    data-checked="true"
    data-disabled="false"
>
```

## JavaScript Integration

```javascript
// Target all toggles
document.querySelectorAll('[data-keys-toggle]')

// Handle toggle change events
toggle.addEventListener('change', function() {
    console.log('Toggle changed:', this.checked);

    // Custom event
    this.dispatchEvent(new CustomEvent('toggle:changed', {
        detail: { checked: this.checked, name: this.name }
    }));
});

// Programmatic toggle
function toggleSwitch(toggleName, state) {
    const toggle = document.querySelector(`[name="${toggleName}"]`);
    if (toggle) {
        toggle.checked = state;
        toggle.dispatchEvent(new Event('change'));
    }
}

// Listen for toggle events
document.addEventListener('toggle:changed', function(event) {
    console.log('Toggle state changed:', event.detail);

    // Save setting, update UI, etc.
    saveSetting(event.detail.name, event.detail.checked);
});
```

## CSS Customization

```css
/* Custom toggle animations */
[data-keys-toggle] .toggle-slider {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

[data-keys-toggle][data-checked="true"] .toggle-slider {
    transform: translateX(100%);
}

/* Custom color variants */
[data-keys-toggle][data-color="custom"] input:checked + .toggle-track {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Size customization */
[data-keys-toggle][data-size="xl"] {
    --toggle-width: 3rem;
    --toggle-height: 1.75rem;
    --toggle-slider-size: 1.5rem;
}

/* Disabled state styling */
[data-keys-toggle][data-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
}
```

## Best Practices

1. **Use clear labels** - Always provide descriptive text
2. **Add descriptions when helpful** - Explain what the toggle controls
3. **Group related toggles** - Organize settings logically
4. **Handle loading states** - Show feedback for async operations
5. **Provide immediate feedback** - Show changes take effect instantly
6. **Consider permissions** - Disable toggles users can't control
7. **Test accessibility** - Ensure keyboard and screen reader support