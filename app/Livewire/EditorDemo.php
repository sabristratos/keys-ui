<?php

namespace App\Livewire;

use Livewire\Component;

class EditorDemo extends Component
{
    public $content = '<p>Welcome to the <strong>Keys UI Editor</strong>!</p><p>Try editing this content and see how it updates in real-time below. You can use:</p><ul><li>Bold, italic, and underline formatting</li><li>Headers and lists</li><li>Links and other rich text features</li></ul><p>The content automatically syncs with Livewire!</p>';

    public $title = 'Live Editor Demo';

    public $wordCount = 0;

    public $characterCount = 0;

    public function mount()
    {
        $this->updateStats();
    }

    public function updatedContent()
    {
        $this->updateStats();
    }

    private function updateStats()
    {
        $plainText = strip_tags($this->content);
        $this->characterCount = strlen($plainText);
        $this->wordCount = str_word_count($plainText);
    }

    public function clearContent()
    {
        $this->content = '';
        $this->updateStats();
    }

    public function resetContent()
    {
        $this->content = '<p>Welcome to the <strong>Keys UI Editor</strong>!</p><p>Try editing this content and see how it updates in real-time below. You can use:</p><ul><li>Bold, italic, and underline formatting</li><li>Headers and lists</li><li>Links and other rich text features</li></ul><p>The content automatically syncs with Livewire!</p>';
        $this->updateStats();
    }

    public function submitContent()
    {
        // Manual submit method for testing Livewire integration
        // This will help us debug why automatic sync isn't working
        $this->updateStats();

        // Log the current content for debugging
        \Log::info('Manual submit triggered', [
            'content_length' => strlen($this->content),
            'html_preview' => substr($this->content, 0, 500),
            'plain_text_preview' => substr(strip_tags($this->content), 0, 200),
            'word_count' => $this->wordCount,
            'character_count' => $this->characterCount,
            'has_lists' => str_contains($this->content, '<li>'),
            'has_links' => str_contains($this->content, '<a '),
            'has_formatting' => str_contains($this->content, '<strong>') || str_contains($this->content, '<em>')
        ]);
    }

    public function render()
    {
        return view('livewire.editor-demo');
    }
}