<?php

namespace Keys\UI\Concerns;

use Illuminate\Support\Collection;

/**
 * Trait HandlesValidationErrors
 *
 * Provides comprehensive validation error handling for Keys UI components.
 * Supports multiple error formats: string, array, Collection, MessageBag, ViewErrorBag.
 *
 * This trait eliminates code duplication across form components that need to
 * check for and display validation errors.
 */
trait HandlesValidationErrors
{
    /**
     * Check if validation errors exist.
     *
     * Handles multiple error formats:
     * - String: non-empty trimmed string
     * - Array: non-empty array
     * - Collection: non-empty Illuminate\Support\Collection
     * - MessageBag: Laravel's MessageBag with any() method
     * - ViewErrorBag: Laravel's ViewErrorBag with getBag() method
     *
     * @return bool
     */
    public function hasErrors(): bool
    {
        if (is_null($this->errors)) {
            return false;
        }

        if (is_string($this->errors)) {
            return !empty(trim($this->errors));
        }

        if (is_array($this->errors)) {
            return !empty($this->errors);
        }

        if ($this->errors instanceof Collection) {
            return $this->errors->isNotEmpty();
        }


        if (is_object($this->errors) && method_exists($this->errors, 'any')) {
            return $this->errors->any();
        }


        if (is_object($this->errors) && method_exists($this->errors, 'getBag')) {
            try {
                $bag = $this->errors->getBag('default');
                return $bag && $bag->any();
            } catch (\Exception $e) {

                return false;
            }
        }

        return false;
    }
}