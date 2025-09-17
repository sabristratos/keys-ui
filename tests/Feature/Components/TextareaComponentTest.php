<?php

use Keys\UI\Components\Textarea;

it('renders textarea component with view', function () {
    $component = new Textarea;

    $view = $component->render();

    expect($view->name())->toBe('keys::components.textarea');
});

it('has correct base classes', function () {
    $component = new Textarea;

    expect($component->baseClasses())->toBe('block w-full rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2');
});

it('applies size classes correctly', function () {
    expect((new Textarea(size: 'sm'))->sizeClasses())->toBe('px-3 py-1.5 text-sm');
    expect((new Textarea(size: 'md'))->sizeClasses())->toBe('px-3 py-2 text-sm');
    expect((new Textarea(size: 'lg'))->sizeClasses())->toBe('px-4 py-2.5 text-base');
    expect((new Textarea)->sizeClasses())->toBe('px-3 py-2 text-sm'); // default
});

it('applies resize classes correctly', function () {
    expect((new Textarea(resize: 'none'))->resizeClasses())->toBe('resize-none');
    expect((new Textarea(resize: 'both'))->resizeClasses())->toBe('resize');
    expect((new Textarea(resize: 'horizontal'))->resizeClasses())->toBe('resize-x');
    expect((new Textarea(resize: 'vertical'))->resizeClasses())->toBe('resize-y');
    expect((new Textarea)->resizeClasses())->toBe('resize-y'); // default
});

it('generates correct state classes', function () {
    $default = new Textarea;
    expect($default->stateClasses())->toContain('bg-input border-border text-foreground');

    $disabled = new Textarea(disabled: true);
    expect($disabled->stateClasses())->toContain('cursor-not-allowed');

    $withError = new Textarea(hasError: true);
    expect($withError->stateClasses())->toBe('bg-input border-danger text-foreground focus:border-danger focus:ring-danger');
});

it('auto-generates ID from name when not provided', function () {
    $component = new Textarea(name: 'description');

    expect($component->id)->toBe('description');
});

it('preserves provided ID even when name is set', function () {
    $component = new Textarea(name: 'description', id: 'custom-id');

    expect($component->id)->toBe('custom-id');
});

it('detects shorthand mode correctly', function () {
    $shorthand = new Textarea(label: 'Description');
    $regular = new Textarea;

    expect($shorthand->isShorthand())->toBeTrue();
    expect($regular->isShorthand())->toBeFalse();
});

it('detects errors correctly', function () {
    $noErrors = new Textarea;
    expect($noErrors->hasErrors())->toBeFalse();

    $withStringError = new Textarea(errors: 'Field is required');
    expect($withStringError->hasErrors())->toBeTrue();

    $withArrayErrors = new Textarea(errors: ['Error 1', 'Error 2']);
    expect($withArrayErrors->hasErrors())->toBeTrue();

    $withEmptyErrors = new Textarea(errors: []);
    expect($withEmptyErrors->hasErrors())->toBeFalse();
});

it('applies icon padding correctly', function () {
    $leftIcon = new Textarea(iconLeft: 'user');
    expect($leftIcon->iconPadding())->toBe('pl-10');

    $rightIcon = new Textarea(iconRight: 'search');
    expect($rightIcon->iconPadding())->toBe('pr-10');

    $bothIcons = new Textarea(iconLeft: 'user', iconRight: 'search');
    expect($bothIcons->iconPadding())->toBe('pl-10 pr-10');

    $noIcons = new Textarea;
    expect($noIcons->iconPadding())->toBe('');
});

it('sets icon size based on textarea size', function () {
    expect((new Textarea(size: 'sm'))->iconSize())->toBe('xs');
    expect((new Textarea(size: 'md'))->iconSize())->toBe('sm');
    expect((new Textarea(size: 'lg'))->iconSize())->toBe('md');
});

it('uses top positioning for icons instead of centered', function () {
    $component = new Textarea;
    expect($component->iconPosition())->toBe('top-3');
});

it('handles textarea-specific attributes', function () {
    $component = new Textarea(rows: 6, cols: 50);
    expect($component->rows)->toBe(6);
    expect($component->cols)->toBe(50);

    $defaultComponent = new Textarea;
    expect($defaultComponent->rows)->toBe(4); // default
    expect($defaultComponent->cols)->toBeNull();
});

it('supports auto-resize functionality', function () {
    $autoResize = new Textarea(autoResize: true);
    $regular = new Textarea;

    expect($autoResize->autoResize)->toBeTrue();
    expect($regular->autoResize)->toBeFalse();
});

it('auto-sets hasError when errors are provided', function () {
    $withErrors = new Textarea(errors: ['Field is required']);
    $withoutErrors = new Textarea;

    expect($withErrors->hasError)->toBeTrue();
    expect($withoutErrors->hasError)->toBeFalse();
});

it('supports collection errors from Laravel validation', function () {
    $errors = collect(['Description is required', 'Description must be at least 10 characters']);
    $component = new Textarea(errors: $errors);

    expect($component->hasErrors())->toBeTrue();
    expect($component->hasError)->toBeTrue();
});

it('generates correct action data for textarea-specific actions', function () {
    $component = new Textarea(clearable: true, copyable: true);
    $actions = $component->getComputedActionData();

    expect($actions)->toHaveCount(2);
    expect($actions[0]['type'])->toBe('clear');
    expect($actions[0]['label'])->toBe('Clear textarea');
    expect($actions[1]['type'])->toBe('copy');
    expect($actions[1]['label'])->toBe('Copy to clipboard');
});

it('handles all textarea actions correctly', function () {
    $component = new Textarea(
        clearable: true,
        copyable: true,
        externalUrl: 'https://example.com',
        actions: [
            [
                'type' => 'custom',
                'icon' => 'heroicon-o-cog',
                'label' => 'Custom action'
            ]
        ]
    );

    $actions = $component->getAllActions();
    expect($actions)->toHaveCount(4);
    expect($actions[0]['type'])->toBe('clear');
    expect($actions[1]['type'])->toBe('copy');
    expect($actions[2]['type'])->toBe('external');
    expect($actions[3]['type'])->toBe('custom');
});

it('supports all standard textarea attributes', function () {
    $component = new Textarea(
        name: 'bio',
        id: 'user-bio',
        value: 'Initial content',
        placeholder: 'Enter your bio...',
        disabled: true,
        readonly: false,
        required: true
    );

    expect($component->name)->toBe('bio');
    expect($component->id)->toBe('user-bio');
    expect($component->value)->toBe('Initial content');
    expect($component->placeholder)->toBe('Enter your bio...');
    expect($component->disabled)->toBeTrue();
    expect($component->readonly)->toBeFalse();
    expect($component->required)->toBeTrue();
});