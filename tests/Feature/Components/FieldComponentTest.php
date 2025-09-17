<?php

use Keys\UI\Components\Field;

it('renders field component with view', function () {
    $component = new Field;

    $view = $component->render();

    expect($view->name())->toBe('keys::components.field');
});

it('has correct base classes', function () {
    $component = new Field;

    expect($component->baseClasses())->toBe('space-y-1');
});

it('applies spacing classes correctly', function () {
    expect((new Field(spacing: 'sm'))->spacingClasses())->toBe('space-y-1');
    expect((new Field(spacing: 'md'))->spacingClasses())->toBe('space-y-1');
    expect((new Field(spacing: 'lg'))->spacingClasses())->toBe('space-y-2');
    expect((new Field(spacing: 'none'))->spacingClasses())->toBe('space-y-0');
    expect((new Field)->spacingClasses())->toBe('space-y-1'); // default
});

it('provides consistent wrapper for form composition', function () {
    $field = new Field(spacing: 'lg');

    expect($field->spacing)->toBe('lg');
    expect($field->spacingClasses())->toBe('space-y-2');
    expect($field->baseClasses())->toBe('space-y-1');
});
