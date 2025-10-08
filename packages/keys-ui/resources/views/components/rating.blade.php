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
        'brand' => 'accent',
        'warning' => 'warning',
        'success' => 'success',
        'danger' => 'danger',
        'neutral' => 'neutral-500',
        default => 'warning'
    };

    $isReadonly = $readonly || $disabled;
    $isInteractive = !$isReadonly;
    $containerStateClasses = $disabled ? 'opacity-50' : '';
@endphp

@if($isShorthand())
    <div class="space-y-2">
        <x-keys::label :for="$uniqueId" :optional="$optional">
            {{ $label }}
        </x-keys::label>

        <div {{ $regularAttributes->merge(['class' => $containerStateClasses]) }}>
            @if($isReadonly)
                {{-- Readonly: Pure visual display supporting decimal values --}}
                <div class="flex items-center {{ $gapClasses }}">
                    @for ($i = 1; $i <= $max; $i++)
                        @php
                            $fillOpacity = match(true) {
                                $i <= floor($value) => '100',
                                $i == ceil($value) && $value % 1 !== 0 => (string)(($value % 1) * 100),
                                default => '30'
                            };
                        @endphp
                        <div class="{{ $iconSizeClasses }}">
                            <x-keys::icon
                                :name="$filledIcon"
                                :size="$size"
                                class="text-{{ $colorClasses }}"
                                style="opacity: {{ $fillOpacity }}%"
                            />
                        </div>
                    @endfor

                    @if($showCount)
                        <span class="text-sm text-muted ml-2">{{ $value }}/{{ $max }}</span>
                    @endif
                </div>
            @else
                {{-- Interactive: Radio inputs with CSS hover/selection --}}
                <div class="group flex flex-row-reverse justify-end items-center {{ $gapClasses }}">
                    @for ($i = $max; $i >= 1; $i--)
                        @php
                            $inputClasses = match($color) {
                                'brand' => "peer/star-{$i} sr-only [&:checked~label_svg]:text-accent [&:checked~label_svg]:opacity-100",
                                'warning' => "peer/star-{$i} sr-only [&:checked~label_svg]:text-warning [&:checked~label_svg]:opacity-100",
                                'success' => "peer/star-{$i} sr-only [&:checked~label_svg]:text-success [&:checked~label_svg]:opacity-100",
                                'danger' => "peer/star-{$i} sr-only [&:checked~label_svg]:text-danger [&:checked~label_svg]:opacity-100",
                                'neutral' => "peer/star-{$i} sr-only [&:checked~label_svg]:text-neutral-500 [&:checked~label_svg]:opacity-100",
                                default => "peer/star-{$i} sr-only [&:checked~label_svg]:text-warning [&:checked~label_svg]:opacity-100",
                            };

                            $labelClasses = match($color) {
                                'brand' => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 [&_svg]:transition-opacity hover:[&_svg]:text-accent hover:[&_svg]:!opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-accent [&:hover~label_svg]:!opacity-100 group-hover:[&_svg]:opacity-10",
                                'warning' => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 [&_svg]:transition-opacity hover:[&_svg]:text-warning hover:[&_svg]:!opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-warning [&:hover~label_svg]:!opacity-100 group-hover:[&_svg]:opacity-10",
                                'success' => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 [&_svg]:transition-opacity hover:[&_svg]:text-success hover:[&_svg]:!opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-success [&:hover~label_svg]:!opacity-100 group-hover:[&_svg]:opacity-10",
                                'danger' => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 [&_svg]:transition-opacity hover:[&_svg]:text-danger hover:[&_svg]:!opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-danger [&:hover~label_svg]:!opacity-100 group-hover:[&_svg]:opacity-10",
                                'neutral' => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 [&_svg]:transition-opacity hover:[&_svg]:text-neutral-500 hover:[&_svg]:!opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-neutral-500 [&:hover~label_svg]:!opacity-100 group-hover:[&_svg]:opacity-10",
                                default => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 [&_svg]:transition-opacity hover:[&_svg]:text-warning hover:[&_svg]:!opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-warning [&:hover~label_svg]:!opacity-100 group-hover:[&_svg]:opacity-10",
                            };
                        @endphp
                        <input
                            type="radio"
                            id="{{ $uniqueId }}-{{ $i }}"
                            name="{{ $name }}"
                            value="{{ $i }}"
                            class="{{ $inputClasses }}"
                            @checked($i == $value)
                            @if($required) required @endif
                            {{ $livewireAttributes }}
                        />
                        <label for="{{ $uniqueId }}-{{ $i }}" class="{{ $labelClasses }}">
                            <x-keys::icon :name="$filledIcon" :size="$size" />
                        </label>
                    @endfor

                    @if($showCount)
                        <span class="text-sm text-muted ml-2">{{ $value }}/{{ $max }}</span>
                    @endif
                </div>
            @endif
        </div>

        @if($hint)
            <p class="text-xs text-muted">{{ $hint }}</p>
        @endif

        @if($showErrors && $hasError())
            <x-keys::error :messages="$errors" />
        @endif
    </div>
@else
    <div {{ $regularAttributes->merge(['class' => $containerStateClasses]) }}>
        @if($isReadonly)
            {{-- Readonly: Pure visual display supporting decimal values --}}
            <div class="flex items-center {{ $gapClasses }}">
                @for ($i = 1; $i <= $max; $i++)
                    @php
                        $fillOpacity = match(true) {
                            $i <= floor($value) => '100',
                            $i == ceil($value) && $value % 1 !== 0 => (string)(($value % 1) * 100),
                            default => '30'
                        };
                    @endphp
                    <div class="{{ $iconSizeClasses }}">
                        <x-keys::icon
                            :name="$filledIcon"
                            :size="$size"
                            class="text-{{ $colorClasses }}"
                            style="opacity: {{ $fillOpacity }}%"
                        />
                    </div>
                @endfor

                @if($showCount)
                    <span class="text-sm text-muted ml-2">{{ $value }}/{{ $max }}</span>
                @endif
            </div>
        @else
            {{-- Interactive: Radio inputs with CSS hover/selection --}}
            <div class="flex flex-row-reverse justify-end items-center {{ $gapClasses }}">
                @for ($i = $max; $i >= 1; $i--)
                    @php
                        $inputClasses = match($color) {
                            'brand' => "peer/star-{$i} sr-only [&:checked~label_svg]:text-accent [&:checked~label_svg]:opacity-100",
                            'warning' => "peer/star-{$i} sr-only [&:checked~label_svg]:text-warning [&:checked~label_svg]:opacity-100",
                            'success' => "peer/star-{$i} sr-only [&:checked~label_svg]:text-success [&:checked~label_svg]:opacity-100",
                            'danger' => "peer/star-{$i} sr-only [&:checked~label_svg]:text-danger [&:checked~label_svg]:opacity-100",
                            'neutral' => "peer/star-{$i} sr-only [&:checked~label_svg]:text-neutral-500 [&:checked~label_svg]:opacity-100",
                            default => "peer/star-{$i} sr-only [&:checked~label_svg]:text-warning [&:checked~label_svg]:opacity-100",
                        };

                        $labelClasses = match($color) {
                            'brand' => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 hover:[&_svg]:text-accent hover:[&_svg]:opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-accent [&:hover~label_svg]:opacity-100",
                            'warning' => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 hover:[&_svg]:text-warning hover:[&_svg]:opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-warning [&:hover~label_svg]:opacity-100",
                            'success' => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 hover:[&_svg]:text-success hover:[&_svg]:opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-success [&:hover~label_svg]:opacity-100",
                            'danger' => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 hover:[&_svg]:text-danger hover:[&_svg]:opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-danger [&:hover~label_svg]:opacity-100",
                            'neutral' => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 hover:[&_svg]:text-neutral-500 hover:[&_svg]:opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-neutral-500 [&:hover~label_svg]:opacity-100",
                            default => "cursor-pointer transition-all duration-200 {$iconSizeClasses} [&_svg]:text-neutral-400 [&_svg]:opacity-30 hover:[&_svg]:text-warning hover:[&_svg]:opacity-100 hover:[&_svg]:scale-110 [&:hover~label_svg]:text-warning [&:hover~label_svg]:opacity-100",
                        };
                    @endphp
                    <input
                        type="radio"
                        id="{{ $uniqueId }}-{{ $i }}"
                        name="{{ $name }}"
                        value="{{ $i }}"
                        class="{{ $inputClasses }}"
                        @checked($i == $value)
                        @if($required) required @endif
                        {{ $livewireAttributes }}
                    />
                    <label for="{{ $uniqueId }}-{{ $i }}" class="{{ $labelClasses }}">
                        <x-keys::icon :name="$filledIcon" :size="$size" />
                    </label>
                @endfor

                @if($showCount)
                    <span class="text-sm text-muted ml-2">{{ $value }}/{{ $max }}</span>
                @endif
            </div>
        @endif
    </div>
@endif
