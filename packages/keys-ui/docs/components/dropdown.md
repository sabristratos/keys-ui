# Dropdown Component

Flexible dropdown menus with customizable positioning, alignment, and content for navigation and actions.

## Basic Usage

```blade
{{-- Simple dropdown --}}
<x-keys::dropdown>
    <x-slot:trigger>
        <x-keys::button variant="ghost">
            Options
            <x-keys::icon name="heroicon-o-chevron-down" size="sm" class="ml-2" />
        </x-keys::button>
    </x-slot:trigger>

    <div class="space-y-1">
        <a href="#" class="block px-3 py-2 rounded text-sm hover:bg-neutral-100">Profile</a>
        <a href="#" class="block px-3 py-2 rounded text-sm hover:bg-neutral-100">Settings</a>
        <a href="#" class="block px-3 py-2 rounded text-sm hover:bg-neutral-100">Logout</a>
    </div>
</x-keys::dropdown>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | string | auto | Unique dropdown identifier |
| `position` | string | `bottom` | Position: `top`, `bottom`, `left`, `right` |
| `align` | string | `start` | Alignment: `start`, `center`, `end` |
| `offset` | integer | `8` | Distance from trigger (in pixels) |
| `disabled` | boolean | `false` | Disable dropdown |
| `modal` | boolean | `false` | Modal behavior (close on outside click) |
| `size` | string | `md` | Size: `sm`, `md`, `lg` |

## Position Variants

```blade
{{-- Bottom position (default) --}}
<x-keys::dropdown position="bottom">
    <x-slot:trigger>
        <x-keys::button>Bottom Dropdown</x-keys::button>
    </x-slot:trigger>
    <div>Content appears below</div>
</x-keys::dropdown>

{{-- Top position --}}
<x-keys::dropdown position="top">
    <x-slot:trigger>
        <x-keys::button>Top Dropdown</x-keys::button>
    </x-slot:trigger>
    <div>Content appears above</div>
</x-keys::dropdown>

{{-- Left position --}}
<x-keys::dropdown position="left">
    <x-slot:trigger>
        <x-keys::button>Left Dropdown</x-keys::button>
    </x-slot:trigger>
    <div>Content appears to the left</div>
</x-keys::dropdown>

{{-- Right position --}}
<x-keys::dropdown position="right">
    <x-slot:trigger>
        <x-keys::button>Right Dropdown</x-keys::button>
    </x-slot:trigger>
    <div>Content appears to the right</div>
</x-keys::dropdown>
```

## Alignment Options

```blade
{{-- Start alignment (default) --}}
<x-keys::dropdown align="start">
    <x-slot:trigger>
        <x-keys::button>Start Aligned</x-keys::button>
    </x-slot:trigger>
    <div>Aligned to start edge</div>
</x-keys::dropdown>

{{-- Center alignment --}}
<x-keys::dropdown align="center">
    <x-slot:trigger>
        <x-keys::button>Center Aligned</x-keys::button>
    </x-slot:trigger>
    <div>Centered alignment</div>
</x-keys::dropdown>

{{-- End alignment --}}
<x-keys::dropdown align="end">
    <x-slot:trigger>
        <x-keys::button>End Aligned</x-keys::button>
    </x-slot:trigger>
    <div>Aligned to end edge</div>
</x-keys::dropdown>
```

## Size Variants

```blade
{{-- Small dropdown --}}
<x-keys::dropdown size="sm">
    <x-slot:trigger>
        <x-keys::button size="sm">Small</x-keys::button>
    </x-slot:trigger>
    <div class="space-y-1">
        <a href="#" class="block px-2 py-1 text-xs rounded hover:bg-neutral-100">Item 1</a>
        <a href="#" class="block px-2 py-1 text-xs rounded hover:bg-neutral-100">Item 2</a>
    </div>
</x-keys::dropdown>

{{-- Large dropdown --}}
<x-keys::dropdown size="lg">
    <x-slot:trigger>
        <x-keys::button size="lg">Large</x-keys::button>
    </x-slot:trigger>
    <div class="space-y-2">
        <a href="#" class="block px-4 py-3 rounded hover:bg-neutral-100">Large Item 1</a>
        <a href="#" class="block px-4 py-3 rounded hover:bg-neutral-100">Large Item 2</a>
    </div>
</x-keys::dropdown>
```

## Use Cases

### User Menu
```blade
<x-keys::dropdown align="end">
    <x-slot:trigger>
        <div class="flex items-center gap-2 cursor-pointer">
            <x-keys::avatar
                src="{{ auth()->user()->avatar }}"
                name="{{ auth()->user()->name }}"
                size="sm"
            />
            <span class="hidden md:block">{{ auth()->user()->name }}</span>
            <x-keys::icon name="heroicon-o-chevron-down" size="xs" />
        </div>
    </x-slot:trigger>

    <div class="space-y-1">
        <div class="px-3 py-2 border-b border-neutral-200">
            <div class="font-medium">{{ auth()->user()->name }}</div>
            <div class="text-sm text-neutral-600">{{ auth()->user()->email }}</div>
        </div>

        <a href="{{ route('profile') }}" class="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-neutral-100">
            <x-keys::icon name="heroicon-o-user" size="xs" />
            Profile
        </a>

        <a href="{{ route('settings') }}" class="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-neutral-100">
            <x-keys::icon name="heroicon-o-cog-6-tooth" size="xs" />
            Settings
        </a>

        <div class="border-t border-neutral-200 pt-1">
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-neutral-100 w-full text-left">
                    <x-keys::icon name="heroicon-o-arrow-right-on-rectangle" size="xs" />
                    Logout
                </button>
            </form>
        </div>
    </div>
</x-keys::dropdown>
```

### Action Menu
```blade
<x-keys::dropdown>
    <x-slot:trigger>
        <x-keys::button variant="ghost" size="sm">
            <x-keys::icon name="heroicon-o-ellipsis-horizontal" />
        </x-keys::button>
    </x-slot:trigger>

    <div class="space-y-1">
        <button class="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-neutral-100 w-full text-left">
            <x-keys::icon name="heroicon-o-pencil" size="xs" />
            Edit
        </button>

        <button class="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-neutral-100 w-full text-left">
            <x-keys::icon name="heroicon-o-document-duplicate" size="xs" />
            Duplicate
        </button>

        <button class="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-neutral-100 w-full text-left">
            <x-keys::icon name="heroicon-o-share" size="xs" />
            Share
        </button>

        <div class="border-t border-neutral-200 pt-1">
            <button class="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-red-100 text-red-700 w-full text-left">
                <x-keys::icon name="heroicon-o-trash" size="xs" />
                Delete
            </button>
        </div>
    </div>
</x-keys::dropdown>
```

### Navigation Dropdown
```blade
<nav class="flex items-center gap-6">
    <a href="/" class="font-medium">Home</a>

    <x-keys::dropdown>
        <x-slot:trigger>
            <div class="flex items-center gap-1 cursor-pointer">
                <span class="font-medium">Products</span>
                <x-keys::icon name="heroicon-o-chevron-down" size="xs" />
            </div>
        </x-slot:trigger>

        <div class="space-y-1">
            <a href="/products/software" class="block px-3 py-2 rounded text-sm hover:bg-neutral-100">
                Software Solutions
            </a>
            <a href="/products/hardware" class="block px-3 py-2 rounded text-sm hover:bg-neutral-100">
                Hardware
            </a>
            <a href="/products/consulting" class="block px-3 py-2 rounded text-sm hover:bg-neutral-100">
                Consulting Services
            </a>
        </div>
    </x-keys::dropdown>

    <a href="/about" class="font-medium">About</a>
    <a href="/contact" class="font-medium">Contact</a>
</nav>
```

### Filter Dropdown
```blade
<x-keys::dropdown>
    <x-slot:trigger>
        <x-keys::button variant="ghost">
            <x-keys::icon name="heroicon-o-funnel" size="sm" class="mr-2" />
            Filters
            <x-keys::icon name="heroicon-o-chevron-down" size="sm" class="ml-2" />
        </x-keys::button>
    </x-slot:trigger>

    <div class="space-y-4 p-4 min-w-64">
        <div>
            <x-keys::label for="status-filter">Status</x-keys::label>
            <x-keys::select name="status" id="status-filter" size="sm">
                <x-keys::select.option value="" label="All Statuses" />
                <x-keys::select.option value="active" label="Active" />
                <x-keys::select.option value="inactive" label="Inactive" />
            </x-keys::select>
        </div>

        <div>
            <x-keys::label for="date-filter">Date Range</x-keys::label>
            <x-keys::date-picker name="date_range" id="date-filter" is-range size="sm" />
        </div>

        <div class="flex justify-between pt-2 border-t">
            <x-keys::button variant="ghost" size="sm">Clear</x-keys::button>
            <x-keys::button variant="brand" size="sm">Apply</x-keys::button>
        </div>
    </div>
</x-keys::dropdown>
```

### Notification Dropdown
```blade
<x-keys::dropdown align="end" size="lg">
    <x-slot:trigger>
        <div class="relative cursor-pointer">
            <x-keys::icon name="heroicon-o-bell" size="md" />
            @if($unreadNotifications > 0)
                <x-keys::badge
                    color="danger"
                    size="xs"
                    class="absolute -top-1 -right-1"
                >{{ $unreadNotifications }}</x-keys::badge>
            @endif
        </div>
    </x-slot:trigger>

    <div class="w-80">
        <div class="flex items-center justify-between p-3 border-b">
            <h3 class="font-semibold">Notifications</h3>
            <x-keys::button variant="link" size="sm">Mark all read</x-keys::button>
        </div>

        <div class="max-h-64 overflow-y-auto">
            @forelse($notifications as $notification)
                <div class="flex gap-3 p-3 hover:bg-neutral-50 {{ $notification->read_at ? '' : 'bg-blue-50' }}">
                    <x-keys::avatar
                        name="{{ $notification->data['user_name'] ?? 'System' }}"
                        size="xs"
                    />
                    <div class="flex-1 min-w-0">
                        <p class="text-sm">{{ $notification->data['message'] }}</p>
                        <p class="text-xs text-neutral-500 mt-1">
                            {{ $notification->created_at->diffForHumans() }}
                        </p>
                    </div>
                </div>
            @empty
                <div class="p-6 text-center text-neutral-500">
                    <x-keys::icon name="heroicon-o-bell-slash" size="lg" class="mx-auto mb-2" />
                    <p>No notifications</p>
                </div>
            @endforelse
        </div>

        @if($notifications->count() > 0)
            <div class="p-3 border-t">
                <x-keys::button variant="link" size="sm" class="w-full">
                    View all notifications
                </x-keys::button>
            </div>
        @endif
    </div>
</x-keys::dropdown>
```

### Language Selector
```blade
<x-keys::dropdown>
    <x-slot:trigger>
        <div class="flex items-center gap-2 cursor-pointer">
            <img src="/flags/{{ app()->getLocale() }}.svg" alt="" class="w-4 h-4">
            <span class="text-sm">{{ strtoupper(app()->getLocale()) }}</span>
            <x-keys::icon name="heroicon-o-chevron-down" size="xs" />
        </div>
    </x-slot:trigger>

    <div class="space-y-1">
        @foreach($availableLocales as $locale => $name)
            <a
                href="{{ route('locale.switch', $locale) }}"
                class="flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-neutral-100 {{ app()->getLocale() === $locale ? 'bg-neutral-100' : '' }}"
            >
                <img src="/flags/{{ $locale }}.svg" alt="" class="w-4 h-4">
                {{ $name }}
            </a>
        @endforeach
    </div>
</x-keys::dropdown>
```

## Modal Behavior

```blade
{{-- Modal dropdown (closes on outside click) --}}
<x-keys::dropdown modal>
    <x-slot:trigger>
        <x-keys::button>Modal Dropdown</x-keys::button>
    </x-slot:trigger>
    <div>Clicks outside will close this dropdown</div>
</x-keys::dropdown>
```

## Disabled State

```blade
<x-keys::dropdown disabled>
    <x-slot:trigger>
        <x-keys::button disabled>Disabled Dropdown</x-keys::button>
    </x-slot:trigger>
    <div>This content won't be accessible</div>
</x-keys::dropdown>
```

## Custom Offset

```blade
{{-- Larger offset from trigger --}}
<x-keys::dropdown :offset="16">
    <x-slot:trigger>
        <x-keys::button>Spaced Dropdown</x-keys::button>
    </x-slot:trigger>
    <div>More space from trigger</div>
</x-keys::dropdown>
```

## JavaScript Integration

```javascript
// Programmatically open/close dropdowns
function openDropdown(dropdownId) {
    const dropdown = document.querySelector(`[data-dropdown-id="${dropdownId}"]`);
    if (dropdown) {
        dropdown.dispatchEvent(new CustomEvent('dropdown:open'));
    }
}

function closeDropdown(dropdownId) {
    const dropdown = document.querySelector(`[data-dropdown-id="${dropdownId}"]`);
    if (dropdown) {
        dropdown.dispatchEvent(new CustomEvent('dropdown:close'));
    }
}

// Listen for dropdown events
document.addEventListener('dropdown:opened', function(event) {
    console.log('Dropdown opened:', event.detail.id);
});

document.addEventListener('dropdown:closed', function(event) {
    console.log('Dropdown closed:', event.detail.id);
});
```

## Accessibility

- Proper ARIA attributes for menu behavior
- Keyboard navigation support (arrow keys, Enter, Escape)
- Focus management for dropdown items
- Screen reader compatibility
- Proper role assignments

## Data Attributes

```html
<div
    data-dropdown="true"
    data-dropdown-id="dropdown-unique-id"
    data-position="bottom"
    data-align="start"
    data-offset="8"
    data-disabled="false"
    data-modal="false"
>
```

## CSS Customization

```css
/* Custom dropdown panel styling */
[data-dropdown] .dropdown-panel {
    backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.95);
}

/* Custom animation */
[data-dropdown] .dropdown-panel {
    opacity: 0;
    transform: scale(0.95) translateY(-0.5rem);
    transition: all 0.2s ease;
}

[data-dropdown].open .dropdown-panel {
    opacity: 1;
    transform: scale(1) translateY(0);
}

/* Custom item hover effects */
[data-dropdown] .dropdown-item:hover {
    background: linear-gradient(135deg, var(--color-brand-50), var(--color-brand-100));
    transform: translateX(2px);
}
```

## Best Practices

1. **Use semantic HTML** - Proper button/link elements for triggers
2. **Handle keyboard navigation** - Support arrow keys and Enter/Escape
3. **Provide clear visual cues** - Show when dropdown is open/closed
4. **Consider mobile** - Ensure touch-friendly interactions
5. **Manage focus** - Return focus to trigger when closed
6. **Test accessibility** - Verify screen reader compatibility
7. **Avoid deep nesting** - Keep dropdown content simple and scannable