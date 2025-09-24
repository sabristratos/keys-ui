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
<x-keys::button loading loading-animation="dots">Processing</x-keys::button>
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
- `loading-animation`: spinner|dots (default: spinner)
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
**Switch/toggle input with advanced features**

```blade
<x-keys::toggle name="notifications" label="Enable notifications" />
<x-keys::toggle checked size="lg" color="success" />
<x-keys::toggle name="settings" description="Configure app behavior" />
<x-keys::toggle name="premium" label-position="left" actions="[['type' => 'info', 'icon' => 'heroicon-o-information-circle']]" />
```

**Props:**
- `name|id|value|checked|disabled|required`: Standard attributes
- `size`: xs|sm|md|lg|xl (default: md)
- `color`: brand|success|warning|danger|neutral|red|green|purple|yellow|teal|orange (default: brand)
- `label|description|hint`: Content options
- `label-position`: left|right (default: right)
- `actions`: Action buttons array
- `action-variant|action-size`: Action styling
- `errors`: Error messages (string|array|Collection)
- `show-errors`: Display error messages (default: true)

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
**Icon display with Heroicon support and custom SVG icons**

```blade
{{-- Heroicons (built-in) --}}
<x-keys::icon name="heroicon-o-heart" />
<x-keys::icon name="heroicon-s-star" size="lg" />

{{-- Custom icons --}}
<x-keys::icon name="custom-logo" />
<x-keys::icon name="company-icon" size="xl" />
<x-keys::icon name="custom-icon" fallback="heroicon-o-question-mark-circle" />
```

#### Custom Icon Setup

**1. File Structure:**
Create a `resources/icons/` directory in your Laravel project:
```
resources/
├── icons/
│   ├── custom-logo.svg
│   ├── company-icon.svg
│   ├── social-media/
│   │   ├── facebook.svg
│   │   ├── twitter.svg
│   │   └── linkedin.svg
│   └── ui/
│       ├── arrow-custom.svg
│       └── check-custom.svg
```

**2. SVG Requirements:**
- Files must be valid SVG format with `.svg` extension
- Remove width/height attributes to allow CSS sizing
- Use `viewBox` attribute for proper scaling
- Optimize SVGs for web (remove unnecessary elements)

**3. Naming Convention:**
- Use kebab-case: `custom-icon.svg`
- Descriptive names: `company-logo.svg`, `arrow-right-custom.svg`
- Avoid `heroicon-` prefix (reserved for Heroicons)

#### Usage Examples

```blade
{{-- Basic custom icon --}}
<x-keys::icon name="custom-logo" />

{{-- Custom icon with size --}}
<x-keys::icon name="company-icon" size="xl" />

{{-- Custom icon with fallback --}}
<x-keys::icon name="rare-icon" fallback="heroicon-o-exclamation-triangle" />

{{-- Subdirectory icons (use forward slash) --}}
<x-keys::icon name="social-media/facebook" size="lg" />
<x-keys::icon name="ui/check-custom" />

{{-- Mix custom and Heroicons --}}
<div class="flex items-center gap-2">
    <x-keys::icon name="custom-logo" size="md" />
    <x-keys::icon name="heroicon-o-arrow-right" size="sm" />
    <x-keys::icon name="company-badge" size="md" />
</div>
```

#### Example SVG Format

```svg
<!-- Good: Optimized SVG for Keys UI -->
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
        fill="currentColor"/>
</svg>

<!-- Avoid: Fixed dimensions -->
<svg width="24" height="24" viewBox="0 0 24 24">
  <!-- content -->
</svg>
```

#### Best Practices

**Icon Organization:**
- Group related icons in subdirectories
- Use consistent naming across your project
- Keep a documented list of available custom icons
- Version control your icon assets

**Performance:**
- Optimize SVGs before adding (remove unnecessary paths, comments, metadata)
- Use `fill="currentColor"` for icons that should inherit text color
- Keep file sizes small (typically under 2KB per icon)
- Consider icon fonts for large icon sets

**Accessibility:**
- Use descriptive names that indicate the icon's purpose
- Ensure adequate color contrast when using colored icons
- Provide alternative text context in the surrounding UI

#### Troubleshooting

**Icon not displaying:**
1. Check file path: `resources/icons/your-icon.svg`
2. Verify SVG format is valid
3. Ensure file permissions allow reading
4. Check for typos in icon name

**Icon sizing issues:**
1. Remove `width` and `height` attributes from SVG
2. Ensure `viewBox` is properly set
3. Use `fill="currentColor"` for color inheritance

**Fallback behavior:**
- If custom icon doesn't exist, fallback icon will be used
- If no fallback specified, defaults to `heroicon-o-question-mark-circle`
- Fallback icons must be valid Heroicon names

**Props:**
- `name`: Icon name (heroicon-* or custom path)
- `size`: xs|sm|md|lg|xl (default: md)
- `fallback`: Fallback icon name (Heroicon)

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
**Content containers with interactive and selectable states**

```blade
<x-keys::card>
    <x-slot:header>Card Title</x-slot:header>
    Card content goes here
    <x-slot:footer>Card footer</x-slot:footer>
</x-keys::card>

<x-keys::card variant="elevated" interactive selected>
    Interactive and selected card
</x-keys::card>

<x-keys::card href="/profile" interactive>
    Clickable card that links to profile
</x-keys::card>
```

**Props:**
- `variant`: default|elevated|outlined|filled (default: default)
- `padding`: none|xs|sm|md|lg|xl (default: md)
- `rounded`: none|xs|sm|md|lg|xl|2xl|3xl (default: md)
- `shadow`: none|xs|sm|md|lg|xl|2xl (default: sm)
- `interactive`: Enable hover and focus states (default: false)
- `selected`: Mark card as selected with data attribute (default: false)
- `href`: Make card clickable with link behavior
- `disabled`: Disable card interactions (default: false)

### Modal
**Advanced dialog overlays with animation and Livewire integration**

```blade
{{-- Basic modal with header and footer slots --}}
<x-keys::modal id="confirm-modal" size="md">
    <x-slot:header>
        <h3 class="text-lg font-semibold">Confirm Action</h3>
        <button data-modal-close class="text-neutral-400 hover:text-neutral-600">
            <x-keys::icon name="heroicon-o-x-mark" size="sm" />
        </button>
    </x-slot:header>

    Are you sure you want to continue with this action?

    <x-slot:footer>
        <x-keys::button variant="ghost" data-modal-close>Cancel</x-keys::button>
        <x-keys::button variant="danger">Confirm</x-keys::button>
    </x-slot:footer>
</x-keys::modal>

{{-- Livewire-integrated modal --}}
<x-keys::modal
    id="user-form"
    size="lg"
    wire:model="showUserModal"
    wire:open="openUserModal"
    wire:close="closeUserModal"
    scrollable
>
    <x-slot:header>
        <h3>Edit User</h3>
    </x-slot:header>

    <livewire:user-form :user="$selectedUser" />

    <x-slot:footer>
        <x-keys::button wire:click="saveUser" variant="brand">Save</x-keys::button>
    </x-slot:footer>
</x-keys::modal>

{{-- Full-screen modal with no animation --}}
<x-keys::modal
    id="gallery-modal"
    size="full"
    backdrop="dark"
    :animate="false"
    :centered="false"
>
    <div class="h-full flex items-center justify-center">
        <x-keys::gallery :images="$galleryImages" lightbox />
    </div>
</x-keys::modal>
```

**Props:**
- `id` (required): Modal identifier for JavaScript control
- `size`: xs|sm|md|lg|xl|full (default: md) - Modal width/sizing
- `closedby`: any|closerequest|none (default: any) - How modal can be closed
- `backdrop`: blur|dark|none (default: blur) - Backdrop styling
- `centered`: boolean (default: true) - Center modal vertically
- `scrollable`: boolean (default: false) - Enable scrollable content
- `animate`: boolean (default: true) - Enable entry/exit animations
- `lazy`: boolean (default: false) - Lazy load modal content
- `persistent`: boolean (default: false) - Prevent accidental closing
- `trapFocus`: boolean (default: true) - Trap focus within modal
- `wireModel`: string - Livewire model for open/close state

**Livewire Integration:**
- `wire:model`: Bind modal state to Livewire property
- `wire:open`: Livewire method called when modal opens
- `wire:close`: Livewire method called when modal closes
- `wire:escape`: Livewire method called on escape key
- `wire:cancel`: Livewire method called on cancel event
- `@open`: Alpine.js expression for open event
- `@close`: Alpine.js expression for close event

**Livewire Modal Management (Keys Facade):**
```php
// Basic modal operations
use Keys\UI\Facades\Keys;

// Show a modal with data
Keys::showModal('user-form', ['user' => $user]);

// Close specific modal
Keys::closeModal('user-form');

// Close all modals
Keys::closeAllModals();

// Check if modal is open
if (Keys::isModalOpen('user-form')) {
    // Handle modal state
}

// Fluent API - Configure and show modal
Keys::modal('confirm-delete')
    ->title('Delete User')
    ->message('Are you sure you want to delete this user?')
    ->size('sm')
    ->onConfirm('deleteUser')
    ->onCancel('cancelDelete')
    ->show();

// Load Livewire component in modal
Keys::modal('edit-profile')
    ->title('Edit Profile')
    ->component('profile-form', ['user' => $user])
    ->size('lg')
    ->scrollable()
    ->show();

// Preset modal types
Keys::modal('confirm-action')::confirm()
    ->title('Custom Confirmation')
    ->message('This action cannot be undone.')
    ->onConfirm('performAction')
    ->show();

Keys::modal('alert-info')::alert()
    ->title('Information')
    ->message('Your changes have been saved.')
    ->show();

Keys::modal('user-form')::form()
    ->component('user-form', ['mode' => 'create'])
    ->show();
```

**In Livewire Component:**
```php
class UserManager extends Component
{
    public function showEditModal($userId)
    {
        $user = User::find($userId);

        Keys::modal('edit-user')
            ->title('Edit User: ' . $user->name)
            ->component('user-form', ['user' => $user])
            ->size('lg')
            ->onConfirm('refreshUserList')
            ->show();
    }

    public function deleteUser($userId)
    {
        Keys::modal('confirm-delete')
            ->title('Delete User')
            ->message('This will permanently delete the user and all associated data.')
            ->onConfirm('performDelete(' . $userId . ')')
            ->size('sm')
            ->show();
    }

    public function performDelete($userId)
    {
        User::find($userId)->delete();
        Keys::closeModal('confirm-delete');
        $this->dispatch('user-deleted');
    }
}
```

**JavaScript API:**
```javascript
// Open modal programmatically
document.getElementById('modal-id').showModal();

// Close modal
document.getElementById('modal-id').close();

// Livewire events
Livewire.dispatch('openModal', { id: 'modal-id' });
Livewire.dispatch('closeModal', { id: 'modal-id' });
```

**Features:**
- Native HTML dialog element with progressive enhancement
- Smooth CSS animations with scale and fade effects
- Focus trap management for accessibility
- Backdrop click and escape key handling
- Livewire reactive state management
- Lazy loading for performance optimization
- Multiple size variants including full-screen
- Scrollable content support for long forms
- Event system for custom open/close handling

### Popover
**Advanced popover/tooltip with positioning and interaction options**

```blade
<x-keys::popover title="Helpful Information" placement="top" trigger="click">
    <x-slot:trigger>
        <x-keys::button>Click me</x-keys::button>
    </x-slot:trigger>
    This is detailed content that appears in the popover.
</x-keys::popover>

<x-keys::popover placement="right" align="start" trigger="hover" size="lg" arrow>
    <x-slot:trigger>
        <x-keys::button>Hover me</x-keys::button>
    </x-slot:trigger>
    Hover content with custom positioning
</x-keys::popover>
```

**Props:**
- `id`: Popover identifier (auto-generated if not provided)
- `placement`: top|bottom|left|right (default: bottom)
- `align`: start|center|end (default: center)
- `size`: sm|md|lg (default: md)
- `trigger`: click|hover|focus|manual (default: click)
- `arrow`: Show positioning arrow (default: true)
- `dismissible`: Enable dismiss functionality (default: true, auto-enabled for click/focus)
- `close-on-outside-click`: Close when clicking outside (default: true)
- `close-on-escape`: Close on Escape key (default: true)
- `delay|hide-delay`: Show/hide delays in milliseconds (default: 0)
- `offset`: Offset from target element (default: 8)
- `title`: Popover title
- `disabled`: Disable popover (default: false)
- `modal`: Modal behavior (default: false)

## Layout Components

### Tabs
**Tabbed interface with individual tab and panel components**

```blade
<x-keys::tabs>
    <x-keys::tabs.tab name="tab1" label="Tab 1" active>Content 1</x-keys::tabs.tab>
    <x-keys::tabs.tab name="tab2" label="Tab 2">Content 2</x-keys::tabs.tab>
</x-keys::tabs>

{{-- Alternative panel structure --}}
<x-keys::tabs>
    {{-- Tab headers --}}
    <x-keys::tabs.tab name="overview" label="Overview" />
    <x-keys::tabs.tab name="details" label="Details" />

    {{-- Tab panels --}}
    <x-keys::tabs.panel name="overview">Overview content</x-keys::tabs.panel>
    <x-keys::tabs.panel name="details">Details content</x-keys::tabs.panel>
</x-keys::tabs>
```

**Sub-components:**
- `<x-keys::tabs.tab>` - Individual tab header with content
- `<x-keys::tabs.panel>` - Separate tab panel content

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
<x-keys::table.loading-state />

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
<x-keys::timepicker name="time" />
<x-keys::timepicker name="time" format="12" />
```

### FileUpload
**File upload with drag & drop**

```blade
<x-keys::file-upload name="files" />
<x-keys::file-upload name="images" multiple accept="image/*" />
```

### Range
**Range slider input with dual range support**

```blade
<x-keys::range name="volume" min="0" max="100" value="50" />
<x-keys::range name="price_range" dual min="0" max="1000" :value="[200, 800]" />
<x-keys::range name="rating" min="1" max="5" step="0.5" show-values />
<x-keys::range name="quantity" min="0" max="100" :ticks="[0, 25, 50, 75, 100]" show-ticks />
```

**Props:**
- `name|id`: Standard form attributes
- `value`: Single value or array for dual range
- `min-value|max-value`: For dual range (overrides value array)
- `min|max`: Range boundaries (default: 0-100)
- `step`: Increment step (default: 1)
- `dual`: Enable dual range mode (default: false)
- `ticks`: Array of tick marks with values/labels
- `show-values`: Display current values (default: false)
- `show-ticks`: Display tick marks (default: false)
- `size`: xs|sm|md|lg|xl (default: md)
- `disabled|required`: Boolean states
- `label|optional`: Shorthand mode
- `errors`: Error messages (string|array|Collection)
- `icon|hint`: Additional content options

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

### Gallery
**Advanced image gallery with multiple layouts and features**

```blade
{{-- Basic thumbnail gallery --}}
<x-keys::gallery type="thumbnail" :images="[
    ['src' => 'image1.jpg', 'alt' => 'Image 1'],
    ['src' => 'image2.jpg', 'alt' => 'Image 2', 'caption' => 'Beautiful scenery'],
    ['src' => 'image3.jpg', 'alt' => 'Image 3']
]" />

{{-- E-commerce gallery with thumbnails --}}
<x-keys::gallery type="ecommerce" layout="default" aspect-ratio="square"
    thumbnail-position="side" lightbox autoplay />

{{-- Masonry layout gallery --}}
<x-keys::gallery layout="masonry" masonry-columns="300px" lightbox />

{{-- Grid layout gallery --}}
<x-keys::gallery layout="grid" grid-columns="4" aspect-ratio="video" />
```

**Props:**
- `images`: Array of image objects with src, alt, caption, thumbnail, etc.
- `type`: basic|thumbnail|ecommerce (default: thumbnail)
- `layout`: default|masonry|grid (default: default)
- `aspect-ratio`: auto|square|video|photo|wide (default: auto)
- `radius`: none|sm|md|lg|xl|full (default: lg)
- `thumbnail-position`: bottom|side|top|overlay|overlay-top (default: bottom)
- `thumbnail-size`: xs|sm|md|lg (default: sm)
- `grid-columns`: 1-6 (default: 3)
- `masonry-columns`: CSS column width (default: 300px)
- `show-thumbnails`: Show thumbnail navigation (default: true)
- `autoplay`: Enable autoplay for main image (default: false)
- `autoplay-delay`: Autoplay delay in milliseconds (default: 3000)
- `loop`: Loop through images (default: true)
- `lightbox`: Enable lightbox functionality (default: false)
- `id`: Gallery identifier (auto-generated if not provided)

**Features:**
- Multiple layout options (default, masonry, grid)
- Thumbnail navigation with positioning options
- Lightbox support with keyboard navigation
- Autoplay functionality for showcasing
- Responsive design with mobile optimization
- E-commerce focused variant with enhanced UX
- Masonry layout for Pinterest-style displays
- Grid layout for uniform image presentation

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

### Scripts
**Asset injection component for Keys UI JavaScript functionality**

```blade
{{-- Auto-inject all Keys UI scripts --}}
<x-keys::scripts />
```

**Purpose:**
- Automatically injects all necessary JavaScript for Keys UI components
- Provides TypeScript-compiled functionality for interactive components
- Handles component initialization and event delegation
- Required for components with JavaScript features (Select, Modal, Gallery, etc.)

**Usage:**
Place this component in your layout's `<head>` or before the closing `</body>` tag. The component automatically detects which scripts are needed based on the components used on the page.

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