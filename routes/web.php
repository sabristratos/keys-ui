<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-toggle', function () {
    return view('test-toggle');
});

Route::get('/livewire-select-test', function () {
    return view('livewire-test-page');
});

Route::get('/editor-demo', function () {
    return view('editor-demo');
})->name('editor.demo');

Route::get('/user-demo', \App\Livewire\UserManagementDemo::class)->name('user.demo');

Route::get('/sidebar-demo', function () {
    return view('sidebar-demo');
})->name('sidebar.demo');

Route::get('/test-sidebar-default', function () {
    return view('test-sidebar-default');
})->name('test.sidebar.default');

