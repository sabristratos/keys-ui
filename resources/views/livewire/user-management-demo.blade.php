<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    {{-- Flash Messages --}}
    @if (session()->has('message'))
        <x-keys::alert variant="success" dismissible>
            {{ session('message') }}
        </x-keys::alert>
    @endif

    {{-- Error Messages --}}
    @if (!empty($errorMessage))
        <x-keys::alert variant="danger" dismissible>
            {{ $errorMessage }}
        </x-keys::alert>
    @endif

    {{-- Success Messages --}}
    @if (!empty($successMessage))
        <x-keys::alert variant="success" dismissible>
            {{ $successMessage }}
        </x-keys::alert>
    @endif

    {{-- User Form --}}
    <x-keys::card>
        <x-slot:header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold text-foreground">
                        {{ $editingUser ? 'Edit User' : 'Create New User' }}
                    </h2>
                    <p class="text-sm text-muted mt-1">
                        {{ $editingUser ? 'Update user information' : 'Comprehensive form testing all Keys UI components' }}
                    </p>
                </div>
                @if($editingUser)
                    <x-keys::button variant="outline" wire:click="cancelEdit">
                        Cancel Edit
                    </x-keys::button>
                @endif
            </div>
        </x-slot:header>

        <form wire:submit="save" class="space-y-6">
            {{-- Basic Information --}}
            <div class="space-y-4">
                <h3 class="text-lg font-medium text-foreground border-b border-border pb-2">Basic Information</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <x-keys::input
                        wire:model="first_name"
                        label="First Name"
                        placeholder="Enter first name"
                        required
                    />

                    <x-keys::input
                        wire:model="last_name"
                        label="Last Name"
                        placeholder="Enter last name"
                        required
                    />
                </div>

                <x-keys::input
                    wire:model="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter email address"
                    icon="heroicon-o-envelope"
                    required
                />

                <x-keys::date-picker
                    wire:model="birth_date"
                    label="Birth Date"
                    placeholder="Select birth date"
                    format="Y-m-d"
                    displayFormat="M j, Y"
                    required
                />

                {{-- Profile Avatar --}}
                <x-keys::file-upload
                    wire:model="avatar"
                    name="avatar"
                    label="Profile Avatar"
                    accept="image/*"
                    maxSize="2MB"
                    :errors="$errors->get('avatar')"
                    optional
                />
            </div>

            {{-- Work Information --}}
            <div class="space-y-4">
                <h3 class="text-lg font-medium text-foreground border-b border-border pb-2">Work Information</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <x-keys::select wire:model="department" label="Department" placeholder="Select department">
                        @foreach($departments as $key => $label)
                            <x-keys::select.option value="{{ $key }}" label="{{ $label }}" />
                        @endforeach
                    </x-keys::select>

                    <x-keys::select wire:model="role" label="Role" placeholder="Select role">
                        @foreach($roles as $key => $label)
                            <x-keys::select.option value="{{ $key }}" label="{{ $label }}" />
                        @endforeach
                    </x-keys::select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <x-keys::select wire:model="salary_range" label="Salary Range" placeholder="Select salary range">
                        @foreach($salaryRanges as $key => $label)
                            <x-keys::select.option value="{{ $key }}" label="{{ $label }}" />
                        @endforeach
                    </x-keys::select>

                    <x-keys::select wire:model="contract_type" label="Contract Type" placeholder="Select contract type">
                        @foreach($contractTypes as $key => $label)
                            <x-keys::select.option value="{{ $key }}" label="{{ $label }}" />
                        @endforeach
                    </x-keys::select>
                </div>

                <x-keys::date-picker
                    wire:model="start_date"
                    label="Start Date"
                    placeholder="Select start date"
                    format="Y-m-d"
                    displayFormat="M j, Y"
                    required
                />

                <x-keys::range
                    wire:model="experience_level"
                    label="Experience Level (Years)"
                    min="0"
                    max="50"
                    step="1"
                />
            </div>

            {{-- Skills & Preferences --}}
            <div class="space-y-4">
                <h3 class="text-lg font-medium text-foreground border-b border-border pb-2">Skills & Preferences</h3>

                <x-keys::select
                    wire:model="skills"
                    label="Skills"
                    placeholder="Select skills"
                    multiple
                    searchable
                >
                    @foreach($skillsOptions as $key => $label)
                        <x-keys::select.option value="{{ $key }}" label="{{ $label }}" />
                    @endforeach
                </x-keys::select>

                <div class="space-y-3">
                    <label class="block text-sm font-medium text-foreground">Work Preferences</label>

                    <x-keys::checkbox
                        wire:model="is_remote"
                        label="Remote Work"
                        description="Can work remotely"
                        variant="card"
                        color="brand"
                    />

                    <x-keys::checkbox
                        wire:model="notifications_enabled"
                        label="Email Notifications"
                        description="Receive email notifications"
                        variant="card"
                        color="success"
                    />
                </div>
            </div>

            {{-- Status & Priority --}}
            <div class="space-y-4">
                <h3 class="text-lg font-medium text-foreground border-b border-border pb-2">Status & Settings</h3>

                <div class="space-y-3">
                    <label class="block text-sm font-medium text-foreground">User Status</label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        @foreach($statuses as $key => $label)
                            <x-keys::radio
                                wire:model="status"
                                value="{{ $key }}"
                                label="{{ $label }}"
                                variant="card"
                                :color="match($key) {
                                    'active' => 'success',
                                    'pending' => 'warning',
                                    'suspended' => 'danger',
                                    default => 'neutral'
                                }"
                            />
                        @endforeach
                    </div>
                </div>

                <div class="space-y-3">
                    <label class="block text-sm font-medium text-foreground">Priority Level</label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        @foreach($priorityLevels as $key => $label)
                            <x-keys::radio
                                wire:model="priority_level"
                                value="{{ $key }}"
                                label="{{ $label }}"
                                variant="card"
                                :color="match($key) {
                                    'urgent' => 'danger',
                                    'high' => 'warning',
                                    'medium' => 'brand',
                                    'low' => 'success',
                                    default => 'neutral'
                                }"
                            />
                        @endforeach
                    </div>
                </div>

                {{-- Supporting Documents Note --}}
                <div class="p-4 bg-surface border border-border rounded-lg">
                    <div class="flex items-start gap-3">
                        <x-keys::icon name="heroicon-o-information-circle" size="sm" class="text-brand mt-0.5" />
                        <div>
                            <p class="text-sm font-medium text-foreground mb-1">Supporting Documents</p>
                            <p class="text-sm text-muted">
                                The file upload component currently supports single file uploads.
                                Multiple file upload functionality will be added in a future update.
                            </p>
                            <p class="text-xs text-muted mt-2">
                                For now, you can use the current avatar upload field to test file upload functionality.
                            </p>
                        </div>
                    </div>
                </div>

                <x-keys::textarea
                    wire:model="bio"
                    label="Bio"
                    placeholder="Enter user bio..."
                    rows="3"
                />
            </div>

            {{-- Submit Button --}}
            <div class="flex justify-end pt-4 border-t border-border">
                <x-keys::button type="submit" variant="brand" size="lg">
                    {{ $editingUser ? 'Update User' : 'Create User' }}
                </x-keys::button>
            </div>
        </form>
    </x-keys::card>

    {{-- Users Table --}}
    <x-keys::card>
        <x-slot:header>
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-semibold text-foreground">Users</h2>
                    <p class="text-sm text-muted mt-1">
                        {{ count($users) }} {{ Str::plural('user', count($users)) }} total
                    </p>
                </div>
            </div>
        </x-slot:header>

        @if(count($users) > 0)
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="border-b border-border">
                        <tr class="text-left">
                            <th class="pb-3 text-sm font-medium text-muted">User</th>
                            <th class="pb-3 text-sm font-medium text-muted">Department</th>
                            <th class="pb-3 text-sm font-medium text-muted">Status</th>
                            <th class="pb-3 text-sm font-medium text-muted">Priority</th>
                            <th class="pb-3 text-sm font-medium text-muted">Skills</th>
                            <th class="pb-3 text-sm font-medium text-muted">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                        @foreach($users as $user)
                            <tr class="hover:bg-surface transition-colors">
                                <td class="py-4">
                                    <div class="flex items-center gap-3">
                                        <x-keys::avatar
                                            :src="$user->avatar_path ? asset('storage/' . $user->avatar_path) : null"
                                            :name="$user->full_name"
                                            size="md"
                                        />
                                        <div>
                                            <div class="font-medium text-foreground">{{ $user->full_name }}</div>
                                            <div class="text-sm text-muted">{{ $user->email }}</div>
                                            <div class="text-xs text-muted flex items-center gap-2">
                                                {{ $user->role }} • {{ $user->contract_type }}
                                                @if($user->attachments && count($user->attachments) > 0)
                                                    <span class="inline-flex items-center gap-1 text-brand">
                                                        <x-keys::icon name="heroicon-s-paper-clip" size="xs" />
                                                        {{ count($user->attachments) }}
                                                    </span>
                                                @endif
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-4">
                                    <x-keys::badge variant="simple" color="brand">
                                        {{ $departments[$user->department] ?? $user->department }}
                                    </x-keys::badge>
                                </td>
                                <td class="py-4">
                                    <x-keys::badge
                                        variant="simple"
                                        :color="$user->status_color"
                                    >
                                        {{ $statuses[$user->status] ?? $user->status }}
                                    </x-keys::badge>
                                </td>
                                <td class="py-4">
                                    <x-keys::badge
                                        variant="simple"
                                        :color="$user->priority_color"
                                    >
                                        {{ $priorityLevels[$user->priority_level] ?? $user->priority_level }}
                                    </x-keys::badge>
                                </td>
                                <td class="py-4">
                                    <div class="flex flex-wrap gap-1 max-w-xs">
                                        @foreach(array_slice($user->skills ?? [], 0, 3) as $skill)
                                            <x-keys::badge variant="chip" color="neutral" size="xs">
                                                {{ $skillsOptions[$skill] ?? $skill }}
                                            </x-keys::badge>
                                        @endforeach
                                        @if(count($user->skills ?? []) > 3)
                                            <x-keys::badge variant="chip" color="muted" size="xs">
                                                +{{ count($user->skills) - 3 }} more
                                            </x-keys::badge>
                                        @endif
                                    </div>
                                </td>
                                <td class="py-4">
                                    <div class="flex items-center gap-2">
                                        <x-keys::button
                                            variant="ghost"
                                            size="sm"
                                            wire:click="editUser({{ $user->id }})"
                                            icon="heroicon-o-pencil"
                                        />
                                        <x-keys::button
                                            variant="ghost"
                                            size="sm"
                                            wire:click="confirmDelete({{ $user->id }})"
                                            icon="heroicon-o-trash"
                                            color="danger"
                                        />
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @else
            <div class="text-center py-12">
                <x-keys::icon name="heroicon-o-users" size="xl" class="mx-auto text-muted mb-4" />
                <h3 class="text-lg font-medium text-foreground mb-2">No users found</h3>
                <p class="text-muted mb-4">Get started by creating your first user above.</p>
            </div>
        @endif
    </x-keys::card>

    {{-- Delete Confirmation Modal --}}
    @if($showDeleteConfirm)
        <x-keys::modal
            wire:model="showDeleteConfirm"
            size="sm"
        >
            <x-slot:header>
                <h3 class="text-lg font-semibold text-foreground">Confirm Delete</h3>
            </x-slot:header>

            <div class="py-4">
                <p class="text-muted">
                    Are you sure you want to delete this user? This action cannot be undone.
                </p>
            </div>

            <x-slot:footer>
                <div class="flex justify-end gap-3">
                    <x-keys::button variant="outline" wire:click="cancelDelete">
                        Cancel
                    </x-keys::button>
                    <x-keys::button variant="danger" wire:click="deleteUser">
                        Delete User
                    </x-keys::button>
                </div>
            </x-slot:footer>
        </x-keys::modal>
    @endif
</div>
