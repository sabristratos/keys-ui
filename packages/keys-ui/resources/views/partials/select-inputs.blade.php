

@if($isLivewireEnabled ?? false)
    @if($multiple)
        <input
            type="hidden"
            name="{{ $name }}"
            class="select-stable-input select-livewire-input"
            data-livewire-input="true"
            data-livewire-multiple="true"
            {{ $wireOnlyAttributes ?? collect() }}
        >
    @else
        <input
            type="hidden"
            name="{{ $name }}"
            class="select-stable-input select-livewire-input"
            data-livewire-input="true"
            data-livewire-multiple="false"
            {{ $wireOnlyAttributes ?? collect() }}
        >
    @endif
@else
    @if($multiple)
        @php
            $selectedValues = $getSelectedValues();
            $maxInputs = 15;
        @endphp

        @for($i = 0; $i < $maxInputs; $i++)
            @php
                $currentValue = $selectedValues[$i] ?? '';
                $isActive = $i < count($selectedValues);
                $isFirst = $i === 0;
            @endphp

            <input
                type="hidden"
                name="{{ $name }}[]"
                value="{{ $currentValue }}"
                class="select-stable-input select-pool-input"
                data-pool-index="{{ $i }}"
                data-pool-active="{{ $isActive ? 'true' : 'false' }}"
                style="{{ $isActive ? '' : 'display: none;' }}"
            >
        @endfor
    @else
        <input
            type="hidden"
            name="{{ $name }}"
            value="{{ $value ?? '' }}"
            class="select-stable-input select-single-input"
            data-single-input="true"
        >
    @endif
@endif