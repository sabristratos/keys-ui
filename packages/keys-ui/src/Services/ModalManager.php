<?php

namespace Keys\UI\Services;

use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;

class ModalManager
{
    private static ?self $instance = null;
    private array $modals = [];

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
     * Create or get a modal instance
     */
    public function modal(string $id): ModalInstance
    {
        if (!isset($this->modals[$id])) {
            $this->modals[$id] = new ModalInstance($id);
        }

        return $this->modals[$id];
    }

    /**
     * Show a modal with optional data
     */
    public function show(string $id, array $data = []): void
    {
        $this->modal($id)->show($data);
    }

    /**
     * Close a modal
     */
    public function close(string $id): void
    {
        $this->modal($id)->close();
    }

    /**
     * Close all modals
     */
    public function closeAll(): void
    {
        foreach ($this->modals as $modal) {
            $modal->close();
        }
    }

    /**
     * Check if a modal is open
     */
    public function isOpen(string $id): bool
    {
        return $this->modal($id)->isOpen();
    }

    /**
     * Get all modal instances
     */
    public function getModals(): array
    {
        return $this->modals;
    }

    /**
     * Reset all modals (useful for testing)
     */
    public function reset(): void
    {
        $this->modals = [];
    }
}

class ModalInstance
{
    private string $id;
    private array $data = [];
    private bool $isOpen = false;
    private array $config = [
        'size' => 'md',
        'backdrop' => 'blur',
        'closedby' => 'any',
        'centered' => true,
        'scrollable' => false,
        'animate' => true,
        'lazy' => false,
        'persistent' => false,
        'trapFocus' => true,
    ];
    private ?string $title = null;
    private ?string $message = null;
    private ?string $component = null;
    private ?string $onConfirm = null;
    private ?string $onCancel = null;

    public function __construct(string $id)
    {
        $this->id = $id;
    }

    /**
     * Show the modal
     */
    public function show(array $data = []): self
    {
        $this->data = array_merge($this->data, $data);
        $this->isOpen = true;

        $this->dispatchEvent('openModal', [
            'id' => $this->id,
            'modal' => $this->id,
            'data' => $this->data,
            'config' => $this->config,
        ]);

        return $this;
    }

    /**
     * Close the modal
     */
    public function close(): self
    {
        $this->isOpen = false;

        $this->dispatchEvent('closeModal', [
            'id' => $this->id,
            'modal' => $this->id,
        ]);

        return $this;
    }

    /**
     * Set modal size
     */
    public function size(string $size): self
    {
        $this->config['size'] = $size;
        return $this;
    }

    /**
     * Set modal backdrop
     */
    public function backdrop(string $backdrop): self
    {
        $this->config['backdrop'] = $backdrop;
        return $this;
    }

    /**
     * Set modal title
     */
    public function title(string $title): self
    {
        $this->title = $title;
        $this->data['title'] = $title;
        return $this;
    }

    /**
     * Set modal message
     */
    public function message(string $message): self
    {
        $this->message = $message;
        $this->data['message'] = $message;
        return $this;
    }

    /**
     * Set Livewire component to load
     */
    public function component(string $component, array $parameters = []): self
    {
        $this->component = $component;
        $this->data['component'] = $component;
        $this->data['parameters'] = $parameters;
        return $this;
    }

    /**
     * Set confirm callback
     */
    public function onConfirm(string $method): self
    {
        $this->onConfirm = $method;
        $this->data['onConfirm'] = $method;
        return $this;
    }

    /**
     * Set cancel callback
     */
    public function onCancel(string $method): self
    {
        $this->onCancel = $method;
        $this->data['onCancel'] = $method;
        return $this;
    }

    /**
     * Enable lazy loading
     */
    public function lazy(bool $lazy = true): self
    {
        $this->config['lazy'] = $lazy;
        return $this;
    }

    /**
     * Make modal persistent
     */
    public function persistent(bool $persistent = true): self
    {
        $this->config['persistent'] = $persistent;
        return $this;
    }

    /**
     * Enable/disable scroll
     */
    public function scrollable(bool $scrollable = true): self
    {
        $this->config['scrollable'] = $scrollable;
        return $this;
    }

    /**
     * Enable/disable centering
     */
    public function centered(bool $centered = true): self
    {
        $this->config['centered'] = $centered;
        return $this;
    }

    /**
     * Set close behavior
     */
    public function closedBy(string $closedby): self
    {
        $this->config['closedby'] = $closedby;
        return $this;
    }

    /**
     * Check if modal is open
     */
    public function isOpen(): bool
    {
        return $this->isOpen;
    }

    /**
     * Get modal data
     */
    public function getData(): array
    {
        return $this->data;
    }

    /**
     * Get modal config
     */
    public function getConfig(): array
    {
        return $this->config;
    }

    /**
     * Get modal ID
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * Dispatch Livewire event
     */
    private function dispatchEvent(string $event, array $data): void
    {
        if (function_exists('dispatch')) {
            dispatch($event, $data);
        }
    }

    /**
     * Create a confirmation modal
     */
    public static function confirm(string $id = null): self
    {
        $id = $id ?? 'confirm-' . Str::random(8);
        return ModalManager::getInstance()->modal($id)
            ->size('sm')
            ->title('Confirm Action')
            ->message('Are you sure you want to continue?');
    }

    /**
     * Create an alert modal
     */
    public static function alert(string $id = null): self
    {
        $id = $id ?? 'alert-' . Str::random(8);
        return ModalManager::getInstance()->modal($id)
            ->size('sm')
            ->closedBy('any');
    }

    /**
     * Create a form modal
     */
    public static function form(string $id = null): self
    {
        $id = $id ?? 'form-' . Str::random(8);
        return ModalManager::getInstance()->modal($id)
            ->size('md')
            ->scrollable()
            ->centered();
    }
}