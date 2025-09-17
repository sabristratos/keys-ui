@php
    $containerAttributes = $attributes->merge([
        'class' => $computedContainerClasses,
        'data-breadcrumb-container' => true,
    ]);
@endphp

<div {{ $containerAttributes }}>
    <nav
        class="{{ $computedNavClasses }}"
        aria-label="Breadcrumb"
    >
        <ol class="{{ $computedListClasses }}">
            {{ $slot }}
        </ol>
    </nav>

    
    <style>
        [data-breadcrumb-container] {
            color: var(--color-foreground);
        }

        [data-breadcrumb-container] a {
            text-decoration: none;
            transition: color 200ms ease-in-out;
        }

        [data-breadcrumb-container] a:hover {
            color: var(--color-neutral-900);
        }

        .dark [data-breadcrumb-container] a:hover {
            color: var(--color-neutral-100);
        }

        [data-breadcrumb-container] a:focus-visible {
            outline: 2px solid var(--color-brand);
            outline-offset: 2px;
            border-radius: var(--radius-sm);
        }

        [data-breadcrumb-container] [aria-hidden="true"] {
            user-select: none;
            pointer-events: none;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 640px) {
            [data-breadcrumb-container] ol {
                gap: 0.25rem;
            }

            [data-breadcrumb-container] li:not(:first-child):not(:last-child) {
                display: none;
            }

            [data-breadcrumb-container] li:nth-last-child(2) {
                display: flex;
            }

            [data-breadcrumb-container] li:nth-last-child(2)::before {
                content: "...";
                margin-right: 0.5rem;
                color: var(--color-neutral-600);
            }
        }

        /* Ensure proper text wrapping on very small screens */
        @media (max-width: 480px) {
            [data-breadcrumb-container] ol {
                flex-wrap: wrap;
                gap: 0.125rem;
            }
        }
    </style>
</div>