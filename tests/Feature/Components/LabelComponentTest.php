<?php

use Keys\UI\Components\Label;

it('renders label with basic content', function () {
    $component = new Label;

    $view = $component->render();

    expect($view->name())->toBe('keys::components.label');
});

it('has correct base classes', function () {
    $component = new Label;

    expect($component->baseClasses())->toBe('block font-medium text-foreground');
});

it('applies size classes correctly', function () {
    expect((new Label(size: 'sm'))->sizeClasses())->toBe('text-xs');
    expect((new Label(size: 'md'))->sizeClasses())->toBe('text-sm');
    expect((new Label(size: 'lg'))->sizeClasses())->toBe('text-base');
    expect((new Label)->sizeClasses())->toBe('text-sm'); // default
});

it('handles required and optional flags', function () {
    $required = new Label(required: true);
    $optional = new Label(optional: true);
    $default = new Label;

    expect($required->required)->toBeTrue();
    expect($optional->optional)->toBeTrue();
    expect($default->required)->toBeFalse();
    expect($default->optional)->toBeFalse();
});

it('sets for attribute correctly', function () {
    $component = new Label(for: 'email-input');

    expect($component->for)->toBe('email-input');
});

it('sets for attribute correctly for accessibility', function () {
    $component = new Label(for: 'email-input', required: true);

    expect($component->for)->toBe('email-input');
    expect($component->required)->toBeTrue();
});
