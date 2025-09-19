<?php

namespace Keys\UI;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Keys\UI\Components\Accordion;
use Keys\UI\Components\Alert;
use Keys\UI\Components\Avatar;
use Keys\UI\Components\Avatar\Stack;
use Keys\UI\Components\Badge;
use Keys\UI\Components\Breadcrumbs;
use Keys\UI\Components\Breadcrumbs\Item;
use Keys\UI\Components\Button;
use Keys\UI\Components\Button\Group;
use Keys\UI\Components\Calendar;
use Keys\UI\Components\DatePicker;
use Keys\UI\Components\Card;
use Keys\UI\Components\Checkbox;
use Keys\UI\Components\ChoiceGroup;
use Keys\UI\Components\Dropdown;
use Keys\UI\Components\Editor;
use Keys\UI\Components\Error;
use Keys\UI\Components\Field;
use Keys\UI\Components\Icon;
use Keys\UI\Components\Input;
use Keys\UI\Components\Label;
use Keys\UI\Components\Loading;
use Keys\UI\Components\Menu;
use Keys\UI\Components\Menu\Checkbox as MenuCheckbox;
use Keys\UI\Components\Menu\Item as MenuItem;
use Keys\UI\Components\Menu\Radio as MenuRadio;
use Keys\UI\Components\Menu\Separator as MenuSeparator;
use Keys\UI\Components\Menu\Submenu as MenuSubmenu;
use Keys\UI\Components\Modal;
use Keys\UI\Components\Radio;
use Keys\UI\Components\Range;
use Keys\UI\Components\Select;
use Keys\UI\Components\Select\Option;
use Keys\UI\Components\Tabs;
use Keys\UI\Components\Tabs\Tab;
use Keys\UI\Components\Tabs\Panel;
use Keys\UI\Components\Textarea;
use Keys\UI\Components\Toast;
use Keys\UI\Components\Toggle;
use Keys\UI\Components\Tooltip;
use Keys\UI\Components\HeadingDecorator;
use Keys\UI\Components\Gallery;
use Keys\UI\Components\Image;
use Keys\UI\Components\TimePicker;
use Keys\UI\Components\Table;
use Keys\UI\Components\Table\Head;
use Keys\UI\Components\Table\Body;
use Keys\UI\Components\Table\Row;
use Keys\UI\Components\Table\Cell;
use Keys\UI\Components\Table\Header;
use Keys\UI\Components\Table\EmptyState as TableEmpty;
use Keys\UI\Components\Table\Loading as TableLoading;
use Keys\UI\Components\AddToCart;
use Keys\UI\Components\FileUpload;
use Keys\UI\Components\Progress;
use Keys\UI\Components\Separator;
use Keys\UI\Services\AssetManager;
use Keys\UI\Services\KeysManager;
use Keys\UI\Services\ModalManager;
use Keys\UI\Services\ToastManager;

class KeysUiServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/keys-ui.php',
            'keys-ui'
        );

        $this->app->singleton(AssetManager::class, function ($app) {
            return new AssetManager();
        });

        $this->app->singleton(ModalManager::class, function ($app) {
            return new ModalManager();
        });

        $this->app->singleton(ToastManager::class, function ($app) {
            return new ToastManager();
        });

        $this->app->singleton(KeysManager::class, function ($app) {
            return new KeysManager();
        });
    }

    /**
     * Bootstrap any package services.
     */
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'keys');
        $this->loadTranslationsFrom(__DIR__.'/../lang', 'keys-ui');

        $this->publishes([
            __DIR__.'/../config/keys-ui.php' => config_path('keys-ui.php'),
        ], 'keys-ui-config');

        $this->publishes([
            __DIR__.'/../resources/views' => resource_path('views/vendor/keys'),
        ], 'keys-ui-views');

        $this->publishes([
            __DIR__.'/../dist' => public_path('vendor/keys-ui'),
        ], 'keys-ui-assets');

        $this->publishes([
            __DIR__.'/Components' => app_path('View/Components/Keys'),
            __DIR__.'/../resources/views/components' => resource_path('views/components/keys'),
        ], 'keys-ui-components');

        $this->publishes([
            __DIR__.'/../lang' => $this->app->langPath('vendor/keys-ui'),
        ], 'keys-ui-lang');

        Blade::component('keys::accordion', Accordion::class);
        Blade::component('keys::icon', Icon::class);
        Blade::component('keys::loading', Loading::class);
        Blade::component('keys::button', Button::class);
        Blade::component('keys::button.group', Group::class);
        Blade::component('keys::calendar', Calendar::class);
        Blade::component('keys::date-picker', DatePicker::class);
        Blade::component('keys::card', Card::class);
        Blade::component('keys::label', Label::class);
        Blade::component('keys::error', Error::class);
        Blade::component('keys::input', Input::class);
        Blade::component('keys::textarea', Textarea::class);
        Blade::component('keys::checkbox', Checkbox::class);
        Blade::component('keys::radio', Radio::class);
        Blade::component('keys::range', Range::class);
        Blade::component('keys::choice-group', ChoiceGroup::class);
        Blade::component('keys::field', Field::class);
        Blade::component('keys::alert', Alert::class);
        Blade::component('keys::select', Select::class);
        Blade::component('keys::select.option', Option::class);
        Blade::component('keys::tabs', Tabs::class);
        Blade::component('keys::tabs.tab', Tab::class);
        Blade::component('keys::tabs.panel', Panel::class);
        Blade::component('keys::toggle', Toggle::class);
        Blade::component('keys::avatar', Avatar::class);
        Blade::component('keys::avatar.stack', Stack::class);
        Blade::component('keys::badge', Badge::class);
        Blade::component('keys::breadcrumbs', Breadcrumbs::class);
        Blade::component('keys::breadcrumbs.item', Item::class);
        Blade::component('keys::modal', Modal::class);
        Blade::component('keys::toast', Toast::class);
        Blade::component('keys::dropdown', Dropdown::class);
        Blade::component('keys::editor', Editor::class);
        Blade::component('keys::menu', Menu::class);
        Blade::component('keys::menu.item', MenuItem::class);
        Blade::component('keys::menu.checkbox', MenuCheckbox::class);
        Blade::component('keys::menu.radio', MenuRadio::class);
        Blade::component('keys::menu.separator', MenuSeparator::class);
        Blade::component('keys::menu.submenu', MenuSubmenu::class);
        Blade::component('keys::table', Table::class);
        Blade::component('keys::table.head', Head::class);
        Blade::component('keys::table.body', Body::class);
        Blade::component('keys::table.row', Row::class);
        Blade::component('keys::table.cell', Cell::class);
        Blade::component('keys::table.header', Header::class);
        Blade::component('keys::table.empty-state', TableEmpty::class);
        Blade::component('keys::table.loading-state', TableLoading::class);
        Blade::component('keys::tooltip', Tooltip::class);
        Blade::component('keys::heading-decorator', HeadingDecorator::class);
        Blade::component('keys::gallery', Gallery::class);
        Blade::component('keys::image', Image::class);
        Blade::component('keys::timepicker', TimePicker::class);
        Blade::component('keys::add-to-cart', AddToCart::class);
        Blade::component('keys::file-upload', FileUpload::class);
        Blade::component('keys::progress', Progress::class);
        Blade::component('keys::separator', Separator::class);

        $this->app->alias(KeysManager::class, 'keys');

        $this->registerAssetDirectives();
    }

    /**
     * Register Blade directives for asset injection
     */
    protected function registerAssetDirectives(): void
    {
        Blade::directive('keysAssets', function () {
            return "<?php echo app('Keys\\UI\\Services\\AssetManager')->renderAssets(); ?>";
        });

        Blade::directive('keysStyles', function () {
            return "<?php echo app('Keys\\UI\\Services\\AssetManager')->renderStyles(); ?>";
        });

        Blade::directive('keysScripts', function () {
            return "<?php echo app('Keys\\UI\\Services\\AssetManager')->renderScripts(); ?>";
        });

        Blade::directive('keysTranslations', function () {
            return "<?php echo app('Keys\\UI\\Services\\AssetManager')->renderTranslations(); ?>";
        });
    }
}