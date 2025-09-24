# Alert Component

Notification messages with variants, icons, and dismissible functionality for user feedback and system status.

## Basic Usage

```blade
{{-- Simple alert --}}
<x-keys::alert>This is a basic alert message.</x-keys::alert>

{{-- Alert with variant --}}
<x-keys::alert variant="success">
    Your changes have been saved successfully!
</x-keys::alert>

{{-- Alert with icon --}}
<x-keys::alert variant="warning" icon="heroicon-o-exclamation-triangle">
    Please review your settings before continuing.
</x-keys::alert>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `info` | Variant: `info`, `success`, `warning`, `danger` |
| `size` | string | `md` | Size: `sm`, `md`, `lg` |
| `icon` | string | auto | Heroicon name (auto-selected based on variant if not provided) |
| `title` | string | `null` | Alert title text |
| `dismissible` | boolean | `false` | Enable dismiss functionality |
| `id` | string | auto | Custom ID (auto-generated for dismissible alerts) |

## Variants

### Info Alert (Default)
```blade
<x-keys::alert variant="info">
    This is an informational message to help guide the user.
</x-keys::alert>

<x-keys::alert variant="info" title="Information">
    Here's some helpful information about this feature.
</x-keys::alert>
```

### Success Alert
```blade
<x-keys::alert variant="success">
    Your profile has been updated successfully!
</x-keys::alert>

<x-keys::alert variant="success" title="Success!" dismissible>
    The operation completed without any errors.
</x-keys::alert>
```

### Warning Alert
```blade
<x-keys::alert variant="warning">
    Your session will expire in 5 minutes.
</x-keys::alert>

<x-keys::alert variant="warning" title="Warning" dismissible>
    Some features may not work properly with your current browser.
</x-keys::alert>
```

### Danger Alert
```blade
<x-keys::alert variant="danger">
    An error occurred while processing your request.
</x-keys::alert>

<x-keys::alert variant="danger" title="Error" dismissible>
    Failed to connect to the server. Please try again later.
</x-keys::alert>
```

## Size Variants

```blade
{{-- Small alert --}}
<x-keys::alert variant="info" size="sm">
    Small alert message for compact spaces.
</x-keys::alert>

{{-- Medium alert (default) --}}
<x-keys::alert variant="success" size="md">
    Medium-sized alert with standard spacing.
</x-keys::alert>

{{-- Large alert --}}
<x-keys::alert variant="warning" size="lg" title="Important Notice">
    Large alert with more prominent display and generous spacing.
</x-keys::alert>
```

## Custom Icons

```blade
{{-- Custom icon (overrides variant default) --}}
<x-keys::alert variant="info" icon="heroicon-o-light-bulb">
    Here's a helpful tip to improve your workflow!
</x-keys::alert>

{{-- No icon --}}
<x-keys::alert variant="success" :icon="null">
    Success message without an icon.
</x-keys::alert>

{{-- Brand-specific icons --}}
<x-keys::alert variant="info" icon="heroicon-o-star">
    You've unlocked a new achievement!
</x-keys::alert>
```

## Alert with Title

```blade
<x-keys::alert variant="warning" title="Maintenance Notice">
    The system will be undergoing scheduled maintenance from 2:00 AM to 4:00 AM UTC.
    Some features may be temporarily unavailable during this time.
</x-keys::alert>

<x-keys::alert variant="danger" title="Account Suspended" dismissible>
    Your account has been temporarily suspended due to suspicious activity.
    Please contact support to resolve this issue.
</x-keys::alert>
```

## Dismissible Alerts

```blade
{{-- Basic dismissible alert --}}
<x-keys::alert variant="success" dismissible>
    Your message has been sent successfully!
</x-keys::alert>

{{-- Dismissible with title --}}
<x-keys::alert variant="info" title="New Feature Available" dismissible>
    We've added a new collaboration feature to help you work better with your team.
</x-keys::alert>

{{-- Custom dismissible ID --}}
<x-keys::alert variant="warning" dismissible id="cookie-notice">
    This website uses cookies to enhance your browsing experience.
</x-keys::alert>
```

## Use Cases

### Form Validation Messages
```blade
@if($errors->any())
    <x-keys::alert variant="danger" title="Please fix the following errors:" dismissible>
        <ul class="mt-2 list-disc list-inside space-y-1">
            @foreach($errors->all() as $error)
                <li class="text-sm">{{ $error }}</li>
            @endforeach
        </ul>
    </x-keys::alert>
@endif

@if(session('success'))
    <x-keys::alert variant="success" dismissible>
        {{ session('success') }}
    </x-keys::alert>
@endif
```

### System Status Messages
```blade
{{-- Server status --}}
<x-keys::alert variant="success" icon="heroicon-o-server">
    All systems operational. Last updated: {{ now()->format('H:i') }}
</x-keys::alert>

{{-- Maintenance mode --}}
<x-keys::alert variant="warning" title="Scheduled Maintenance">
    We'll be performing system updates tonight from 11 PM to 2 AM EST.
</x-keys::alert>

{{-- Service disruption --}}
<x-keys::alert variant="danger" title="Service Disruption" dismissible>
    We're experiencing issues with our payment processor. Orders may be delayed.
</x-keys::alert>
```

### Feature Announcements
```blade
<x-keys::alert variant="info" title="New Feature: Dark Mode!" dismissible>
    You can now switch between light and dark themes in your profile settings.
    <div class="mt-3">
        <x-keys::button variant="brand" size="sm">Try It Now</x-keys::button>
    </div>
</x-keys::alert>
```

### Onboarding Messages
```blade
<x-keys::alert variant="info" title="Welcome to the Platform!" dismissible>
    Here are some quick tips to get you started:
    <ul class="mt-2 list-disc list-inside space-y-1 text-sm">
        <li>Complete your profile to unlock all features</li>
        <li>Invite team members to collaborate</li>
        <li>Explore our help center for tutorials</li>
    </ul>
</x-keys::alert>
```

### Security Notifications
```blade
<x-keys::alert variant="warning" title="Security Alert" dismissible>
    We detected a new login from an unrecognized device.
    If this wasn't you, please change your password immediately.
    <div class="mt-3 flex gap-2">
        <x-keys::button variant="warning" size="sm">Change Password</x-keys::button>
        <x-keys::button variant="ghost" size="sm">This Was Me</x-keys::button>
    </div>
</x-keys::alert>
```

### Progress Updates
```blade
<x-keys::alert variant="info" icon="heroicon-o-clock">
    Your report is being generated. This may take a few minutes.
    <div class="mt-3">
        <x-keys::progress value="45" max="100" size="sm" />
        <p class="text-xs mt-1">Processing... 45% complete</p>
    </div>
</x-keys::alert>
```

## Form Integration

### Laravel Flash Messages
```blade
{{-- In your controller --}}
return redirect()->back()->with('alert', [
    'variant' => 'success',
    'title' => 'Profile Updated',
    'message' => 'Your profile information has been saved successfully.',
    'dismissible' => true
]);

{{-- In your Blade template --}}
@if(session('alert'))
    @php $alert = session('alert'); @endphp
    <x-keys::alert
        :variant="$alert['variant']"
        :title="$alert['title'] ?? null"
        :dismissible="$alert['dismissible'] ?? false"
    >
        {{ $alert['message'] }}
    </x-keys::alert>
@endif
```

### Livewire Integration
```blade
{{-- In Livewire component --}}
<div>
    @if($alert)
        <x-keys::alert
            :variant="$alert['variant']"
            :title="$alert['title'] ?? null"
            dismissible
            wire:click="dismissAlert"
        >
            {{ $alert['message'] }}
        </x-keys::alert>
    @endif

    {{-- Rest of component --}}
</div>
```

## Accessibility

- Proper ARIA roles and attributes
- Screen reader announcements for alerts
- Keyboard navigation for dismissible alerts
- High contrast mode support
- Focus management for interactive elements

## Data Attributes

```html
<div
    data-keys-alert="true"
    data-variant="success"
    data-size="md"
    data-has-icon="true"
    data-has-title="true"
    data-dismissible="true"
>
```

## JavaScript Integration

```javascript
// Target dismissible alerts
document.querySelectorAll('[data-keys-alert][data-dismissible="true"]')

// Handle dismiss events
alert.addEventListener('click', function(e) {
    if (e.target.matches('.dismiss-button')) {
        this.remove();

        // Custom event
        document.dispatchEvent(new CustomEvent('alert:dismissed', {
            detail: { id: this.id, variant: this.dataset.variant }
        }));
    }
});

// Auto-dismiss alerts
function autoDismissAlert(alertId, delay = 5000) {
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.remove();
        }
    }, delay);
}

// Show programmatic alert
function showAlert(variant, message, title = null, dismissible = true) {
    const alertHtml = `
        <x-keys::alert
            variant="${variant}"
            ${title ? `title="${title}"` : ''}
            ${dismissible ? 'dismissible' : ''}
        >${message}</x-keys::alert>
    `;

    document.querySelector('#alerts-container').insertAdjacentHTML('beforeend', alertHtml);
}
```

## CSS Customization

```css
/* Custom alert animations */
[data-keys-alert] {
    animation: slideInDown 0.3s ease-out;
}

@keyframes slideInDown {
    from {
        transform: translateY(-1rem);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Custom variant styles */
[data-keys-alert][data-variant="custom"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

/* Dismiss button hover effects */
[data-keys-alert] .dismiss-button:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease;
}

/* Auto-hide animation */
[data-keys-alert].auto-hide {
    animation: fadeOut 0.5s ease-out forwards;
}

@keyframes fadeOut {
    to {
        opacity: 0;
        transform: translateY(-1rem);
    }
}
```

## Best Practices

1. **Use appropriate variants** - Match the alert variant to the message type
2. **Keep messages concise** - Use clear, actionable language
3. **Provide actions when relevant** - Include buttons for next steps
4. **Make dismissible when appropriate** - Allow users to close non-critical alerts
5. **Position strategically** - Place alerts where users expect feedback
6. **Avoid alert fatigue** - Don't overwhelm users with too many alerts