<x-layouts.simple>
    <div class="space-y-8">
        {{-- Toggle Test Section --}}
        <div class="p-6 bg-surface rounded-lg border border-line shadow-sm">
            <h2 class="text-xl font-semibold mb-4 text-heading">Toggle Component Test</h2>
            <p class="text-sm text-muted mb-4">Click the toggle below and observe if the viewport shrinks or disappears.</p>

            <div class="space-y-4">
                <x-keys::toggle
                    name="test_toggle_1"
                    label="Basic Toggle"
                    description="This is a basic toggle component"
                />

                <x-keys::toggle
                    name="test_toggle_2"
                    label="Toggle with Hint"
                    description="Toggle description here"
                    hint="This is a hint message"
                />

                <x-keys::toggle
                    name="test_toggle_3"
                    label="Disabled Toggle"
                    disabled
                />
            </div>
        </div>

        {{-- Rating Test Section - Interactive --}}
        <div class="p-6 bg-surface rounded-lg border border-line shadow-sm">
            <h2 class="text-xl font-semibold mb-4 text-heading">Rating Component Test (Interactive)</h2>
            <p class="text-sm text-muted mb-4">Click on the stars and observe if the viewport shrinks or disappears.</p>

            <div class="space-y-4">
                <div>
                    <p class="text-sm font-medium mb-2">Default Size</p>
                    <x-keys::rating
                        name="test_rating_1"
                        :max="5"
                        show-count
                    />
                </div>

                <div>
                    <p class="text-sm font-medium mb-2">Large Size</p>
                    <x-keys::rating
                        name="test_rating_2"
                        :max="5"
                        size="lg"
                        show-count
                    />
                </div>

                <div>
                    <p class="text-sm font-medium mb-2">With Label (Shorthand)</p>
                    <x-keys::rating
                        name="test_rating_3"
                        label="Rate this product"
                        hint="Select 1-5 stars"
                        :max="5"
                        show-count
                    />
                </div>
            </div>
        </div>

        {{-- Rating Test Section - Readonly --}}
        <div class="p-6 bg-surface rounded-lg border border-line shadow-sm">
            <h2 class="text-xl font-semibold mb-4 text-heading">Rating Component Test (Readonly)</h2>
            <p class="text-sm text-muted mb-4">These are display-only ratings with decimal values.</p>

            <div class="space-y-4">
                <div>
                    <p class="text-sm font-medium mb-2">4.5 Stars</p>
                    <x-keys::rating :value="4.5" :max="5" readonly />
                </div>

                <div>
                    <p class="text-sm font-medium mb-2">3 Stars</p>
                    <x-keys::rating :value="3" :max="5" readonly />
                </div>

                <div>
                    <p class="text-sm font-medium mb-2">5 Stars (Small)</p>
                    <x-keys::rating :value="5" :max="5" readonly size="sm" />
                </div>
            </div>
        </div>

        {{-- Browser Info --}}
        <div class="p-6 bg-surface rounded-lg border border-line shadow-sm">
            <h2 class="text-xl font-semibold mb-4 text-heading">Debug Info</h2>
            <div class="text-sm text-muted space-y-1">
                <p><strong>Viewport:</strong> <span id="viewport-info"></span></p>
                <p><strong>Body Overflow:</strong> <span id="body-overflow"></span></p>
                <p><strong>HTML Overflow:</strong> <span id="html-overflow"></span></p>
            </div>
        </div>
    </div>

    @push('scripts')
    <script>
        // Display debug info
        function updateDebugInfo() {
            document.getElementById('viewport-info').textContent =
                `${window.innerWidth}x${window.innerHeight}`;

            document.getElementById('body-overflow').textContent =
                getComputedStyle(document.body).overflow;

            document.getElementById('html-overflow').textContent =
                getComputedStyle(document.documentElement).overflow;
        }

        // Update on load
        updateDebugInfo();

        // Update on resize
        window.addEventListener('resize', updateDebugInfo);

        // Log clicks for debugging
        document.addEventListener('click', (e) => {
            console.log('Click detected:', {
                target: e.target,
                type: e.target.type,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            });
        });
    </script>
    @endpush
</x-layouts.simple>
