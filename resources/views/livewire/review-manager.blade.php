<div class="max-w-7xl mx-auto p-6 space-y-8">
    {{-- Review Form --}}
    <x-keys::card>
        <x-keys::card.header>
            <x-keys::heading level="h2" size="xl" color="heading" weight="semibold">
                Submit a Review
            </x-keys::heading>
        </x-keys::card.header>

        <x-keys::card.body>
            <form wire:submit="submitReview" class="space-y-6">
                {{-- Name and Email Row --}}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <x-keys::input
                        name="name"
                        wire:model="name"
                        label="Your Name"
                        placeholder="John Doe"
                        required
                    />

                    <x-keys::input
                        name="email"
                        type="email"
                        wire:model="email"
                        label="Email Address"
                        placeholder="john@example.com"
                        required
                    />
                </div>

                {{-- Rating --}}
                <div>
                    <x-keys::rating
                        name="rating"
                        wire:model.live="rating"
                        :value="$rating"
                        label="Rating"
                        :max="5"
                        :readonly="false"
                        show-count
                        size="lg"
                        color="warning"
                        :errors="$errors->get('rating')"
                    />
                </div>

                {{-- Category Select, Review Date, Preferred Time --}}
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <x-keys::select
                        name="category"
                        wire:model="category"
                        label="Review Category"
                        placeholder="Select a category"
                        required
                        :errors="$errors->get('category')"
                    >
                        <x-keys::select.option value="Product Review">Product Review</x-keys::select.option>
                        <x-keys::select.option value="Service Review">Service Review</x-keys::select.option>
                        <x-keys::select.option value="General Feedback">General Feedback</x-keys::select.option>
                    </x-keys::select>

                    <x-keys::date-picker
                        name="review_date"
                        wire:model="review_date"
                        label="Review Date"
                        placeholder="Select date"
                        required
                        :errors="$errors->get('review_date')"
                    />

                    <x-keys::timepicker
                        name="preferred_time"
                        wire:model="preferred_time"
                        label="Preferred Contact Time"
                        placeholder="Select time"
                        :errors="$errors->get('preferred_time')"
                    />
                </div>

                {{-- Review Text --}}
                <x-keys::textarea
                    name="review_text"
                    wire:model="review_text"
                    label="Your Review"
                    rows="4"
                    placeholder="Share your experience..."
                    required
                />

                {{-- File Uploads --}}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <x-keys::file-upload
                            name="profile_picture"
                            label="Profile Picture (Optional)"
                            accept="image/*"
                            max-size="2MB"
                            :errors="$errors->get('profile_picture')"
                        />
                    </div>

                    <div>
                        <x-keys::file-upload
                            name="product_image"
                            label="Product Image (Optional)"
                            accept="image/*"
                            max-size="2MB"
                            :errors="$errors->get('product_image')"
                        />
                    </div>
                </div>

                {{-- Submit Button --}}
                <div class="flex justify-end">
                    <x-keys::button
                        type="submit"
                        color="primary"
                        loading-text="Submitting..."
                    >
                        Submit Review
                    </x-keys::button>
                </div>
            </form>
        </x-keys::card.body>
    </x-keys::card>

    {{-- Reviews Table --}}
    <x-keys::card>
        <x-keys::card.header>
            <x-keys::heading level="h2" size="xl" color="heading" weight="semibold">
                Recent Reviews
            </x-keys::heading>
        </x-keys::card.header>

        <x-keys::card.body>
            @if($reviews->count() > 0)
                <x-keys::table>
                    <x-keys::table.head>
                        <x-keys::table.row>
                            <x-keys::table.header>Profile</x-keys::table.header>
                            <x-keys::table.header>Name</x-keys::table.header>
                            <x-keys::table.header>Email</x-keys::table.header>
                            <x-keys::table.header>Category</x-keys::table.header>
                            <x-keys::table.header>Review Date</x-keys::table.header>
                            <x-keys::table.header>Preferred Time</x-keys::table.header>
                            <x-keys::table.header>Rating</x-keys::table.header>
                            <x-keys::table.header>Review</x-keys::table.header>
                            <x-keys::table.header>Product</x-keys::table.header>
                            <x-keys::table.header>Submitted</x-keys::table.header>
                        </x-keys::table.row>
                    </x-keys::table.head>

                    <x-keys::table.body>
                        @foreach($reviews as $review)
                            <x-keys::table.row wire:key="review-{{ $review->id }}">
                                <x-keys::table.cell>
                                    @if($review->profile_picture)
                                        <x-keys::avatar
                                            :src="asset('storage/' . $review->profile_picture)"
                                            :alt="$review->name"
                                            size="sm"
                                        />
                                    @else
                                        <x-keys::avatar
                                            :name="$review->name"
                                            size="sm"
                                        />
                                    @endif
                                </x-keys::table.cell>

                                <x-keys::table.cell>
                                    <x-keys::text element="span" size="sm" weight="medium" color="text">
                                        {{ $review->name }}
                                    </x-keys::text>
                                </x-keys::table.cell>

                                <x-keys::table.cell>
                                    <x-keys::text element="span" size="sm" color="muted">
                                        {{ $review->email }}
                                    </x-keys::text>
                                </x-keys::table.cell>

                                <x-keys::table.cell>
                                    <x-keys::badge variant="info" size="sm">
                                        {{ $review->category ?? 'N/A' }}
                                    </x-keys::badge>
                                </x-keys::table.cell>

                                <x-keys::table.cell>
                                    <x-keys::text element="span" size="sm" color="text">
                                        {{ $review->review_date ? $review->review_date->format('M d, Y') : 'N/A' }}
                                    </x-keys::text>
                                </x-keys::table.cell>

                                <x-keys::table.cell>
                                    <x-keys::text element="span" size="sm" color="muted">
                                        {{ $review->preferred_time ? $review->preferred_time->format('g:i A') : 'N/A' }}
                                    </x-keys::text>
                                </x-keys::table.cell>

                                <x-keys::table.cell>
                                    <div class="flex items-center gap-1">
                                        @for ($i = 1; $i <= 5; $i++)
                                            <x-keys::icon
                                                :name="$i <= $review->rating ? 'heroicon-s-star' : 'heroicon-o-star'"
                                                size="xs"
                                                class="{{ $i <= $review->rating ? 'text-warning' : 'text-muted' }}"
                                            />
                                        @endfor
                                    </div>
                                </x-keys::table.cell>

                                <x-keys::table.cell>
                                    <x-keys::text element="div" size="sm" color="text" class="max-w-xs truncate">
                                        {{ $review->review_text }}
                                    </x-keys::text>
                                </x-keys::table.cell>

                                <x-keys::table.cell>
                                    @if($review->product_image)
                                        <img
                                            src="{{ asset('storage/' . $review->product_image) }}"
                                            alt="Product"
                                            class="w-12 h-12 object-cover rounded"
                                        />
                                    @else
                                        <x-keys::text element="span" size="sm" color="muted">
                                            No image
                                        </x-keys::text>
                                    @endif
                                </x-keys::table.cell>

                                <x-keys::table.cell>
                                    <x-keys::text element="span" size="sm" color="muted">
                                        {{ $review->created_at->diffForHumans() }}
                                    </x-keys::text>
                                </x-keys::table.cell>
                            </x-keys::table.row>
                        @endforeach
                    </x-keys::table.body>
                </x-keys::table>
            @else
                <x-keys::empty-state
                    icon="heroicon-o-chat-bubble-left-right"
                    title="No reviews yet"
                    description="Be the first to submit a review!"
                />
            @endif
        </x-keys::card.body>
    </x-keys::card>
</div>
