@php
    // Container positioning and styling with Tailwind utilities
    $containerClasses = match ($position) {
        'top-left' => 'fixed top-4 left-4 z-50',
        'top-right' => 'fixed top-4 right-4 z-50',
        'top-center' => 'fixed top-4 left-1/2 -translate-x-1/2 z-50',
        'bottom-left' => 'fixed bottom-4 left-4 z-50',
        'bottom-right' => 'fixed bottom-4 right-4 z-50',
        'bottom-center' => 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        default => 'fixed top-4 right-4 z-50'
    };

    // Toast dialog styling based on variant
    $variantClasses = match ($variant) {
        'success' => 'bg-success-50 border-success-200 text-success-900 dark:bg-success-950 dark:border-success-800 dark:text-success-50',
        'warning' => 'bg-warning-50 border-warning-200 text-warning-900 dark:bg-warning-950 dark:border-warning-800 dark:text-warning-50',
        'danger' => 'bg-danger-50 border-danger-200 text-danger-900 dark:bg-danger-950 dark:border-danger-800 dark:text-danger-50',
        'info' => 'bg-info-50 border-info-200 text-info-900 dark:bg-info-950 dark:border-info-800 dark:text-info-50',
        'neutral' => 'bg-neutral-50 border-neutral-200 text-neutral-900 dark:bg-neutral-950 dark:border-neutral-800 dark:text-neutral-50',
        default => 'bg-info-50 border-info-200 text-info-900 dark:bg-info-950 dark:border-info-800 dark:text-info-50'
    };

    // Icon color classes
    $iconClasses = match ($variant) {
        'success' => 'text-success-600 dark:text-success-400',
        'warning' => 'text-warning-600 dark:text-warning-400',
        'danger' => 'text-danger-600 dark:text-danger-400',
        'info' => 'text-info-600 dark:text-info-400',
        'neutral' => 'text-neutral-600 dark:text-neutral-400',
        default => 'text-info-600 dark:text-info-400'
    };

    // Base dialog classes with animations
    $dialogClasses = 'max-w-sm w-full p-0 m-0 border rounded-lg shadow-lg backdrop:bg-transparent transition-all duration-300 ease-out';
    $dialogClasses .= ' translate-y-2 opacity-0 scale-95';
    $dialogClasses .= ' open:translate-y-0 open:opacity-100 open:scale-100';

    // Entry animation based on position
    if (str_starts_with($position, 'bottom')) {
        $dialogClasses .= ' -translate-y-2 open:translate-y-0';
    }

    // Hover effects
    $dialogClasses .= ' hover:shadow-xl hover:-translate-y-1 focus-within:shadow-xl focus-within:-translate-y-1';
@endphp

{{-- Toast Container - positions the dialog --}}
<div class="{{ $containerClasses }}" data-toast-container="{{ $position }}">
    {{-- Toast Dialog Element --}}
    <dialog {{ $attributes->merge(['class' => "$dialogClasses $variantClasses"])->merge($dataAttributes) }}
            id="{{ $id }}"
            role="alert"
            aria-live="assertive"
            aria-labelledby="{{ !empty($title) ? $id . '-title' : '' }}"
            aria-describedby="{{ $id }}-message">

        <div class="p-4 space-y-3">
            <div class="flex items-start gap-3">
                {{-- Icon --}}
                @if($getVariantIcon())
                    <div class="flex-shrink-0 mt-0.5">
                        <x-keys::icon
                            :name="$getVariantIcon()"
                            size="md"
                            class="{{ $iconClasses }}"
                        />
                    </div>
                @endif

                {{-- Content --}}
                <div class="flex-1 min-w-0">
                    {{-- Title --}}
                    @if(!empty($title))
                        <h3 id="{{ $id }}-title" class="font-semibold text-sm leading-5 mb-1">
                            {{ $title }}
                        </h3>
                    @endif

                    {{-- Message --}}
                    <div id="{{ $id }}-message" class="text-sm opacity-90 leading-5">
                        @if(!empty($message))
                            {{ $message }}
                        @else
                            {{ $slot }}
                        @endif
                    </div>
                </div>

                {{-- Dismiss Button --}}
                @if($dismissible)
                    <div class="flex-shrink-0">
                        <x-keys::button
                            variant="ghost"
                            size="xs"
                            icon="heroicon-o-x-mark"
                            class="text-current opacity-60 hover:opacity-100 -m-1"
                            data-toast-dismiss="{{ $id }}"
                            aria-label="Dismiss notification"
                        />
                    </div>
                @endif
            </div>

            {{-- Actions Slot --}}
            @if($actions ?? false)
                <div class="flex gap-2 pt-1">
                    {{ $actions }}
                </div>
            @endif
        </div>
    </dialog>
</div>