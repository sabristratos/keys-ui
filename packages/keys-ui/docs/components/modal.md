# Modal Component

Dialog overlays with animations, Livewire integration, and comprehensive accessibility features for interactive content.

## Basic Usage

```blade
{{-- Simple modal --}}
<x-keys::modal id="basic-modal">
    <h2 class="text-lg font-semibold mb-4">Modal Title</h2>
    <p>This is the modal content.</p>

    <div class="flex justify-end gap-2 mt-6">
        <x-keys::button variant="ghost" onclick="closeModal('basic-modal')">Cancel</x-keys::button>
        <x-keys::button variant="brand">Confirm</x-keys::button>
    </div>
</x-keys::modal>

{{-- Modal trigger --}}
<x-keys::button onclick="openModal('basic-modal')">Open Modal</x-keys::button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | required | Unique modal identifier |
| `size` | string | `md` | Size: `sm`, `md`, `lg`, `xl`, `full` |
| `animate` | boolean | `true` | Enable open/close animations |
| `scrollable` | boolean | `false` | Enable content scrolling for tall modals |
| `livewire` | boolean | `false` | Enable Livewire-specific optimizations |
| `persistent` | boolean | `false` | Prevent closing by clicking backdrop |
| `closeButton` | boolean | `true` | Show close button in header |

## Size Variants

```blade
{{-- Small modal --}}
<x-keys::modal id="small-modal" size="sm">
    <h3 class="font-semibold mb-2">Confirmation</h3>
    <p class="text-sm">Are you sure you want to delete this item?</p>
    <div class="flex justify-end gap-2 mt-4">
        <x-keys::button variant="ghost" size="sm">Cancel</x-keys::button>
        <x-keys::button variant="danger" size="sm">Delete</x-keys::button>
    </div>
</x-keys::modal>

{{-- Large modal --}}
<x-keys::modal id="large-modal" size="lg" scrollable>
    <h2 class="text-xl font-bold mb-4">User Details</h2>
    <div class="space-y-4">
        <!-- Extensive form content -->
    </div>
</x-keys::modal>

{{-- Full screen modal --}}
<x-keys::modal id="fullscreen-modal" size="full">
    <div class="h-full flex flex-col">
        <header class="border-b pb-4 mb-4">
            <h1 class="text-2xl font-bold">Full Screen Editor</h1>
        </header>
        <main class="flex-1">
            <!-- Editor content -->
        </main>
    </div>
</x-keys::modal>
```

## Modal Types

### Confirmation Modal
```blade
<x-keys::modal id="delete-confirmation" size="sm">
    <div class="text-center">
        <div class="w-12 h-12 mx-auto mb-4 bg-danger-100 rounded-full flex items-center justify-center">
            <x-keys::icon name="heroicon-o-exclamation-triangle" class="w-6 h-6 text-danger-600" />
        </div>

        <h3 class="text-lg font-semibold mb-2">Delete Item</h3>
        <p class="text-neutral-600 mb-6">
            This action cannot be undone. Are you sure you want to delete this item?
        </p>

        <div class="flex justify-center gap-3">
            <x-keys::button variant="ghost" onclick="closeModal('delete-confirmation')">
                Cancel
            </x-keys::button>
            <x-keys::button variant="danger" onclick="confirmDelete()">
                Delete
            </x-keys::button>
        </div>
    </div>
</x-keys::modal>
```

### Form Modal
```blade
<x-keys::modal id="create-user" size="md">
    <h2 class="text-lg font-semibold mb-4">Create New User</h2>

    <form id="user-form" class="space-y-4">
        <x-keys::input
            name="name"
            label="Full Name"
            required
        />

        <x-keys::input
            type="email"
            name="email"
            label="Email Address"
            required
        />

        <x-keys::select
            name="role"
            label="Role"
            required
        >
            <x-keys::select.option value="user" label="User" />
            <x-keys::select.option value="admin" label="Administrator" />
        </x-keys::select>

        <div class="flex justify-end gap-2 pt-4">
            <x-keys::button
                type="button"
                variant="ghost"
                onclick="closeModal('create-user')"
            >
                Cancel
            </x-keys::button>
            <x-keys::button type="submit" variant="brand">
                Create User
            </x-keys::button>
        </div>
    </form>
</x-keys::modal>
```

### Information Modal
```blade
<x-keys::modal id="feature-info" size="lg" scrollable>
    <h2 class="text-xl font-bold mb-4">New Feature: Advanced Analytics</h2>

    <div class="prose max-w-none">
        <p>We're excited to introduce our new Advanced Analytics feature...</p>

        <h3>Key Benefits:</h3>
        <ul>
            <li>Real-time data visualization</li>
            <li>Custom dashboard creation</li>
            <li>Export capabilities</li>
        </ul>

        <h3>Getting Started:</h3>
        <ol>
            <li>Navigate to the Analytics section</li>
            <li>Click "Create Dashboard"</li>
            <li>Select your data sources</li>
        </ol>
    </div>

    <div class="flex justify-end mt-6">
        <x-keys::button variant="brand" onclick="closeModal('feature-info')">
            Got It!
        </x-keys::button>
    </div>
</x-keys::modal>
```

## Livewire Integration

```blade
{{-- Livewire modal component --}}
<x-keys::modal id="livewire-modal" livewire>
    @livewire('user-form-modal')
</x-keys::modal>

{{-- In your Livewire component --}}
<div>
    <h2 class="text-lg font-semibold mb-4">{{ $editing ? 'Edit' : 'Create' }} User</h2>

    <form wire:submit="save" class="space-y-4">
        <x-keys::input
            wire:model="form.name"
            label="Name"
            required
        />

        <x-keys::input
            wire:model="form.email"
            type="email"
            label="Email"
            required
        />

        <div class="flex justify-end gap-2 pt-4">
            <x-keys::button
                type="button"
                variant="ghost"
                wire:click="$dispatch('close-modal')"
            >
                Cancel
            </x-keys::button>
            <x-keys::button
                type="submit"
                variant="brand"
                :loading="$saving"
            >
                {{ $editing ? 'Update' : 'Create' }}
            </x-keys::button>
        </div>
    </form>
</div>
```

## Animation Control

```blade
{{-- Disable animations --}}
<x-keys::modal id="no-animation" :animate="false">
    <p>This modal opens without animation.</p>
</x-keys::modal>

{{-- Custom animation timing --}}
<x-keys::modal id="slow-animation" animate data-animation-duration="500">
    <p>This modal has slower animations.</p>
</x-keys::modal>
```

## Scrollable Content

```blade
<x-keys::modal id="long-content" size="md" scrollable>
    <h2 class="text-lg font-semibold mb-4">Terms of Service</h2>

    <div class="space-y-4 text-sm">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        <!-- Long content that requires scrolling -->
    </div>

    <div class="sticky bottom-0 bg-white pt-4 border-t mt-6">
        <div class="flex justify-end gap-2">
            <x-keys::button variant="ghost">Decline</x-keys::button>
            <x-keys::button variant="brand">Accept</x-keys::button>
        </div>
    </div>
</x-keys::modal>
```

## Persistent Modal

```blade
{{-- Cannot be closed by clicking backdrop or pressing Escape --}}
<x-keys::modal id="important-notice" persistent>
    <div class="text-center">
        <h2 class="text-lg font-semibold mb-4">Important Security Update</h2>
        <p class="mb-6">You must change your password before continuing.</p>

        <x-keys::button variant="brand" onclick="redirectToPasswordChange()">
            Change Password Now
        </x-keys::button>
    </div>
</x-keys::modal>
```

## JavaScript API

### Opening and Closing Modals
```javascript
// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.showModal();
        document.body.classList.add('modal-open');
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.close();
        document.body.classList.remove('modal-open');
    }
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('[data-keys-modal][open]').forEach(modal => {
        modal.close();
    });
    document.body.classList.remove('modal-open');
}
```

### Event Handling
```javascript
// Listen for modal events
document.addEventListener('modal:opened', function(event) {
    console.log('Modal opened:', event.detail.modalId);
});

document.addEventListener('modal:closed', function(event) {
    console.log('Modal closed:', event.detail.modalId);
});

// Programmatic control
const modal = document.getElementById('my-modal');

modal.addEventListener('open', function() {
    // Modal is opening
    this.querySelector('input')?.focus();
});

modal.addEventListener('close', function() {
    // Modal is closing
    // Reset form, clear data, etc.
});
```

## Use Cases

### Image Gallery
```blade
<x-keys::modal id="image-gallery" size="xl">
    <div class="space-y-4">
        <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold">Gallery</h2>
            <div class="text-sm text-neutral-500">1 of 12</div>
        </div>

        <div class="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center">
            <img src="image.jpg" alt="Gallery image" class="max-w-full max-h-full object-contain">
        </div>

        <div class="flex justify-between">
            <x-keys::button variant="ghost" icon="heroicon-o-arrow-left">Previous</x-keys::button>
            <x-keys::button variant="ghost" icon="heroicon-o-arrow-right">Next</x-keys::button>
        </div>
    </div>
</x-keys::modal>
```

### Settings Panel
```blade
<x-keys::modal id="settings-panel" size="lg" scrollable>
    <h2 class="text-xl font-bold mb-6">Settings</h2>

    <div class="space-y-6">
        <section>
            <h3 class="text-lg font-semibold mb-3">Account</h3>
            <div class="space-y-4">
                <x-keys::input label="Display Name" value="John Doe" />
                <x-keys::input type="email" label="Email" value="john@example.com" />
            </div>
        </section>

        <section>
            <h3 class="text-lg font-semibold mb-3">Preferences</h3>
            <div class="space-y-4">
                <x-keys::checkbox label="Email notifications" checked />
                <x-keys::checkbox label="SMS notifications" />
                <x-keys::select label="Theme" value="light">
                    <x-keys::select.option value="light" label="Light" />
                    <x-keys::select.option value="dark" label="Dark" />
                    <x-keys::select.option value="auto" label="System" />
                </x-keys::select>
            </div>
        </section>
    </div>

    <div class="flex justify-end gap-2 pt-6 border-t">
        <x-keys::button variant="ghost">Cancel</x-keys::button>
        <x-keys::button variant="brand">Save Changes</x-keys::button>
    </div>
</x-keys::modal>
```

## Accessibility

- Proper ARIA attributes and roles
- Focus trapping within modal
- Keyboard navigation (Escape to close)
- Screen reader announcements
- Focus restoration when closed
- Backdrop click handling

## Data Attributes

```html
<dialog
    data-keys-modal="true"
    data-size="md"
    data-animate="true"
    data-scrollable="false"
    data-livewire-enabled="true"
    data-persistent="false"
>
```

## CSS Customization

```css
/* Custom modal backdrop */
[data-keys-modal]::backdrop {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
}

/* Custom animation timing */
[data-keys-modal][data-animate="true"] {
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-2rem) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Scrollable content styling */
[data-keys-modal][data-scrollable="true"] .modal-content {
    max-height: 70vh;
    overflow-y: auto;
}

/* Full size modal adjustments */
[data-keys-modal][data-size="full"] {
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
    margin: 0;
}
```

## Best Practices

1. **Use appropriate sizes** - Match modal size to content
2. **Enable scrolling for long content** - Prevent viewport overflow
3. **Provide clear actions** - Always include cancel/close options
4. **Handle loading states** - Show feedback for async operations
5. **Focus management** - Ensure proper focus flow
6. **Mobile optimization** - Test on smaller screens
7. **Escape routes** - Always allow users to cancel or close