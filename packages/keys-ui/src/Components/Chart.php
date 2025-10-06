<?php

namespace Keys\UI\Components;

use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Chart Component
 *
 * A flexible, zero-dependency chart component that renders SVG-based charts.
 * Supports multiple chart types with customizable styling, interactivity,
 * and framework-agnostic functionality.
 */
class Chart extends Component
{

    public array $processedData = [];
    public array $processedSeries = [];
    public array $scales = [];
    public array $bounds = [];
    private array $pieGeometry = [];

    /**
     * Create a new Chart component instance.
     *
     * @param  array  $data  Chart data array
     * @param  string  $type  Chart type (bar, line, area)
     * @param  string  $xField  Field name for X-axis data
     * @param  string  $yField  Field name for Y-axis data
     * @param  array  $colors  Custom color palette for chart elements
     * @param  string  $size  Size variant (sm, md, lg, xl)
     * @param  bool  $showGrid  Whether to show grid lines
     * @param  bool  $showLegend  Whether to show legend
     * @param  bool  $showAxes  Whether to show axes
     * @param  bool  $animate  Whether to enable animations
     * @param  bool  $interactive  Whether to enable interactivity (tooltips, hover)
     * @param  int  $width  Chart width for calculations (SVG viewBox width)
     * @param  int  $height  Chart height for calculations (SVG viewBox height)
     * @param  int  $padding  Internal padding for chart area
     * @param  string|null  $title  Chart title
     * @param  string|null  $xLabel  X-axis label
     * @param  string|null  $yLabel  Y-axis label
     */
    public function __construct(
        public array $data = [],
        public string $type = 'bar',
        public string $xField = 'x',
        public string $yField = 'y',
        public array $series = [],
        public array $colors = [],
        public string $size = 'md',
        public bool $showGrid = true,
        public bool $showLegend = false,
        public bool $showAxes = true,
        public bool $animate = true,
        public bool $interactive = true,
        public int $width = 800,
        public int $height = 400,
        public int $padding = 120,
        public ?string $title = null,
        public ?string $xLabel = null,
        public ?string $yLabel = null,
        public string $sparklineVariant = 'line'
    ) {
        
        $validTypes = ['bar', 'line', 'area', 'pie', 'sparkline'];
        if (!in_array($this->type, $validTypes)) {
            $this->type = 'bar';
        }

        
        if ($this->type === 'sparkline') {
            $this->showGrid = false;
            $this->showAxes = false;
            $this->showLegend = false;
            $this->padding = 0;
            $this->width = 200;
            $this->height = 60;
            $this->interactive = false; 
            $this->animate = false; 

            
            $validVariants = ['line', 'bars', 'dots', 'area'];
            if (!in_array($this->sparklineVariant, $validVariants)) {
                $this->sparklineVariant = 'line';
            }
        }

        
        if ($this->type === 'pie') {
            $this->showGrid = false;
            $this->showAxes = false;
        }

        
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_XS_TO_XL, 'md');

        
        if (empty($this->colors)) {
            $this->colors = [
                'var(--chart-color-1)', 
                'var(--chart-color-2)', 
                'var(--chart-color-3)', 
                'var(--chart-color-4)', 
                'var(--chart-color-5)', 
                'var(--chart-color-6)', 
                'var(--chart-color-7)', 
                'var(--chart-color-8)', 
            ];
        }

        
        $this->processData();
        $this->calculateScales();
        $this->calculateBounds();

        
        if ($this->type === 'pie') {
            $this->calculatePieGeometry();
        }
    }

    /**
     * Process raw data into structured format for chart rendering.
     */
    private function processData(): void
    {
        if (empty($this->data)) {
            return;
        }

        
        if (!empty($this->series) && $this->isLineBased()) {
            $this->processMultiSeriesData();
            return;
        }

        
        $this->processedData = array_map(function($item, $index) {
            $xValue = $item[$this->xField] ?? $index;
            $yValue = (float) ($item[$this->yField] ?? 0);

            return [
                'x' => $xValue,
                'y' => $yValue,
                'xOriginal' => $xValue,
                'yOriginal' => $yValue,
                'color' => $this->colors[$index % count($this->colors)],
                'index' => $index,
                'originalData' => $item
            ];
        }, $this->data, array_keys($this->data));
    }

    /**
     * Process data for multi-series line/area charts.
     */
    private function processMultiSeriesData(): void
    {
        
        foreach ($this->series as $seriesIndex => $seriesDef) {
            $seriesName = $seriesDef['name'] ?? "Series " . ($seriesIndex + 1);
            $seriesField = $seriesDef['field'] ?? $this->yField;

            $seriesData = array_map(function($item, $index) use ($seriesField, $seriesIndex) {
                $xValue = $item[$this->xField] ?? $index;
                $yValue = (float) ($item[$seriesField] ?? 0);

                return [
                    'x' => $xValue,
                    'y' => $yValue,
                    'xOriginal' => $xValue,
                    'yOriginal' => $yValue,
                    'index' => $index,
                    'originalData' => $item
                ];
            }, $this->data, array_keys($this->data));

            $this->processedSeries[] = [
                'name' => $seriesName,
                'field' => $seriesField,
                'data' => $seriesData,
                'color' => $this->colors[$seriesIndex % count($this->colors)],
                'seriesIndex' => $seriesIndex
            ];
        }

        
        if (!empty($this->processedSeries)) {
            $this->processedData = $this->processedSeries[0]['data'];
        }
    }

    /**
     * Calculate X and Y scales for positioning elements in SVG coordinates.
     */
    private function calculateScales(): void
    {
        if (empty($this->processedData)) {
            return;
        }

        
        $yValues = [];

        if (!empty($this->processedSeries)) {
            
            foreach ($this->processedSeries as $series) {
                $seriesYValues = array_column($series['data'], 'y');
                $yValues = array_merge($yValues, $seriesYValues);
            }
        } else {
            
            $yValues = array_column($this->processedData, 'y');
        }

        $yMin = min(0, min($yValues)); 
        $yMax = max($yValues);

        
        $yRange = $yMax - $yMin;
        if ($yRange > 0) {
            $yMax += $yRange * 0.1;
            $yMin -= $yRange * 0.1;
        }

        
        $chartWidth = $this->width - ($this->padding * 2);
        $chartHeight = $this->height - ($this->padding * 2);

        $this->scales = [
            'x' => [
                'min' => 0,
                'max' => count($this->processedData) - 1,
                'range' => count($this->processedData) - 1,
                'chartRange' => $chartWidth
            ],
            'y' => [
                'min' => $yMin,
                'max' => $yMax,
                'range' => $yMax - $yMin,
                'chartRange' => $chartHeight
            ]
        ];
    }

    /**
     * Calculate bounds for chart elements (bars, points, etc).
     */
    private function calculateBounds(): void
    {
        if (empty($this->processedData) || empty($this->scales)) {
            return;
        }

        $this->bounds = [
            'chartArea' => [
                'x' => $this->padding,
                'y' => $this->padding,
                'width' => $this->width - ($this->padding * 2),
                'height' => $this->height - ($this->padding * 2)
            ],
            'barWidth' => 0,
            'barGap' => 0
        ];

        
        $isBarType = $this->type === 'bar' || ($this->type === 'sparkline' && $this->sparklineVariant === 'bars');

        if ($isBarType) {
            $availableWidth = $this->bounds['chartArea']['width'];
            $barCount = count($this->processedData);

            if ($barCount > 0) {
                $totalGapRatio = 0.1; 
                $gapWidth = ($availableWidth * $totalGapRatio) / ($barCount + 1);
                $barWidth = ($availableWidth - ($gapWidth * ($barCount + 1))) / $barCount;

                $this->bounds['barWidth'] = max(2, $barWidth); 
                $this->bounds['barGap'] = $gapWidth;
            }
        }
    }

    /**
     * Convert data coordinates to SVG coordinates.
     */
    public function getCoordinates(float $x, float $y): array
    {
        $chartArea = $this->bounds['chartArea'] ?? [];
        $scales = $this->scales;

        if (empty($chartArea) || empty($scales)) {
            return ['x' => 0, 'y' => 0];
        }

        
        $svgX = $chartArea['x'];
        if ($scales['x']['range'] > 0) {
            $svgX += ($x / $scales['x']['range']) * $chartArea['width'];
        }

        
        $svgY = $chartArea['y'] + $chartArea['height'];
        if ($scales['y']['range'] > 0) {
            $normalizedY = ($y - $scales['y']['min']) / $scales['y']['range'];
            $svgY -= $normalizedY * $chartArea['height'];
        }

        return [
            'x' => round($svgX, 2),
            'y' => round($svgY, 2)
        ];
    }

    /**
     * Get bar dimensions and position for bar charts and sparkline bars variant.
     */
    public function getBarDimensions(int $index, float $value): array
    {
        
        $isBarType = $this->type === 'bar' || ($this->type === 'sparkline' && $this->sparklineVariant === 'bars');

        if (!$isBarType || empty($this->bounds) || empty($this->scales)) {
            return [];
        }

        $chartArea = $this->bounds['chartArea'];
        $barWidth = $this->bounds['barWidth'];
        $barGap = $this->bounds['barGap'];

        
        $x = $chartArea['x'] + $barGap + ($index * ($barWidth + $barGap));

        
        $zeroY = $this->getCoordinates(0, 0)['y'];
        $valueCoords = $this->getCoordinates($index, $value);

        $height = abs($zeroY - $valueCoords['y']);
        $y = min($zeroY, $valueCoords['y']);

        return [
            'x' => round($x, 2),
            'y' => round($y, 2),
            'width' => round($barWidth, 2),
            'height' => round($height, 2)
        ];
    }

    /**
     * Generate Y-axis tick marks and labels.
     */
    public function getYAxisTicks(int $tickCount = 5): array
    {
        if (empty($this->scales)) {
            return [];
        }

        $yScale = $this->scales['y'];
        $ticks = [];

        for ($i = 0; $i <= $tickCount; $i++) {
            $value = $yScale['min'] + (($yScale['max'] - $yScale['min']) * $i / $tickCount);
            $coords = $this->getCoordinates(0, $value);

            $ticks[] = [
                'value' => $value,
                'y' => $coords['y'],
                'label' => $this->formatNumber($value)
            ];
        }

        return $ticks;
    }

    /**
     * Generate X-axis tick marks and labels.
     */
    public function getXAxisTicks(): array
    {
        $ticks = [];

        foreach ($this->processedData as $index => $item) {
            $coords = $this->getCoordinates($index, 0);

            
            if ($this->type === 'bar') {
                $barDims = $this->getBarDimensions($index, 0);
                $x = $barDims['x'] + ($barDims['width'] / 2);
            } else {
                $x = $coords['x'];
            }

            $ticks[] = [
                'value' => $item['xOriginal'],
                'x' => $x,
                'y' => $coords['y'],
                'label' => (string) $item['xOriginal']
            ];
        }

        return $ticks;
    }

    /**
     * Format numbers for display.
     */
    private function formatNumber(float $number): string
    {
        if (abs($number) >= 1000000) {
            return round($number / 1000000, 1) . 'M';
        } elseif (abs($number) >= 1000) {
            return round($number / 1000, 1) . 'K';
        } else {
            return round($number, 1);
        }
    }

    /**
     * Format value for tooltip display with proper number formatting.
     */
    public function formatTooltipValue(float $value): string
    {
        return number_format($value);
    }

    /**
     * Generate tooltip content for a chart data point.
     */
    public function getTooltipContent(array $dataPoint): string
    {
        $label = $dataPoint['xOriginal'] ?? $dataPoint['x'] ?? 'Value';
        $value = $this->formatTooltipValue($dataPoint['y']);

        return "{$label}: {$value}";
    }

    /**
     * Check if chart has valid data to render.
     */
    public function hasData(): bool
    {
        return !empty($this->processedData);
    }

    /**
     * Check if chart type uses cartesian coordinate system (has grid/axes).
     */
    public function isCartesianChart(): bool
    {
        return in_array($this->type, ['bar', 'line', 'area', 'sparkline']);
    }

    /**
     * Check if this is a line-based chart (line, area, sparkline).
     */
    public function isLineBased(): bool
    {
        return in_array($this->type, ['line', 'area', 'sparkline']);
    }

    /**
     * Generate SVG polyline points string for line/area charts.
     */
    public function getLinePoints(): string
    {
        if (empty($this->processedData)) {
            return '';
        }

        $points = [];
        foreach ($this->processedData as $index => $item) {
            $coords = $this->getCoordinates($index, $item['y']);
            $points[] = "{$coords['x']},{$coords['y']}";
        }

        return implode(' ', $points);
    }

    /**
     * Get coordinates for all data points (for interactive circles).
     */
    public function getDataPoints(): array
    {
        $points = [];
        foreach ($this->processedData as $index => $item) {
            $coords = $this->getCoordinates($index, $item['y']);
            $points[] = [
                'x' => $coords['x'],
                'y' => $coords['y'],
                'data' => $item,
                'index' => $index
            ];
        }
        return $points;
    }

    /**
     * Get line points for a specific series.
     */
    public function getSeriesLinePoints(array $seriesData): string
    {
        if (empty($seriesData)) {
            return '';
        }

        $points = [];
        foreach ($seriesData as $index => $item) {
            $coords = $this->getCoordinates($index, $item['y']);
            $points[] = "{$coords['x']},{$coords['y']}";
        }

        return implode(' ', $points);
    }

    /**
     * Get data points for a specific series.
     */
    public function getSeriesDataPoints(array $seriesData): array
    {
        $points = [];
        foreach ($seriesData as $index => $item) {
            $coords = $this->getCoordinates($index, $item['y']);
            $points[] = [
                'x' => $coords['x'],
                'y' => $coords['y'],
                'data' => $item,
                'index' => $index
            ];
        }
        return $points;
    }

    /**
     * Check if this chart uses multiple series.
     */
    public function hasMultipleSeries(): bool
    {
        return !empty($this->processedSeries) && count($this->processedSeries) > 1;
    }

    /**
     * Get color index for a data item.
     */
    private function getColorIndex(int $index): int
    {
        return ($index % count($this->colors)) + 1;
    }

    /**
     * Generate CSS class name for chart bar based on color index.
     */
    public function getChartBarClass(int $index): string
    {
        $colorIndex = $this->getColorIndex($index);
        return "chart-bar chart-bar-{$colorIndex}";
    }

    /**
     * Generate CSS class name for chart legend based on color index.
     */
    public function getChartLegendClass(int $index): string
    {
        $colorIndex = $this->getColorIndex($index);
        return "chart-legend-{$colorIndex}";
    }

    /**
     * Calculate pie chart geometry (center and radius).
     */
    private function calculatePieGeometry(): void
    {
        $centerX = $this->width / 2;
        $centerY = $this->height / 2;
        $radius = min($centerX, $centerY) - 40;

        $this->pieGeometry = [
            'centerX' => $centerX,
            'centerY' => $centerY,
            'radius' => $radius
        ];
    }

    /**
     * Calculate pie chart segments with angles, percentages, and SVG paths.
     */
    public function calculatePieSegments(): array
    {
        if (empty($this->processedData)) {
            return [];
        }

        $total = array_sum(array_column($this->processedData, 'y'));
        if ($total <= 0) {
            return [];
        }

        $currentAngle = -90; 
        $segments = [];

        foreach ($this->processedData as $item) {
            $percentage = ($item['y'] / $total) * 100;
            $angle = ($percentage / 100) * 360;

            $segment = [
                'data' => $item,
                'percentage' => round($percentage, 1),
                'value' => $item['y'],
                'label' => $item['xOriginal'],
                'color' => $item['color'],
                'startAngle' => $currentAngle,
                'endAngle' => $currentAngle + $angle,
                'angle' => $angle,
                'index' => $item['index'],
                'path' => $this->getPieSlicePath($currentAngle, $currentAngle + $angle)
            ];

            $segments[] = $segment;
            $currentAngle += $angle;
        }

        return $segments;
    }

    /**
     * Generate SVG path for a pie slice.
     */
    private function getPieSlicePath(float $startAngle, float $endAngle): string
    {
        
        $centerX = $this->pieGeometry['centerX'];
        $centerY = $this->pieGeometry['centerY'];
        $radius = $this->pieGeometry['radius'];

        
        $startRad = deg2rad($startAngle);
        $endRad = deg2rad($endAngle);

        
        $x1 = $centerX + $radius * cos($startRad);
        $y1 = $centerY + $radius * sin($startRad);
        $x2 = $centerX + $radius * cos($endRad);
        $y2 = $centerY + $radius * sin($endRad);

        
        $largeArc = ($endAngle - $startAngle) > 180 ? 1 : 0;

        
        $path = sprintf(
            'M %s %s L %s %s A %s %s 0 %s 1 %s %s Z',
            $centerX, $centerY,  
            $x1, $y1,             
            $radius, $radius,    
            $largeArc,           
            $x2, $y2             
        );

        return $path;
    }

    /**
     * Get pie chart center coordinates.
     */
    public function getPieCenter(): array
    {
        return [
            'x' => $this->pieGeometry['centerX'] ?? 0,
            'y' => $this->pieGeometry['centerY'] ?? 0
        ];
    }

    /**
     * Get pie chart radius.
     */
    public function getPieRadius(): float
    {
        return $this->pieGeometry['radius'] ?? 0;
    }

    /**
     * Generate comprehensive data attributes for CSS targeting and JavaScript functionality.
     */
    public function getDataAttributes(): array
    {
        $attributes = [
            'data-keys-chart' => 'true',
            'data-chart-type' => $this->type,
            'data-size' => $this->size,
            'data-interactive' => $this->interactive ? 'true' : 'false',
            'data-animated' => $this->animate ? 'true' : 'false',
            'data-show-grid' => $this->showGrid ? 'true' : 'false',
            'data-show-legend' => $this->showLegend ? 'true' : 'false',
            'data-show-axes' => $this->showAxes ? 'true' : 'false',
            'data-has-data' => $this->hasData() ? 'true' : 'false'
        ];

        if (!empty($this->processedData)) {
            $attributes['data-data-count'] = count($this->processedData);
        }

        if ($this->title) {
            $attributes['data-has-title'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the chart component view.
     */
    public function render()
    {
        return view('keys::components.chart', [
            'hasData' => $this->hasData(),
            'isCartesianChart' => $this->isCartesianChart(),
            'processedData' => $this->processedData,
            'processedSeries' => $this->processedSeries,
            'hasMultipleSeries' => $this->hasMultipleSeries(),
            'yAxisTicks' => $this->getYAxisTicks(),
            'xAxisTicks' => $this->getXAxisTicks(),
            'dataAttributes' => $this->getDataAttributes(),
            'pieSegments' => $this->type === 'pie' ? $this->calculatePieSegments() : [],
            'pieCenter' => $this->type === 'pie' ? $this->getPieCenter() : [],
            'pieRadius' => $this->type === 'pie' ? $this->getPieRadius() : 0,
            'linePoints' => $this->isLineBased() ? $this->getLinePoints() : '',
            'dataPoints' => $this->isLineBased() ? $this->getDataPoints() : [],
            'sparklineVariant' => $this->type === 'sparkline' ? $this->sparklineVariant : null,
            'getBarDimensions' => function(int $index, float $value) {
                return $this->getBarDimensions($index, $value);
            },
            'getCoordinates' => function(float $x, float $y) {
                return $this->getCoordinates($x, $y);
            },
            'getTooltipContent' => function(array $dataPoint) {
                return $this->getTooltipContent($dataPoint);
            },
            'getChartBarClass' => function(int $index) {
                return $this->getChartBarClass($index);
            },
            'getChartLegendClass' => function(int $index) {
                return $this->getChartLegendClass($index);
            },
            'getSeriesLinePoints' => function(array $seriesData) {
                return $this->getSeriesLinePoints($seriesData);
            },
            'getSeriesDataPoints' => function(array $seriesData) {
                return $this->getSeriesDataPoints($seriesData);
            }
        ]);
    }
}