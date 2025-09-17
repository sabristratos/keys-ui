<?php

use Keys\UI\Components\Alert;

test('alert component renders with default variant', function () {
    $component = new Alert();

    expect($component->variant)->toBe('info');
    expect($component->size)->toBe('md');
    expect($component->dismissible)->toBeFalse();
});

test('alert component handles all semantic variants', function () {
    $variants = ['info', 'success', 'warning', 'danger', 'neutral'];

    foreach ($variants as $variant) {
        $component = new Alert(variant: $variant);
        expect($component->variant)->toBe($variant);
        expect($component->variantClasses())->toContain($variant);
    }
});

test('alert component generates correct size classes', function () {
    $sizes = [
        'sm' => 'p-3 space-y-2 text-sm',
        'md' => 'p-4 space-y-3 text-sm',
        'lg' => 'p-5 space-y-4 text-base'
    ];

    foreach ($sizes as $size => $expectedClass) {
        $component = new Alert(size: $size);
        expect($component->sizeClasses())->toBe($expectedClass);
    }
});

test('alert component provides default icons for each variant', function () {
    $expectedIcons = [
        'info' => 'heroicon-o-information-circle',
        'success' => 'heroicon-o-check-circle',
        'warning' => 'heroicon-o-exclamation-triangle',
        'danger' => 'heroicon-o-x-circle',
        'neutral' => 'heroicon-o-chat-bubble-left-ellipsis'
    ];

    foreach ($expectedIcons as $variant => $expectedIcon) {
        $component = new Alert(variant: $variant);
        expect($component->defaultIcon())->toBe($expectedIcon);
        expect($component->iconName())->toBe($expectedIcon);
    }
});

test('alert component accepts custom icons', function () {
    $customIcon = 'heroicon-o-light-bulb';
    $component = new Alert(icon: $customIcon);

    expect($component->iconName())->toBe($customIcon);
});

test('alert component generates correct icon colors', function () {
    $expectedColors = [
        'info' => 'text-info',
        'success' => 'text-success',
        'warning' => 'text-warning',
        'danger' => 'text-danger',
        'neutral' => 'text-neutral'
    ];

    foreach ($expectedColors as $variant => $expectedColor) {
        $component = new Alert(variant: $variant);
        expect($component->iconColor())->toBe($expectedColor);
    }
});

test('alert component handles titles correctly', function () {
    $title = 'Test Alert Title';
    $component = new Alert(title: $title);

    expect($component->title)->toBe($title);
});

test('alert component can be dismissible', function () {
    $component = new Alert(dismissible: true);

    expect($component->dismissible)->toBeTrue();
});

test('alert component generates correct title classes by size', function () {
    $expectedClasses = [
        'sm' => 'text-sm font-medium',
        'md' => 'text-base font-medium',
        'lg' => 'text-lg font-semibold'
    ];

    foreach ($expectedClasses as $size => $expectedClass) {
        $component = new Alert(size: $size);
        expect($component->titleClasses())->toBe($expectedClass);
    }
});

test('alert component generates correct content classes by size', function () {
    $expectedClasses = [
        'sm' => 'text-xs opacity-90',
        'md' => 'text-sm opacity-90',
        'lg' => 'text-base opacity-90'
    ];

    foreach ($expectedClasses as $size => $expectedClass) {
        $component = new Alert(size: $size);
        expect($component->contentClasses())->toBe($expectedClass);
    }
});

test('alert component generates correct dismiss button size', function () {
    $expectedSizes = [
        'sm' => 'xs',
        'md' => 'sm',
        'lg' => 'md'
    ];

    foreach ($expectedSizes as $size => $expectedButtonSize) {
        $component = new Alert(size: $size);
        expect($component->dismissButtonSize())->toBe($expectedButtonSize);
    }
});

test('alert component returns correct view', function () {
    $component = new Alert();

    $view = $component->render();
    expect($view->name())->toBe('keys::components.alert');
});