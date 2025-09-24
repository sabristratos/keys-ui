# Avatar Component

User profile display functionality with image support, initials fallback, status indicators, and comprehensive customization options.

## Basic Usage

```blade
{{-- Avatar with image --}}
<x-keys::avatar
    src="https://example.com/avatar.jpg"
    name="John Doe"
    alt="John Doe's profile picture"
/>

{{-- Initials avatar --}}
<x-keys::avatar name="Jane Smith" />

{{-- Fallback icon avatar --}}
<x-keys::avatar />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | `null` | Image URL for avatar |
| `alt` | string | auto | Alt text (auto-generated from name if not provided) |
| `name` | string | `null` | User name for initials fallback and accessibility |
| `size` | string | `md` | Size: `xs`, `sm`, `md`, `lg`, `xl` |
| `shape` | string | `circle` | Shape: `circle`, `square` |
| `status` | string | `null` | Status: `online`, `offline`, `away`, `busy` |
| `color` | string | `brand` | Color variant for background/borders |
| `border` | boolean | `false` | Enable border styling |
| `lazy` | boolean | `true` | Lazy loading for images |

## Size Variants

```blade
<x-keys::avatar size="xs" name="Extra Small" />
<x-keys::avatar size="sm" name="Small User" />
<x-keys::avatar size="md" name="Medium User" />
<x-keys::avatar size="lg" name="Large User" />
<x-keys::avatar size="xl" name="Extra Large" />
```

## Shape Options

```blade
{{-- Circle avatars (default) --}}
<x-keys::avatar name="Circle User" shape="circle" />

{{-- Square avatars --}}
<x-keys::avatar name="Square User" shape="square" />
```

## Image Avatars

```blade
{{-- Basic image avatar --}}
<x-keys::avatar
    src="/images/user-avatar.jpg"
    name="John Doe"
    alt="John's profile picture"
/>

{{-- Image with status --}}
<x-keys::avatar
    src="/images/user-avatar.jpg"
    name="Jane Smith"
    status="online"
/>

{{-- Image with border --}}
<x-keys::avatar
    src="/images/user-avatar.jpg"
    name="Bob Wilson"
    border
    color="brand"
/>
```

## Initials Fallback

When no image is provided, the component automatically generates initials from the name:

```blade
{{-- Single name --}}
<x-keys::avatar name="John" />  {{-- Shows: J --}}

{{-- Full name --}}
<x-keys::avatar name="John Doe" />  {{-- Shows: JD --}}

{{-- Multiple names --}}
<x-keys::avatar name="John Michael Doe" />  {{-- Shows: JD --}}

{{-- Long names --}}
<x-keys::avatar name="Alexander" />  {{-- Shows: AL --}}
```

## Status Indicators

```blade
{{-- Online status --}}
<x-keys::avatar name="John Doe" status="online" />

{{-- Offline status --}}
<x-keys::avatar name="Jane Smith" status="offline" />

{{-- Away status --}}
<x-keys::avatar name="Bob Wilson" status="away" />

{{-- Busy status --}}
<x-keys::avatar name="Alice Johnson" status="busy" />
```

## Color Variants

```blade
{{-- Semantic colors --}}
<x-keys::avatar name="Brand User" color="brand" />
<x-keys::avatar name="Success User" color="success" />
<x-keys::avatar name="Warning User" color="warning" />
<x-keys::avatar name="Danger User" color="danger" />
<x-keys::avatar name="Neutral User" color="neutral" />

{{-- Specific colors --}}
<x-keys::avatar name="Blue User" color="blue" />
<x-keys::avatar name="Green User" color="green" />
<x-keys::avatar name="Purple User" color="purple" />
<x-keys::avatar name="Pink User" color="pink" />
```

## Border Options

```blade
{{-- With border --}}
<x-keys::avatar name="Bordered User" border />

{{-- Colored border --}}
<x-keys::avatar name="Brand Border" border color="brand" />

{{-- Border with status --}}
<x-keys::avatar name="Online User" border status="online" />
```

## Use Cases

### User Profile Display
```blade
<div class="flex items-center gap-3">
    <x-keys::avatar
        src="{{ $user->avatar_url }}"
        name="{{ $user->name }}"
        status="{{ $user->status }}"
        size="lg"
    />
    <div>
        <h3 class="font-semibold">{{ $user->name }}</h3>
        <p class="text-sm text-neutral-500">{{ $user->title }}</p>
    </div>
</div>
```

### Comment System
```blade
<div class="flex gap-3">
    <x-keys::avatar
        src="{{ $comment->author->avatar }}"
        name="{{ $comment->author->name }}"
        size="sm"
    />
    <div class="flex-1">
        <div class="flex items-center gap-2">
            <span class="font-medium">{{ $comment->author->name }}</span>
            <span class="text-sm text-neutral-500">{{ $comment->created_at->diffForHumans() }}</span>
        </div>
        <p class="mt-1">{{ $comment->content }}</p>
    </div>
</div>
```

### Team Member List
```blade
<div class="space-y-4">
    @foreach($team as $member)
        <div class="flex items-center justify-between p-4 border rounded-lg">
            <div class="flex items-center gap-3">
                <x-keys::avatar
                    src="{{ $member->avatar }}"
                    name="{{ $member->name }}"
                    status="{{ $member->status }}"
                />
                <div>
                    <h4 class="font-medium">{{ $member->name }}</h4>
                    <p class="text-sm text-neutral-500">{{ $member->role }}</p>
                </div>
            </div>

            <x-keys::badge color="brand">{{ $member->department }}</x-keys::badge>
        </div>
    @endforeach
</div>
```

### Navigation Menu
```blade
<div class="flex items-center gap-2">
    <x-keys::avatar
        src="{{ auth()->user()->avatar }}"
        name="{{ auth()->user()->name }}"
        size="sm"
        border
    />
    <span class="hidden md:block">{{ auth()->user()->name }}</span>
</div>
```

### Chat Interface
```blade
<div class="space-y-4">
    @foreach($messages as $message)
        <div class="flex gap-3 {{ $message->is_own ? 'flex-row-reverse' : '' }}">
            <x-keys::avatar
                src="{{ $message->user->avatar }}"
                name="{{ $message->user->name }}"
                size="xs"
                status="{{ $message->user->status }}"
            />
            <div class="max-w-xs lg:max-w-md">
                <div class="bg-neutral-100 rounded-lg p-3">
                    {{ $message->content }}
                </div>
                <p class="text-xs text-neutral-500 mt-1">
                    {{ $message->created_at->format('H:i') }}
                </p>
            </div>
        </div>
    @endforeach
</div>
```

### User Selection
```blade
<div class="space-y-2">
    @foreach($users as $user)
        <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-neutral-50">
            <input type="checkbox" name="selected_users[]" value="{{ $user->id }}" class="sr-only">
            <x-keys::avatar
                src="{{ $user->avatar }}"
                name="{{ $user->name }}"
                size="sm"
            />
            <div class="flex-1">
                <div class="font-medium">{{ $user->name }}</div>
                <div class="text-sm text-neutral-500">{{ $user->email }}</div>
            </div>
        </label>
    @endforeach
</div>
```

## Avatar Stack Integration

The Avatar component works seamlessly with the Avatar Stack component:

```blade
<x-keys::avatar.stack size="md" spacing="tight">
    <x-keys::avatar name="John Doe" color="brand" />
    <x-keys::avatar name="Jane Smith" color="success" />
    <x-keys::avatar name="Bob Wilson" color="warning" />
    <x-keys::avatar name="Alice Johnson" color="purple" />
</x-keys::avatar.stack>
```

## Form Integration

### User Assignment
```blade
<div>
    <label class="block text-sm font-medium mb-2">Assign to:</label>
    <div class="space-y-2">
        @foreach($team as $member)
            <x-keys::radio
                variant="bordered"
                name="assignee"
                :value="$member->id"
            >
                <div class="flex items-center gap-3">
                    <x-keys::avatar
                        src="{{ $member->avatar }}"
                        name="{{ $member->name }}"
                        size="sm"
                        status="{{ $member->status }}"
                    />
                    <div>
                        <div class="font-medium">{{ $member->name }}</div>
                        <div class="text-sm text-neutral-500">{{ $member->role }}</div>
                    </div>
                </div>
            </x-keys::radio>
        @endforeach
    </div>
</div>
```

## Accessibility

- Proper alt text generation from name
- ARIA labels for status indicators
- Screen reader friendly fallback content
- High contrast mode support
- Focus management for interactive avatars

## Data Attributes

```html
<div
    data-keys-avatar="true"
    data-size="md"
    data-shape="circle"
    data-has-image="true"
    data-status="online"
    data-color="brand"
>
```

## JavaScript Integration

```javascript
// Target avatars by size
document.querySelectorAll('[data-keys-avatar][data-size="lg"]')

// Handle image load errors
avatar.querySelector('img')?.addEventListener('error', function() {
    // Show initials fallback
    this.style.display = 'none';
    this.nextElementSibling.style.display = 'flex';
});

// Update status programmatically
function updateUserStatus(userId, status) {
    const avatar = document.querySelector(`[data-user-id="${userId}"]`);
    if (avatar) {
        avatar.setAttribute('data-status', status);
        // Update status indicator
    }
}
```

## CSS Customization

```css
/* Custom avatar hover effects */
[data-keys-avatar]:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
}

/* Custom status indicator styles */
[data-keys-avatar][data-status="online"]::after {
    background: #10b981;
    box-shadow: 0 0 0 2px white;
}

/* Custom border colors */
[data-keys-avatar][data-border="true"][data-color="brand"] {
    border: 2px solid var(--color-brand);
}

/* Custom size variants */
[data-keys-avatar][data-size="custom"] {
    width: 4rem;
    height: 4rem;
}
```

## Performance Considerations

- Lazy loading enabled by default for images
- Efficient initials generation with smart fallbacks
- Optimized rendering for large lists
- Memory-efficient event handling