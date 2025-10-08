<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Test Layout - Component Testing</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    {{-- Keys UI Scripts (CSS + JS) --}}
    <x-keys::scripts />
</head>
<body class="h-full bg-base text-primary font-sans antialiased">
    <div class="min-h-full p-8">
        <div class="max-w-2xl mx-auto">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-heading">Component Test Page</h1>
                <p class="text-muted mt-2">Minimal layout for debugging component issues</p>
            </div>

            {{ $slot }}
        </div>
    </div>
</body>
</html>
