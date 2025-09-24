<div class="max-w-6xl mx-auto p-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">Keys UI Select - Livewire Integration Testing</h1>
        <p class="text-foreground/70 mb-4">
            Comprehensive testing of the Select component with Livewire integration across various scenarios.
        </p>

        <!-- Validation Toggle & Status -->
        <div class="flex items-center gap-4 p-4 bg-surface border border-border rounded-lg">
            <label class="flex items-center">
                <input type="checkbox" wire:model.live="validationEnabled" class="mr-2">
                <span class="font-medium">Enable Form Validation</span>
            </label>

            @if($validationEnabled)
                <x-keys::badge color="warning">Validation Enabled</x-keys::badge>
            @else
                <x-keys::badge color="neutral">Validation Disabled</x-keys::badge>
            @endif

            @if($formSubmitted)
                <x-keys::badge color="success">Form Submitted Successfully</x-keys::badge>
            @endif
        </div>
    </div>

    <form wire:submit="submitForm" class="space-y-12">

        <!-- Single Select Components -->
        <section class="space-y-6">
            <div>
                <h2 class="text-2xl font-bold mb-4">Single Select Components</h2>
                <p class="text-foreground/70 mb-6">Testing single-value select components with Livewire binding</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Basic Select -->
                <div>
                    <h3 class="text-lg font-semibold mb-3">Basic Select (wire:model)</h3>
                    <x-keys::select
                        name="basicSelect"
                        wire:model="basicSelect"
                        label="Choose Basic Option"
                        placeholder="Select an option..."
                        :required="$validationEnabled"
                        :errors="$errors->get('basicSelect')"
                    >
                        <x-keys::select.option value="option1" label="Option 1" />
                        <x-keys::select.option value="option2" label="Option 2" />
                        <x-keys::select.option value="option3" label="Option 3" />
                        <x-keys::select.option value="option4" label="Option 4" />
                    </x-keys::select>
                    <p class="text-xs text-muted mt-2">Current value: "{{ $basicSelect }}"</p>
                </div>

                <!-- Searchable Select -->
                <div>
                    <h3 class="text-lg font-semibold mb-3">Searchable Select</h3>
                    <x-keys::select
                        name="searchableSelect"
                        wire:model="searchableSelect"
                        label="Search Countries"
                        placeholder="Search and select..."
                        searchable
                        clearable
                    >
                        @foreach($countries as $code => $name)
                            <x-keys::select.option value="{{ $code }}" label="{{ $name }}" />
                        @endforeach
                    </x-keys::select>
                    <p class="text-xs text-muted mt-2">Current value: "{{ $searchableSelect }}"</p>
                </div>

                <!-- Country Select with Icons -->
                <div>
                    <h3 class="text-lg font-semibold mb-3">Country Select (wire:model.live)</h3>
                    <x-keys::select
                        name="countrySelect"
                        wire:model.live="countrySelect"
                        label="Select Country"
                        placeholder="Choose country..."
                        :required="$validationEnabled"
                        :errors="$errors->get('countrySelect')"
                    >
                        @foreach($countries as $code => $name)
                            <x-keys::select.option
                                value="{{ $code }}"
                                label="{{ $name }}"
                                icon="heroicon-o-flag"
                            />
                        @endforeach
                    </x-keys::select>
                    <p class="text-xs text-muted mt-2">Current value: "{{ $countrySelect }}" (real-time updates)</p>
                </div>

                <!-- Status Select -->
                <div>
                    <h3 class="text-lg font-semibold mb-3">Status Select</h3>
                    <x-keys::select
                        name="statusSelect"
                        wire:model="statusSelect"
                        label="Project Status"
                        placeholder="Select status..."
                    >
                        <x-keys::select.option value="active" label="Active" icon="heroicon-o-check-circle" />
                        <x-keys::select.option value="pending" label="Pending" icon="heroicon-o-clock" />
                        <x-keys::select.option value="completed" label="Completed" icon="heroicon-o-check-badge" />
                        <x-keys::select.option value="cancelled" label="Cancelled" icon="heroicon-o-x-circle" />
                    </x-keys::select>
                    <p class="text-xs text-muted mt-2">Current value: "{{ $statusSelect }}"</p>
                </div>
            </div>
        </section>

        <!-- Multiple Select Components -->
        <section class="space-y-6">
            <div>
                <h2 class="text-2xl font-bold mb-4">Multiple Select Components</h2>
                <p class="text-foreground/70 mb-6">Testing multiple-value select components with array binding</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Skills Multiple Select -->
                <div>
                    <h3 class="text-lg font-semibold mb-3">Skills (Multiple, Required)</h3>
                    <x-keys::select
                        name="multipleSkills"
                        wire:model="multipleSkills"
                        label="Select Skills"
                        placeholder="Choose your skills..."
                        multiple
                        searchable
                        clearable
                        :required="$validationEnabled"
                        :errors="$errors->get('multipleSkills')"
                    >
                        @foreach($skills as $value => $label)
                            <x-keys::select.option
                                value="{{ $value }}"
                                label="{{ $label }}"
                                icon="heroicon-o-code-bracket"
                            />
                        @endforeach
                    </x-keys::select>
                    <p class="text-xs text-muted mt-2">
                        Selected: {{ count($multipleSkills) }} skills
                        @if(count($multipleSkills) > 0)
                            ({{ implode(', ', $multipleSkills) }})
                        @endif
                    </p>

                    <!-- Control buttons for testing -->
                    <div class="flex gap-2 mt-3">
                        <x-keys::button
                            size="sm"
                            variant="ghost"
                            type="button"
                            wire:click="addRandomSkill"
                        >
                            Add Random Skill
                        </x-keys::button>
                        <x-keys::button
                            size="sm"
                            variant="ghost"
                            color="danger"
                            type="button"
                            wire:click="removeAllSkills"
                        >
                            Clear All
                        </x-keys::button>
                    </div>
                </div>

                <!-- Countries Multiple Select -->
                <div>
                    <h3 class="text-lg font-semibold mb-3">Multiple Countries</h3>
                    <x-keys::select
                        name="multipleCountries"
                        wire:model="multipleCountries"
                        label="Select Countries"
                        placeholder="Choose countries..."
                        multiple
                        searchable
                        clearable
                    >
                        @foreach($countries as $code => $name)
                            <x-keys::select.option
                                value="{{ $code }}"
                                label="{{ $name }}"
                                icon="heroicon-o-flag"
                            />
                        @endforeach
                    </x-keys::select>
                    <p class="text-xs text-muted mt-2">
                        Selected: {{ count($multipleCountries) }} countries
                        @if(count($multipleCountries) > 0)
                            ({{ implode(', ', $multipleCountries) }})
                        @endif
                    </p>
                </div>

                <!-- Tags Multiple Select -->
                <div>
                    <h3 class="text-lg font-semibold mb-3">Tags (wire:model.live)</h3>
                    <x-keys::select
                        name="multipleTags"
                        wire:model.live="multipleTags"
                        label="Content Tags"
                        placeholder="Add tags..."
                        multiple
                        searchable
                        clearable
                    >
                        <x-keys::select.option value="important" label="Important" />
                        <x-keys::select.option value="urgent" label="Urgent" />
                        <x-keys::select.option value="review" label="Review" />
                        <x-keys::select.option value="in-progress" label="In Progress" />
                        <x-keys::select.option value="completed" label="Completed" />
                        <x-keys::select.option value="on-hold" label="On Hold" />
                        <x-keys::select.option value="archived" label="Archived" />
                    </x-keys::select>
                    <p class="text-xs text-muted mt-2">
                        Real-time selected: {{ count($multipleTags) }} tags
                        @if(count($multipleTags) > 0)
                            ({{ implode(', ', $multipleTags) }})
                        @endif
                    </p>
                </div>

                <!-- Priorities Multiple Select -->
                <div>
                    <h3 class="text-lg font-semibold mb-3">Priorities</h3>
                    <x-keys::select
                        name="multiplePriorities"
                        wire:model="multiplePriorities"
                        label="Task Priorities"
                        placeholder="Select priorities..."
                        multiple
                        clearable
                    >
                        @foreach($priorities as $value => $label)
                            <x-keys::select.option value="{{ $value }}" label="{{ $label }}" />
                        @endforeach
                    </x-keys::select>
                    <p class="text-xs text-muted mt-2">
                        Selected: {{ count($multiplePriorities) }} priorities
                        @if(count($multiplePriorities) > 0)
                            ({{ implode(', ', $multiplePriorities) }})
                        @endif
                    </p>
                </div>
            </div>
        </section>

        <!-- Dynamic Content Testing -->
        <section class="space-y-6">
            <div>
                <h2 class="text-2xl font-bold mb-4">Dynamic Content & Real-time Updates</h2>
                <p class="text-foreground/70 mb-6">Testing dynamic option loading and real-time synchronization</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Category -> Products -->
                <div>
                    <h3 class="text-lg font-semibold mb-3">Category Selection</h3>
                    <x-keys::select
                        name="selectedCategory"
                        wire:model.live="selectedCategory"
                        label="Product Category"
                        placeholder="Choose category..."
                    >
                        <x-keys::select.option value="electronics" label="Electronics" />
                        <x-keys::select.option value="clothing" label="Clothing" />
                        <x-keys::select.option value="books" label="Books" />
                    </x-keys::select>
                    <p class="text-xs text-muted mt-2">Selected category: "{{ $selectedCategory }}"</p>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-3">Available Products</h3>
                    @if($selectedCategory && count($availableProducts) > 0)
                        <x-keys::select
                            name="selectedProduct"
                            label="Products in {{ ucfirst($selectedCategory) }}"
                            placeholder="Choose product..."
                            searchable
                        >
                            @foreach($availableProducts as $value => $label)
                                <x-keys::select.option value="{{ $value }}" label="{{ $label }}" />
                            @endforeach
                        </x-keys::select>
                        <p class="text-xs text-muted mt-2">{{ count($availableProducts) }} products available</p>
                    @else
                        <div class="p-4 bg-neutral-50 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg text-center">
                            <p class="text-neutral-500">Select a category to see available products</p>
                        </div>
                    @endif
                </div>
            </div>
        </section>

        <!-- Real-time Testing -->
        <section class="space-y-6">
            <div>
                <h2 class="text-2xl font-bold mb-4">Real-time Update Testing</h2>
                <p class="text-foreground/70 mb-6">Testing real-time synchronization with wire:model.live</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 class="text-lg font-semibold mb-3">Real-time Value</h3>
                    <x-keys::select
                        name="realtimeValue"
                        wire:model.live="realtimeValue"
                        label="Real-time Test"
                        placeholder="Select to see instant updates..."
                        clearable
                    >
                        <x-keys::select.option value="test1" label="Test Value 1" />
                        <x-keys::select.option value="test2" label="Test Value 2" />
                        <x-keys::select.option value="test3" label="Test Value 3" />
                        <x-keys::select.option value="test4" label="Test Value 4" />
                    </x-keys::select>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-3">Update Counter</h3>
                    <div class="p-4 bg-surface border border-border rounded-lg">
                        <p class="text-sm mb-2">Current Value: <strong>{{ $realtimeValue ?: '(none)' }}</strong></p>
                        <p class="text-sm">Update Count: <strong>{{ $realtimeCounter }}</strong></p>
                        <p class="text-xs text-muted mt-2">This counter increments every time the real-time value changes</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Form Actions -->
        <section class="space-y-6">
            <div class="flex flex-wrap gap-4">
                <x-keys::button type="submit" size="lg">
                    Submit Form
                </x-keys::button>

                <x-keys::button
                    type="button"
                    variant="ghost"
                    size="lg"
                    wire:click="resetForm"
                >
                    Reset All Values
                </x-keys::button>

                <x-keys::button
                    type="button"
                    variant="ghost"
                    size="lg"
                    wire:click="toggleValidation"
                >
                    {{ $validationEnabled ? 'Disable' : 'Enable' }} Validation
                </x-keys::button>
            </div>
        </section>

    </form>

    <!-- Submission Results -->
    @if($formSubmitted && $lastSubmissionData)
        <section class="mt-12 p-6 bg-surface border border-border rounded-lg">
            <h2 class="text-xl font-bold mb-4">Last Form Submission Data</h2>
            <div class="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg">
                <pre class="text-sm overflow-x-auto">{{ json_encode($lastSubmissionData, JSON_PRETTY_PRINT) }}</pre>
            </div>
            <p class="text-xs text-muted mt-2">
                This data was captured from the Livewire component properties and shows that the select components
                are properly synchronized with the backend.
            </p>
        </section>
    @endif

    <!-- Debug Information -->
    @if(app()->environment('local'))
        <section class="mt-12 p-6 bg-surface border border-border rounded-lg">
            <h2 class="text-xl font-bold mb-4">Debug Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                    <h3 class="font-semibold mb-2">Single Select Values</h3>
                    <ul class="space-y-1 text-xs">
                        <li>Basic Select: {{ $basicSelect ?: '(empty)' }}</li>
                        <li>Searchable: {{ $searchableSelect ?: '(empty)' }}</li>
                        <li>Clearable: {{ $clearableSelect ?: '(empty)' }}</li>
                        <li>Country: {{ $countrySelect ?: '(empty)' }}</li>
                        <li>Status: {{ $statusSelect ?: '(empty)' }}</li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-semibold mb-2">Multiple Select Arrays</h3>
                    <ul class="space-y-1 text-xs">
                        <li>Skills: [{{ implode(', ', $multipleSkills) }}]</li>
                        <li>Tags: [{{ implode(', ', $multipleTags) }}]</li>
                        <li>Countries: [{{ implode(', ', $multipleCountries) }}]</li>
                        <li>Priorities: [{{ implode(', ', $multiplePriorities) }}]</li>
                    </ul>
                </div>
            </div>
        </section>
    @endif
</div>
