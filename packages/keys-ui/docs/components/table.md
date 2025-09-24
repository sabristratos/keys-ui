# Table Component

Comprehensive data tables with sorting, pagination, selection, and responsive features for displaying structured data.

## Basic Usage

```blade
{{-- Simple table --}}
<x-keys::table>
    <x-slot:header>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
        </tr>
    </x-slot:header>

    @foreach($users as $user)
        <tr>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
            <td>{{ $user->role }}</td>
            <td>
                <x-keys::button size="sm" variant="ghost">Edit</x-keys::button>
            </td>
        </tr>
    @endforeach
</x-keys::table>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `striped` | boolean | `false` | Alternating row colors |
| `hover` | boolean | `false` | Hover effects on rows |
| `size` | string | `md` | Size: `sm`, `md`, `lg` |
| `paginate` | Paginator | `null` | Laravel pagination object |
| `bordered` | boolean | `false` | Add border around table |
| `responsive` | boolean | `true` | Enable horizontal scrolling |
| `selectable` | boolean | `false` | Enable row selection |
| `selection-name` | string | `selected[]` | Name for selection checkboxes |
| `selected-ids` | array | `[]` | Pre-selected row IDs |
| `livewire-selection-method` | string | `null` | Livewire method for selection |
| `loading` | boolean | `false` | Show loading state |
| `loading-text` | string | `Loading...` | Loading message |
| `loading-animation` | string | `spinner` | Loading animation type |

## Table Variants

### Striped Table
```blade
<x-keys::table striped>
    <x-slot:header>
        <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
        </tr>
    </x-slot:header>

    @foreach($products as $product)
        <tr>
            <td>{{ $product->name }}</td>
            <td>${{ $product->price }}</td>
            <td>{{ $product->stock }}</td>
        </tr>
    @endforeach
</x-keys::table>
```

### Hover Effects
```blade
<x-keys::table hover>
    <x-slot:header>
        <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
        </tr>
    </x-slot:header>

    @foreach($orders as $order)
        <tr>
            <td>#{{ $order->id }}</td>
            <td>{{ $order->customer->name }}</td>
            <td>
                <x-keys::badge color="{{ $order->status_color }}">
                    {{ $order->status }}
                </x-keys::badge>
            </td>
            <td>${{ $order->total }}</td>
        </tr>
    @endforeach
</x-keys::table>
```

### Bordered Table
```blade
<x-keys::table bordered striped>
    <x-slot:header>
        <tr>
            <th>Metric</th>
            <th>Current</th>
            <th>Previous</th>
            <th>Change</th>
        </tr>
    </x-slot:header>

    @foreach($metrics as $metric)
        <tr>
            <td class="font-medium">{{ $metric->name }}</td>
            <td>{{ $metric->current_value }}</td>
            <td>{{ $metric->previous_value }}</td>
            <td>
                <span class="{{ $metric->change >= 0 ? 'text-success-600' : 'text-danger-600' }}">
                    {{ $metric->change > 0 ? '+' : '' }}{{ $metric->change }}%
                </span>
            </td>
        </tr>
    @endforeach
</x-keys::table>
```

## Size Variants

```blade
{{-- Small table --}}
<x-keys::table size="sm" striped>
    <x-slot:header>
        <tr>
            <th>Name</th>
            <th>Value</th>
        </tr>
    </x-slot:header>
    <!-- Compact rows -->
</x-keys::table>

{{-- Large table --}}
<x-keys::table size="lg" hover>
    <x-slot:header>
        <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
    </x-slot:header>
    <!-- Spacious rows -->
</x-keys::table>
```

## Selectable Tables

### Basic Selection
```blade
<x-keys::table selectable selection-name="user_ids[]">
    <x-slot:header>
        <tr>
            <th>
                <x-keys::checkbox name="select_all" id="select-all" />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
        </tr>
    </x-slot:header>

    @foreach($users as $user)
        <tr>
            <td>
                <x-keys::checkbox
                    name="user_ids[]"
                    :value="$user->id"
                    class="select-row"
                />
            </td>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
            <td>
                <x-keys::badge color="{{ $user->is_active ? 'success' : 'neutral' }}">
                    {{ $user->is_active ? 'Active' : 'Inactive' }}
                </x-keys::badge>
            </td>
        </tr>
    @endforeach
</x-keys::table>
```

### Livewire Selection
```blade
<x-keys::table
    selectable
    :selected-ids="$selectedUsers"
    livewire-selection-method="toggleUserSelection"
>
    <x-slot:header>
        <tr>
            <th>
                <x-keys::checkbox
                    :checked="count($selectedUsers) === $users->count()"
                    wire:click="toggleAllUsers"
                />
            </th>
            <th>User</th>
            <th>Department</th>
            <th>Last Login</th>
        </tr>
    </x-slot:header>

    @foreach($users as $user)
        <tr class="{{ in_array($user->id, $selectedUsers) ? 'bg-brand-50' : '' }}">
            <td>
                <x-keys::checkbox
                    :checked="in_array($user->id, $selectedUsers)"
                    wire:click="toggleUserSelection({{ $user->id }})"
                />
            </td>
            <td>
                <div class="flex items-center gap-3">
                    <x-keys::avatar
                        src="{{ $user->avatar }}"
                        name="{{ $user->name }}"
                        size="xs"
                    />
                    <span>{{ $user->name }}</span>
                </div>
            </td>
            <td>{{ $user->department }}</td>
            <td>{{ $user->last_login_at?->diffForHumans() ?? 'Never' }}</td>
        </tr>
    @endforeach
</x-keys::table>
```

## Pagination Integration

```blade
<x-keys::table :paginate="$users" striped hover>
    <x-slot:header>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Created</th>
            <th>Actions</th>
        </tr>
    </x-slot:header>

    @foreach($users as $user)
        <tr>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
            <td>{{ $user->created_at->format('M j, Y') }}</td>
            <td>
                <div class="flex gap-2">
                    <x-keys::button size="sm" variant="ghost">Edit</x-keys::button>
                    <x-keys::button size="sm" variant="ghost">Delete</x-keys::button>
                </div>
            </td>
        </tr>
    @endforeach
</x-keys::table>

{{-- Pagination info and links are automatically rendered --}}
```

## Loading States

```blade
<x-keys::table
    :loading="$isLoading"
    loading-text="Fetching data..."
    loading-animation="spinner"
    striped
>
    <x-slot:header>
        <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Date</th>
        </tr>
    </x-slot:header>

    @if(!$isLoading)
        @foreach($items as $item)
            <tr>
                <td>{{ $item->title }}</td>
                <td>{{ $item->status }}</td>
                <td>{{ $item->date }}</td>
            </tr>
        @endforeach
    @endif
</x-keys::table>
```

## Responsive Tables

```blade
{{-- Horizontal scroll on small screens --}}
<x-keys::table responsive bordered>
    <x-slot:header>
        <tr>
            <th class="whitespace-nowrap">Product Name</th>
            <th class="whitespace-nowrap">SKU</th>
            <th class="whitespace-nowrap">Category</th>
            <th class="whitespace-nowrap">Price</th>
            <th class="whitespace-nowrap">Stock</th>
            <th class="whitespace-nowrap">Last Updated</th>
            <th class="whitespace-nowrap">Actions</th>
        </tr>
    </x-slot:header>

    @foreach($products as $product)
        <tr>
            <td class="whitespace-nowrap">{{ $product->name }}</td>
            <td class="whitespace-nowrap">{{ $product->sku }}</td>
            <td class="whitespace-nowrap">{{ $product->category }}</td>
            <td class="whitespace-nowrap">${{ $product->price }}</td>
            <td class="whitespace-nowrap">{{ $product->stock }}</td>
            <td class="whitespace-nowrap">{{ $product->updated_at->format('M j, Y') }}</td>
            <td class="whitespace-nowrap">
                <x-keys::dropdown>
                    <x-slot:trigger>
                        <x-keys::button size="sm" variant="ghost">
                            <x-keys::icon name="heroicon-o-ellipsis-horizontal" />
                        </x-keys::button>
                    </x-slot:trigger>
                    <div class="space-y-1">
                        <button class="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-100">Edit</button>
                        <button class="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-100">View</button>
                        <button class="block w-full text-left px-3 py-2 text-sm hover:bg-red-100 text-red-700">Delete</button>
                    </div>
                </x-keys::dropdown>
            </td>
        </tr>
    @endforeach
</x-keys::table>
```

## Advanced Use Cases

### Data Dashboard
```blade
<x-keys::card variant="padded">
    <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold">Recent Transactions</h2>
        <div class="flex gap-2">
            <x-keys::button size="sm" variant="ghost">Export</x-keys::button>
            <x-keys::button size="sm" variant="brand">Add Transaction</x-keys::button>
        </div>
    </div>

    <x-keys::table striped hover :paginate="$transactions">
        <x-slot:header>
            <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
            </tr>
        </x-slot:header>

        @foreach($transactions as $transaction)
            <tr>
                <td class="font-mono text-sm">#{{ $transaction->id }}</td>
                <td>{{ $transaction->description }}</td>
                <td class="font-medium {{ $transaction->amount >= 0 ? 'text-success-600' : 'text-danger-600' }}">
                    {{ $transaction->amount >= 0 ? '+' : '' }}${{ number_format(abs($transaction->amount), 2) }}
                </td>
                <td>
                    <x-keys::badge color="{{ $transaction->status_color }}">
                        {{ $transaction->status }}
                    </x-keys::badge>
                </td>
                <td>{{ $transaction->created_at->format('M j, Y H:i') }}</td>
                <td>
                    <x-keys::button size="sm" variant="ghost">View</x-keys::button>
                </td>
            </tr>
        @endforeach
    </x-keys::table>
</x-keys::card>
```

### User Management
```blade
<div class="space-y-4">
    {{-- Action bar --}}
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
            <x-keys::input
                name="search"
                placeholder="Search users..."
                icon-left="heroicon-o-magnifying-glass"
                clearable
                wire:model.live.debounce.300ms="search"
            />
            <x-keys::select name="role" wire:model.live="roleFilter">
                <x-keys::select.option value="" label="All Roles" />
                <x-keys::select.option value="admin" label="Admin" />
                <x-keys::select.option value="user" label="User" />
            </x-keys::select>
        </div>

        <div class="flex gap-2">
            <x-keys::button variant="ghost" :disabled="empty($selectedUsers)">
                Bulk Actions
            </x-keys::button>
            <x-keys::button variant="brand">Add User</x-keys::button>
        </div>
    </div>

    {{-- Table --}}
    <x-keys::table
        selectable
        :selected-ids="$selectedUsers"
        striped
        hover
        :paginate="$users"
    >
        <x-slot:header>
            <tr>
                <th>
                    <x-keys::checkbox
                        :checked="count($selectedUsers) === $users->count()"
                        wire:click="toggleAllUsers"
                    />
                </th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
            </tr>
        </x-slot:header>

        @foreach($users as $user)
            <tr class="{{ in_array($user->id, $selectedUsers) ? 'bg-brand-50' : '' }}">
                <td>
                    <x-keys::checkbox
                        :checked="in_array($user->id, $selectedUsers)"
                        wire:click="toggleUserSelection({{ $user->id }})"
                    />
                </td>
                <td>
                    <div class="flex items-center gap-3">
                        <x-keys::avatar
                            src="{{ $user->avatar }}"
                            name="{{ $user->name }}"
                            size="sm"
                            status="{{ $user->is_online ? 'online' : 'offline' }}"
                        />
                        <div>
                            <div class="font-medium">{{ $user->name }}</div>
                            <div class="text-sm text-neutral-600">{{ $user->username }}</div>
                        </div>
                    </div>
                </td>
                <td>{{ $user->email }}</td>
                <td>
                    <x-keys::badge color="{{ $user->role === 'admin' ? 'brand' : 'neutral' }}">
                        {{ ucfirst($user->role) }}
                    </x-keys::badge>
                </td>
                <td>
                    <x-keys::badge color="{{ $user->is_active ? 'success' : 'warning' }}">
                        {{ $user->is_active ? 'Active' : 'Suspended' }}
                    </x-keys::badge>
                </td>
                <td>{{ $user->last_login_at?->diffForHumans() ?? 'Never' }}</td>
                <td>
                    <x-keys::dropdown>
                        <x-slot:trigger>
                            <x-keys::button size="sm" variant="ghost">
                                <x-keys::icon name="heroicon-o-ellipsis-horizontal" />
                            </x-keys::button>
                        </x-slot:trigger>
                        <div class="space-y-1">
                            <button wire:click="editUser({{ $user->id }})" class="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-100">
                                Edit
                            </button>
                            <button wire:click="viewUser({{ $user->id }})" class="block w-full text-left px-3 py-2 text-sm hover:bg-neutral-100">
                                View Profile
                            </button>
                            @if($user->is_active)
                                <button wire:click="suspendUser({{ $user->id }})" class="block w-full text-left px-3 py-2 text-sm hover:bg-red-100 text-red-700">
                                    Suspend
                                </button>
                            @else
                                <button wire:click="activateUser({{ $user->id }})" class="block w-full text-left px-3 py-2 text-sm hover:bg-green-100 text-green-700">
                                    Activate
                                </button>
                            @endif
                        </div>
                    </x-keys::dropdown>
                </td>
            </tr>
        @endforeach
    </x-keys::table>
</div>
```

## Empty States

```blade
<x-keys::table striped>
    <x-slot:header>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
        </tr>
    </x-slot:header>

    @forelse($users as $user)
        <tr>
            <td>{{ $user->name }}</td>
            <td>{{ $user->email }}</td>
            <td>{{ $user->status }}</td>
        </tr>
    @empty
        <tr>
            <td colspan="3" class="text-center py-12">
                <div class="flex flex-col items-center">
                    <x-keys::icon name="heroicon-o-users" size="xl" class="text-neutral-400 mb-4" />
                    <h3 class="font-semibold mb-2">No users found</h3>
                    <p class="text-neutral-600 mb-4">Get started by adding your first user.</p>
                    <x-keys::button variant="brand">Add User</x-keys::button>
                </div>
            </td>
        </tr>
    @endforelse
</x-keys::table>
```

## Accessibility

- Proper table headers with scope attributes
- ARIA labels for interactive elements
- Keyboard navigation for selectable rows
- Screen reader announcements for sort changes
- High contrast mode support

## Best Practices

1. **Use semantic HTML** - Proper table structure with thead/tbody
2. **Keep headers descriptive** - Clear column labeling
3. **Limit column count** - Consider responsive design
4. **Provide sorting feedback** - Visual indicators for sort state
5. **Handle empty states** - Show helpful messages when no data
6. **Optimize for mobile** - Use responsive patterns
7. **Test accessibility** - Verify screen reader compatibility