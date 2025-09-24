# Scripts Component

Asset management component that automatically injects Keys UI JavaScript functionality with translations and configuration.

## Basic Usage

```blade
{{-- Add to your layout's head or before closing body tag --}}
<x-keys::scripts />
```

## What It Does

The Scripts component automatically:

1. **Loads Keys UI JavaScript**: Injects the main Keys UI JavaScript bundle
2. **Provides Translations**: Makes translation strings available to JavaScript
3. **Injects Configuration**: Passes Laravel app configuration to frontend
4. **Auto-initializes**: Automatically initializes all Keys UI components
5. **Cache Busting**: Adds version hashes in production for proper caching
6. **Development Support**: Provides helpful warnings when assets are missing

## Typical Integration

### Laravel Blade Layout
```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>

    {{-- Keys UI CSS (via Vite or direct link) --}}
    @vite(['resources/css/app.css'])
</head>
<body>
    <div id="app">
        {{ $slot }}
    </div>

    {{-- Keys UI JavaScript Auto-injection --}}
    <x-keys::scripts />

    {{-- Your app's JavaScript --}}
    @vite(['resources/js/app.js'])
</body>
</html>
```

### Livewire Layout
```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Page Title' }}</title>

    @vite('resources/css/app.css')
    @livewireStyles
</head>
<body>
    {{ $slot }}

    {{-- Keys UI Scripts BEFORE Livewire Scripts --}}
    <x-keys::scripts />

    @livewireScripts
    @vite('resources/js/app.js')
</body>
</html>
```

## JavaScript Integration

### Available Global Objects

The Scripts component creates several global JavaScript objects:

```javascript
// Translation strings
window.KeysUITranslations = {
    feedback: {
        copied_clipboard: "Copied to clipboard!",
        copy_failed: "Failed to copy"
    },
    aria: {
        show_password: "Show password",
        hide_password: "Hide password"
    }
};

// Application configuration
window.KeysUIConfig = {
    environment: "production",
    debug: false,
    version: "1.2.0"
};

// Main Keys UI library
window.KeysUI = {
    init: function() { /* ... */ },
    // Component-specific functionality
};
```

### Using Translations in Custom JavaScript

```javascript
// Access translation strings
function showCopyFeedback() {
    const message = window.KeysUITranslations.feedback.copied_clipboard;
    showToast('success', message);
}

// Check environment
if (window.KeysUIConfig.debug) {
    console.log('Keys UI Debug Mode Enabled');
}
```

## Asset Management

### Production Asset Handling
```blade
{{-- In production, scripts are loaded with cache busting --}}
<script src="/vendor/keys-ui/keys-ui.min.js?v=a1b2c3d4"></script>
```

### Development Warnings
When assets aren't found, helpful warnings are provided:

```html
<!-- Keys UI JavaScript not found. Assets may need to be built. -->
<script>
    console.warn('Keys UI: JavaScript assets not found. Run "composer install" or "composer update" to ensure assets are available.');
</script>
```

## Component Initialization

The Scripts component automatically initializes all Keys UI components:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    if (typeof KeysUI !== 'undefined' && KeysUI.init) {
        KeysUI.init();
    }
});
```

### Manual Re-initialization
For dynamic content (Livewire, AJAX), you can manually re-initialize:

```javascript
// After adding new Keys UI components to the DOM
if (window.KeysUI && window.KeysUI.init) {
    window.KeysUI.init();
}
```

## Framework Integration

### Livewire Integration
```blade
{{-- In your Livewire component view --}}
<div>
    {{-- Keys UI components --}}
    <x-keys::select name="category" wire:model="selectedCategory">
        <x-keys::select.option value="tech" label="Technology" />
        <x-keys::select.option value="design" label="Design" />
    </x-keys::select>

    {{-- JavaScript will automatically handle the component after Livewire updates --}}
</div>

<script>
    document.addEventListener('livewire:updated', function() {
        // Re-initialize Keys UI components after Livewire updates
        if (window.KeysUI && window.KeysUI.init) {
            window.KeysUI.init();
        }
    });
</script>
```

### Alpine.js Integration
```blade
<div x-data="{ open: false }">
    <x-keys::button @click="open = !open">Toggle</x-keys::button>

    <div x-show="open" x-transition>
        <x-keys::card variant="padded">
            <p>Dynamic content with Keys UI components</p>
            <x-keys::input name="dynamic_field" placeholder="Enter text" />
        </x-keys::card>
    </div>
</div>

<script>
    // Keys UI components in Alpine.js work automatically
    // No additional initialization needed
</script>
```

## Custom Configuration

### Extending Configuration
You can extend the Keys UI configuration before including the Scripts component:

```blade
<script>
    // Custom configuration before Keys UI loads
    window.KeysUICustomConfig = {
        theme: 'dark',
        animations: true,
        customEndpoint: '{{ route("api.keys-ui") }}'
    };
</script>

<x-keys::scripts />
```

### Environment-Specific Settings
```blade
@if(app()->environment('local'))
    <script>
        // Development-specific settings
        window.KeysUIConfig = window.KeysUIConfig || {};
        window.KeysUIConfig.debugVerbose = true;
    </script>
@endif

<x-keys::scripts />
```

## Component Features Enabled

The Scripts component enables functionality for:

- **Select Components**: Dropdown behavior, search, multi-select
- **Input Actions**: Copy, clear, password toggle functionality
- **File Upload**: Drag & drop, progress tracking, validation
- **Gallery**: Lightbox, image navigation, zoom
- **Editor**: Rich text editing, toolbar actions
- **Toast**: Notification system and positioning
- **Modal**: Open/close behavior, focus management
- **Date Picker**: Calendar functionality, date selection
- **Tooltip**: Positioning, show/hide behavior
- **Dropdown**: Positioning, click outside handling

## Performance Considerations

### Optimized Loading
- **Deferred Loading**: Scripts load after DOM content
- **Minified Assets**: Production builds are minified and optimized
- **Cache Control**: Proper cache headers and versioning
- **Selective Initialization**: Only initializes components that exist on the page

### Bundle Size
The Keys UI JavaScript bundle includes:
- Core component functionality
- Event delegation system
- Floating UI for positioning
- Minimal dependencies for optimal performance

## Troubleshooting

### Assets Not Loading
```blade
{{-- Check if assets exist --}}
@if(!file_exists(public_path('vendor/keys-ui/keys-ui.min.js')))
    <div class="alert alert-warning">
        Keys UI assets not found. Run: <code>php artisan keys:build</code>
    </div>
@endif
```

### JavaScript Errors
```javascript
// Check if Keys UI loaded properly
if (typeof window.KeysUI === 'undefined') {
    console.error('Keys UI failed to load. Check asset paths.');
}

// Verify component functionality
document.addEventListener('DOMContentLoaded', function() {
    const selects = document.querySelectorAll('[data-keys-select="true"]');
    if (selects.length > 0 && typeof window.KeysUI === 'undefined') {
        console.warn('Keys UI components found but JavaScript not loaded.');
    }
});
```

## Custom Events

Keys UI components emit custom events that you can listen for:

```javascript
// Listen for component events
document.addEventListener('keys-ui:select:changed', function(event) {
    console.log('Select changed:', event.detail);
});

document.addEventListener('keys-ui:modal:opened', function(event) {
    console.log('Modal opened:', event.detail.id);
});

document.addEventListener('keys-ui:toast:shown', function(event) {
    console.log('Toast shown:', event.detail.message);
});
```

## Best Practices

1. **Place before closing body tag** - Ensures DOM is ready
2. **Load before Livewire** - Keys UI should initialize before Livewire
3. **Single inclusion** - Only include Scripts component once per page
4. **Environment awareness** - Use configuration for environment-specific behavior
5. **Custom events** - Listen for Keys UI events for custom integrations
6. **Asset optimization** - Ensure assets are built and cached properly
7. **Graceful degradation** - Components work without JavaScript, enhanced with it