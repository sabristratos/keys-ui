@php
    // Container classes based on orientation
    $containerClasses = match ($orientation) {
        'vertical' => 'flex gap-6',
        default => 'flex flex-col'
    };

    // Size classes for text
    $sizeClasses = match ($size) {
        'sm' => 'text-xs',
        'md' => 'text-sm',
        'lg' => 'text-base',
        default => 'text-sm'
    };

    // Tab list base classes
    $tabListBase = 'relative flex';

    // Tab list orientation
    $tabListOrientation = match ($orientation) {
        'vertical' => 'flex-col gap-1',
        default => 'gap-1'
    };

    // Tab list variant styling
    $tabListVariant = match ($variant) {
        'pills' => 'bg-base p-1 rounded-xl border border-line',
        'underline' => 'border-b border-line',
        default => 'border-b border-line'
    };

    // Stretch modifier
    $tabListStretch = $stretch ? 'w-full [&>button]:flex-1' : '';

    $tabListClasses = trim("$tabListBase $tabListOrientation $tabListVariant $tabListStretch");

    // Panels container classes
    $panelsClasses = match ($orientation) {
        'vertical' => 'flex-1',
        default => 'mt-6 w-full'
    };

    // Tab button size classes
    $tabSizeClasses = match ($size) {
        'sm' => 'px-3 py-1 text-xs',
        'md' => 'px-4 py-1.5 text-sm',
        'lg' => 'px-5 py-2 text-base',
        default => 'px-4 py-1.5 text-sm'
    };

    // Slider positioning based on variant
    $sliderClasses = match ($variant) {
        'pills' => 'inset-y-1 left-0 bg-overlay rounded-lg shadow-md',
        'underline' => 'bottom-0 left-0 h-0.5 bg-accent',
        default => 'bottom-0 left-0 h-0.5 bg-accent'
    };
@endphp

<div {{ $attributes->merge(['class' => "$containerClasses $sizeClasses"])->merge($dataAttributes) }}>
    {{-- Tabs Navigation --}}
    <div class="{{ $tabListClasses }}" role="tablist" aria-label="Tabs">
        {{-- Sliding Indicator --}}
        <div
            data-tab-slider
            class="absolute {{ $sliderClasses }} transition-all duration-300 ease-in-out pointer-events-none"
            aria-hidden="true"
        ></div>

        @if($hasItems())
            {{-- Array-based tabs --}}
            @foreach($items as $item)
                @php
                    $isDefault = $defaultValue === $item['value'];
                    $tabClasses = 'relative z-10 flex items-center justify-center gap-2 font-medium leading-tight transition-colors duration-200 cursor-pointer rounded-lg';
                    $tabClasses .= " $tabSizeClasses";
                    $tabClasses .= $isDefault ? ' text-primary font-semibold' : ' text-muted hover:text-primary';
                @endphp

                <button
                    type="button"
                    data-tab="{{ $item['value'] }}"
                    class="{{ $tabClasses }}"
                    role="tab"
                    aria-selected="{{ $isDefault ? 'true' : 'false' }}"
                    tabindex="{{ $isDefault ? '0' : '-1' }}"
                    @if($disabled || ($item['disabled'] ?? false)) disabled @endif
                >
                    @if(isset($item['icon']) && $item['icon'])
                        <x-keys::icon :name="$item['icon']" class="w-4 h-4 flex-shrink-0" />
                    @endif

                    {{ $item['label'] }}
                </button>
            @endforeach
        @else
            {{-- Slot-based tabs --}}
            {{ $tabs ?? '' }}
        @endif
    </div>

    {{-- Panels Container --}}
    <div class="{{ $panelsClasses }}">
        {{ $slot }}
    </div>
</div>
