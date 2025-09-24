# Date Picker Component

Comprehensive date selection with calendar interface, range selection, and advanced features using Carbon for date handling.

## Basic Usage

```blade
{{-- Simple date picker --}}
<x-keys::date-picker name="date" />

{{-- Date picker with label --}}
<x-keys::date-picker
    name="birthday"
    label="Date of Birth"
    placeholder="Select your birthday"
/>

{{-- Date picker with initial value --}}
<x-keys::date-picker
    name="appointment"
    label="Appointment Date"
    value="2024-01-15"
/>
```

## Props

### Core Properties
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | `null` | Input name attribute |
| `id` | string | auto | Input ID (auto-generated if not provided) |
| `value` | mixed | `null` | Selected date value |
| `placeholder` | string | auto | Placeholder text (auto-generated from format) |

### Date Picker Specific
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `format` | string | `Y-m-d` | PHP date format for form submission |
| `display-format` | string | `format` | Display format (falls back to format) |
| `close-on-select` | boolean | `true` | Close calendar after date selection |
| `show-calendar-icon` | boolean | `true` | Show calendar icon |
| `inline` | boolean | `false` | Display calendar inline (always visible) |
| `quick-selectors` | boolean/array | `false` | Enable quick date selectors |

### Calendar Properties
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min-date` | string/Carbon | `null` | Minimum selectable date |
| `max-date` | string/Carbon | `null` | Maximum selectable date |
| `disabled-dates` | array | `[]` | Array of disabled dates |
| `is-range` | boolean | `false` | Enable date range selection |
| `start-date` | mixed | `null` | Range start date |
| `end-date` | mixed | `null` | Range end date |
| `months-to-show` | integer | `1` | Number of months to display (1-12) |

### Input Properties
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | string | `md` | Size: `sm`, `md`, `lg` |
| `disabled` | boolean | `false` | Disable input |
| `readonly` | boolean | `false` | Make input read-only |
| `required` | boolean | `false` | Mark as required |
| `label` | string | `null` | Input label |
| `optional` | boolean | `false` | Show optional indicator |
| `errors` | object | `null` | Validation errors |
| `clearable` | boolean | `false` | Show clear button |
| `icon-left` | string | `null` | Left icon |
| `icon-right` | string | `null` | Right icon |

## Date Formats

### Common Formats
```blade
{{-- ISO format (default) --}}
<x-keys::date-picker name="iso_date" format="Y-m-d" />

{{-- US format --}}
<x-keys::date-picker name="us_date" format="m/d/Y" display-format="m/d/Y" />

{{-- European format --}}
<x-keys::date-picker name="eu_date" format="d-m-Y" display-format="d/m/Y" />

{{-- Long format --}}
<x-keys::date-picker name="long_date" format="Y-m-d" display-format="F j, Y" />
```

### Custom Display Formats
```blade
{{-- Store as ISO, display as readable --}}
<x-keys::date-picker
    name="event_date"
    format="Y-m-d"
    display-format="M j, Y"
    label="Event Date"
/>

{{-- Different formats for storage vs display --}}
<x-keys::date-picker
    name="deadline"
    format="Y-m-d H:i:s"
    display-format="j F Y"
    label="Project Deadline"
/>
```

## Date Range Selection

```blade
{{-- Basic date range --}}
<x-keys::date-picker
    name="date_range"
    label="Select Date Range"
    is-range
/>

{{-- Date range with initial values --}}
<x-keys::date-picker
    name="vacation_dates"
    label="Vacation Period"
    is-range
    start-date="2024-06-01"
    end-date="2024-06-15"
/>

{{-- Date range with quick selectors --}}
<x-keys::date-picker
    name="report_period"
    label="Report Period"
    is-range
    quick-selectors
/>
```

## Date Constraints

### Min/Max Dates
```blade
{{-- Only future dates --}}
<x-keys::date-picker
    name="appointment"
    label="Appointment Date"
    :min-date="now()"
    :max-date="now()->addMonths(3)"
/>

{{-- Birth date (past dates only) --}}
<x-keys::date-picker
    name="birth_date"
    label="Date of Birth"
    :max-date="now()->subYears(13)"
/>

{{-- Business days only (Monday to Friday) --}}
<x-keys::date-picker
    name="meeting_date"
    label="Meeting Date"
    :min-date="now()"
    :disabled-dates="$weekends"
/>
```

### Disabled Dates
```blade
{{-- Disable specific dates --}}
<x-keys::date-picker
    name="availability"
    label="Available Date"
    :disabled-dates="['2024-12-25', '2024-12-26', '2024-01-01']"
/>

{{-- Disable weekends --}}
<x-keys::date-picker
    name="business_date"
    label="Business Date"
    :disabled-dates="$weekendDates"
/>
```

## Quick Selectors

### Built-in Quick Selectors
```blade
{{-- Enable default quick selectors --}}
<x-keys::date-picker
    name="report_date"
    label="Report Date"
    :quick-selectors="true"
/>

{{-- For range picker, includes range options --}}
<x-keys::date-picker
    name="analysis_period"
    label="Analysis Period"
    is-range
    :quick-selectors="true"
/>
```

### Custom Quick Selectors
```blade
<x-keys::date-picker
    name="custom_date"
    label="Custom Date"
    :quick-selectors="[
        ['label' => 'Today', 'value' => 'today'],
        ['label' => 'Tomorrow', 'value' => 'tomorrow'],
        ['label' => 'Next Week', 'value' => 'nextweek'],
        ['label' => 'Q1 2024', 'value' => 'q1_2024', 'range' => true]
    ]"
/>
```

## Multiple Months Display

```blade
{{-- Show 2 months side by side --}}
<x-keys::date-picker
    name="travel_dates"
    label="Travel Dates"
    is-range
    :months-to-show="2"
/>

{{-- Show 3 months for quarterly view --}}
<x-keys::date-picker
    name="quarter_view"
    label="Quarter Selection"
    :months-to-show="3"
/>
```

## Inline Calendar

```blade
{{-- Always visible calendar --}}
<x-keys::date-picker
    name="calendar_view"
    label="Select Date"
    inline
/>

{{-- Inline range selector --}}
<x-keys::date-picker
    name="date_range"
    label="Date Range"
    is-range
    inline
    :months-to-show="2"
/>
```

## Size Variants

```blade
<div class="space-y-4">
    <x-keys::date-picker
        name="small_date"
        label="Small Date Picker"
        size="sm"
    />

    <x-keys::date-picker
        name="medium_date"
        label="Medium Date Picker"
        size="md"
    />

    <x-keys::date-picker
        name="large_date"
        label="Large Date Picker"
        size="lg"
    />
</div>
```

## Use Cases

### Event Planning Form
```blade
<form class="space-y-6">
    <x-keys::input name="event_name" label="Event Name" required />

    <x-keys::date-picker
        name="event_date"
        label="Event Date"
        :min-date="now()->addDays(7)"
        :max-date="now()->addYear()"
        format="Y-m-d"
        display-format="F j, Y"
        required
    />

    <x-keys::date-picker
        name="registration_deadline"
        label="Registration Deadline"
        :min-date="now()"
        format="Y-m-d"
        display-format="M j, Y"
    />

    <x-keys::button type="submit" variant="brand">Create Event</x-keys::button>
</form>
```

### Booking System
```blade
<div class="space-y-6">
    <x-keys::date-picker
        name="check_in"
        label="Check-in Date"
        :min-date="now()"
        :disabled-dates="$unavailableDates"
        quick-selectors
    />

    <x-keys::date-picker
        name="check_out"
        label="Check-out Date"
        :min-date="now()->addDay()"
        :disabled-dates="$unavailableDates"
    />

    {{-- Or use range picker --}}
    <x-keys::date-picker
        name="stay_dates"
        label="Stay Period"
        is-range
        :min-date="now()"
        :disabled-dates="$unavailableDates"
        quick-selectors
    />
</div>
```

### Report Generation
```blade
<x-keys::card variant="padded">
    <h3 class="font-semibold mb-4">Generate Report</h3>

    <div class="space-y-4">
        <x-keys::select name="report_type" label="Report Type">
            <x-keys::select.option value="sales" label="Sales Report" />
            <x-keys::select.option value="users" label="User Activity" />
            <x-keys::select.option value="analytics" label="Analytics" />
        </x-keys::select>

        <x-keys::date-picker
            name="report_period"
            label="Report Period"
            is-range
            quick-selectors
            :max-date="now()"
        />

        <x-keys::button variant="brand">Generate Report</x-keys::button>
    </div>
</x-keys::card>
```

### Employee Management
```blade
<form class="space-y-6">
    <x-keys::input name="employee_name" label="Employee Name" required />

    <x-keys::date-picker
        name="birth_date"
        label="Date of Birth"
        :max-date="now()->subYears(16)"
        format="Y-m-d"
        display-format="F j, Y"
    />

    <x-keys::date-picker
        name="hire_date"
        label="Hire Date"
        :min-date="now()->subYears(50)"
        :max-date="now()"
        format="Y-m-d"
        display-format="M j, Y"
    />

    <x-keys::date-picker
        name="vacation_dates"
        label="Planned Vacation"
        is-range
        :min-date="now()"
        quick-selectors
    />
</form>
```

### Project Timeline
```blade
<div class="space-y-4">
    <x-keys::date-picker
        name="project_start"
        label="Project Start Date"
        :min-date="now()"
        format="Y-m-d"
        display-format="M j, Y"
    />

    <x-keys::date-picker
        name="milestones"
        label="Milestone Dates"
        is-range
        :months-to-show="3"
        quick-selectors
    />

    <x-keys::date-picker
        name="deadline"
        label="Project Deadline"
        :min-date="now()->addWeeks(2)"
        format="Y-m-d"
        display-format="F j, Y"
        required
    />
</div>
```

## Form Integration

### Laravel Validation
```blade
<form method="POST">
    @csrf

    <x-keys::date-picker
        name="event_date"
        label="Event Date"
        :value="old('event_date')"
        :errors="$errors"
        required
    />

    <x-keys::date-picker
        name="date_range"
        label="Date Range"
        is-range
        :value="old('date_range')"
        :errors="$errors"
    />

    <x-keys::button type="submit" variant="brand">Submit</x-keys::button>
</form>
```

### Livewire Integration
```blade
<div>
    <x-keys::date-picker
        name="selected_date"
        label="Select Date"
        wire:model.live="selectedDate"
        quick-selectors
    />

    @if($selectedDate)
        <div class="mt-4">
            <x-keys::alert variant="info">
                Selected date: {{ \Carbon\Carbon::parse($selectedDate)->format('F j, Y') }}
            </x-keys::alert>
        </div>
    @endif
</div>
```

## Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- Focus management within calendar
- Date format announcements
- High contrast mode support

## JavaScript Events

```javascript
// Listen for date selection
document.addEventListener('datepicker:changed', function(event) {
    console.log('Date selected:', event.detail.date);
    console.log('Formatted value:', event.detail.formatted);
});

// Range selection events
document.addEventListener('datepicker:rangeChanged', function(event) {
    console.log('Range selected:', event.detail.startDate, event.detail.endDate);
});
```

## CSS Customization

```css
/* Custom calendar styling */
.date-picker-calendar {
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Custom date cell styling */
.date-picker-date {
    transition: all 0.2s ease;
}

.date-picker-date:hover {
    background-color: var(--color-brand-50);
    color: var(--color-brand-700);
}

.date-picker-date.selected {
    background-color: var(--color-brand);
    color: white;
}

/* Range selection styling */
.date-picker-date.in-range {
    background-color: var(--color-brand-100);
    color: var(--color-brand-800);
}
```

## Best Practices

1. **Use appropriate formats** - Match locale expectations
2. **Set reasonable constraints** - Use min/max dates sensibly
3. **Provide clear labels** - Explain date format if unusual
4. **Handle validation** - Show clear error messages
5. **Consider time zones** - Be consistent with date handling
6. **Test accessibility** - Ensure keyboard navigation works
7. **Mobile optimization** - Test on touch devices