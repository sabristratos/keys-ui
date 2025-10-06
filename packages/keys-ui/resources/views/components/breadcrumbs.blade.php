@php
    $containerClasses = 'overflow-hidden min-w-0 text-sm text-primary';
    $navClasses = 'flex min-w-0';
    $listClasses = 'flex items-center space-x-1 min-w-0 flex-wrap sm:flex-nowrap';
@endphp

<div {{ $attributes->merge(['class' => $containerClasses])->merge($dataAttributes) }}>
    <nav class="{{ $navClasses }}" aria-label="Breadcrumb">
        <ol class="{{ $listClasses }}">
            {{ $slot }}
        </ol>
    </nav>
</div>