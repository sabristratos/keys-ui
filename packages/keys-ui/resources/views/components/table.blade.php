@php
    // Container classes based on responsive and bordered settings
    $containerClasses = '';
    if ($responsive) {
        $containerClasses .= 'overflow-x-auto ';
    }
    if ($bordered) {
        $containerClasses .= 'border border-border rounded-md overflow-hidden ';
    }
    $containerClasses = trim($containerClasses);

    // Table classes based on size and variants
    $tableBaseClasses = 'min-w-full divide-y divide-border';
    $tableSizeClasses = match ($size) {
        'sm' => 'text-sm',
        'md' => 'text-sm',
        'lg' => 'text-base',
        default => 'text-sm'
    };

    $tableVariantClasses = '';
    if ($striped) {
        $tableVariantClasses .= '[&_tbody_tr:nth-child(odd)]:bg-body ';
    }
    if ($hover) {
        $tableVariantClasses .= '[&_tbody_tr]:hover:bg-body ';
    }

    $tableClasses = trim("$tableBaseClasses $tableSizeClasses $tableVariantClasses");
@endphp

<div {{ $attributes->merge(['class' => $containerClasses])->merge($dataAttributes) }}>
    <table class="{{ $tableClasses }}">
        {{ $slot }}
    </table>

    @if($hasPagination())
        <div class="px-6 py-3 bg-body border-t border-border">
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