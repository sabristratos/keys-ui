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