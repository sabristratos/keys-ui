<?php

namespace App\Livewire;

use App\Models\DemoUser;
use Livewire\Attributes\Validate;
use Livewire\Component;
use Livewire\WithFileUploads;

class UserManagementDemo extends Component
{
    use WithFileUploads;

    #[Validate('required|string|min:2|max:50')]
    public $first_name = '';

    #[Validate('required|string|min:2|max:50')]
    public $last_name = '';

    #[Validate('required|email|unique:demo_users,email')]
    public $email = '';

    #[Validate('required|date|before:today')]
    public $birth_date = '';

    #[Validate('nullable|image|max:2048')]
    public $avatar;

    #[Validate('nullable|array|max:5')]
    public $attachments = [];

    #[Validate('required|string')]
    public $department = '';

    #[Validate('required|string')]
    public $role = '';

    #[Validate('required|string')]
    public $salary_range = '';

    public $skills = [];

    public $preferences = [];

    #[Validate('required|string')]
    public $status = 'active';

    #[Validate('nullable|string|max:500')]
    public $bio = '';

    public $is_remote = false;

    public $notifications_enabled = true;

    #[Validate('required|string')]
    public $priority_level = 'medium';

    #[Validate('required|date|after_or_equal:2020-01-01')]
    public $start_date = '';

    #[Validate('required|string')]
    public $contract_type = '';

    #[Validate('required|integer|min:0|max:50')]
    public $experience_level = 0;

    public $users = [];
    public $editingUser = null;
    public $showDeleteConfirm = false;
    public $userToDelete = null;

    public function mount()
    {
        $this->loadUsers();
        $this->setDefaultValues();
    }

    public function setDefaultValues()
    {
        $this->start_date = now()->format('Y-m-d');
        $this->birth_date = now()->subYears(25)->format('Y-m-d');
        $this->department = 'engineering';
        $this->role = 'mid';
        $this->salary_range = '70k-100k';
        $this->contract_type = 'full-time';
        $this->skills = ['php', 'laravel'];
        $this->preferences = ['remote_work' => true, 'flexible_hours' => true];
    }

    public function loadUsers()
    {
        $this->users = DemoUser::latest()->get();
    }

    public $errorMessage = '';
    public $successMessage = '';

    public function save()
    {
        try {
            
            $this->errorMessage = '';
            $this->successMessage = '';

            
            $this->validate();

            $isEditing = $this->editingUser !== null;

            $userData = [
                'first_name' => $this->first_name,
                'last_name' => $this->last_name,
                'email' => $this->email,
                'birth_date' => $this->birth_date,
                'department' => $this->department,
                'role' => $this->role,
                'salary_range' => $this->salary_range,
                'skills' => $this->skills,
                'preferences' => $this->preferences,
                'status' => $this->status,
                'bio' => $this->bio,
                'is_remote' => $this->is_remote,
                'notifications_enabled' => $this->notifications_enabled,
                'priority_level' => $this->priority_level,
                'start_date' => $this->start_date,
                'contract_type' => $this->contract_type,
                'experience_level' => $this->experience_level,
            ];

            
            if ($this->avatar) {
                try {
                    $avatarPath = $this->avatar->store('avatars', 'public');
                    $userData['avatar_path'] = $avatarPath;
                } catch (\Exception $e) {
                    $this->errorMessage = 'Failed to upload avatar: ' . $e->getMessage();
                    return;
                }
            }

            
            if (!empty($this->attachments)) {
                try {
                    $attachmentPaths = [];
                    foreach ($this->attachments as $attachment) {
                        $attachmentPaths[] = $attachment->store('attachments', 'public');
                    }
                    $userData['attachments'] = $attachmentPaths;
                } catch (\Exception $e) {
                    $this->errorMessage = 'Failed to upload attachments: ' . $e->getMessage();
                    return;
                }
            }

            
            if ($isEditing) {
                $this->editingUser->update($userData);
                $this->editingUser = null;
                $this->successMessage = 'User updated successfully!';
            } else {
                $user = DemoUser::create($userData);
                if (!$user) {
                    $this->errorMessage = 'Failed to create user. Please try again.';
                    return;
                }
                $this->successMessage = 'User created successfully!';
            }

            
            $this->reset([
                'first_name', 'last_name', 'email', 'birth_date', 'avatar', 'attachments',
                'department', 'role', 'salary_range', 'skills', 'preferences',
                'status', 'bio', 'is_remote', 'notifications_enabled',
                'priority_level', 'start_date', 'contract_type', 'experience_level'
            ]);

            $this->setDefaultValues();
            $this->loadUsers();

        } catch (\Illuminate\Validation\ValidationException $e) {
            
            $this->errorMessage = 'Please fix the validation errors below.';

            
            logger('Validation failed during user creation:', [
                'validation_errors' => $e->errors(),
                'form_data' => collect($userData ?? [])->except(['avatar_path', 'attachments'])->toArray(),
                'user' => auth()->user()?->email ?? 'guest',
                'timestamp' => now()->toISOString()
            ]);
            throw $e;
        } catch (\Exception $e) {
            $this->errorMessage = 'An unexpected error occurred: ' . $e->getMessage();

            
            logger('User creation error:', [
                'error' => $e->getMessage(),
                'exception_class' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'form_data' => collect($userData ?? [])->except(['avatar_path', 'attachments'])->toArray(),
                'user' => auth()->user()?->email ?? 'guest',
                'timestamp' => now()->toISOString(),
                'memory_usage' => memory_get_usage(true),
                'component_state' => [
                    'editing_user' => $this->editingUser?->id,
                    'has_avatar' => !empty($this->avatar),
                    'has_attachments' => !empty($this->attachments)
                ]
            ]);
        }
    }

    public function editUser($userId)
    {
        $user = DemoUser::find($userId);

        if ($user) {
            $this->editingUser = $user;
            $this->first_name = $user->first_name;
            $this->last_name = $user->last_name;
            $this->email = $user->email;
            $this->birth_date = $user->birth_date->format('Y-m-d');
            $this->department = $user->department;
            $this->role = $user->role;
            $this->salary_range = $user->salary_range;
            $this->skills = $user->skills ?? [];
            $this->preferences = $user->preferences ?? [];
            $this->attachments = []; 
            $this->status = $user->status;
            $this->bio = $user->bio;
            $this->is_remote = $user->is_remote;
            $this->notifications_enabled = $user->notifications_enabled;
            $this->priority_level = $user->priority_level;
            $this->start_date = $user->start_date->format('Y-m-d');
            $this->contract_type = $user->contract_type;
            $this->experience_level = $user->experience_level;
        }
    }

    public function cancelEdit()
    {
        $this->editingUser = null;
        $this->reset([
            'first_name', 'last_name', 'email', 'birth_date', 'avatar', 'attachments',
            'department', 'role', 'salary_range', 'skills', 'preferences',
            'status', 'bio', 'is_remote', 'notifications_enabled',
            'priority_level', 'start_date', 'contract_type', 'experience_level'
        ]);
        $this->setDefaultValues();
    }

    public function confirmDelete($userId)
    {
        $this->userToDelete = $userId;
        $this->showDeleteConfirm = true;
    }

    public function deleteUser()
    {
        if ($this->userToDelete) {
            $user = DemoUser::find($this->userToDelete);
            if ($user) {
                
                if ($user->avatar_path) {
                    \Storage::disk('public')->delete($user->avatar_path);
                }
                if ($user->attachments) {
                    foreach ($user->attachments as $attachment) {
                        \Storage::disk('public')->delete($attachment);
                    }
                }
                $user->delete();
                $this->loadUsers();
                session()->flash('message', 'User deleted successfully!');
            }
        }

        $this->showDeleteConfirm = false;
        $this->userToDelete = null;
    }

    public function cancelDelete()
    {
        $this->showDeleteConfirm = false;
        $this->userToDelete = null;
    }

    public function render()
    {
        return view('livewire.user-management-demo', [
            'departments' => DemoUser::getDepartments(),
            'roles' => DemoUser::getRoles(),
            'skillsOptions' => DemoUser::getSkillsOptions(),
            'salaryRanges' => DemoUser::getSalaryRanges(),
            'contractTypes' => DemoUser::getContractTypes(),
            'statuses' => DemoUser::getStatuses(),
            'priorityLevels' => DemoUser::getPriorityLevels(),
        ])->layout('components.layouts.app', ['title' => 'User Management Demo']);
    }
}
