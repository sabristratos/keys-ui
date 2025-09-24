# Accordion Component

Collapsible content sections with rich styling options, animations, and action support for organizing information hierarchically.

## Basic Usage

```blade
{{-- Simple accordion --}}
<x-keys::accordion title="Frequently Asked Questions">
    <p>Here are the most commonly asked questions about our service...</p>
</x-keys::accordion>

{{-- Accordion with custom icon --}}
<x-keys::accordion title="Settings" icon="heroicon-o-cog-6-tooth">
    <div class="space-y-4">
        <x-keys::checkbox name="notifications" label="Enable notifications" />
        <x-keys::checkbox name="auto_save" label="Auto-save changes" />
    </div>
</x-keys::accordion>

{{-- Initially collapsed --}}
<x-keys::accordion title="Advanced Options" :collapsed="true">
    <p>These are advanced configuration options...</p>
</x-keys::accordion>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | `null` | Accordion header title |
| `id` | string | auto | Unique accordion identifier |
| `icon` | string | `heroicon-o-chevron-down` | Header icon (Heroicon name) |
| `collapsed` | boolean | `false` | Initially collapsed state |
| `disabled` | boolean | `false` | Disable accordion interaction |
| `color` | string | `neutral` | Color theme: `brand`, `success`, `warning`, `danger`, `neutral` |
| `size` | string | `md` | Size variant: `xs`, `sm`, `md`, `lg` |
| `variant` | string | `default` | Style variant: `default`, `flush`, `spaced`, `outlined`, `elevated` |
| `rounded` | string | `lg` | Border radius: `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` |
| `actions` | array | `[]` | Header action buttons configuration |
| `action-variant` | string | `ghost` | Default variant for action buttons |
| `action-size` | string | `xs` | Default size for action buttons |
| `animated` | boolean | `true` | Enable collapse/expand animations |

## Variant Styles

### Default
```blade
<x-keys::accordion variant="default" title="Default Style">
    <p>Content with standard background and border.</p>
</x-keys::accordion>
```

### Flush
```blade
<x-keys::accordion variant="flush" title="Flush Style">
    <p>Minimal styling without background or borders.</p>
</x-keys::accordion>
```

### Spaced
```blade
<x-keys::accordion variant="spaced" title="Spaced Style">
    <p>Individual accordions with spacing between them.</p>
</x-keys::accordion>
```

### Outlined
```blade
<x-keys::accordion variant="outlined" title="Outlined Style">
    <p>Transparent background with border outline.</p>
</x-keys::accordion>
```

### Elevated
```blade
<x-keys::accordion variant="elevated" title="Elevated Style">
    <p>Raised appearance with shadow for depth.</p>
</x-keys::accordion>
```

## Color Themes

```blade
<div class="space-y-4">
    <x-keys::accordion color="brand" title="Brand Accordion">
        <p>Content with brand color theming.</p>
    </x-keys::accordion>

    <x-keys::accordion color="success" title="Success Accordion">
        <p>Content with success color theming.</p>
    </x-keys::accordion>

    <x-keys::accordion color="warning" title="Warning Accordion">
        <p>Content with warning color theming.</p>
    </x-keys::accordion>

    <x-keys::accordion color="danger" title="Danger Accordion">
        <p>Content with danger color theming.</p>
    </x-keys::accordion>
</div>
```

## Size Variants

```blade
<div class="space-y-4">
    <x-keys::accordion size="xs" title="Extra Small">
        <p>Compact accordion with minimal padding.</p>
    </x-keys::accordion>

    <x-keys::accordion size="sm" title="Small">
        <p>Small accordion with reduced padding.</p>
    </x-keys::accordion>

    <x-keys::accordion size="md" title="Medium (Default)">
        <p>Standard accordion size.</p>
    </x-keys::accordion>

    <x-keys::accordion size="lg" title="Large">
        <p>Large accordion with increased padding.</p>
    </x-keys::accordion>
</div>
```

## Header Actions

```blade
{{-- Accordion with action buttons --}}
<x-keys::accordion
    title="Document Settings"
    :actions="[
        [
            'type' => 'edit',
            'icon' => 'heroicon-o-pencil',
            'label' => 'Edit',
            'url' => '/edit'
        ],
        [
            'type' => 'favorite',
            'icon' => 'heroicon-o-heart',
            'icon_toggle' => 'heroicon-s-heart',
            'label' => 'Favorite'
        ],
        [
            'type' => 'delete',
            'icon' => 'heroicon-o-trash',
            'label' => 'Delete'
        ]
    ]"
    action-variant="ghost"
    action-size="sm"
>
    <div class="space-y-4">
        <x-keys::input name="title" label="Document Title" />
        <x-keys::textarea name="description" label="Description" />
    </div>
</x-keys::accordion>
```

## Use Cases

### FAQ Section
```blade
<div class="space-y-3">
    <h2 class="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

    <x-keys::accordion variant="spaced" title="What is your refund policy?">
        <p class="text-neutral-700">We offer a 30-day money-back guarantee for all our services. If you're not satisfied with your purchase, you can request a full refund within 30 days of your initial payment.</p>
    </x-keys::accordion>

    <x-keys::accordion variant="spaced" title="How do I cancel my subscription?">
        <div class="space-y-3">
            <p class="text-neutral-700">You can cancel your subscription at any time by:</p>
            <ol class="list-decimal list-inside space-y-1 ml-4">
                <li>Going to your account settings</li>
                <li>Clicking on "Subscription"</li>
                <li>Selecting "Cancel Subscription"</li>
                <li>Confirming your cancellation</li>
            </ol>
            <p class="text-neutral-700">Your access will continue until the end of your current billing period.</p>
        </div>
    </x-keys::accordion>

    <x-keys::accordion variant="spaced" title="Do you offer technical support?">
        <p class="text-neutral-700">Yes! We provide 24/7 technical support through email, live chat, and phone. Premium customers also get priority support with faster response times.</p>
    </x-keys::accordion>
</div>
```

### Settings Panel
```blade
<div class="max-w-2xl space-y-4">
    <h2 class="text-xl font-semibold mb-6">Application Settings</h2>

    <x-keys::accordion
        variant="outlined"
        color="brand"
        title="General Settings"
        icon="heroicon-o-cog-6-tooth"
    >
        <div class="space-y-4">
            <x-keys::input name="app_name" label="Application Name" value="My App" />
            <x-keys::select name="language" label="Default Language">
                <x-keys::select.option value="en" label="English" />
                <x-keys::select.option value="es" label="Spanish" />
                <x-keys::select.option value="fr" label="French" />
            </x-keys::select>
            <x-keys::checkbox name="maintenance_mode" label="Enable maintenance mode" />
        </div>
    </x-keys::accordion>

    <x-keys::accordion
        variant="outlined"
        color="brand"
        title="Notification Settings"
        icon="heroicon-o-bell"
    >
        <div class="space-y-4">
            <x-keys::checkbox name="email_notifications" label="Email notifications" />
            <x-keys::checkbox name="push_notifications" label="Push notifications" />
            <x-keys::checkbox name="sms_notifications" label="SMS notifications" />
            <x-keys::select name="notification_frequency" label="Frequency">
                <x-keys::select.option value="immediate" label="Immediate" />
                <x-keys::select.option value="daily" label="Daily digest" />
                <x-keys::select.option value="weekly" label="Weekly digest" />
            </x-keys::select>
        </div>
    </x-keys::accordion>

    <x-keys::accordion
        variant="outlined"
        color="brand"
        title="Security Settings"
        icon="heroicon-o-shield-check"
    >
        <div class="space-y-4">
            <x-keys::checkbox name="two_factor" label="Enable two-factor authentication" />
            <x-keys::checkbox name="session_timeout" label="Automatic session timeout" />
            <x-keys::input name="password_change" label="Password change interval (days)" type="number" />
        </div>
    </x-keys::accordion>
</div>
```

### Documentation Sections
```blade
<article class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">API Documentation</h1>

    <x-keys::accordion
        variant="elevated"
        size="lg"
        title="Authentication"
        icon="heroicon-o-key"
    >
        <div class="prose max-w-none">
            <p>All API requests require authentication using an API key or OAuth token.</p>
            <h4>API Key Authentication</h4>
            <pre class="bg-neutral-100 p-3 rounded"><code>Authorization: Bearer YOUR_API_KEY</code></pre>
            <h4>OAuth Authentication</h4>
            <p>For OAuth, include the access token in the Authorization header...</p>
        </div>
    </x-keys::accordion>

    <x-keys::accordion
        variant="elevated"
        size="lg"
        title="Rate Limiting"
        icon="heroicon-o-clock"
    >
        <div class="prose max-w-none">
            <p>API requests are limited to prevent abuse and ensure service availability.</p>
            <ul>
                <li>Free tier: 1,000 requests per hour</li>
                <li>Pro tier: 10,000 requests per hour</li>
                <li>Enterprise: Custom limits</li>
            </ul>
        </div>
    </x-keys::accordion>

    <x-keys::accordion
        variant="elevated"
        size="lg"
        title="Error Handling"
        icon="heroicon-o-exclamation-triangle"
    >
        <div class="prose max-w-none">
            <p>The API uses conventional HTTP response codes to indicate success or failure.</p>
            <table class="min-w-full">
                <thead>
                    <tr>
                        <th>Status Code</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>200</td>
                        <td>Success</td>
                    </tr>
                    <tr>
                        <td>400</td>
                        <td>Bad Request</td>
                    </tr>
                    <tr>
                        <td>401</td>
                        <td>Unauthorized</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </x-keys::accordion>
</div>
```

### Task Management
```blade
<div class="space-y-4">
    @foreach($projects as $project)
        <x-keys::accordion
            variant="default"
            :title="$project->name"
            :actions="[
                [
                    'type' => 'edit',
                    'icon' => 'heroicon-o-pencil',
                    'label' => 'Edit Project'
                ],
                [
                    'type' => 'archive',
                    'icon' => 'heroicon-o-archive-box',
                    'icon_toggle' => 'heroicon-o-archive-box-arrow-down',
                    'label' => 'Archive'
                ]
            ]"
        >
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm text-neutral-600">Progress</span>
                    <span class="text-sm font-medium">{{ $project->completion_percentage }}%</span>
                </div>
                <x-keys::progress :value="$project->completion_percentage" />

                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span class="text-neutral-600">Due Date:</span>
                        <span class="font-medium">{{ $project->due_date->format('M j, Y') }}</span>
                    </div>
                    <div>
                        <span class="text-neutral-600">Tasks:</span>
                        <span class="font-medium">{{ $project->completed_tasks }}/{{ $project->total_tasks }}</span>
                    </div>
                </div>

                <div class="flex gap-2">
                    <x-keys::button size="sm" variant="brand">View Details</x-keys::button>
                    <x-keys::button size="sm" variant="ghost">Add Task</x-keys::button>
                </div>
            </div>
        </x-keys::accordion>
    @endforeach
</div>
```

### Product Information
```blade
<x-keys::accordion
    variant="elevated"
    title="MacBook Pro 16-inch"
    :actions="[
        [
            'type' => 'favorite',
            'icon' => 'heroicon-o-heart',
            'icon_toggle' => 'heroicon-s-heart',
            'label' => 'Add to Favorites'
        ],
        [
            'type' => 'share',
            'icon' => 'heroicon-o-share',
            'label' => 'Share'
        ]
    ]"
>
    <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <img src="/macbook-pro.jpg" alt="MacBook Pro" class="w-full rounded-lg">
            </div>
            <div class="space-y-4">
                <div>
                    <h3 class="font-semibold text-lg">Specifications</h3>
                    <dl class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <dt class="text-neutral-600">Processor:</dt>
                            <dd class="font-medium">M2 Pro chip</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-neutral-600">Memory:</dt>
                            <dd class="font-medium">16GB unified memory</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-neutral-600">Storage:</dt>
                            <dd class="font-medium">512GB SSD</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-neutral-600">Display:</dt>
                            <dd class="font-medium">16.2-inch Liquid Retina XDR</dd>
                        </div>
                    </dl>
                </div>

                <div>
                    <h3 class="font-semibold text-lg mb-2">Price</h3>
                    <div class="text-2xl font-bold text-brand">$2,499</div>
                </div>

                <x-keys::button variant="brand" class="w-full">Add to Cart</x-keys::button>
            </div>
        </div>
    </div>
</x-keys::accordion>
```

## Accessibility

- **Keyboard Navigation**: Full keyboard support with Enter and Space
- **ARIA Support**: Proper ARIA attributes for screen readers
- **Focus Management**: Logical focus order and visual indicators
- **Screen Reader**: Announces expand/collapse state changes
- **High Contrast**: Works with high contrast mode

## Animation Control

```blade
{{-- Disable animations --}}
<x-keys::accordion title="No Animation" :animated="false">
    <p>This accordion doesn't animate when opening/closing.</p>
</x-keys::accordion>

{{-- Custom CSS for different animation styles --}}
<style>
.custom-accordion [data-accordion] {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
```

## JavaScript Integration

```javascript
// Listen for accordion events
document.addEventListener('accordion:opened', function(event) {
    console.log('Accordion opened:', event.detail.id);
});

document.addEventListener('accordion:closed', function(event) {
    console.log('Accordion closed:', event.detail.id);
});

// Programmatically control accordions
function openAccordion(accordionId) {
    const accordion = document.getElementById(accordionId);
    if (accordion) {
        accordion.setAttribute('open', '');
    }
}

function closeAccordion(accordionId) {
    const accordion = document.getElementById(accordionId);
    if (accordion) {
        accordion.removeAttribute('open');
    }
}
```

## CSS Customization

```css
/* Custom accordion styling */
[data-accordion="true"] {
    transition: all 0.2s ease;
}

/* Custom header styling */
[data-accordion="true"] summary {
    cursor: pointer;
    user-select: none;
}

/* Custom content styling */
[data-accordion="true"] .accordion-content {
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-0.5rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Custom color themes */
[data-accordion="true"][data-color="custom"] {
    border-color: #custom-color;
}

[data-accordion="true"][data-color="custom"] summary {
    background-color: rgba(custom-color, 0.1);
}
```

## Best Practices

1. **Clear titles** - Use descriptive, scannable accordion titles
2. **Logical grouping** - Group related content together
3. **Reasonable length** - Keep content within accordions focused
4. **Consistent styling** - Use consistent variants throughout your interface
5. **Action buttons** - Use header actions sparingly for key interactions
6. **Mobile friendly** - Test touch interactions on mobile devices
7. **Accessibility** - Ensure keyboard navigation and screen reader support