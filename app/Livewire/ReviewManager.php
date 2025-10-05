<?php

namespace App\Livewire;

use App\Models\Review;
use Livewire\Component;
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class ReviewManager extends Component
{
    use WithFileUploads;

    #[Validate('required|string|max:255')]
    public $name = '';

    #[Validate('required|email|max:255')]
    public $email = '';

    #[Validate('required|integer|min:1|max:5')]
    public $rating = 5;

    #[Validate('required|string|min:10')]
    public $review_text = '';

    #[Validate('required|string')]
    public $category = '';

    #[Validate('required|date')]
    public $review_date = '';

    #[Validate('nullable|date_format:H:i')]
    public $preferred_time = '';

    #[Validate('nullable|image|max:2048')]
    public $profile_picture = null;

    #[Validate('nullable|image|max:2048')]
    public $product_image = null;

    public function submitReview()
    {
        try {
            $this->validate();
        } catch (\Illuminate\Validation\ValidationException $e) {
            $this->dispatch('showToast',
                variant: 'danger',
                title: 'Validation Error',
                message: 'Please fill in all required fields correctly.'
            );
            throw $e;
        }

        $reviewData = [
            'name' => $this->name,
            'email' => $this->email,
            'rating' => $this->rating,
            'review_text' => $this->review_text,
            'category' => $this->category,
            'review_date' => $this->review_date,
            'preferred_time' => $this->preferred_time,
        ];

        if ($this->profile_picture) {
            $reviewData['profile_picture'] = $this->profile_picture->store('reviews/profiles', 'public');
        }

        if ($this->product_image) {
            $reviewData['product_image'] = $this->product_image->store('reviews/products', 'public');
        }

        Review::create($reviewData);

        $this->reset(['name', 'email', 'review_text', 'category', 'review_date', 'preferred_time', 'profile_picture', 'product_image']);
        $this->rating = 5;

        $this->dispatch('showToast',
            variant: 'success',
            title: 'Review Submitted',
            message: 'Your review has been submitted successfully!'
        );

        $this->dispatch('review-created');
    }

    public function reviews()
    {
        return Review::latest()->get();
    }

    public function render()
    {
        return view('livewire.review-manager', [
            'reviews' => $this->reviews(),
        ]);
    }
}
