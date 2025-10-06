@php
    $cellBaseClasses = 'whitespace-nowrap';

    $cellPaddingClasses = match ($size) {
        'sm' => 'px-3 py-2',
        'md' => 'px-6 py-4',
        'lg' => 'px-8 py-5',
        default => 'px-6 py-4'
    };

    $cellAlignClasses = match ($align) {
        'start' => 'text-left',
        'center' => 'text-center',
        'end' => 'text-right',
        default => 'text-left'
    };

    $cellVariantClasses = match ($variant) {
        'strong' => 'font-semibold text-primary',
        'muted' => 'text-muted',
        'success' => 'text-success',
        'danger' => 'text-danger',
        'warning' => 'text-warning',
        default => 'text-muted'
    };

    $cellTextClasses = '';
    if ($wrap) {
        $cellTextClasses .= 'whitespace-normal ';
    } else {
        $cellTextClasses .= 'whitespace-nowrap ';
    }
    if ($truncate) {
        $cellTextClasses .= 'truncate ';
    }
    $cellTextClasses = trim($cellTextClasses);

    $cellClasses = trim("$cellBaseClasses $cellPaddingClasses $cellAlignClasses $cellVariantClasses $cellTextClasses");
@endphp

<td {{ $attributes->merge(['class' => $cellClasses])->merge($dataAttributes) }}>
    {{ $slot }}
</td>