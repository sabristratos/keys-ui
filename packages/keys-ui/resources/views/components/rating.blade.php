@php
    $livewireAttributes = $attributes->whereStartsWith('wire:');
    $regularAttributes = $attributes->whereDoesntStartWith('wire:');

    $iconSizeClasses = match ($size) {
        'xs' => 'size-4',
        'sm' => 'size-5',
        'md' => 'size-6',
        'lg' => 'size-8',
        'xl' => 'size-10',
        default => 'size-6'
    };

    $gapClasses = match ($size) {
        'xs' => 'gap-0.5',
        'sm' => 'gap-1',
        'md' => 'gap-1.5',
        'lg' => 'gap-2',
        'xl' => 'gap-2.5',
        default => 'gap-1.5'
    };

    $colorClasses = match ($color) {
        'brand' => 'text-brand',
        'warning' => 'text-warning',
        'success' => 'text-success',
        'danger' => 'text-danger',
        'neutral' => 'text-neutral-500',
        default => 'text-warning'
    };

    $interactiveClasses = ($readonly || $disabled)
        ? 'pointer-events-none'
        : 'cursor-pointer transition-all duration-200 ease-out hover:scale-110 active:scale-95';

    $containerStateClasses = $disabled ? 'opacity-50 pointer-events-none' : '';
@endphp

@if($isShorthand())
    <div class="space-y-2">
        <x-keys::label :for="$uniqueId" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div {{ $regularAttributes->merge(['class' => $containerStateClasses])->merge($dataAttributes) }}>
            <div class="flex items-center {{ $gapClasses }}">
                @for ($i = 1; $i <= $max; $i++)
                    <button
                        type="button"
                        class="rating-star {{ $interactiveClasses }} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{{ $color }} {{ $iconSizeClasses }}"
                        data-rating-value="{{ $i }}"
                        aria-label="Rate {{ $i }} out of {{ $max }}"
                        @if($readonly || $disabled) disabled @endif
                        @if(!$readonly && !$disabled) tabindex="0" @else tabindex="-1" @endif
                    >
                        <x-keys::icon
                            :name="$filledIcon"
                            :size="$size"
                            class="{{ $i <= $value ? $colorClasses : 'opacity-30 text-neutral-400 dark:text-neutral-500' }}"
                        />
                    </button>
                @endfor

                @if($showCount)
                    <span class="text-sm text-muted ml-2">{{ $value }}/{{ $max }}</span>
                @endif
            </div>
        </div>

        @if($hint)
            <p class="text-xs text-muted">{{ $hint }}</p>
        @endif

        @if($showErrors && $hasError())
            <x-keys::error :messages="$errors" />
        @endif

        
        @if(!$readonly && $name)
            <input
                type="hidden"
                id="{{ $uniqueId }}"
                name="{{ $name }}"
                value="{{ $value }}"
                @if($required) required @endif
                data-rating-input="true"
                {{ $livewireAttributes }}
            />
        @endif
    </div>
@else
    <div {{ $regularAttributes->merge(['class' => $containerStateClasses])->merge($dataAttributes) }}>
        <div class="flex items-center {{ $gapClasses }}">
            @for ($i = 1; $i <= $max; $i++)
                <button
                    type="button"
                    class="rating-star {{ $interactiveClasses }} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{{ $color }} {{ $iconSizeClasses }}"
                    data-rating-value="{{ $i }}"
                    aria-label="Rate {{ $i }} out of {{ $max }}"
                    @if($readonly || $disabled) disabled @endif
                    @if(!$readonly && !$disabled) tabindex="0" @else tabindex="-1" @endif
                >
                    <x-keys::icon
                        :name="$filledIcon"
                        :size="$size"
                        class="{{ $i <= $value ? $colorClasses : 'opacity-30 text-neutral-400 dark:text-neutral-500' }}"
                    />
                </button>
            @endfor

            @if($showCount)
                <span class="text-sm text-muted ml-2">{{ $value }}/{{ $max }}</span>
            @endif
        </div>

        
        @if(!$readonly && $name)
            <input
                type="hidden"
                id="{{ $uniqueId }}"
                name="{{ $name }}"
                value="{{ $value }}"
                @if($required) required @endif
                data-rating-input="true"
                {{ $livewireAttributes }}
            />
        @endif
    </div>
@endif
