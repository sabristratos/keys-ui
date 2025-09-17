<?php

namespace Keys\UI\Components;

use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Error extends Component
{
    public function __construct(
        public string|array|Collection|null $messages = null,
        public bool $showIcon = true
    ) {}

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

    public function baseClasses(): string
    {
        return 'text-danger text-sm mt-1';
    }

    public function render()
    {
        return view('keys::components.error');
    }
}
