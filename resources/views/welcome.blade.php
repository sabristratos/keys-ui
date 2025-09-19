<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @vite(['resources/css/app.css', 'resources/js/app.js'])
        @keysAssets
    </head>
    <body class="bg-body text-foreground font-sans">
        <script>
            // Prevent FOUC and handle initial theme detection
            (function() {
                const theme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (theme === 'dark' || (!theme && systemDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                }
            })();
        </script>
        <div class="min-h-screen p-8">
            <div class="max-w-4xl mx-auto">
                <header class="text-center mb-8">
                    <h1 class="text-3xl font-bold mb-3">Keys UI Components Testing</h1>
                    <p class="text-foreground/60 mb-4">
                        Testing Image and Calendar components after refactoring
                    </p>
                    <div class="flex justify-center gap-2 p-1 bg-surface rounded-lg border border-border">
                        <button
                            onclick="setTheme('light')"
                            class="theme-btn px-3 py-1.5 text-sm font-medium rounded transition-colors"
                            data-theme="light"
                        >
                            Light
                        </button>
                        <button
                            onclick="setTheme('dark')"
                            class="theme-btn px-3 py-1.5 text-sm font-medium rounded transition-colors"
                            data-theme="dark"
                        >
                            Dark
                        </button>
                        <button
                            onclick="setTheme('system')"
                            class="theme-btn px-3 py-1.5 text-sm font-medium rounded transition-colors"
                            data-theme="system"
                        >
                            System
                        </button>
                    </div>

                    <script>
                        function setTheme(theme) {
                            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                            if (theme === 'system') {
                                localStorage.removeItem('theme');
                                document.documentElement.classList.toggle('dark', systemDark);
                                document.documentElement.style.colorScheme = systemDark ? 'dark' : 'light';
                            } else {
                                localStorage.setItem('theme', theme);
                                document.documentElement.classList.toggle('dark', theme === 'dark');
                                document.documentElement.style.colorScheme = theme;
                            }

                            updateThemeButtons();
                        }

                        function updateThemeButtons() {
                            const currentTheme = localStorage.getItem('theme') || 'system';

                            document.querySelectorAll('.theme-btn').forEach(btn => {
                                if (btn.dataset.theme === currentTheme) {
                                    btn.classList.add('bg-brand', 'text-foreground-brand');
                                    btn.classList.remove('hover:bg-surface');
                                } else {
                                    btn.classList.remove('bg-brand', 'text-foreground-brand');
                                    btn.classList.add('hover:bg-surface');
                                }
                            });
                        }

                        // Initialize theme buttons
                        updateThemeButtons();

                        // Listen for system theme changes
                        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                            if (!localStorage.getItem('theme')) {
                                document.documentElement.classList.toggle('dark', e.matches);
                                document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light';
                            }
                        });
                    </script>
                </header>

                <div class="space-y-12">
                    <!-- Image Component -->
                    <section class="space-y-6">
                        <div>
                            <h2 class="text-2xl font-bold mb-4">Image Component</h2>
                            <p class="text-foreground/70 mb-6">Responsive images with overlays, aspect ratios, and captions</p>
                        </div>
                        <!-- Hero Image with Overlay -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Hero Image with Gradient Overlay (Built-in)</h3>
                            <x-keys::image
                                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
                                alt="Cozy bedroom with neatly made bed"
                                size="full"
                                aspect-ratio="wide"
                                radius="lg"
                                overlay="gradient-bottom"
                                overlay-color="black"
                                overlay-opacity="60"
                            >
                                <div class="text-white">
                                    <h3 class="text-2xl font-bold mb-2">Luxury Bedroom Suite</h3>
                                    <p class="text-white/90 mb-4">Experience ultimate comfort in our premium accommodations with modern amenities and stunning city views.</p>
                                    <x-keys::button variant="brand" size="md">
                                        Book Now
                                    </x-keys::button>
                                </div>
                            </x-keys::image>
                        </div>

                        <!-- Additional overlay examples -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 class="text-lg font-semibold mb-3">Gradient Top Overlay</h3>
                                <x-keys::image
                                    src="https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80"
                                    alt="Coffee shop interior"
                                    size="full"
                                    aspect-ratio="photo"
                                    radius="md"
                                    overlay="gradient-top"
                                    overlay-color="brand"
                                    overlay-opacity="70"
                                    caption="Gradient from top with brand color"
                                />
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold mb-3">Solid Overlay</h3>
                                <x-keys::image
                                    src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80"
                                    alt="Mountain landscape"
                                    size="full"
                                    aspect-ratio="photo"
                                    radius="md"
                                    overlay="solid"
                                    overlay-color="black"
                                    overlay-opacity="40"
                                    caption="Solid overlay for text readability"
                                >
                                    <div class="text-white text-center">
                                        <h4 class="text-xl font-bold">Adventure Awaits</h4>
                                        <p class="text-white/80">Explore the mountains</p>
                                    </div>
                                </x-keys::image>
                            </div>
                        </div>
                    </section>

                    <!-- Calendar Component - Multi-Month Range Demo -->
                    <section class="space-y-6">
                        <div>
                            <h2 class="text-2xl font-bold mb-4">Calendar Component - Multi-Month Range Demo</h2>
                            <p class="text-foreground/70 mb-6">Testing calendar functionality after refactoring</p>
                        </div>

                        <!-- Three Months with Range Selection -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Three Months with Range Selection</h3>
                            <x-keys::calendar
                                name="three_months_range"
                                label="Multi-Month Range Selection"
                                :monthsToShow="3"
                                :isRange="true"
                                startDate="{{ now()->addDays(10)->format('Y-m-d') }}"
                                endDate="{{ now()->addDays(45)->format('Y-m-d') }}"
                            />
                        </div>

                        <!-- Test Info -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-3">Refactoring Test Results</h3>
                            <div class="text-sm text-foreground/70 space-y-2">
                                <p><strong>✅ Completed Refactoring:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Extracted calendar content into shared partial (eliminated template duplication)</li>
                                    <li>Refactored constructor into smaller, focused initialization methods</li>
                                    <li>Cleaned up CSS architecture and removed !important declarations</li>
                                    <li>Added comprehensive inline documentation for range selection logic</li>
                                    <li>Standardized method naming conventions throughout Calendar class</li>
                                    <li>Improved computed methods pattern consistency with other Keys UI components</li>
                                </ul>
                                <p class="mt-3"><strong>🧪 Test the following functionality:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Date range selection (click start date, then end date)</li>
                                    <li>Multi-month navigation (previous/next month buttons)</li>
                                    <li>Month/year dropdown selection</li>
                                    <li>Keyboard navigation (arrow keys, Enter, Escape)</li>
                                    <li>Range visual feedback and styling</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- DatePicker Component -->
                    <section class="space-y-6">
                        <div>
                            <h2 class="text-2xl font-bold mb-4">DatePicker Component</h2>
                            <p class="text-foreground/70 mb-6">Input field with integrated calendar dropdown for date selection</p>
                        </div>

                        <!-- Basic DatePicker -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Basic Date Picker</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <x-keys::date-picker
                                        name="basic_date"
                                        label="Select Date"
                                        placeholder="Choose a date"
                                        :clearable="true"
                                    />
                                </div>
                                <div>
                                    <x-keys::date-picker
                                        name="preselected_date"
                                        label="Pre-selected Date"
                                        value="{{ now()->format('Y-m-d') }}"
                                        :clearable="true"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Date Range Picker -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Date Range Picker</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <x-keys::date-picker
                                        name="date_range"
                                        label="Select Date Range"
                                        :isRange="true"
                                        :clearable="true"
                                        :quickSelectors="true"
                                    />
                                </div>
                                <div>
                                    <x-keys::date-picker
                                        name="vacation_range"
                                        label="Vacation Dates"
                                        :isRange="true"
                                        startDate="{{ now()->addDays(7)->format('Y-m-d') }}"
                                        endDate="{{ now()->addDays(14)->format('Y-m-d') }}"
                                        :quickSelectors="true"
                                        :clearable="true"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Different Formats and Sizes -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Formats and Sizes</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <x-keys::date-picker
                                        name="us_format"
                                        label="US Format (Small)"
                                        format="m/d/Y"
                                        size="sm"
                                        :clearable="true"
                                    />
                                </div>
                                <div>
                                    <x-keys::date-picker
                                        name="eu_format"
                                        label="EU Format (Medium)"
                                        format="d/m/Y"
                                        size="md"
                                        :clearable="true"
                                    />
                                </div>
                                <div>
                                    <x-keys::date-picker
                                        name="verbose_format"
                                        label="Verbose Format (Large)"
                                        format="F j, Y"
                                        size="lg"
                                        :clearable="true"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Date Constraints -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Date Constraints</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <x-keys::date-picker
                                        name="future_only"
                                        label="Future Dates Only"
                                        minDate="{{ now()->format('Y-m-d') }}"
                                        maxDate="{{ now()->addYear()->format('Y-m-d') }}"
                                        :clearable="true"
                                    />
                                </div>
                                <div>
                                    <x-keys::date-picker
                                        name="past_only"
                                        label="Past Dates Only"
                                        maxDate="{{ now()->format('Y-m-d') }}"
                                        :clearable="true"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Inline Calendar -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Inline Calendar</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <x-keys::date-picker
                                        name="inline_single"
                                        label="Inline Single Date"
                                        :inline="true"
                                        :clearable="true"
                                    />
                                </div>
                                <div>
                                    <x-keys::date-picker
                                        name="inline_range"
                                        label="Inline Date Range"
                                        :inline="true"
                                        :isRange="true"
                                        :quickSelectors="true"
                                        :clearable="true"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Advanced Features -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Advanced Features</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <x-keys::date-picker
                                        name="no_calendar_icon"
                                        label="Custom Icon"
                                        :showCalendarIcon="false"
                                        iconRight="heroicon-o-clock"
                                        :clearable="true"
                                    />
                                </div>
                                <div>
                                    <x-keys::date-picker
                                        name="disabled_dates"
                                        label="With Disabled Weekends"
                                        :disabledDates="[
                                            now()->next('Saturday')->format('Y-m-d'),
                                            now()->next('Sunday')->format('Y-m-d'),
                                            now()->addWeek()->next('Saturday')->format('Y-m-d'),
                                            now()->addWeek()->next('Sunday')->format('Y-m-d')
                                        ]"
                                        :clearable="true"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Test Info -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-3">DatePicker Features to Test</h3>
                            <div class="text-sm text-foreground/70 space-y-2">
                                <p><strong>🎯 Core Features:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Click input field to open calendar dropdown</li>
                                    <li>Select dates from calendar interface</li>
                                    <li>Use quick selectors for common date ranges</li>
                                    <li>Clear dates with clear button</li>
                                    <li>Different date formats and display modes</li>
                                    <li>Keyboard navigation (Tab, Enter, Escape, Arrow keys)</li>
                                </ul>
                                <p class="mt-3"><strong>🔧 Interactive Elements:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Range selection (start and end dates)</li>
                                    <li>Date constraints (min/max dates)</li>
                                    <li>Disabled specific dates</li>
                                    <li>Inline vs dropdown modes</li>
                                    <li>Size variants and custom styling</li>
                                    <li>Form integration and validation</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- Editor Component -->
                    <section class="space-y-6">
                        <div>
                            <h2 class="text-2xl font-bold mb-4">Editor Component</h2>
                            <p class="text-foreground/70 mb-6">Rich text editor with toolbar for formatting text content</p>
                        </div>

                        <!-- Basic Editor -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Basic Editor</h3>
                            <div class="space-y-4">
                                <x-keys::editor
                                    name="basic_editor"
                                    placeholder="Start typing your content here..."
                                    value="<p>Welcome to the <strong>Keys UI Editor</strong>! This is a basic rich text editor component.</p><p>You can format text using the toolbar buttons above or keyboard shortcuts:</p><ul><li><strong>Bold</strong> text for emphasis</li><li><em>Italic</em> text for style</li><li>Create lists for organization</li></ul>"
                                />
                            </div>
                        </div>

                        <!-- Size Variants -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Size Variants</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Small Editor</h4>
                                    <x-keys::editor
                                        name="small_editor"
                                        size="sm"
                                        height="150px"
                                        placeholder="Small editor for brief content..."
                                        value="<p>This is a <strong>small</strong> editor instance.</p>"
                                    />
                                </div>
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Large Editor</h4>
                                    <x-keys::editor
                                        name="large_editor"
                                        size="lg"
                                        height="250px"
                                        placeholder="Large editor for extensive content..."
                                        value="<h2>Large Editor</h2><p>This editor has more space for <em>longer content</em> and detailed formatting.</p>"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Custom Toolbar -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Custom Toolbar Configuration</h3>
                            <div class="space-y-4">
                                <x-keys::editor
                                    name="custom_editor"
                                    :toolbar="['bold', 'italic', 'underline', '|', 'h1', 'h2', 'paragraph', '|', 'insertUnorderedList', 'createLink', '|', 'undo', 'redo']"
                                    placeholder="Editor with simplified toolbar..."
                                    value="<h1>Custom Toolbar</h1><p>This editor has a <strong>simplified toolbar</strong> with only essential formatting options.</p>"
                                />
                            </div>
                        </div>

                        <!-- Disabled State -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Disabled Editor</h3>
                            <div class="space-y-4">
                                <x-keys::editor
                                    name="disabled_editor"
                                    :disabled="true"
                                    value="<p>This editor is <strong>disabled</strong> and cannot be edited. The toolbar is also disabled to prevent interactions.</p><blockquote>Perfect for displaying read-only formatted content.</blockquote>"
                                />
                            </div>
                        </div>

                        <!-- Features Demo -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">All Features Demo</h3>
                            <div class="space-y-4">
                                <x-keys::editor
                                    name="full_demo"
                                    height="300px"
                                    placeholder="Try all the editor features..."
                                    value="<h1>Editor Feature Showcase</h1><p>This editor demonstrates all available formatting options:</p><h2>Text Formatting</h2><p>You can make text <strong>bold</strong>, <em>italic</em>, <u>underlined</u>, or <s>strikethrough</s>.</p><h3>Text Alignment</h3><p style='text-align: center;'>This text is centered.</p><p style='text-align: right;'>This text is right-aligned.</p><h3>Lists and Structure</h3><ul><li>Unordered list item 1</li><li>Unordered list item 2</li></ul><ol><li>Ordered list item 1</li><li>Ordered list item 2</li></ol><blockquote>This is a blockquote for highlighting important information or quotes.</blockquote><p>You can also create <a href='https://example.com'>links</a> using the link button.</p>"
                                />
                            </div>
                        </div>

                        <!-- Test Info -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-3">Editor Features to Test</h3>
                            <div class="text-sm text-foreground/70 space-y-2">
                                <p><strong>🎯 Text Formatting:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Bold, italic, underline, strikethrough formatting</li>
                                    <li>Heading levels (H1, H2, H3) and paragraph formatting</li>
                                    <li>Text alignment (left, center, right, justify)</li>
                                    <li>Bulleted and numbered lists</li>
                                    <li>Blockquotes for highlighted content</li>
                                </ul>
                                <p class="mt-3"><strong>🔧 Interactive Elements:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Link creation with URL prompt</li>
                                    <li>Undo/redo functionality</li>
                                    <li>Clear formatting to remove all styling</li>
                                    <li>Toolbar button states (active/inactive based on selection)</li>
                                    <li>Form integration with hidden input synchronization</li>
                                    <li>Keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic, etc.)</li>
                                </ul>
                                <p class="mt-3"><strong>💡 Usage Tips:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Select text first, then use toolbar buttons for formatting</li>
                                    <li>Click link button without selection to create a new link</li>
                                    <li>Use undo/redo buttons to navigate edit history</li>
                                    <li>Toolbar buttons show active state when cursor is on formatted text</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </body>
</html>