<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'name',
        'email',
        'rating',
        'review_text',
        'category',
        'review_date',
        'preferred_time',
        'profile_picture',
        'product_image',
    ];

    protected $casts = [
        'rating' => 'integer',
        'review_date' => 'date',
        'preferred_time' => 'datetime:H:i',
    ];
}
