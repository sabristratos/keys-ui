# Card Component

Content containers with selection support, customizable styling, and enhanced user interaction patterns.

## Basic Usage

```blade
{{-- Simple card --}}
<x-keys::card>
    <h3 class="font-semibold mb-2">Card Title</h3>
    <p class="text-neutral-600">Card content goes here.</p>
</x-keys::card>

{{-- Card with padding variant --}}
<x-keys::card variant="padded">
    <h3 class="font-semibold mb-2">Padded Card</h3>
    <p class="text-neutral-600">This card has built-in padding.</p>
</x-keys::card>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `default` | Variant: `default`, `padded`, `bordered`, `elevated` |
| `selectable` | boolean | `false` | Enable card selection functionality |
| `selected` | boolean | `false` | Pre-selected state |
| `disabled` | boolean | `false` | Disable card interactions |
| `href` | string | `null` | Make card a link |
| `target` | string | `null` | Link target attribute |
| `onclick` | string | `null` | JavaScript click handler |

## Variants

### Default Card
```blade
<x-keys::card>
    <div class="p-4">
        <h3 class="font-semibold">Default Card</h3>
        <p class="text-sm text-neutral-600 mt-1">Basic card without built-in padding.</p>
    </div>
</x-keys::card>
```

### Padded Card
```blade
<x-keys::card variant="padded">
    <h3 class="font-semibold">Padded Card</h3>
    <p class="text-sm text-neutral-600 mt-1">This card includes built-in padding.</p>
</x-keys::card>
```

### Bordered Card
```blade
<x-keys::card variant="bordered">
    <div class="p-4">
        <h3 class="font-semibold">Bordered Card</h3>
        <p class="text-sm text-neutral-600 mt-1">Card with visible borders.</p>
    </div>
</x-keys::card>
```

### Elevated Card
```blade
<x-keys::card variant="elevated">
    <div class="p-4">
        <h3 class="font-semibold">Elevated Card</h3>
        <p class="text-sm text-neutral-600 mt-1">Card with shadow elevation.</p>
    </div>
</x-keys::card>
```

## Selectable Cards

Cards can be made selectable for choice interfaces:

```blade
{{-- Selectable card group --}}
<div class="space-y-3">
    <x-keys::card selectable name="plan" value="basic">
        <div class="p-4">
            <h3 class="font-semibold">Basic Plan</h3>
            <p class="text-2xl font-bold mt-2">$9<span class="text-sm">/mo</span></p>
            <ul class="mt-3 space-y-1 text-sm">
                <li>✓ 5 Projects</li>
                <li>✓ 10GB Storage</li>
                <li>✓ Email Support</li>
            </ul>
        </div>
    </x-keys::card>

    <x-keys::card selectable name="plan" value="pro" selected>
        <div class="p-4">
            <h3 class="font-semibold">Pro Plan</h3>
            <p class="text-2xl font-bold mt-2">$29<span class="text-sm">/mo</span></p>
            <ul class="mt-3 space-y-1 text-sm">
                <li>✓ 50 Projects</li>
                <li>✓ 100GB Storage</li>
                <li>✓ Priority Support</li>
            </ul>
        </div>
    </x-keys::card>
</div>
```

## Interactive Cards

### Link Cards
```blade
<x-keys::card href="/products/1" variant="elevated">
    <div class="p-4">
        <h3 class="font-semibold">Product Name</h3>
        <p class="text-sm text-neutral-600 mt-1">Product description...</p>
        <div class="mt-3 flex items-center justify-between">
            <span class="text-lg font-bold">$99</span>
            <x-keys::badge color="success">In Stock</x-keys::badge>
        </div>
    </div>
</x-keys::card>
```

### Clickable Cards
```blade
<x-keys::card onclick="openModal('product-details')" variant="bordered">
    <div class="p-4">
        <div class="flex items-center justify-between">
            <h3 class="font-semibold">Quick Action Card</h3>
            <x-keys::icon name="heroicon-o-arrow-right" class="w-4 h-4 text-neutral-400" />
        </div>
        <p class="text-sm text-neutral-600 mt-1">Click to open details</p>
    </div>
</x-keys::card>
```

## Use Cases

### Product Cards
```blade
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    @foreach($products as $product)
        <x-keys::card href="{{ route('products.show', $product) }}" variant="elevated">
            <div class="aspect-square bg-neutral-100 rounded-t-lg"></div>
            <div class="p-4">
                <h3 class="font-semibold">{{ $product->name }}</h3>
                <p class="text-sm text-neutral-600 mt-1">{{ $product->description }}</p>
                <div class="mt-4 flex items-center justify-between">
                    <span class="text-lg font-bold">${{ $product->price }}</span>
                    <x-keys::badge color="{{ $product->in_stock ? 'success' : 'warning' }}">
                        {{ $product->in_stock ? 'In Stock' : 'Low Stock' }}
                    </x-keys::badge>
                </div>
            </div>
        </x-keys::card>
    @endforeach
</div>
```

### Feature Selection
```blade
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <x-keys::card selectable name="features[]" value="analytics" variant="bordered">
        <div class="p-6">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <x-keys::icon name="heroicon-o-chart-bar" class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="font-semibold">Analytics Dashboard</h3>
            <p class="text-sm text-neutral-600 mt-2">
                Track user behavior and get insights into your application usage.
            </p>
        </div>
    </x-keys::card>

    <x-keys::card selectable name="features[]" value="notifications" variant="bordered">
        <div class="p-6">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <x-keys::icon name="heroicon-o-bell" class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="font-semibold">Push Notifications</h3>
            <p class="text-sm text-neutral-600 mt-2">
                Send real-time notifications to keep users engaged.
            </p>
        </div>
    </x-keys::card>
</div>
```

### Dashboard Cards
```blade
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <x-keys::card variant="padded">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-neutral-600">Total Users</p>
                <p class="text-2xl font-bold mt-1">1,247</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <x-keys::icon name="heroicon-o-users" class="w-6 h-6 text-blue-600" />
            </div>
        </div>
        <div class="mt-4 flex items-center">
            <x-keys::badge color="success" size="xs">+12%</x-keys::badge>
            <span class="text-xs text-neutral-600 ml-2">vs last month</span>
        </div>
    </x-keys::card>

    <x-keys::card variant="padded">
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm text-neutral-600">Revenue</p>
                <p class="text-2xl font-bold mt-1">$24,789</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <x-keys::icon name="heroicon-o-currency-dollar" class="w-6 h-6 text-green-600" />
            </div>
        </div>
        <div class="mt-4 flex items-center">
            <x-keys::badge color="success" size="xs">+8%</x-keys::badge>
            <span class="text-xs text-neutral-600 ml-2">vs last month</span>
        </div>
    </x-keys::card>
</div>
```

### Content Cards
```blade
<div class="space-y-6">
    @foreach($articles as $article)
        <x-keys::card href="{{ route('articles.show', $article) }}" variant="bordered">
            <div class="p-6">
                <div class="flex items-start gap-4">
                    <div class="w-20 h-20 bg-neutral-100 rounded-lg flex-shrink-0"></div>
                    <div class="flex-1">
                        <h3 class="font-semibold">{{ $article->title }}</h3>
                        <p class="text-sm text-neutral-600 mt-2">{{ $article->excerpt }}</p>
                        <div class="mt-4 flex items-center gap-4">
                            <div class="flex items-center gap-2">
                                <x-keys::avatar
                                    src="{{ $article->author->avatar }}"
                                    name="{{ $article->author->name }}"
                                    size="xs"
                                />
                                <span class="text-xs text-neutral-600">{{ $article->author->name }}</span>
                            </div>
                            <span class="text-xs text-neutral-600">{{ $article->created_at->diffForHumans() }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </x-keys::card>
    @endforeach
</div>
```

### Settings Cards
```blade
<div class="space-y-4">
    <x-keys::card variant="bordered">
        <div class="p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-semibold">Two-Factor Authentication</h3>
                    <p class="text-sm text-neutral-600 mt-1">
                        Add an extra layer of security to your account
                    </p>
                </div>
                <x-keys::toggle checked />
            </div>
        </div>
    </x-keys::card>

    <x-keys::card variant="bordered">
        <div class="p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-semibold">Email Notifications</h3>
                    <p class="text-sm text-neutral-600 mt-1">
                        Receive updates about your account activity
                    </p>
                </div>
                <x-keys::toggle />
            </div>
        </div>
    </x-keys::card>
</div>
```

## Form Integration

### Card Selection Form
```blade
<form method="POST">
    @csrf

    <fieldset>
        <legend class="text-lg font-semibold mb-4">Choose Your Plan</legend>
        <div class="space-y-3">
            @foreach($plans as $plan)
                <x-keys::card
                    selectable
                    name="plan_id"
                    :value="$plan->id"
                    :selected="old('plan_id') == $plan->id"
                >
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-semibold">{{ $plan->name }}</h3>
                                <p class="text-sm text-neutral-600">{{ $plan->description }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-lg font-bold">${{ $plan->price }}</p>
                                <p class="text-xs text-neutral-600">per month</p>
                            </div>
                        </div>
                    </div>
                </x-keys::card>
            @endforeach
        </div>
    </fieldset>

    <x-keys::button type="submit" variant="brand" class="mt-6">
        Subscribe Now
    </x-keys::button>
</form>
```

### Livewire Integration
```blade
<div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @foreach($options as $option)
            <x-keys::card
                selectable
                :selected="$selectedOption === $option->id"
                wire:click="selectOption({{ $option->id }})"
            >
                <div class="p-4">
                    <h3 class="font-semibold">{{ $option->name }}</h3>
                    <p class="text-sm text-neutral-600">{{ $option->description }}</p>
                </div>
            </x-keys::card>
        @endforeach
    </div>

    @if($selectedOption)
        <div class="mt-6">
            <x-keys::alert variant="info">
                You selected: {{ $options->find($selectedOption)->name }}
            </x-keys::alert>
        </div>
    @endif
</div>
```

## Accessibility

- Proper ARIA attributes for selectable cards
- Keyboard navigation support
- Screen reader compatibility
- Focus management for interactive cards
- High contrast mode support

## Data Attributes

```html
<div
    data-keys-card="true"
    data-variant="padded"
    data-selectable="true"
    data-selected="false"
    data-disabled="false"
>
```

## JavaScript Integration

```javascript
// Target selectable cards
document.querySelectorAll('[data-keys-card][data-selectable="true"]')

// Handle card selection
card.addEventListener('click', function() {
    if (this.dataset.selectable === 'true' && this.dataset.disabled !== 'true') {
        // Toggle selection
        const isSelected = this.dataset.selected === 'true';
        this.setAttribute('data-selected', !isSelected);

        // Custom event
        this.dispatchEvent(new CustomEvent('card:selected', {
            detail: { selected: !isSelected, value: this.dataset.value }
        }));
    }
});

// Listen for selection events
document.addEventListener('card:selected', function(event) {
    console.log('Card selected:', event.detail);
});
```

## CSS Customization

```css
/* Custom hover effects */
[data-keys-card]:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

/* Selection styling */
[data-keys-card][data-selected="true"] {
    border-color: var(--color-brand);
    box-shadow: 0 0 0 3px rgba(var(--color-brand-rgb), 0.1);
}

/* Disabled state */
[data-keys-card][data-disabled="true"] {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Custom variant */
[data-keys-card][data-variant="custom"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}
```

## Best Practices

1. **Use appropriate variants** - Match card style to content importance
2. **Provide clear selection feedback** - Make selection states obvious
3. **Ensure proper contrast** - Text should be readable on card backgrounds
4. **Group related content** - Use cards to organize related information
5. **Optimize for mobile** - Ensure cards work well on smaller screens
6. **Consider loading states** - Show placeholders for dynamic content