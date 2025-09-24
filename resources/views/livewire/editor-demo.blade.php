<div class="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $title }}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
            Experience real-time synchronization between the Keys UI Editor and Livewire
        </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {{-- Editor Panel --}}
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Rich Text Editor</h2>
                <div class="flex gap-2">
                    <button
                        onclick="if(window.manualSyncEditor) window.manualSyncEditor();"
                        wire:click="submitContent"
                        class="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 rounded-md transition-colors"
                    >
                        Submit Content
                    </button>
                    <button
                        wire:click="resetContent"
                        class="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                    >
                        Reset Content
                    </button>
                    <button
                        wire:click="clearContent"
                        class="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {{-- Editor Component --}}
            <x-keys::editor
                name="content"
                wire:model.live="content"
                height="300px"
                placeholder="Start typing your content..."
                :toolbar="[
                    ['bold', 'italic', 'underline', 'strike'],
                    [['header' => [1, 2, 3, false]]],
                    [['list' => 'ordered'], ['list' => 'bullet']],
                    ['blockquote', 'code-block'],
                    ['link'],
                    ['clean']
                ]"
            />

            {{-- Editor Stats --}}
            <div class="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Words: <strong>{{ $wordCount }}</strong></span>
                <span>Characters: <strong>{{ $characterCount }}</strong></span>
            </div>
        </div>

        {{-- Rendered Output Panel --}}
        <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Live Preview</h2>

            {{-- Rendered Content --}}
            <div class="min-h-[300px] p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="prose dark:prose-invert max-w-none">
                    {!! $content ?: '<p class="text-gray-500 italic">Content will appear here as you type...</p>' !!}
                </div>
            </div>

            {{-- Raw HTML Display --}}
            <div class="space-y-2">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Raw HTML Output:</h3>
                <div class="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md">
                    <pre class="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">{{ $content ?: 'No content' }}</pre>
                </div>
            </div>
        </div>
    </div>

    {{-- Technical Information --}}
    <div class="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">How It Works</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
                <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">Livewire Integration</h4>
                <ul class="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• <code class="px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded">wire:model="content"</code> provides two-way binding</li>
                    <li>• Content syncs automatically as you type</li>
                    <li>• Quill editor state preserved during Livewire updates</li>
                    <li>• <code class="px-1 py-0.5 bg-blue-100 dark:bg-blue-800 rounded">wire:ignore</code> prevents DOM morphing issues</li>
                </ul>
            </div>
            <div>
                <h4 class="font-medium text-blue-800 dark:text-blue-200 mb-2">Technical Features</h4>
                <ul class="space-y-1 text-blue-700 dark:text-blue-300">
                    <li>• Real-time word and character counting</li>
                    <li>• Rich text formatting with Quill.js</li>
                    <li>• Cursor position preserved during updates</li>
                    <li>• Graceful handling of HTML content</li>
                </ul>
            </div>
        </div>
    </div>

    {{-- Debug Panel (Development Only) --}}
    @if(app()->environment('local'))
        <div class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Debug Information</h3>
            <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>Content Length: {{ strlen($content) }} bytes</div>
                <div>Last Update: <span wire:poll.1s>{{ now()->format('H:i:s') }}</span></div>
                <div>Component: {{ $this->getName() }}</div>
            </div>
        </div>
    @endif

    {{-- CSS fix for Quill.js bullet lists in prose content --}}
    <style>
        .prose ol li[data-list="bullet"] {
            list-style-type: disc !important;
            margin-left: 1.25rem;
        }

        .prose ol li[data-list="bullet"] .ql-ui {
            display: none;
        }

        .prose ol[data-list="bullet"] {
            list-style-type: none;
            padding-left: 0;
        }

        .prose ol li[data-list="ordered"] {
            list-style-type: decimal !important;
        }
    </style>
</div>