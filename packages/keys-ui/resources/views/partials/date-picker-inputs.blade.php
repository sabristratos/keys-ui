{{-- Hidden input for date picker value with Livewire support --}}
<input type="hidden"
       name="{{ $name }}"
       value="{{ $getSubmitValue() }}"
       data-date-picker-value
       @if($required ?? false) required @endif
       {{ $wireOnlyAttributes ?? collect() }}>
