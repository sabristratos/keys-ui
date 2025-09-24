# Keys UI Components Index

A comprehensive reference of all available components in the Keys UI library.

## Form Components

Interactive form elements for user input with validation, accessibility, and comprehensive styling.

### [Button](button.md)
Interactive buttons with multi-state support, icon handling, and auto icon-only detection.

```blade
<x-keys::button variant="brand">Save Changes</x-keys::button>
<x-keys::button icon="heroicon-o-plus" />
<x-keys::button icon="heroicon-o-eye" icon-toggle="heroicon-o-eye-slash">Toggle</x-keys::button>
```

**Key Features:** Multi-state icons, auto icon-only detection, loading states, comprehensive variants

### [Input](input.md)
Text inputs with actions, validation states, and icon support.

```blade
<x-keys::input name="email" label="Email" type="email" required />
<x-keys::input name="search" icon-left="heroicon-o-magnifying-glass" clearable />
<x-keys::input name="password" type="password" password-toggle />
```

**Key Features:** Password toggle, clear/copy actions, icon support, validation states

### [Select](select.md)
Advanced dropdowns with search, multiselect, and rich option content using Laravel slots.

```blade
<x-keys::select name="category" searchable multiple>
    <x-keys::select.option value="tech" label="Technology" icon="heroicon-o-code-bracket" />
    <x-keys::select.option value="design" label="Design" description="UI/UX and visual design" />
</x-keys::select>
```

**Key Features:** Search functionality, multiple selection, rich content options, slot-based architecture, Floating UI positioning

### [Checkbox](checkbox.md)
Single and group checkboxes with card variants and full clickability.

```blade
<x-keys::checkbox name="agree" label="I agree to terms" />
<x-keys::checkbox variant="card" name="plan" value="pro" title="Pro Plan"
    description="Advanced features" icon="heroicon-o-star" />
```

**Key Features:** Card variants, full clickability, choice groups, dynamic highlighting

### [Radio](radio.md)
Radio buttons with rich card layouts for single-choice selections.

```blade
<x-keys::radio name="plan" value="basic" label="Basic Plan" />
<x-keys::radio variant="card" name="plan" value="pro" title="Pro Plan"
    description="Perfect for teams" color="brand" />
```

**Key Features:** Card variants, focus management, full clickability, rich layouts

### [Textarea](textarea.md)
Multi-line text inputs with auto-resize and character counting.

```blade
<x-keys::textarea name="message" label="Message" autoResize />
<x-keys::textarea name="bio" maxlength="500" showCount />
```

**Key Features:** Auto-resize, character counting, validation states

### [Toggle](toggle.md)
Switch components for boolean values with smooth animations.

```blade
<x-keys::toggle name="notifications" label="Email Notifications" />
<x-keys::toggle name="dark_mode" label="Dark Mode" description="Use dark theme" />
```

**Key Features:** Smooth animations, color variants, descriptions

### [Range](range.md)
Slider inputs for numeric ranges with value display.

```blade
<x-keys::range name="volume" min="0" max="100" value="75" show-value />
<x-keys::range name="price" min="0" max="1000" show-labels />
```

**Key Features:** Value display, min/max labels, custom formatting

### [File Upload](file-upload.md)
File selection with drag & drop, progress tracking, and validation.

```blade
<x-keys::file-upload name="documents[]" multiple accept=".pdf,.doc" max-size="10MB" />
<x-keys::file-upload name="avatar" accept="image/*" preview />
```

**Key Features:** Drag & drop, progress tracking, file validation, previews

### [Date Picker](date-picker.md)
Comprehensive date selection with calendar interface, range selection, and Carbon integration.

```blade
<x-keys::date-picker name="event_date" label="Event Date" />
<x-keys::date-picker name="date_range" is-range quick-selectors />
<x-keys::date-picker name="deadline" :min-date="now()" format="Y-m-d" display-format="F j, Y" />
```

**Key Features:** Range selection, quick selectors, date constraints, multiple format support, Carbon integration

### [Editor](editor.md)
Rich text editor with Quill.js integration, toolbar customization, and accessibility support.

```blade
<x-keys::editor name="content" label="Content" />
<x-keys::editor name="description" :toolbar="[['bold', 'italic'], ['link']]" height="150px" />
```

**Key Features:** Quill.js integration, customizable toolbar, multiple themes, loading states, validation support

## Display Components

Visual components for showing information, status, and user feedback.

### [Icon](icon.md)
Flexible icon system supporting Heroicons and custom SVG icons with size variants.

```blade
<x-keys::icon name="heroicon-o-star" />
<x-keys::icon name="heroicon-o-heart" size="lg" />
<x-keys::icon name="custom-logo" size="xl" />
```

**Key Features:** Heroicons support, custom SVG icons, size variants, fallback handling

### [Image](image.md)
Responsive images with loading states, aspect ratios, and optimization features.

```blade
<x-keys::image src="/photo.jpg" alt="Description" />
<x-keys::image src="/banner.jpg" aspect-ratio="16/9" lazy />
```

**Key Features:** Lazy loading, aspect ratio control, responsive sizing, loading states

### [Badge](badge.md)
Status indicators and tags with auto icon-only detection.

```blade
<x-keys::badge color="success">Active</x-keys::badge>
<x-keys::badge icon="heroicon-o-star" color="yellow" />
<x-keys::badge color="brand" dismissible>React</x-keys::badge>
```

**Key Features:** Auto icon-only detection, dismissible chips, color variants

### [Avatar](avatar.md)
User profile display with image support, initials fallback, and status indicators.

```blade
<x-keys::avatar src="/avatar.jpg" name="John Doe" status="online" />
<x-keys::avatar name="Jane Smith" color="brand" />
<x-keys::avatar shape="square" border />
```

**Key Features:** Initials fallback, status indicators, shape options, smart sizing

### [Avatar Stack](avatar-stack.md)
Overlapping avatar displays for teams and groups.

```blade
<x-keys::avatar.stack size="md" spacing="tight">
    <x-keys::avatar name="John Doe" />
    <x-keys::avatar name="Jane Smith" />
    <x-keys::avatar name="Bob Wilson" />
</x-keys::avatar.stack>
```

**Key Features:** Configurable spacing, direction control, size inheritance

### [Alert](alert.md)
Notification messages with variants and dismissible functionality.

```blade
<x-keys::alert variant="success" dismissible>Changes saved!</x-keys::alert>
<x-keys::alert variant="warning" title="Warning" icon="heroicon-o-exclamation-triangle">
    Please review your settings.
</x-keys::alert>
```

**Key Features:** Variant styles, dismissible functionality, custom icons, titles

### [Toast](toast.md)
Notification toasts for user feedback with positioning and auto-hide functionality.

```blade
<x-keys::toast position="top-right" />
<script>
showToast('success', 'Changes saved successfully!');
showToast('error', 'Failed to save changes');
</script>
```

**Key Features:** Multiple positions, auto-hide, dismissible, action buttons, progress tracking

### [Tooltip](tooltip.md)
Floating tooltips with smart positioning and multiple triggers.

```blade
<x-keys::tooltip target="#my-button" placement="top">
    This is a helpful tooltip
</x-keys::tooltip>
<x-keys::button id="my-button">Hover me</x-keys::button>
```

**Key Features:** Smart positioning, multiple triggers, color themes, size variants

### [Modal](modal.md)
Dialog overlays with animations and Livewire integration.

```blade
<x-keys::modal id="user-modal" size="lg" scrollable>
    <h2>User Details</h2>
    <!-- Modal content -->
</x-keys::modal>
```

**Key Features:** Size variants, animations, scrollable content, Livewire support

### [Progress](progress.md)
Progress bars and loading indicators with animations.

```blade
<x-keys::progress value="75" max="100" show-percentage />
<x-keys::progress indeterminate label="Loading..." />
<x-keys::progress value="45" variant="striped" color="success" />
```

**Key Features:** Value display, indeterminate mode, striped/animated variants

### [Loading](loading.md)
Visual loading indicators with multiple animation styles and size variants.

```blade
<x-keys::loading animation="spinner" />
<x-keys::loading animation="dots" size="lg" />
<x-keys::loading animation="pulse" class="text-brand" />
```

**Key Features:** Multiple animation styles (spinner, dots, bars, pulse, wave, bounce), size variants, color inheritance

### [Gallery](gallery.md)
Image galleries with lightbox functionality, masonry layouts, and navigation.

```blade
<x-keys::gallery :images="$photos" layout="masonry" lightbox />
<x-keys::gallery :images="$portfolio" columns="3" />
```

**Key Features:** Lightbox support, multiple layouts, navigation controls, responsive design

### [Popover](popover.md)
Floating content containers with smart positioning and interactive triggers.

```blade
<x-keys::popover target="#trigger" placement="top">
    <div class="p-4">Popover content here</div>
</x-keys::popover>
```

**Key Features:** Smart positioning, multiple triggers, interactive content, accessibility support

## Layout Components

Structural components for organizing and presenting content.

### [Card](card.md)
Content containers with selection support and interactive features.

```blade
<x-keys::card variant="padded">
    <h3>Card Title</h3>
    <p>Card content...</p>
</x-keys::card>
<x-keys::card selectable name="plan" value="pro">
    <div class="p-4">Selectable card content</div>
</x-keys::card>
```

**Key Features:** Selection support, interactive states, multiple variants

### [Dropdown](dropdown.md)
Flexible dropdown menus with customizable positioning and alignment.

```blade
<x-keys::dropdown>
    <x-slot:trigger>
        <x-keys::button>Options</x-keys::button>
    </x-slot:trigger>
    <div class="space-y-1">
        <a href="#" class="block px-3 py-2 rounded text-sm hover:bg-neutral-100">Profile</a>
        <a href="#" class="block px-3 py-2 rounded text-sm hover:bg-neutral-100">Settings</a>
    </div>
</x-keys::dropdown>
```

**Key Features:** Flexible positioning, modal behavior, size variants, accessibility

### [Accordion](accordion.md)
Collapsible content sections with rich styling options, animations, and action support.

```blade
<x-keys::accordion title="Frequently Asked Questions">
    <p>Here are the most commonly asked questions...</p>
</x-keys::accordion>
<x-keys::accordion variant="elevated" color="brand" title="Settings" :actions="$headerActions">
    <div class="space-y-4"><!-- Settings content --></div>
</x-keys::accordion>
```

**Key Features:** Multiple variants, color themes, header actions, animations, accessibility

### [Table](table.md)
Comprehensive data tables with sorting, pagination, and selection features.

```blade
<x-keys::table striped hover selectable :paginate="$users">
    <x-slot:header>
        <tr>
            <th><x-keys::checkbox name="select_all" /></th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
        </tr>
    </x-slot:header>
    @foreach($users as $user)
        <tr>
            <td><x-keys::checkbox name="selected[]" :value="$user->id" /></td>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
            <td><x-keys::button size="sm">Edit</x-keys::button></td>
        </tr>
    @endforeach
</x-keys::table>
```

**Key Features:** Pagination integration, row selection, responsive design, loading states

## Navigation Components

Components for site navigation and user guidance.

### [Menu](menu.md)
Flexible menu component for navigation interfaces with accessibility support.

```blade
<x-keys::menu aria-label="Main navigation">
    <a href="/dashboard" class="menu-item">Dashboard</a>
    <a href="/profile" class="menu-item">Profile</a>
    <a href="/settings" class="menu-item">Settings</a>
</x-keys::menu>
```

**Key Features:** ARIA support, keyboard navigation, role variants, focus management

### [Breadcrumbs](breadcrumbs.md)
Navigation trails showing the user's current location with responsive mobile handling.

```blade
<x-keys::breadcrumbs>
    <li><a href="/">Home</a><span class="mx-2">/</span></li>
    <li><a href="/products">Products</a><span class="mx-2">/</span></li>
    <li aria-current="page">Laptops</li>
</x-keys::breadcrumbs>
```

**Key Features:** Responsive design, mobile truncation, semantic navigation, accessibility

### [Tabs](tabs.md)
Tabbed interfaces for content organization with animated markers and orientation options.

```blade
<x-keys::tabs default-value="overview">
    <x-keys::tab value="overview">Overview</x-keys::tab>
    <x-keys::tab value="details">Details</x-keys::tab>
    <x-slot:panels>
        <x-keys::tab-panel value="overview">Overview content</x-keys::tab-panel>
        <x-keys::tab-panel value="details">Details content</x-keys::tab-panel>
    </x-slot:panels>
</x-keys::tabs>
```

**Key Features:** Horizontal/vertical orientation, animated markers, multiple variants, accessibility

## Utility Components

Supporting components for forms, layout, and enhanced functionality.

### [Field](field.md)
Form field wrapper component that provides consistent spacing and layout for form elements.

```blade
<x-keys::field>
    <x-keys::label for="username">Username</x-keys::label>
    <x-keys::input name="username" id="username" />
    <x-keys::error :messages="$errors->get('username')" />
</x-keys::field>
```

**Key Features:** Consistent spacing, semantic structure, flexible layout, accessibility support

### [Label](label.md)
Enhanced form labels with size variants, required/optional indicators, and consistent styling.

```blade
<x-keys::label for="email" required>Email Address</x-keys::label>
<x-keys::label for="phone" optional>Phone Number</x-keys::label>
<x-keys::label size="lg">Large Label</x-keys::label>
```

**Key Features:** Required/optional indicators, size variants, proper association, accessibility

### [Error](error.md)
Form validation error display component with flexible message handling and icon support.

```blade
<x-keys::error messages="This field is required" />
<x-keys::error :messages="$errors->get('email')" />
<x-keys::error :messages="['Error 1', 'Error 2']" :show-icon="false" />
```

**Key Features:** Multiple message types, icon display, Laravel validation integration, accessibility

### [Separator](separator.md)
Visual dividers and separators with multiple styles, orientations, and customization options.

```blade
<x-keys::separator />
<x-keys::separator variant="text">OR</x-keys::separator>
<x-keys::separator variant="gradient" color="brand" />
<x-keys::separator orientation="vertical" />
```

**Key Features:** Multiple variants (line, text, icon, gradient, dashed), orientation options, color themes

### [Scripts](scripts.md)
Asset management component that automatically injects Keys UI JavaScript functionality.

```blade
<x-keys::scripts />
```

**Key Features:** Auto-injection, translation support, configuration management, cache busting

## Advanced Components

Sophisticated components for complex interfaces and specialized use cases.

### [ChoiceGroup](choice-group.md)
Advanced grouped choice interfaces for checkboxes and radio buttons with validation support.

```blade
<x-keys::choice-group name="preferences" legend="Notification Preferences" type="checkbox">
    <x-keys::checkbox name="preferences[]" value="email" label="Email notifications" />
    <x-keys::checkbox name="preferences[]" value="sms" label="SMS notifications" />
    <x-keys::checkbox name="preferences[]" value="push" label="Push notifications" />
</x-keys::choice-group>
```

**Key Features:** Fieldset grouping, validation support, multiple layouts, accessibility

### Specialized Components

Components for specific use cases and advanced functionality.

**Note:** The following components are available but documentation is currently being expanded:

- **Calendar**: Full calendar interface with event management
- **TimePicker**: Time selection component with 12/24 hour formats
- **Media Upload**: Advanced file upload with preview and management

## Component Patterns

### Data Attributes System
All components include comprehensive data attributes for precise targeting:

```css
/* Target specific component states */
[data-keys-button][data-loading="true"] { /* styles */ }
[data-keys-input][data-has-value="true"] { /* styles */ }
[data-keys-checkbox][data-variant="card"][data-checked="true"] { /* styles */ }
```

### Auto Icon-Only Detection
Several components automatically detect icon-only usage:

```blade
{{-- These automatically become icon-only --}}
<x-keys::button icon="heroicon-o-plus" />
<x-keys::badge icon="heroicon-o-star" color="yellow" />
```

### Multi-State Support
Components like Button support state-based icon changes:

```blade
<x-keys::button
    icon="heroicon-o-eye"
    icon-toggle="heroicon-o-eye-slash"
    icon-success="heroicon-o-check"
>
    Toggle Password
</x-keys::button>
```

### Progressive Enhancement
All components work without JavaScript and are enhanced with it:

- Form components submit properly without JS
- Interactive features are added progressively
- Accessibility is maintained at all levels

### Slot-Based Architecture
Many components use Laravel slots for maximum flexibility:

```blade
<x-keys::select name="category">
    <x-keys::select.option value="tech">
        <div class="flex items-center gap-2">
            <x-keys::icon name="heroicon-o-code-bracket" />
            <span>Technology</span>
        </div>
    </x-keys::select.option>
</x-keys::select>
```

## Component Registration

All components are automatically registered with the `keys::` namespace:

```php
// In KeysUiServiceProvider.php
Blade::component('keys::button', Button::class);
Blade::component('keys::input', Input::class);
Blade::component('keys::select', Select::class);
Blade::component('keys::select.option', Option::class);
// ... and all other components
```

## Usage Guidelines

### Semantic Design System
Components use CSS custom properties for consistent theming:

```css
/* Automatically generated utilities from design tokens */
.text-foreground { color: var(--color-foreground); }
.bg-surface { background: var(--color-surface); }
.border-muted { border-color: var(--color-muted); }
```

### Accessibility First
- WCAG compliance built into all components
- Proper ARIA attributes and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Framework Integration
- **Laravel Blade**: Native component system
- **Livewire**: Full reactive interface support
- **Alpine.js**: Enhanced client-side interactions
- **Tailwind v4**: Modern CSS with auto-generated utilities

### Form Validation
Built-in support for Laravel validation:

```blade
<x-keys::input
    name="email"
    label="Email"
    :errors="$errors"
    value="{{ old('email') }}"
    required
/>
```

## Quick Reference

### Most Used Components
```blade
{{-- Forms --}}
<x-keys::button variant="brand">Save</x-keys::button>
<x-keys::input name="email" label="Email" type="email" />
<x-keys::select name="category">
    <x-keys::select.option value="tech" label="Technology" />
</x-keys::select>
<x-keys::checkbox name="agree" label="I agree" />

{{-- Display --}}
<x-keys::badge color="success">Active</x-keys::badge>
<x-keys::avatar name="John Doe" />
<x-keys::alert variant="success">Success message</x-keys::alert>

{{-- Layout --}}
<x-keys::card variant="padded">Content</x-keys::card>
<x-keys::modal id="modal">Modal content</x-keys::modal>
```

### Common Patterns
```blade
{{-- Form with validation --}}
<form method="POST">
    @csrf
    <x-keys::input name="name" label="Name" :errors="$errors" required />
    <x-keys::button type="submit" variant="brand">Submit</x-keys::button>
</form>

{{-- Selection interface --}}
<x-keys::radio variant="card" name="plan" value="pro"
    title="Pro Plan" description="Advanced features" />

{{-- Interactive dashboard --}}
<x-keys::card variant="elevated">
    <div class="p-6">
        <h3>Dashboard Widget</h3>
        <x-keys::progress value="75" show-percentage />
    </div>
</x-keys::card>
```

For detailed documentation on any component, click the component name or browse the individual component files in this documentation folder.