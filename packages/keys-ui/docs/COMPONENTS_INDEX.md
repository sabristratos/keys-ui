# Keys UI Component Index

Complete reference for all Keys UI components with examples and prop tables.

## Quick Start

### Installation

```bash
composer require keys/ui
```

### Setup

Keys UI automatically injects its CSS into your project's `resources/css/app.css` file:

```css
@import 'tailwindcss';
@import '../../vendor/keys/ui/resources/css/keys-ui.css';
```

Include the Scripts component in your layout (typically in `resources/views/components/layout.blade.php`):

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    {{ $slot }}

    <x-keys::scripts />
</body>
</html>
```

Build the package assets:

```bash
# Build Keys UI assets
php artisan keys:build

# Watch for changes during development
php artisan keys:build --watch
```

### Theming

Keys UI uses CSS custom properties (variables) for theming. Customize the design system by overwriting these variables in your `resources/css/app.css` **after** the Keys UI import:

```css
@import 'tailwindcss';
@import '../../vendor/keys/ui/resources/css/keys-ui.css';

@theme {
    /* Customize global border radius - affects all components */
    --radius-base: 0.75rem; /* Default: 0.5rem */

    /* Override color palettes (50-950 shades) */
    --color-brand-500: oklch(0.65 0.25 270); /* Custom purple brand color */
    --color-success-500: oklch(0.70 0.20 150); /* Custom green */
    --color-danger-500: oklch(0.55 0.22 15); /* Custom red */
    --color-warning-500: oklch(0.75 0.15 80); /* Custom yellow */

    /* Override semantic colors */
    --color-surface: light-dark(#fafafa, #0a0a0a);
    --color-foreground: light-dark(#171717, #e5e5e5);
    --color-border: light-dark(#d4d4d4, #404040);
    --color-muted: light-dark(#737373, #a3a3a3);
}
```

**Available Design Tokens:**

**Colors** (all with 50-950 shades):
- `--color-brand-[50-950]` - Primary brand colors
- `--color-neutral-[50-950]` - Gray/neutral colors
- `--color-success-[50-950]` - Success/green colors
- `--color-danger-[50-950]` - Error/red colors
- `--color-warning-[50-950]` - Warning/yellow colors
- `--color-info-[50-950]` - Info/blue colors

**Semantic Colors:**
- `--color-surface` - Background surface color
- `--color-foreground` - Primary text color
- `--color-border` - Border color
- `--color-input` - Input background
- `--color-muted` - Muted/secondary text

**Border Radius** (controlled by `--radius-base`):
- `--radius-base: 0.5rem` - Base radius (default)
- `--radius-sm` - Calculated as `base * 0.25`
- `--radius-md` - Calculated as `base * 0.75`
- `--radius-lg` - Calculated as `base`
- `--radius-xl` - Calculated as `base * 1.5`
- `--radius-2xl` - Calculated as `base * 2`
- `--radius-3xl` - Calculated as `base * 3`

**Shadows:**
- `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-2xl`

All components automatically use these tokens through Tailwind's auto-generated utilities (e.g., `bg-brand-500`, `text-danger-600`, `rounded-lg`), ensuring consistent theming across your application.

---

## Usage Guidelines

### Prop Binding Syntax

Keys UI components follow Laravel Blade component conventions. Understanding proper prop binding is essential:

**Numeric Values** - Always use `:` binding for numbers:
```blade
{{-- ✅ Correct - passes numeric values --}}
<x-keys::rating :value="4.5" :max="5" />
<x-keys::progress :value="75" :max="100" />

{{-- ❌ Incorrect - passes strings "4.5" and "5" --}}
<x-keys::rating value="4.5" max="5" />
```

**Array Values** - Always use `:` binding for arrays:
```blade
{{-- ✅ Correct - passes array --}}
<x-keys::range :ticks="[0, 25, 50, 75, 100]" />
<x-keys::social.links :links="['github' => 'https://github.com']" />

{{-- ❌ Incorrect - passes string --}}
<x-keys::range ticks="[0, 25, 50, 75, 100]" />
```

**Boolean Values** - Use attribute presence for true, omit for false:
```blade
{{-- ✅ Correct --}}
<x-keys::input readonly required />
<x-keys::input /> {{-- No readonly/required --}}

{{-- ❌ Incorrect - string "true" is always truthy --}}
<x-keys::input readonly="true" />
```

**String Values** - No binding needed for static strings:
```blade
{{-- ✅ Correct --}}
<x-keys::input name="email" placeholder="Enter email" />
```

---

## Table of Contents

- [Forms](#forms)
  - Input, Textarea, Select, Checkbox, Radio, Toggle, DatePicker, TimePicker, ColorPicker, FileUpload, Range, Editor, Field, Label, Error
- [Buttons & Actions](#buttons--actions)
  - Button, AddToCart
- [Navigation](#navigation)
  - Dropdown (+ Item, Separator, Checkbox, Radio, Submenu, Menu), Tabs (+ Tab, Panel), Breadcrumbs (+ Item), Sidebar (+ Item, Section, Divider, Toggle), Steps (+ Step)
- [Feedback](#feedback)
  - Alert, Toast, Modal, Slideout, Progress, Loading, EmptyState
- [Layout](#layout)
  - Group, Card (+ Header, Body, Footer, Actions), Separator, Accordion
- [Data Display](#data-display)
  - Table (+ Head, Body, Row, Header, Cell, EmptyState, Loading), Badge (+ Group), Avatar (+ Stack), Rating, Kbd
- [Typography](#typography)
  - Text, Heading
- [Media](#media)
  - Image, Icon, Gallery
- [Overlays](#overlays)
  - Tooltip, Popover
- [Social](#social)
  - Social.Links, Social.Share
- [Utilities](#utilities)
  - Scripts, Calendar, Chart, ChoiceGroup

---

## Forms

### Input

Text input field with icons, actions, and validation support.

**Example:**
```blade
<x-keys::input
    name="email"
    type="email"
    placeholder="Enter email"
    icon-left="heroicon-o-envelope"
    clearable
    copyable
/>

{{-- With label shorthand --}}
<x-keys::input
    name="username"
    label="Username"
    required
    :errors="$errors->get('username')"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | `'text'` | Input type (text, email, password, etc.) |
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | Input ID (auto-generated if not provided) |
| `value` | string\|null | `null` | Input value |
| `placeholder` | string\|null | `null` | Placeholder text |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg) |
| `disabled` | bool | `false` | Whether input is disabled |
| `readonly` | bool | `false` | Whether input is readonly |
| `required` | bool | `false` | Whether input is required |
| `label` | string\|null | `null` | Label text (shorthand mode) |
| `optional` | bool | `false` | Show optional indicator |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `icon` | string\|null | `null` | Alias for iconLeft |
| `iconLeft` | string\|null | `null` | Left icon name |
| `iconRight` | string\|null | `null` | Right icon name |
| `hint` | string\|null | `null` | Hint text below input |
| `actions` | array | `[]` | Custom actions array |
| `clearable` | bool | `false` | Enable clear action |
| `copyable` | bool | `false` | Enable copy action |
| `showPassword` | bool | `false` | Enable password toggle (for type="password") |
| `externalUrl` | string\|null | `null` | Enable external link action |
| `actionVariant` | string | `'ghost'` | Action button variant |
| `actionSize` | string | `'xs'` | Action button size |
| `hasError` | bool | `false` | Force error state |
| `prefix` | string\|null | `null` | Prefix text (e.g., "$", "https://") |
| `postfix` | string\|null | `null` | Postfix text (e.g., "USD", ".com") |

---

### Textarea

Multi-line text input with auto-resize, character counting, and actions.

**Example:**
```blade
<x-keys::textarea
    name="description"
    rows="4"
    placeholder="Enter description"
    auto-resize
    show-character-count
    max-length="500"
    clearable
/>

{{-- With label --}}
<x-keys::textarea
    name="bio"
    label="Biography"
    rows="6"
    :errors="$errors->get('bio')"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | Textarea ID (auto-generated if not provided) |
| `value` | string\|null | `null` | Textarea value |
| `placeholder` | string\|null | `null` | Placeholder text |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg) |
| `disabled` | bool | `false` | Whether textarea is disabled |
| `readonly` | bool | `false` | Whether textarea is readonly |
| `required` | bool | `false` | Whether textarea is required |
| `rows` | int | `4` | Number of visible text lines |
| `cols` | int\|null | `null` | Number of visible character widths |
| `resize` | string | `'vertical'` | Resize behavior (none, both, horizontal, vertical) |
| `autoResize` | bool | `false` | Enable automatic height adjustment |
| `label` | string\|null | `null` | Label text (shorthand mode) |
| `optional` | bool | `false` | Show optional indicator |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `icon` | string\|null | `null` | Alias for iconLeft |
| `iconLeft` | string\|null | `null` | Left icon name |
| `iconRight` | string\|null | `null` | Right icon name |
| `hint` | string\|null | `null` | Hint text below textarea |
| `actions` | array | `[]` | Custom actions array |
| `clearable` | bool | `false` | Enable clear action |
| `copyable` | bool | `false` | Enable copy action |
| `externalUrl` | string\|null | `null` | Enable external link action |
| `actionVariant` | string | `'ghost'` | Action button variant |
| `actionSize` | string | `'xs'` | Action button size |
| `hasError` | bool | `false` | Force error state |
| `showCharacterCount` | bool | `false` | Show character count |
| `maxLength` | int\|null | `null` | Maximum character length |

---

### Select

Dropdown select with search, multiple selection, and slot-based options.

**Example:**
```blade
<x-keys::select name="country" placeholder="Select country">
    <x-keys::select.option value="us">United States</x-keys::select.option>
    <x-keys::select.option value="ca">Canada</x-keys::select.option>
    <x-keys::select.option value="uk">United Kingdom</x-keys::select.option>
</x-keys::select>

{{-- Multiple selection with search --}}
<x-keys::select
    name="tags[]"
    label="Tags"
    multiple
    searchable
    clearable
    :value="['design', 'code']"
>
    <x-keys::select.option value="design">Design</x-keys::select.option>
    <x-keys::select.option value="code">Code</x-keys::select.option>
    <x-keys::select.option value="marketing">Marketing</x-keys::select.option>
</x-keys::select>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | Select ID (auto-generated if not provided) |
| `value` | mixed | `null` | Selected value(s) |
| `multiple` | bool | `false` | Enable multiple selection with chips |
| `searchable` | bool | `false` | Enable search functionality |
| `clearable` | bool | `false` | Enable clear button |
| `placeholder` | string\|null | `null` | Placeholder text |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `width` | string | `'full'` | Width variant (full, auto, etc.) |
| `disabled` | bool | `false` | Whether select is disabled |
| `required` | bool | `false` | Whether select is required |
| `label` | string\|null | `null` | Label text (shorthand mode) |
| `optional` | bool | `false` | Show optional indicator |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `hasError` | bool | `false` | Force error state |
| `ariaLabel` | string\|null | `null` | ARIA label for accessibility |
| `ariaDescribedby` | string\|null | `null` | ARIA described-by for accessibility |

**Select.Option Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | `null` | Option value |
| `disabled` | bool | `false` | Whether option is disabled |
| `selected` | bool | `false` | Whether option is selected |

---

### Checkbox

Checkbox input with standard, button, and card variants.

**Example:**
```blade
{{-- Standard checkbox --}}
<x-keys::checkbox
    name="terms"
    value="1"
    label="I agree to the terms and conditions"
/>

{{-- Card variant --}}
<x-keys::checkbox
    name="plan"
    value="premium"
    variant="card"
    title="Premium Plan"
    description="Access to all premium features"
    icon="heroicon-o-star"
/>

{{-- With actions --}}
<x-keys::checkbox
    name="feature"
    label="Enable feature"
    :actions="[
        ['type' => 'info', 'icon' => 'heroicon-o-information-circle', 'label' => 'More info']
    ]"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | Checkbox ID (auto-generated if not provided) |
| `value` | string\|null | `'1'` | Checkbox value |
| `checked` | bool | `false` | Whether checkbox is checked |
| `disabled` | bool | `false` | Whether checkbox is disabled |
| `required` | bool | `false` | Whether checkbox is required |
| `indeterminate` | bool | `false` | Whether checkbox is indeterminate |
| `variant` | string | `'standard'` | Style variant (standard, button, card) |
| `color` | string | `'brand'` | Color variant |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `label` | string\|null | `null` | Label text |
| `description` | string\|null | `null` | Description text |
| `title` | string\|null | `null` | Title for card variant |
| `icon` | string\|null | `null` | Icon name |
| `labelPosition` | string | `'right'` | Label position (left, right) |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `actions` | array | `[]` | Custom actions |
| `actionVariant` | string | `'ghost'` | Action button variant |
| `actionSize` | string | `'xs'` | Action button size |
| `hasError` | bool | `false` | Force error state |
| `showInput` | bool | `true` | Show input element |

---

### Radio

Radio button input with standard, button, and card variants.

**Example:**
```blade
{{-- Standard radio group --}}
<x-keys::radio name="plan" value="basic" label="Basic Plan" checked />
<x-keys::radio name="plan" value="pro" label="Pro Plan" />
<x-keys::radio name="plan" value="enterprise" label="Enterprise Plan" />

{{-- Card variant --}}
<x-keys::radio
    name="subscription"
    value="monthly"
    variant="card"
    title="Monthly"
    description="Billed monthly at $9.99"
    icon="heroicon-o-calendar"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | Radio ID (auto-generated if not provided) |
| `value` | string\|null | `null` | Radio value |
| `checked` | bool | `false` | Whether radio is checked |
| `disabled` | bool | `false` | Whether radio is disabled |
| `required` | bool | `false` | Whether radio is required |
| `variant` | string | `'standard'` | Style variant (standard, button, card) |
| `color` | string | `'brand'` | Color variant |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `label` | string\|null | `null` | Label text |
| `description` | string\|null | `null` | Description text |
| `title` | string\|null | `null` | Title for card variant |
| `icon` | string\|null | `null` | Icon name |
| `labelPosition` | string | `'right'` | Label position (left, right) |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `actions` | array | `[]` | Custom actions |
| `actionVariant` | string | `'ghost'` | Action button variant |
| `actionSize` | string | `'xs'` | Action button size |
| `hasError` | bool | `false` | Force error state |
| `showInput` | bool | `true` | Show input element |

---

### Toggle

Toggle switch with label and description support.

**Example:**
```blade
<x-keys::toggle
    name="notifications"
    label="Email Notifications"
    description="Receive updates via email"
    checked
/>

{{-- With actions --}}
<x-keys::toggle
    name="feature_flag"
    label="Enable Beta Features"
    hint="Some features may be unstable"
    :actions="[
        ['type' => 'info', 'icon' => 'heroicon-o-information-circle', 'label' => 'Learn more']
    ]"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | Toggle ID (auto-generated if not provided) |
| `value` | string\|null | `'1'` | Toggle value |
| `checked` | bool | `false` | Whether toggle is checked |
| `disabled` | bool | `false` | Whether toggle is disabled |
| `required` | bool | `false` | Whether toggle is required |
| `color` | string | `'brand'` | Color variant |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `label` | string\|null | `null` | Label text |
| `description` | string\|null | `null` | Description text |
| `hint` | string\|null | `null` | Hint text |
| `labelPosition` | string | `'right'` | Label position (left, right) |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `actions` | array | `[]` | Custom actions |
| `actionVariant` | string | `'ghost'` | Action button variant |
| `actionSize` | string | `'xs'` | Action button size |
| `hasError` | bool | `false` | Force error state |

---

### DatePicker

Date picker with single date and range selection support.

**Example:**
```blade
{{-- Single date --}}
<x-keys::date-picker
    name="birthday"
    label="Birthday"
    format="Y-m-d"
    display-format="F j, Y"
    clearable
/>

{{-- Date range --}}
<x-keys::date-picker
    name="date_range"
    label="Select Date Range"
    is-range
    :quick-selectors="true"
    months-to-show="2"
/>

{{-- With constraints --}}
<x-keys::date-picker
    name="appointment"
    min-date="2024-01-01"
    max-date="2024-12-31"
    :disabled-dates="['2024-12-25', '2024-12-31']"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | DatePicker ID (auto-generated if not provided) |
| `value` | mixed | `null` | Selected date value |
| `placeholder` | string\|null | `null` | Placeholder text |
| `format` | string | `'Y-m-d'` | Date format for storage |
| `displayFormat` | string\|null | `null` | Date format for display |
| `isRange` | bool | `false` | Enable date range selection |
| `startDate` | mixed | `null` | Start date for range |
| `endDate` | mixed | `null` | End date for range |
| `minDate` | string\|Carbon\|null | `null` | Minimum selectable date |
| `maxDate` | string\|Carbon\|null | `null` | Maximum selectable date |
| `disabledDates` | array | `[]` | Array of disabled dates |
| `monthsToShow` | int | `1` | Number of months to display (1-12) |
| `quickSelectors` | bool\|array | `false` | Enable quick date selectors |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `width` | string | `'full'` | Width variant (full, auto, etc.) |
| `inline` | bool | `false` | Display inline calendar |
| `disabled` | bool | `false` | Whether datepicker is disabled |
| `readonly` | bool | `false` | Whether datepicker is readonly |
| `clearable` | bool | `false` | Enable clear button |
| `showCalendarIcon` | bool | `true` | Show calendar icon |
| `closeOnSelect` | bool | `true` | Close on date selection |
| `iconLeft` | string\|null | `null` | Left icon name |
| `iconRight` | string\|null | `null` | Right icon name |
| `customTrigger` | string\|null | `null` | Custom trigger content |
| `required` | bool | `false` | Whether datepicker is required |
| `label` | string\|null | `null` | Label text (shorthand mode) |
| `optional` | bool | `false` | Show optional indicator |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `hasError` | bool | `false` | Force error state |

---

### TimePicker

Time selection with 12/24 hour format support.

**Example:**
```blade
<x-keys::time-picker
    name="appointment_time"
    label="Appointment Time"
    format="12"
    step="15"
/>

{{-- 24-hour format with seconds --}}
<x-keys::time-picker
    name="start_time"
    format="24"
    show-seconds
    clearable
/>

{{-- With time constraints --}}
<x-keys::time-picker
    name="meeting_time"
    min-time="09:00"
    max-time="17:00"
    step="30"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | TimePicker ID (auto-generated if not provided) |
| `value` | string\|null | `null` | Time value |
| `placeholder` | string\|null | `null` | Placeholder text |
| `format` | string | `'24'` | Time format ('12' or '24') |
| `step` | int | `1` | Minute step intervals (1, 5, 15, 30) |
| `minTime` | string\|null | `null` | Minimum time allowed |
| `maxTime` | string\|null | `null` | Maximum time allowed |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `width` | string | `'full'` | Width variant (full, auto, etc.) |
| `disabled` | bool | `false` | Whether timepicker is disabled |
| `readonly` | bool | `false` | Whether timepicker is readonly |
| `required` | bool | `false` | Whether timepicker is required |
| `label` | string\|null | `null` | Label text (shorthand mode) |
| `optional` | bool | `false` | Show optional indicator |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `hasError` | bool | `false` | Force error state |
| `clearable` | bool | `false` | Enable clear button |
| `showSeconds` | bool | `false` | Show seconds in time selection |
| `formatMode` | string | `'flexible'` | Format mode ('12', '24', 'flexible') |

---

### ColorPicker

Color picker with hex color input.

**Example:**
```blade
<x-keys::color-picker
    name="brand_color"
    label="Brand Color"
    value="#3b82f6"
/>

<x-keys::color-picker
    name="background"
    placeholder="#000000"
    required
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | ColorPicker ID (auto-generated if not provided) |
| `value` | string\|null | `'#3b82f6'` | Color value in hex format |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg) |
| `disabled` | bool | `false` | Whether colorpicker is disabled |
| `readonly` | bool | `false` | Whether colorpicker is readonly |
| `required` | bool | `false` | Whether colorpicker is required |
| `label` | string\|null | `null` | Label text (shorthand mode) |
| `optional` | bool | `false` | Show optional indicator |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `hint` | string\|null | `null` | Hint text below input |
| `forceError` | bool | `false` | Force error state |
| `placeholder` | string\|null | `'#000000'` | Placeholder text |

---

### FileUpload

File upload with drag-and-drop and preview support.

**Example:**
```blade
<x-keys::file-upload
    name="avatar"
    label="Profile Picture"
    accept="image/*"
    max-size="5MB"
/>

{{-- Multiple files --}}
<x-keys::file-upload
    name="documents[]"
    label="Upload Documents"
    multiple
    max-files="5"
    accept=".pdf,.doc,.docx"
    drag-drop
/>

{{-- Livewire integration --}}
<x-keys::file-upload
    name="photos"
    wire:model="photos"
    multiple
    preview-style="transform"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | FileUpload ID (auto-generated if not provided) |
| `accept` | string | `'*'` | Accepted file types (MIME types or extensions) |
| `maxSize` | string\|null | `null` | Maximum file size (e.g., "5MB", "100KB") |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `disabled` | bool | `false` | Whether file upload is disabled |
| `required` | bool | `false` | Whether file upload is required |
| `label` | string\|null | `null` | Label text (shorthand mode) |
| `optional` | bool | `false` | Show optional indicator |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `dragDrop` | bool | `true` | Enable drag-and-drop |
| `placeholder` | string\|null | `null` | Placeholder text |
| `previewStyle` | string | `'transform'` | Preview style variant |
| `multiple` | bool | `false` | Allow multiple file selection |
| `maxFiles` | int\|null | `null` | Maximum number of files |

---

### Range

Range slider with single and dual handle support.

**Example:**
```blade
<x-keys::range
    name="price"
    label="Price Range"
    :min="0"
    :max="1000"
    :step="10"
    :value="500"
/>

{{-- Dual range --}}
<x-keys::range
    name="price_range"
    dual
    :min="0"
    :max="1000"
    :value="[100, 500]"
    show-values
/>

{{-- With ticks --}}
<x-keys::range
    name="volume"
    :min="0"
    :max="100"
    :ticks="[0, 25, 50, 75, 100]"
    show-ticks
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | Range ID (auto-generated if not provided) |
| `value` | mixed | `null` | Range value (number or array for dual) |
| `minValue` | mixed | `null` | Minimum value for dual range |
| `maxValue` | mixed | `null` | Maximum value for dual range |
| `min` | int\|float | `0` | Minimum range value |
| `max` | int\|float | `100` | Maximum range value |
| `step` | int\|float | `1` | Step increment |
| `dual` | bool | `false` | Enable dual handles |
| `ticks` | array | `[]` | Tick marks array |
| `showValues` | bool | `false` | Display current values |
| `showTicks` | bool | `false` | Display tick marks |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `disabled` | bool | `false` | Whether range is disabled |
| `required` | bool | `false` | Whether range is required |
| `label` | string\|null | `null` | Label text (shorthand mode) |
| `optional` | bool | `false` | Show optional indicator |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `icon` | string\|null | `null` | Icon name |
| `hint` | string\|null | `null` | Hint text |
| `hasError` | bool | `false` | Force error state |

---

### Editor

Rich text editor powered by Quill.js.

**Example:**
```blade
<x-keys::editor
    name="content"
    label="Article Content"
    placeholder="Write your article..."
    height="300px"
/>

{{-- Custom toolbar --}}
<x-keys::editor
    name="description"
    :toolbar="[
        ['bold', 'italic'],
        ['link', 'image'],
        [['list' => 'ordered'], ['list' => 'bullet']]
    ]"
    theme="bubble"
/>

{{-- With loading state --}}
<x-keys::editor
    name="post"
    loading
    loading-text="Loading editor..."
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | Editor ID (auto-generated if not provided) |
| `value` | string\|null | `null` | Editor content |
| `placeholder` | string | `'Start typing...'` | Placeholder text |
| `height` | string | `'200px'` | Editor height |
| `disabled` | bool | `false` | Whether editor is disabled |
| `toolbar` | array | `[]` | Custom toolbar configuration |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg, xl) |
| `theme` | string | `'snow'` | Quill theme ('snow', 'bubble') |
| `label` | string\|null | `null` | Label text (shorthand mode) |
| `required` | bool | `false` | Whether editor is required |
| `describedBy` | string\|null | `null` | ARIA described-by ID |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `hasError` | bool | `false` | Force error state |
| `optional` | bool | `false` | Show optional indicator |
| `loading` | bool | `false` | Show loading state |
| `loadingAnimation` | string | `'spinner'` | Loading animation type |
| `loadingText` | string | `'Loading...'` | Loading text |

---

### Field

Form field wrapper with label, error, and hint support.

**Example:**
```blade
<x-keys::field
    name="email"
    label="Email Address"
    required
    hint="We'll never share your email"
    :errors="$errors->get('email')"
>
    <input type="email" name="email" />
</x-keys::field>
```

---

### Label

Form label with optional indicator and tooltip support.

**Example:**
```blade
<x-keys::label for="username">Username</x-keys::label>

<x-keys::label for="bio" optional>Biography</x-keys::label>

<x-keys::label for="password" required tooltip="8+ characters">
    Password
</x-keys::label>
```

---

### Error

Form error message display.

**Example:**
```blade
<x-keys::error :messages="$errors->get('email')" />

<x-keys::error message="This field is required" />
```

---

## Buttons & Actions

### Button

Versatile button with variants, sizes, icons, and multi-state support.

**Example:**
```blade
{{-- Basic buttons --}}
<x-keys::button>Click Me</x-keys::button>
<x-keys::button variant="outlined">Outline</x-keys::button>
<x-keys::button variant="ghost">Ghost</x-keys::button>

{{-- With icons --}}
<x-keys::button icon-left="heroicon-o-plus">Add Item</x-keys::button>
<x-keys::button icon-right="heroicon-o-arrow-right">Next</x-keys::button>

{{-- Icon only --}}
<x-keys::button icon="heroicon-o-heart">
    <span class="sr-only">Like</span>
</x-keys::button>

{{-- Multi-state button --}}
<x-keys::button
    icon-left="heroicon-o-bookmark"
    icon-toggle="heroicon-s-bookmark"
    icon-success="heroicon-o-check"
    label-toggle="Bookmarked"
    label-success="Saved!"
>
    Bookmark
</x-keys::button>

{{-- Link button --}}
<x-keys::button href="/dashboard" color="primary">Dashboard</x-keys::button>

{{-- Loading state --}}
<x-keys::button loading loading-animation="dots">Processing</x-keys::button>

{{-- Sizes --}}
<x-keys::button size="xs">Extra Small</x-keys::button>
<x-keys::button size="sm">Small</x-keys::button>
<x-keys::button size="md">Medium</x-keys::button>
<x-keys::button size="lg">Large</x-keys::button>
<x-keys::button size="xl">Extra Large</x-keys::button>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | string | `'secondary'` | Button color (primary, secondary, danger, warning, success, info) |
| `variant` | string | `'solid'` | Button variant (solid, outlined, ghost, subtle) |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg, xl) |
| `type` | string | `'button'` | Button type (button, submit, reset) |
| `href` | string\|null | `null` | URL for link buttons |
| `disabled` | bool | `false` | Whether button is disabled |
| `loading` | bool | `false` | Whether button is in loading state |
| `icon` | string\|null | `null` | Alias for iconLeft |
| `iconLeft` | string\|null | `null` | Left icon name |
| `iconRight` | string\|null | `null` | Right icon name |
| `loadingAnimation` | string | `'spinner'` | Loading animation type (spinner, dots) |
| `iconToggle` | string\|null | `null` | Icon for toggle state |
| `iconSuccess` | string\|null | `null` | Icon for success state |
| `labelToggle` | string\|null | `null` | Label for toggle state |
| `labelSuccess` | string\|null | `null` | Label for success state |
| `popovertarget` | string\|null | `null` | ID of popover element to control |

---

### AddToCart

Specialized button for e-commerce add-to-cart actions.

**Example:**
```blade
<x-keys::add-to-cart
    product-id="123"
    variant="brand"
    icon="heroicon-o-shopping-cart"
>
    Add to Cart
</x-keys::add-to-cart>
```

---

## Navigation

### Dropdown

Dropdown menu with nested items and submenus.

**Example:**
```blade
<x-keys::dropdown>
    <x-slot:trigger>
        <x-keys::button>Options</x-keys::button>
    </x-slot:trigger>

    <x-keys::dropdown.item icon="heroicon-o-pencil">Edit</x-keys::dropdown.item>
    <x-keys::dropdown.item icon="heroicon-o-trash" variant="danger">Delete</x-keys::dropdown.item>
    <x-keys::dropdown.separator />
    <x-keys::dropdown.item icon="heroicon-o-cog">Settings</x-keys::dropdown.item>

    {{-- Submenu --}}
    <x-keys::dropdown.submenu label="More Actions" icon="heroicon-o-ellipsis-horizontal">
        <x-keys::dropdown.item>Action 1</x-keys::dropdown.item>
        <x-keys::dropdown.item>Action 2</x-keys::dropdown.item>
    </x-keys::dropdown.submenu>

    {{-- Checkbox items --}}
    <x-keys::dropdown.checkbox name="notifications" checked>Notifications</x-keys::dropdown.checkbox>

    {{-- Radio items --}}
    <x-keys::dropdown.radio name="sort" value="name" checked>Sort by Name</x-keys::dropdown.radio>
    <x-keys::dropdown.radio name="sort" value="date">Sort by Date</x-keys::dropdown.radio>
</x-keys::dropdown>
```

**Dropdown Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string\|null | `null` | Dropdown ID (auto-generated if not provided) |
| `position` | string | `'bottom'` | Position relative to trigger (top, bottom, left, right) |
| `align` | string | `'start'` | Alignment (start, center, end) |
| `offset` | int | `8` | Offset from trigger in pixels |
| `disabled` | bool | `false` | Whether dropdown is disabled |
| `modal` | bool | `false` | Whether dropdown is modal |
| `size` | string | `'md'` | Size variant (sm, md, lg) |

**Dropdown.Item Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | string\|null | `null` | Icon name |
| `href` | string\|null | `null` | Link URL |
| `disabled` | bool | `false` | Whether item is disabled |
| `variant` | string | `'default'` | Style variant (default, danger) |

---

### Tabs

Tab navigation with panels.

**Example:**
```blade
<x-keys::tabs id="my-tabs" default-value="profile">
    <x-slot:list>
        <x-keys::tabs.tab value="profile">Profile</x-keys::tabs.tab>
        <x-keys::tabs.tab value="settings">Settings</x-keys::tabs.tab>
        <x-keys::tabs.tab value="notifications">Notifications</x-keys::tabs.tab>
    </x-slot:list>

    <x-keys::tabs.panel value="profile">
        Profile content here...
    </x-keys::tabs.panel>

    <x-keys::tabs.panel value="settings">
        Settings content here...
    </x-keys::tabs.panel>

    <x-keys::tabs.panel value="notifications">
        Notifications content here...
    </x-keys::tabs.panel>
</x-keys::tabs>
```

**Tabs Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string\|null | `null` | Tabs ID (auto-generated if not provided) |
| `orientation` | string | `'horizontal'` | Tab orientation (horizontal, vertical) |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `defaultValue` | string\|null | `null` | Default active tab value |
| `value` | string\|null | `null` | Active tab value |
| `disabled` | bool | `false` | Whether tabs are disabled |
| `variant` | string | `'default'` | Style variant |
| `stretch` | bool | `false` | Whether tabs stretch to fill width |

---

### Breadcrumbs

Navigation breadcrumb trail.

**Example:**
```blade
<x-keys::breadcrumbs>
    <x-keys::breadcrumbs.item href="/">Home</x-keys::breadcrumbs.item>
    <x-keys::breadcrumbs.item href="/products">Products</x-keys::breadcrumbs.item>
    <x-keys::breadcrumbs.item current>Laptop</x-keys::breadcrumbs.item>
</x-keys::breadcrumbs>
```

---

### Sidebar

Application sidebar with sections and items.

**Example:**
```blade
<x-keys::sidebar>
    <x-keys::sidebar.section title="Main">
        <x-keys::sidebar.item href="/dashboard" icon="heroicon-o-home">Dashboard</x-keys::sidebar.item>
        <x-keys::sidebar.item href="/projects" icon="heroicon-o-folder" active>Projects</x-keys::sidebar.item>
    </x-keys::sidebar.section>

    <x-keys::sidebar.divider />

    <x-keys::sidebar.section title="Settings">
        <x-keys::sidebar.item href="/settings" icon="heroicon-o-cog">Settings</x-keys::sidebar.item>
    </x-keys::sidebar.section>

    <x-keys::sidebar.toggle />
</x-keys::sidebar>

{{-- Complete layout example --}}
<div class="flex h-screen">
    <x-keys::sidebar>
        {{-- Sidebar content --}}
    </x-keys::sidebar>

    <x-keys::main>
        {{-- Main content --}}
    </x-keys::main>
</div>
```

**Sidebar Sub-components:**
- `x-keys::sidebar.section` - Section container with optional title
- `x-keys::sidebar.item` - Navigation item with icon, active state, badge support
- `x-keys::sidebar.divider` - Visual separator between sections
- `x-keys::sidebar.toggle` - Collapse/expand toggle button

---

### Steps

Step indicator for multi-step processes.

**Example:**
```blade
<x-keys::steps current="2">
    <x-keys::steps.step value="1" title="Account">Create account</x-keys::steps.step>
    <x-keys::steps.step value="2" title="Profile">Complete profile</x-keys::steps.step>
    <x-keys::steps.step value="3" title="Verify">Verify email</x-keys::steps.step>
    <x-keys::steps.step value="4" title="Done">Get started</x-keys::steps.step>
</x-keys::steps>
```

---

## Feedback

### Alert

Alert messages for notifications and feedback.

**Example:**
```blade
<x-keys::alert variant="info">
    This is an informational message.
</x-keys::alert>

<x-keys::alert variant="success" title="Success!" dismissible>
    Your changes have been saved successfully.
</x-keys::alert>

<x-keys::alert variant="warning" icon="heroicon-o-exclamation-triangle">
    Please review your settings before continuing.
</x-keys::alert>

<x-keys::alert variant="danger" title="Error" size="lg">
    An error occurred while processing your request.
</x-keys::alert>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'info'` | Alert variant (info, success, warning, danger, neutral, brand) |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `icon` | string\|null | `null` | Custom icon (auto-detected from variant if not provided) |
| `title` | string\|null | `null` | Optional alert title |
| `dismissible` | bool | `false` | Enable dismiss button |
| `id` | string\|null | `null` | Alert ID (auto-generated for dismissible alerts) |

---

### Toast

Toast notification system.

**Example:**
```blade
{{-- Backend toast --}}
@php
    toast('Success!', 'Your changes have been saved.', 'success');
@endphp

{{-- Or using helper --}}
@php
    toast()->success('Success!', 'Your changes have been saved.');
    toast()->error('Error!', 'Something went wrong.');
    toast()->warning('Warning!', 'Please check your input.');
    toast()->info('Info', 'Did you know...');
@endphp

{{-- Livewire integration - use named parameters --}}
@php
    // In your Livewire component
    $this->dispatch('showToast',
        variant: 'success',
        title: 'Review Submitted',
        message: 'Your review has been submitted successfully!'
    );

    // Error toast
    $this->dispatch('showToast',
        variant: 'danger',
        title: 'Validation Error',
        message: 'Please fill in all required fields correctly.'
    );
@endphp

{{-- Include toast container in layout --}}
<x-keys::toast />
```

---

### Modal

Modal dialog with header, body, and footer slots.

**Example:**
```blade
<x-keys::modal id="confirm-delete" size="md" backdrop="blur">
    <x-slot:header>
        <h2>Confirm Deletion</h2>
    </x-slot:header>

    Are you sure you want to delete this item? This action cannot be undone.

    <x-slot:footer>
        <x-keys::button variant="ghost" onclick="document.getElementById('confirm-delete').close()">
            Cancel
        </x-keys::button>
        <x-keys::button variant="danger">Delete</x-keys::button>
    </x-slot:footer>
</x-keys::modal>

{{-- Trigger --}}
<x-keys::button onclick="document.getElementById('confirm-delete').showModal()">
    Open Modal
</x-keys::button>

{{-- Livewire integration --}}
<x-keys::modal id="user-form" wire:model="showModal" lazy>
    <x-slot:header>Edit User</x-slot:header>

    @livewire('user-form', ['userId' => $userId])

    <x-slot:footer>
        <x-keys::button wire:click="save">Save</x-keys::button>
    </x-slot:footer>
</x-keys::modal>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | required | Unique identifier for modal |
| `size` | string | `'md'` | Modal size (xs, sm, md, lg, xl, full) |
| `closedby` | string | `'any'` | How modal can be closed (any, closerequest, none) |
| `backdrop` | string | `'blur'` | Backdrop variant (blur, dark, none) |
| `centered` | bool | `true` | Whether modal is vertically centered |
| `scrollable` | bool | `false` | Whether modal body is scrollable |
| `animate` | bool | `true` | Whether to use CSS animations |
| `lazy` | bool | `false` | Whether to lazy load content |
| `persistent` | bool | `false` | Whether modal persists across navigation |
| `trapFocus` | bool | `true` | Whether to trap focus within modal |
| `wireModel` | string\|null | `null` | Livewire model binding |

---

### Slideout

Slide-out panel from left or right.

**Example:**
```blade
<x-keys::slideout id="filters" position="left" size="md">
    <x-slot:header>
        <h2>Filters</h2>
    </x-slot:header>

    Filter content here...

    <x-slot:footer>
        <x-keys::button>Apply Filters</x-keys::button>
    </x-slot:footer>
</x-keys::slideout>

{{-- Trigger --}}
<x-keys::button onclick="document.getElementById('filters').showModal()">
    Open Filters
</x-keys::button>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | required | Unique identifier |
| `position` | string | `'right'` | Slideout position (left, right) |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg, xl, full) |
| `width` | string\|null | `null` | Custom width (overrides size) |
| `closedby` | string | `'any'` | How slideout can be closed |
| `backdrop` | string | `'blur'` | Backdrop variant (blur, dark, none) |
| `scrollable` | bool | `false` | Whether body is scrollable |
| `animate` | bool | `true` | Whether to use animations |
| `dismissible` | bool | `true` | Whether to show close button |
| `lazy` | bool | `false` | Whether to lazy load content |
| `persistent` | bool | `false` | Whether persists across navigation |
| `trapFocus` | bool | `true` | Whether to trap focus |
| `wireModel` | string\|null | `null` | Livewire model binding |

---

### Progress

Progress bar with variants and animations.

**Example:**
```blade
<x-keys::progress :value="75" :max="100" />

<x-keys::progress
    :value="50"
    label="Upload Progress"
    show-percentage
    color="success"
    size="lg"
/>

<x-keys::progress
    :value="80"
    striped
    animated
    status="Processing..."
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | int\|float | `0` | Current progress value |
| `max` | int\|float | `100` | Maximum progress value |
| `label` | string\|null | `null` | Label text |
| `showValue` | bool | `true` | Show value/max display |
| `showPercentage` | bool | `true` | Show percentage |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg, xl) |
| `color` | string | `'brand'` | Color variant |
| `variant` | string | `'default'` | Style variant |
| `animated` | bool | `false` | Show animated stripes |
| `striped` | bool | `false` | Show static stripes |
| `status` | string\|null | `null` | Status text |
| `id` | string\|null | `null` | Custom ID |

---

### Loading

Loading spinner or skeleton screen.

**Example:**
```blade
<x-keys::loading />

<x-keys::loading animation="dots" />

<x-keys::loading animation="bars" size="lg" />

<x-keys::loading animation="pulse" label="Loading content..." />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animation` | string | `'spinner'` | Animation type (spinner, dots, bars, pulse, wave, bounce) |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg, xl) |
| `label` | string\|null | `'Loading...'` | Accessibility label for screen readers |
| `id` | string\|null | `null` | Custom ID for the loading element |

---

### EmptyState

Empty state placeholder.

**Example:**
```blade
<x-keys::empty-state
    icon="heroicon-o-inbox"
    title="No items found"
    description="Get started by creating your first item."
>
    <x-keys::button icon-left="heroicon-o-plus">Create Item</x-keys::button>
</x-keys::empty-state>

{{-- With built-in action button --}}
<x-keys::empty-state
    icon="heroicon-o-folder"
    title="No projects"
    description="Create your first project to get started."
    action-text="Create Project"
    action-url="/projects/create"
    action-icon="heroicon-o-plus"
    variant="brand"
    size="lg"
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | `'No data found'` | Main heading for the empty state |
| `description` | string | `'There are no items to display.'` | Descriptive text |
| `icon` | string\|null | `'heroicon-o-document-text'` | Icon name (heroicon format) |
| `variant` | string | `'neutral'` | Color variant (neutral, brand, success, warning, danger, info) |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `actionText` | string\|null | `null` | Text for the action button |
| `actionUrl` | string\|null | `null` | URL for the action button |
| `actionIcon` | string\|null | `null` | Icon for the action button |

---

## Layout

### Group

Universal component grouping with unified borders and shared styling. Works with any component that has `data-keys-group-target` attribute.

**Example:**
```blade
{{-- Input with action button --}}
<x-keys::group>
    <x-keys::input name="search" placeholder="Search..." />
    <x-keys::button icon="heroicon-o-magnifying-glass">
        <span class="sr-only">Search</span>
    </x-keys::button>
</x-keys::group>

{{-- Select with action button --}}
<x-keys::group>
    <x-keys::select name="filter" placeholder="Filter by...">
        <x-keys::select.option value="all">All</x-keys::select.option>
        <x-keys::select.option value="active">Active</x-keys::select.option>
    </x-keys::select>
    <x-keys::button>Apply</x-keys::button>
</x-keys::group>

{{-- Date range inputs --}}
<x-keys::group>
    <x-keys::date-picker name="start_date" placeholder="Start date" />
    <x-keys::date-picker name="end_date" placeholder="End date" />
</x-keys::group>

{{-- Time range with button --}}
<x-keys::group>
    <x-keys::timepicker name="start_time" placeholder="Start" />
    <x-keys::timepicker name="end_time" placeholder="End" />
    <x-keys::button>Confirm</x-keys::button>
</x-keys::group>

{{-- Vertical button group --}}
<x-keys::group orientation="vertical">
    <x-keys::button variant="outline">Option 1</x-keys::button>
    <x-keys::button variant="outline">Option 2</x-keys::button>
    <x-keys::button variant="outline">Option 3</x-keys::button>
</x-keys::group>

{{-- Detached mode with spacing --}}
<x-keys::group :attached="false" gap="md">
    <x-keys::button>First</x-keys::button>
    <x-keys::button>Second</x-keys::button>
    <x-keys::button>Third</x-keys::button>
</x-keys::group>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | string | `'horizontal'` | Group orientation (`horizontal`, `vertical`) |
| `attached` | bool | `true` | Whether components share borders (attached mode) |
| `gap` | string | `'md'` | Gap size when detached (`xs`, `sm`, `md`, `lg`, `xl`) |
| `size` | string\|null | `null` | Inherited size for child components via CSS custom property |

**Supported Components:**
- Input, Textarea
- Select, DatePicker, TimePicker
- Button
- Any component with `data-keys-group-target` attribute

---

### Card

Card container with header, body, footer, and actions.

**Example:**
```blade
<x-keys::card>
    <x-keys::card.header>
        <h3>Card Title</h3>
    </x-keys::card.header>

    <x-keys::card.body>
        Card content goes here...
    </x-keys::card.body>

    <x-keys::card.footer>
        <x-keys::button>Action</x-keys::button>
    </x-keys::card.footer>
</x-keys::card>

{{-- Clickable card --}}
<x-keys::card href="/details" selected>
    <x-keys::card.header>Product Card</x-keys::card.header>
    <x-keys::card.body>Click anywhere on the card</x-keys::card.body>
</x-keys::card>

{{-- With image --}}
<x-keys::card image-url="/images/product.jpg" image-position="top">
    <x-keys::card.header>Product Name</x-keys::card.header>
    <x-keys::card.body>$99.99</x-keys::card.body>
    <x-keys::card.actions>
        <x-keys::button size="sm">Add to Cart</x-keys::button>
    </x-keys::card.actions>
</x-keys::card>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'default'` | Card variant |
| `colorVariant` | string | `'neutral'` | Color variant |
| `padding` | string | `'lg'` | Padding size (none, sm, md, lg) |
| `rounded` | string | `'lg'` | Border radius (none, sm, md, lg) |
| `shadow` | string | `'xs'` | Shadow size (none, sm, md, lg) |
| `selected` | bool | `false` | Whether card is selected |
| `loading` | bool | `false` | Show loading skeleton |
| `loadingText` | string\|null | `null` | Loading text |
| `href` | string\|null | `null` | Link URL (makes card clickable) |
| `disabled` | bool | `false` | Whether card is disabled |
| `imageUrl` | string\|null | `null` | Image URL |
| `imageAlt` | string\|null | `null` | Image alt text |
| `imagePosition` | string | `'top'` | Image position (top, bottom, left, right) |
| `density` | string | `'comfortable'` | Content density (compact, comfortable, spacious) |

---

### Separator

Visual separator line with multiple variants.

**Example:**
```blade
<x-keys::separator />

<x-keys::separator orientation="vertical" />

<x-keys::separator variant="text">OR</x-keys::separator>

<x-keys::separator variant="dashed" />

<x-keys::separator variant="gradient" color="brand" />

<x-keys::separator variant="icon" icon="heroicon-o-star" />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'line'` | Separator variant (line, text, icon, gradient, dashed) |
| `orientation` | string | `'horizontal'` | Orientation (horizontal, vertical) |
| `color` | string | `'neutral'` | Color variant |
| `size` | string | `'sm'` | Size variant (xs, sm, md, lg) |
| `spacing` | string | `'md'` | Spacing around separator (none, xs, sm, md, lg, xl) |
| `alignment` | string | `'center'` | Text/icon alignment (left, center, right) |
| `icon` | string\|null | `null` | Icon name for icon variant |

---

### Main

Main content area wrapper, typically used with Sidebar for application layouts.

**Example:**
```blade
<div class="flex h-screen">
    <x-keys::sidebar>
        {{-- Sidebar navigation --}}
    </x-keys::sidebar>

    <x-keys::main>
        <div class="container mx-auto p-6">
            {{-- Main content --}}
        </div>
    </x-keys::main>
</div>
```

---

### Accordion

Collapsible accordion panel.

**Example:**
```blade
<x-keys::accordion title="What is Keys UI?">
    Keys UI is a modern Blade components library for Laravel.
</x-keys::accordion>

<x-keys::accordion
    title="Features"
    icon="heroicon-o-star"
    collapsed
    variant="outlined"
>
    Comprehensive set of UI components...
</x-keys::accordion>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string\|null | `null` | Accordion title |
| `id` | string\|null | `null` | Accordion ID (auto-generated if not provided) |
| `icon` | string\|null | `'heroicon-o-chevron-down'` | Toggle icon |
| `collapsed` | bool | `false` | Initial collapsed state |
| `disabled` | bool | `false` | Whether accordion is disabled |
| `color` | string | `'neutral'` | Color variant |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg) |
| `variant` | string | `'default'` | Style variant (default, flush, spaced, outlined, elevated) |
| `rounded` | string | `'lg'` | Border radius |
| `actions` | array | `[]` | Custom actions |
| `actionVariant` | string | `'ghost'` | Action button variant |
| `actionSize` | string | `'xs'` | Action button size |
| `animated` | bool | `true` | Whether to animate transitions |

---

## Data Display

### Table

Data table with sorting, pagination, and selection.

**Example:**
```blade
<x-keys::table striped hover>
    <x-keys::table.head>
        <x-keys::table.row>
            <x-keys::table.header>Name</x-keys::table.header>
            <x-keys::table.header>Email</x-keys::table.header>
            <x-keys::table.header>Status</x-keys::table.header>
        </x-keys::table.row>
    </x-keys::table.head>

    <x-keys::table.body>
        @foreach($users as $user)
            <x-keys::table.row>
                <x-keys::table.cell>{{ $user->name }}</x-keys::table.cell>
                <x-keys::table.cell>{{ $user->email }}</x-keys::table.cell>
                <x-keys::table.cell>
                    <x-keys::badge :color="$user->status === 'active' ? 'success' : 'neutral'">
                        {{ $user->status }}
                    </x-keys::badge>
                </x-keys::table.cell>
            </x-keys::table.row>
        @endforeach
    </x-keys::table.body>
</x-keys::table>

{{-- With pagination --}}
<x-keys::table :paginate="$users" selectable>
    {{-- Table content --}}
</x-keys::table>

{{-- Loading state --}}
<x-keys::table loading loading-text="Loading users...">
    {{-- Table structure --}}
</x-keys::table>

{{-- Empty state --}}
<x-keys::table>
    <x-keys::table.head>...</x-keys::table.head>
    <x-keys::table.body>
        <x-keys::table.empty>
            <x-keys::empty-state title="No users found" />
        </x-keys::table.empty>
    </x-keys::table.body>
</x-keys::table>
```

**Table Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `striped` | bool | `false` | Enable striped rows |
| `hover` | bool | `false` | Enable hover effect |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `paginate` | Paginator\|null | `null` | Laravel paginator instance |
| `bordered` | bool | `false` | Show borders |
| `responsive` | bool | `true` | Enable responsive wrapper |
| `selectable` | bool | `false` | Enable row selection |
| `selectionName` | string | `'selected[]'` | Selection field name |
| `selectedIds` | array | `[]` | Array of selected IDs |
| `livewireSelectionMethod` | string\|null | `null` | Livewire method for selection |
| `loading` | bool | `false` | Show loading state |
| `loadingText` | string | `'Loading...'` | Loading text |
| `loadingAnimation` | string | `'spinner'` | Loading animation type |

---

### Badge

Status badge with variants and colors.

**Example:**
```blade
<x-keys::badge>Default</x-keys::badge>

<x-keys::badge color="success">Active</x-keys::badge>
<x-keys::badge color="warning">Pending</x-keys::badge>
<x-keys::badge color="danger">Inactive</x-keys::badge>

<x-keys::badge variant="subtle" color="blue">Info</x-keys::badge>

<x-keys::badge icon="heroicon-o-check-circle" color="success">Verified</x-keys::badge>

<x-keys::badge dismissible>Dismissible</x-keys::badge>

{{-- Badge group --}}
<x-keys::badge.group>
    <x-keys::badge>Design</x-keys::badge>
    <x-keys::badge>Development</x-keys::badge>
    <x-keys::badge>Marketing</x-keys::badge>
</x-keys::badge.group>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'filled'` | Badge variant (filled, subtle, chip) |
| `color` | string | `'blue'` | Color variant |
| `size` | string | `'sm'` | Size variant (xs, sm, md) |
| `icon` | string\|null | `null` | Icon name |
| `dismissible` | bool | `false` | Enable dismiss button |
| `id` | string\|null | `null` | Badge ID |

---

### Avatar

User avatar with initials fallback.

**Example:**
```blade
<x-keys::avatar src="/images/user.jpg" alt="John Doe" />

<x-keys::avatar name="John Doe" />

<x-keys::avatar name="Jane Smith" status="online" />

<x-keys::avatar
    src="/images/user.jpg"
    size="lg"
    shape="square"
    border
/>

{{-- Avatar stack --}}
<x-keys::avatar.stack>
    <x-keys::avatar name="Alice" />
    <x-keys::avatar name="Bob" />
    <x-keys::avatar name="Charlie" />
    <x-keys::avatar name="+5" />
</x-keys::avatar.stack>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string\|null | `null` | Image URL |
| `alt` | string\|null | `null` | Alt text (auto-generated if not provided) |
| `name` | string\|null | `null` | Name for initials fallback |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg, xl) |
| `shape` | string | `'circle'` | Shape (circle, square) |
| `status` | string\|null | `null` | Status indicator (online, offline, away, busy) |
| `color` | string | `'neutral'` | Color theme |
| `border` | bool | `false` | Show border |
| `lazy` | bool | `true` | Enable lazy loading |

---

### Rating

Star rating display and input.

**Example:**
```blade
<x-keys::rating :value="4.5" />

<x-keys::rating :value="3" :max="5" size="lg" />

<x-keys::rating name="rating" />

<x-keys::rating :value="4" readonly />

<x-keys::rating name="rating" allow-half show-count />
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `id` | string\|null | `null` | Rating ID (auto-generated if not provided) |
| `value` | int\|float | `0` | Current rating value |
| `max` | int | `5` | Maximum rating value |
| `readonly` | bool | `false` | Whether rating is readonly (display only) |
| `disabled` | bool | `false` | Whether rating is disabled |
| `required` | bool | `false` | Whether rating is required |
| `icon` | string | `'star'` | Icon name (without heroicon prefix) |
| `iconFilled` | string\|null | `null` | Custom filled icon (auto-generated if not provided) |
| `iconOutlined` | string\|null | `null` | Custom outlined icon (auto-generated if not provided) |
| `color` | string | `'warning'` | Color variant |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg, xl) |
| `label` | string\|null | `null` | Label text (shorthand mode) |
| `hint` | string\|null | `null` | Hint text |
| `optional` | bool | `false` | Show optional indicator |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `allowHalf` | bool | `false` | Allow half-star ratings |
| `showCount` | bool | `false` | Show rating count/value |

---

### Kbd

Keyboard shortcut display.

**Example:**
```blade
Press <x-keys::kbd>Ctrl</x-keys::kbd> + <x-keys::kbd>S</x-keys::kbd> to save

<x-keys::kbd>⌘</x-keys::kbd><x-keys::kbd>K</x-keys::kbd>
```

---

## Typography

### Text

Flexible text component for body text, labels, and inline content.

**Example:**
```blade
{{-- Basic text --}}
<x-keys::text>Standard body text</x-keys::text>

{{-- Muted secondary text --}}
<x-keys::text color="muted" size="sm">
    Secondary information
</x-keys::text>

{{-- Line clamping --}}
<x-keys::text line-clamp="3">
    Long content that will be truncated to 3 lines...
</x-keys::text>

{{-- Label element --}}
<x-keys::text element="label" weight="medium" size="sm">
    Form Field Label
</x-keys::text>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `element` | string | `'p'` | HTML element (p, span, div, label, small) |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg, xl, 2xl) |
| `color` | string | `'primary'` | Color (heading, primary, secondary, muted, brand, success, warning, danger, info) |
| `weight` | string | `'normal'` | Font weight (light, normal, medium, semibold, bold) |
| `align` | string\|null | `null` | Text alignment (left, center, right, justify) |
| `lineHeight` | string\|null | `null` | Line height (tight, normal, relaxed, loose) |
| `lineClamp` | int\|null | `null` | Truncate to N lines (1-6) |
| `italic` | bool | `false` | Italic text |
| `underline` | bool | `false` | Underlined text |
| `uppercase` | bool | `false` | Uppercase text |
| `lowercase` | bool | `false` | Lowercase text |
| `capitalize` | bool | `false` | Capitalize text |

---

### Heading

Semantic heading component with visual size decoupled from HTML level.

**Example:**
```blade
{{-- Semantic h1 with automatic 4xl sizing --}}
<x-keys::heading level="h1">Page Title</x-keys::heading>

{{-- h2 with custom size override --}}
<x-keys::heading level="h2" size="xl" color="brand">
    Section Title
</x-keys::heading>

{{-- Gradient hero heading --}}
<x-keys::heading level="h1" gradient>
    Beautiful Gradient Heading
</x-keys::heading>

{{-- With underline decoration --}}
<x-keys::heading level="h3" underline>
    Subsection Title
</x-keys::heading>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | string | `'h2'` | HTML heading level (h1, h2, h3, h4, h5, h6) |
| `size` | string\|null | `null` | Visual size (xs, sm, md, lg, xl, 2xl, 3xl, 4xl) - auto-maps from level if null |
| `color` | string | `'heading'` | Color (heading, primary, muted, brand, success, warning, danger, info) |
| `weight` | string | `'semibold'` | Font weight (normal, medium, semibold, bold, extrabold) |
| `tracking` | string | `'normal'` | Letter spacing (tighter, tight, normal, wide, wider) |
| `underline` | bool | `false` | Show decorative underline |
| `gradient` | bool | `false` | Apply brand color gradient |

---

## Media

### Image

Responsive image with lazy loading, fallback handling, and overlay support.

**Example:**
```blade
<x-keys::image
    src="/images/product.jpg"
    alt="Product"
    lazy
/>

<x-keys::image
    src="/images/hero.jpg"
    aspect-ratio="video"
    object-fit="cover"
    radius="lg"
/>

{{-- With overlay --}}
<x-keys::image
    src="/images/banner.jpg"
    alt="Banner"
    overlay="gradient-bottom"
    overlay-color="black"
    overlay-opacity="60"
/>

{{-- With caption and lightbox --}}
<x-keys::image
    src="/images/photo.jpg"
    alt="Photo"
    caption="Beautiful landscape"
    lightbox
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | required | Image URL for display |
| `alt` | string | required | Alternative text for accessibility |
| `size` | string | `'full'` | Size variant (xs, sm, md, lg, xl, full) |
| `aspectRatio` | string | `'auto'` | Aspect ratio (auto, square, video, photo, wide) |
| `objectFit` | string | `'cover'` | How image fits container (cover, contain, fill, scale-down, none) |
| `radius` | string | `'none'` | Border radius (none, sm, md, lg, xl, full) |
| `caption` | string\|null | `null` | Optional caption text below image |
| `overlay` | string\|null | `null` | Overlay type (gradient-top, gradient-bottom, solid, none) |
| `overlayColor` | string | `'black'` | Color for overlay (black, white, brand, etc.) |
| `overlayOpacity` | string | `'50'` | Opacity level (10-90) |
| `lazy` | bool | `true` | Enable lazy loading |
| `placeholder` | string\|null | `null` | Background color while loading |
| `lightbox` | bool | `false` | Enable lightbox functionality |
| `fallbackIcon` | string | `'heroicon-o-photo'` | Icon for failed images |
| `fallbackText` | string\|null | `null` | Custom fallback accessibility text |
| `retryAttempts` | int | `2` | Retry attempts for failed images (0-5) |

---

### Icon

Intelligent icon component with automatic resolution supporting Heroicons, custom icons, and Blade components.

**Example:**
```blade
{{-- Simple name (auto-resolves to Heroicon outline) --}}
<x-keys::icon name="heart" />

{{-- Explicit variant --}}
<x-keys::icon name="star" variant="solid" size="lg" />

{{-- Shorthand prefix --}}
<x-keys::icon name="s:heart" />
<x-keys::icon name="o:star" />
<x-keys::icon name="m:check" />

{{-- Backward compatibility --}}
<x-keys::icon name="heroicon-o-heart" />
<x-keys::icon name="heroicon-s-star" />

{{-- Custom SVG icons (from resources/icons/) --}}
<x-keys::icon name="custom:logo" />

{{-- Blade component icons --}}
<x-keys::icon name="blade:custom-icon" />
```

**Icon Resolution Priority:**
1. Custom SVG icons from `resources/icons/`
2. Blade component icons from `resources/views/components/icons/`
3. Heroicons (default)

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Icon name (supports simple names, prefixes, or full paths) |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg, xl) |
| `variant` | string | `'outline'` | Heroicon variant (outline, solid, mini) |
| `fallback` | string\|null | `'heroicon-o-question-mark-circle'` | Fallback icon if resolution fails |

---

### Gallery

Image gallery with lightbox.

**Example:**
```blade
<x-keys::gallery :images="$images" columns="3" />

<x-keys::gallery
    :images="[
        ['src' => '/image1.jpg', 'alt' => 'Image 1'],
        ['src' => '/image2.jpg', 'alt' => 'Image 2'],
    ]"
    spacing="md"
/>
```

---

### HeadingDecorator

Decorative heading component.

**Example:**
```blade
<x-keys::heading-decorator>Section Title</x-keys::heading-decorator>

<x-keys::heading-decorator variant="underline" color="brand">
    Featured Products
</x-keys::heading-decorator>
```

---

## Overlays

### Tooltip

Tooltip with native popover API.

**Example:**
```blade
<x-keys::tooltip content="This is a tooltip">
    <x-keys::button>Hover me</x-keys::button>
</x-keys::tooltip>

<x-keys::tooltip placement="right" color="light">
    <x-slot:trigger>
        <x-keys::icon name="heroicon-o-information-circle" />
    </x-slot:trigger>

    More information here...
</x-keys::tooltip>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | string | `'top'` | Tooltip placement (top, bottom, left, right) |
| `color` | string | `'dark'` | Color theme (dark, light) |
| `size` | string | `'md'` | Size variant (sm, md, lg) |
| `id` | string\|null | `null` | Tooltip ID (auto-generated if not provided) |
| `content` | string\|null | `null` | Tooltip text content |

---

### Popover

Popover with rich content support.

**Example:**
```blade
<x-keys::popover>
    <x-slot:trigger>
        <x-keys::button>Open Popover</x-keys::button>
    </x-slot:trigger>

    <div class="p-4">
        <h3 class="font-bold mb-2">Popover Title</h3>
        <p>Rich content here...</p>
    </div>
</x-keys::popover>

<x-keys::popover placement="top" arrow>
    <x-slot:trigger>
        <x-keys::button>Top Popover</x-keys::button>
    </x-slot:trigger>

    Content here...
</x-keys::popover>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string\|null | `null` | Popover ID (auto-generated if not provided) |
| `variant` | string | `'default'` | Style variant |
| `size` | string | `'md'` | Size variant (xs, sm, md, lg, xl, full) |
| `placement` | string | `'bottom'` | Popover placement (top, bottom, left, right) |
| `arrow` | bool | `false` | Show arrow pointing to trigger |
| `manual` | bool | `false` | Manual control mode |

---

## Social

### Social.Links

Social media icon links.

**Example:**
```blade
<x-keys::social.links
    :links="[
        'facebook' => 'https://facebook.com/page',
        'twitter' => 'https://twitter.com/handle',
        'instagram' => 'https://instagram.com/handle',
    ]"
    size="lg"
/>
```

---

### Social.Share

Social media share buttons.

**Example:**
```blade
<x-keys::social.share
    :url="url()->current()"
    title="Check this out!"
    :platforms="['facebook', 'twitter', 'linkedin']"
/>
```

---

## Utilities

### Scripts

Include Keys UI JavaScript.

**Example:**
```blade
{{-- In your layout --}}
<x-keys::scripts />
```

---

### Calendar

Calendar component.

**Example:**
```blade
<x-keys::calendar
    :selected-date="now()"
    :min-date="now()->subMonth()"
    :max-date="now()->addMonth()"
/>
```

---

### Chart

Chart wrapper component.

**Example:**
```blade
<x-keys::chart
    type="line"
    :data="$chartData"
    height="400"
/>
```

---

### ChoiceGroup

Grouped checkbox/radio choices with flexible layouts.

**Example:**
```blade
{{-- Checkbox group --}}
<x-keys::choice-group
    name="features"
    legend="Select Features"
    type="checkbox"
    layout="stacked"
>
    <x-keys::checkbox name="features[]" value="feature1" label="Feature 1" />
    <x-keys::checkbox name="features[]" value="feature2" label="Feature 2" />
    <x-keys::checkbox name="features[]" value="feature3" label="Feature 3" />
</x-keys::choice-group>

{{-- Radio group with grid layout --}}
<x-keys::choice-group
    name="plan"
    legend="Choose Your Plan"
    type="radio"
    layout="grid"
    description="Select the plan that works best for you"
>
    <x-keys::radio name="plan" value="basic" variant="card" title="Basic" />
    <x-keys::radio name="plan" value="pro" variant="card" title="Pro" />
    <x-keys::radio name="plan" value="enterprise" variant="card" title="Enterprise" />
</x-keys::choice-group>

{{-- Inline layout --}}
<x-keys::choice-group
    name="notification"
    legend="Notification Preferences"
    type="checkbox"
    layout="inline"
    size="sm"
>
    <x-keys::checkbox name="notification[]" value="email" label="Email" />
    <x-keys::checkbox name="notification[]" value="sms" label="SMS" />
    <x-keys::checkbox name="notification[]" value="push" label="Push" />
</x-keys::choice-group>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string\|null | `null` | Form field name |
| `legend` | string\|null | `null` | Group legend/label |
| `description` | string\|null | `null` | Descriptive text for the group |
| `type` | string | `'checkbox'` | Input type (checkbox, radio) |
| `layout` | string | `'stacked'` | Layout variant (stacked, grid, inline) |
| `size` | string | `'md'` | Size variant |
| `required` | bool | `false` | Whether group is required |
| `disabled` | bool | `false` | Whether group is disabled |
| `errors` | string\|array\|Collection\|null | `null` | Validation errors |
| `showErrors` | bool | `true` | Display validation errors |
| `hasError` | bool | `false` | Force error state |

---

## Component Composition Patterns

### Form with Validation

```blade
<form method="POST" action="/submit">
    @csrf

    <x-keys::input
        name="name"
        label="Full Name"
        required
        :errors="$errors->get('name')"
    />

    <x-keys::input
        name="email"
        type="email"
        label="Email Address"
        required
        :errors="$errors->get('email')"
    />

    <x-keys::textarea
        name="message"
        label="Message"
        rows="5"
        max-length="500"
        show-character-count
        :errors="$errors->get('message')"
    />

    <x-keys::button type="submit">Submit</x-keys::button>
</form>
```

### Modal with Form

```blade
<x-keys::modal id="edit-user" size="lg">
    <x-slot:header>
        <h2>Edit User</h2>
    </x-slot:header>

    <form id="user-form" method="POST">
        @csrf
        <div class="space-y-4">
            <x-keys::input name="name" label="Name" required />
            <x-keys::input name="email" type="email" label="Email" required />
            <x-keys::select name="role" label="Role">
                <x-keys::select.option value="admin">Admin</x-keys::select.option>
                <x-keys::select.option value="user">User</x-keys::select.option>
            </x-keys::select>
        </div>
    </form>

    <x-slot:footer>
        <x-keys::button variant="ghost" onclick="this.closest('dialog').close()">
            Cancel
        </x-keys::button>
        <x-keys::button form="user-form" type="submit">
            Save Changes
        </x-keys::button>
    </x-slot:footer>
</x-keys::modal>
```

### Data Table with Actions

```blade
<x-keys::table striped hover :paginate="$users">
    <x-keys::table.head>
        <x-keys::table.row>
            <x-keys::table.header>Name</x-keys::table.header>
            <x-keys::table.header>Email</x-keys::table.header>
            <x-keys::table.header>Role</x-keys::table.header>
            <x-keys::table.header>Actions</x-keys::table.header>
        </x-keys::table.row>
    </x-keys::table.head>

    <x-keys::table.body>
        @foreach($users as $user)
            <x-keys::table.row>
                <x-keys::table.cell>
                    <div class="flex items-center gap-2">
                        <x-keys::avatar :name="$user->name" size="sm" />
                        {{ $user->name }}
                    </div>
                </x-keys::table.cell>
                <x-keys::table.cell>{{ $user->email }}</x-keys::table.cell>
                <x-keys::table.cell>
                    <x-keys::badge :color="$user->role === 'admin' ? 'brand' : 'neutral'">
                        {{ $user->role }}
                    </x-keys::badge>
                </x-keys::table.cell>
                <x-keys::table.cell>
                    <x-keys::dropdown size="sm">
                        <x-slot:trigger>
                            <x-keys::button variant="ghost" size="xs" icon="heroicon-o-ellipsis-horizontal">
                                <span class="sr-only">Actions</span>
                            </x-keys::button>
                        </x-slot:trigger>

                        <x-keys::dropdown.item icon="heroicon-o-pencil">Edit</x-keys::dropdown.item>
                        <x-keys::dropdown.item icon="heroicon-o-trash" variant="danger">Delete</x-keys::dropdown.item>
                    </x-keys::dropdown>
                </x-keys::table.cell>
            </x-keys::table.row>
        @endforeach
    </x-keys::table.body>
</x-keys::table>
```

---

## Installation & Usage

```bash
# Install via Composer
composer require keys/ui

# Publish assets
php artisan keys:build

# Include in layout
<x-keys::scripts />
```

For full documentation and examples, visit [Keys UI Documentation](#).
