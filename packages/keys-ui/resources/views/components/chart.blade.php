@php

    $containerClasses = match ($size) {
        'sm' => 'text-xs @sm:text-xs',
        'md' => 'text-xs @sm:text-sm',
        'lg' => 'text-sm @sm:text-base @lg:text-lg',
        'xl' => 'text-base @sm:text-lg @lg:text-xl',
        default => 'text-xs @sm:text-sm'
    };

    $titleClasses = match ($size) {
        'sm' => 'text-xs @sm:text-sm font-medium mb-2',
        'md' => 'text-sm @sm:text-base font-medium mb-3',
        'lg' => 'text-base @sm:text-lg font-semibold mb-4',
        'xl' => 'text-lg @sm:text-xl font-semibold mb-5',
        default => 'text-sm @sm:text-base font-medium mb-3'
    };

    $aspectClasses = $type === 'sparkline' ? '' : 'aspect-[2/1]';

    $gridColor = 'chart-grid';
    $axisColor = 'chart-axis';
    $textColor = 'chart-text';
    $titleColor = 'chart-title';
@endphp

<div {{ $attributes->merge(['class' => "$containerClasses relative @container"])->merge($dataAttributes) }}>
    
    @if($title)
        <h3 class="{{ $titleClasses }} {{ $titleColor }}">{{ $title }}</h3>
    @endif

    
    <div class="{{ $aspectClasses }} w-full {{ $type === 'sparkline' ? 'h-full' : '' }}">
        @if(!$hasData)
            
            <div class="flex items-center justify-center h-full border border-dashed border-line rounded-lg bg-elevation-1/50">
                <div class="text-center text-muted-foreground">
                    <x-keys::icon name="heroicon-o-chart-bar-square" class="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p class="text-sm">No data available</p>
                </div>
            </div>
        @else
            
            <svg
                viewBox="0 0 {{ $width }} {{ $height }}"
                class="w-full h-full"
                role="img"
                @if($type === 'sparkline' && $sparklineVariant !== 'dots') preserveAspectRatio="none" @endif
                @if($title) aria-labelledby="chart-title" @endif
                @if($interactive) aria-describedby="chart-data" @endif
            >
                
                <defs>
                    
                    
                </defs>

                
                @if($showGrid && $isCartesianChart)
                    <g class="{{ $gridColor }}" stroke-width="1">
                        
                        @foreach($yAxisTicks as $tick)
                            <line
                                x1="{{ $padding }}"
                                y1="{{ $tick['y'] }}"
                                x2="{{ $width - $padding }}"
                                y2="{{ $tick['y'] }}"
                                class="opacity-30"
                            />
                        @endforeach

                        
                        @if($type === 'bar')
                            @foreach($processedData as $index => $item)
                                @php $barDims = $getBarDimensions($index, 0); @endphp
                                <line
                                    x1="{{ $barDims['x'] + $barDims['width']/2 }}"
                                    y1="{{ $padding }}"
                                    x2="{{ $barDims['x'] + $barDims['width']/2 }}"
                                    y2="{{ $height - $padding }}"
                                    class="opacity-20"
                                />
                            @endforeach
                        @endif
                    </g>
                @endif

                
                @if($showAxes && $isCartesianChart)
                    <g class="{{ $axisColor }}" stroke-width="2">
                        
                        <line
                            x1="{{ $padding }}"
                            y1="{{ $height - $padding }}"
                            x2="{{ $width - $padding }}"
                            y2="{{ $height - $padding }}"
                        />

                        
                        <line
                            x1="{{ $padding }}"
                            y1="{{ $padding }}"
                            x2="{{ $padding }}"
                            y2="{{ $height - $padding }}"
                        />
                    </g>
                @endif

                
                @if($type === 'bar')
                    
                    <g>
                        @foreach($processedData as $index => $item)
                            @php
                                $barDims = $getBarDimensions($index, $item['y']);
                                $animationDelay = $animate ? ($index * 0.1) . 's' : '0s';
                                $tooltipContent = $getTooltipContent($item);
                                $barClasses = $getChartBarClass($index);

                                $zeroY = $getCoordinates(0, 0)['y'];
                                $transformOriginX = $barDims['x'] + ($barDims['width'] / 2);
                                $transformOriginY = $zeroY;
                                $animationStyle = $animate ? "animation-delay: {$animationDelay}; transform-origin: {$transformOriginX}px {$transformOriginY}px;" : '';
                            @endphp

                            <rect
                                x="{{ $barDims['x'] }}"
                                y="{{ $barDims['y'] }}"
                                width="{{ $barDims['width'] }}"
                                height="{{ $barDims['height'] }}"
                                class="{{ $barClasses }} @if($interactive) cursor-pointer @endif"
                                @if($animate) style="{{ $animationStyle }}" @endif
                                @if($interactive)
                                    data-chart-item="true"
                                    data-index="{{ $index }}"
                                    data-value="{{ $item['y'] }}"
                                    data-label="{{ $item['x'] }}"
                                    tabindex="0"
                                    role="button"
                                    aria-label="{{ $tooltipContent }}"
                                @endif
                                rx="2"
                                ry="2"
                            />
                        @endforeach
                    </g>
                @endif

                @if($type === 'pie')
                    
                    <g>
                        @foreach($pieSegments as $index => $segment)
                            @php
                                $animationDelay = $animate ? ($index * 0.1) . 's' : '0s';
                                $sliceClasses = $getChartBarClass($index);
                                $tooltipContent = $segment['label'] . ': ' . number_format($segment['value']) . ' (' . $segment['percentage'] . '%)';
                            @endphp

                            <path
                                d="{{ $segment['path'] }}"
                                class="{{ $sliceClasses }} chart-pie-slice @if($interactive) cursor-pointer @endif"
                                @if($animate) style="animation-delay: {{ $animationDelay }}; transform-origin: {{ $pieCenter['x'] }}px {{ $pieCenter['y'] }}px;" @endif
                                @if($interactive)
                                    data-chart-item="true"
                                    data-chart-pie-slice="true"
                                    data-index="{{ $index }}"
                                    data-value="{{ $segment['value'] }}"
                                    data-percentage="{{ $segment['percentage'] }}"
                                    data-label="{{ $segment['label'] }}"
                                    tabindex="0"
                                    role="button"
                                    aria-label="{{ $tooltipContent }}"
                                @endif
                            />
                        @endforeach
                    </g>
                @endif

                @if($type === 'line' || $type === 'area' || $type === 'sparkline')
                    
                    <g>
                        
                        @if($type === 'sparkline')
                            @if($sparklineVariant === 'bars')
                                
                                @foreach($processedData as $index => $item)
                                    @php
                                        $barDims = $getBarDimensions($index, $item['y']);
                                        $barClasses = $getChartBarClass($index);
                                    @endphp
                                    <rect
                                        x="{{ $barDims['x'] }}"
                                        y="{{ $barDims['y'] }}"
                                        width="{{ $barDims['width'] * 0.7 }}"
                                        height="{{ $barDims['height'] }}"
                                        class="{{ $barClasses }} chart-sparkline-bar"
                                        rx="1"
                                        ry="1"
                                    />
                                @endforeach
                            @elseif($sparklineVariant === 'dots')
                                
                                @foreach($dataPoints as $index => $point)
                                    @php $dotClasses = $getChartBarClass($index); @endphp
                                    <circle
                                        cx="{{ $point['x'] }}"
                                        cy="{{ $point['y'] }}"
                                        r="3"
                                        class="{{ $dotClasses }} chart-sparkline-dot"
                                    />
                                @endforeach
                            @elseif($sparklineVariant === 'area')
                                
                                @php
                                    $firstPoint = $dataPoints[0] ?? null;
                                    $lastPoint = end($dataPoints);
                                    $areaPath = $linePoints;
                                    if ($firstPoint && $lastPoint) {
                                        $baselineY = $height - $padding;
                                        $areaPath .= " {$lastPoint['x']},{$baselineY} {$firstPoint['x']},{$baselineY}";
                                    }
                                @endphp
                                <polygon
                                    points="{{ $areaPath }}"
                                    class="chart-area-fill chart-bar-1 chart-sparkline-area"
                                    style="opacity: 0.3;"
                                />
                                <polyline
                                    points="{{ $linePoints }}"
                                    class="chart-line chart-line-1 chart-sparkline"
                                    fill="none"
                                    stroke-width="2"
                                />
                            @else
                                
                                <polyline
                                    points="{{ $linePoints }}"
                                    class="chart-line chart-line-1 chart-sparkline"
                                    fill="none"
                                    stroke-width="2"
                                />
                                
                                @php
                                    $firstPoint = $dataPoints[0] ?? null;
                                    $lastPoint = end($dataPoints);
                                @endphp
                                @if($firstPoint)
                                    <circle
                                        cx="{{ $firstPoint['x'] }}"
                                        cy="{{ $firstPoint['y'] }}"
                                        r="2"
                                        class="chart-bar-1 chart-sparkline-point"
                                    />
                                @endif
                                @if($lastPoint)
                                    <circle
                                        cx="{{ $lastPoint['x'] }}"
                                        cy="{{ $lastPoint['y'] }}"
                                        r="2"
                                        class="chart-bar-1 chart-sparkline-point"
                                    />
                                @endif
                            @endif
                        @else
                            
                            @if($hasMultipleSeries)
                                
                                @foreach($processedSeries as $seriesIndex => $series)
                                    @php
                                        $seriesLinePoints = $getSeriesLinePoints($series['data']);
                                        $seriesDataPoints = $getSeriesDataPoints($series['data']);
                                        $seriesColorClass = 'chart-line-' . (($seriesIndex % 8) + 1);
                                        $seriesBarClass = 'chart-bar-' . (($seriesIndex % 8) + 1);
                                    @endphp

                                    
                                    @if($type === 'area' && !empty($seriesLinePoints))
                                        @php
                                            $firstPoint = $seriesDataPoints[0] ?? null;
                                            $lastPoint = end($seriesDataPoints);
                                            $areaPath = $seriesLinePoints;
                                            if ($firstPoint && $lastPoint) {
                                                $baselineY = $height - $padding;
                                                $areaPath .= " {$lastPoint['x']},{$baselineY} {$firstPoint['x']},{$baselineY}";
                                            }
                                        @endphp
                                        <polygon
                                            points="{{ $areaPath }}"
                                            class="chart-area-fill {{ $seriesBarClass }}"
                                            style="opacity: 0.15;"
                                        />
                                    @endif

                                    
                                    <polyline
                                        points="{{ $seriesLinePoints }}"
                                        class="chart-line {{ $seriesColorClass }}"
                                        fill="none"
                                        stroke-width="3"
                                        @if($animate)
                                            style="animation: lineDrawIn 1s ease-out forwards; stroke-dasharray: 2000; stroke-dashoffset: 2000; animation-delay: {{ $seriesIndex * 0.2 }}s;"
                                        @endif
                                    />

                                    
                                    @foreach($seriesDataPoints as $pointIndex => $point)
                                        @php
                                            $animationDelay = $animate ? (0.8 + ($seriesIndex * 0.2) + ($pointIndex * 0.05)) . 's' : '0s';
                                            $tooltipContent = $getTooltipContent($point['data']);
                                        @endphp

                                        
                                        @if($interactive)
                                            <circle
                                                cx="{{ $point['x'] }}"
                                                cy="{{ $point['y'] }}"
                                                r="18"
                                                class="chart-data-point-hover cursor-pointer"
                                                fill="transparent"
                                                data-chart-item="true"
                                                data-series-index="{{ $seriesIndex }}"
                                                data-series-name="{{ $series['name'] }}"
                                                data-index="{{ $pointIndex }}"
                                                data-value="{{ $point['data']['y'] }}"
                                                data-label="{{ $point['data']['x'] }}"
                                                tabindex="0"
                                                role="button"
                                                aria-label="{{ $series['name'] }}: {{ $tooltipContent }}"
                                            />
                                        @endif

                                        
                                        <circle
                                            cx="{{ $point['x'] }}"
                                            cy="{{ $point['y'] }}"
                                            r="5"
                                            class="{{ $seriesBarClass }} chart-data-point"
                                            style="pointer-events: none; @if($animate) animation-delay: {{ $animationDelay }}; @endif"
                                        />
                                    @endforeach
                                @endforeach
                            @else
                                
                                
                                @if($type === 'area' && !empty($linePoints))
                                    @php

                                        $firstPoint = $dataPoints[0] ?? null;
                                        $lastPoint = end($dataPoints);
                                        $areaPath = $linePoints;
                                        if ($firstPoint && $lastPoint) {

                                            $baselineY = $height - $padding;
                                            $areaPath .= " {$lastPoint['x']},{$baselineY} {$firstPoint['x']},{$baselineY}";
                                        }
                                    @endphp
                                    <polygon
                                        points="{{ $areaPath }}"
                                        class="chart-area-fill chart-bar-1"
                                        style="opacity: 0.2;"
                                    />
                                @endif

                                
                                @if(!empty($linePoints))
                                    <polyline
                                        points="{{ $linePoints }}"
                                        class="chart-line chart-line-1"
                                        fill="none"
                                        stroke-width="3"
                                        @if($animate)
                                            style="animation: lineDrawIn 1s ease-out forwards; stroke-dasharray: 2000; stroke-dashoffset: 2000;"
                                        @endif
                                    />
                                @endif

                                
                                @foreach($dataPoints as $index => $point)
                                    @php
                                        $animationDelay = $animate ? (0.8 + ($index * 0.05)) . 's' : '0s';
                                        $tooltipContent = $getTooltipContent($point['data']);
                                        $pointClasses = $getChartBarClass($index);
                                    @endphp

                                    
                                    @if($interactive)
                                        <circle
                                            cx="{{ $point['x'] }}"
                                            cy="{{ $point['y'] }}"
                                            r="18"
                                            class="chart-data-point-hover cursor-pointer"
                                            fill="transparent"
                                            data-chart-item="true"
                                            data-index="{{ $index }}"
                                            data-value="{{ $point['data']['y'] }}"
                                            data-label="{{ $point['data']['x'] }}"
                                            tabindex="0"
                                            role="button"
                                            aria-label="{{ $tooltipContent }}"
                                        />
                                    @endif

                                    
                                    <circle
                                        cx="{{ $point['x'] }}"
                                        cy="{{ $point['y'] }}"
                                        r="5"
                                        class="{{ $pointClasses }} chart-data-point"
                                        style="pointer-events: none; @if($animate) animation-delay: {{ $animationDelay }}; @endif"
                                    />
                                @endforeach
                            @endif
                        @endif
                    </g>
                @endif

                
                @if($showAxes && $isCartesianChart)
                    <g class="{{ $textColor }}" text-anchor="middle" dominant-baseline="middle">
                        
                        @foreach($yAxisTicks as $tick)
                            <text
                                x="{{ $padding - 20 }}"
                                y="{{ $tick['y'] }}"
                                class="text-xs @sm:text-sm font-medium text-muted"
                                text-anchor="end"
                            >
                                {{ $tick['label'] }}
                            </text>
                        @endforeach

                        
                        @foreach($xAxisTicks as $tick)
                            @php

                                $adjustedX = $tick['x'] + 15;
                            @endphp
                            <text
                                x="{{ $adjustedX }}"
                                y="{{ $height - $padding + 30 }}"
                                class="text-xs @sm:text-sm font-medium text-muted"
                                text-anchor="end"
                                transform="rotate(-45, {{ $adjustedX }}, {{ $height - $padding + 30 }})"
                            >
                                {{ $tick['label'] }}
                            </text>
                        @endforeach
                    </g>
                @endif

                
                @if($showAxes && ($xLabel || $yLabel) && $isCartesianChart)
                    <g class="{{ $textColor }}">
                        
                        @if($xLabel)
                            <text
                                x="{{ $width / 2 }}"
                                y="{{ $height - 15 }}"
                                text-anchor="middle"
                                class="text-xs @sm:text-sm font-semibold"
                            >
                                {{ $xLabel }}
                            </text>
                        @endif

                        
                        @if($yLabel)
                            <text
                                x="20"
                                y="{{ $height / 2 }}"
                                text-anchor="middle"
                                transform="rotate(-90, 20, {{ $height / 2 }})"
                                class="text-xs @sm:text-sm font-semibold"
                            >
                                {{ $yLabel }}
                            </text>
                        @endif
                    </g>
                @endif
            </svg>

        @endif
    </div>

    
    @if($showLegend && $hasData)
        @if($type === 'pie')
            
            <div class="mt-4 flex flex-wrap gap-4 justify-center">
                @foreach($pieSegments as $index => $segment)
                    <div class="flex items-center gap-2 text-xs @sm:text-sm {{ $textColor }}">
                        <div class="w-3 h-3 rounded-sm {{ $getChartLegendClass($index) }}"></div>
                        <span>{{ $segment['label'] }} ({{ $segment['percentage'] }}%)</span>
                    </div>
                @endforeach
            </div>
        @elseif($hasMultipleSeries)
            
            <div class="mt-4 flex flex-wrap gap-4 justify-center">
                @foreach($processedSeries as $seriesIndex => $series)
                    @php
                        $legendColorIndex = ($seriesIndex % 8);
                    @endphp
                    <div class="flex items-center gap-2 text-xs @sm:text-sm {{ $textColor }}">
                        <div class="w-3 h-3 rounded-sm {{ $getChartLegendClass($legendColorIndex) }}"></div>
                        <span>{{ $series['name'] }}</span>
                    </div>
                @endforeach
            </div>
        @else
            
            <div class="mt-4 flex flex-wrap gap-4 justify-center">
                @foreach($processedData as $index => $item)
                    <div class="flex items-center gap-2 text-xs @sm:text-sm {{ $textColor }}">
                        <div class="w-3 h-3 rounded-sm {{ $getChartLegendClass($index) }}"></div>
                        <span>{{ $item['x'] }}</span>
                    </div>
                @endforeach
            </div>
        @endif
    @endif

    
    @if($interactive && $hasData)
        <div class="sr-only" id="chart-data">
            <table>
                <caption>Chart data for {{ $title ?? 'Chart' }}</caption>
                <thead>
                    <tr>
                        <th>{{ $xLabel ?? 'Category' }}</th>
                        <th>{{ $yLabel ?? 'Value' }}</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($processedData as $item)
                        <tr>
                            <td>{{ $item['x'] }}</td>
                            <td>{{ $item['y'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
</div>
