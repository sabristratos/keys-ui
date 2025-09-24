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

    public function save()
    {
        $this->validate();

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
            $avatarPath = $this->avatar->store('avatars', 'public');
            $userData['avatar_path'] = $avatarPath;
        }

        if ($this->editingUser) {
            $this->editingUser->update($userData);
            $this->editingUser = null;
        } else {
            DemoUser::create($userData);
        }

        $this->reset([
            'first_name', 'last_name', 'email', 'birth_date', 'avatar',
            'department', 'role', 'salary_range', 'skills', 'preferences',
            'status', 'bio', 'is_remote', 'notifications_enabled',
            'priority_level', 'start_date', 'contract_type', 'experience_level'
        ]);

        $this->setDefaultValues();
        $this->loadUsers();

        session()->flash('message', $this->editingUser ? 'User updated successfully!' : 'User created successfully!');
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
            'first_name', 'last_name', 'email', 'birth_date', 'avatar',
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
