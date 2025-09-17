<?php

use Keys\UI\Components\Radio;

it('renders radio component with view', function () {
    $component = new Radio;

    $view = $component->render();

    expect($view->name())->toBe('keys::components.radio');
});

it('auto-generates ID from name and value when not provided', function () {
    $component = new Radio(name: 'payment_method', value: 'credit_card');

    expect($component->id)->toBe('payment_method-credit_card');
});

it('preserves provided ID even when name and value are set', function () {
    $component = new Radio(name: 'payment_method', value: 'credit_card', id: 'custom-radio');

    expect($component->id)->toBe('custom-radio');
});

it('generates unique ID when name is not provided', function () {
    $component1 = new Radio;
    $component2 = new Radio;

    expect($component1->id)->not->toBe($component2->id);
    expect($component1->id)->toStartWith('radio-');
    expect($component2->id)->toStartWith('radio-');
});

it('validates variants correctly', function () {
    $validVariants = ['standard', 'bordered', 'colored', 'card'];

    foreach ($validVariants as $variant) {
        $component = new Radio(variant: $variant);
        expect($component->variant)->toBe($variant);
    }

    $invalidVariant = new Radio(variant: 'invalid');
    expect($invalidVariant->variant)->toBe('standard'); // falls back to default
});

it('validates colors correctly', function () {
    $validColors = ['brand', 'success', 'warning', 'danger', 'neutral'];

    foreach ($validColors as $color) {
        $component = new Radio(color: $color);
        expect($component->color)->toBe($color);
    }

    $invalidColor = new Radio(color: 'invalid');
    expect($invalidColor->color)->toBe('brand'); // falls back to default
});

it('converts label to title for card variant', function () {
    $component = new Radio(variant: 'card', label: 'Credit Card');

    expect($component->title)->toBe('Credit Card');
    expect($component->label)->toBeNull();
});

it('preserves title when provided for card variant', function () {
    $component = new Radio(variant: 'card', title: 'Custom Title', label: 'Label');

    expect($component->title)->toBe('Custom Title');
    expect($component->label)->toBe('Label');
});

it('applies correct radio classes based on size', function () {
    expect((new Radio(size: 'sm'))->radioClasses())->toContain('h-4 w-4 text-sm');
    expect((new Radio(size: 'md'))->radioClasses())->toContain('h-5 w-5 text-base');
    expect((new Radio(size: 'lg'))->radioClasses())->toContain('h-6 w-6 text-lg');
});

it('applies rounded-full for radio shape', function () {
    $component = new Radio;
    expect($component->radioClasses())->toContain('rounded-full');
});

it('applies correct state classes', function () {
    $default = new Radio;
    expect($default->getStateClasses())->toContain('bg-input border-border');

    $disabled = new Radio(disabled: true);
    expect($disabled->getStateClasses())->toContain('cursor-not-allowed');

    $withError = new Radio(hasError: true);
    expect($withError->getStateClasses())->toContain('border-danger');
});

it('applies correct wrapper classes for variants', function () {
    $standard = new Radio(variant: 'standard');
    expect($standard->wrapperClasses())->toBe('flex items-start gap-3');

    $bordered = new Radio(variant: 'bordered');
    expect($bordered->wrapperClasses())->toContain('border border-border rounded-lg');

    $card = new Radio(variant: 'card');
    expect($card->wrapperClasses())->toContain('p-4 border border-border rounded-lg');
});

it('applies colored background when checked', function () {
    $colored = new Radio(variant: 'colored', color: 'success', checked: true);
    expect($colored->wrapperClasses())->toContain('border-success bg-success/5');

    $coloredUnchecked = new Radio(variant: 'colored', color: 'success', checked: false);
    expect($coloredUnchecked->wrapperClasses())->toContain('border-border');
});

it('applies card background when checked', function () {
    $card = new Radio(variant: 'card', color: 'warning', checked: true);
    expect($card->wrapperClasses())->toContain('bg-warning/5 border-warning');

    $cardUnchecked = new Radio(variant: 'card', color: 'warning', checked: false);
    expect($cardUnchecked->wrapperClasses())->not->toContain('bg-warning/5 border-warning');
});

it('detects errors correctly', function () {
    $noErrors = new Radio;
    expect($noErrors->hasErrors())->toBeFalse();

    $withStringError = new Radio(errors: 'Selection is required');
    expect($withStringError->hasErrors())->toBeTrue();

    $withArrayErrors = new Radio(errors: ['Error 1', 'Error 2']);
    expect($withArrayErrors->hasErrors())->toBeTrue();

    $withEmptyErrors = new Radio(errors: []);
    expect($withEmptyErrors->hasErrors())->toBeFalse();
});

it('auto-sets hasError when errors are provided', function () {
    $withErrors = new Radio(errors: ['Selection is required']);
    $withoutErrors = new Radio;

    expect($withErrors->hasError)->toBeTrue();
    expect($withoutErrors->hasError)->toBeFalse();
});

it('supports collection errors from Laravel validation', function () {
    $errors = collect(['Payment method is required', 'Invalid selection']);
    $component = new Radio(errors: $errors);

    expect($component->hasErrors())->toBeTrue();
    expect($component->hasError)->toBeTrue();
});

it('detects card variant correctly', function () {
    $card = new Radio(variant: 'card');
    $standard = new Radio(variant: 'standard');

    expect($card->isCard())->toBeTrue();
    expect($standard->isCard())->toBeFalse();
});

it('detects content correctly', function () {
    $withLabel = new Radio(label: 'Credit Card');
    $withTitle = new Radio(title: 'PayPal');
    $withDescription = new Radio(description: 'Pay with PayPal account');
    $withoutContent = new Radio;

    expect($withLabel->hasContent())->toBeTrue();
    expect($withTitle->hasContent())->toBeTrue();
    expect($withDescription->hasContent())->toBeTrue();
    expect($withoutContent->hasContent())->toBeFalse();
});

it('handles actions correctly', function () {
    $withActions = new Radio(actions: [
        ['type' => 'external', 'icon' => 'heroicon-o-arrow-top-right-on-square', 'label' => 'Learn more', 'url' => 'https://example.com']
    ]);
    $withoutActions = new Radio;

    expect($withActions->hasActions())->toBeTrue();
    expect($withoutActions->hasActions())->toBeFalse();
});

it('computes action data correctly', function () {
    $component = new Radio(actions: [
        [
            'type' => 'external',
            'icon' => 'heroicon-o-arrow-top-right-on-square',
            'label' => 'Learn more',
            'url' => 'https://example.com'
        ]
    ]);

    $actionData = $component->getComputedActionData();

    expect($actionData)->toHaveCount(1);
    expect($actionData[0]['type'])->toBe('external');
    expect($actionData[0]['data_url'])->toBe('https://example.com');
    expect($actionData[0]['is_multi_state'])->toBeFalse();
});