<?php

use Keys\UI\Components\Input;

it('renders input component with view', function () {
    $component = new Input;

    $view = $component->render();

    expect($view->name())->toBe('keys::components.input');
});

it('has correct base classes', function () {
    $component = new Input;

    expect($component->baseClasses())->toBe('block w-full rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2');
});

it('applies size classes correctly', function () {
    expect((new Input(size: 'sm'))->sizeClasses())->toBe('px-3 py-1.5 text-sm');
    expect((new Input(size: 'md'))->sizeClasses())->toBe('px-3 py-2 text-sm');
    expect((new Input(size: 'lg'))->sizeClasses())->toBe('px-4 py-2.5 text-base');
    expect((new Input)->sizeClasses())->toBe('px-3 py-2 text-sm'); // default
});

it('generates correct state classes', function () {
    $default = new Input;
    expect($default->stateClasses())->toContain('bg-input border-border text-foreground');

    $disabled = new Input(disabled: true);
    expect($disabled->stateClasses())->toContain('cursor-not-allowed');

    $withError = new Input(hasError: true);
    expect($withError->stateClasses())->toBe('bg-input border-danger text-foreground focus:border-danger focus:ring-danger');
});

it('auto-generates ID from name when not provided', function () {
    $component = new Input(name: 'email');

    expect($component->id)->toBe('email');
});

it('preserves provided ID even when name is set', function () {
    $component = new Input(name: 'email', id: 'custom-id');

    expect($component->id)->toBe('custom-id');
});

it('detects shorthand mode correctly', function () {
    $shorthand = new Input(label: 'Email Address');
    $regular = new Input;

    expect($shorthand->isShorthand())->toBeTrue();
    expect($regular->isShorthand())->toBeFalse();
});

it('detects errors correctly', function () {
    $noErrors = new Input;
    expect($noErrors->hasErrors())->toBeFalse();

    $withStringError = new Input(errors: 'Field is required');
    expect($withStringError->hasErrors())->toBeTrue();

    $withArrayErrors = new Input(errors: ['Error 1', 'Error 2']);
    expect($withArrayErrors->hasErrors())->toBeTrue();

    $withEmptyErrors = new Input(errors: []);
    expect($withEmptyErrors->hasErrors())->toBeFalse();
});

it('applies icon padding correctly', function () {
    $leftIcon = new Input(iconLeft: 'user');
    expect($leftIcon->iconPadding())->toBe('pl-10');

    $rightIcon = new Input(iconRight: 'search');
    expect($rightIcon->iconPadding())->toBe('pr-10');

    $bothIcons = new Input(iconLeft: 'user', iconRight: 'search');
    expect($bothIcons->iconPadding())->toBe('pl-10 pr-10');

    $noIcons = new Input;
    expect($noIcons->iconPadding())->toBe('');
});

it('sets icon size based on input size', function () {
    expect((new Input(size: 'sm'))->iconSize())->toBe('xs');
    expect((new Input(size: 'md'))->iconSize())->toBe('sm');
    expect((new Input(size: 'lg'))->iconSize())->toBe('md');
});

it('handles all input types', function () {
    $types = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'];

    foreach ($types as $type) {
        $component = new Input(type: $type);
        expect($component->type)->toBe($type);
    }
});

it('auto-sets hasError when errors are provided', function () {
    $withErrors = new Input(errors: ['Field is required']);
    $withoutErrors = new Input;

    expect($withErrors->hasError)->toBeTrue();
    expect($withoutErrors->hasError)->toBeFalse();
});

it('supports collection errors from Laravel validation', function () {
    $errors = collect(['Email is required', 'Email must be valid']);
    $component = new Input(errors: $errors);

    expect($component->hasErrors())->toBeTrue();
    expect($component->hasError)->toBeTrue();
});
