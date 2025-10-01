<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class DemoUser extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'birth_date',
        'avatar_path',
        'department',
        'role',
        'salary_range',
        'skills',
        'preferences',
        'status',
        'bio',
        'is_remote',
        'notifications_enabled',
        'priority_level',
        'start_date',
        'contract_type',
        'experience_level',
        'attachments',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'start_date' => 'date',
        'skills' => 'array',
        'preferences' => 'array',
        'attachments' => 'array',
        'is_remote' => 'boolean',
        'notifications_enabled' => 'boolean',
        'experience_level' => 'integer',
    ];

    
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getInitialsAttribute(): string
    {
        return strtoupper(substr($this->first_name, 0, 1) . substr($this->last_name, 0, 1));
    }

    public function getFormattedSalaryAttribute(): string
    {
        return match ($this->salary_range) {
            '30k-50k' => '$30,000 - $50,000',
            '50k-70k' => '$50,000 - $70,000',
            '70k-100k' => '$70,000 - $100,000',
            '100k-150k' => '$100,000 - $150,000',
            '150k+' => '$150,000+',
            default => 'Not specified',
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'active' => 'success',
            'inactive' => 'neutral',
            'pending' => 'warning',
            'suspended' => 'danger',
            default => 'neutral',
        };
    }

    public function getPriorityColorAttribute(): string
    {
        return match ($this->priority_level) {
            'urgent' => 'danger',
            'high' => 'warning',
            'medium' => 'brand',
            'low' => 'success',
            default => 'neutral',
        };
    }

    
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeByDepartment(Builder $query, string $department): Builder
    {
        return $query->where('department', $department);
    }

    public function scopeRemote(Builder $query): Builder
    {
        return $query->where('is_remote', true);
    }

    public function scopeByPriority(Builder $query, string $priority): Builder
    {
        return $query->where('priority_level', $priority);
    }

    
    public static function getDepartments(): array
    {
        return [
            'engineering' => 'Engineering',
            'design' => 'Design',
            'marketing' => 'Marketing',
            'sales' => 'Sales',
            'hr' => 'Human Resources',
            'finance' => 'Finance',
            'operations' => 'Operations',
            'support' => 'Customer Support',
        ];
    }

    public static function getRoles(): array
    {
        return [
            'junior' => 'Junior',
            'mid' => 'Mid-level',
            'senior' => 'Senior',
            'lead' => 'Team Lead',
            'manager' => 'Manager',
            'director' => 'Director',
            'vp' => 'Vice President',
            'c-level' => 'C-Level',
        ];
    }

    public static function getSkillsOptions(): array
    {
        return [
            'php' => 'PHP',
            'javascript' => 'JavaScript',
            'python' => 'Python',
            'react' => 'React',
            'vue' => 'Vue.js',
            'laravel' => 'Laravel',
            'tailwind' => 'Tailwind CSS',
            'docker' => 'Docker',
            'aws' => 'AWS',
            'mysql' => 'MySQL',
            'postgresql' => 'PostgreSQL',
            'redis' => 'Redis',
            'elasticsearch' => 'Elasticsearch',
            'typescript' => 'TypeScript',
            'node' => 'Node.js',
            'go' => 'Go',
            'rust' => 'Rust',
            'kubernetes' => 'Kubernetes',
            'terraform' => 'Terraform',
            'figma' => 'Figma',
            'photoshop' => 'Photoshop',
            'illustrator' => 'Illustrator',
        ];
    }

    public static function getSalaryRanges(): array
    {
        return [
            '30k-50k' => '$30,000 - $50,000',
            '50k-70k' => '$50,000 - $70,000',
            '70k-100k' => '$70,000 - $100,000',
            '100k-150k' => '$100,000 - $150,000',
            '150k+' => '$150,000+',
        ];
    }

    public static function getContractTypes(): array
    {
        return [
            'full-time' => 'Full-time',
            'part-time' => 'Part-time',
            'contract' => 'Contract',
            'freelance' => 'Freelance',
            'intern' => 'Intern',
        ];
    }

    public static function getStatuses(): array
    {
        return [
            'active' => 'Active',
            'inactive' => 'Inactive',
            'pending' => 'Pending',
            'suspended' => 'Suspended',
        ];
    }

    public static function getPriorityLevels(): array
    {
        return [
            'urgent' => 'Urgent',
            'high' => 'High Priority',
            'medium' => 'Medium Priority',
            'low' => 'Low Priority',
        ];
    }
}
