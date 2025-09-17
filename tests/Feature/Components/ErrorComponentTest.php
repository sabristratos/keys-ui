<?php

use Keys\UI\Components\Error;

it('renders error component with view', function () {
    $component = new Error;

    $view = $component->render();

    expect($view->name())->toBe('keys::components.error');
});

it('has correct base classes', function () {
    $component = new Error;

    expect($component->baseClasses())->toBe('text-danger text-sm mt-1');
});

it('detects when there are no errors', function () {
    expect((new Error)->hasErrors())->toBeFalse();
    expect((new Error(messages: null))->hasErrors())->toBeFalse();
    expect((new Error(messages: ''))->hasErrors())->toBeFalse();
    expect((new Error(messages: []))->hasErrors())->toBeFalse();
    expect((new Error(messages: collect()))->hasErrors())->toBeFalse();
});

it('detects when there are errors', function () {
    expect((new Error(messages: 'Error message'))->hasErrors())->toBeTrue();
    expect((new Error(messages: ['Error 1', 'Error 2']))->hasErrors())->toBeTrue();
    expect((new Error(messages: collect(['Error'])))->hasErrors())->toBeTrue();
});

it('converts messages to array correctly', function () {
    $stringComponent = new Error(messages: 'Single error');
    expect($stringComponent->getMessages())->toBe(['Single error']);

    $arrayComponent = new Error(messages: ['Error 1', 'Error 2']);
    expect($arrayComponent->getMessages())->toBe(['Error 1', 'Error 2']);

    $collectionComponent = new Error(messages: collect(['Error A', 'Error B']));
    expect($collectionComponent->getMessages())->toBe(['Error A', 'Error B']);

    $nullComponent = new Error(messages: null);
    expect($nullComponent->getMessages())->toBe([]);
});

it('handles showIcon property', function () {
    $withIcon = new Error(showIcon: true);
    $withoutIcon = new Error(showIcon: false);

    expect($withIcon->showIcon)->toBeTrue();
    expect($withoutIcon->showIcon)->toBeFalse();
});

it('handles collection of errors correctly', function () {
    $messages = collect(['Error 1', 'Error 2', 'Error 3']);
    $component = new Error(messages: $messages);

    expect($component->hasErrors())->toBeTrue();
    expect($component->getMessages())->toBe(['Error 1', 'Error 2', 'Error 3']);
});
