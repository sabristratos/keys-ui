<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @vite(['resources/css/app.css', 'resources/js/app.js'])
        <keys:scripts />
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
                                    :toolbar="[['bold', 'italic', 'underline'], [['header' => [1, 2, false]]], ['list', 'bullet'], ['link'], ['clean']]"
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

                    <!-- Input Component -->
                    <section class="space-y-6">
                        <div>
                            <h2 class="text-2xl font-bold mb-4">Input Component</h2>
                            <p class="text-foreground/70 mb-6">Versatile text input component with icons, actions, and various states</p>
                        </div>

                        <!-- Basic Inputs -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Basic Inputs</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::input
                                    name="basic_input"
                                    placeholder="Enter text..."
                                />
                                <x-keys::input
                                    name="with_value"
                                    value="Pre-filled value"
                                    placeholder="Enter text..."
                                />
                            </div>
                        </div>

                        <!-- Input Types -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Input Types</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::input
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    label="Email Address"
                                />
                                <x-keys::input
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    label="Password"
                                    :actions="[
                                        [
                                            'icon' => 'heroicon-o-eye',
                                            'icon_toggle' => 'heroicon-o-eye-slash',
                                            'action' => 'password_toggle'
                                        ]
                                    ]"
                                />
                                <x-keys::input
                                    name="phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    label="Phone Number"
                                />
                                <x-keys::input
                                    name="number"
                                    type="number"
                                    placeholder="0"
                                    label="Quantity"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        <!-- With Icons -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">With Icons</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::input
                                    name="search"
                                    icon="heroicon-o-magnifying-glass"
                                    placeholder="Search..."
                                />
                                <x-keys::input
                                    name="username"
                                    icon="heroicon-o-user"
                                    placeholder="Username"
                                />
                                <x-keys::input
                                    name="website"
                                    icon="heroicon-o-globe-alt"
                                    placeholder="https://example.com"
                                />
                                <x-keys::input
                                    name="secure"
                                    icon="heroicon-o-lock-closed"
                                    placeholder="Secure input"
                                />
                            </div>
                        </div>

                        <!-- With Actions -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">With Actions</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::input
                                    name="copy_example"
                                    value="Click to copy this text"
                                    :actions="[
                                        [
                                            'icon' => 'heroicon-o-clipboard',
                                            'icon_success' => 'heroicon-o-check',
                                            'action' => 'copy'
                                        ]
                                    ]"
                                />
                                <x-keys::input
                                    name="clear_example"
                                    value="Clear this text"
                                    :actions="[
                                        [
                                            'icon' => 'heroicon-o-x-mark',
                                            'action' => 'clear'
                                        ]
                                    ]"
                                />
                                <x-keys::input
                                    name="password_with_generate"
                                    type="password"
                                    placeholder="Password"
                                    :actions="[
                                        [
                                            'icon' => 'heroicon-o-eye',
                                            'icon_toggle' => 'heroicon-o-eye-slash',
                                            'action' => 'password_toggle'
                                        ],
                                        [
                                            'icon' => 'heroicon-o-sparkles',
                                            'action' => 'generate_password'
                                        ]
                                    ]"
                                />
                                <x-keys::input
                                    name="search_with_clear"
                                    icon="heroicon-o-magnifying-glass"
                                    placeholder="Search..."
                                    :actions="[
                                        [
                                            'icon' => 'heroicon-o-x-circle',
                                            'action' => 'clear'
                                        ]
                                    ]"
                                />
                            </div>
                        </div>

                        <!-- Size Variants -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Size Variants</h3>
                            <div class="space-y-4">
                                <x-keys::input
                                    name="size_xs"
                                    size="xs"
                                    placeholder="Extra small input"
                                    icon="heroicon-o-star"
                                />
                                <x-keys::input
                                    name="size_sm"
                                    size="sm"
                                    placeholder="Small input"
                                    icon="heroicon-o-star"
                                />
                                <x-keys::input
                                    name="size_md"
                                    size="md"
                                    placeholder="Medium input (default)"
                                    icon="heroicon-o-star"
                                />
                                <x-keys::input
                                    name="size_lg"
                                    size="lg"
                                    placeholder="Large input"
                                    icon="heroicon-o-star"
                                />
                                <x-keys::input
                                    name="size_xl"
                                    size="xl"
                                    placeholder="Extra large input"
                                    icon="heroicon-o-star"
                                />
                            </div>
                        </div>

                        <!-- States -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">States</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::input
                                    name="disabled"
                                    value="Disabled input"
                                    :disabled="true"
                                    icon="heroicon-o-lock-closed"
                                />
                                <x-keys::input
                                    name="readonly"
                                    value="Read-only input"
                                    :readonly="true"
                                    icon="heroicon-o-eye"
                                />
                                <x-keys::input
                                    name="required"
                                    placeholder="Required field"
                                    label="Required Field"
                                    :required="true"
                                />
                                <x-keys::input
                                    name="optional"
                                    placeholder="Optional field"
                                    label="Optional Field"
                                    :optional="true"
                                />
                            </div>
                        </div>

                        <!-- With Validation Errors -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">With Validation</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::input
                                    name="with_error"
                                    value="invalid@email"
                                    label="Email with Error"
                                    :errors="['Please enter a valid email address']"
                                    icon="heroicon-o-envelope"
                                />
                                <x-keys::input
                                    name="with_multiple_errors"
                                    value="123"
                                    label="Password with Multiple Errors"
                                    :errors="['Password must be at least 8 characters', 'Password must contain a letter']"
                                    type="password"
                                />
                            </div>
                        </div>

                        <!-- Advanced Examples -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Advanced Examples</h3>
                            <div class="space-y-4">
                                <x-keys::input
                                    name="full_featured"
                                    label="Full Featured Input"
                                    placeholder="Type something..."
                                    hint="This input demonstrates all available features"
                                    icon="heroicon-o-command-line"
                                    :actions="[
                                        [
                                            'icon' => 'heroicon-o-clipboard',
                                            'icon_success' => 'heroicon-o-check',
                                            'action' => 'copy'
                                        ],
                                        [
                                            'icon' => 'heroicon-o-x-mark',
                                            'action' => 'clear'
                                        ]
                                    ]"
                                    :required="true"
                                />

                                <x-keys::input
                                    name="url_input"
                                    type="url"
                                    label="Website URL"
                                    placeholder="https://example.com"
                                    hint="Enter your website URL"
                                    icon="heroicon-o-globe-alt"
                                    :actions="[
                                        [
                                            'icon' => 'heroicon-o-arrow-top-right-on-square',
                                            'action' => 'open_url',
                                            'tooltip' => 'Open in new tab'
                                        ]
                                    ]"
                                />
                            </div>
                        </div>
                    </section>

                    <!-- Select Component -->
                    <section class="space-y-6">
                        <div>
                            <h2 class="text-2xl font-bold mb-4">Select Component</h2>
                            <p class="text-foreground/70 mb-6">Advanced dropdown with search, multi-select, and rich option content</p>
                        </div>

                        <!-- Basic Select -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Basic Select</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::select
                                    name="basic_select"
                                    placeholder="Choose an option"
                                >
                                    <x-keys::select.option value="option1" label="Option 1" />
                                    <x-keys::select.option value="option2" label="Option 2" />
                                    <x-keys::select.option value="option3" label="Option 3" />
                                </x-keys::select>

                                <x-keys::select
                                    name="with_label"
                                    label="Category"
                                    placeholder="Select category"
                                >
                                    <x-keys::select.option value="tech" label="Technology" />
                                    <x-keys::select.option value="business" label="Business" />
                                    <x-keys::select.option value="design" label="Design" />
                                    <x-keys::select.option value="marketing" label="Marketing" />
                                </x-keys::select>
                            </div>
                        </div>

                        <!-- With Icons and Descriptions -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">With Icons and Descriptions</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::select
                                    name="status_select"
                                    label="Status"
                                    placeholder="Choose status"
                                >
                                    <x-keys::select.option
                                        value="active"
                                        label="Active"
                                        icon="heroicon-o-check-circle"
                                        description="Item is currently active"
                                    />
                                    <x-keys::select.option
                                        value="pending"
                                        label="Pending"
                                        icon="heroicon-o-clock"
                                        description="Waiting for approval"
                                    />
                                    <x-keys::select.option
                                        value="archived"
                                        label="Archived"
                                        icon="heroicon-o-archive-box"
                                        description="Moved to archive"
                                    />
                                    <x-keys::select.option
                                        value="deleted"
                                        label="Deleted"
                                        icon="heroicon-o-trash"
                                        description="Marked for deletion"
                                        :disabled="true"
                                    />
                                </x-keys::select>

                                <x-keys::select
                                    name="priority"
                                    label="Priority"
                                    placeholder="Select priority"
                                    value="medium"
                                >
                                    <x-keys::select.option
                                        value="critical"
                                        label="Critical"
                                        icon="heroicon-o-exclamation-circle"
                                    />
                                    <x-keys::select.option
                                        value="high"
                                        label="High"
                                        icon="heroicon-o-arrow-up"
                                    />
                                    <x-keys::select.option
                                        value="medium"
                                        label="Medium"
                                        icon="heroicon-o-minus"
                                    />
                                    <x-keys::select.option
                                        value="low"
                                        label="Low"
                                        icon="heroicon-o-arrow-down"
                                    />
                                </x-keys::select>
                            </div>
                        </div>

                        <!-- Searchable Select -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Searchable Select</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::select
                                    name="country"
                                    label="Country"
                                    placeholder="Search countries..."
                                    :searchable="true"
                                    :clearable="true"
                                >
                                    <x-keys::select.option value="us" label="United States" icon="heroicon-o-flag" />
                                    <x-keys::select.option value="uk" label="United Kingdom" icon="heroicon-o-flag" />
                                    <x-keys::select.option value="ca" label="Canada" icon="heroicon-o-flag" />
                                    <x-keys::select.option value="au" label="Australia" icon="heroicon-o-flag" />
                                    <x-keys::select.option value="de" label="Germany" icon="heroicon-o-flag" />
                                    <x-keys::select.option value="fr" label="France" icon="heroicon-o-flag" />
                                    <x-keys::select.option value="jp" label="Japan" icon="heroicon-o-flag" />
                                    <x-keys::select.option value="cn" label="China" icon="heroicon-o-flag" />
                                </x-keys::select>

                                <x-keys::select
                                    name="timezone"
                                    label="Time Zone"
                                    placeholder="Search time zones..."
                                    :searchable="true"
                                >
                                    <x-keys::select.option value="utc" label="UTC" description="Coordinated Universal Time" />
                                    <x-keys::select.option value="est" label="EST" description="Eastern Standard Time (UTC-5)" />
                                    <x-keys::select.option value="cst" label="CST" description="Central Standard Time (UTC-6)" />
                                    <x-keys::select.option value="mst" label="MST" description="Mountain Standard Time (UTC-7)" />
                                    <x-keys::select.option value="pst" label="PST" description="Pacific Standard Time (UTC-8)" />
                                    <x-keys::select.option value="gmt" label="GMT" description="Greenwich Mean Time (UTC+0)" />
                                    <x-keys::select.option value="cet" label="CET" description="Central European Time (UTC+1)" />
                                    <x-keys::select.option value="jst" label="JST" description="Japan Standard Time (UTC+9)" />
                                </x-keys::select>
                            </div>
                        </div>

                        <!-- Multi-Select -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Multi-Select</h3>
                            <div class="space-y-4">
                                <x-keys::select
                                    name="skills[]"
                                    label="Skills"
                                    placeholder="Select your skills..."
                                    :multiple="true"
                                    :searchable="true"
                                    :clearable="true"
                                >
                                    <x-keys::select.option value="php" label="PHP" icon="heroicon-o-code-bracket" />
                                    <x-keys::select.option value="javascript" label="JavaScript" icon="heroicon-o-code-bracket" />
                                    <x-keys::select.option value="python" label="Python" icon="heroicon-o-code-bracket" />
                                    <x-keys::select.option value="react" label="React" icon="heroicon-o-bolt" />
                                    <x-keys::select.option value="vue" label="Vue.js" icon="heroicon-o-bolt" />
                                    <x-keys::select.option value="laravel" label="Laravel" icon="heroicon-o-server-stack" />
                                    <x-keys::select.option value="tailwind" label="Tailwind CSS" icon="heroicon-o-paint-brush" />
                                    <x-keys::select.option value="docker" label="Docker" icon="heroicon-o-cube" />
                                </x-keys::select>

                                <x-keys::select
                                    name="tags[]"
                                    label="Tags"
                                    placeholder="Add tags..."
                                    :multiple="true"
                                    :value="['important', 'urgent']"
                                >
                                    <x-keys::select.option value="important" label="Important" />
                                    <x-keys::select.option value="urgent" label="Urgent" />
                                    <x-keys::select.option value="review" label="Review" />
                                    <x-keys::select.option value="in-progress" label="In Progress" />
                                    <x-keys::select.option value="completed" label="Completed" />
                                    <x-keys::select.option value="on-hold" label="On Hold" />
                                </x-keys::select>
                            </div>
                        </div>

                        <!-- Portal Select Testing -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Floating Select (Overflow Test)</h3>
                            <div class="p-4 border border-border rounded-lg">
                                <div style="height: 200px; overflow: hidden; border: 2px solid #ccc; padding: 16px;">
                                    <p class="text-sm text-muted mb-4">This container has overflow:hidden to test floating behavior</p>

                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <!-- Regular Select (will be clipped) -->
                                        <x-keys::select
                                            name="regular_select"
                                            label="Regular Select (Clipped)"
                                            placeholder="Will be clipped..."
                                            :searchable="true"
                                        >
                                            <x-keys::select.option value="1" label="Option 1" />
                                            <x-keys::select.option value="2" label="Option 2" />
                                            <x-keys::select.option value="3" label="Option 3" />
                                            <x-keys::select.option value="4" label="Option 4" />
                                            <x-keys::select.option value="5" label="Option 5" />
                                            <x-keys::select.option value="6" label="Option 6" />
                                            <x-keys::select.option value="7" label="Option 7" />
                                            <x-keys::select.option value="8" label="Option 8" />
                                        </x-keys::select>

                                        <!-- Floating Select (will escape) -->
                                        <x-keys::select
                                            name="floating_select"
                                            label="Floating Select (Escapes)"
                                            placeholder="Will escape overflow..."
                                            :searchable="true"
                                            :floating="true"
                                        >
                                            <x-keys::select.option value="1" label="Floating Option 1" />
                                            <x-keys::select.option value="2" label="Floating Option 2" />
                                            <x-keys::select.option value="3" label="Floating Option 3" />
                                            <x-keys::select.option value="4" label="Floating Option 4" />
                                            <x-keys::select.option value="5" label="Floating Option 5" />
                                            <x-keys::select.option value="6" label="Floating Option 6" />
                                            <x-keys::select.option value="7" label="Floating Option 7" />
                                            <x-keys::select.option value="8" label="Floating Option 8" />
                                        </x-keys::select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Custom Content Options -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Custom Content Options</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::select
                                    name="plan"
                                    label="Subscription Plan"
                                    placeholder="Choose a plan"
                                >
                                    <x-keys::select.option value="free">
                                        <div class="flex items-center justify-between w-full">
                                            <div>
                                                <div class="font-semibold">Free Plan</div>
                                                <div class="text-xs text-muted">Basic features</div>
                                            </div>
                                            <div class="text-sm font-bold text-success">$0/mo</div>
                                        </div>
                                    </x-keys::select.option>
                                    <x-keys::select.option value="pro">
                                        <div class="flex items-center justify-between w-full">
                                            <div>
                                                <div class="font-semibold">Pro Plan</div>
                                                <div class="text-xs text-muted">Advanced features</div>
                                            </div>
                                            <div class="text-sm font-bold text-brand">$29/mo</div>
                                        </div>
                                    </x-keys::select.option>
                                    <x-keys::select.option value="enterprise">
                                        <div class="flex items-center justify-between w-full">
                                            <div>
                                                <div class="font-semibold">Enterprise</div>
                                                <div class="text-xs text-muted">All features + support</div>
                                            </div>
                                            <div class="text-sm font-bold text-purple">$99/mo</div>
                                        </div>
                                    </x-keys::select.option>
                                </x-keys::select>

                                <x-keys::select
                                    name="user"
                                    label="Assign to User"
                                    placeholder="Select user"
                                >
                                    <x-keys::select.option value="john">
                                        <div class="flex items-center gap-3 w-full">
                                            <div class="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-sm font-semibold text-brand">
                                                JD
                                            </div>
                                            <div class="flex-1">
                                                <div class="font-medium">John Doe</div>
                                                <div class="text-xs text-muted">john@example.com</div>
                                            </div>
                                        </div>
                                    </x-keys::select.option>
                                    <x-keys::select.option value="jane">
                                        <div class="flex items-center gap-3 w-full">
                                            <div class="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-sm font-semibold text-success">
                                                JS
                                            </div>
                                            <div class="flex-1">
                                                <div class="font-medium">Jane Smith</div>
                                                <div class="text-xs text-muted">jane@example.com</div>
                                            </div>
                                        </div>
                                    </x-keys::select.option>
                                    <x-keys::select.option value="bob">
                                        <div class="flex items-center gap-3 w-full">
                                            <div class="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-sm font-semibold text-warning">
                                                BW
                                            </div>
                                            <div class="flex-1">
                                                <div class="font-medium">Bob Wilson</div>
                                                <div class="text-xs text-muted">bob@example.com</div>
                                            </div>
                                        </div>
                                    </x-keys::select.option>
                                </x-keys::select>
                            </div>
                        </div>

                        <!-- Size Variants -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Size Variants</h3>
                            <div class="space-y-4">
                                <x-keys::select
                                    name="size_sm"
                                    size="sm"
                                    placeholder="Small select"
                                >
                                    <x-keys::select.option value="1" label="Option 1" />
                                    <x-keys::select.option value="2" label="Option 2" />
                                </x-keys::select>

                                <x-keys::select
                                    name="size_md"
                                    size="md"
                                    placeholder="Medium select (default)"
                                >
                                    <x-keys::select.option value="1" label="Option 1" />
                                    <x-keys::select.option value="2" label="Option 2" />
                                </x-keys::select>

                                <x-keys::select
                                    name="size_lg"
                                    size="lg"
                                    placeholder="Large select"
                                >
                                    <x-keys::select.option value="1" label="Option 1" />
                                    <x-keys::select.option value="2" label="Option 2" />
                                </x-keys::select>
                            </div>
                        </div>

                        <!-- States -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">States</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <x-keys::select
                                    name="disabled_select"
                                    label="Disabled Select"
                                    placeholder="This is disabled"
                                    :disabled="true"
                                >
                                    <x-keys::select.option value="1" label="Option 1" />
                                </x-keys::select>

                                <x-keys::select
                                    name="required_select"
                                    label="Required Select"
                                    placeholder="This is required"
                                    :required="true"
                                >
                                    <x-keys::select.option value="1" label="Option 1" />
                                    <x-keys::select.option value="2" label="Option 2" />
                                </x-keys::select>

                                <x-keys::select
                                    name="optional_select"
                                    label="Optional Select"
                                    placeholder="This is optional"
                                    :optional="true"
                                >
                                    <x-keys::select.option value="1" label="Option 1" />
                                    <x-keys::select.option value="2" label="Option 2" />
                                </x-keys::select>

                                <x-keys::select
                                    name="error_select"
                                    label="Select with Error"
                                    placeholder="Select an option"
                                    :errors="['Please select a valid option']"
                                >
                                    <x-keys::select.option value="1" label="Option 1" />
                                    <x-keys::select.option value="2" label="Option 2" />
                                </x-keys::select>
                            </div>
                        </div>

                        <!-- Testing Info -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-3">Input & Select Features to Test</h3>
                            <div class="text-sm text-foreground/70 space-y-2">
                                <p><strong>🔤 Input Features:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Password toggle: Click eye icon to show/hide password</li>
                                    <li>Copy action: Click clipboard icon to copy input value</li>
                                    <li>Clear action: Click X icon to clear input</li>
                                    <li>Generate password: Click sparkles icon for random password</li>
                                    <li>Multi-state icons: Watch icons change on interaction</li>
                                    <li>Size variants: xs, sm, md, lg, xl sizes</li>
                                    <li>Validation states: Error messages and styling</li>
                                </ul>
                                <p class="mt-3"><strong>📋 Select Features:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Click to open dropdown menu</li>
                                    <li>Search: Type to filter options in searchable selects</li>
                                    <li>Multi-select: Choose multiple options, see chips</li>
                                    <li>Clear button: Reset selection (when clearable)</li>
                                    <li>Keyboard navigation: Arrow keys, Enter, Escape</li>
                                    <li>Rich content: Custom layouts in options</li>
                                    <li>Disabled options: Some options cannot be selected</li>
                                </ul>
                                <p class="mt-3"><strong>⌨️ Keyboard Support:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Tab: Navigate between form elements</li>
                                    <li>Space/Enter: Open select dropdown</li>
                                    <li>Arrow keys: Navigate options</li>
                                    <li>Escape: Close dropdown</li>
                                    <li>Type to search: In searchable selects</li>
                                    <li>Backspace: Remove chips in multi-select</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- Button & Input Alignment Demos -->
                    <section class="space-y-6">
                        <div>
                            <h2 class="text-2xl font-bold mb-4">Button & Input Alignment</h2>
                            <p class="text-foreground/70 mb-6">Perfect height alignment between buttons and inputs for seamless form layouts</p>
                        </div>

                        <!-- Input Group Demos -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Input Groups</h3>
                            <div class="space-y-6">
                                <!-- Search Input Group -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Search with Button</h4>
                                    <div class="flex gap-2">
                                        <x-keys::input
                                            name="search_demo"
                                            placeholder="Search for anything..."
                                            icon="heroicon-o-magnifying-glass"
                                            class="flex-1"
                                        />
                                        <x-keys::button variant="brand">
                                            Search
                                        </x-keys::button>
                                    </div>
                                </div>

                                <!-- Email Subscription -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Email Subscription</h4>
                                    <div class="flex gap-2">
                                        <x-keys::input
                                            name="email_demo"
                                            type="email"
                                            placeholder="Enter your email address"
                                            icon="heroicon-o-envelope"
                                            class="flex-1"
                                        />
                                        <x-keys::button variant="success">
                                            Subscribe
                                        </x-keys::button>
                                    </div>
                                </div>

                                <!-- URL Input with Action -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">URL Shortener</h4>
                                    <div class="flex gap-2">
                                        <x-keys::input
                                            name="url_demo"
                                            type="url"
                                            placeholder="https://example.com/very-long-url"
                                            icon="heroicon-o-link"
                                            class="flex-1"
                                        />
                                        <x-keys::button variant="info">
                                            Shorten
                                        </x-keys::button>
                                    </div>
                                </div>

                                <!-- Code Input with Copy -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">API Key Generator</h4>
                                    <div class="flex gap-2">
                                        <x-keys::input
                                            name="api_key_demo"
                                            value="sk-1234567890abcdef"
                                            :readonly="true"
                                            icon="heroicon-o-key"
                                            class="flex-1"
                                        />
                                        <x-keys::button variant="neutral">
                                            Copy
                                        </x-keys::button>
                                        <x-keys::button variant="warning">
                                            Regenerate
                                        </x-keys::button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Size Alignment Demos -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Size Alignment</h3>
                            <div class="space-y-4">
                                <!-- Extra Small -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Extra Small (xs)</h4>
                                    <div class="flex gap-2 items-center">
                                        <x-keys::input
                                            name="xs_demo"
                                            size="xs"
                                            placeholder="Extra small input"
                                            icon="heroicon-o-star"
                                        />
                                        <x-keys::button size="xs" variant="brand">XS Button</x-keys::button>
                                        <x-keys::button size="xs" variant="outline">Outline</x-keys::button>
                                        <x-keys::button size="xs" variant="ghost">Ghost</x-keys::button>
                                    </div>
                                </div>

                                <!-- Small -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Small (sm)</h4>
                                    <div class="flex gap-2 items-center">
                                        <x-keys::input
                                            name="sm_demo"
                                            size="sm"
                                            placeholder="Small input"
                                            icon="heroicon-o-star"
                                        />
                                        <x-keys::button size="sm" variant="success">SM Button</x-keys::button>
                                        <x-keys::button size="sm" variant="outline">Outline</x-keys::button>
                                        <x-keys::button size="sm" variant="ghost">Ghost</x-keys::button>
                                    </div>
                                </div>

                                <!-- Medium -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Medium (md) - Default</h4>
                                    <div class="flex gap-2 items-center">
                                        <x-keys::input
                                            name="md_demo"
                                            placeholder="Medium input"
                                            icon="heroicon-o-star"
                                        />
                                        <x-keys::button variant="danger">MD Button</x-keys::button>
                                        <x-keys::button variant="outline">Outline</x-keys::button>
                                        <x-keys::button variant="ghost">Ghost</x-keys::button>
                                    </div>
                                </div>

                                <!-- Large -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Large (lg)</h4>
                                    <div class="flex gap-2 items-center">
                                        <x-keys::input
                                            name="lg_demo"
                                            size="lg"
                                            placeholder="Large input"
                                            icon="heroicon-o-star"
                                        />
                                        <x-keys::button size="lg" variant="warning">LG Button</x-keys::button>
                                        <x-keys::button size="lg" variant="outline">Outline</x-keys::button>
                                        <x-keys::button size="lg" variant="ghost">Ghost</x-keys::button>
                                    </div>
                                </div>

                                <!-- Extra Large -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Extra Large (xl)</h4>
                                    <div class="flex gap-2 items-center">
                                        <x-keys::input
                                            name="xl_demo"
                                            size="xl"
                                            placeholder="Extra large input"
                                            icon="heroicon-o-star"
                                        />
                                        <x-keys::button size="xl" variant="info">XL Button</x-keys::button>
                                        <x-keys::button size="xl" variant="outline">Outline</x-keys::button>
                                        <x-keys::button size="xl" variant="ghost">Ghost</x-keys::button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Form Layout Examples -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Form Layout Examples</h3>
                            <div class="space-y-6">
                                <!-- Login Form -->
                                <div class="bg-surface border border-border rounded-lg p-6">
                                    <h4 class="text-lg font-medium mb-4">Login Form</h4>
                                    <div class="space-y-4 max-w-md">
                                        <x-keys::input
                                            name="login_email"
                                            type="email"
                                            label="Email Address"
                                            placeholder="your@email.com"
                                            icon="heroicon-o-envelope"
                                            :required="true"
                                        />
                                        <x-keys::input
                                            name="login_password"
                                            type="password"
                                            label="Password"
                                            placeholder="Enter your password"
                                            :actions="[
                                                [
                                                    'icon' => 'heroicon-o-eye',
                                                    'icon_toggle' => 'heroicon-o-eye-slash',
                                                    'action' => 'password_toggle'
                                                ]
                                            ]"
                                            :required="true"
                                        />
                                        <div class="flex gap-2">
                                            <x-keys::button variant="brand" class="flex-1">
                                                Sign In
                                            </x-keys::button>
                                            <x-keys::button variant="ghost">
                                                Forgot Password?
                                            </x-keys::button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Search & Filter Form -->
                                <div class="bg-surface border border-border rounded-lg p-6">
                                    <h4 class="text-lg font-medium mb-4">Search & Filter</h4>
                                    <div class="space-y-4">
                                        <!-- Search Row -->
                                        <div class="flex gap-2">
                                            <x-keys::input
                                                name="search_products"
                                                placeholder="Search products..."
                                                icon="heroicon-o-magnifying-glass"
                                                class="flex-1"
                                            />
                                            <x-keys::button variant="brand">
                                                Search
                                            </x-keys::button>
                                        </div>

                                        <!-- Filter Row -->
                                        <div class="flex gap-2 flex-wrap">
                                            <x-keys::select
                                                name="category_filter"
                                                placeholder="Category"
                                                class="min-w-32"
                                            >
                                                <x-keys::select.option value="all" label="All Categories" />
                                                <x-keys::select.option value="electronics" label="Electronics" />
                                                <x-keys::select.option value="clothing" label="Clothing" />
                                                <x-keys::select.option value="books" label="Books" />
                                            </x-keys::select>

                                            <x-keys::select
                                                name="price_filter"
                                                placeholder="Price Range"
                                                class="min-w-32"
                                            >
                                                <x-keys::select.option value="all" label="Any Price" />
                                                <x-keys::select.option value="0-25" label="$0 - $25" />
                                                <x-keys::select.option value="25-100" label="$25 - $100" />
                                                <x-keys::select.option value="100+" label="$100+" />
                                            </x-keys::select>

                                            <x-keys::button variant="outline">
                                                Apply Filters
                                            </x-keys::button>
                                            <x-keys::button variant="ghost">
                                                Clear
                                            </x-keys::button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Team Invitation Form -->
                                <div class="bg-surface border border-border rounded-lg p-6">
                                    <h4 class="text-lg font-medium mb-4">Team Invitation</h4>
                                    <div class="space-y-4">
                                        <div class="flex gap-2">
                                            <x-keys::input
                                                name="invite_email"
                                                type="email"
                                                placeholder="colleague@company.com"
                                                icon="heroicon-o-envelope"
                                                class="flex-1"
                                            />
                                            <x-keys::select
                                                name="invite_role"
                                                placeholder="Role"
                                                class="w-32"
                                            >
                                                <x-keys::select.option value="admin" label="Admin" />
                                                <x-keys::select.option value="editor" label="Editor" />
                                                <x-keys::select.option value="viewer" label="Viewer" />
                                            </x-keys::select>
                                            <x-keys::button variant="success">
                                                Send Invite
                                            </x-keys::button>
                                        </div>

                                        <div class="flex gap-2">
                                            <x-keys::input
                                                name="bulk_emails"
                                                placeholder="Multiple emails separated by commas"
                                                icon="heroicon-o-users"
                                                class="flex-1"
                                            />
                                            <x-keys::button variant="info">
                                                Bulk Invite
                                            </x-keys::button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Icon Buttons Alignment -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Icon-Only Buttons with Inputs</h3>
                            <div class="space-y-4">
                                <div class="flex gap-2 items-center">
                                    <span class="text-sm text-muted w-16">Small:</span>
                                    <x-keys::input
                                        name="icon_demo_sm"
                                        size="sm"
                                        placeholder="Small input"
                                        class="flex-1 max-w-xs"
                                    />
                                    <x-keys::button size="sm" variant="brand" icon="heroicon-o-plus" />
                                    <x-keys::button size="sm" variant="danger" icon="heroicon-o-trash" />
                                    <x-keys::button size="sm" variant="neutral" icon="heroicon-o-pencil" />
                                </div>

                                <div class="flex gap-2 items-center">
                                    <span class="text-sm text-muted w-16">Medium:</span>
                                    <x-keys::input
                                        name="icon_demo_md"
                                        placeholder="Medium input"
                                        class="flex-1 max-w-xs"
                                    />
                                    <x-keys::button variant="brand" icon="heroicon-o-plus" />
                                    <x-keys::button variant="danger" icon="heroicon-o-trash" />
                                    <x-keys::button variant="neutral" icon="heroicon-o-pencil" />
                                </div>

                                <div class="flex gap-2 items-center">
                                    <span class="text-sm text-muted w-16">Large:</span>
                                    <x-keys::input
                                        name="icon_demo_lg"
                                        size="lg"
                                        placeholder="Large input"
                                        class="flex-1 max-w-xs"
                                    />
                                    <x-keys::button size="lg" variant="brand" icon="heroicon-o-plus" />
                                    <x-keys::button size="lg" variant="danger" icon="heroicon-o-trash" />
                                    <x-keys::button size="lg" variant="neutral" icon="heroicon-o-pencil" />
                                </div>
                            </div>
                        </div>

                        <!-- Testing Info -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-3">Alignment Features to Test</h3>
                            <div class="text-sm text-foreground/70 space-y-2">
                                <p><strong>✨ Perfect Height Alignment:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>All button variants align perfectly with inputs of the same size</li>
                                    <li>Color-matched borders maintain seamless appearance</li>
                                    <li>Icon-only buttons align consistently</li>
                                    <li>Outline buttons maintain distinctive border while aligning</li>
                                </ul>
                                <p class="mt-3"><strong>🎯 Form Layout Benefits:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Input groups look professional and unified</li>
                                    <li>Search bars with action buttons align perfectly</li>
                                    <li>Form controls can be mixed freely without alignment issues</li>
                                    <li>Responsive layouts maintain alignment across screen sizes</li>
                                </ul>
                                <p class="mt-3"><strong>🔧 Technical Implementation:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Buttons now include color-matched borders for height consistency</li>
                                    <li>Border colors change with button states (hover, active, disabled)</li>
                                    <li>Transparent borders for ghost buttons, visible borders for outline</li>
                                    <li>Identical box model ensures pixel-perfect alignment</li>
                                </ul>
                            </div>
                        </div>
                    </section>


                    <!-- File Upload Component Testing -->
                    <section class="space-y-6">
                        <div class="border-t border-border pt-8">
                            <h2 class="text-2xl font-bold mb-6">File Upload Components</h2>

                            <!-- Progress Component Examples -->
                            <div class="bg-surface border border-border rounded-lg p-6 mb-6">
                                <h3 class="text-lg font-semibold mb-4">Progress Component</h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-4">
                                        <h4 class="text-sm font-medium text-foreground/70">Basic Progress</h4>
                                        <x-keys::progress :value="25" label="Uploading..." />
                                        <x-keys::progress :value="50" color="success" />
                                        <x-keys::progress :value="75" color="warning" size="lg" />
                                        <x-keys::progress :value="100" color="success" label="Complete!" />
                                    </div>

                                    <div class="space-y-4">
                                        <h4 class="text-sm font-medium text-foreground/70">Animated & Striped</h4>
                                        <x-keys::progress :value="60" color="brand" :animated="true" :striped="true" label="Processing..." />
                                        <x-keys::progress :value="40" color="info" size="sm" :striped="true" />
                                        <x-keys::progress :value="80" color="danger" :animated="true" status="Error occurred" />
                                    </div>
                                </div>
                            </div>

                            <!-- File Upload Examples -->
                            <div class="bg-surface border border-border rounded-lg p-6">
                                <h3 class="text-lg font-semibold mb-4">File Upload Component</h3>
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <!-- Basic File Upload -->
                                    <div class="space-y-4">
                                        <h4 class="text-sm font-medium text-foreground/70">Basic Upload</h4>
                                        <x-keys::file-upload
                                            name="documents"
                                            accept="image/*,application/pdf"
                                            label="Upload Documents"
                                            description="Images and PDF files only"
                                            :max-size="5120"
                                            class="mb-4"
                                        />

                                        <h4 class="text-sm font-medium text-foreground/70">Multiple Files</h4>
                                        <x-keys::file-upload
                                            name="gallery"
                                            accept="image/*"
                                            :multiple="true"
                                            :max-files="5"
                                            :max-size="2048"
                                            label="Photo Gallery"
                                            description="Up to 5 images, 2MB each"
                                            size="sm"
                                        />
                                    </div>

                                    <!-- Advanced File Upload -->
                                    <div class="space-y-4">
                                        <h4 class="text-sm font-medium text-foreground/70">Large Upload Zone</h4>
                                        <x-keys::file-upload
                                            name="media"
                                            accept="image/*,video/*"
                                            :multiple="true"
                                            :max-files="10"
                                            :max-size="10240"
                                            label="Media Files"
                                            description="Images and videos up to 10MB"
                                            size="lg"
                                            :auto-upload="false"
                                            class="mb-4"
                                        />

                                        <h4 class="text-sm font-medium text-foreground/70">With Existing Files</h4>
                                        <x-keys::file-upload
                                            name="attachments"
                                            :existing-files="[
                                                ['id' => 1, 'name' => 'report.pdf', 'size' => 1024000, 'url' => '#'],
                                                ['id' => 2, 'name' => 'image.jpg', 'size' => 512000, 'url' => '#']
                                            ]"
                                            label="Attachments"
                                            size="sm"
                                        />
                                    </div>
                                </div>

                                <!-- Livewire Integration Example -->
                                <div class="mt-6 pt-6 border-t border-border">
                                    <h4 class="text-sm font-medium text-foreground/70 mb-4">Livewire Integration (Simulated)</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="space-y-2">
                                            <x-keys::file-upload
                                                wire:model="profilePicture"
                                                name="profile_pic"
                                                accept="image/*"
                                                :max-size="2048"
                                                label="Profile Picture"
                                                description="Will update via Livewire"
                                            />
                                            <p class="text-xs text-muted">Note: Livewire binding simulated - no actual backend</p>
                                        </div>

                                        <div class="space-y-2">
                                            <x-keys::file-upload
                                                wire:model.live="projectFiles"
                                                name="project_files"
                                                :multiple="true"
                                                :max-files="3"
                                                accept=".zip,.rar,.7z"
                                                label="Project Files"
                                                description="Archive files only"
                                            />
                                            <p class="text-xs text-muted">Live binding - updates immediately on selection</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Testing Info -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-3">File Upload Features to Test</h3>
                            <div class="text-sm text-foreground/70 space-y-2">
                                <p><strong>📁 Core Functionality:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Drag & drop files onto the upload zones</li>
                                    <li>Click upload zones or "Browse Files" buttons to select files</li>
                                    <li>File type validation (try uploading invalid file types)</li>
                                    <li>File size validation (try uploading files larger than limit)</li>
                                    <li>Multiple file selection and preview generation</li>
                                </ul>
                                <p class="mt-3"><strong>🎯 Interactive Elements:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Visual drag-over feedback with zone highlighting</li>
                                    <li>File preview thumbnails for images</li>
                                    <li>Individual file removal from selected list</li>
                                    <li>Progress bars during upload simulation</li>
                                    <li>Error messaging for validation failures</li>
                                </ul>
                                <p class="mt-3"><strong>⚙️ Technical Features:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Automatic Livewire integration via wire: attributes</li>
                                    <li>Existing file management with remove functionality</li>
                                    <li>Responsive design with size variants (sm, md, lg)</li>
                                    <li>Custom validation rules and file type filtering</li>
                                    <li>Event-driven architecture for framework integration</li>
                                </ul>
                                <p class="mt-3 text-warning"><strong>💡 Note:</strong> File uploads are simulated in this demo. The component includes full Livewire integration and can be connected to real upload endpoints.</p>
                            </div>
                        </div>
                    </section>

                    <!-- Gallery Components Section -->
                    <section class="space-y-8">
                        <div class="text-center">
                            <h2 class="text-2xl font-bold mb-2">Gallery Components</h2>
                            <p class="text-foreground/60">Interactive image galleries with thumbnail navigation, autoplay, and ecommerce features</p>
                        </div>

                        <!-- Basic Thumbnail Gallery -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-4">Basic Thumbnail Gallery</h3>
                            <x-keys::gallery
                                :images="[
                                    ['src' => 'https://picsum.photos/800/600?random=1', 'alt' => 'Nature landscape', 'caption' => 'Beautiful mountain landscape'],
                                    ['src' => 'https://picsum.photos/800/600?random=2', 'alt' => 'City skyline', 'caption' => 'Modern city skyline at sunset'],
                                    ['src' => 'https://picsum.photos/800/600?random=3', 'alt' => 'Ocean view', 'caption' => 'Peaceful ocean waves'],
                                    ['src' => 'https://picsum.photos/800/600?random=4', 'alt' => 'Forest path', 'caption' => 'Winding forest trail'],
                                ]"
                                type="thumbnail"
                                aspect-ratio="video"
                                radius="lg"
                                :lightbox="true"
                            />
                        </div>

                        <!-- Ecommerce Gallery with Side Thumbnails -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-4">Ecommerce Gallery (Side Thumbnails)</h3>
                            <x-keys::gallery
                                :images="[
                                    [
                                        'src' => 'https://picsum.photos/600/600?random=10',
                                        'alt' => 'Premium Watch - Front View',
                                        'title' => 'Premium Watch - Front View',
                                        'description' => 'Elegant design with precision craftsmanship'
                                    ],
                                    [
                                        'src' => 'https://picsum.photos/600/600?random=11',
                                        'alt' => 'Premium Watch - Side View',
                                        'title' => 'Premium Watch - Side View',
                                        'description' => 'Sleek profile showing the refined case design'
                                    ],
                                    [
                                        'src' => 'https://picsum.photos/600/600?random=12',
                                        'alt' => 'Premium Watch - Back View',
                                        'title' => 'Premium Watch - Back View',
                                        'description' => 'Transparent case back revealing the intricate mechanism'
                                    ],
                                    [
                                        'src' => 'https://picsum.photos/600/600?random=13',
                                        'alt' => 'Premium Watch - Detail',
                                        'title' => 'Premium Watch - Detail',
                                        'description' => 'Close-up of the precision dial and hands'
                                    ]
                                ]"
                                type="ecommerce"
                                aspect-ratio="square"
                                radius="lg"
                                thumbnail-position="side"
                                thumbnail-size="md"
                                :lightbox="true"
                            />
                        </div>

                        <!-- Basic Gallery with Autoplay -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-4">Basic Gallery with Autoplay</h3>
                            <x-keys::gallery
                                :images="[
                                    ['src' => 'https://picsum.photos/800/400?random=20', 'alt' => 'Abstract art 1'],
                                    ['src' => 'https://picsum.photos/800/400?random=21', 'alt' => 'Abstract art 2'],
                                    ['src' => 'https://picsum.photos/800/400?random=22', 'alt' => 'Abstract art 3'],
                                    ['src' => 'https://picsum.photos/800/400?random=23', 'alt' => 'Abstract art 4'],
                                    ['src' => 'https://picsum.photos/800/400?random=24', 'alt' => 'Abstract art 5'],
                                ]"
                                type="basic"
                                aspect-ratio="wide"
                                radius="xl"
                                :autoplay="true"
                                :autoplay-delay="4000"
                                :loop="true"
                                :show-thumbnails="false"
                            />
                        </div>

                        <!-- Compact Gallery with Top Thumbnails -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-4">Compact Gallery (Top Thumbnails)</h3>
                            <x-keys::gallery
                                :images="[
                                    ['src' => 'https://picsum.photos/500/500?random=30', 'alt' => 'Product variant 1'],
                                    ['src' => 'https://picsum.photos/500/500?random=31', 'alt' => 'Product variant 2'],
                                    ['src' => 'https://picsum.photos/500/500?random=32', 'alt' => 'Product variant 3'],
                                ]"
                                type="thumbnail"
                                aspect-ratio="square"
                                radius="md"
                                thumbnail-position="top"
                                thumbnail-size="sm"
                            />
                        </div>

                        <!-- Testing Info -->
                        <div class="bg-surface border border-border rounded-lg p-6">
                            <h3 class="text-lg font-semibold mb-3">Gallery Features to Test</h3>
                            <div class="text-sm text-foreground/70 space-y-2">
                                <p><strong>🖼️ Navigation:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Click thumbnails to navigate between images</li>
                                    <li>Use arrow buttons (on basic/ecommerce types) for navigation</li>
                                    <li>Keyboard navigation: Arrow keys, Home, End, Space (autoplay toggle), Escape</li>
                                    <li>Touch/swipe gestures on mobile devices</li>
                                </ul>
                                <p class="mt-3"><strong>🔄 Autoplay Features:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Auto-advancing slideshow with configurable delay</li>
                                    <li>Pause/play toggle button in top-right corner</li>
                                    <li>Automatic pause on hover, resume on mouse leave</li>
                                    <li>Loop option for continuous cycling</li>
                                </ul>
                                <p class="mt-3"><strong>🎨 Layout Options:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Thumbnail positions: bottom (default), top, side</li>
                                    <li>Gallery types: thumbnail, ecommerce, basic</li>
                                    <li>Aspect ratios: auto, square, video, photo, wide</li>
                                    <li>Thumbnail sizes: xs, sm, md, lg</li>
                                    <li>Border radius options: none, sm, md, lg, xl, full</li>
                                </ul>
                                <p class="mt-3"><strong>🛍️ Ecommerce Features:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4">
                                    <li>Image counter display (1/4 format)</li>
                                    <li>Dynamic image titles and descriptions</li>
                                    <li>Product variant switching capabilities</li>
                                    <li>Lightbox integration for detailed viewing</li>
                                </ul>
                                <p class="mt-3 text-info"><strong>💡 Technical:</strong> All galleries are fully accessible with ARIA labels, keyboard navigation, and screen reader support. Images are lazy-loaded and responsive.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    </body>
</html>