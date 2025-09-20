@php
    $fieldsetAttributes = $attributes->merge(['class' => $fieldsetClasses()]);
    $accessibilityAttrs = $getAccessibilityAttributes();
@endphp

<fieldset {{ $fieldsetAttributes }} @foreach($accessibilityAttrs as $attr => $value) {{ $attr }}="{{ $value }}" @endforeach>
    @if($hasLegend())
        <legend class="{{ $legendClasses() }}">
            {{ $legend }}
            @if($required)
                <span class="text-danger ml-1">*</span>
            @endif
        </legend>
    @endif

    @if($hasDescription())
        <p id="{{ $getDescriptionId() }}" class="{{ $descriptionClasses() }}">
            {{ $description }}
        </p>
    @endif

    <div class="{{ $choicesClasses() }}" role="{{ $isRadioGroup() ? 'radiogroup' : 'group' }}">
        {{ $slot }}
    </div>

    @if($showErrors && !is_null($errors))
        <x-keys::error :messages="$errors" />
    @endif
</fieldset>