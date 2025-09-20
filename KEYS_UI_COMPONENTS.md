# Keys UI Component Reference

Quick reference for all Keys UI components with their features and syntax.

## Form Components

### Button Group
**Grouped buttons with shared styling**

```blade
<x-keys::button.group>
    <x-keys::button>First</x-keys::button>
    <x-keys::button>Second</x-keys::button>
    <x-keys::button>Third</x-keys::button>
</x-keys::button.group>

<x-keys::button.group orientation="vertical" attached="false">
    <x-keys::button variant="outline">Option A</x-keys::button>
    <x-keys::button variant="outline">Option B</x-keys::button>
</x-keys::button.group>
```

**Props:**
- `orientation`: horizontal|vertical (default: horizontal)
- `size`: xs|sm|md|lg|xl (inherited by child buttons)
- `attached`: Connect buttons visually (default: true)

### Button
**Multi-state button with icon support and auto icon-only detection**

```blade
<x-keys::button>Click me</x-keys::button>
<x-keys::button variant="danger" size="lg">Delete</x-keys::button>
<x-keys::button icon="heroicon-o-plus" />
<x-keys::button icon="heroicon-o-eye" icon-toggle="heroicon-o-eye-slash">Toggle</x-keys::button>
```

**Props:**
- `variant`: brand|danger|warning|success|info|neutral|ghost|outline (default: brand)
- `size`: xs|sm|md|lg|xl (default: md)
- `icon|icon-left`: Left icon name
- `icon-right`: Right icon name
- `icon-toggle`: Icon for toggle state
- `icon-success`: Icon for success state
- `label-toggle|label-success`: Alternative labels for states
- `disabled|loading`: Boolean states
- `href`: Makes button a link
- `type`: Button type (default: button)

### Input
**Enhanced input with actions and built-in features**

```blade
<x-keys::input name="email" placeholder="Enter email" />
<x-keys::input type="password" show-password clearable />
<x-keys::input icon-left="heroicon-o-envelope" copyable />
<x-keys::input label="Email" optional errors="{{ $errors->get('email') }}" />
```

**Props:**
- `type`: text|email|password|number|url|search|tel (default: text)
- `name|id|value|placeholder`: Standard attributes
- `size`: sm|md|lg (default: md)
- `disabled|readonly|required`: Boolean states
- `icon-left|icon-right`: Icon names
- `clearable|copyable`: Built-in actions
- `show-password`: Password toggle (for password type)
- `external-url`: External link action
- `actions`: Custom action array
- `label|optional`: Shorthand mode
- `errors`: Error messages (string|array|Collection)

### Select
**Advanced dropdown with search, multiple selection, and rich options**

```blade
<x-keys::select name="category" placeholder="Choose...">
    <x-keys::select.option value="tech" label="Technology" />
    <x-keys::select.option value="design" label="Design" icon="heroicon-o-paint-brush" />
</x-keys::select>

<x-keys::select name="skills[]" multiple searchable clearable>
    <x-keys::select.option value="php" label="PHP" description="Server-side language" />
</x-keys::select>
```

**Props:**
- `name|id|value`: Standard attributes
- `multiple`: Enable multi-select with chips
- `searchable`: Add search input
- `clearable`: Clear button
- `size`: sm|md|lg (default: md)
- `placeholder`: Empty state text
- `disabled|required`: Boolean states
- `label|optional`: Shorthand mode
- `errors`: Error messages

### Checkbox
**Multi-variant checkbox with card layouts**

```blade
<x-keys::checkbox name="agree" label="I agree" />
<x-keys::checkbox variant="card" title="Premium Plan" description="Advanced features" />
<x-keys::checkbox variant="colored" color="success" checked />
<x-keys::checkbox show-input="false">Pure card mode</x-keys::checkbox>
```

**Props:**
- `name|id|value`: Standard attributes (value defaults to "1")
- `checked|disabled|required`: Boolean states
- `variant`: standard|bordered|colored|card (default: standard)
- `color`: brand|success|warning|danger|neutral (default: brand)
- `size`: sm|md|lg (default: md)
- `label|title|description`: Content options
- `icon`: Display icon
- `show-input`: Show/hide actual input (default: true)
- `actions`: Action buttons array

### Radio
**Radio buttons with same variants as checkbox**

```blade
<x-keys::radio name="plan" value="basic" label="Basic Plan" />
<x-keys::radio name="plan" value="pro" variant="card" title="Pro Plan" icon="heroicon-o-star" />
```

**Props:** Same as Checkbox except:
- `value`: Required for radio buttons
- No `indeterminate` property

### Textarea
**Enhanced textarea input**

```blade
<x-keys::textarea name="description" placeholder="Enter description..." />
<x-keys::textarea label="Bio" rows="5" clearable />
```

**Props:** Similar to Input plus:
- `rows`: Number of rows (default: 3)
- `cols`: Number of columns

### Toggle
**Switch/toggle input**

```blade
<x-keys::toggle name="notifications" label="Enable notifications" />
<x-keys::toggle checked size="lg" color="success" />
```

**Props:**
- `name|id|checked|disabled`: Standard attributes
- `size`: sm|md|lg (default: md)
- `color`: brand|success|warning|danger|neutral (default: brand)
- `label|description`: Content options

## Display Components

### Avatar
**User profile images with fallbacks and status indicators**

```blade
<x-keys::avatar src="https://example.com/avatar.jpg" name="John Doe" />
<x-keys::avatar name="Jane Smith" size="lg" color="purple" />
<x-keys::avatar name="Bob" status="online" border />
<x-keys::avatar /> {{-- Fallback icon --}}
```

**Props:**
- `src`: Image URL
- `name`: User name (for initials fallback)
- `alt`: Alt text (auto-generated from name)
- `size`: xs|sm|md|lg|xl (default: md)
- `shape`: circle|square (default: circle)
- `status`: online|offline|away|busy
- `color`: brand|success|warning|danger|neutral|red|green|blue|purple|yellow|teal|orange
- `border`: Enable border ring
- `lazy`: Lazy loading (default: true)

### Avatar Stack
**Overlapping avatar display**

```blade
<x-keys::avatar.stack>
    <x-keys::avatar name="John Doe" />
    <x-keys::avatar name="Jane Smith" />
    <x-keys::avatar name="Bob Johnson" />
</x-keys::avatar.stack>

<x-keys::avatar.stack size="lg" spacing="tight" direction="rtl">
    <!-- Avatars inherit size -->
</x-keys::avatar.stack>
```

**Props:**
- `size`: Passed to child avatars
- `spacing`: tight|default|loose
- `direction`: ltr|rtl (default: ltr)
- `max`: Maximum avatars (1-10, default: 5)

### Badge
**Status indicators and tags with auto icon-only detection**

```blade
<x-keys::badge color="blue">New</x-keys::badge>
<x-keys::badge icon="heroicon-o-check" color="success" />
<x-keys::badge variant="chip" dismissible>Removable</x-keys::badge>
<x-keys::badge icon="heroicon-o-star" color="yellow">Featured</x-keys::badge>
```

**Props:**
- `variant`: simple|chip (auto-switches to chip when dismissible)
- `color`: brand|success|warning|danger|neutral or specific colors (blue|gray|red|green|yellow|indigo|purple|pink)
- `size`: xs|sm|md (default: sm)
- `icon`: Heroicon name
- `dismissible`: Enable close functionality (auto-enables chip variant)
- `id`: Custom ID (auto-generated for dismissible)

### Icon
**Icon display with Heroicon support**

```blade
<x-keys::icon name="heroicon-o-heart" />
<x-keys::icon name="heroicon-s-star" size="lg" />
<x-keys::icon name="custom-icon" fallback="heroicon-o-question-mark-circle" />
```

**Props:**
- `name`: Icon name (heroicon-* or custom)
- `size`: xs|sm|md|lg|xl (default: md)
- `fallback`: Fallback icon name

### Alert
**Alert messages and notifications**

```blade
<x-keys::alert variant="success">Operation completed successfully!</x-keys::alert>
<x-keys::alert variant="danger" title="Error" dismissible>
    Something went wrong.
</x-keys::alert>
```

**Props:**
- `variant`: success|danger|warning|info|neutral (default: info)
- `title`: Alert title
- `dismissible`: Enable close button
- `icon`: Custom icon

### Card
**Content containers**

```blade
<x-keys::card>
    <x-slot:header>Card Title</x-slot:header>
    Card content goes here
    <x-slot:footer>Card footer</x-slot:footer>
</x-keys::card>
```

**Props:**
- `variant`: default|bordered|elevated
- `padding`: Boolean for content padding

### Modal
**Dialog overlays**

```blade
<x-keys::modal name="confirm-modal" title="Confirm Action">
    Are you sure you want to continue?
    <x-slot:footer>
        <x-keys::button variant="ghost">Cancel</x-keys::button>
        <x-keys::button variant="danger">Confirm</x-keys::button>
    </x-slot:footer>
</x-keys::modal>
```

**Props:**
- `name`: Modal identifier
- `title`: Modal title
- `size`: sm|md|lg|xl (default: md)
- `closable`: Enable close button (default: true)

## Layout Components

### Tabs
**Tabbed interface**

```blade
<x-keys::tabs>
    <x-keys::tabs.tab name="tab1" label="Tab 1" active>Content 1</x-keys::tabs.tab>
    <x-keys::tabs.tab name="tab2" label="Tab 2">Content 2</x-keys::tabs.tab>
</x-keys::tabs>
```

### Accordion
**Collapsible content sections**

```blade
<x-keys::accordion>
    <x-keys::accordion.item title="Section 1" open>
        Content for section 1
    </x-keys::accordion.item>
    <x-keys::accordion.item title="Section 2">
        Content for section 2
    </x-keys::accordion.item>
</x-keys::accordion>
```

### Table
**Data tables with loading and empty states**

```blade
<x-keys::table>
    <x-keys::table.header>
        <x-keys::table.row>
            <x-keys::table.head>Name</x-keys::table.head>
            <x-keys::table.head>Email</x-keys::table.head>
        </x-keys::table.row>
    </x-keys::table.header>
    <x-keys::table.body>
        <x-keys::table.row>
            <x-keys::table.cell>John Doe</x-keys::table.cell>
            <x-keys::table.cell>john@example.com</x-keys::table.cell>
        </x-keys::table.row>
    </x-keys::table.body>
</x-keys::table>

{{-- Loading state --}}
<x-keys::table.loading />

{{-- Empty state --}}
<x-keys::table.empty-state
    title="No users found"
    description="Add some users to get started"
    icon="heroicon-o-users"
    action-text="Add User"
    action-url="/users/create" />
```

**Empty State Props:**
- `title`: Empty state title (default: "No data found")
- `description`: Description text
- `icon`: Icon to display
- `action-text|action-url`: Call-to-action button
- `variant`: neutral|success|warning|danger|brand
- `size`: sm|md|lg (default: md)

## Utility Components

### Loading
**Loading indicators**

```blade
<x-keys::loading />
<x-keys::loading type="dots" size="lg" />
<x-keys::loading type="pulse" color="brand" />
```

**Props:**
- `type`: spinner|dots|pulse (default: spinner)
- `size`: xs|sm|md|lg|xl (default: md)
- `color`: brand|success|warning|danger|neutral

### Toast
**Notification toasts**

```blade
<x-keys::toast variant="success" title="Success">
    Your changes have been saved.
</x-keys::toast>
```

### Tooltip
**Hover tooltips**

```blade
<x-keys::tooltip content="This is a tooltip">
    Hover me
</x-keys::tooltip>
```

### Breadcrumbs
**Navigation breadcrumbs**

```blade
<x-keys::breadcrumbs>
    <x-keys::breadcrumbs.item href="/">Home</x-keys::breadcrumbs.item>
    <x-keys::breadcrumbs.item href="/products">Products</x-keys::breadcrumbs.item>
    <x-keys::breadcrumbs.item>Current Page</x-keys::breadcrumbs.item>
</x-keys::breadcrumbs>
```

### Menu
**Navigation menus with advanced features**

```blade
<x-keys::menu>
    <x-keys::menu.item href="/dashboard" icon="heroicon-o-home">Dashboard</x-keys::menu.item>
    <x-keys::menu.item href="/profile" active>Profile</x-keys::menu.item>
    <x-keys::menu.separator />
    <x-keys::menu.submenu heading="Settings" icon="heroicon-o-cog-6-tooth">
        <x-keys::menu.item href="/settings/general">General</x-keys::menu.item>
        <x-keys::menu.item href="/settings/security">Security</x-keys::menu.item>
    </x-keys::menu.submenu>
    <x-keys::menu.checkbox name="notifications" label="Enable notifications" />
    <x-keys::menu.radio name="theme" value="light" label="Light theme" />
</x-keys::menu>
```

**Submenu Props:**
- `heading`: Submenu title
- `icon`: Icon for submenu trigger
- `position`: right|left|top|bottom (default: right)
- `align`: start|center|end (default: start)
- `keep-open`: Keep submenu open on item click
- `disabled`: Disable submenu

### Dropdown
**Dropdown menus**

```blade
<x-keys::dropdown>
    <x-slot:trigger>
        <x-keys::button>Options</x-keys::button>
    </x-slot:trigger>

    <x-keys::dropdown.item href="/edit">Edit</x-keys::dropdown.item>
    <x-keys::dropdown.item href="/delete" variant="danger">Delete</x-keys::dropdown.item>
</x-keys::dropdown>
```

## Advanced Components

### DatePicker
**Date selection**

```blade
<x-keys::date-picker name="date" />
<x-keys::date-picker name="date_range" range />
```

### TimePicker
**Time selection**

```blade
<x-keys::time-picker name="time" />
<x-keys::time-picker name="time" format="12" />
```

### FileUpload
**File upload with drag & drop**

```blade
<x-keys::file-upload name="files" />
<x-keys::file-upload name="images" multiple accept="image/*" />
```

### Range
**Range slider input**

```blade
<x-keys::range name="volume" min="0" max="100" />
<x-keys::range name="price_range" dual />
```

### Editor
**Rich text editor**

```blade
<x-keys::editor name="content" />
<x-keys::editor name="description" toolbar="minimal" />
```

### Calendar
**Calendar display**

```blade
<x-keys::calendar />
<x-keys::calendar mode="month" />
```

### Progress
**Progress indicators**

```blade
<x-keys::progress value="75" />
<x-keys::progress value="50" color="success" size="lg" />
```

### AddToCart
**E-commerce add to cart button**

```blade
<x-keys::add-to-cart product-id="123" />
<x-keys::add-to-cart product-id="456" variant="success" size="lg" />
```

## Utility Components

### Label
**Form labels**

```blade
<x-keys::label for="email">Email Address</x-keys::label>
<x-keys::label for="bio" optional>Biography</x-keys::label>
```

### Field
**Form field wrapper**

```blade
<x-keys::field label="Email" optional>
    <x-keys::input name="email" />
</x-keys::field>
```

### Error
**Error message display**

```blade
<x-keys::error>This field is required</x-keys::error>
<x-keys::error :messages="$errors->get('email')" />
```

### ChoiceGroup
**Group of choices (checkbox/radio)**

```blade
<x-keys::choice-group label="Select options" type="checkbox">
    <x-keys::checkbox name="options[]" value="1" label="Option 1" />
    <x-keys::checkbox name="options[]" value="2" label="Option 2" />
</x-keys::choice-group>
```

### HeadingDecorator
**Decorative headings**

```blade
<x-keys::heading-decorator level="h2">Section Title</x-keys::heading-decorator>
```

### Image
**Enhanced image display**

```blade
<x-keys::image src="image.jpg" alt="Description" lazy />
<x-keys::image src="image.jpg" aspect-ratio="16:9" />
```

### Separator
**Visual content dividers with multiple variants**

```blade
<x-keys::separator />
<x-keys::separator variant="dashed" color="brand" />
<x-keys::separator variant="gradient" size="lg" />
<x-keys::separator variant="text" alignment="center">or</x-keys::separator>
<x-keys::separator variant="icon" icon="heroicon-o-star" />
<x-keys::separator orientation="vertical" spacing="lg" />
```

**Props:**
- `variant`: line|text|icon|gradient|dashed (default: line)
- `orientation`: horizontal|vertical (default: horizontal)
- `color`: brand|success|warning|danger|neutral + specific colors
- `size`: xs|sm|md|lg (default: sm)
- `spacing`: none|xs|sm|md|lg|xl (default: md)
- `alignment`: left|center|right (default: center)
- `icon`: Icon name for icon variant

## Component Features

### Auto Icon-Only Detection
Button and Badge components automatically detect when only an icon is provided and adjust styling accordingly.

### Multi-State Support
Button and Input actions support multiple states (default → toggle → success) with automatic icon and label switching.

### Progressive Enhancement
All components work without JavaScript and are enhanced with interactive features when JS is available.

### Form Integration
Form components integrate seamlessly with Laravel validation and work with Livewire/Alpine.js.

### Dark Mode Support
All components include comprehensive dark mode styling using Tailwind's dark mode features.

### Accessibility
Components follow WCAG guidelines with proper ARIA attributes, keyboard navigation, and screen reader support.

### TypeScript Support
The package includes TypeScript definitions for interactive components with 20+ action classes for enhanced functionality.

### Asset Integration
Include Keys UI assets in your Blade templates:
```blade
{{-- Auto-inject Keys UI scripts --}}
<keys:scripts />

{{-- CSS is imported via app.css --}}
@import "../../vendor/keys/ui/resources/css/keys-ui.css";
```

### Build Commands
```bash
# Build Keys UI assets
cmd //c "php artisan keys:build"

# Watch mode for development
cmd //c "php artisan keys:build --watch"

# Development build with publishing
cmd //c "php artisan keys:build --dev --publish"
```

### Component Namespace
All components use the `x-keys::` namespace:
```blade
<x-keys::button>         <!-- Main components -->
<x-keys::button.group>   <!-- Nested components -->
<x-keys::select.option>  <!-- Sub-components -->
```