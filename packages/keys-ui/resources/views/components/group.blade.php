@php
    // Base layout classes
    $baseClasses = 'inline-flex';
    $orientationClasses = $orientation === 'vertical' ? 'flex-col' : 'flex-row';

    // Handle attached vs detached mode
    if ($attached) {
        if ($orientation === 'horizontal') {
            // Horizontal attached mode: shared borders with collapsed spacing
            $attachedClasses = implode(' ', [
                // Remove duplicate borders from targets
                '[&>[data-keys-group-target]:not(:first-child)]:border-s-0',
                '[&>*:not(:first-child)>[data-keys-group-target]]:border-s-0',

                // Border radius management - direct targets
                '[&>[data-keys-group-target]:first-child:not(:last-child)]:rounded-e-none',
                '[&>[data-keys-group-target]:last-child:not(:first-child)]:rounded-s-none',
                '[&>[data-keys-group-target]:not(:first-child):not(:last-child)]:rounded-none',

                // Border radius management - nested targets (one level deep)
                '[&>*:first-child:not(:last-child)>[data-keys-group-target]]:rounded-e-none',
                '[&>*:last-child:not(:first-child)>[data-keys-group-target]]:rounded-s-none',
                '[&>*:not(:first-child):not(:last-child)>[data-keys-group-target]]:rounded-none',

                // Z-index management for overlapping borders
                '[&>*:hover]:relative',
                '[&>*:hover]:z-10',
                '[&>*:focus-within]:relative',
                '[&>*:focus-within]:z-10',

                // Selected state styling
                '[&>*[data-selected="true"]]:bg-accent',
                '[&>*[data-selected="true"]]:text-accent-contrast',
                '[&>*[data-selected="true"]]:relative',
                '[&>*[data-selected="true"]]:z-10',
            ]);
        } else {
            // Vertical attached mode: shared borders with collapsed spacing
            $attachedClasses = implode(' ', [
                // Remove duplicate borders from targets
                '[&>[data-keys-group-target]:not(:first-child)]:border-t-0',
                '[&>*:not(:first-child)>[data-keys-group-target]]:border-t-0',

                // Border radius management - direct targets
                '[&>[data-keys-group-target]:first-child:not(:last-child)]:rounded-b-none',
                '[&>[data-keys-group-target]:last-child:not(:first-child)]:rounded-t-none',
                '[&>[data-keys-group-target]:not(:first-child):not(:last-child)]:rounded-none',

                // Border radius management - nested targets (one level deep)
                '[&>*:first-child:not(:last-child)>[data-keys-group-target]]:rounded-b-none',
                '[&>*:last-child:not(:first-child)>[data-keys-group-target]]:rounded-t-none',
                '[&>*:not(:first-child):not(:last-child)>[data-keys-group-target]]:rounded-none',

                // Z-index management for overlapping borders
                '[&>*:hover]:relative',
                '[&>*:hover]:z-10',
                '[&>*:focus-within]:relative',
                '[&>*:focus-within]:z-10',

                // Selected state styling
                '[&>*[data-selected="true"]]:bg-accent',
                '[&>*[data-selected="true"]]:text-accent-contrast',
                '[&>*[data-selected="true"]]:relative',
                '[&>*[data-selected="true"]]:z-10',
            ]);
        }
    } else {
        // Detached mode: simple gap spacing
        $gapClasses = match ($gap) {
            'xs' => 'gap-1',
            'sm' => 'gap-2',
            'md' => 'gap-3',
            'lg' => 'gap-4',
            'xl' => 'gap-6',
            default => 'gap-3'
        };
        $attachedClasses = $gapClasses;
    }

    $allClasses = "$baseClasses $orientationClasses $attachedClasses";

    // Size inheritance via CSS custom property
    $sizeStyles = $size ? "--group-size: {$size};" : '';
@endphp

<div {{ $attributes->merge(['class' => $allClasses, 'style' => $sizeStyles])->merge($dataAttributes) }}>
    {{ $slot }}
</div>
