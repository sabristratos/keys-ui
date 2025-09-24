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

                        <!-- Width Control Examples -->
                        <div class="space-y-6">
                            <h3 class="text-lg font-semibold">Width Control</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label class="block text-sm font-medium mb-2">Auto Width</label>
                                    <x-keys::select
                                        name="width_auto"
                                        width="auto"
                                        placeholder="Auto width"
                                    >
                                        <x-keys::select.option value="1" label="Short" />
                                        <x-keys::select.option value="2" label="Medium length option" />
                                    </x-keys::select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Extra Small (xs)</label>
                                    <x-keys::select
                                        name="width_xs"
                                        width="xs"
                                        placeholder="XS"
                                    >
                                        <x-keys::select.option value="1" label="Option 1" />
                                        <x-keys::select.option value="2" label="Option 2" />
                                    </x-keys::select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Small (sm)</label>
                                    <x-keys::select
                                        name="width_sm"
                                        width="sm"
                                        placeholder="Small width"
                                    >
                                        <x-keys::select.option value="1" label="Option 1" />
                                        <x-keys::select.option value="2" label="Option 2" />
                                    </x-keys::select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Medium (md)</label>
                                    <x-keys::select
                                        name="width_md"
                                        width="md"
                                        placeholder="Medium width"
                                    >
                                        <x-keys::select.option value="1" label="Option 1" />
                                        <x-keys::select.option value="2" label="Option 2" />
                                    </x-keys::select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Large (lg)</label>
                                    <x-keys::select
                                        name="width_lg"
                                        width="lg"
                                        placeholder="Large width"
                                    >
                                        <x-keys::select.option value="1" label="Option 1" />
                                        <x-keys::select.option value="2" label="Option 2" />
                                    </x-keys::select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Extra Large (xl)</label>
                                    <x-keys::select
                                        name="width_xl"
                                        width="xl"
                                        placeholder="Extra large width"
                                    >
                                        <x-keys::select.option value="1" label="Option 1" />
                                        <x-keys::select.option value="2" label="Option 2" />
                                    </x-keys::select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">2X Large (2xl)</label>
                                    <x-keys::select
                                        name="width_2xl"
                                        width="2xl"
                                        placeholder="2X Large width"
                                    >
                                        <x-keys::select.option value="1" label="Option 1" />
                                        <x-keys::select.option value="2" label="Option 2" />
                                    </x-keys::select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Fit Content</label>
                                    <x-keys::select
                                        name="width_fit"
                                        width="fit"
                                        placeholder="Fit"
                                    >
                                        <x-keys::select.option value="1" label="Short" />
                                        <x-keys::select.option value="2" label="Longer option text" />
                                    </x-keys::select>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium mb-2">Full Width (default)</label>
                                    <x-keys::select
                                        name="width_full"
                                        width="full"
                                        placeholder="Full width (default)"
                                    >
                                        <x-keys::select.option value="1" label="Option 1" />
                                        <x-keys::select.option value="2" label="Option 2" />
                                    </x-keys::select>
                                </div>
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
                                    <li>Width control: auto, xs, sm, md, lg, xl, 2xl, fit, full</li>
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

                    <!-- Badge Components -->
                    <section class="space-y-6">
                        <div>
                            <h2 class="text-2xl font-bold mb-4">Badge Components</h2>
                            <p class="text-foreground/70 mb-6">Status indicators and tags with multiple variants including the new subtle style</p>
                        </div>

                        <!-- Badge Variants -->
                        <div>
                            <h3 class="text-lg font-semibold mb-3">Badge Variants</h3>
                            <div class="space-y-6">
                                <!-- Simple Badges -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Simple Badges (Default)</h4>
                                    <div class="flex flex-wrap gap-2">
                                        <x-keys::badge color="brand">Brand</x-keys::badge>
                                        <x-keys::badge color="success">Success</x-keys::badge>
                                        <x-keys::badge color="warning">Warning</x-keys::badge>
                                        <x-keys::badge color="danger">Danger</x-keys::badge>
                                        <x-keys::badge color="neutral">Neutral</x-keys::badge>
                                        <x-keys::badge color="blue">Blue</x-keys::badge>
                                        <x-keys::badge color="purple">Purple</x-keys::badge>
                                        <x-keys::badge color="green">Green</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Subtle Badges (NEW) -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Subtle Badges with Status Dots (NEW)</h4>
                                    <div class="flex flex-wrap gap-4">
                                        <x-keys::badge variant="subtle" color="success">Online</x-keys::badge>
                                        <x-keys::badge variant="subtle" color="warning">Away</x-keys::badge>
                                        <x-keys::badge variant="subtle" color="danger">Busy</x-keys::badge>
                                        <x-keys::badge variant="subtle" color="neutral">Offline</x-keys::badge>
                                        <x-keys::badge variant="subtle" color="brand">Active</x-keys::badge>
                                        <x-keys::badge variant="subtle" color="blue">Available</x-keys::badge>
                                        <x-keys::badge variant="subtle" color="purple">Premium</x-keys::badge>
                                        <x-keys::badge variant="subtle" color="green">Verified</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Chip Badges -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Chip Badges (Dismissible)</h4>
                                    <div class="flex flex-wrap gap-2">
                                        <x-keys::badge variant="chip" color="blue" dismissible>React</x-keys::badge>
                                        <x-keys::badge variant="chip" color="green" dismissible>Vue.js</x-keys::badge>
                                        <x-keys::badge variant="chip" color="purple" dismissible>Laravel</x-keys::badge>
                                        <x-keys::badge variant="chip" color="yellow" dismissible>JavaScript</x-keys::badge>
                                        <x-keys::badge variant="chip" color="red" dismissible>PHP</x-keys::badge>
                                    </div>
                                </div>

                                <!-- Icon Badges -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Icon Badges</h4>
                                    <div class="space-y-3">
                                        <div>
                                            <p class="text-xs text-foreground/60 mb-2">Simple with Icons:</p>
                                            <div class="flex flex-wrap gap-2">
                                                <x-keys::badge icon="heroicon-o-check-circle" color="success">Verified</x-keys::badge>
                                                <x-keys::badge icon="heroicon-o-star" color="yellow">Featured</x-keys::badge>
                                                <x-keys::badge icon="heroicon-o-shield-check" color="brand">Secure</x-keys::badge>
                                                <x-keys::badge icon="heroicon-o-bolt" color="purple">Fast</x-keys::badge>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="text-xs text-foreground/60 mb-2">Subtle with Icons:</p>
                                            <div class="flex flex-wrap gap-3">
                                                <x-keys::badge variant="subtle" icon="heroicon-o-check-circle" color="success">Verified</x-keys::badge>
                                                <x-keys::badge variant="subtle" icon="heroicon-o-star" color="yellow">Featured</x-keys::badge>
                                                <x-keys::badge variant="subtle" icon="heroicon-o-shield-check" color="brand">Secure</x-keys::badge>
                                                <x-keys::badge variant="subtle" icon="heroicon-o-bolt" color="purple">Fast</x-keys::badge>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="text-xs text-foreground/60 mb-2">Icon-Only (Auto-detected):</p>
                                            <div class="flex flex-wrap gap-2">
                                                <x-keys::badge icon="heroicon-o-check" color="success" />
                                                <x-keys::badge icon="heroicon-o-x-mark" color="danger" />
                                                <x-keys::badge icon="heroicon-o-exclamation-triangle" color="warning" />
                                                <x-keys::badge variant="subtle" icon="heroicon-o-star" color="yellow" />
                                                <x-keys::badge variant="subtle" icon="heroicon-o-heart" color="red" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Size Variants -->
                                <div>
                                    <h4 class="text-sm font-medium mb-2">Size Variants</h4>
                                    <div class="space-y-3">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs text-foreground/60 w-16">XS:</span>
                                            <x-keys::badge size="xs" color="brand">Extra Small</x-keys::badge>
                                            <x-keys::badge variant="subtle" size="xs" color="success">Subtle XS</x-keys::badge>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs text-foreground/60 w-16">SM:</span>
                                            <x-keys::badge size="sm" color="brand">Small</x-keys::badge>
                                            <x-keys::badge variant="subtle" size="sm" color="success">Subtle SM</x-keys::badge>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs text-foreground/60 w-16">MD:</span>
                                            <x-keys::badge size="md" color="brand">Medium</x-keys::badge>
                                            <x-keys::badge variant="subtle" size="md" color="success">Subtle MD</x-keys::badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-6 p-4 bg-surface border border-border rounded-lg">
                                <p class="text-sm"><strong>🎯 Try:</strong></p>
                                <ul class="list-disc list-inside space-y-1 ml-4 text-sm">
                                    <li>Click dismiss buttons on chip badges to remove them</li>
                                    <li>Notice the subtle variant's status dot with ring effect</li>
                                    <li>Compare visual weight between variants</li>
                                    <li>Test icon-only auto-detection (no slot content = icon-only)</li>
                                </ul>
                                <p class="mt-3 text-info"><strong>💡 New Subtle Variant:</strong> Text-only display with status indicator dot and low-opacity ring for minimal visual impact while maintaining clear status communication.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>

    </body>
</html>
