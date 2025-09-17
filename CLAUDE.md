# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Laravel 12 application that serves as both a development environment and demo showcase for **Keys UI** - a modern Blade components library built specifically for Laravel 12 and Tailwind v4. The project uses a monorepo structure with the main Laravel app consuming the Keys UI package during development.

## Architecture

### Monorepo Structure
- **Root Laravel App** (`/`): Demo application showcasing Keys UI components
- **Keys UI Package** (`packages/keys-ui/`): Standalone Blade components library
- **Dual Build System**: Both Laravel app and package have separate build processes

### Keys UI Package Architecture
- **Component Classes**: `packages/keys-ui/src/Components/` - PHP Blade component classes
- **Templates**: `packages/keys-ui/resources/views/components/` - Blade template files
- **Shared Partials**: `packages/keys-ui/resources/views/partials/` - Reusable template parts
- **TypeScript/JS**: `packages/keys-ui/resources/js/` - Interactive component functionality
- **Styles**: `packages/keys-ui/resources/css/` - CSS with Tailwind v4 imports
- **Service Provider**: Auto-registers components with `x-keys::` namespace

### Design System Principles
- **Semantic Design Tokens**: CSS custom properties for consistent theming
- **Progressive Enhancement**: Components work without JavaScript, enhanced with it
- **Multi-State Components**: Native support for icon toggling (default → toggle → success states)
- **Accessibility First**: WCAG compliance built into all components
- **Tailwind v4**: Uses modern `@import "tailwindcss"` syntax, semantic variables

## Development Commands

### Laravel Application
```bash
# Start development (includes Laravel server + Vite + Queue)
composer run dev

# Run tests
composer run test
php artisan test
php artisan test --filter=specific_test_name

# Code formatting
vendor/bin/pint --dirty
```

### Keys UI Package Development
```bash
# Build Keys UI assets (CSS + JS)
php artisan keys:build

# Watch for changes during development
php artisan keys:build --watch

# Development build with publishing
php artisan keys:build --dev --publish

# Package-level commands (in packages/keys-ui/)
cd packages/keys-ui
npm run build        # Build production assets
npm run watch        # Watch mode for development
npm run build:all    # Build both CSS and JS
```

### Full Development Workflow
```bash
# Setup Keys UI dependencies
npm run setup:keys

# Parallel development (app + package)
npm run dev:all

# Build everything for production
npm run build:all && npm run keys:build
```

## Component Development Patterns

### Blade Component Structure
Components follow Laravel patterns with PHP classes in `src/Components/` that precompute all template data to avoid Blade directive parsing issues in component attributes:

```php
// Always precompute values to avoid @if() in templates
public function getComputedActionData(): array {
    return [
        'icon_toggle' => $action['icon_toggle'] ?? null,
        'data_url' => $action['url'] ?? null,
        // Always set all possible values (null if not present)
    ];
}
```

### Multi-State Button Pattern
The Button component natively supports icon state changes:
- **Default State**: `icon` prop sets primary icon
- **Toggle State**: `icon-toggle` prop for toggled state (e.g., eye → eye-slash)
- **Success State**: `icon-success` prop for success feedback
- **Auto Icon-Only**: Detects when slot content is empty (no `icon-only` prop needed)

### JavaScript Integration
- **Event Delegation**: Uses `.input-action` class for dynamic element handling
- **CSS Toggles**: Icon state changes via opacity classes, not DOM manipulation
- **Data Attributes**: Button component sets `data-icon-default`, `data-icon-toggle`, etc.
- **Progressive Enhancement**: All functionality degrades gracefully

## Testing Strategy

### Browser Testing (Pest 4)
```bash
# Component interaction testing
php artisan test tests/Browser/

# Specific component test
php artisan test --filter=password_toggle
```

Components should have comprehensive browser tests covering:
- Icon state changes and visual feedback
- User interactions (click, toggle, form submission)
- Accessibility compliance
- Multi-state behavior verification

### Component Testing Focus
- **Visual States**: Default, hover, active, disabled, error states
- **Icon Toggles**: Verify correct icon shows in each state
- **User Flows**: Complete interaction patterns (e.g., password toggle workflow)
- **Form Interactions**: Checkbox/radio selections, input validation, choice groups
- **Card Clickability**: Full card area clickable for enhanced UX
- **Accessibility**: Screen reader support, keyboard navigation

## Important Development Notes

### Blade Template Rules
- **Never use Blade directives inside component attributes** (causes parsing issues)
- **Precompute all conditional values** in PHP component classes
- **Use `{{ }}` syntax only** in component templates, not `:attribute="value"`

### Multi-State Component Guidelines
- Button handles icon rendering internally (no slot content for icons)
- Input actions pass multi-state props directly to Button
- JavaScript works with Button's data attributes, not wrapper elements
- CSS opacity toggles provide smooth animations

### Asset Management
- Keys UI assets auto-inject via `@keysAssets()` directive
- Package builds to `dist/` directory, published to `public/vendor/keys-ui/`
- Development: Use watch mode for real-time updates
- Production: Always build both package and app assets

### Semantic Design System
Components use CSS custom properties for theming:
- `--color-brand`, `--color-surface`, `--color-border` etc.
- Supports light/dark mode via Tailwind v4 dark mode features
- Consistent spacing, typography, and transition scales

## Recent Component Enhancements

### Form Components (Checkbox, Radio, Choice Groups)
Recent major improvements to form components include:

#### ID Generation & DOM Conflicts
- **Fixed checkbox ID collisions**: Updated unique ID generation to include value and uniqid()
- **Prevents DOM conflicts**: Ensures multiple checkboxes with same name work independently
- **Unique identifiers**: Pattern: `{name}-{value}-{uniqid}` for checkboxes, `{name}-{value}` for radios

#### Full Card Clickability
- **Restructured HTML**: `<label>` element now wraps entire component for full clickability
- **Enhanced UX**: Entire card area (including padding) is now clickable, not just text content
- **Maintained accessibility**: Proper label associations preserved throughout restructuring

#### Visual Enhancements & Alignment
- **Dynamic highlighting**: Added `has-[:checked]:` CSS selectors for immediate visual feedback
- **Consistent sizing**: Standardized checkbox/radio input sizes across all variants (3.5x3.5 default)
- **Improved alignment**: Changed from `items-start` to `items-center` for better visual hierarchy
- **Color-coded feedback**: Card variants highlight with appropriate color when selected

#### Optional Input Display
- **Pure card mode**: Added `showInput` boolean parameter (defaults to `true`)
- **Hidden form inputs**: When `showInput=false`, inputs use `sr-only` class but remain functional
- **Flexible layouts**: Supports both traditional form inputs and pure card selection interfaces
- **Smart spacing**: Automatically adjusts gap spacing (`gap-0` for pure cards, `gap-3` for standard)

#### Focus Management
- **Radio focus enhancement**: Added RadioActions JavaScript class for proper keyboard navigation
- **Programmatic focus**: Focus moves to checked radio when selection changes
- **Accessibility compliance**: Maintains proper focus flow for screen readers

#### Component Variants
All enhancements apply consistently across component variants:
- **Standard**: Basic checkbox/radio with label
- **Bordered**: Component with border and padding
- **Colored**: Dynamic border colors based on selection
- **Card**: Rich card interface with titles, descriptions, and icons

These improvements ensure form components provide excellent UX while maintaining accessibility and backward compatibility.

### Select Component (NEW)
The Keys UI Select component provides advanced dropdown functionality with comprehensive features:

#### Core Features
- **Slot-Based Options**: Uses Laravel component slots instead of arrays for maximum flexibility
- **Dot Notation Components**: `x-keys::select.option` follows Laravel directory structure
- **Search Functionality**: Live filtering through options with real-time results
- **Multiple Selection**: Single and multiple selection modes with visual chips
- **Icon Support**: Full integration with Keys UI icon system for options and states
- **Rich Options**: Support for descriptions, custom content, and complex layouts

#### Component Structure
```php
// Main Select component
packages/keys-ui/src/Components/Select.php
packages/keys-ui/resources/views/components/select.blade.php

// Nested Option component
packages/keys-ui/src/Components/Select/Option.php
packages/keys-ui/resources/views/components/select/option.blade.php

// JavaScript functionality
packages/keys-ui/resources/js/SelectActions.ts
```

#### Usage Examples
```blade
{{-- Basic select --}}
<x-keys::select name="category" placeholder="Choose category">
    <x-keys::select.option value="tech" label="Technology" />
    <x-keys::select.option value="design" label="Design" />
</x-keys::select>

{{-- Searchable multiselect with icons --}}
<x-keys::select name="skills[]" multiple searchable clearable placeholder="Select skills">
    <x-keys::select.option value="php" label="PHP" icon="heroicon-o-code-bracket" />
    <x-keys::select.option value="js" label="JavaScript" icon="heroicon-o-bolt"
                           description="Modern web development language" />
</x-keys::select>

{{-- Custom content with pricing --}}
<x-keys::select name="plan" placeholder="Choose plan">
    <x-keys::select.option value="pro">
        <div class="flex items-center justify-between w-full">
            <div>
                <div class="font-semibold">Pro Plan</div>
                <div class="text-xs text-neutral-500">Advanced features</div>
            </div>
            <div class="text-sm font-bold text-brand-600">$29/mo</div>
        </div>
    </x-keys::select.option>
</x-keys::select>
```

#### Component Props
**Select Component:**
- `name`, `id`, `value` - Standard form attributes
- `multiple` - Enable multiple selection with chips
- `searchable` - Add search input to filter options
- `clearable` - Show clear button to reset selection
- `placeholder` - Placeholder text for empty state
- `size` - Size variant (sm, md, lg)
- `disabled`, `required` - Form states
- `label`, `optional` - Shorthand mode with label
- `errors` - Validation error display

**Option Component:**
- `value` - Form value for the option
- `label` - Display text (falls back to value if not provided)
- `icon` - Heroicon name for left icon
- `description` - Secondary text below label
- `disabled` - Disable specific option
- `selected` - Pre-selected state

#### JavaScript Integration
- **SelectActions**: Handles dropdown, search, selection, and chip management
- **Event System**: Custom events for framework integration (Livewire, Alpine)
- **Keyboard Navigation**: Full arrow key navigation with Enter/Escape support
- **Accessibility**: ARIA attributes, screen reader support, focus management
- **Auto-initialization**: Automatically detects and initializes select elements

#### Advanced Features
- **Chip Management**: Visual tags for multiselect with individual removal
- **Search Highlighting**: Real-time option filtering based on label and description
- **Dynamic Positioning**: Smart dropdown positioning (up/down based on viewport)
- **Form Integration**: Hidden inputs for proper form submission
- **Size Variants**: Consistent sizing with other form components
- **Error States**: Visual error feedback with validation integration
- **Dark Mode**: Full support for light/dark theme switching

#### CSS Architecture
- **Scoped Styles**: Component-specific CSS using `[data-select="true"]` selectors
- **Animations**: Smooth dropdown slide-in, chip creation/removal transitions
- **State Management**: Hover, focus, selected, and disabled visual states
- **Responsive Design**: Mobile-optimized touch targets and viewport handling
- **Design Tokens**: Uses semantic CSS custom properties for consistent theming

The Select component follows all Keys UI patterns while providing modern dropdown functionality that works seamlessly with Laravel forms and validation.

### Badge Component (NEW)
The Keys UI Badge component provides status indicators and tags with auto icon-only detection functionality:

#### Core Features
- **Auto Icon-Only Detection**: Automatically detects when slot content is empty and renders as icon-only (following Button component pattern)
- **Variant Support**: Simple badges (default) and chip badges (with dismissible functionality)
- **Color System**: Comprehensive color support including semantic colors (brand, success, warning, danger, neutral) and specific colors (blue, gray, red, green, yellow, indigo, purple, pink)
- **Size Variants**: xs, sm (default), md sizes with proper icon scaling
- **Icon Integration**: Full Heroicon support with size-appropriate icon scaling
- **Dismissible Chips**: Auto-enables chip variant when dismissible is true
- **Dark Mode**: Complete dark mode support with proper contrast ratios

#### Component Structure
```php
// Badge component
packages/keys-ui/src/Components/Badge.php
packages/keys-ui/resources/views/components/badge.blade.php
```

#### Usage Examples
```blade
{{-- Simple badges --}}
<x-keys::badge color="blue">Default</x-keys::badge>
<x-keys::badge color="success">Success</x-keys::badge>
<x-keys::badge color="warning">Warning</x-keys::badge>

{{-- Auto icon-only badges (no icon-only prop needed) --}}
<x-keys::badge icon="heroicon-o-check" color="success" />
<x-keys::badge icon="heroicon-o-x-mark" color="danger" />

{{-- Badges with icons and text --}}
<x-keys::badge icon="heroicon-o-star" color="yellow">Featured</x-keys::badge>
<x-keys::badge icon="heroicon-o-check-circle" color="success">Verified</x-keys::badge>

{{-- Dismissible chip badges --}}
<x-keys::badge variant="chip" color="blue" dismissible>React</x-keys::badge>
<x-keys::badge variant="chip" color="green" dismissible>Vue.js</x-keys::badge>

{{-- Size variants --}}
<x-keys::badge size="xs" color="blue">Extra Small</x-keys::badge>
<x-keys::badge size="sm" color="green">Small</x-keys::badge>
<x-keys::badge size="md" color="purple">Medium</x-keys::badge>
```

#### Badge Props
- `variant` - simple|chip (auto-switches to chip when dismissible=true)
- `color` - Color variant: brand|success|warning|danger|neutral or specific colors
- `size` - xs|sm|md size variants
- `icon` - Heroicon name for icon display
- `dismissible` - Enable dismissible functionality (auto-enables chip variant)
- `id` - Custom ID (auto-generated for dismissible badges)

#### Auto Icon-Only Detection
The Badge component automatically detects icon-only usage following the Button component pattern:

```php
public function isIconOnly(string $slotContent = ''): bool
{
    return !empty($this->icon) && empty(trim(strip_tags($slotContent)));
}
```

This eliminates the need for developers to specify `icon-only` props - the component intelligently renders based on content presence.

#### Component Registration
```php
Blade::component('keys::badge', Badge::class);
```

### Avatar Component (NEW)
The Keys UI Avatar component provides user profile display functionality with comprehensive features:

#### Core Features
- **Image Support**: URL-based images with fallback handling and lazy loading
- **Initials Fallback**: Auto-generated from name when no image provided (smart 1-2 character generation)
- **Size Variants**: xs, sm, md, lg, xl (matching Icon component pattern)
- **Shape Options**: circle (default), square with configurable border radius
- **Status Indicators**: online/offline/away/busy dots with positioning
- **Color Variants**: brand, success, warning, danger, neutral + specific colors (red, green, blue, purple, etc.)
- **Border Support**: Optional borders with color variants
- **Accessibility**: Proper alt text and ARIA labels

#### Component Structure
```php
// Avatar component
packages/keys-ui/src/Components/Avatar.php
packages/keys-ui/resources/views/components/avatar.blade.php
```

#### Usage Examples
```blade
{{-- Basic avatar with image --}}
<x-keys::avatar
    src="https://example.com/avatar.jpg"
    name="John Doe"
    alt="John Doe's profile picture"
/>

{{-- Initials avatar --}}
<x-keys::avatar name="Jane Smith" />

{{-- Avatar with status --}}
<x-keys::avatar name="Bob Wilson" status="online" color="success" />

{{-- Fallback icon avatar --}}
<x-keys::avatar />
```

#### Avatar Props
- `src` - Image URL for avatar
- `alt` - Alt text (auto-generated from name if not provided)
- `name` - User name for initials fallback and accessibility
- `size` - xs|sm|md|lg|xl size variants
- `shape` - circle|square shape options
- `status` - online|offline|away|busy status indicators
- `color` - Color variant for background/borders
- `border` - Enable border styling
- `lazy` - Lazy loading for images (default: true)

### Avatar Stack Component (NEW)
The Keys UI Avatar Stack component provides overlapping avatar display functionality:

#### Core Features
- **Slot-based**: Uses Laravel slots to contain multiple Avatar components
- **Layout Options**: Overlapping avatars with configurable spacing (tight, default, loose)
- **Size Inheritance**: Passes size to child avatars automatically
- **Direction Control**: Left-to-right or right-to-left stacking
- **Flexible Design**: Developers control avatar count and "+N more" functionality

#### Component Structure
```php
// Avatar Stack component
packages/keys-ui/src/Components/Avatar/Stack.php
packages/keys-ui/resources/views/components/avatar/stack.blade.php
```

#### Usage Examples
```blade
{{-- Basic avatar stack --}}
<x-keys::avatar.stack>
    <x-keys::avatar name="John Doe" />
    <x-keys::avatar name="Jane Smith" color="success" />
    <x-keys::avatar name="Bob Johnson" color="warning" />
</x-keys::avatar.stack>

{{-- Large stack with tight spacing --}}
<x-keys::avatar.stack size="lg" spacing="tight">
    <x-keys::avatar name="Team Lead" color="brand" />
    <x-keys::avatar name="Developer" color="success" />
    <x-keys::avatar name="Designer" color="purple" />
</x-keys::avatar.stack>

{{-- Right-to-left direction --}}
<x-keys::avatar.stack direction="rtl">
    <x-keys::avatar name="User 1" />
    <x-keys::avatar name="User 2" />
    <x-keys::avatar name="User 3" />
</x-keys::avatar.stack>
```

#### Avatar Stack Props
- `max` - Maximum avatars to show (1-10, default: 5) - currently for validation only
- `size` - Size passed to child avatars (xs|sm|md|lg|xl)
- `spacing` - Overlap spacing: tight|default|loose
- `direction` - Stacking direction: ltr|rtl

#### Component Registration
Both components are registered in the service provider:
```php
Blade::component('keys::avatar', Avatar::class);
Blade::component('keys::avatar.stack', Stack::class);
```

#### Design Patterns
- **Progressive Enhancement**: Components work without JavaScript
- **Semantic Design Tokens**: Uses CSS custom properties for consistent theming
- **Accessibility First**: WCAG compliance built into all components
- **Consistent Sizing**: Avatar sizes align with other form components

## Component Registration Requirement

**CRITICAL**: When creating new Blade components for Keys UI, you MUST register them in the service provider:

### Required Steps for New Components:

1. **Import the component class** in `packages/keys-ui/src/KeysUiServiceProvider.php`:
   ```php
   use Keys\UI\Components\YourComponent;
   ```

2. **Register with Blade** in the `boot()` method:
   ```php
   Blade::component('keys::your-component', YourComponent::class);
   ```

3. **Follow render() method pattern** to ensure proper data passing:
   ```php
   public function render()
   {
       return view('keys::components.your-component', [
           'computedActionSize' => $this->getComputedActionSize(),
           'computedActionData' => $this->getComputedActionData(),
       ]);
   }
   ```

### Example - Toggle Component Registration:
```php
// In KeysUiServiceProvider.php imports:
use Keys\UI\Components\Toggle;

// In boot() method:
Blade::component('keys::toggle', Toggle::class);
```

**Without proper registration, components will not be accessible with the `x-keys::` namespace and will cause undefined variable errors.**

## Keys UI Component Development Guidelines

### Component Styling
- **Use inline styles in component templates**, NOT the main CSS theme file
- **Keep component-specific styles contained** within component templates using `<style>` tags
- **Avoid adding to main theme file** - this keeps styles modular and component-specific

### Component Testing
- **Add component tests to the welcome page**, NOT separate test pages
- **Integrate all component demonstrations** into the main welcome page showcase
- **Keep testing consolidated** in one place for easier maintenance and review

### Example Inline Styling Pattern:
```blade
<div {{ $attributes }}>
    <!-- Component content -->

    {{-- Inline styles for component enhancements --}}
    <style>
        [data-component-name] selector {
            /* Component-specific styles */
        }
    </style>
</div>
```