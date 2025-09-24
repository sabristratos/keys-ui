# Loading Component

Visual loading indicators with multiple animation styles and size variants for improved user experience.

## Basic Usage

```blade
{{-- Simple spinner --}}
<x-keys::loading />

{{-- Different animation styles --}}
<x-keys::loading animation="dots" />
<x-keys::loading animation="bars" />
<x-keys::loading animation="pulse" />

{{-- Custom size --}}
<x-keys::loading size="lg" animation="spinner" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animation` | string | `spinner` | Animation type: `spinner`, `dots`, `bars`, `pulse`, `wave`, `bounce` |
| `size` | string | `md` | Size variant: `xs`, `sm`, `md`, `lg`, `xl` |

## Animation Variants

### Spinner (Default)
```blade
{{-- Classic rotating spinner --}}
<x-keys::loading animation="spinner" />
<x-keys::loading animation="spinner" size="lg" />
```

### Dots
```blade
{{-- Three bouncing dots --}}
<x-keys::loading animation="dots" />
<x-keys::loading animation="dots" size="sm" />
```

### Bars
```blade
{{-- Animated bars of varying heights --}}
<x-keys::loading animation="bars" />
<x-keys::loading animation="bars" size="lg" />
```

### Pulse
```blade
{{-- Pulsing circle effect --}}
<x-keys::loading animation="pulse" />
<x-keys::loading animation="pulse" size="xl" />
```

### Wave
```blade
{{-- Wave-like bar animation --}}
<x-keys::loading animation="wave" />
<x-keys::loading animation="wave" size="md" />
```

### Bounce
```blade
{{-- Bouncing dots in sequence --}}
<x-keys::loading animation="bounce" />
<x-keys::loading animation="bounce" size="sm" />
```

## Size Variants

```blade
<div class="flex items-center gap-4">
    <x-keys::loading size="xs" />
    <x-keys::loading size="sm" />
    <x-keys::loading size="md" />
    <x-keys::loading size="lg" />
    <x-keys::loading size="xl" />
</div>
```

## Use Cases

### Button Loading States
```blade
{{-- Button with loading spinner --}}
<x-keys::button disabled>
    <x-keys::loading size="sm" class="mr-2" />
    Saving...
</x-keys::button>

{{-- Submit button with dots animation --}}
<x-keys::button variant="brand" disabled>
    <x-keys::loading animation="dots" size="sm" class="mr-2" />
    Processing
</x-keys::button>
```

### Card Loading States
```blade
<x-keys::card variant="padded">
    <div class="flex items-center justify-center py-8">
        <div class="text-center">
            <x-keys::loading animation="spinner" size="lg" class="mx-auto mb-4 text-brand" />
            <p class="text-neutral-600">Loading content...</p>
        </div>
    </div>
</x-keys::card>
```

### Form Loading
```blade
<form wire:submit.prevent="save">
    <div class="space-y-4">
        <x-keys::input
            name="title"
            label="Title"
            wire:model="title"
            :disabled="$saving"
        />

        <x-keys::textarea
            name="content"
            label="Content"
            wire:model="content"
            :disabled="$saving"
        />

        <x-keys::button type="submit" variant="brand" :disabled="$saving">
            @if($saving)
                <x-keys::loading size="sm" class="mr-2" />
                Saving...
            @else
                Save Post
            @endif
        </x-keys::button>
    </div>
</form>
```

### Table Loading
```blade
<x-keys::card>
    @if($loading)
        <div class="flex items-center justify-center py-12">
            <div class="text-center">
                <x-keys::loading animation="bars" size="lg" class="mx-auto mb-4 text-brand" />
                <p class="text-neutral-600">Loading data...</p>
            </div>
        </div>
    @else
        <x-keys::table>
            {{-- Table content --}}
        </x-keys::table>
    @endif
</x-keys::card>
```

### Inline Loading
```blade
<div class="flex items-center gap-2">
    <span>Fetching latest data</span>
    <x-keys::loading animation="dots" size="xs" />
</div>

<div class="flex items-center gap-3">
    <x-keys::avatar name="John Doe" />
    <div>
        <div class="font-medium">John Doe</div>
        <div class="flex items-center gap-2 text-sm text-neutral-600">
            <span>Updating status</span>
            <x-keys::loading animation="pulse" size="xs" />
        </div>
    </div>
</div>
```

### Page Loading Overlay
```blade
@if($pageLoading)
    <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 shadow-lg">
            <div class="flex items-center gap-3">
                <x-keys::loading animation="spinner" size="md" class="text-brand" />
                <span class="font-medium">Loading page...</span>
            </div>
        </div>
    </div>
@endif
```

### Livewire Integration
```blade
{{-- Loading specific actions --}}
<div wire:loading.flex wire:target="save" class="items-center gap-2 text-brand">
    <x-keys::loading animation="spinner" size="sm" />
    <span>Saving changes...</span>
</div>

<div wire:loading.flex wire:target="delete" class="items-center gap-2 text-danger">
    <x-keys::loading animation="dots" size="sm" />
    <span>Deleting item...</span>
</div>

{{-- General loading state --}}
<div wire:loading class="flex items-center gap-2 text-neutral-600">
    <x-keys::loading animation="pulse" size="sm" />
    <span>Processing...</span>
</div>
```

### Search Loading
```blade
<div class="relative">
    <x-keys::input
        name="search"
        placeholder="Search..."
        wire:model.live.debounce.300ms="search"
    />

    @if($searching)
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <x-keys::loading animation="spinner" size="xs" class="text-neutral-400" />
        </div>
    @endif
</div>
```

### Data Fetching States
```blade
<div class="space-y-4">
    @forelse($items as $item)
        <x-keys::card variant="hover">
            {{-- Item content --}}
        </x-keys::card>
    @empty
        @if($loading)
            <div class="text-center py-8">
                <x-keys::loading animation="wave" size="lg" class="mx-auto mb-4 text-brand" />
                <p class="text-neutral-600">Loading items...</p>
            </div>
        @else
            <div class="text-center py-8 text-neutral-600">
                <p>No items found.</p>
            </div>
        @endif
    @endforelse
</div>
```

## Color Customization

The loading component inherits the current text color:

```blade
{{-- Brand colored loading --}}
<x-keys::loading class="text-brand" />

{{-- Success colored loading --}}
<x-keys::loading animation="pulse" class="text-success" />

{{-- Custom color --}}
<x-keys::loading animation="dots" class="text-purple-500" />

{{-- Muted loading --}}
<x-keys::loading animation="bars" class="text-neutral-400" />
```

## Accessibility

- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **ARIA Labels**: Consider adding `aria-label` for screen readers
- **Focus Management**: Loading states should not interfere with keyboard navigation
- **Color Independence**: Animations work without relying solely on color

```blade
{{-- Accessible loading with label --}}
<div role="status" aria-label="Loading content">
    <x-keys::loading animation="spinner" />
    <span class="sr-only">Loading...</span>
</div>
```

## Animation Performance

All animations use CSS transforms and opacity for optimal performance:

- **GPU Accelerated**: Uses `transform` and `opacity` properties
- **Smooth Animations**: 60fps performance on modern browsers
- **Low CPU Usage**: Efficient animation loops
- **Battery Friendly**: Minimal impact on mobile device battery

## CSS Customization

```css
/* Custom animation timing */
.custom-loading .animate-spin {
    animation-duration: 0.8s;
}

/* Custom colors for specific animations */
.loading-brand {
    color: var(--color-brand);
}

/* Reduced motion variant */
@media (prefers-reduced-motion: reduce) {
    .animate-spin,
    .animate-bounce,
    .animate-pulse,
    .animate-ping {
        animation: none;
    }

    /* Provide a subtle pulse instead */
    .loading-reduced-motion {
        animation: pulse 2s infinite;
    }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}
```

## Best Practices

1. **Choose appropriate animation** - Match animation style to context
2. **Use consistent sizes** - Maintain size consistency throughout your app
3. **Provide context** - Include descriptive text when possible
4. **Consider performance** - Don't overuse animated elements
5. **Respect accessibility** - Honor reduced motion preferences
6. **Timeout handling** - Provide fallback for long-running operations
7. **Color contrast** - Ensure loading indicators are visible