# Range Component

Slider inputs for numeric ranges with labels, value display, and comprehensive styling options.

## Basic Usage

```blade
{{-- Simple range slider --}}
<x-keys::range name="volume" min="0" max="100" value="50" />

{{-- Range with label --}}
<x-keys::range
    name="price"
    label="Price Range"
    min="0"
    max="1000"
    value="250"
/>

{{-- Range with value display --}}
<x-keys::range
    name="quality"
    label="Quality"
    min="1"
    max="10"
    value="7"
    show-value
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Range input name attribute |
| `label` | string | `null` | Range label text |
| `min` | number | `0` | Minimum value |
| `max` | number | `100` | Maximum value |
| `value` | number | `0` | Current value |
| `step` | number | `1` | Step increment |
| `show-value` | boolean | `false` | Display current value |
| `show-labels` | boolean | `false` | Show min/max labels |
| `disabled` | boolean | `false` | Disable range input |
| `color` | string | `brand` | Color theme |
| `size` | string | `md` | Size: `sm`, `md`, `lg` |

## Basic Examples

### Price Range
```blade
<x-keys::range
    name="price_range"
    label="Maximum Price"
    min="0"
    max="500"
    value="150"
    step="10"
    show-value
    show-labels
/>
```

### Volume Control
```blade
<x-keys::range
    name="volume"
    label="Volume"
    min="0"
    max="100"
    value="75"
    step="5"
    show-value
    color="success"
/>
```

### Quality Rating
```blade
<x-keys::range
    name="quality"
    label="Quality Rating"
    min="1"
    max="10"
    value="8"
    show-value
    show-labels
/>
```

## Size Variants

```blade
<div class="space-y-6">
    <x-keys::range
        name="small"
        label="Small Range"
        size="sm"
        value="30"
        show-value
    />

    <x-keys::range
        name="medium"
        label="Medium Range"
        size="md"
        value="50"
        show-value
    />

    <x-keys::range
        name="large"
        label="Large Range"
        size="lg"
        value="70"
        show-value
    />
</div>
```

## Color Variants

```blade
<div class="space-y-4">
    <x-keys::range name="brand" label="Brand" color="brand" value="40" show-value />
    <x-keys::range name="success" label="Success" color="success" value="60" show-value />
    <x-keys::range name="warning" label="Warning" color="warning" value="80" show-value />
    <x-keys::range name="danger" label="Danger" color="danger" value="90" show-value />
</div>
```

## Value Display Options

### Show Current Value
```blade
<x-keys::range
    name="brightness"
    label="Brightness"
    min="0"
    max="100"
    value="65"
    show-value
/>
```

### Show Min/Max Labels
```blade
<x:keys::range
    name="temperature"
    label="Temperature"
    min="10"
    max="30"
    value="22"
    show-labels
    show-value
/>
```

### Custom Value Formatting
```blade
<x-keys::range
    name="size"
    label="File Size"
    min="1"
    max="100"
    value="25"
    show-value
>
    <x-slot:value>{{ $value }}MB</x-slot:value>
</x-keys::range>
```

## Use Cases

### Settings Panel
```blade
<x-keys::card variant="padded">
    <h3 class="text-lg font-semibold mb-6">Display Settings</h3>

    <div class="space-y-6">
        <x-keys::range
            name="brightness"
            label="Brightness"
            min="0"
            max="100"
            :value="$settings->brightness"
            show-value
            show-labels
        />

        <x-keys::range
            name="contrast"
            label="Contrast"
            min="0"
            max="200"
            :value="$settings->contrast"
            step="10"
            show-value
        />

        <x-keys::range
            name="text_size"
            label="Text Size"
            min="12"
            max="24"
            :value="$settings->text_size"
            show-value
            color="brand"
        />

        <x-keys::range
            name="animation_speed"
            label="Animation Speed"
            min="0.5"
            max="2"
            step="0.1"
            :value="$settings->animation_speed"
            show-value
            color="success"
        />
    </div>
</x-keys::card>
```

### Filter Interface
```blade
<form class="space-y-6">
    <h3 class="font-semibold">Filter Products</h3>

    <x-keys::range
        name="price_min"
        label="Price Range"
        min="0"
        max="1000"
        :value="$filters['price_min'] ?? 0"
        step="50"
        show-value
        show-labels
        wire:model.live="filters.price_min"
    />

    <x-keys::range
        name="rating"
        label="Minimum Rating"
        min="1"
        max="5"
        :value="$filters['rating'] ?? 1"
        show-value
        wire:model.live="filters.rating"
    />

    <x-keys::range
        name="year"
        label="Year"
        min="2000"
        max="2024"
        :value="$filters['year'] ?? 2020"
        show-value
        show-labels
        wire:model.live="filters.year"
    />
</form>
```

### Audio/Video Controls
```blade
<div class="space-y-4">
    <div class="flex items-center gap-4">
        <x-keys::icon name="heroicon-o-speaker-wave" class="w-5 h-5" />
        <x-keys::range
            name="volume"
            min="0"
            max="100"
            value="75"
            show-value
            color="success"
            class="flex-1"
        />
    </div>

    <div class="flex items-center gap-4">
        <x-keys::icon name="heroicon-o-musical-note" class="w-5 h-5" />
        <x-keys::range
            name="bass"
            label="Bass"
            min="-10"
            max="10"
            value="2"
            show-value
            show-labels
            class="flex-1"
        />
    </div>

    <div class="flex items-center gap-4">
        <x-keys::icon name="heroicon-o-adjustments-horizontal" class="w-5 h-5" />
        <x-keys::range
            name="treble"
            label="Treble"
            min="-10"
            max="10"
            value="-1"
            show-value
            show-labels
            class="flex-1"
        />
    </div>
</div>
```

### Performance Metrics
```blade
<x-keys::card variant="bordered">
    <div class="p-6">
        <h3 class="font-semibold mb-4">System Performance</h3>

        <div class="space-y-4">
            <div>
                <x-keys::range
                    name="cpu_usage"
                    label="CPU Usage"
                    min="0"
                    max="100"
                    :value="$metrics->cpu_usage"
                    disabled
                    show-value
                    :color="$metrics->cpu_usage > 80 ? 'danger' : 'success'"
                />
            </div>

            <div>
                <x-keys::range
                    name="memory_usage"
                    label="Memory Usage"
                    min="0"
                    max="100"
                    :value="$metrics->memory_usage"
                    disabled
                    show-value
                    :color="$metrics->memory_usage > 90 ? 'danger' : 'brand'"
                />
            </div>

            <div>
                <x-keys::range
                    name="disk_usage"
                    label="Disk Usage"
                    min="0"
                    max="100"
                    :value="$metrics->disk_usage"
                    disabled
                    show-value
                    color="warning"
                />
            </div>
        </div>
    </div>
</x-keys::card>
```

### Image Editor Controls
```blade
<div class="space-y-6">
    <section>
        <h3 class="font-semibold mb-4">Color Adjustments</h3>
        <div class="space-y-4">
            <x-keys::range
                name="brightness"
                label="Brightness"
                min="-100"
                max="100"
                value="0"
                show-value
                show-labels
            />

            <x-keys::range
                name="contrast"
                label="Contrast"
                min="-100"
                max="100"
                value="0"
                show-value
                show-labels
            />

            <x-keys::range
                name="saturation"
                label="Saturation"
                min="-100"
                max="100"
                value="0"
                show-value
                show-labels
                color="brand"
            />
        </div>
    </section>

    <section>
        <h3 class="font-semibold mb-4">Effects</h3>
        <div class="space-y-4">
            <x-keys::range
                name="blur"
                label="Blur"
                min="0"
                max="10"
                value="0"
                step="0.1"
                show-value
            />

            <x-keys::range
                name="sepia"
                label="Sepia"
                min="0"
                max="100"
                value="0"
                show-value
                color="warning"
            />
        </div>
    </section>
</div>
```

### Game Settings
```blade
<x-keys::card variant="padded">
    <h3 class="text-lg font-semibold mb-6">Game Settings</h3>

    <div class="space-y-6">
        <x-keys::range
            name="difficulty"
            label="Difficulty Level"
            min="1"
            max="5"
            value="3"
            show-value
            show-labels
            color="danger"
        />

        <x-keys::range
            name="music_volume"
            label="Music Volume"
            min="0"
            max="100"
            value="80"
            step="5"
            show-value
            color="success"
        />

        <x-keys::range
            name="sfx_volume"
            label="Sound Effects"
            min="0"
            max="100"
            value="90"
            step="5"
            show-value
            color="success"
        />

        <x-keys::range
            name="mouse_sensitivity"
            label="Mouse Sensitivity"
            min="0.1"
            max="3"
            step="0.1"
            value="1.5"
            show-value
        />
    </div>
</x-keys::card>
```

## Form Integration

### Laravel Forms
```blade
<form method="POST">
    @csrf

    <div class="space-y-6">
        <x-keys::range
            name="budget"
            label="Monthly Budget"
            min="0"
            max="5000"
            step="100"
            :value="old('budget', 1000)"
            show-value
            show-labels
        />

        <x-keys::range
            name="team_size"
            label="Team Size"
            min="1"
            max="50"
            :value="old('team_size', 5)"
            show-value
        />

        <x-keys::button type="submit" variant="brand">
            Save Preferences
        </x-keys::button>
    </div>
</form>
```

### Livewire Integration
```blade
<div>
    <x-keys::range
        name="threshold"
        label="Alert Threshold"
        min="0"
        max="100"
        wire:model.live="threshold"
        show-value
        color="warning"
    />

    @if($threshold > 80)
        <x-keys::alert variant="warning" size="sm" class="mt-2">
            High threshold may result in frequent alerts
        </x-keys::alert>
    @endif
</div>
```

### Real-time Updates
```blade
<div x-data="{ value: 50 }">
    <x-keys::range
        name="demo"
        label="Interactive Demo"
        min="0"
        max="100"
        x-model="value"
        show-value
    />

    <div class="mt-4 p-4 border rounded-lg">
        <div class="text-sm">Current value: <span x-text="value"></span></div>
        <div
            class="mt-2 h-4 bg-brand-500 rounded transition-all duration-300"
            :style="`width: ${value}%`"
        ></div>
    </div>
</div>
```

## Accessibility

- Proper ARIA attributes for screen readers
- Keyboard navigation support (arrow keys)
- Focus management and visual indicators
- Label associations for accessibility
- Value announcements for screen readers

## Data Attributes

```html
<input
    data-keys-range="true"
    data-size="md"
    data-color="brand"
    data-show-value="true"
    data-show-labels="false"
/>
```

## JavaScript Integration

```javascript
// Target range inputs
document.querySelectorAll('[data-keys-range]')

// Handle value changes
range.addEventListener('input', function() {
    console.log('Range value:', this.value);

    // Update display value
    const valueDisplay = this.parentElement.querySelector('.range-value');
    if (valueDisplay) {
        valueDisplay.textContent = this.value;
    }

    // Custom event
    this.dispatchEvent(new CustomEvent('range:changed', {
        detail: { value: parseFloat(this.value), name: this.name }
    }));
});

// Set range value programmatically
function setRangeValue(rangeName, value) {
    const range = document.querySelector(`[name="${rangeName}"]`);
    if (range) {
        range.value = value;
        range.dispatchEvent(new Event('input'));
    }
}

// Listen for range events
document.addEventListener('range:changed', function(event) {
    console.log('Range changed:', event.detail);
    // Save setting, update preview, etc.
});
```

## CSS Customization

```css
/* Custom range track styling */
[data-keys-range] input[type="range"] {
    appearance: none;
    background: transparent;
    cursor: pointer;
}

[data-keys-range] input[type="range"]::-webkit-slider-track {
    background: var(--color-neutral-200);
    height: 6px;
    border-radius: 3px;
}

[data-keys-range] input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    background: var(--color-brand);
    height: 20px;
    width: 20px;
    border-radius: 50%;
    cursor: pointer;
}

/* Firefox */
[data-keys-range] input[type="range"]::-moz-range-track {
    background: var(--color-neutral-200);
    height: 6px;
    border-radius: 3px;
    border: none;
}

[data-keys-range] input[type="range"]::-moz-range-thumb {
    background: var(--color-brand);
    height: 20px;
    width: 20px;
    border-radius: 50%;
    cursor: pointer;
    border: none;
}

/* Custom color variants */
[data-keys-range][data-color="success"] input[type="range"]::-webkit-slider-thumb {
    background: var(--color-success);
}
```

## Best Practices

1. **Choose appropriate ranges** - Set logical min/max values
2. **Use meaningful steps** - Match step size to use case
3. **Show current values** - Help users understand selections
4. **Provide context** - Use labels and descriptions
5. **Consider mobile** - Ensure touch-friendly sizing
6. **Test accessibility** - Verify keyboard navigation works
7. **Handle edge cases** - Account for min/max boundaries