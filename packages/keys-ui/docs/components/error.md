# Error Component

Form validation error display component with flexible message handling and optional icon support.

## Basic Usage

```blade
{{-- Simple error message --}}
<x-keys::error messages="This field is required" />

{{-- Error with array of messages --}}
<x-keys::error :messages="['Password must be at least 8 characters', 'Password must contain a number']" />

{{-- Error from Laravel validation --}}
<x-keys::error :messages="$errors->get('email')" />

{{-- Error without icon --}}
<x-keys::error :messages="$errors->get('username')" :show-icon="false" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `messages` | string\|array\|Collection | `null` | Error message(s) to display |
| `show-icon` | boolean | `true` | Whether to show error icon |

## Message Types

### String Message
```blade
<x-keys::input name="email" type="email" />
<x-keys::error messages="Please enter a valid email address" />
```

### Array of Messages
```blade
<x-keys::input name="password" type="password" />
<x-keys::error :messages="[
    'Password must be at least 8 characters long',
    'Password must contain at least one uppercase letter',
    'Password must contain at least one number'
]" />
```

### Laravel Validation Errors
```blade
<x-keys::input name="username" />
<x-keys::error :messages="$errors->get('username')" />

{{-- Or using errors bag --}}
<x-keys::error :messages="$errors->first('username')" />
```

### Collection Messages
```blade
@php
$customErrors = collect([
    'Field cannot be empty',
    'Value must be unique'
]);
@endphp

<x-keys::input name="slug" />
<x-keys::error :messages="$customErrors" />
```

## Use Cases

### Basic Form Validation
```blade
<form method="POST">
    @csrf

    <x-keys::field>
        <x-keys::label for="name" required>Name</x-keys::label>
        <x-keys::input
            name="name"
            id="name"
            value="{{ old('name') }}"
            :class="$errors->has('name') ? 'border-danger' : ''"
        />
        <x-keys::error :messages="$errors->get('name')" />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="email" required>Email</x-keys::label>
        <x-keys::input
            name="email"
            id="email"
            type="email"
            value="{{ old('email') }}"
            :class="$errors->has('email') ? 'border-danger' : ''"
        />
        <x-keys::error :messages="$errors->get('email')" />
    </x-keys::field>

    <x-keys::button type="submit" variant="brand">Submit</x-keys::button>
</form>
```

### Complex Validation Rules
```blade
<x-keys::field>
    <x-keys::label for="password" required>Password</x-keys::label>
    <x-keys::input
        name="password"
        id="password"
        type="password"
        :class="$errors->has('password') ? 'border-danger' : ''"
    />
    <x-keys::error :messages="$errors->get('password')" />

    {{-- Additional help text when no errors --}}
    @if(!$errors->has('password'))
        <p class="text-sm text-neutral-600 mt-1">
            Password must be at least 8 characters and include uppercase, lowercase, and numbers
        </p>
    @endif
</x-keys::field>
```

### File Upload Validation
```blade
<x-keys::field>
    <x-keys::label for="documents" optional>Upload Documents</x-keys::label>
    <x-keys::file-upload
        name="documents[]"
        id="documents"
        multiple
        accept=".pdf,.doc,.docx"
        :class="$errors->has('documents.*') ? 'border-danger' : ''"
    />

    {{-- Display errors for each file --}}
    @if($errors->has('documents.*'))
        @foreach($errors->get('documents.*') as $key => $messages)
            <x-keys::error :messages="$messages" />
        @endforeach
    @else
        <x-keys::error :messages="$errors->get('documents')" />
    @endif
</x-keys::field>
```

### Livewire Real-time Validation
```blade
<div>
    <x-keys::field>
        <x-keys::label for="username" required>Username</x-keys::label>
        <x-keys::input
            name="username"
            id="username"
            wire:model.live.debounce.500ms="username"
            :class="$errors->has('username') ? 'border-danger' : ''"
        />
        <x-keys::error :messages="$errors->get('username')" />

        {{-- Real-time availability check --}}
        @if($checkingAvailability)
            <p class="text-sm text-neutral-600 mt-1">
                <x-keys::loading size="xs" class="mr-1" />
                Checking availability...
            </p>
        @elseif($username && !$errors->has('username'))
            <p class="text-sm text-success mt-1">
                ✓ Username is available
            </p>
        @endif
    </x-keys::field>
</div>
```

### Custom Error Messages
```blade
<x-keys::field>
    <x-keys::label for="age" required>Age</x-keys::label>
    <x-keys::input name="age" id="age" type="number" />

    @php
    $ageErrors = [];
    if ($errors->has('age')) {
        foreach ($errors->get('age') as $error) {
            if (str_contains($error, 'required')) {
                $ageErrors[] = 'Please enter your age';
            } elseif (str_contains($error, 'integer')) {
                $ageErrors[] = 'Age must be a whole number';
            } elseif (str_contains($error, 'min')) {
                $ageErrors[] = 'You must be at least 18 years old';
            } else {
                $ageErrors[] = $error;
            }
        }
    }
    @endphp

    <x-keys::error :messages="$ageErrors" />
</x-keys::field>
```

### Multiple Field Validation
```blade
{{-- Address form with related field validation --}}
<div class="grid grid-cols-2 gap-4">
    <x-keys::field>
        <x-keys::label for="street" required>Street Address</x-keys::label>
        <x-keys::input name="street" id="street" />
        <x-keys::error :messages="$errors->get('street')" />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="city" required>City</x-keys::label>
        <x-keys::input name="city" id="city" />
        <x-keys::error :messages="$errors->get('city')" />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="state" required>State</x-keys::label>
        <x-keys::select name="state" id="state">
            <x-keys::select.option value="" label="Choose state" />
            <!-- State options -->
        </x-keys::select>
        <x-keys::error :messages="$errors->get('state')" />
    </x-keys::field>

    <x-keys::field>
        <x-keys::label for="zip" required>ZIP Code</x-keys::label>
        <x-keys::input name="zip" id="zip" />
        <x-keys::error :messages="$errors->get('zip')" />
    </x-keys::field>
</div>

{{-- General address validation errors --}}
@if($errors->has('address'))
    <x-keys::error :messages="$errors->get('address')" />
@endif
```

### Conditional Error Display
```blade
<x-keys::field>
    <x-keys::label for="website" optional>Website URL</x-keys::label>
    <x-keys::input
        name="website"
        id="website"
        type="url"
        placeholder="https://example.com"
    />

    {{-- Show error only if field has value --}}
    @if(old('website') && $errors->has('website'))
        <x-keys::error :messages="$errors->get('website')" />
    @elseif(old('website') && !$errors->has('website'))
        <p class="text-sm text-success mt-1">
            ✓ Valid URL format
        </p>
    @endif
</x-keys::field>
```

### Error Summary
```blade
@if($errors->any())
    <x-keys::alert variant="danger" class="mb-6">
        <div class="font-medium">Please correct the following errors:</div>
        <ul class="mt-2 space-y-1">
            @foreach($errors->all() as $error)
                <li class="flex items-start gap-2">
                    <x-keys::icon name="heroicon-o-x-circle" size="xs" class="mt-0.5 text-danger flex-shrink-0" />
                    {{ $error }}
                </li>
            @endforeach
        </ul>
    </x-keys::alert>
@endif
```

### Ajax Form Validation
```blade
<form id="ajax-form">
    <x-keys::field>
        <x-keys::label for="ajax_email" required>Email</x-keys::label>
        <x-keys::input name="email" id="ajax_email" type="email" />
        <x-keys::error id="ajax_email_error" style="display: none;" />
    </x-keys::field>

    <x-keys::button type="submit" variant="brand">Submit</x-keys::button>
</form>

<script>
document.getElementById('ajax-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear previous errors
    document.getElementById('ajax_email_error').style.display = 'none';

    fetch('/validate-form', {
        method: 'POST',
        body: new FormData(this),
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.errors) {
            if (data.errors.email) {
                const errorEl = document.getElementById('ajax_email_error');
                errorEl.textContent = data.errors.email[0];
                errorEl.style.display = 'block';
            }
        }
    });
});
</script>
```

## Icon Display

```blade
{{-- With icon (default) --}}
<x-keys::error messages="Field is required" />

{{-- Without icon --}}
<x-keys::error messages="Field is required" :show-icon="false" />

{{-- Multiple messages with icon --}}
<x-keys::error :messages="[
    'Password is too short',
    'Password needs a number'
]" />
```

## Accessibility

- **ARIA Support**: Uses appropriate ARIA attributes for error announcements
- **Screen Reader**: Error messages are announced to screen readers
- **High Contrast**: Maintains visibility in high contrast mode
- **Color Independence**: Uses icons and text, not just color for errors

```blade
{{-- Accessible error example --}}
<x-keys::input
    name="accessible_field"
    aria-invalid="{{ $errors->has('accessible_field') ? 'true' : 'false' }}"
    aria-describedby="{{ $errors->has('accessible_field') ? 'accessible_field_error' : '' }}"
/>
<x-keys::error
    id="accessible_field_error"
    :messages="$errors->get('accessible_field')"
    role="alert"
/>
```

## CSS Customization

```css
/* Custom error styling */
[data-keys-error="true"] {
    color: var(--color-danger);
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

/* Error icon styling */
[data-keys-error="true"] .error-icon {
    color: var(--color-danger);
    margin-right: 0.375rem;
    flex-shrink: 0;
}

/* Multiple error messages */
[data-keys-error="true"] ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

[data-keys-error="true"] li {
    display: flex;
    align-items: flex-start;
    gap: 0.375rem;
    margin-bottom: 0.25rem;
}

/* Error animation */
[data-keys-error="true"] {
    animation: errorSlideIn 0.2s ease-out;
}

@keyframes errorSlideIn {
    from {
        opacity: 0;
        transform: translateY(-0.25rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

## Laravel Integration

### Custom Validation Messages
```php
// In your form request or controller
public function messages()
{
    return [
        'email.required' => 'Please enter your email address',
        'email.email' => 'Please enter a valid email address',
        'password.min' => 'Password must be at least :min characters long',
        'password.confirmed' => 'Password confirmation does not match',
    ];
}
```

### Validation Rules
```php
// Example validation rules that work well with the Error component
public function rules()
{
    return [
        'email' => ['required', 'email', 'unique:users'],
        'password' => ['required', 'min:8', 'confirmed'],
        'terms' => ['accepted'],
        'files.*' => ['file', 'mimes:pdf,doc,docx', 'max:2048'],
    ];
}
```

## Best Practices

1. **Always display errors** - Show validation errors immediately below related fields
2. **Clear messages** - Use descriptive, actionable error messages
3. **Consistent styling** - Use Error component for all validation feedback
4. **Accessibility first** - Ensure errors are announced to screen readers
5. **Real-time feedback** - Consider showing errors as users type (with debouncing)
6. **Icon usage** - Keep icons consistent (show by default unless space is constrained)
7. **Error prevention** - Provide help text to prevent errors when possible