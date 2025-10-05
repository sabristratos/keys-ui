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

### Tailwind v4 Auto-Generated Utilities
Tailwind v4 automatically generates utility classes from CSS custom properties defined in the theme:
- CSS variables like `--color-foreground` become `text-foreground`, `bg-foreground`, `border-foreground`
- All design tokens follow this pattern: `--color-muted` → `text-muted`, `bg-muted`, etc.
- Radius tokens: `--radius-lg` → `rounded-lg` (already supported)
- This eliminates manual utility definitions and ensures perfect consistency with the design system
- All auto-generated utilities automatically work with light/dark modes via the `light-dark()` CSS function

### Tailwind v4 Modern Animation Patterns
Keys UI leverages Tailwind v4's modern features for dialog animations **without requiring custom CSS**:

**Backdrop Styling** - `backdrop:` pseudo-class:
- `backdrop:bg-black/50` - Semi-transparent black backdrop
- `backdrop:backdrop-blur-sm` - Backdrop blur effect
- `backdrop:bg-transparent` - No backdrop styling
- Replaces custom `::backdrop` CSS selectors

**Entry Animations** - `starting:` variant:
- `starting:scale-95 starting:opacity-0` - Modal starts small and transparent
- `starting:translate-x-full` - Slideout starts off-screen (right)
- `starting:-translate-x-full` - Slideout starts off-screen (left)
- `starting:-translate-y-full` - Slideout starts off-screen (top)
- `starting:translate-y-full` - Slideout starts off-screen (bottom)
- Automatically handles entry animations when element transitions from `display: none`

**Exit Animations** - Built-in transition support:
- `transition-transform duration-300 ease-out` - Smooth transform transitions
- `transition-opacity duration-300 ease-out` - Smooth opacity transitions
- Automatically reverses `starting:` state when dialog closes
- No custom CSS `:not([open])` rules needed

**Complete Dialog Pattern**:
```blade
{{-- Pure Tailwind dialog with smooth animations --}}
<dialog class="
    fixed inset-0 m-auto bg-elevation-1 rounded-lg
    transition-transform transition-opacity duration-300 ease-out
    starting:scale-95 starting:opacity-0
    backdrop:bg-black/50 backdrop:backdrop-blur-sm
">
    Content
</dialog>
```

This approach eliminates the need for custom CSS animation blocks and ensures consistent, performant animations across all dialog components.

## Development Commands

### Laravel Application
```bash
# Start development (includes Laravel server + Vite + Queue)
composer run dev

# Run tests
composer run test
cmd //c "php artisan test"
cmd //c "php artisan test --filter=specific_test_name"

# Code formatting
cmd //c "vendor/bin/pint --dirty"
```

### Keys UI Package Development
```bash
# Build Keys UI assets (CSS + JS)
cmd //c "php artisan keys:build"

# Watch for changes during development
cmd //c "php artisan keys:build --watch"

# Development build with publishing
cmd //c "php artisan keys:build --dev --publish"

# Package-level commands (in packages/keys-ui/)
cd packages/keys-ui
npm run build        # Build production assets
npm run watch        # Watch mode for development
npm run build:all    # Build both CSS and JS
npm run typecheck    # TypeScript type checking
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

### Modern Component Architecture
Components follow a simplified Laravel pattern where PHP classes handle complex business logic only, while Tailwind utilities are placed directly in Blade templates:

**PHP Classes - Handle Complex Logic Only:**
- Constructor validation and property setup
- Business logic methods (error checking, state management)
- Complex data processing and action configuration
- Data attributes generation for JavaScript integration

**Blade Templates - Direct Tailwind Utilities:**
- All styling uses inline Tailwind utilities with match statements
- Conditional classes based on component state
- No separate CSS files or utility getter methods
- Direct styling approach for better maintainability

```php
// PHP class handles ONLY complex logic
public function hasActions(): bool {
    return !empty($this->configuredActions());
}

public function configuredActions(): array {
    // Complex business logic for building action arrays
    return array_merge($autoActions, $this->actions);
}
```

```blade
{{-- Blade template uses direct Tailwind utilities --}}
@php
    $baseClasses = 'block w-full rounded-md border transition-colors duration-200';
    $sizeClasses = match ($size) {
        'xs' => 'px-2.5 py-1 text-xs',
        'sm' => 'px-3 py-1.5 text-sm',
        'md' => 'px-3 py-2 text-sm',
        default => 'px-3 py-2 text-sm'
    };
@endphp
```

### JavaScript Integration
- **Direct Component Styling**: Actions use existing Button component styling instead of separate CSS
- **Tailwind Pseudo-classes**: Use `focus-within:`, `hover:`, `data-[state]:` utilities instead of custom CSS
- **Data Attributes**: For JavaScript functionality only, not styling selectors
- **Progressive Enhancement**: All functionality degrades gracefully

## Testing Strategy

### Browser Testing (Pest 4)
```bash
# Component interaction testing
cmd //c "php artisan test tests/Browser/"

# Specific component test
cmd //c "php artisan test --filter=password_toggle"
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

### Modern Component Architecture (Post-Refactoring Standards)

**PHP Class Structure:**
- **No utility getter methods** - eliminate `baseClasses()`, `sizeClasses()`, `stateClasses()`, etc.
- **Only complex business logic** - error handling, validation, action configuration, data processing
- **Avoid redundant wrapper methods** - call core methods like `configuredActions()` directly
- **Auto-generate IDs when missing** - use pattern `$this->id = $this->id ?? $this->name ?? 'component-' . uniqid();`
- **Simplified render() method** - only pass computed data and data attributes to template
- **Data attributes generation** - provide comprehensive `getDataAttributes()` for CSS/JS targeting

**Example Modern PHP Class:**
```php
public function __construct(/* props */) {
    $this->id = $this->id ?? $this->name ?? 'textarea-' . uniqid();
    // Handle business logic only
}

public function configuredActions(): array {
    // Complex business logic for building action arrays
    return array_merge($autoActions, $this->actions);
}

public function getDataAttributes(): array {
    // Comprehensive data attributes for targeting
    return ['data-keys-component' => 'true', ...];
}

public function render() {
    return view('keys::components.component', [
        'computedActionData' => $this->getComputedActionData(),
        'dataAttributes' => $this->getDataAttributes(),
    ]);
}
```

**Blade Template Structure:**
- **Direct Tailwind utilities** - use match statements and conditional logic inline in @php blocks
- **No partial templates** - inline all content into main component template for better maintainability
- **Leverage existing components** - use Button component for actions instead of custom CSS
- **Focus-within enhancement** - add `focus-within:[&_[data-icon]]:text-brand` for interactive icon coloring
- **Proper data attributes** - ensure textarea/input elements have required data attributes for JavaScript

**Example Modern Template Pattern:**
```blade
@php
    // All styling logic directly in template
    $baseClasses = 'block w-full rounded-md border transition-colors duration-200';
    $sizeClasses = match ($size) {
        'sm' => 'px-3 py-1.5 text-sm',
        'md' => 'px-3 py-2 text-sm',
        default => 'px-3 py-2 text-sm'
    };
    $stateClasses = $disabled ? 'bg-surface opacity-50' : 'bg-input border-border';
@endphp

<div class="relative focus-within:[&_[data-icon]]:text-brand">
    <input {{ $attributes->merge(['class' => "$baseClasses $sizeClasses $stateClasses"]) }}
           data-keys-input="true"
           @if($showFeature) data-show-feature="true" @endif />
</div>
```

**Component Integration:**
- **Never use Blade directives inside component attributes** (causes parsing issues)
- **Use existing component styling** - Button component handles all action styling
- **Consistent data attributes** - all components need proper data attributes for JavaScript targeting
- **ID generation** - all form components must auto-generate IDs when missing for proper functionality

### Asset Management
- Keys UI assets auto-inject via `<keys:scripts />` component
- Package builds to `dist/` directory, published to `public/vendor/keys-ui/`
- Development: Use watch mode for real-time updates
- Production: Always build both package and app assets

### Semantic Design System
Components use CSS custom properties for theming:

#### Elevation System
Keys UI uses an explicit elevation scale for layered UI depth hierarchy:
- **Base Layer** (`--color-base`): Body background
- **Elevation 1** (`--color-elevation-1`): Cards, modals, alerts, sidebar sections
- **Elevation 2** (`--color-elevation-2`): Inputs, textareas, selects, secondary buttons
- **Elevation 3** (`--color-elevation-3`): Dropdowns, popovers, tooltips (overlays)
- **Elevation 4** (`--color-elevation-4`): Items inside elevation-3 (resets to elevation-1 styling for visual distinction)

**Semantic Aliases:**
- `--color-card`: Alias for `--color-elevation-1`
- `--color-dropdown`: Alias for `--color-elevation-3`
- `--color-input`: Uses `--color-elevation-2`

**Legacy Tokens (deprecated):**
- `--color-body` → Use `--color-base`
- `--color-surface` → Use `--color-elevation-1`
- `--color-foreground` → Use `--color-elevation-2`

#### Other Color Tokens
- **Typography Tokens**: `--color-heading` (primary headings), `--color-text` (body text), `--color-muted` (secondary/muted text)
- **Contextual Colors**: `--color-success`, `--color-warning`, `--color-danger`, `--color-info`, `--color-accent`
- **Border System**: `--color-border`, `--color-border-subtle`
- **Auto-generated Utilities**: Tailwind v4 automatically generates utilities from design tokens:
  - `bg-elevation-1`, `bg-elevation-2`, `bg-elevation-3`, `bg-elevation-4`, `bg-base`
  - `text-heading`, `text-text`, `text-muted` for semantic typography colors
  - `border-border`, `text-text` for UI elements
  - All tokens support light/dark mode via `light-dark()` CSS function
- Consistent spacing, typography scales, and transition timings

### Data Attributes System for Enhanced Customization

Keys UI components include comprehensive data attributes for precise targeting and customization. This system provides developers with granular control over component styling and behavior without requiring component modifications.

**Data Attribute Naming Convention:**
- **Component Identification**: `data-keys-[component]="true"` (e.g., `data-keys-button`, `data-keys-input`)
- **State Attributes**: `data-[state]` for dynamic states (e.g., `data-disabled`, `data-checked`, `data-loading`)
- **Variant Attributes**: `data-variant="[variant-name]"` for styling variants
- **Size Attributes**: `data-size="[size]"` for component sizes
- **Feature Flags**: Component-specific attributes (e.g., `data-has-icon`, `data-multiple`)

**Implementation Pattern:**
```php
// In component class
public function getDataAttributes(): array
{
    $attributes = [
        'data-keys-[component]' => 'true',
        'data-variant' => $this->variant,
        'data-size' => $this->size,
    ];

    // Add conditional state attributes
    if ($this->disabled) {
        $attributes['data-disabled'] = 'true';
    }

    return $attributes;
}
```

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

**Without proper registration, components will not be accessible with the `x-keys::` namespace and will cause undefined variable errors.**

## Keys UI Component Development Guidelines

### Component Styling - Modern Approach
- **Use direct Tailwind utilities** in Blade templates, NOT separate CSS files
- **Leverage existing components** - use Button, Icon, etc. instead of creating custom styles
- **Tailwind pseudo-classes** - `focus-within:`, `hover:`, `data-[attribute]:` for dynamic states
- **Eliminate component CSS files** - move all styling to inline utilities
- **Only use CSS for complex cases** - semantic tokens with `var(--color-*)` when Tailwind can't handle it

### Component Testing
- **Add component tests to the welcome page**, NOT separate test pages
- **Keep testing consolidated** in one place for easier maintenance and review

## Component Refactoring Patterns

### Modern Component Development Principles

**1. Separation of Concerns:**
```php
// ❌ OLD: PHP class with utility methods
public function baseClasses(): string {
    return 'block w-full rounded-md border';
}

// ✅ NEW: PHP class with business logic only
public function hasActions(): bool {
    return !empty($this->configuredActions());
}
```

```blade
{{-- ✅ NEW: Direct Tailwind utilities in template --}}
@php
    $baseClasses = 'block w-full rounded-md border transition-colors duration-200';
    $sizeClasses = match ($size) {
        'xs' => 'px-2.5 py-1 text-xs',
        'md' => 'px-3 py-2 text-sm',
        default => 'px-3 py-2 text-sm'
    };
@endphp
```

**2. Eliminate Redundant Methods:**
```php
// ❌ OLD: Wrapper methods
public function getAllActions(): array {
    return $this->configuredActions();
}

// ✅ NEW: Call core methods directly
// Remove getAllActions(), call configuredActions() directly
```

**3. Leverage Existing Components:**
```blade
{{-- ❌ OLD: Custom CSS for actions --}}
<div class="input-action" data-action="clear">
    {{-- Custom styling via CSS file --}}
</div>

{{-- ✅ NEW: Use existing Button component --}}
<x-keys::button
    variant="ghost"
    size="xs"
    class="text-neutral-400 hover:text-danger"
>
```

**4. Use Tailwind Pseudo-classes:**
```css
/* ❌ OLD: Custom CSS selectors */
.relative:focus-within [data-icon-left] {
    color: var(--color-brand);
}
```

```blade
{{-- ✅ NEW: Tailwind pseudo-classes --}}
<div class="relative focus-within:[&_[data-icon]]:text-brand">
    <div data-icon>{{-- Icon content --}}</div>
</div>
```

### Benefits of Modern Approach
- **Better maintainability** - styling visible in templates
- **Reduced complexity** - fewer PHP methods to maintain
- **Improved performance** - no method call overhead for utilities
- **Consistent patterns** - all components follow same structure
- **Easier debugging** - all styling logic in one place

## Typography Components

Keys UI provides two dedicated typography components that leverage the semantic design token system for consistent, accessible, and flexible text rendering.

### Text Component (`<x-keys::text>`)

**Purpose**: Flexible component for all body text, labels, and inline text elements.

**Key Features:**
- **Element Types**: `p`, `span`, `div`, `label`, `small` (default: `p`)
- **Sizes**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl` (default: `md`)
- **Colors**: Semantic colors (`heading`, `text`, `muted`) + contextual colors (`brand`, `success`, `warning`, `danger`, `info`)
- **Weights**: `light`, `normal`, `medium`, `semibold`, `bold` (default: `normal`)
- **Alignment**: `left`, `center`, `right`, `justify`
- **Line Height**: `tight`, `normal`, `relaxed`, `loose`
- **Line Clamp**: Truncate text to 1-6 lines with `line-clamp` prop
- **Modifiers**: `italic`, `underline`, `uppercase`, `lowercase`, `capitalize`

**Usage Examples:**
```blade
{{-- Basic body text --}}
<x-keys::text>
    This is standard body text using the text color token.
</x-keys::text>

{{-- Muted secondary text --}}
<x-keys::text color="muted" size="sm">
    Secondary information in smaller, muted text.
</x-keys::text>

{{-- Line clamping for truncation --}}
<x-keys::text line-clamp="3">
    Long content that will be truncated to 3 lines with ellipsis...
</x-keys::text>

{{-- Inline label element --}}
<x-keys::text element="label" weight="medium" size="sm">
    Form Field Label
</x-keys::text>
```

### Heading Component (`<x-keys::heading>`)

**Purpose**: Semantic heading component with visual size decoupled from HTML level for flexible typography hierarchy.

**Key Features:**
- **Semantic Levels**: `h1`, `h2`, `h3`, `h4`, `h5`, `h6` (default: `h2`) - proper HTML semantics
- **Visual Sizes**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` - decoupled from level for design flexibility
- **Auto-sizing**: If size is omitted, automatically maps from level (h1→4xl, h2→3xl, h3→2xl, h4→xl, h5→lg, h6→md)
- **Colors**: Same as Text component (semantic + contextual)
- **Weights**: `normal`, `medium`, `semibold`, `bold`, `extrabold` (default: `semibold`)
- **Tracking**: Letter-spacing control (`tighter`, `tight`, `normal`, `wide`, `wider`)
- **Gradient**: Brand color gradient effect for hero headings
- **Underline**: Decorative underline with proper spacing

**Usage Examples:**
```blade
{{-- Semantic h1 with automatic 4xl sizing --}}
<x-keys::heading level="h1">
    Page Title
</x-keys::heading>

{{-- h2 with custom size override --}}
<x-keys::heading level="h2" size="xl" color="brand">
    Section Title
</x-keys::heading>

{{-- Gradient hero heading --}}
<x-keys::heading level="h1" gradient>
    Beautiful Gradient Heading
</x-keys::heading>

{{-- Semantic h3 with muted color --}}
<x-keys::heading level="h3" color="muted" weight="medium">
    Subsection Title
</x-keys::heading>
```

### Design Philosophy

**Semantic HTML + Visual Flexibility:**
The Heading component separates semantic meaning from visual appearance:
- Use `level` prop for proper document structure (accessibility/SEO)
- Use `size` prop for visual hierarchy (design requirements)
- Example: `<x-keys::heading level="h3" size="4xl">` - semantically h3, visually large

**Design Token Integration:**
Both components leverage semantic color tokens:
- `color="heading"` → `--color-heading` (dark, high contrast)
- `color="text"` → `--color-text` (standard body text)
- `color="muted"` → `--color-muted` (secondary, lower contrast)
- `color="brand"` → `--color-accent` (brand accent color)

**Typography Hierarchy Best Practices:**
```blade
{{-- Article structure with proper hierarchy --}}
<x-keys::heading level="h1" size="4xl">Article Title</x-keys::heading>
<x-keys::text color="muted" size="lg">Article subtitle or excerpt</x-keys::text>

<x-keys::heading level="h2" size="2xl">Section Heading</x-keys::heading>
<x-keys::text>Body content goes here...</x-keys::text>

<x-keys::heading level="h3" size="xl">Subsection</x-keys::heading>
<x-keys::text size="sm" color="muted">Additional details...</x-keys::text>
```

### Component Implementation Details

**PHP Class Structure:**
- Constructor validates all props against `ComponentConstants`
- Generates comprehensive data attributes for targeting
- Heading component includes `getDefaultSizeForLevel()` method for auto-sizing
- Simple `render()` method passes all properties to Blade template

**Blade Template Pattern:**
- Uses `@php` blocks with `match` statements for class mapping
- Direct Tailwind utility application (no separate CSS files)
- Gradient support using `bg-gradient-to-r bg-clip-text text-transparent`
- Dynamic element rendering with `<{{ $level }}>` and `<{{ $element }}>`

**Data Attributes:**
Both components include tracking attributes:
- `data-keys-heading="true"` / `data-keys-text="true"` for component identification
- `data-level`, `data-size`, `data-color`, `data-weight` for state tracking
- Conditional attributes (`data-gradient`, `data-underline`) for feature flags