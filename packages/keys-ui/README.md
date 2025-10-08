# Keys UI

> A modern Blade components library built specifically for Laravel 12 and Tailwind v4

[![Latest Version](https://img.shields.io/packagist/v/keys/ui.svg?style=flat-square)](https://packagist.org/packages/keys/ui)
[![License](https://img.shields.io/packagist/l/keys/ui.svg?style=flat-square)](https://packagist.org/packages/keys/ui)
[![Laravel 12](https://img.shields.io/badge/Laravel-12-FF2D20?style=flat-square&logo=laravel)](https://laravel.com)
[![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

Keys UI is a comprehensive Blade components library that provides 40+ production-ready components with a semantic design system, built-in accessibility, and progressive enhancement. Designed for Laravel 12 with full Tailwind v4 integration.

---

## Philosophy & Design Principles

Keys UI is built on core principles that prioritize developer experience, accessibility, and maintainability:

### Semantic Design Tokens
All components use CSS custom properties organized into semantic layers that automatically adapt to light/dark modes. Tokens like `--color-surface`, `--color-primary`, and `--color-accent` provide consistent theming across your application.

### Progressive Enhancement
Components work without JavaScript and are enhanced when scripts are available. This ensures baseline functionality for all users while providing richer interactions for modern browsers.

### Multi-State Components
Native support for icon toggling with default → toggle → success state patterns. Components automatically manage visual feedback for user interactions.

### Accessibility First
WCAG compliance built into all components with proper ARIA attributes, keyboard navigation, focus management, and screen reader support.

### Zero Configuration
Auto-discovery of components, automatic asset serving via the `<keys:scripts />` component, and sensible defaults mean you can start building immediately.

### Tailwind v4 Native
Leverages Tailwind v4's modern features including auto-generated utilities from CSS custom properties, `starting:` variant for animations, and `backdrop:` pseudo-class for dialogs.

---

## Requirements

- **PHP**: 8.2 or higher
- **Laravel**: 12.0 or higher
- **Tailwind CSS**: 4.0 or higher
- **Blade Heroicons**: 2.3 or higher (auto-installed)

---

## Installation

### 1. Install the Package

```bash
composer require keys/ui
```

### 2. Import Package CSS ⚠️ REQUIRED

Add the Keys UI CSS import to your main application stylesheet:

```css
/* resources/css/app.css */
@import 'tailwindcss';
@import '../../vendor/keys/ui/resources/css/keys-ui.css';

/* Your custom styles here */
```

**Important**: This CSS import is required for Keys UI to function properly. The import path points to the package's CSS file in your vendor directory.

### 3. Publish Assets (Optional)

Publish the JavaScript and CSS assets to your public directory:

```bash
php artisan vendor:publish --tag=keys-ui-assets
```

### 4. Add Scripts Component

Include the Keys UI scripts component in your layout file (typically in the `<head>` section or before closing `</body>`):

```blade
<!DOCTYPE html>
<html>
<head>
    <!-- Your other head content -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <!-- Your content -->

    <!-- Keys UI Scripts - Auto-loads JS and initializes components -->
    <keys:scripts />
</body>
</html>
```

---

## Quick Start

After installation, you can immediately start using components:

```blade
{{-- Button Component --}}
<x-keys::button variant="primary" size="md">
    Click Me
</x-keys::button>

{{-- Input with Label --}}
<x-keys::field>
    <x-keys::label for="email">Email Address</x-keys::label>
    <x-keys::input
        id="email"
        type="email"
        placeholder="you@example.com"
    />
</x-keys::field>

{{-- Alert Component --}}
<x-keys::alert variant="success" dismissible>
    Your changes have been saved successfully!
</x-keys::alert>

{{-- Card Component --}}
<x-keys::card>
    <x-slot:header>
        <x-keys::heading level="h3">Card Title</x-keys::heading>
    </x-slot:header>

    <x-keys::text>Card content goes here.</x-keys::text>

    <x-slot:footer>
        <x-keys::button variant="primary">Action</x-keys::button>
    </x-slot:footer>
</x-keys::card>
```

---

## Available Commands

Keys UI provides a custom Artisan command for building package assets during development:

### Build Assets (Production)
```bash
php artisan keys:build
```
Builds optimized production assets (CSS + JS) for the Keys UI package.

### Watch Mode (Development)
```bash
php artisan keys:build --watch
```
Watches for changes and automatically rebuilds assets. Perfect for active development.

### Development Build
```bash
php artisan keys:build --dev
```
Builds unminified development assets with source maps for debugging.

### Build and Publish
```bash
php artisan keys:build --publish
```
Builds assets and automatically publishes them to your public directory.

### Publishing Commands

Publish specific parts of the package:

```bash
# Publish configuration file
php artisan vendor:publish --tag=keys-ui-config

# Publish all Blade views
php artisan vendor:publish --tag=keys-ui-views

# Publish component classes and templates
php artisan vendor:publish --tag=keys-ui-components

# Publish translation files
php artisan vendor:publish --tag=keys-ui-lang

# Publish layout templates
php artisan vendor:publish --tag=keys-ui-layouts

# Publish JavaScript and CSS assets
php artisan vendor:publish --tag=keys-ui-assets
```

---

## Features

### 40+ Production-Ready Components

**Form Components**
- Input, Textarea, Select, Checkbox, Radio, Toggle
- Date Picker, Time Picker, Color Picker, Range Slider
- File Upload (with preview), Rating, Editor (Quill)
- Choice Group, Field Wrapper, Label, Error

**UI Components**
- Button, Badge, Alert, Card, Avatar
- Modal, Slideout, Popover, Tooltip, Dropdown
- Toast Notifications, Loading States, Empty State
- Tabs, Accordion, Steps, Progress Bar

**Data Display**
- Table (sortable, searchable), Chart (Chart.js integration)
- Gallery (with lightbox), Image (with overlays)
- Heading, Text, Separator, Kbd

**Navigation**
- Sidebar (responsive), Breadcrumbs, Main (layout wrapper)

**Specialized**
- Calendar, Icon (Heroicons integration), Add to Cart

### Semantic Design System

Keys UI includes a comprehensive semantic design token system with Tailwind v4 auto-generation:

**Elevation Layers** (Background hierarchy)
- `base` - Page/body background
- `surface` - Cards, panels, containers
- `input` - Form fields
- `overlay` - Dropdowns, modals, tooltips
- `inverted` - High-contrast sections

**Typography Colors**
- `heading` - Primary headings (h1-h6)
- `primary` - Body text
- `secondary` - Supporting text, labels
- `muted` - Captions, placeholders
- `disabled` - Disabled elements

**Interactive States**
- `hover`, `active`, `selected` - Interaction feedback
- `focus` - Focus ring colors

**Contextual Colors**
- `accent` - Brand/primary color with subtle/hover/active variants
- `success`, `warning`, `danger`, `info` - Each with contrast/hover/active/subtle variants
- `neutral` - Gray scale with hover/active variants

**Auto-Generated Utilities**
All design tokens automatically generate Tailwind utilities:
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`
- `--color-accent` → `bg-accent`, `text-accent`, `border-accent`
- Perfect consistency with automatic light/dark mode support via `light-dark()` CSS function

### Modern Tailwind v4 Animation Patterns

Keys UI leverages Tailwind v4's cutting-edge features:

**Backdrop Styling** - `backdrop:` pseudo-class:
```blade
<dialog class="backdrop:bg-black/50 backdrop:backdrop-blur-sm">
```

**Entry Animations** - `starting:` variant:
```blade
<dialog class="starting:scale-95 starting:opacity-0">
```

**Smooth Transitions**:
```blade
<dialog class="transition-transform transition-opacity duration-300 ease-out">
```

### Auto-Component Discovery

All Blade components are automatically discovered and registered with the `x-keys::` namespace. No manual registration required.

### Translation Support

Keys UI includes built-in translation support with provided translations for:
- ARIA labels for accessibility
- Date picker labels and quick selectors
- Time picker format options
- Calendar navigation
- Feedback messages

Translations are available in the `keys-ui` namespace and can be published for customization.

### Data Attributes System

All components include comprehensive data attributes for precise CSS/JavaScript targeting:

- `data-keys-[component]="true"` - Component identification
- `data-variant` - Current variant
- `data-size` - Current size
- `data-disabled`, `data-checked` - State flags
- Component-specific attributes for advanced customization

### TypeScript Support

The package is written in TypeScript with full type definitions included for all JavaScript functionality.

---

## Design System

### Color Token Philosophy

Keys UI uses a semantic approach to color tokens that separates meaning from implementation. This allows components to automatically adapt to light/dark modes and provides a consistent API across all components.

**Semantic Naming Pattern**:
```css
/* Define semantic tokens */
--color-base: light-dark(var(--color-neutral-100), var(--color-neutral-950));
--color-surface: light-dark(var(--color-neutral-50), var(--color-neutral-900));
--color-heading: light-dark(var(--color-neutral-950), var(--color-neutral-50));

/* Automatically generates utilities */
.bg-base { background-color: var(--color-base); }
.bg-surface { background-color: var(--color-surface); }
.text-heading { color: var(--color-heading); }
```

### Component Usage Pattern

All Keys UI components follow consistent patterns:

**Component Namespace**: All components use the `x-keys::` prefix
```blade
<x-keys::button>Button</x-keys::button>
<x-keys::input />
<x-keys::modal>Content</x-keys::modal>
```

**Variant System**: Most components support a `variant` prop for different visual styles
```blade
<x-keys::button variant="primary">Primary</x-keys::button>
<x-keys::button variant="danger">Danger</x-keys::button>
<x-keys::alert variant="success">Success message</x-keys::alert>
```

**Size Options**: Components support consistent sizing via the `size` prop
```blade
<x-keys::button size="sm">Small</x-keys::button>
<x-keys::button size="md">Medium</x-keys::button>
<x-keys::button size="lg">Large</x-keys::button>
```

**State Management**: Components handle their own state with clear data attributes
```blade
<x-keys::checkbox wire:model="agreed" />
<x-keys::toggle wire:model="enabled" />
<x-keys::input wire:model="name" />
```

---

## Development & Contributing

### Monorepo Structure

This package is developed within a monorepo structure:
- **Root Laravel App** (`/`) - Demo application showcasing components
- **Keys UI Package** (`packages/keys-ui/`) - Standalone library
- **Dual Build System** - Separate build processes for app and package

### Package Development Workflow

**1. Install Dependencies**
```bash
cd packages/keys-ui
npm install
```

**2. Development Mode**
```bash
# From Laravel root
php artisan keys:build --watch

# Or from package directory
npm run watch
```

**3. Build for Production**
```bash
# From Laravel root
php artisan keys:build

# Or from package directory
npm run build
```

**4. Type Checking**
```bash
cd packages/keys-ui
npm run typecheck
```

### Component Architecture

**PHP Classes** - Handle complex business logic only:
- Constructor validation and property setup
- Business logic methods (error checking, state management)
- Complex data processing
- Data attributes generation for JavaScript integration

**Blade Templates** - Direct Tailwind utilities:
- All styling uses inline Tailwind utilities with `match` statements
- Conditional classes based on component state
- No separate CSS files (except for complex cases)
- Direct styling approach for better maintainability

**Example Component Structure**:
```php
// PHP Class - Business logic only
public function configuredActions(): array {
    return array_merge($this->autoActions(), $this->actions);
}

public function getDataAttributes(): array {
    return [
        'data-keys-button' => 'true',
        'data-variant' => $this->variant,
        'data-size' => $this->size,
    ];
}
```

```blade
{{-- Blade Template - Direct Tailwind utilities --}}
@php
    $baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
    $sizeClasses = match ($size) {
        'sm' => 'px-3 py-1.5 text-sm',
        'md' => 'px-4 py-2 text-base',
        'lg' => 'px-6 py-3 text-lg',
    };
@endphp

<button {{ $attributes->merge(['class' => "$baseClasses $sizeClasses"]) }}>
    {{ $slot }}
</button>
```

### Testing

Keys UI uses Pest 4 for testing with comprehensive browser tests:

```bash
# Run all tests
php artisan test

# Run specific component test
php artisan test --filter=button_component

# Run browser tests only
php artisan test tests/Browser/
```

---

## Publishing Assets

When you publish Keys UI assets, the following files are copied to your application:

### Asset Publishing (`--tag=keys-ui-assets`)
- `public/vendor/keys-ui/keys-ui.min.js` - Minified JavaScript
- `public/vendor/keys-ui/keys-ui.umd.js` - UMD format JavaScript
- `public/vendor/keys-ui/keys-ui.es.js` - ES Module format
- `public/vendor/keys-ui/keys-ui.css` - Compiled CSS (not required if using CSS import)

### Config Publishing (`--tag=keys-ui-config`)
- `config/keys-ui.php` - Package configuration file

### Views Publishing (`--tag=keys-ui-views`)
- `resources/views/vendor/keys/` - All Blade view templates for customization

### Components Publishing (`--tag=keys-ui-components`)
- `app/View/Components/Keys/` - PHP component classes
- `resources/views/components/keys/` - Component Blade templates

### Translations Publishing (`--tag=keys-ui-lang`)
- `lang/vendor/keys-ui/` - Translation files

### Layouts Publishing (`--tag=keys-ui-layouts`)
- `resources/views/components/layouts/` - Layout components

---

## Configuration

The package uses a minimal configuration approach. After publishing the config file, you can customize:

```php
// config/keys-ui.php

return [
    // Package version (used for cache busting)
    'version' => '1.2.9',

    // Debug mode (inherits from app.debug)
    'debug' => env('KEYS_UI_DEBUG', app()->hasDebugModeEnabled()),
];
```

---

## Browser Support

Keys UI supports all modern browsers:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Opera (latest 2 versions)

Progressive enhancement ensures graceful degradation for older browsers.

---

## License

Keys UI is open-sourced software licensed under the [MIT license](LICENSE.md).

---

## Support & Community

- **Issues**: [GitHub Issues](https://github.com/sabristratos/keys/issues)
- **Source**: [GitHub Repository](https://github.com/sabristratos/keys)
- **Documentation**: Component usage examples available in the demo application

---

## Credits

Keys UI is built with:
- [Laravel](https://laravel.com) - The PHP Framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Blade Heroicons](https://github.com/blade-ui-kit/blade-heroicons) - Icon library
- [Quill](https://quilljs.com) - Rich text editor
- [Chart.js](https://www.chartjs.org) - Data visualization

---

**Built with ❤️ by the Keys Team**
