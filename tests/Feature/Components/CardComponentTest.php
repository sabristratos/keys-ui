<?php

use Keys\UI\Components\Card;

it('renders card component with view', function () {
    $component = new Card;

    $view = $component->render();

    expect($view->name())->toBe('keys::components.card');
});

it('has correct base classes', function () {
    $component = new Card;

    expect($component->baseClasses())->toBe('block transition-all duration-200');
});

it('applies variant classes correctly', function () {
    expect((new Card(variant: 'default'))->variantClasses())->toBe('bg-surface border border-border');
    expect((new Card(variant: 'elevated'))->variantClasses())->toBe('bg-surface border border-border');
    expect((new Card(variant: 'outlined'))->variantClasses())->toBe('bg-transparent border-2 border-border');
    expect((new Card(variant: 'filled'))->variantClasses())->toBe('bg-body border border-transparent');
    expect((new Card)->variantClasses())->toBe('bg-surface border border-border'); // default
});

it('applies padding classes correctly', function () {
    expect((new Card(padding: 'none'))->paddingClasses())->toBe('');
    expect((new Card(padding: 'xs'))->paddingClasses())->toBe('p-2');
    expect((new Card(padding: 'sm'))->paddingClasses())->toBe('p-3');
    expect((new Card(padding: 'md'))->paddingClasses())->toBe('p-4');
    expect((new Card(padding: 'lg'))->paddingClasses())->toBe('p-6');
    expect((new Card(padding: 'xl'))->paddingClasses())->toBe('p-8');
    expect((new Card)->paddingClasses())->toBe('p-4'); // default
});

it('applies rounded classes correctly', function () {
    expect((new Card(rounded: 'none'))->roundedClasses())->toBe('');
    expect((new Card(rounded: 'xs'))->roundedClasses())->toBe('rounded-sm');
    expect((new Card(rounded: 'sm'))->roundedClasses())->toBe('rounded');
    expect((new Card(rounded: 'md'))->roundedClasses())->toBe('rounded-md');
    expect((new Card(rounded: 'lg'))->roundedClasses())->toBe('rounded-lg');
    expect((new Card(rounded: 'xl'))->roundedClasses())->toBe('rounded-xl');
    expect((new Card(rounded: '2xl'))->roundedClasses())->toBe('rounded-2xl');
    expect((new Card(rounded: '3xl'))->roundedClasses())->toBe('rounded-3xl');
    expect((new Card)->roundedClasses())->toBe('rounded-md'); // default
});

it('applies shadow classes correctly', function () {
    expect((new Card(shadow: 'none'))->shadowClasses())->toBe('');
    expect((new Card(shadow: 'xs'))->shadowClasses())->toBe('shadow-xs');
    expect((new Card(shadow: 'sm'))->shadowClasses())->toBe('shadow-sm');
    expect((new Card(shadow: 'md'))->shadowClasses())->toBe('shadow-md');
    expect((new Card(shadow: 'lg'))->shadowClasses())->toBe('shadow-lg');
    expect((new Card(shadow: 'xl'))->shadowClasses())->toBe('shadow-xl');
    expect((new Card(shadow: '2xl'))->shadowClasses())->toBe('shadow-2xl');
    expect((new Card)->shadowClasses())->toBe('shadow-sm'); // default
});

it('applies elevated variant shadow correctly', function () {
    $elevatedCard = new Card(variant: 'elevated');
    expect($elevatedCard->shadowClasses())->toBe('shadow-sm');

    $elevatedCardWithCustomShadow = new Card(variant: 'elevated', shadow: 'lg');
    expect($elevatedCardWithCustomShadow->shadowClasses())->toBe('shadow-lg');

    $elevatedCardNoShadow = new Card(variant: 'elevated', shadow: 'none');
    expect($elevatedCardNoShadow->shadowClasses())->toBe('');
});

it('detects link correctly', function () {
    $regularCard = new Card;
    expect($regularCard->isLink())->toBeFalse();

    $linkCard = new Card(href: '/dashboard');
    expect($linkCard->isLink())->toBeTrue();
});

it('returns correct element type', function () {
    expect((new Card)->elementType())->toBe('div');
    expect((new Card(href: '/dashboard'))->elementType())->toBe('a');
    expect((new Card(href: '/dashboard', disabled: true))->elementType())->toBe('div');
});

it('generates interactive classes correctly', function () {
    $nonInteractive = new Card;
    expect($nonInteractive->interactiveClasses())->toBe('');

    $interactive = new Card(interactive: true);
    expect($interactive->interactiveClasses())->toContain('hover:shadow-md');
    expect($interactive->interactiveClasses())->toContain('focus-visible:ring-brand');
    expect($interactive->interactiveClasses())->toContain('active:scale-[0.98]');

    $disabledInteractive = new Card(interactive: true, disabled: true);
    expect($disabledInteractive->interactiveClasses())->toBe('');
});

it('generates variant-specific interactive classes', function () {
    $defaultInteractive = new Card(variant: 'default', interactive: true);
    expect($defaultInteractive->interactiveClasses())->toContain('hover:shadow-md hover:border-neutral-300');

    $elevatedInteractive = new Card(variant: 'elevated', interactive: true);
    expect($elevatedInteractive->interactiveClasses())->toContain('hover:shadow-lg hover:-translate-y-0.5');

    $outlinedInteractive = new Card(variant: 'outlined', interactive: true);
    expect($outlinedInteractive->interactiveClasses())->toContain('hover:bg-surface hover:border-neutral-400');

    $filledInteractive = new Card(variant: 'filled', interactive: true);
    expect($filledInteractive->interactiveClasses())->toContain('hover:bg-surface');
});

it('applies disabled classes correctly', function () {
    $enabled = new Card;
    expect($enabled->disabledClasses())->toBe('');

    $disabled = new Card(disabled: true);
    expect($disabled->disabledClasses())->toBe('opacity-50 cursor-not-allowed');
});

it('handles all constructor parameters', function () {
    $card = new Card(
        variant: 'elevated',
        padding: 'lg',
        rounded: 'xl',
        shadow: 'lg',
        interactive: true,
        href: '/test',
        disabled: false
    );

    expect($card->variant)->toBe('elevated');
    expect($card->padding)->toBe('lg');
    expect($card->rounded)->toBe('xl');
    expect($card->shadow)->toBe('lg');
    expect($card->interactive)->toBeTrue();
    expect($card->href)->toBe('/test');
    expect($card->disabled)->toBeFalse();
});

it('uses default values correctly', function () {
    $card = new Card;

    expect($card->variant)->toBe('default');
    expect($card->padding)->toBe('md');
    expect($card->rounded)->toBe('md');
    expect($card->shadow)->toBe('sm');
    expect($card->interactive)->toBeFalse();
    expect($card->href)->toBeNull();
    expect($card->disabled)->toBeFalse();
});

it('handles invalid variant gracefully', function () {
    $card = new Card(variant: 'invalid');

    expect($card->variantClasses())->toBe('bg-surface border border-border');
});

it('handles invalid padding gracefully', function () {
    $card = new Card(padding: 'invalid');

    expect($card->paddingClasses())->toBe('p-4');
});

it('handles invalid rounded gracefully', function () {
    $card = new Card(rounded: 'invalid');

    expect($card->roundedClasses())->toBe('rounded-md');
});

it('handles invalid shadow gracefully', function () {
    $card = new Card(shadow: 'invalid');

    expect($card->shadowClasses())->toBe('shadow-sm');
});

it('combines all classes correctly in disabled state', function () {
    $card = new Card(
        variant: 'elevated',
        interactive: true,
        disabled: true
    );

    expect($card->interactiveClasses())->toBe('');
    expect($card->disabledClasses())->toBe('opacity-50 cursor-not-allowed');
});
