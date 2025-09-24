# Textarea Component

Multi-line text inputs with auto-resize, validation states, and comprehensive styling options.

## Basic Usage

```blade
{{-- Simple textarea --}}
<x-keys::textarea name="message" placeholder="Enter your message..." />

{{-- With label --}}
<x-keys::textarea name="description" label="Description" />

{{-- Required with validation --}}
<x-keys::textarea
    name="content"
    label="Content"
    required
    :errors="$errors"
    placeholder="Write your content here..."
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | required | Textarea name attribute |
| `label` | string | `null` | Textarea label text |
| `placeholder` | string | `null` | Placeholder text |
| `value` | string | `null` | Textarea value |
| `rows` | integer | `3` | Initial number of rows |
| `maxRows` | integer | `null` | Maximum rows for auto-resize |
| `autoResize` | boolean | `true` | Enable auto-resize functionality |
| `required` | boolean | `false` | Mark as required |
| `disabled` | boolean | `false` | Disable textarea |
| `readonly` | boolean | `false` | Make read-only |
| `maxlength` | integer | `null` | Maximum character limit |
| `showCount` | boolean | `false` | Show character count |
| `errors` | object | `null` | Validation errors collection |
| `optional` | boolean | `false` | Show optional indicator |

## Basic Examples

### Standard Textarea
```blade
<x-keys::textarea
    name="bio"
    label="Biography"
    placeholder="Tell us about yourself..."
    rows="4"
/>
```

### With Character Limit
```blade
<x-keys::textarea
    name="tweet"
    label="Tweet"
    placeholder="What's happening?"
    maxlength="280"
    showCount
    rows="3"
/>
```

### Auto-Resize Textarea
```blade
<x-keys::textarea
    name="article"
    label="Article Content"
    placeholder="Start writing your article..."
    autoResize
    :maxRows="20"
/>
```

## Form Integration

### Laravel Forms
```blade
<form method="POST">
    @csrf

    <x-keys::textarea
        name="message"
        label="Message"
        placeholder="Enter your message..."
        required
        :errors="$errors"
        value="{{ old('message') }}"
        maxlength="1000"
        showCount
    />

    <x-keys::textarea
        name="notes"
        label="Additional Notes"
        placeholder="Any additional information..."
        optional
        :errors="$errors"
        value="{{ old('notes') }}"
    />

    <x-keys::button type="submit" variant="brand">Submit</x-keys::button>
</form>
```

### Livewire Integration
```blade
<div>
    <x-keys::textarea
        name="content"
        label="Live Preview"
        wire:model.live.debounce.300ms="content"
        placeholder="Type to see live preview..."
        autoResize
    />

    @if($content)
        <div class="mt-4 p-4 bg-neutral-50 rounded-lg">
            <h4 class="font-semibold">Preview:</h4>
            <div class="prose">{{ $content }}</div>
        </div>
    @endif
</div>
```

## Validation States

### Error States
```blade
<x-keys::textarea
    name="description"
    label="Description"
    :errors="$errors"
    value="{{ old('description') }}"
    required
/>

{{-- Custom error message --}}
<x-keys::textarea
    name="content"
    label="Content"
    error="Content must be at least 50 characters long"
/>
```

### Success State
```blade
<x-keys::textarea
    name="review"
    label="Review"
    value="Great product! Highly recommended."
    success="Review saved successfully"
    readonly
/>
```

## Advanced Features

### Character Counter
```blade
<x-keys::textarea
    name="description"
    label="Product Description"
    placeholder="Describe your product..."
    maxlength="500"
    showCount
    rows="4"
/>
```

### Read-Only Display
```blade
<x-keys::textarea
    name="system_info"
    label="System Information"
    value="{{ $systemInfo }}"
    readonly
    rows="10"
/>
```

### Disabled State
```blade
<x-keys::textarea
    name="locked_content"
    label="Locked Content"
    value="This content is locked until approval"
    disabled
/>
```

## Auto-Resize Functionality

The textarea automatically adjusts its height based on content:

```blade
{{-- Basic auto-resize --}}
<x-keys::textarea
    name="notes"
    placeholder="Start typing..."
    autoResize
/>

{{-- With minimum and maximum rows --}}
<x-keys::textarea
    name="article"
    placeholder="Write your article..."
    rows="5"
    :maxRows="15"
    autoResize
/>

{{-- Disable auto-resize --}}
<x-keys::textarea
    name="fixed"
    placeholder="Fixed height textarea"
    rows="6"
    :autoResize="false"
/>
```

## Use Cases

### Comment System
```blade
<div class="space-y-4">
    <x-keys::textarea
        name="comment"
        placeholder="Write a comment..."
        rows="3"
        autoResize
        maxlength="1000"
        showCount
    />

    <div class="flex justify-between">
        <x-keys::button variant="ghost">Cancel</x-keys::button>
        <x-keys::button variant="brand">Post Comment</x-keys::button>
    </div>
</div>
```

### Feedback Form
```blade
<form class="space-y-6">
    <x-keys::textarea
        name="feedback"
        label="Your Feedback"
        placeholder="We'd love to hear your thoughts..."
        required
        rows="5"
        autoResize
    />

    <x-keys::textarea
        name="suggestions"
        label="Suggestions for Improvement"
        placeholder="How can we make this better?"
        optional
        rows="3"
    />

    <x-keys::button type="submit" variant="success">Submit Feedback</x-keys::button>
</form>
```

### Rich Content Entry
```blade
<div class="space-y-4">
    <x-keys::textarea
        name="excerpt"
        label="Excerpt"
        placeholder="Brief summary..."
        maxlength="200"
        showCount
        rows="2"
    />

    <x-keys::textarea
        name="content"
        label="Full Content"
        placeholder="Write the full content..."
        autoResize
        :maxRows="20"
        required
    />
</div>
```

### Support Ticket
```blade
<form class="space-y-6">
    <x-keys::input
        name="subject"
        label="Subject"
        placeholder="Brief description of the issue"
        required
    />

    <x-keys::textarea
        name="description"
        label="Detailed Description"
        placeholder="Please describe the issue in detail..."
        required
        rows="6"
        autoResize
        maxlength="2000"
        showCount
    />

    <x-keys::textarea
        name="steps"
        label="Steps to Reproduce"
        placeholder="1. First step&#10;2. Second step&#10;3. ..."
        optional
        rows="4"
    />

    <x-keys::button type="submit" variant="brand">Submit Ticket</x-keys::button>
</form>
```

## Accessibility

- Proper label associations with `for` and `id` attributes
- ARIA attributes for validation states
- Screen reader support for character counting
- Keyboard navigation support
- Focus management for auto-resize

## Data Attributes

```html
<textarea
    data-keys-textarea="true"
    data-auto-resize="true"
    data-max-rows="10"
    data-has-counter="true"
    data-required="true"
>
```

## JavaScript Integration

```javascript
// Target textareas with auto-resize
document.querySelectorAll('[data-keys-textarea][data-auto-resize="true"]')

// Handle content changes
textarea.addEventListener('input', function() {
    // Auto-resize logic
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';

    // Character counting
    updateCharacterCount(this);
});

// Custom events
document.addEventListener('textarea:resized', function(event) {
    console.log('Textarea resized:', event.detail);
});
```

## CSS Customization

```css
/* Custom resize behavior */
[data-keys-textarea] textarea {
    resize: vertical;
    min-height: 3rem;
    transition: height 0.2s ease;
}

/* Character counter styling */
[data-keys-textarea] .character-count {
    font-size: 0.875rem;
    color: var(--color-neutral-500);
}

[data-keys-textarea] .character-count.warning {
    color: var(--color-warning-600);
}

[data-keys-textarea] .character-count.error {
    color: var(--color-danger-600);
}

/* Auto-resize smooth animation */
[data-keys-textarea][data-auto-resize="true"] textarea {
    transition: height 0.15s ease-out;
}
```

## Performance Considerations

- Auto-resize uses efficient event handling
- Character counting is debounced for performance
- Minimum/maximum height constraints prevent layout issues
- Memory-efficient event listeners with proper cleanup