<?php

namespace Keys\UI\Services;

class KeysManager
{
    private static ?self $instance = null;
    private ModalManager $modalManager;
    private ToastManager $toastManager;

    public function __construct()
    {
        $this->modalManager = ModalManager::getInstance();
        $this->toastManager = ToastManager::getInstance();
    }

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
     * Modal methods
     */
    public function modal(string $id = null): \Keys\UI\Services\ModalInstance
    {
        return $this->modalManager->modal($id);
    }

    public function showModal(string $id, array $data = []): void
    {
        $this->modalManager->show($id, $data);
    }

    public function closeModal(string $id): void
    {
        $this->modalManager->close($id);
    }

    public function closeAllModals(): void
    {
        $this->modalManager->closeAll();
    }

    public function isModalOpen(string $id): bool
    {
        return $this->modalManager->isOpen($id);
    }

    public function getModals(): array
    {
        return $this->modalManager->getModals();
    }

    /**
     * Toast methods
     */
    public function toast(string $id = null): \Keys\UI\Services\ToastInstance
    {
        return $this->toastManager->toast($id);
    }

    public function showToast(string $id, array $data = []): void
    {
        $this->toastManager->show($id, $data);
    }

    public function dismissToast(string $id): void
    {
        $this->toastManager->dismiss($id);
    }

    public function dismissAllToasts(): void
    {
        $this->toastManager->dismissAll();
    }

    public function isToastVisible(string $id): bool
    {
        return $this->toastManager->isVisible($id);
    }

    public function getToasts(): array
    {
        return $this->toastManager->getToasts();
    }

    /**
     * Convenience toast methods
     */
    public function success(string $message, string $title = null): \Keys\UI\Services\ToastInstance
    {
        return $this->toastManager->success($message, $title);
    }

    public function error(string $message, string $title = null): \Keys\UI\Services\ToastInstance
    {
        return $this->toastManager->error($message, $title);
    }

    public function warning(string $message, string $title = null): \Keys\UI\Services\ToastInstance
    {
        return $this->toastManager->warning($message, $title);
    }

    public function info(string $message, string $title = null): \Keys\UI\Services\ToastInstance
    {
        return $this->toastManager->info($message, $title);
    }

    /**
     * Reset all managers (useful for testing)
     */
    public function reset(): void
    {
        $this->modalManager->reset();
        $this->toastManager->reset();
    }
}