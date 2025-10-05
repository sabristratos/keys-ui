<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\Rule;

class SelectTest extends Component
{
    
    #[Rule('required')]
    public $basicSelect = '';

    public $searchableSelect = '';
    public $clearableSelect = '';
    public $countrySelect = '';
    public $statusSelect = '';

    
    #[Rule('required|array|min:1')]
    public $multipleSkills = [];

    public $multipleTags = [];
    public $multipleCountries = [];
    public $multiplePriorities = [];

    
    public $selectedCategory = '';
    public $availableProducts = [];

    
    public $validationEnabled = false;
    public $formSubmitted = false;
    public $lastSubmissionData = null;

    
    public $realtimeValue = '';
    public $realtimeCounter = 0;

    
    public $countries = [
        'us' => 'United States',
        'uk' => 'United Kingdom',
        'ca' => 'Canada',
        'au' => 'Australia',
        'de' => 'Germany',
        'fr' => 'France',
        'jp' => 'Japan',
        'cn' => 'China',
    ];

    
    public $skills = [
        'php' => 'PHP',
        'javascript' => 'JavaScript',
        'python' => 'Python',
        'react' => 'React',
        'vue' => 'Vue.js',
        'laravel' => 'Laravel',
        'tailwind' => 'Tailwind CSS',
        'docker' => 'Docker',
    ];

    
    public $priorities = [
        'urgent' => 'Urgent',
        'high' => 'High Priority',
        'medium' => 'Medium Priority',
        'low' => 'Low Priority',
        'backlog' => 'Backlog',
    ];

    
    public $categoryProducts = [
        'electronics' => [
            'laptop' => 'Laptop Computer',
            'smartphone' => 'Smartphone',
            'tablet' => 'Tablet',
            'headphones' => 'Wireless Headphones',
        ],
        'clothing' => [
            'shirt' => 'T-Shirt',
            'jeans' => 'Jeans',
            'dress' => 'Summer Dress',
            'jacket' => 'Winter Jacket',
        ],
        'books' => [
            'fiction' => 'Fiction Novel',
            'technical' => 'Technical Manual',
            'biography' => 'Biography',
            'cookbook' => 'Cookbook',
        ],
    ];

    public function mount()
    {
        
        $this->basicSelect = 'option2';
        $this->multipleSkills = ['php', 'laravel'];
        $this->countrySelect = 'us';
        $this->statusSelect = 'active';
    }

    public function updatedSelectedCategory($value)
    {
        
        $this->availableProducts = $this->categoryProducts[$value] ?? [];
        $this->reset(['formSubmitted', 'lastSubmissionData']);
    }

    public function updatedRealtimeValue($value)
    {
        $this->realtimeCounter++;
    }

    public function toggleValidation()
    {
        $this->validationEnabled = !$this->validationEnabled;
        $this->reset(['formSubmitted', 'lastSubmissionData']);
    }

    public function submitForm()
    {
        if ($this->validationEnabled) {
            $this->validate([
                'basicSelect' => 'required',
                'multipleSkills' => 'required|array|min:1',
                'countrySelect' => 'required',
            ]);
        }

        $this->formSubmitted = true;
        $this->lastSubmissionData = [
            'basicSelect' => $this->basicSelect,
            'searchableSelect' => $this->searchableSelect,
            'clearableSelect' => $this->clearableSelect,
            'countrySelect' => $this->countrySelect,
            'statusSelect' => $this->statusSelect,
            'multipleSkills' => $this->multipleSkills,
            'multipleTags' => $this->multipleTags,
            'multipleCountries' => $this->multipleCountries,
            'multiplePriorities' => $this->multiplePriorities,
            'selectedCategory' => $this->selectedCategory,
            'realtimeValue' => $this->realtimeValue,
            'timestamp' => now()->format('Y-m-d H:i:s'),
        ];
    }

    public function resetForm()
    {
        $this->reset([
            'basicSelect',
            'searchableSelect',
            'clearableSelect',
            'countrySelect',
            'statusSelect',
            'multipleSkills',
            'multipleTags',
            'multipleCountries',
            'multiplePriorities',
            'selectedCategory',
            'availableProducts',
            'realtimeValue',
            'realtimeCounter',
            'formSubmitted',
            'lastSubmissionData',
        ]);

        
        $this->mount();
    }

    public function addRandomSkill()
    {
        $availableSkills = array_diff(array_keys($this->skills), $this->multipleSkills);
        if (!empty($availableSkills)) {
            $randomSkill = $availableSkills[array_rand($availableSkills)];
            $this->multipleSkills[] = $randomSkill;
        }
    }

    public function removeAllSkills()
    {
        $this->multipleSkills = [];
    }

    public function render()
    {
        return view('livewire.select-test');
    }
}