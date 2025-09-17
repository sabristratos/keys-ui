<?php

use Keys\UI\Components\ChoiceGroup;

it('renders choice group component with view', function () {
    $component = new ChoiceGroup;

    $view = $component->render();

    expect($view->name())->toBe('keys::components.choice-group');
});

it('has correct fieldset classes', function () {
    $component = new ChoiceGroup;

    expect($component->fieldsetClasses())->toBe('space-y-3');
});

it('validates type correctly', function () {
    $checkbox = new ChoiceGroup(type: 'checkbox');
    $radio = new ChoiceGroup(type: 'radio');
    $invalid = new ChoiceGroup(type: 'invalid');

    expect($checkbox->type)->toBe('checkbox');
    expect($radio->type)->toBe('radio');
    expect($invalid->type)->toBe('checkbox'); // falls back to default
});

it('validates layout correctly', function () {
    $validLayouts = ['stacked', 'grid', 'inline'];

    foreach ($validLayouts as $layout) {
        $component = new ChoiceGroup(layout: $layout);
        expect($component->layout)->toBe($layout);
    }

    $invalid = new ChoiceGroup(layout: 'invalid');
    expect($invalid->layout)->toBe('stacked'); // falls back to default
});

it('applies correct legend classes based on size', function () {
    expect((new ChoiceGroup(size: 'sm'))->legendClasses())->toContain('text-sm');
    expect((new ChoiceGroup(size: 'md'))->legendClasses())->toContain('text-base');
    expect((new ChoiceGroup(size: 'lg'))->legendClasses())->toContain('text-lg');
});

it('applies disabled legend classes when disabled', function () {
    $disabled = new ChoiceGroup(disabled: true);
    expect($disabled->legendClasses())->toContain('text-neutral-500');
});

it('applies correct description classes based on size', function () {
    expect((new ChoiceGroup(size: 'sm'))->descriptionClasses())->toContain('text-xs');
    expect((new ChoiceGroup(size: 'md'))->descriptionClasses())->toContain('text-sm');
    expect((new ChoiceGroup(size: 'lg'))->descriptionClasses())->toContain('text-sm');
});

it('applies correct choices classes based on layout', function () {
    expect((new ChoiceGroup(layout: 'stacked'))->choicesClasses())->toBe('space-y-3');
    expect((new ChoiceGroup(layout: 'grid'))->choicesClasses())->toBe('grid grid-cols-1 md:grid-cols-2 gap-3');
    expect((new ChoiceGroup(layout: 'inline'))->choicesClasses())->toBe('flex flex-wrap gap-4');
});

it('detects legend correctly', function () {
    $withLegend = new ChoiceGroup(legend: 'Select payment method');
    $withoutLegend = new ChoiceGroup;
    $withEmptyLegend = new ChoiceGroup(legend: '');
    $withWhitespaceLegend = new ChoiceGroup(legend: '   ');

    expect($withLegend->hasLegend())->toBeTrue();
    expect($withoutLegend->hasLegend())->toBeFalse();
    expect($withEmptyLegend->hasLegend())->toBeFalse();
    expect($withWhitespaceLegend->hasLegend())->toBeFalse();
});

it('detects description correctly', function () {
    $withDescription = new ChoiceGroup(description: 'Choose your preferred payment method');
    $withoutDescription = new ChoiceGroup;
    $withEmptyDescription = new ChoiceGroup(description: '');
    $withWhitespaceDescription = new ChoiceGroup(description: '   ');

    expect($withDescription->hasDescription())->toBeTrue();
    expect($withoutDescription->hasDescription())->toBeFalse();
    expect($withEmptyDescription->hasDescription())->toBeFalse();
    expect($withWhitespaceDescription->hasDescription())->toBeFalse();
});

it('identifies radio group correctly', function () {
    $radioGroup = new ChoiceGroup(type: 'radio');
    $checkboxGroup = new ChoiceGroup(type: 'checkbox');

    expect($radioGroup->isRadioGroup())->toBeTrue();
    expect($radioGroup->isCheckboxGroup())->toBeFalse();
    expect($checkboxGroup->isRadioGroup())->toBeFalse();
    expect($checkboxGroup->isCheckboxGroup())->toBeTrue();
});

it('detects errors correctly', function () {
    $noErrors = new ChoiceGroup;
    expect($noErrors->hasErrors())->toBeFalse();

    $withStringError = new ChoiceGroup(errors: 'Selection is required');
    expect($withStringError->hasErrors())->toBeTrue();

    $withArrayErrors = new ChoiceGroup(errors: ['Error 1', 'Error 2']);
    expect($withArrayErrors->hasErrors())->toBeTrue();

    $withEmptyErrors = new ChoiceGroup(errors: []);
    expect($withEmptyErrors->hasErrors())->toBeFalse();
});

it('auto-sets hasError when errors are provided', function () {
    $withErrors = new ChoiceGroup(errors: ['Selection is required']);
    $withoutErrors = new ChoiceGroup;

    expect($withErrors->hasError)->toBeTrue();
    expect($withoutErrors->hasError)->toBeFalse();
});

it('supports collection errors from Laravel validation', function () {
    $errors = collect(['Payment method is required', 'Invalid selection']);
    $component = new ChoiceGroup(errors: $errors);

    expect($component->hasErrors())->toBeTrue();
    expect($component->hasError)->toBeTrue();
});

it('generates description ID correctly', function () {
    $withName = new ChoiceGroup(name: 'payment_method');
    $withoutName = new ChoiceGroup;

    expect($withName->getDescriptionId())->toBe('payment_method-description');
    expect($withoutName->getDescriptionId())->toBe('choicegroup-description');
});

it('provides correct accessibility attributes', function () {
    $required = new ChoiceGroup(required: true);
    $withError = new ChoiceGroup(hasError: true);
    $withDescription = new ChoiceGroup(description: 'Select your option');

    $requiredAttrs = $required->getAccessibilityAttributes();
    expect($requiredAttrs)->toHaveKey('aria-required');
    expect($requiredAttrs['aria-required'])->toBe('true');

    $errorAttrs = $withError->getAccessibilityAttributes();
    expect($errorAttrs)->toHaveKey('aria-invalid');
    expect($errorAttrs['aria-invalid'])->toBe('true');

    $descriptionAttrs = $withDescription->getAccessibilityAttributes();
    expect($descriptionAttrs)->toHaveKey('aria-describedby');
    expect($descriptionAttrs['aria-describedby'])->toBe('choicegroup-description');
});