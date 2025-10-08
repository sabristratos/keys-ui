@php
    $containerClasses = '';
    if ($responsive) {
        $containerClasses .= 'overflow-x-auto ';
    }
    if ($bordered) {
        $containerClasses .= 'border border-line rounded-md overflow-hidden ';
    }
    $containerClasses = trim($containerClasses);

    $tableBaseClasses = 'min-w-full divide-y divide-line';
    $tableSizeClasses = match ($size) {
        'sm' => 'text-sm',
        'md' => 'text-sm',
        'lg' => 'text-base',
        default => 'text-sm'
    };

    // MODIFIED: Added hover variant directly here
    $tableVariantClasses = '';
    if ($striped) {
        $tableVariantClasses .= '[&_tbody_tr:nth-child(odd)]:bg-base ';
    }
    if ($hover) {
        // This arbitrary variant replaces the need for table.css
        $tableVariantClasses .= '[&_tbody_tr:not([data-selected=true])]:hover:bg-hover ';
    }

    $tableClasses = trim("$tableBaseClasses $tableSizeClasses $tableVariantClasses");
@endphp

<div {{ $attributes->merge(['class' => $containerClasses])->merge($dataAttributes) }}>
    <table class="{{ $tableClasses }}">
        {{ $slot }}
    </table>

    @if($hasPagination())
        <div class="px-6 py-3 bg-base border-t border-line">
            <div class="flex items-center justify-between">
                <div class="text-sm text-muted">
                    {{ $getPaginationInfo() }}
                </div>
                <div>
                    {{ $paginate->links() }}
                </div>
            </div>
        </div>
    @endif
</div>
