# Avatar Stack Component

Overlapping avatar displays for showing teams, groups, or multiple users with configurable spacing and direction.

## Basic Usage

```blade
{{-- Basic avatar stack --}}
<x-keys::avatar.stack>
    <x-keys::avatar name="John Doe" />
    <x-keys::avatar name="Jane Smith" />
    <x-keys::avatar name="Bob Wilson" />
</x-keys::avatar.stack>

{{-- With size inheritance --}}
<x-keys::avatar.stack size="lg">
    <x-keys::avatar name="Team Lead" color="brand" />
    <x-keys::avatar name="Developer" color="success" />
    <x-keys::avatar name="Designer" color="purple" />
</x-keys::avatar.stack>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `max` | integer | `5` | Maximum avatars to show (validation only, 1-10) |
| `size` | string | `md` | Size passed to child avatars: `xs`, `sm`, `md`, `lg`, `xl` |
| `spacing` | string | `default` | Overlap spacing: `tight`, `default`, `loose` |
| `direction` | string | `ltr` | Stacking direction: `ltr`, `rtl` |

## Size Variants

The stack passes the size prop to all child avatars:

```blade
{{-- Extra small stack --}}
<x-keys::avatar.stack size="xs">
    <x-keys::avatar name="User 1" />
    <x-keys::avatar name="User 2" />
    <x-keys::avatar name="User 3" />
</x-keys::avatar.stack>

{{-- Large stack --}}
<x-keys::avatar.stack size="lg">
    <x-keys::avatar name="User 1" color="brand" />
    <x-keys::avatar name="User 2" color="success" />
    <x-keys::avatar name="User 3" color="warning" />
</x-keys::avatar.stack>
```

## Spacing Options

```blade
{{-- Tight spacing - more overlap --}}
<x-keys::avatar.stack spacing="tight">
    <x-keys::avatar name="John Doe" />
    <x-keys::avatar name="Jane Smith" />
    <x-keys::avatar name="Bob Wilson" />
</x-keys::avatar.stack>

{{-- Default spacing --}}
<x-keys::avatar.stack spacing="default">
    <x-keys::avatar name="John Doe" />
    <x-keys::avatar name="Jane Smith" />
    <x-keys::avatar name="Bob Wilson" />
</x-keys::avatar.stack>

{{-- Loose spacing - less overlap --}}
<x-keys::avatar.stack spacing="loose">
    <x-keys::avatar name="John Doe" />
    <x-keys::avatar name="Jane Smith" />
    <x-keys::avatar name="Bob Wilson" />
</x-keys::avatar.stack>
```

## Direction Control

```blade
{{-- Left-to-right stacking (default) --}}
<x-keys::avatar.stack direction="ltr">
    <x-keys::avatar name="First" color="brand" />
    <x-keys::avatar name="Second" color="success" />
    <x-keys::avatar name="Third" color="warning" />
</x-keys::avatar.stack>

{{-- Right-to-left stacking --}}
<x-keys::avatar.stack direction="rtl">
    <x-keys::avatar name="First" color="brand" />
    <x-keys::avatar name="Second" color="success" />
    <x-keys::avatar name="Third" color="warning" />
</x-keys::avatar.stack>
```

## Use Cases

### Team Display
```blade
<div class="flex items-center gap-4">
    <div>
        <h3 class="font-semibold">Project Team</h3>
        <p class="text-sm text-neutral-500">{{ $project->team->count() }} members</p>
    </div>

    <x-keys::avatar.stack size="md" spacing="tight">
        @foreach($project->team->take(4) as $member)
            <x-keys::avatar
                src="{{ $member->avatar }}"
                name="{{ $member->name }}"
                status="{{ $member->status }}"
            />
        @endforeach

        @if($project->team->count() > 4)
            <x-keys::avatar color="neutral">
                +{{ $project->team->count() - 4 }}
            </x-keys::avatar>
        @endif
    </x-keys::avatar.stack>
</div>
```

### Recent Activity
```blade
<div class="space-y-4">
    @foreach($activities as $activity)
        <div class="flex items-center gap-3">
            <x-keys::avatar.stack size="sm" spacing="tight">
                @foreach($activity->users->take(3) as $user)
                    <x-keys::avatar
                        src="{{ $user->avatar }}"
                        name="{{ $user->name }}"
                    />
                @endforeach
            </x-keys::avatar.stack>

            <div class="flex-1">
                <p class="text-sm">
                    {{ $activity->users->pluck('name')->join(', ', ' and ') }}
                    {{ $activity->description }}
                </p>
                <p class="text-xs text-neutral-500">{{ $activity->created_at->diffForHumans() }}</p>
            </div>
        </div>
    @endforeach
</div>
```

### Collaboration Indicator
```blade
<div class="flex items-center justify-between p-4 border rounded-lg">
    <div>
        <h4 class="font-medium">Document.pdf</h4>
        <p class="text-sm text-neutral-500">Last edited 2 hours ago</p>
    </div>

    <div class="flex items-center gap-3">
        <x-keys::badge color="success" size="xs">3 online</x-keys::badge>

        <x-keys::avatar.stack size="sm" spacing="tight">
            <x-keys::avatar name="Editor 1" status="online" color="success" />
            <x-keys::avatar name="Editor 2" status="online" color="success" />
            <x-keys::avatar name="Editor 3" status="away" color="warning" />
            <x-keys::avatar name="Editor 4" status="offline" color="neutral" />
        </x-keys::avatar.stack>
    </div>
</div>
```

### Event Attendees
```blade
<div class="event-card">
    <h3 class="font-semibold">Weekly Standup</h3>
    <p class="text-sm text-neutral-500 mb-3">Today at 10:00 AM</p>

    <div class="flex items-center justify-between">
        <x-keys::avatar.stack size="md">
            @foreach($event->attendees->take(5) as $attendee)
                <x-keys::avatar
                    src="{{ $attendee->avatar }}"
                    name="{{ $attendee->name }}"
                    border
                />
            @endforeach

            @if($event->attendees->count() > 5)
                <div class="avatar-more">
                    +{{ $event->attendees->count() - 5 }}
                </div>
            @endif
        </x-keys::avatar.stack>

        <x-keys::button variant="brand" size="sm">Join</x-keys::button>
    </div>
</div>
```

### Notification Groups
```blade
<div class="space-y-3">
    @foreach($notifications->groupBy('type') as $type => $groupedNotifications)
        <div class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
            <x-keys::avatar.stack size="xs" spacing="tight">
                @foreach($groupedNotifications->take(3)->pluck('user') as $user)
                    <x-keys::avatar
                        src="{{ $user->avatar }}"
                        name="{{ $user->name }}"
                    />
                @endforeach
            </x-keys::avatar.stack>

            <div class="flex-1">
                <p class="text-sm">
                    @if($groupedNotifications->count() === 1)
                        {{ $groupedNotifications->first()->user->name }} {{ $type }}
                    @else
                        {{ $groupedNotifications->count() }} people {{ $type }}
                    @endif
                </p>
                <p class="text-xs text-neutral-500">
                    {{ $groupedNotifications->first()->created_at->diffForHumans() }}
                </p>
            </div>
        </div>
    @endforeach
</div>
```

### Chat Participants
```blade
<div class="chat-header flex items-center justify-between p-4 border-b">
    <div class="flex items-center gap-3">
        <h2 class="font-semibold">Team Chat</h2>
        <x-keys::badge color="success" size="xs">
            {{ $chat->activeUsers->count() }} online
        </x-keys::badge>
    </div>

    <x-keys::avatar.stack size="sm" spacing="default">
        @foreach($chat->activeUsers as $user)
            <x-keys::avatar
                src="{{ $user->avatar }}"
                name="{{ $user->name }}"
                status="online"
                border
            />
        @endforeach
    </x-keys::avatar.stack>
</div>
```

## Advanced Patterns

### With "+N More" Counter
```blade
<x-keys::avatar.stack size="md" spacing="tight">
    @foreach($users->take(3) as $user)
        <x-keys::avatar
            src="{{ $user->avatar }}"
            name="{{ $user->name }}"
        />
    @endforeach

    @if($users->count() > 3)
        <x-keys::avatar color="neutral" border>
            +{{ $users->count() - 3 }}
        </x-keys::avatar>
    @endif
</x-keys::avatar.stack>
```

### Interactive Stack
```blade
<div x-data="{ showAll: false }">
    <div class="flex items-center gap-3">
        <x-keys::avatar.stack size="md" spacing="tight">
            @foreach($team->take(4) as $member)
                <x-keys::avatar
                    src="{{ $member->avatar }}"
                    name="{{ $member->name }}"
                    status="{{ $member->status }}"
                />
            @endforeach
        </x-keys::avatar.stack>

        @if($team->count() > 4)
            <button
                @click="showAll = !showAll"
                class="text-sm text-brand-600 hover:text-brand-700"
            >
                {{ showAll ? 'Show Less' : 'Show All (' . $team->count() . ')' }}
            </button>
        @endif
    </div>

    <div x-show="showAll" x-collapse class="mt-4">
        <div class="grid grid-cols-2 gap-3">
            @foreach($team as $member)
                <div class="flex items-center gap-2">
                    <x-keys::avatar
                        src="{{ $member->avatar }}"
                        name="{{ $member->name }}"
                        size="xs"
                        status="{{ $member->status }}"
                    />
                    <span class="text-sm">{{ $member->name }}</span>
                </div>
            @endforeach
        </div>
    </div>
</div>
```

## CSS Customization

```css
/* Custom stack spacing */
[data-keys-avatar-stack][data-spacing="custom"] .avatar {
    margin-left: -0.75rem;
}

/* Custom hover effects */
[data-keys-avatar-stack]:hover .avatar {
    transform: translateX(0.25rem);
    transition: transform 0.2s ease;
}

/* Custom direction animations */
[data-keys-avatar-stack][data-direction="rtl"] .avatar {
    margin-right: -0.5rem;
    margin-left: 0;
}

/* Stack border effects */
[data-keys-avatar-stack] .avatar {
    border: 2px solid white;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}
```

## Accessibility

- Proper ARIA labels for stack groups
- Screen reader support for user counts
- Keyboard navigation for interactive stacks
- Focus management for individual avatars
- High contrast mode support

## Data Attributes

```html
<div
    data-keys-avatar-stack="true"
    data-size="md"
    data-spacing="tight"
    data-direction="ltr"
    data-max="5"
>
```

## Performance Considerations

- Efficient rendering for large user lists
- Lazy loading for avatar images
- Optimized CSS for smooth animations
- Memory-efficient event handling