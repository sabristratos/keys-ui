<?php

namespace Keys\UI\Facades;

use Illuminate\Support\Facades\Facade;
use Keys\UI\Services\KeysManager;

/**
 * @method static \Keys\UI\Services\ModalInstance modal(string $id = null)
 * @method static void showModal(string $id, array $data = [])
 * @method static void closeModal(string $id)
 * @method static void closeAllModals()
 * @method static bool isModalOpen(string $id)
 * @method static array getModals()
 * @method static \Keys\UI\Services\ToastInstance toast(string $id = null)
 * @method static void showToast(string $id, array $data = [])
 * @method static void dismissToast(string $id)
 * @method static void dismissAllToasts()
 * @method static bool isToastVisible(string $id)
 * @method static array getToasts()
 * @method static \Keys\UI\Services\ToastInstance success(string $message, string $title = null)
 * @method static \Keys\UI\Services\ToastInstance error(string $message, string $title = null)
 * @method static \Keys\UI\Services\ToastInstance warning(string $message, string $title = null)
 * @method static \Keys\UI\Services\ToastInstance info(string $message, string $title = null)
 * @method static void reset()
 *
 * @see \Keys\UI\Services\KeysManager
 */
class Keys extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor(): string
    {
        return KeysManager::class;
    }
}