# Progress Component

Progress bars and loading indicators with animations, labels, and comprehensive styling options.

## Basic Usage

```blade
{{-- Simple progress bar --}}
<x-keys::progress value="50" max="100" />

{{-- Progress with label --}}
<x-keys::progress value="75" max="100" label="Upload Progress" />

{{-- Progress with percentage display --}}
<x-keys::progress value="60" max="100" show-percentage />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | `0` | Current progress value |
| `max` | number | `100` | Maximum progress value |
| `size` | string | `md` | Size: `xs`, `sm`, `md`, `lg`, `xl` |
| `variant` | string | `default` | Variant: `default`, `striped`, `animated` |
| `color` | string | `brand` | Color: `brand`, `success`, `warning`, `danger`, `info` |
| `label` | string | `null` | Progress label text |
| `show-percentage` | boolean | `false` | Display percentage value |
| `show-value` | boolean | `false` | Display raw value |
| `indeterminate` | boolean | `false` | Show indeterminate/loading animation |

## Size Variants

```blade
<div class="space-y-4">
    <x-keys::progress value="50" size="xs" label="Extra Small" />
    <x-keys::progress value="60" size="sm" label="Small" />
    <x-keys::progress value="70" size="md" label="Medium" />
    <x-keys::progress value="80" size="lg" label="Large" />
    <x-keys::progress value="90" size="xl" label="Extra Large" />
</div>
```

## Color Variants

```blade
<div class="space-y-4">
    <x-keys::progress value="50" color="brand" label="Brand" />
    <x-keys::progress value="60" color="success" label="Success" />
    <x-keys::progress value="70" color="warning" label="Warning" />
    <x-keys::progress value="80" color="danger" label="Danger" />
    <x-keys::progress value="90" color="info" label="Info" />
</div>
```

## Progress Variants

### Default Progress
```blade
<x-keys::progress value="65" label="Default Progress" show-percentage />
```

### Striped Progress
```blade
<x-keys::progress
    value="45"
    variant="striped"
    color="success"
    label="Striped Progress"
    show-percentage
/>
```

### Animated Progress
```blade
<x-keys::progress
    value="75"
    variant="animated"
    color="brand"
    label="Animated Progress"
    show-percentage
/>
```

## Value Display Options

### Show Percentage
```blade
<x-keys::progress
    value="80"
    max="100"
    show-percentage
    label="Download Progress"
/>
```

### Show Raw Value
```blade
<x-keys::progress
    value="45"
    max="60"
    show-value
    label="Files Processed"
/>
```

### Custom Value Display
```blade
<x-keys::progress value="250" max="500" label="Storage Used">
    <x-slot:value>{{ $used }}MB of {{ $total }}MB</x-slot:value>
</x-keys::progress>
```

## Indeterminate Progress

For unknown duration tasks:

```blade
{{-- Loading animation --}}
<x-keys::progress indeterminate label="Loading..." />

{{-- Indeterminate with color --}}
<x-keys::progress
    indeterminate
    color="success"
    label="Processing..."
/>
```

## Use Cases

### File Upload Progress
```blade
<div class="space-y-3">
    @foreach($uploads as $upload)
        <div>
            <x-keys::progress
                :value="$upload->progress"
                max="100"
                color="{{ $upload->status === 'complete' ? 'success' : 'brand' }}"
                label="{{ $upload->filename }}"
                show-percentage
                size="sm"
            />
            <div class="flex justify-between text-xs text-neutral-500 mt-1">
                <span>{{ $upload->size_formatted }}</span>
                <span>{{ $upload->speed_formatted }}</span>
            </div>
        </div>
    @endforeach
</div>
```

### Task Completion
```blade
<div class="space-y-4">
    <div>
        <x-keys::progress
            :value="$project->completed_tasks"
            :max="$project->total_tasks"
            color="success"
            label="Project Progress"
            show-value
        />
        <p class="text-sm text-neutral-600 mt-1">
            {{ $project->completed_tasks }} of {{ $project->total_tasks }} tasks completed
        </p>
    </div>

    <div>
        <x-keys::progress
            :value="$project->completed_milestones"
            :max="$project->total_milestones"
            color="brand"
            label="Milestones"
            show-percentage
            size="sm"
        />
    </div>
</div>
```

### Skill Levels
```blade
<div class="space-y-4">
    @foreach($skills as $skill)
        <div>
            <x-keys::progress
                :value="$skill->level"
                max="100"
                :color="$skill->level >= 80 ? 'success' : ($skill->level >= 60 ? 'warning' : 'danger')"
                :label="$skill->name"
                show-percentage
            />
        </div>
    @endforeach
</div>
```

### System Resources
```blade
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <x-keys::card variant="padded">
        <h3 class="font-semibold mb-3">CPU Usage</h3>
        <x-keys::progress
            :value="$system->cpu_usage"
            max="100"
            color="{{ $system->cpu_usage > 80 ? 'danger' : 'success' }}"
            show-percentage
            variant="animated"
        />
    </x-keys::card>

    <x-keys::card variant="padded">
        <h3 class="font-semibold mb-3">Memory Usage</h3>
        <x-keys::progress
            :value="$system->memory_used"
            :max="$system->memory_total"
            color="{{ $system->memory_percentage > 90 ? 'danger' : 'brand' }}"
            show-value
        />
        <p class="text-xs text-neutral-500 mt-1">
            {{ number_format($system->memory_percentage, 1) }}% used
        </p>
    </x-keys::card>

    <x-keys::card variant="padded">
        <h3 class="font-semibold mb-3">Disk Space</h3>
        <x-keys::progress
            :value="$system->disk_used"
            :max="$system->disk_total"
            color="info"
            show-percentage
        />
    </x-keys::card>
</div>
```

### Loading States
```blade
<div class="space-y-4">
    {{-- Page loading --}}
    <div x-data="{ loading: true }" x-init="setTimeout(() => loading = false, 3000)">
        <div x-show="loading">
            <x-keys::progress indeterminate label="Loading page content..." />
        </div>
        <div x-show="!loading" x-transition>
            <p>Content loaded successfully!</p>
        </div>
    </div>

    {{-- API request --}}
    <div wire:loading.class="block" wire:loading.class.remove="hidden" class="hidden">
        <x-keys::progress
            indeterminate
            color="brand"
            label="Fetching data..."
            size="sm"
        />
    </div>
</div>
```

### Multi-Step Process
```blade
<div class="space-y-6">
    <div class="text-center">
        <h2 class="text-lg font-semibold">Account Setup</h2>
        <p class="text-sm text-neutral-600">Step {{ $currentStep }} of {{ $totalSteps }}</p>
    </div>

    <x-keys::progress
        :value="$currentStep"
        :max="$totalSteps"
        color="brand"
        size="lg"
        show-value
    />

    <div class="flex justify-between text-sm text-neutral-600">
        <span>Basic Info</span>
        <span>Preferences</span>
        <span>Verification</span>
        <span>Complete</span>
    </div>
</div>
```

### Download Manager
```blade
<div class="space-y-4">
    @foreach($downloads as $download)
        <x-keys::card variant="bordered">
            <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium">{{ $download->name }}</h4>
                    <x-keys::badge
                        :color="$download->status === 'completed' ? 'success' : 'brand'"
                        size="xs"
                    >
                        {{ ucfirst($download->status) }}
                    </x-keys::badge>
                </div>

                @if($download->status === 'downloading')
                    <x-keys::progress
                        :value="$download->progress"
                        max="100"
                        color="brand"
                        variant="animated"
                        show-percentage
                        size="sm"
                    />
                @elseif($download->status === 'paused')
                    <x-keys::progress
                        :value="$download->progress"
                        max="100"
                        color="warning"
                        show-percentage
                        size="sm"
                    />
                @else
                    <x-keys::progress
                        value="100"
                        max="100"
                        color="success"
                        show-percentage
                        size="sm"
                    />
                @endif

                <div class="flex justify-between text-xs text-neutral-500 mt-2">
                    <span>{{ $download->size_formatted }}</span>
                    @if($download->status === 'downloading')
                        <span>{{ $download->speed_formatted }}/s</span>
                    @endif
                </div>
            </div>
        </x-keys::card>
    @endforeach
</div>
```

## Form Integration

### Profile Completion
```blade
<x-keys::card variant="padded">
    <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold">Profile Completion</h3>
        <x-keys::badge color="warning" size="xs">{{ $completionPercentage }}%</x-keys::badge>
    </div>

    <x-keys::progress
        :value="$completionPercentage"
        max="100"
        color="{{ $completionPercentage >= 80 ? 'success' : 'warning' }}"
        show-percentage
        class="mb-4"
    />

    <div class="space-y-2 text-sm">
        @if(!$user->avatar)
            <div class="flex items-center gap-2">
                <x-keys::icon name="heroicon-o-photo" class="w-4 h-4 text-neutral-400" />
                <span>Add profile photo</span>
                <x-keys::button variant="link" size="xs">Add</x-keys::button>
            </div>
        @endif

        @if(!$user->bio)
            <div class="flex items-center gap-2">
                <x-keys::icon name="heroicon-o-document-text" class="w-4 h-4 text-neutral-400" />
                <span>Write bio</span>
                <x-keys::button variant="link" size="xs">Add</x-keys::button>
            </div>
        @endif
    </div>
</x-keys::card>
```

### Livewire Real-Time Updates
```blade
<div>
    <x-keys::progress
        :value="$uploadProgress"
        max="100"
        color="{{ $uploadStatus === 'error' ? 'danger' : 'brand' }}"
        :label="$uploadLabel"
        show-percentage
        :variant="$uploadProgress > 0 ? 'animated' : 'default'"
    />

    @if($uploadStatus === 'error')
        <x-keys::alert variant="danger" size="sm" class="mt-2">
            Upload failed. Please try again.
        </x-keys::alert>
    @endif
</div>
```

## Accessibility

- Proper ARIA attributes for progress indication
- Screen reader announcements for value changes
- High contrast mode support
- Keyboard accessibility for interactive elements
- Role and value attributes for assistive technology

## Data Attributes

```html
<div
    data-keys-progress="true"
    data-size="md"
    data-variant="animated"
    data-color="brand"
    data-indeterminate="false"
    data-value="75"
    data-max="100"
>
```

## JavaScript Integration

```javascript
// Update progress programmatically
function updateProgress(progressId, value, max = 100) {
    const progress = document.getElementById(progressId);
    if (progress) {
        const percentage = (value / max) * 100;
        progress.setAttribute('data-value', value);
        progress.querySelector('.progress-bar').style.width = `${percentage}%`;

        // Update percentage display
        const percentageEl = progress.querySelector('.progress-percentage');
        if (percentageEl) {
            percentageEl.textContent = `${Math.round(percentage)}%`;
        }
    }
}

// Animate progress
function animateProgress(progressId, targetValue, duration = 1000) {
    const progress = document.getElementById(progressId);
    const startValue = parseInt(progress.dataset.value) || 0;
    const startTime = Date.now();

    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = startValue + (targetValue - startValue) * progress;

        updateProgress(progressId, currentValue);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}

// Listen for progress events
document.addEventListener('progress:updated', function(event) {
    console.log('Progress updated:', event.detail);
});
```

## CSS Customization

```css
/* Custom progress animations */
[data-keys-progress][data-variant="animated"] .progress-bar {
    background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%
    );
    background-size: 1rem 1rem;
    animation: progress-stripes 1s linear infinite;
}

@keyframes progress-stripes {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 1rem 0;
    }
}

/* Indeterminate animation */
[data-keys-progress][data-indeterminate="true"] .progress-bar {
    animation: indeterminate 1.5s ease-in-out infinite;
}

@keyframes indeterminate {
    0% {
        transform: translateX(-100%);
    }
    50% {
        transform: translateX(0%);
    }
    100% {
        transform: translateX(100%);
    }
}

/* Custom color variants */
[data-keys-progress][data-color="custom"] .progress-bar {
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}
```

## Best Practices

1. **Provide meaningful labels** - Always include descriptive text
2. **Show appropriate detail** - Use percentages for completion, values for quantities
3. **Use color semantically** - Red for errors/critical, green for success
4. **Consider animation** - Use sparingly and only when it adds value
5. **Handle edge cases** - Zero values, error states, completion
6. **Update accessibility** - Ensure screen readers can track progress
7. **Mobile optimization** - Ensure progress bars are visible on small screens