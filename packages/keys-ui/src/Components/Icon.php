<?php

namespace Keys\UI\Components;

use Illuminate\Support\Facades\File;
use Illuminate\View\Component;
use Keys\UI\Constants\ComponentConstants;

/**
 * Icon Component
 *
 * Intelligent icon resolution with support for:
 * - Simple names: "heart" → heroicon-o-heart
 * - Variants: variant="solid|outline|mini"
 * - Shorthand: "s:heart" → heroicon-s-heart
 * - Custom icons: resource_path('icons/logo.svg')
 * - Backward compatibility: "heroicon-o-heart", "icons.logo"
 *
 * Resolution Priority: Custom → Blade → Heroicon
 */
class Icon extends Component
{
    private const VARIANT_MAP = ['o' => 'outline', 's' => 'solid', 'm' => 'mini'];

    // Cache for performance
    private static array $existenceCache = [];

    public function __construct(
        public string $name,
        public string $size = 'md',
        public string $variant = 'outline',
        public ?string $fallback = 'heroicon-o-question-mark-circle'
    ) {
        $this->size = ComponentConstants::validate($this->size, ComponentConstants::SIZES_XS_TO_XL, 'md');
        $this->variant = ComponentConstants::validate($this->variant, ComponentConstants::ICON_VARIANTS, 'outline');
    }

    /**
     * Resolve icon name with intelligent detection
     * Priority: Custom → Blade → Heroicon
     */
    public function resolveIcon(): string
    {
        // 1. Check if fully qualified (backward compatibility)
        if ($this->isFullyQualified()) {
            return $this->name;
        }

        // 2. Check for explicit prefix
        if (str_contains($this->name, ':')) {
            return $this->resolveExplicitPrefix();
        }

        // 3. Smart resolution: Custom → Blade → Heroicon
        $simpleName = $this->extractSimpleName();

        // Priority 1: Custom icons
        if ($this->customIconExists($simpleName)) {
            return "custom:{$simpleName}";
        }

        // Priority 2: Blade component icons
        if ($this->bladeIconExists($simpleName)) {
            return "keys::icons.{$simpleName}";
        }

        // Priority 3: Heroicon
        return $this->resolveHeroicon($simpleName);
    }

    /**
     * Check if icon name is fully qualified (backward compatibility)
     */
    protected function isFullyQualified(): bool
    {
        return str_starts_with($this->name, 'heroicon-')
            || str_starts_with($this->name, 'icons.')
            || str_starts_with($this->name, 'keys::');
    }

    /**
     * Resolve icon with explicit prefix (custom:, blade:, hero:, s:, m:, o:)
     */
    protected function resolveExplicitPrefix(): string
    {
        [$prefix, $iconName] = explode(':', $this->name, 2);

        return match($prefix) {
            'custom' => "custom:{$iconName}",
            'blade' => str_starts_with($iconName, 'icons.') ? "keys::{$iconName}" : "keys::icons.{$iconName}",
            'hero' => $this->resolveHeroicon($iconName),
            's', 'solid' => $this->resolveHeroicon($iconName, 'solid'),
            'm', 'mini' => $this->resolveHeroicon($iconName, 'mini'),
            'o', 'outline' => $this->resolveHeroicon($iconName, 'outline'),
            default => $this->name,
        };
    }

    /**
     * Extract simple icon name from potential shorthand prefix
     */
    protected function extractSimpleName(): string
    {
        // Note: shorthand prefixes handled in resolveExplicitPrefix
        return $this->name;
    }

    /**
     * Resolve to heroicon with variant
     */
    protected function resolveHeroicon(string $iconName, ?string $variant = null): string
    {
        $variant = $variant ?? $this->variant;
        $prefix = match($variant) {
            'solid' => 's',
            'mini' => 'm',
            default => 'o',
        };

        return "heroicon-{$prefix}-{$iconName}";
    }

    /**
     * Check if custom icon exists (cached)
     */
    protected function customIconExists(string $iconName): bool
    {
        $cacheKey = "custom:{$iconName}";

        if (!isset(self::$existenceCache[$cacheKey])) {
            $iconPath = resource_path("icons/{$iconName}.svg");
            self::$existenceCache[$cacheKey] = File::exists($iconPath);
        }

        return self::$existenceCache[$cacheKey];
    }

    /**
     * Check if blade icon exists (cached)
     */
    protected function bladeIconExists(string $iconName): bool
    {
        $cacheKey = "blade:{$iconName}";

        if (!isset(self::$existenceCache[$cacheKey])) {
            $iconPath = __DIR__ . "/../resources/views/components/icons/{$iconName}.blade.php";
            self::$existenceCache[$cacheKey] = File::exists($iconPath);
        }

        return self::$existenceCache[$cacheKey];
    }

    /**
     * Check if resolved icon exists
     */
    public function iconExists(): bool
    {
        $resolved = $this->resolveIcon();

        // Custom icons
        if (str_starts_with($resolved, 'custom:')) {
            return $this->customIconExists(str_replace('custom:', '', $resolved));
        }

        // Blade components
        if (str_starts_with($resolved, 'keys::')) {
            $iconName = str_replace(['keys::icons.', 'keys::'], '', $resolved);
            return $this->bladeIconExists($iconName);
        }

        // Heroicons always exist (from package)
        if (str_starts_with($resolved, 'heroicon-')) {
            return true;
        }

        return false;
    }

    /**
     * Get data attributes for targeting
     */
    public function getDataAttributes(): array
    {
        $resolved = $this->resolveIcon();

        $iconType = match(true) {
            str_starts_with($resolved, 'heroicon-') => 'heroicon',
            str_starts_with($resolved, 'custom:') => 'custom',
            str_starts_with($resolved, 'keys::') => 'blade',
            default => 'unknown',
        };

        return [
            'data-icon' => 'true',
            'data-size' => $this->size,
            'data-variant' => $this->variant,
            'data-icon-type' => $iconType,
            'data-original-name' => $this->name,
        ];
    }

    public function render()
    {
        $resolvedIcon = $this->resolveIcon();

        // Handle custom SVG icons
        if (str_starts_with($resolvedIcon, 'custom:')) {
            $iconName = str_replace('custom:', '', $resolvedIcon);
            return view('keys::components.icon-custom', [
                'iconPath' => resource_path("icons/{$iconName}.svg"),
                'dataAttributes' => $this->getDataAttributes(),
            ]);
        }

        return view('keys::components.icon', [
            'resolvedIcon' => $resolvedIcon,
            'fallback' => $this->fallback,
            'iconExists' => $this->iconExists(),
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}
