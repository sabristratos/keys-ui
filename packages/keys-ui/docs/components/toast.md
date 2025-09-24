# Toast Component

Notification toasts for user feedback with positioning, auto-hide functionality, and animations.

## Basic Usage

```blade
{{-- Toast container (place once in layout) --}}
<x-keys::toast position="top-right" />

{{-- Trigger toasts via JavaScript --}}
<x-keys::button onclick="showToast('success', 'Changes saved!')">
    Save Changes
</x-keys::button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | string | `top-right` | Position: `top-left`, `top-right`, `top-center`, `bottom-left`, `bottom-right`, `bottom-center` |

## Position Variants

```blade
{{-- Top positions --}}
<x-keys::toast position="top-left" />
<x-keys::toast position="top-center" />
<x-keys::toast position="top-right" />

{{-- Bottom positions --}}
<x-keys::toast position="bottom-left" />
<x-keys::toast position="bottom-center" />
<x-keys::toast position="bottom-right" />
```

## JavaScript API

### Basic Toast Creation
```javascript
// Show simple toast
showToast('success', 'Operation completed successfully!');

// Toast with title
showToast('warning', 'Please review your settings', 'Warning');

// Toast with options
showToast('info', 'New feature available', 'Update', {
    autoHide: true,
    timeout: 5000,
    dismissible: true
});
```

### Toast Types
```javascript
// Success toast
showToast('success', 'Changes saved successfully!');

// Error toast
showToast('error', 'Failed to save changes');

// Warning toast
showToast('warning', 'Please review your input');

// Info toast
showToast('info', 'New notification received');
```

### Advanced Options
```javascript
// Persistent toast (no auto-hide)
showToast('error', 'Critical error occurred', 'Error', {
    autoHide: false,
    dismissible: true
});

// Toast with custom timeout
showToast('success', 'File uploaded', 'Upload Complete', {
    timeout: 3000
});

// Toast with action button
showToast('info', 'New update available', 'Update Ready', {
    action: {
        text: 'Install Now',
        callback: () => installUpdate()
    }
});
```

## Use Cases

### Form Feedback
```blade
{{-- In your layout --}}
<x-keys::toast position="top-right" />

{{-- In your Livewire component --}}
<form wire:submit="save">
    <x-keys::input wire:model="name" label="Name" />
    <x-keys::button type="submit" :loading="$saving">Save</x-keys::button>
</form>

<script>
document.addEventListener('livewire:init', () => {
    Livewire.on('user-saved', (event) => {
        showToast('success', 'User saved successfully!');
    });

    Livewire.on('save-failed', (event) => {
        showToast('error', event.message || 'Failed to save user');
    });
});
</script>
```

### API Response Handling
```javascript
// Axios interceptor for API responses
axios.interceptors.response.use(
    response => {
        if (response.data.message) {
            showToast('success', response.data.message);
        }
        return response;
    },
    error => {
        const message = error.response?.data?.message || 'An error occurred';
        showToast('error', message);
        return Promise.reject(error);
    }
);
```

### Real-time Notifications
```javascript
// Echo/WebSocket integration
Echo.private(`user.${userId}`)
    .notification((notification) => {
        showToast('info', notification.message, notification.title, {
            timeout: 8000,
            action: notification.action_url ? {
                text: 'View',
                callback: () => window.location.href = notification.action_url
            } : null
        });
    });
```

### Bulk Operations
```javascript
// Progress updates during bulk operation
async function processBulkOperation(items) {
    const toastId = showToast('info', 'Processing items...', 'Bulk Operation', {
        autoHide: false,
        progress: true
    });

    for (let i = 0; i < items.length; i++) {
        await processItem(items[i]);
        updateToastProgress(toastId, (i + 1) / items.length * 100);
    }

    updateToast(toastId, {
        variant: 'success',
        title: 'Complete',
        message: `Processed ${items.length} items successfully`,
        autoHide: true,
        timeout: 3000
    });
}
```

### File Upload Feedback
```javascript
// File upload with progress
function uploadFile(file) {
    const toastId = showToast('info', 'Uploading file...', file.name, {
        autoHide: false,
        progress: true
    });

    const formData = new FormData();
    formData.append('file', file);

    axios.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            updateToastProgress(toastId, progress);
        }
    })
    .then(response => {
        updateToast(toastId, {
            variant: 'success',
            title: 'Upload Complete',
            message: 'File uploaded successfully',
            autoHide: true,
            timeout: 3000
        });
    })
    .catch(error => {
        updateToast(toastId, {
            variant: 'error',
            title: 'Upload Failed',
            message: error.response?.data?.message || 'Failed to upload file',
            autoHide: true,
            timeout: 5000
        });
    });
}
```

### System Status Updates
```javascript
// Connection status monitoring
let connectionToast = null;

function handleConnectionLost() {
    connectionToast = showToast('warning', 'Connection lost. Attempting to reconnect...', 'Offline', {
        autoHide: false,
        dismissible: false
    });
}

function handleConnectionRestored() {
    if (connectionToast) {
        updateToast(connectionToast, {
            variant: 'success',
            title: 'Online',
            message: 'Connection restored',
            autoHide: true,
            timeout: 2000
        });
        connectionToast = null;
    }
}
```

## Toast Configuration

### Global Configuration
```javascript
// Configure default toast settings
window.toastConfig = {
    position: 'top-right',
    autoHide: true,
    timeout: 4000,
    dismissible: true,
    animations: true,
    maxToasts: 5
};
```

### Per-Toast Configuration
```javascript
showToast('success', 'Operation completed', 'Success', {
    autoHide: true,        // Auto-hide after timeout
    timeout: 5000,         // Hide after 5 seconds
    dismissible: true,     // Show close button
    icon: 'check-circle',  // Custom icon
    position: 'top-left',  // Override global position
    persistent: false,     // Don't persist across page loads
    action: {              // Action button
        text: 'Undo',
        callback: () => undoAction()
    }
});
```

## Styling and Animation

### CSS Classes
```css
/* Toast container positioning */
.toast-container {
    position: fixed;
    z-index: 9999;
    pointer-events: none;
}

/* Toast animations */
.toast-enter {
    opacity: 0;
    transform: scale(0.95) translateY(0.5rem);
}

.toast-enter-active {
    opacity: 1;
    transform: scale(1) translateY(0);
    transition: all 0.3s ease-out;
}

/* Toast variants */
.toast-success {
    background: var(--color-success-50);
    border-color: var(--color-success-200);
    color: var(--color-success-800);
}

.toast-error {
    background: var(--color-danger-50);
    border-color: var(--color-danger-200);
    color: var(--color-danger-800);
}
```

## Accessibility

- Proper ARIA attributes for screen readers
- Focus management for dismissible toasts
- Screen reader announcements for new toasts
- Keyboard navigation support
- Respects prefers-reduced-motion

```javascript
// Accessible toast creation
function showAccessibleToast(variant, message, title) {
    const toast = createToast(variant, message, title);

    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `${title}: ${message}`;
    document.body.appendChild(announcement);

    // Clean up announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);

    return toast;
}
```

## Integration Examples

### Laravel Session Flash
```php
// In your controller
return redirect()->back()->with('toast', [
    'variant' => 'success',
    'title' => 'User Created',
    'message' => 'User account created successfully'
]);
```

```blade
{{-- In your layout --}}
@if(session('toast'))
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const toast = @json(session('toast'));
            showToast(toast.variant, toast.message, toast.title);
        });
    </script>
@endif
```

### Livewire Integration
```php
// In your Livewire component
public function save()
{
    // ... save logic

    $this->dispatch('toast', [
        'variant' => 'success',
        'title' => 'Saved',
        'message' => 'Changes saved successfully'
    ]);
}
```

```blade
<div>
    <!-- Your component content -->

    <script>
        document.addEventListener('livewire:init', () => {
            Livewire.on('toast', (event) => {
                showToast(event.variant, event.message, event.title);
            });
        });
    </script>
</div>
```

## Best Practices

1. **Use appropriate variants** - Match toast type to message severity
2. **Keep messages concise** - Use clear, actionable language
3. **Set appropriate timeouts** - Longer for errors, shorter for success
4. **Limit concurrent toasts** - Avoid overwhelming users
5. **Provide actions when relevant** - Include undo/retry buttons
6. **Handle offline scenarios** - Show connection status updates
7. **Test accessibility** - Ensure screen reader compatibility