{{-- Test page to verify layout's default sidebar with built-in logo --}}
<x-layouts.sidebar title="Test Default Sidebar">
    <div class="space-y-6">
        <div>
            <h1 class="text-3xl font-bold text-foreground mb-2">Default Sidebar Test</h1>
            <p class="text-lg text-muted">This page uses the layout's default sidebar with built-in logo.</p>
        </div>

        <x-keys::card>
            <x-slot:header>
                <h2 class="text-lg font-semibold">Layout Configuration</h2>
            </x-slot:header>
            <x-slot:body>
                <div class="space-y-2 text-sm">
                    <p><strong>Sidebar:</strong> Using layout's default sidebar (not overridden)</p>
                    <p><strong>Logo:</strong> Built-in default logo from layout</p>
                    <p><strong>Title:</strong> From config('app.name')</p>
                    <p><strong>Subtitle:</strong> "Dashboard" (default)</p>
                </div>
            </x-slot:body>
        </x-keys::card>

        <x-keys::card>
            <x-slot:header>
                <h2 class="text-lg font-semibold">Expected Behavior</h2>
            </x-slot:header>
            <x-slot:body>
                <ul class="list-disc list-inside space-y-2 text-sm">
                    <li><strong>Mobile:</strong> Only toggle button visible</li>
                    <li><strong>Desktop Expanded:</strong> Logo + Title + Subtitle + Toggle</li>
                    <li><strong>Desktop Collapsed:</strong> Logo + Toggle (centered, wrapped)</li>
                </ul>
            </x-slot:body>
        </x-keys::card>
    </div>
</x-layouts.sidebar>
