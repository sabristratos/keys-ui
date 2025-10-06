<x-layouts.sidebar title="Keys UI - Component Library">
    <div class="space-y-16">
        {{-- Button Component Showcase --}}
        <section class="space-y-8">
            <div>
                <x-keys::heading level="h1" size="3xl">Button Component</x-keys::heading>
                <x-keys::text color="muted" size="lg" class="mt-2">
                    Versatile button component with multiple variants, sizes, and states using the refactored design token system.
                </x-keys::text>
            </div>

            {{-- Variants Showcase --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Variants</x-keys::heading>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-surface p-6 rounded-lg space-y-3">
                        <x-keys::text weight="medium">Solid</x-keys::text>
                        <x-keys::button>Primary Button</x-keys::button>
                    </div>
                    <div class="bg-surface p-6 rounded-lg space-y-3">
                        <x-keys::text weight="medium">Outlined</x-keys::text>
                        <x-keys::button variant="outlined">Primary Button</x-keys::button>
                    </div>
                    <div class="bg-surface p-6 rounded-lg space-y-3">
                        <x-keys::text weight="medium">Ghost</x-keys::text>
                        <x-keys::button variant="ghost">Primary Button</x-keys::button>
                    </div>
                    <div class="bg-surface p-6 rounded-lg space-y-3">
                        <x-keys::text weight="medium">Subtle</x-keys::text>
                        <x-keys::button variant="subtle">Primary Button</x-keys::button>
                    </div>
                </div>
            </div>

            {{-- Colors Showcase --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Colors</x-keys::heading>
                <div class="bg-surface p-6 rounded-lg">
                    <div class="flex flex-wrap gap-3">
                        <x-keys::button color="primary">Primary</x-keys::button>
                        <x-keys::button color="secondary">Secondary</x-keys::button>
                        <x-keys::button color="success">Success</x-keys::button>
                        <x-keys::button color="warning">Warning</x-keys::button>
                        <x-keys::button color="danger">Danger</x-keys::button>
                        <x-keys::button color="info">Info</x-keys::button>
                    </div>
                </div>
            </div>

            {{-- Sizes Showcase --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Sizes</x-keys::heading>
                <div class="bg-surface p-6 rounded-lg">
                    <div class="flex flex-wrap items-center gap-3">
                        <x-keys::button size="xs">Extra Small</x-keys::button>
                        <x-keys::button size="sm">Small</x-keys::button>
                        <x-keys::button size="md">Medium</x-keys::button>
                        <x-keys::button size="lg">Large</x-keys::button>
                        <x-keys::button size="xl">Extra Large</x-keys::button>
                    </div>
                </div>
            </div>

            {{-- With Icons --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">With Icons</x-keys::heading>
                <div class="bg-surface p-6 rounded-lg">
                    <div class="flex flex-wrap gap-3">
                        <x-keys::button icon-left="heart">Left Icon</x-keys::button>
                        <x-keys::button icon-right="arrow-right">Right Icon</x-keys::button>
                        <x-keys::button icon-left="plus" icon-right="arrow-right">Both Icons</x-keys::button>
                        <x-keys::button icon-left="heart" variant="outlined">Outlined</x-keys::button>
                        <x-keys::button icon-left="star" variant="ghost">Ghost</x-keys::button>
                    </div>
                </div>
            </div>

            {{-- Icon Only --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Icon Only</x-keys::heading>
                <div class="bg-surface p-6 rounded-lg">
                    <div class="flex flex-wrap items-center gap-3">
                        <x-keys::button icon-left="heart" size="xs"><span class="sr-only">Like</span></x-keys::button>
                        <x-keys::button icon-left="heart" size="sm"><span class="sr-only">Like</span></x-keys::button>
                        <x-keys::button icon-left="heart"><span class="sr-only">Like</span></x-keys::button>
                        <x-keys::button icon-left="heart" size="lg"><span class="sr-only">Like</span></x-keys::button>
                        <x-keys::button icon-left="heart" size="xl"><span class="sr-only">Like</span></x-keys::button>
                    </div>
                </div>
            </div>

            {{-- States --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">States</x-keys::heading>
                <div class="bg-surface p-6 rounded-lg">
                    <div class="flex flex-wrap gap-3">
                        <x-keys::button>Default</x-keys::button>
                        <x-keys::button disabled>Disabled</x-keys::button>
                        <x-keys::button loading>Loading</x-keys::button>
                        <x-keys::button loading loading-animation="dots">Loading Dots</x-keys::button>
                        <x-keys::button loading loading-animation="pulse">Loading Pulse</x-keys::button>
                    </div>
                </div>
            </div>

            {{-- Color Matrix --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Color × Variant Matrix</x-keys::heading>
                <div class="bg-surface p-6 rounded-lg overflow-x-auto">
                    <table class="w-full border-collapse">
                        <thead>
                            <tr>
                                <th class="text-left p-2 border-b border-line">
                                    <x-keys::text weight="semibold" size="sm">Color</x-keys::text>
                                </th>
                                <th class="text-center p-2 border-b border-line">
                                    <x-keys::text weight="semibold" size="sm">Solid</x-keys::text>
                                </th>
                                <th class="text-center p-2 border-b border-line">
                                    <x-keys::text weight="semibold" size="sm">Outlined</x-keys::text>
                                </th>
                                <th class="text-center p-2 border-b border-line">
                                    <x-keys::text weight="semibold" size="sm">Ghost</x-keys::text>
                                </th>
                                <th class="text-center p-2 border-b border-line">
                                    <x-keys::text weight="semibold" size="sm">Subtle</x-keys::text>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach(['primary', 'secondary', 'success', 'warning', 'danger', 'info'] as $color)
                                <tr>
                                    <td class="p-2 border-b border-line-subtle">
                                        <x-keys::text size="sm" class="capitalize">{{ $color }}</x-keys::text>
                                    </td>
                                    <td class="p-2 border-b border-line-subtle text-center">
                                        <x-keys::button :color="$color" variant="solid" size="sm">Button</x-keys::button>
                                    </td>
                                    <td class="p-2 border-b border-line-subtle text-center">
                                        <x-keys::button :color="$color" variant="outlined" size="sm">Button</x-keys::button>
                                    </td>
                                    <td class="p-2 border-b border-line-subtle text-center">
                                        <x-keys::button :color="$color" variant="ghost" size="sm">Button</x-keys::button>
                                    </td>
                                    <td class="p-2 border-b border-line-subtle text-center">
                                        <x-keys::button :color="$color" variant="subtle" size="sm">Button</x-keys::button>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            {{-- Link Buttons --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Link Buttons</x-keys::heading>
                <div class="bg-surface p-6 rounded-lg">
                    <div class="flex flex-wrap gap-3">
                        <x-keys::button href="#" icon-left="arrow-top-right-on-square">External Link</x-keys::button>
                        <x-keys::button href="#" variant="outlined">Outlined Link</x-keys::button>
                        <x-keys::button href="#" disabled>Disabled Link</x-keys::button>
                    </div>
                </div>
            </div>

            {{-- Design Token Showcase --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">New Design Tokens in Action</x-keys::heading>
                <div class="bg-surface p-6 rounded-lg space-y-4">
                    <x-keys::text color="muted">
                        The button component now uses the refactored design token system:
                    </x-keys::text>
                    <ul class="space-y-2 ml-4">
                        <li class="flex items-start gap-2">
                            <x-keys::icon name="check" size="sm" class="text-success mt-0.5" />
                            <x-keys::text size="sm"><code class="bg-accent-subtle text-accent px-1.5 py-0.5 rounded">text-accent-contrast</code> for text on accent backgrounds</x-keys::text>
                        </li>
                        <li class="flex items-start gap-2">
                            <x-keys::icon name="check" size="sm" class="text-success mt-0.5" />
                            <x-keys::text size="sm"><code class="bg-accent-subtle text-accent px-1.5 py-0.5 rounded">text-primary</code> instead of redundant <code class="bg-danger-subtle text-danger px-1.5 py-0.5 rounded line-through">text-text</code></x-keys::text>
                        </li>
                        <li class="flex items-start gap-2">
                            <x-keys::icon name="check" size="sm" class="text-success mt-0.5" />
                            <x-keys::text size="sm"><code class="bg-accent-subtle text-accent px-1.5 py-0.5 rounded">border-line</code> instead of redundant <code class="bg-danger-subtle text-danger px-1.5 py-0.5 rounded line-through">border-border</code></x-keys::text>
                        </li>
                        <li class="flex items-start gap-2">
                            <x-keys::icon name="check" size="sm" class="text-success mt-0.5" />
                            <x-keys::text size="sm"><code class="bg-accent-subtle text-accent px-1.5 py-0.5 rounded">ring-focus</code> for unified focus ring styling</x-keys::text>
                        </li>
                        <li class="flex items-start gap-2">
                            <x-keys::icon name="check" size="sm" class="text-success mt-0.5" />
                            <x-keys::text size="sm">Simple icon names: <code class="bg-accent-subtle text-accent px-1.5 py-0.5 rounded">heart</code> instead of <code class="bg-danger-subtle text-danger px-1.5 py-0.5 rounded line-through">heroicon-o-heart</code></x-keys::text>
                        </li>
                        <li class="flex items-start gap-2">
                            <x-keys::icon name="check" size="sm" class="text-success mt-0.5" />
                            <x-keys::text size="sm">Accent color palette (no more brand duplication)</x-keys::text>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        {{-- Form Components Showcase --}}
        <section class="space-y-8">
            <div>
                <x-keys::heading level="h1" size="3xl">Form Components</x-keys::heading>
                <x-keys::text color="muted" size="lg" class="mt-2">
                    Comprehensive form components with the new design token system, full JavaScript functionality, and consistent styling.
                </x-keys::text>
            </div>

            {{-- Text Inputs --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Text Inputs</x-keys::heading>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Sizes</x-keys::heading>
                        <x-keys::input label="Extra Small" size="xs" placeholder="Extra small input..." />
                        <x-keys::input label="Small" size="sm" placeholder="Small input..." />
                        <x-keys::input label="Medium (Default)" size="md" placeholder="Medium input..." />
                        <x-keys::input label="Large" size="lg" placeholder="Large input..." />
                        <x-keys::input label="Extra Large" size="xl" placeholder="Extra large input..." />
                    </div>
                </x-keys::card>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">With Icons</x-keys::heading>
                        <x-keys::input label="Email" icon-left="envelope" placeholder="your@email.com" />
                        <x-keys::input label="Search" icon-right="magnifying-glass" placeholder="Search..." />
                        <x-keys::input label="Password" type="password" icon-left="lock-closed" placeholder="Enter password..." />
                    </div>
                </x-keys::card>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">States</x-keys::heading>
                        <x-keys::input label="Normal Input" placeholder="Type something..." />
                        <x-keys::input label="Disabled Input" disabled value="Cannot edit this field" />
                        <x-keys::input label="Required Input" required placeholder="This is required" />
                    </div>
                </x-keys::card>
            </div>

            {{-- Textareas --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Textareas</x-keys::heading>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::textarea label="Message" rows="4" placeholder="Enter your message..." />
                        <x-keys::textarea label="Auto-resize" auto-resize placeholder="This textarea grows with content..." />
                        <x-keys::textarea label="With Character Count" show-character-count max-length="200" placeholder="Limited to 200 characters..." />
                    </div>
                </x-keys::card>
            </div>

            {{-- Checkboxes & Radios --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Checkboxes & Radio Buttons</x-keys::heading>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <x-keys::card>
                        <div class="space-y-4">
                            <x-keys::heading level="h3" size="lg">Checkboxes</x-keys::heading>
                            <x-keys::checkbox label="Standard Checkbox" />
                            <x-keys::checkbox label="Checked by Default" checked />
                            <x-keys::checkbox label="Success Color" color="success" checked />
                            <x-keys::checkbox label="Danger Color" color="danger" />
                            <x-keys::checkbox variant="bordered" label="Bordered Variant" description="With description text" />
                            <x-keys::checkbox variant="card" title="Card Variant" description="Full card clickable area" icon="check-circle" />
                        </div>
                    </x-keys::card>

                    <x-keys::card>
                        <div class="space-y-4">
                            <x-keys::heading level="h3" size="lg">Radio Buttons</x-keys::heading>
                            <x-keys::radio name="radio-demo" value="1" label="Option 1" />
                            <x-keys::radio name="radio-demo" value="2" label="Option 2" checked />
                            <x-keys::radio name="radio-demo" value="3" label="Option 3" />
                            <x-keys::radio name="radio-demo2" value="1" variant="bordered" label="Bordered Option" description="With description" />
                            <x-keys::radio name="radio-demo2" value="2" variant="card" title="Card Option" description="Full card clickable" icon="check-badge" checked />
                        </div>
                    </x-keys::card>
                </div>
            </div>

            {{-- Toggle Switches --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Toggle Switches</x-keys::heading>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Sizes & Colors</x-keys::heading>
                        <x-keys::toggle size="sm" label="Small Toggle" />
                        <x-keys::toggle size="md" label="Medium Toggle (Default)" checked />
                        <x-keys::toggle size="lg" label="Large Toggle" />

                        <div class="border-t border-line pt-4 mt-4">
                            <x-keys::toggle label="Accent Color" color="brand" checked />
                            <x-keys::toggle label="Success Color" color="success" checked />
                            <x-keys::toggle label="Warning Color" color="warning" checked />
                            <x-keys::toggle label="Danger Color" color="danger" checked />
                        </div>

                        <div class="border-t border-line pt-4 mt-4">
                            <x-keys::toggle label="Enable Notifications" description="Receive email notifications for updates" checked />
                            <x-keys::toggle label="Dark Mode" description="Switch between light and dark themes" />
                        </div>
                    </div>
                </x-keys::card>
            </div>

            {{-- Complete Form Example --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Complete Form Example</x-keys::heading>

                <x-keys::card>
                    <form class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Contact Form</x-keys::heading>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <x-keys::input label="First Name" required placeholder="John" />
                            <x-keys::input label="Last Name" required placeholder="Doe" />
                        </div>

                        <x-keys::input type="email" label="Email Address" required icon-left="envelope" placeholder="john.doe@example.com" />

                        <x-keys::textarea label="Message" required rows="4" show-character-count max-length="500" placeholder="Tell us what you think..." />

                        <div class="space-y-3">
                            <x-keys::checkbox label="Subscribe to newsletter" />
                            <x-keys::checkbox label="I agree to the terms and conditions" required />
                        </div>

                        <div class="flex gap-3">
                            <x-keys::button type="submit" icon-right="paper-airplane">Submit Form</x-keys::button>
                            <x-keys::button type="button" variant="outlined">Cancel</x-keys::button>
                        </div>
                    </form>
                </x-keys::card>
            </div>

            {{-- Form States Showcase --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Form States & Validation</x-keys::heading>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::input label="Normal State" placeholder="Everything is fine" />
                        <x-keys::input label="Disabled State" disabled value="This field is disabled" />
                        <x-keys::input label="Required Field" required placeholder="This field is required" hint="Make sure to fill this out" />
                    </div>
                </x-keys::card>
            </div>
        </section>

        {{-- Advanced Form Components Showcase --}}
        <section class="space-y-8">
            <div>
                <x-keys::heading level="h1" size="3xl">Advanced Form Components</x-keys::heading>
                <x-keys::text color="muted" size="lg" class="mt-2">
                    Advanced form controls including selects, date pickers, time pickers, and dropdowns with rich functionality.
                </x-keys::text>
            </div>

            {{-- Select Components --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Select Components</x-keys::heading>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Basic Select</x-keys::heading>
                        <x-keys::select name="basic-select" label="Choose an option" placeholder="Select an option...">
                            <x-keys::select.option value="1">Option 1</x-keys::select.option>
                            <x-keys::select.option value="2">Option 2</x-keys::select.option>
                            <x-keys::select.option value="3">Option 3</x-keys::select.option>
                            <x-keys::select.option value="4">Option 4</x-keys::select.option>
                        </x-keys::select>
                    </div>
                </x-keys::card>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Searchable Select</x-keys::heading>
                        <x-keys::select name="searchable-select" label="Search for a country" placeholder="Type to search..." searchable>
                            <x-keys::select.option value="us">United States</x-keys::select.option>
                            <x-keys::select.option value="uk">United Kingdom</x-keys::select.option>
                            <x-keys::select.option value="ca">Canada</x-keys::select.option>
                            <x-keys::select.option value="au">Australia</x-keys::select.option>
                            <x-keys::select.option value="de">Germany</x-keys::select.option>
                            <x-keys::select.option value="fr">France</x-keys::select.option>
                            <x-keys::select.option value="it">Italy</x-keys::select.option>
                            <x-keys::select.option value="es">Spain</x-keys::select.option>
                        </x-keys::select>
                    </div>
                </x-keys::card>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Multiple Select with Chips</x-keys::heading>
                        <x-keys::select name="multiple-select" label="Select multiple tags" placeholder="Choose tags..." multiple searchable clearable>
                            <x-keys::select.option value="laravel">Laravel</x-keys::select.option>
                            <x-keys::select.option value="vue">Vue.js</x-keys::select.option>
                            <x-keys::select.option value="react">React</x-keys::select.option>
                            <x-keys::select.option value="tailwind">Tailwind CSS</x-keys::select.option>
                            <x-keys::select.option value="alpine">Alpine.js</x-keys::select.option>
                            <x-keys::select.option value="livewire">Livewire</x-keys::select.option>
                        </x-keys::select>
                    </div>
                </x-keys::card>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <x-keys::card>
                        <div class="space-y-4">
                            <x-keys::heading level="h4" size="md">Small Size</x-keys::heading>
                            <x-keys::select name="small-select" size="sm" placeholder="Small select...">
                                <x-keys::select.option value="1">Option 1</x-keys::select.option>
                                <x-keys::select.option value="2">Option 2</x-keys::select.option>
                            </x-keys::select>
                        </div>
                    </x-keys::card>

                    <x-keys::card>
                        <div class="space-y-4">
                            <x-keys::heading level="h4" size="md">Medium Size</x-keys::heading>
                            <x-keys::select name="medium-select" size="md" placeholder="Medium select...">
                                <x-keys::select.option value="1">Option 1</x-keys::select.option>
                                <x-keys::select.option value="2">Option 2</x-keys::select.option>
                            </x-keys::select>
                        </div>
                    </x-keys::card>

                    <x-keys::card>
                        <div class="space-y-4">
                            <x-keys::heading level="h4" size="md">Large Size</x-keys::heading>
                            <x-keys::select name="large-select" size="lg" placeholder="Large select...">
                                <x-keys::select.option value="1">Option 1</x-keys::select.option>
                                <x-keys::select.option value="2">Option 2</x-keys::select.option>
                            </x-keys::select>
                        </div>
                    </x-keys::card>
                </div>
            </div>

            {{-- DatePicker Components --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">DatePicker Components</x-keys::heading>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <x-keys::card>
                        <div class="space-y-4">
                            <x-keys::heading level="h3" size="lg">Single Date Picker</x-keys::heading>
                            <x-keys::date-picker
                                name="single-date"
                                label="Select a date"
                                placeholder="Choose date..."
                                clearable
                            />
                        </div>
                    </x-keys::card>

                    <x-keys::card>
                        <div class="space-y-4">
                            <x-keys::heading level="h3" size="lg">Date Range Picker</x-keys::heading>
                            <x-keys::date-picker
                                name="date-range"
                                label="Select date range"
                                placeholder="Choose dates..."
                                is-range
                                clearable
                            />
                        </div>
                    </x-keys::card>
                </div>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">With Quick Selectors</x-keys::heading>
                        <x-keys::date-picker
                            name="quick-select-date"
                            label="Date with quick selections"
                            placeholder="Pick a date..."
                            :quick-selectors="true"
                            clearable
                        />
                    </div>
                </x-keys::card>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Inline Calendar</x-keys::heading>
                        <x-keys::date-picker
                            name="inline-date"
                            inline
                        />
                    </div>
                </x-keys::card>
            </div>

            {{-- TimePicker Components --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">TimePicker Components</x-keys::heading>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <x-keys::card>
                        <div class="space-y-4">
                            <x-keys::heading level="h3" size="lg">12-Hour Format</x-keys::heading>
                            <x-keys::time-picker
                                name="time-12"
                                label="Select time (12-hour)"
                                placeholder="Select time..."
                                format="12"
                                clearable
                            />
                        </div>
                    </x-keys::card>

                    <x-keys::card>
                        <div class="space-y-4">
                            <x-keys::heading level="h3" size="lg">24-Hour Format</x-keys::heading>
                            <x-keys::time-picker
                                name="time-24"
                                label="Select time (24-hour)"
                                placeholder="Select time..."
                                format="24"
                                clearable
                            />
                        </div>
                    </x-keys::card>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <x-keys::card>
                        <div class="space-y-4">
                            <x-keys::heading level="h3" size="lg">With 15-Minute Steps</x-keys::heading>
                            <x-keys::time-picker
                                name="time-steps"
                                label="Time with intervals"
                                placeholder="Select time..."
                                :step="15"
                                clearable
                            />
                        </div>
                    </x-keys::card>

                    <x-keys::card>
                        <div class="space-y-4">
                            <x-keys::heading level="h3" size="lg">With Min/Max Time</x-keys::heading>
                            <x-keys::time-picker
                                name="time-range"
                                label="Business hours (9 AM - 5 PM)"
                                placeholder="Select time..."
                                min-time="09:00"
                                max-time="17:00"
                                clearable
                            />
                        </div>
                    </x-keys::card>
                </div>
            </div>

            {{-- Dropdown Components --}}
            <div class="space-y-4">
                <x-keys::heading level="h2" size="xl">Dropdown Components</x-keys::heading>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Basic Dropdown</x-keys::heading>
                        <div class="flex gap-4">
                            <x-keys::dropdown>
                                <x-slot:trigger>
                                    <x-keys::button variant="outlined" icon-right="chevron-down">
                                        Actions
                                    </x-keys::button>
                                </x-slot:trigger>
                                <x-slot:panel>
                                    <button type="button" class="w-full text-left px-3 py-2 text-sm text-primary hover:bg-hover rounded-md transition-colors">
                                        Edit
                                    </button>
                                    <button type="button" class="w-full text-left px-3 py-2 text-sm text-primary hover:bg-hover rounded-md transition-colors">
                                        Duplicate
                                    </button>
                                    <button type="button" class="w-full text-left px-3 py-2 text-sm text-primary hover:bg-hover rounded-md transition-colors">
                                        Archive
                                    </button>
                                    <div class="border-t border-line my-1"></div>
                                    <button type="button" class="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger-subtle rounded-md transition-colors">
                                        Delete
                                    </button>
                                </x-slot:panel>
                            </x-keys::dropdown>
                        </div>
                    </div>
                </x-keys::card>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Dropdown with Icons</x-keys::heading>
                        <div class="flex gap-4">
                            <x-keys::dropdown>
                                <x-slot:trigger>
                                    <x-keys::button icon-left="ellipsis-vertical" variant="ghost">
                                        <span class="sr-only">More options</span>
                                    </x-keys::button>
                                </x-slot:trigger>
                                <x-slot:panel>
                                    <button type="button" class="w-full text-left px-3 py-2 text-sm text-primary hover:bg-hover rounded-md transition-colors flex items-center gap-2">
                                        <x-keys::icon name="pencil" size="xs" />
                                        <span>Edit</span>
                                    </button>
                                    <button type="button" class="w-full text-left px-3 py-2 text-sm text-primary hover:bg-hover rounded-md transition-colors flex items-center gap-2">
                                        <x-keys::icon name="document-duplicate" size="xs" />
                                        <span>Duplicate</span>
                                    </button>
                                    <button type="button" class="w-full text-left px-3 py-2 text-sm text-primary hover:bg-hover rounded-md transition-colors flex items-center gap-2">
                                        <x-keys::icon name="share" size="xs" />
                                        <span>Share</span>
                                    </button>
                                    <div class="border-t border-line my-1"></div>
                                    <button type="button" class="w-full text-left px-3 py-2 text-sm text-danger hover:bg-danger-subtle rounded-md transition-colors flex items-center gap-2">
                                        <x-keys::icon name="trash" size="xs" />
                                        <span>Delete</span>
                                    </button>
                                </x-slot:panel>
                            </x-keys::dropdown>
                        </div>
                    </div>
                </x-keys::card>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Position & Alignment</x-keys::heading>
                        <div class="flex flex-wrap gap-4">
                            <x-keys::dropdown position="bottom" align="start">
                                <x-slot:trigger>
                                    <x-keys::button variant="outlined" size="sm">Bottom Start</x-keys::button>
                                </x-slot:trigger>
                                <x-slot:panel>
                                    <div class="px-3 py-2 text-sm text-primary">Bottom start aligned</div>
                                </x-slot:panel>
                            </x-keys::dropdown>

                            <x-keys::dropdown position="bottom" align="end">
                                <x-slot:trigger>
                                    <x-keys::button variant="outlined" size="sm">Bottom End</x-keys::button>
                                </x-slot:trigger>
                                <x-slot:panel>
                                    <div class="px-3 py-2 text-sm text-primary">Bottom end aligned</div>
                                </x-slot:panel>
                            </x-keys::dropdown>

                            <x-keys::dropdown position="top" align="start">
                                <x-slot:trigger>
                                    <x-keys::button variant="outlined" size="sm">Top Start</x-keys::button>
                                </x-slot:trigger>
                                <x-slot:panel>
                                    <div class="px-3 py-2 text-sm text-primary">Top start aligned</div>
                                </x-slot:panel>
                            </x-keys::dropdown>

                            <x-keys::dropdown position="right" align="start">
                                <x-slot:trigger>
                                    <x-keys::button variant="outlined" size="sm">Right</x-keys::button>
                                </x-slot:trigger>
                                <x-slot:panel>
                                    <div class="px-3 py-2 text-sm text-primary">Right aligned</div>
                                </x-slot:panel>
                            </x-keys::dropdown>
                        </div>
                    </div>
                </x-keys::card>

                <x-keys::card>
                    <div class="space-y-4">
                        <x-keys::heading level="h3" size="lg">Size Variants</x-keys::heading>
                        <div class="flex gap-4">
                            <x-keys::dropdown size="sm">
                                <x-slot:trigger>
                                    <x-keys::button size="sm">Small Dropdown</x-keys::button>
                                </x-slot:trigger>
                                <x-slot:panel>
                                    <div class="px-2 py-1.5 text-xs text-primary">Small dropdown content</div>
                                </x-slot:panel>
                            </x-keys::dropdown>

                            <x-keys::dropdown size="md">
                                <x-slot:trigger>
                                    <x-keys::button size="md">Medium Dropdown</x-keys::button>
                                </x-slot:trigger>
                                <x-slot:panel>
                                    <div class="px-3 py-2 text-sm text-primary">Medium dropdown content</div>
                                </x-slot:panel>
                            </x-keys::dropdown>

                            <x-keys::dropdown size="lg">
                                <x-slot:trigger>
                                    <x-keys::button size="lg">Large Dropdown</x-keys::button>
                                </x-slot:trigger>
                                <x-slot:panel>
                                    <div class="px-4 py-3 text-base text-primary">Large dropdown content</div>
                                </x-slot:panel>
                            </x-keys::dropdown>
                        </div>
                    </div>
                </x-keys::card>
            </div>
        </section>
    </div>
</x-layouts.sidebar>