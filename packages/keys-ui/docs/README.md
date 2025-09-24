# Keys UI Components Documentation

Keys UI is a modern Blade components library built specifically for Laravel 12 and Tailwind v4. This library provides a comprehensive set of accessible, semantic, and customizable UI components.

## Quick Start

```php
// Install the package
composer require keys/ui

// Use any component
<x-keys::button variant="brand">Save Changes</x-keys::button>
```

## Component Categories

### Form Components
- [Button](components/button.md) - Interactive buttons with multi-state support
- [Input](components/input.md) - Text inputs with actions and validation
- [Checkbox](components/checkbox.md) - Single and group checkboxes with card variants
- [Radio](components/radio.md) - Radio buttons with rich card layouts
- [Select](components/select.md) - Advanced dropdowns with search and multiselect
- [Textarea](components/textarea.md) - Multi-line text inputs
- [Toggle](components/toggle.md) - Switch components for boolean values
- [Range](components/range.md) - Slider inputs for numeric ranges
- [File Upload](components/file-upload.md) - File selection with drag & drop

### Display Components
- [Badge](components/badge.md) - Status indicators and tags with auto icon-only detection
- [Avatar](components/avatar.md) - User profile images with fallbacks and status
- [Avatar Stack](components/avatar-stack.md) - Overlapping avatar displays
- [Alert](components/alert.md) - Notification messages with variants
- [Progress](components/progress.md) - Progress bars and loading indicators
- [Image](components/image.md) - Responsive images with loading states

### Layout Components
- [Card](components/card.md) - Content containers with selection support
- [Modal](components/modal.md) - Dialog overlays with animations
- [Gallery](components/gallery.md) - Image galleries with lightbox functionality
- [Popover](components/popover.md) - Floating content containers

### Editor Components
- [Editor](components/editor.md) - Rich text editor with Quill.js integration

## Core Features

### Design System
- **Semantic Design Tokens**: CSS custom properties for consistent theming
- **Dark Mode Support**: Automatic light/dark mode switching
- **Tailwind v4**: Modern CSS with auto-generated utilities
- **Accessibility First**: WCAG compliance built into all components

### Component Architecture
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **Multi-State Support**: Icon toggling and loading states
- **Data Attributes**: Comprehensive targeting for customization
- **Slot-Based**: Flexible content with Laravel component slots

### Framework Integration
- **Laravel Blade**: Native Laravel component system
- **Livewire Compatible**: Full support for reactive interfaces
- **Alpine.js Ready**: Works seamlessly with Alpine directives
- **Form Validation**: Built-in error state handling

## Installation & Setup

1. **Install via Composer**:
   ```bash
   composer require keys/ui
   ```

2. **Publish Assets** (optional):
   ```bash
   php artisan vendor:publish --provider="Keys\UI\KeysUiServiceProvider"
   ```

3. **Include Scripts**:
   ```blade
   {{-- In your layout --}}
   <keys:scripts />
   ```

## Development

### Building Assets
```bash
# Build production assets
php artisan keys:build

# Watch for development
php artisan keys:build --watch
```

### Component Namespace
All components use the `keys::` namespace:
```blade
<x-keys::component-name />
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - see LICENSE file for details.