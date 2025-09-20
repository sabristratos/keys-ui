<!DOCTYPE html>
<html>
<head>
    <title>Toggle Test</title>
    <keys:scripts />
</head>
<body>
    <div class="p-8">
        <h1 class="text-2xl mb-6">Toggle Component Test</h1>

        {{-- Small toggle --}}
        <div class="mb-6">
            <h2 class="text-lg font-semibold mb-2">Small Toggle</h2>
            <x-keys::toggle
                name="small_toggle"
                size="sm"
                label="Small Toggle"
                value="1"
            />
        </div>

        {{-- Medium toggle --}}
        <div class="mb-6">
            <h2 class="text-lg font-semibold mb-2">Medium Toggle (Default)</h2>
            <x-keys::toggle
                name="medium_toggle"
                size="md"
                label="Medium Toggle"
                value="1"
            />
        </div>

        {{-- Large toggle --}}
        <div class="mb-6">
            <h2 class="text-lg font-semibold mb-2">Large Toggle</h2>
            <x-keys::toggle
                name="large_toggle"
                size="lg"
                label="Large Toggle"
                value="1"
            />
        </div>

        {{-- Toggle with actions --}}
        <div class="mt-8">
            <h2 class="text-lg font-semibold mb-2">Toggle with Actions</h2>
            <x-keys::toggle
                name="action_toggle"
                label="Toggle with Actions"
                description="This toggle has some actions"
                :actions="[
                    ['type' => 'info', 'icon' => 'heroicon-o-information-circle', 'label' => 'Info']
                ]"
            />
        </div>
    </div>
</body>
</html>