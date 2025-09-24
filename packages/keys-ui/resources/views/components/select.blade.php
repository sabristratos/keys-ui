@php
    $wireOnlyAttributes = $attributes->whereStartsWith('wire:');
    $nonWireAttributes = $attributes->whereDoesntStartWith('wire:');
    $isLivewireEnabled = $wireOnlyAttributes->isNotEmpty();
    $wireModelName = $wireOnlyAttributes->whereStartsWith('wire:model')->first();

    // Add Livewire data attributes when enabled
    if ($isLivewireEnabled) {
        $dataAttributes = array_merge($dataAttributes, [
            'data-livewire-enabled' => 'true',
            'data-livewire-mode' => 'true',
        ]);

        if ($wireModelName) {
            $dataAttributes['data-wire-model'] = $wireModelName;
            $dataAttributes['data-livewire-property'] = $wireModelName;
        }
    }

    $selectAttributes = $nonWireAttributes
        ->except(['class'])
        ->merge($dataAttributes);

    $hiddenInputName = $multiple ? ($name . '[]') : $name;
@endphp

@if($isShorthand())
    <div {{ $attributes->only('class') }}>
        <x-keys::label :for="$uniqueId" :required="$required" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div class="relative mt-1" {{ $selectAttributes }}>
            @include('keys::partials.select-field', [
                'wireAttributes' => $wireOnlyAttributes,
                'isLivewireEnabled' => $isLivewireEnabled,
                'wireModelName' => $wireModelName
            ])
        </div>

        @if($showErrors && !is_null($errors))
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div class="relative" {{ $attributes->only('class') }} {{ $selectAttributes }}>
        @include('keys::partials.select-field', [
            'wireAttributes' => $wireOnlyAttributes,
            'isLivewireEnabled' => $isLivewireEnabled,
            'wireModelName' => $wireModelName
        ])
    </div>
@endif