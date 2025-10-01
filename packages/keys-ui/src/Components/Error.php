<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

/**
 * Error Component
 *
 * Displays validation errors and messages with comprehensive features following modern CLAUDE.md patterns.
 *
 * Features:
 * - Supports multiple message formats (string, array, Collection)
 * - Optional icon display for visual feedback
 * - Direct Tailwind utilities in template
 * - Comprehensive data attributes
 * - Accessibility support with ARIA attributes
 * - Business logic only in PHP class
 */
class Error extends Component
{
    /**
     * Create a new Error component instance.
     *
     * @param  string|array|Collection|null  $messages  Error messages to display
     * @param  bool  $showIcon  Whether to show error icon
     * @param  string|null  $id  Custom ID for the error element
     */
    public function __construct(
        public string|array|Collection|null $messages = null,
        public bool $showIcon = true,
        public ?string $id = null
    ) {
        
        $this->id = $this->id ?? 'error-' . uniqid();
    }

    /**
     * Check if there are any error messages to display.
     *
     * @return bool True if error messages exist
     */
    public function hasErrors(): bool
    {
        if (is_null($this->messages)) {
            return false;
        }

        if (is_string($this->messages)) {
            return ! empty(trim($this->messages));
        }

        if (is_array($this->messages)) {
            return ! empty($this->messages);
        }

        if ($this->messages instanceof Collection) {
            return $this->messages->isNotEmpty();
        }

        return false;
    }

    /**
     * Get normalized array of error messages.
     *
     * @return array Normalized error messages
     */
    public function getMessages(): array
    {
        if (is_null($this->messages)) {
            return [];
        }

        if (is_string($this->messages)) {
            return [$this->messages];
        }

        if (is_array($this->messages)) {
            return $this->messages;
        }

        if ($this->messages instanceof Collection) {
            return $this->messages->toArray();
        }

        return [];
    }

    /**
     * Check if there are multiple error messages.
     *
     * @return bool True if more than one message exists
     */
    public function hasMultipleMessages(): bool
    {
        return count($this->getMessages()) > 1;
    }

    /**
     * Generate comprehensive data attributes for error functionality.
     *
     * @return array Complete set of data attributes for error element
     */
    public function getDataAttributes(): array
    {
        $messages = $this->getMessages();

        $attributes = [
            'data-keys-error' => 'true',
            'data-message-count' => (string) count($messages),
        ];

        if ($this->showIcon) {
            $attributes['data-show-icon'] = 'true';
        }

        if ($this->hasMultipleMessages()) {
            $attributes['data-multiple-messages'] = 'true';
        }

        return $attributes;
    }

    /**
     * Render the error component.
     *
     * @return \Illuminate\Contracts\View\View
     */
    public function render()
    {
        return view('keys::components.error', [
            'dataAttributes' => $this->getDataAttributes(),
        ]);
    }
}