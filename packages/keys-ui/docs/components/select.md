# Select Component

Advanced dropdown functionality with search, multiselect, and rich option content using Laravel component slots.

## Basic Usage

```blade
{{-- Simple select --}}
<x-keys::select name="category" placeholder="Choose category">
    <x-keys::select.option value="tech" label="Technology" />
    <x-keys::select.option value="design" label="Design" />
    <x-keys::select.option value="marketing" label="Marketing" />
</x-keys::select>

{{-- Select with label --}}
<x-keys::select name="status" label="Project Status" required>
    <x-keys::select.option value="draft" label="Draft" />
    <x-keys::select.option value="active" label="Active" />
    <x-keys::select.option value="completed" label="Completed" />
</x-keys::select>
```

## Component Structure

The Select component uses a nested structure with dot notation following Laravel directory patterns:

- **Main Component**: `x-keys::select`
- **Option Component**: `x-keys::select.option`

## Props

### Select Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Select name attribute |
| `label` | string | `null` | Select label text |
| `placeholder` | string | `null` | Placeholder text |
| `value` | string/array | `null` | Selected value(s) |
| `size` | string | `md` | Size: `sm`, `md`, `lg` |
| `width` | string | `full` | Width: `auto`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `fit`, `full` |
| `multiple` | boolean | `false` | Enable multiple selection |
| `searchable` | boolean | `false` | Enable search functionality |
| `clearable` | boolean | `false` | Show clear button |
| `disabled` | boolean | `false` | Disable select |
| `required` | boolean | `false` | Mark as required |
| `optional` | boolean | `false` | Show optional indicator |
| `errors` | object | `null` | Validation errors |
| `show-errors` | boolean | `true` | Display validation errors |
| `aria-label` | string | `null` | ARIA label for accessibility |
| `aria-describedby` | string | `null` | ARIA described by attribute |

### Option Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | required | Option value |
| `label` | string | `value` | Display text (falls back to value) |
| `display-label` | string | `label` | Alternative display label |
| `icon` | string | `null` | Heroicon name |
| `description` | string | `null` | Secondary text |
| `disabled` | boolean | `false` | Disable option |
| `selected` | boolean | `false` | Pre-selected state |

## Basic Examples

### Single Selection
```blade
<x-keys::select name="country" label="Country" placeholder="Select your country">
    <x-keys::select.option value="us" label="United States" />
    <x-keys::select.option value="ca" label="Canada" />
    <x-keys::select.option value="uk" label="United Kingdom" />
    <x-keys::select.option value="fr" label="France" />
</x-keys::select>
```

### With Icons
```blade
<x-keys::select name="status" label="Status" placeholder="Choose status">
    <x-keys::select.option
        value="active"
        label="Active"
        icon="heroicon-o-check-circle"
        description="Project is running smoothly"
    />
    <x-keys::select.option
        value="warning"
        label="Warning"
        icon="heroicon-o-exclamation-triangle"
        description="Needs attention"
    />
    <x-keys::select.option
        value="error"
        label="Error"
        icon="heroicon-o-x-circle"
        description="Critical issues found"
    />
</x-keys::select>
```

## Advanced Features

### Multiple Selection with Search
```blade
<x-keys::select
    name="skills[]"
    label="Skills"
    multiple
    searchable
    clearable
    placeholder="Select your skills"
>
    <x-keys::select.option value="php" label="PHP" icon="heroicon-o-code-bracket" />
    <x-keys::select.option value="js" label="JavaScript" icon="heroicon-o-bolt" />
    <x-keys::select.option value="react" label="React" icon="heroicon-o-cpu-chip" />
    <x-keys::select.option value="vue" label="Vue.js" icon="heroicon-o-sparkles" />
    <x-keys::select.option value="laravel" label="Laravel" icon="heroicon-o-server" />
</x-keys::select>
```

### Rich Content Options
```blade
<x-keys::select name="plan" label="Subscription Plan" placeholder="Choose your plan">
    <x-keys::select.option value="free">
        <div class="flex items-center justify-between w-full">
            <div>
                <div class="font-semibold">Free Plan</div>
                <div class="text-xs text-neutral-500">Basic features</div>
            </div>
            <div class="text-sm font-bold text-green-600">$0/mo</div>
        </div>
    </x-keys::select.option>

    <x-keys::select.option value="pro">
        <div class="flex items-center justify-between w-full">
            <div>
                <div class="font-semibold">Pro Plan</div>
                <div class="text-xs text-neutral-500">Advanced features</div>
            </div>
            <div class="text-sm font-bold text-brand-600">$29/mo</div>
        </div>
    </x-keys::select.option>

    <x-keys::select.option value="enterprise">
        <div class="flex items-center justify-between w-full">
            <div>
                <div class="font-semibold">Enterprise</div>
                <div class="text-xs text-neutral-500">Full feature set</div>
            </div>
            <div class="text-sm font-bold text-purple-600">$99/mo</div>
        </div>
    </x-keys::select.option>
</x-keys::select>
```

## Size Variants

```blade
{{-- Small select --}}
<x-keys::select size="sm" name="priority" placeholder="Priority">
    <x-keys::select.option value="low" label="Low" />
    <x-keys::select.option value="medium" label="Medium" />
    <x-keys::select.option value="high" label="High" />
</x-keys::select>

{{-- Large select --}}
<x-keys::select size="lg" name="department" placeholder="Department">
    <x-keys::select.option value="engineering" label="Engineering" />
    <x-keys::select.option value="design" label="Design" />
    <x-keys::select.option value="marketing" label="Marketing" />
</x-keys::select>
```

## Width Variants

```blade
{{-- Auto width (fits content) --}}
<x-keys::select width="auto" name="status">
    <x-keys::select.option value="active" label="Active" />
    <x-keys::select.option value="inactive" label="Inactive" />
</x-keys::select>

{{-- Fixed width sizes --}}
<x-keys::select width="sm" name="code" placeholder="Code">
    <x-keys::select.option value="us" label="US" />
    <x-keys::select.option value="uk" label="UK" />
</x-keys::select>

<x-keys::select width="md" name="category">
    <x-keys::select.option value="tech" label="Technology" />
    <x-keys::select.option value="design" label="Design" />
</x-keys::select>

{{-- Full width (default) --}}
<x-keys::select width="full" name="description">
    <x-keys::select.option value="long" label="A very long description that needs full width" />
</x-keys::select>
```

## Form Integration

### Laravel Validation
```blade
<form method="POST">
    @csrf

    <x-keys::select
        name="categories[]"
        label="Categories"
        multiple
        required
        :errors="$errors"
        :value="old('categories', [])"
    >
        @foreach($categories as $category)
            <x-keys::select.option
                :value="$category->id"
                :label="$category->name"
                :selected="in_array($category->id, old('categories', []))"
            />
        @endforeach
    </x-keys::select>

    <x-keys::button type="submit" variant="brand">Save</x-keys::button>
</form>
```

### Livewire Integration
```blade
{{-- In Livewire component --}}
<div>
    <x-keys::select
        name="filter_status"
        label="Filter by Status"
        wire:model.live="filterStatus"
        clearable
    >
        <x-keys::select.option value="" label="All Statuses" />
        <x-keys::select.option value="active" label="Active" />
        <x-keys::select.option value="inactive" label="Inactive" />
        <x-keys::select.option value="pending" label="Pending" />
    </x-keys::select>

    {{-- Results update automatically --}}
    @if($items->count())
        @foreach($items as $item)
            <div>{{ $item->name }}</div>
        @endforeach
    @endif
</div>
```

## JavaScript Features

### Event System
```javascript
// Listen for selection changes
document.addEventListener('select:changed', function(event) {
    console.log('Selected:', event.detail.value);
    console.log('Element:', event.target);
});

// Listen for search events
document.addEventListener('select:searched', function(event) {
    console.log('Search term:', event.detail.searchTerm);
});
```

### Programmatic Control
```javascript
// Get select instance
const select = document.querySelector('[data-keys-select]');

// Set value programmatically
select.dispatchEvent(new CustomEvent('select:setValue', {
    detail: { value: 'new-value' }
}));

// Clear selection
select.dispatchEvent(new CustomEvent('select:clear'));
```

## Accessibility

- Full keyboard navigation (arrow keys, Enter, Escape)
- Screen reader support with ARIA attributes
- Focus management for search and options
- Proper labeling and descriptions
- High contrast mode support

## Data Attributes

```html
<div
    data-keys-select="true"
    data-select="true"
    data-size="md"
    data-width="full"
    data-multiple="true"
    data-searchable="true"
    data-clearable="false"
    data-disabled="false"
    data-required="false"
    data-name="category"
    data-selected-count="2"
    data-has-selection="true"
    data-has-label="true"
    data-shorthand-mode="true"
    data-has-placeholder="true"
    data-has-value="true"
    data-value='["tech","design"]'
    data-state="enabled"
    data-floating-placement="bottom-start"
    data-floating-offset="4"
>
```

## Floating UI Integration

The Select component uses Floating UI for smart dropdown positioning:

```blade
{{-- Dropdown automatically positions based on viewport --}}
<x-keys::select name="category" placeholder="Choose category">
    <!-- Options automatically position up or down based on space -->
    <x-keys::select.option value="tech" label="Technology" />
    <x-keys::select.option value="design" label="Design" />
</x-keys::select>
```

The dropdown will automatically:
- Position below the trigger when there's space
- Position above when near bottom of viewport
- Adjust horizontal positioning to stay within viewport
- Maintain proper offset and spacing

## CSS Customization

```css
/* Custom dropdown positioning */
[data-keys-select] .dropdown {
    max-height: 300px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Custom option styling */
[data-keys-select] .option:hover {
    background: var(--color-brand-50);
}

/* Custom chip styling for multiselect */
[data-keys-select] .chip {
    background: var(--color-brand-100);
    color: var(--color-brand-700);
}

/* Width-specific styling */
[data-keys-select][data-width="auto"] {
    width: auto;
    min-width: 8rem;
}

/* State-specific styling */
[data-keys-select][data-state="disabled"] {
    opacity: 0.6;
    cursor: not-allowed;
}
```

## Common Use Cases

### User Role Selection
```blade
<x-keys::select name="role" label="User Role" required>
    <x-keys::select.option value="admin" label="Administrator" icon="heroicon-o-shield-check" />
    <x-keys::select.option value="editor" label="Editor" icon="heroicon-o-pencil" />
    <x-keys::select.option value="viewer" label="Viewer" icon="heroicon-o-eye" />
</x-keys::select>
```

### Tag Selection
```blade
<x-keys::select name="tags[]" label="Tags" multiple searchable>
    @foreach($tags as $tag)
        <x-keys::select.option :value="$tag->slug" :label="$tag->name" />
    @endforeach
</x-keys::select>
```

### Dynamic Options with AJAX
```blade
<x-keys::select
    name="city"
    label="City"
    searchable
    x-data="citySelect"
    x-on:select:searched="searchCities($event.detail.searchTerm)"
>
    {{-- Options populated dynamically --}}
</x-keys::select>
```