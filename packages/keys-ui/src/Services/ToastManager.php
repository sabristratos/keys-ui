<?php

namespace Keys\UI\Services;

use Illuminate\Support\Str;

class ToastManager
{
    private static ?self $instance = null;
    /**
     * Get singleton instance
     */
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Show a toast with variant and data
     */
    public function show(string $variant, array $data = []): void
    {
        $data['variant'] = $variant;

        if (function_exists('dispatch')) {
            dispatch(function() use ($data) {
                if (class_exists('\Livewire\Livewire')) {
                    \Livewire\Livewire::dispatch('showToast', $data);
                }
            });
        }
    }

    /**
     * Dismiss a toast by ID
     */
    public function dismiss(string $id): void
    {
        if (function_exists('dispatch')) {
            dispatch(function() use ($id) {
                if (class_exists('\Livewire\Livewire')) {
                    \Livewire\Livewire::dispatch('hideToast', ['id' => $id]);
                }
            });
        }
    }

    /**
     * Dismiss all toasts
     */
    public function dismissAll(): void
    {
        if (function_exists('dispatch')) {
            dispatch(function() {
                if (class_exists('\Livewire\Livewire')) {
                    \Livewire\Livewire::dispatch('hideToast');
                }
            });
        }
    }

    /**
     * Create a success toast
     */
    public function success(string $message, string $title = null): void
    {
        $this->show('success', [
            'message' => $message,
            'title' => $title,
        ]);
    }

    /**
     * Create an error toast
     */
    public function error(string $message, string $title = null): void
    {
        $this->show('error', [
            'message' => $message,
            'title' => $title,
        ]);
    }

    /**
     * Create a warning toast
     */
    public function warning(string $message, string $title = null): void
    {
        $this->show('warning', [
            'message' => $message,
            'title' => $title,
        ]);
    }

    /**
     * Create an info toast
     */
    public function info(string $message, string $title = null): void
    {
        $this->show('info', [
            'message' => $message,
            'title' => $title,
        ]);
    }
}