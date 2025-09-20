# Changelog

All notable changes to `keys/ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2025-01-20

### Fixed
- **TypeScript Compatibility**: Resolved all TypeScript type errors across component files
- **Event Handler Types**: Fixed EventListener type casting for MouseEvent, TouchEvent, and KeyboardEvent
- **Method Signature Conflicts**: Renamed conflicting destroy methods in RangeActions and TooltipActions
- **State Management**: Fixed string vs HTMLElement parameter issues in state management methods
- **Type Conversions**: Improved type safety in TableActions, ToastActions, and utility classes
- **Null Safety**: Added proper null checks for optional properties and undefined returns
- **Interface Consistency**: Standardized Livewire interface declarations across all action classes

### Changed
- **Build Process**: Enhanced TypeScript compilation with zero errors
- **Code Quality**: Improved type safety and maintainability across the codebase

## [1.1.0] - 2025-01-19

### Added
- **RTL (Right-to-Left) Support**: Comprehensive RTL language support for Arabic, Hebrew, Persian, Urdu, and more
- **Automatic RTL Detection**: Smart detection based on HTML `dir` attribute, `lang` attribute, and explicit CSS classes
- **RTL JavaScript Utilities**: New `RTLUtils` class for RTL detection, class transformation, and dropdown positioning
- **RTL CSS Framework**: 300+ lines of RTL-specific styles with logical properties (start/end vs left/right)
- **RTL Component Updates**: Input component updated with logical positioning for icon placement
- **RTL Dropdown Positioning**: Smart dropdown and submenu positioning for RTL layouts
- **RTL Documentation**: Comprehensive RTL usage examples and implementation guide
- **HasRTLSupport Trait**: Development helper for creating RTL-aware components
- **Icon Usage Documentation**: Comprehensive icon documentation with examples and troubleshooting
- **Dependency Documentation**: Clear installation and dependency information

### Fixed
- **Critical Heroicon Dependency**: Added `blade-ui-kit/blade-heroicons` as required dependency
- **Installation Errors**: Resolved "Unable to locate a class or view for component [heroicon-o-*]" errors
- **Missing Dependencies**: Ensured all required packages are automatically installed

### Enhanced
- **README Documentation**: Added RTL support section, icon usage guide, and troubleshooting section
- **Installation Guide**: Updated with dependency information and post-installation notes
- **Error Handling**: Improved error messages and troubleshooting for common issues
- **Asset Management**: Separated CSS and JavaScript asset injection for better customization

### RTL Features
- Automatic layout flipping for all components
- Smart icon positioning with logical properties
- RTL-aware dropdown and menu positioning
- Text alignment adaptation
- CSS custom properties for RTL support
- JavaScript direction change detection
- Support for 15+ RTL languages

### Developer Experience
- Automatic dependency installation
- Zero-configuration RTL support
- Comprehensive troubleshooting documentation
- Enhanced component development tools
- Better error messages and debugging

## [1.0.0] - 2024-01-19

### Added
- Initial release of Keys UI component library
- 50+ Blade components for Laravel 12 and Tailwind v4
- Complete form component suite (Input, Select, Checkbox, Radio, Toggle, etc.)
- Navigation components (Button, Menu, Breadcrumbs, Tabs)
- Layout components (Card, Modal, Accordion, Table)
- Feedback components (Alert, Toast, Loading, Progress)
- Display components (Badge, Avatar, Icon, Image)
- Advanced components (Calendar, Date Picker, Editor, Gallery)
- Multi-state component support with icon toggling
- Accessibility-first design with WCAG compliance
- Progressive enhancement (works without JavaScript)
- Semantic design system with CSS custom properties
- Dark mode support throughout all components
- Comprehensive TypeScript actions for interactive components
- Laravel service provider with auto-discovery
- Asset management with build pipeline
- PSR-4 autoloading structure

### Component Features
- **Button**: Multi-state icons, size variants, color options, group support
- **Input**: Validation integration, action buttons, type variants
- **Select**: Searchable, multiselect, custom options with icons
- **Checkbox/Radio**: Full card clickability, group management, variant support
- **Modal**: Overlay management, size variants, animation support
- **Table**: Sorting, filtering, loading states, empty state handling
- **Calendar**: Date selection, navigation, locale support
- **Avatar**: Image handling, initials fallback, status indicators, stacking
- **Form Validation**: Laravel error bag integration
- **Icon System**: Heroicon integration with size consistency

### Developer Experience
- Component registration via service provider
- Slot-based architecture for maximum flexibility
- Consistent API patterns across all components
- Comprehensive documentation and examples
- TypeScript support for interactive features
- Build tools for development and production
- Test coverage for browser interactions

[Unreleased]: https://github.com/sabristratos/keys/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/sabristratos/keys/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/sabristratos/keys/releases/tag/v1.0.0