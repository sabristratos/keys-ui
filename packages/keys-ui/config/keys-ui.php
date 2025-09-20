<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Keys UI Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the minimal configuration options for the Keys UI
    | package. Keys UI now uses a zero-configuration approach with automatic
    | asset serving via the <keys:scripts /> component.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Package Version
    |--------------------------------------------------------------------------
    |
    | The version number used for cache busting and debugging purposes.
    | This is automatically injected into the JavaScript configuration.
    |
    */

    'version' => '1.2.0',

    /*
    |--------------------------------------------------------------------------
    | Debug Mode
    |--------------------------------------------------------------------------
    |
    | When enabled, additional debugging information will be available
    | in the browser console and error messages will be more verbose.
    |
    */

    'debug' => env('KEYS_UI_DEBUG', app()->hasDebugModeEnabled()),

];