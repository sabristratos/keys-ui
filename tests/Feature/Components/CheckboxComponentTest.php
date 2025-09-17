<?php

use Keys\UI\Components\Checkbox;

it('renders checkbox component with view', function () {
    $component = new Checkbox;

    $view = $component->render();

    expect($view->name())->toBe('keys::components.checkbox');
});

it('auto-generates ID when not provided', function () {
    $component = new Checkbox(name: 'newsletter');

    expect($component->id)->toBe('newsletter');
});

it('preserves provided ID even when name is set', function () {
    $component = new Checkbox(name: 'newsletter', id: 'custom-checkbox');

    expect($component->id)->toBe('custom-checkbox');
});

it('generates unique ID when name is not provided', function () {
    $component1 = new Checkbox;
    $component2 = new Checkbox;

    expect($component1->id)->not->toBe($component2->id);
    expect($component1->id)->toStartWith('checkbox-');
    expect($component2->id)->toStartWith('checkbox-');
});

it('validates variants correctly', function () {
    $validVariants = ['standard', 'bordered', 'colored', 'card'];

    foreach ($validVariants as $variant) {
        $component = new Checkbox(variant: $variant);
        expect($component->variant)->toBe($variant);
    }

    $invalidVariant = new Checkbox(variant: 'invalid');
    expect($invalidVariant->variant)->toBe('standard'); // falls back to default
});

it('validates colors correctly', function () {
    $validColors = ['brand', 'success', 'warning', 'danger', 'neutral'];

    foreach ($validColors as $color) {
        $component = new Checkbox(color: $color);
        expect($component->color)->toBe($color);
    }

    $invalidColor = new Checkbox(color: 'invalid');
    expect($invalidColor->color)->toBe('brand'); // falls back to default
});

it('converts label to title for card variant', function () {
    $component = new Checkbox(variant: 'card', label: 'Enable notifications');

    expect($component->title)->toBe('Enable notifications');
    expect($component->label)->toBeNull();
});

it('preserves title when provided for card variant', function () {
    $component = new Checkbox(variant: 'card', title: 'Custom Title', label: 'Label');

    expect($component->title)->toBe('Custom Title');
    expect($component->label)->toBe('Label');
});

it('applies correct checkbox classes based on size', function () {
    expect((new Checkbox(size: 'sm'))->checkboxClasses())->toContain('h-4 w-4 text-sm');
    expect((new Checkbox(size: 'md'))->checkboxClasses())->toContain('h-5 w-5 text-base');
    expect((new Checkbox(size: 'lg'))->checkboxClasses())->toContain('h-6 w-6 text-lg');
});

it('applies correct state classes', function () {
    $default = new Checkbox;
    expect($default->getStateClasses())->toContain('bg-input border-border');

    $disabled = new Checkbox(disabled: true);
    expect($disabled->getStateClasses())->toContain('cursor-not-allowed');

    $withError = new Checkbox(hasError: true);
    expect($withError->getStateClasses())->toContain('border-danger');
});

it('applies correct wrapper classes for variants', function () {
    $standard = new Checkbox(variant: 'standard');
    expect($standard->wrapperClasses())->toBe('flex items-start gap-3');

    $bordered = new Checkbox(variant: 'bordered');
    expect($bordered->wrapperClasses())->toContain('border border-border rounded-lg');

    $card = new Checkbox(variant: 'card');
    expect($card->wrapperClasses())->toContain('p-4 border border-border rounded-lg');
});

it('applies colored background when checked', function () {
    $colored = new Checkbox(variant: 'colored', color: 'brand', checked: true);
    expect($colored->wrapperClasses())->toContain('border-brand bg-brand/5');

    $coloredUnchecked = new Checkbox(variant: 'colored', color: 'brand', checked: false);
    expect($coloredUnchecked->wrapperClasses())->toContain('border-border');
});

it('applies card background when checked', function () {
    $card = new Checkbox(variant: 'card', color: 'success', checked: true);
    expect($card->wrapperClasses())->toContain('bg-success/5 border-success');

    $cardUnchecked = new Checkbox(variant: 'card', color: 'success', checked: false);
    expect($cardUnchecked->wrapperClasses())->not->toContain('bg-success/5 border-success');
});

it('detects errors correctly', function () {
    $noErrors = new Checkbox;
    expect($noErrors->hasErrors())->toBeFalse();

    $withStringError = new Checkbox(errors: 'Field is required');
    expect($withStringError->hasErrors())->toBeTrue();

    $withArrayErrors = new Checkbox(errors: ['Error 1', 'Error 2']);
    expect($withArrayErrors->hasErrors())->toBeTrue();

    $withEmptyErrors = new Checkbox(errors: []);
    expect($withEmptyErrors->hasErrors())->toBeFalse();
});

it('auto-sets hasError when errors are provided', function () {
    $withErrors = new Checkbox(errors: ['Field is required']);
    $withoutErrors = new Checkbox;

    expect($withErrors->hasError)->toBeTrue();
    expect($withoutErrors->hasError)->toBeFalse();
});

it('supports collection errors from Laravel validation', function () {
    $errors = collect(['Checkbox must be checked', 'Terms acceptance required']);
    $component = new Checkbox(errors: $errors);

    expect($component->hasErrors())->toBeTrue();
    expect($component->hasError)->toBeTrue();
});

it('detects card variant correctly', function () {
    $card = new Checkbox(variant: 'card');
    $standard = new Checkbox(variant: 'standard');

    expect($card->isCard())->toBeTrue();
    expect($standard->isCard())->toBeFalse();
});

it('detects content correctly', function () {
    $withLabel = new Checkbox(label: 'Accept terms');
    $withTitle = new Checkbox(title: 'Newsletter');
    $withDescription = new Checkbox(description: 'Subscribe to our newsletter');
    $withoutContent = new Checkbox;

    expect($withLabel->hasContent())->toBeTrue();
    expect($withTitle->hasContent())->toBeTrue();
    expect($withDescription->hasContent())->toBeTrue();
    expect($withoutContent->hasContent())->toBeFalse();
});

it('handles actions correctly', function () {
    $withActions = new Checkbox(actions: [
        ['type' => 'copy', 'icon' => 'heroicon-o-clipboard', 'label' => 'Copy']
    ]);
    $withoutActions = new Checkbox;

    expect($withActions->hasActions())->toBeTrue();
    expect($withoutActions->hasActions())->toBeFalse();
});

it('computes action data correctly', function () {
    $component = new Checkbox(actions: [
        [
            'type' => 'copy',
            'icon' => 'heroicon-o-clipboard',
            'label' => 'Copy to clipboard',
            'icon_success' => 'heroicon-o-check',
            'label_success' => 'Copied!'
        ]
    ]);

    $actionData = $component->getComputedActionData();

    expect($actionData)->toHaveCount(1);
    expect($actionData[0]['type'])->toBe('copy');
    expect($actionData[0]['is_multi_state'])->toBeTrue();
    expect($actionData[0]['icon_success'])->toBe('heroicon-o-check');
});